/**
 * Webhook: Resend Email Events (bounce, complaint, delivery)
 * 
 * Tracks bounces and spam complaints for rep-sent emails.
 * Updates the repEmails doc with delivery status and increments
 * bounce/complaint counters on the rep's profile.
 * 
 * Configure this endpoint in Resend Dashboard → Webhooks:
 *   URL: https://crftdweb.com/api/webhooks/resend-events
 *   Events: email.bounced, email.complained, email.delivered
 */

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const WEBHOOK_SECRET = process.env.RESEND_EVENTS_WEBHOOK_SECRET || process.env.RESEND_WEBHOOK_SECRET || '';

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'resend-events-webhook', configured: !!WEBHOOK_SECRET });
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error('[resend-events] No webhook secret configured');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const payload = await req.text();

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    wh.verify(payload, {
      'svix-id': req.headers.get('svix-id') || '',
      'svix-timestamp': req.headers.get('svix-timestamp') || '',
      'svix-signature': req.headers.get('svix-signature') || '',
    });
  } catch {
    console.error('[resend-events] Signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(payload);
  const eventType: string = event.type;
  const data = event.data;
  const resendId: string | undefined = data?.email_id;

  if (!resendId) {
    return NextResponse.json({ ok: true, skipped: 'no email_id' });
  }

  // Only process bounce and complaint events for rep emails
  if (!['email.bounced', 'email.complained', 'email.delivered'].includes(eventType)) {
    return NextResponse.json({ ok: true, skipped: 'irrelevant event' });
  }

  // Find the matching repEmail doc by resendId
  const snap = await adminDb.collection('repEmails')
    .where('resendId', '==', resendId)
    .limit(1)
    .get();

  if (snap.empty) {
    // Not a rep email — could be a system email, ignore
    return NextResponse.json({ ok: true, skipped: 'not a rep email' });
  }

  const emailDoc = snap.docs[0];
  const emailData = emailDoc.data();
  const repId = emailData.repId;

  if (eventType === 'email.delivered') {
    await emailDoc.ref.update({
      deliveryStatus: 'delivered',
      deliveredAt: FieldValue.serverTimestamp(),
    });
  } else if (eventType === 'email.bounced') {
    const batch = adminDb.batch();

    // Mark the email as bounced
    batch.update(emailDoc.ref, {
      deliveryStatus: 'bounced',
      bounceType: data.bounce?.type || 'unknown',
      bouncedAt: FieldValue.serverTimestamp(),
    });

    // Increment bounce counter on rep profile
    const repRef = adminDb.collection('reps').doc(repId);
    batch.update(repRef, {
      bounceCount: FieldValue.increment(1),
      lastBounceAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    console.warn(`[resend-events] Bounce for rep ${repId}, email ${emailDoc.id}`);
  } else if (eventType === 'email.complained') {
    const batch = adminDb.batch();

    // Mark the email as complaint
    batch.update(emailDoc.ref, {
      deliveryStatus: 'complained',
      complainedAt: FieldValue.serverTimestamp(),
    });

    // Increment complaint counter on rep profile
    const repRef = adminDb.collection('reps').doc(repId);
    batch.update(repRef, {
      complaintCount: FieldValue.increment(1),
      lastComplaintAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    console.warn(`[resend-events] Spam complaint for rep ${repId}, email ${emailDoc.id}`);
  }

  return NextResponse.json({ ok: true, processed: eventType });
}
