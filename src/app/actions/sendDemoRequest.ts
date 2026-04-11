'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function sendDemoRequest(data: {
  name: string;
  email: string;
  company: string;
  revenue: string;
  challenge: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set');
    return { success: false, error: 'Email configuration error' };
  }

  try {
    // Send notification to admin
    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: ['admin@crftdweb.com'],
      replyTo: data.email,
      subject: `New Demo Request: ${data.name} - ${data.company || 'No Company'}`,
      html: `
<h2>New Strategy Call Request</h2>
<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
<p><strong>Company:</strong> ${escapeHtml(data.company || 'Not provided')}</p>
<p><strong>Monthly Revenue:</strong> ${escapeHtml(data.revenue || 'Not provided')}</p>
<h3>Biggest Challenge:</h3>
<p>${escapeHtml(data.challenge || 'Not provided').replace(/\n/g, '<br>')}</p>
<hr>
<p><em>Submitted from the Engine Demo page</em></p>
      `,
      text: `New Strategy Call Request\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'Not provided'}\nRevenue: ${data.revenue || 'Not provided'}\n\nBiggest Challenge:\n${data.challenge || 'Not provided'}`,
    });

    const firstName = data.name.split(' ')[0];

    // Send confirmation to the prospect
    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [data.email],
      subject: 'Your Engine Strategy Call is Confirmed!',
      html: `<!DOCTYPE html>
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
            <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
              Thanks for requesting a strategy call. We&rsquo;ve received your information and will be in touch within 24 hours to schedule your session.
            </p>
            <p style="margin:0 0 8px;font-size:15px;color:#111;font-weight:600;">What to expect:</p>
            <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#444;line-height:2;">
              <li>A personalised strategy session tailored to your business</li>
              <li>A live demo of Engine with your actual niche</li>
              <li>A custom roadmap to launch your first high-ticket offer</li>
              <li>Open Q&amp;A with our team</li>
            </ul>
            <p style="margin:0 0 24px;font-size:14px;color:#444;line-height:1.7;">
              In the meantime, you can explore Engine at <a href="https://crftdweb.com/engine" style="color:#111;font-weight:600;">crftdweb.com/engine</a>.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
            </table>
            <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
            <p style="margin:0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      text: `Hi ${firstName},\n\nThanks for requesting a strategy call. We've received your information and will be in touch within 24 hours to schedule your session.\n\nWhat to expect:\n- A personalised strategy session tailored to your business\n- A live demo of Engine with your actual niche\n- A custom roadmap to launch your first high-ticket offer\n- Open Q&A with our team\n\nIn the meantime, explore Engine at crftdweb.com/engine\n\nCrftdWeb · crftdweb.com`,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send demo request:', error);
    return { success: false, error: 'Failed to send request' };
  }
}
