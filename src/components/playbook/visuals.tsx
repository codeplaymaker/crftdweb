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
   VISUAL DEVICE: METAPHOR (Abstract made tangible)
   Used by: Services page — abstract service icons
   Each metaphor replaces a concept with a concrete visual
   ---------------------------------------- */
export function ServiceMetaphor({
  type,
  className = '',
}: {
  type: 'design' | 'branding' | 'ux' | 'development' | 'ecommerce' | 'strategy';
  className?: string;
}) {
  const metaphors: Record<string, React.ReactNode> = {
    design: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        {/* Pen tool / bezier curve — design = shaping curves */}
        <motion.path d="M10 50 Q 32 10, 54 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <circle cx="10" cy="50" r="3" fill="currentColor" opacity={0.4} />
        <circle cx="32" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity={0.4} />
        <circle cx="54" cy="50" r="3" fill="currentColor" opacity={0.4} />
        <line x1="10" y1="50" x2="32" y2="12" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity={0.2} />
        <line x1="32" y1="12" x2="54" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity={0.2} />
      </svg>
    ),
    branding: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        {/* Diamond / gem — branding = crystallized identity */}
        <motion.path d="M32 8 L52 24 L32 56 L12 24 Z" stroke="currentColor" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <motion.line x1="12" y1="24" x2="52" y2="24" stroke="currentColor" strokeWidth="1" opacity={0.3}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
        <motion.line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" strokeWidth="0.5" opacity={0.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7 }} />
      </svg>
    ),
    ux: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        {/* Finger touching circle — UX = human touch */}
        <circle cx="32" cy="28" r="16" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />
        <motion.circle cx="32" cy="28" r="6" fill="currentColor" opacity={0.2}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
        <motion.path d="M32 44 L32 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
        <motion.circle cx="32" cy="28" r="16" stroke="currentColor" strokeWidth="1.5"
          initial={{ scale: 1, opacity: 0.3 }} animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }} />
      </svg>
    ),
    development: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        {/* Brackets — development = building with code */}
        <motion.path d="M22 16 L10 32 L22 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        <motion.path d="M42 16 L54 32 L42 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
        <motion.line x1="28" y1="12" x2="36" y2="52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4 }} />
      </svg>
    ),
    ecommerce: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        {/* Shopping bag with upward arrow — ecommerce = growth through selling */}
        <motion.rect x="14" y="20" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        <motion.path d="M24 20 V14 A8 8 0 0 1 40 14 V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
        <motion.path d="M32 44 V30 M27 35 L32 30 L37 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.6 }} />
      </svg>
    ),
    strategy: (
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        {/* Compass / direction — strategy = navigating */}
        <motion.circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <motion.path d="M32 16 L36 30 L32 48 L28 30 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity={0.1}
          initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }} style={{ transformOrigin: '32px 32px' }} />
        <circle cx="32" cy="32" r="2" fill="currentColor" opacity={0.5} />
      </svg>
    ),
  };

  return (
    <div className={`w-12 h-12 text-black/70 ${className}`}>
      {metaphors[type]}
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: PATTERN RECOGNITION
   Used by: Track page — weekly consistency streaks
   Visual patterns decoded fast — shows rhythm
   ---------------------------------------- */
export function ConsistencyPattern({ className = '' }: { className?: string }) {
  // 4 weeks x 7 days grid showing consistency
  const weeks = [
    [1, 1, 0, 1, 1, 0, 0], // week 1 — 4/7
    [1, 1, 1, 1, 0, 1, 0], // week 2 — 5/7
    [1, 1, 1, 1, 1, 1, 0], // week 3 — 6/7
    [1, 1, 1, 1, 1, 1, 1], // week 4 — 7/7
  ];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className={className}>
      <svg viewBox="0 0 380 160" className="w-full max-w-[380px] mx-auto" fill="none">
        {/* Day labels */}
        {days.map((d, i) => (
          <text key={`day-${i}`} x={55 + i * 44} y="18" textAnchor="middle" className="fill-white/30 text-[9px]">{d}</text>
        ))}
        {/* Week labels */}
        {weeks.map((_, wi) => (
          <text key={`wk-${wi}`} x="18" y={46 + wi * 34} textAnchor="middle" className="fill-white/20 text-[8px]">W{wi + 1}</text>
        ))}
        {/* Grid */}
        {weeks.map((week, wi) =>
          week.map((active, di) => (
            <motion.rect
              key={`${wi}-${di}`}
              x={35 + di * 44} y={30 + wi * 34}
              width="28" height="24" rx="6"
              fill={active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)'}
              stroke={active ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: wi * 0.08 + di * 0.03 }}
            />
          ))
        )}
        {/* Streak arrow on right */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <text x="355" y="46" textAnchor="middle" className="fill-white/20 text-[8px]">4/7</text>
          <text x="355" y="80" textAnchor="middle" className="fill-white/25 text-[8px]">5/7</text>
          <text x="355" y="114" textAnchor="middle" className="fill-emerald-400/40 text-[8px]">6/7</text>
          <text x="355" y="148" textAnchor="middle" className="fill-emerald-400/60 text-[8px] font-semibold">7/7</text>
        </motion.g>
        {/* Trend arrow */}
        <motion.path
          d="M 355 52 L 355 138"
          stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.6 }}
        />
        <motion.polygon points="351,138 355,146 359,138" fill="rgba(16,185,129,0.3)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} />
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: VENN DIAGRAM
   Used by: Productize — sweet spot of skill+market+passion
   Overlapping factors showing intersection
   ---------------------------------------- */
export function SweetSpotVenn({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 400 320" className="w-full max-w-[400px] mx-auto" fill="none">
        {/* Three overlapping circles */}
        <motion.circle cx="170" cy="140" r="100" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} />
        <motion.circle cx="230" cy="140" r="100" fill="rgba(20,184,166,0.06)" stroke="rgba(20,184,166,0.2)" strokeWidth="1.5"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }} />
        <motion.circle cx="200" cy="200" r="100" fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />

        {/* Labels */}
        <motion.text x="130" y="100" textAnchor="middle" className="fill-emerald-400 text-[11px] font-semibold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Your Skill
        </motion.text>
        <motion.text x="270" y="100" textAnchor="middle" className="fill-teal-400 text-[11px] font-semibold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          Market Need
        </motion.text>
        <motion.text x="200" y="280" textAnchor="middle" className="fill-cyan-400 text-[11px] font-semibold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          Your Passion
        </motion.text>

        {/* Center sweet spot */}
        <motion.circle cx="200" cy="165" r="22" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth="2"
          initial={{ scale: 0 }} animate={{ scale: [0, 1.1, 1] }} transition={{ delay: 1, duration: 0.5 }} />
        <motion.text x="200" y="162" textAnchor="middle" className="fill-white text-[9px] font-bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          Sweet
        </motion.text>
        <motion.text x="200" y="174" textAnchor="middle" className="fill-white text-[9px] font-bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          Spot
        </motion.text>

        {/* Pairwise intersection labels */}
        <motion.text x="200" y="110" textAnchor="middle" className="fill-white/25 text-[8px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          Viable
        </motion.text>
        <motion.text x="148" y="200" textAnchor="middle" className="fill-white/25 text-[8px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
          Fulfilling
        </motion.text>
        <motion.text x="252" y="200" textAnchor="middle" className="fill-white/25 text-[8px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          In-demand
        </motion.text>
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: HIERARCHY (Top-to-bottom)
   Used by: Systemize — systems feed into each other
   ---------------------------------------- */
export function SystemsHierarchy({ className = '' }: { className?: string }) {
  const nodes = [
    { label: 'Marketing', color: '#10b981', x: 200, y: 30 },
    { label: 'Qualifying', color: '#14b8a6', x: 120, y: 100 },
    { label: 'Application', color: '#06b6d4', x: 280, y: 100 },
    { label: 'Onboarding', color: '#0ea5e9', x: 80, y: 170 },
    { label: 'Work', color: '#6366f1', x: 200, y: 170 },
    { label: 'Testimonials', color: '#8b5cf6', x: 320, y: 170 },
    { label: 'Loop ↻', color: '#10b981', x: 200, y: 240 },
  ];
  const edges = [
    [0, 1], [0, 2],      // Marketing → Qualifying, Application
    [1, 3], [1, 4],      // Qualifying → Onboarding, Work
    [2, 4], [2, 5],      // Application → Work, Testimonials
    [3, 6], [4, 6], [5, 6], // All → Loop
  ];

  return (
    <div className={className}>
      <svg viewBox="0 0 400 280" className="w-full max-w-[400px] mx-auto" fill="none">
        {/* Edges */}
        {edges.map(([from, to], i) => (
          <motion.line
            key={`edge-${i}`}
            x1={nodes[from].x} y1={nodes[from].y + 14}
            x2={nodes[to].x} y2={nodes[to].y - 14}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
          />
        ))}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g key={node.label}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}>
            <rect x={node.x - 42} y={node.y - 14} width="84" height="28" rx="8"
              fill={`${node.color}12`} stroke={`${node.color}30`} strokeWidth="1.5" />
            <text x={node.x} y={node.y + 4} textAnchor="middle"
              className="fill-white/70 text-[9px] font-medium">{node.label}</text>
          </motion.g>
        ))}
        {/* Loop-back arrow */}
        <motion.path d="M 200 258 C 200 275, 50 275, 50 50 C 50 25, 170 22, 200 28"
          stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3 3" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }} />
        <motion.polygon points="196,24 204,24 200,18" fill="rgba(16,185,129,0.35)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} />
      </svg>
    </div>
  );
}

/* ----------------------------------------
   VISUAL DEVICE: CARTESIAN PLOT (Two-axis)
   Used by: Scale — effort (hrs) vs revenue per stream
   ---------------------------------------- */
export function EffortRevenueChart({
  streams,
  className = '',
}: {
  streams: { name: string; hours: number; revenue: number; type: 'active' | 'leveraged' | 'passive' }[];
  className?: string;
}) {
  const maxH = Math.max(...streams.map(s => s.hours), 1);
  const maxR = Math.max(...streams.map(s => s.revenue), 1);
  const chartW = 440;
  const chartH = 220;
  const pad = { l: 55, r: 20, t: 20, b: 35 };
  const typeColors: Record<string, string> = { active: '#ef4444', leveraged: '#eab308', passive: '#10b981' };

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-[440px] mx-auto" fill="none">
        {/* Axes */}
        <motion.line x1={pad.l} y1={pad.t} x2={pad.l} y2={chartH - pad.b}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
        <motion.line x1={pad.l} y1={chartH - pad.b} x2={chartW - pad.r} y2={chartH - pad.b}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
        {/* Axis labels */}
        <text x={pad.l - 8} y={(pad.t + chartH - pad.b) / 2} textAnchor="middle"
          className="fill-white/25 text-[8px]" transform={`rotate(-90, ${pad.l - 8}, ${(pad.t + chartH - pad.b) / 2})`}>
          Revenue ($)
        </text>
        <text x={(pad.l + chartW - pad.r) / 2} y={chartH - 5} textAnchor="middle" className="fill-white/25 text-[8px]">
          Hours / Month
        </text>
        {/* Ideal quadrant indicator */}
        <motion.rect x={pad.l + 1} y={pad.t} width={(chartW - pad.l - pad.r) * 0.35} height={(chartH - pad.t - pad.b) * 0.5}
          fill="rgba(16,185,129,0.03)" rx="4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
        <motion.text x={pad.l + 10} y={pad.t + 14} className="fill-emerald-400/20 text-[7px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          ↑ high return, low effort
        </motion.text>
        {/* Data points */}
        {streams.map((s, i) => {
          const cx = pad.l + (s.hours / maxH) * (chartW - pad.l - pad.r);
          const cy = chartH - pad.b - (s.revenue / maxR) * (chartH - pad.t - pad.b);
          const color = typeColors[s.type];
          return (
            <motion.g key={s.name}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.12 }}>
              <circle cx={cx} cy={cy} r="8" fill={`${color}25`} stroke={`${color}60`} strokeWidth="1.5" />
              <text x={cx} y={cy - 12} textAnchor="middle" className="fill-white/50 text-[7px]">{s.name}</text>
            </motion.g>
          );
        })}
        {/* Legend */}
        {(['active', 'leveraged', 'passive'] as const).map((type, i) => (
          <motion.g key={type} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.1 }}>
            <circle cx={pad.l + i * 80} cy={chartH - 8} r="3" fill={typeColors[type]} />
            <text x={pad.l + i * 80 + 8} y={chartH - 5} className="fill-white/30 text-[7px] capitalize">{type}</text>
          </motion.g>
        ))}
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
