'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const highlights = [
  {
    category: 'Case Study',
    title: 'How We Rebuilt a Science Company\'s Website',
    description: 'Microbiome Design had groundbreaking science but a website that looked like a student project.',
    href: '/blog/microbiome-design-case-study',
    stat: { value: '97', label: 'PageSpeed' },
  },
  {
    category: 'Case Study',
    title: 'Turning Browsers Into Paying Members',
    description: 'The Life Lab HQ had great content but visitors left without signing up. We fixed that.',
    href: '/blog/life-lab-hq-case-study',
    stat: { value: '+340%', label: 'Conversions' },
  },
  {
    category: 'Guide',
    title: 'WordPress vs Custom-Coded Website',
    description: 'An honest comparison. Speed, cost, SEO, security — no bias, just data.',
    href: '/blog/wordpress-vs-custom-coded-website',
    stat: { value: '3.4x', label: 'Speed Diff' },
  },
];

export default function BlogHighlights() {
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
            INSIGHTS & RESULTS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            Real results.{' '}
            <span className="text-muted-foreground">Real businesses.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Case studies and guides from our work with businesses like yours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((post, index) => (
            <motion.div
              key={post.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={post.href}
                className="block p-8 rounded-2xl border bg-background hover:border-black/20 transition-all duration-300 group h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    {post.category}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-black">{post.stat.value}</span>
                    <span className="block text-[10px] text-muted-foreground">{post.stat.label}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-black transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {post.description}
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
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
          >
            View all posts →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
