/**
 * One-time migration: seed hardcoded applicants into Firestore.
 * Run: node scripts/migrate-applicants-to-firestore.mjs
 *
 * Uses { merge: true } so existing status/activity data is preserved.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local (same parser as other scripts)
const envPath = resolve(process.cwd(), '.env.local');
const raw = readFileSync(envPath, 'utf8');
const env = {};
const multiLineRegex = /^([A-Z_]+)="([\s\S]*?)"\s*$/gm;
let m;
while ((m = multiLineRegex.exec(raw)) !== null) {
  env[m[1]] = m[2];
}
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

const APPLICANTS = [
  {
    id: 'daniel-nawrocki',
    name: 'Daniel Nawrocki',
    email: 'daniel.nawrocki1@gmail.com',
    phone: '07762 388127',
    location: '',
    rating: 5,
    verdict: 'booking',
    salesSignals: '9+ yrs B2B SaaS. Saviynt (EMEA $3M pipeline), OpenText ($4.1M pipeline, 3× Top Performer, 68% meeting-to-opp rate), WarringtonFire (130% of target). SPIN/MEDDIC/Miller Heiman trained.',
    education: 'A-Levels',
    keyStrength: 'Proven closer, enterprise accounts',
    indeedEmail: false,
    notes: 'Very senior — may want BD/closer role rather than pure rep. Worth direct conversation about scope.',
  },
  {
    id: 'robert-clare',
    name: 'Robert Clare',
    email: 'robertclare979@gmail.com',
    phone: '07902 011960',
    location: 'Nottingham',
    rating: 5,
    verdict: 'booking',
    salesSignals: '7+ yrs B2B. TET (high-value IT/comms closing), XMA (£1M+ monthly accounts, Metropolitan Police/councils), BT Business Account Manager (SME/enterprise renewals & upsells). Career break since Dec 2024.',
    education: 'GCSEs',
    keyStrength: 'Proven closer, high-value accounts, wants remote role',
    indeedEmail: false,
  },
  {
    id: 'jasdeep-gill',
    name: 'Jasdeep Gill',
    email: 'jgillonline@gmail.com',
    phone: '07403 983923',
    location: 'Heston',
    rating: 4,
    verdict: 'booking',
    salesSignals: 'BizDev Executive Lura Care (new business, pipeline, contracts), Senior Sales Negotiator RPS Estates (prospecting, valuations, completions), Senior Marketing Exec iProspect/Dentsu (18 international markets for NEXT).',
    education: 'A-Levels IT/PE/Science',
    keyStrength: 'Strong commercial track record across multiple sectors',
    indeedEmail: false,
  },
  {
    id: 'kelly-hughes',
    name: 'Kelly Hughes',
    email: 'kellyhughes564_cmx@indeedemail.com',
    phone: '+44 7493 004400',
    location: 'Flintshire CH6',
    rating: 4,
    verdict: 'booking',
    salesSignals: 'Telesales Advisor Hops & Barley 2yr (inbound/outbound, KPIs exceeded, CRM), Telesales Advisor Weddings Chester 1yr (15+ sales/week, 3+ daily), Screwfix upselling.',
    education: 'GCSEs English/Maths. HubSpot Academy certified.',
    keyStrength: 'Consistent weekly sales numbers, objection handling, CRM experience',
    indeedEmail: true,
  },
  {
    id: 'vincent-murphy',
    name: 'Vincent Murphy',
    email: 'vinmurphy31@hotmail.com',
    phone: '07783 455927',
    location: 'Swindon',
    rating: 4,
    verdict: 'booking',
    salesSignals: 'Sales Rep EZ Living Furniture remote (Salesforce CRM, exceeded monthly targets, cold calling, B2B), Customer Support Apple Ireland 2yr, Quality Specialist ThermoFisher.',
    education: 'Masters NUI Galway, BA Business/Geography NUI Galway. HubSpot Inbound Sales cert 2025.',
    keyStrength: 'Degree-level, CRM-experienced, proven remote sales',
    indeedEmail: false,
  },
  {
    id: 'william-stewart',
    name: 'William Stewart',
    email: 'williamstewartgi9iv_99s@indeedemail.com',
    phone: '+44 7826 525975',
    location: 'Dundee',
    rating: 4,
    verdict: 'booking',
    salesSignals: 'Senior Energy Advisor ScottishPower door-to-door (exceeded KPIs, weekly signups, trained new staff), Holiday Lettings Manager (objection handling, repeat stays increased), Client Advisor Social Security Scotland.',
    education: 'Business Management BA University of Dundee',
    keyStrength: 'KPI exceeder, self-driven, degree-level',
    indeedEmail: true,
  },
  {
    id: 'anjalee-mungroo',
    name: 'Anjalee Mungroo',
    email: 'anjmungroo@gmail.com',
    phone: '',
    location: '',
    rating: 3,
    verdict: 'booking',
    salesSignals: 'B2B marketing at Oxford Uni event, exceeded daily sales targets, website management (WordPress, Shopify, Google Ads), brand ambassador Bumble (surpassed target), built landing page/purchase system.',
    education: 'BA English Lit 2:1 RHUL',
    keyStrength: 'Digital + sales combo, self-starter',
    indeedEmail: false,
  },
  {
    id: 'john-williams',
    name: 'John Williams',
    email: 'jvw0503007_qwt@indeedemail.com',
    phone: '+44 7582 569538',
    location: 'Bristol BS31',
    rating: 3,
    verdict: 'booking',
    salesSignals: 'Self-managed freelancer, social media management, AI workflow experience, targeting remote Lead Generation. Objection handling listed as skill. Rock climbing instructor (membership/coaching sales).',
    education: 'A-Levels',
    keyStrength: 'Self-managed, disciplined, genuine hunger',
    indeedEmail: true,
  },
  {
    id: 'frankie-fewell',
    name: 'Frankie Fewell',
    email: 'Frankiefewell04@gmail.com',
    phone: '',
    location: 'Blackmore, Essex CM4',
    rating: 3,
    verdict: 'booking',
    salesSignals: 'Telesales Advisor Eco Wise Renewables 4 years — outbound/inbound, met and exceeded targets, objection handling, product knowledge.',
    education: 'Business Marketing (college), GCSEs 5/5 English/Maths',
    keyStrength: 'Consistent telesales track record',
    indeedEmail: false,
  },
  {
    id: 'lauren-ashcroft',
    name: 'Lauren Ashcroft',
    email: 'Laurenashcroft38@gmail.com',
    phone: '07340 899164',
    location: 'Warrington WA4',
    rating: 2,
    verdict: 'booking',
    salesSignals: 'Account Development Agent Link Mailing Systems (outbound calls, met targets, high call volume), River Island sales.',
    education: 'GCSEs grade C',
    keyStrength: 'Customer-facing, phone experience',
    indeedEmail: false,
  },
  {
    id: 'blagovesta-dimitrova',
    name: 'Blagovesta Dimitrova',
    email: 'dimitrovavesta991@gmail.com',
    phone: '07514 174634',
    location: 'Guildford',
    rating: 2,
    verdict: 'booking',
    salesSignals: 'Student Recruitment Global Edu Care (outreach strategies, data tracking, proactive communication with prospects). Baker McKenzie internship (legal research).',
    education: 'A-Levels Business, Marketing, Accounting, International Business',
    keyStrength: 'Outreach experience, multilingual (English + Bulgarian)',
    indeedEmail: false,
  },
  {
    id: 'trisha-sultana',
    name: 'Trisha Tahmina Sultana',
    email: 'trisha160702@gmail.com',
    phone: '+44 07385890893',
    location: 'Leeds area',
    rating: 2,
    verdict: 'booking',
    salesSignals: 'Salesperson Namaste Bengal (Oct 2025–Mar 2026), Sales Rep Islam Traders (5 yrs, 30–50 interactions/day), Student Ambassador Leeds Beckett.',
    education: 'BSc Computer Science Leeds Beckett (current)',
    keyStrength: 'High-volume daily sales, tech-literate, hungry',
    indeedEmail: false,
  },
  {
    id: 'chinwendu-okonkwo',
    name: 'Chinwendu Okonkwo',
    email: 'vivianachonwa95@gmail.com',
    phone: '+447502220804',
    location: 'Wolverhampton',
    rating: 2,
    verdict: 'booking',
    salesSignals: 'Sales Exec, Brand Ambassador, Fundraising Rep (Rotary). Most experience appears self-employed/family businesses.',
    education: 'OND Environmental Health Science, Computer Science, Customer Services',
    keyStrength: 'Range of sales titles — worth verifying via trial',
    indeedEmail: false,
    notes: 'CV has repetitive bullets across roles — trial task to verify actual ability.',
  },
  {
    id: 'sharon-underwood',
    name: 'Sharon Underwood',
    email: 'sharonunderwood84mfw_j4o@indeedemail.com',
    phone: '+44 7805 908548',
    location: 'Ladykirk TD15',
    rating: 1,
    verdict: 'booking',
    salesSignals: 'Tesco till, admin assistant, office admin. "Sales" mentioned only in skills list.',
    education: 'Diploma of Higher Education',
    keyStrength: '',
    indeedEmail: true,
    notes: 'Remote Scottish Borders location; no direct outbound sales experience.',
  },
  {
    id: 'ian-rollinson',
    name: 'Ian Rollinson',
    email: 'ian.rollinson94@googlemail.com',
    phone: '+44 7415 351427',
    location: 'Wakefield WF1',
    rating: 1,
    verdict: 'booking',
    salesSignals: '20+ yrs Morrisons customer service desk. Salesforce experience only for loyalty cards. No outbound sales.',
    education: 'Certificate of Higher Education IT/Business',
    keyStrength: '',
    indeedEmail: false,
    notes: 'Single employer 20 years, no evidence of proactive selling.',
  },
  {
    id: 'mia-mesembe',
    name: 'Mia Mesembe',
    email: 'Miamesembe@gmail.com',
    phone: '+44 7803 854992',
    location: 'Leeds',
    rating: 1,
    verdict: 'booking',
    salesSignals: 'John Lewis partner (retail floor), receptionist, business assistant. Operations focus throughout.',
    education: "BA Hons Contemporary Dance (enrolled), King's Trust Business Programme",
    keyStrength: '',
    indeedEmail: false,
    notes: 'No cold outreach or direct sales experience.',
  },
  {
    id: 'shahryar-chaudhry',
    name: 'Shahryar Chaudhry',
    email: 'shahryar030@gmail.com',
    phone: '+44 7920 702984',
    location: 'London NW2',
    rating: 1,
    verdict: 'booking',
    salesSignals: 'Executive Director family car dealership + real estate developer in Pakistan. Marketing, SaaS integration, social media growth.',
    education: 'BSc Financial Economics Westminster (current). A-Levels Business/Accounting/Economics (A grades).',
    keyStrength: '',
    indeedEmail: false,
    notes: 'International student — likely visa right-to-work restriction. Experience is overseas/family business.',
  },
  {
    id: 'claire-beer',
    name: 'Claire Beer',
    email: 'clairebeer987@gmail.com',
    phone: '',
    location: '',
    rating: 3,
    verdict: 'booking',
    salesSignals: 'Outbound calling: PPI, debt collection, B2B. Currently self-employed commission-only network marketing. Hits targets, self-motivated.',
    education: 'Not provided',
    keyStrength: 'Commission-only mindset, used to rejection, flexible remote worker',
    indeedEmail: false,
    notes: 'No surname or contact details provided — needs follow-up to get email/phone before sending booking link.',
  },
  {
    id: 'tayyub-awan',
    name: 'Tayyub Awan',
    email: 'tayyubawan123890@gmail.com',
    phone: '07311 189680',
    location: 'Slough SL2',
    rating: 1,
    verdict: 'booking',
    salesSignals: 'Security guard (current), 1-day volunteer cashier, 1-month Legoland sales associate, 1-month door-to-door Modern Milkman.',
    education: 'A-Levels Economics, BTEC Science, BTEC Business',
    keyStrength: '',
    indeedEmail: false,
    notes: 'Very early career, no sustained sales experience.',
  },
];

async function migrate() {
  const batch = db.batch();
  let count = 0;

  for (const a of APPLICANTS) {
    const { id, ...data } = a;
    const ref = db.collection('applicants').doc(id);
    batch.set(ref, data, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✅ Migrated ${count} applicants to Firestore (merge mode — existing status/activity preserved)`);
}

migrate().catch(console.error);

