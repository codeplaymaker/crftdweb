import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { token, slotId } = await req.json() as { token: string; slotId: string };
    if (!token || !slotId) {
      return NextResponse.json({ error: 'token and slotId required' }, { status: 400 });
    }

    const tokenDoc = await adminDb.collection('bookingTokens').doc(token).get();
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
        bookedByEmail: tokenData.applicantEmail,
        bookedByName: tokenData.applicantName,
        bookedAt: new Date().toISOString(),
      });

      txn.update(adminDb.collection('bookingTokens').doc(token), {
        used: true,
        usedAt: new Date().toISOString(),
        slotId,
      });
    });

    return NextResponse.json({ success: true, label: slotLabel, dateTime: slotDateTime });
  } catch (err: unknown) {
    console.error('book slot:', err);
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
