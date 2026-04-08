/**
 * API Route: Text-to-Speech for Rep Training Roleplay
 *
 * Converts AI prospect text to speech using OpenAI TTS.
 * Returns MP3 audio for immediate playback.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

const PROSPECT_VOICES: Record<string, 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'> = {
  default: 'onyx',
  male_professional: 'onyx',
  female_professional: 'nova',
  male_aggressive: 'echo',
  female_skeptical: 'shimmer',
  male_friendly: 'fable',
  female_friendly: 'alloy',
};

export async function POST(req: NextRequest) {
  const auth = await verifyRepAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { text, voice: voiceKey } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const trimmedText = text.slice(0, 2000);
    const voice = PROSPECT_VOICES[voiceKey] ?? PROSPECT_VOICES.default;

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: trimmedText,
      speed: 1.0,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('TTS error:', error);
    const message = error instanceof Error ? error.message : 'TTS failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
