'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  category: string;
  question: string;
  options: { label: string; value: number; description: string }[];
}

const questions: Question[] = [
  // Mindset Questions
  {
    id: 'mindset-1',
    category: 'Mindset',
    question: 'How do you view risk in your career?',
    options: [
      { label: 'I prefer stability and a steady paycheck', value: 1, description: 'Safety-first approach' },
      { label: 'I take calculated risks but keep a safety net', value: 2, description: 'Balanced approach' },
      { label: 'I actively bet on myself and invest in my growth', value: 3, description: 'Entrepreneurial mindset' },
      { label: 'I trade under my own name and own my outcomes fully', value: 4, description: 'Full ownership' },
    ],
  },
  {
    id: 'mindset-2',
    category: 'Mindset',
    question: 'What\'s your relationship with failure?',
    options: [
      { label: 'I avoid failure at all costs — it feels devastating', value: 1, description: 'Failure = identity threat' },
      { label: 'I understand failure is part of learning but still dread it', value: 2, description: 'Intellectual acceptance' },
      { label: 'I see failure as feedback and iterate quickly', value: 3, description: 'Growth mindset' },
      { label: 'I fail in public, share lessons, and it fuels my reputation', value: 4, description: 'Anti-fragile' },
    ],
  },
  // Skill Questions
  {
    id: 'skill-1',
    category: 'Skill',
    question: 'How would you describe your core skill level?',
    options: [
      { label: 'I\'m still figuring out what I\'m good at', value: 1, description: 'Exploration phase' },
      { label: 'I have a skill but I\'m not being paid what it\'s worth', value: 2, description: 'Undervalued skill' },
      { label: 'Clients pay me well because of a specific expertise', value: 3, description: 'Recognized expert' },
      { label: 'I\'m known in my space — people seek me out specifically', value: 4, description: 'Sought-after authority' },
    ],
  },
  {
    id: 'skill-2',
    category: 'Skill',
    question: 'How do you learn and develop skills?',
    options: [
      { label: 'I consume courses/content but rarely apply what I learn', value: 1, description: 'Information collector' },
      { label: 'I learn on the job but don\'t have a deliberate practice', value: 2, description: 'Passive learning' },
      { label: 'I get paid to learn — client work pushes my skill forward', value: 3, description: 'Applied learning' },
      { label: 'I teach what I learn — building in public compounds my expertise', value: 4, description: 'Learn by teaching' },
    ],
  },
  // Process Questions
  {
    id: 'process-1',
    category: 'Process',
    question: 'Do you have a repeatable process for delivering results?',
    options: [
      { label: 'Every project is different — I figure it out each time', value: 1, description: 'Ad-hoc delivery' },
      { label: 'I have rough steps but nothing documented or templated', value: 2, description: 'Mental framework' },
      { label: 'I have a documented process that I follow consistently', value: 3, description: 'Standardized process' },
      { label: 'My process is a named framework that clients know and trust', value: 4, description: 'Branded methodology' },
    ],
  },
  {
    id: 'process-2',
    category: 'Process',
    question: 'Can you articulate the problem you solve as clearly as you solve it?',
    options: [
      { label: 'I struggle to explain what I do concisely', value: 1, description: 'Unclear positioning' },
      { label: 'I can explain it but it doesn\'t resonate consistently', value: 2, description: 'Weak messaging' },
      { label: 'I speak in their problems and they understand immediately', value: 3, description: 'Problem-fluent' },
      { label: 'My content makes people feel seen — they DM me saying "that\'s exactly my situation"', value: 4, description: 'Magnetic messaging' },
    ],
  },
  // Reputation Questions
  {
    id: 'reputation-1',
    category: 'Reputation',
    question: 'What does your online presence look like?',
    options: [
      { label: 'Minimal — I don\'t post or share my work consistently', value: 1, description: 'Invisible' },
      { label: 'I post occasionally but don\'t have a real following', value: 2, description: 'Inconsistent' },
      { label: 'I have an engaged audience and post content regularly', value: 3, description: 'Visible & consistent' },
      { label: 'My reputation precedes me — inbound leads come from my content', value: 4, description: 'Magnetic brand' },
    ],
  },
  {
    id: 'reputation-2',
    category: 'Reputation',
    question: 'How much social proof do you have?',
    options: [
      { label: 'No testimonials, case studies, or public proof', value: 1, description: 'Zero proof' },
      { label: 'A few testimonials but nothing systematic', value: 2, description: 'Scattered proof' },
      { label: 'I collect testimonials and have documented case studies', value: 3, description: 'Organized proof' },
      { label: 'Proof feeds my marketing — it\'s an automated flywheel', value: 4, description: 'Proof machine' },
    ],
  },
  // Product Questions
  {
    id: 'product-1',
    category: 'Product',
    question: 'Do you have a product or productized service?',
    options: [
      { label: 'No — I sell custom work or hourly time', value: 1, description: 'Pure service' },
      { label: 'I\'m thinking about it but haven\'t built anything yet', value: 2, description: 'Idea stage' },
      { label: 'I have a productized service with defined scope and pricing', value: 3, description: 'Productized' },
      { label: 'I sell digital products/courses that generate revenue without my direct involvement', value: 4, description: 'Product-led' },
    ],
  },
  {
    id: 'product-2',
    category: 'Product',
    question: 'What percentage of your income is passive or semi-passive?',
    options: [
      { label: '0% — all active, all hours-for-dollars', value: 1, description: 'Fully active' },
      { label: 'Under 20% — mostly trading time', value: 2, description: 'Mostly active' },
      { label: '20-50% — a real mix of active and leveraged', value: 3, description: 'Hybrid model' },
      { label: 'Over 50% — products and systems do most of the work', value: 4, description: 'Leveraged' },
    ],
  },
  // Authority Questions
  {
    id: 'authority-1',
    category: 'Authority',
    question: 'Do people pay a premium because of who you are?',
    options: [
      { label: 'No — I compete on price like everyone else', value: 1, description: 'Commodity pricing' },
      { label: 'Sometimes — some clients value me, others price-shop', value: 2, description: 'Mixed signals' },
      { label: 'Yes — my name/brand commands higher rates', value: 3, description: 'Premium positioning' },
      { label: 'I set the market rate — my pricing influences the category', value: 4, description: 'Market leader' },
    ],
  },
  {
    id: 'authority-2',
    category: 'Authority',
    question: 'What does your business ecosystem look like?',
    options: [
      { label: 'Just me doing client work with no leverage', value: 1, description: 'Solo operator' },
      { label: 'Me plus some freelancers or a small team', value: 2, description: 'Small operation' },
      { label: 'Multiple revenue streams: service + product + content', value: 3, description: 'Diversified' },
      { label: 'A full ecosystem: products, content, community, consulting — all compounding', value: 4, description: 'Compound machine' },
    ],
  },
];

const stageDescriptions: Record<string, { range: string; title: string; description: string; color: string }> = {
  'Mindset': { range: '12-18', title: 'Build Mindset', description: 'You\'re at the foundation. Focus on taking responsibility, calculating risk, and committing to building under your own name.', color: 'from-red-500 to-orange-500' },
  'Skill': { range: '19-24', title: 'Build Skill', description: 'Time to invest in your craft. Get paid to learn, build in public, and develop expertise that commands attention.', color: 'from-orange-500 to-yellow-500' },
  'Process': { range: '25-30', title: 'Build Process', description: 'Package your skills into a repeatable system. Name your framework, document your methodology, and prove the problem.', color: 'from-yellow-500 to-emerald-500' },
  'Reputation': { range: '31-36', title: 'Build Reputation', description: 'Time to be prolific. Content, consistency, and proof will build your moat. Escape competition through authenticity.', color: 'from-emerald-500 to-teal-500' },
  'Product': { range: '37-42', title: 'Build Product', description: 'Turn your proven process into a product. Move from service (work without process) to product (process without work).', color: 'from-teal-500 to-cyan-500' },
  'Authority': { range: '43-48', title: 'Build Authority', description: 'You\'re compounding. Focus on ecosystem building, strategic relationships, and creating more value than you extract.', color: 'from-cyan-500 to-blue-500' },
};

function getStage(score: number): string {
  if (score <= 18) return 'Mindset';
  if (score <= 24) return 'Skill';
  if (score <= 30) return 'Process';
  if (score <= 36) return 'Reputation';
  if (score <= 42) return 'Product';
  return 'Authority';
}

function getCategoryScore(answers: Record<string, number>, category: string): number {
  const categoryQuestions = questions.filter(q => q.category === category);
  return categoryQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
}

export default function DiagnosePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    businessType: '',
    monthlyRevenue: '',
    burnRate: '',
    primaryGoal: '',
  });
  const [showIntro, setShowIntro] = useState(true);
  const [showBusinessForm, setShowBusinessForm] = useState(false);

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setShowBusinessForm(true);
    }
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBusinessForm(false);
    setShowResults(true);
  };

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const stage = getStage(totalScore);
  const stageInfo = stageDescriptions[stage];
  const categories = ['Mindset', 'Skill', 'Process', 'Reputation', 'Product', 'Authority'];

  // Intro Screen
  if (showIntro) {
    return (
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-black to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <span className="text-3xl">🔍</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Diagnose Your Stage
            </h1>
            <p className="text-white/60 text-lg mb-8">
              Answer 12 questions to discover where you are on the journey from 
              service provider to product builder. Based on the 6-stage framework.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 font-bold text-2xl">12</p>
                <p className="text-white/50 text-sm">Questions</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 font-bold text-2xl">5</p>
                <p className="text-white/50 text-sm">Minutes</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 font-bold text-2xl">6</p>
                <p className="text-white/50 text-sm">Stages</p>
              </div>
            </div>
            <button
              onClick={() => setShowIntro(false)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Start Assessment →
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  // Business Info Form
  if (showBusinessForm) {
    return (
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-black to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Almost there!</h2>
            <p className="text-white/60 mb-8 text-center">Tell us about your business so we can personalize your action plan.</p>
            
            <form onSubmit={handleBusinessSubmit} className="space-y-6">
              <div>
                <label className="text-white/70 text-sm block mb-2">Your Name</label>
                <input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-2">Business Type</label>
                <select
                  value={businessInfo.businessType}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                  required
                >
                  <option value="" className="bg-black">Select...</option>
                  <option value="freelancer" className="bg-black">Freelancer</option>
                  <option value="consultant" className="bg-black">Consultant</option>
                  <option value="agency" className="bg-black">Agency Owner</option>
                  <option value="coach" className="bg-black">Coach / Educator</option>
                  <option value="saas" className="bg-black">SaaS / Product Builder</option>
                  <option value="other" className="bg-black">Other</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-2">Monthly Revenue</label>
                <select
                  value={businessInfo.monthlyRevenue}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, monthlyRevenue: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                  required
                >
                  <option value="" className="bg-black">Select...</option>
                  <option value="0-1k" className="bg-black">$0 - $1,000</option>
                  <option value="1k-5k" className="bg-black">$1,000 - $5,000</option>
                  <option value="5k-10k" className="bg-black">$5,000 - $10,000</option>
                  <option value="10k-25k" className="bg-black">$10,000 - $25,000</option>
                  <option value="25k-50k" className="bg-black">$25,000 - $50,000</option>
                  <option value="50k+" className="bg-black">$50,000+</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-2">Monthly Burn Rate (expenses)</label>
                <select
                  value={businessInfo.burnRate}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, burnRate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                  required
                >
                  <option value="" className="bg-black">Select...</option>
                  <option value="0-2k" className="bg-black">Under $2,000</option>
                  <option value="2k-5k" className="bg-black">$2,000 - $5,000</option>
                  <option value="5k-10k" className="bg-black">$5,000 - $10,000</option>
                  <option value="10k-20k" className="bg-black">$10,000 - $20,000</option>
                  <option value="20k+" className="bg-black">$20,000+</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-2">Primary Goal</label>
                <select
                  value={businessInfo.primaryGoal}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, primaryGoal: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                  required
                >
                  <option value="" className="bg-black">Select...</option>
                  <option value="escape-job" className="bg-black">Leave my job and go full-time</option>
                  <option value="increase-revenue" className="bg-black">Increase revenue significantly</option>
                  <option value="productize" className="bg-black">Productize my services</option>
                  <option value="build-audience" className="bg-black">Build an audience and reputation</option>
                  <option value="scale" className="bg-black">Scale without trading more time</option>
                  <option value="authority" className="bg-black">Become the go-to authority in my space</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                See My Results →
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    );
  }

  // Results Screen
  if (showResults) {
    return (
      <section className="min-h-screen py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`w-24 h-24 bg-gradient-to-br ${stageInfo.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}
              >
                <span className="text-white font-bold text-3xl">{categories.indexOf(stage) + 1}</span>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {businessInfo.name ? `${businessInfo.name}, you're` : 'You\'re'} at Stage {categories.indexOf(stage) + 1}
              </h1>
              <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stageInfo.color}`}>
                {stageInfo.title}
              </h2>
              <p className="text-white/60 mt-4 max-w-xl mx-auto">{stageInfo.description}</p>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="text-white font-semibold mb-6">Score Breakdown</h3>
              <div className="space-y-4">
                {categories.map((cat) => {
                  const catScore = getCategoryScore(answers, cat);
                  const maxScore = 8; // 2 questions x 4 max
                  const percentage = (catScore / maxScore) * 100;
                  const isCurrentStage = cat === stage;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isCurrentStage ? 'text-emerald-400' : 'text-white/70'}`}>
                          {cat} {isCurrentStage && '← You are here'}
                        </span>
                        <span className="text-white/50 text-sm">{catScore}/{maxScore}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className={`h-2 rounded-full ${isCurrentStage ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-white/30'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/70">Total Score</span>
                <span className="text-white font-bold text-xl">{totalScore}/48</span>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="text-white font-semibold mb-4">Key Insights</h3>
              <div className="space-y-4">
                {/* Strongest area */}
                {(() => {
                  const scores = categories.map(cat => ({ cat, score: getCategoryScore(answers, cat) }));
                  const strongest = scores.reduce((a, b) => a.score > b.score ? a : b);
                  const weakest = scores.reduce((a, b) => a.score < b.score ? a : b);
                  return (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-400 mt-1">↑</span>
                        <div>
                          <p className="text-white text-sm font-medium">Strongest: {strongest.cat}</p>
                          <p className="text-white/50 text-sm">This is your foundation. Leverage it as you build the next stage.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-orange-400 mt-1">↓</span>
                        <div>
                          <p className="text-white text-sm font-medium">Needs work: {weakest.cat}</p>
                          <p className="text-white/50 text-sm">Focus here to unblock your progression to the next stage.</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
                <div className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">→</span>
                  <div>
                    <p className="text-white text-sm font-medium">Next milestone: Build {categories[Math.min(categories.indexOf(stage) + 1, 5)]}</p>
                    <p className="text-white/50 text-sm">Your personalized action plan will guide you there step by step.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href={`/playbook/prescribe?stage=${stage.toLowerCase()}&score=${totalScore}&type=${businessInfo.businessType}&revenue=${businessInfo.monthlyRevenue}&burn=${businessInfo.burnRate}&goal=${businessInfo.primaryGoal}`}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl font-semibold hover:opacity-90 transition-opacity text-center block"
              >
                Get My Action Plan →
              </Link>
              <Link
                href="/playbook/dashboard"
                className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors text-center block"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Question Screen
  const question = questions[currentQuestion];
  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-400 text-sm font-medium">{question.category}</span>
              <span className="text-white/50 text-sm">{currentQuestion + 1} of {totalQuestions}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`w-full text-left bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group ${
                      answers[question.id] === option.value ? 'border-emerald-500/50 bg-emerald-500/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        answers[question.id] === option.value 
                          ? 'border-emerald-500 bg-emerald-500' 
                          : 'border-white/20 group-hover:border-emerald-500/50'
                      }`}>
                        {answers[question.id] === option.value && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{option.label}</p>
                        <p className="text-white/40 text-sm mt-1">{option.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Back Button */}
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="mt-6 text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              ← Previous question
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
