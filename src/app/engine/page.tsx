'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

/* ───────────────────────────────────────────────── DATA ─── */

const features = [
  {
    title: 'Offer Builder',
    description: 'Design, price, and package high-ticket offers in a single session. Positioning, delivery model, and pricing — done.',
    category: 'BUILD',
  },
  {
    title: 'AI Sales Agents',
    description: 'Automated reps that qualify leads, handle objections, and book calls around the clock.',
    category: 'SELL',
  },
  {
    title: 'Funnel Automation',
    description: 'From first click to closed deal — nurturing, follow-ups, and onboarding run themselves.',
    category: 'AUTOMATE',
  },
  {
    title: 'Content Generation',
    description: 'VSLs, ad creatives, landing pages, email sequences — generated and deployed in minutes.',
    category: 'CREATE',
  },
  {
    title: 'Analytics Engine',
    description: 'Real-time dashboards that show exactly what\'s working and where to double down.',
    category: 'MEASURE',
  },
  {
    title: 'CRM Integration',
    description: 'Deep GoHighLevel sync. Contacts, pipelines, and automations stay in perfect harmony.',
    category: 'CONNECT',
  },
];

const agents = [
  { name: 'Offer Architect', description: 'Design compelling offers that convert', category: 'SALES' },
  { name: 'Niche Architect', description: 'Identify and validate profitable niches', category: 'RESEARCH' },
  { name: 'VSL Builder', description: 'Create high-converting Video Sales Letters', category: 'CONTENT' },
  { name: 'Ads Architect', description: 'High-converting ad copy and campaigns', category: 'MARKETING' },
  { name: 'Category Architect', description: 'Build market categories and positioning', category: 'STRATEGY' },
  { name: 'Sales Asset Builder', description: 'Transform transcripts into marketing assets', category: 'SALES' },
  { name: 'Landing Page Writer', description: 'Direct response copy for high-converting pages', category: 'CONTENT' },
  { name: 'Research Agent', description: 'Comprehensive business research and retrieval', category: 'RESEARCH' },
];

const faqs = [
  {
    question: 'What if I don\'t have a high-ticket offer yet?',
    answer: 'That\'s exactly what Engine is designed for. The Offer Architect will help you design, price, and package a high-ticket offer from scratch. You\'ll have everything you need to start selling.',
  },
  {
    question: 'How fast can I see results?',
    answer: 'Most users launch their first offer within 24-48 hours and see their first sale within 30-60 days. The AI handles the heavy lifting so you can focus on closing.',
  },
  {
    question: 'Do I need a big audience?',
    answer: 'No. High-ticket is quality over quantity. You only need 2-5 clients per month at $3K-$10K to hit significant revenue. Engine helps you attract the right buyers.',
  },
  {
    question: 'Can I white-label this for my clients?',
    answer: 'Yes. The whitelabel program lets you resell Engine under your own brand — custom domains, logos, and the complete platform included.',
  },
];

const categoryColors: Record<string, string> = {
  SALES: 'text-green-400/70',
  RESEARCH: 'text-blue-400/70',
  CONTENT: 'text-orange-400/70',
  MARKETING: 'text-pink-400/70',
  STRATEGY: 'text-purple-400/70',
};

/* ───────────────────────────────────────────────── HERO ─── */

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/15 via-transparent to-transparent" />

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
            className="text-xs font-semibold tracking-[0.25em] uppercase text-purple-400/80 mb-8 block"
          >
            THE CRFTD ENGINE
          </motion.span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
            Build, Launch & Scale
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
              High-Ticket Offers
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            One AI system for coaches, consultants, and agency owners. 
            From offer creation to automated sales — everything in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/engine/demo"
              className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors text-center text-sm"
            >
              Book a Demo
            </Link>
            <Link
              href="/engine/truth"
              className="w-full sm:w-auto border border-white/15 text-white/70 px-8 py-4 rounded-full font-medium hover:bg-white/5 transition-colors text-center text-sm"
            >
              Try Truth Engine
            </Link>
          </div>

          {/* Minimal proof bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 text-white/30 text-xs tracking-wider uppercase"
          >
            <span>AI-Powered</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>8 Specialized Agents</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Whitelabel Ready</span>
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

/* ────────────────────────────────── PROBLEM / SOLUTION ─── */

function ProblemSection() {
  return (
    <section className="py-32 relative" id="why">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/80 block mb-6">
            THE PROBLEM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Stop playing the low-ticket game
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            You don&apos;t need more leads. You need better offers and a system that sells them.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/10 rounded-2xl p-8"
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-red-400/80 block mb-6">
              THE OLD WAY
            </span>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">The Low-Ticket Trap</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Selling $500 offers, needing 20+ clients to hit $10K. Chasing leads who ghost, competing on price.
            </p>
            <div className="space-y-3">
              {[
                'Need 20+ clients per month',
                'Leads ghost after seeing price',
                'Competing on price with everyone',
                'No leverage, no automation',
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
            className="border border-purple-500/20 bg-purple-500/[0.03] rounded-2xl p-8"
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/80 block mb-6">
              THE ENGINE WAY
            </span>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">High-Ticket, Automated</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              One AI system that handles content, sales, and delivery. Launch $3K-$10K offers and let the system sell.
            </p>
            <div className="space-y-3">
              {[
                'Need only 2-5 clients per month',
                'Attract buyers ready to invest',
                'Positioned as the premium choice',
                'Full automation from day one',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/50 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-400/60 rounded-full flex-shrink-0" />
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

/* ───────────────────────────────────────── FEATURES ─── */

function FeaturesSection() {
  return (
    <section className="py-32 relative" id="features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/80 block mb-6">
            THE COMPLETE SYSTEM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Everything to Launch & Scale
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Content, sales, ads, analytics — one AI system that handles it all.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group border border-white/[0.06] hover:border-purple-500/30 rounded-2xl p-6 transition-all"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-purple-400/50 block mb-4">
                {feature.category}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Platform bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-white/20 text-xs uppercase tracking-[0.2em] mb-6">
            Powered by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 text-white/25 text-sm font-medium">
            {['Claude', 'OpenAI', 'Gemini', 'ElevenLabs'].map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────── AI AGENTS ─── */

function AgentsSection() {
  return (
    <section className="py-32 relative" id="agents">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/80 block mb-6">
            SPECIALIZED AI
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            8 Expert Agents
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Purpose-built AI for every business function. Each agent understands your industry.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="flex items-start gap-4 py-4 border-b border-white/[0.05] last:border-0"
            >
              <span className="text-white/15 font-bold text-sm tabular-nums w-6 flex-shrink-0 pt-0.5">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-0.5">
                  <h4 className="text-white font-semibold text-sm">{agent.name}</h4>
                  <span className={`text-[10px] tracking-wider ${categoryColors[agent.category]}`}>
                    {agent.category}
                  </span>
                </div>
                <p className="text-white/40 text-sm">{agent.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── HOW IT WORKS ─── */

function ProcessSection() {
  const steps = [
    {
      step: '01',
      title: 'Define Your Offer',
      description: 'The Offer Architect helps you design a $3K-$10K offer based on your expertise, market, and delivery model.',
    },
    {
      step: '02',
      title: 'Generate Your Assets',
      description: 'AI creates your VSL, landing page, email sequences, ad creatives, and sales scripts — in minutes.',
    },
    {
      step: '03',
      title: 'Deploy & Automate',
      description: 'Connect your CRM, launch your funnel, and let AI agents handle qualification, follow-ups, and booking.',
    },
    {
      step: '04',
      title: 'Scale & Optimize',
      description: 'Analytics show what\'s working. Double down on winners. Add new offers. Whitelabel to clients.',
    },
  ];

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/80 block mb-6">
            THE PROCESS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Four Steps to Launch
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Go from zero to a fully automated high-ticket system.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="border border-white/[0.06] rounded-2xl p-6"
              >
                <span className="text-purple-400/40 font-bold text-xs tracking-wider block mb-3">
                  STEP {step.step}
                </span>
                <h3 className="text-white font-semibold text-base mb-2 tracking-tight">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── WHITELABEL ─── */

function WhitelabelSection() {
  return (
    <section className="py-32 relative" id="whitelabel">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-purple-500/15 bg-purple-500/[0.02] rounded-3xl p-10 md:p-14"
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/60 block mb-6">
              WHITELABEL PROGRAM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Sell Engine to your clients — under your brand
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-2xl">
              Don&apos;t just use the system. Own it. Resell the entire platform to your coaching clients and agency customers.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Your Brand, Your Platform', description: 'Custom domains, logos, colors. Your clients never see Engine.' },
                { title: 'Instant Client Workspaces', description: 'Spin up isolated accounts in seconds. Full data separation.' },
                { title: 'Agency Revenue Model', description: 'Charge $997-$2,997/month. You keep 100% of the margin.' },
                { title: 'Full System Access', description: 'Content AI, sales agents, analytics — everything under your brand.' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/engine/whitelabel"
                className="text-purple-400/80 text-sm font-medium hover:text-purple-400 transition-colors inline-flex items-center gap-2"
              >
                Learn about the whitelabel program
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── FAQ ─── */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 relative" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/80 block mb-6">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Common questions
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="border-b border-white/[0.05]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-5 flex items-center justify-between text-left gap-4"
              >
                <span className="text-white/80 text-sm font-medium">{faq.question}</span>
                <span className="text-white/30 text-lg flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pb-5"
                >
                  <p className="text-white/40 text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── FINAL CTA ─── */

function FinalCTASection() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="border border-purple-500/15 bg-purple-500/[0.02] rounded-3xl p-12 md:p-16">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-purple-400/60 mb-6 block">
              GET STARTED
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to automate your offer?
            </h2>
            <p className="text-white/40 text-base mb-10 leading-relaxed max-w-lg mx-auto">
              Book a demo and we&apos;ll walk you through how Engine can launch your high-ticket system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/engine/demo"
                className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors text-center text-sm"
              >
                Book a Demo
              </Link>
              <Link
                href="/engine/truth"
                className="w-full sm:w-auto border border-white/15 text-white/70 px-8 py-4 rounded-full font-medium hover:bg-white/5 transition-colors text-center text-sm"
              >
                Try Truth Engine Free
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────── COMPOSE ─── */

export default function EnginePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AgentsSection />
      <ProcessSection />
      <WhitelabelSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
