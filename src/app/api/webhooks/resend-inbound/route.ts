/**
 * Webhook: Resend Inbound Email
 * Receives email.received events from Resend when a prospect replies.
 * Matches the reply to a lead via the tagged reply-to address (reply-{leadId}@crftdweb.com),
 * fetches the full email content from Resend, and stores it in Firestore.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || '';

// GET handler for easy verification that the endpoint is deployed
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'resend-inbound-webhook', configured: !!WEBHOOK_SECRET });
}

export async function POST(req: NextRequest) {
  console.log('[inbound-webhook] POST received');

  // Verify webhook signature
  if (!WEBHOOK_SECRET) {
    console.error('[inbound-webhook] No webhook secret configured');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const payload = await req.text();
  console.log('[inbound-webhook] Payload length:', payload.length);

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    wh.verify(payload, {
      'svix-id': req.headers.get('svix-id') || '',
      'svix-timestamp': req.headers.get('svix-timestamp') || '',
      'svix-signature': req.headers.get('svix-signature') || '',
    });
    console.log('[inbound-webhook] Signature verified');
  } catch (err) {
    console.error('[inbound-webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(payload);
  console.log('[inbound-webhook] Event type:', event.type);
  console.log('[inbound-webhook] Event data:', JSON.stringify(event.data, null, 2));

  if (event.type !== 'email.received') {
    // Ignore non-inbound events
    return NextResponse.json({ ok: true });
  }

  const data = event.data;
  const emailId = data.email_id;
  const from = data.from || '';
  const toAddresses: string[] = data.to || [];
  const subject = data.subject || '';

  console.log('[inbound-webhook] email_id:', emailId, 'from:', from, 'to:', toAddresses, 'subject:', subject);

  // Find the tagged reply-to address: reply-{leadId}@crftdweb.com
  // Handle both plain emails and "Name <email>" format
  const taggedAddress = toAddresses.find((addr: string) =>
    addr.match(/reply-[a-zA-Z0-9]+@crftdweb\.com/)
  );

  if (!taggedAddress) {
    console.log('[inbound-webhook] No tagged address found in to:', toAddresses);
    // Not a rep email reply — ignore (could be admin@crftdweb.com etc.)
    return NextResponse.json({ ok: true, skipped: true });
  }

  const leadIdMatch = taggedAddress.match(/reply-([a-zA-Z0-9]+)@/);
  if (!leadIdMatch) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const leadId = leadIdMatch[1];

  // Verify the lead exists
  const leadDoc = await adminDb.collection('repLeads').doc(leadId).get();
  if (!leadDoc.exists) {
    console.warn('[inbound-webhook] Lead not found:', leadId);
    return NextResponse.json({ ok: true, skipped: true });
  }

  const leadData = leadDoc.data()!;

  // Fetch full email content from Resend API
  let htmlBody = '';
  let textBody = '';
  try {
    const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (res.ok) {
      const emailData = await res.json();
      htmlBody = emailData.html || '';
      textBody = emailData.text || '';
    }
  } catch (err) {
    console.error('[inbound-webhook] Failed to fetch email content:', err);
    // Continue — we still log the reply even without body
  }

  // Store the reply in Firestore
  const replyRef = adminDb.collection('repEmailReplies').doc();
  const batch = adminDb.batch();

  batch.set(replyRef, {
    id: replyRef.id,
    resendEmailId: emailId,
    leadId,
    repId: leadData.repId,
    from,
    to: toAddresses,
    subject,
    textBody,
    htmlBody,
    receivedAt: FieldValue.serverTimestamp(),
  });

  // Update the lead with lastRepliedAt
  batch.update(adminDb.collection('repLeads').doc(leadId), {
    lastRepliedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  console.log(`[inbound-webhook] Reply stored for lead ${leadId} from ${from}`);
  return NextResponse.json({ ok: true, replyId: replyRef.id });
}
