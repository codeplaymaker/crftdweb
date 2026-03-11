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
              <span className="text-muted-foreground">turn visitors into customers.</span>
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
    description: "We dig into who your customers are, what they fear, and what makes them buy. Not demographics — psychographics.",
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
    description: "Launch, test, and optimize. We don't just hand it off — we make sure it's actually working for your business.",
  },
];

const inclusions = [
  "Custom design — no templates, no themes",
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
