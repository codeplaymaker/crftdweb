'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const featured = [
  {
    slug: 'conversion-first-design',
    title: 'Conversion-First Design',
    description: 'Beautiful websites don\'t convert. Intentional ones do.',
    stat: { value: '3s', label: 'Decision Window' },
  },
  {
    slug: 'trust-engineering',
    title: 'Trust Engineering',
    description: 'Visitors know what to buy. They just don\'t trust you yet.',
    stat: { value: '#1', label: 'Conversion Barrier' },
  },
  {
    slug: 'core-web-vitals-explained',
    title: 'Core Web Vitals',
    description: 'Google ranks what loads fast. Slow sites pay twice.',
    stat: { value: '2.5s', label: 'LCP Target' },
  },
  {
    slug: 'nextjs-for-business-websites',
    title: 'Next.js for Business',
    description: 'WordPress looks cheaper. The bill comes later.',
    stat: { value: '100ms', label: 'Load Time' },
  },
];

export default function ConceptsHighlights() {
  return (
    <section className="py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            CONCEPTS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            The ideas behind{' '}
            <span className="text-muted-foreground">high-performing sites.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Strategy first. Design second. Tools last.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((concept, index) => (
            <motion.div
              key={concept.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/concepts/${concept.slug}`}
                className="block p-8 rounded-2xl border bg-background hover:border-black/20 transition-all duration-300 group h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    Concept
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-black">{concept.stat.value}</span>
                    <span className="block text-[10px] text-muted-foreground">{concept.stat.label}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-black transition-colors">
                  {concept.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {concept.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  Read more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            href="/concepts"
            className="text-sm text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
          >
            View all concepts →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
