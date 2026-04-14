'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const featured = [
  {
    slug: 'conversion-rate',
    term: 'Conversion Rate',
    description: 'Traffic is vanity. Conversion is revenue.',
    stat: { value: '2–5%', label: 'Industry Avg' },
  },
  {
    slug: 'core-web-vitals',
    term: 'Core Web Vitals',
    description: 'Google measures speed. Rankings reflect it.',
    stat: { value: 'Ranking', label: 'Signal' },
  },
  {
    slug: 'bounce-rate',
    term: 'Bounce Rate',
    description: 'One page. One exit. No second chance.',
    stat: { value: '70%', label: 'Avg Blog' },
  },
  {
    slug: 'cta',
    term: 'Call-to-Action',
    description: 'Clarity converts. Confusion leaves.',
    stat: { value: '#1', label: 'Conversion Tool' },
  },
  {
    slug: 'seo',
    term: 'SEO',
    description: 'Found by default. Or designed to be found.',
    stat: { value: 'Organic', label: 'Long Game' },
  },
  {
    slug: 'schema-markup',
    term: 'Schema Markup',
    description: 'You write for people. Schema writes for machines.',
    stat: { value: 'Rich', label: 'Results' },
  },
];

export default function GlossaryHighlights() {
  return (
    <section className="py-32 bg-accent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            GLOSSARY
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            Understand the words.{' '}
            <span className="text-muted-foreground">Own the outcome.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Jargon is a barrier. Definitions are a weapon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={`/glossary/${item.slug}`}
                className="block p-8 rounded-2xl border bg-background hover:border-black/20 transition-all duration-300 group h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    Term
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-black">{item.stat.value}</span>
                    <span className="block text-[10px] text-muted-foreground">{item.stat.label}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-black transition-colors">
                  {item.term}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  Read definition
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
            href="/glossary"
            className="text-sm text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
          >
            View full glossary →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
