import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
const env = {};
const multiLine = /^([A-Z_]+)="([\s\S]*?)"\s*$/gm;
let m;
while ((m = multiLine.exec(raw)) !== null) env[m[1]] = m[2];
for (const line of raw.split('\n')) {
  const idx = line.indexOf('=');
  if (idx < 0) continue;
  const key = line.slice(0, idx).trim();
  const val = line.slice(idx + 1).trim();
  if (!val.startsWith('"') && !env[key]) env[key] = val;
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
const snap = await db.collection('reps').get();

if (snap.empty) {
  console.log('No rep documents found in Firestore.');
} else {
  console.log(`Found ${snap.size} rep(s):\n`);
  snap.forEach(doc => {
    const d = doc.data();
    console.log(`UID: ${doc.id}`);
    console.log(`  Name:   ${d.name}`);
    console.log(`  Email:  ${d.email}`);
    console.log(`  Status: ${d.status}`);
    console.log('');
  });
}

process.exit(0);
