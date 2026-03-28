'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
            <td align="center" style="background:#0a0a0a;border-radius:12px 12px 0 0;padding:24px 40px;">
              <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="120" style="display:block;border:0;" />
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
                No formatting required - just reply to this email with your list within <strong style="color:#111;">48 hours</strong>.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#444;line-height:1.7;">
                Looking forward to seeing what you come back with.
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

That's it. No formatting required - just reply to this email with your list within 48 hours.

Looking forward to seeing what you come back with.

CrftdWeb
crftdweb.com`;

export async function sendTrialTask(name: string, email: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'Email configuration error' };
  }

  if (!name || !email || !email.includes('@')) {
    return { success: false, error: 'Valid name and email required' };
  }

  try {
    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email],
      subject: 'CrftdWeb - Quick task before we chat',
      html: buildHtml(name),
      text: plainText(name),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send trial task email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
