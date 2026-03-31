'use server';

import { Resend } from 'resend';
import { adminDb } from '@/lib/firebase/admin';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

function buildHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CrftdWeb - Quick task before we chat</title>
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
                Thanks for applying - your background looks interesting.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
                Before we book a call, I'd like to see how you think.
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
                Not just <em>"it looks old"</em> - something specific like:
              </p>

              <!-- Examples -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                ${[
                  'No mobile version - the site breaks on any phone',
                  'No contact number visible above the fold',
                  "The site hasn't been updated since 2018",
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

              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                No formatting required — just submit your list using the link below within <strong style="color:#111;">48 hours</strong>.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#111;border-radius:8px;">
                    <a href="${BASE_URL}/apply/trial" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Submit your task &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px;font-size:13px;color:#999;line-height:1.6;">
                You&apos;ll need to enter this email address on the form so we can match it to your application: <strong style="color:#555;">${name}</strong>
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
              </table>

              <!-- Sign off -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com · admin@crftdweb.com</p>
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

Thanks for applying - your background looks interesting.

Before we book a call, I'd like to see how you think.

Your task: Find 5 UK businesses with a bad website and write one specific sentence for each explaining why it needs a redesign - not just "it looks old", but something like "no mobile version" or "no contact number visible above the fold" or "the site hasn't been updated since 2018".

Submit your list here within 48 hours: ${BASE_URL}/apply/trial

Use this email address on the form so we can match it to your application.

CrftdWeb
crftdweb.com`;

export async function sendTrialTask(name: string, email: string): Promise<{ success: boolean; error?: string; alreadySent?: boolean }> {
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
    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email],
      subject: 'CrftdWeb - Quick task before we chat',
      html: buildHtml(name),
      text: plainText(name),
    });

    // Log to Firestore so future attempts are blocked
    await adminDb.collection('trial_tasks_sent').add({
      email: normalised,
      name,
      sentAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send trial task email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
