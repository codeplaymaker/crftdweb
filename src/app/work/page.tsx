'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Work from '@/components/Work';

export default function WorkPage() {
  return (
    <main className="pt-20">
      <section className="py-16 border-b border-black/[0.06]">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
              OUR WORK
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">Real projects. Real results.</h1>
          </div>
          <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Every project starts with a problem. A business with great science and a website that looks like a student built it. A platform with real content and visitors who leave without signing up. A trader who needs a tool that actually fits how they work.
            </p>
            <p>
              The build comes second. First is understanding who arrives, what they need to believe, and what stops them from taking action.
            </p>
            <p>
              These are the projects we have built. Each one is custom-coded from scratch — no templates, no page builders, no shortcuts that cost you performance later. The results below are from real clients, not projections.
            </p>
          </div>
        </div>
      </section>
      <section className="py-32">
        <div className="container">
          <Work />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-20 pt-16 border-t"
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Want results like these?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Every project starts with a conversation. Tell us what&apos;s not working
              and we&apos;ll show you how to fix it.
            </p>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-black text-white rounded-full text-sm font-medium inline-flex items-center gap-2 group hover:bg-gray-900 transition-colors"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Related resources */}
      <section className="py-20 border-t border-black/[0.06]">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Related resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/blog" className="block p-5 rounded-xl border hover:border-black/30 transition-colors">
              <p className="text-xs text-purple-600 mb-1 uppercase tracking-wider">Blog</p>
              <p className="text-sm text-muted-foreground">Case studies and project breakdowns</p>
            </Link>
            <Link href="/concepts" className="block p-5 rounded-xl border hover:border-black/30 transition-colors">
              <p className="text-xs text-purple-600 mb-1 uppercase tracking-wider">Concepts</p>
              <p className="text-sm text-muted-foreground">Learn the thinking behind great web design</p>
            </Link>
            <Link href="/answers" className="block p-5 rounded-xl border hover:border-black/30 transition-colors">
              <p className="text-xs text-purple-600 mb-1 uppercase tracking-wider">Answers</p>
              <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
