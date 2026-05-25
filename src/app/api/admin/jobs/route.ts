import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection('jobApplications').orderBy('appliedAt', 'desc').get();
  const jobs = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { company, role, jobUrl, contact, notes, status } = body;

  if (!company || !role) {
    return NextResponse.json({ error: 'Company and role are required' }, { status: 400 });
  }

  const doc = await adminDb.collection('jobApplications').add({
    company: company.trim(),
    role: role.trim(),
    jobUrl: jobUrl?.trim() ?? '',
    contact: contact?.trim() ?? '',
    notes: notes?.trim() ?? '',
    status: status ?? 'applied',
    appliedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true, id: doc.id });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) return NextResponse.json({ error: 'Job ID required' }, { status: 400 });

  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  const allowed = ['company', 'role', 'jobUrl', 'contact', 'notes', 'status'];
  for (const key of allowed) {
    if (fields[key] !== undefined) update[key] = fields[key];
  }

  await adminDb.collection('jobApplications').doc(id).update(update);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Job ID required' }, { status: 400 });

  await adminDb.collection('jobApplications').doc(id).delete();
  return NextResponse.json({ success: true });
}
