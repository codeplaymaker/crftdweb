'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp, Mail, RefreshCw, UserCheck, Handshake, Users } from 'lucide-react';

// ─── Types ───
interface Template {
  id: string;
  label: string;
  subject: string;
  body: string;
}

interface Category {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  templates: Template[];
}

// ─── Template Data ───
const categories: Category[] = [
  {
    id: 'cold-outreach',
    icon: <Mail className="w-5 h-5" />,
    title: 'Cold Outreach',
    description: 'First contact with a business you have identified as a prospect.',
    color: 'from-violet-600/20 to-purple-600/10 border-violet-500/20',
    templates: [
      {
        id: 'cold-1',
        label: 'LinkedIn DM — Honest opener',
        subject: 'N/A (DM)',
        body: `Hi [Name],

I came across [Business Name] and had a look at your site.

[One specific, genuine observation about something that could be improved — e.g. "Your homepage takes 8 seconds to load on mobile" or "There's no clear CTA above the fold"]

I build custom websites for [their industry] businesses that fix exactly this — usually in under two weeks.

Worth a quick chat?

— Obi
CrftdWeb`,
      },
      {
        id: 'cold-2',
        label: 'Cold Email — Problem-first',
        subject: 'Your website — quick thought',
        body: `Hi [Name],

I was looking for [type of business] in [location/niche] and came across [Business Name].

Your [service/product] looks solid, but I noticed your website might be costing you enquiries — [specific issue: slow load, no mobile optimisation, weak CTA, no trust signals, etc.].

I'm Obi, and I run CrftdWeb — we build fast, conversion-focused websites for businesses like yours. We've helped [similar business type] increase leads by [X%] in [timeframe].

I've put together a few quick ideas for your site — would it be useful if I sent them over?

No pitch, just value first.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'cold-3',
        label: 'Cold Email — Compliment + gap',
        subject: "Loved what you're doing at [Business Name]",
        body: `Hi [Name],

I came across [Business Name] — what you're doing in [their niche] is genuinely impressive.

I did notice one thing though: your website doesn't seem to reflect the quality of what you offer. [Specific gap — e.g. "The mobile experience is rough" or "There's no social proof visible to a first-time visitor"]. For a business at your level, that's likely losing you clients who check the site and bounce.

I'm Obi — I run CrftdWeb. We build bespoke, high-performance websites for ambitious businesses. 14-day delivery, custom-coded, no templates.

Happy to do a free 10-min audit of your site if that's useful.

— Obi
crftdweb.com`,
      },
    ],
  },
  {
    id: 'follow-up',
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Follow-Up',
    description: 'Chasing leads who went quiet after initial interest or a quote.',
    color: 'from-sky-600/20 to-blue-600/10 border-sky-500/20',
    templates: [
      {
        id: 'follow-1',
        label: 'Follow-up #1 — Soft nudge (3 days)',
        subject: 'Re: [original subject]',
        body: `Hi [Name],

Just circling back on this — did you get a chance to look it over?

Happy to jump on a 15-min call this week if that makes it easier to decide.

— Obi`,
      },
      {
        id: 'follow-2',
        label: 'Follow-up #2 — Add value (7 days)',
        subject: 'Something I noticed about [Business Name]',
        body: `Hi [Name],

While I had your site open, I noticed [one more specific issue or opportunity you spotted].

Just thought it was worth flagging — it's an easy fix and could make a real difference to conversions.

Still happy to chat if the timing's right. No pressure either way.

— Obi
CrftdWeb`,
      },
      {
        id: 'follow-3',
        label: 'Follow-up #3 — Break-up (14 days)',
        subject: 'Closing the loop — [Business Name]',
        body: `Hi [Name],

I'll stop following up after this one — I don't want to be that person in your inbox.

If the timing ever becomes right for a new website, I'd love to help. Our calendar fills up a few weeks in advance so reach out whenever you're ready.

Wishing you well with [business name].

— Obi
CrftdWeb | crftdweb.com`,
      },
    ],
  },
  {
    id: 'proposals',
    icon: <Handshake className="w-5 h-5" />,
    title: 'Proposals & Closing',
    description: 'Sending quotes, handling objections, and getting contracts signed.',
    color: 'from-emerald-600/20 to-green-600/10 border-emerald-500/20',
    templates: [
      {
        id: 'proposal-1',
        label: 'Proposal delivery',
        subject: 'Your CrftdWeb Proposal — [Business Name]',
        body: `Hi [Name],

Great speaking with you — here's everything we discussed.

─────────────────────────
PROJECT SUMMARY
─────────────────────────
Scope: [e.g. 6-page business website, custom-coded in Next.js]
Timeline: [X] weeks from deposit
Investment: £[amount]
Includes: [brief bullet list]

─────────────────────────
NEXT STEPS
─────────────────────────
1. Reply to confirm you're happy to proceed
2. I'll send the contract and invoice for the 50% deposit
3. We kick off within 48 hours of payment

This proposal is valid for 7 days.

Any questions at all, just reply here or message me directly.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'proposal-2',
        label: 'Objection — "Too expensive"',
        subject: 'Re: Proposal — [Business Name]',
        body: `Hi [Name],

Totally understand — budget is always a consideration.

A couple of options:

1. We can scope down to the essentials for phase one and build out later. I can put together a leaner version at [lower price].

2. We can split the payment into 3 milestones to spread the cost.

Worth noting: a website that converts even 1 extra client per month at [their avg deal size] pays for itself in [X months].

Let me know which direction feels right and we'll make it work.

— Obi`,
      },
      {
        id: 'proposal-3',
        label: 'Objection — "Not the right time"',
        subject: 'Re: [Business Name] — timing',
        body: `Hi [Name],

No problem at all — timing matters.

One thing worth considering: the businesses I work with that see the biggest results are usually the ones that invest in their site before the busy season, not during it. Building now means you're ready to capture demand when it hits.

That said, I'd rather you move when it feels right. If [month/quarter] works better, I'm happy to hold a slot. Just let me know.

— Obi
CrftdWeb`,
      },
    ],
  },
  {
    id: 'rep-templates',
    icon: <Users className="w-5 h-5" />,
    title: 'Rep Templates',
    description: 'Emails fired from admin@crftdweb.com on behalf of reps after calls and conversations.',
    color: 'from-rose-600/20 to-pink-600/10 border-rose-500/20',
    templates: [
      {
        id: 'rep-1',
        label: 'Post-cold-call — prospect showed interest',
        subject: 'Following up — [Business Name]',
        body: `Hi [Name],

Great speaking with you earlier — as promised, here's a quick note from the team at CrftdWeb.

We build fast, custom websites for businesses like yours — no templates, no page builders, just clean code built to convert.

I'd love to show you a few examples relevant to [their industry] and talk through what we could do for [Business Name].

Would a 15-minute call this week work for you? You can reply here or book directly: [Calendly link]

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'rep-2',
        label: 'Post-discovery call — recap + next steps',
        subject: 'Great speaking with you — next steps for [Business Name]',
        body: `Hi [Name],

Really enjoyed our call today — you've clearly built something solid with [Business Name].

Here's a quick recap of what we covered:

• [Pain point 1 they mentioned]
• [Pain point 2 they mentioned]
• Goal: [what they want to achieve]

Based on that, I'll put together a tailored proposal and send it over within 24–48 hours.

In the meantime, if anything else comes to mind feel free to reply here.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'rep-3',
        label: 'Prospect went cold after discovery call',
        subject: 'Re: [Business Name] — just checking in',
        body: `Hi [Name],

I know things get busy — just wanted to check in after our call.

I still think there's a real opportunity to fix [specific issue discussed] and get [Business Name] converting better online.

Happy to pick up where we left off whenever the timing is right. Even if that's a few months from now, just reply and we'll get moving quickly.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'rep-4',
        label: 'Rep onboarding — welcome email',
        subject: 'Welcome to CrftdWeb — everything you need to get started',
        body: `Hi [Rep Name],

Welcome aboard — really glad to have you on the team.

Here's everything you need to get started:

─────────────────────────
YOUR ROLE
─────────────────────────
You find businesses that need a better website, start the conversation, and book them in for a call with me. That's it — I handle everything after the call.

─────────────────────────
COMMISSION
─────────────────────────
15% of the project value, paid within 7 days of client payment clearing.

Examples:
• £850 landing page → you earn £127
• £3,000 business site → you earn £450
• £10,000 web app → you earn £1,500

─────────────────────────
HOW TO LOG LEADS
─────────────────────────
Add every prospect to the shared Google Sheet: [Sheet link]
Columns: Business Name, Contact Name, Phone/Email, Date Called, Outcome, Next Action

─────────────────────────
YOUR CALL SCRIPT
─────────────────────────
I've sent your call script separately as a PDF. Print it and keep it next to you.

─────────────────────────
TO GET STARTED
─────────────────────────
Aim for 10 calls on your first day. Don't overthink it — follow the script and focus on booking calls, not selling websites.

Any questions, WhatsApp me directly: [Your number]

Let's go.

— Obi
CrftdWeb`,
      },
      {
        id: 'rep-5',
        label: 'Rep applicant — trial task',
        subject: 'CrftdWeb — Quick task before we chat',
        body: `Hi [Name],

Thanks for applying — your background looks interesting.

Before we book a call, I'd like to see how you think.

Your task: Find 5 UK businesses with a bad website and write one sentence for each explaining why it needs a redesign.

That's it. No formatting required — just reply to this email with your list within 48 hours.

Looking forward to seeing what you come back with.

— Obi
CrftdWeb`,
      },
    ],
  },
  {
    id: 'referrals',
    icon: <UserCheck className="w-5 h-5" />,
    title: 'Referrals & Re-Engagement',
    description: 'Asking past clients for referrals and re-engaging cold contacts.',
    color: 'from-amber-600/20 to-orange-600/10 border-amber-500/20',
    templates: [
      {
        id: 'referral-1',
        label: 'Ask for referral — post-launch',
        subject: 'Quick favour — [Business Name]',
        body: `Hi [Name],

Really glad we got the site live — it's been a great project.

I wanted to ask: do you know anyone else who might benefit from what we built for you? A fellow business owner with an outdated site, or someone launching something new?

I don't run ads — almost all of my work comes from word of mouth, so a recommendation from you genuinely means a lot.

If anyone comes to mind, feel free to send them my way: obi@crftdweb.com

Thank you again for trusting me with this.

— Obi`,
      },
      {
        id: 'referral-2',
        label: 'Re-engage past contact (3–6 months later)',
        subject: 'Checking in — [Business Name]',
        body: `Hi [Name],

Hope things are going well with [business name].

I was thinking about our conversation a few months back — has anything changed on the website front? Lots of businesses I've spoken to recently are finding their current site is holding them back as they grow.

If the timing is better now, I'd love to revisit the conversation. Happy to do a quick updated audit — no charge.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'referral-3',
        label: 'Ask for a testimonial',
        subject: 'One small ask — [Business Name]',
        body: `Hi [Name],

Hope the site is performing well — would love to hear how things are going since launch.

I have a small favour to ask: would you be willing to leave a short testimonial? Even 2–3 sentences about your experience and any results you've seen would genuinely help me win work with similar businesses.

You can send it back as a reply and I'll format it up, or drop it on Google if easier.

Really appreciate it.

— Obi`,
      },
    ],
  },
];

// ─── Copy Button ───
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/60 hover:text-white"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ─── Template Card ───
function TemplateCard({ template }: { template: Template }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div>
          <p className="text-sm font-medium text-white/90">{template.label}</p>
          {template.subject !== 'N/A (DM)' && (
            <p className="text-xs text-white/40 mt-0.5">Subject: <span className="text-white/60 italic">{template.subject}</span></p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/8">
              <div className="flex justify-end mt-3 mb-3">
                <CopyButton text={template.body} />
              </div>
              <pre className="text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">
                {template.body}
              </pre>
              <p className="text-xs text-white/25 mt-3">Replace all <span className="text-amber-400/60">[bracketed placeholders]</span> before sending.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Category Section ───
function CategorySection({ category }: { category: Category }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <div className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br border ${category.color} mb-4`}>
        <div className="text-white/60 mt-0.5">{category.icon}</div>
        <div>
          <h2 className="text-base font-semibold text-white">{category.title}</h2>
          <p className="text-sm text-white/50 mt-0.5">{category.description}</p>
        </div>
      </div>
      {category.templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </motion.div>
  );
}

// ─── Page ───
export default function EmailTemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayed = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-purple-400/70 mb-2">Admin / Outreach</p>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-white/40 mt-2 text-sm max-w-lg">
            Ready-to-send scripts for cold outreach, follow-ups, proposals, and referrals.
            Personalise the bracketed sections — never send a template cold.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
              activeCategory === null
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                activeCategory === c.id
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Template sections */}
        <div className="space-y-10">
          {displayed.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/8 text-center">
          <p className="text-xs text-white/25">
            These templates are a starting point. Personalisation is what gets replies.
          </p>
        </div>
      </div>
    </div>
  );
}
