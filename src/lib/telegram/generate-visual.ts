import OpenAI from 'openai';
import { type TemplateType, type TemplateData, DEFAULT_TEMPLATES } from './templates';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VISUAL_SYSTEM_PROMPT = `You are the marketing strategist for CRFTD Web (crftdweb.com), a premium web design & development agency.

Your job is to generate fresh content for branded TikTok/social media visual templates. The content must match the CRFTD Web brand voice: confident, direct, no-fluff.

You will receive a template type and must return a JSON object with the content fields filled in. Keep text concise — these are visual posts, not blog posts.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanation.`;

const TEMPLATE_PROMPTS: Record<TemplateType, string> = {
  'problem-hook': `Generate a problem-hook visual. Return JSON:
{
  "headline": "3-line headline (use \\n for line breaks). First word or phrase should hit hard.",
  "subheadline": "2-3 lines of supporting text (use \\n). Twist the knife on the problem.",
  "stats": [{"value": "XX%", "label": "Short stat label", "source": "Source name"}] (exactly 4 stats),
  "footer": "Short provocative footer question"
}
Topic: web design, conversion, page speed, UX, or credibility. Must be different from "Your website is losing you money."`,

  'five-signs': `Generate a "5 signs" educational visual. Return JSON:
{
  "headline": "3-line headline ending with an accented word (use \\n)",
  "subheadline": "Short 1-line instruction",
  "items": [{"title": "Sign title (6 words max)", "description": "1 sentence explanation"}] (exactly 5 items),
  "footer": "Short engaging footer"
}
Topic: web design mistakes, branding fails, UX problems, marketing pitfalls.`,

  'case-study': `Generate a case study visual teaser. Return JSON:
{
  "headline": "3-line headline about a client transformation (use \\n). Use 'from X to Y' format.",
  "client": "Client or industry name",
  "problem": "1-2 sentences describing the problem. Start with a quote if possible.",
  "process": "1-2 sentences on the approach taken.",
  "results": [{"value": "X%", "label": "Short result description"}] (exactly 3 results with impressive numbers),
  "footer": "Short footer text"
}
Make it realistic but impressive. Industry can be SaaS, e-commerce, fintech, health, real estate, etc.`,

  'framework': `Generate a process/framework visual. Return JSON:
{
  "headline": "2-line framework name (use \\n). Second line should be the framework name in a catchy way.",
  "subheadline": "1 line teasing the value of sharing this for free",
  "steps": [{"number": "01", "title": "Step name", "description": "1-2 sentence explanation", "color": "#0a0a0a"}] (exactly 4 steps, all colors should be "#0a0a0a"),
  "footer": "Short generous footer"
}
Framework should be about web design, conversion optimization, brand building, or client onboarding.`,

  'cost-comparison': `Generate a cost comparison visual. Return JSON:
{
  "headline": "3-line headline showing the hidden cost (use \\n). Include dollar amounts.",
  "subheadline": "1-line subtitle",
  "cheapSide": ["5 bullet points for the cheap option"] (no ✕ prefix),
  "premiumSide": ["5 corresponding bullet points for the premium option"] (no ✓ prefix),
  "cheapResult": {"math": "calculation string", "total": "= $X,XXX/mo"},
  "premiumResult": {"math": "calculation string", "total": "= $XX,XXX/mo"},
  "footer": "Provocative closing question"
}
Compare cheap vs. premium approach to web design/development.`,

  'proof': `Generate a social proof / testimonials visual. Return JSON:
{
  "headline": "2-line headline (use \\n). Something about letting results speak.",
  "testimonials": [
    {"quote": "1-2 sentence testimonial", "name": "Name", "role": "Role/Company", "metric": "+XX%", "metricLabel": "short label"}
  ] (exactly 3 testimonials with impressive but realistic metrics),
  "footer": "Confident closing line"
}
Make testimonials sound natural and specific.`,

  'cta': `Generate a CTA (call-to-action) visual. Return JSON:
{
  "headline": "3-line headline that creates urgency (use \\n). Problem-first approach.",
  "subheadline": "2 lines of supporting text (use \\n). Reference competitors or lost opportunity.",
  "ctaText": "CTA button text (4-6 words, ALL CAPS with →)",
  "ctaSubtext": "Small text below CTA",
  "footer": "3 short phrases separated by spaces"
}
Make it urgent without being sleazy.`,

  'tip': `Generate a web tip visual. Return JSON:
{
  "headline": "3-line headline about a specific web design/dev insight (use \\n)",
  "subheadline": "1-line intro to the stats/evidence",
  "stats": [{"value": "XX%", "label": "What this stat means", "source": "Where this data comes from"}] (exactly 2-3 stats),
  "footer": "Short actionable footer"
}
Topic: UX, typography, color psychology, page speed, mobile design, accessibility, conversion rate optimization.`,
};

export async function generateVisualContent(type?: TemplateType): Promise<TemplateData> {
  const templateTypes = Object.keys(TEMPLATE_PROMPTS) as TemplateType[];
  const selectedType = type || templateTypes[Math.floor(Math.random() * templateTypes.length)];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: VISUAL_SYSTEM_PROMPT },
        { role: 'user', content: TEMPLATE_PROMPTS[selectedType] },
      ],
      temperature: 0.9,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content || '';

    // Parse JSON — strip any markdown code block markers
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return { type: selectedType, tag: parsed.tag, ...parsed };
  } catch (error) {
    console.error('Failed to generate visual content, using default:', error);
    // Fall back to default template
    return DEFAULT_TEMPLATES[selectedType];
  }
}
