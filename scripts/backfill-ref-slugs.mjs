import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
const raw = readFileSync(envPath, 'utf8');
const envVars = {};
const multiLineRegex = /^([A-Z_]+)="([\s\S]*?)"\s*$/gm;
let m;
while ((m = multiLineRegex.exec(raw)) !== null) {
  envVars[m[1]] = m[2];
}
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
const db = getFirestore(app);

const reps = await db.collection('reps').get();
for (const doc of reps.docs) {
  const data = doc.data();
  if (!data.refSlug) {
    const firstName = data.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    let slug = firstName;
    const existing = await db.collection('reps').where('refSlug', '==', slug).get();
    if (!existing.empty) {
      let c = 2;
      while (!(await db.collection('reps').where('refSlug', '==', `${firstName}${c}`).get()).empty) c++;
      slug = `${firstName}${c}`;
    }
    await doc.ref.update({ refSlug: slug });
    console.log(`Updated ${data.name} -> ${slug}`);
  } else {
    console.log(`Already has slug: ${data.name} -> ${data.refSlug}`);
  }
}
console.log('Done.');
