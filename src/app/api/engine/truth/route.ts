import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Simple in-memory cache (lasts until server restart)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCached(niche: string) {
  const key = niche.toLowerCase().trim();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit for:', key);
    return cached.data;
  }
  return null;
}

function setCache(niche: string, data: unknown) {
  const key = niche.toLowerCase().trim();
  cache.set(key, { data, timestamp: Date.now() });
}

// Parse Reddit quotes from Perplexity response
function extractRedditQuotes(text: string): { quote: string; subreddit: string; context: string }[] {
  const quotes: { quote: string; subreddit: string; context: string }[] = [];
  
  // Pattern 1: QUOTE: "text" - r/subreddit - Context: description
  const pattern1 = /QUOTE:\s*"([^"]+)"\s*-?\s*(r\/\w+)\s*-?\s*(?:Context:)?\s*(.+?)(?=QUOTE:|$)/gi;
  let match;
  while ((match = pattern1.exec(text)) !== null) {
    quotes.push({
      quote: match[1].trim(),
      subreddit: match[2].trim(),
      context: match[3].trim().replace(/\n/g, ' ').substring(0, 100)
    });
  }
  
  // Pattern 2: "quote text" from r/subreddit or "quote" - r/subreddit
  if (quotes.length === 0) {
    const pattern2 = /"([^"]{20,200})"\s*(?:from|[-–—])\s*(r\/\w+)/gi;
    while ((match = pattern2.exec(text)) !== null) {
      quotes.push({
        quote: match[1].trim(),
        subreddit: match[2].trim(),
        context: 'User discussion'
      });
    }
  }
  
  // Pattern 3: Look for any quoted text near subreddit mentions
  if (quotes.length === 0) {
    const pattern3 = /(r\/\w+)[^"]*"([^"]{20,200})"/gi;
    while ((match = pattern3.exec(text)) !== null) {
      quotes.push({
        quote: match[2].trim(),
        subreddit: match[1].trim(),
        context: 'Community discussion'
      });
    }
  }
  
  console.log(`Extracted ${quotes.length} Reddit quotes`);
  return quotes.slice(0, 5); // Max 5 quotes
}

// Get Reddit-specific research
async function getRedditResearch(niche: string): Promise<string> {
  if (!PERPLEXITY_API_KEY) return '';

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You search Reddit and online forums to find real user opinions. You always quote users directly using their exact words in quotation marks, and always specify which subreddit (r/subredditname) the quote came from.'
          },
          {
            role: 'user',
            content: `Find Reddit discussions about "${niche}". I need REAL QUOTES from actual Reddit users.

Search these subreddits: r/entrepreneur, r/smallbusiness, r/startups, r/realestate, r/ukpersonalfinance, r/UKProperty, r/PropertyInvesting, r/SaaS, r/marketing

For each quote found, format EXACTLY like this:
QUOTE: "exact words the user wrote" - r/subredditname - Context: what they were discussing

Find 5 different quotes showing:
1. A frustration or complaint
2. A question about pricing or costs  
3. Someone discussing current solutions they use
4. A pain point or challenge
5. A wish or desire for something better

If you cannot find real quotes for this exact niche, search for related topics and clearly state which topic the quote relates to.`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('Reddit search error:', await response.text());
      return '';
    }
    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    console.log('Reddit search result preview:', content.substring(0, 300));
    return content;
  } catch (err) {
    console.error('Reddit search exception:', err);
    return '';
  }
}

// Main market research with Perplexity
async function getPerplexityResearch(niche: string): Promise<{ content: string; sources: string[] }> {
  if (!PERPLEXITY_API_KEY) {
    return { content: '', sources: [] };
  }

  try {
    // Run both searches in parallel
    const [marketResponse, redditInsights] = await Promise.all([
      fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: `You are a market research analyst. Provide specific data with numbers, percentages, and dollar amounts. Always cite sources.`
            },
            {
              role: 'user',
              content: `Research the "${niche}" market thoroughly:

1) MARKET SIZE: Total addressable market in dollars, growth rate percentage
2) TOP 5 COMPETITORS: Name, pricing, main weakness for each
3) CUSTOMER PAIN POINTS: Specific problems people face
4) PRICING LANDSCAPE: What do solutions cost? Entry-level to premium ranges
5) MARKET TRENDS: What's changing in 2024-2026?
6) OPPORTUNITIES: Underserved segments, gaps in the market

Be extremely specific with numbers. Focus on UK/Europe where relevant.`
            }
          ],
          temperature: 0.2,
          max_tokens: 2500,
          return_citations: true,
        }),
      }),
      getRedditResearch(niche)
    ]);

    if (!marketResponse.ok) {
      console.error('Perplexity API Error:', await marketResponse.text());
      return { content: '', sources: [] };
    }

    const data = await marketResponse.json();
    const marketContent = data.choices[0].message.content || '';
    const sources = data.citations || [];
    
    // Combine market research with Reddit insights
    const combinedContent = `${marketContent}

---REDDIT INSIGHTS---
${redditInsights || 'No Reddit discussions found.'}`;
    
    return { content: combinedContent, sources };
  } catch (error) {
    console.error('Perplexity research error:', error);
    return { content: '', sources: [] };
  }
}

const truthEnginePrompt = `You are the Truth Engine, an expert AI market research analyst. When given a niche, provide comprehensive market intelligence in the following JSON format:

{
  "viabilityScore": <number 0-100>,
  "marketSize": "<string, e.g. '$2.3B'>",
  "growthRate": "<string, e.g. '18% YoY'>",
  "competition": "<'Low' | 'Medium' | 'Medium-High' | 'High'>",
  "painPoints": ["<string>", "<string>", "<string>", "<string>", "<string>"],
  "opportunities": ["<string>", "<string>", "<string>", "<string>", "<string>"],
  "competitors": [
    {"name": "<string>", "weakness": "<string>", "pricing": "<string>"},
    {"name": "<string>", "weakness": "<string>", "pricing": "<string>"},
    {"name": "<string>", "weakness": "<string>", "pricing": "<string>"},
    {"name": "<string>", "weakness": "<string>", "pricing": "<string>"},
    {"name": "<string>", "weakness": "<string>", "pricing": "<string>"}
  ],
  "recommendedOffer": "<string describing a specific high-ticket offer>",
  "pricingRange": "<string, e.g. '$3,000 - $7,500'>",
  "targetAudience": "<detailed string describing ideal customer avatar - demographics, company size, budget, decision makers>",
  "keyInsights": "<3-4 sentence summary of the opportunity>",
  "marketingChannels": ["<best channel 1>", "<best channel 2>", "<best channel 3>"],
  "acquisitionStrategy": "<2-3 sentences on how to acquire first customers>",
  "barriers": ["<entry barrier 1>", "<entry barrier 2>", "<entry barrier 3>"],
  "redditInsights": "<2-3 sentence summary of what people are saying on Reddit/forums about this niche - their frustrations, desires, and questions>",
  "redditQuotes": [
    {"quote": "<actual verbatim quote from research data>", "subreddit": "<r/subredditname>", "context": "<what they were discussing>"},
    {"quote": "<actual verbatim quote from research data>", "subreddit": "<r/subredditname>", "context": "<what they were discussing>"},
    {"quote": "<actual verbatim quote from research data>", "subreddit": "<r/subredditname>", "context": "<what they were discussing>"}
  ],
  "urgencyFactors": ["<why now is the right time - factor 1>", "<factor 2>"],
  "demandSignals": ["<signal 1 showing demand>", "<signal 2>", "<signal 3>"],
  "riskFactors": ["<risk 1>", "<risk 2>"]
}

IMPORTANT INSTRUCTIONS:
1. Provide 5 pain points, 5 opportunities, and 5 competitors with their pricing
2. Look for the "---REDDIT INSIGHTS---" section in the research data and extract REAL quotes from there
3. For redditQuotes, ONLY use actual quotes that appear in the research data with their subreddit names
4. If no Reddit quotes are in the research, still provide redditInsights based on common pain points, but set redditQuotes to an empty array []
5. Be extremely specific, data-driven, and actionable
6. Include specific numbers, percentages, and price points wherever possible

The viability score should reflect:
- Market demand (25%)
- Competition level (25%)  
- Profit potential (25%)
- Scalability (25%)

Return ONLY valid JSON, no markdown or explanation.`;

export async function POST(request: NextRequest) {
  try {
    const { niche, skipCache } = await request.json();

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Check cache first (unless skipCache is true)
    if (!skipCache) {
      const cached = getCached(niche);
      if (cached) {
        return NextResponse.json({ ...cached as object, fromCache: true });
      }
    }

    // Step 1: Get live web research from Perplexity (if API key available)
    const { content: webResearch, sources } = await getPerplexityResearch(niche);
    
    // Pre-extract Reddit quotes from Perplexity response
    let extractedQuotes: { quote: string; subreddit: string; context: string }[] = [];
    if (webResearch.includes('---REDDIT INSIGHTS---')) {
      const redditSection = webResearch.split('---REDDIT INSIGHTS---')[1] || '';
      console.log('Reddit Research Found:', redditSection?.substring(0, 500));
      extractedQuotes = extractRedditQuotes(redditSection);
      console.log('Pre-extracted quotes:', JSON.stringify(extractedQuotes, null, 2));
    }
    
    // Step 2: Use OpenAI to analyze and structure the data
    const userPrompt = webResearch 
      ? `Analyze this niche for high-ticket offer potential: "${niche}"
      
Here is current market research data to incorporate into your analysis:

${webResearch}

${extractedQuotes.length > 0 ? `
PRE-EXTRACTED REDDIT QUOTES (use these in your redditQuotes array):
${JSON.stringify(extractedQuotes, null, 2)}
` : ''}

Make your analysis specific and data-driven based on the research provided.`
      : `Analyze this niche for high-ticket offer potential: "${niche}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: truthEnginePrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    try {
      const report = JSON.parse(content);
      
      // If OpenAI didn't include Reddit quotes but we extracted them, add them
      if ((!report.redditQuotes || report.redditQuotes.length === 0) && extractedQuotes.length > 0) {
        report.redditQuotes = extractedQuotes;
        console.log('Injected pre-extracted Reddit quotes');
      }
      
      // Log Reddit quotes for debugging
      console.log('Final Reddit quotes:', JSON.stringify(report.redditQuotes, null, 2));
      
      const finalReport = {
        ...report,
        niche,
        sources: sources || [],
        generatedAt: new Date().toISOString(),
      };
      
      // Cache the result
      setCache(niche, finalReport);
      
      return NextResponse.json(finalReport);
    } catch {
      // If JSON parsing fails, return raw content
      return NextResponse.json({ 
        error: 'Failed to parse AI response',
        raw: content 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Truth Engine Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
