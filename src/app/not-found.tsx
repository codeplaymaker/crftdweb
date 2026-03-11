'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="bg-white/5 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
