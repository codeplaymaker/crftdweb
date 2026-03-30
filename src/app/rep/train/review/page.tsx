'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import { TrainingSession, TrainingRatingCategory, CategoryRating } from '@/lib/types/repTraining';
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const categoryLabels: Record<TrainingRatingCategory, string> = {
  discovery: 'Discovery',
  listening: 'Listening',
  objection_handling: 'Objection Handling',
  closing: 'Closing',
  rapport: 'Rapport',
  control: 'Control',
};

function scoreColor(score: number) {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreTextColor(score: number) {
  if (score >= 75) return 'text-green-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session') || null;

  const [session, setSession] = useState<TrainingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    RepTrainingService.getTrainingSession(sessionId)
      .then(setSession)
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
      </div>
    );
  }

  if (!session || !session.rating) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-white/40">Session not found.</p>
        <button onClick={() => router.push('/rep/train')} className="mt-4 text-sm text-white/60 underline">
          Back to Training
        </button>
      </div>
    );
  }

  const { rating, scenario, messages, duration } = session;
  const fmt = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">
      {/* Back */}
      <button onClick={() => router.push('/rep/train')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70">
        <ArrowLeft className="w-4 h-4" /> Back to Training
      </button>

      {/* Score header */}
      <div className="bg-white/5 border border-white/8 rounded-xl p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-3">
          {rating.callBooked
            ? <CheckCircle2 className="w-6 h-6 text-green-400" />
            : <XCircle className="w-6 h-6 text-red-400" />}
          <span className={`text-sm font-semibold ${rating.callBooked ? 'text-green-400' : 'text-red-400'}`}>
            {rating.callBooked ? 'Call Booked' : 'Call Not Booked'}
          </span>
        </div>
        <p className="text-5xl font-black text-white">{Math.round(rating.overallScore)}</p>
        <p className="text-xl text-white/50">Grade: {rating.grade}</p>
        {scenario && <p className="text-sm text-white/30">{scenario.name} · {fmt(duration)}</p>}
      </div>

      {/* Summary */}
      <div className="bg-white/5 border border-white/8 rounded-xl p-5">
        <p className="text-sm text-white/70 leading-relaxed">{rating.summary}</p>
      </div>

      {/* Strengths + weakness */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-1">Top Strength</p>
          <p className="text-sm text-white/70">{rating.topStrength}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-1">Needs Work</p>
          <p className="text-sm text-white/70">{rating.topWeakness}</p>
        </div>
      </div>

      {/* Coaching priority */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-1">Next Session Focus</p>
        <p className="text-sm text-white/70">{rating.coachingPriority}</p>
      </div>

      {/* Category breakdown */}
      <div className="space-y-2">
        <p className="text-xs text-white/30 uppercase tracking-widest px-1">Category Scores</p>
        {(Object.entries(rating.categories) as [TrainingRatingCategory, CategoryRating][]).map(([cat, data]) => (
          <div key={cat} className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">{categoryLabels[cat]}</p>
              <span className={`text-sm font-bold ${scoreTextColor(data.score)}`}>
                {Math.round(data.score)} <span className="text-white/30 text-xs font-normal">({data.grade})</span>
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full transition-all ${scoreColor(data.score)}`} style={{ width: `${data.score}%` }} />
            </div>
            <p className="text-xs text-white/50">{data.feedback}</p>
            {data.highlights?.length > 0 && (
              <div className="space-y-0.5">
                {data.highlights.map((h, i) => (
                  <p key={i} className="text-xs text-green-400/70">+ {h}</p>
                ))}
              </div>
            )}
            {data.improvements?.length > 0 && (
              <div className="space-y-0.5">
                {data.improvements.map((imp, i) => (
                  <p key={i} className="text-xs text-red-400/70">→ {imp}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowTranscript((s) => !s)}
            className="text-xs text-white/40 hover:text-white/70 uppercase tracking-widest"
          >
            {showTranscript ? '▼ Hide' : '▶ Show'} Transcript ({messages.length} messages)
          </button>
          {showTranscript && (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'rep' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'rep' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/70'
                  }`}>
                    <p className="text-xs text-white/30 mb-1 uppercase">{msg.role}</p>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => router.push('/rep/train')}
          className="flex-1 border border-white/20 text-white/70 font-semibold py-3 rounded-xl hover:bg-white/5 transition-colors"
        >
          Training Hub
        </button>
        {scenario && (
          <button
            onClick={() => router.push(`/rep/train/roleplay?scenario=${scenario.id}`)}
            className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Train Again
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm">Loading...</div>}>
      <ReviewContent />
    </Suspense>
  );
}
