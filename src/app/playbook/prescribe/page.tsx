'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { ModuleHeader, StagePositionIndicator } from '@/components/playbook/visuals';

const stageActionPlans: Record<string, {
  title: string;
  color: string;
  focus: string;
  timeframe: string;
  actions: { title: string; description: string; priority: 'high' | 'medium' | 'low' }[];
  modules: string[];
  keyMetrics: string[];
  resources: { name: string; type: string }[];
}> = {
  mindset: {
    title: 'Build Mindset',
    color: 'from-red-500 to-orange-500',
    focus: 'Take responsibility. Take calculated risk. Take control.',
    timeframe: '30-60 days',
    actions: [
      { title: 'Calculate your burn rate', description: 'Know exactly how many weeks of runway you have. This number determines your urgency and risk tolerance.', priority: 'high' },
      { title: 'Start a public project', description: 'Launch something under your own name. A blog, a newsletter, a portfolio. The barrier to entry exists only in your head.', priority: 'high' },
      { title: 'Audit your beliefs', description: 'List every assumption about your career — "I need a degree", "I\'m not ready", "the market is saturated". Challenge each one with evidence.', priority: 'high' },
      { title: 'Find 3 people to follow', description: 'Identify 3 people who\'ve made the service-to-product transition. Study their journey. Reverse-engineer their path.', priority: 'medium' },
      { title: 'Set a 90-day commitment', description: 'Commit to showing up every day for 90 days. Consistency creates competence. Quality follows quantity.', priority: 'medium' },
      { title: 'Kill the backup plan', description: 'Full commitment creates resourcefulness. If you have a plan B, you\'ll execute plan A like it\'s optional.', priority: 'low' },
    ],
    modules: ['Diagnose (revisit monthly)', 'Track (set up baseline metrics)'],
    keyMetrics: ['Days shipped consecutively', 'Public posts/projects launched', 'Runway in weeks'],
    resources: [
      { name: '10 Life-Changing Ideas', type: 'Framework' },
      { name: 'The Loop: Execute → Fail → Care Less → Execute', type: 'Mental Model' },
      { name: 'Burn Rate Calculator', type: 'Tool' },
    ],
  },
  skill: {
    title: 'Build Skill',
    color: 'from-orange-500 to-yellow-500',
    focus: 'Nobody cares what you can do — everybody cares what you can do for them.',
    timeframe: '60-120 days',
    actions: [
      { title: 'Get paid to learn', description: 'Take on projects slightly above your skill level. Client work is the best training — you learn under real pressure with real stakes.', priority: 'high' },
      { title: 'Build 3 permissionless projects', description: 'Create sample work for your ideal clients without asking permission. Redesign their website. Write their marketing copy. Show, don\'t tell.', priority: 'high' },
      { title: 'Document your learning', description: 'Share what you\'re learning publicly. "Today I learned..." posts build proof-of-work and attract opportunities.', priority: 'high' },
      { title: 'Identify your value type', description: 'Which of the 4 value types do you deliver? Psychological (feel better), Monetary (make money), Functional (more competent), Social (fit in better).', priority: 'medium' },
      { title: 'Start tracking proof', description: 'Screenshot every win. Save every thank-you message. Document every before/after. This is your future marketing material.', priority: 'medium' },
      { title: 'Find your apprenticeship', description: 'Work with someone better than you — even for free. Proximity to excellence accelerates growth faster than any course.', priority: 'low' },
    ],
    modules: ['Track (proof-of-work uploads)', 'Prove (start collecting)'],
    keyMetrics: ['Client projects completed', 'Skills demonstrated publicly', 'Testimonials collected'],
    resources: [
      { name: 'Value Creation & Arbitrage Framework', type: 'Framework' },
      { name: 'The 4 Types of Value', type: 'Mental Model' },
      { name: 'Don\'t Build Backwards', type: 'Principle' },
    ],
  },
  process: {
    title: 'Build Process',
    color: 'from-yellow-500 to-emerald-500',
    focus: 'Package your unique skills, perspective, and interests to generate exclusive demand.',
    timeframe: '60-90 days',
    actions: [
      { title: 'Name your process', description: 'Turn what you do into a named framework. "The [X] Method" or "The [X] Sprint". A named process is worth 10x an unnamed skill.', priority: 'high' },
      { title: 'Document every step', description: 'Record yourself working for a week. Write down every step. Find the repeatable pattern. This becomes your SOP.', priority: 'high' },
      { title: 'Create your "problem language"', description: 'Write 10 ways to describe the problem you solve, using your client\'s words — not yours. Speak in problems, solve in products.', priority: 'high' },
      { title: 'Build the first system', description: 'Start with Marketing or Qualifying from the 7 Business Systems. Get one system running before adding more.', priority: 'medium' },
      { title: 'Productize your first service', description: 'Define a fixed scope, fixed price, fixed timeline offering. "I will do X for Y in Z days for $N."', priority: 'medium' },
      { title: 'Create a case study template', description: 'Problem → Process → Result. Use this framework for every completed project going forward.', priority: 'low' },
    ],
    modules: ['Systemize (build first 3 systems)', 'Productize (start the path)'],
    keyMetrics: ['Named processes documented', 'Productized service packages created', 'Systems operational'],
    resources: [
      { name: '7 Business Systems Framework', type: 'Framework' },
      { name: 'Speak in Problems, Solve in Products', type: 'Principle' },
      { name: 'The Productization Path', type: 'Framework' },
    ],
  },
  reputation: {
    title: 'Build Reputation',
    color: 'from-emerald-500 to-teal-500',
    focus: 'Escape competition through authenticity. Be prolific.',
    timeframe: '90-180 days',
    actions: [
      { title: 'Commit to daily content', description: 'Find 1,000 ways to say the same thing. Every post should point out a problem your audience has and hint at your solution.', priority: 'high' },
      { title: 'Give away your secrets', description: 'Share your entire process publicly. People still pay for implementation. Free content builds trust; paid implementation builds revenue.', priority: 'high' },
      { title: 'Activate the 80/20 rule', description: '80% add value (teach, share, create). 20% ask for value (sell, promote, launch). Build equity in the market first.', priority: 'high' },
      { title: 'Systematize proof collection', description: 'Set up automated follow-ups after every project. Google Forms, VideoAsk, or Typeform — make proof collection a system.', priority: 'medium' },
      { title: 'Build endorsement loops', description: 'Let customers do the marketing. Case studies on social. Screenshot testimonials. Make proof visible everywhere.', priority: 'medium' },
      { title: 'Double down on signal', description: 'What content gets the most engagement? Make more of that. What clients are easiest to work with? Find more of them.', priority: 'low' },
    ],
    modules: ['Prove (automate the loop)', 'Track (content output metrics)'],
    keyMetrics: ['Content pieces published weekly', 'Engagement rate', 'Inbound inquiry rate', 'Testimonials per month'],
    resources: [
      { name: '10 Organic Marketing Strategies', type: 'Framework' },
      { name: '80/20 Reciprocity Rule', type: 'Principle' },
      { name: 'TRAIN Visual Communication System', type: 'System' },
    ],
  },
  product: {
    title: 'Build Product',
    color: 'from-teal-500 to-cyan-500',
    focus: 'Turn your proven process into a product. Buy back your time.',
    timeframe: '90-180 days',
    actions: [
      { title: 'Identify your repeatable result', description: 'What result have you delivered 3+ times? This is your product. Package the process, not the hours.', priority: 'high' },
      { title: 'Apply the 10X pricing test', description: 'At your price point, can the customer get 10X return? $99 course = $1,000 value. $500 template = $5,000 value.', priority: 'high' },
      { title: 'Build a 3-tier offer stack', description: 'Low-ticket ($19-199) digital product → Mid-ticket ($1-5K) sprint/service → High-ticket ($5-20K+) consulting. Capture every buyer level.', priority: 'high' },
      { title: 'Automate the 7 systems', description: 'Every system should run without you touching it daily. Marketing → Qualifying → Application → Onboarding → Work → Testimonials → Loop.', priority: 'medium' },
      { title: 'Create an intake funnel', description: 'Application-based qualification. Prospects provide info before accessing your time. The system protects your time.', priority: 'medium' },
      { title: 'Launch your Proof & Price loop', description: 'Give it away until you have enough proof to sell it. Then: Get proof → Get paid → Get more proof → Get paid more.', priority: 'low' },
    ],
    modules: ['Productize (complete the path)', 'Scale (begin tracking leverage)'],
    keyMetrics: ['Revenue per product tier', 'Passive income percentage', 'Time per client (decreasing)', 'Product revenue vs. service revenue'],
    resources: [
      { name: 'The 10X Pricing Rule', type: 'Framework' },
      { name: 'Proof & Price Loop', type: 'System' },
      { name: '3-Tier Pricing Model', type: 'Framework' },
    ],
  },
  authority: {
    title: 'Build Authority',
    color: 'from-cyan-500 to-blue-500',
    focus: 'People don\'t buy your product, they buy you. Play the long game.',
    timeframe: 'Ongoing — compound forever',
    actions: [
      { title: 'Build strategic partnerships', description: 'Create mutually beneficial relationships built on your unique assets. Your network multiplies your portfolio exponentially.', priority: 'high' },
      { title: 'Create more value than you extract', description: 'Over-deliver everywhere. The compound effect of generosity in public is the most powerful growth engine.', priority: 'high' },
      { title: 'Own your story', description: 'When you mess up, own up. Transparency drives growth. Your unique combination of experiences is your true differentiator.', priority: 'high' },
      { title: 'Decentralize your income', description: 'Diversify: products, services, consulting, content, community. Make your money anti-fragile. Lose one stream, keep the rest.', priority: 'medium' },
      { title: 'Build the ecosystem flywheel', description: 'Content feeds audience. Audience feeds product sales. Product feeds case studies. Case studies feed content. The flywheel never stops.', priority: 'medium' },
      { title: 'Invest in your compound machine', description: 'Yesterday doesn\'t exist — do it now. When you sell value, the count rolls over. Compound interest is the eighth wonder.', priority: 'low' },
    ],
    modules: ['Scale (full leverage dashboard)', 'Track (ecosystem-wide metrics)'],
    keyMetrics: ['Revenue streams count', 'Passive vs. active ratio', 'Brand search volume', 'Referral rate'],
    resources: [
      { name: 'Divorcing Time & Money Framework', type: 'Framework' },
      { name: 'Compound Interest Principle', type: 'Mental Model' },
      { name: 'Ecosystem Flywheel', type: 'System' },
    ],
  },
};

const goalToAdvice: Record<string, string> = {
  'escape-job': 'Your burn rate is critical. Focus on building one productized service that can replace your salary within 90 days. Don\'t quit until your side income covers 1.5x your burn rate.',
  'increase-revenue': 'Revenue follows reputation. The fastest path is: raise prices → niche down → get proof → share proof → repeat. Most service providers are undercharging by 2-5x.',
  'productize': 'Follow the Productization Path exactly: Skill → Result → Specialize → Productize. Name your process first. A named methodology is worth 10x an unnamed skill.',
  'build-audience': 'Apply the 80/20 rule religiously. 80% value, 20% ask. Post daily. Find 1,000 ways to say the same thing. Your audience is a compounding asset.',
  'scale': 'You can\'t scale services — only systems. Build the 7 Business Systems, then replace yourself in each one. Product = process without work.',
  'authority': 'Authority is earned through proof, not claimed through positioning. Automate the Proof & Price Loop and let your reputation compound.',
};

function PrescribeContent() {
  const searchParams = useSearchParams();
  const stage = searchParams.get('stage') || 'mindset';
  const score = searchParams.get('score') || '0';
  const _businessType = searchParams.get('type') || '';
  const _revenue = searchParams.get('revenue') || '';
  const burnRate = searchParams.get('burn') || '';
  const goal = searchParams.get('goal') || '';

  const plan = stageActionPlans[stage] || stageActionPlans.mindset;
  const goalAdvice = goalToAdvice[goal] || '';

  const [expandedAction, setExpandedAction] = useState<number | null>(null);

  return (
    <section className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <ModuleHeader
            tag="YOUR PERSONALIZED ACTION PLAN"
            title={plan.title}
            subtitle={plan.focus}
          />

          {/* Visual: Where you are */}
          <StagePositionIndicator currentStage={stage} className="mb-8" />

          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-white/50 text-sm">Stage Score: </span>
              <span className="text-emerald-400 font-semibold">{score}/48</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-white/50 text-sm">Timeframe: </span>
              <span className="text-emerald-400 font-semibold">{plan.timeframe}</span>
            </div>
          </div>

          {/* Personalized Advice */}
          {goalAdvice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8"
            >
              <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                <span>🎯</span> Based on your goal
              </h3>
              <p className="text-white/70">{goalAdvice}</p>
            </motion.div>
          )}

          {/* Burn Rate Warning */}
          {burnRate && (burnRate === '10k-20k' || burnRate === '20k+') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 mb-8"
            >
              <h3 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                <span>⚠️</span> High burn rate detected
              </h3>
              <p className="text-white/70">
                Your monthly expenses are significant. Priority #1: reduce burn OR increase revenue velocity. 
                Every week of delay costs you more. Know your runway in weeks — this number determines your urgency.
              </p>
            </motion.div>
          )}

          {/* Action Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Action Plan</h2>
            <div className="space-y-3">
              {plan.actions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedAction(expandedAction === index ? null : index)}
                    className="w-full text-left p-5 flex items-start gap-4"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-white/10 text-white/40'
                    }`}>
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{action.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-white/10 text-white/40'
                        }`}>
                          {action.priority}
                        </span>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-white/40 transition-transform ${expandedAction === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedAction === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-5 pb-5 ml-10"
                    >
                      <p className="text-white/60 text-sm">{action.description}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Key Metrics to Track</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {plan.keyMetrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-3 text-white/60">
                  <span className="text-emerald-400">📊</span>
                  <span className="text-sm">{metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Playbook Resources</h3>
            <div className="space-y-3">
              {plan.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">{resource.name}</span>
                  <span className="text-emerald-400/60 text-xs bg-emerald-400/10 px-2 py-1 rounded-full">{resource.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Modules */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Recommended Modules</h3>
            <div className="space-y-2">
              {plan.modules.map((mod, index) => (
                <div key={index} className="flex items-center gap-3 text-white/60">
                  <span className="text-emerald-400">→</span>
                  <span className="text-sm">{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/playbook/dashboard"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl font-semibold hover:opacity-90 transition-opacity text-center block"
            >
              Start Tracking Progress →
            </Link>
            <Link
              href="/playbook/systemize"
              className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors text-center block"
            >
              Build Your Systems
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function PrescribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    }>
      <PrescribeContent />
    </Suspense>
  );
}
