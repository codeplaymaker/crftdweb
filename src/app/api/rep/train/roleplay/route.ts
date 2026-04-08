/**
 * API Route: Rep Training — AI Roleplay
 * AI streams as a skeptical UK business owner during a cold call roleplay.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  const auth = await verifyRepAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { systemPrompt, messages, difficulty } = body as {
      systemPrompt: string;
      messages: { role: 'prospect' | 'rep'; content: string }[];
      difficulty: string;
    };

    if (!systemPrompt || !messages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    // When no messages yet, seed with a trigger so the AI answers the phone
    if (messages.length === 0) {
      openaiMessages.push({ role: 'user', content: '[phone ringing — you pick up]' });
    }

    for (const msg of messages) {
      openaiMessages.push({
        role: msg.role === 'rep' ? 'user' : 'assistant',
        content: msg.content,
      });
    }

    const maxTokens = difficulty === 'elite' ? 120 : difficulty === 'advanced' ? 100 : 80;

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      max_tokens: maxTokens,
      temperature: 0.8,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
    });
  } catch (err) {
    console.error('[roleplay] Error:', err);
    return NextResponse.json({ error: 'Roleplay failed' }, { status: 500 });
  }
}
