'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WhitelabelPage() {
  const benefits = [
    {
      icon: '🏷️',
      title: 'Your Brand, Your Platform',
      description: 'Complete white-labeling with your logo, colors, and custom domain.',
    },
    {
      icon: '💰',
      title: 'Keep 100% of Revenue',
      description: 'Charge your clients whatever you want. No revenue share.',
    },
    {
      icon: '🚀',
      title: 'Launch in 24 Hours',
      description: 'We handle all the tech. You focus on sales and delivery.',
    },
    {
      icon: '📈',
      title: 'Unlimited Scalability',
      description: 'No per-user fees. Add as many clients as you want.',
    },
    {
      icon: '🔒',
      title: 'Full Data Isolation',
      description: 'Each client\'s data is completely separate and secure.',
    },
    {
      icon: '🎯',
      title: 'Premium Positioning',
      description: 'Offer AI-powered tools as a premium add-on to your services.',
    },
  ];

  const useCases = [
    {
      title: 'Business Coaches',
      description: 'Offer market research and offer building as part of your coaching program.',
      revenue: '$2,000 - $5,000/client',
    },
    {
      title: 'Marketing Agencies',
      description: 'Add AI-powered research to your service stack for higher-ticket retainers.',
      revenue: '$3,000 - $10,000/month',
    },
    {
      title: 'Course Creators',
      description: 'Bundle as a premium tier or done-for-you upgrade to your programs.',
      revenue: '$997 - $2,497/student',
    },
    {
      title: 'SaaS Founders',
      description: 'Integrate our AI tools into your existing platform via API.',
      revenue: 'Custom pricing',
    },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Whitelabel Program
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Launch Your Own AI-Powered
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
              Offer Building Platform
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            White-label Engine and sell it to your clients under your own brand. 
            No development needed. Launch in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/engine/demo"
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Apply for Whitelabel Access
            </Link>
            <a
              href="#how-it-works"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {[
            { value: '50+', label: 'Whitelabel Partners' },
            { value: '$2.4M', label: 'Partner Revenue Generated' },
            { value: '24hrs', label: 'Avg. Launch Time' },
            { value: '100%', label: 'Revenue You Keep' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Partners Love Engine Whitelabel
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <span className="text-3xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/60 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          id="how-it-works"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Apply & Get Approved',
                description: 'Fill out our application form. We\'ll review and approve qualified partners within 24 hours.',
              },
              {
                step: '02',
                title: 'Customize Your Platform',
                description: 'Add your logo, brand colors, and connect your custom domain. We handle all the setup.',
              },
              {
                step: '03',
                title: 'Launch & Profit',
                description: 'Start selling to your clients immediately. You set the price and keep all the revenue.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-400 text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Perfect For
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            Join successful coaches, agencies, and entrepreneurs who are already profiting with Engine Whitelabel
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{useCase.title}</h3>
                  <p className="text-white/60 text-sm mb-2">{useCase.description}</p>
                  <p className="text-purple-400 text-sm font-medium">{useCase.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-b from-purple-600/20 to-violet-600/10 border border-purple-500/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Whitelabel Pricing
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Simple, transparent pricing. No hidden fees. No revenue share.
            </p>
            
            <div className="inline-block bg-black/30 rounded-2xl p-8 mb-8">
              <div className="text-5xl font-bold text-white mb-2">$497<span className="text-xl text-white/60">/month</span></div>
              <p className="text-white/50 text-sm">Billed annually at $4,970/year</p>
            </div>

            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              {[
                'Unlimited client accounts',
                'Custom branding & domain',
                'All AI agents included',
                'Priority support',
                'API access',
                'Training & onboarding',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/engine/demo"
              className="inline-block bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Apply Now
            </Link>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Launch Your Platform?
          </h2>
          <p className="text-white/60 mb-8">
            Join our whitelabel program and start generating revenue in 24 hours
          </p>
          <Link
            href="/engine/demo"
            className="inline-block bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Book a Demo Call
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
