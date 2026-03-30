import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snap = await adminDb.collection('cv_reviews').get();
    const docs = snap.docs.map(d => d.data());
    return NextResponse.json({
      total: docs.length,
      bookCall: docs.filter(d => d.verdict === 'Book Screening Call').length,
      sendTask: docs.filter(d => d.verdict === 'Send Trial Task').length,
      pass: docs.filter(d => d.verdict === 'Pass').length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let cvText = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      const buffer = Buffer.from(await file.arrayBuffer());
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse');
      const parsed = await pdfParse(buffer);
      cvText = parsed.text;
    } else {
      const body = await req.json();
      cvText = body.cvText || '';
    }

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: 'CV text too short or could not be extracted' }, { status: 400 });
    }

    const prompt = `You are a hiring assistant for CrftdWeb, a UK web design agency looking for commission-only sales reps who cold call small businesses to book website consultations.

The role requires: picking up the phone, calling strangers, handling rejection, and booking calls. No base salary — 15% commission only. Reps need to be confident, persuasive, and resilient.

Analyse this CV and return a JSON object with these exact fields:

- verdict: One of exactly: "Book Screening Call", "Send Trial Task", "Pass"
  - "Book Screening Call" = strong sales/outreach/cold calling background, high confidence
  - "Send Trial Task" = some relevant experience OR strong communicator worth testing
  - "Pass" = no relevant experience, wrong fit
- score: Number 1-10 (10 = perfect fit)
- name: The candidate's full name as on the CV
- email: Their email address if found, otherwise empty string
- salesSignals: Array of up to 3 short strings highlighting relevant experience (cold calling, outreach, sales, customer-facing persuasion). Empty array if none.
- reasons: Array of exactly 2-3 short bullet point strings explaining the verdict
- redFlags: Array of short strings for any concerns (gaps, no UK experience, wrong industry, etc). Empty array if none.

Rules:
- Be direct and honest — this is a small agency needing results fast
- Prioritise: cold calling, door-to-door, outbound telesales, estate agency, recruitment, direct sales
- Secondary: any customer-facing role where persuasion was needed (retail, hospitality, account management)
- Deprioritise: purely technical or creative roles with no client interaction
- "communications skills" listed as a skill without evidence = weak signal
- Actual sales targets met, commission earned, outbound calls made = strong signal

CV:
${cvText.slice(0, 3000)}

Return ONLY valid JSON, no markdown.`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    });

    const text = res.choices[0]?.message?.content || '';
    const result = JSON.parse(text);

    // Log to Firestore (fire-and-forget, don't block response)
    adminDb.collection('cv_reviews').add({
      name: result.name || '',
      email: result.email || '',
      verdict: result.verdict || '',
      score: result.score || 0,
      reviewedAt: new Date(),
    }).catch((e: unknown) => console.error('Firestore log error:', e));

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('CV review error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
