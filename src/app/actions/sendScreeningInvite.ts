'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CrftdWeb - Let's book a call</title>
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

              <p style="margin:0 0 20px;font-size:16px;color:#111;line-height:1.6;font-weight:600;">
                Hi ${name},
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                Really good work on the task — those were specific, well-observed issues. Exactly the kind of thinking I'm looking for.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
                I'd like to book a quick <strong style="color:#111;">15-minute call</strong> to have a chat. Are you free any time this week or next?
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#444;line-height:1.7;">
                Just reply with a couple of times that work for you and we'll get something in the diary.
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

Really good work on the task — those were specific, well-observed issues. Exactly the kind of thinking I'm looking for.

I'd like to book a quick 15-minute call to have a chat. Are you free any time this week or next?

Just reply with a couple of times that work for you and we'll get something in the diary.

CrftdWeb · crftdweb.com`;

export async function sendScreeningInvite(name: string, email: string): Promise<{ success: boolean; error?: string }> {
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
      subject: "CrftdWeb \u2014 Let's book a call",
      html: buildHtml(name),
      text: plainText(name),
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send screening invite:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
