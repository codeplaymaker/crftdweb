// AI Service for Engine
// This module handles AI API calls for the Truth Engine and AI Agents

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// System prompts for each AI agent
export const agentPrompts: Record<string, string> = {
  'offer-architect': `You are an expert high-ticket offer designer. Your role is to help users create compelling offers that convert. 
Focus on:
- Clear transformation promises
- Outcome-based positioning
- Premium pricing strategies
- Value stack creation
- Guarantee frameworks
Provide specific, actionable advice with examples.`,

  'niche-architect': `You are a niche research and validation expert. Your role is to help users identify and validate profitable niches.
Focus on:
- Market size and growth potential
- Pain point identification
- Competition analysis
- Pricing potential
- Entry barriers
Provide data-driven insights and specific recommendations.`,

  'vsl-builder': `You are a Video Sales Letter copywriting expert. Your role is to create compelling VSL scripts that convert.
Focus on:
- Hook and attention grabbing
- Problem agitation
- Solution presentation
- Proof and credibility
- Offer and CTA
Provide complete script sections with specific language.`,

  'ads-architect': `You are an advertising and paid media expert. Your role is to create high-converting ad campaigns.
Focus on:
- Ad copy that stops the scroll
- Targeting strategies
- Funnel alignment
- Creative concepts
- Testing frameworks
Provide specific ad copy examples and campaign structures.`,

  'category-architect': `You are a market positioning and category design expert. Your role is to help users create or dominate market categories.
Focus on:
- Category creation strategies
- Positioning frameworks
- Competitive differentiation
- Brand messaging
- Market narrative
Provide strategic frameworks with implementation steps.`,

  'sales-asset': `You are a content repurposing expert. Your role is to transform raw content into marketing and sales assets.
Focus on:
- Extracting key insights
- Creating social content
- Building email sequences
- Developing case studies
- Creating testimonial frameworks
Transform content into multiple formats with specific examples.`,

  'landing-page': `You are a landing page copywriting expert. Your role is to write high-converting landing page copy.
Focus on:
- Headline formulas
- Benefit-driven copy
- Social proof integration
- Objection handling
- CTA optimization
Provide complete copy sections ready to use.`,

  'research-agent': `You are a business research expert. Your role is to provide comprehensive market and business intelligence.
Focus on:
- Market trends and data
- Competitor analysis
- Industry insights
- Opportunity identification
- Strategic recommendations
Provide thorough research with actionable insights.`,
};

// Truth Engine system prompt
export const truthEnginePrompt = `You are the Truth Engine, an AI-powered market research system. Analyze the given niche and provide:

1. **Market Viability Score** (0-100): Based on demand, competition, and growth potential
2. **Market Size**: Estimated total addressable market
3. **Growth Rate**: Annual growth percentage
4. **Competition Level**: Low/Medium/High with explanation
5. **Pain Points**: Top 5 pain points in this market
6. **Opportunities**: Key market gaps and opportunities
7. **Competitor Analysis**: 3 main competitors with their weaknesses
8. **Recommended Offer**: A specific high-ticket offer recommendation
9. **Pricing Range**: Suggested price range for high-ticket offer

Be specific, data-driven, and actionable. Format your response as structured data.`;

// Mock AI response generator (for demo without API keys)
export function generateMockAIResponse(agentId: string, userMessage: string): string {
  const responses: Record<string, string> = {
    'offer-architect': `Based on your input, here's a high-ticket offer framework:

**Offer Name:** The [Transformation] Accelerator

**Target Price:** $4,997 - $7,497

**Core Promise:** Help [target audience] achieve [specific outcome] in [timeframe]

**Offer Stack:**
1. **Core Training** - 8-week implementation program
2. **Weekly Coaching Calls** - Live Q&A and hot seats
3. **Private Community** - 24/7 support and networking
4. **Done-For-You Templates** - Swipe files and frameworks
5. **Bonus: 1:1 Strategy Session** - Personalized roadmap

**Guarantee:** 100% results or we work with you until you get them

Would you like me to elaborate on any of these elements?`,

    'niche-architect': `Here's my analysis of your niche opportunity:

**Market Overview:**
- Total Addressable Market: $2.3B
- Annual Growth Rate: 18%
- Competition Level: Medium

**Top Pain Points:**
1. Struggling to acquire quality clients
2. Unable to scale beyond 1:1 work
3. No predictable revenue system

**Recommended Sub-Niche:**
Focus on [specific segment] because they have:
- Higher willingness to pay
- Clearer buying triggers
- Less competition

**Next Steps:**
1. Validate with 5-10 discovery calls
2. Test messaging on social media
3. Create a minimum viable offer

Want me to help you craft discovery call questions?`,

    'default': `I've analyzed your request. Here are my recommendations:

**Key Insights:**
1. Your target market shows strong demand signals
2. There's a clear gap in current solutions
3. Premium positioning is viable

**Recommended Actions:**
1. Start with a minimum viable offer
2. Test messaging with your audience
3. Iterate based on feedback

**Next Steps:**
- I can help you dive deeper into any of these areas
- Let me know which aspect you'd like to explore further

What would you like to focus on next?`,
  };

  return responses[agentId] || responses['default'];
}

// Real AI API call (for when you add API keys)
export async function callAI(
  systemPrompt: string,
  userMessage: string,
  apiKey?: string
): Promise<AIResponse> {
  // If no API key, return mock response
  if (!apiKey) {
    return {
      content: generateMockAIResponse('default', userMessage),
    };
  }

  // OpenAI API call
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      content: 'Sorry, there was an error processing your request. Please try again.',
    };
  }
}

// Truth Engine analysis
export async function analyzeTruthEngine(
  niche: string,
  apiKey?: string
): Promise<AIResponse> {
  const userMessage = `Analyze this niche for high-ticket offer potential: "${niche}"`;
  return callAI(truthEnginePrompt, userMessage, apiKey);
}

// AI Agent chat
export async function chatWithAgent(
  agentId: string,
  userMessage: string,
  apiKey?: string
): Promise<AIResponse> {
  const systemPrompt = agentPrompts[agentId] || agentPrompts['research-agent'];
  return callAI(systemPrompt, userMessage, apiKey);
}
