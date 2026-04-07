/**
 * API Route: Rep Email — Send Follow-up
 * Sends a follow-up email to a lead via Resend and logs it to Firestore.
 * Server-side for security (Resend API key is server-only).
 * Rate-limited per rep per day (configurable in settings/repEmail).
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.OUTREACH_FROM_EMAIL || 'hello@crftdweb.com';
const DEFAULT_MAX_EMAILS_PER_DAY = 20;

async function getMaxEmailsPerDay(): Promise<number> {
  const doc = await adminDb.collection('settings').doc('repEmail').get();
  if (doc.exists) {
    const val = doc.data()?.maxEmailsPerDay;
    if (typeof val === 'number' && val > 0) return val;
  }
  return DEFAULT_MAX_EMAILS_PER_DAY;
}

async function getTodayEmailCount(repId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const snap = await adminDb.collection('repEmails')
    .where('repId', '==', repId)
    .where('sentAt', '>=', startOfDay)
    .where('status', '==', 'sent')
    .count()
    .get();
  return snap.data().count;
}

export async function POST(req: NextRequest) {
  // Verify Firebase ID token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let uid: string;
  try {
    const token = authHeader.slice(7);
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { leadId, recipientEmail, subject, body, templateKey, repName, repEmail } = await req.json();

  if (!leadId || !recipientEmail || !subject || !body || !templateKey || !repName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // Verify lead belongs to this rep
  const leadDoc = await adminDb.collection('repLeads').doc(leadId).get();
  if (!leadDoc.exists || leadDoc.data()?.repId !== uid) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const leadData = leadDoc.data()!;

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  // Rate limit check
  const [maxEmails, todayCount] = await Promise.all([
    getMaxEmailsPerDay(),
    getTodayEmailCount(uid),
  ]);
  if (todayCount >= maxEmails) {
    return NextResponse.json(
      { error: `Daily email limit reached (${maxEmails}). Try again tomorrow.` },
      { status: 429 }
    );
  }

  // Send via Resend
  let resendId: string | null = null;
  let sendError: string | null = null;

  try {
    const fromField = `${repName} at CrftdWeb <${FROM_EMAIL}>`;
    const replyTo = `reply-${leadId}@crftdweb.com`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromField,
        to: recipientEmail,
        reply_to: replyTo,
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[rep-email] Resend error:', err);
      sendError = `Resend error: ${res.status}`;
    } else {
      const data = await res.json();
      resendId = data.id ?? null;
    }
  } catch (err) {
    console.error('[rep-email] Send failed:', err);
    sendError = 'Failed to send email';
  }

  // Log to Firestore + stamp lead with lastEmailedAt
  const logRef = adminDb.collection('repEmails').doc();
  const batch = adminDb.batch();

  batch.set(logRef, {
    id: logRef.id,
    repId: uid,
    repName,
    leadId,
    businessName: leadData.businessName || '',
    recipientEmail,
    templateKey,
    subject,
    body,
    resendId,
    status: sendError ? 'failed' : 'sent',
    ...(sendError && { error: sendError }),
    sentAt: FieldValue.serverTimestamp(),
  });

  if (!sendError) {
    batch.update(adminDb.collection('repLeads').doc(leadId), {
      lastEmailedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();

  if (sendError) {
    return NextResponse.json({ error: sendError }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    emailId: logRef.id,
    resendId,
  });
}
