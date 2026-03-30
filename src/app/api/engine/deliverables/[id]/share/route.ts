import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/engine/auth-guard';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuthToken(request);
  if (!auth) return unauthorizedResponse();

  const { id } = await params;
  const snap = await adminDb.collection('deliverables').doc(id).get();
  if (!snap.exists || snap.data()?.userId !== auth.uid) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const current = snap.data()?.isPublic ?? false;
  await adminDb.collection('deliverables').doc(id).update({ isPublic: !current });

  return NextResponse.json({ isPublic: !current });
}
