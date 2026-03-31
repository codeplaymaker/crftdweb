'use server';

import { Resend } from 'resend';
import { adminDb } from '@/lib/firebase/admin';
import { randomBytes } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = 'https://crftdweb.com';

function buildHtml(name: string, bookingUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CrftdWeb — Book your screening call</title>
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
              <p style="margin:0 0 20px;font-size:16px;color:#111;line-height:1.6;font-weight:600;">Hi ${name},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
                I&apos;d like to book a quick <strong style="color:#111;">15-minute call</strong> to have a chat.
                Use the link below to pick a time that works for you:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#111;border-radius:8px;">
                    <a href="${bookingUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Pick a time &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">
                The link shows my available slots — takes a few seconds to book.
                If none of the times work, just reply to this email and we&apos;ll sort something.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
              </table>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#999;">CrftdWeb &middot; crftdweb.com &middot; admin@crftdweb.com</p>
                  </td>
                </tr>
              </table>
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

const plainText = (name: string, bookingUrl: string) => `Hi ${name},

Really good work on the task — exactly the kind of thinking I'm looking for.

I'd like to book a quick 15-minute call. Pick a time here:
${bookingUrl}

If none of the times work, just reply and we'll sort something.

CrftdWeb · crftdweb.com`;

export async function sendBookingLink(
  name: string,
  email: string,
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

    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email],
      subject: 'CrftdWeb — Book your screening call',
      html: buildHtml(name, bookingUrl),
      text: plainText(name, bookingUrl),
    });

    return { success: true };
  } catch (err) {
    console.error('sendBookingLink:', err);
    return { success: false, error: 'Failed to send' };
  }
}
