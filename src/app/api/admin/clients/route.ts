import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('clients').orderBy('joinedAt', 'desc').get();
  const clients = snap.docs.map(d => ({
    ...d.data(),
    joinedAt: d.data().joinedAt?.toDate?.()?.toISOString() ?? null,
  }));

  return NextResponse.json(clients);
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { uid, ...updates } = await req.json();
  if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 });

  await adminDb.collection('clients').doc(uid).update(updates);
  return NextResponse.json({ success: true });
}
