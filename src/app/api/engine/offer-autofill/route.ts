import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      niche,
      targetAudience,
      painPoints,
      opportunities,
      competitiveGaps,
      pricingRange,
      riskFactors,
      demandSignals,
      urgencyFactors,
    } = await req.json();

    const systemPrompt = `You are an expert high-ticket offer designer. Based on niche research data, create a compelling premium offer.

Your task is to generate an irresistible high-ticket offer (typically $2,000-$25,000+) that:
1. Addresses the most painful problems in the market
2. Delivers a clear, specific transformation
3. Has compelling deliverables that justify premium pricing
4. Includes strategic bonuses that increase perceived value
5. Has a risk-reversing guarantee

IMPORTANT: Be creative and specific. Don't just rephrase the input - synthesize insights to create something compelling.

Return a JSON object with these fields:
{
  "offerName": "A compelling name (e.g., 'The Revenue Acceleration System')",
  "niche": "The refined niche positioning",
  "targetAudience": "Specific target customer profile (be detailed)",
  "transformation": "The specific transformation/outcome they'll achieve (be concrete with numbers/timeframes)",
  "timeframe": "Realistic delivery timeframe (e.g., '90 days', '12 weeks')",
  "price": "Suggested price as string (e.g., '5,000' or '12,500')",
  "deliverables": ["Array of 4-5 specific deliverables - be concrete, not vague"],
  "bonuses": ["Array of 2-3 high-value bonuses that complement the main offer"],
  "guarantee": "A compelling risk-reversing guarantee"
}`;

    const userPrompt = `Create a high-ticket offer based on this market research:

NICHE: ${niche}

TARGET AUDIENCE: ${targetAudience || 'Not specified'}

PAIN POINTS:
${painPoints?.length > 0 ? painPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n') : 'Not specified'}

OPPORTUNITIES:
${opportunities?.length > 0 ? opportunities.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n') : 'Not specified'}

COMPETITIVE GAPS:
${competitiveGaps?.length > 0 ? competitiveGaps.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n') : 'Not specified'}

CURRENT MARKET PRICING: ${pricingRange || 'Not specified'}

RISK FACTORS TO ADDRESS:
${riskFactors?.length > 0 ? riskFactors.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n') : 'Not specified'}

DEMAND SIGNALS:
${demandSignals?.length > 0 ? demandSignals.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n') : 'Not specified'}

URGENCY FACTORS:
${urgencyFactors?.length > 0 ? urgencyFactors.map((u: string, i: number) => `${i + 1}. ${u}`).join('\n') : 'Not specified'}

Generate a premium offer that solves the biggest pain points and capitalizes on the opportunities. Make it irresistible.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    const offerSuggestions = JSON.parse(content);

    return NextResponse.json(offerSuggestions);
  } catch (error) {
    console.error('Offer auto-fill error:', error);
    return NextResponse.json(
      { error: 'Failed to generate offer suggestions' },
      { status: 500 }
    );
  }
}
