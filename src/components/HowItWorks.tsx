'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Animation Helpers ───────────────────────────────────────────────────

function useCountUp(to: number, decimals: number, startDelayMs: number, visible: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      const duration = 900;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(parseFloat((eased * to).toFixed(decimals)));
        if (p < 1) requestAnimationFrame(tick);
        else setValue(to);
      };
      requestAnimationFrame(tick);
    }, startDelayMs);
    return () => clearTimeout(t);
  }, [visible, to, decimals, startDelayMs]);
  return value;
}

function useTypewriter(text: string, charDelayMs: number, startDelayMs: number, visible: boolean) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!visible) return;
    let interval: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, charDelayMs);
    }, startDelayMs);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [visible, text, charDelayMs, startDelayMs]);
  return displayed;
}

// ─── Mock UI Pieces ────────────────────────────────────────────────────────

function DiscoveryCard({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white border border-black/10 rounded-2xl p-5 w-full max-w-sm shadow-sm"
    >
      <p className="text-black/40 text-[10px] uppercase tracking-widest mb-3">Discovery Call</p>
      <div className="space-y-2 mb-4">
        {['Tue 22 Apr · 10:00am', 'Wed 23 Apr · 10:00am', 'Thu 24 Apr · 2:00pm'].map((slot, i) => (
          <motion.div
            key={slot}
            initial={{ opacity: 0, x: -10 }}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: 0.15 * i, duration: 0.35 }}
            className={`flex items-center justify-between rounded-xl px-4 py-3 border text-xs font-medium ${
              i === 0
                ? 'bg-black text-white border-black'
                : 'bg-black/[0.03] text-black/60 border-black/8'
            }`}
          >
            <span>{slot}</span>
            {i === 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={visible ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}
                className="text-white font-bold"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.96 }}
        transition={{ delay: 0.65, type: 'spring', stiffness: 280, damping: 22 }}
        className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5"
      >
        <span className="text-emerald-600 text-xs">✓</span>
        <p className="text-emerald-700 text-xs font-medium">Booked — confirmation sent</p>
      </motion.div>
    </motion.div>
  );
}

function BuildCard({ visible }: { visible: boolean }) {
  const stages = ['Discovery', 'Design', 'Build', 'Review', 'Launch'];
  const activeIndex = 2;
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white border border-black/10 rounded-2xl p-5 w-full max-w-sm shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-black font-semibold text-sm">Bloom Florist</p>
          <p className="text-black/30 text-xs mt-0.5">In progress</p>
        </div>
        <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
          Build
        </span>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-2">
          {stages.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-black/10 overflow-hidden">
              {i <= activeIndex && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={visible ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 0.3 + i * 0.18, duration: 0.5, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                  className="h-full bg-black rounded-full"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {stages.map((s, i) => (
            <p key={s} className={`text-[9px] ${i <= activeIndex ? 'text-black/50' : 'text-black/20'}`}>{s}</p>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: 'Homepage design', done: true },
          { label: 'About page', done: true },
          { label: 'Services page', done: false, active: true },
          { label: 'Contact form', done: false },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="flex items-center justify-between text-xs py-1.5 border-b border-black/5 last:border-0"
          >
            <span className={item.done ? 'text-black/70' : item.active ? 'text-black' : 'text-black/25'}>{item.label}</span>
            <span className={item.done ? 'text-emerald-600 font-medium' : item.active ? 'text-amber-600' : 'text-black/20'}>
              {item.done ? '✓ Done' : item.active ? 'In review' : '—'}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PortalStatTile({ to, prefix = '', label, highlight, delay, visible }: {
  to: number; prefix?: string; label: string; highlight?: boolean; delay: number; visible: boolean;
}) {
  const count = useCountUp(to, 0, delay * 1000, visible);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ delay }}
      className="bg-black/[0.03] rounded-xl px-3 py-2.5 text-center"
    >
      <p className={`font-bold text-sm leading-none ${highlight ? 'text-amber-600' : 'text-black'}`}>
        {prefix}{Math.round(count)}
      </p>
      <p className="text-[9px] text-black/30 mt-1">{label}</p>
    </motion.div>
  );
}

function PortalCard({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white border border-black/10 rounded-2xl overflow-hidden w-full max-w-sm shadow-sm"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/8 bg-black/[0.02]">
        <span className="text-[10px] font-semibold text-black/40 uppercase tracking-widest">Client Portal</span>
        <span className="text-[10px] font-medium bg-black/5 text-black/50 px-2 py-0.5 rounded-full">Bloom Florist</span>
      </div>
      <div className="flex border-b border-black/8">
        {['Dashboard', 'Deliverables', 'Feedback', 'Invoices'].map((tab, i) => (
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.08 * i }}
            className={`px-3 py-2 text-[10px] font-medium ${i === 0 ? 'text-black border-b-2 border-black' : 'text-black/25'}`}
          >
            {tab}
          </motion.div>
        ))}
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <PortalStatTile to={3} label="Deliverables" delay={0.2} visible={visible} />
          <PortalStatTile to={1} label="Open feedback" highlight delay={0.28} visible={visible} />
          <PortalStatTile to={0} prefix="£" label="Outstanding" delay={0.36} visible={visible} />
        </div>
        <div className="space-y-0">
          {[
            { text: 'Homepage design', status: '✓ Approved', color: 'text-emerald-600' },
            { text: 'About page', status: 'In review', color: 'text-amber-600' },
            { text: 'Services page', status: 'Building', color: 'text-blue-600' },
            { text: 'Contact form', status: '—', color: 'text-black/20' },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0 }}
              animate={visible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center justify-between text-xs py-2 border-b border-black/5 last:border-0"
            >
              <span className="text-black/60">{item.text}</span>
              <span className={`${item.color} text-[10px] font-medium`}>{item.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LaunchStatTile({ to, decimals, unit, label, delay, visible }: {
  to: number; decimals: number; unit: string; label: string; delay: number; visible: boolean;
}) {
  const val = useCountUp(to, decimals, delay * 1000, visible);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay }}
      className="py-3.5 text-center"
    >
      <p className="text-black font-bold text-base leading-none">
        {display}<span className="text-black/30 text-[9px] font-normal">{unit}</span>
      </p>
      <p className="text-black/30 text-[9px] mt-1">{label}</p>
    </motion.div>
  );
}

function LaunchCard({ visible }: { visible: boolean }) {
  const url = useTypewriter('bloomflorist.co.uk', 45, 300, visible);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white border border-black/10 rounded-2xl overflow-hidden w-full max-w-sm shadow-sm"
    >
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-black/8 bg-black/[0.02]">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
        </div>
        <div className="flex-1 bg-black/5 rounded-md px-3 py-1 flex items-center gap-1.5">
          <span className="text-emerald-500 text-[9px]">●</span>
          <span className="text-black/40 text-[10px] font-mono">{url}</span>
        </div>
        <div className="relative shrink-0">
          {visible && (
            <motion.div
              animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
              className="absolute inset-0 rounded-full bg-emerald-400"
            />
          )}
          <motion.span
            initial={{ scale: 0 }}
            animate={visible ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}
            className="relative block text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full"
          >
            Live
          </motion.span>
        </div>
      </div>
      <div className="bg-black/[0.015] px-5 pt-5 pb-4 space-y-2.5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2 }}
          className="h-4 bg-black/8 rounded-full w-3/5"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.28 }}
          className="h-2.5 bg-black/5 rounded-full w-full"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.34 }}
          className="h-2.5 bg-black/5 rounded-full w-4/5"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.42 }}
          className="h-8 bg-black/8 rounded-xl w-2/5 mt-2"
        />
      </div>
      <div className="grid grid-cols-3 divide-x divide-black/8 border-t border-black/8">
        <LaunchStatTile to={97} decimals={0} unit="/100" label="PageSpeed" delay={0.5} visible={visible} />
        <LaunchStatTile to={0.8} decimals={1} unit="s" label="Load time" delay={0.62} visible={visible} />
        <LaunchStatTile to={100} decimals={0} unit="/100" label="Mobile" delay={0.74} visible={visible} />
      </div>
    </motion.div>
  );
}

// ─── Steps ─────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    label: 'Discovery',
    heading: 'Book a call. We\'ll figure out the rest.',
    body: '15 minutes. We look at your current site, ask the right questions, and tell you honestly what would make it work harder for your business.',
    mock: DiscoveryCard,
  },
  {
    number: '02',
    label: 'We build it',
    heading: 'Hand-coded. No templates. No drag-and-drop.',
    body: 'Your site is built from scratch using our proven stack — fast, semantic, built to rank. Most projects are complete in under 3 weeks.',
    mock: BuildCard,
  },
  {
    number: '03',
    label: 'Your portal',
    heading: 'You\'re in the loop the whole time.',
    body: 'From day one, you have your own project portal. See your build stage, review deliverables, leave feedback, and track invoices — no chasing emails, no guessing.',
    mock: PortalCard,
  },
  {
    number: '04',
    label: 'Go live',
    heading: 'Live. Fast. Ready to convert.',
    body: 'We handle hosting, domain, and analytics. You get a site that scores 97+ on PageSpeed, loads in under a second, and is set up to win business from day one.',
    mock: LaunchCard,
  },
];

function Step({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-15% 0px' });
  const Mock = step.mock;
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20`}
    >
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 space-y-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-black/20">{step.number}</span>
          <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-black/35">{step.label}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black leading-tight">
          {step.heading}
        </h3>
        <p className="text-black/50 leading-relaxed text-base max-w-md">
          {step.body}
        </p>
      </motion.div>

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            From first call to live site.
            <br />
            <span className="text-black/35">No surprises.</span>
          </h2>
        </motion.div>

        <div className="space-y-32">
          {steps.map((step, i) => (
            <Step key={step.number} step={step} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-24"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3.5 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            Book your free discovery call
            <span aria-hidden>→</span>
          </Link>
          <p className="text-muted-foreground text-xs mt-3">15 minutes. No commitment.</p>
        </motion.div>
      </div>
    </section>
  );
}
