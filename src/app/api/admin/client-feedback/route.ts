import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clientId = req.nextUrl.searchParams.get('clientId');
  const q = clientId
    ? adminDb.collection('clientFeedback').where('clientId', '==', clientId).orderBy('submittedAt', 'desc')
    : adminDb.collection('clientFeedback').orderBy('submittedAt', 'desc');

  const snap = await q.get();
  const items = snap.docs.map(d => ({
    ...d.data(),
    submittedAt: d.data().submittedAt?.toDate?.()?.toISOString() ?? null,
    repliedAt: d.data().repliedAt?.toDate?.()?.toISOString() ?? null,
  }));

  return NextResponse.json(items);
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, reply } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (reply !== undefined) {
    updates.reply = reply;
    updates.repliedAt = FieldValue.serverTimestamp();
    updates.status = 'acknowledged';
  }

  await adminDb.collection('clientFeedback').doc(id).update(updates);
  return NextResponse.json({ success: true });
}
