'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// Animated counter component
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Hero Section
function TruthHeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Stop Guessing.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
              Start Printing.
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-10 max-w-3xl mx-auto">
            The first Agentic AI that identifies Proven High-Intent Markets, isolates the most in-demand solutions, and reverse-engineers winning competitors to architect your 7-figure offer in seconds.
          </p>

          <Link
            href="#pricing"
            className="inline-block bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Gain Access
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Comparison Table Section
function ComparisonSection() {
  const comparisons = [
    {
      category: 'Market research',
      guesswork: 'Picking niches based on gut feeling or outdated YouTube gurus',
      truth: "The 'Unmet Demand Radar' scans 10,000+ signals to find bleeding neck pain points",
    },
    {
      category: 'Competitor intel',
      guesswork: 'Manually funnel-hacking & guessing their backend pricing',
      truth: 'Competitor X-Ray visualizes exact weaknesses via Radar Charts & pricing models',
    },
    {
      category: 'Offer architecture',
      guesswork: 'Selling commodity inputs (SEO, Ads) that clients treat cheaply',
      truth: 'Solution-Market Fit Generator builds outcome-based offers with data',
    },
    {
      category: 'Sales positioning',
      guesswork: "Me-Too Marketing: 'I help dentists get more leads'",
      truth: 'Competitive Disconnect Hooks: Scripts that destroy incumbents',
    },
    {
      category: 'Objection handling',
      guesswork: "Freezing up when they say 'It's too expensive'",
      truth: 'Pre-Loaded Battle Cards: Scripts to kill top objections before they speak',
    },
    {
      category: 'Speed to market',
      guesswork: 'Analysis Paralysis: 3 weeks to research, 2 weeks to write copy',
      truth: 'Agent Swarms: Research, Strategy, and Copy generated in minutes',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            TRUTH VS GUESSWORK
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Why The Truth Engine gives you leverage
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-left text-white/50 font-medium"></th>
                <th className="py-4 px-4 text-left text-red-400 font-medium">GUESSWORK</th>
                <th className="py-4 px-4 text-left text-purple-400 font-medium">TRUTH ENGINE</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <motion.tr
                  key={row.category}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5"
                >
                  <td className="py-5 px-4 text-white font-medium">{row.category}</td>
                  <td className="py-5 px-4 text-white/50 bg-red-500/5">{row.guesswork}</td>
                  <td className="py-5 px-4 text-white/80 bg-purple-500/5">{row.truth}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// AI Features Section
function AIFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: 'Demand Radar',
      description: "Scan 10,000+ signals to find 'bleeding neck' pain points and unmet market demand before your competitors",
    },
    {
      title: 'Competitor X-Ray',
      description: 'Visualize exact competitor weaknesses via Radar Charts, pricing models, and positioning gaps',
    },
    {
      title: 'Market Viability',
      description: 'Get a data-backed go/no-go recommendation with viability scoring and market size estimates',
    },
    {
      title: 'Offer Builder',
      description: 'Solution-Market Fit Generator builds outcome-based offers with pricing and positioning',
    },
    {
      title: 'Battle Cards',
      description: 'Pre-loaded objection handling scripts to kill top objections before prospects even speak them',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            AI research that
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400"> finds the truth</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Feature Tabs */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.button
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveFeature(index)}
                className={`w-full text-left p-6 rounded-xl transition-all ${
                  activeFeature === index
                    ? 'bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                <h3 className={`text-xl font-semibold mb-2 ${
                  activeFeature === index ? 'text-white' : 'text-white/70'
                }`}>
                  {feature.title}
                </h3>
                <p className={activeFeature === index ? 'text-white/70' : 'text-white/40'}>
                  {feature.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Stats Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <p className="text-white/40 text-sm uppercase tracking-wider mb-4">Scanning 10,000+ Signals</p>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
                  initial={{ width: '0%' }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Pain Points', value: 847 },
                { label: 'Demand Signals', value: 2400, suffix: '' },
                { label: 'Market Gaps', value: 156 },
                { label: 'Opportunities', value: 23 },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Enter Your Niche',
      description: 'Tell the AI what market, industry, or business idea you want to explore. Be as specific or broad as you like.',
    },
    {
      number: '02',
      title: 'AI Deep Research',
      description: 'Our agentic AI scans thousands of data points—competitors, pricing, demand signals, market gaps, and winning strategies.',
    },
    {
      number: '03',
      title: 'Get Your Truth Report',
      description: 'Receive a comprehensive analysis with market viability score, competitor breakdown, and actionable next steps.',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            SIMPLE PROCESS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How The Truth Engine Works
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            From idea to actionable intelligence in minutes, not weeks.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-6xl font-bold text-purple-500/20 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-white/50">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 right-0 w-full h-px bg-gradient-to-r from-purple-500/50 to-transparent transform translate-x-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Report Examples Section
function ReportExamplesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            REAL OUTPUT EXAMPLES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            What Your Reports Look Like
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Not vague AI summaries. Actionable intelligence with real data, real numbers, and real recommendations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Report Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Competitive Landscape Report</h3>
              <p className="text-white/50">Full market analysis with growth projections</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-900/20 to-transparent">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-white/40 block">Market Size</span>
                  <span className="text-white font-semibold">$4.2B</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-white/40 block">Growth Rate</span>
                  <span className="text-white font-semibold">23% YoY</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-white/40 block">Key Players</span>
                  <span className="text-white font-semibold">12 identified</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-white/40 block">Pricing Intel</span>
                  <span className="text-white font-semibold">$2K-$15K</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Report Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Market Viability Score</h3>
              <p className="text-white/50">Data-backed go/no-go recommendation</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-900/20 to-transparent">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-green-400 mb-2">92<span className="text-2xl">/100</span></div>
                <p className="text-white/50">High Viability</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-white/40 block">Pros & Cons</span>
                  <span className="text-white font-semibold">Analyzed</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-white/40 block">Next Steps</span>
                  <span className="text-white font-semibold">5 actions</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: '92/100', label: 'Avg Viability Score' },
            { value: '500+', label: 'Niches Analyzed' },
            { value: '3min', label: 'Time to Report' },
            { value: '47+', label: 'Data Points' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Who Is It For Section
function WhoIsItForSection() {
  const personas = [
    {
      title: 'Agency Owners',
      description: 'Find underserved niches and build irresistible offers that command premium prices.',
    },
    {
      title: 'SaaS Founders',
      description: 'Validate your product idea with real market demand before writing a single line of code.',
    },
    {
      title: 'Course Creators',
      description: 'Discover exactly what your audience is desperate to learn and will pay premium for.',
    },
    {
      title: 'Consultants',
      description: 'Back your recommendations with data and position yourself as the go-to expert.',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            BUILT FOR BUILDERS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Who Is The Truth Engine For?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            If you make money from understanding markets, this is your unfair advantage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{persona.title}</h3>
              <p className="text-white/50">{persona.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 max-w-2xl">
            <p className="text-white/80 text-lg">
              <span className="font-semibold text-purple-400">Bottom Line:</span> If you've ever spent weeks researching a market only to realize it was a dead end, the Truth Engine pays for itself with a single report.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Interactive Demo Section
function InteractiveDemoSection() {
  const [niche, setNiche] = useState('');

  const suggestions = ['fitness coaching', 'AI automation agency', 'SaaS for dentists'];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            TRY IT NOW
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            See The Truth Engine In Action
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Enter any niche or business idea to see a preview of the market intelligence the Truth Engine provides.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Enter a niche or business idea..."
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
              <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Analyze
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-white/40 text-sm">Try:</span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setNiche(suggestion)}
                  className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Bonuses Section
function BonusesSection() {
  const bonuses = [
    {
      title: 'Live AI Architect Workshop',
      value: '$1,997',
      description: "Watch me take the Data from the Truth Engine and transform it into a 7-figure offer live on screen in under 60 minutes. Includes Cook.AI OS 2.0 Priority Seat.",
    },
    {
      title: 'The "Daily Demand Radar"',
      value: '$997',
      description: 'Every morning, the Truth Engine scans for high-probability opportunities and drops a fresh recommendation into your dashboard.',
    },
    {
      title: 'The "Truth-as-a-Service" Model',
      value: '$1,497',
      description: 'Turn Market Intelligence into a $1,000+ per hour Consulting Business. Generate deep-dive reports in minutes that companies pay thousands to see.',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            BONUSES FOR EARLY MOVERS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Included Free for the First 50 Founders
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {bonuses.map((bonus, index) => (
            <motion.div
              key={bonus.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="text-purple-400 text-sm font-semibold mb-2">{bonus.value} VALUE</div>
              <h3 className="text-xl font-semibold text-white mb-3">{bonus.title}</h3>
              <p className="text-white/50 text-sm">{bonus.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-gradient-to-b from-purple-900/30 to-black border border-purple-500/30 rounded-3xl p-8 text-center">
            <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              LIMITED-TIME OFFER
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">Founder's Ticket</h2>
            <div className="text-5xl font-bold text-white mb-2">
              $97<span className="text-lg text-white/50 font-normal">/one-time</span>
            </div>
            <p className="text-white/50 mb-8">30 DAY ACCESS</p>

            <div className="space-y-4 text-left mb-8">
              {[
                { num: '01', text: 'Truth Engine Access', sub: 'Full AI-powered market research.' },
                { num: '02', text: 'Live AI Architect Workshop', sub: 'Transform data into 7-figure offers in 60 minutes.' },
                { num: '03', text: 'Daily Demand Radar', sub: 'Automated market intel delivered every 24 hours.' },
                { num: '04', text: 'Truth-as-a-Service Model', sub: 'Turn intel into $1,000+/hour consulting.' },
              ].map((item) => (
                <div key={item.num} className="flex gap-4">
                  <span className="text-purple-400 font-mono text-sm">{item.num}</span>
                  <div>
                    <p className="text-white font-semibold">{item.text}</p>
                    <p className="text-white/50 text-sm">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Gain Access
            </button>

            <p className="text-white/30 text-sm mt-4">
              Safe & Secure 256-Bit SSL Encrypted Checkout
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    { label: 'RESEARCH PREVIEW', text: 'The competitive engine research is insane' },
    { label: '$2K WIN', text: 'Just closed my first $2k deal using the research' },
    { label: 'PRODUCT PRAISE', text: 'Truth Engine is so good for proposals' },
    { label: '$4K PROOF', text: '$4000 funds deposited from first client' },
    { label: 'SUCCESS STORY', text: 'Got access Friday, closed Monday' },
    { label: '3 DEALS/WEEK', text: '3 deals in one week using Truth Selling' },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            THE EVIDENCE WALL
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Founders Who Stopped Guessing
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Real screenshots. Real results. Real people building with truth.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <span className="text-purple-400 text-xs font-medium tracking-wider uppercase mb-3 block">
                {testimonial.label}
              </span>
              <p className="text-white/80">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Security Section
function SecuritySection() {
  const features = [
    {
      title: 'End-to-End Encryption',
      description: 'Your research data is encrypted at rest and in transit using AES-256 encryption.',
    },
    {
      title: 'Private by Default',
      description: 'Your reports are completely private. Only you can access them unless you choose to share.',
    },
    {
      title: 'No Data Selling',
      description: 'We never sell, share, or use your research data for training. Your intelligence stays yours.',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            ENTERPRISE-GRADE SECURITY
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Your Research Stays Yours
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every insight, every report, every competitive edge you discover stays locked in your vault. Period.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function TruthFinalCTASection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Build on Truth?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Stop wasting time on ideas that don't work. Get the Truth Engine and build your business on real market demand.
          </p>
          <Link
            href="#pricing"
            className="inline-block bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Gain Access
          </Link>
          <p className="text-white/40 text-sm mt-6">
            Includes webinar access • strategy call • 500 credits
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Main Page Component
export default function TruthEnginePage() {
  return (
    <>
      <TruthHeroSection />
      <ComparisonSection />
      <AIFeaturesSection />
      <HowItWorksSection />
      <ReportExamplesSection />
      <WhoIsItForSection />
      <InteractiveDemoSection />
      <BonusesSection />
      <PricingSection />
      <TestimonialsSection />
      <SecuritySection />
      <TruthFinalCTASection />
    </>
  );
}
