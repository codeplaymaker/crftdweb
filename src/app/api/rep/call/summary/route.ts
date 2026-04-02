/**
 * API Route: Rep Live Call — Post-Call Summary
 * Generates a structured summary when the call ends.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SummaryRequest {
  transcript: { speaker: 'rep' | 'prospect' | 'unknown'; text: string; timestamp?: number }[];
  leadName: string;
  businessType?: string;
  callGoal?: string;
  duration: number;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, leadName, businessType, callGoal, duration, notes } = body as SummaryRequest;

    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json({
        summary: 'No conversation recorded.',
        keyPoints: [],
        objectionsMet: [],
        actionItems: [],
        outcome: 'unknown',
        nextSteps: [],
        recommendedNextStep: '',
        sentiment: 'neutral',
        callBooked: false,
      });
    }

    const transcriptText = transcript
      .map((t) => `${t.speaker === 'prospect' ? (leadName || 'Prospect') : 'Rep'}: ${t.text}`)
      .join('\n');

    const systemPrompt = `You are a cold call analyst for CrftdWeb, a UK web design studio.
Analyse this cold call and return a structured JSON summary.

The rep's goal was to book a 15-minute discovery call with one of our developers.

Respond in this exact JSON format:
{
  "summary": "<2-3 sentence summary of what happened>",
  "keyPoints": ["<key thing 1>", "<key thing 2>"],
  "objectionsMet": ["<objection that came up>"],
  "actionItems": ["<specific action the rep must take>"],
  "outcome": "<booked | follow_up | not_interested | callback>",
  "nextSteps": ["<action 1>", "<action 2>"],
  "recommendedNextStep": "<single most important next action>",
  "sentiment": "<positive | neutral | negative>",
  "callBooked": <true | false>,
  "followUpEmail": "<optional — a short follow-up email to send if call not booked>"
}`;

    const userPrompt = `PROSPECT: ${leadName}${businessType ? ` (${businessType})` : ''}
CALL GOAL: ${callGoal || 'Book a 15-minute discovery call'}
DURATION: ${Math.round(duration / 60)} minutes
${notes ? `\nREP NOTES: ${notes}` : ''}

TRANSCRIPT:
${transcriptText}

Generate the call summary.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 900,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'Summary generation failed' }, { status: 500 });
  }
}
