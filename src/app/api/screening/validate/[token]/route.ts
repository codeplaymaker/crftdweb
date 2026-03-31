import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token) return NextResponse.json({ valid: false }, { status: 400 });

  try {
    const doc = await adminDb.collection('bookingTokens').doc(token).get();
    if (!doc.exists) return NextResponse.json({ valid: false });

    const data = doc.data()!;
    if (data.used) return NextResponse.json({ valid: false, reason: 'already_used' });
    if (new Date(data.expiresAt as string) < new Date()) {
      return NextResponse.json({ valid: false, reason: 'expired' });
    }

    return NextResponse.json({ valid: true, name: data.applicantName as string });
  } catch (err) {
    console.error('validate token:', err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
