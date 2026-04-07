'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import { TrainingStats, TrainingSession, DrillSession, TrainingRatingCategory } from '@/lib/types/repTraining';
import { TRAINING_SCENARIOS, RANK_THRESHOLDS, scoreToGrade } from '@/lib/services/repKnowledgeBase';
import {
  GraduationCap, ChevronRight, Clock, Lock,
} from 'lucide-react';

const categoryLabels: Record<TrainingRatingCategory, { label: string; emoji: string }> = {
  discovery:          { label: 'Discovery',         emoji: '🔍' },
  listening:          { label: 'Listening',          emoji: '👂' },
  objection_handling: { label: 'Objection Handling', emoji: '🛡️' },
  closing:            { label: 'Closing',            emoji: '📅' },
  rapport:            { label: 'Rapport',            emoji: '💬' },
  control:            { label: 'Control',            emoji: '🎯' },
};

const drillTypes = [
  { id: 'objection_handling', label: 'Objection Handling', emoji: '🛡️', color: 'text-red-400',    description: 'Handle "we\'re fine", "not interested", "call back later"' },
  { id: 'opening_lines',      label: 'Openers',            emoji: '🎤', color: 'text-blue-400',   description: 'Nail the first 8 seconds without sounding like a cold caller' },
  { id: 'call_booking',       label: 'Booking the Call',   emoji: '📅', color: 'text-green-400',  description: 'Close for the meeting from interested, hesitant, or stalling prospects' },
  { id: 'gatekeeper',         label: 'Gatekeeper',         emoji: '🚪', color: 'text-amber-400',  description: 'Get past receptionists and assistants honestly' },
  { id: 'reframing',          label: 'Reframing',          emoji: '🔄', color: 'text-purple-400', description: 'Flip "we don\'t need it" into a compelling reason to listen' },
];

const difficultyColors = {
  beginner:     'text-green-400 bg-green-400/10 border-green-400/20',
  intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  advanced:     'text-red-400 bg-red-400/10 border-red-400/20',
  elite:        'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

// ── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ scores }: { scores: number[] }) {
  if (scores.length < 2) return null;
  const w = 80, h = 28, pad = 2;
  const min = Math.min(...scores), max = Math.max(...scores);
  const range = max - min || 1;
  const pts = scores.map((s, i) => {
    const x = pad + (i / (scores.length - 1)) * (w - pad * 2);
    const y = h - pad - ((s - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  const last = scores[scores.length - 1];
  const prev = scores[scores.length - 2];
  const up = last >= prev;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} suppressHydrationWarning>
      <polyline points={pts} fill="none" stroke={up ? 'rgba(74,222,128,0.7)' : 'rgba(248,113,113,0.7)'} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Radar chart ──────────────────────────────────────────────────────────────
function RadarChart({ scores }: { scores: Record<TrainingRatingCategory, number> }) {
  const categories = Object.keys(categoryLabels) as TrainingRatingCategory[];
  const size = 140, center = size / 2, maxR = 55, n = categories.length;
  const toXY = (angle: number, r: number) => ({
    x: Math.round((center + r * Math.sin(angle)) * 1e4) / 1e4,
    y: Math.round((center - r * Math.cos(angle)) * 1e4) / 1e4,
  });
  const rings = [25, 50, 75, 100];
  const axes = categories.map((_, i) => toXY((2 * Math.PI * i) / n, maxR));
  const points = categories.map((cat, i) => {
    const r = ((scores[cat] || 0) / 100) * maxR;
    return toXY((2 * Math.PI * i) / n, r);
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} suppressHydrationWarning>
      {rings.map((r) => (
        <polygon key={r} points={categories.map((_, i) => { const { x, y } = toXY((2 * Math.PI * i) / n, (r / 100) * maxR); return `${x},${y}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {axes.map((pt, i) => (
        <line key={i} x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <polygon points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" />)}
    </svg>
  );
}

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/8 rounded-xl p-4 animate-pulse">
      <div className="h-2.5 w-16 bg-white/10 rounded mb-3" />
      <div className="h-7 w-10 bg-white/10 rounded mb-2" />
      <div className="h-2 w-20 bg-white/5 rounded" />
    </div>
  );
}

export default function TrainPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [drills, setDrills] = useState<DrillSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'drills' | 'history'>('scenarios');

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    Promise.all([
      RepTrainingService.getTrainingStats(user.uid),
      RepTrainingService.getUserTrainingSessions(user.uid, 20),
      RepTrainingService.getUserDrillSessions(user.uid, 20),
    ]).then(([s, sess, d]) => {
      setStats(s);
      setSessions(sess);
      setDrills(d);
    }).catch((err) => {
      console.error('Failed to load training data:', err);
    }).finally(() => setLoading(false));
  }, [user?.uid]);

  const rank = stats?.rank ?? 'rookie';
  const rankInfo = RANK_THRESHOLDS[rank];
  const avgScore = stats?.averageScore ?? 0;
  const totalSessions = stats?.totalSessions ?? 0;
  const isUnlocked = avgScore >= 60 && totalSessions >= 10;

  const categoryScores: Record<TrainingRatingCategory, number> = stats?.categoryAverages ?? {
    discovery: 0, listening: 0, objection_handling: 0, closing: 0, rapport: 0, control: 0,
  };

  // Pre-compute drill stats: last played + best accuracy per type
  const drillStatsByType = useMemo(() => {
    const map: Record<string, { lastPlayed: Date | null; bestAccuracy: number; count: number }> = {};
    drills.filter(d => d.status === 'completed').forEach((d) => {
      const date = d.createdAt instanceof Date ? d.createdAt : new Date(d.createdAt);
      if (!map[d.drillType]) map[d.drillType] = { lastPlayed: null, bestAccuracy: 0, count: 0 };
      map[d.drillType].count += 1;
      map[d.drillType].bestAccuracy = Math.max(map[d.drillType].bestAccuracy, d.accuracy);
      if (!map[d.drillType].lastPlayed || date > map[d.drillType].lastPlayed!) {
        map[d.drillType].lastPlayed = date;
      }
    });
    return map;
  }, [drills]);

  // Chronological merged history
  const historyItems = useMemo(() => {
    const completed = [
      ...sessions.filter(s => s.status === 'completed').map(s => ({
        type: 'session' as const,
        id: s.id,
        date: s.startedAt instanceof Date ? s.startedAt : new Date(s.startedAt),
        session: s,
        drill: null as DrillSession | null,
      })),
      ...drills.filter(d => d.status === 'completed').map(d => ({
        type: 'drill' as const,
        id: d.id,
        date: d.createdAt instanceof Date ? d.createdAt : new Date(d.createdAt),
        session: null as TrainingSession | null,
        drill: d,
      })),
    ];
    completed.sort((a, b) => b.date.getTime() - a.date.getTime());
    return completed;
  }, [sessions, drills]);

  // Dynamic lock copy
  const sessionsNeeded = Math.max(0, 10 - totalSessions);
  const scoreNeeded = avgScore < 60;
  const lockMessage = (() => {
    if (sessionsNeeded > 0 && scoreNeeded)
      return `${sessionsNeeded} more roleplay${sessionsNeeded > 1 ? 's' : ''} + lift your avg to 60 to unlock your lead pipeline.`;
    if (sessionsNeeded > 0)
      return `Just ${sessionsNeeded} more roleplay${sessionsNeeded > 1 ? 's' : ''} away from unlocking your lead pipeline. Keep going.`;
    return `Lift your average score to 60 (currently ${Math.round(avgScore)}) to unlock your lead pipeline.`;
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Training</h1>
        <p className="text-white/40 text-sm mt-1">
          AI-powered cold call practice. Based on 10 sales books. Get scored, get better.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {/* Avg score with sparkline */}
            <div className="bg-white/5 border border-white/8 rounded-xl p-4">
              <p className="text-xs text-white/30 uppercase tracking-widest">Avg Score</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold text-white">{avgScore > 0 ? Math.round(avgScore) : '—'}</p>
                {(stats?.scoreTrend?.length ?? 0) >= 2 && (
                  <Sparkline scores={stats!.scoreTrend} />
                )}
              </div>
              <p className="text-xs text-white/40 mt-0.5">{avgScore > 0 ? scoreToGrade(avgScore) : 'No sessions yet'}</p>
            </div>
            {[
              { label: 'Sessions', value: totalSessions, sub: `${stats?.totalPracticeMinutes ?? 0} min practice` },
              { label: 'Drills', value: stats?.drillsCompleted ?? 0, sub: stats?.drillAccuracy ? `${Math.round(stats.drillAccuracy)}% accuracy` : 'None yet' },
              { label: 'Streak', value: stats?.currentStreak ?? 0, sub: `${stats?.longestStreak ?? 0} best` },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-4">
                <p className="text-xs text-white/30 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Rank + radar */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Rank card */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Current Rank</p>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{rankInfo.emoji}</span>
            <div>
              <p className="text-xl font-bold text-white">{rankInfo.label}</p>
              <p className="text-xs text-white/40 mt-0.5">{rankInfo.description}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            {(Object.entries(RANK_THRESHOLDS) as [string, typeof RANK_THRESHOLDS[keyof typeof RANK_THRESHOLDS]][]).map(([key, info]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm">{info.emoji}</span>
                <span className={`text-xs ${key === rank ? 'text-white font-semibold' : 'text-white/30'}`}>{info.label}</span>
                <span className="text-xs text-white/20 ml-auto">{info.minScore}+ avg · {info.minSessions}+ sessions</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill radar */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Skill Profile</p>
          <div className="flex items-start gap-6">
            <RadarChart scores={categoryScores} />
            <div className="space-y-1.5 flex-1">
              {(Object.entries(categoryLabels) as [TrainingRatingCategory, { label: string; emoji: string }][]).map(([cat, info]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="text-xs">{info.emoji}</span>
                  <span className="text-xs text-white/50 flex-1">{info.label}</span>
                  <span className="text-xs font-semibold text-white">{categoryScores[cat] > 0 ? Math.round(categoryScores[cat]) : '—'}</span>
                </div>
              ))}
            </div>
          </div>
          {stats?.weakestCategory && (
            <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400">
                📌 Focus: <strong>{categoryLabels[stats.weakestCategory].label}</strong> — your weakest area
              </p>
            </div>
          )}
          {stats?.strongestCategory && (
            <div className="mt-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs text-green-400">
                💪 Strongest: <strong>{categoryLabels[stats.strongestCategory].label}</strong> — lean into this
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Unlock status */}
      {!isUnlocked && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Lead access locked</p>
            <p className="text-xs text-white/50 mt-0.5">{lockMessage}</p>
            <div className="flex gap-4 mt-2">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-white/30 mb-1">
                  <span>Sessions</span><span>{totalSessions}/10</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${Math.min(100, (totalSessions / 10) * 100)}%` }} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-white/30 mb-1">
                  <span>Avg score</span><span>{Math.round(avgScore)}/60</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${Math.min(100, (avgScore / 60) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {([
          { id: 'scenarios', label: '🎭 Scenarios', count: TRAINING_SCENARIOS.length },
          { id: 'drills',    label: '⚡ Drills',    count: drillTypes.length },
          { id: 'history',   label: '📋 History',   count: historyItems.length },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white text-black' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-black/15 text-black/60' : 'bg-white/10 text-white/40'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scenarios tab */}
      {activeTab === 'scenarios' && (
        <div className="space-y-3">
          <p className="text-xs text-white/30 uppercase tracking-widest">Choose a scenario to roleplay</p>
          {TRAINING_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => router.push(`/rep/train/roleplay?scenario=${scenario.id}`)}
              className="w-full bg-white/5 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-colors text-left group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{scenario.name}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColors[scenario.difficulty]}`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">{scenario.description}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {scenario.tags.slice(1).map((tag) => (
                      <span key={tag} className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{scenario.estimatedDuration}m</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Drills tab */}
      {activeTab === 'drills' && (
        <div className="space-y-3">
          <p className="text-xs text-white/30 uppercase tracking-widest">Quick-fire practice rounds — rated instantly by AI</p>
          {drillTypes.map((dt) => {
            const ds = drillStatsByType[dt.id];
            return (
              <button
                key={dt.id}
                onClick={() => router.push(`/rep/train/drill?type=${dt.id}`)}
                className="w-full bg-white/5 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-colors text-left group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{dt.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${dt.color}`}>{dt.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{dt.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {ds ? (
                      <>
                        <span className="text-xs font-bold text-white">{Math.round(ds.bestAccuracy)}% best</span>
                        <span className="text-[10px] text-white/25">
                          {ds.lastPlayed ? ds.lastPlayed.toLocaleDateString() : ''} · {ds.count}×
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-white/20">Not played</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {loading && (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-white/10 rounded" />
                    <div className="h-2 w-20 bg-white/5 rounded" />
                  </div>
                  <div className="h-7 w-8 bg-white/10 rounded" />
                </div>
              </div>
            ))
          )}
          {!loading && historyItems.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No sessions yet. Start with a beginner scenario.</p>
            </div>
          )}
          {!loading && historyItems.map((item) => (
            item.type === 'session' && item.session ? (
              <button
                key={item.id}
                onClick={() => router.push(`/rep/train/review?session=${item.id}`)}
                className="w-full bg-white/5 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/25 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">Roleplay</span>
                      <p className="text-sm font-semibold text-white">{item.session.scenario?.name ?? 'Roleplay'}</p>
                    </div>
                    <p className="text-xs text-white/30 mt-1">
                      {item.date.toLocaleDateString()} · {Math.round((item.session.duration || 0) / 60)}m
                    </p>
                  </div>
                  {item.session.rating && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{Math.round(item.session.rating.overallScore)}</p>
                      <p className="text-xs text-white/40">grade {item.session.rating.grade}</p>
                    </div>
                  )}
                </div>
              </button>
            ) : item.drill ? (
              <div key={item.id} className="bg-white/5 border border-white/8 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/25 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">Drill</span>
                      <p className="text-sm font-semibold text-white capitalize">{item.drill.drillType.replace(/_/g, ' ')}</p>
                    </div>
                    <p className="text-xs text-white/30 mt-1">
                      {item.date.toLocaleDateString()} · {item.drill.completedRounds} rounds · {item.drill.difficulty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{Math.round(item.drill.accuracy)}%</p>
                    <p className="text-xs text-white/40">accuracy</p>
                  </div>
                </div>
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
