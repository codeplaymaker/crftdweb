'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for getting started',
      price: annual ? 0 : 0,
      period: 'forever',
      features: [
        '5 Truth Engine Reports/month',
        '3 AI Agent Conversations/day',
        '1 Active Offer',
        'Basic Templates',
        'Email Support',
      ],
      cta: 'Get Started Free',
      href: '/engine/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      description: 'For serious entrepreneurs',
      price: annual ? 47 : 57,
      period: annual ? '/month (billed annually)' : '/month',
      features: [
        'Unlimited Truth Engine Reports',
        'Unlimited AI Agent Conversations',
        '10 Active Offers',
        'All Templates & Frameworks',
        'Priority Support',
        'Export to PDF/Notion',
        'Custom Branding',
      ],
      cta: 'Start Pro Trial',
      href: '/engine/signup?plan=pro',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Agency',
      description: 'For teams and agencies',
      price: annual ? 197 : 247,
      period: annual ? '/month (billed annually)' : '/month',
      features: [
        'Everything in Pro',
        'Unlimited Active Offers',
        '5 Team Members',
        'White-label Reports',
        'API Access',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Training Sessions',
      ],
      cta: 'Contact Sales',
      href: '/engine/demo',
      highlight: false,
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/60 mb-8">
            Start free, upgrade when you're ready
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-white/50'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                annual ? 'bg-purple-600' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  annual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-white/50'}`}>
              Annual <span className="text-green-400">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-purple-600/20 to-violet-600/10 border-2 border-purple-500/50'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                <p className="text-white/50 text-sm">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-5xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-white/50 text-sm ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-medium transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:opacity-90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Can I try Engine for free?',
                a: 'Yes! Our Starter plan is completely free forever. You get 5 Truth Engine reports per month and 3 AI agent conversations per day—plenty to see the value before upgrading.',
              },
              {
                q: 'What happens if I exceed my limits?',
                a: 'You\'ll be prompted to upgrade to continue using the tools. We\'ll never charge you automatically without consent.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. No contracts, no cancellation fees. You can downgrade or cancel your subscription at any time from your account settings.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied, just reach out and we\'ll process a full refund.',
              },
              {
                q: 'Is my data secure?',
                a: 'Your data is encrypted with AES-256 encryption and stored securely. We never share or sell your research data to third parties.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-medium mb-2">{item.q}</h3>
                <p className="text-white/60 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your High-Ticket Offer?
          </h2>
          <p className="text-white/60 mb-8">
            Join thousands of entrepreneurs already using Engine
          </p>
          <Link
            href="/engine/signup"
            className="inline-block bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
