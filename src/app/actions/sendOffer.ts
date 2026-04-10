'use server';

import { Resend } from 'resend';
import { adminDb } from '@/lib/firebase/admin';
import { randomBytes } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

function buildHtml(name: string, acceptUrl: string, declineUrl: string): string {
  const firstName = name.split(' ')[0];
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
            <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
              Great news &mdash; we&rsquo;d like to offer you a position as a <strong style="color:#111;">CrftdWeb Sales Representative</strong>.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
              Before you accept, please review the documents below so you know exactly how the role works:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
                <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Review Before Accepting</p>
                <table cellpadding="0" cellspacing="0" style="margin:0;">
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="${BASE_URL}/rep-onboarding-pack.html" style="font-size:14px;color:#111;font-weight:600;text-decoration:none;">📋 Onboarding Pack</a>
                      <span style="font-size:13px;color:#888;"> &mdash; role, commission, career progression</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="${BASE_URL}/docs/rep-contractor-agreement.html" style="font-size:14px;color:#111;font-weight:600;text-decoration:none;">📄 Contractor Agreement</a>
                      <span style="font-size:13px;color:#888;"> &mdash; legal terms, commission structure</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
              <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;">
                <p style="margin:0 0 4px;font-size:12px;color:#166534;font-weight:700;">Commission Structure</p>
                <p style="margin:0;font-size:13px;color:#15803d;line-height:1.6;">
                  20% on Starter (£997) · 15% on Launch (£2,497) · 12% on Growth (£4,997) · 10% on Scale (£9,997+)
                </p>
              </td></tr>
            </table>

            <p style="margin:0 0 28px;font-size:14px;color:#666;line-height:1.7;">
              By clicking <strong>Accept</strong>, you confirm you&rsquo;ve read both documents and agree to the terms of the contractor agreement.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#111;border-radius:8px;margin-right:12px;">
                        <a href="${acceptUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Accept Offer &rarr;</a>
                      </td>
                      <td width="12"></td>
                      <td style="background:#f4f4f4;border:1px solid #ddd;border-radius:8px;">
                        <a href="${declineUrl}" style="display:inline-block;padding:14px 24px;font-size:14px;font-weight:600;color:#666;text-decoration:none;">Decline</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">
              This offer expires in <strong style="color:#666;">72 hours</strong>. If you have any questions, just reply to this email.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
            </table>
            <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
            <p style="margin:0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
          </td>
        </tr>
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:11px;color:#aaa;">admin@crftdweb.com &middot; crftdweb.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const plainText = (name: string, acceptUrl: string, declineUrl: string) =>
`Hi ${name.split(' ')[0]},

We'd like to offer you a position as a CrftdWeb Sales Representative.

Before you accept, please review:

1. Onboarding Pack — ${BASE_URL}/rep-onboarding-pack.html
2. Contractor Agreement — ${BASE_URL}/docs/rep-contractor-agreement.html

Commission: 20% on Starter (£997) · 15% on Launch (£2,497) · 12% on Growth (£4,997) · 10% on Scale (£9,997+)

Accept: ${acceptUrl}
Decline: ${declineUrl}

This offer expires in 72 hours. Reply to this email with any questions.

CrftdWeb · crftdweb.com`;

export async function sendOffer(
  name: string,
  email: string,
  applicantId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Email config error' };
  if (!name || !email || !email.includes('@')) return { success: false, error: 'Valid name and email required' };

  try {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    await adminDb.collection('offerTokens').doc(token).set({
      token,
      applicantId,
      applicantName: name,
      applicantEmail: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      expiresAt,
      response: null,       // 'accepted' | 'declined' | null
      respondedAt: null,
    });

    const acceptUrl = `${BASE_URL}/offer/${token}?action=accept`;
    const declineUrl = `${BASE_URL}/offer/${token}?action=decline`;

    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email],
      subject: `CrftdWeb — You've been selected, ${name.split(' ')[0]}`,
      html: buildHtml(name, acceptUrl, declineUrl),
      text: plainText(name, acceptUrl, declineUrl),
    });

    // Update applicant status to 'offered'
    await adminDb.collection('applicants').doc(applicantId).set(
      { status: 'offered', offerSentAt: new Date().toISOString(), offerToken: token },
      { merge: true },
    );

    return { success: true };
  } catch (err) {
    console.error('sendOffer:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to send' };
  }
}
