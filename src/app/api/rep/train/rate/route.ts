/**
 * API Route: Rep Training — Session Rating
 * Full post-session evaluation against the 10 sales frameworks.
 * Scores 6 categories, gives grade, coaching priority.
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
    const { ratingSystemPrompt, scenario, messages, duration } = body as {
      ratingSystemPrompt: string;
      scenario: {
        name: string;
        difficulty: string;
        objectives: string[];
        prospectProfile: { name: string; businessType: string };
      };
      messages: { role: 'prospect' | 'rep'; content: string; timestamp: number }[];
      duration: number;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages to rate' }, { status: 400 });
    }

    const transcript = messages
      .map((m) => `${m.role === 'rep' ? 'REP' : 'PROSPECT'}: ${m.content}`)
      .join('\n');

    const userPrompt = `SCENARIO: ${scenario.name} (${scenario.difficulty})
PROSPECT: ${scenario.prospectProfile.name} — ${scenario.prospectProfile.businessType}
OBJECTIVES: ${scenario.objectives.join(', ')}
DURATION: ${Math.round(duration / 60)} minutes

FULL TRANSCRIPT:
${transcript}

Rate this session now.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: ratingSystemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1200,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const rating = JSON.parse(raw);

    return NextResponse.json(rating);
  } catch {
    return NextResponse.json({ error: 'Session rating failed' }, { status: 500 });
  }
}
