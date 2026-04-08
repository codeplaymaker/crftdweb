/**
 * Rep Sales Knowledge Base — CrftdWeb
 *
 * Sales frameworks from 10 foundational books, adapted for cold-calling
 * small business owners to book web design discovery calls.
 *
 * Books:
 * 1. SPIN Selling — Neil Rackham
 * 2. Never Split the Difference — Chris Voss
 * 3. Influence: The Psychology of Persuasion — Robert Cialdini
 * 4. The Challenger Sale — Dixon & Adamson
 * 5. Way of the Wolf (Straight Line Selling) — Jordan Belfort
 * 6. Pitch Anything — Oren Klaff
 * 7. Gap Selling — Keenan
 * 8. The Psychology of Selling — Brian Tracy
 * 9. Pre-Suasion — Robert Cialdini
 * 10. To Sell Is Human — Daniel Pink
 */

import {
  TrainingRatingCategory,
  TrainingScenario,
  DifficultyLevel,
  DrillPrompt,
  DrillType,
  RepRank,
} from '../types/repTraining';

// ── Framework definitions ──────────────────────────────────

export interface SalesPrinciple {
  id: string;
  name: string;
  description: string;
  detectPatterns: string[];
  antiPatterns: string[];
  exampleGood: string;
  exampleBad: string;
  coachingTip: string;
  weight: number;
}

export interface SalesFramework {
  id: string;
  name: string;
  book: string;
  author: string;
  description: string;
  ratingCategories: TrainingRatingCategory[];
  principles: SalesPrinciple[];
}

// ── 10 Sales Frameworks ────────────────────────────────────

export const SALES_FRAMEWORKS: SalesFramework[] = [
  // 1. SPIN SELLING
  {
    id: 'spin_selling',
    name: 'SPIN Selling',
    book: 'SPIN Selling',
    author: 'Neil Rackham',
    description:
      'Question-based methodology progressing through Situation → Problem → Implication → Need-Payoff to uncover deep pain.',
    ratingCategories: ['discovery', 'listening'],
    principles: [
      {
        id: 'spin_situation',
        name: 'Situation Questions',
        description: 'Gather facts about their current website/online presence briefly. Limit to 2–3.',
        detectPatterns: [
          'tell me about your website',
          'how are you currently',
          'walk me through',
          'are you getting enquiries',
          'how do most customers find you',
          'what\'s your website like',
        ],
        antiPatterns: ['let me tell you about us', 'we build websites that', 'our websites start from'],
        exampleGood: 'How are most of your customers finding you right now — is the website bringing them in, or is it mainly word of mouth?',
        exampleBad: 'So, we build custom websites starting from £997. Let me tell you what we do.',
        coachingTip: 'Get 2–3 facts about their current situation quickly, then move to Problem questions. Don\'t interrogate.',
        weight: 5,
      },
      {
        id: 'spin_problem',
        name: 'Problem Questions',
        description: 'Uncover frustrations with their current site or online presence.',
        detectPatterns: [
          'what challenges',
          'what frustrates you',
          'not getting enquiries',
          'site not doing much',
          'looks a bit dated',
          'hard to update',
          'not showing up on google',
          'losing customers to',
        ],
        antiPatterns: ['everything sounds great', 'that\'s fine', 'no worries about that'],
        exampleGood: 'Out of curiosity — are you consistently getting enquiries through the site, or do most people find you another way?',
        exampleBad: 'Sounds like the website is working well then!',
        coachingTip: 'Don\'t accept "it\'s fine." Ask: "so you\'re happy with the volume of enquiries you\'re getting?" Most won\'t say yes.',
        weight: 8,
      },
      {
        id: 'spin_implication',
        name: 'Implication Questions',
        description: 'Make them feel the cost of a weak web presence. This is where calls are won.',
        detectPatterns: [
          'what happens if',
          'what does that mean for',
          'how many leads do you think you\'re missing',
          'what does that cost you',
          'if your competitors',
          'what\'s the impact',
          'how much business',
        ],
        antiPatterns: ['it\'s not that bad', 'a lot of people have that', 'don\'t worry'],
        exampleGood: 'If your site isn\'t converting, and your competitor down the road has a slick one that is — how many jobs do you think you\'re losing a month?',
        exampleBad: 'Yeah, lots of businesses have the same issue. Anyway, let me tell you what we do.',
        coachingTip: 'Implication questions make inaction painful. Dwell here. Let them do the maths out loud.',
        weight: 10,
      },
      {
        id: 'spin_need_payoff',
        name: 'Need-Payoff Questions',
        description: 'Get them to articulate what a better site would mean. They sell themselves.',
        detectPatterns: [
          'what would it mean if',
          'how would it help if',
          'if you could get',
          'imagine if your site',
          'what would change if',
          'how valuable would it be',
        ],
        antiPatterns: ['we can fix that', 'our solution is', 'here\'s what we\'ll do'],
        exampleGood: 'If your site was bringing in 3–4 solid enquiries a month on autopilot — what would that change for you?',
        exampleBad: 'We solve that problem perfectly. Let me show you our portfolio.',
        coachingTip: 'Let them say the value in their own words. When they do, they\'ve already mentally bought it.',
        weight: 9,
      },
    ],
  },

  // 2. NEVER SPLIT THE DIFFERENCE
  {
    id: 'never_split',
    name: 'Tactical Empathy',
    book: 'Never Split the Difference',
    author: 'Chris Voss',
    description:
      'FBI negotiation techniques: mirroring, labeling, calibrated questions. Disarm resistance without pressure.',
    ratingCategories: ['rapport', 'listening', 'objection_handling'],
    principles: [
      {
        id: 'voss_labeling',
        name: 'Labeling Emotions',
        description: 'Name what they\'re feeling. "It sounds like..." diffuses tension instantly.',
        detectPatterns: [
          'it sounds like',
          'it seems like',
          'it feels like',
          'what I\'m hearing is',
          'sounds like you\'ve',
        ],
        antiPatterns: ['I understand', 'I know how you feel', 'don\'t worry about that'],
        exampleGood: 'It sounds like you\'ve had people try to sell you stuff before and it was a waste of your time.',
        exampleBad: 'I understand. Lots of businesses feel that way. Anyway...',
        coachingTip: '"It sounds like..." beats "I understand" every time. It shows you actually heard them, not just waiting to respond.',
        weight: 9,
      },
      {
        id: 'voss_mirroring',
        name: 'Mirroring',
        description: 'Repeat their last 1–3 words as a question. Gets them to elaborate without pressure.',
        detectPatterns: [],
        antiPatterns: ['anyway', 'moving on', 'so what I was saying', 'let me tell you'],
        exampleGood: 'Prospect: "We just had it redone." You: "Just had it redone?"',
        exampleBad: 'Prospect: "We just had it redone." You: "Got it, well our sites are better, here\'s why..."',
        coachingTip: 'Mirror their last few words. Simple, powerful, massively underused. It makes them keep talking.',
        weight: 7,
      },
      {
        id: 'voss_accusation_audit',
        name: 'Accusation Audit',
        description: 'Front-load the negatives before they raise them. Kills objections before they start.',
        detectPatterns: [
          'you\'re probably thinking',
          'you might be wondering',
          'I know this might sound',
          'you\'ve probably had people',
          'before you say',
          'I know what you\'re thinking',
        ],
        antiPatterns: [],
        exampleGood: 'You\'re probably thinking this is another cold call trying to sell you something you don\'t need.',
        exampleBad: '*waits for "we\'re fine" and then scrambles*',
        coachingTip: 'Say the objection before they do. It instantly lowers the wall and makes you seem honest.',
        weight: 8,
      },
      {
        id: 'voss_calibrated',
        name: 'Calibrated Questions',
        description: 'Use "How" and "What" questions to open things up. Never "Why" — it makes people defensive.',
        detectPatterns: [
          'how would you',
          'what would it take',
          'how can we',
          'what does that look like',
          'how do you',
          'what would help',
        ],
        antiPatterns: ['why don\'t you', 'why wouldn\'t you', 'why not just'],
        exampleGood: 'What would it take for a call to be worth 15 minutes of your time?',
        exampleBad: 'Why wouldn\'t you want a better website?',
        coachingTip: 'Replace "Why" with "How" or "What." "Why" = accusation. "How/What" = collaborative.',
        weight: 7,
      },
    ],
  },

  // 3. INFLUENCE — CIALDINI
  {
    id: 'influence',
    name: 'Principles of Influence',
    book: 'Influence: The Psychology of Persuasion',
    author: 'Robert Cialdini',
    description: 'The 6 universal principles of persuasion — applied to cold call objections and booking the call.',
    ratingCategories: ['closing', 'rapport'],
    principles: [
      {
        id: 'cialdini_social_proof',
        name: 'Social Proof',
        description: 'Show that businesses like theirs have already worked with us. "Similar businesses" is powerful.',
        detectPatterns: [
          'we recently built for a',
          'similar business',
          'other [industry] businesses',
          'one of our clients',
          'a [plumber/gym/salon] like yours',
          'they went from',
        ],
        antiPatterns: [],
        exampleGood: 'We recently built a site for a local plumber similar to you — they said enquiries went up within the first month.',
        exampleBad: 'Trust me, it works.',
        coachingTip: 'Match the social proof to their exact industry. "A plumber like you" is 10x more powerful than "other businesses."',
        weight: 7,
      },
      {
        id: 'cialdini_commitment',
        name: 'Micro-commitments',
        description: 'Get small yeses throughout the call. People stay consistent with what they\'ve agreed to.',
        detectPatterns: [
          'would you agree that',
          'fair to say',
          'you mentioned that',
          'so based on what you said',
          'is that right',
          'so you\'re not happy with',
        ],
        antiPatterns: ['so do you want to book', 'ready to go ahead'],
        exampleGood: 'So you\'re not getting consistent enquiries through the site — fair to say it\'s not really working for you?',
        exampleBad: 'So are you ready to book then?',
        coachingTip: 'Stack small agreements. By the time you ask for the call, saying yes feels natural.',
        weight: 8,
      },
      {
        id: 'cialdini_scarcity',
        name: 'Scarcity / Urgency',
        description: 'Genuine urgency around availability or opportunity. Must be real.',
        detectPatterns: [
          'only a couple of spots',
          'booking up fast',
          'limited availability',
          'this week',
          'before the end of',
          'fills up quickly',
          'we only take on',
        ],
        antiPatterns: ['take your time', 'no rush', 'whenever you\'re ready', 'let me know'],
        exampleGood: 'He\'s got a couple of slots this week — after that it\'s a few weeks wait. Worth grabbing one now?',
        exampleBad: 'Take your time, let me know when you want to chat.',
        coachingTip: 'Real scarcity converts. Fake scarcity destroys trust. Use it only if it\'s true.',
        weight: 6,
      },
      {
        id: 'cialdini_reciprocity',
        name: 'Give First',
        description: 'Provide a genuine insight or observation about their business before asking for anything.',
        detectPatterns: [
          'I noticed your site',
          'quick observation',
          'one thing I spotted',
          'from what I can see',
          'looks like your site is missing',
          'regardless of whether',
        ],
        antiPatterns: ['what can you do for me', 'so about pricing', 'how much budget'],
        exampleGood: 'I had a look before calling — your site looks like it was built a few years ago and doesn\'t show up for local searches. Just a heads up.',
        exampleBad: 'So here\'s our pricing. How does that sound?',
        coachingTip: 'Give a genuine observation first. Makes the call feel like value, not a pitch.',
        weight: 7,
      },
    ],
  },

  // 4. THE CHALLENGER SALE
  {
    id: 'challenger_sale',
    name: 'The Challenger Approach',
    book: 'The Challenger Sale',
    author: 'Matthew Dixon & Brent Adamson',
    description: 'Teach, tailor, take control. The best reps create constructive tension and reframe the prospect\'s thinking.',
    ratingCategories: ['control', 'discovery'],
    principles: [
      {
        id: 'challenger_teach',
        name: 'Commercial Insight',
        description: 'Show them something they didn\'t know about how their site is hurting them.',
        detectPatterns: [
          'what most business owners don\'t realise',
          'here\'s what\'s interesting',
          'the thing about websites is',
          'most sites like yours',
          'your competitors',
          'what I find with',
          'the real problem isn\'t',
        ],
        antiPatterns: ['you know your business best', 'whatever you think', 'I agree completely'],
        exampleGood: 'What most business owners don\'t realise is that having a website that\'s slow or hard to navigate costs more in lost enquiries than a new one would.',
        exampleBad: 'You know your business better than me, so if you say the site\'s fine, I\'ll take your word for it.',
        coachingTip: 'Teach them something they didn\'t know. Don\'t just validate — reframe.',
        weight: 9,
      },
      {
        id: 'challenger_tailor',
        name: 'Tailor to Their World',
        description: 'Everything you say should reference what they told you. No generic pitches.',
        detectPatterns: [
          'because you mentioned',
          'given that you\'re a',
          'for a business like yours',
          'in your industry',
          'since you said',
          'you told me',
        ],
        antiPatterns: ['our standard package', 'what we always do', 'for everyone'],
        exampleGood: 'Given that you said most of your customers come through word of mouth — a well-built site could mean you\'re capturing them when they Google you, not losing them to a competitor.',
        exampleBad: 'Here\'s our standard package. It works for everyone.',
        coachingTip: 'Reference what they told you in every point you make. Generic = forgettable.',
        weight: 8,
      },
      {
        id: 'challenger_control',
        name: 'Take Control',
        description: 'Be willing to respectfully push back. Don\'t be a yes-man.',
        detectPatterns: [
          'can I be honest',
          'I\'d respectfully push back on that',
          'actually, in my experience',
          'that\'s a fair point but',
          'I hear you, and',
          'with respect',
        ],
        antiPatterns: [
          'sure, whatever you think',
          'you\'re absolutely right',
          'I don\'t want to be pushy',
          'sorry if this is',
          'no worries at all',
        ],
        exampleGood: 'Can I be honest? When businesses tell me their site\'s doing fine, it usually means they\'re not tracking it — they just haven\'t seen what they\'re missing yet.',
        exampleBad: 'Oh totally, you\'re right, no worries, I\'ll leave you to it.',
        coachingTip: 'Be willing to respectfully disagree. Pushiness is the wrong tone — confidence is the right one.',
        weight: 8,
      },
    ],
  },

  // 5. WAY OF THE WOLF — BELFORT
  {
    id: 'straight_line',
    name: 'Straight Line Selling',
    book: 'Way of the Wolf',
    author: 'Jordan Belfort',
    description: 'Keep the conversation on a straight line toward the booking. Tonality, looping, the Three Tens.',
    ratingCategories: ['closing', 'control'],
    principles: [
      {
        id: 'belfort_tonality',
        name: 'Tonality',
        description: 'Tone matters more than words. Project certainty, calm, and enthusiasm without being pushy.',
        detectPatterns: [],
        antiPatterns: ['um', 'er', 'uh', 'sorry to bother you', 'I know you\'re busy but', 'I won\'t take long'],
        exampleGood: '*Speaks with calm authority. Short sentences. No filler words.*',
        exampleBad: 'Hi, uh, sorry to bother you, I won\'t take long, um, I was just wondering...',
        coachingTip: 'Eliminate filler words. Project certainty. Sound like you\'re doing them a favour by calling, not apologising for it.',
        weight: 9,
      },
      {
        id: 'belfort_looping',
        name: 'Looping on Objections',
        description: 'Don\'t give up on the first no. Acknowledge, reframe, restate value, ask again.',
        detectPatterns: [
          'I hear you',
          'that makes sense',
          'a lot of people say that',
          'here\'s the thing though',
          'what I\'ve found is',
          'let me ask you this',
          'putting aside the',
        ],
        antiPatterns: ['oh okay, no problem', 'fair enough, I\'ll let you go', 'that\'s fine, maybe another time'],
        exampleGood: '"We\'re fine." — "I hear that, a lot of business owners say that, and I\'m not saying anything\'s wrong. Out of curiosity though — are you consistently getting enquiries through the site?"',
        exampleBad: '"We\'re fine." — "Oh, no worries! Have a good day."',
        coachingTip: 'One "no" is the start of the conversation, not the end. Loop back with a different angle.',
        weight: 8,
      },
      {
        id: 'belfort_straight_line',
        name: 'Stay on the Line',
        description: 'Every message should move toward booking the call. Don\'t get sidetracked by tangents.',
        detectPatterns: [
          'so the next step would be',
          'what I\'d suggest is',
          'let\'s get you a time',
          'can we lock in',
          'the call would be',
        ],
        antiPatterns: [
          'anyway, whatever',
          'it doesn\'t matter',
          'we can talk about that later',
          'going off topic',
        ],
        exampleGood: 'Everything we\'ve talked about would be covered in the call — he\'d walk you through exactly what he\'d build and what it\'d cost. Can we get you that slot?',
        exampleBad: 'Yeah so we do lots of different stuff, we have different plans, there\'s the landing page option, or the full site, or actually we can do apps too...',
        coachingTip: 'Your only goal is the call. Every sentence should point toward booking it.',
        weight: 7,
      },
    ],
  },

  // 6. PITCH ANYTHING — OREN KLAFF
  {
    id: 'pitch_anything',
    name: 'Frame Control',
    book: 'Pitch Anything',
    author: 'Oren Klaff',
    description: 'Frame control, prize framing, and managing the prospect\'s status instincts.',
    ratingCategories: ['control', 'rapport'],
    principles: [
      {
        id: 'klaff_prize_frame',
        name: 'Prize Framing',
        description: 'Position CrftdWeb as the thing to be chased, not the chaser. We vet clients too.',
        detectPatterns: [
          'not every business is a fit',
          'he\'s selective about who he takes on',
          'only if it makes sense',
          'it depends on the project',
          'he doesn\'t work with everyone',
          'he\'d want to make sure',
        ],
        antiPatterns: [
          'please just give us a chance',
          'we\'d love to work with you',
          'whatever you need',
          'we\'re very flexible',
          'we can do anything you want',
        ],
        exampleGood: 'He\'s quite selective about who he works with — he\'d want to make sure it\'s actually the right project before taking it on. That\'s why the call is useful.',
        exampleBad: 'Please just give us a chance, we\'d love to work with you!',
        coachingTip: 'Don\'t chase. Position the call as a mutual vetting process, not you begging for work.',
        weight: 8,
      },
      {
        id: 'klaff_intrigue_frame',
        name: 'Intrigue / Local Tension',
        description: 'Create mild curiosity at the start that makes them want to keep listening.',
        detectPatterns: [
          'quick question for you',
          'I actually had a look at your',
          'I noticed something about your',
          'I came across your business',
          'something caught my eye',
        ],
        antiPatterns: [
          'I\'m calling to sell you',
          'we\'re a web agency',
          'we do websites',
          'let me tell you about us',
        ],
        exampleGood: 'I came across your business online and noticed something about the site — I had a quick question for you.',
        exampleBad: 'Hi, I\'m calling from CrftdWeb, we\'re a web design agency and we build websites for businesses like yours.',
        coachingTip: 'Create a question in their mind before you explain anything. Curiosity = attention.',
        weight: 7,
      },
    ],
  },

  // 7. GAP SELLING — KEENAN
  {
    id: 'gap_selling',
    name: 'Gap Selling',
    book: 'Gap Selling',
    author: 'Keenan',
    description: 'Sell the gap between their current state and the future state they want. Make the gap visceral.',
    ratingCategories: ['discovery', 'closing'],
    principles: [
      {
        id: 'gap_current_state',
        name: 'Map Current State',
        description: 'Understand exactly where they are now — technically, emotionally, financially.',
        detectPatterns: [
          'what\'s the site doing for you now',
          'how many enquiries',
          'what does the site look like',
          'how old is the',
          'what platform',
          'when was it last updated',
        ],
        antiPatterns: [],
        exampleGood: 'What\'s the site actually doing for you right now — are you getting enquiries, or is it mainly just there for credibility?',
        exampleBad: 'Let me just show you what we could build for you.',
        coachingTip: 'The gap doesn\'t exist until you\'ve mapped both ends. Get clear on their current reality first.',
        weight: 8,
      },
      {
        id: 'gap_future_state',
        name: 'Define Future State',
        description: 'Get them to describe what better looks like. Their words, not yours.',
        detectPatterns: [
          'what would good look like',
          'ideally what would you want',
          'if the site was doing its job',
          'in a perfect world',
          'what would you want it to do',
          'what does success look like',
        ],
        antiPatterns: [],
        exampleGood: 'What would a website that was actually working look like for you — what would it be doing?',
        exampleBad: 'So our sites come with SEO, fast loading, mobile-first design...',
        coachingTip: 'Let them describe their future state. When they say it, they feel the gap themselves.',
        weight: 9,
      },
      {
        id: 'gap_make_visceral',
        name: 'Make the Gap Visceral',
        description: 'Put a number or a story on the gap. Make the cost of staying put feel real.',
        detectPatterns: [
          'so the gap between',
          'every month that',
          'if you\'re losing even one job',
          'what\'s a typical job worth',
          'so that\'s potentially',
          'over a year that\'s',
        ],
        antiPatterns: [],
        exampleGood: 'If a decent site brought in just one extra job a month, and a typical job\'s worth £2k — that\'s £24k over a year from a £997 investment.',
        exampleBad: 'Anyway, our sites are really good value.',
        coachingTip: 'Put maths on the gap. Help them calculate the cost of doing nothing.',
        weight: 10,
      },
    ],
  },

  // 8. THE PSYCHOLOGY OF SELLING — BRIAN TRACY
  {
    id: 'psych_selling',
    name: 'Psychology of Selling',
    book: 'The Psychology of Selling',
    author: 'Brian Tracy',
    description: 'Self-image, asking for the sale, handling rejection, and understanding buying psychology.',
    ratingCategories: ['closing', 'objection_handling'],
    principles: [
      {
        id: 'tracy_ask',
        name: 'Actually Ask for the Sale',
        description: 'Most reps fail because they never directly ask. Ask clearly and confidently.',
        detectPatterns: [
          'can I get you a slot',
          'shall we book that in',
          'what works better for you',
          'mornings or afternoons',
          'can we lock in a time',
          'would you be open to',
        ],
        antiPatterns: [
          'it\'s up to you',
          'just let me know',
          'whenever you\'re ready',
          'no pressure obviously',
          'only if you want to',
        ],
        exampleGood: 'He\'s got a couple of slots this week — what works better for you, mornings or afternoons?',
        exampleBad: 'So yeah... if you ever want a call at some point, just let me know, no pressure at all.',
        coachingTip: 'You have to ask. Directly. Every time. Timid asks get no answers.',
        weight: 10,
      },
      {
        id: 'tracy_objections_buying',
        name: 'Objections Are Buying Signals',
        description: 'When someone objects, they\'re still in the conversation. Engage, don\'t retreat.',
        detectPatterns: [
          'good question',
          'I\'m glad you brought that up',
          'that\'s exactly what he\'d cover',
          'fair point',
          'I hear you, and here\'s the thing',
        ],
        antiPatterns: ['oh okay, no worries', 'fair enough', 'yeah, I get it, sorry'],
        exampleGood: 'I\'m glad you brought up price — that\'s exactly what he\'d walk you through on the call so you\'d know exactly what you\'d get for it.',
        exampleBad: 'Oh, okay, yeah, totally understand, sorry to bother you.',
        coachingTip: 'An objection means they\'re still thinking about it. Engage every one.',
        weight: 8,
      },
    ],
  },

  // 9. PRE-SUASION — CIALDINI
  {
    id: 'pre_suasion',
    name: 'Pre-Suasion',
    book: 'Pre-Suasion',
    author: 'Robert Cialdini',
    description: 'What you do BEFORE the pitch matters most. Prime the prospect\'s mindset before the ask.',
    ratingCategories: ['rapport', 'closing'],
    principles: [
      {
        id: 'presua_unity',
        name: 'Unity ("We")',
        description: 'Use "we" language to create us-vs-the-problem framing rather than you-vs-me.',
        detectPatterns: ['we', 'let\'s', 'together', 'between us', 'what we could do'],
        antiPatterns: ['you need to', 'you should', 'you must', 'I want you to'],
        exampleGood: 'Let\'s see if there\'s actually something we can do for you — that\'s what the call\'s for.',
        exampleBad: 'You need to book a call. You should do this.',
        coachingTip: '"We" collapses the adversarial dynamic. Use it.',
        weight: 6,
      },
      {
        id: 'presua_attention',
        name: 'Directing Attention',
        description: 'What you prime them to focus on determines how they evaluate your offer.',
        detectPatterns: [
          'imagine if',
          'think about what it would mean',
          'picture your site',
          'what if every week',
          'just imagine',
        ],
        antiPatterns: [],
        exampleGood: 'Just imagine your site was bringing in 2–3 genuine enquiries every week without you having to chase anyone.',
        exampleBad: 'So yeah, our sites have good design and load fast.',
        coachingTip: 'Direct their attention to the outcome (enquiries, money) before describing the product.',
        weight: 7,
      },
    ],
  },

  // 10. TO SELL IS HUMAN — DANIEL PINK
  {
    id: 'to_sell_human',
    name: 'Human Selling',
    book: 'To Sell Is Human',
    author: 'Daniel Pink',
    description: 'ABCs: Attunement, Buoyancy, Clarity. Move others through genuine service, not manipulation.',
    ratingCategories: ['rapport', 'discovery'],
    principles: [
      {
        id: 'pink_attunement',
        name: 'Attunement',
        description: 'Match their energy, perspective, and interests. See it from their side first.',
        detectPatterns: [
          'that makes sense',
          'I can see why',
          'from your perspective',
          'I get that',
          'that\'s a fair point',
          'so from where you\'re standing',
        ],
        antiPatterns: ['but anyway', 'regardless', 'that\'s not the point', 'but here\'s the thing'],
        exampleGood: 'I get that — you\'ve probably had people call before and waste your time. I\'m not going to do that. Just one quick question.',
        exampleBad: 'Regardless, our websites are great. Let me tell you why.',
        coachingTip: 'Acknowledge their world before introducing yours. Resistance drops when people feel understood.',
        weight: 8,
      },
      {
        id: 'pink_clarity',
        name: 'Clarity',
        description: 'Help them see their problem more clearly than they did before you called.',
        detectPatterns: [
          'so to be clear',
          'the real issue is',
          'what this really means is',
          'let me put it simply',
          'in plain terms',
          'what that boils down to',
        ],
        antiPatterns: ['basically, roughly, sort of, kind of, it depends, might, possibly'],
        exampleGood: 'In plain terms — your site probably isn\'t bringing you work. The call is just to find out if we can change that.',
        exampleBad: 'So basically we kind of help businesses sort of improve their online presence a bit.',
        coachingTip: 'Be direct. Vague language destroys trust. Say clearly what you mean.',
        weight: 7,
      },
      {
        id: 'pink_service',
        name: 'Servant Selling',
        description: 'Lead with genuine service — you\'re calling to help, not to hit a number.',
        detectPatterns: [
          'only if it makes sense for you',
          'I\'d only recommend it if',
          'it might not even be relevant',
          'I want to be straight with you',
          'honestly',
          'off the record',
        ],
        antiPatterns: ['please just give us a chance', 'we\'d love to work with you', 'I really need this'],
        exampleGood: 'I\'ll be straight with you — if the call shows it\'s not the right time, he\'ll tell you that. No hard sell.',
        exampleBad: 'We really want your business, please just give us a try!',
        coachingTip: 'People buy from people who care. Leading with service is not weakness — it\'s the highest-converting approach.',
        weight: 7,
      },
    ],
  },
];

// ── Category Weights ───────────────────────────────────────

export const CATEGORY_WEIGHTS: Record<
  TrainingRatingCategory,
  { weight: number; description: string; primaryFrameworks: string[]; keyIndicators: string[] }
> = {
  discovery: {
    weight: 25,
    description: 'Quality of questions. SPIN progression. Uncovering pain and gap.',
    primaryFrameworks: ['SPIN Selling', 'Gap Selling', 'To Sell Is Human'],
    keyIndicators: [
      'Asked about current site / enquiries',
      'Uncovered a real problem',
      'Used implication questions',
      'Got them to articulate the future state',
      'Made the gap feel real',
    ],
  },
  listening: {
    weight: 20,
    description: 'Talk ratio. Mirroring. Labeling. Not interrupting. Responding to what was said.',
    primaryFrameworks: ['Never Split the Difference', 'To Sell Is Human'],
    keyIndicators: [
      'Talk ratio under 40%',
      'Used mirroring at least once',
      'Labeled an emotion ("It sounds like...")',
      'Asked follow-up based on their answer',
      'Did not interrupt',
    ],
  },
  objection_handling: {
    weight: 20,
    description: 'Handling "we\'re fine / not interested / already have one" without collapsing.',
    primaryFrameworks: ['Never Split the Difference', 'Way of the Wolf', 'The Psychology of Selling'],
    keyIndicators: [
      'Used accusation audit proactively',
      'Reframed — didn\'t just accept the objection',
      'Looped back after the first no',
      'Treated objection as a buying signal',
      'Did not apologise and hang up',
    ],
  },
  closing: {
    weight: 15,
    description: 'Actually asking for the booking. Binary choice. Creating urgency.',
    primaryFrameworks: ['The Psychology of Selling', 'Influence', 'Way of the Wolf'],
    keyIndicators: [
      'Directly asked to book a call',
      'Used binary choice ("mornings or afternoons?")',
      'Created genuine urgency/scarcity',
      'Didn\'t wimp out at the close',
      'Timed the ask appropriately',
    ],
  },
  rapport: {
    weight: 10,
    description: 'Tactical empathy. Reciprocity. Not being pushy. Making them feel heard.',
    primaryFrameworks: ['Never Split the Difference', 'Influence', 'Pre-Suasion', 'To Sell Is Human'],
    keyIndicators: [
      'Opened with disarming honesty',
      'Gave a genuine observation (reciprocity)',
      'Used "we" language',
      'Showed genuine interest',
      'Wasn\'t needy or apologetic',
    ],
  },
  control: {
    weight: 10,
    description: 'Frame control. Staying on the line. Not caving to pressure.',
    primaryFrameworks: ['Pitch Anything', 'Way of the Wolf', 'The Challenger Sale'],
    keyIndicators: [
      'Maintained confidence when pushed back on',
      'Kept conversation moving toward the booking',
      'Pushed back respectfully when appropriate',
      'Didn\'t over-apologise',
      'Positioned CrftdWeb as the prize',
    ],
  },
};

// ── Rank Thresholds ────────────────────────────────────────

export const RANK_THRESHOLDS: Record<RepRank, { minScore: number; minSessions: number; label: string; emoji: string; description: string }> = {
  rookie:    { minScore: 0,  minSessions: 0,  label: 'Rookie',    emoji: '🌱', description: 'Just getting started' },
  canvasser: { minScore: 40, minSessions: 3,  label: 'Canvasser', emoji: '📞', description: 'Getting comfortable on calls' },
  booker:    { minScore: 60, minSessions: 10, label: 'Booker',    emoji: '📅', description: 'Consistently booking calls' },
  hunter:    { minScore: 75, minSessions: 25, label: 'Hunter',    emoji: '🎯', description: 'High-converting cold caller' },
  ace:       { minScore: 90, minSessions: 50, label: 'Ace',       emoji: '👑', description: 'Elite closer — unlock Tier 2' },
};

// Unlock threshold: rep needs score >= this to access real leads
export const TRAINING_UNLOCK_THRESHOLD = 60; // matches 'booker'

export function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function getRank(averageScore: number, totalSessions: number): RepRank {
  if (averageScore >= 90 && totalSessions >= 50) return 'ace';
  if (averageScore >= 75 && totalSessions >= 25) return 'hunter';
  if (averageScore >= 60 && totalSessions >= 10) return 'booker';
  if (averageScore >= 40 && totalSessions >= 3)  return 'canvasser';
  return 'rookie';
}

// ── Training Scenarios ─────────────────────────────────────

export const TRAINING_SCENARIOS: TrainingScenario[] = [
  {
    id: 'warm_sme_open',
    name: 'Warm SME — Open to Change',
    description: 'Local business owner. Admits the site\'s not great. Just needs a push to book the call.',
    scenarioType: 'cold_call',
    difficulty: 'beginner',
    prospectProfile: {
      name: 'Dave Nwosu',
      gender: 'male',
      businessType: 'Local plumber',
      industry: 'Trades',
      background: 'Been plumbing for 12 years. Site was built by a mate in 2019. Gets most work from word of mouth.',
      hiddenMotivation: 'He wants to appear more professional to win bigger commercial contracts, not just domestic jobs.',
      currentSituation: 'No enquiries from site. Site looks dated. Not on first page of Google.',
      objections: ['Send me an email', 'How much does it cost?', 'I\'ll have a think'],
      dealBreakers: ['Being pushed on price before understanding the value', 'Talking too fast'],
    },
    objectives: [
      'Uncover that the site isn\'t working for him',
      'Make the gap feel real',
      'Book a 15-minute call',
    ],
    bonusObjectives: [
      'Discover he wants commercial contracts',
      'Get him to name what a working site would be worth',
    ],
    estimatedDuration: 5,
    tags: ['beginner', 'cold_call', 'trades'],
  },
  {
    id: 'resistant_fine',
    name: '"We\'re Fine" — The Blocker',
    description: 'Owner says they\'re happy with the site. Your job: get past the surface response without being pushy.',
    scenarioType: 'objection',
    difficulty: 'beginner',
    prospectProfile: {
      name: 'Priya Shah',
      gender: 'female',
      businessType: 'Beauty salon',
      industry: 'Health & Beauty',
      background: 'Runs a salon in Manchester. Has a Wix site her daughter built. Gets bookings mostly via Instagram.',
      hiddenMotivation: 'She\'s wary because she\'s been cold called before by pushy SEO agencies and it wasted her money.',
      currentSituation: 'Site is functional but not on Google. She doesn\'t realise people search for salons locally.',
      objections: ['We\'re fine thanks', 'We don\'t need a new site', 'We get all our bookings through Instagram'],
      dealBreakers: ['High pressure', 'Lying about what you know', 'Jumping straight to price'],
    },
    objectives: [
      'Get past "we\'re fine" without collapsing',
      'Open up a real conversation about whether the site is actually working',
      'Book the call or at least get the email',
    ],
    bonusObjectives: [
      'Uncover the SEO gap (people searching for salons locally)',
      'Use accusation audit to disarm her wariness',
    ],
    estimatedDuration: 5,
    tags: ['beginner', 'objection', 'beauty', 'cold_call'],
  },
  {
    id: 'already_has_site',
    name: '"We Just Had It Redone"',
    description: 'They recently spent money on a new site. Handle without dismissing their investment.',
    scenarioType: 'objection',
    difficulty: 'intermediate',
    prospectProfile: {
      name: 'Mark Ellis',
      gender: 'male',
      businessType: 'Accountancy firm',
      industry: 'Finance',
      background: 'Small accountancy firm in Leeds. Paid £2k for a new site 8 months ago from a local agency.',
      hiddenMotivation: 'He\'s quietly disappointed with the site — it looks fine but hasn\'t generated a single enquiry. He doesn\'t want to admit he wasted £2k.',
      currentSituation: 'Site is live. Zero enquiries from it. Ranks on page 4 for core search terms.',
      objections: ['We just had it redone', 'We\'ve already spent money on a website', 'Can\'t justify another spend'],
      dealBreakers: ['Criticising his existing site directly', 'Talking about price too early', 'Being dismissive of what he already spent'],
    },
    objectives: [
      'Acknowledge the recent investment without dismissing it',
      'Shift the conversation from "you need a new site" to "is your current site bringing in business?"',
      'Book the call',
    ],
    bonusObjectives: [
      'Get him to admit the site isn\'t generating enquiries',
      'Reframe: the issue isn\'t the design, it\'s the performance',
    ],
    estimatedDuration: 7,
    tags: ['intermediate', 'objection', 'accountancy', 'already_has_site'],
  },
  {
    id: 'gatekeeper_block',
    name: 'The Gatekeeper',
    description: 'Receptionist is blocking you. Get through to the decision-maker without being deceptive.',
    scenarioType: 'gatekeeper',
    difficulty: 'intermediate',
    prospectProfile: {
      name: 'Reception at Hartley & Sons Solicitors',
      gender: 'female',
      businessType: 'Law firm',
      industry: 'Legal',
      background: 'The receptionist Sofia handles all inbound calls. She\'s polite but firm. The partner is Robert Hartley.',
      hiddenMotivation: 'Sofia will put you through if you seem like you\'re calling about something specific and professional — not if you sound like a cold caller.',
      currentSituation: 'The firm\'s site is decent but hasn\'t been updated in 3 years and has no online reviews or booking functionality.',
      objections: ['Can I ask what it\'s regarding?', 'He\'s in a meeting', 'Can you send an email?', 'We don\'t take sales calls'],
      dealBreakers: ['Lying about the purpose of the call', 'Being aggressive', 'Refusing to email'],
    },
    objectives: [
      'Get through to Robert Hartley or arrange a callback',
      'Be honest about the nature of the call while making it sound worth his time',
    ],
    bonusObjectives: [
      'Make Sofia an ally rather than an obstacle',
      'Get the direct email or line',
    ],
    estimatedDuration: 5,
    tags: ['intermediate', 'gatekeeper', 'legal'],
  },
  {
    id: 'price_early_objector',
    name: '"How Much Does It Cost?"',
    description: 'They ask price immediately. Don\'t deflect badly — manage it and keep the conversation alive.',
    scenarioType: 'objection',
    difficulty: 'intermediate',
    prospectProfile: {
      name: 'Tom Hardy',
      gender: 'male',
      businessType: 'Personal trainer / gym owner',
      industry: 'Fitness',
      background: 'Runs a small gym. Very budget-conscious. Has been burned by expensive projects that didn\'t deliver.',
      hiddenMotivation: 'He actually has budget — he just filters calls by price immediately to protect himself from wasting time.',
      currentSituation: 'Gym site is basic, no online booking, losing clients to a bigger gym nearby with a slick app.',
      objections: ['How much is it?', 'That\'s too expensive', 'I can\'t afford that right now', 'Why is it so dear?'],
      dealBreakers: ['Refusing to give any indication of price at all', 'Being evasive', 'Immediately discounting'],
    },
    objectives: [
      'Handle the early price question without derailing the call',
      'Redirect to value before discussing specific numbers',
      'Book the call',
    ],
    bonusObjectives: [
      'Reframe: "the call is free and we\'ll give you a quote — that\'s the right time to discuss it"',
      'Anchor to ROI before mentioning any number',
    ],
    estimatedDuration: 6,
    tags: ['intermediate', 'price_objection', 'fitness'],
  },
  {
    id: 'cold_skeptical_director',
    name: 'The Skeptical Director',
    description: 'MD of a mid-sized business. Heard it all before. Has a sharp BS detector.',
    scenarioType: 'cold_call',
    difficulty: 'advanced',
    prospectProfile: {
      name: 'Claire Whitmore',
      gender: 'female',
      businessType: 'Recruitment agency',
      industry: 'Recruitment',
      background: 'MD of a 20-person firm. Dismisses salespeople instantly. Gets 10 cold calls a week.',
      hiddenMotivation: 'Their site is genuinely underperforming — she knows it but resents being told. She\'d respond to honesty and directness, not flattery.',
      currentSituation: 'Site looks corporate and outdated. Candidates and clients find them via LinkedIn and referrals only.',
      objections: ['Not interested', 'Send me an email', 'We have an agency that handles all of that', 'How did you get my number?'],
      dealBreakers: ['Being sycophantic', 'Wasting her time', 'Vagueness', 'Not knowing her industry'],
    },
    objectives: [
      'Get past the first dismissal',
      'Say something that makes her pause and engage',
      'Get a call or email',
    ],
    bonusObjectives: [
      'Use the Challenger insight reframe',
      'Reference her specific industry pain (candidate-facing sites losing talent to better UX)',
    ],
    estimatedDuration: 8,
    tags: ['advanced', 'cold_call', 'recruitment', 'skeptic'],
  },
  {
    id: 'warm_follow_up',
    name: 'Follow-Up: "I Said I\'d Think About It"',
    description: 'You sent an email after last week\'s call. Circle back without being annoying.',
    scenarioType: 'follow_up',
    difficulty: 'beginner',
    prospectProfile: {
      name: 'James Okafor',
      gender: 'male',
      businessType: 'Electrician / sole trader',
      industry: 'Trades',
      background: 'Sole trader. Was mildly interested on the first call. Said he\'d think about it. Hasn\'t replied to the email.',
      hiddenMotivation: 'He\'s interested but his mate told him to be careful of agencies. Just needs reassurance.',
      currentSituation: 'No website at all. Uses Facebook. Lost a big contract to a competitor who had a proper site.',
      objections: ['I did see the email but haven\'t had time', 'Still not sure it\'s the right time', 'I\'ll have a look tonight'],
      dealBreakers: ['Being pushy', 'Guilt-tripping', 'Ignoring what he said on the first call'],
    },
    objectives: [
      'Reference the first conversation specifically',
      'Give a genuine reason to act now rather than "whenever"',
      'Book the call this time',
    ],
    bonusObjectives: [
      'Use social proof (trade business like his)',
      'Create gentle urgency without fake pressure',
    ],
    estimatedDuration: 4,
    tags: ['beginner', 'follow_up', 'trades'],
  },
  {
    id: 'elite_hostile_prospect',
    name: 'Elite: The Hostile Owner',
    description: 'Angry from the start. Threatens to hang up. Test your composure and tactical empathy under maximum pressure.',
    scenarioType: 'cold_call',
    difficulty: 'elite',
    prospectProfile: {
      name: 'Gary Stubbs',
      gender: 'male',
      businessType: 'Car dealership',
      industry: 'Automotive',
      background: 'Owner of a used car lot. Has been scammed by a "web agency" before — paid £3k, got nothing. Now distrusts all cold callers.',
      hiddenMotivation: 'Deep down he knows his site is holding him back. He wants to trust someone again but is protecting himself.',
      currentSituation: 'Site is broken on mobile. He doesn\'t know. Losing younger buyers who can\'t view inventory.',
      objections: ['How dare you call me', 'I\'ve been ripped off by people like you', 'Hang up or I\'ll report you', 'You\'re all the same'],
      dealBreakers: ['Getting defensive', 'Being dismissive of his experience', 'Pushing back aggressively'],
    },
    objectives: [
      'Stay calm and composed under hostility',
      'Use tactical empathy to defuse the anger',
      'Get him from hostile to curious',
    ],
    bonusObjectives: [
      'Reference his specific bad experience without apologising for others',
      'Use accusation audit and labeling together',
      'Get any form of agreement by the end',
    ],
    estimatedDuration: 8,
    tags: ['elite', 'cold_call', 'hostile', 'automotive'],
  },
];

// ── Drill Prompts ──────────────────────────────────────────

export const DRILL_PROMPTS: Record<DrillType, DrillPrompt[]> = {
  objection_handling: [
    {
      id: 'obj_1', type: 'objection_handling', difficulty: 'beginner',
      prompt: '"We\'re fine thanks, we don\'t need a new website."',
      context: 'Owner picked up cold. This is their first response.',
      idealFrameworks: ['Never Split the Difference', 'Way of the Wolf', 'SPIN Selling'],
    },
    {
      id: 'obj_2', type: 'objection_handling', difficulty: 'beginner',
      prompt: '"Send me an email."',
      context: 'They\'re trying to get off the phone without engaging.',
      idealFrameworks: ['Way of the Wolf', 'Pitch Anything'],
    },
    {
      id: 'obj_3', type: 'objection_handling', difficulty: 'beginner',
      prompt: '"We just had ours redone."',
      context: 'They\'ve recently invested in a new site.',
      idealFrameworks: ['The Challenger Sale', 'Gap Selling', 'Never Split the Difference'],
    },
    {
      id: 'obj_4', type: 'objection_handling', difficulty: 'intermediate',
      prompt: '"How much does it cost?"',
      context: 'Asked within the first 30 seconds before any rapport is built.',
      idealFrameworks: ['Gap Selling', 'The Psychology of Selling', 'Influence'],
    },
    {
      id: 'obj_5', type: 'objection_handling', difficulty: 'intermediate',
      prompt: '"We already have someone who handles our website."',
      context: 'They have an existing developer or agency.',
      idealFrameworks: ['The Challenger Sale', 'SPIN Selling', 'Gap Selling'],
    },
    {
      id: 'obj_6', type: 'objection_handling', difficulty: 'intermediate',
      prompt: '"Not interested."',
      context: 'Flat, blunt, zero energy. Just two words.',
      idealFrameworks: ['Never Split the Difference', 'Way of the Wolf'],
    },
    {
      id: 'obj_7', type: 'objection_handling', difficulty: 'advanced',
      prompt: '"How did you get my number?"',
      context: 'Owner sounds annoyed.',
      idealFrameworks: ['Never Split the Difference', 'To Sell Is Human', 'Pitch Anything'],
    },
    {
      id: 'obj_8', type: 'objection_handling', difficulty: 'advanced',
      prompt: '"I\'ve been ripped off by a web agency before. You\'re all the same."',
      context: 'Genuine hostility based on a bad experience.',
      idealFrameworks: ['Never Split the Difference', 'The Challenger Sale', 'To Sell Is Human'],
    },
    {
      id: 'obj_9', type: 'objection_handling', difficulty: 'advanced',
      prompt: '"We get all our business through word of mouth. We don\'t need a website."',
      context: 'Owner seems successful. Genuinely doesn\'t see the need.',
      idealFrameworks: ['Gap Selling', 'The Challenger Sale', 'SPIN Selling'],
    },
    {
      id: 'obj_10', type: 'objection_handling', difficulty: 'elite',
      prompt: '"I had a £3,000 website built and it did absolutely nothing. Complete waste of money."',
      context: 'Open hostility mixed with a legitimate grievance.',
      idealFrameworks: ['Never Split the Difference', 'The Challenger Sale', 'Gap Selling'],
    },
  ],
  opening_lines: [
    {
      id: 'open_1', type: 'opening_lines', difficulty: 'beginner',
      prompt: 'A local plumber just picked up the phone. You have 8 seconds to earn 30 more seconds. Go.',
      idealFrameworks: ['Pitch Anything', 'Way of the Wolf', 'Never Split the Difference'],
    },
    {
      id: 'open_2', type: 'opening_lines', difficulty: 'beginner',
      prompt: 'A beauty salon owner picks up. She sounds busy. Open without sounding like a cold caller.',
      idealFrameworks: ['Pitch Anything', 'To Sell Is Human', 'Never Split the Difference'],
    },
    {
      id: 'open_3', type: 'opening_lines', difficulty: 'intermediate',
      prompt: 'A law firm receptionist answers. Ask for the Managing Partner without sounding like a sales call.',
      idealFrameworks: ['Pitch Anything', 'Influence', 'Way of the Wolf'],
    },
    {
      id: 'open_4', type: 'opening_lines', difficulty: 'intermediate',
      prompt: 'An accountant picks up mid-afternoon. Open in a way that earns a minute of their time.',
      idealFrameworks: ['Pitch Anything', 'Never Split the Difference', 'The Challenger Sale'],
    },
    {
      id: 'open_5', type: 'opening_lines', difficulty: 'advanced',
      prompt: 'A recruitment agency MD picks up. She\'s busy, sharp, and has heard every opener before. Go.',
      idealFrameworks: ['The Challenger Sale', 'Pitch Anything', 'Never Split the Difference'],
    },
    {
      id: 'open_6', type: 'opening_lines', difficulty: 'advanced',
      prompt: 'The owner of an e-commerce business picks up. Reference something specific about their online presence.',
      idealFrameworks: ['Pitch Anything', 'Gap Selling', 'The Challenger Sale'],
    },
  ],
  call_booking: [
    {
      id: 'book_1', type: 'call_booking', difficulty: 'beginner',
      prompt: 'They\'re interested. They\'ve agreed the site isn\'t great. Ask for the booking directly and confidently.',
      idealFrameworks: ['The Psychology of Selling', 'Influence', 'Way of the Wolf'],
    },
    {
      id: 'book_2', type: 'call_booking', difficulty: 'beginner',
      prompt: '"I\'ll have a think about it." — Move them from maybe to yes.',
      idealFrameworks: ['Influence', 'The Psychology of Selling', 'Way of the Wolf'],
    },
    {
      id: 'book_3', type: 'call_booking', difficulty: 'intermediate',
      prompt: '"Can you just email me some examples?" — Keep the live conversation, don\'t let it turn into a cold email.',
      idealFrameworks: ['Way of the Wolf', 'The Psychology of Selling', 'Pitch Anything'],
    },
    {
      id: 'book_4', type: 'call_booking', difficulty: 'intermediate',
      prompt: '"I need to speak to my business partner first." — Handle without collapsing or immediately backing off.',
      idealFrameworks: ['Influence', 'Never Split the Difference', 'The Psychology of Selling'],
    },
    {
      id: 'book_5', type: 'call_booking', difficulty: 'advanced',
      prompt: 'They loved the call but said "maybe next quarter." Create urgency and close the booking now.',
      idealFrameworks: ['Influence', 'The Psychology of Selling', 'Pre-Suasion'],
    },
  ],
  gatekeeper: [
    {
      id: 'gate_1', type: 'gatekeeper', difficulty: 'beginner',
      prompt: '"Can I ask what it\'s regarding?" — Get through without lying.',
      idealFrameworks: ['Pitch Anything', 'Never Split the Difference'],
    },
    {
      id: 'gate_2', type: 'gatekeeper', difficulty: 'intermediate',
      prompt: '"He\'s not available. Can you call back?" — Maximise this interaction before you hang up.',
      idealFrameworks: ['Never Split the Difference', 'Influence', 'Pitch Anything'],
    },
    {
      id: 'gate_3', type: 'gatekeeper', difficulty: 'advanced',
      prompt: '"We don\'t take sales calls." — Handle respectfully and make an impression.',
      idealFrameworks: ['Never Split the Difference', 'To Sell Is Human', 'Pitch Anything'],
    },
  ],
  reframing: [
    {
      id: 'reframe_1', type: 'reframing', difficulty: 'beginner',
      prompt: 'They think a website is an expense. Reframe it as an asset.',
      idealFrameworks: ['Gap Selling', 'The Challenger Sale', 'SPIN Selling'],
    },
    {
      id: 'reframe_2', type: 'reframing', difficulty: 'intermediate',
      prompt: 'They think social media is enough and they don\'t need a site. Reframe.',
      idealFrameworks: ['The Challenger Sale', 'Gap Selling', 'Pre-Suasion'],
    },
    {
      id: 'reframe_3', type: 'reframing', difficulty: 'intermediate',
      prompt: 'They think a cheap website builder is the same as a custom site. Reframe.',
      idealFrameworks: ['The Challenger Sale', 'Gap Selling', 'Influence'],
    },
    {
      id: 'reframe_4', type: 'reframing', difficulty: 'advanced',
      prompt: 'They made £200k last year without a proper website. Why change now? Reframe.',
      idealFrameworks: ['Gap Selling', 'The Challenger Sale', 'SPIN Selling'],
    },
  ],
};

// ── System Prompt Builders ─────────────────────────────────

export function buildRoleplaySystemPrompt(scenario: TrainingScenario, difficulty: string): string {
  return `You are roleplaying as ${scenario.prospectProfile.name}, a ${scenario.prospectProfile.businessType}.

BACKGROUND: ${scenario.prospectProfile.background}
CURRENT SITUATION: ${scenario.prospectProfile.currentSituation}
HIDDEN MOTIVATION (do not reveal unless earned through good questions): ${scenario.prospectProfile.hiddenMotivation}

YOUR PERSONALITY FOR THIS CALL:
- You are a real, busy UK business owner who just picked up a cold call
- You are NOT immediately warm or excited — be realistic and slightly guarded
- Difficulty level: ${difficulty}. ${difficulty === 'beginner' ? 'Be relatively open. Give them a chance.' : difficulty === 'intermediate' ? 'Push back on weak questions. Engage with strong ones.' : difficulty === 'advanced' ? 'Be resistant and demanding. Only open up to excellent technique.' : 'Be hostile and difficult. Maximum resistance. This is elite training.'}

OBJECTIONS YOU WILL RAISE (naturally, not all at once): ${scenario.prospectProfile.objections.join(' | ')}
DEAL BREAKERS (if triggered, the call is genuinely lost): ${scenario.prospectProfile.dealBreakers.join(' | ')}

THE REP'S GOAL: ${scenario.objectives.join(', ')}

RULES FOR YOUR ROLEPLAY:
1. Stay in character at all times. You are ${scenario.prospectProfile.name}, not an AI assistant.
2. YOU are the one being called. The rep is calling YOU. When the session starts, answer the phone as yourself — say something like "Yeah?" or "Hello?" or "${scenario.prospectProfile.name} speaking." — NOT "is this Dave Nwosu?" or anything that sounds like the caller.
3. Respond realistically — short, natural UK business owner language. No corporate speak.
4. If the rep uses good technique (labeling, implication questions, etc.) — reward it by opening up slightly.
5. If the rep uses bad technique (pitching too early, ignoring what you said) — shut down or object.
6. You do NOT volunteer information — only share if asked the right questions.
7. Keep responses short (1–4 sentences). Real calls are quick.
8. The rep is calling from CrftdWeb, a web design studio. The rep's job is only to book a 15-minute discovery call — NOT to close a deal.
9. Do NOT break character to give coaching. That happens after the session.`;
}

export function buildDrillSystemPrompt(): string {
  return `You are a strict but fair sales coach evaluating cold call responses from a CrftdWeb sales rep.

The rep's job is to cold call small UK business owners to book a 15-minute discovery call with CrftdWeb.
They are NOT closing deals — their only goal is to book the call or keep the conversation alive.

When given a drill prompt and the rep's response, you will:
1. Rate the response out of 10 (1–4 = poor, 5–6 = decent, 7–8 = good, 9–10 = excellent)
2. Give direct, specific feedback (2–3 sentences max)
3. Provide an ideal response example
4. Reference which sales framework principle was used or missed

Be direct. Don't be gentle with bad responses. Don't be stingy with good ones.`;
}

export function buildRatingSystemPrompt(scenario: TrainingScenario): string {
  const categoryList = Object.entries(CATEGORY_WEIGHTS)
    .map(([k, v]) => `- ${k} (${v.weight}% weight): ${v.description}\n  Frameworks: ${v.primaryFrameworks.join(', ')}`)
    .join('\n');

  return `You are an expert sales coach rating a completed cold call training session for a CrftdWeb sales rep.

SCENARIO: ${scenario.name}
PROSPECT: ${scenario.prospectProfile.name} — ${scenario.prospectProfile.businessType}
OBJECTIVES: ${scenario.objectives.join(', ')}
BONUS OBJECTIVES: ${scenario.bonusObjectives.join(', ')}
DIFFICULTY: ${scenario.difficulty}

RATING CATEGORIES (must score each 0–100):
${categoryList}

SALES FRAMEWORKS IN SCOPE (from 10 foundational books):
SPIN Selling, Never Split the Difference, Influence, The Challenger Sale, Way of the Wolf, Pitch Anything, Gap Selling, The Psychology of Selling, Pre-Suasion, To Sell Is Human.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "overallScore": <0-100>,
  "grade": "<A|B|C|D|F>",
  "callBooked": <true|false>,
  "summary": "<2-3 sentence overall assessment>",
  "topStrength": "<single most impressive thing they did>",
  "topWeakness": "<single most critical thing to fix>",
  "coachingPriority": "<one specific thing to work on in next session>",
  "categories": {
    "discovery": { "score": <0-100>, "grade": "<A-F>", "feedback": "...", "highlights": ["..."], "improvements": ["..."] },
    "listening": { ... },
    "objection_handling": { ... },
    "closing": { ... },
    "rapport": { ... },
    "control": { ... }
  }
}

Be honest and specific. Reference actual moments from the transcript. Don't be vague.`;
}
