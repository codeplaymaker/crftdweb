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
    ? adminDb.collection('clientDocuments').where('clientId', '==', clientId).orderBy('addedAt', 'desc')
    : adminDb.collection('clientDocuments').orderBy('addedAt', 'desc');

  const snap = await q.get();
  const items = snap.docs.map(d => ({
    ...d.data(),
    addedAt: d.data().addedAt?.toDate?.()?.toISOString() ?? null,
  }));

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { clientId, label, url, type, notes } = await req.json();
  if (!clientId || !label || !url) {
    return NextResponse.json({ error: 'clientId, label and url are required' }, { status: 400 });
  }

  const ref = adminDb.collection('clientDocuments').doc();
  await ref.set({
    id: ref.id,
    clientId,
    label,
    url,
    type: type || 'other',
    notes: notes || '',
    addedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true, id: ref.id });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await adminDb.collection('clientDocuments').doc(id).delete();
  return NextResponse.json({ success: true });
}
