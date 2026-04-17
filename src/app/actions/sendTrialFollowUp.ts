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
  <title>CrftdWeb — Still interested?</title>
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

              <p style="margin:0 0 20px;font-size:16px;color:#111;line-height:1.6;font-weight:600;">
                Hi ${name},
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                I sent you a quick task a few days ago — just checking whether you&rsquo;re still interested in the commissioned sales rep role with <strong>CrftdWeb</strong>.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
                No pressure at all. But if you are interested, the task takes about 20 minutes and it&rsquo;s the only thing standing between you and a screened spot on the team.
              </p>

              <!-- Reminder box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#0a0a0a;border-radius:10px;padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Quick Reminder — Your Task</p>
                    <p style="margin:0 0 12px;font-size:15px;color:#fff;line-height:1.7;">
                      Find <strong>5 UK businesses</strong> with a bad website and write <strong>one specific sentence</strong> for each explaining why it needs a redesign.
                    </p>
                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                      Be specific — not &ldquo;it looks old&rdquo;, but something like &ldquo;no clear call-to-action&rdquo; or &ldquo;hero section is a stock photo with no headline.&rdquo;
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Why it matters -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#f8f9fa;border-radius:10px;border:1px solid #e8e8e8;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888;">Why This Role Is Worth Your Time</p>
                    ${[
                      '100% commission — no cap, no ceiling',
                      'Warm leads lined up — we handle fulfilment, you focus on closing',
                      'Work remotely, set your own hours',
                      'Earn £300–£1,500+ per deal depending on package',
                    ].map(point => `
                    <p style="margin:0 0 8px;font-size:14px;color:#333;line-height:1.6;padding-left:16px;position:relative;">
                      <span style="position:absolute;left:0;color:#111;font-weight:700;">→</span>
                      ${point}
                    </p>`).join('')}
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                <tr>
                  <td style="background:#111;border-radius:8px;">
                    <a href="${BASE_URL}/apply/trial" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Submit your 5 businesses &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:13px;color:#888;line-height:1.7;">
                Or just reply to this email with your answers — works just as well.
              </p>
              <p style="margin:0 0 32px;font-size:13px;color:#aaa;line-height:1.7;">
                If you&rsquo;ve decided it&rsquo;s not for you, no worries — just let me know and I&rsquo;ll stop following up.
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

I sent you a quick task a few days ago — just checking whether you're still interested in the commissioned sales rep role with CrftdWeb.

If you are, the task takes about 20 minutes and it's the only thing standing between you and a screened spot on the team.

Quick reminder — your task:
Find 5 UK businesses with a bad website and write one specific sentence for each explaining why it needs a redesign.

Submit here: ${BASE_URL}/apply/trial
Or just reply to this email with your answers.

Why this role is worth your time:
→ 100% commission — no cap, no ceiling
→ Warm leads lined up — we handle fulfilment, you focus on closing
→ Work remotely, set your own hours
→ Earn £300–£1,500+ per deal depending on package

If you've decided it's not for you, just let me know and I'll stop following up.

CrftdWeb
crftdweb.com`;

export async function sendTrialFollowUp(
  applicantId: string,
  name: string,
  email: string,
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Email config error' };
  if (!email || !email.includes('@')) return { success: false, error: 'Valid email required' };

  const normalised = email.trim().toLowerCase();

  try {
    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [normalised],
      subject: `${name.split(' ')[0]}, still interested in the sales rep role?`,
      html: buildHtml(name),
      text: plainText(name),
    });

    const now = new Date().toISOString();

    // Mark follow-up sent on the applicant doc
    await adminDb.collection('applicants').doc(applicantId).update({
      followUpSentAt: now,
    });

    // Log to adminEmails for tracking
    await adminDb.collection('adminEmails').add({
      to: normalised,
      name,
      subject: `${name.split(' ')[0]}, still interested in the sales rep role?`,
      templateKey: 'trial-follow-up',
      status: 'sent',
      sentAt: new Date(),
    });

    return { success: true };
  } catch (err) {
    console.error('sendTrialFollowUp:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to send' };
  }
}
