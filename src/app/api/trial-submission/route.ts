import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendMessage } from '@/lib/telegram/bot';

interface Entry {
  business: string;
  url: string;
  diagnosis: string;
}

export async function POST(req: NextRequest) {
  const { name, email, entries } = await req.json() as { name?: string; email?: string; entries?: Entry[] };

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

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
    name: name.trim(),
    email: normalised,
    entries: entries.map(e => ({
      business: e.business.trim(),
      url: e.url.trim(),
      diagnosis: e.diagnosis.trim(),
    })),
    submittedAt: FieldValue.serverTimestamp(),
    reviewed: false,
  });

  // Notify via Telegram
  const adminChatIds = process.env.TELEGRAM_ALLOWED_USERS?.split(',').map(s => s.trim()).filter(Boolean) || [];
  if (adminChatIds.length > 0) {
    const msg = `📋 <b>Trial submitted</b>\n\n<b>Name:</b> ${name.trim()}\n<b>Email:</b> ${normalised}\n<b>Entries:</b> ${entries.length}\n\n<a href="https://crftdweb.com/admin/trials">Review in portal →</a>`;
    await Promise.all(adminChatIds.map(id => sendMessage(id, msg, 'HTML').catch(() => null)));
  }

  return NextResponse.json({ success: true });
}
