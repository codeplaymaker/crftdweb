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
    </main>
  );
}
