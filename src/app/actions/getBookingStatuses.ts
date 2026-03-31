'use server';

import { adminDb } from '@/lib/firebase/admin';

export interface BookingStatus {
  booked: boolean;
  slotLabel?: string;
  slotDateTime?: string;
}

export async function getBookingStatuses(
  emails: string[],
): Promise<Record<string, BookingStatus>> {
  if (emails.length === 0) return {};
  try {
    const snap = await adminDb
      .collection('bookingTokens')
      .where('used', '==', true)
      .get();

    const result: Record<string, BookingStatus> = {};
    await Promise.all(
      snap.docs.map(async (doc) => {
        const data = doc.data();
        if (!emails.includes(data.applicantEmail) || !data.slotId) return;
        const slotDoc = await adminDb.collection('screeningSlots').doc(data.slotId).get();
        if (!slotDoc.exists) return;
        const slot = slotDoc.data()!;
        result[data.applicantEmail] = {
          booked: true,
          slotLabel: slot.label as string,
          slotDateTime: slot.dateTime as string,
        };
      }),
    );
    return result;
  } catch (err) {
    console.error('getBookingStatuses:', err);
    return {};
  }
}
