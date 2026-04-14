'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const industries = [
  {
    title: 'Restaurants',
    description: 'Empty tables cost money. A bad website fills them.',
    href: '/services/web-design-for-restaurants',
    icon: '🍽️',
  },
  {
    title: 'Dentists',
    description: 'Patients choose the practice that looks trustworthy first.',
    href: '/services/web-design-for-dentists',
    icon: '🦷',
  },
  {
    title: 'Salons',
    description: 'Your work is beautiful. Your website should prove it.',
    href: '/services/web-design-for-salons',
    icon: '💇',
  },
  {
    title: 'Gyms',
    description: 'Members sign up online or not at all.',
    href: '/services/web-design-for-gyms',
    icon: '🏋️',
  },
  {
    title: 'Estate Agents',
    description: 'Buyers judge the agent before they judge the property.',
    href: '/services/web-design-for-real-estate',
    icon: '🏠',
  },
  {
    title: 'Price Guide',
    description: 'Transparent pricing. No surprises. No sales calls required.',
    href: '/services/website-cost',
    icon: '💷',
  },
];

export default function Industries() {
  return (
    <section className="py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            INDUSTRIES WE SERVE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            Your industry.{' '}
            <span className="text-muted-foreground">Your customers. Your site.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Generic templates convert generically. Industry-specific sites convert specifically.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                href={industry.href}
                className="block p-6 rounded-xl border border-black/10 hover:border-black/20 bg-accent/50 hover:bg-accent transition-all duration-300 group h-full"
              >
                <span className="text-2xl mb-3 block">{industry.icon}</span>
                <h3 className="text-base font-semibold mb-1.5 tracking-tight group-hover:text-black transition-colors">
                  {industry.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                  {industry.description}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-black group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-3 h-3" />
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
            href="/services/website-cost"
            className="text-sm text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
          >
            See our pricing guide →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
