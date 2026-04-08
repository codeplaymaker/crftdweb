/**
 * API Route: Audio Transcription via Whisper
 *
 * Transcribes mic audio from rep training roleplay sessions.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await verifyRepAuth(req);
  if (auth instanceof NextResponse) return auth;

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

    // Normalise the file so Whisper gets a recognised extension + MIME type.
    // Some browsers (Safari/iOS) produce mimeTypes like "audio/mp4;codecs=…" or
    // "audio/aac" that Whisper rejects. Map to an extension Whisper accepts.
    const mimeMap: Record<string, { ext: string; mime: string }> = {
      'audio/webm':  { ext: 'webm', mime: 'audio/webm' },
      'audio/ogg':   { ext: 'ogg',  mime: 'audio/ogg' },
      'audio/mp4':   { ext: 'm4a',  mime: 'audio/m4a' },
      'audio/m4a':   { ext: 'm4a',  mime: 'audio/m4a' },
      'audio/aac':   { ext: 'm4a',  mime: 'audio/m4a' },
      'audio/mpeg':  { ext: 'mp3',  mime: 'audio/mpeg' },
      'audio/mp3':   { ext: 'mp3',  mime: 'audio/mpeg' },
      'audio/wav':   { ext: 'wav',  mime: 'audio/wav' },
      'audio/flac':  { ext: 'flac', mime: 'audio/flac' },
      'audio/x-m4a': { ext: 'm4a',  mime: 'audio/m4a' },
    };
    const baseMime = audioFile.type.split(';')[0].trim().toLowerCase();
    const mapping = mimeMap[baseMime] ?? { ext: 'webm', mime: 'audio/webm' };

    const whisperFile = new File(
      [audioFile],
      `recording.${mapping.ext}`,
      { type: mapping.mime },
    );

    const transcription = await openai.audio.transcriptions.create({
      file: whisperFile,
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
