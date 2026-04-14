'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const featured = [
  {
    slug: 'how-much-does-a-website-cost',
    question: 'How much does a website cost?',
    shortAnswer: 'Cheap sites cost more. They just bill later.',
    stat: { value: '£1.5k', label: 'Starting From' },
  },
  {
    slug: 'how-long-does-it-take-to-build-a-website',
    question: 'How long does it take to build a website?',
    shortAnswer: '14 days. Content ready on day one, live by day fourteen.',
    stat: { value: '14', label: 'Days' },
  },
  {
    slug: 'what-is-a-good-pagespeed-score',
    question: 'What is a good PageSpeed score?',
    shortAnswer: '90 is the floor. Below 50 is the problem.',
    stat: { value: '90+', label: 'Target' },
  },
  {
    slug: 'do-i-need-seo',
    question: 'Do I need SEO?',
    shortAnswer: 'Your site exists. SEO decides if anyone sees it.',
    stat: { value: 'Day 1', label: 'Built In' },
  },
  {
    slug: 'what-should-a-homepage-include',
    question: 'What should a homepage include?',
    shortAnswer: 'One offer. One CTA. Everything else is noise.',
    stat: { value: '3s', label: 'To Decide' },
  },
  {
    slug: 'what-is-technical-seo',
    question: 'What is technical SEO?',
    shortAnswer: 'Great content on a broken foundation ranks nowhere.',
    stat: { value: 'Foundation', label: 'Layer' },
  },
];

export default function AnswersHighlights() {
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
            ANSWERS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            Real questions.{' '}
            <span className="text-muted-foreground">Real answers.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            No pitch. No waffle. Just the thing you came to know.
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
                href={`/answers/${item.slug}`}
                className="block p-8 rounded-2xl border bg-background hover:border-black/20 transition-all duration-300 group h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    Q&amp;A
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-black">{item.stat.value}</span>
                    <span className="block text-[10px] text-muted-foreground">{item.stat.label}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-black transition-colors">
                  {item.question}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {item.shortAnswer}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  Read answer
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
            href="/answers"
            className="text-sm text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
          >
            View all answers →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
