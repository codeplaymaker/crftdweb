'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ProductizationFlow, ModuleHeader, SweetSpotVenn } from '@/components/playbook/visuals';

const pathSteps = [
  {
    id: 'skill',
    number: '01',
    name: 'Skill',
    color: 'from-orange-500 to-yellow-500',
    question: 'What can you do?',
    description: 'You have a skill, but so does everyone else with your skillset. At this stage, you\'re competing on availability and price.',
    framework: 'The value of everyone\'s time starts at zero. Nobody cares what you can do — everybody cares what you can do for them.',
    exercises: [
      { title: 'Skill Inventory', prompt: 'List every skill you have — technical, creative, strategic, interpersonal. Don\'t filter. Include skills you take for granted.', placeholder: 'e.g., Web design, copywriting, video editing, project management, sales...' },
      { title: 'Value Type Identifier', prompt: 'For each skill, which type of value does it create? Psychological (feel better), Monetary (make money), Functional (more competent), or Social (fit in better)?', placeholder: 'e.g., Web design → Monetary (helps them get customers) + Social (makes them look credible)' },
    ],
    pricing: '$50-150/hr or project-based undercutting',
    income: 'Trading time for money. Every hour not worked = $0 earned.',
  },
  {
    id: 'result',
    number: '02',
    name: 'Result',
    color: 'from-yellow-500 to-emerald-500',
    question: 'What result can you deliver?',
    description: 'You\'ve delivered the same result multiple times. You can predict the outcome. Now you sell the result, not the effort.',
    framework: 'Don\'t sell the drill. Don\'t even sell the hole. Sell the shelf that goes in the hole that holds the family photos.',
    exercises: [
      { title: 'Result Definition', prompt: 'What specific, measurable result do your best clients achieve? Think outcomes, not outputs.', placeholder: 'e.g., "3x website conversion rate within 60 days" not "design a new website"' },
      { title: 'Problem Language Builder', prompt: 'Write 10 ways your ideal client describes their problem — in their words, not yours. "Speak in problems."', placeholder: 'e.g., "I\'m spending $5K/mo on ads but my website doesn\'t convert"\n"I feel embarrassed sending people to my website"\n"My competitors look more professional online"' },
    ],
    pricing: '$1,000-5,000 per project (fixed scope, fixed price)',
    income: 'Stabilizing — charging for results, not hours.',
  },
  {
    id: 'specialize',
    number: '03',
    name: 'Specialize',
    color: 'from-emerald-500 to-teal-500',
    question: 'Who do you deliver it for?',
    description: 'You\'ve niched down. You\'re THE person for a specific audience with a specific problem. The narrower you go, the higher you can charge.',
    framework: 'The riches are in the niches. When you\'re for everyone, you\'re for no one. Specificity creates premium positioning.',
    exercises: [
      { title: 'Niche Definition', prompt: 'Complete: "I help [specific person] in [specific industry] who is struggling with [specific problem]."', placeholder: 'e.g., "I help SaaS founders in the $1-10M ARR range who are struggling with conversion rate optimization on their marketing sites."' },
      { title: 'Unique Mechanism', prompt: 'What\'s your unique approach or methodology that makes your solution different from everyone else\'s?', placeholder: 'e.g., "The Trust-First Design System — we redesign your site around trust signals and proof points, not just aesthetics."' },
    ],
    pricing: '$5,000-20,000 per engagement',
    income: 'Premium — expertise premium + niche authority.',
  },
  {
    id: 'productize',
    number: '04',
    name: 'Productize',
    color: 'from-teal-500 to-cyan-500',
    question: 'How do you scale it?',
    description: 'Your process is so refined you can package it. Service = work without process. Productized service = work with process. Product = process without work.',
    framework: 'Spend 20% of your time building systems for the 80% of your day. The goal: your process runs without you in it.',
    exercises: [
      { title: 'Productization Ladder', prompt: 'Design your 3-tier offer stack. Each tier should serve a different buyer at a different commitment level.', placeholder: 'Tier 1 (Low-ticket): $19-199 — Templates, guides, tools\nTier 2 (Mid-ticket): $1-5K — Sprints, intensives, productized service\nTier 3 (High-ticket): $5-20K+ — Done-for-you, consulting, retainer' },
      { title: '10X Pricing Test', prompt: 'For each tier: at this price, can your customer realistically get 10X return? If not, the price is too high OR the offer needs more value.', placeholder: 'Tier 1: $99 template → Does it save/make the client $990+?\nTier 2: $3K sprint → Does it generate $30K+ in value?\nTier 3: $15K engagement → Does it produce $150K+ in results?' },
    ],
    pricing: 'Multiple tiers: $19-199 / $1-5K / $5-20K+',
    income: 'Leveraged — income potential detaches from hours worked.',
  },
];

export default function ProductizePage() {
  const [activeStep, setActiveStep] = useState('skill');
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, string>>({});

  const currentStep = pathSteps.find(s => s.id === activeStep) || pathSteps[0];
  const currentIndex = pathSteps.findIndex(s => s.id === activeStep);

  return (
    <section className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <ModuleHeader
            tag="PRODUCTIZE"
            title="Speak in Problems,"
            titleAccent="Solve in Products"
            subtitle="Follow the Productization Path to transform your skills into scalable products. Each stage builds on the last."
          />

          {/* Visual Device: FLOW — Sequential progression */}
          <div className="mb-16">
            <ProductizationFlow />
          </div>

          {/* Visual Device: VENN — Your Sweet Spot */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-16">
            <h3 className="text-white font-semibold text-center mb-2">Find Your Sweet Spot</h3>
            <p className="text-white/40 text-sm text-center mb-4">Your product lives at the intersection of skill, market need, and passion.</p>
            <SweetSpotVenn />
          </div>

          {/* Path Steps Navigation */}
          <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
            {pathSteps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-4">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeStep === step.id
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-xs text-white font-bold`}>
                    {step.number}
                  </span>
                  <span className="font-medium text-sm">{step.name}</span>
                </button>
                {i < pathSteps.length - 1 && (
                  <span className="text-white/20 hidden sm:block">→</span>
                )}
              </div>
            ))}
          </div>

          {/* Current Step Detail */}
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Overview */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-lg">{currentStep.number}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{currentStep.name}</h2>
                  <p className="text-emerald-400 font-medium">{currentStep.question}</p>
                </div>
              </div>
              <p className="text-white/60 mb-6">{currentStep.description}</p>
              
              {/* Framework Quote */}
              <div className="bg-emerald-500/5 border-l-2 border-emerald-500/40 pl-4 py-2">
                <p className="text-white/70 italic text-sm">&ldquo;{currentStep.framework}&rdquo;</p>
              </div>

              {/* Pricing & Income */}
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-black/30 rounded-xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Typical Pricing</p>
                  <p className="text-white font-semibold">{currentStep.pricing}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Income Model</p>
                  <p className="text-white font-semibold text-sm">{currentStep.income}</p>
                </div>
              </div>
            </div>

            {/* Interactive Exercises */}
            <div className="space-y-4 mb-8">
              <h3 className="text-white font-semibold text-lg">Worksheets</h3>
              {currentStep.exercises.map((exercise, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-white font-medium mb-2">{exercise.title}</h4>
                  <p className="text-white/50 text-sm mb-4">{exercise.prompt}</p>
                  <textarea
                    value={worksheetAnswers[`${currentStep.id}-${index}`] || ''}
                    onChange={(e) => setWorksheetAnswers({
                      ...worksheetAnswers,
                      [`${currentStep.id}-${index}`]: e.target.value,
                    })}
                    placeholder={exercise.placeholder}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 min-h-[120px] text-sm resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveStep(pathSteps[Math.max(0, currentIndex - 1)].id)}
                className={`text-white/40 hover:text-white/70 text-sm transition-colors ${currentIndex === 0 ? 'invisible' : ''}`}
              >
                ← {currentIndex > 0 ? pathSteps[currentIndex - 1].name : ''}
              </button>
              {currentIndex < pathSteps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(pathSteps[currentIndex + 1].id)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  Next: {pathSteps[currentIndex + 1].name} →
                </button>
              ) : (
                <Link
                  href="/playbook/prove"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  Next Module: Prove →
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
