'use server';

import { adminDb } from '@/lib/firebase/admin';

export async function deleteScreeningSlot(slotId: string): Promise<{ success: boolean; error?: string }> {
  if (!slotId) return { success: false, error: 'slotId required' };
  try {
    await adminDb.collection('screeningSlots').doc(slotId).delete();
    return { success: true };
  } catch (err) {
    console.error('deleteScreeningSlot:', err);
    return { success: false, error: 'Failed to delete slot' };
  }
}
