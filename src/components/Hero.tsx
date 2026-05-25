'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import 3D component with better error handling
const Hero3D = dynamic(() => import('./Hero3D'), { 
  ssr: false,
  loading: () => null
});

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* 3D Background */}
      <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <Hero3D />
      </div>
      


      {/* Content */}
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span
            className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            FOR UK SERVICE BUSINESSES
          </motion.span>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your next client just Googled you.
            <br />
            <span className="text-muted-foreground">What did they find?</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We hand-code websites for UK service businesses that make you look like the obvious choice — and turn visitors into enquiries. No templates. No page builders. Live in 14 days.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/work" className="px-8 py-3.5 bg-black text-white rounded-full hover:bg-gray-900 transition-colors text-sm font-medium">
              See the Results
            </Link>
            <Link href="/contact" className="px-8 py-3.5 border border-black/15 rounded-full hover:bg-black/5 transition-colors text-black text-sm font-medium">
              Start a Project
            </Link>
          </motion.div>

          {/* Proof strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-14 flex items-center justify-center gap-6 flex-wrap"
          >
            {['90+ PageSpeed', 'Live in 14 days', 'No templates', 'Built to convert'].map((item) => (
              <span key={item} className="flex items-center gap-2 text-xs font-medium text-black/35">
                <span className="w-1 h-1 rounded-full bg-black/20 inline-block" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-5 h-8 border border-black/15 rounded-full flex justify-center">
          <motion.div
            className="w-0.5 h-1.5 bg-black/20 rounded-full mt-1.5"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
} 