'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    revenue: '',
    challenge: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to your CRM/calendar booking system
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">You're Booked!</h1>
          <p className="text-white/60 mb-8">
            Check your email for the calendar invite. We'll see you soon!
          </p>
          <a
            href="/engine"
            className="inline-block bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Strategy Call
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            See how Engine can help you build and automate high-ticket offers in 60 minutes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">What You'll Get</h2>
            
            {[
              {
                title: 'Personalized Strategy',
                description: 'We\'ll analyze your business and show you exactly how to implement Engine.',
              },
              {
                title: 'Live Demo',
                description: 'See the Truth Engine and AI Agents in action with your actual niche.',
              },
              {
                title: 'Custom Roadmap',
                description: 'Walk away with a clear plan to launch your first high-ticket offer.',
              },
              {
                title: 'Q&A Session',
                description: 'Get all your questions answered by our team.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.description}</p>
                </div>
              </div>
            ))}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-8">
              <p className="text-white/80 italic">
                "The strategy call alone was worth more than most courses I've bought. They showed me exactly how to position my offer and I closed my first $5K client that same week."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 font-medium">J</span>
                </div>
                <div>
                  <p className="text-white font-medium">Jordan M.</p>
                  <p className="text-white/40 text-sm">Agency Owner</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Schedule Your Call</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Company / Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Current Monthly Revenue
                  </label>
                  <select
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="" className="bg-black">Select...</option>
                    <option value="0-5k" className="bg-black">$0 - $5,000</option>
                    <option value="5k-10k" className="bg-black">$5,000 - $10,000</option>
                    <option value="10k-25k" className="bg-black">$10,000 - $25,000</option>
                    <option value="25k-50k" className="bg-black">$25,000 - $50,000</option>
                    <option value="50k+" className="bg-black">$50,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Biggest Challenge Right Now
                  </label>
                  <textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    rows={3}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                    placeholder="What's holding you back from scaling?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Book My Strategy Call
                </button>

                <p className="text-white/40 text-xs text-center">
                  By submitting, you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
