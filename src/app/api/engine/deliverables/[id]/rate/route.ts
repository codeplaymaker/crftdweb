import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/engine/auth-guard';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuthToken(request);
  if (!auth) return unauthorizedResponse();

  const { id } = await params;
  const { rating } = await request.json();

  if (rating !== 1 && rating !== -1 && rating !== null) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
  }

  const snap = await adminDb.collection('deliverables').doc(id).get();
  if (!snap.exists || snap.data()?.userId !== auth.uid) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await adminDb.collection('deliverables').doc(id).update({ rating });
  return NextResponse.json({ ok: true });
}
