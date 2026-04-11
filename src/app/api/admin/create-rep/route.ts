import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  // Verify admin token
  const token = req.cookies.get('admin_token')?.value;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, phone, notes } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  // Generate a temporary password
  const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-4).toUpperCase() + '!';

  try {
    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password: tempPassword,
      displayName: name,
    });

    const uid = userRecord.uid;

    // Generate unique refSlug from first name
    const firstName = name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    let refSlug = firstName;
    const existing = await adminDb.collection('reps').where('refSlug', '==', refSlug).get();
    if (!existing.empty) {
      let counter = 2;
      while (!(await adminDb.collection('reps').where('refSlug', '==', `${firstName}${counter}`).get()).empty) {
        counter++;
      }
      refSlug = `${firstName}${counter}`;
    }

    // Create rep profile in Firestore
    await adminDb.collection('reps').doc(uid).set({
      uid,
      name,
      email,
      phone: phone || '',
      status: 'active',
      careerRank: 'bronze',
      commissionRate: 0,
      refSlug,
      notes: notes || '',
      joinedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, uid, tempPassword });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create rep';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
