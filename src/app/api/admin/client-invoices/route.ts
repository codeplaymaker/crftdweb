import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clientId = req.nextUrl.searchParams.get('clientId');
  const q = clientId
    ? adminDb.collection('clientInvoices').where('clientId', '==', clientId).orderBy('createdAt', 'desc')
    : adminDb.collection('clientInvoices').orderBy('createdAt', 'desc');

  const snap = await q.get();
  const items = snap.docs.map(d => ({
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? null,
    paidAt: d.data().paidAt?.toDate?.()?.toISOString() ?? null,
  }));

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { clientId, invoiceNumber, description, amount, dueDate, paymentLink } = await req.json();
  if (!clientId || !invoiceNumber || !description || !amount || !dueDate) {
    return NextResponse.json({ error: 'All invoice fields are required' }, { status: 400 });
  }

  const ref = adminDb.collection('clientInvoices').doc();
  await ref.set({
    id: ref.id,
    clientId,
    invoiceNumber,
    description,
    amount: Number(amount),
    dueDate,
    status: 'unpaid',
    paymentLink: paymentLink || '',
    paidAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true, id: ref.id });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, paymentLink } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (paymentLink !== undefined) updates.paymentLink = paymentLink;
  if (status === 'paid') updates.paidAt = FieldValue.serverTimestamp();

  await adminDb.collection('clientInvoices').doc(id).update(updates);
  return NextResponse.json({ success: true });
}
