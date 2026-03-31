'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

function buildHtml(name: string, clientEmail: string, tempPassword: string, projectName: string): string {
  const firstName = name.split(' ')[0];
  const loginUrl = `${BASE_URL}/client/signin`;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
          Your client portal for <strong>${projectName}</strong> is ready. You can log in to track your project, view deliverables, submit feedback, and manage invoices — all in one place.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
          <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Your Login</p>
          <p style="margin:0 0 6px;font-size:14px;color:#444;"><strong style="color:#111;">Email:</strong> ${clientEmail}</p>
          <p style="margin:0;font-size:14px;color:#444;"><strong style="color:#111;">Password:</strong> <span style="font-family:monospace;font-size:15px;letter-spacing:1px;color:#111;">${tempPassword}</span></p>
        </td></tr></table>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:#111;border-radius:8px;">
          <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Access your portal &rarr;</a>
        </td></tr></table>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">
          Please change your password after your first login. If you have any questions, just reply to this email.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
        <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
      <tr><td align="center" style="padding-top:24px;">
        <p style="margin:0;font-size:11px;color:#aaa;">admin@crftdweb.com &middot; crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export async function sendClientLoginDetails(
  name: string,
  clientEmail: string,
  tempPassword: string,
  projectName: string,
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Email config error' };
  if (!name || !clientEmail || !clientEmail.includes('@') || !tempPassword) {
    return { success: false, error: 'Name, email and password are required' };
  }

  try {
    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [clientEmail],
      subject: `Your CrftdWeb project portal is ready`,
      html: buildHtml(name, clientEmail, tempPassword, projectName),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to send' };
  }
}
