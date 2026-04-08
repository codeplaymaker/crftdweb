/**
 * API Route: Rep Live Call — Real-time AI Suggestions
 * Reads the current call transcript and returns the best next move.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SuggestionRequest {
  transcript: { speaker: 'rep' | 'prospect' | 'unknown'; text: string }[];
  leadName: string;
  businessType?: string;
  lastProspectMessage?: string;
  userQuestion?: string;
}

export async function POST(request: NextRequest) {
  const auth = await verifyRepAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { transcript, leadName, businessType, lastProspectMessage, userQuestion } = body as SuggestionRequest;

    if (!transcript || !Array.isArray(transcript) || !leadName) {
      return NextResponse.json({ error: 'transcript (array) and leadName are required' }, { status: 400 });
    }

    const systemPrompt = `You are a real-time cold call coach for CrftdWeb, a UK web design studio.
The rep's ONLY goal: book a 15-minute discovery call with one of our developers.
They are NOT closing, NOT quoting. Booking the call is the win.

You are coaching from the 10 best sales books:
SPIN Selling, Never Split the Difference, Influence, The Challenger Sale, Way of the Wolf,
Pitch Anything, Gap Selling, The Psychology of Selling, Pre-Suasion, To Sell Is Human.

Give ONE clear, actionable suggestion. What should the rep say RIGHT NOW?

Respond in this JSON format:
{
  "type": "answer" | "objection_handler" | "question" | "close" | "tip",
  "suggestion": "<exact phrase or approach to use — be specific, not generic>",
  "why": "<1 sentence explaining the framework behind it>",
  "framework": "<book/principle name>"
}

Be direct. Maximum 2 sentences for suggestion. Real calls are fast.`;

    const recentTranscript = transcript
      .slice(-8)
      .map((t) => `${t.speaker === 'prospect' ? (leadName || 'Prospect') : 'Rep'}: ${t.text}`)
      .join('\n');

    const queryContext = userQuestion || lastProspectMessage || 'What should I say to start the conversation?';

    const userPrompt = `PROSPECT: ${leadName}${businessType ? ` (${businessType})` : ''}

RECENT TRANSCRIPT:
${recentTranscript || '(Call just started)'}

${userQuestion ? `REP'S QUESTION: "${userQuestion}"` : `LAST PROSPECT MESSAGE: "${queryContext}"`}

What should the rep say or do right now?`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 400,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'Suggestion failed' }, { status: 500 });
  }
}
