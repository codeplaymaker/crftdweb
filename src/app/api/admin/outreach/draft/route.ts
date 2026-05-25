import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

const CV_SUMMARY = `
Name: Obinna Eze-Elijah
Location: Bristol, UK
Email: obiezeelijah@gmail.com
GitHub: github.com/codeplaymaker

Profile: Full-stack developer who transitioned into software engineering in 2024. Built two live production SaaS platforms from scratch:
- CRFTD (crftdweb.com): web agency SaaS with 8 AI agents, a lead-generation pipeline (Google Places API, PageSpeed Insights, GPT-4o-mini), Telegram bot, and a business coaching system. Next.js 15, TypeScript, React 19, Firebase, OpenAI, Tailwind CSS.
- MarketPlaymaker (marketplaymaker.com): quantitative trading platform with Monte Carlo VaR modelling, a live crypto trading bot in Python, trade journaling, and live data feeds. React, Python, Docker, Firebase, Railway.
- Freelance client: microbiomedesign.org (£500) — marketing and e-commerce site for a science consultancy.
- The Designer Box (£150) — star rating/review system.

Stack: Next.js 15, TypeScript, React 19, Tailwind CSS, Firebase Auth + Firestore, OpenAI SDK, Vercel, Railway, Docker, Playwright, Vitest.
`;

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!OPENAI_API_KEY) return NextResponse.json({ error: 'OpenAI key not configured' }, { status: 500 });

  const body = await req.json();
  const { type, company, description, role } = body;

  if (!type || !company) {
    return NextResponse.json({ error: 'type and company are required' }, { status: 400 });
  }

  let systemPrompt: string;
  let userPrompt: string;

  if (type === 'job') {
    systemPrompt = `You are writing a short, natural outreach message on behalf of Obinna Eze-Elijah for a job application.
Rules:
- 4–5 sentences maximum
- Natural, direct, human tone — not formal or AI-sounding
- No bullet points, no em-dashes, no filler phrases like "I hope this finds you well"
- Reference specific things from the job description where relevant
- Mention his live platforms (crftdweb.com or marketplaymaker.com) if relevant
- Sign off: "Obinna"
CV: ${CV_SUMMARY}`;

    userPrompt = `Company: ${company}
Role: ${role ?? 'Developer'}
Job description: ${description ?? 'Not provided'}

Write a personalised outreach message for this role.`;
  } else {
    systemPrompt = `You are writing a short cold email on behalf of Obinna Eze-Elijah to a web design / digital agency, introducing himself as a freelance developer available for overflow or subcontract work.
Rules:
- 5–6 sentences maximum
- Natural, direct, human tone — not formal or AI-sounding
- No bullet points, no em-dashes, no filler phrases
- Mention his stack: Next.js, React, TypeScript, Tailwind CSS, Firebase
- Mention crftdweb.com as a portfolio example
- Offer to share his CV or jump on a quick call
- Sign off: "Obinna"
CV: ${CV_SUMMARY}`;

    userPrompt = `Agency name: ${company}
About the agency: ${description ?? 'Web design and development agency'}

Write a personalised cold email introducing Obinna as a freelance developer for overflow/subcontract work.`;
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
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'OpenAI request failed' }, { status: 500 });
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content?.trim() ?? '';

  return NextResponse.json({ message });
}
