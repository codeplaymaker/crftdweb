import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

function buildHtml(name: string): string {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've reached Silver — CrftdWeb</title>
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

              <!-- Rank badge -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#0a0a0a;border-radius:12px;padding:20px 28px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35);">New Rank Unlocked</p>
                    <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">🥈 Silver Rep</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:16px;color:#111;line-height:1.6;font-weight:600;">
                Nice work, ${firstName}.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
                You've completed your training and hit the threshold — your <strong>lead pipeline is now unlocked</strong>.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;">
                This is where it gets real. Log in, start adding businesses you're speaking to, and track every deal through to close. Every conversation you have is a commission opportunity.
              </p>

              <!-- What's unlocked -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#f8f9fa;border-radius:10px;border:1px solid #e8e8e8;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888;">What You've Unlocked</p>
                    ${[
                      'Lead pipeline — log and track every business you speak to',
                      'Commission on every deal you win',
                      'Silver commission rates unlock immediately',
                      'Live Call Assistant — real-time AI support on every call',
                    ].map(point => `
                    <p style="margin:0 0 10px;font-size:14px;color:#333;line-height:1.6;padding-left:18px;position:relative;">
                      <span style="position:absolute;left:0;color:#111;font-weight:700;">✓</span>
                      ${point}
                    </p>`).join('')}
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px;font-size:13px;color:#888;line-height:1.7;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;">
                <strong style="color:#92400e;">Heads up:</strong> For now, calls are made from your own phone — the Live Call Assistant runs on-screen while you're on the call. Direct calling from a CrftdWeb number is coming soon.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                <tr>
                  <td style="background:#111;border-radius:8px;">
                    <a href="${BASE_URL}/rep/leads" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Start your pipeline &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px;font-size:13px;color:#aaa;line-height:1.7;">
                You've done the training. Now it's time to use it.
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
              <p style="margin:0;font-size:11px;color:#aaa;">admin@crftdweb.com · crftdweb.com · Bristol, UK</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json() as { userId?: string };
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    // Fetch rep profile from Firestore
    const repDoc = await adminDb.collection('reps').doc(userId).get();
    if (!repDoc.exists) return NextResponse.json({ error: 'Rep not found' }, { status: 404 });

    const rep = repDoc.data()!;
    const name: string = rep.name ?? 'Rep';
    const email: string = rep.email;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'No valid email on rep profile' }, { status: 400 });
    }

    // Guard: don't send twice
    if (rep.silverEmailSentAt) {
      return NextResponse.json({ skipped: true, reason: 'Already sent' });
    }

    await resend.emails.send({
      from: 'CrftdWeb <admin@crftdweb.com>',
      to: [email.trim().toLowerCase()],
      subject: `${name.split(' ')[0]}, your lead pipeline is now unlocked 🥈`,
      html: buildHtml(name),
    });

    // Mark as sent so it never fires twice
    await adminDb.collection('reps').doc(userId).update({ silverEmailSentAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('silver-promotion:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
