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
    id: 'testimonials',
    type: 'testimonials' as const,
    label: 'SOCIAL PROOF',
    headline: 'Don\'t take our word for it.',
    testimonials: [
      {
        name: 'Sarah Whitfield',
        role: 'Founder, The Glow Studio',
        industry: 'Health & Wellness',
        quote: 'CrftdWeb turned our outdated site into a conversion machine. Bookings tripled in the first month — we had to hire two more therapists.',
        rating: 5,
        avatar: 'SW',
      },
      {
        name: 'James Okafor',
        role: 'MD, Apex Property Group',
        industry: 'Property Services',
        quote: 'Other agencies gave us templates. CrftdWeb gave us a competitive edge. Our CPL dropped 60% and leads have never been higher.',
        rating: 5,
        avatar: 'JO',
      },
      {
        name: 'Priya Sharma',
        role: 'Director, NoteWorthy Academy',
        industry: 'Education',
        quote: 'Fastest turnaround I\'ve ever seen. 12 days from brief to launch, and the site is genuinely the best in our industry.',
        rating: 5,
        avatar: 'PS',
      },
    ],
    trustStats: [
      { value: '50+', label: 'Projects Delivered' },
      { value: '4.9', label: 'Avg. Client Rating' },
      { value: '0', label: 'Refund Requests' },
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

function TestimonialsSlide({ data }: { data: typeof slides[6] }) {
  if (data.type !== 'testimonials') return null;
  return (
    <div className="flex flex-col justify-center h-full px-16 max-w-5xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[20%] w-[500px] h-[500px] bg-amber-500/[0.02] blur-3xl rounded-full pointer-events-none" />

      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-semibold tracking-[0.3em] text-amber-400 mb-6"
      >
        {data.label}
      </motion.span>
      <div className="overflow-hidden mb-12">
        <motion.h2
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-amber-200/50 bg-clip-text text-transparent"
        >
          {data.headline}
        </motion.h2>
      </div>

      {/* Testimonial cards */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        {data.testimonials?.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.15 + 0.15 * i, type: 'spring', stiffness: 80 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 relative overflow-hidden group hover:border-amber-500/15 transition-colors"
          >
            {/* Quote mark watermark */}
            <div className="absolute -top-2 -left-1 text-[80px] font-serif text-white/[0.03] leading-none pointer-events-none select-none">&ldquo;</div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }, (_, j) => (
                <motion.svg
                  key={j}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + 0.15 * i + 0.06 * j, type: 'spring' }}
                  className="w-3.5 h-3.5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-white/50 leading-relaxed mb-6 relative z-10">&ldquo;{t.quote}&rdquo;</p>

            {/* Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ delay: 0.5 + 0.15 * i, duration: 0.4 }}
              className="h-[1px] bg-amber-500/15 mb-4"
            />

            {/* Author */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + 0.15 * i, type: 'spring' }}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center"
              >
                <span className="text-[10px] font-bold text-amber-400/70">{t.avatar}</span>
              </motion.div>
              <div>
                <p className="text-sm font-medium text-white/80">{t.name}</p>
                <p className="text-[10px] text-white/25">{t.role}</p>
              </div>
            </div>

            {/* Industry tag */}
            <div className="absolute top-6 right-6">
              <span className="text-[9px] font-mono text-white/10 tracking-wider uppercase">{t.industry}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-12"
      >
        {data.trustStats?.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl font-bold text-white/80">{s.value}</div>
            <div className="text-[10px] text-white/20 tracking-wider uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ComparisonSlide({ data }: { data: typeof slides[7] }) {
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

function InvestmentSlide({ data }: { data: typeof slides[8] }) {
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

function CTASlide({ data }: { data: typeof slides[10] }) {
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
  const [activeView, setActiveView] = useState<'home' | 'pitch' | 'script'>('home');
  const [scriptSection, setScriptSection] = useState(0);
  const [stats, setStats] = useState<{
    activeReps: number;
    openLeads: number;
    pendingCommissions: number;
    pendingCommissionTotal: number;
    totalApplicants: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(() => {});
  }, []);
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

  const exitScript = useCallback(() => {
    setActiveView('home');
    setScriptSection(0);
  }, []);

  // Keyboard navigation (active during pitch or script)
  useEffect(() => {
    if (activeView === 'home') return;
    const handler = (e: KeyboardEvent) => {
      if (activeView === 'pitch') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goNext(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goPrev(); }
        if (e.key === 'f') { document.documentElement.requestFullscreen?.(); }
        if (e.key === 'Escape') { document.fullscreenElement ? document.exitFullscreen?.() : exitPitch(); }
      }
      if (activeView === 'script') {
        if (e.key === 'Escape') exitScript();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, activeView, exitPitch, exitScript]);

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

        {/* Live stats bar */}
        <div className="border-b border-white/[0.04] px-8 py-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Reps', value: stats?.activeReps, href: '/admin/reps', color: 'text-sky-400' },
              { label: 'Open Leads', value: stats?.openLeads, href: '/admin/leads', color: 'text-blue-400' },
              { label: 'Pending Commission', value: stats ? `£${stats.pendingCommissionTotal.toLocaleString()}` : null, href: '/admin/reps', color: 'text-amber-400' },
              { label: 'Applicants', value: stats?.totalApplicants, href: '/admin/applicants', color: 'text-purple-400' },
            ].map(s => (
              <a key={s.label} href={s.href} className="group flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl px-4 py-3 transition-colors">
                <div>
                  <div className={`text-xl font-bold tracking-tight ${s.color} ${stats === null ? 'opacity-20' : ''}`}>
                    {stats === null ? '—' : s.value}
                  </div>
                  <div className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{s.label}</div>
                </div>
              </a>
            ))}
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
                  11-slide presentation deck for sales calls. Covers problem, solution, process, results, social proof, and pricing.
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-400/60 font-medium">
                  <span>Launch presentation</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {/* Slide count badge */}
                <div className="absolute top-6 right-6 text-[10px] font-mono text-white/10 tracking-wider">
                  11 SLIDES
                </div>
              </motion.button>

              {/* Sales Script Card */}
              <motion.button
                onClick={() => setActiveView('script')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/15 transition-colors">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sales Script</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Live call cheat sheet. Openers, discovery questions, objection handlers, and closing lines.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400/60 font-medium">
                  <span>Open script</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="absolute top-6 right-6 text-[10px] font-mono text-white/10 tracking-wider">
                  9 SECTIONS
                </div>
              </motion.button>

            </div>

            {/* Business Documents */}
            <h2 className="text-xs font-semibold tracking-[0.3em] text-white/20 uppercase mt-12 mb-8">Business Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* Proposal Template */}
              <motion.a
                href="/docs/proposal-template.html"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 text-left hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-colors block"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/15 transition-colors">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Proposal</h3>
                <p className="text-xs text-white/35 leading-relaxed mb-3">Post-discovery call proposal to send to prospects.</p>
                <div className="flex items-center gap-1.5 text-xs text-indigo-400/60 font-medium">
                  <span>Open</span>
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Client Contract */}
              <motion.a
                href="/docs/client-contract.html"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 text-left hover:border-teal-500/30 hover:bg-teal-500/[0.03] transition-colors block"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:bg-teal-500/15 transition-colors">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Contract</h3>
                <p className="text-xs text-white/35 leading-relaxed mb-3">Client agreement — scope, fees, IP, and payment terms.</p>
                <div className="flex items-center gap-1.5 text-xs text-teal-400/60 font-medium">
                  <span>Open</span>
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Invoice */}
              <motion.a
                href="/docs/invoice-template.html"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 text-left hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-colors block"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/15 transition-colors">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Invoice</h3>
                <p className="text-xs text-white/35 leading-relaxed mb-3">Invoice template — deposit and final payment.</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400/60 font-medium">
                  <span>Open</span>
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Content Brief */}
              <motion.a
                href="/docs/content-briefing.html"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 text-left hover:border-orange-500/30 hover:bg-orange-500/[0.03] transition-colors block"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/15 transition-colors">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Content Brief</h3>
                <p className="text-xs text-white/35 leading-relaxed mb-3">Send to clients after deposit — everything needed to build.</p>
                <div className="flex items-center gap-1.5 text-xs text-orange-400/60 font-medium">
                  <span>Open</span>
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

            </div>

            {/* Rep tools section */}
            <h2 className="text-xs font-semibold tracking-[0.3em] text-white/20 uppercase mt-12 mb-8">Rep Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Rep Management */}
              <motion.a
                href="/admin/reps"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-sky-500/30 hover:bg-sky-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-5 group-hover:bg-sky-500/15 transition-colors">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Rep Management</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Applicant pipeline, onboarding playbook, active reps, commissions, and lead overview.
                </p>
                <div className="flex items-center gap-2 text-xs text-sky-400/60 font-medium">
                  <span>Manage reps</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Rep Training Leaderboard */}
              <motion.a
                href="/admin/training"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:bg-amber-500/15 transition-colors">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Rep Training</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Leaderboard, scores by category, rank progression, and training unlock status for all reps.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-400/60 font-medium">
                  <span>View leaderboard</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Emails */}
              <motion.a
                href="/admin/emails"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.09 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-violet-500/30 hover:bg-violet-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:bg-violet-500/15 transition-colors">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Emails</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Send booking links, view email previews, and manage outbound communications.
                </p>
                <div className="flex items-center gap-2 text-xs text-violet-400/60 font-medium">
                  <span>Manage emails</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Trial Submissions */}
              <motion.a
                href="/admin/trials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-teal-500/30 hover:bg-teal-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-5 group-hover:bg-teal-500/15 transition-colors">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Trial Submissions</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Review trial task submissions from applicants. Mark as reviewed, compare entries.
                </p>
                <div className="flex items-center gap-2 text-xs text-teal-400/60 font-medium">
                  <span>Review submissions</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Leads */}
              <motion.a
                href="/admin/leads"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.11 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/15 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Leads</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Track rep lead pipelines, deal values, and commission payouts across the team.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-400/60 font-medium">
                  <span>View pipeline</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Admin Live Call Tool */}
              <motion.a
                href="/admin/call"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-green-500/30 hover:bg-green-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 group-hover:bg-green-500/15 transition-colors">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Live Call Tool</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  AI pre-call prep, real-time suggestions, transcript logging, and post-call summary for your own calls.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-400/60 font-medium">
                  <span>Start a call</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>
            </div>

            {/* Operations */}
            <h2 className="text-xs font-semibold tracking-[0.3em] text-white/20 uppercase mt-12 mb-8">Operations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Clients */}
              <motion.a
                href="/admin/clients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-pink-500/30 hover:bg-pink-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-5 group-hover:bg-pink-500/15 transition-colors">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Clients</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Active client accounts, invoices, deliverables, feedback, and portal access.
                </p>
                <div className="flex items-center gap-2 text-xs text-pink-400/60 font-medium">
                  <span>Manage clients</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* Calendar */}
              <motion.a
                href="/admin/calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-cyan-500/30 hover:bg-cyan-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:bg-cyan-500/15 transition-colors">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H18v-.008zm0 2.25h.008v.008H18V15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Calendar</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  Screening slots, bookings, and scheduling — create and manage availability.
                </p>
                <div className="flex items-center gap-2 text-xs text-cyan-400/60 font-medium">
                  <span>View calendar</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

              {/* CV Review */}
              <motion.a
                href="/admin/cv-review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-left hover:border-rose-500/30 hover:bg-rose-500/[0.03] transition-colors block"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 group-hover:bg-rose-500/15 transition-colors">
                  <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">CV Review</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">
                  AI-powered CV analysis for rep applicants — score, feedback, and screening notes.
                </p>
                <div className="flex items-center gap-2 text-xs text-rose-400/60 font-medium">
                  <span>Review CVs</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Script view ───
  if (activeView === 'script') {
    const scriptSections = [
      // ── 1. PRE-SUASION FRAME (Cialdini Pre-Suasion + Klaff Prize Frame + Voss Accusation Audit) ──
      {
        id: 'frame',
        title: 'Set the Frame',
        color: 'cyan',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />,
        lines: [
          { type: 'say' as const, text: "Hey [Name], appreciate you making time. Before we dive in — I should be upfront. We're not the cheapest option out there, and we're not for everyone. We take on 4 projects a month max, and this call is as much for me to see if we're a fit as it is for you." },
          { type: 'say' as const, text: "You probably get pitched by agencies all the time, and I'm sure most of those calls are a waste of your time — so I'm not going to do that." },
          { type: 'say' as const, text: "Instead, I want to do something different. I'd like to spend 5 minutes understanding your business, and if I see a way I can genuinely help, I'll tell you exactly what I'd do. If not, I'll tell you that too and point you in the right direction. Fair?" },
        ],
        tip: 'PRE-SUASION: The "we\'re not for everyone" line triggers scarcity + prize frame (Klaff). The accusation audit (Voss) — "you probably get pitched all the time" — names their resistance before they feel it, which disarms it. Asking "Fair?" gets your first micro-commitment (Cialdini: Commitment/Consistency).',
      },
      // ── 2. SPIN DISCOVERY — Situation + Problem (Rackham SPIN + Pink Attunement) ──
      {
        id: 'situation',
        title: 'Discovery: Pain',
        color: 'blue',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
        lines: [
          { type: 'ask' as const, text: "Walk me through how a new customer typically finds you right now." },
          { type: 'ask' as const, text: "When someone lands on your website, what are you hoping they do?" },
          { type: 'ask' as const, text: "And is that actually happening — or is there a gap between the traffic you get and the enquiries you receive?" },
          { type: 'say' as const, text: "[MIRROR] So what I'm hearing is... [repeat their exact words back]. Did I get that right?" },
          { type: 'ask' as const, text: "What's your current site built on? And when was the last time it had a proper overhaul?" },
          { type: 'ask' as const, text: "What's the average lifetime value of a new customer to you? Rough number is fine." },
        ],
        tip: 'SPIN: These are Situation and Problem questions — get the facts, then surface the pain. MIRROR (Voss): Repeat back their last 1-3 words or paraphrase. They\'ll elaborate without you pushing. ATTUNEMENT (Pink): "Walk me through..." invites narrative, not yes/no. You learn 10x more.',
      },
      // ── 3. SPIN — Implication + Need-Payoff (The money questions) ──
      {
        id: 'implication',
        title: 'Discovery: Impact',
        color: 'indigo',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
        lines: [
          { type: 'ask' as const, text: "When someone visits your site and leaves without enquiring — what does that actually cost you? Like, per week, per month?" },
          { type: 'ask' as const, text: "How long has this been the situation? And what's that added up to over the last 12 months in lost revenue?" },
          { type: 'say' as const, text: "[LABEL] It sounds like you already know the site is holding you back — it's more a question of when you fix it, not if." },
          { type: 'ask' as const, text: "If we could get your website converting at even 2-3% instead of whatever it's doing now — and that happened within the next 30 days — what would that change for your business?" },
          { type: 'ask' as const, text: "What would it mean for you personally? Less stress? More freedom? Being able to invest in the parts of the business you actually enjoy?" },
        ],
        tip: 'IMPLICATION Qs (Rackham) make the pain 10x bigger WITHOUT you saying it — they calculate the cost themselves and feel it viscerally. NEED-PAYOFF Qs get them describing the dream outcome in their own words — now they\'re selling themselves. LABEL (Voss): "It sounds like..." names the emotion and makes them feel understood.',
      },
      // ── 4. COMMERCIAL INSIGHT — The Challenger Teach (Dixon + Klaff Novelty) ──
      {
        id: 'insight',
        title: 'The Insight',
        color: 'emerald',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />,
        lines: [
          { type: 'say' as const, text: "Can I share something with you that most business owners don't know? It might reframe how you think about your website entirely." },
          { type: 'stat' as const, text: "Google's research shows 53% of mobile visitors leave a site that takes longer than 3 seconds to load. The average WordPress site loads in 4.7 seconds. So more than half your traffic is gone before they even see your homepage." },
          { type: 'say' as const, text: "But here's the part nobody talks about — it's not just the speed. It's what happens AFTER they stay. Most websites are built like brochures. They have \"About\", \"Services\", \"Contact\" — and they expect the visitor to figure out what to do. That's like opening a shop with no salesperson." },
          { type: 'say' as const, text: "The businesses growing fastest right now have figured out that your website is your #1 salesperson. It works 24/7, never calls in sick, never forgets the pitch. But only if it's engineered to convert — not just look pretty." },
          { type: 'say' as const, text: "That's the shift. Most of your competitors are still treating their website as a digital business card. You have a window right now to leapfrog them — but that window closes once they figure this out too." },
        ],
        tip: 'CHALLENGER TEACH (Dixon): Don\'t lead with your product. Lead with an insight that reframes their problem. They should think "I never thought about it that way." NOVELTY (Klaff): New information triggers dopamine — their brain literally pays more attention after a stat they didn\'t know. URGENCY: "Window closes" creates time pressure without being pushy.',
      },
      // ── 5. THE PITCH — 3 Certainties (Belfort) + Contrast (Pink) + Reciprocity (Cialdini) ──
      {
        id: 'pitch',
        title: 'The Pitch',
        color: 'purple',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />,
        lines: [
          { type: 'say' as const, text: "Based on everything you've told me, I'm confident I can help. Let me show you exactly how." },
          { type: 'say' as const, text: "[CONTRAST — WHERE THEY ARE] Right now, you've got a [WordPress/template] site that loads in [X] seconds, isn't converting your traffic, and is essentially a cost centre on your balance sheet." },
          { type: 'say' as const, text: "[CONTRAST — WHERE THEY'D BE] What we'd build you is a fully custom-coded site, hand-built in Next.js — the same tech used by Nike, Netflix, and Notion. Sub-1.5-second loads. 95+ PageSpeed. Every section engineered to move the visitor toward [their goal]." },
          { type: 'say' as const, text: "[CERTAINTY 2: YOU] I've personally built sites for businesses in [their industry or similar]. I know what makes your customers tick, what they need to see, and when they need to see the CTA. This isn't our first time." },
          { type: 'say' as const, text: "We handle the full scope — strategy, design, copywriting structure, development, mobile, SEO foundations, analytics. You review and approve. We do the heavy lifting." },
          { type: 'say' as const, text: "Timeline is 14 days. Not because we rush — because we don't waste time on broken plugins, theme conflicts, and back-and-forth with offshore freelancers. It's just us, focused entirely on your project." },
          { type: 'stat' as const, text: "Our last 3 clients: a wellness studio saw +340% organic traffic, a property firm got +180% qualified leads, and a music academy saw +520% bookings. All within 90 days of launch." },
        ],
        tip: 'CONTRAST (Pink): Paint the "before" and "after" side-by-side so the gap is visceral. 3 CERTAINTIES (Belfort): Product certainty (it works), Personal certainty (I\'m the right person), Company certainty (CrftdWeb delivers). Hit all three or the sale dies. SOCIAL PROOF (Cialdini): Stats from similar businesses = "people like me got results."',
      },
      // ── 6. VALUE STACK + PRICING (Hormozi $100M Offers + Cialdini Anchoring) ──
      {
        id: 'pricing',
        title: 'Value & Pricing',
        color: 'amber',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />,
        lines: [
          { type: 'say' as const, text: "[ANCHOR HIGH] If you hired a top agency in London for this — custom design, custom code, conversion strategy — you'd be looking at £15-25K minimum. And you'd wait 8-12 weeks." },
          { type: 'say' as const, text: "[VALUE STACK] Here's what's included with us: custom-coded website, conversion-optimised wireframes, mobile-first responsive design, SEO technical setup, Google Analytics + heatmap integration, contact form with CRM routing, 30-90 day post-launch support, and a direct Slack line to me personally." },
          { type: 'say' as const, text: "[PRICE DROP] Our Growth package — which is what I'd recommend based on what you've told me — is £4,997. That includes up to 10 pages, conversion copy structure, booking integration, blog, and 90 days of support." },
          { type: 'say' as const, text: "[ROI MATH] You told me a new customer is worth roughly [£X] to you. So you'd need just [calculate: price ÷ customer value] new customers to cover the entire investment. After that, every enquiry your site generates is pure profit." },
          { type: 'say' as const, text: "[RISK REVERSAL] And here's the thing — we offer a 100% money-back guarantee. If at any point before launch you're not completely happy with what we've built, you don't pay. Full refund. We've never had to use it, but it means you're risking nothing." },
          { type: 'say' as const, text: "[SCARCITY — REAL] The reason I mentioned we take 4 projects a month — I've got [X] slots open for [month]. Once those fill, the next available start date is [month + 5 weeks]." },
        ],
        tip: 'VALUE EQUATION (Hormozi): Dream Outcome × Perceived Likelihood ÷ Time Delay × Effort Required. Stack the value BEFORE the price so the number feels small by comparison. ANCHOR (Cialdini): £15-25K agency anchor makes £4,997 feel like a steal. ROI MATH: When THEY do the maths, the price objection dies before it starts. SCARCITY: Must be real — manufactured urgency destroys trust.',
      },
      // ── 7. OBJECTION HANDLERS (Voss + Belfort + Cardone) ──
      {
        id: 'objections',
        title: 'Objections',
        color: 'red',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zm0 13.036h.008v.008H12v-.008z" />,
        lines: [
          { type: 'objection' as const, text: '"It\'s too expensive"', response: "That's a fair concern — and I'd be worried if you didn't think carefully about where you invest. Let me ask you this: you said you're losing roughly [£X/month] in missed conversions. If we don't fix the site, that's [£X × 12] over the next year. So the real question isn't whether you can afford to do this — it's whether you can afford not to. And with the guarantee, the downside is literally zero." },
          { type: 'objection' as const, text: '"I need to think about it"', response: "I completely respect that. Can I ask — what specifically feels unresolved? Is it the investment, the timing, or whether it'll actually work? [WAIT — let them answer]. The reason I ask is, in my experience, 'thinking about it' usually means there's one specific thing I haven't addressed. If I can answer that now, it saves you carrying it around. And if you still want time after — no pressure at all." },
          { type: 'objection' as const, text: '"I need to talk to my partner / team"', response: "Makes total sense — a decision like this should involve the right people. What would be most helpful: should I jump on a quick 10-minute call with both of you, or put together a one-page summary they can review? I find that usually moves things forward faster than playing telephone." },
          { type: 'objection' as const, text: '"I already have a web person"', response: "That's great — it tells me you already value having quality online. Genuine question though: if your current setup was converting the way you wanted, would we be having this conversation? I'm not here to replace anyone. But there's a difference between someone who maintains a site and someone who engineers it to sell. We can even work alongside your existing dev." },
          { type: 'objection' as const, text: '"Can you do it cheaper?"', response: "I could reduce the scope — but I wouldn't reduce the quality. Here's why: the reason our sites outperform is because every detail is intentional. Cut one element and the conversion system breaks. It's like asking a surgeon to skip a step to save time. What I can do is start with the Launch package at £2,497 and upgrade later as you see results. That way you're investing less upfront but still getting the quality." },
          { type: 'objection' as const, text: '"14 days sounds rushed"', response: "I used to think that too. But here's the reality — our 14 days of focused work equals about 8 weeks of agency time. Most of their timeline is you waiting: waiting for feedback loops, waiting for their offshore dev team, waiting for plugin fixes. We don't have any of that. It's one team, full focus, zero bureaucracy. Every project we've ever done launched on time or early." },
          { type: 'objection' as const, text: '"I want to compare a few quotes"', response: "Smart move — you should. All I'd ask is that when you compare, you're comparing apples to apples. Ask them: is it custom-coded or a template? What's the guaranteed PageSpeed score? What happens if you're not happy? Do you get a direct line to the developer? And what's the refund policy? I'm confident in where we land when you compare on substance, not just price." },
        ],
        tip: 'LABEL FIRST (Voss): "That\'s a fair concern" validates the emotion before countering. CALIBRATED QUESTIONS: "What specifically..." makes them reveal the real objection. LOOPING (Belfort): Address the objection, then loop back to a certainty they already agreed with. NEVER ARGUE (Cardone): The moment you argue, you lose. Agree, redirect, reframe.',
      },
      // ── 8. THE CLOSE — Commitment Stacking (Cardone + Cialdini + Voss) ──
      {
        id: 'close',
        title: 'The Close',
        color: 'violet',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
        lines: [
          { type: 'say' as const, text: "[SUMMARY CLOSE] So just to recap where we've landed — you need a site that [repeat their goal], you want it done properly without the 3-month agency runaround, and you want to see a return within 90 days. Does that sound right?" },
          { type: 'say' as const, text: "[DIRECT CLOSE — ATTEMPT 1] Based on everything we've covered, I think we're a great fit. Would you like to go ahead? I can send you a deposit link right now and we'll have your kickoff call booked by tomorrow." },
          { type: 'say' as const, text: "[IF YES — LOCK IT] Perfect. I'll send the deposit link to your phone right now — 50% secures your slot, the rest on launch. You'll get a confirmation email within 5 minutes with your kickoff date and everything we discussed. [Send link immediately — do not wait.]" },
          { type: 'say' as const, text: "[URGENCY CALLBACK] And just so you know — I mentioned we take 4 projects a month. I've got [X] slots left for [month], and one of those is pencilled for another prospect I spoke to earlier this week. So the sooner we lock yours in, the better." },
          { type: 'say' as const, text: "[IF HESITATION — FALLBACK TO PROPOSAL] Completely fair. Here's what I'd suggest instead — I'll put together a custom proposal. Scope, wireframe mockup, timeline, investment — tailored to everything we just discussed. You'll have it in your inbox within 24 hours." },
          { type: 'say' as const, text: "[MICRO-COMMITMENT] Have a read through, share it with [partner/team] if you need to, and if it looks right, we lock in your slot. Sound fair?" },
          { type: 'say' as const, text: "[ASSUMPTIVE] What's the best email to send that to?" },
          { type: 'say' as const, text: "[AFTER THEY GIVE EMAIL] Perfect. Are you on WhatsApp? I'll send you a quick confirmation there too so it doesn't get buried in your inbox." },
          { type: 'say' as const, text: "[CONVICTION TRANSFER] Honestly [Name], I'm excited about this one. The businesses like yours are exactly where we see the biggest transformations. I'll make sure the proposal reflects that." },
          { type: 'say' as const, text: "[FINAL PIN — BOOK NEXT STEP BEFORE HANGING UP] One last thing — let's get a 10-minute follow-up in the diary for [2-3 days out]. That way you've had time to review and we can answer any questions while it's fresh. What works — [Day] morning or [Day] afternoon?" },
        ],
        tip: 'TWO-TRACK CLOSE: Always attempt the same-call close first. The proposal is the fallback, not the default. Most reps leave money on the table by never asking directly. DEPOSIT LINK (Belfort): Speed kills doubt — the gap between "yes" and payment is where deals die. Send the link while they\'re still on the phone. URGENCY CALLBACK: Reinforce scarcity at the decision point, not just in pricing. PIN THE NEXT STEP (Cardone): Never end a call without a booked follow-up. An unbooked prospect is a lost prospect. CONVICTION TRANSFER (Belfort): Your genuine excitement is contagious — if you believe it, they believe it.',
      },
      // ── 9. POST-CALL — Reciprocity Lock + Follow-up System ──
      {
        id: 'postcall',
        title: 'After the Call',
        color: 'rose',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />,
        lines: [
          { type: 'say' as const, text: "[WITHIN 5 MINS — WhatsApp] Hey [Name] 👋 Great chatting just now. Starting on your proposal now — you'll have it by [specific time tomorrow]. Talk soon." },
          { type: 'say' as const, text: "[WITHIN 1 HOUR — Email] Subject: '[Name] x CrftdWeb — Your Proposal'. Include a brief recap of what you discussed, 1-2 insights specific to their industry, and a timeline of next steps. Attach no proposal yet — just set the stage." },
          { type: 'say' as const, text: "[RECIPROCITY GIFT — Same day] Send them something useful for free before the proposal. A 2-minute Loom video auditing their current site, or a quick PageSpeed screenshot with 3 quick-win suggestions. This triggers reciprocity — they feel obligated to engage." },
          { type: 'say' as const, text: "[WITHIN 24 HOURS] Send the full proposal. Keep it visual — one page, not a 12-page PDF. Include before/after concepts if possible. End with a clear CTA: 'Reply YES to lock in your [month] slot.'" },
          { type: 'say' as const, text: "[IF NO REPLY IN 48H] 'Hey [Name], just floating this back to the top — I've got [Name]'s project kicking off on [date] and wanted to confirm your slot before it goes. No rush, but wanted to keep you in the loop.'" },
          { type: 'say' as const, text: "[IF NO REPLY IN 7 DAYS] 'Totally understand if the timing isn't right, [Name]. I'll keep your brief on file — if things change in the next few months, just ping me and we'll pick up where we left off. Wishing you a great [season]. — Obi'" },
        ],
        tip: 'RECIPROCITY (Cialdini): The free Loom audit is the most powerful move in the entire script. Give value first = they feel compelled to reciprocate. SCARCITY + SOCIAL PROOF in follow-up: Mentioning another project kicking off implies demand without being sleazy. GRACEFUL EXIT: The 7-day message preserves the relationship for future conversion — 40% of deals close in months 2-6.',
      },
    ];

    const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; dot: string }> = {
      cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'bg-cyan-500/[0.03]', dot: 'bg-cyan-400' },
      blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', glow: 'bg-blue-500/[0.03]', dot: 'bg-blue-400' },
      indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', glow: 'bg-indigo-500/[0.03]', dot: 'bg-indigo-400' },
      emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'bg-emerald-500/[0.03]', dot: 'bg-emerald-400' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', glow: 'bg-purple-500/[0.03]', dot: 'bg-purple-400' },
      amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'bg-amber-500/[0.03]', dot: 'bg-amber-400' },
      red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', glow: 'bg-red-500/[0.03]', dot: 'bg-red-400' },
      violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'bg-violet-500/[0.03]', dot: 'bg-violet-400' },
      rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', glow: 'bg-rose-500/[0.03]', dot: 'bg-rose-400' },
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex">
        {/* Sidebar nav */}
        <div className="w-64 border-r border-white/[0.06] flex flex-col fixed top-0 left-0 bottom-0 z-20">
          <div className="px-5 py-5 border-b border-white/[0.06]">
            <button
              onClick={exitScript}
              className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to dashboard
            </button>
            <h2 className="text-lg font-bold text-white mt-4 tracking-tight">Sales Script</h2>
            <p className="text-[10px] text-white/20 mt-1 tracking-wider uppercase">Live call reference</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {scriptSections.map((s, i) => {
              const c = colorMap[s.color];
              const isActive = scriptSection === i;
              return (
                <button
                  key={s.id}
                  onClick={() => setScriptSection(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? `${c.glow} border ${c.border}`
                      : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${isActive ? c.bg : 'bg-white/[0.04]'} flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-4 h-4 ${isActive ? c.text : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {s.icon}
                    </svg>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>{s.title}</span>
                    <span className={`block text-[9px] tracking-wider ${isActive ? c.text + ' opacity-60' : 'text-white/15'}`}>
                      {s.lines.length} {s.id === 'objections' ? 'handlers' : 'lines'}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
          {/* Quick key hint */}
          <div className="px-5 py-4 border-t border-white/[0.06]">
            <p className="text-[9px] text-white/10 font-mono tracking-wider">ESC to exit</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={scriptSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto px-12 py-14"
            >
              {(() => {
                const s = scriptSections[scriptSection];
                const c = colorMap[s.color];
                return (
                  <>
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                        <svg className={`w-5 h-5 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {s.icon}
                        </svg>
                      </div>
                      <div>
                        <span className={`text-[10px] font-semibold tracking-[0.3em] ${c.text} uppercase`}>
                          SECTION {scriptSection + 1} OF {scriptSections.length}
                        </span>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{s.title}</h2>
                      </div>
                    </div>

                    {/* Tip banner */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className={`mt-6 mb-10 px-5 py-3.5 rounded-xl ${c.glow} border ${c.border} flex items-start gap-3`}
                    >
                      <svg className={`w-4 h-4 ${c.text} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                      <p className="text-sm text-white/40 leading-relaxed italic">{s.tip}</p>
                    </motion.div>

                    {/* Lines */}
                    <div className="space-y-4">
                      {s.lines.map((line, li) => (
                        <motion.div
                          key={li}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 + 0.06 * li, type: 'spring', stiffness: 120, damping: 18 }}
                        >
                          {line.type === 'say' && (
                            <div className="flex items-start gap-4 group">
                              <div className="flex-shrink-0 mt-1.5">
                                <div className={`w-2 h-2 rounded-full ${c.dot} opacity-40`} />
                              </div>
                              <div className="flex-1">
                                <span className={`text-[9px] font-bold tracking-[0.2em] ${c.text} opacity-50 uppercase`}>SAY</span>
                                <p className="text-[15px] text-white/70 leading-relaxed mt-1">&ldquo;{line.text}&rdquo;</p>
                              </div>
                            </div>
                          )}
                          {line.type === 'ask' && (
                            <div className="flex items-start gap-4 group">
                              <div className="flex-shrink-0 mt-1.5">
                                <div className={`w-2 h-2 rounded-full ${c.dot} opacity-40`} />
                              </div>
                              <div className="flex-1">
                                <span className={`text-[9px] font-bold tracking-[0.2em] ${c.text} opacity-50 uppercase`}>ASK</span>
                                <p className="text-[15px] text-white/70 leading-relaxed mt-1">&ldquo;{line.text}&rdquo;</p>
                              </div>
                            </div>
                          )}
                          {line.type === 'stat' && (
                            <div className="flex items-start gap-4 group">
                              <div className="flex-shrink-0 mt-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-400 opacity-60" />
                              </div>
                              <div className="flex-1 bg-green-500/[0.04] border border-green-500/10 rounded-xl px-5 py-3">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-green-400 opacity-60 uppercase">DROP THE STAT</span>
                                <p className="text-[15px] text-green-300/70 leading-relaxed mt-1 font-medium">&ldquo;{line.text}&rdquo;</p>
                              </div>
                            </div>
                          )}
                          {line.type === 'objection' && 'response' in line && (
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                              <div className="px-5 py-3.5 bg-red-500/[0.04] border-b border-red-500/10">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-red-400 opacity-60 uppercase">THEY SAY</span>
                                <p className="text-[15px] text-red-300/60 mt-1 font-medium">{line.text}</p>
                              </div>
                              <div className="px-5 py-4">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-400 opacity-60 uppercase">YOU SAY</span>
                                <p className="text-[15px] text-white/60 leading-relaxed mt-1">&ldquo;{line.response}&rdquo;</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Navigation footer */}
                    <div className="flex items-center justify-between mt-14 pt-6 border-t border-white/[0.06]">
                      <button
                        onClick={() => setScriptSection(Math.max(0, scriptSection - 1))}
                        disabled={scriptSection === 0}
                        className="flex items-center gap-2 text-sm text-white/25 hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {scriptSection > 0 ? scriptSections[scriptSection - 1].title : ''}
                      </button>
                      <span className="text-[10px] font-mono text-white/10 tracking-wider">
                        {scriptSection + 1} / {scriptSections.length}
                      </span>
                      <button
                        onClick={() => setScriptSection(Math.min(scriptSections.length - 1, scriptSection + 1))}
                        disabled={scriptSection === scriptSections.length - 1}
                        className="flex items-center gap-2 text-sm text-white/25 hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {scriptSection < scriptSections.length - 1 ? scriptSections[scriptSection + 1].title : ''}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
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
      case 'testimonials': return <TestimonialsSlide data={slide as typeof slides[6]} />;
      case 'comparison': return <ComparisonSlide data={slide as typeof slides[7]} />;
      case 'investment': return <InvestmentSlide data={slide as typeof slides[8]} />;
      case 'cta': return <CTASlide data={slide as typeof slides[10]} />;
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
