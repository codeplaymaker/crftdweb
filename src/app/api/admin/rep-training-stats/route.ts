import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function GET() {
  // Verify admin cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const snap = await adminDb.collection('repTrainingStats').get();
  const stats = snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      unlockedAt: data.unlockedAt?.toDate?.()?.toISOString() || null,
    };
  });

  return NextResponse.json(stats);
}
