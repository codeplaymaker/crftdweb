'use client';

import { motion } from 'framer-motion';

/* ========================================
   TRAIN DESIGN SYSTEM — Visual Components
   T = Typography (handled via Tailwind classes)
   R = Restraint (emerald/teal/white palette)
   A = Alignment (consistent max-w, grid, spacing)
   I = Image Treatment (SVG illustrations)
   N = Negative Space (generous padding/margins)
   ======================================== */

/* ----------------------------------------
   VISUAL DEVICE: LOOP (Cyclical feedback)
   Used by: Prove page (Proof & Price Loop),
   Systems page (7-system flywheel)
   ---------------------------------------- */
export function ProofPriceLoop({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full max-w-[400px] mx-auto" fill="none">
        {/* Outer ring */}
        <motion.circle
          cx="200" cy="200" r="160"
          stroke="url(#loopGradient)" strokeWidth="2" strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        {/* Animated flow arrows on the ring */}
        <motion.path
          d="M 200 40 A 160 160 0 0 1 360 200"
          stroke="rgba(52,211,153,0.3)" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.path
          d="M 360 200 A 160 160 0 0 1 200 360"
          stroke="rgba(52,211,153,0.25)" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.0 }}
        />
        <motion.path
          d="M 200 360 A 160 160 0 0 1 40 200"
          stroke="rgba(52,211,153,0.2)" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        />
        <motion.path
          d="M 40 200 A 160 160 0 0 1 200 40"
          stroke="rgba(52,211,153,0.4)" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 2.0 }}
        />

        {/* Node: Get Proof (top) */}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <circle cx="200" cy="40" r="32" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          <text x="200" y="36" textAnchor="middle" className="fill-emerald-400 text-[11px] font-semibold">Get</text>
          <text x="200" y="50" textAnchor="middle" className="fill-emerald-400 text-[11px] font-semibold">Proof</text>
        </motion.g>

        {/* Node: Get Paid (right) */}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
          <circle cx="360" cy="200" r="32" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          <text x="360" y="196" textAnchor="middle" className="fill-emerald-400 text-[11px] font-semibold">Get</text>
          <text x="360" y="210" textAnchor="middle" className="fill-emerald-400 text-[11px] font-semibold">Paid</text>
        </motion.g>

        {/* Node: More Proof (bottom) */}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}>
          <circle cx="200" cy="360" r="32" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          <text x="200" y="356" textAnchor="middle" className="fill-emerald-300 text-[11px] font-semibold">More</text>
          <text x="200" y="370" textAnchor="middle" className="fill-emerald-300 text-[11px] font-semibold">Proof</text>
        </motion.g>

        {/* Node: Paid More (left) */}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}>
          <circle cx="40" cy="200" r="32" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          <text x="40" y="196" textAnchor="middle" className="fill-emerald-300 text-[11px] font-semibold">Paid</text>
          <text x="40" y="210" textAnchor="middle" className="fill-emerald-300 text-[11px] font-semibold">More</text>
        </motion.g>

        {/* Directional arrows */}
        <polygon points="290,78 298,90 282,90" fill="rgba(52,211,153,0.5)" />
        <polygon points="322,310 310,318 318,302" fill="rgba(52,211,153,0.4)" />
        <polygon points="110,322 102,310 118,310" fill="rgba(52,211,153,0.35)" />
        <polygon points="78,90 90,82 82,98" fill="rgba(52,211,153,0.5)" />

        {/* Center label */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <text x="200" y="195" textAnchor="middle" className="fill-white text-[13px] font-bold">The Loop</text>
          <text x="200" y="212" textAnchor="middle" className="fill-white/40 text-[10px]">compounds forever</text>
        </motion.g>

        <defs>
          <linearGradient id="loopGradient" x1="0" y1="0" x2="400" y2="400">
            <stop offset="0%" stopColor="rgba(16,185,129,0.3)" />
            <stop offset="50%" stopColor="rgba(20,184,166,0.3)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.3)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: FLOW (Sequential A → B)
   Used by: Productize (Skill→Result→...),
   Landing page (Productization Path)
   ---------------------------------------- */
export function ProductizationFlow({ className = '' }: { className?: string }) {
  const steps = [
    { label: 'Skill', sublabel: 'What can you do?', color: '#f97316' },
    { label: 'Result', sublabel: 'What outcome?', color: '#eab308' },
    { label: 'Specialize', sublabel: 'For whom?', color: '#10b981' },
    { label: 'Productize', sublabel: 'How to scale?', color: '#14b8a6' },
  ];
  return (
    <div className={className}>
      <svg viewBox="0 0 720 120" className="w-full" fill="none">
        {steps.map((step, i) => {
          const x = i * 180 + 10;
          return (
            <motion.g
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              {/* Box */}
              <rect x={x} y="20" width="140" height="80" rx="16"
                fill={`${step.color}15`} stroke={`${step.color}40`} strokeWidth="1.5" />
              {/* Label */}
              <text x={x + 70} y="55" textAnchor="middle"
                className="fill-white text-[14px] font-semibold">{step.label}</text>
              <text x={x + 70} y="75" textAnchor="middle"
                className="fill-white/40 text-[10px]">{step.sublabel}</text>
              {/* Arrow */}
              {i < steps.length - 1 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.2 + 0.15 }}
                >
                  <line x1={x + 148} y1="60" x2={x + 172} y2="60"
                    stroke="rgba(52,211,153,0.4)" strokeWidth="2" strokeLinecap="round" />
                  <polygon points={`${x + 172},55 ${x + 180},60 ${x + 172},65`}
                    fill="rgba(52,211,153,0.5)" />
                </motion.g>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: COMPARISON (Side-by-side)
   Used by: Landing page (Time vs Value),
   Scale page (Active vs Passive)
   ---------------------------------------- */
export function TimeVsValueComparison({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 600 280" className="w-full max-w-[600px] mx-auto" fill="none">
        {/* Left: Time for Money */}
        <motion.g initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <rect x="10" y="10" width="270" height="260" rx="20" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" />
          {/* Clock icon */}
          <circle cx="145" cy="70" r="24" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" fill="none" />
          <line x1="145" y1="70" x2="145" y2="56" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" />
          <line x1="145" y1="70" x2="157" y2="70" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" />
          <text x="145" y="120" textAnchor="middle" className="fill-red-400 text-[13px] font-bold">Time for Money</text>
          <text x="145" y="142" textAnchor="middle" className="fill-white/40 text-[10px]">Do it once, get paid once.</text>
          <text x="145" y="158" textAnchor="middle" className="fill-white/40 text-[10px]">Do it again tomorrow.</text>
          {/* Reset bars */}
          {[0, 1, 2, 3, 4].map(i => {
            const heights = [38, 32, 44, 35, 41];
            return (
              <g key={i}>
                <rect x={55 + i * 36} y={185} width="28" height={heights[i]} rx="4" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
                <line x1={55 + i * 36} y1={230} x2={55 + i * 36 + 28} y2={230} stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="3 2" />
              </g>
            );
          })}
          <text x="145" y="258" textAnchor="middle" className="fill-red-400/50 text-[9px]">↻ Resets every morning</text>
        </motion.g>

        {/* Right: Value for Money */}
        <motion.g initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <rect x="320" y="10" width="270" height="260" rx="20" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" />
          {/* Diamond icon */}
          <motion.path d="M 455 50 L 475 70 L 455 90 L 435 70 Z" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" fill="rgba(16,185,129,0.1)"
            initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
          <text x="455" y="120" textAnchor="middle" className="fill-emerald-400 text-[13px] font-bold">Value for Money</text>
          <text x="455" y="142" textAnchor="middle" className="fill-white/40 text-[10px]">Do it once, get paid indefinitely.</text>
          <text x="455" y="158" textAnchor="middle" className="fill-white/40 text-[10px]">The count rolls over. Always.</text>
          {/* Compound bars */}
          {[0, 1, 2, 3, 4].map(i => (
            <motion.rect
              key={i}
              x={365 + i * 36} y={230 - (15 + i * 12)}
              width="28" height={15 + i * 12} rx="4"
              fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.2)" strokeWidth="1"
              initial={{ height: 0, y: 230 }}
              animate={{ height: 15 + i * 12, y: 230 - (15 + i * 12) }}
              transition={{ delay: 0.5 + i * 0.15 }}
            />
          ))}
          <text x="455" y="258" textAnchor="middle" className="fill-emerald-400/50 text-[9px]">↗ Compounds over time</text>
        </motion.g>

        {/* Center divider */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <line x1="300" y1="40" x2="300" y2="240" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="300" cy="140" r="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <text x="300" y="144" textAnchor="middle" className="fill-white/30 text-[10px] font-bold">→</text>
        </motion.g>
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: HIERARCHY / FLOW
   Used by: Systemize (7 systems flywheel)
   ---------------------------------------- */
export function SystemsFlowDiagram({ className = '' }: { className?: string }) {
  const systems = [
    { label: 'Marketing', icon: '📢', color: '#10b981' },
    { label: 'Qualifying', icon: '🎯', color: '#14b8a6' },
    { label: 'Application', icon: '📋', color: '#06b6d4' },
    { label: 'Onboarding', icon: '🚀', color: '#0ea5e9' },
    { label: 'Work', icon: '⚙️', color: '#6366f1' },
    { label: 'Testimonials', icon: '⭐', color: '#8b5cf6' },
    { label: 'Loop', icon: '🔄', color: '#10b981' },
  ];

  return (
    <div className={className}>
      <svg viewBox="0 0 700 140" className="w-full" fill="none">
        {systems.map((sys, i) => {
          const x = i * 96 + 14;
          return (
            <motion.g
              key={sys.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Node */}
              <rect x={x} y="20" width="80" height="80" rx="16"
                fill={`${sys.color}10`} stroke={`${sys.color}30`} strokeWidth="1.5" />
              <text x={x + 40} y="55" textAnchor="middle" className="text-[20px]">{sys.icon}</text>
              <text x={x + 40} y="78" textAnchor="middle" className="fill-white/70 text-[9px] font-medium">{sys.label}</text>
              <text x={x + 40} y="92" textAnchor="middle" className="fill-white/30 text-[8px]">0{i + 1}</text>
              {/* Arrow */}
              {i < systems.length - 1 && (
                <motion.line
                  x1={x + 84} y1="60" x2={x + 92} y2="60"
                  stroke={`${sys.color}40`} strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.1 + 0.05 }}
                />
              )}
            </motion.g>
          );
        })}
        {/* Loop-back arrow at bottom */}
        <motion.path
          d="M 670 100 C 670 130, 350 135, 30 100"
          stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" strokeDasharray="4 4"
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />
        <motion.polygon
          points="30,94 22,102 34,105"
          fill="rgba(16,185,129,0.4)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        />
        <motion.text
          x="350" y="130"
          textAnchor="middle"
          className="fill-emerald-400/30 text-[9px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Testimonials feed back into marketing — the flywheel never stops
        </motion.text>
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: SCALE (Size = significance)
   Used by: Scale page, 10X Pricing
   ---------------------------------------- */
export function PricingScale({ className = '' }: { className?: string }) {
  const tiers = [
    { price: '$19', label: 'Template', value: '$190', h: 30 },
    { price: '$99', label: 'Course', value: '$990', h: 50 },
    { price: '$499', label: 'Curriculum', value: '$5K', h: 75 },
    { price: '$5K', label: 'Done-For-You', value: '$50K', h: 105 },
    { price: '$20K', label: 'Consulting', value: '$200K', h: 140 },
  ];

  return (
    <div className={className}>
      <svg viewBox="0 0 520 200" className="w-full max-w-[520px] mx-auto" fill="none">
        {tiers.map((tier, i) => {
          const x = i * 100 + 20;
          const y = 170 - tier.h;
          return (
            <motion.g
              key={tier.price}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.rect
                x={x} y={y} width="72" height={tier.h} rx="8"
                fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5"
                initial={{ height: 0, y: 170 }}
                animate={{ height: tier.h, y }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              />
              <text x={x + 36} y={y - 8} textAnchor="middle" className="fill-emerald-400 text-[11px] font-bold">{tier.price}</text>
              <text x={x + 36} y={185} textAnchor="middle" className="fill-white/40 text-[8px]">{tier.label}</text>
              <text x={x + 36} y={195} textAnchor="middle" className="fill-emerald-400/40 text-[7px]">→ {tier.value}</text>
            </motion.g>
          );
        })}
        {/* 10X label */}
        <motion.text x="260" y="16" textAnchor="middle" className="fill-white/20 text-[10px] font-medium"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          10X Return at Every Tier
        </motion.text>
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: CONTINUUM / SPECTRUM
   Used by: Value section (Don't do → Can't do),
   Diagnose (stage progression)
   ---------------------------------------- */
export function ValueSpectrum({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 600 100" className="w-full max-w-[600px] mx-auto" fill="none">
        {/* Gradient bar */}
        <defs>
          <linearGradient id="spectrumGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(239,68,68,0.3)" />
            <stop offset="50%" stopColor="rgba(234,179,8,0.3)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.3)" />
          </linearGradient>
        </defs>
        <motion.rect x="50" y="35" width="500" height="8" rx="4" fill="url(#spectrumGrad)"
          initial={{ width: 0 }} animate={{ width: 500 }} transition={{ duration: 1 }} />
        
        {/* Markers */}
        {[
          { x: 50, label: "Don't do", sub: 'Low value', color: '#ef4444' },
          { x: 300, label: "Won't do", sub: 'Medium value', color: '#eab308' },
          { x: 550, label: "Can't do", sub: 'High value', color: '#10b981' },
        ].map((m, i) => (
          <motion.g key={m.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.2 }}>
            <circle cx={m.x} cy="39" r="6" fill={m.color} />
            <text x={m.x} y="65" textAnchor="middle" className="fill-white text-[11px] font-semibold">{m.label}</text>
            <text x={m.x} y="80" textAnchor="middle" className="fill-white/30 text-[9px]">{m.sub}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: STACKING (Layered)
   Used by: 6 Build Stages progression
   ---------------------------------------- */
export function StagesStack({ className = '' }: { className?: string }) {
  const stages = [
    { label: 'Authority', color: '#06b6d4' },
    { label: 'Product', color: '#14b8a6' },
    { label: 'Reputation', color: '#10b981' },
    { label: 'Process', color: '#eab308' },
    { label: 'Skill', color: '#f97316' },
    { label: 'Mindset', color: '#ef4444' },
  ];

  return (
    <div className={className}>
      <svg viewBox="0 0 300 280" className="w-full max-w-[300px] mx-auto" fill="none">
        {stages.map((s, i) => {
          const y = i * 40 + 20;
          const w = 200 + (stages.length - 1 - i) * 16;
          const x = (300 - w) / 2;
          return (
            <motion.g key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (stages.length - 1 - i) * 0.12 }}
            >
              <rect x={x} y={y} width={w} height="34" rx="8"
                fill={`${s.color}12`} stroke={`${s.color}30`} strokeWidth="1.5" />
              <text x="150" y={y + 20} textAnchor="middle" className="fill-white/80 text-[11px] font-medium">{s.label}</text>
              <text x={x + 12} y={y + 20} textAnchor="start" className="fill-white/20 text-[9px]">0{stages.length - i}</text>
            </motion.g>
          );
        })}
        {/* Arrow on right */}
        <motion.line x1="270" y1="260" x2="270" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="3 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }} />
        <motion.polygon points="266,30 270,20 274,30" fill="rgba(255,255,255,0.15)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
        <motion.text x="270" y="14" textAnchor="middle" className="fill-white/20 text-[8px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          Growth
        </motion.text>
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: POSITION (Where you are)
   Used by: Diagnose results, Prescribe header
   Shows current stage in a 6-stage progression
   ---------------------------------------- */
export function StagePositionIndicator({
  currentStage,
  className = '',
}: {
  currentStage: string;
  className?: string;
}) {
  const stages = [
    { label: 'Mindset', color: '#ef4444' },
    { label: 'Skill', color: '#f97316' },
    { label: 'Process', color: '#eab308' },
    { label: 'Reputation', color: '#10b981' },
    { label: 'Product', color: '#14b8a6' },
    { label: 'Authority', color: '#06b6d4' },
  ];
  const activeIndex = stages.findIndex(
    (s) => s.label.toLowerCase() === currentStage.toLowerCase()
  );

  return (
    <div className={className}>
      <svg viewBox="0 0 660 100" className="w-full max-w-[660px] mx-auto" fill="none">
        {/* Connecting line */}
        <motion.line
          x1="55" y1="35" x2="605" y2="35"
          stroke="rgba(255,255,255,0.08)" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* Filled progress line */}
        {activeIndex >= 0 && (
          <motion.line
            x1="55" y1="35"
            x2={55 + activeIndex * 110} y2="35"
            stroke="rgba(16,185,129,0.4)" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        )}
        {stages.map((s, i) => {
          const x = i * 110 + 55;
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <motion.g
              key={s.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Glow ring for active */}
              {isActive && (
                <motion.circle
                  cx={x} cy="35" r="22"
                  fill="none" stroke={s.color} strokeWidth="1" strokeOpacity={0.3}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
              {/* Circle node */}
              <circle
                cx={x} cy="35" r="16"
                fill={isActive ? `${s.color}30` : isPast ? `${s.color}15` : 'rgba(255,255,255,0.03)'}
                stroke={isActive ? s.color : isPast ? `${s.color}40` : 'rgba(255,255,255,0.1)'}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {/* Number */}
              <text
                x={x} y="39" textAnchor="middle"
                className={`text-[10px] font-bold ${isActive ? 'fill-white' : isPast ? 'fill-white/50' : 'fill-white/20'}`}
              >
                {i + 1}
              </text>
              {/* Label */}
              <text
                x={x} y="70" textAnchor="middle"
                className={`text-[9px] font-medium ${isActive ? 'fill-white' : isPast ? 'fill-white/40' : 'fill-white/20'}`}
              >
                {s.label}
              </text>
              {/* "You are here" indicator */}
              {isActive && (
                <motion.text
                  x={x} y="88" textAnchor="middle"
                  className="fill-emerald-400/60 text-[7px] font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  YOU ARE HERE
                </motion.text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: MILESTONE FLOW (Track page)
   Linear milestone stages with completion
   ---------------------------------------- */
export function MilestoneProgressFlow({
  stageCompletions,
  className = '',
}: {
  stageCompletions: { stage: string; completed: number; total: number }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <svg viewBox="0 0 660 80" className="w-full max-w-[660px] mx-auto" fill="none">
        {stageCompletions.map((sc, i) => {
          const x = i * 110 + 5;
          const pct = sc.total > 0 ? sc.completed / sc.total : 0;
          const fillH = Math.round(pct * 40);
          return (
            <motion.g
              key={sc.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Background bar */}
              <rect x={x} y="10" width="100" height="40" rx="10"
                fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              {/* Fill bar */}
              <motion.rect
                x={x} y={10 + (40 - fillH)} width="100" height={fillH} rx="10"
                fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.2)" strokeWidth="1"
                initial={{ height: 0, y: 50 }}
                animate={{ height: fillH, y: 10 + (40 - fillH) }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
              {/* Label */}
              <text x={x + 50} y="35" textAnchor="middle" className="fill-white/60 text-[9px] font-medium">{sc.stage}</text>
              {/* Count */}
              <text x={x + 50} y="68" textAnchor="middle" className="fill-white/30 text-[8px]">
                {sc.completed}/{sc.total}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ----------------------------------------
   SECTION HEADING — Consistent TRAIN typography
   ---------------------------------------- */
export function SectionHeading({
  tag,
  title,
  subtitle,
  className = '',
}: {
  tag: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center mb-20 ${className}`}
    >
      <span className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6 block">
        {tag}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ----------------------------------------
   PAGE HEADER — Consistent module headers
   ---------------------------------------- */
export function ModuleHeader({
  tag,
  title,
  titleAccent,
  subtitle,
}: {
  tag: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-16">
      <span className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6 block">
        {tag}
      </span>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
        {title}
        {titleAccent && (
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {titleAccent}
          </span>
        )}
      </h1>
      <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
