'use server';

import { adminDb } from '@/lib/firebase/admin';
import type { ScreeningSlot } from './createScreeningSlot';

export async function getScreeningSlots(): Promise<ScreeningSlot[]> {
  try {
    const snap = await adminDb
      .collection('screeningSlots')
      .orderBy('dateTime', 'asc')
      .get();
    return snap.docs.map((d) => d.data() as ScreeningSlot);
  } catch (err) {
    console.error('getScreeningSlots:', err);
    return [];
  }
}
