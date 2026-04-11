import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function clientConfirmHtml(name: string, label: string): string {
  const firstName = name.split(' ')[0];
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
              You&apos;re confirmed! Your 15-minute discovery call with CrftdWeb is booked for:
            </p>
            <div style="margin:0 0 24px;background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;text-align:center;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#111;">${label}</p>
            </div>
            <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.7;">Join the call using Google Meet:</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#111;border-radius:8px;">
                  <a href="https://meet.google.com/sht-kzhd-yxg" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Join Google Meet &rarr;
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 16px;font-size:14px;color:#666;line-height:1.7;">
              If you need to reschedule, just reply to this email.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="border-top:1px solid #e8e8e8;"></td></tr>
            </table>
            <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
            <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminNotifyHtml(contactName: string, contactEmail: string, label: string, repName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
            <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
          </td>
        </tr>
        <tr><td style="background:#fff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:32px 40px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#999;">CrftdWeb — Discovery Call Booked</p>
          <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111;">📅 ${contactName} booked a discovery call</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <tr>
              <td style="font-size:13px;color:#666;padding-bottom:8px;"><strong style="color:#111;">Prospect:</strong> ${contactName}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#666;padding-bottom:8px;"><strong style="color:#111;">Email:</strong> ${contactEmail}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#666;padding-bottom:8px;"><strong style="color:#111;">Time:</strong> ${label}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#666;"><strong style="color:#111;">Booked by rep:</strong> ${repName}</td>
            </tr>
          </table>
          <p style="margin:0;font-size:13px;color:#999;">View all bookings at <a href="https://www.crftdweb.com/admin/calendar" style="color:#111;">crftdweb.com/admin/calendar</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { token, slotId } = await req.json() as { token: string; slotId: string };
    if (!token || !slotId) {
      return NextResponse.json({ error: 'token and slotId required' }, { status: 400 });
    }

    const tokenDoc = await adminDb.collection('discoveryTokens').doc(token).get();
    if (!tokenDoc.exists) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

    const tokenData = tokenDoc.data()!;
    if (tokenData.used) return NextResponse.json({ error: 'Already booked' }, { status: 400 });
    if (new Date(tokenData.expiresAt as string) < new Date()) {
      return NextResponse.json({ error: 'Link expired' }, { status: 400 });
    }

    const slotRef = adminDb.collection('screeningSlots').doc(slotId);

    let slotLabel = '';
    let slotDateTime = '';

    await adminDb.runTransaction(async (txn) => {
      const slotSnap = await txn.get(slotRef);
      if (!slotSnap.exists) throw new Error('not_found');
      const slot = slotSnap.data()!;
      if (!slot.available) throw new Error('slot_taken');

      slotLabel = slot.label as string;
      slotDateTime = slot.dateTime as string;

      txn.update(slotRef, {
        available: false,
        bookedByEmail: tokenData.contactEmail,
        bookedByName: tokenData.contactName,
        bookedAt: new Date().toISOString(),
        bookingType: 'discovery',
      });

      txn.update(adminDb.collection('discoveryTokens').doc(token), {
        used: true,
        usedAt: new Date().toISOString(),
        slotId,
      });
    });

    // Update the lead record
    if (tokenData.leadId) {
      await adminDb.collection('leads').doc(tokenData.leadId as string).update({
        discoveryCallSlot: slotLabel,
        discoveryCallDateTime: slotDateTime,
        discoveryCallBookedAt: new Date().toISOString(),
      });
    }

    // Send emails after transaction
    const contactEmail = tokenData.contactEmail as string;
    const contactName = tokenData.contactName as string;
    const repName = tokenData.repName as string;

    await Promise.allSettled([
      resend.emails.send({
        from: 'CrftdWeb <admin@crftdweb.com>',
        to: [contactEmail],
        subject: `CrftdWeb — Discovery call confirmed for ${slotLabel}`,
        html: clientConfirmHtml(contactName, slotLabel),
      }),
      resend.emails.send({
        from: 'CrftdWeb Bookings <admin@crftdweb.com>',
        to: ['admin@crftdweb.com'],
        subject: `📅 Discovery call: ${contactName} booked — ${slotLabel} (via ${repName})`,
        html: adminNotifyHtml(contactName, contactEmail, slotLabel, repName),
      }),
    ]);

    return NextResponse.json({ success: true, label: slotLabel, dateTime: slotDateTime });
  } catch (err: unknown) {
    console.error('book discovery slot:', err);
    const msg = err instanceof Error ? err.message : 'failed';
    if (msg === 'slot_taken') {
      return NextResponse.json({ error: 'Slot just got taken — please pick another' }, { status: 409 });
    }
    if (msg === 'not_found') {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to book' }, { status: 500 });
  }
}
