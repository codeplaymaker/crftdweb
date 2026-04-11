import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const doc = await adminDb.collection('settings').doc('announcement').get();
  return NextResponse.json(doc.exists ? doc.data() : { text: '', enabled: false });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { text, enabled } = await req.json();
  if (typeof text !== 'string' || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  if (text.length > 280) {
    return NextResponse.json({ error: 'Text must be 280 characters or less' }, { status: 400 });
  }

  await adminDb.collection('settings').doc('announcement').set({
    text: text.trim(),
    enabled,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}
