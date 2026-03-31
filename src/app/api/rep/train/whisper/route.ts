/**
 * API Route: Audio Transcription via Whisper
 *
 * Transcribes mic audio from rep training roleplay sessions.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const fileSizeMB = audioFile.size / (1024 * 1024);
    if (fileSizeMB > 20) {
      return NextResponse.json(
        { error: `File too large (${fileSizeMB.toFixed(1)}MB). Max 20MB.` },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error: unknown) {
    console.error('Whisper transcription error:', error);
    const message = error instanceof Error ? error.message : 'Failed to transcribe audio';
    if (message.includes('file is too short')) {
      return NextResponse.json({ error: 'Too short — hold the button for at least a second.' }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
