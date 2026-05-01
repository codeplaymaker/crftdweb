import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { sendMessage } from '@/lib/telegram/bot';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

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
        <tr>
          <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
            <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
            <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
              You&rsquo;re officially on the team. Welcome to <strong>CrftdWeb</strong>.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
              Your rep portal is ready. Log in with the credentials below, then read the onboarding pack to get started.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
                <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Your Login</p>
                <p style="margin:0 0 6px;font-size:14px;color:#444;"><strong style="color:#111;">Email:</strong> ${email}</p>
                <p style="margin:0;font-size:14px;color:#444;"><strong style="color:#111;">Temp password:</strong> <span style="font-family:monospace;font-size:15px;letter-spacing:1px;color:#111;">${tempPassword}</span></p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
              <tr>
                <td style="background:#111;border-radius:8px;">
                  <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Log in to your portal &rarr;</a>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
                <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Reference Documents</p>
                <table cellpadding="0" cellspacing="0" style="margin:0;">
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="${BASE_URL}/rep-onboarding-pack.html" style="font-size:14px;color:#111;font-weight:600;text-decoration:none;">📋 Onboarding Pack</a>
                      <span style="font-size:13px;color:#888;"> &mdash; role, commission, scripts, Day 1 schedule</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <a href="${BASE_URL}/docs/rep-contractor-agreement.html" style="font-size:14px;color:#111;font-weight:600;text-decoration:none;">📄 Contractor Agreement</a>
                      <span style="font-size:13px;color:#888;"> &mdash; legal terms</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">
              Change your password after your first login. Reply to this email if you have any questions.
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

export const dynamic = 'force-dynamic';

// GET — validate token
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token) return NextResponse.json({ valid: false }, { status: 400 });

  try {
    const doc = await adminDb.collection('offerTokens').doc(token).get();
    if (!doc.exists) return NextResponse.json({ valid: false });

    const data = doc.data()!;
    if (data.response) return NextResponse.json({ valid: false, reason: 'already_responded', response: data.response });
    if (new Date(data.expiresAt) < new Date()) return NextResponse.json({ valid: false, reason: 'expired' });

    return NextResponse.json({ valid: true, name: data.applicantName });
  } catch (err) {
    console.error('offer validate:', err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

// POST — accept or decline
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  try {
    const { action } = await req.json();
    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const docRef = adminDb.collection('offerTokens').doc(token);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

    const data = doc.data()!;
    if (data.response) return NextResponse.json({ error: 'Already responded' }, { status: 400 });
    if (new Date(data.expiresAt) < new Date()) return NextResponse.json({ error: 'Offer expired' }, { status: 400 });

    const response = action === 'accept' ? 'accepted' : 'declined';
    const now = new Date().toISOString();

    // Update token
    await docRef.update({ response, respondedAt: now });

    // Update applicant status
    if (data.applicantId) {
      await adminDb.collection('applicants').doc(data.applicantId).set(
        { status: response, [`${response}At`]: now },
        { merge: true },
      );
    }

    // If accepted — create Firebase Auth account, Firestore rep profile, send login email
    if (response === 'accepted') {
      const applicantDoc = data.applicantId
        ? await adminDb.collection('applicants').doc(data.applicantId).get()
        : null;
      const phone = applicantDoc?.exists ? (applicantDoc.data()?.phone ?? '') : '';

      const tempPassword =
        randomBytes(6).toString('base64url') +
        randomBytes(3).toString('base64url').toUpperCase() +
        '!7';

      try {
        const userRecord = await adminAuth.createUser({
          email: data.applicantEmail,
          password: tempPassword,
          displayName: data.applicantName,
        });

        // Generate unique refSlug from first name
        const firstName = data.applicantName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        let refSlug = firstName;
        const existing = await adminDb.collection('reps').where('refSlug', '==', refSlug).get();
        if (!existing.empty) {
          let counter = 2;
          while (!(await adminDb.collection('reps').where('refSlug', '==', `${firstName}${counter}`).get()).empty) {
            counter++;
          }
          refSlug = `${firstName}${counter}`;
        }

        await adminDb.collection('reps').doc(userRecord.uid).set({
          uid: userRecord.uid,
          name: data.applicantName,
          email: data.applicantEmail,
          phone,
          status: 'active',
          careerRank: 'bronze',
          commissionRate: 0,
          refSlug,
          notes: '',
          applicantId: data.applicantId ?? null,
          joinedAt: FieldValue.serverTimestamp(),
        });

        const onboardingResult = await resend.emails.send({
          from: 'CrftdWeb <admin@crftdweb.com>',
          to: [data.applicantEmail],
          subject: `Welcome to CrftdWeb, ${data.applicantName.split(' ')[0]}!`,
          html: buildOnboardingEmail(data.applicantName, data.applicantEmail, tempPassword),
          text: `Hi ${data.applicantName.split(' ')[0]},\n\nYou're officially on the team. Welcome to CrftdWeb.\n\nYour rep portal is ready. Log in with these credentials:\n\nEmail: ${data.applicantEmail}\nTemp password: ${tempPassword}\n\nLog in at: ${BASE_URL}/rep/signin\n\nReference Documents:\n- Onboarding Pack: ${BASE_URL}/rep-onboarding-pack.html\n- Contractor Agreement: ${BASE_URL}/docs/rep-contractor-agreement.html\n\nChange your password after your first login.\n\nCrftdWeb · crftdweb.com`,
        }).catch((err: unknown) => {
          console.error('Failed to send onboarding email:', err);
          // Notify admin that the onboarding email failed so they can resend manually
          resend.emails.send({
            from: 'CrftdWeb <admin@crftdweb.com>',
            to: ['admin@crftdweb.com'],
            subject: `⚠️ Onboarding email failed for ${data.applicantName}`,
            html: `<p>The onboarding email to <strong>${data.applicantName}</strong> (${data.applicantEmail}) failed to send.</p><p>Their account was created with temp password: <code>${tempPassword}</code></p><p>Please resend their login details manually from the Admin Emails page.</p>`,
          }).catch(() => {});
          return null;
        });
      } catch (createErr: unknown) {
        console.error('Failed to create rep account:', createErr);
        // Notify admin so they can intervene manually
        if (process.env.RESEND_API_KEY) {
          const errMsg = createErr instanceof Error ? createErr.message : String(createErr);
          await resend.emails.send({
            from: 'CrftdWeb <admin@crftdweb.com>',
            to: ['admin@crftdweb.com'],
            subject: `⚠️ Rep account creation failed for ${data.applicantName}`,
            html: `<p>The offer was accepted but account creation failed for <strong>${data.applicantName}</strong> (${data.applicantEmail}).</p><p>Error: <code>${errMsg}</code></p><p>Please create their account manually from the Admin panel.</p>`,
          }).catch(() => {});
        }
      }
    }

    // Notify admin
    const emoji = response === 'accepted' ? '✅' : '❌';
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'CrftdWeb <admin@crftdweb.com>',
        to: ['admin@crftdweb.com'],
        subject: `${emoji} ${data.applicantName} ${response} the offer`,
        html: `<p><strong>${data.applicantName}</strong> (${data.applicantEmail}) has <strong>${response}</strong> the rep offer.</p>`,
      }).catch(() => {});
    }
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHANNEL_ID) {
      await sendMessage(
        process.env.TELEGRAM_CHANNEL_ID,
        `${emoji} <b>${data.applicantName}</b> ${response} the rep offer.\n${data.applicantEmail}`,
      ).catch(() => {});
    }

    return NextResponse.json({ success: true, response });
  } catch (err) {
    console.error('offer respond:', err);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
