import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token === process.env.ADMIN_TOKEN;
}

// POST — create a new admin call session
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { leadName, businessType, callGoal } = await request.json();

  const ref = adminDb.collection('repCallSessions').doc();
  await ref.set({
    id: ref.id,
    repId: 'admin',
    leadName: leadName || 'Prospect',
    businessType: businessType || '',
    callGoal: callGoal || 'Book a discovery call',
    status: 'in_progress',
    transcript: [],
    duration: 0,
    notes: '',
    outcome: null,
    summary: null,
    startedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return NextResponse.json({ id: ref.id });
}

// PATCH — append a transcript entry
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { sessionId, entry } = await request.json();
  if (!sessionId || !entry) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  await adminDb.collection('repCallSessions').doc(sessionId).update({
    transcript: FieldValue.arrayUnion(entry),
    updatedAt: Timestamp.now(),
  });

  return NextResponse.json({ ok: true });
}

// PUT — complete the session with summary
export async function PUT(request: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const { sessionId, summary, duration, outcome, notes } = await request.json();
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  await adminDb.collection('repCallSessions').doc(sessionId).update({
    status: 'completed',
    summary,
    duration,
    outcome,
    notes: notes || '',
    endedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return NextResponse.json({ ok: true });
}
