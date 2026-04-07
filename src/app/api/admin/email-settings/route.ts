import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const doc = await adminDb.collection('settings').doc('repEmail').get();
  return NextResponse.json(doc.exists ? doc.data() : { maxEmailsPerDay: 20 });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { maxEmailsPerDay } = await req.json();
  if (typeof maxEmailsPerDay !== 'number' || maxEmailsPerDay < 1 || maxEmailsPerDay > 500) {
    return NextResponse.json({ error: 'maxEmailsPerDay must be between 1 and 500' }, { status: 400 });
  }

  await adminDb.collection('settings').doc('repEmail').set(
    { maxEmailsPerDay },
    { merge: true }
  );

  return NextResponse.json({ success: true, maxEmailsPerDay });
}
