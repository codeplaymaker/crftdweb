import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually — handles multi-line quoted values
const envPath = resolve(process.cwd(), '.env.local');
const raw = readFileSync(envPath, 'utf8');
const envVars = {};
const multiLineRegex = /^([A-Z_]+)="([\s\S]*?)"\s*$/gm;
let m;
while ((m = multiLineRegex.exec(raw)) !== null) {
  envVars[m[1]] = m[2];
}
// also pick up unquoted single-line values
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

const sent = [
  { email: 'shrutiboodhun12@outlook.com', name: 'Shruti Boodhun' },
  { email: 'nicol1@live.co.uk', name: 'Nicol' },
  { email: 'brittany.parker24@gmail.com', name: 'Brittany Parker' },
  { email: 'thlia.xavier@gmail.com', name: 'Thlia Xavier' },
  { email: 'miamesembe@gmail.com', name: 'Mia Msembe' },
  { email: 'trisha160702@gmail.com', name: 'Trisha' },
  { email: 'jamesowain234@gmail.com', name: 'James Owain' },
  { email: 'subby487@gmail.com', name: 'Subby' },
  { email: 'ebaloshabani010@gmail.com', name: 'Ebalo Shabani' },
  { email: 'chief2002@outlook.com', name: 'Chris Cox' },
  { email: 'obiezeelijah@gmail.com', name: 'Obinna Eze Elijah' },
  { email: 'tapiwa.mandaza@outlook.com', name: 'Tapi Mandaza' },
  { email: 'jvw0503007_qwt@indeedemail.com', name: 'John Williams' },
  { email: 'rita98_2020@yahoo.com', name: 'Nieah Mundle' },
  { email: 'kujemath97@gmail.com', name: 'Kujembola Mathew' },
  { email: 'gracie.tamplin@icloud.com', name: 'Gracie Tamplin' },
];

const col = db.collection('trial_tasks_sent');

// Check existing docs to avoid duplicates
const existing = await col.get();
const alreadyLogged = new Set(existing.docs.map(d => d.data().email));

let added = 0;
for (const entry of sent) {
  if (alreadyLogged.has(entry.email)) {
    console.log(`  skip (exists): ${entry.email}`);
    continue;
  }
  await col.add({ ...entry, sentAt: new Date() });
  console.log(`  added: ${entry.email}`);
  added++;
}

console.log(`\nDone — ${added} records added, ${sent.length - added} already existed.`);
process.exit(0);
