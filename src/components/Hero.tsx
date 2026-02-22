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
      
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full blur-3xl opacity-40" />
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
            WEB DESIGN & DEVELOPMENT STUDIO
          </motion.span>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-600 to-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Crafting Digital
            <br />
            Excellence
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We transform ideas into exceptional web experiences, combining
            innovative design with cutting-edge technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/contact" className="px-8 py-3.5 border border-black/15 rounded-full hover:bg-black/5 transition-colors text-black text-sm font-medium">
              Get Started
            </Link>
            <Link href="/work" className="px-8 py-3.5 bg-black text-white rounded-full hover:bg-gray-900 transition-colors text-sm font-medium">
              Our Work
            </Link>
          </motion.div>

          {/* Process mini-flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-20 flex items-center justify-center gap-3 text-muted-foreground"
          >
            {['Discover', 'Design', 'Develop', 'Deliver'].map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="text-xs font-medium tracking-wide">{step}</span>
                {i < 3 && (
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="text-black/15">
                    <path d="M0 4h14M11 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
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