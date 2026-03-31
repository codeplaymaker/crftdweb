import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
const envVars = {};
const multiLineRegex = /^([A-Z_]+)="([\s\S]*?)"\s*$/gm;
let m;
while ((m = multiLineRegex.exec(raw)) !== null) envVars[m[1]] = m[2];
for (const line of raw.split('\n')) {
  const idx = line.indexOf('=');
  if (idx < 0) continue;
  const key = line.slice(0, idx).trim();
  const val = line.slice(idx + 1).trim();
  if (!val.startsWith('"') && !envVars[key]) envVars[key] = val;
}

const app = initializeApp({
  credential: cert({
    projectId: envVars.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: envVars.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: envVars.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const auth = getAuth(app);
const db = getFirestore(app);

const TEST_EMAIL = 'testrep@crftdweb.com';

let uid;
try {
  const user = await auth.getUserByEmail(TEST_EMAIL);
  uid = user.uid;
  await auth.deleteUser(uid);
  console.log('✓ Deleted Auth user', TEST_EMAIL);
} catch {
  console.log('Auth user not found in Firebase Auth');
}

// Also look up uid from Firestore reps collection in case auth was already deleted
if (!uid) {
  const repSnap = await db.collection('reps').where('email', '==', TEST_EMAIL).get();
  if (!repSnap.empty) {
    uid = repSnap.docs[0].id;
    console.log('✓ Found rep in Firestore with uid', uid);
  }
}

if (uid) {
  await db.collection('reps').doc(uid).delete();
  console.log('✓ Deleted rep doc');

  const leads = await db.collection('repLeads').where('repId', '==', uid).get();
  for (const doc of leads.docs) await doc.ref.delete();
  console.log('✓ Deleted', leads.size, 'leads');

  const comms = await db.collection('repCommissions').where('repId', '==', uid).get();
  for (const doc of comms.docs) await doc.ref.delete();
  console.log('✓ Deleted', comms.size, 'commissions');
}

console.log('\nDone — all test data removed.');
