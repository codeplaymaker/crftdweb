'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  TimeVsValueComparison,
  ProductizationFlow,
  StagesStack,
  SystemsFlowDiagram,
  SectionHeading,
} from '@/components/playbook/visuals';

const stages = [
  {
    number: '01',
    name: 'Mindset',
    subtitle: 'The Foundation',
    description: 'Take responsibility. Take calculated risk. Take control. Building your reputation online is an asymmetric bet — low downside, massive upside.',
    color: 'from-red-500 to-orange-500',
    points: [
      'Create an asset that looks after you long-term',
      'Put skin in the game — trade under your own name',
      'Learn to sell + learn to build = unstoppable',
      'Start now for feedback — this is a game of iteration',
    ],
  },
  {
    number: '02',
    name: 'Skill',
    subtitle: 'The Investment',
    description: 'Nobody cares what you can do — everybody cares what you can do for them. Curiosity drives competence.',
    color: 'from-orange-500 to-yellow-500',
    points: [
      'Learn by experience — get paid to learn on the job',
      'Learn by iteration — everyone you admire was a beginner',
      'Learn by helping — make others successful first',
      'Learn by building — permissionless progress',
    ],
  },
  {
    number: '03',
    name: 'Process',
    subtitle: 'The System',
    description: 'Your skills are valuable, but so are everyone else\'s. Package your unique skills, perspective, and interests to generate exclusive demand.',
    color: 'from-yellow-500 to-emerald-500',
    points: [
      'Prove the problem — articulate it as well as you solve it',
      'Prove the process — design a repeatable solution',
      'Prove yourself — gather social proof at every opportunity',
      'Content that points out the problem, product that solves it',
    ],
  },
  {
    number: '04',
    name: 'Reputation',
    subtitle: 'The Moat',
    description: 'Be deliberate, assertive, impervious, prolific, open, and yourself. Escape competition through authenticity.',
    color: 'from-emerald-500 to-teal-500',
    points: [
      'Make noise, listen for signal — then double down',
      'Find 1,000 ways to say the same thing',
      'Give away your secrets — people pay for implementation',
      'The closer to natural state, the more insulated from competition',
    ],
  },
  {
    number: '05',
    name: 'Product',
    subtitle: 'The Asset',
    description: 'Design a product around a result you\'ve delivered repeatedly. Build on internet infrastructure. Promote yourself by proving yourself.',
    color: 'from-teal-500 to-cyan-500',
    points: [
      'Service = work without process (gaining knowledge)',
      'Productized service = work with process (stabilizing income)',
      'Product = process without work (buying back time)',
      'Spend 20% building systems for 80% of your day',
    ],
  },
  {
    number: '06',
    name: 'Authority',
    subtitle: 'The Compound Effect',
    description: 'People don\'t buy your product, they buy you. Own your reputation, own your failures, own your story. Play the long game.',
    color: 'from-cyan-500 to-blue-500',
    points: [
      'Build mutually beneficial relationships on unique assets',
      'When you mess up, own up — transparency drives growth',
      'Your true differentiator is your unique combination of experiences',
      'Create more value than you extract',
    ],
  },
];

const systems = [
  { icon: '📢', name: 'Marketing', description: 'Videos, podcasts, articles, presentations — assets that work 24/7' },
  { icon: '🎯', name: 'Qualifying', description: 'Position as solution to specific problem. What it is + who it\'s for' },
  { icon: '📋', name: 'Application', description: 'Prospects provide info before access. System protects your time' },
  { icon: '🚀', name: 'Onboarding', description: 'Story, payment, integrations, hosting, logins — gathered systematically' },
  { icon: '⚙️', name: 'Work', description: 'Loom recordings, live calls, design handoffs — consistent delivery' },
  { icon: '⭐', name: 'Testimonials', description: 'Get feedback systematically. Google Forms, VideoAsk, Typeform' },
  { icon: '🔄', name: 'Loop', description: 'Feed testimonials back into marketing. The flywheel never stops' },
];

const modules = [
  { name: 'Diagnose', href: '/playbook/diagnose', icon: '🔍', description: 'Assess where you are on the 6-stage journey', color: 'border-emerald-500/30 hover:border-emerald-500/60' },
  { name: 'Prescribe', href: '/playbook/prescribe', icon: '📋', description: 'Get a personalized action plan for your stage', color: 'border-teal-500/30 hover:border-teal-500/60' },
  { name: 'Track', href: '/playbook/track', icon: '📊', description: 'Monitor milestones, revenue, and content output', color: 'border-cyan-500/30 hover:border-cyan-500/60' },
  { name: 'Systemize', href: '/playbook/systemize', icon: '⚙️', description: 'Build the 7 business systems with templates', color: 'border-blue-500/30 hover:border-blue-500/60' },
  { name: 'Productize', href: '/playbook/productize', icon: '📦', description: 'From skill to result to product', color: 'border-violet-500/30 hover:border-violet-500/60' },
  { name: 'Prove', href: '/playbook/prove', icon: '✅', description: 'Automate proof collection and case studies', color: 'border-purple-500/30 hover:border-purple-500/60' },
  { name: 'Scale', href: '/playbook/scale', icon: '📈', description: 'Transition from time-for-money to value-for-money', color: 'border-pink-500/30 hover:border-pink-500/60' },
];

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8"
          >
            <span className="text-emerald-400 text-sm">FRAMEWORK</span>
            <span className="text-white/70 text-sm">6 stages from service provider to product builder</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Stop Trading Time
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Start Building Value
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            The CRFTD Playbook diagnoses where you are, prescribes what to do next, 
            and tracks your transformation from service provider to product builder.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/playbook/diagnose"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Take the Assessment
            </Link>
            <Link
              href="#framework"
              className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors text-center"
            >
              Explore Framework
            </Link>
          </div>

          {/* Value Props */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span>6-Stage Framework</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full" />
              <span>7 Business Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>AI-Powered Prescriptions</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FrameworkSection() {
  return (
    <section className="py-32 relative" id="framework">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="THE EXECUTION FRAMEWORK"
          title="Divorce Time from Money"
          subtitle="Most service providers are trapped selling time. The Playbook is a systematic approach to building assets that generate value while you sleep."
        />

        {/* Visual Device: COMPARISON — Side-by-side contrast */}
        <TimeVsValueComparison className="mb-16" />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Time for Money */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="text-3xl mb-4">⏰</div>
            <span className="text-red-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              MONEY FOR TIME
            </span>
            <h3 className="text-2xl font-bold text-white mb-4">The Reset Trap</h3>
            <p className="text-white/50 mb-6">
              Do it once, get paid once. Do it again tomorrow. The count resets every morning.
            </p>
            <ul className="space-y-3">
              {[
                'Income stops when you stop working',
                'Trading hours for dollars, no leverage',
                'Competing on price with everyone',
                'Burning out trying to scale manually',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60">
                  <span className="text-red-400 mt-1">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Value for Money */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8"
          >
            <div className="text-3xl mb-4">💎</div>
            <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              MONEY FOR VALUE
            </span>
            <h3 className="text-2xl font-bold text-white mb-4">The Compound Effect</h3>
            <p className="text-white/50 mb-6">
              Do it once, get paid indefinitely. Make it better tomorrow. The count rolls over. Always.
            </p>
            <ul className="space-y-3">
              {[
                'Build once, sell repeatedly',
                'Income compounds over time',
                'Compete on uniqueness, not price',
                'Systems do the work, you do the thinking',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60">
                  <span className="text-emerald-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StagesSection() {
  return (
    <section className="py-32 relative" id="stages">
      <div className="container mx-auto px-4">
        <SectionHeading
          tag="THE JOURNEY"
          title="The 6 Build Stages"
          subtitle="The progression from zero to freedom. Each stage compounds on the last."
        />

        {/* Visual Device: STACKING — Layered accumulation */}
        <StagesStack className="mb-16" />

        <div className="max-w-4xl mx-auto space-y-6">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-2xl flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{stage.number}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">Build {stage.name}</h3>
                    <span className="text-white/30 text-sm">— {stage.subtitle}</span>
                  </div>
                  <p className="text-white/50 mb-4">{stage.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {stage.points.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-white/60 text-sm">
                        <span className="text-emerald-400 mt-0.5">→</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Device: FLOW — Sequential A → B progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/15 rounded-2xl p-10">
            <h3 className="text-lg font-bold text-white mb-8 text-center tracking-tight">The Productization Path</h3>
            <ProductizationFlow />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SystemsSection() {
  return (
    <section className="py-32 relative" id="systems">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            OPERATIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            7 Business Systems
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Build more systems, do less work, generate better results. Run a process which is consistent.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Visual Device: FLOW — 7 Systems Flywheel */}
          <SystemsFlowDiagram className="mb-12" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {systems.slice(0, 4).map((system, index) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{system.icon}</div>
                <h3 className="text-white font-semibold mb-2">{system.name}</h3>
                <p className="text-white/50 text-sm">{system.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {systems.slice(4).map((system, index) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 4) * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{system.icon}</div>
                <h3 className="text-white font-semibold mb-2">{system.name}</h3>
                <p className="text-white/50 text-sm">{system.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ModulesSection() {
  return (
    <section className="py-32 relative" id="modules">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            YOUR OPERATING SYSTEM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            7 Modules. One System.
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Each module maps to a phase of your transformation. Start with Diagnose, follow the path.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modules.map((mod, index) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link href={mod.href}>
                <div className={`bg-white/5 border ${mod.color} rounded-2xl p-6 transition-all cursor-pointer h-full`}>
                  <div className="text-3xl mb-4">{mod.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{mod.name}</h3>
                  <p className="text-white/50 text-sm">{mod.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Where are you on the journey?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Take a 5-minute assessment. Get diagnosed. Receive your personalized 
              action plan to move to the next stage.
            </p>
            <Link
              href="/playbook/diagnose"
              className="inline-flex bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Start Your Diagnosis →
            </Link>
            <p className="text-white/30 text-sm mt-4">Free assessment · Takes 5 minutes · Instant results</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function PlaybookPage() {
  return (
    <>
      <HeroSection />
      <FrameworkSection />
      <StagesSection />
      <SystemsSection />
      <ModulesSection />
      <CTASection />
    </>
  );
}
