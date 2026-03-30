/**
 * API Route: Rep Live Call — Real-time Transcription Token
 * Returns an AssemblyAI token for WebSocket transcription,
 * or falls back to browser Web Speech API if key not configured.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        token: null,
        fallback: true,
        message: 'Using browser speech recognition',
      });
    }

    const response = await fetch('https://api.assemblyai.com/v2/realtime/token', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expires_in: 3600 }),
    });

    if (!response.ok) {
      return NextResponse.json({
        token: null,
        fallback: true,
        message: 'AssemblyAI unavailable, using browser speech recognition',
      });
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token, fallback: false });
  } catch {
    return NextResponse.json({ token: null, fallback: true, message: 'Falling back to browser STT' });
  }
}
