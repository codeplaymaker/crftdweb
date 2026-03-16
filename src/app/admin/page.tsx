'use client';

import { useState, useEffect, useCallback, useRef, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// ─── Animated Counter Hook ───
function AnimatedNumber({ value, suffix = '', prefix = '', duration = 1.2 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value, duration, count, rounded]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ─── Floating Particles ───
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.15 + 0.03,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-purple-400"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [0, -80, -30, -120, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [0, p.opacity, p.opacity * 0.6, p.opacity, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ─── Film Grain Overlay ───
function FilmGrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[2] opacity-[0.015] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ─── Typewriter Effect ───
function Typewriter({ text, delay = 0, speed = 0.04, className = '' }: { text: string; delay?: number; speed?: number; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed * 1000);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="inline-block w-[3px] h-[1em] bg-purple-400 ml-1 align-middle"
        />
      )}
    </span>
  );
}

// ─── Navigation Dots ───
function NavDots({ current, total, onSelect }: { current: number; total: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); onSelect(i); }}
          className="group relative cursor-pointer p-1"
          title={slides[i].id}
        >
          <motion.div
            animate={{
              width: current === i ? 3 : 3,
              height: current === i ? 16 : 6,
              backgroundColor: current === i ? 'rgba(147,51,234,0.8)' : 'rgba(255,255,255,0.1)',
            }}
            transition={{ duration: 0.2 }}
            className="rounded-full"
          />
        </button>
      ))}
    </div>
  );
}

// ─── Sparkline SVG ───
function Sparkline({ data, color = '#22c55e', className = '' }: { data: number[]; color?: string; className?: string }) {
  const width = 120;
  const height = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

// ─── Slide data ───
const slides = [
  {
    id: 'cover',
    type: 'cover' as const,
  },
  {
    id: 'problem',
    type: 'content' as const,
    label: 'THE PROBLEM',
    headline: 'Your website is costing you money.',
    points: [
      { icon: 'clock', text: 'Slow load times — every extra second drops conversions by 7%' },
      { icon: 'mobile', text: 'Poor mobile experience — 70% of your traffic, 30% of your revenue' },
      { icon: 'eye', text: "Outdated design — visitors decide in 0.05s if they trust you" },
      { icon: 'puzzle', text: "Built on templates — bloated plugins, security risks, zero flexibility" },
    ],
  },
  {
    id: 'cost',
    type: 'stat' as const,
    label: 'THE REAL COST',
    stat: '£347',
    statSuffix: '/day',
    description: 'Average revenue lost to a slow, outdated website — UK businesses',
    subtext: "That's £10,400/month you're leaving on the table.",
  },
  {
    id: 'solution',
    type: 'content' as const,
    label: 'WHAT WE DO',
    headline: 'We build websites that sell.',
    points: [
      { icon: 'bolt', text: 'Custom-coded with Next.js — no WordPress, no page builders, no bloat' },
      { icon: 'target', text: 'Conversion-first design — every section moves the visitor toward action' },
      { icon: 'gauge', text: '95+ PageSpeed scores, sub-1.5s loads — built to outperform' },
      { icon: 'shield', text: 'Enterprise-grade security and 99.9% uptime on Vercel edge network' },
    ],
  },
  {
    id: 'process',
    type: 'process' as const,
    label: 'OUR PROCESS',
    headline: '4 steps. 14 days. Done.',
    steps: [
      { num: '01', title: 'Discover', desc: 'Deep-dive into your business, audience, and goals', duration: 'Day 1-2' },
      { num: '02', title: 'Design', desc: 'High-fidelity mockups you approve before we write a line of code', duration: 'Day 3-6' },
      { num: '03', title: 'Develop', desc: 'Hand-coded, responsive, optimised for speed and conversions', duration: 'Day 7-12' },
      { num: '04', title: 'Deliver', desc: 'Launch, train your team, and provide 30 days of support', duration: 'Day 13-14' },
    ],
  },
  {
    id: 'results',
    type: 'results' as const,
    label: 'CLIENT RESULTS',
    headline: 'What happens after launch.',
    clients: [
      { industry: 'Health & Wellness', metric: '+340% traffic', revenue: '£22K/mo', time: '90 days' },
      { industry: 'Property Services', metric: '+180% leads', revenue: '£18K/mo', time: '60 days' },
      { industry: 'Music Academy', metric: '+520% bookings', revenue: '£14K/mo', time: '45 days' },
    ],
  },
  {
    id: 'differentiator',
    type: 'comparison' as const,
    label: 'WHY US',
    headline: "Most agencies vs. us.",
    rows: [
      { label: 'Tech', them: 'WordPress + plugins', us: 'Custom Next.js' },
      { label: 'Timeline', them: '6-12 weeks', us: '14 days' },
      { label: 'PageSpeed', them: '40-60', us: '95+' },
      { label: 'Design', them: 'Template tweaks', us: 'Bespoke from scratch' },
      { label: 'Support', them: 'Ticket queue', us: 'Direct line to your dev' },
      { label: 'Hosting', them: 'Shared £5/mo', us: 'Vercel edge (global CDN)' },
    ],
  },
  {
    id: 'investment',
    type: 'investment' as const,
    label: 'INVESTMENT',
    headline: 'Clear pricing. No surprises.',
    packages: [
      {
        name: 'Launch',
        price: '£2,497',
        desc: 'Perfect for service businesses ready to upgrade',
        features: ['5-page custom website', 'Mobile responsive', 'SEO foundations', 'Contact form + CRM', '30-day support'],
        popular: false,
      },
      {
        name: 'Growth',
        price: '£4,997',
        desc: 'For businesses serious about conversions',
        features: ['Up to 10 pages', 'Conversion-optimised copy', 'Analytics dashboard', 'Blog / CMS', 'Booking integration', '90-day support'],
        popular: true,
      },
      {
        name: 'Scale',
        price: '£9,997+',
        desc: 'Full digital transformation',
        features: ['Unlimited pages', 'Custom web app features', 'API integrations', 'E-commerce / SaaS', 'Dedicated project manager', '12-month partnership'],
        popular: false,
      },
    ],
  },
  {
    id: 'guarantee',
    type: 'stat' as const,
    label: 'OUR GUARANTEE',
    stat: '100%',
    statSuffix: '',
    description: 'If you don\'t love it, you don\'t pay. Full refund before launch.',
    subtext: 'We\'ve never had to use it.',
  },
  {
    id: 'next-steps',
    type: 'cta' as const,
    label: 'NEXT STEPS',
    headline: "Let's build something great.",
    steps: [
      '✅  We scope your project today',
      '✅  You get a proposal within 24 hours',
      '✅  We start building this week',
    ],
  },
];

// ─── SVG Icon Map ───
const iconMap: Record<string, ReactNode> = {
  clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  mobile: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />,
  eye: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  puzzle: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></>,
  bolt: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />,
  target: <><circle cx="12" cy="12" r="9" strokeWidth={1.5} strokeLinecap="round" /><circle cx="12" cy="12" r="5" strokeWidth={1.5} strokeLinecap="round" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
  gauge: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a9.5 9.5 0 11-19 0 9.5 9.5 0 0119 0z" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0020.402 6a11.96 11.96 0 00-8.402-3.286z" />,
};

function SlideIcon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {iconMap[name] || null}
    </svg>
  );
}

// ─── Components ───

function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-12 relative overflow-hidden">
      {/* Animated gradient orbs — dual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, rgba(147,51,234,0.03) 30%, transparent 65%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 3, delay: 0.5 }}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
          top: '30%', left: '60%', transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Grid lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div className="relative z-10">
        {/* Logo mark with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-10 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-600/10 border border-purple-500/20 flex items-center justify-center relative"
        >
          <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl" />
          <span className="text-3xl font-black text-purple-400 relative z-10" style={{ fontFamily: 'var(--font-logo)' }}>C</span>
        </motion.div>

        {/* Name with staggered letter reveal */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            <h1
              className="text-[88px] font-bold tracking-tight leading-none mb-2 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-logo)' }}
            >
              CrftdWeb
            </h1>
          </motion.div>
        </div>

        {/* Animated divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="h-[1px] mx-auto my-8"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.5), transparent)' }}
        />

        {/* Typewriter tagline */}
        <h2 className="text-2xl font-light text-white/50 tracking-wide h-[36px]">
          <Typewriter text="How we build websites that sell." delay={1.0} speed={0.035} />
        </h2>

        {/* Tech stack badges with stagger */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {['Next.js', 'React', 'Vercel', 'TypeScript'].map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + i * 0.1 }}
              className="text-[10px] font-mono text-white/15 tracking-wider px-3 py-1.5 border border-white/[0.06] rounded-full backdrop-blur-sm"
            >
              {t}
            </motion.span>
          ))}
        </div>

        {/* Scroll/click prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[9px] font-mono text-white/10 tracking-[0.3em] uppercase">Click to begin</span>
            <svg className="w-4 h-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ContentSlide({ data }: { data: typeof slides[1] }) {
  if (data.type !== 'content') return null;
  const isProblems = data.id === 'problem';
  return (
    <div className="flex flex-col justify-center h-full px-16 max-w-4xl mx-auto relative">
      {/* Background accent */}
      <div className={`absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none ${
        isProblems ? 'bg-red-500/[0.04]' : 'bg-purple-500/[0.04]'
      } blur-3xl`} />

      {/* Large background number */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[300px] font-black text-white/[0.015] leading-none pointer-events-none select-none">
        {isProblems ? '!' : '→'}
      </div>

      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`text-xs font-semibold tracking-[0.3em] mb-6 ${isProblems ? 'text-red-400' : 'text-purple-400'}`}
      >
        {data.label}
      </motion.span>

      {/* Gradient headline */}
      <div className="overflow-hidden mb-12">
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className={`text-5xl font-bold tracking-tight leading-tight bg-clip-text text-transparent ${
            isProblems
              ? 'bg-gradient-to-r from-white via-white to-red-300/70'
              : 'bg-gradient-to-r from-white via-white to-purple-300/70'
          }`}
        >
          {data.headline}
        </motion.h2>
      </div>

      <div className="space-y-4">
        {data.points?.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + 0.12 * i, type: 'spring', stiffness: 100, damping: 15 }}
            className="flex items-start gap-5 group"
          >
            <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center border relative ${
              isProblems
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
            }`}>
              <SlideIcon name={p.icon} className="w-5 h-5" />
              {/* Icon glow */}
              <div className={`absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                isProblems ? 'bg-red-500/10' : 'bg-purple-500/10'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-lg text-white/70 leading-relaxed">{p.text}</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ delay: 0.4 + 0.12 * i, duration: 0.4 }}
                className={`h-[1px] mt-3 ${isProblems ? 'bg-red-500/15' : 'bg-purple-500/15'}`}
              />
            </div>
            {/* Number */}
            <span className="text-[10px] font-mono text-white/[0.06] mt-1 tracking-wider">
              {String(i + 1).padStart(2, '0')}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatSlide({ data }: { data: typeof slides[2] }) {
  if (data.type !== 'stat') return null;
  const isGuarantee = data.id === 'guarantee';
  const numericValue = parseInt(data.stat.replace(/[^0-9]/g, ''));

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16 relative overflow-hidden">
      {/* Radial glow behind stat */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: isGuarantee
            ? 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 40%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Concentric rings for guarantee */}
      {isGuarantee && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.06 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute w-[400px] h-[400px] rounded-full border border-green-400 pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.03 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="absolute w-[500px] h-[500px] rounded-full border border-green-400 pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </>
      )}

      {/* Ring gauge for cost slide */}
      {!isGuarantee && (
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute w-[360px] h-[360px] pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <motion.circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="rgba(239,68,68,0.15)"
            strokeWidth="1.5"
            strokeDasharray="565.48"
            initial={{ strokeDashoffset: 565.48 }}
            animate={{ strokeDashoffset: 565.48 * 0.3 }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </motion.svg>
      )}

      {/* Shield icon for guarantee */}
      {isGuarantee && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6 relative"
        >
          <svg className="w-16 h-16 text-green-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0020.402 6a11.96 11.96 0 00-8.402-3.286z" />
          </svg>
          <div className="absolute inset-0 blur-2xl bg-green-500/10" />
        </motion.div>
      )}

      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-xs font-semibold tracking-[0.3em] mb-10 relative z-10 ${isGuarantee ? 'text-green-400/70' : 'text-red-400/70'}`}
      >
        {data.label}
      </motion.span>

      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring' }} className="relative z-10">
        <div className={`text-[130px] font-black leading-none tracking-tight ${isGuarantee ? 'text-green-400' : ''}`}>
          {isGuarantee ? (
            <span className="bg-gradient-to-b from-green-400 to-green-500/60 bg-clip-text text-transparent">
              <AnimatedNumber value={numericValue} prefix="" suffix="" />%
            </span>
          ) : (
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              £<AnimatedNumber value={numericValue} /><span className="text-4xl font-medium text-white/30">{data.statSuffix}</span>
            </span>
          )}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-xl text-white/50 mt-8 max-w-lg relative z-10"
      >
        {data.description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="h-[1px] bg-white/10 mx-auto mt-6 mb-4"
        />
        <p className={`text-sm font-medium ${isGuarantee ? 'text-green-400/40' : 'text-red-400/30'}`}>{data.subtext}</p>
      </motion.div>
    </div>
  );
}

function ProcessSlide({ data }: { data: typeof slides[4] }) {
  if (data.type !== 'process') return null;
  return (
    <div className="flex flex-col justify-center h-full px-16 max-w-5xl mx-auto">
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-semibold tracking-[0.3em] text-purple-400 mb-6"
      >{data.label}</motion.span>
      <div className="overflow-hidden mb-14">
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-purple-300/60 bg-clip-text text-transparent"
        >{data.headline}</motion.h2>
      </div>

      {/* Timeline connector */}
      <div className="relative">
        <div className="absolute top-0 left-[23px] bottom-0 w-[2px] bg-gradient-to-b from-purple-500/30 via-purple-500/15 to-transparent hidden sm:block" />

        <div className="space-y-6">
          {data.steps?.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i, type: 'spring', stiffness: 80 }}
              className="flex items-start gap-6"
            >
              {/* Timeline dot */}
              <div className="relative flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + 0.15 * i, type: 'spring' }}
                  className="w-12 h-12 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center"
                >
                  <span className="text-sm font-bold text-purple-400">{s.num}</span>
                </motion.div>
              </div>

              {/* Card */}
              <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-purple-500/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">{s.title}</h3>
                  <span className="text-[10px] font-mono tracking-widest text-purple-400/40 bg-purple-500/5 px-2.5 py-1 rounded-full">{s.duration}</span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                {/* Progress indicator */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((i + 1) / (data.steps?.length || 4)) * 100}%` }}
                  transition={{ delay: 0.4 + 0.15 * i, duration: 0.6 }}
                  className="h-[2px] bg-gradient-to-r from-purple-500/30 to-transparent mt-4 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultsSlide({ data }: { data: typeof slides[5] }) {
  if (data.type !== 'results') return null;
  const sparkData = [
    [10, 12, 14, 18, 22, 28, 35, 44, 52, 65, 78, 100],
    [15, 18, 20, 24, 30, 35, 42, 50, 55, 62, 70, 80],
    [8, 15, 22, 30, 40, 55, 72, 90, 110, 130, 155, 180],
  ];
  return (
    <div className="flex flex-col justify-center h-full px-16 max-w-5xl mx-auto">
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-semibold tracking-[0.3em] text-purple-400 mb-6"
      >
        {data.label}
      </motion.span>
      <div className="overflow-hidden mb-14">
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-green-300/50 bg-clip-text text-transparent"
        >
          {data.headline}
        </motion.h2>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {data.clients?.map((c, i) => {
          const metricNum = parseInt(c.metric.replace(/[^0-9]/g, ''));
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + 0.15 * i, type: 'spring', stiffness: 80 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 relative overflow-hidden group hover:border-green-500/10 transition-colors"
            >
              {/* Sparkline background */}
              <div className="absolute bottom-0 left-0 right-0 h-16 opacity-40">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + 0.2 * i }}
                >
                  <Sparkline data={sparkData[i]} className="w-full h-full" />
                </motion.div>
              </div>

              <p className="text-[10px] text-white/25 mb-5 font-semibold tracking-[0.2em] uppercase">{c.industry}</p>

              {/* Animated metric */}
              <div className="text-3xl font-bold text-green-400 mb-1">
                +<AnimatedNumber value={metricNum} suffix="%" duration={1.5} />
              </div>
              <p className="text-xs text-green-400/40 mb-5">{c.metric.includes('traffic') ? 'organic traffic' : c.metric.includes('leads') ? 'qualified leads' : 'weekly bookings'}</p>

              {/* Revenue bar */}
              <div className="bg-white/[0.04] rounded-full h-1.5 mb-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (parseInt(c.revenue.replace(/[^0-9]/g, '')) / 250) * 100)}%` }}
                  transition={{ delay: 0.6 + 0.2 * i, duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-purple-600 to-violet-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <p className="text-xl font-bold text-white">{c.revenue}</p>
                <p className="text-[10px] text-white/20 font-mono tracking-wider">{c.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ComparisonSlide({ data }: { data: typeof slides[6] }) {
  if (data.type !== 'comparison') return null;
  return (
    <div className="flex flex-col justify-center h-full px-16 max-w-4xl mx-auto relative">
      {/* Glow behind 'us' column */}
      <div className="absolute right-[12%] top-[30%] bottom-[10%] w-[200px] bg-green-500/[0.02] blur-3xl rounded-full pointer-events-none" />

      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-semibold tracking-[0.3em] text-purple-400 mb-6"
      >{data.label}</motion.span>
      <div className="overflow-hidden mb-14">
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent"
        >{data.headline}</motion.h2>
      </div>
      <div className="space-y-0 relative">
        {/* Header */}
        <div className="grid grid-cols-3 gap-0 mb-3 px-6">
          <span></span>
          <span className="text-xs font-medium tracking-widest text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-red-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-red-400/50 uppercase">Typical Agency</span>
          </span>
          <span className="text-xs font-medium tracking-widest text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400/50 uppercase">CRFTD Web</span>
          </span>
        </div>
        {data.rows?.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 + 0.08 * i, type: 'spring', stiffness: 120, damping: 18 }}
            className={`grid grid-cols-3 gap-0 py-4 px-6 rounded-xl ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
          >
            <span className="text-sm text-white/50 font-medium">{r.label}</span>
            <span className="text-sm text-red-400/35 text-center flex items-center justify-center gap-2 line-through decoration-red-500/20">
              {r.them}
            </span>
            <span className="text-sm text-green-400 font-semibold text-center flex items-center justify-center gap-2">
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + 0.08 * i, type: 'spring' }}
                className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </motion.svg>
              {r.us}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InvestmentSlide({ data }: { data: typeof slides[7] }) {
  if (data.type !== 'investment') return null;
  return (
    <div className="flex flex-col justify-center h-full px-16 max-w-5xl mx-auto relative">
      {/* Background */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[15%] w-[400px] h-[400px] bg-purple-500/[0.02] blur-3xl rounded-full pointer-events-none" />

      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-semibold tracking-[0.3em] text-purple-400 mb-6"
      >{data.label}</motion.span>
      <div className="overflow-hidden mb-14">
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-purple-300/50 bg-clip-text text-transparent"
        >{data.headline}</motion.h2>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {data.packages?.map((pkg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, type: 'spring', stiffness: 80 }}
            className={`rounded-2xl p-7 relative overflow-hidden ${
              pkg.popular
                ? 'bg-gradient-to-b from-purple-600/15 to-violet-600/5 border-2 border-purple-500/30'
                : 'bg-white/[0.03] border border-white/[0.06]'
            }`}
          >
            {/* Subtle pattern for popular */}
            {pkg.popular && (
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(147,51,234,0.5) 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }} />
            )}
            {pkg.popular && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-lg shadow-purple-500/20"
              >
                Recommended
              </motion.span>
            )}
            <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
            <p className="text-xs text-white/30 mb-5">{pkg.desc}</p>
            <div className="text-4xl font-black text-white mb-6">{pkg.price}</div>
            <ul className="space-y-2.5">
              {pkg.features.map((f, j) => (
                <motion.li
                  key={j}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + 0.05 * j }}
                  className="flex items-center gap-2.5 text-sm text-white/50"
                >
                  <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CTASlide({ data }: { data: typeof slides[9] }) {
  if (data.type !== 'cta') return null;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16 relative overflow-hidden">
      {/* Multiple gradient layers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(147,51,234,0.08) 0%, transparent 60%)' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 3, delay: 0.5 }}
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent)', bottom: '20%', left: '30%' }}
      />

      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-semibold tracking-[0.3em] text-purple-400 mb-10 relative z-10"
      >
        {data.label}
      </motion.span>

      {/* Gradient headline */}
      <div className="overflow-hidden mb-12 relative z-10">
        <motion.h2
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-purple-300/60 bg-clip-text text-transparent"
        >
          {data.headline}
        </motion.h2>
      </div>

      <div className="space-y-4 mb-10 relative z-10">
        {data.steps?.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + 0.15 * i, type: 'spring' }}
            className="flex items-center gap-3 justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + 0.15 * i, type: 'spring' }}
              className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0"
            >
              <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <p className="text-xl text-white/50">{s.replace('✅  ', '')}</p>
          </motion.div>
        ))}
      </div>

      {/* Pulsing CTA button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="relative z-10 mb-10"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-lg tracking-wide shadow-2xl shadow-purple-500/20 relative"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 blur-xl opacity-40" />
          <span className="relative z-10">Book a Strategy Call →</span>
        </motion.div>
      </motion.div>

      {/* Visual separator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 64 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="h-[1px] mb-8 relative z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.3), transparent)' }}
      />

      {/* Contact row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex items-center gap-8 relative z-10"
      >
        <div className="flex items-center gap-2 text-sm text-white/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span>crftdweb.com</span>
        </div>
        <div className="w-[1px] h-4 bg-white/10" />
        <div className="flex items-center gap-2 text-sm text-white/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <span>hello@crftdweb.com</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ───

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<'home' | 'pitch'>('home');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = slides.length;

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent(c => Math.min(c + 1, total - 1));
  }, [total]);
  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent(c => Math.max(c - 1, 0));
  }, []);
  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  const exitPitch = useCallback(() => {
    setActiveView('home');
    setCurrent(0);
    setDirection(1);
  }, []);

  // Keyboard navigation (only active during pitch)
  useEffect(() => {
    if (activeView !== 'pitch') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'f') {
        document.documentElement.requestFullscreen?.();
      }
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          exitPitch();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, activeView, exitPitch]);

  // ─── Home view ───
  if (activeView === 'home') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-8 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-logo)' }}>
                CrftdWeb
              </h1>
              <p className="text-sm text-white/30 mt-1">Admin Dashboard</p>
            </div>
            <div className="text-xs text-white/15 font-mono" suppressHydrationWarning>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xs font-semibold tracking-[0.3em] text-white/20 uppercase mb-8">Tools</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Pitch Deck Card */}
              <motion.button
                onClick={() => setActiveView('pitch')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-purple-500/30 hover:bg-purple-500/[0.03] transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:bg-purple-500/15 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Client Pitch</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  10-slide presentation deck for sales calls. Covers problem, solution, process, results, and pricing.
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-400/60 font-medium">
                  <span>Launch presentation</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {/* Slide count badge */}
                <div className="absolute top-6 right-6 text-[10px] font-mono text-white/10 tracking-wider">
                  10 SLIDES
                </div>
              </motion.button>

              {/* Placeholder cards for future tools */}
              <div className="bg-white/[0.015] border border-white/[0.04] border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
                  </svg>
                </div>
                <p className="text-sm text-white/20">More tools coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Pitch view ───

  const slide = slides[current];

  function renderSlide() {
    switch (slide.type) {
      case 'cover': return <CoverSlide />;
      case 'content': return <ContentSlide data={slide as typeof slides[1]} />;
      case 'stat': return <StatSlide data={slide as typeof slides[2]} />;
      case 'process': return <ProcessSlide data={slide as typeof slides[4]} />;
      case 'results': return <ResultsSlide data={slide as typeof slides[5]} />;
      case 'comparison': return <ComparisonSlide data={slide as typeof slides[6]} />;
      case 'investment': return <InvestmentSlide data={slide as typeof slides[7]} />;
      case 'cta': return <CTASlide data={slide as typeof slides[9]} />;
      default: return null;
    }
  }

  // Slide transition variants
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.98 }),
  };

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden cursor-none select-none"
      onClick={goNext}
      onContextMenu={(e) => { e.preventDefault(); goPrev(); }}
    >
      {/* Persistent layers */}
      <Particles />
      <FilmGrain />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/[0.04] via-transparent to-transparent pointer-events-none z-[1]" />

      {/* Back to dashboard button */}
      <button
        onClick={(e) => { e.stopPropagation(); exitPitch(); }}
        className="absolute top-5 left-6 z-50 p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
        title="Back to dashboard (Esc)"
      >
        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Navigation dots */}
      <NavDots current={current} total={total} onSelect={goTo} />

      {/* Contextual slide label */}
      <motion.div
        key={`label-${current}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-40 text-[9px] font-mono text-white/[0.08] tracking-[0.4em] uppercase"
      >
        {slide.id.replace('-', ' ')}
      </motion.div>

      {/* Slide content with directional transitions */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative h-full z-[3]"
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03] z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-5 right-16 text-xs text-white/10 font-mono tracking-wider z-40">
        {String(current + 1).padStart(2, '0')}<span className="text-white/5"> / </span>{String(total).padStart(2, '0')}
      </div>

      {/* Keyboard hint (fades out) */}
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 4, duration: 2 }}
        className="absolute bottom-5 left-8 text-[9px] text-white/10 font-mono tracking-wider z-40"
      >
        ← → navigate · click to advance · ESC exit · F fullscreen
      </motion.div>
    </div>
  );
}
