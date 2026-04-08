import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Notify admin
    if (process.env.RESEND_API_KEY) {
      const emoji = response === 'accepted' ? '✅' : '❌';
      await resend.emails.send({
        from: 'CrftdWeb <admin@crftdweb.com>',
        to: ['admin@crftdweb.com'],
        subject: `${emoji} ${data.applicantName} ${response} the offer`,
        html: `<p><strong>${data.applicantName}</strong> (${data.applicantEmail}) has <strong>${response}</strong> the rep offer.</p>${response === 'accepted' ? '<p>Next step: Create their account in <a href="https://crftdweb.com/admin/reps">Admin → Reps</a>.</p>' : ''}`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, response });
  } catch (err) {
    console.error('offer respond:', err);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
