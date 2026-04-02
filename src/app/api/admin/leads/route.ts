import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('repLeads').orderBy('createdAt', 'desc').get();
  const leads = snap.docs.map(d => ({ ...d.data(), id: d.id }));
  return NextResponse.json(leads);
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, dealValue } = await req.json();
  if (!id) return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });

  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  if (status !== undefined) update.status = status;
  if (dealValue !== undefined) update.dealValue = dealValue;

  await adminDb.collection('repLeads').doc(id).update(update);
  return NextResponse.json({ success: true });
}
