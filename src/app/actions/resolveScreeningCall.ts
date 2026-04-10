'use server';

import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

const LOGO_HEADER = `
    <tr>
      <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td>
    </tr>`;



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
): Promise<{ success: boolean; error?: string }> {
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

    // approved — find applicant by email and mark as screened so offer button appears
    const snap = await adminDb
      .collection('applicants')
      .where('email', '==', applicantEmail.trim().toLowerCase())
      .limit(1)
      .get();

    if (!snap.empty) {
      await snap.docs[0].ref.set(
        { status: 'screened', screenedAt: new Date().toISOString() },
        { merge: true },
      );
    }

    return { success: true };
  } catch (err) {
    console.error('resolveScreeningCall:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
