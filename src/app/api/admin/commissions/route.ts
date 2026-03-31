import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('repCommissions').orderBy('createdAt', 'desc').get();
  const commissions = snap.docs.map(d => ({ ...d.data(), id: d.id }));
  return NextResponse.json(commissions);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { repId, repName, leadId, businessName, dealValue, commissionAmount } = body;
  if (!repId || !leadId) return NextResponse.json({ error: 'repId and leadId required' }, { status: 400 });

  const ref = adminDb.collection('repCommissions').doc();
  await ref.set({
    id: ref.id,
    repId,
    repName,
    leadId,
    businessName,
    dealValue,
    commissionAmount,
    status: 'pending',
    createdAt: FieldValue.serverTimestamp(),
    paidAt: null,
  });

  return NextResponse.json({ success: true, id: ref.id });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Commission ID required' }, { status: 400 });

  await adminDb.collection('repCommissions').doc(id).update({
    status: 'paid',
    paidAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}
