'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { saveOffer } from '@/lib/firebase/firestore';

const steps = [
  { id: 1, name: 'Niche', description: 'Define your target market' },
  { id: 2, name: 'Transformation', description: 'What outcome do you deliver?' },
  { id: 3, name: 'Offer Stack', description: 'Build your offer components' },
  { id: 4, name: 'Pricing', description: 'Set your pricing strategy' },
  { id: 5, name: 'Review', description: 'Finalize your offer' },
];

// Pre-built offer templates
const OFFER_TEMPLATES = [
  {
    name: 'Coaching Program',
    niche: 'Business Coaching',
    targetAudience: 'Entrepreneurs and small business owners doing $5K-$30K/month who want to scale to 6-figures',
    transformation: 'Help clients build systems and strategies to 3x their revenue in 90 days without working more hours',
    timeframe: '90 days',
    deliverables: ['12-week group coaching program', 'Weekly live Q&A calls', 'Private community access', 'Personalized action plan'],
    bonuses: ['1:1 strategy session ($500 value)', 'Swipe file library ($997 value)'],
    price: '4,997',
    guarantee: 'Double your investment or we keep working with you for free',
    offerName: 'The Business Accelerator',
  },
  {
    name: 'Agency Service',
    niche: 'Marketing Automation',
    targetAudience: 'Marketing agency owners doing $20K-$100K/month who want to reduce manual work',
    transformation: 'Implement AI-powered automation systems that save 20+ hours per week and increase profit margins by 40%',
    timeframe: '60 days',
    deliverables: ['Full automation audit', 'Custom AI workflow setup', 'Team training', 'Monthly optimization calls'],
    bonuses: ['SOPs & documentation ($1,500 value)', 'Emergency slack support'],
    price: '7,497',
    guarantee: 'Guaranteed 20+ hours saved per week or full refund',
    offerName: 'The Agency Automation System',
  },
  {
    name: 'Course Launch',
    niche: 'Online Course Creation',
    targetAudience: 'Experts and coaches who want to package their knowledge into a scalable digital product',
    transformation: 'Launch your first $50K+ online course in 8 weeks with our proven system',
    timeframe: '8 weeks',
    deliverables: ['Course curriculum design', 'Launch strategy blueprint', 'Sales page templates', 'Email sequence setup'],
    bonuses: ['Webinar funnel template', 'Facebook ads training'],
    price: '2,997',
    guarantee: '30-day money-back guarantee',
    offerName: 'Course Launch Accelerator',
  },
];

export default function NewOfferPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [hasTruthData, setHasTruthData] = useState(false);
  const [formData, setFormData] = useState({
    niche: '',
    targetAudience: '',
    transformation: '',
    timeframe: '',
    deliverables: ['', '', ''],
    bonuses: ['', ''],
    price: '',
    guarantee: '',
    offerName: '',
  });

  // Check for cached Truth Engine data on mount
  useEffect(() => {
    const cachedReport = localStorage.getItem('lastTruthReport');
    if (cachedReport) {
      setHasTruthData(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create an offer');
      return;
    }

    if (!formData.offerName.trim()) {
      setError('Please enter an offer name');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveOffer(user.uid, {
        name: formData.offerName,
        niche: formData.niche,
        targetAudience: formData.targetAudience,
        transformation: formData.transformation,
        timeframe: formData.timeframe,
        price: parseFloat(formData.price.replace(/,/g, '')) || 0,
        guarantee: formData.guarantee,
        deliverables: formData.deliverables.filter(d => d.trim() !== ''),
        bonuses: formData.bonuses.filter(b => b.trim() !== ''),
        status: 'draft',
      });

      router.push('/engine/dashboard/offers');
    } catch (err) {
      console.error('Error saving offer:', err);
      setError('Failed to save offer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    setFormData({ ...formData, deliverables: newDeliverables });
  };

  const addDeliverable = () => {
    setFormData({ ...formData, deliverables: [...formData.deliverables, ''] });
  };

  const updateBonus = (index: number, value: string) => {
    const newBonuses = [...formData.bonuses];
    newBonuses[index] = value;
    setFormData({ ...formData, bonuses: newBonuses });
  };

  const addBonus = () => {
    setFormData({ ...formData, bonuses: [...formData.bonuses, ''] });
  };

  // Apply a template
  const applyTemplate = (template: typeof OFFER_TEMPLATES[0]) => {
    setFormData({
      ...template,
    });
    setShowTemplates(false);
    setCurrentStep(5); // Jump to review
  };

  // AI Auto-Fill from Truth Engine data
  const handleAIAutoFill = async () => {
    const cachedReport = localStorage.getItem('lastTruthReport');
    if (!cachedReport) {
      alert('No Truth Engine report found. Run a niche research first to use AI Auto-Fill.');
      return;
    }

    setAiLoading(true);
    try {
      const report = JSON.parse(cachedReport);
      console.log('Truth Engine report data:', report);
      
      // Call AI to generate intelligent offer suggestions based on the research
      const response = await fetch('/api/engine/offer-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: report.niche || report.query || '',
          targetAudience: report.targetAudience || report.audience || '',
          painPoints: report.painPoints || report.realPainPoints || [],
          opportunities: report.opportunities || [],
          competitiveGaps: report.competitiveGaps || [],
          pricingRange: report.pricingRange || '',
          riskFactors: report.riskFactors || [],
          demandSignals: report.demandSignals || [],
          urgencyFactors: report.urgencyFactors || [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate offer suggestions');
      }

      const aiSuggestions = await response.json();
      
      setFormData(prev => ({
        ...prev,
        niche: aiSuggestions.niche || prev.niche,
        targetAudience: aiSuggestions.targetAudience || prev.targetAudience,
        transformation: aiSuggestions.transformation || prev.transformation,
        timeframe: aiSuggestions.timeframe || prev.timeframe,
        deliverables: aiSuggestions.deliverables?.length > 0 ? aiSuggestions.deliverables : prev.deliverables,
        price: aiSuggestions.price || prev.price,
        guarantee: aiSuggestions.guarantee || prev.guarantee,
        offerName: aiSuggestions.offerName || prev.offerName,
        bonuses: aiSuggestions.bonuses?.length > 0 ? aiSuggestions.bonuses : prev.bonuses,
      }));

    } catch (err) {
      console.error('Error with AI Auto-Fill:', err);
      alert('Failed to generate AI suggestions. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Jump to specific step (non-linear navigation)
  const jumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.niche.trim() !== '' && formData.targetAudience.trim() !== '';
      case 2:
        return formData.transformation.trim() !== '' && formData.timeframe.trim() !== '';
      case 3:
        return formData.deliverables.some(d => d.trim() !== '');
      case 4:
        return formData.price.trim() !== '';
      case 5:
        return formData.offerName.trim() !== '';
      default:
        return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Create New Offer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50"
        >
          Build your high-ticket offer in 5 simple steps.
        </motion.p>
      </div>

      {/* Quick Actions Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-3"
      >
        {hasTruthData && (
          <button
            onClick={handleAIAutoFill}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-xl text-purple-300 hover:border-purple-500/50 transition-all"
          >
            {aiLoading ? (
              <div className="w-4 h-4 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            AI Auto-Fill from Truth Engine
          </button>
        )}
        
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white/70 hover:border-white/40 hover:text-white transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          </svg>
          Use Template
        </button>

        <button
          onClick={() => jumpToStep(5)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white/70 hover:border-white/40 hover:text-white transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Skip to Review
        </button>
      </motion.div>

      {/* Templates Modal */}
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/20 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Choose a Template</h3>
            <button onClick={() => setShowTemplates(false)} className="text-white/50 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid gap-3">
            {OFFER_TEMPLATES.map((template, idx) => (
              <button
                key={idx}
                onClick={() => applyTemplate(template)}
                className="text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-purple-300">{template.name}</h4>
                    <p className="text-sm text-white/50 mt-1">{template.niche}</p>
                  </div>
                  <span className="text-purple-400 font-semibold">${template.price}</span>
                </div>
                <p className="text-xs text-white/40 mt-2 line-clamp-1">{template.transformation}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button 
              onClick={() => jumpToStep(step.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all cursor-pointer hover:scale-110 ${
                currentStep >= step.id
                  ? 'bg-purple-500 text-white hover:bg-purple-400'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
              title={`${step.name}: ${step.description}`}
            >
              {currentStep > step.id ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </button>
            {index < steps.length - 1 && (
              <div className={`w-12 lg:w-24 h-1 mx-2 transition-all ${
                currentStep > step.id ? 'bg-purple-500' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-white/40">
        {steps.map((step) => (
          <button 
            key={step.id} 
            onClick={() => jumpToStep(step.id)}
            className={`hover:text-white transition-colors cursor-pointer ${currentStep === step.id ? 'text-purple-400' : ''}`}
          >
            {step.name}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-8"
      >
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Define Your Niche</h2>
              <p className="text-white/50">Who do you help and what market are you in?</p>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Niche / Market <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                placeholder="e.g., AI Automation for Agencies"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Target Audience <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., Marketing agency owners doing $10K-$50K/month who want to scale without hiring more staff"
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Define the Transformation</h2>
              <p className="text-white/50">What outcome do you help your clients achieve?</p>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Core Transformation <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.transformation}
                onChange={(e) => setFormData({ ...formData, transformation: e.target.value })}
                placeholder="e.g., Help agencies automate client fulfillment and add $30K/month in recurring revenue without hiring more staff"
                rows={4}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
              <p className="text-white/40 text-sm mt-2">Tip: Include the specific result and benefit</p>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Timeframe <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                placeholder="e.g., 90 days"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Build Your Offer Stack</h2>
              <p className="text-white/50">What&apos;s included in your offer?</p>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Core Deliverables <span className="text-red-400">*</span>
              </label>
              <div className="space-y-3">
                {formData.deliverables.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-purple-400 mt-3">{index + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      placeholder={`e.g., ${index === 0 ? '8-week implementation program' : index === 1 ? 'Weekly group coaching calls' : 'Done-for-you templates'}`}
                      className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                ))}
                <button
                  onClick={addDeliverable}
                  className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add another deliverable
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Bonuses (Optional)
              </label>
              <div className="space-y-3">
                {formData.bonuses.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-green-400 mt-3">+</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateBonus(index, e.target.value)}
                      placeholder={`e.g., ${index === 0 ? 'Templates & swipe files ($997 value)' : '1:1 strategy session ($500 value)'}`}
                      className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                ))}
                <button
                  onClick={addBonus}
                  className="text-green-400 text-sm hover:text-green-300 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add another bonus
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Set Your Pricing</h2>
              <p className="text-white/50">How much will you charge for this transformation?</p>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^0-9,]/g, '') })}
                  placeholder="4,997"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pl-8 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="flex gap-2 mt-3">
                {['2,997', '4,997', '7,497', '9,997'].map((price) => (
                  <button
                    key={price}
                    onClick={() => setFormData({ ...formData, price })}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      formData.price === price 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    ${price}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Guarantee
              </label>
              <textarea
                value={formData.guarantee}
                onChange={(e) => setFormData({ ...formData, guarantee: e.target.value })}
                placeholder="e.g., 100% money-back guarantee if you don't see results in 90 days"
                rows={2}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
              <div className="flex gap-2 mt-3 flex-wrap">
                {[
                  '30-day money-back guarantee',
                  'Results or we keep working with you',
                  'Double your investment or refund',
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, guarantee: g })}
                    className="px-3 py-1 rounded-lg text-sm bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Review Your Offer</h2>
              <p className="text-white/50">Give your offer a name and review the details.</p>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Offer Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.offerName}
                onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
                placeholder="e.g., The AI Agency Accelerator"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Offer Preview Card */}
            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                    DRAFT
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{formData.offerName || 'Your Offer'}</h3>
                </div>
                <span className="text-2xl font-bold text-purple-400">${formData.price || '0'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/50">Niche</p>
                  <p className="text-white">{formData.niche || '-'}</p>
                </div>
                <div>
                  <p className="text-white/50">Timeframe</p>
                  <p className="text-white">{formData.timeframe || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-white/50 text-sm mb-1">Target Audience</p>
                <p className="text-white text-sm">{formData.targetAudience || '-'}</p>
              </div>
              
              <div>
                <p className="text-white/50 text-sm mb-1">Transformation</p>
                <p className="text-white text-sm">{formData.transformation || '-'}</p>
              </div>

              {formData.deliverables.some(d => d.trim()) && (
                <div>
                  <p className="text-white/50 text-sm mb-2">Deliverables</p>
                  <ul className="space-y-1">
                    {formData.deliverables.filter(d => d.trim()).map((d, i) => (
                      <li key={i} className="text-white text-sm flex items-start gap-2">
                        <span className="text-purple-400">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.bonuses.some(b => b.trim()) && (
                <div>
                  <p className="text-white/50 text-sm mb-2">Bonuses</p>
                  <ul className="space-y-1">
                    {formData.bonuses.filter(b => b.trim()).map((b, i) => (
                      <li key={i} className="text-green-400 text-sm flex items-start gap-2">
                        <span>+</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.guarantee && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/50 text-sm">Guarantee</p>
                  <p className="text-white text-sm">{formData.guarantee}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving || !isStepValid()}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Create Offer'
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
