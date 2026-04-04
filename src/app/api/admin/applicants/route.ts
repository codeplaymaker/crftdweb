import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { APPLICANTS } from '@/app/admin/applicants/data';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

// GET /api/admin/applicants — hardcoded + Firestore-only applicants merged
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('applicants').get();
  const firestoreMap: Record<string, Record<string, unknown>> = {};
  const firestoreOnlyApplicants: Record<string, unknown>[] = [];
  const hardcodedIds = new Set(APPLICANTS.map((a) => a.id));

  snap.docs.forEach((d) => {
    const data = d.data();
    if (hardcodedIds.has(d.id)) {
      firestoreMap[d.id] = data;
    } else {
      // Fully Firestore-backed applicant (manually added)
      firestoreOnlyApplicants.push({ id: d.id, ...data });
    }
  });

  const merged = APPLICANTS.map((a) => ({
    ...a,
    status: (firestoreMap[a.id]?.status as string) ?? 'pending',
    emailSentAt: (firestoreMap[a.id]?.emailSentAt as string) ?? null,
    bookedAt: (firestoreMap[a.id]?.bookedAt as string) ?? null,
    activityLog: (firestoreMap[a.id]?.activityLog as unknown[]) ?? [],
  }));

  // Append Firestore-only applicants with defaults
  for (const fa of firestoreOnlyApplicants) {
    merged.push({
      id: fa.id as string,
      name: (fa.name as string) ?? '',
      email: (fa.email as string) ?? '',
      phone: (fa.phone as string) ?? '',
      location: (fa.location as string) ?? '',
      rating: (fa.rating as number) ?? 3,
      verdict: (fa.verdict as 'booking' | 'trial' | 'decline') ?? 'booking',
      salesSignals: (fa.salesSignals as string) ?? '',
      education: (fa.education as string) ?? '',
      keyStrength: (fa.keyStrength as string) ?? '',
      indeedEmail: (fa.indeedEmail as boolean) ?? false,
      notes: (fa.notes as string) ?? '',
      status: (fa.status as string) ?? 'pending',
      emailSentAt: (fa.emailSentAt as string) ?? null,
      bookedAt: (fa.bookedAt as string) ?? null,
      activityLog: (fa.activityLog as unknown[]) ?? [],
    });
  }

  return NextResponse.json(merged);
}

// POST /api/admin/applicants — create a new applicant in Firestore
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as Record<string, unknown>;
  const name = (body.name as string)?.trim();
  const email = (body.email as string)?.trim();
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const applicant = {
    name,
    email,
    phone: (body.phone as string)?.trim() ?? '',
    location: (body.location as string)?.trim() ?? '',
    rating: typeof body.rating === 'number' ? body.rating : 3,
    verdict: ['booking', 'trial', 'decline'].includes(body.verdict as string) ? body.verdict : 'booking',
    salesSignals: (body.salesSignals as string)?.trim() ?? '',
    education: (body.education as string)?.trim() ?? '',
    keyStrength: (body.keyStrength as string)?.trim() ?? '',
    indeedEmail: body.indeedEmail === true,
    notes: (body.notes as string)?.trim() ?? '',
    status: 'pending',
    emailSentAt: null,
    bookedAt: null,
    activityLog: [],
    createdAt: new Date().toISOString(),
  };

  await adminDb.collection('applicants').doc(id).set(applicant);
  return NextResponse.json({ success: true, id, applicant: { id, ...applicant } });
}

// PATCH /api/admin/applicants — update status fields or add activity log entry
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as { id?: string; activityEntry?: { text: string } } & Record<string, unknown>;
  const { id, activityEntry, ...updates } = body;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // If adding an activity log entry, append to array
  if (activityEntry && typeof activityEntry.text === 'string' && activityEntry.text.trim()) {
    const docRef = adminDb.collection('applicants').doc(id);
    const doc = await docRef.get();
    const existing = doc.exists ? (doc.data()?.activityLog ?? []) : [];
    const entry = {
      text: activityEntry.text.trim(),
      timestamp: new Date().toISOString(),
    };
    await docRef.set({ activityLog: [...existing, entry] }, { merge: true });
    return NextResponse.json({ success: true, entry });
  }

  await adminDb.collection('applicants').doc(id).set(updates, { merge: true });
  return NextResponse.json({ success: true });
}
