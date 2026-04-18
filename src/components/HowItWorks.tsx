'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Mock UI Pieces ────────────────────────────────────────────────────────

function LeadCard({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full max-w-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white font-semibold text-sm">Bloom Florist</p>
          <p className="text-white/40 text-xs mt-0.5">lucy@bloomflorist.co.uk</p>
        </div>
        <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
          Interested
        </span>
      </div>
      <p className="text-white/30 text-xs leading-relaxed">
        "Wants a new site, current one is embarrassing. Budget flexible."
      </p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-black text-xs font-bold py-2.5 rounded-xl"
      >
        <span>Send Booking Link</span>
        <span>→</span>
      </motion.button>
    </motion.div>
  );
}

function EmailCard({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden w-full max-w-sm"
    >
      <div className="bg-black px-5 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center">
          <span className="text-white font-bold text-[10px]" style={{ fontFamily: 'serif' }}>CW</span>
        </div>
        <div>
          <p className="text-white text-xs font-semibold">CrftdWeb</p>
          <p className="text-white/30 text-[10px]">admin@crftdweb.com</p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.3 }}
          className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold"
        >
          Sent ✓
        </motion.span>
      </div>
      <div className="px-5 py-4">
        <p className="text-white/50 text-[10px] mb-1 uppercase tracking-widest">Subject</p>
        <p className="text-white text-xs font-medium mb-3">CrftdWeb — here's your booking link</p>
        <p className="text-white/50 text-xs leading-relaxed">
          Great speaking with you. Here's the link to book your discovery call…
        </p>
        <div className="mt-3 bg-white/10 rounded-lg px-4 py-2.5 text-center">
          <p className="text-white text-xs font-bold">Book your call →</p>
        </div>
      </div>
    </motion.div>
  );
}

function CalendarCard({ visible }: { visible: boolean }) {
  const slots = ['Tue 22 Apr · 10:00am', 'Wed 23 Apr · 10:00am', 'Thu 24 Apr · 2:00pm'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full max-w-sm"
    >
      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Pick a time</p>
      <div className="space-y-2">
        {slots.map((slot, i) => (
          <motion.div
            key={slot}
            initial={{ opacity: 0, x: -10 }}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: 0.15 * i, duration: 0.35 }}
            className={`flex items-center justify-between rounded-xl px-4 py-3 border text-xs font-medium transition-colors ${
              i === 0
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-white/70 border-white/10'
            }`}
          >
            <span>{slot}</span>
            {i === 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={visible ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}
                className="text-black font-bold"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function NotificationCard({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full max-w-sm"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-emerald-400 text-base">📅</span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Discovery call booked</p>
          <p className="text-white/40 text-xs mt-0.5">Just now · Bloom Florist</p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={visible ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 500 }}
          className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1"
        />
      </div>
      <div className="bg-white/5 rounded-xl p-3 space-y-1.5">
        {[
          ['Lead', 'Bloom Florist'],
          ['Time', 'Tue 22 Apr · 10:00am'],
          ['Booked by', 'Lucy Haines'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-white/30">{label}</span>
            <span className="text-white/70 font-medium">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Step ──────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    label: 'Log the lead',
    heading: 'Rep adds the lead',
    body: 'After a call, the rep adds the prospect to their portal — business name, email, and a note on what they said. No spreadsheet, no WhatsApp message to you.',
    mock: LeadCard,
  },
  {
    number: '02',
    label: 'Send booking link',
    heading: 'One button. That\'s it.',
    body: 'The rep hits "Send Booking Link" on the lead. The prospect gets a personalised email with a link to pick a time. The rep doesn\'t touch a calendar.',
    mock: EmailCard,
  },
  {
    number: '03',
    label: 'Prospect self-books',
    heading: 'They pick their slot',
    body: 'The prospect sees available discovery call slots and books themselves. Takes 30 seconds. No back-and-forth. No "what\'s your timezone?"',
    mock: CalendarCard,
  },
  {
    number: '04',
    label: 'You close the deal',
    heading: 'It lands in your calendar',
    body: 'You get notified instantly. You already know who they are, what they want, and who referred them. Walk in prepared. Close the deal.',
    mock: NotificationCard,
  },
];

function Step({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-20% 0px' });
  const Mock = step.mock;

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20`}
    >
      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 space-y-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/20">{step.number}</span>
          <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40">{step.label}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
          {step.heading}
        </h3>
        <p className="text-white/50 leading-relaxed text-base max-w-md">
          {step.body}
        </p>
      </motion.div>

      {/* Mock UI */}
      <div className="flex-1 flex justify-center">
        <Mock visible={visible} />
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <section className="py-32 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            From cold call to discovery call.
            <br />
            <span className="text-muted-foreground">Without the admin.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, i) => (
            <Step key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
