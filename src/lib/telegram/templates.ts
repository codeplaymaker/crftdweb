// Template definitions matching the on-brand monochrome style
// from tiktok-portfolio-ads.html (white bg, black text, pure monochrome)

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
  headline?: string;
  subheadline?: string;
  tag?: string;
  stats?: Array<{ value: string; label: string; source?: string }>;
  footer?: string;
  items?: Array<{ title: string; description: string }>;
  client?: string;
  problem?: string;
  process?: string;
  results?: Array<{ value: string; label: string }>;
  steps?: Array<{ number: string; title: string; description: string; color: string }>;
  cheapSide?: Array<string>;
  premiumSide?: Array<string>;
  cheapResult?: { math: string; total: string };
  premiumResult?: { math: string; total: string };
  testimonials?: Array<{ quote: string; name: string; role: string; metric: string; metricLabel: string }>;
  ctaText?: string;
  ctaSubtext?: string;
}

// Theme config — monochrome on-brand (matching tiktok-portfolio-ads.html)
// 'mode' determines white bg (light) or black bg (dark) frames
export interface ThemeConfig {
  mode: 'light' | 'dark';
  tag: string;
}

export const TEMPLATE_THEMES: Record<TemplateType, ThemeConfig> = {
  'problem-hook': { mode: 'light', tag: 'HARD TRUTH' },
  'five-signs':   { mode: 'light', tag: 'SAVE THIS' },
  'case-study':   { mode: 'light', tag: 'CASE STUDY' },
  'framework':    { mode: 'light', tag: 'MY PROCESS' },
  'cost-comparison': { mode: 'light', tag: 'THE MATH' },
  'proof':        { mode: 'dark',  tag: 'CLIENT RESULTS' },
  'cta':          { mode: 'dark',  tag: 'TAKE ACTION' },
  'tip':          { mode: 'light', tag: 'WEB TIP' },
};

// Default content for each template type
export const DEFAULT_TEMPLATES: Record<TemplateType, TemplateData> = {
  'problem-hook': {
    type: 'problem-hook',
    tag: 'HARD TRUTH',
    headline: 'Your website is losing you money.',
    subheadline: 'Every day it stays the same, potential clients bounce to competitors who look more credible than you.',
    stats: [
      { value: '88%', label: "Won't return after bad UX", source: 'Google / Forrester Research' },
      { value: '75%', label: 'Judge credibility by design', source: 'Stanford Persuasive Tech Lab' },
      { value: '0.05s', label: 'First impression is formed', source: 'Behaviour & Info Technology' },
      { value: '-7%', label: 'Conversions lost per 1s delay', source: 'Every second costs you customers' },
    ],
    footer: 'Is this your site?',
  },
  'five-signs': {
    type: 'five-signs',
    tag: 'SAVE THIS',
    headline: '5 signs your website isn\'t converting.',
    subheadline: 'Check yours right now.',
    items: [
      { title: 'No clear CTA above the fold', description: "If they can't act in 3 seconds, they leave" },
      { title: 'Zero social proof visible', description: 'No testimonials = no trust = no sale' },
      { title: 'Loads slower than 3 seconds', description: '53% of mobile visitors leave — Google data' },
      { title: 'You talk about yourself, not them', description: '"We are..." vs "You get..." — the second converts' },
      { title: 'Looks like a template', description: 'If you can tell it\'s a template, so can your customers' },
    ],
    footer: 'How many apply to you?',
  },
  'case-study': {
    type: 'case-study',
    tag: 'CASE STUDY',
    client: 'Microbiome Design',
    headline: 'How a biotech startup went from invisible to industry-leading.',
    problem: '"No one takes us seriously online" — Cutting-edge science but a website that looked like a student project. Investors bounced.',
    process: 'Trust-First Design Framework. Discover > Design > Develop > Deliver. Rebuilt around credibility signals and conversion flow.',
    results: [
      { value: '4.8%', label: 'Conversion rate (was 1.2%)' },
      { value: '3x', label: 'Organic traffic in 90 days' },
      { value: '90+', label: 'PageSpeed mobile + desktop' },
    ],
    footer: 'Full case study in bio',
  },
  'framework': {
    type: 'framework',
    tag: 'MY PROCESS',
    headline: 'The Trust-First Design Framework.',
    subheadline: "Here's my entire process. Free. Use it.",
    steps: [
      { number: '01', title: 'Discover', description: 'Deep-dive into who your customer actually is. Not demographics — psychographics. What do they fear?', color: '#0a0a0a' },
      { number: '02', title: 'Design', description: "Every section answers ONE question in the buyer's mind. Trust signals at every scroll point.", color: '#0a0a0a' },
      { number: '03', title: 'Develop', description: 'Hand-coded. No templates. 90+ PageSpeed. Sub-2s load. Every millisecond is your first impression.', color: '#0a0a0a' },
      { number: '04', title: 'Deliver', description: "Launch isn't the end. A/B test headlines, track conversions, optimize until the site is a revenue machine.", color: '#0a0a0a' },
    ],
    footer: 'Steal this. Seriously.',
  },
  'cost-comparison': {
    type: 'cost-comparison',
    tag: 'THE MATH',
    headline: 'Your $500 website is costing you $50,000.',
    subheadline: "Here's why cheap is expensive.",
    cheapSide: ['Template — looks generic', '40 PageSpeed', '0.5% conversion', 'No trust signals', '"We are a leading..."'],
    premiumSide: ['Custom — built for YOU', '90+ PageSpeed', '4.8% conversion', 'Proof at every touchpoint', '"You get 3x more leads"'],
    cheapResult: { math: '1K visits x 0.5% x $200', total: '= $1,000/mo' },
    premiumResult: { math: '1K visits x 4.8% x $200', total: '= $9,600/mo' },
    footer: 'Still think your site is "fine"?',
  },
  'proof': {
    type: 'proof',
    tag: 'CLIENT RESULTS',
    headline: "Don't take my word for it.",
    testimonials: [
      { quote: 'They completely transformed our online presence. Our conversion rate went from 1.2% to 4.8% in the first month.', name: 'Sarah K.', role: 'SaaS Founder', metric: '+300%', metricLabel: 'CVR' },
      { quote: '340% increase in conversions and $120K in additional revenue within 90 days. Best investment we\'ve made.', name: 'TechStore Co.', role: 'E-commerce Redesign', metric: '+$120K', metricLabel: 'rev' },
      { quote: '3x organic traffic, 52 leads, 8 deals closed — $47K from web leads alone. The site pays for itself monthly.', name: 'MPM Trading', role: 'FinTech Platform', metric: '$47K', metricLabel: 'leads' },
    ],
    footer: 'Real clients. Real results.',
  },
  'cta': {
    type: 'cta',
    tag: 'TAKE ACTION',
    headline: "Still wondering why your site isn't making you money?",
    subheadline: 'Your competitors already fixed this. The longer you wait, the more you lose.',
    ctaText: "Let's Fix Your Site",
    ctaSubtext: 'DM or visit crftdweb.com',
    footer: 'Discover > Design > Develop > Deliver',
  },
  'tip': {
    type: 'tip',
    tag: 'WEB TIP',
    headline: 'Your CTA button color matters more than you think.',
    subheadline: 'Research-backed insight:',
    stats: [
      { value: '35%', label: 'Boost from high-contrast CTAs', source: 'HubSpot A/B tests' },
      { value: '21%', label: 'More clicks with action verbs', source: '"Get" beats "Submit" every time' },
    ],
    footer: 'Save this for your next redesign.',
  },
};
