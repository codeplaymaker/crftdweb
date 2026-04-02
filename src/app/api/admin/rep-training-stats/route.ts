import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
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
      userId: d.id,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      unlockedAt: data.unlockedAt?.toDate?.()?.toISOString() || null,
    };
  });

  // Resolve display names from Firebase Auth for any userId not covered by the reps collection
  const userIds = stats.map((s) => s.userId).filter(Boolean);
  const authNames: Record<string, string> = {};
  await Promise.all(
    userIds.map(async (uid: string) => {
      try {
        const user = await adminAuth.getUser(uid);
        if (user.displayName) authNames[uid] = user.displayName;
        else if (user.email) authNames[uid] = user.email;
      } catch {
        // user may have been deleted — ignore
      }
    })
  );

  const statsWithNames = stats.map((s) => ({
    ...s,
    authDisplayName: authNames[s.userId] ?? null,
  }));

  return NextResponse.json(statsWithNames);
}
