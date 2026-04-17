'use server';

import { Resend } from 'resend';
import { adminDb } from '@/lib/firebase/admin';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

function buildHtml(name: string, email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CrftdWeb — Quick task before we chat</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo bar -->
          <tr>
            <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
              <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">

              <!-- Greeting -->
              <p style="margin:0 0 20px;font-size:16px;color:#111;line-height:1.6;font-weight:600;">
                Hi ${name},
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                Good news — we want to move you forward.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
                Before we get on a call, there's one quick thing. It takes about 20 minutes and it'll tell us everything we need to know.
              </p>

              <!-- Task box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#0a0a0a;border-radius:10px;padding:20px 24px;">
                    <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Your Task</p>
                    <p style="margin:0;font-size:15px;color:#fff;line-height:1.7;">
                      Find <strong>5 UK businesses</strong> with a bad website and write <strong>one specific sentence</strong> for each explaining why it needs a redesign.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:14px;color:#888;line-height:1.7;">
                Not vague — be specific. Something like:
              </p>

              <!-- Examples -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                ${[
                  'No clear call-to-action — visitors land on the page with no way to enquire or book',
                  'Hero section is a blurry stock photo with no headline — you can\'t tell what they sell',
                  'Contact form is buried three clicks deep — nobody\'s filling that out',
                ].map(ex => `
                <tr>
                  <td style="padding:5px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:10px;color:#111;font-size:14px;font-weight:700;">→</td>
                        <td style="font-size:14px;color:#666;font-style:italic;">"${ex}"</td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <p style="margin:0 0 8px;font-size:15px;color:#444;line-height:1.7;">
                It's a simple form — takes 2 minutes to fill in.
              </p>
              <p style="margin:0 0 24px;font-size:13px;color:#888;line-height:1.7;">
                The sooner you send it, the sooner we can move you forward.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                <tr>
                  <td style="background:#111;border-radius:8px;">
                    <a href="${BASE_URL}/apply/trial" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Submit your 5 businesses &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px;font-size:13px;color:#999;line-height:1.6;">
                Prefer to reply directly? Just hit reply and send your 5 businesses in this email thread — works just as well.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
              </table>

              <!-- Sign off -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
                    <p style="margin:0;font-size:13px;color:#999;">crftdweb.com · admin@crftdweb.com</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#aaa;">
                admin@crftdweb.com · crftdweb.com · Bristol, UK
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const plainText = (name: string) => `Hi ${name},

Good news — we want to move you forward.

Before we get on a call, there's one quick thing. It takes about 20 minutes.

Your task: Find 5 UK businesses with a bad website and write one specific sentence for each explaining why it needs a redesign. Be specific — not "it looks old", but something like "no clear call-to-action", "hero section is a stock photo with no headline", or "contact form is buried three clicks deep".

Submit here (takes 2 minutes): ${BASE_URL}/apply/trial

Or just reply to this email with your 5 businesses — works just as well.

The sooner you send it, the sooner we can move you forward.

CrftdWeb
crftdweb.com`;

interface CVData {
  score?: number;
  salesSignals?: string[];
  redFlags?: string[];
  reasons?: string[];
  education?: string;
  location?: string;
  cvVerdict?: string;
}

export async function sendTrialTask(name: string, email: string, cvData?: CVData): Promise<{ success: boolean; error?: string; alreadySent?: boolean }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'Email configuration error' };
  }

  if (!name || !email || !email.includes('@')) {
    return { success: false, error: 'Valid name and email required' };
  }

  // Deduplication check — block if already sent to this email
  const normalised = email.trim().toLowerCase();
  const existing = await adminDb
    .collection('trial_tasks_sent')
    .where('email', '==', normalised)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { success: false, alreadySent: true, error: 'Trial task already sent to this email' };
  }

  try {
    const sendResult = await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email],
      subject: 'CrftdWeb — Quick task before we chat',
      html: buildHtml(name, email),
      text: plainText(name),
    });

    // Track in adminEmails for open/click tracking
    await adminDb.collection('adminEmails').add({
      to: normalised,
      name,
      subject: 'CrftdWeb — Quick task before we chat',
      templateKey: 'trial-task',
      resendId: sendResult.data?.id ?? null,
      status: sendResult.error ? 'failed' : 'sent',
      sentAt: new Date(),
    });

    // Log to Firestore so future attempts are blocked
    await adminDb.collection('trial_tasks_sent').add({
      email: normalised,
      name,
      sentAt: new Date(),
    });

    // Upsert applicant — create if new, update status if not yet further along
    const STATUS_RANK: Record<string, number> = {
      pending: 0, email_sent: 1, trial_sent: 1, booked: 2, no_show: 2,
      screened: 3, offered: 4, accepted: 5, declined: 5, rejected: 5,
    };
    const applicantSnap = await adminDb.collection('applicants')
      .where('email', '==', normalised).limit(1).get();
    if (applicantSnap.empty) {
      await adminDb.collection('applicants').add({
        name, email: normalised, status: 'trial_sent',
        phone: '', location: cvData?.location || '', rating: cvData?.score || 3,
        verdict: 'trial', salesSignals: cvData?.salesSignals?.join(', ') || '',
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
      if (currentRank < STATUS_RANK['trial_sent']) {
        await doc.ref.update({ status: 'trial_sent', emailSentAt: new Date().toISOString() });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send trial task email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}