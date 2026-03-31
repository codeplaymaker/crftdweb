'use server';

import { adminDb } from '@/lib/firebase/admin';
import { randomUUID } from 'crypto';

export interface ScreeningSlot {
  id: string;
  dateTime: string; // ISO
  label: string;
  available: boolean;
  bookedByEmail: string | null;
  bookedByName: string | null;
  bookedAt: string | null;
  outcome: 'approved' | 'rejected' | null;
  createdAt: string;
}

export async function createScreeningSlot(
  dateTime: string,
  label: string,
): Promise<{ success: boolean; slot?: ScreeningSlot; error?: string }> {
  if (!dateTime || !label) return { success: false, error: 'dateTime and label required' };
  try {
    const id = randomUUID();
    const slot: ScreeningSlot = {
      id, dateTime, label,
      available: true,
      bookedByEmail: null, bookedByName: null, bookedAt: null,
      outcome: null,
      createdAt: new Date().toISOString(),
    };
    await adminDb.collection('screeningSlots').doc(id).set(slot);
    return { success: true, slot };
  } catch (err) {
    console.error('createScreeningSlot:', err);
    return { success: false, error: 'Failed to create slot' };
  }
}
