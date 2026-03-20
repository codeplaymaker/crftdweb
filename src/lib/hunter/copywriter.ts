/**
 * AI copy generator using GPT-4o-mini.
 * Generates website copy for preview sites based on audit + business data.
 * Cost: ~$0.01 per business.
 */

import OpenAI from 'openai';
import type { Business, AuditResult } from './types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GeneratedCopy {
  headline: string;
  subheadline: string;
  problemHeadline: string;
  problemSubheadline: string;
  painPoints: string[];
  services: string[];
  ctaText: string;
  aboutSnippet: string;
}

export async function generatePreviewCopy(
  business: Business,
  audit: AuditResult,
): Promise<GeneratedCopy> {
  const city = business.address.split(',').slice(-2, -1)[0]?.trim() || 'your area';
  const niche = business.types?.[0]?.replace(/_/g, ' ') || 'local business';

  const prompt = `You are a copywriter building a real website for a local business. The copy must be 100% customer-facing — written as if this IS the business's actual website. No references to website problems, redesigns, or agencies.

Business: ${business.name}
Type: ${niche}
Location: ${city}
Rating: ${business.rating}/5 (${business.reviewCount} reviews)

Generate JSON with these exact fields:
- headline: Bold 6-10 word headline speaking to their CUSTOMERS. What problem does this business solve? (e.g. "Burst Pipe at 3am? We'll Be There in 30 Minutes")
- subheadline: 1 sentence, warm and conversational, about what makes this business the right choice for customers.
- problemHeadline: A punchy heading for the "why choose us" section, framed around the customer's pain (e.g. "Tired of Unreliable Tradespeople?" or "Finding a Good ${niche} Shouldn't Be This Hard")
- problemSubheadline: 1 sentence expanding on the customer's frustration that this business solves.
- painPoints: Array of 3 short strings — CUSTOMER pain points that this business solves (e.g. "Emergency calls that go to voicemail", "Quotes that change after the job starts", "No-shows and missed appointments"). These are frustrations with OTHER providers, not website issues.
- services: Array of 3-4 specific services this type of business offers. Be specific to the niche.
- ctaText: A short CTA button text, 3-5 words. Specific to the niche.
- aboutSnippet: 2 sentences about what makes this business trustworthy. Use their rating and review count.

Rules:
- This is a REAL website for the business. No meta-commentary about websites, redesigns, or agencies.
- Write for the business's CUSTOMERS — people searching for a ${niche} in ${city}.
- No buzzwords (leverage, synergy, elevate, world-class).
- Sound like a smart local business, not a corporation.
- Keep it under 200 total words.

Return ONLY valid JSON, no markdown.`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const text = res.choices[0]?.message?.content || '';

  try {
    return JSON.parse(text) as GeneratedCopy;
  } catch {
    // Fallback copy
    return {
      headline: `${business.name} — Done Right, Every Time`,
      subheadline: `Trusted by ${business.reviewCount}+ customers in ${city || 'your area'}.`,
      problemHeadline: `Tired of Unreliable Service?`,
      problemSubheadline: `Finding a trustworthy ${niche} shouldn't be a gamble.`,
      painPoints: [
        'Emergency calls that go to voicemail',
        'Quotes that change after the job starts',
        'No-shows and missed appointments',
      ],
      services: ['General Services', 'Consultations', 'Emergency Callouts', 'Maintenance'],
      ctaText: `Get a Free Quote`,
      aboutSnippet: `${business.name} is rated ${business.rating}/5 from ${business.reviewCount} reviews. Serving the local community with reliable, professional service.`,
    };
  }
}
