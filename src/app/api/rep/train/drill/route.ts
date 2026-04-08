/**
 * API Route: Rep Training — Drill Rating
 * Rates a single drill response (objection, opener, booking, gatekeeper, reframe).
 * Uses gpt-4o-mini for cost efficiency on rapid feedback loops.
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
    const { systemPrompt, drillType, prompt, context, userResponse, idealFrameworks } = body as {
      systemPrompt: string;
      drillType: string;
      prompt: string;
      context?: string;
      userResponse: string;
      idealFrameworks: string[];
    };

    if (!prompt || !userResponse) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userPrompt = `DRILL TYPE: ${drillType.replace(/_/g, ' ')}

SITUATION/PROMPT:
"${prompt}"
${context ? `\nCONTEXT: ${context}` : ''}

IDEAL FRAMEWORKS TO APPLY: ${idealFrameworks.join(', ')}

REP'S RESPONSE:
"${userResponse}"

Rate this response. Respond in this exact JSON format:
{
  "rating": <1-10>,
  "feedback": "<2-3 sentences of direct, specific feedback>",
  "idealResponse": "<example of an excellent response to this exact prompt>",
  "frameworkUsed": "<which framework principle they used or missed most>"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 400,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(raw);

    return NextResponse.json({
      rating: Math.min(10, Math.max(1, result.rating || 5)),
      feedback: result.feedback || '',
      idealResponse: result.idealResponse || '',
      frameworkUsed: result.frameworkUsed || '',
    });
  } catch {
    return NextResponse.json({ error: 'Drill rating failed' }, { status: 500 });
  }
}
