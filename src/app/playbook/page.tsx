'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TimeVsValueComparison,
  ProductizationFlow,
  StagesStack,
  SystemsFlowDiagram,
  SectionHeading,
} from '@/components/playbook/visuals';

/* ───────────────────────────────────────────────── DATA ─── */

const stages = [
  {
    number: '01',
    name: 'Mindset',
    subtitle: 'The Foundation',
    description: 'Take responsibility. Take calculated risk. Take control.',
    insight: 'Building your reputation online is an asymmetric bet — low downside, massive upside.',
    color: 'from-red-500 to-orange-500',
    principles: [
      'Create an asset that looks after you long-term',
      'Learn to sell + learn to build = unstoppable',
      'Start now for feedback — this is a game of iteration',
    ],
  },
  {
    number: '02',
    name: 'Skill',
    subtitle: 'The Investment',
    description: 'Nobody cares what you can do — everybody cares what you can do for them.',
    insight: 'Curiosity drives competence. Get paid to learn on the job.',
    color: 'from-orange-500 to-yellow-500',
    principles: [
      'Learn by experience — permissionless progress',
      'Everyone you admire was once a beginner',
      'Make others successful first',
    ],
  },
  {
    number: '03',
    name: 'Process',
    subtitle: 'The System',
    description: 'Your skills are valuable, but so are everyone else\'s.',
    insight: 'Package your unique skills, perspective, and interests to generate exclusive demand.',
    color: 'from-yellow-500 to-emerald-500',
    principles: [
      'Prove the problem — articulate it as well as you solve it',
      'Prove the process — design a repeatable solution',
      'Content that points out the problem, product that solves it',
    ],
  },
  {
    number: '04',
    name: 'Reputation',
    subtitle: 'The Moat',
    description: 'Be deliberate, assertive, impervious, prolific, open, and yourself.',
    insight: 'Escape competition through authenticity.',
    color: 'from-emerald-500 to-teal-500',
    principles: [
      'Give away your secrets — people pay for implementation',
      'Find 1,000 ways to say the same thing',
      'The closer to natural state, the more insulated',
    ],
  },
  {
    number: '05',
    name: 'Product',
    subtitle: 'The Asset',
    description: 'Design a product around a result you\'ve delivered repeatedly.',
    insight: 'Service → Productized Service → Product. Each step buys back time.',
    color: 'from-teal-500 to-cyan-500',
    principles: [
      'Build on internet infrastructure',
      'Promote yourself by proving yourself',
      'Spend 20% building systems for 80% of your day',
    ],
  },
  {
    number: '06',
    name: 'Authority',
    subtitle: 'The Compound Effect',
    description: 'People don\'t buy your product, they buy you.',
    insight: 'Own your reputation, own your failures, own your story. Play the long game.',
    color: 'from-cyan-500 to-blue-500',
    principles: [
      'Build mutually beneficial relationships on unique assets',
      'Your true differentiator is your unique combination',
      'Create more value than you extract',
    ],
  },
];

const systems = [
  { name: 'Marketing', description: 'Assets that work 24/7 — videos, podcasts, articles' },
  { name: 'Qualifying', description: 'Position as solution to specific problem' },
  { name: 'Application', description: 'Prospects provide info before access' },
  { name: 'Onboarding', description: 'Story, payment, integrations — gathered systematically' },
  { name: 'Work', description: 'Consistent delivery — recordings, calls, handoffs' },
  { name: 'Testimonials', description: 'Feedback gathered systematically at every touch' },
  { name: 'Loop', description: 'Feed proof back into marketing. The flywheel never stops' },
];

const modules = [
  { name: 'Diagnose', href: '/playbook/diagnose', description: 'Assess where you are on the 6-stage journey' },
  { name: 'Prescribe', href: '/playbook/prescribe', description: 'Get a personalized action plan for your stage' },
  { name: 'Track', href: '/playbook/track', description: 'Monitor milestones, revenue, and content output' },
  { name: 'Systemize', href: '/playbook/systemize', description: 'Build the 7 business systems with templates' },
  { name: 'Productize', href: '/playbook/productize', description: 'Transform your skill into a scalable product' },
  { name: 'Prove', href: '/playbook/prove', description: 'Automate proof collection and case studies' },
  { name: 'Scale', href: '/playbook/scale', description: 'Transition from time-for-money to value-for-money' },
];

const tocSections = [
  { number: '01', label: '10 Foundational Ideas', anchor: '#ideas' },
  { number: '02', label: 'The Execution Framework', anchor: '#framework' },
  { number: '03', label: 'Value Creation & Arbitrage', anchor: '#value' },
  { number: '04', label: 'The 6 Build Stages', anchor: '#stages' },
  { number: '05', label: '7 Business Systems', anchor: '#systems' },
  { number: '06', label: 'The Research Behind It', anchor: '#evidence' },
  { number: '07', label: 'Core Principles', anchor: '#wisdom' },
  { number: '08', label: 'Interactive Modules', anchor: '#modules' },
];

const foundationalIdeas = [
  { title: 'You don\'t learn anything until you do something', body: 'Information without application is entertainment. Start a project that forces output. The barrier to entry exists only in your head.' },
  { title: 'Consistency creates competence', body: 'Executing badly is a precursor to getting good. Show up every day — the quality follows. Form improves with repetition.' },
  { title: 'Zoom out', body: 'See the bigger picture before getting lost in details. Your daily grind serves a larger purpose. Perspective transforms problems into opportunities.' },
  { title: 'Audit your beliefs ruthlessly and often', body: 'Most beliefs accrue unconsciously. Reality is unbiased — your perspective is not. Question inherited assumptions.' },
  { title: 'No one is coming to save you — figure it out', body: 'Take full responsibility for your outcomes. Build your own safety net. The potential downside is low; the upside is huge.' },
  { title: 'Failure is feedback — learn from it and move on', body: 'The more you execute, the more you fail. The more you fail, the less you care. The less you care, the more you execute.' },
  { title: 'Courage isn\'t the absence of fear — it\'s doing it anyway', body: 'Vulnerability is the price of change. It\'s a privilege to fail in public. Your worst case scenario is still skill development.' },
  { title: 'Aiming low is a tragic way to think', body: 'The hard part isn\'t visualizing the win. It\'s winning when you don\'t love the game. Process beats mission every single time.' },
  { title: 'Invest in your reputation — it pays dividends', body: 'Your reputation is a proxy for your future earnings. Ability + Reliability = Reputation. Your network multiplies your portfolio.' },
  { title: 'Yesterday doesn\'t exist — do it now', body: 'When you sell time, the count resets every morning. When you sell value, the count rolls over. Compound interest is the eighth wonder.' },
];

const valueTypes = [
  { label: 'Psychological', description: 'Make someone feel better' },
  { label: 'Monetary', description: 'Make someone money' },
  { label: 'Functional', description: 'Make someone more competent' },
  { label: 'Social', description: 'Make someone fit in better' },
];

const researchStats = [
  { stat: '42%', label: 'more likely to achieve goals when written down', source: 'Dr. Gail Matthews, Dominican University' },
  { stat: '66', unit: 'days', label: 'for a new behaviour to become automatic — not 21', source: 'Phillippa Lally, University College London' },
  { stat: '37.78×', label: 'better in a year by improving 1% daily', source: 'James Clear — Atomic Habits' },
  { stat: '76%', label: 'of workers report experiencing burnout', source: 'Gallup Workplace Report' },
  { stat: '78%', label: 'live paycheck to paycheck — no financial margin', source: 'CNBC / LendingClub Report' },
  { stat: '60,000×', label: 'faster — how the brain processes visuals vs text', source: '3M Corporation / Visual Teaching Alliance' },
  { stat: '95%', label: 'success rate with an accountability partner vs 10% alone', source: 'ASTD Accountability Study' },
];

const wisdomQuotes = [
  { text: 'No one cares what you can do, everyone cares what you can do for them.', author: null },
  { text: 'Learn to sell, learn to build. If you can do both, you will be unstoppable.', author: 'Naval Ravikant' },
  { text: 'Escape competition through authenticity.', author: 'Naval Ravikant' },
  { text: 'The world doesn\'t reward people who are best at solving problems, it rewards people who communicate problems best.', author: 'David Perell' },
  { text: 'If you can\'t describe what you are doing as a process, you don\'t know what you\'re doing.', author: 'W. Edwards Deming' },
  { text: 'Compound interest is the eighth wonder of the world. He who understands it, earns it.', author: 'Albert Einstein' },
];

/* ───────────────────────────────────────────────── HERO ─── */

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/15 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400/80 mb-8 block"
          >
            THE CRFTD PLAYBOOK
          </motion.span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
            Stop Trading Time.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Start Building Value.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            The 6-stage framework for transforming from service provider to product builder. 
            Diagnose where you are. Execute what comes next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/playbook/diagnose"
              className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors text-center text-sm"
            >
              Take the Assessment
            </Link>
            <Link
              href="#framework"
              className="w-full sm:w-auto border border-white/15 text-white/70 px-8 py-4 rounded-full font-medium hover:bg-white/5 transition-colors text-center text-sm"
            >
              Explore Framework
            </Link>
          </div>

          {/* Minimal proof bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 text-white/30 text-xs tracking-wider uppercase"
          >
            <span>6 Stages</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>7 Systems</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>1 Methodology</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-5 h-8 border border-white/15 rounded-full flex justify-center">
          <motion.div
            className="w-0.5 h-1.5 bg-white/30 rounded-full mt-1.5"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────── TABLE OF CONTENTS ─── */

function TOCSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-emerald-400/80 block mb-8 text-center">
            TABLE OF CONTENTS
          </span>
          <div className="space-y-0">
            {tocSections.map((section, index) => (
              <motion.a
                key={section.number}
                href={section.anchor}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-4 py-3 border-b border-white/[0.05] last:border-0 group hover:bg-white/[0.02] -mx-4 px-4 rounded-lg transition-colors"
              >
                <span className="text-emerald-400/40 font-bold text-xs tabular-nums w-6 flex-shrink-0">
                  {section.number}
                </span>
                <span className="text-white/60 text-sm font-medium group-hover:text-white/90 transition-colors">
                  {section.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────── 10 FOUNDATIONAL IDEAS ─── */

function IdeasSection() {
  return (
    <section className="py-32 relative" id="ideas">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="FOUNDATION"
          title="10 Life-Changing Ideas"
          subtitle="The mental models that underpin everything. Internalize these and the rest becomes inevitable."
        />

        <div className="max-w-3xl mx-auto space-y-0">
          {foundationalIdeas.map((idea, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="flex items-start gap-5 py-6 border-b border-white/[0.05] last:border-0"
            >
              <span className="text-emerald-400/30 font-bold text-2xl tabular-nums w-10 flex-shrink-0 leading-tight">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-white font-semibold text-base mb-1 tracking-tight">{idea.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{idea.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────── THE CORE PROBLEM ─── */

function ProblemSection() {
  return (
    <section className="py-32 relative" id="framework">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="THE CORE PROBLEM"
          title="Divorce Time from Money"
          subtitle="Most service providers are trapped selling hours. The Playbook is a systematic approach to building assets that generate value while you sleep."
        />

        <TimeVsValueComparison className="mb-20" />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/10 rounded-2xl p-8"
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-red-400/80 block mb-6">
              MONEY FOR TIME
            </span>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">The Reset Trap</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Do it once, get paid once. Do it again tomorrow. The count resets every morning.
            </p>
            <div className="space-y-3">
              {[
                'Income stops when you stop',
                'Trading hours for dollars',
                'Competing on price',
                'Burning out trying to scale',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/50 text-sm">
                  <div className="w-1 h-1 bg-red-400/60 rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="border border-emerald-500/20 bg-emerald-500/[0.03] rounded-2xl p-8"
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-emerald-400/80 block mb-6">
              MONEY FOR VALUE
            </span>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">The Compound Effect</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Do it once, get paid indefinitely. Make it better tomorrow. The count rolls over. Always.
            </p>
            <div className="space-y-3">
              {[
                'Build once, sell repeatedly',
                'Income compounds over time',
                'Compete on uniqueness',
                'Systems do the work',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/50 text-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── VALUE CREATION & ARBITRAGE ─── */

function ValueSection() {
  const tiers = [
    { tier: '$', label: 'Don\'t do', description: 'Easy, non-specific tasks anyone can do', example: 'Mow lawns' },
    { tier: '$$', label: 'Won\'t do', description: 'Specific tasks that require commitment', example: 'Run a lawn mowing service' },
    { tier: '$$$', label: 'Can\'t do', description: 'Ultra-specific, high-expertise tasks', example: 'Build a landscaping marketplace' },
  ];

  return (
    <section className="py-32 relative" id="value">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="VALUE"
          title="Value Creation & Arbitrage"
          subtitle="Arbitrage is the difference between what you can do and what someone else can't, won't, or doesn't do. You capture value by demonstrating this ability."
        />

        {/* Value Tiers */}
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-20">
          {tiers.map((t, index) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="border border-white/[0.06] rounded-2xl p-6 text-center"
            >
              <span className="text-emerald-400/50 font-bold text-xs tracking-wider block mb-3">{t.tier}</span>
              <h4 className="text-white font-semibold text-sm mb-1 tracking-tight">{t.label}</h4>
              <p className="text-white/40 text-xs leading-relaxed mb-3">{t.description}</p>
              <span className="text-white/25 text-xs italic">{t.example}</span>
            </motion.div>
          ))}
        </div>

        {/* Four Types of Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-sm font-bold text-white/60 mb-8 text-center tracking-wider uppercase">
            Four Types of Value
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {valueTypes.map((vt, index) => (
              <motion.div
                key={vt.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="border border-emerald-500/10 bg-emerald-500/[0.02] rounded-xl p-5 text-center"
              >
                <h4 className="text-white font-semibold text-sm mb-1">{vt.label}</h4>
                <p className="text-white/40 text-xs">{vt.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <blockquote className="text-white/60 text-base md:text-lg italic leading-relaxed">
              &ldquo;You get paid in direct proportion to the difficulty of problems you solve.&rdquo;
            </blockquote>
            <cite className="text-white/25 text-xs tracking-widest uppercase not-italic mt-3 block">
              — Elon Musk
            </cite>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────── THE 6 STAGES ─── */

function StagesSection() {
  return (
    <section className="py-32 relative" id="stages">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="THE JOURNEY"
          title="6 Build Stages"
          subtitle="Each stage compounds on the last. You can't skip ahead — but you can accelerate."
        />

        <StagesStack className="mb-20" />

        <div className="max-w-3xl mx-auto space-y-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group border border-white/[0.06] hover:border-white/15 rounded-2xl p-6 md:p-8 transition-colors"
            >
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{stage.number}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white tracking-tight">Build {stage.name}</h3>
                    <span className="text-white/20 text-sm hidden sm:inline">— {stage.subtitle}</span>
                  </div>
                  <p className="text-white/40 text-sm mb-1">{stage.description}</p>
                  <p className="text-emerald-400/70 text-sm italic mb-4">{stage.insight}</p>

                  <div className="grid sm:grid-cols-3 gap-2">
                    {stage.principles.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-white/50 text-xs leading-relaxed">
                        <span className="text-emerald-500/50 mt-0.5 flex-shrink-0">→</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Productization Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="border border-emerald-500/10 rounded-2xl p-10">
            <h3 className="text-sm font-bold text-white/60 mb-8 text-center tracking-wider uppercase">
              The Productization Path
            </h3>
            <ProductizationFlow />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────── THE 7 SYSTEMS ─── */

function SystemsSection() {
  return (
    <section className="py-32 relative" id="systems">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="OPERATIONS"
          title="7 Business Systems"
          subtitle="Build more systems, do less work, generate better results. Each system feeds the next."
        />

        <SystemsFlowDiagram className="mb-16" />

        <div className="max-w-2xl mx-auto">
          {systems.map((system, index) => (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 py-4 border-b border-white/[0.05] last:border-0"
            >
              <span className="text-white/15 font-bold text-sm tabular-nums w-6 flex-shrink-0 pt-0.5">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className="text-white font-semibold text-sm mb-0.5">{system.name}</h4>
                <p className="text-white/40 text-sm">{system.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── EVIDENCE / RESEARCH ─── */

function EvidenceSection() {
  return (
    <section className="py-32 relative" id="evidence">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="EVIDENCE"
          title="The Research Behind It"
          subtitle="Every principle in this playbook is backed by real data. Here's what the research says."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {researchStats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-white/[0.06] rounded-2xl p-6"
            >
              <div className="mb-3">
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {item.stat}
                </span>
                {item.unit && (
                  <span className="text-white/40 text-sm ml-1">{item.unit}</span>
                )}
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-3">{item.label}</p>
              <p className="text-white/20 text-[10px] tracking-wider uppercase">{item.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── WISDOM / PRINCIPLES ─── */

function WisdomSection() {
  return (
    <section className="py-32 relative overflow-hidden" id="wisdom">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="WISDOM"
          title="Core Principles"
        />

        <div className="max-w-2xl mx-auto space-y-10">
          {wisdomQuotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="text-center"
            >
              <blockquote className="text-lg md:text-xl font-medium text-white/70 leading-relaxed tracking-tight">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              {quote.author && (
                <cite className="text-white/25 text-xs tracking-widest uppercase not-italic mt-3 block">
                  — {quote.author}
                </cite>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────── THE MODULES ─── */

function ModulesSection() {
  return (
    <section className="py-32 relative" id="modules">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="YOUR OPERATING SYSTEM"
          title="7 Interactive Modules"
          subtitle="Each module maps to a phase of your transformation. Start with Diagnose, follow the path."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {modules.map((mod, index) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                href={mod.href}
                className="block border border-white/[0.06] hover:border-emerald-500/30 rounded-2xl p-6 transition-all group h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors">{mod.name}</h3>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{mod.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────── FINAL CTA ─── */

function CTASection() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="border border-emerald-500/15 bg-emerald-500/[0.02] rounded-3xl p-12 md:p-16">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-emerald-400/60 mb-6 block">
              START HERE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Where are you on the journey?
            </h2>
            <p className="text-white/40 text-base mb-10 leading-relaxed max-w-lg mx-auto">
              Take a 5-minute assessment. Get diagnosed. Receive your personalized 
              action plan to move to the next stage.
            </p>
            <Link
              href="/playbook/diagnose"
              className="inline-flex bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors text-sm"
            >
              Start Your Diagnosis
            </Link>
            <p className="text-white/20 text-xs mt-6 tracking-wider uppercase">
              Free · 5 minutes · Instant results
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── COMPOSE ─── */

export default function PlaybookPage() {
  return (
    <>
      <HeroSection />
      <TOCSection />
      <IdeasSection />
      <ProblemSection />
      <ValueSection />
      <StagesSection />
      <SystemsSection />
      <EvidenceSection />
      <WisdomSection />
      <ModulesSection />
      <CTASection />
    </>
  );
}
