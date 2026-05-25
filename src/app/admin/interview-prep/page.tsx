'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, ChevronRight, RotateCcw, Star, Trophy, AlertCircle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PrepState {
  practiced: string[];
  confidence: Record<string, number>;
  mockCompleted: boolean;
  checklistDone: string[];
}

type View = 'home' | 'practice' | 'mock' | 'report';

// ─── Questions ───────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'q1',
    topic: 'Intro',
    topicColor: 'sky',
    question: 'Tell me about yourself and why you are interested in Best.Energy.',
    duration: 120,
    sampleAnswer: `I'm Obinna, a self-taught full-stack developer based in Bristol. Over the past two years I've gone from zero to building production React applications — CrftdWeb, a web agency platform with four integrated products including an AI multi-agent engine and an automated lead generation pipeline, and The Life Lab HQ, a personal development platform with a five-area progress dashboard, Firebase Auth, and an AI chatbot.

What draws me to Best.Energy is the mission. I've built AI-driven systems that automate real business workflows, and I want to apply that same product-driven engineering mindset to something with genuine impact — the energy transition is one of the most important engineering problems of our generation.

I work remotely by default. Every line of CrftdWeb was written solo, so I'm very comfortable with async communication, self-direction, and delivering without hand-holding.`,
  },
  {
    id: 'q2',
    topic: 'Portfolio',
    topicColor: 'purple',
    question: 'Walk me through a React project you are most proud of.',
    duration: 120,
    sampleAnswer: `The Life Lab HQ is the project I'm most proud of from a product and React perspective. It's a personal development platform built with React, Firebase Auth, and Firestore.

The core UI is a five-area dashboard — Family, Freedom, Finances, Fitness, and Faith — where each area has its own progress tracking, goals, and data visualisation. I built a per-user Firestore profile system so every user's data is fully isolated, and integrated an AI chatbot that has context about the user's progress across all five areas.

What I'm most proud of is how I structured the state. Each life area is its own domain with its own data shape, but they all render through a shared component pattern — the same card layout, the same progress ring, the same interaction model. That kind of consistency across domains is something I had to design upfront, and getting it right made the whole codebase much easier to extend.

It taught me a lot about component architecture, Firebase real-time listeners, and building something that feels genuinely personal to the user.`,
  },
  {
    id: 'q3',
    topic: 'State Management',
    topicColor: 'amber',
    question: 'How do you manage complex state in a large React application?',
    duration: 120,
    sampleAnswer: `My default approach is to keep state as local as possible and lift it only when genuinely shared. I reach for useState and useReducer first. Context is fine for low-frequency global state — auth, theme — but I avoid putting high-frequency updates in Context because every consumer re-renders.

In CrftdWeb the admin dashboard manages a lot of state — rep pipelines, lead data, email logs — and I keep each page self-contained, fetching on mount and managing local state within the component. For the AI engine's streaming chat, I use a useRef for the accumulated stream so I'm not triggering renders on every token, then I update state in a debounced way.

If I were on a larger team I'd introduce Zustand for shared cross-page state — it has a tiny footprint and scales predictably. I'd avoid Redux unless there was a genuinely complex state machine that justified the overhead.`,
  },
  {
    id: 'q4',
    topic: 'Performance',
    topicColor: 'green',
    question: 'How do you optimise a slow React page?',
    duration: 120,
    sampleAnswer: `I start by measuring, not guessing. React DevTools Profiler and Lighthouse show me exactly where the problem is.

The most common issues I've fixed: unnecessary re-renders from unstable references in useEffect deps — solved with useCallback and useMemo; large bundle sizes — solved with dynamic imports and next/dynamic for heavy components; unoptimised images — Next.js next/image handles most of this automatically.

In CrftdWeb's admin dashboard there's an animated particle system with 40 floating elements. My first instinct was to memoize the particles array so it doesn't regenerate on every render — useMemo on the initial calculation fixed a subtle frame drop. I also use React.memo for list items in the rep pipeline so updating one rep's status doesn't re-render the entire list.

The bigger performance wins on CrftdWeb came from architecture — streaming AI responses instead of waiting for a full completion, and using Firestore real-time listeners instead of polling.`,
  },
  {
    id: 'q5',
    topic: 'Architecture',
    topicColor: 'teal',
    question: 'How do you approach building reusable components?',
    duration: 120,
    sampleAnswer: `I think about components in three layers: primitives (a Button, an Input), composites (a FormField combining Label + Input + error), and domain-specific (a LeadCard that knows about my data model).

My rules: primitives should have zero business logic and accept className for style extension. Composites own layout. Domain components own data fetching or receive data as props — never both in the same component.

In CrftdWeb I have patterns like a ResultCard component in the CV review page — it receives a CVResult object and handles its own expanded/collapsed state, but it fires callbacks up for actions like sending emails. That keeps the parent page clean and the card testable in isolation.

I also lean on composition over configuration. Instead of a god-component that accepts twenty props to cover every variant, I use children and slot patterns so the caller controls the content.`,
  },
  {
    id: 'q6',
    topic: 'TypeScript',
    topicColor: 'blue',
    question: 'Describe your experience with TypeScript in a real project.',
    duration: 120,
    sampleAnswer: `CrftdWeb is fully TypeScript — every page, every API route, every Firebase utility. I've been writing TypeScript for the past two years and it's non-negotiable for me now.

The most valuable part isn't catching typos — it's the design feedback. When a type becomes awkward to write, it usually means the data model is wrong. I've refactored several Firestore document shapes because the TypeScript interfaces exposed inconsistencies that would have become runtime bugs.

Specific patterns I use: discriminated unions for state machines (e.g. a call session with 'idle' | 'active' | 'ended' variants, each with different fields), generic utility types for API responses, and strict null checks everywhere so I never have an accidental undefined.

I also write interfaces for all my Firestore documents and use them in both the frontend types and the Firebase Admin SDK calls, so the type chain is end-to-end.`,
  },
  {
    id: 'q7',
    topic: 'Data Fetching',
    topicColor: 'cyan',
    question: 'How do you handle async data fetching and loading/error states in React?',
    duration: 120,
    sampleAnswer: `My standard pattern is a useEffect that fires on mount, sets loading true, awaits the fetch, sets the data, and handles errors in a catch with a user-visible error state. I always have three states modelled: loading, data, error — never assume the happy path.

In CrftdWeb's admin pages I fetch on mount with Promise.all for parallel requests — for example the leads page fetches leads, reps, and commissions simultaneously and only renders when all three resolve. This cuts the perceived load time significantly.

For mutation I use optimistic updates where the stakes are low — updating a lead status in the UI immediately and rolling back on failure. For higher-stakes operations like sending emails I wait for confirmation before updating the UI.

I haven't needed React Query on CrftdWeb because the data isn't shared across routes, but I'd introduce it on a larger app where cache invalidation and background refetching would save real development time.`,
  },
  {
    id: 'q8',
    topic: 'Testing',
    topicColor: 'rose',
    question: 'What does your testing approach look like?',
    duration: 120,
    sampleAnswer: `I use Vitest and React Testing Library on CrftdWeb. My philosophy is to test behaviour, not implementation — I test what the user sees and does, not internal component state.

The most important tests I've written are for the business logic utilities: the CV scoring algorithm, the lead status transition rules, the commission calculation. These are pure functions that are easy to test exhaustively and are the most costly to break.

For components I focus on integration tests over unit tests — render the whole feature, fire user events with userEvent, assert on what appears in the DOM. I mock Firebase and fetch at the module level using Vitest's vi.mock so tests run fast without network calls.

What I've learned: the right test is the one you'll actually maintain. A flaky test is worse than no test because it erodes trust in the whole suite.`,
  },
  {
    id: 'q9',
    topic: 'Growth',
    topicColor: 'violet',
    question: 'How do you stay current with the React ecosystem?',
    duration: 90,
    sampleAnswer: `Mostly by building. When React 19 and Next.js 15 shipped their stable releases I migrated CrftdWeb to both. That hands-on process — reading the release notes, hitting the breaking changes, working through the codebase — teaches more than any article.

I follow the React team's GitHub discussions and the Next.js changelog closely. The React Server Components mental model took me a while to internalise but I now find it the clearest way to think about what should be server vs client.

For the broader ecosystem I pay attention to what solves real problems I've hit. I adopted Framer Motion because I needed smooth animations. I evaluated Zustand when my state management was getting complicated. I don't add dependencies speculatively.

Honestly the biggest learning accelerator has been shipping things people actually use — the feedback loop from real usage reveals what you don't know far faster than tutorials.`,
  },
  {
    id: 'q10',
    topic: 'Remote Work',
    topicColor: 'emerald',
    question: 'What makes you a good fit for a remote team?',
    duration: 90,
    sampleAnswer: `Everything I've built has been remote and async by default. CrftdWeb is a solo project, which means I've had to be my own product manager, QA, and DevOps engineer. I've developed a strong bias toward written documentation, clear commit messages, and building things that don't require me to be available to explain them.

For communication I over-communicate on progress and flag blockers early. I've learned that silence in a remote team is the most expensive mistake — a quick message that something is taking longer than expected is always better than a missed deadline.

My setup is solid — dedicated workspace, reliable broadband, comfortable with asynchronous tools. And I'm genuinely motivated by the work itself rather than office environment, which I think is the most important remote quality.

I see working at Best.Energy as an opportunity to apply this same discipline to a mission I care about.`,
  },
];

const CHECKLIST_ITEMS = [
  { id: 'c1', text: 'Quiet room with no background noise' },
  { id: 'c2', text: 'Good lighting — face lit from the front, not backlit' },
  { id: 'c3', text: 'Camera at eye level, not looking up or down' },
  { id: 'c4', text: 'Clean or professional background' },
  { id: 'c5', text: 'Smart top on (even if on your phone)' },
  { id: 'c6', text: 'Device charged and stable connection confirmed' },
  { id: 'c7', text: 'STAR format ready: Situation, Task, Action, Result' },
  { id: 'c8', text: 'Best.Energy link open and ready to submit' },
  { id: 'c9', text: 'Practiced all 10 questions at least once' },
  { id: 'c10', text: 'Confident in your intro answer (Q1)' },
];

const DEADLINE = new Date('2026-05-26T23:59:59');

const TOPIC_COLORS: Record<string, string> = {
  sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  green: 'text-green-400 bg-green-500/10 border-green-500/20',
  teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'interview_prep_state';

function loadState(): PrepState {
  if (typeof window === 'undefined') return { practiced: [], confidence: {}, mockCompleted: false, checklistDone: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { practiced: [], confidence: {}, mockCompleted: false, checklistDone: [] };
    return JSON.parse(raw);
  } catch {
    return { practiced: [], confidence: {}, mockCompleted: false, checklistDone: [] };
  }
}

function saveState(state: PrepState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

function calcReadiness(state: PrepState): number {
  const practicedCount = state.practiced.length;
  const avgConf = QUESTIONS.reduce((sum, q) => sum + (state.confidence[q.id] ?? 0), 0) / QUESTIONS.length;
  const practiceScore = (practicedCount / QUESTIONS.length) * 60;
  const confScore = (avgConf / 5) * 40;
  return Math.round(practiceScore + confScore);
}

// ─── Deadline Countdown ───────────────────────────────────────────────────────

function DeadlineCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, urgent: false });

  useEffect(() => {
    function update() {
      const now = new Date();
      const diff = DEADLINE.getTime() - now.getTime();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, urgent: true }); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, minutes, urgent: days < 2 });
    }
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border ${timeLeft.urgent ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
      <Clock className="w-3 h-3" />
      <span>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left — 26 May 2026
      </span>
    </div>
  );
}

// ─── Confidence Dot ───────────────────────────────────────────────────────────

function ConfidenceDot({ level }: { level: number }) {
  if (!level) return <span className="w-2 h-2 rounded-full bg-white/10 inline-block" title="Not practiced" />;
  if (level <= 2) return <span className="w-2 h-2 rounded-full bg-red-500 inline-block" title={`Confidence: ${level}/5`} />;
  if (level <= 3) return <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" title={`Confidence: ${level}/5`} />;
  return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title={`Confidence: ${level}/5`} />;
}

// ─── Readiness Ring ───────────────────────────────────────────────────────────

function ReadinessRing({ score }: { score: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-white">{score}</span>
        <span className="text-[9px] text-white/30 uppercase tracking-wider">ready</span>
      </div>
    </div>
  );
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function QuestionTimer({ duration, onExpire, running }: { duration: number; onExpire: () => void; running: boolean }) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemaining(duration);
    expiredRef.current = false;
  }, [duration]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          if (!expiredRef.current) { expiredRef.current = true; onExpire(); }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, onExpire]);

  const pct = remaining / duration;
  const color = pct > 0.5 ? 'text-emerald-400' : pct > 0.25 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${color}`}>
      <Clock className="w-5 h-5" />
      {fmt(remaining)}
    </div>
  );
}

// ─── Practice Panel ───────────────────────────────────────────────────────────

function PracticePanel({
  question,
  confidence,
  onConfidence,
  onBack,
}: {
  question: typeof QUESTIONS[0];
  confidence: number;
  onConfidence: (id: string, val: number) => void;
  onBack: () => void;
}) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [notes, setNotes] = useState('');
  const tc = TOPIC_COLORS[question.topicColor] ?? 'text-white/60 bg-white/5 border-white/10';

  const handleExpire = useCallback(() => {
    setTimerRunning(false);
    setTimerDone(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to questions
      </button>

      {/* Question */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tc}`}>{question.topic}</span>
          <QuestionTimer duration={question.duration} onExpire={handleExpire} running={timerRunning} />
        </div>

        <p className="text-xl font-semibold text-white leading-snug mb-8">{question.question}</p>

        {/* Timer controls */}
        {!timerRunning && !timerDone && (
          <button
            onClick={() => setTimerRunning(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors mb-6"
          >
            <Clock className="w-4 h-4" /> Start {fmt(question.duration)} Timer
          </button>
        )}
        {timerDone && (
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-6 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4" /> Time&apos;s up — how did you do?
          </div>
        )}
        {timerRunning && (
          <button
            onClick={() => { setTimerRunning(false); setTimerDone(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white/70 text-sm transition-colors mb-6"
          >
            Stop timer
          </button>
        )}

        {/* Notes */}
        <div className="mb-6">
          <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-2">Your notes</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Jot your key points here..."
            className="w-full h-28 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Reveal answer */}
        <button
          onClick={() => setShowAnswer(v => !v)}
          className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors mb-2"
        >
          <Star className="w-4 h-4" />
          {showAnswer ? 'Hide sample answer' : 'Reveal sample answer'}
        </button>

        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-purple-500/[0.05] border border-purple-500/15 rounded-xl p-5 mt-3">
                <p className="text-xs text-purple-400/70 uppercase tracking-widest font-semibold mb-3">Sample Answer</p>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{question.sampleAnswer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confidence */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">How confident do you feel on this question?</p>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => onConfidence(question.id, n)}
              className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                confidence === n
                  ? n <= 2 ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : n === 3 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-white/20'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-white/20 mt-2 px-1">
          <span>Not confident</span><span>Very confident</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mock Interview ───────────────────────────────────────────────────────────

function MockInterview({
  onComplete,
  onExit,
  onConfidence,
}: {
  onComplete: () => void;
  onExit: () => void;
  onConfidence: (id: string, val: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [localConf, setLocalConf] = useState<Record<string, number>>({});

  const q = QUESTIONS[idx];
  const isLast = idx === QUESTIONS.length - 1;

  const handleExpire = useCallback(() => {
    setTimerRunning(false);
    setTimerDone(true);
  }, []);

  function next() {
    if (isLast) {
      onComplete();
    } else {
      setIdx(i => i + 1);
      setTimerRunning(false);
      setTimerDone(false);
      setShowAnswer(false);
    }
  }

  function handleConf(id: string, val: number) {
    setLocalConf(prev => ({ ...prev, [id]: val }));
    onConfidence(id, val);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
        <button onClick={onExit} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Exit mock
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 font-mono">Question {idx + 1} of {QUESTIONS.length}</span>
          <div className="flex gap-1">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < idx ? 'bg-emerald-500' : i === idx ? 'bg-white' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
        <DeadlineCountdown />
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Question card */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TOPIC_COLORS[q.topicColor]}`}>{q.topic}</span>
                  <QuestionTimer duration={q.duration} onExpire={handleExpire} running={timerRunning} />
                </div>

                <p className="text-2xl font-semibold text-white leading-snug mb-8">{q.question}</p>

                {!timerRunning && !timerDone && (
                  <button
                    onClick={() => setTimerRunning(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors"
                  >
                    <Clock className="w-4 h-4" /> Start Answer ({fmt(q.duration)})
                  </button>
                )}
                {timerDone && (
                  <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4" /> Time&apos;s up — rate your answer below
                  </div>
                )}
                {timerRunning && (
                  <button
                    onClick={() => { setTimerRunning(false); setTimerDone(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:text-white/70 transition-colors"
                  >
                    Done answering
                  </button>
                )}
              </div>

              {/* Reveal answer */}
              <button
                onClick={() => setShowAnswer(v => !v)}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Star className="w-4 h-4" />
                {showAnswer ? 'Hide sample answer' : 'Reveal sample answer'}
              </button>
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-purple-500/[0.05] border border-purple-500/15 rounded-xl p-5">
                      <p className="text-xs text-purple-400/70 uppercase tracking-widest font-semibold mb-3">Sample Answer</p>
                      <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{q.sampleAnswer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confidence */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Rate your confidence (1–5)</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => handleConf(q.id, n)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                        localConf[q.id] === n
                          ? n <= 2 ? 'bg-red-500/20 border-red-500/40 text-red-300'
                            : n === 3 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-white/20'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next */}
              <button
                onClick={next}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors"
              >
                {isLast ? (
                  <><Trophy className="w-4 h-4" /> Complete Mock Interview</>
                ) : (
                  <>Next Question <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Report ───────────────────────────────────────────────────────────────────

function ReadinessReport({
  state,
  onRetry,
  onToggleChecklist,
}: {
  state: PrepState;
  onRetry: () => void;
  onToggleChecklist: (id: string) => void;
}) {
  const score = calcReadiness(state);

  return (
    <div className="space-y-8">
      {/* Score banner */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 flex items-center gap-8">
        <ReadinessRing score={score} />
        <div>
          <p className="text-2xl font-bold text-white mb-1">Readiness Score: {score}/100</p>
          <p className="text-sm text-white/40">
            {score >= 80
              ? "You're well prepared. Go record it."
              : score >= 60
              ? 'Solid foundation — review weak questions then record.'
              : 'Practice more before recording — focus on red questions below.'}
          </p>
          {state.mockCompleted && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> Full mock interview completed
            </div>
          )}
        </div>
      </div>

      {/* Per-question table */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Question Confidence</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {QUESTIONS.map((q, i) => {
            const conf = state.confidence[q.id] ?? 0;
            const practiced = state.practiced.includes(q.id);
            const tc = TOPIC_COLORS[q.topicColor] ?? '';
            return (
              <div key={q.id} className="flex items-center gap-4 px-6 py-3.5">
                <span className="text-xs text-white/20 font-mono w-4">{i + 1}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc} shrink-0`}>{q.topic}</span>
                <span className="text-sm text-white/60 flex-1 truncate">{q.question}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {practiced ? (
                    <span className="text-[10px] text-white/30">practiced</span>
                  ) : (
                    <span className="text-[10px] text-white/20">not yet</span>
                  )}
                  <ConfidenceDot level={conf} />
                  <span className={`text-xs font-mono ${conf ? 'text-white/50' : 'text-white/20'}`}>{conf ? `${conf}/5` : '—'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Pre-Submission Checklist</p>
          <span className="text-xs text-white/30 font-mono">{state.checklistDone.length}/{CHECKLIST_ITEMS.length}</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {CHECKLIST_ITEMS.map(item => {
            const done = state.checklistDone.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className="flex items-center gap-4 px-6 py-3.5 w-full text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                  {done && <CheckCircle className="w-3 h-3 text-black" />}
                </div>
                <span className={`text-sm transition-colors ${done ? 'text-white/40 line-through' : 'text-white/70'}`}>{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Run mock again
        </button>
        <a
          href="https://www.best.energy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors"
        >
          <CheckCircle className="w-4 h-4" /> I&apos;m ready — open Best.Energy interview
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InterviewPrepPage() {
  const [state, setState] = useState<PrepState>({ practiced: [], confidence: {}, mockCompleted: false, checklistDone: [] });
  const [view, setView] = useState<View>('home');
  const [selectedQ, setSelectedQ] = useState<typeof QUESTIONS[0] | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const setConfidence = useCallback((id: string, val: number) => {
    setState(prev => {
      const next = {
        ...prev,
        confidence: { ...prev.confidence, [id]: val },
        practiced: prev.practiced.includes(id) ? prev.practiced : [...prev.practiced, id],
      };
      return next;
    });
  }, []);

  const toggleChecklist = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      checklistDone: prev.checklistDone.includes(id)
        ? prev.checklistDone.filter(x => x !== id)
        : [...prev.checklistDone, id],
    }));
  }, []);

  const openQuestion = useCallback((q: typeof QUESTIONS[0]) => {
    setState(prev => ({
      ...prev,
      practiced: prev.practiced.includes(q.id) ? prev.practiced : [...prev.practiced, q.id],
    }));
    setSelectedQ(q);
    setView('practice');
  }, []);

  const completeMock = useCallback(() => {
    setState(prev => ({ ...prev, mockCompleted: true }));
    setView('report');
  }, []);

  const resetAll = useCallback(() => {
    const fresh: PrepState = { practiced: [], confidence: {}, mockCompleted: false, checklistDone: [] };
    setState(fresh);
    saveState(fresh);
    setView('home');
  }, []);

  const score = calcReadiness(state);

  // ── Mock Mode ──
  if (view === 'mock') {
    return (
      <MockInterview
        onComplete={completeMock}
        onExit={() => setView('home')}
        onConfidence={setConfidence}
      />
    );
  }

  // ── Shared shell ──
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-8 py-5 sticky top-0 bg-[#0a0a0a] z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/30 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Interview Prep Coach</h1>
              <p className="text-xs text-white/30 mt-0.5">Front-end Developer (React) — Best.Energy — Remote</p>
            </div>
          </div>
          <DeadlineCountdown />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <AnimatePresence mode="wait">

          {/* ── Home ── */}
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              {/* Hero */}
              <div className="flex items-center gap-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                <ReadinessRing score={score} />
                <div className="flex-1">
                  <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1">Readiness Score</p>
                  <p className="text-2xl font-bold text-white mb-1">{score}/100</p>
                  <p className="text-sm text-white/40">
                    {state.practiced.length} of {QUESTIONS.length} questions practiced
                    {state.mockCompleted ? ' · Mock completed ✓' : ''}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setView('mock')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors whitespace-nowrap"
                  >
                    <Trophy className="w-4 h-4" /> Start Mock Interview
                  </button>
                  <button
                    onClick={() => setView('report')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> View readiness report
                  </button>
                </div>
              </div>

              {/* Question bank */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-semibold tracking-[0.3em] text-white/20 uppercase">Question Bank</h2>
                  <button onClick={resetAll} className="flex items-center gap-1.5 text-xs text-white/20 hover:text-white/40 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Reset all
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {QUESTIONS.map((q, i) => {
                    const conf = state.confidence[q.id] ?? 0;
                    const practiced = state.practiced.includes(q.id);
                    const tc = TOPIC_COLORS[q.topicColor] ?? '';
                    return (
                      <motion.button
                        key={q.id}
                        onClick={() => openQuestion(q)}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ y: -2, transition: { duration: 0.15 } }}
                        className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-left hover:border-white/15 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc}`}>{q.topic}</span>
                          <div className="flex items-center gap-2">
                            {practiced && <span className="text-[10px] text-white/25">practiced</span>}
                            <ConfidenceDot level={conf} />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-white/80 leading-snug mb-3">{q.question}</p>
                        <div className="flex items-center gap-2 text-xs text-white/25 group-hover:text-white/50 transition-colors">
                          <Clock className="w-3 h-3" /> {fmt(q.duration)}
                          <span className="ml-auto flex items-center gap-1">
                            Practice <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Practice ── */}
          {view === 'practice' && selectedQ && (
            <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PracticePanel
                question={selectedQ}
                confidence={state.confidence[selectedQ.id] ?? 0}
                onConfidence={setConfidence}
                onBack={() => setView('home')}
              />
            </motion.div>
          )}

          {/* ── Report ── */}
          {view === 'report' && (
            <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <button onClick={() => setView('home')} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back to questions
                </button>
              </div>
              <ReadinessReport state={state} onRetry={() => setView('mock')} onToggleChecklist={toggleChecklist} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
