import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { APPLICANTS } from '@/app/admin/applicants/data';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

// GET /api/admin/applicants — all 18 with merged Firestore status
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('applicants').get();
  const firestoreMap: Record<string, Record<string, unknown>> = {};
  snap.docs.forEach((d) => {
    firestoreMap[d.id] = d.data();
  });

  const merged = APPLICANTS.map((a) => ({
    ...a,
    status: (firestoreMap[a.id]?.status as string) ?? 'pending',
    emailSentAt: (firestoreMap[a.id]?.emailSentAt as string) ?? null,
    bookedAt: (firestoreMap[a.id]?.bookedAt as string) ?? null,
  }));

  return NextResponse.json(merged);
}

// PATCH /api/admin/applicants — update status fields for one applicant
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as { id?: string } & Record<string, unknown>;
  const { id, ...updates } = body;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  await adminDb.collection('applicants').doc(id).set(updates, { merge: true });
  return NextResponse.json({ success: true });
}
