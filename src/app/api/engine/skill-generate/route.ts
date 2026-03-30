import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/engine/auth-guard';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a skill designer for an AI agent platform. The user will describe a task or capability they want their AI agent to have. Generate a structured skill definition that will be injected into the agent's system prompt.

Return ONLY valid JSON with these exact fields:
- name: Short skill name (3-6 words, title case)
- trigger: Comma-separated keywords/phrases that should activate this skill (5-10 keywords)
- prompt: A 2-4 sentence system prompt injection. Write in second person ("You have expertise in..."). Be specific and actionable.
- tools: Array of tool names this skill should use. Choose from: ["read_saved_offer", "get_truth_report", "save_to_memory", "read_from_memory"]. Return empty array [] if no tools are needed.

Example for "help me write cold emails":
{
  "name": "Cold Email Outreach Expert",
  "trigger": "cold email, outreach, email campaign, follow up, prospecting, reply rate, open rate",
  "prompt": "You have deep expertise in cold email outreach and B2B prospecting. You write emails that achieve high open and reply rates using proven frameworks like PAS (Problem-Agitation-Solution) and AIDA. Always personalise the opening line, keep emails under 150 words, and include a single low-friction CTA.",
  "tools": []
}

Example for "remember things about my prospects":
{
  "name": "Prospect Memory Tracker",
  "trigger": "remember, prospect, lead, client, save, note, recall, history",
  "prompt": "You have the ability to save and recall facts about prospects and clients. When the user shares important information about a lead or client, proactively save it using the save_to_memory tool. When discussing a specific person, use read_from_memory to retrieve what you know about them.",
  "tools": ["save_to_memory", "read_from_memory"]
}`;

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) return unauthorizedResponse();

  try {
    const { description } = await request.json();

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: description },
        ],
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error('OpenAI error generating skill');
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const skill = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ skill });
  } catch (error) {
    console.error('Skill generate error:', error);
    return NextResponse.json({ error: 'Failed to generate skill' }, { status: 500 });
  }
}
