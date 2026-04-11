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

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { uid, status, tier, careerRank } = await req.json();
  if (!uid) return NextResponse.json({ error: 'Missing uid' }, { status: 400 });

  const updates: Record<string, string> = {};
  const validStatuses = ['active', 'trial', 'inactive'];
  const validTiers = ['rep', 'senior_rep', 'closer'];
  const validRanks = ['bronze', 'silver', 'gold', 'diamond', 'closer', 'master', 'dragon'];

  if (status && validStatuses.includes(status)) updates.status = status;
  if (tier && validTiers.includes(tier)) updates.tier = tier;
  if (careerRank && validRanks.includes(careerRank)) updates.careerRank = careerRank;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  await adminDb.collection('reps').doc(uid).update(updates);
  return NextResponse.json({ success: true });
}
