/**
 * Deploys Firestore security rules using the service account already in .env.local
 * Uses Firebase Security Rules REST API v1
 */
import { readFileSync } from 'fs';
import { createSign } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ────────────────────────────────────────────────────────
const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');

function parseEnv(content) {
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    // Handle multiline private key
    vars[key] = value.replace(/\\n/g, '\n');
  }
  return vars;
}

// Handle multiline private key spanning multiple lines
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
    // Handle quoted multiline values
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

const clientEmail = env['FIREBASE_ADMIN_CLIENT_EMAIL'];
const privateKey = env['FIREBASE_ADMIN_PRIVATE_KEY'];
const projectId = env['FIREBASE_ADMIN_PROJECT_ID'] || env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];

if (!clientEmail || !privateKey || !projectId) {
  console.error('Missing required env vars: FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_PROJECT_ID');
  process.exit(1);
}

console.log(`Project: ${projectId}`);
console.log(`Service account: ${clientEmail}`);

// ── Create JWT for Google OAuth2 ──────────────────────────────────────────
function base64url(buffer) {
  return Buffer.from(buffer).toString('base64')
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

// ── Exchange JWT for access token ─────────────────────────────────────────
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
  const data = await res.json();
  if (!data.access_token) {
    console.error('Token error:', JSON.stringify(data));
    process.exit(1);
  }
  return data.access_token;
}

// ── Read rules file ───────────────────────────────────────────────────────
const rulesSource = readFileSync(join(__dirname, '../firestore.rules'), 'utf8');
console.log('\nRules to deploy:');
console.log(rulesSource);

// ── Deploy via Firebase Rules REST API ───────────────────────────────────
async function deployRules(token) {
  // Step 1: Create a new ruleset
  const createRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          files: [{
            name: 'firestore.rules',
            content: rulesSource,
          }],
        },
      }),
    }
  );

  const createData = await createRes.json();
  if (!createRes.ok) {
    console.error('Failed to create ruleset:', JSON.stringify(createData, null, 2));
    process.exit(1);
  }

  const rulesetName = createData.name;
  console.log(`\nCreated ruleset: ${rulesetName}`);

  // Step 2: Patch the release to point to the new ruleset
  const patchRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        release: {
          name: `projects/${projectId}/releases/cloud.firestore`,
          rulesetName,
        },
      }),
    }
  );

  const patchData = await patchRes.json();
  if (!patchRes.ok) {
    console.error('Failed to update release:', JSON.stringify(patchData, null, 2));
    process.exit(1);
  }

  console.log('\n✅ Firestore rules deployed successfully!');
  console.log(`Release: ${patchData.name}`);
  console.log(`Ruleset: ${patchData.rulesetName}`);
}

try {
  console.log('\nGetting access token...');
  const token = await getAccessToken();
  console.log('Access token obtained.');
  await deployRules(token);
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
