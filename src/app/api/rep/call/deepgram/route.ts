/**
 * API Route: Deepgram Live Transcription Token
 * Returns the API key for client-side WebSocket connection to Deepgram.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

export async function GET(request: NextRequest) {
  const auth = await verifyRepAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      apiKey,
      wsUrl: 'wss://api.deepgram.com/v1/listen',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to get Deepgram token' },
      { status: 500 }
    );
  }
}
