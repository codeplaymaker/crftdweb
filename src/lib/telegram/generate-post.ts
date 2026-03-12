import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BRAND_CONTEXT = `
You are the marketing copywriter for CRFTD Web (crftdweb.com), a premium web design & development agency.

Brand voice: Confident, direct, no-fluff. We speak like a strategist, not a salesperson.
Key messages:
- We build websites that convert, not just look pretty
- Hand-coded with Next.js, no templates or WordPress
- 90+ PageSpeed scores, sub-2s load times
- Conversion-first design philosophy
- We engineer trust and credibility into every site
- We solve business problems through web design

Services: Custom websites, web apps, landing pages, branding
Target audience: Business owners, founders, startups who need a website that actually drives revenue
`;

export type PostType = 'tip' | 'case-study' | 'myth-bust' | 'cta' | 'stat' | 'behind-the-scenes' | 'hot-take';

const POST_TYPE_PROMPTS: Record<PostType, string> = {
  'tip': 'Write a quick, actionable web design or conversion tip. Format: Hook line, then 2-3 bullet points, then a one-liner CTA.',
  'case-study': 'Write a mini case study teaser. Format: The problem (1 line), what we did (1 line), the result (1 line). Make it punchy.',
  'myth-bust': 'Bust a common myth about web design, development, or hiring agencies. Be bold and contrarian.',
  'cta': 'Write a compelling call-to-action post that creates urgency without being sleazy. Focus on the cost of inaction.',
  'stat': 'Share a real (or realistic) web performance stat and explain why it matters for business. Make it concrete.',
  'behind-the-scenes': 'Share a behind-the-scenes insight about how we approach a project, our process, or a tool we use. Be genuine.',
  'hot-take': 'Share a bold, opinionated take about the web design/dev industry. Be provocative but back it up.',
};

export async function generatePost(type?: PostType): Promise<{ content: string; type: PostType }> {
  const postTypes = Object.keys(POST_TYPE_PROMPTS) as PostType[];
  const selectedType = type || postTypes[Math.floor(Math.random() * postTypes.length)];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `${BRAND_CONTEXT}

Rules:
- Keep it under 280 characters for maximum impact (Twitter/Telegram friendly)
- Use line breaks for readability
- No hashtags unless specifically asked
- No emojis overload (1-2 max if any)
- End with a subtle CTA or thought-provoking line
- Sound human, not corporate
- Be specific, not generic`,
      },
      {
        role: 'user',
        content: POST_TYPE_PROMPTS[selectedType],
      },
    ],
    temperature: 0.9,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content || 'Failed to generate post.';

  return { content, type: selectedType };
}

export async function generateBatchPosts(count: number = 5): Promise<Array<{ content: string; type: PostType }>> {
  const postTypes = Object.keys(POST_TYPE_PROMPTS) as PostType[];
  // Pick unique types
  const shuffled = postTypes.sort(() => Math.random() - 0.5);
  const selectedTypes = shuffled.slice(0, Math.min(count, postTypes.length));

  const posts = await Promise.all(
    selectedTypes.map((type) => generatePost(type))
  );

  return posts;
}
