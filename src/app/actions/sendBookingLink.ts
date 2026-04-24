'use server';

import { Resend } from 'resend';
import { adminDb } from '@/lib/firebase/admin';
import { randomBytes } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

function buildHtml(name: string, bookingUrl: string): string {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Let's find a time to talk</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
              <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#111;line-height:1.6;font-weight:600;">Hi ${firstName},</p>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                Your background caught my attention — I&apos;d love to get 15 minutes with you to explain what we&apos;re building at CrftdWeb and see if it could be a good fit.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;">
                No prep needed. Pick a time below and we&apos;ll go from there:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#111;border-radius:8px;">
                    <a href="${bookingUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Book a time &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">
                Takes 30 seconds to book. If none of the slots work, just reply and I&apos;ll find something that does.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
              </table>
              <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
              <p style="margin:0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#aaa;">admin@crftdweb.com &middot; crftdweb.com &middot; Bristol, UK</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const plainText = (name: string, bookingUrl: string) => {
  const firstName = name.split(' ')[0];
  return `Hi ${firstName},

Your background caught my attention — I'd love to get 15 minutes with you to explain what we're building at CrftdWeb and see if it could be a good fit.

No prep needed. Pick a time here:
${bookingUrl}

Takes 30 seconds to book. If none of the slots work, just reply and I'll find something that does.

— Obi
CrftdWeb · crftdweb.com`;
};

interface CVData {
  score?: number;
  salesSignals?: string[];
  redFlags?: string[];
  reasons?: string[];
  education?: string;
  location?: string;
  cvVerdict?: string;
}

export async function sendBookingLink(
  name: string,
  email: string,
  cvData?: CVData,
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Email config error' };
  if (!name || !email || !email.includes('@')) return { success: false, error: 'Valid name and email required' };

  try {
    const token = randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await adminDb.collection('bookingTokens').doc(token).set({
      token,
      applicantName: name,
      applicantEmail: email,
      createdAt: new Date().toISOString(),
      expiresAt,
      used: false,
      usedAt: null,
      slotId: null,
    });

    const bookingUrl = `${BASE_URL}/book/${token}`;

    const sendResult = await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email],
      subject: 'Let\'s find a time to talk',
      html: buildHtml(name, bookingUrl),
      text: plainText(name, bookingUrl),
    });

    // Track in adminEmails for open/click tracking
    await adminDb.collection('adminEmails').add({
      to: email.trim().toLowerCase(),
      name,
      subject: 'Let\'s find a time to talk',
      templateKey: 'booking-link',
      resendId: sendResult.data?.id ?? null,
      status: sendResult.error ? 'failed' : 'sent',
      sentAt: new Date(),
    });

    // Upsert applicant — create if new, update status if not yet further along
    const STATUS_RANK: Record<string, number> = {
      pending: 0, email_sent: 1, trial_sent: 1, booked: 2, no_show: 2,
      screened: 3, offered: 4, accepted: 5, declined: 5, rejected: 5,
    };
    const emailKey = email.trim().toLowerCase();
    const applicantSnap = await adminDb.collection('applicants')
      .where('email', '==', emailKey).limit(1).get();
    if (applicantSnap.empty) {
      await adminDb.collection('applicants').add({
        name, email: emailKey, status: 'email_sent',
        phone: '', location: cvData?.location || '', rating: cvData?.score || 3,
        verdict: 'booking', salesSignals: cvData?.salesSignals?.join(', ') || '',
        education: cvData?.education || '',
        keyStrength: cvData?.reasons?.[0] || '', indeedEmail: false,
        notes: cvData?.redFlags?.length ? `Red flags: ${cvData.redFlags.join(', ')}` : '',
        cvVerdict: cvData?.cvVerdict || '',
        emailSentAt: new Date().toISOString(), bookedAt: null,
        activityLog: [], createdAt: new Date().toISOString(), source: 'cv_review',
      });
    } else {
      const doc = applicantSnap.docs[0];
      const currentRank = STATUS_RANK[doc.data().status as string] ?? 0;
      if (currentRank < STATUS_RANK['email_sent']) {
        await doc.ref.update({ status: 'email_sent', emailSentAt: new Date().toISOString() });
      }
    }

    return { success: true };
  } catch (err) {
    console.error('sendBookingLink:', err);
    return { success: false, error: 'Failed to send' };
  }
}
