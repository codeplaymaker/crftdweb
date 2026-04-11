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

/**
 * Strip HTML tags from user-provided body text to prevent XSS/phishing.
 * Only allows plain text content — HTML entities are escaped.
 */
function sanitizeBody(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtml(bodyText: string, repName: string, contactName: string): string {
  const safeContact = sanitizeBody(contactName.trim());
  const safeRep = sanitizeBody(repName);
  const greeting = safeContact
    ? `<p style="margin:0 0 20px;font-size:16px;color:#111;font-weight:600;">Hi ${safeContact},</p>`
    : '';
  const bodyHtml = sanitizeBody(bodyText)
    .split('\n\n')
    .map(p => `<p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
            <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
            ${greeting}${bodyHtml}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
              <tr><td style="border-top:1px solid #e8e8e8;padding-top:20px;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#111;">${safeRep}</p>
                <p style="margin:0 0 8px;font-size:13px;color:#999;">Sales Rep &middot; CrftdWeb</p>
                <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="40" style="display:block;border:0;margin-bottom:6px;" />
                <a href="https://crftdweb.com" style="font-size:12px;color:#999;text-decoration:none;">crftdweb.com</a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:11px;color:#aaa;">CrftdWeb &middot; Bristol, UK &middot; crftdweb.com</p>
          <p style="margin:4px 0 0;font-size:10px;color:#ccc;">
            <a href="mailto:admin@crftdweb.com?subject=Unsubscribe" style="color:#ccc;text-decoration:underline;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

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

  // Bounce/complaint safety check — block reps with too many bounces
  const repDoc = await adminDb.collection('reps').doc(uid).get();
  const repData = repDoc.data();
  const bounceCount = repData?.bounceCount || 0;
  const complaintCount = repData?.complaintCount || 0;
  if (complaintCount >= 2) {
    return NextResponse.json(
      { error: 'Email access suspended due to spam complaints. Contact admin.' },
      { status: 403 }
    );
  }
  if (bounceCount >= 5) {
    return NextResponse.json(
      { error: 'Email access suspended due to too many bounced emails. Contact admin to resolve.' },
      { status: 403 }
    );
  }

  // Send via Resend
  let resendId: string | null = null;
  let sendError: string | null = null;

  try {
    const fromField = `${repName} at CrftdWeb <${FROM_EMAIL}>`;
    const replyTo = `reply-${leadId}@eanexuekro.resend.app`;
    const contactFirstName = (leadData.contactName || '').split(' ')[0];
    const html = buildHtml(body, repName, contactFirstName);
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
        html,
        headers: {
          'List-Unsubscribe': '<mailto:admin@crftdweb.com?subject=Unsubscribe>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
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
