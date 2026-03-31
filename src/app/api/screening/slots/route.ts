import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snap = await adminDb
      .collection('screeningSlots')
      .where('available', '==', true)
      .orderBy('dateTime', 'asc')
      .get();

    const slots = snap.docs.map((d) => {
      const data = d.data();
      return { id: data.id as string, label: data.label as string, dateTime: data.dateTime as string };
    });

    return NextResponse.json(slots);
  } catch (err) {
    console.error('GET screening slots:', err);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
