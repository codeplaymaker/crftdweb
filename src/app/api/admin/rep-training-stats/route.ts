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

  // Resolve display names — try Firebase Auth first, then users collection
  const userIds = stats.map((s) => s.userId).filter(Boolean);
  const authNames: Record<string, string> = {};
  await Promise.all(
    userIds.map(async (uid: string) => {
      // 1. Firebase Auth record
      try {
        const user = await adminAuth.getUser(uid);
        if (user.displayName) { authNames[uid] = user.displayName; return; }
        if (user.email) { authNames[uid] = user.email; return; }
      } catch {
        // deleted or not found
      }
      // 2. Firestore users collection (main app profile)
      try {
        const userDoc = await adminDb.collection('users').doc(uid).get();
        if (userDoc.exists) {
          const d = userDoc.data()!;
          const name = d.name || d.displayName || d.email;
          if (name) { authNames[uid] = name; return; }
        }
      } catch {
        // ignore
      }
      // 3. repTrainingStats document may have stored the userId as email (edge case)
    })
  );

  const statsWithNames = stats.map((s) => ({
    ...s,
    authDisplayName: authNames[s.userId] ?? null,
  }));

  return NextResponse.json(statsWithNames);
}
