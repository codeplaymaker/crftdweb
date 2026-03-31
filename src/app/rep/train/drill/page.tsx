'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import { DRILL_PROMPTS, buildDrillSystemPrompt } from '@/lib/services/repKnowledgeBase';
import { DrillType, DrillPrompt, DrillRound } from '@/lib/types/repTraining';
import { ArrowLeft, CheckCircle, Loader2, ChevronRight } from 'lucide-react';

const DRILL_LABELS: Record<DrillType, string> = {
  objection_handling: 'Objection Handling',
  opening_lines: 'Opening Lines',
  call_booking: 'Call Booking',
  gatekeeper: 'Gatekeeper',
  reframing: 'Reframing',
};

const DRILL_DESCRIPTIONS: Record<DrillType, string> = {
  objection_handling: 'Turn objections into opportunities.',
  opening_lines: 'Hook them in the first 10 seconds.',
  call_booking: "Lock down a time — don't let them wiggle out.",
  gatekeeper: 'Get past the blocker to reach the decision-maker.',
  reframing: 'Shift their perspective without being pushy.',
};

const ROUNDS_PER_SESSION = 5;

interface RoundResult {
  drillPrompt: DrillPrompt;
  userResponse: string;
  aiRating: number;
  aiFeedback: string;
  aiIdealResponse: string;
  frameworkUsed: string;
}

function DrillContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const drillType = (searchParams?.get('type') as DrillType) || null;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<DrillPrompt[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [completedRounds, setCompletedRounds] = useState<RoundResult[]>([]);
  const [showDone, setShowDone] = useState(false);

  const initPrompts = useCallback(() => {
    if (!drillType || !DRILL_PROMPTS[drillType]) return;
    const pool = [...DRILL_PROMPTS[drillType]];
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, ROUNDS_PER_SESSION);
    setPrompts(shuffled);
  }, [drillType]);

  useEffect(() => {
    initPrompts();
  }, [initPrompts]);

  const startSession = useCallback(async () => {
    if (!user?.uid || !drillType) return;
    const id = await RepTrainingService.createDrillSession(user.uid, {
      drillType,
      totalRounds: ROUNDS_PER_SESSION,
    });
    setSessionId(id);
  }, [user?.uid, drillType]);

  useEffect(() => {
    startSession().catch(console.error);
  }, [startSession]);

  const handleSubmit = useCallback(async () => {
    if (!response.trim() || !sessionId || !drillType || isSubmitting || !prompts[currentRound]) return;
    const dp = prompts[currentRound];
    setIsSubmitting(true);

    try {
      const systemPrompt = buildDrillSystemPrompt();
      const res = await fetch('/api/rep/train/drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          drillType,
          prompt: dp.prompt,
          context: dp.context,
          userResponse: response.trim(),
          idealFrameworks: dp.idealFrameworks,
        }),
      });
      const data = await res.json();

      const round: DrillRound = {
        promptId: dp.id,
        prompt: dp.prompt,
        userResponse: response.trim(),
        aiRating: data.rating,
        aiFeedback: data.feedback,
        aiIdealResponse: data.idealResponse,
        timestamp: new Date(),
      };

      await RepTrainingService.addDrillRound(sessionId, round);
      setRoundResult({
        drillPrompt: dp,
        userResponse: response.trim(),
        aiRating: data.rating,
        aiFeedback: data.feedback,
        aiIdealResponse: data.idealResponse,
        frameworkUsed: data.frameworkUsed,
      });
      setCompletedRounds((prev) => [...prev, {
        drillPrompt: dp,
        userResponse: response.trim(),
        aiRating: data.rating,
        aiFeedback: data.feedback,
        aiIdealResponse: data.idealResponse,
        frameworkUsed: data.frameworkUsed,
      }]);
    } finally {
      setIsSubmitting(false);
    }
  }, [response, sessionId, drillType, isSubmitting, prompts, currentRound]);

  const nextRound = useCallback(async () => {
    if (currentRound + 1 >= ROUNDS_PER_SESSION) {
      if (sessionId && user?.uid) {
        const session = await RepTrainingService.getTrainingSession(sessionId).catch(() => null);
        if (!session) {
          // Try fetching the drill session for stats update
          const drillSnap = await RepTrainingService.getUserDrillSessions(user.uid, 1);
          if (drillSnap[0]) await RepTrainingService.updateDrillStats(user.uid, drillSnap[0]);
        }
      }
      setShowDone(true);
    } else {
      setCurrentRound((r) => r + 1);
      setResponse('');
      setRoundResult(null);
    }
  }, [currentRound, sessionId, user?.uid]);

  if (!drillType || !DRILL_PROMPTS[drillType]) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-white/40">Drill type not found.</p>
        <button onClick={() => router.push('/rep/train')} className="mt-4 text-sm text-white/60 underline">
          Back to Training
        </button>
      </div>
    );
  }

  // Done screen
  if (showDone) {
    const avgRating = completedRounds.reduce((a, r) => a + r.aiRating, 0) / completedRounds.length;
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-center py-4">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-2xl font-black text-white">{avgRating.toFixed(1)} / 10</p>
          <p className="text-white/40 text-sm">Average rating across {ROUNDS_PER_SESSION} rounds</p>
        </div>
        <div className="space-y-3">
          {completedRounds.map((r, i) => (
            <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/30 uppercase tracking-widest">Round {i + 1}</p>
                <span className={`text-sm font-bold ${r.aiRating >= 7 ? 'text-green-400' : r.aiRating >= 4 ? 'text-amber-400' : 'text-red-400'}`}>
                  {r.aiRating}/10
                </span>
              </div>
              <p className="text-xs text-white/50 italic">"{r.drillPrompt.prompt}"</p>
              {r.drillPrompt.context && <p className="text-xs text-white/30">{r.drillPrompt.context}</p>}
              <p className="text-xs text-white/70">{r.aiFeedback}</p>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-xs text-white/30 mb-0.5">Ideal:</p>
                <p className="text-xs text-white/60">{r.aiIdealResponse}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/rep/train')} className="flex-1 border border-white/20 text-white/70 font-semibold py-3 rounded-xl hover:bg-white/5 transition-colors">
            Back to Training
          </button>
          <button
            onClick={() => {
              initPrompts();
              setCurrentRound(0);
              setResponse('');
              setRoundResult(null);
              setCompletedRounds([]);
              setShowDone(false);
              startSession();
            }}
            className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Drill Again
          </button>
        </div>
      </div>
    );
  }

  const currentPrompt = prompts[currentRound];

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/rep/train')} className="text-white/40 hover:text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-sm font-semibold text-white">{DRILL_LABELS[drillType]}</p>
          <p className="text-xs text-white/40">{DRILL_DESCRIPTIONS[drillType]}</p>
        </div>
        <div className="ml-auto text-sm text-white/40">
          {currentRound + 1}/{ROUNDS_PER_SESSION}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/5 rounded-full h-1">
        <div className="bg-white h-1 rounded-full transition-all" style={{ width: `${(currentRound / ROUNDS_PER_SESSION) * 100}%` }} />
      </div>

      {/* Prompt */}
      {currentPrompt && (
        <div className="bg-white/5 border border-white/8 rounded-xl p-5 space-y-2">
          <p className="text-xs text-white/30 uppercase tracking-widest">They said:</p>
          <p className="text-base text-white leading-relaxed">"{currentPrompt.prompt}"</p>
          {currentPrompt.context && <p className="text-xs text-white/40 italic">{currentPrompt.context}</p>}
        </div>
      )}

      {/* Response area */}
      {!roundResult ? (
        <div className="space-y-3">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Type your response..."
            rows={4}
            className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none outline-none focus:border-white/20"
          />
          <button
            onClick={handleSubmit}
            disabled={!response.trim() || isSubmitting}
            className="w-full bg-white text-black font-bold py-3 rounded-xl disabled:opacity-30 hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Rating...</> : 'Submit Response'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`border rounded-xl p-4 ${roundResult.aiRating >= 7 ? 'border-green-500/30 bg-green-500/5' : roundResult.aiRating >= 4 ? 'border-amber-500/30 bg-amber-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-bold ${roundResult.aiRating >= 7 ? 'text-green-400' : roundResult.aiRating >= 4 ? 'text-amber-400' : 'text-red-400'}`}>
                {roundResult.aiRating}/10
              </p>
              {roundResult.frameworkUsed && (
                <span className="text-xs text-white/30 italic">{roundResult.frameworkUsed}</span>
              )}
            </div>
            <p className="text-sm text-white/70 mb-2">{roundResult.aiFeedback}</p>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/30 mb-1">Ideal response:</p>
              <p className="text-sm text-white/60">{roundResult.aiIdealResponse}</p>
            </div>
          </div>
          <button
            onClick={nextRound}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            {currentRound + 1 >= ROUNDS_PER_SESSION ? 'See Results' : 'Next Round'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function DrillPage() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm">Loading...</div>}>
      <DrillContent />
    </Suspense>
  );
}
