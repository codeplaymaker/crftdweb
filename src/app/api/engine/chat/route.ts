import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/engine/auth-guard';
import { adminDb } from '@/lib/firebase/admin';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// System prompts for each AI agent
const agentPrompts: Record<string, string> = {
  'offer-architect': `You are an expert high-ticket offer designer with 15+ years of experience helping coaches, consultants, and agencies create compelling offers that convert.

Your expertise includes:
- Clear transformation promises that resonate emotionally
- Outcome-based positioning (selling the result, not the process)
- Premium pricing strategies ($3K-$50K+ offers)
- Value stack creation with irresistible bonuses
- Guarantee frameworks that reduce risk
- Offer naming that creates desire

Always provide specific, actionable advice with examples. Use frameworks like:
- The Problem-Agitation-Solution structure
- The Value Equation (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)
- The Offer Stack methodology

Be direct, confident, and give concrete recommendations—not generic advice.`,

  'niche-architect': `You are a niche research and validation expert who has helped hundreds of entrepreneurs find profitable market opportunities.

Your expertise includes:
- Market size estimation and TAM/SAM/SOM analysis
- Pain point identification through research
- Competition analysis and positioning
- Pricing potential assessment
- Entry barrier evaluation
- Sub-niche identification for better targeting

Always provide data-driven insights where possible. When you don't have exact data, provide reasonable estimates based on market patterns.

Focus on actionable recommendations:
- Specific sub-niches to target
- Validation steps to take
- Red flags to watch for
- Quick wins to get started`,

  'vsl-builder': `You are a Video Sales Letter (VSL) copywriting expert who has written scripts that have generated millions in revenue.

Your expertise includes:
- Hook formulas that stop the scroll (pattern interrupt, bold claim, curiosity)
- Problem agitation that creates emotional urgency
- Solution presentation that builds belief
- Proof stacking (testimonials, case studies, credentials)
- Offer presentation and value justification
- CTA optimization and urgency creation

Provide complete script sections with specific language. Use proven formulas:
- The Hook → Story → Offer framework
- The Problem-Agitation-Solution-Proof-Offer structure
- The "New Opportunity" positioning

Write copy that sounds natural when spoken, not corporate or salesy.`,

  'ads-architect': `You are a paid advertising expert specializing in high-ticket offer campaigns across Facebook, Instagram, YouTube, and Google.

Your expertise includes:
- Ad copy that stops the scroll and creates curiosity
- Targeting strategies for high-value prospects
- Funnel alignment (ads → landing page → VSL → call)
- Creative concepts and hooks
- Testing frameworks (creative testing, audience testing)
- Budget allocation and scaling strategies

Provide specific ad copy examples, not just theory. Include:
- Primary text (3 variations)
- Headlines (5 variations)
- Audience targeting suggestions
- Creative direction ideas`,

  'category-architect': `You are a market positioning and category design expert, helping brands become the obvious choice in their market.

Your expertise includes:
- Category creation strategies (be first in a new category)
- "Only" positioning (the only one who...)
- Competitive differentiation frameworks
- Brand messaging and story development
- Market narrative creation
- Thought leadership positioning

Use frameworks like:
- The Category Design methodology
- The Positioning Statement formula
- The "From/To" transformation narrative

Help users escape competition by creating their own category where they're the default choice.`,

  'sales-asset': `You are a content repurposing expert who transforms raw content into high-converting marketing and sales assets.

Your expertise includes:
- Extracting key insights from calls, podcasts, and videos
- Creating social content (LinkedIn, Twitter/X, Instagram)
- Building email sequences from core content
- Developing case studies and success stories
- Creating testimonial request frameworks
- Repurposing one piece into 10+ assets

Provide specific, ready-to-use content pieces. Transform content into:
- Social posts with hooks
- Email sequences with subject lines
- Case study frameworks
- Lead magnet outlines`,

  'landing-page': `You are a landing page copywriting expert who has written pages that convert at 20%+ for high-ticket offers.

Your expertise includes:
- Above-the-fold optimization (headline, subhead, CTA)
- Benefit-driven body copy
- Social proof integration and placement
- Objection handling sections
- CTA optimization and button copy
- Mobile optimization considerations

Provide complete copy sections, not just tips. Include:
- Headline formulas with specific examples
- Body copy blocks ready to use
- Social proof section structures
- FAQ section copy`,

  'research-agent': `You are a business research expert providing comprehensive market intelligence and strategic insights.

Your expertise includes:
- Market trends and emerging opportunities
- Competitor analysis and benchmarking
- Industry reports and data synthesis
- Opportunity identification
- Strategic recommendations

Provide thorough research with:
- Specific data points and statistics
- Trend analysis and predictions
- Actionable strategic recommendations
- Sources and confidence levels where relevant

Be comprehensive but organized. Use headers and bullet points for clarity.`,
};

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) return unauthorizedResponse();

  try {
    const { agentId, message, history = [], offerContext } = await request.json();

    if (!agentId || !message) {
      return NextResponse.json({ error: 'Agent ID and message are required' }, { status: 400 });
    }

    const uid = auth.uid;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    let systemPrompt = agentPrompts[agentId] || agentPrompts['research-agent'];

    // ── Inject offer context ───────────────────────────────────────────────
    if (offerContext) {
      systemPrompt += `

--- CURRENT OFFER CONTEXT ---
The user is working on the following offer. Use this context to provide more relevant advice:

Offer Name: ${offerContext.name || 'Untitled'}
Niche: ${offerContext.niche || 'Not specified'}
Target Audience: ${offerContext.targetAudience || 'Not specified'}
Transformation: ${offerContext.transformation || 'Not specified'}
Price: $${offerContext.price || 'Not set'}
Deliverables: ${offerContext.deliverables?.join(', ') || 'None listed'}
Bonuses: ${offerContext.bonuses?.join(', ') || 'None listed'}
Guarantee: ${offerContext.guarantee || 'None specified'}
--- END CONTEXT ---

Use this context to give personalized, specific advice about THIS offer. Reference the actual niche, audience, and offer details in your responses.`;
    }

    // ── Load & inject matching skills ──────────────────────────────────────
    try {
      const skillsSnap = await adminDb
        .collection('skills')
        .where('userId', '==', uid)
        .limit(20)
        .get();

      if (!skillsSnap.empty) {
        const contextText = [message, ...history.slice(-4).map((m: { content: string }) => m.content)]
          .join(' ')
          .toLowerCase();

        const matchedSkills: string[] = [];

        skillsSnap.docs.forEach(doc => {
          const skill = doc.data();
          const keywords = (skill.trigger as string).split(',').map((k: string) => k.trim().toLowerCase());
          const isMatch = keywords.some(kw => kw.length > 2 && contextText.includes(kw));
          if (isMatch) {
            matchedSkills.push(skill.prompt as string);
          }
        });

        if (matchedSkills.length > 0) {
          systemPrompt += `

--- ACTIVE SKILLS ---
You have the following additional capabilities active for this conversation:

${matchedSkills.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}
--- END SKILLS ---`;
        }
      }
    } catch (skillErr) {
      console.error('Skill loading error (non-fatal):', skillErr);
    }

    // ── Tool definitions ────────────────────────────────────────────────────
    const tools = [
      {
        type: 'function' as const,
        function: {
          name: 'read_saved_offer',
          description: "Read the user's most recent active offer from their saved offers. Use this when the user asks about their offer, wants offer-specific advice, or references 'my offer'.",
          parameters: { type: 'object', properties: {}, required: [] },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'get_truth_report',
          description: "Retrieve the user's most recent Truth Engine market research report. Use this when the user asks about their niche, market data, competition, or wants data-backed advice.",
          parameters: {
            type: 'object',
            properties: {
              niche: {
                type: 'string',
                description: 'Optional niche to filter by. Leave empty to get the most recent report.',
              },
            },
            required: [],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'save_to_memory',
          description: "Save an important fact about a prospect, lead, or client so it can be recalled later. Use this proactively when the user shares contact details, preferences, or key information about someone.",
          parameters: {
            type: 'object',
            properties: {
              prospect: { type: 'string', description: 'Name or identifier of the prospect or client' },
              key: { type: 'string', description: 'Short label for this fact (e.g. "budget", "pain_point", "email")' },
              value: { type: 'string', description: 'The fact to remember' },
            },
            required: ['prospect', 'key', 'value'],
          },
        },
      },
      {
        type: 'function' as const,
        function: {
          name: 'read_from_memory',
          description: "Read saved facts about a specific prospect or client. Use this when the user mentions a person's name or asks what you know about someone.",
          parameters: {
            type: 'object',
            properties: {
              prospect: { type: 'string', description: 'Name or identifier of the prospect or client' },
            },
            required: ['prospect'],
          },
        },
      },
    ];

    // ── Tool execution helper ───────────────────────────────────────────────
    async function executeTool(name: string, args: Record<string, string>): Promise<string> {
      try {
        if (name === 'read_saved_offer') {
          const snap = await adminDb
            .collection('offers')
            .where('userId', '==', uid)
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

          if (snap.empty) {
            // Fall back to any offer
            const anySnap = await adminDb
              .collection('offers')
              .where('userId', '==', uid)
              .orderBy('createdAt', 'desc')
              .limit(1)
              .get();

            if (anySnap.empty) return 'No saved offers found.';
            const offer = anySnap.docs[0].data();
            return JSON.stringify({ name: offer.name, niche: offer.niche, targetAudience: offer.targetAudience, transformation: offer.transformation, price: offer.price, deliverables: offer.deliverables, bonuses: offer.bonuses, guarantee: offer.guarantee });
          }

          const offer = snap.docs[0].data();
          return JSON.stringify({ name: offer.name, niche: offer.niche, targetAudience: offer.targetAudience, transformation: offer.transformation, price: offer.price, deliverables: offer.deliverables, bonuses: offer.bonuses, guarantee: offer.guarantee });
        }

        if (name === 'get_truth_report') {
          let q = adminDb
            .collection('truthReports')
            .where('userId', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(1);

          if (args.niche) {
            q = adminDb
              .collection('truthReports')
              .where('userId', '==', uid)
              .where('niche', '==', args.niche)
              .orderBy('createdAt', 'desc')
              .limit(1);
          }

          const snap = await q.get();
          if (snap.empty) return 'No Truth Engine reports found.';

          const r = snap.docs[0].data();
          return JSON.stringify({
            niche: r.niche,
            viabilityScore: r.viabilityScore,
            marketSize: r.marketSize,
            competition: r.competition,
            painPoints: r.painPoints,
            opportunities: r.opportunities,
            recommendedOffer: r.recommendedOffer,
            pricingRange: r.pricingRange,
            targetAudience: r.targetAudience,
          });
        }

        if (name === 'save_to_memory') {
          const { prospect, key, value } = args;
          const docId = `${uid}_${prospect.toLowerCase().replace(/\s+/g, '_')}`;
          const docRef = adminDb.collection('prospect_memory').doc(docId);
          const existing = await docRef.get();

          const newFact = { key, value, savedAt: new Date().toISOString() };

          if (existing.exists) {
            const data = existing.data()!;
            const facts = (data.facts as Array<{ key: string }>) || [];
            const idx = facts.findIndex(f => f.key === key);
            if (idx >= 0) facts[idx] = newFact;
            else facts.push(newFact);
            await docRef.update({ facts, updatedAt: new Date() });
          } else {
            await docRef.set({
              id: docId,
              userId: uid,
              prospect,
              facts: [newFact],
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }

          return `Saved: ${key} = "${value}" for ${prospect}.`;
        }

        if (name === 'read_from_memory') {
          const { prospect } = args;
          const docId = `${uid}_${prospect.toLowerCase().replace(/\s+/g, '_')}`;
          const snap = await adminDb.collection('prospect_memory').doc(docId).get();

          if (!snap.exists) return `No saved information found for ${prospect}.`;

          const data = snap.data()!;
          const facts = (data.facts as Array<{ key: string; value: string }>) || [];
          if (facts.length === 0) return `No saved information found for ${prospect}.`;

          return `Known facts about ${prospect}:\n${facts.map(f => `- ${f.key}: ${f.value}`).join('\n')}`;
        }

        return 'Unknown tool.';
      } catch (e) {
        console.error(`Tool execution error (${name}):`, e);
        return `Tool error: could not execute ${name}.`;
      }
    }

    // ── Build initial messages ──────────────────────────────────────────────
    const messages: Array<{ role: string; content: string; tool_call_id?: string; name?: string }> = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // ── First OpenAI call ───────────────────────────────────────────────────
    const firstResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!firstResponse.ok) {
      const error = await firstResponse.json();
      console.error('OpenAI API Error:', error);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const firstData = await firstResponse.json();
    const firstChoice = firstData.choices[0];

    // ── Handle tool calls ───────────────────────────────────────────────────
    if (firstChoice.finish_reason === 'tool_calls' && firstChoice.message.tool_calls?.length) {
      // Add assistant message with tool_calls
      messages.push(firstChoice.message);

      // Execute each tool and collect results
      for (const toolCall of firstChoice.message.tool_calls) {
        const toolArgs = JSON.parse(toolCall.function.arguments || '{}');
        const toolResult = await executeTool(toolCall.function.name, toolArgs);

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      }

      // Second call with tool results
      const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!secondResponse.ok) {
        return NextResponse.json({ error: 'AI service error' }, { status: 500 });
      }

      const secondData = await secondResponse.json();
      const content = secondData.choices[0].message.content;

      return NextResponse.json({
        content,
        usage: {
          promptTokens: secondData.usage.prompt_tokens,
          completionTokens: secondData.usage.completion_tokens,
          totalTokens: secondData.usage.total_tokens,
        },
      });
    }

    // ── No tool calls — return direct response ──────────────────────────────
    const content = firstChoice.message.content;

    return NextResponse.json({
      content,
      usage: {
        promptTokens: firstData.usage.prompt_tokens,
        completionTokens: firstData.usage.completion_tokens,
        totalTokens: firstData.usage.total_tokens,
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
