'use client';

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 sm:py-28 md:py-32 relative overflow-hidden bg-background">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-accent to-background" />
      
      <div className="container relative px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8 block">
            LET&apos;S BUILD TOGETHER
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-black leading-tight tracking-tight">
            Ready to Transform Your
            <br className="hidden sm:block" />
            Digital Presence?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-10 px-3 sm:px-0 leading-relaxed max-w-xl mx-auto">
            Your vision, our expertise. Let&apos;s collaborate to create
            something extraordinary.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/contact"
              className="px-8 py-4 bg-black text-white rounded-full text-sm font-medium inline-flex items-center gap-2 group hover:bg-gray-900 transition-colors"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="hidden md:block absolute top-1/2 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -translate-y-1/2" />
      <div className="hidden md:block absolute top-1/2 right-0 w-72 h-72 bg-accent rounded-full blur-3xl -translate-y-1/2" />
    </section>
  );
} 