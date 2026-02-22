'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// Animated counter component
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8"
          >
            <span className="text-purple-400 text-sm">NEW:</span>
            <span className="text-white/70 text-sm">Meet The Truth Engine — AI-powered market research</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The AI System That Builds Your High-Ticket Offer
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
              In 60 Minutes
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Book a demo call and we'll show you how to launch your high-ticket offer in 1 hour. Yes, 1 hour. AI-powered systems for coaches, consultants, and agency owners.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/engine/truth"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Access Truth
            </Link>
            <Link
              href="/engine/demo"
              className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors text-center"
            >
              Book A Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Problem/Solution Section
function ProblemSolutionSection() {
  return (
    <section className="py-24 relative" id="why">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            WHY HIGH-TICKET
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Stop playing the low-ticket game
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            You don't need more leads. You need better offers and a system that sells them.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* The Old Game */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <span className="text-red-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              THE OLD GAME
            </span>
            <h3 className="text-2xl font-bold text-white mb-6">The Low-Ticket Trap</h3>
            <p className="text-white/50 mb-6">
              Coaches and consultants stuck selling $500 offers, needing 20+ clients just to hit $10K. Chasing leads who ghost, competing on price, and burning out trying to scale something that was never designed to scale.
            </p>
            <ul className="space-y-3">
              {[
                'Selling $500 offers, need 20+ clients/month',
                'Chasing leads who ghost after seeing price',
                'Competing on price with everyone',
                'Trading hours for dollars, no leverage',
                'Burning out trying to scale manually',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60">
                  <span className="text-red-400 mt-1">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The High-Ticket System */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-8"
          >
            <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              THE HIGH-TICKET SYSTEM
            </span>
            <h3 className="text-2xl font-bold text-white mb-6">The Only Way to Automate High-Ticket</h3>
            <p className="text-white/50 mb-6">
              One AI system that handles everything — content, sales agents, data analysis, ads, and CRM. Launch and scale $3K-$10K offers in 60 minutes. Then whitelabel it and sell to your clients.
            </p>
            <ul className="space-y-3">
              {[
                'Sell $3K-$10K offers, need only 2-5 clients',
                'Attract buyers ready to invest in premium',
                'Positioned as THE premium choice',
                'Built-in leverage and full automation',
                '60-minute offer launch system',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80">
                  <span className="text-purple-400 mt-1">✓</span>
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

// Features Section
function FeaturesSection() {
  const features = [
    {
      title: 'High-Ticket Offer Builder',
      description: 'Build and package $3K-$10K offers in 60 minutes. Pricing, positioning, and delivery — all done.',
      icon: '💰',
    },
    {
      title: 'AI Sales Agents',
      description: 'Automated sales reps that qualify leads, handle objections, and book calls 24/7.',
      icon: '🤖',
    },
    {
      title: 'Full Funnel Automation',
      description: 'From first click to closed deal — AI handles nurturing, follow-ups, and client onboarding.',
      icon: '⚡',
    },
    {
      title: 'Data & Analytics Engine',
      description: 'Real-time dashboards that tell you exactly what\'s working and where to double down.',
      icon: '📊',
    },
    {
      title: 'Content & Ad Generation',
      description: 'VSLs, ad creatives, landing pages, email sequences — all generated and deployed automatically.',
      icon: '✨',
    },
    {
      title: 'Native CRM Integration',
      description: 'Deep GoHighLevel sync. Contacts, pipelines, and automations stay in perfect harmony.',
      icon: '🔗',
    },
  ];

  return (
    <section className="py-24 relative" id="features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            THE COMPLETE SYSTEM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything to Launch & Scale High-Ticket
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Content, sales agents, ads, analytics — one AI system that handles it all.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Platform Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-white/40 text-sm uppercase tracking-wider mb-8">
            POWERED BY THE BEST AI PLATFORMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {['Claude', 'OpenAI', 'Gemini', 'ElevenLabs'].map((platform) => (
              <div key={platform} className="text-white/50 font-semibold text-lg">
                {platform}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// AI Agents Section
function AgentsSection() {
  const agents = [
    { name: 'Offer Architect', description: 'Design and package compelling offers that convert', category: 'SALES' },
    { name: 'Niche Architect', description: 'Identify and validate profitable niches with deep research', category: 'RESEARCH' },
    { name: 'VSL Builder OS', description: 'Create high-converting Video Sales Letters', category: 'CONTENT' },
    { name: 'Ads Architect', description: 'Create high-converting ad copy and campaigns', category: 'MARKETING' },
    { name: 'Category Architect', description: 'Build market categories and positioning', category: 'STRATEGY' },
    { name: 'Sales Asset Architect', description: 'Transform transcripts into marketing assets', category: 'SALES' },
    { name: 'Landing Page Copywriter', description: 'Expert direct response copy for high-converting pages', category: 'CONTENT' },
    { name: 'Research Agent', description: 'Comprehensive business research using advanced retrieval', category: 'RESEARCH' },
  ];

  const categoryColors: Record<string, string> = {
    SALES: 'bg-green-500/20 text-green-400',
    RESEARCH: 'bg-blue-500/20 text-blue-400',
    CONTENT: 'bg-orange-500/20 text-orange-400',
    MARKETING: 'bg-pink-500/20 text-pink-400',
    STRATEGY: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <section className="py-24 relative" id="agents">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            SPECIALIZED AI AGENTS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Expert AI for every business function
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Purpose-built agents that understand your industry and deliver results.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
            >
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${categoryColors[agent.category]}`}>
                {agent.category}
              </span>
              <h3 className="text-white font-semibold mb-2">{agent.name}</h3>
              <p className="text-white/50 text-sm">{agent.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Market Intelligence Section
function MarketIntelligenceSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            MARKET INTELLIGENCE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Stay ahead of every trend
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Engine continuously monitors market trends, competitor activity, and emerging opportunities so you never miss a beat.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {[
            { title: 'Trend Detection', description: 'Spot emerging niches before they peak' },
            { title: 'Competitor Analysis', description: 'Deep research on what\'s working for others' },
            { title: 'Opportunity Scoring', description: 'AI-ranked opportunities by potential ROI' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          {[
            { value: 129, suffix: '+', label: 'FOUNDERS USING ENGINE' },
            { value: 8400, prefix: '$', label: 'AVG OFFER PRICE' },
            { value: 47, suffix: ' Days', label: 'AVG TIME TO FIRST SALE' },
            { value: 12.1, suffix: 'M+', prefix: '$', label: 'CLIENT REVENUE GENERATED' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.prefix}
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Whitelabel Section
function WhitelabelSection() {
  const features = [
    {
      title: 'Your Brand, Your Platform',
      description: 'Custom domains, logos, colors, and complete brand control. Your clients never see Engine.',
    },
    {
      title: 'Invite Clients Or Your Team',
      description: 'Spin up new client accounts in seconds. Each gets their own isolated workspace.',
    },
    {
      title: 'Agency Revenue Model',
      description: 'Charge clients $997-$2,997/month for access. You keep 100% of the margin.',
    },
    {
      title: 'Full System Access',
      description: 'Content AI, sales agents, ad management, analytics — everything included under your brand.',
    },
  ];

  return (
    <section className="py-24 relative" id="whitelabel">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            WHITELABEL PARTNER PROGRAM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Sell Engine to your clients —<br />under your brand
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Don't just use the system. Own it. Resell the entire high-ticket automation platform to your coaching clients and agency customers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What if I don\'t have a high-ticket offer yet?',
      answer: 'That\'s exactly what Engine is designed for. Our Offer Architect AI will help you design, price, and package a high-ticket offer from scratch in under 60 minutes. You\'ll have everything you need to start selling.',
    },
    {
      question: 'How fast can I see results?',
      answer: 'Most users launch their first offer within 24-48 hours and see their first sale within 30-60 days. The AI handles the heavy lifting, so you can focus on closing deals.',
    },
    {
      question: 'Do I need a big audience to sell high-ticket?',
      answer: 'No. High-ticket is about quality over quantity. You only need 2-5 clients per month at $3K-$10K to hit $10K-$50K/month. Our AI helps you attract the right buyers.',
    },
    {
      question: 'What if I\'ve never sold high-ticket before?',
      answer: 'Engine includes everything you need: offer creation, sales scripts, objection handling, and automated follow-up. The AI guides you through the entire process.',
    },
    {
      question: 'Can I white-label this for my own clients?',
      answer: 'Yes! Our whitelabel program lets you resell Engine under your own brand. Custom domains, logos, and complete white-label solution included.',
    },
  ];

  return (
    <section className="py-24 relative" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Answers for coaches, consultants & agencies
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Still have questions? Book a call and we'll walk you through everything.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left"
              >
                <span className="text-white font-medium pr-8">{faq.question}</span>
                <span className="text-white/50 text-2xl flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pb-6"
                >
                  <p className="text-white/60">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Automate Your High-Ticket Offer?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Book a demo call and we'll show you how to launch your high-ticket offer in 1 hour. Yes, 1 hour.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/engine/truth"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Start with Truth
            </Link>
            <Link
              href="/engine/demo"
              className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors text-center"
            >
              Book Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Main Page Component
export default function EnginePage() {
  return (
    <>
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <AgentsSection />
      <MarketIntelligenceSection />
      <WhitelabelSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
