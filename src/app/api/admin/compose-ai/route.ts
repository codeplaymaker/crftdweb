import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { to, subject, context } = await req.json() as { to?: string; subject?: string; context?: string };

  const prompt = [
    'You are writing a concise, professional email on behalf of Obi at CrftdWeb (a web design agency in Bristol, UK).',
    'Tone: direct, warm, no fluff. No subject line in the body. No sign-off sign-off header. End with: — Obi\\nCrftdWeb | crftdweb.com.',
    subject ? `Email subject: "${subject}"` : '',
    to ? `Recipient: ${to}` : '',
    context ? `Additional context: ${context}` : '',
    'Write only the email body. Plain text, no markdown.',
  ].filter(Boolean).join('\n');

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
  });
}
