/**
 * Get console URLs to create the 5 missing Firestore indexes.
 * Triggers each failing query via Admin SDK — Firestore returns the exact URL.
 */
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
function parseEnv(content) {
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
const env = parseEnv(envContent);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.FIREBASE_ADMIN_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
  }),
});

const db = admin.firestore();

const QUERIES = [
  { name: 'chatSessions [userId + updatedAt]', fn: () => db.collection('chatSessions').where('userId', '==', '__test__').orderBy('updatedAt', 'desc').limit(1).get() },
  { name: 'chatSessions [userId + agentId + updatedAt]', fn: () => db.collection('chatSessions').where('userId', '==', '__test__').where('agentId', '==', '__test__').orderBy('updatedAt', 'desc').limit(1).get() },
  { name: 'prospect_memory [userId + updatedAt]', fn: () => db.collection('prospect_memory').where('userId', '==', '__test__').orderBy('updatedAt', 'desc').limit(1).get() },
  { name: 'workspaces [userId + lastActivityAt]', fn: () => db.collection('workspaces').where('userId', '==', '__test__').orderBy('lastActivityAt', 'desc').limit(1).get() },
  { name: 'deliverables [workspaceId + createdAt]', fn: () => db.collection('deliverables').where('workspaceId', '==', '__test__').orderBy('createdAt', 'desc').limit(1).get() },
];

console.log('Checking 5 missing indexes...\n');

for (const q of QUERIES) {
  try {
    await q.fn();
    console.log(`✅ ${q.name} — index exists or query succeeded`);
  } catch (err) {
    const msg = err.message || '';
    const urlMatch = msg.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
    if (urlMatch) {
      console.log(`🔗 ${q.name}`);
      console.log(`   → ${urlMatch[0]}\n`);
    } else {
      console.log(`❌ ${q.name} — unexpected error: ${msg}\n`);
    }
  }
}
