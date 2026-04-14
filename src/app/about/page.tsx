'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="pt-20">
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-20">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                ABOUT CRFTDWEB
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">We build websites that sell.</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Not agencies that talk about &ldquo;digital transformation.&rdquo;
                We hand-code conversion-first websites for startups and service businesses.
              </p>
            </div>

            {/* The real story */}
            <div className="space-y-12 mb-16">
              <div>
                <h2 className="text-2xl font-semibold mb-4 tracking-tight">The short version</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Most agencies hand you a WordPress template, slap your logo on it, and call it custom.
                  We write every line of code from scratch. React, Next.js, TypeScript. Built for speed,
                  built for search engines, built to convert visitors into customers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Different industries, same problem: businesses spending money on websites that look
                  fine but don&apos;t generate leads. That&apos;s the problem we solve.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 tracking-tight">How we work</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Every project follows the same four-step process: Discover the real business problem.
                  Design around what converts, not what looks trendy. Develop with production-grade code.
                  Deliver something that actually performs.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  No surprises. No scope creep. You know what you&apos;re getting before we write a single line of code.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 tracking-tight">What we believe</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  A website that looks good but does not generate leads is a cost, not an asset.
                  Most businesses are paying for the first kind. We build the second.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Speed is not optional. Core Web Vitals scores above 90 are not a nice-to-have.
                  They are the difference between ranking and not ranking. Between a visitor staying
                  and leaving before your page has loaded.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Templates are not custom. A WordPress theme with your logo is not a custom website.
                  It is someone else&apos;s decisions applied to your business. Every site we build
                  starts from zero — designed and coded for the specific business, not adapted from a theme.
                </p>
              </div>
            </div>

            {/* Ecosystem */}
            <div className="p-8 rounded-xl border bg-background mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 block text-center">
                THE ECOSYSTEM
              </span>
              <h3 className="text-xl font-bold tracking-tight mb-6 text-center">Three products, one methodology</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ecosystem.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <h4 className="font-medium mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                <Link href="/services" className="px-5 py-2.5 border border-black/15 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                  Services
                </Link>
                <Link href="/playbook" className="px-5 py-2.5 border border-black/15 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                  Playbook
                </Link>
                <Link href="/engine" className="px-5 py-2.5 border border-black/15 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                  Engine
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Let&apos;s talk about your website.</h3>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                Tell us what&apos;s not working and we&apos;ll tell you honestly if we can help.
              </p>
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-black text-white rounded-full text-sm font-medium inline-flex items-center gap-2 group hover:bg-gray-900 transition-colors"
              >
                Start a Conversation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-muted-foreground/50 mt-4">
                Free consultation · No commitment · Response within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related resources */}
      <section className="py-20 border-t border-black/[0.06]">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Related resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/playbook" className="block p-5 rounded-xl border hover:border-black/30 transition-colors">
              <p className="text-xs text-purple-600 mb-1 uppercase tracking-wider">Playbook</p>
              <p className="text-sm text-muted-foreground">Our framework for building a business around great web design</p>
            </Link>
            <Link href="/concepts" className="block p-5 rounded-xl border hover:border-black/30 transition-colors">
              <p className="text-xs text-purple-600 mb-1 uppercase tracking-wider">Concepts</p>
              <p className="text-sm text-muted-foreground">The principles that guide every project we build</p>
            </Link>
            <Link href="/faq" className="block p-5 rounded-xl border hover:border-black/30 transition-colors">
              <p className="text-xs text-purple-600 mb-1 uppercase tracking-wider">FAQ</p>
              <p className="text-sm text-muted-foreground">Common questions about working with us</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const ecosystem = [
  {
    title: "The Studio",
    description: "Hand-coded in Next.js, TypeScript, and React. Designed for speed, search engines, and conversion. No templates, no page builders."
  },
  {
    title: "The Playbook",
    description: "The methodology behind every project we build — documented and packaged so other agency owners can use it to grow their own business."
  },
  {
    title: "Engine",
    description: "Tools for agency owners. Content generation, client management, and business growth — without the overhead of hiring a full team."
  }
];
