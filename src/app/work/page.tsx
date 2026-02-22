'use client';

import { motion } from 'framer-motion';
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
        </div>
      </section>
    </main>
  );
}
