/**
 * Cron: Meeting Reminders
 * Runs every 30 minutes. Sends Telegram reminders for booked screening calls
 * at ~24h and ~1h before the meeting. Tracks sent state on the slot doc.
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { sendMessage } from '@/lib/telegram/bot';
import { FieldValue } from 'firebase-admin/firestore';

const CRON_SECRET = process.env.CRON_SECRET;
const MEET_URL = 'https://meet.google.com/sht-kzhd-yxg';

export async function GET(req: NextRequest) {
  // Protect cron endpoint
  const auth = req.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminChatId = Number(process.env.TELEGRAM_ALLOWED_USERS?.split(',')[0]);
  if (!adminChatId) {
    return NextResponse.json({ error: 'No admin chat ID configured' }, { status: 500 });
  }

  const now = new Date();
  // Look ahead 25.5 hours to catch the 24h window with some buffer
  const windowEnd = new Date(now.getTime() + 25.5 * 60 * 60 * 1000);

  // Fetch all booked slots in the next 25.5 hours
  const snap = await adminDb
    .collection('screeningSlots')
    .where('available', '==', false)
    .where('dateTime', '>=', now.toISOString())
    .where('dateTime', '<=', windowEnd.toISOString())
    .get();

  let sent = 0;

  for (const doc of snap.docs) {
    const slot = doc.data();
    const slotTime = new Date(slot.dateTime as string);
    const minutesUntil = (slotTime.getTime() - now.getTime()) / (1000 * 60);
    const name = (slot.bookedByName as string) || 'Someone';
    const label = slot.label as string;

    // 24-hour reminder: between 23h 30m and 24h 30m out
    if (minutesUntil >= 23 * 60 + 30 && minutesUntil <= 24 * 60 + 30 && !slot.reminder24hSentAt) {
      await sendMessage(
        adminChatId,
        `⏰ <b>Reminder — call tomorrow</b>\n\n<b>Who:</b> ${name}\n<b>When:</b> ${label}\n\n<a href="${MEET_URL}">Google Meet →</a>`,
      );
      await doc.ref.update({ reminder24hSentAt: FieldValue.serverTimestamp() });
      sent++;
    }

    // 1-hour reminder: between 50m and 70m out
    if (minutesUntil >= 50 && minutesUntil <= 70 && !slot.reminder1hSentAt) {
      await sendMessage(
        adminChatId,
        `🔔 <b>Call in ~1 hour</b>\n\n<b>Who:</b> ${name}\n<b>When:</b> ${label}\n\n<a href="${MEET_URL}">Join Google Meet →</a>`,
      );
      await doc.ref.update({ reminder1hSentAt: FieldValue.serverTimestamp() });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, checked: snap.size, sent });
}
