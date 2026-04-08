/**
 * API Route: Post-Call Whisper Transcription
 * Transcribes recorded audio using OpenAI Whisper for accurate post-call transcript.
 * Vercel has a 4.5MB body size limit on serverless functions.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await verifyRepAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const fileSizeMB = audioFile.size / (1024 * 1024);
    if (fileSizeMB > 20) {
      return NextResponse.json(
        { error: `File too large (${fileSizeMB.toFixed(1)}MB). Max 20MB for Whisper.` },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    });

    return NextResponse.json({
      text: transcription.text,
      segments: transcription.segments?.map((seg) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
      })),
      duration: transcription.duration,
    });
  } catch (error: unknown) {
    console.error('Whisper transcription error:', error);

    const msg = error instanceof Error ? error.message : 'Failed to transcribe audio';
    if (msg.includes('file is too short')) {
      return NextResponse.json(
        { error: 'Audio too short. Please record at least a few seconds.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
