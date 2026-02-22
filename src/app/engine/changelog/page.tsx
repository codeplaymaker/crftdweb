'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ChangelogPage() {
  const releases = [
    {
      version: '1.3.0',
      date: 'February 4, 2026',
      tag: 'New',
      changes: [
        { type: 'feature', text: 'Added Whitelabel program for agencies and coaches' },
        { type: 'feature', text: 'New AI Agent: Landing Page Copywriter' },
        { type: 'improvement', text: 'Improved Truth Engine accuracy by 40%' },
        { type: 'fix', text: 'Fixed report export formatting issues' },
      ],
    },
    {
      version: '1.2.0',
      date: 'January 15, 2026',
      changes: [
        { type: 'feature', text: 'Introduced 5-step Offer Builder wizard' },
        { type: 'feature', text: 'Added PDF export for all reports' },
        { type: 'improvement', text: 'Dashboard redesign with better analytics' },
        { type: 'improvement', text: 'Faster AI response times' },
      ],
    },
    {
      version: '1.1.0',
      date: 'December 20, 2025',
      changes: [
        { type: 'feature', text: 'Added 4 new AI agents' },
        { type: 'feature', text: 'Notion integration for report exports' },
        { type: 'improvement', text: 'Enhanced market intelligence data sources' },
        { type: 'fix', text: 'Fixed authentication issues on mobile' },
      ],
    },
    {
      version: '1.0.0',
      date: 'November 1, 2025',
      tag: 'Launch',
      changes: [
        { type: 'feature', text: 'Initial release of Engine platform' },
        { type: 'feature', text: 'Truth Engine market research tool' },
        { type: 'feature', text: '4 AI Agents: Offer, Niche, VSL, and Ads Architect' },
        { type: 'feature', text: 'Dashboard with usage analytics' },
      ],
    },
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-green-500/20 text-green-400';
      case 'improvement':
        return 'bg-blue-500/20 text-blue-400';
      case 'fix':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Changelog
          </h1>
          <p className="text-xl text-white/60">
            Stay up to date with new features and improvements
          </p>
        </motion.div>

        <div className="space-y-12">
          {releases.map((release, index) => (
            <motion.div
              key={release.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline line */}
              {index < releases.length - 1 && (
                <div className="absolute left-[19px] top-12 bottom-0 w-px bg-white/10" />
              )}

              <div className="flex gap-6">
                {/* Timeline dot */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/50">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white">v{release.version}</h2>
                    {release.tag && (
                      <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                        {release.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-sm mb-4">{release.date}</p>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                    {release.changes.map((change, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getTypeStyles(change.type)}`}>
                          {change.type}
                        </span>
                        <span className="text-white/70 text-sm">{change.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
        >
          <h2 className="text-xl font-bold text-white mb-2">
            Get Notified of Updates
          </h2>
          <p className="text-white/60 mb-6">
            Subscribe to our changelog and never miss a new feature
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
            />
            <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Link href="/engine" className="text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to Engine
          </Link>
        </div>
      </div>
    </div>
  );
}
