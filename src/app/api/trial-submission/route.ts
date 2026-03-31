import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

interface Entry {
  business: string;
  url: string;
  diagnosis: string;
}

export async function POST(req: NextRequest) {
  const { email, entries } = await req.json() as { email?: string; entries?: Entry[] };

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  if (!Array.isArray(entries) || entries.length !== 5) {
    return NextResponse.json({ error: 'Exactly 5 entries required' }, { status: 400 });
  }
  for (const e of entries) {
    if (!e.business?.trim() || !e.url?.trim() || !e.diagnosis?.trim()) {
      return NextResponse.json({ error: 'All fields are required for each entry' }, { status: 400 });
    }
  }

  const normalised = email.trim().toLowerCase();

  // One submission per email
  const existing = await adminDb
    .collection('trial_submissions')
    .where('email', '==', normalised)
    .limit(1)
    .get();

  if (!existing.empty) {
    return NextResponse.json({ error: 'A submission from this email already exists.' }, { status: 409 });
  }

  await adminDb.collection('trial_submissions').add({
    email: normalised,
    entries: entries.map(e => ({
      business: e.business.trim(),
      url: e.url.trim(),
      diagnosis: e.diagnosis.trim(),
    })),
    submittedAt: FieldValue.serverTimestamp(),
    reviewed: false,
  });

  return NextResponse.json({ success: true });
}
