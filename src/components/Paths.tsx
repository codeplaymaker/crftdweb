'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const paths = [
  {
    tag: 'FOR SERVICE PROVIDERS',
    title: 'Learn the Framework',
    description: 'The 6-stage methodology to go from trading time for money to building scalable products.',
    href: '/playbook',
    cta: 'Explore Playbook',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    hoverBorder: 'hover:border-emerald-500/30',
  },
  {
    tag: 'FOR COACHES & AGENCIES',
    title: 'Use the AI System',
    description: 'Launch, sell, and automate high-ticket offers with AI-powered content, funnels, and agents.',
    href: '/engine',
    cta: 'Explore Engine',
    gradient: 'from-purple-500/10 to-violet-500/10',
    hoverBorder: 'hover:border-purple-500/30',
  },
  {
    tag: 'NEED A WEBSITE?',
    title: 'Hire Our Studio',
    description: 'Premium web design and development for brands that demand excellence.',
    href: '/contact',
    cta: 'Start a Project',
    gradient: 'from-black/5 to-black/5',
    hoverBorder: 'hover:border-black/30',
  },
];

export default function Paths() {
  return (
    <section className="py-32 bg-accent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            THREE WAYS TO WORK WITH US
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            Choose Your Path
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you want to learn, automate, or hire — we&apos;ve built something for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={path.href}
                className={`block p-8 rounded-2xl border bg-gradient-to-br ${path.gradient} ${path.hoverBorder} transition-all duration-300 group h-full`}
              >
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
                  {path.tag}
                </span>
                <h3 className="text-2xl font-bold tracking-tight mb-3">{path.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {path.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                  {path.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
