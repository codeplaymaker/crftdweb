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

initializeApp({
  credential: cert({
    projectId: envVars.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: envVars.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: envVars.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

// ─── Applicant data (mirrors src/app/admin/applicants/data.ts) ──────────────

const APPLICANTS = [
  { id: 'daniel-nawrocki',    name: 'Daniel Nawrocki',           email: 'daniel.nawrocki1@gmail.com',                  verdict: 'booking', rating: 5 },
  { id: 'robert-clare',       name: 'Robert Clare',              email: 'robertclare979@gmail.com',                    verdict: 'booking', rating: 5 },
  { id: 'jasdeep-gill',       name: 'Jasdeep Gill',              email: 'jgillonline@gmail.com',                       verdict: 'booking', rating: 4 },
  { id: 'kelly-hughes',       name: 'Kelly Hughes',              email: 'kellyhughes564_cmx@indeedemail.com',           verdict: 'booking', rating: 4 },
  { id: 'vincent-murphy',     name: 'Vincent Murphy',            email: 'vinmurphy31@hotmail.com',                     verdict: 'booking', rating: 4 },
  { id: 'william-stewart',    name: 'William Stewart',           email: 'williamstewartgi9iv_99s@indeedemail.com',      verdict: 'booking', rating: 4 },
  { id: 'anjalee-mungroo',    name: 'Anjalee Mungroo',           email: 'anjmungroo@gmail.com',                        verdict: 'booking', rating: 3 },
  { id: 'john-williams',      name: 'John Williams',             email: 'jvw0503007_qwt@indeedemail.com',              verdict: 'booking', rating: 3 },
  { id: 'frankie-fewell',     name: 'Frankie Fewell',            email: 'Frankiefewell04@gmail.com',                   verdict: 'trial',   rating: 3 },
  { id: 'lauren-ashcroft',    name: 'Lauren Ashcroft',           email: 'Laurenashcroft38@gmail.com',                  verdict: 'trial',   rating: 2 },
  { id: 'blagovesta-dimitrova', name: 'Blagovesta Dimitrova',    email: 'dimitrovavesta991@gmail.com',                 verdict: 'trial',   rating: 2 },
  { id: 'trisha-sultana',     name: 'Trisha Tahmina Sultana',    email: 'trisha160702@gmail.com',                      verdict: 'trial',   rating: 2 },
  { id: 'chinwendu-okonkwo',  name: 'Chinwendu Okonkwo',         email: 'vivianachonwa95@gmail.com',                   verdict: 'trial',   rating: 2 },
  { id: 'sharon-underwood',   name: 'Sharon Underwood',          email: 'sharonunderwood84mfw_j4o@indeedemail.com',    verdict: 'decline', rating: 1 },
  { id: 'ian-rollinson',      name: 'Ian Rollinson',             email: 'ian.rollinson94@googlemail.com',              verdict: 'decline', rating: 1 },
  { id: 'mia-mesembe',        name: 'Mia Mesembe',               email: 'Miamesembe@gmail.com',                        verdict: 'decline', rating: 1 },
  { id: 'shahryar-chaudhry',  name: 'Shahryar Chaudhry',         email: 'shahryar030@gmail.com',                       verdict: 'decline', rating: 1 },
  { id: 'tayyub-awan',        name: 'Tayyub Awan',               email: 'tayyubawan123890@gmail.com',                  verdict: 'decline', rating: 1 },
];

async function run() {
  const now = new Date().toISOString();
  let created = 0;
  let skipped = 0;

  for (const applicant of APPLICANTS) {
    const ref = db.collection('applicants').doc(applicant.id);
    const existing = await ref.get();

    if (existing.exists) {
      console.log(`  skip  ${applicant.name} (already exists)`);
      skipped++;
      continue;
    }

    await ref.set({
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      verdict: applicant.verdict,
      rating: applicant.rating,
      status: 'pending',
      emailSentAt: null,
      bookedAt: null,
      createdAt: now,
    });

    console.log(`  ✓  ${applicant.name}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}  Skipped: ${skipped}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
