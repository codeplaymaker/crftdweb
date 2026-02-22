'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Work from '@/components/Work';

export default function WorkPage() {
  return (
    <main className="pt-20">
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
              PORTFOLIO
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">Our Work</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A showcase of our digital craftsmanship
            </p>
          </motion.div>
          
          <Work />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-20 pt-16 border-t"
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Like what you see?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Let&apos;s build something exceptional together.
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
    </main>
  );
}
