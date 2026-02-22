'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { SystemsFlowDiagram, ModuleHeader } from '@/components/playbook/visuals';

interface SystemStep {
  title: string;
  description: string;
  template: string;
  automationTip: string;
}

interface BusinessSystem {
  id: string;
  number: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  status: 'not-started' | 'building' | 'operational';
  steps: SystemStep[];
}

const businessSystems: BusinessSystem[] = [
  {
    id: 'marketing',
    number: '01',
    icon: '📢',
    name: 'Marketing',
    tagline: 'Assets that work 24/7',
    description: 'Videos, podcasts, articles, presentations — create once, distribute forever. Your marketing should work while you sleep.',
    status: 'not-started',
    steps: [
      { title: 'Define your content pillars', description: 'Pick 3-5 topics you\'ll talk about repeatedly. Every piece of content should point out a problem your audience has.', template: '1. [Problem topic]\n2. [Process topic]\n3. [Proof/results topic]\n4. [Industry insight topic]\n5. [Personal story topic]', automationTip: 'Use a content calendar tool. Batch-create a week of content in one sitting.' },
      { title: 'Build your content engine', description: 'Create one long-form piece per week. Slice it into 5-10 micro-pieces for social. Apply the TRAIN visual system.', template: 'Weekly: 1 long-form piece (blog, video, podcast)\nDaily: 1-2 micro-pieces (tweets, posts, stories)\nFormat: Problem → Insight → Solution → CTA', automationTip: 'Record yourself once. Repurpose into blog, tweets, carousel, short video, and email.' },
      { title: 'Apply the 80/20 Reciprocity rule', description: '80% of content adds value (teach, share, help). 20% asks for value (sell, promote, launch).', template: 'Mon: Value post\nTue: Value post\nWed: Value post\nThu: Value post\nFri: Promotional post\nSat: Behind-the-scenes\nSun: Reflection/story', automationTip: 'Schedule a full week of posts every Sunday evening. Use scheduling tools.' },
    ],
  },
  {
    id: 'qualifying',
    number: '02',
    icon: '🎯',
    name: 'Qualifying',
    tagline: 'Position as the specific solution',
    description: 'Position as the solution to a specific problem. What it is + who it\'s for drives qualified traffic. Stop attracting everyone; start attracting the right people.',
    status: 'not-started',
    steps: [
      { title: 'Define your qualifying statement', description: 'Complete: "I help [specific person] achieve [specific result] in [specific timeframe] using [your method]."', template: 'I help _____________ [who]\nachieve ____________ [result]\nin _________________ [timeframe]\nusing ______________ [method/process name]', automationTip: 'Put this statement in your bio, website header, email signature, and every intro call.' },
      { title: 'Create disqualifiers', description: 'Not everyone should work with you. Define who ISN\'T a fit. This actually attracts better clients.', template: 'This is NOT for you if:\n- You need results yesterday (we build for long-term)\n- Your budget is under $[X]\n- You\'re not willing to [commitment]\n- You don\'t have [prerequisite]', automationTip: 'Add disqualifiers to your sales page and intake form. Saves hours of bad-fit calls.' },
      { title: 'Build a qualification funnel', description: 'Content → Landing page → Application form → Qualified leads only. Protect your time.', template: 'Step 1: Content (builds awareness)\nStep 2: Lead magnet (captures interest)\nStep 3: Application form (qualifies)\nStep 4: Call/proposal (closes)', automationTip: 'Use Typeform/Tally for applications. Auto-score responses to prioritize follow-ups.' },
    ],
  },
  {
    id: 'application',
    number: '03',
    icon: '📋',
    name: 'Application',
    tagline: 'Prospects provide before they access',
    description: 'Prospects provide information before they get access to you. Your system protects your most valuable asset: time.',
    status: 'not-started',
    steps: [
      { title: 'Create your application form', description: 'Ask questions that reveal if someone is a good fit BEFORE you spend time on a call.', template: 'Essential questions:\n1. What\'s your current situation?\n2. What result are you looking for?\n3. What have you tried before?\n4. What\'s your timeline?\n5. What\'s your investment budget?\n6. How did you find us?', automationTip: 'Auto-send a confirmation email with next steps when form is submitted.' },
      { title: 'Build automated scoring', description: 'Score applications to prioritize high-value prospects automatically.', template: 'Budget: $5K+ (3 pts) | $2-5K (2 pts) | <$2K (1 pt)\nTimeline: Urgent (3 pts) | 1-3 mo (2 pts) | Exploring (1 pt)\nFit: Perfect (3 pts) | Good (2 pts) | Partial (1 pt)\n\nScore 7+: Priority call\nScore 4-6: Standard follow-up\nScore <4: Resources/waitlist', automationTip: 'Use form logic to auto-route high-score leads to your calendar and low-score to a nurture sequence.' },
      { title: 'Set up calendar booking', description: 'Qualified leads should book directly into your calendar. No back-and-forth emails.', template: 'After qualification:\n- High score → Direct calendar link (30 min)\n- Medium score → Async video (Loom) response\n- Low score → Automated email with resources', automationTip: 'Cal.com or Calendly with conditional routing based on application score.' },
    ],
  },
  {
    id: 'onboarding',
    number: '04',
    icon: '🚀',
    name: 'Onboarding',
    tagline: 'Systematize the start',
    description: 'Story, payment, integrations, hosting, logins — all gathered systematically. A great onboarding replaces hours of emails.',
    status: 'not-started',
    steps: [
      { title: 'Build your onboarding checklist', description: 'Document every piece of information you need from a new client. Create a single form that captures it all.', template: 'Client Onboarding Form:\n□ Brand story & positioning\n□ Brand assets (logo, fonts, colors)\n□ Account access (hosting, domains, tools)\n□ Content/copy inputs\n□ Payment details & contract\n□ Communication preferences\n□ Goals & success metrics', automationTip: 'Create a Notion/Airtable template that auto-generates a project workspace for each new client.' },
      { title: 'Create welcome sequence', description: 'Automated emails that set expectations, provide resources, and build excitement before work begins.', template: 'Day 0: Welcome + onboarding link\nDay 1: "What to expect" guide\nDay 3: Intro to your process\nDay 5: Kickoff call reminder\nDay 7: Project kickoff', automationTip: 'Build this as an email sequence triggered by payment/contract signing.' },
      { title: 'Design your project workspace', description: 'Standardized workspace template that every client gets. Consistent delivery starts here.', template: 'Project Workspace:\n├── Brief & Goals\n├── Brand Assets\n├── Content & Copy\n├── Design Deliverables\n├── Feedback & Revisions\n├── Final Delivery\n└── Testimonial Request', automationTip: 'Template this in your project management tool. One click to create for every new project.' },
    ],
  },
  {
    id: 'work',
    number: '05',
    icon: '⚙️',
    name: 'Work',
    tagline: 'Consistent delivery, every time',
    description: 'Loom recordings, live calls, design handoffs — deliver consistently. SOPs with video walkthroughs ensure quality scales.',
    status: 'not-started',
    steps: [
      { title: 'Document your SOPs', description: 'Record yourself doing every task. Create video walkthroughs with written checklists. This is how you clone yourself.', template: 'For each deliverable:\n1. Record a Loom walkthrough\n2. Write step-by-step checklist\n3. Define quality standards\n4. Set time estimates\n5. Create review checklist', automationTip: 'SOPs should be living documents. Update them every time you find a better way.' },
      { title: 'Build delivery milestones', description: 'Break every project into clear milestones with check-in points. Clients want visibility.', template: 'Phase 1: Discovery (Week 1)\n  → Deliverable: Strategy document\nPhase 2: Design (Week 2-3)\n  → Deliverable: Design mockups\nPhase 3: Build (Week 4-5)\n  → Deliverable: Working prototype\nPhase 4: Launch (Week 6)\n  → Deliverable: Live product', automationTip: 'Auto-send milestone updates to clients. No manual status emails needed.' },
      { title: 'Create feedback loops', description: 'Structured feedback requests at each milestone. Don\'t ask "what do you think?" — ask specific questions.', template: 'Feedback template:\n1. Does this align with your vision? (1-5)\n2. What\'s working well?\n3. What needs adjustment?\n4. Any blockers or concerns?\n5. Ready to proceed to next phase?', automationTip: 'Use a standard feedback form for every milestone. Collect structured data, not rambling emails.' },
    ],
  },
  {
    id: 'testimonials',
    number: '06',
    icon: '⭐',
    name: 'Testimonials',
    tagline: 'Proof on autopilot',
    description: 'Get feedback systematically. Don\'t hope for testimonials — engineer them into your process.',
    status: 'not-started',
    steps: [
      { title: 'Build your testimonial request system', description: 'Send a request within 48 hours of project completion. Strike while the satisfaction is highest.', template: 'Testimonial questions:\n1. What was the situation before we worked together?\n2. What specific results did you achieve?\n3. What was the experience like working with us?\n4. Who would you recommend this for?\n5. Anything else you\'d like to share?', automationTip: 'Auto-trigger testimonial request 48 hours after final delivery. Use Google Forms, Typeform, or VideoAsk.' },
      { title: 'Collect multiple formats', description: 'Written, video, screenshots, metrics. Different formats serve different purposes in your marketing.', template: 'Collect:\n□ Written testimonial (Typeform)\n□ Video testimonial (VideoAsk/Loom)\n□ Screenshot of results (metrics)\n□ Before/after comparison\n□ Permission to use their name/brand', automationTip: 'Offer a small incentive for video testimonials — they convert 3x better than text.' },
      { title: 'Organize and deploy proof', description: 'Tag testimonials by service, result type, and industry. Deploy them strategically across marketing.', template: 'Proof database tags:\n- Service type\n- Result achieved\n- Industry\n- Client size\n- Format (text/video/metric)\n\nDeploy to:\n- Website testimonials section\n- Social proof in email sequences\n- Sales page case studies\n- Social media content', automationTip: 'Build a proof library in Notion/Airtable. Pull from it whenever creating new marketing material.' },
    ],
  },
  {
    id: 'loop',
    number: '07',
    icon: '🔄',
    name: 'Loop',
    tagline: 'The flywheel never stops',
    description: 'Feed testimonials back into marketing. New proof → new content → new leads → new clients → new proof. The compound effect.',
    status: 'not-started',
    steps: [
      { title: 'Connect testimonials to marketing', description: 'Every new testimonial becomes a marketing asset. Case study post, social proof, email content.', template: 'New testimonial → Create:\n1. Social media post (quote + result)\n2. Case study (full story)\n3. Email to list (social proof)\n4. Website update\n5. Sales deck addition', automationTip: 'Create a workflow: new testimonial triggers content creation task.' },
      { title: 'Build referral mechanics', description: 'Happy clients are your best marketing channel. Make it easy and rewarding to refer.', template: 'Referral system:\n1. Ask at testimonial stage\n2. Provide shareable link/asset\n3. Offer mutual value (discount, bonus)\n4. Follow up on referrals within 24h\n5. Thank the referrer publicly', automationTip: 'Send a referral request 2 weeks after testimonial collection. Include a simple link they can forward.' },
      { title: 'Measure and optimize the loop', description: 'Track the full cycle: marketing → lead → client → proof → marketing. Find the bottleneck and fix it.', template: 'Loop metrics:\n- Marketing: Views/reach per week\n- Qualifying: Lead quality score\n- Application: App-to-call rate\n- Onboarding: Time to kickoff\n- Work: Delivery satisfaction (1-5)\n- Testimonials: Collection rate\n- Loop: Referral rate', automationTip: 'Build a simple dashboard tracking each stage of the loop. The weakest link determines your growth rate.' },
    ],
  },
];

export default function SystemizePage() {
  const [systems, setSystems] = useState(businessSystems);
  const [activeSystem, setActiveSystem] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const operationalCount = systems.filter(s => s.status === 'operational').length;
  const buildingCount = systems.filter(s => s.status === 'building').length;

  const updateStatus = (id: string, status: BusinessSystem['status']) => {
    setSystems(systems.map(s => s.id === id ? { ...s, status } : s));
  };

  const selectedSystem = systems.find(s => s.id === activeSystem);

  return (
    <section className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <ModuleHeader
            tag="SYSTEMIZE"
            title="7 Business Systems"
            subtitle="Build more systems, do less work, generate better results. Each system handles a stage of your business flywheel."
          />

          {/* Visual Device: FLOW — 7 Systems Flywheel */}
          <div className="mb-12">
            <SystemsFlowDiagram />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-white/70 text-sm">{operationalCount} Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-white/70 text-sm">{buildingCount} Building</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <span className="text-white/70 text-sm">{7 - operationalCount - buildingCount} Not Started</span>
            </div>
          </div>

          {/* Systems Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {systems.slice(0, 4).map((system, index) => (
              <motion.button
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSystem(activeSystem === system.id ? null : system.id)}
                className={`text-left bg-white/5 border rounded-2xl p-5 transition-all ${
                  activeSystem === system.id ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{system.icon}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    system.status === 'operational' ? 'bg-emerald-500' :
                    system.status === 'building' ? 'bg-yellow-500' : 'bg-white/20'
                  }`} />
                </div>
                <p className="text-white/30 text-xs font-mono mb-1">{system.number}</p>
                <h3 className="text-white font-semibold text-sm">{system.name}</h3>
                <p className="text-white/40 text-xs mt-1">{system.tagline}</p>
              </motion.button>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {systems.slice(4).map((system, index) => (
              <motion.button
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 4) * 0.05 }}
                onClick={() => setActiveSystem(activeSystem === system.id ? null : system.id)}
                className={`text-left bg-white/5 border rounded-2xl p-5 transition-all ${
                  activeSystem === system.id ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{system.icon}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    system.status === 'operational' ? 'bg-emerald-500' :
                    system.status === 'building' ? 'bg-yellow-500' : 'bg-white/20'
                  }`} />
                </div>
                <p className="text-white/30 text-xs font-mono mb-1">{system.number}</p>
                <h3 className="text-white font-semibold text-sm">{system.name}</h3>
                <p className="text-white/40 text-xs mt-1">{system.tagline}</p>
              </motion.button>
            ))}
          </div>

          {/* System Detail */}
          <AnimatePresence>
            {selectedSystem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{selectedSystem.icon}</span>
                      <h2 className="text-2xl font-bold text-white">{selectedSystem.name}</h2>
                    </div>
                    <p className="text-white/60">{selectedSystem.description}</p>
                  </div>
                  <select
                    value={selectedSystem.status}
                    onChange={(e) => updateStatus(selectedSystem.id, e.target.value as BusinessSystem['status'])}
                    className={`text-xs px-3 py-1.5 rounded-full border focus:outline-none ${
                      selectedSystem.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      selectedSystem.status === 'building' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-white/5 text-white/50 border-white/10'
                    }`}
                  >
                    <option value="not-started" className="bg-black">Not Started</option>
                    <option value="building" className="bg-black">Building</option>
                    <option value="operational" className="bg-black">Operational</option>
                  </select>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {selectedSystem.steps.map((step, index) => (
                    <div key={index} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedStep(expandedStep === `${selectedSystem.id}-${index}` ? null : `${selectedSystem.id}-${index}`)}
                        className="w-full text-left p-5 flex items-center gap-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm">{step.title}</h3>
                          <p className="text-white/40 text-xs mt-0.5">{step.description}</p>
                        </div>
                        <svg className={`w-5 h-5 text-white/40 transition-transform ${expandedStep === `${selectedSystem.id}-${index}` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedStep === `${selectedSystem.id}-${index}` && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="px-5 pb-5 space-y-4"
                        >
                          {/* Template */}
                          <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                            <h4 className="text-emerald-400 text-xs font-medium uppercase mb-2">Template</h4>
                            <pre className="text-white/60 text-sm whitespace-pre-wrap font-mono">{step.template}</pre>
                          </div>
                          {/* Automation Tip */}
                          <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-4">
                            <h4 className="text-teal-400 text-xs font-medium uppercase mb-2">⚡ Automation Tip</h4>
                            <p className="text-white/60 text-sm">{step.automationTip}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedSystem && (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-white/40">Select a system above to see templates, steps, and automation tips.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
