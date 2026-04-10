'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCustomEmail(
  name: string,
  email: string,
  subject: string,
  html: string,
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Email config error' };
  if (!email || !email.includes('@')) return { success: false, error: 'Valid email required' };

  try {
    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email.trim().toLowerCase()],
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('sendCustomEmail:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to send' };
  }
}
