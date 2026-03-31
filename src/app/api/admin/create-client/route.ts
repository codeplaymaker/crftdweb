import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, businessName, email, phone, projectName, package: pkg, startDate, launchDate, notes } =
    await req.json();

  if (!name || !businessName || !email || !projectName) {
    return NextResponse.json({ error: 'Name, business name, email and project name are required' }, { status: 400 });
  }

  const tempPassword =
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-4).toUpperCase() +
    '!2';

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password: tempPassword,
      displayName: name,
    });

    const uid = userRecord.uid;

    await adminDb.collection('clients').doc(uid).set({
      uid,
      name,
      businessName,
      email,
      phone: phone || '',
      projectName,
      package: pkg || 'standard',
      stage: 'discovery',
      startDate: startDate || new Date().toISOString().split('T')[0],
      launchDate: launchDate || null,
      status: 'active',
      notes: notes || '',
      joinedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, uid, tempPassword });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create client';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
