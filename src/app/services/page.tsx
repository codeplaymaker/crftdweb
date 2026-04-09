'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function ServicesPage() {
  return (
    <main className="pt-20">
      <section className="py-32">
        <div className="container">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
              HOW WE WORK
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">
              We build websites that<br className="hidden md:block" />
              {' '}<span className="text-muted-foreground">turn visitors into customers.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Not templates. Not page builders. Custom-coded sites designed around 
              your specific audience, your goals, and your growth.
            </p>
          </motion.div>

          {/* Process */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-8 text-center">OUR PROCESS</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {process.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center text-sm font-bold mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* What's included */}
          {/* Pricing Tiers */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">INVESTMENT</h2>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Fixed scope. Fixed price.</p>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                No surprises. No scope creep. You know exactly what you&apos;re getting before we write a line of code.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border transition-colors ${
                    tier.featured ? 'bg-black text-white' : 'bg-background hover:border-black/20'
                  }`}
                >
                  <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-3 ${
                    tier.featured ? 'text-white/50' : 'text-muted-foreground'
                  }`}>{tier.timeline}</p>
                  <h3 className="text-lg font-bold tracking-tight mb-1">{tier.name}</h3>
                  <p className={`text-2xl font-bold ${tier.paymentPlan ? 'mb-1' : 'mb-4'} ${tier.featured ? 'text-white' : ''}`}>{tier.price}</p>
                  {tier.paymentPlan && (
                    <p className={`text-xs mb-4 ${tier.featured ? 'text-white/50' : 'text-muted-foreground'}`}>{tier.paymentPlan}</p>
                  )}
                  <p className={`text-sm leading-relaxed mb-5 ${
                    tier.featured ? 'text-white/70' : 'text-muted-foreground'
                  }`}>{tier.description}</p>
                  <ul className="space-y-2">
                    {tier.includes.map((item) => (
                      <li key={item} className={`text-xs flex items-center gap-2 ${
                        tier.featured ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        <div className={`w-1 h-1 rounded-full flex-shrink-0 ${
                          tier.featured ? 'bg-white/50' : 'bg-black/30'
                        }`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground/50 mt-6">All prices in GBP &middot; Add-ons available below</p>
          </div>

          <div className="max-w-4xl mx-auto mb-20">
            <div className="p-8 md:p-12 rounded-2xl bg-accent border">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-center">What&apos;s included</h2>
              <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">Every project gets the full treatment. No cutting corners.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {inclusions.map((item) => (
                  <div key={item} className="flex items-start gap-3 py-2">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">POWER-UPS</h2>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Add-ons & upgrades</p>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Every project starts with the core build. These bolt on when you need more.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOns.map((addon, index) => (
                <motion.div
                  key={addon.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-sm tracking-tight">{addon.title}</h3>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{addon.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{addon.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Agents */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">AI AGENTS</h2>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Put your business on autopilot</p>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Custom AI agents built into your site or ops — not off-the-shelf widgets. They qualify leads, answer questions, book calls, and handle tasks while you sleep.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {aiAgents.map((agent, index) => (
                <motion.div
                  key={agent.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{agent.icon}</span>
                      <h3 className="font-semibold text-sm tracking-tight">{agent.title}</h3>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{agent.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                </motion.div>
              ))}
            </div>
            <div className="p-6 rounded-xl border border-black/10 bg-black text-white text-center">
              <p className="text-sm font-semibold mb-1">Every AI agent is built custom — no third-party widgets, no monthly SaaS fees.</p>
              <p className="text-xs text-white/50">One-time build cost. You own it. Runs on your infrastructure.</p>
            </div>
          </div>

          {/* How We Design — TRAIN */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">HOW WE DESIGN</h2>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-3">The TRAIN System</p>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Every design decision follows a 5-principle framework. Not taste. Not trends. A system.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {trainSystem.map((item, index) => (
                <motion.div
                  key={item.letter}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="p-5 rounded-xl border bg-background text-center hover:border-black/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">
                    {item.letter}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 tracking-tight">{item.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 12 Visual Devices */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">VISUAL LANGUAGE</h2>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-3">12 Visual Devices</p>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Every concept gets communicated through one of these universal visual patterns. Your brain processes visuals 60,000x faster than text.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {visualDevices.map((device, index) => (
                <motion.div
                  key={device.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-xl border bg-background text-center hover:border-black/20 transition-colors"
                >
                  <div className="text-2xl mb-2">{device.icon}</div>
                  <h3 className="font-semibold text-sm mb-1 tracking-tight">{device.name}</h3>
                  <p className="text-xs text-muted-foreground">{device.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Who it's for */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-8 text-center">WHO THIS IS FOR</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {audiences.map((audience, index) => (
                <motion.div
                  key={audience.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl border bg-background text-center"
                >
                  <h3 className="font-semibold mb-2 tracking-tight">{audience.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{audience.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-20 pt-16 border-t max-w-4xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Ready to stop losing customers<br className="hidden md:block" /> to a bad website?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Tell us about your project. We&apos;ll tell you honestly if we&apos;re the right fit.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-black text-white rounded-full text-sm font-medium inline-flex items-center gap-2 group hover:bg-gray-900 transition-colors"
              >
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/work"
                className="px-8 py-3.5 border border-black/15 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
              >
                See Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

const process = [
  {
    title: "Discover",
    description: "We dig into who your customers are, what they fear, and what makes them buy. Not demographics. Psychographics.",
  },
  {
    title: "Design",
    description: "Every section answers one question in the buyer's mind. Trust signals at every scroll point. Conversion-first layout.",
  },
  {
    title: "Develop",
    description: "Hand-coded with Next.js. No templates. 90+ PageSpeed. Sub-2s load times. Every millisecond matters.",
  },
  {
    title: "Deliver",
    description: "Launch, test, and optimize. We don't just hand it off. We make sure it's actually working for your business.",
  },
];

const inclusions = [
  "Custom design, no templates, no themes",
  "Mobile-first responsive development",
  "SEO foundations and meta optimization",
  "90+ Google PageSpeed score",
  "Conversion-focused copywriting guidance",
  "Social proof and trust signal integration",
  "Analytics and tracking setup",
  "Post-launch support and iteration",
  "Hosting and deployment setup",
  "Performance monitoring",
];

const trainSystem = [
  {
    letter: "T",
    name: "Typography",
    description: "Typefaces that say what you mean. Weight, size, and spacing communicate before words do.",
  },
  {
    letter: "R",
    name: "Restraint",
    description: "One decision saves 1,000. Limited palette forces better ideas. Less noise, more signal.",
  },
  {
    letter: "A",
    name: "Alignment",
    description: "Invisible relationships create trust. Grids and geometry make design feel intentional.",
  },
  {
    letter: "I",
    name: "Image Treatment",
    description: "Consistent processing creates instant recognition. Same filter, same crop, same feel.",
  },
  {
    letter: "N",
    name: "Negative Space",
    description: "Space isn't there to fill. It's there to frame. Let the idea breathe.",
  },
];

const visualDevices = [
  { name: "Scale", description: "Size = significance", icon: "◻" },
  { name: "Comparison", description: "Side-by-side contrast", icon: "◫" },
  { name: "Metaphor", description: "Abstract made tangible", icon: "△" },
  { name: "Pattern", description: "Visual patterns decoded fast", icon: "◉" },
  { name: "Flow", description: "Sequential A → B progression", icon: "→" },
  { name: "Stacking", description: "Layered accumulation", icon: "⬡" },
  { name: "Continuum", description: "Position along a range", icon: "━" },
  { name: "Venn", description: "Overlapping factors", icon: "◎" },
  { name: "Hierarchy", description: "Top-to-bottom structure", icon: "▽" },
  { name: "Plot", description: "Two-axis relationships", icon: "⊞" },
  { name: "Loops", description: "Cyclical feedback processes", icon: "↻" },
  { name: "Spectrum", description: "Range between extremes", icon: "≡" },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "£997",
    timeline: "1–2 weeks",
    description: "One page. One goal. One CTA. For product launches, lead magnets, and waitlists.",
    includes: ["Hero + up to 4 sections", "Mobile-responsive", "SEO foundations", "Contact form or email capture", "Vercel deployment"],
    paymentPlan: null,
    featured: false,
  },
  {
    name: "Launch",
    price: "£2,497",
    timeline: "2–3 weeks",
    description: "Full conversion-focused site for service businesses, startups, and agencies.",
    includes: ["5–7 custom pages", "TRAIN design system", "Case studies layout", "Analytics + full SEO setup", "30 days post-launch support"],
    paymentPlan: "or 2 × £1,249",
    featured: true,
  },
  {
    name: "Growth",
    price: "£4,997",
    timeline: "3–5 weeks",
    description: "Everything in Launch plus blog, booking integration, and advanced analytics.",
    includes: ["Up to 10 pages", "Blog with CMS", "Booking integration", "Conversion-optimised copy structure", "90 days post-launch support"],
    paymentPlan: "or 3 × £1,666",
    featured: false,
  },
  {
    name: "Scale",
    price: "£9,997+",
    timeline: "6–12 weeks",
    description: "Custom web app with auth, database, and dashboard. For SaaS products and client portals.",
    includes: ["Everything in Growth", "User authentication", "Database integration", "Custom dashboard UI", "12-month partnership support"],
    paymentPlan: "flexible instalments available",
    featured: false,
  },
];

const addOns = [
  {
    title: "Copywriting",
    description: "We write every word. Problem-first headlines, conversion copy, and SEO-optimised page content in your brand voice.",
    price: "£497 / page",
  },
  {
    title: "Logo & Brand Kit",
    description: "Logo, colour palette, typography system, and brand guidelines. The visual foundation everything else is built on.",
    price: "£297",
  },
  {
    title: "Monthly Maintenance",
    description: "Updates, performance monitoring, content changes, and priority support. We stay on, so you don't have to worry about it.",
    price: "£97 / mo",
  },
  {
    title: "SEO Boost",
    description: "Ongoing keyword targeting, blog posts, Google Business Profile optimisation, and monthly performance reports. Built to rank, not just to look good.",
    price: "£197 / mo",
  },
  {
    title: "Extra Pages",
    description: "Additional pages beyond your package allowance. Same quality, same custom code.",
    price: "£197 / page",
  },
];

const aiAgents = [
  {
    icon: '🤖',
    title: 'Lead Qualifier Agent',
    description: 'Engages every visitor, asks the right questions, and segments them by intent — so you only spend time on prospects that are ready to buy.',
    price: 'from £1,200',
  },
  {
    icon: '📅',
    title: 'Booking & Scheduling Bot',
    description: 'Answers questions, handles objections, and books discovery calls directly into your calendar — 24/7, without human input.',
    price: 'from £800',
  },
  {
    icon: '💬',
    title: 'FAQ & Support Agent',
    description: 'Trained on your business, products, and FAQs. Handles 80% of customer queries instantly so you\'re not tied to your inbox.',
    price: 'from £600',
  },
  {
    icon: '⚙️',
    title: 'Internal Ops Agent',
    description: 'Automates internal workflows — reporting, data entry, email triage, CRM updates. Saves 5–15 hours a week for growing teams.',
    price: 'from £1,500',
  },
  {
    icon: '✍️',
    title: 'Content Generation Agent',
    description: 'Produces on-brand blog posts, social captions, and email sequences on a schedule. Built on your tone of voice, not a generic prompt.',
    price: 'from £900',
  },
  {
    icon: '🔍',
    title: 'Smart Search & Recommendation',
    description: 'AI-powered search and product/service recommendations for your site. Surfaces the right thing to the right visitor at the right moment.',
    price: 'from £1,000',
  },
];

const audiences = [
  {
    title: "Startups & Founders",
    description: "You need a site that gives you credibility with investors and converts early adopters. Not a Squarespace template.",
  },
  {
    title: "Service Businesses",
    description: "You're great at what you do but your website doesn't reflect that. Visitors leave without inquiring. We fix that.",
  },
  {
    title: "Growing Brands",
    description: "You've outgrown your first website. You need something custom that scales with your ambition and converts at a higher level.",
  },
];
