/**
 * API Route: Rep Live Call — Pre-Call Prep Notes
 * Generates AI talking points, predicted objections, and opening strategy
 * based on what the rep knows about the business before dialling.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadName, businessType, callGoal, additionalContext } = body as {
      leadName: string;
      businessType?: string;
      callGoal?: string;
      additionalContext?: string;
    };

    if (!leadName) {
      return NextResponse.json({ error: 'leadName required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert cold call coach for CrftdWeb, a UK web design studio.
The rep's ONLY goal is to book a 15-minute discovery call with Obi (the founder/developer).
They are NOT closing a deal. They are NOT quoting prices. They are ONLY booking a call.

Generate pre-call prep notes in this exact JSON format:
{
  "opener": "<suggested opening line — must not sound like a generic cold call>",
  "keyObjective": "<single most important thing to achieve on this call>",
  "talkingPoints": [
    { "topic": "string", "question": "string", "why": "string" }
  ],
  "potentialObjections": [
    { "objection": "string", "response": "string" }
  ],
  "closingStrategy": "<how to ask for the call booking specifically for this prospect>",
  "warningsOrTips": ["string"]
}

Include 3 talking points, 3–4 predicted objections, and 2–3 warnings.
Be specific. Reference the business type and goal. No generic advice.`;

    const userPrompt = `BUSINESS NAME / CONTACT: ${leadName}
BUSINESS TYPE: ${businessType || 'unknown business type'}
CALL GOAL: ${callGoal || 'Book a 15-minute discovery call'}
ADDITIONAL CONTEXT: ${additionalContext || 'none'}

Generate pre-call prep notes for this cold call.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 800,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const prep = JSON.parse(raw);
    return NextResponse.json(prep);
  } catch {
    return NextResponse.json({ error: 'Prep generation failed' }, { status: 500 });
  }
}
