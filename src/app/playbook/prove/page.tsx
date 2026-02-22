'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface ProofItem {
  id: string;
  type: 'testimonial' | 'case-study' | 'metric' | 'endorsement';
  title: string;
  content: string;
  client: string;
  date: string;
  status: 'draft' | 'published';
}

const sampleProof: ProofItem[] = [
  { id: '1', type: 'testimonial', title: 'Website redesign testimonial', content: '"They completely transformed our online presence. Our conversion rate went from 1.2% to 4.8% in the first month."', client: 'Sarah K., SaaS Founder', date: '2026-02-15', status: 'published' },
  { id: '2', type: 'case-study', title: 'E-commerce redesign case study', content: 'Problem: Low conversion rate (0.8%). Solution: Trust-first redesign. Result: 340% increase in conversions, $120K additional revenue in 90 days.', client: 'TechStore Co.', date: '2026-02-10', status: 'published' },
  { id: '3', type: 'metric', title: 'Portfolio traffic results', content: '3x increase in organic traffic. 52 leads generated from content. 8 closed deals worth $47K total.', client: 'Internal', date: '2026-02-01', status: 'draft' },
];

const followUpSequence = [
  { day: 0, action: 'Project completed — send thank you', template: 'Hi [Name], just wanted to say thank you for trusting us with [project]. It was a great experience working together.' },
  { day: 2, action: 'Request feedback (private)', template: 'Hi [Name], now that [project] has been live for a couple of days, I\'d love to hear your honest feedback. Anything we could have done better? [Feedback form link]' },
  { day: 7, action: 'Request testimonial', template: 'Hi [Name], would you be open to sharing a quick testimonial about our work together? I\'ve made it super easy — just 5 questions, takes 3 minutes. [Testimonial form link]' },
  { day: 14, action: 'Request video testimonial', template: 'Hi [Name], your written testimonial was amazing — thank you! Would you be open to a 2-minute video version? I can send you the questions in advance. It makes a huge difference for our marketing.' },
  { day: 30, action: 'Check in + case study request', template: 'Hi [Name], it\'s been a month since [project] launched. How are the results looking? I\'d love to write up a case study featuring your results — with your permission of course.' },
  { day: 60, action: 'Share results + referral ask', template: 'Hi [Name], I just compiled some results from [project] — [specific metrics]. Would you know anyone else in [industry] who might benefit from similar results?' },
  { day: 90, action: 'Long-term results check-in', template: 'Hi [Name], it\'s been 90 days since [project]. I\'d love to update our case study with your latest numbers. Also, we have some new offerings that might interest you — [upsell].' },
];

const caseStudyTemplate = {
  sections: [
    { name: 'Client Background', prompt: 'Who is the client? Industry, size, situation before working with you.' },
    { name: 'The Problem', prompt: 'What specific problem were they facing? Use their words. What was the cost of NOT solving it?' },
    { name: 'The Solution', prompt: 'What did you do? Describe your process/methodology. What made your approach different?' },
    { name: 'The Results', prompt: 'Specific, measurable outcomes. Before/after numbers. Timeline to results.' },
    { name: 'Client Quote', prompt: 'Direct testimonial from the client about the experience and results.' },
    { name: 'Key Takeaway', prompt: 'What can others learn from this? What\'s the transferable insight?' },
  ],
};

export default function ProvePage() {
  const [proofItems, setProofItems] = useState(sampleProof);
  const [activeTab, setActiveTab] = useState<'loop' | 'sequence' | 'builder' | 'library'>('loop');
  const [caseStudyAnswers, setCaseStudyAnswers] = useState<Record<string, string>>({});
  const [showAddProof, setShowAddProof] = useState(false);

  const publishedCount = proofItems.filter(p => p.status === 'published').length;
  const testimonialCount = proofItems.filter(p => p.type === 'testimonial').length;
  const caseStudyCount = proofItems.filter(p => p.type === 'case-study').length;

  return (
    <section className="min-h-screen py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              PROVE
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Proof & Price Loop
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Give it away until you have enough proof to sell it. 
              Then: Get proof → Get paid → Get more proof → Get paid more.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white text-2xl font-bold">{proofItems.length}</p>
              <p className="text-white/50 text-sm">Total Proof</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white text-2xl font-bold">{testimonialCount}</p>
              <p className="text-white/50 text-sm">Testimonials</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white text-2xl font-bold">{caseStudyCount}</p>
              <p className="text-white/50 text-sm">Case Studies</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-white text-2xl font-bold">{publishedCount}</p>
              <p className="text-white/50 text-sm">Published</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'loop' as const, label: 'The Loop' },
              { id: 'sequence' as const, label: 'Follow-Up Sequence' },
              { id: 'builder' as const, label: 'Case Study Builder' },
              { id: 'library' as const, label: 'Proof Library' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'loop' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* The Proof & Price Loop Visual */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-white font-semibold text-center mb-8">The Proof & Price Loop</h3>
                <div className="grid sm:grid-cols-4 gap-4">
                  {[
                    { step: '1', title: 'Get Proof', description: 'Deliver results. Document everything. Collect testimonials.', icon: '📸' },
                    { step: '2', title: 'Get Paid', description: 'Use proof to justify premium pricing. Close higher-value deals.', icon: '💰' },
                    { step: '3', title: 'Get More Proof', description: 'Higher-ticket clients = bigger results = better proof.', icon: '📈' },
                    { step: '4', title: 'Get Paid More', description: 'Better proof = higher prices = better clients. The flywheel compounds.', icon: '🚀' },
                  ].map((item, i) => (
                    <div key={item.step} className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-white/50 text-xs">{item.description}</p>
                      {i < 3 && <div className="hidden sm:block text-emerald-400/40 text-2xl mt-3">→</div>}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                    <span className="text-emerald-400 text-sm font-medium">🔄 The loop compounds forever</span>
                  </div>
                </div>
              </div>

              {/* 10X Pricing Reference */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-white font-semibold mb-6">The 10X Pricing Rule</h3>
                <p className="text-white/50 text-sm mb-6">At this price point, can your customer get a 10X return on investment?</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { price: '$19', product: 'PDF / Template', value: '$190 value' },
                    { price: '$99', product: 'Online Course', value: '$990 value' },
                    { price: '$499', product: 'Full Curriculum', value: '$4,990 value' },
                    { price: '$5,000', product: 'Done-For-You', value: '$50,000 value' },
                    { price: '$20,000', product: 'Consulting', value: '$200,000 value' },
                  ].map(tier => (
                    <div key={tier.price} className="flex items-center gap-4 p-3 bg-black/30 rounded-xl">
                      <span className="text-emerald-400 font-bold text-lg min-w-[80px]">{tier.price}</span>
                      <div>
                        <p className="text-white text-sm">{tier.product}</p>
                        <p className="text-white/40 text-xs">→ {tier.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sequence' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-white font-semibold mb-2">Automated Follow-Up Sequence</h3>
              <p className="text-white/50 text-sm mb-8">Copy these templates. Set them up in your email tool. Proof collection happens on autopilot.</p>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-8 bottom-4 w-px bg-white/10" />
                
                <div className="space-y-6">
                  {followUpSequence.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                          index <= 2 ? 'bg-teal-500/20 text-teal-400' :
                          'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          D{item.day}
                        </div>
                      </div>
                      <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-4">
                        <h4 className="text-white font-medium text-sm mb-1">{item.action}</h4>
                        <div className="bg-black/40 rounded-lg p-3 mt-2">
                          <p className="text-white/50 text-sm font-mono whitespace-pre-wrap">{item.template}</p>
                        </div>
                        <button className="text-emerald-400 text-xs mt-2 hover:text-emerald-300 transition-colors">
                          Copy template →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'builder' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-white font-semibold mb-2">Case Study Builder</h3>
              <p className="text-white/50 text-sm mb-8">Fill in each section to create a compelling case study. Problem → Process → Result.</p>
              
              <div className="space-y-6">
                {caseStudyTemplate.sections.map((section, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-400 text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                      <h4 className="text-white font-medium text-sm">{section.name}</h4>
                    </div>
                    <p className="text-white/40 text-xs mb-2">{section.prompt}</p>
                    <textarea
                      value={caseStudyAnswers[section.name] || ''}
                      onChange={(e) => setCaseStudyAnswers({ ...caseStudyAnswers, [section.name]: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 min-h-[80px] text-sm resize-none"
                      placeholder={`Write ${section.name.toLowerCase()} here...`}
                    />
                  </div>
                ))}

                <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm">
                  Save Case Study
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Proof Library</h3>
                <button
                  onClick={() => setShowAddProof(!showAddProof)}
                  className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                >
                  + Add Proof
                </button>
              </div>

              {showAddProof && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                      <option value="testimonial" className="bg-black">Testimonial</option>
                      <option value="case-study" className="bg-black">Case Study</option>
                      <option value="metric" className="bg-black">Metric</option>
                      <option value="endorsement" className="bg-black">Endorsement</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Client name"
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 text-sm"
                    />
                  </div>
                  <textarea
                    placeholder="Proof content..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 min-h-[100px] text-sm resize-none"
                  />
                  <button className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                    Save
                  </button>
                </motion.div>
              )}

              {proofItems.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-white/40 text-sm">{item.client}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.type === 'testimonial' ? 'bg-purple-500/20 text-purple-400' :
                        item.type === 'case-study' ? 'bg-blue-500/20 text-blue-400' :
                        item.type === 'metric' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">{item.content}</p>
                  <p className="text-white/30 text-xs mt-3">{item.date}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Bottom Nav */}
          <div className="mt-8 flex items-center justify-between">
            <Link href="/playbook/productize" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              ← Productize
            </Link>
            <Link
              href="/playbook/scale"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Next: Scale →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
