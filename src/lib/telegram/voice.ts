import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

/**
 * Downloads a Telegram voice/audio file and transcribes it via Whisper.
 */
export async function transcribeVoice(fileId: string): Promise<string> {
  // Get the file path from Telegram
  const fileRes = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`,
  );
  const fileData = await fileRes.json();
  const filePath = fileData.result?.file_path;
  if (!filePath) throw new Error('Could not get Telegram file path');

  // Download the audio buffer
  const audioRes = await fetch(
    `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`,
  );
  if (!audioRes.ok) throw new Error('Could not download audio from Telegram');
  const audioBuffer = await audioRes.arrayBuffer();

  // Send to Whisper
  const audioFile = new File([audioBuffer], 'voice.ogg', { type: 'audio/ogg' });
  const transcription = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: audioFile,
    language: 'en',
  });

  return transcription.text;
}

/**
 * Converts text to speech using OpenAI TTS.
 * Returns an OGG/OPUS buffer — the format Telegram's sendVoice expects.
 */
export async function textToSpeech(text: string): Promise<Buffer> {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
    response_format: 'opus',
  });
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
