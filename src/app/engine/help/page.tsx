'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HelpPage() {
  const categories = [
    {
      title: 'Getting Started',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      articles: [
        { title: 'Quick Start Guide', href: '#' },
        { title: 'Creating Your First Truth Report', href: '#' },
        { title: 'Understanding Your Dashboard', href: '#' },
        { title: 'Setting Up Your Profile', href: '#' },
      ],
    },
    {
      title: 'Truth Engine',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      articles: [
        { title: 'How the Truth Engine Works', href: '#' },
        { title: 'Interpreting Your Viability Score', href: '#' },
        { title: 'Using Market Intelligence Data', href: '#' },
        { title: 'Export Options', href: '#' },
      ],
    },
    {
      title: 'AI Agents',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      articles: [
        { title: 'Meet Your AI Agents', href: '#' },
        { title: 'Best Practices for AI Conversations', href: '#' },
        { title: 'Using the Offer Architect', href: '#' },
        { title: 'VSL Builder Guide', href: '#' },
      ],
    },
    {
      title: 'Offer Builder',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      articles: [
        { title: 'Creating a New Offer', href: '#' },
        { title: 'Building Your Value Stack', href: '#' },
        { title: 'Pricing Strategies', href: '#' },
        { title: 'Publishing Your Offer', href: '#' },
      ],
    },
    {
      title: 'Account & Billing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      articles: [
        { title: 'Managing Your Subscription', href: '#' },
        { title: 'Updating Payment Methods', href: '#' },
        { title: 'Understanding Your Usage', href: '#' },
        { title: 'Cancellation & Refunds', href: '#' },
      ],
    },
    {
      title: 'Integrations',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      articles: [
        { title: 'Connecting to Notion', href: '#' },
        { title: 'Zapier Integration', href: '#' },
        { title: 'API Documentation', href: '#' },
        { title: 'Webhook Setup', href: '#' },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-white/60 mb-8">
            Search our knowledge base or browse categories below
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { label: 'Video Tutorials', icon: '🎬' },
            { label: 'Community Forum', icon: '💬' },
            { label: 'Feature Requests', icon: '💡' },
            { label: 'Contact Support', icon: '📧' },
          ].map((item) => (
            <Link
              key={item.label}
              href="#"
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <span className="text-white/70 text-sm">{item.label}</span>
            </Link>
          ))}
        </motion.div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  {category.icon}
                </div>
                <h2 className="text-lg font-semibold text-white">{category.title}</h2>
              </div>
              
              <ul className="space-y-2">
                {category.articles.map((article) => (
                  <li key={article.title}>
                    <Link
                      href={article.href}
                      className="text-white/60 hover:text-purple-400 text-sm transition-colors block py-1"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Still Need Help?
          </h2>
          <p className="text-white/60 mb-6">
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@crftdweb.com"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Email Support
            </a>
            <Link
              href="/engine/demo"
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Book a Call
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
