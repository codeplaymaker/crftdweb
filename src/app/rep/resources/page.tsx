'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

const CALL_SCRIPT = [
  {
    step: 'Step 1 — Opening (first 10 seconds)',
    content: `"Hi, can I speak to the owner? … Hi [Name], my name is [Your Name], I'm calling from a web design studio called CrftdWeb. I'll be really quick — I'm not trying to sell you anything today, I just had a quick question."`,
    note: 'Pause. Let them respond.',
  },
  {
    step: 'Step 2 — The Hook',
    content: `"I came across your business online and noticed your website — honestly it looks like it could be doing a lot more for you. Is that something you've thought about at all?"`,
    note: "Wait for their response — don't fill the silence.",
  },
  {
    step: 'Step 3a — If Yes / "Yeah actually"',
    content: `"Perfect. I work with a developer who specialises in building clean, fast websites for businesses like yours — usually starting from £1,200. Would you be open to a quick 15-minute call with him to see if it's a fit?"`,
    note: null,
  },
  {
    step: 'Step 3b — If No / "We\'re fine"',
    content: `"Totally get that. Out of curiosity, are you getting enquiries through the site regularly, or do most people find you another way?"`,
    note: "Gets them talking. If the site isn't converting, you're back in.",
  },
  {
    step: 'Step 4 — Book the Call',
    content: `"Great — he's pretty flexible. I can get you a slot as early as [day]. What works better for you, mornings or afternoons?"`,
    note: 'Always give a choice. Never ask "when are you free?" — too open ended.',
  },
  {
    step: 'Step 5 — If Not Interested',
    content: `"No problem at all. Can I just send over a quick email with some examples of his work — just so you have it if things change?"`,
    note: 'Gets the email. Turns a dead call into a warm lead for follow-up.',
  },
];

const EMAIL_TEMPLATES = [
  {
    label: 'After Booking a Call',
    subject: 'Your call with CrftdWeb — confirmed',
    body: `Hi [Name],

Just confirming your 15-minute call with the founder of CrftdWeb on [day] at [time].

What to expect:
- The site will be reviewed before the call
- You'll get straight feedback on what's working and what isn't
- If there's a fit, you'll hear exactly what we'd build and what it would cost

No pressure, no hard sell.

Talk soon,
[Your name]
CrftdWeb Rep

crftdweb.com`,
  },
  {
    label: 'Follow-up (No Reply)',
    subject: 'Re: your website',
    body: `Hi [Name],

Tried you on the phone earlier — just wanted to pass this across.

We built sites for [industry, e.g. local tradespeople / gyms / consultants] that are designed to bring in actual enquiries, not just look decent.

If you've got 15 minutes in the next few days, happy to get you a call with the founder — he'll be honest about whether it makes sense for your business.

Worth it?

[Your name]`,
  },
  {
    label: 'After Sending Portfolio',
    subject: 'Examples from CrftdWeb',
    body: `Hi [Name],

Here are a few recent sites we've built: crftdweb.com/work

The process is quick — most sites are live in 2–5 weeks. Starting from £1,200 for a landing page.

If anything looks relevant to what you're after, I can get you 15 minutes with the founder this week.

[Your name]`,
  },
];

const FAQS = [
  {
    q: 'What exactly am I selling?',
    a: 'Custom websites. Landing pages from £1,200 (1–2 weeks). Business sites from £3,200 (3–5 weeks). Web apps from £8,000 (6–12 weeks). Your job is to book the discovery call — not close the deal. The founder handles that.',
  },
  {
    q: 'When do I get paid?',
    a: 'Within 7 days of the client paying their deposit. Commission is 15% of the net project value. So a £3,200 site = £480 to you.',
  },
  {
    q: 'What if they ask technical questions?',
    a: "Don't answer them. Say: \"That's exactly what he'll cover on the call — he'd rather explain it properly in context than me get something wrong.\" Then book the call.",
  },
  {
    q: "What if they say it's too expensive?",
    a: "Don't negotiate on price. Say: \"Fair enough — that's up to him to discuss. The call is completely free and he'll give you a proper breakdown. Worth 15 minutes?\"",
  },
  {
    q: 'How do I log a lead?',
    a: "Use the 'My Leads' section in this portal. Add them as soon as you hang up — never at the end of the day. Pick the right status, add a note with what they said.",
  },
  {
    q: 'What counts as a "won" deal?',
    a: "When the client pays their deposit to CrftdWeb. Not when they verbally agree. Update the lead status to 'won' and add the deal value when you get confirmation.",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-sm text-white/70 font-medium">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />}
      </button>
      {open && (
        <p className="pb-4 text-sm text-white/40 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function RepResourcesPage() {
  const [dealValue, setDealValue] = useState('');
  const commission = dealValue ? Math.round(Number(dealValue) * 0.15) : null;

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Resources</h1>
        <p className="text-sm text-white/30 mt-0.5">Everything you need to work a lead end to end.</p>
      </div>

      {/* Commission calculator */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Commission Calculator</p>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">£</span>
            <input
              type="number"
              value={dealValue}
              onChange={e => setDealValue(e.target.value)}
              placeholder="Deal value"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">{commission !== null ? `£${commission.toLocaleString()}` : '£—'}</p>
            <p className="text-[10px] text-white/30">your 15%</p>
          </div>
        </div>
      </div>

      {/* Daily targets */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: '10', label: 'Calls per day' },
          { num: '2–3', label: 'Booked calls / week' },
          { num: '1', label: 'Closed client / week' },
        ].map(t => (
          <div key={t.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white tracking-tight">{t.num}</p>
            <p className="text-[10px] text-white/30 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Call script */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Cold Call Script</p>
        <p className="text-xs text-white/25 mb-5 italic">Know it — don't read it. Your only goal is to book a 15-min call.</p>
        <div className="space-y-3">
          {CALL_SCRIPT.map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{item.step}</p>
              <p className="text-sm text-white/70 leading-relaxed italic">{item.content}</p>
              {item.note && <p className="text-xs text-white/30 mt-2 not-italic">{item.note}</p>}
            </div>
          ))}
        </div>
        <div className="bg-black/30 border border-white/8 rounded-xl p-4 mt-3">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">The Rules</p>
          <ol className="list-decimal list-inside space-y-2">
            {[
              'Never read it word for word — know it, then make it natural',
              'Your only goal is to book a call — not sell the website, that\'s his job',
              'Keep calls under 3 minutes — don\'t pitch, don\'t ramble',
              'Log every lead immediately in the portal',
              'Follow up everything — most closes happen on the 2nd or 3rd contact',
            ].map((rule, i) => (
              <li key={i} className="text-xs text-white/40 leading-relaxed">{rule}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Email templates */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Email Templates</p>
        <div className="space-y-3">
          {EMAIL_TEMPLATES.map((tpl, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/60">{tpl.label}</p>
                <CopyButton text={`Subject: ${tpl.subject}\n\n${tpl.body}`} />
              </div>
              <p className="text-[10px] text-white/25 mb-2">Subject: {tpl.subject}</p>
              <pre className="text-xs text-white/40 leading-relaxed whitespace-pre-wrap font-sans">{tpl.body}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">FAQs</p>
        <div>
          {FAQS.map((faq, i) => (
            <Accordion key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
