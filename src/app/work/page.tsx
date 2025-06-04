'use client';

import { motion } from 'framer-motion';
import Work from '@/components/Work';

export default function WorkPage() {
  return (
    <main className="pt-20">
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Work</h1>
            <p className="text-xl text-muted-foreground">
              A showcase of our digital craftsmanship
            </p>
          </motion.div>
          
          <Work />
        </div>
      </section>
    </main>
  );
}
