#!/usr/bin/env node
/**
 * Deploy Firestore indexes using service account credentials (no Firebase CLI needed).
 * Uses the Firestore REST API to create/ensure all composite indexes exist.
 *
 * Usage: node scripts/deploy-firestore-indexes.mjs
 */

import { readFileSync } from 'fs';
import { createSign } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local (handles multiline private key) ──────────────────────────
const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');

function parseEnvMultiline(content) {
  const vars = {};
  const lines = content.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) { i++; continue; }
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) { i++; continue; }
    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();
    if (value.startsWith('"')) {
      let full = value.slice(1);
      while (!full.endsWith('"') && i + 1 < lines.length) {
        i++;
        full += '\n' + lines[i];
      }
      if (full.endsWith('"')) full = full.slice(0, -1);
      vars[key] = full.replace(/\\n/g, '\n');
    } else {
      vars[key] = value.replace(/\\n/g, '\n');
    }
    i++;
  }
  return vars;
}

const env = parseEnvMultiline(envContent);

const projectId = env['FIREBASE_ADMIN_PROJECT_ID'] || env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
const clientEmail = env['FIREBASE_ADMIN_CLIENT_EMAIL'];
const privateKey = env['FIREBASE_ADMIN_PRIVATE_KEY'];

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_ADMIN_* credentials in .env.local');
  process.exit(1);
}

console.log(`Project: ${projectId}`);
console.log(`Service account: ${clientEmail}\n`);

// ── JWT + OAuth2 ─────────────────────────────────────────────────────────────
function base64url(buffer) {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function makeJWT() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    sub: clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signing = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signing);
  const sig = base64url(sign.sign(privateKey));
  return `${signing}.${sig}`;
}

async function getAccessToken() {
  const jwt = makeJWT();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token fetch failed: ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}

// ── Fetch existing indexes ───────────────────────────────────────────────────
async function getExistingIndexes(token, collectionId) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/collectionGroups/${collectionId}/indexes`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.indexes || [];
}

function indexKey(fields) {
  return fields.map(f => `${f.fieldPath}:${f.order}`).join('|');
}

function indexesMatch(existing, desired) {
  if (!existing.fields) return false;
  const existingFields = existing.fields.filter(f => f.fieldPath !== '__name__');
  if (existingFields.length !== desired.fields.length) return false;
  return indexKey(existingFields) === indexKey(desired.fields);
}

// ── Create an index ──────────────────────────────────────────────────────────
async function createIndex(token, index) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/collectionGroups/${index.collectionGroup}/indexes`;
  const body = {
    queryScope: index.queryScope,
    fields: index.fields,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    // 409 = already exists
    if (res.status === 409) return 'exists';
    throw new Error(`Failed to create index on ${index.collectionGroup}: ${err}`);
  }
  const data = await res.json();
  return data.name;
}

// ── Main ─────────────────────────────────────────────────────────────────────
const indexesPath = join(__dirname, '..', 'firestore.indexes.json');
const { indexes } = JSON.parse(readFileSync(indexesPath, 'utf8'));

console.log(`Found ${indexes.length} composite indexes to ensure.\n`);

const token = await getAccessToken();
console.log('Access token obtained.\n');

let created = 0;
let skipped = 0;
let errors = 0;

for (const index of indexes) {
  const fieldDesc = index.fields.map(f => `${f.fieldPath} ${f.order}`).join(', ');
  const label = `${index.collectionGroup} [${fieldDesc}]`;

  try {
    const existing = await getExistingIndexes(token, index.collectionGroup);
    const alreadyExists = existing.some(e => indexesMatch(e, index) && e.state !== 'CREATING');

    if (alreadyExists) {
      console.log(`  ✓ Already exists: ${label}`);
      skipped++;
      continue;
    }

    const result = await createIndex(token, index);
    if (result === 'exists') {
      console.log(`  ✓ Already exists: ${label}`);
      skipped++;
    } else {
      console.log(`  + Creating: ${label}`);
      created++;
    }
  } catch (e) {
    console.error(`  ✗ Error on ${label}: ${e.message}`);
    errors++;
  }
}

console.log(`\n─────────────────────────────────────────────`);
console.log(`✅ Done — ${created} created, ${skipped} already existed, ${errors} errors`);
if (created > 0) {
  console.log(`\n⏳ Indexes are building in the background (usually 1–5 min).`);
  console.log(`   Check status: https://console.firebase.google.com/project/${projectId}/firestore/indexes`);
}
