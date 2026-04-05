import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb
    .collection('trial_submissions')
    .orderBy('submittedAt', 'desc')
    .get();

  const submissions = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() ?? null,
  }));

  return NextResponse.json(submissions);
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, reviewed } = await req.json();
  if (!id || typeof reviewed !== 'boolean') {
    return NextResponse.json({ error: 'Missing id or reviewed' }, { status: 400 });
  }

  await adminDb.collection('trial_submissions').doc(id).update({ reviewed });
  return NextResponse.json({ success: true });
}
