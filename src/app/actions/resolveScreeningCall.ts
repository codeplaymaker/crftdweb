'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

const LOGO_HEADER = `
    <tr>
      <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td>
    </tr>`;

function buildOnboardingEmail(name: string, email: string, tempPassword: string): string {
  const firstName = name.split(' ')[0];
  const loginUrl = `${BASE_URL}/rep/signin`;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        ${LOGO_HEADER}
        <tr>
          <td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
            <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
              Great news — you've been approved as a CrftdWeb sales rep. Welcome to the team.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
              Your rep portal is ready. Log in with the credentials below, then complete the training modules before you start outreach.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
                <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Your Login</p>
                <p style="margin:0 0 6px;font-size:14px;color:#444;"><strong style="color:#111;">Email:</strong> ${email}</p>
                <p style="margin:0;font-size:14px;color:#444;"><strong style="color:#111;">Temp password:</strong> <span style="font-family:monospace;font-size:15px;letter-spacing:1px;color:#111;">${tempPassword}</span></p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#111;border-radius:8px;">
                  <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Log in to your portal &rarr;</a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">
              Change your password after your first login. If you have any questions, reply to this email.
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

function buildRejectionEmail(name: string): string {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        ${LOGO_HEADER}
        <tr>
          <td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
            <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
              Thanks for taking the time to chat and for the effort you put into the trial task.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
              After careful consideration, we've decided not to move forward at this time. We had strong applicants for a limited number of spots, and it was a close call.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
              We wish you all the best — and if circumstances change on our end we'll keep your details on file.
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

export async function resolveScreeningCall(
  slotId: string,
  outcome: 'approved' | 'rejected',
  applicantName: string,
  applicantEmail: string,
  applicantPhone: string = '',
): Promise<{ success: boolean; error?: string; repUid?: string }> {
  try {
    await adminDb.collection('screeningSlots').doc(slotId).update({ outcome });

    if (outcome === 'rejected') {
      await resend.emails.send({
        from: 'CrftdWeb <admin@crftdweb.com>',
        to: [applicantEmail],
        subject: 'Your CrftdWeb application',
        html: buildRejectionEmail(applicantName),
      });
      return { success: true };
    }

    // approved — create Firebase Auth + Firestore rep profile
    const tempPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-4).toUpperCase() +
      '!7';

    const userRecord = await adminAuth.createUser({
      email: applicantEmail,
      password: tempPassword,
      displayName: applicantName,
    });

    await adminDb.collection('reps').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      status: 'trial',
      commissionRate: 20,
      notes: '',
      joinedAt: FieldValue.serverTimestamp(),
    });

    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [applicantEmail],
      subject: `Welcome to CrftdWeb, ${applicantName.split(' ')[0]}!`,
      html: buildOnboardingEmail(applicantName, applicantEmail, tempPassword),
    });

    return { success: true, repUid: userRecord.uid };
  } catch (err) {
    console.error('resolveScreeningCall:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
