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

const applicant = {
  name: 'Jeannette Goauder',
  email: 'jeannettegoaudercxcgd_mpq@indeedemail.com',
  phone: '+44 7304 179437',
  location: 'Hythe, Kent CT21 5BJ',
  rating: 4,
  verdict: 'booking',
  salesSignals: 'CEO/Owner of multiple LTD companies, stockbroker background (Bear Sterns), PR management agency owner, Business Management degree',
  education: 'BA (Hons) Business Management — Bedfordshire College 1996–1999',
  keyStrength: 'Business ownership & management experience',
  indeedEmail: true,
  notes: 'Call completed. Multiple company owner (GOAUDER-ART-LIMITED, rebranded from Mondaria Ltd, managing 8 merged LTDs). Previously International Banking/Stockbroker 2018–2019.',
  status: 'screened',
  emailSentAt: null,
  bookedAt: null,
  activityLog: [],
  createdAt: new Date().toISOString(),
  source: 'indeed',
};

await db.collection('applicants').doc('jeannette-goauder').set(applicant, { merge: true });
console.log('Done — added Jeannette Goauder (screened)');
process.exit(0);
