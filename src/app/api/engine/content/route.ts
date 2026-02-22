import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const contentPrompts: Record<string, { system: string; userTemplate: string }> = {
  'vsl': {
    system: `You are an expert copywriter specializing in Video Sales Letters (VSLs) that convert. You create compelling, emotional, high-converting VSL scripts following proven frameworks.`,
    userTemplate: `Create a complete Video Sales Letter (VSL) script for the following offer:

{input}

Structure the VSL with these sections:
1. **HOOK** (0-30 seconds) - Pattern interrupt, bold claim, or shocking statement
2. **PROBLEM AGITATION** (30-90 seconds) - Describe their pain vividly, make them feel it
3. **FAILED SOLUTIONS** (90-120 seconds) - Why nothing else has worked for them
4. **UNIQUE MECHANISM** (120-180 seconds) - Introduce your unique solution/discovery
5. **PROOF & CREDIBILITY** (180-240 seconds) - Case studies, testimonials, authority
6. **THE OFFER** (240-300 seconds) - What they get, bonuses, value stack
7. **GUARANTEE** (300-330 seconds) - Risk reversal, confidence builder
8. **CALL TO ACTION** (330-360 seconds) - Urgency, scarcity, clear next step
9. **CLOSE** (360+ seconds) - Future pacing, final push

Format as a complete script with [VISUAL DIRECTIONS] in brackets. Make it conversational and compelling.`
  },
  'webinar': {
    system: `You are an expert at creating high-converting webinar scripts that educate and sell. You use the Perfect Webinar framework and similar proven structures.`,
    userTemplate: `Create a complete webinar script for the following offer:

{input}

Structure the webinar with:
1. **INTRO & HOOK** (5 min) - Big promise, what they'll learn
2. **YOUR STORY** (10 min) - Origin story, credibility, relatability
3. **CONTENT SECTION 1** (15 min) - First major teaching point with internal close
4. **CONTENT SECTION 2** (15 min) - Second major teaching point with internal close
5. **CONTENT SECTION 3** (15 min) - Third major teaching point with internal close
6. **THE STACK** (10 min) - Reveal the offer, value stack, bonuses
7. **CLOSE & Q&A** (20 min) - Handle objections, urgency, CTA

Include speaker notes and slide suggestions.`
  },
  'youtube': {
    system: `You are a YouTube content strategist who creates engaging video scripts that hook viewers, deliver value, and drive action.`,
    userTemplate: `Create an engaging YouTube video script for the following topic:

{input}

Structure:
1. **HOOK** (0-15 seconds) - Attention-grabbing opening
2. **INTRO** (15-30 seconds) - What they'll learn, why it matters
3. **MAIN CONTENT** - 3-5 key points with examples
4. **CALL TO ACTION** - Subscribe, like, comment prompt
5. **OUTRO** - Quick recap, next video tease

Include B-roll suggestions and on-screen text ideas.`
  },
  'facebook-ad': {
    system: `You are a Facebook advertising expert who writes high-converting ad copy that stops the scroll and drives action. You understand different ad angles and emotional triggers.`,
    userTemplate: `Create 5 different Facebook ad variations for the following offer:

{input}

For each ad, provide:
1. **Primary Text** (compelling copy, 125-250 characters visible)
2. **Headline** (under 40 characters)
3. **Description** (optional, under 30 characters)
4. **CTA Button** recommendation
5. **Ad Angle** (pain point, curiosity, social proof, fear, desire)

Make each ad use a DIFFERENT angle/approach. Include emojis where appropriate.`
  },
  'google-ad': {
    system: `You are a Google Ads expert who writes high-CTR search ads that match user intent and drive qualified clicks.`,
    userTemplate: `Create Google Search ad copy sets for the following offer:

{input}

Provide 3 ad variations with:
1. **Headlines** (3 headlines, max 30 chars each)
2. **Descriptions** (2 descriptions, max 90 chars each)
3. **Target Keywords** (10 relevant keywords)
4. **Negative Keywords** (5 keywords to exclude)

Focus on search intent and include strong CTAs.`
  },
  'linkedin-ad': {
    system: `You are a B2B LinkedIn advertising specialist who writes professional, credible ad copy for business audiences.`,
    userTemplate: `Create LinkedIn ad copy for the following B2B offer:

{input}

Provide 3 ad variations with:
1. **Intro Text** (professional, value-focused, 150-300 characters)
2. **Headline** (under 70 characters)
3. **Description** (under 100 characters)
4. **CTA** recommendation

Maintain professional tone while being engaging. Focus on business outcomes and ROI.`
  },
  'landing-page': {
    system: `You are a landing page copywriter who creates high-converting pages that turn visitors into leads and customers.`,
    userTemplate: `Create complete landing page copy for the following offer:

{input}

Include all sections:
1. **HERO SECTION** - Headline, subheadline, CTA button, hero image suggestion
2. **PROBLEM SECTION** - Pain points, agitation
3. **SOLUTION SECTION** - Your unique approach
4. **FEATURES/BENEFITS** - 3-6 key benefits with icons
5. **SOCIAL PROOF** - Testimonial templates, trust badges
6. **HOW IT WORKS** - 3-step process
7. **PRICING/CTA** - Clear offer, guarantee
8. **FAQ** - 5 common questions and answers
9. **FINAL CTA** - Urgency, last push

Format as sections with clear headings.`
  },
  'sales-page': {
    system: `You are a long-form sales page copywriter who writes compelling, story-driven sales pages that convert.`,
    userTemplate: `Create a complete long-form sales page for the following offer:

{input}

Include:
1. **PRE-HEADLINE** - Target audience qualifier
2. **MAIN HEADLINE** - Big promise
3. **OPENING STORY** - Hook them with narrative
4. **PROBLEM AMPLIFICATION** - Make them feel the pain
5. **SOLUTION REVEAL** - Introduce your answer
6. **BENEFITS DEEP DIVE** - Detailed benefits with proof
7. **CREDIBILITY SECTION** - Your story, qualifications
8. **TESTIMONIALS** - Social proof templates
9. **THE OFFER** - Complete value stack
10. **BONUSES** - Additional value
11. **GUARANTEE** - Risk reversal
12. **PRICING** - Present the investment
13. **FAQ** - Handle objections
14. **CLOSE** - Final push with urgency

Make it emotional, story-driven, and conversion-focused.`
  },
  'opt-in': {
    system: `You are a lead generation expert who writes compelling opt-in page copy that maximizes conversions.`,
    userTemplate: `Create opt-in page copy for the following lead magnet:

{input}

Include:
1. **HEADLINE** - Clear value proposition
2. **SUBHEADLINE** - What they'll get
3. **BULLET POINTS** - 3-5 key benefits/learnings
4. **FORM FIELDS** - Recommended fields
5. **BUTTON TEXT** - Compelling CTA
6. **SOCIAL PROOF** - Trust elements
7. **PRIVACY NOTE** - Spam-free promise

Keep it focused and high-converting. Less is more.`
  },
  'email-sequence': {
    system: `You are an email marketing expert who writes nurturing sequences that build relationships and drive sales.`,
    userTemplate: `Create a 7-day email nurture sequence for the following offer:

{input}

For each email include:
- **Subject Line** (and preview text)
- **Email Body** (personalized, conversational)
- **CTA** (clear next step)
- **Purpose** (what this email accomplishes)

Email 1: Welcome + quick win
Email 2: Your story + credibility
Email 3: Address main objection
Email 4: Case study/social proof
Email 5: The big idea/belief shift
Email 6: Soft pitch introduction
Email 7: Hard pitch with urgency`
  },
  'welcome-email': {
    system: `You are an email copywriter who creates warm, engaging welcome sequences that onboard new subscribers.`,
    userTemplate: `Create a 3-email welcome sequence for:

{input}

Email 1: Immediate welcome, deliver lead magnet, set expectations
Email 2: Your story, build connection, quick win tip
Email 3: Best content recommendation, soft CTA

Include subject lines and full email copy.`
  },
  'cart-abandonment': {
    system: `You are an e-commerce email expert who writes cart abandonment sequences that recover lost sales.`,
    userTemplate: `Create a 3-email cart abandonment sequence for:

{input}

Email 1: (1 hour after) - Gentle reminder, helpful tone
Email 2: (24 hours after) - Address concerns, add urgency
Email 3: (48 hours after) - Final chance, incentive offer

Include subject lines, email copy, and timing recommendations.`
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, input, userId } = body;

    if (!type || !input) {
      return NextResponse.json(
        { error: 'Missing type or input' },
        { status: 400 }
      );
    }

    const promptConfig = contentPrompts[type];
    if (!promptConfig) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const userPrompt = promptConfig.userTemplate.replace('{input}', input);

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: promptConfig.system },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      content,
      type,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
