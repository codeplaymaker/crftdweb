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
  painPoints: string[];
  services: string[];
  ctaText: string;
  aboutSnippet: string;
}

export async function generatePreviewCopy(
  business: Business,
  audit: AuditResult,
): Promise<GeneratedCopy> {
  const issues: string[] = [];
  if (!audit.mobile) issues.push('not mobile-friendly');
  if (!audit.https) issues.push('no SSL certificate');
  if (audit.performanceScore < 40) issues.push('very slow loading speeds');
  if (!audit.hasMetaDescription) issues.push('missing SEO meta tags');
  if (audit.lcp > 4000) issues.push(`${(audit.lcp / 1000).toFixed(1)}s page load time`);

  const niche = business.types?.[0]?.replace(/_/g, ' ') || 'local business';

  const prompt = `You are a copywriter for a premium web design agency. Write website copy for a local business.

Business: ${business.name}
Type: ${niche}
Location: ${business.address}
Rating: ${business.rating}/5 (${business.reviewCount} reviews)
Current website issues: ${issues.join(', ') || 'outdated design'}

Generate JSON with these exact fields:
- headline: A bold 6-10 word headline addressing their customers (not the business owner). Problem-first. No fluff.
- subheadline: 1 sentence, conversational, explaining what the business does and why customers should choose them.
- painPoints: Array of 3 short strings — problems their current website causes for potential customers (e.g. "Can't find your number on mobile", "Takes 6 seconds to load — 53% of visitors leave").
- services: Array of 3-4 services this type of business likely offers. Keep them specific to the niche.
- ctaText: A short CTA button text, 3-5 words. Not generic.
- aboutSnippet: 2 sentences about what makes this business trustworthy. Use their rating and review count.

Rules:
- Write for THEIR customers, not for the business owner.
- No buzzwords (leverage, synergy, elevate, world-class).
- Sound like a smart friend, not a corporation.
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
      subheadline: `Trusted by ${business.reviewCount}+ customers in ${business.address.split(',').pop()?.trim() || 'your area'}.`,
      painPoints: [
        'Their current site is slow and hard to use on mobile',
        'Potential customers can\'t find key information quickly',
        'No clear way to get in touch or book a service',
      ],
      services: ['General Services', 'Consultations', 'Emergency Callouts', 'Maintenance'],
      ctaText: `Get a Free Quote`,
      aboutSnippet: `${business.name} is rated ${business.rating}/5 from ${business.reviewCount} reviews. Serving the local community with reliable, professional service.`,
    };
  }
}
