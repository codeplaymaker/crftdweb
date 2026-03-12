// Template definitions for server-side image generation
// Matches the branded style from tiktok-portfolio-ads-v3.html

export type TemplateType =
  | 'problem-hook'
  | 'five-signs'
  | 'case-study'
  | 'framework'
  | 'cost-comparison'
  | 'proof'
  | 'cta'
  | 'tip';

export interface TemplateData {
  type: TemplateType;
  // Problem hook
  headline?: string;
  subheadline?: string;
  tag?: string;
  stats?: Array<{ value: string; label: string; source?: string }>;
  footer?: string;
  // Five signs / list-based
  items?: Array<{ title: string; description: string }>;
  // Case study
  client?: string;
  problem?: string;
  process?: string;
  results?: Array<{ value: string; label: string }>;
  // Framework / steps
  steps?: Array<{ number: string; title: string; description: string; color: string }>;
  // Cost comparison
  cheapSide?: Array<string>;
  premiumSide?: Array<string>;
  cheapResult?: { math: string; total: string };
  premiumResult?: { math: string; total: string };
  // Proof / testimonials
  testimonials?: Array<{ quote: string; name: string; role: string; metric: string; metricLabel: string }>;
  // CTA
  ctaText?: string;
  ctaSubtext?: string;
}

// Color themes matching the existing templates
export const TEMPLATE_THEMES: Record<TemplateType, { accent: string; accentRgb: string; tag: string; gradient: string }> = {
  'problem-hook': { accent: '#ef4444', accentRgb: '239,68,68', tag: 'HARD TRUTH', gradient: 'linear-gradient(90deg,#ef4444,#dc2626)' },
  'five-signs': { accent: '#fbbf24', accentRgb: '245,158,11', tag: 'FREE KNOWLEDGE', gradient: 'linear-gradient(90deg,#f59e0b,#eab308)' },
  'case-study': { accent: '#4ade80', accentRgb: '34,197,94', tag: 'CASE STUDY', gradient: 'linear-gradient(90deg,#22c55e,#10b981)' },
  'framework': { accent: '#a78bfa', accentRgb: '139,92,246', tag: 'MY FRAMEWORK', gradient: 'linear-gradient(90deg,#8b5cf6,#6d28d9)' },
  'cost-comparison': { accent: '#f87171', accentRgb: '239,68,68', tag: 'THE MATH', gradient: 'linear-gradient(90deg,#ef4444,#7c3aed)' },
  'proof': { accent: '#c084fc', accentRgb: '168,85,247', tag: 'CLIENT RESULTS', gradient: 'linear-gradient(90deg,#a855f7,#7c3aed)' },
  'cta': { accent: '#c084fc', accentRgb: '124,58,237', tag: 'TAKE ACTION', gradient: 'linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)' },
  'tip': { accent: '#60a5fa', accentRgb: '96,165,250', tag: 'WEB TIP', gradient: 'linear-gradient(90deg,#3b82f6,#60a5fa)' },
};

// Default content for each template type (from existing v3 templates)
export const DEFAULT_TEMPLATES: Record<TemplateType, TemplateData> = {
  'problem-hook': {
    type: 'problem-hook',
    tag: 'HARD TRUTH',
    headline: 'Your website\nis losing you\nmoney.',
    subheadline: 'Every day it stays the same,\npotential clients bounce to competitors\nwho look more credible than you.',
    stats: [
      { value: '88%', label: "Won't return after bad UX", source: 'Google / Forrester' },
      { value: '75%', label: 'Judge credibility by design', source: 'Stanford Research' },
      { value: '0.05s', label: 'First impression is formed', source: 'Behaviour & Info Tech' },
      { value: '$0', label: 'What a slow site earns you', source: '1s delay = 7% fewer conversions' },
    ],
    footer: 'Is this your site? ↓',
  },
  'five-signs': {
    type: 'five-signs',
    tag: 'FREE KNOWLEDGE',
    headline: '5 signs your\nwebsite isn\'t\nconverting.',
    subheadline: 'Save this. Check yours right now.',
    items: [
      { title: 'No clear CTA above the fold', description: "Visitors don't scroll — if they can't act in 3 seconds, they leave" },
      { title: 'Zero social proof visible', description: 'No testimonials, no logos, no results = no trust = no sale' },
      { title: 'Loads slower than 3 seconds', description: '53% of mobile visitors leave if it takes longer — Google data' },
      { title: 'You talk about yourself, not them', description: '"We are..." vs "You get..." — the second one converts' },
      { title: 'Looks like a template', description: 'If you can tell it\'s a template, so can your customers' },
    ],
    footer: 'How many apply to you? 👀',
  },
  'case-study': {
    type: 'case-study',
    tag: 'CASE STUDY',
    client: 'Microbiome Design',
    headline: 'How a biotech startup\nwent from invisible\nto industry-leading.',
    problem: '"No one takes us seriously online" — Cutting-edge science but a website that looked like a student project.',
    process: 'Trust-First Design Framework. Rebuilt around credibility signals, scientific authority, and conversion flow.',
    results: [
      { value: '4.8%', label: 'Conversion rate (was 1.2%)' },
      { value: '3×', label: 'Organic traffic in 90 days' },
      { value: '90+', label: 'PageSpeed mobile + desktop' },
    ],
    footer: 'Full case study → link in bio',
  },
  'framework': {
    type: 'framework',
    tag: 'MY FRAMEWORK',
    headline: 'The Trust-First\nDesign Framework.',
    subheadline: "Here's my entire process. Free. Use it.",
    steps: [
      { number: '01', title: 'Discover', description: 'Deep-dive into who your customer actually is. What do they fear? What do they want?', color: '#f97316' },
      { number: '02', title: 'Design', description: "Every section answers ONE question in the buyer's mind. Trust signals at every scroll point.", color: '#ec4899' },
      { number: '03', title: 'Develop', description: 'Hand-coded. No templates. 90+ PageSpeed. Sub-2s load on mobile.', color: '#7c3aed' },
      { number: '04', title: 'Deliver', description: "Launch isn't the end. A/B test headlines, track conversions, optimize until it's a revenue machine.", color: '#22c55e' },
    ],
    footer: 'Steal this. Seriously.',
  },
  'cost-comparison': {
    type: 'cost-comparison',
    tag: 'THE MATH',
    headline: 'Your $500 website\nis costing you\n$50,000.',
    subheadline: "Here's why cheap is expensive.",
    cheapSide: ['Template — looks like 10K others', '40 PageSpeed — visitors leave', '0.5% conversion rate', 'No trust signals', '"We are a leading provider..."'],
    premiumSide: ['Custom — built for YOUR brand', '90+ PageSpeed — fast as it gets', '4.8% conversion rate', 'Proof at every touchpoint', '"You get 3× more leads..."'],
    cheapResult: { math: '1,000 visitors × 0.5% × $200', total: '= $1,000/mo' },
    premiumResult: { math: '1,000 visitors × 4.8% × $200', total: '= $9,600/mo' },
    footer: 'Still think your site is "fine"?',
  },
  'proof': {
    type: 'proof',
    tag: 'CLIENT RESULTS',
    headline: "Don't take my\nword for it.",
    testimonials: [
      { quote: 'Our conversion rate went from 1.2% to 4.8% in the first month.', name: 'Sarah K.', role: 'SaaS Founder', metric: '+300%', metricLabel: 'CVR' },
      { quote: '340% increase in conversions and $120K in additional revenue within 90 days.', name: 'TechStore Co.', role: 'E-commerce', metric: '+$120K', metricLabel: 'rev' },
      { quote: '3× organic traffic, 52 leads, 8 deals closed — $47K from web leads alone.', name: 'MPM Trading', role: 'FinTech', metric: '$47K', metricLabel: 'leads' },
    ],
    footer: 'Real clients. Real results. No cap.',
  },
  'cta': {
    type: 'cta',
    tag: 'TAKE ACTION',
    headline: "Still wondering\nwhy your site isn't\nmaking you money?",
    subheadline: 'Your competitors already fixed this.\nThe longer you wait, the more you lose.',
    ctaText: "LET'S FIX YOUR SITE →",
    ctaSubtext: 'DM or visit crftdweb.com',
    footer: 'Problem → Process → Result',
  },
  'tip': {
    type: 'tip',
    tag: 'WEB TIP',
    headline: 'Your CTA button\ncolor matters more\nthan you think.',
    subheadline: 'Research-backed insight:',
    stats: [
      { value: '35%', label: 'Boost from high-contrast CTAs', source: 'HubSpot A/B tests' },
      { value: '21%', label: 'More clicks with action verbs', source: '"Get" beats "Submit" every time' },
    ],
    footer: 'Save this for your next redesign.',
  },
};
