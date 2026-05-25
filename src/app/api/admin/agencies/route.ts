import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('agencyOutreach').orderBy('createdAt', 'desc').get();
  const agencies = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  return NextResponse.json(agencies);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, website, description, contact, draftedEmail, status } = body;

  if (!name) {
    return NextResponse.json({ error: 'Agency name is required' }, { status: 400 });
  }

  const doc = await adminDb.collection('agencyOutreach').add({
    name: name.trim(),
    website: website?.trim() ?? '',
    description: description?.trim() ?? '',
    contact: contact?.trim() ?? '',
    draftedEmail: draftedEmail?.trim() ?? '',
    status: status ?? 'cold',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true, id: doc.id });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) return NextResponse.json({ error: 'Agency ID required' }, { status: 400 });

  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  const allowed = ['name', 'website', 'description', 'contact', 'draftedEmail', 'status', 'notes'];
  for (const key of allowed) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }

  await adminDb.collection('agencyOutreach').doc(id).update(update);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Agency ID required' }, { status: 400 });

  await adminDb.collection('agencyOutreach').doc(id).delete();
  return NextResponse.json({ success: true });
}
