import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('reps').orderBy('joinedAt', 'desc').get();
  const reps = snap.docs.map(d => ({ ...d.data(), uid: d.id }));
  return NextResponse.json(reps);
}
