'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildHtml(name: string): string {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CrftdWeb — Application Update</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
              <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                Thanks for applying — I appreciate you taking the time.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                We had a high volume of applicants this round and unfortunately aren't able to move everyone forward. It's not a reflection of your ability — we just had some tough decisions to make.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;">
                Thanks again and best of luck with what's next.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
              </table>
              <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
              <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOverqualified(
  name: string,
  recipientEmail: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const firstName = name.split(' ')[0];
    const { error } = await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: recipientEmail,
      subject: `Re: CrftdWeb rep application`,
      html: buildHtml(firstName),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
