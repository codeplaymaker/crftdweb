import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
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

const auth = getAuth(app);
const db = getFirestore(app);

const TEST_EMAIL = 'testrep@crftdweb.com';
const TEST_PASSWORD = 'TestRep123!';
const TEST_NAME = 'Jamie Test';

async function run() {
  // Delete existing test user if present
  try {
    const existing = await auth.getUserByEmail(TEST_EMAIL);
    await auth.deleteUser(existing.uid);
    console.log('Deleted existing test rep user');
  } catch {
    // doesn't exist yet, fine
  }

  // Create Firebase Auth user
  const user = await auth.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    displayName: TEST_NAME,
  });

  // Create rep profile
  await db.collection('reps').doc(user.uid).set({
    uid: user.uid,
    name: TEST_NAME,
    email: TEST_EMAIL,
    phone: '07700 000000',
    status: 'active',
    tier: 'rep',
    careerRank: 'silver',
    commissionRate: 0,
    notes: 'Test rep account — delete after review',
    joinedAt: FieldValue.serverTimestamp(),
  });

  // Seed a few dummy leads
  const leadStatuses = ['contacted', 'interested', 'call_booked', 'proposal_sent', 'won'];
  const leads = [
    { businessName: 'Apex Plumbing Ltd', contactName: 'Mark Hayes', contactEmail: 'mark@apexplumbing.co.uk', contactPhone: '07711 111111', source: 'cold_call', status: 'interested', dealValue: 0, notes: 'Said website is outdated. Callback Friday.' },
    { businessName: 'The Bread Collective', contactName: 'Sarah Okonkwo', contactEmail: 'sarah@breadco.com', contactPhone: '07722 222222', source: 'linkedin', status: 'call_booked', dealValue: 0, notes: 'Call booked for Monday 2pm.' },
    { businessName: 'Peak Fitness Studio', contactName: 'Dan Watts', contactEmail: 'dan@peakfitness.co.uk', contactPhone: '07733 333333', source: 'cold_call', status: 'proposal_sent', dealValue: 3200, notes: 'Sent proposal for business website. Waiting on decision.' },
    { businessName: 'Bright Minds Tutoring', contactName: 'Priya Shah', contactEmail: 'priya@brightminds.co.uk', contactPhone: '', source: 'referral', status: 'won', dealValue: 1800, notes: 'Signed off. Deposit paid.' },
    { businessName: 'Cargo Coffee Roasters', contactName: 'Tom Elliot', contactEmail: '', contactPhone: '07755 555555', source: 'cold_call', status: 'contacted', dealValue: 0, notes: '' },
  ];

  for (const lead of leads) {
    const ref = db.collection('repLeads').doc();
    await ref.set({
      id: ref.id,
      repId: user.uid,
      repName: TEST_NAME,
      ...lead,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  // Seed a commission for the won deal
  const commRef = db.collection('repCommissions').doc();
  await commRef.set({
    id: commRef.id,
    repId: user.uid,
    repName: TEST_NAME,
    leadId: 'seeded',
    businessName: 'Bright Minds Tutoring',
    dealValue: 1800,
    commissionAmount: 270,
    status: 'pending',
    createdAt: FieldValue.serverTimestamp(),
    paidAt: null,
  });

  console.log('\n✅ Test rep created\n');
  console.log(`   Email:    ${TEST_EMAIL}`);
  console.log(`   Password: ${TEST_PASSWORD}`);
  console.log(`   Portal:   http://localhost:3000/rep/signin`);
  console.log('\n   Seeded: 5 leads, 1 pending commission (£270)\n');
}

run().catch(console.error);
