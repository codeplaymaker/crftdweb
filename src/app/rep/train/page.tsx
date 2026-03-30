'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import { TrainingStats, TrainingSession, DrillSession, TrainingRatingCategory } from '@/lib/types/repTraining';
import { TRAINING_SCENARIOS, RANK_THRESHOLDS, CATEGORY_WEIGHTS, scoreToGrade } from '@/lib/services/repKnowledgeBase';
import {
  GraduationCap, Target, Zap, Trophy, BarChart3,
  ChevronRight, Clock, Star, TrendingUp, Lock,
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
  { id: 'objection_handling', label: 'Objection Handling', emoji: '🛡️', color: 'text-red-400', description: 'Handle "we\'re fine", "not interested", "call back later"' },
  { id: 'opening_lines',      label: 'Openers',            emoji: '🎤', color: 'text-blue-400', description: 'Nail the first 8 seconds without sounding like a cold caller' },
  { id: 'call_booking',       label: 'Booking the Call',   emoji: '📅', color: 'text-green-400', description: 'Close for the meeting from interested, hesitant, or stalling prospects' },
  { id: 'gatekeeper',         label: 'Gatekeeper',         emoji: '🚪', color: 'text-amber-400', description: 'Get past receptionists and assistants honestly' },
  { id: 'reframing',          label: 'Reframing',          emoji: '🔄', color: 'text-purple-400', description: 'Flip "we don\'t need it" into a compelling reason to listen' },
];

const difficultyColors = {
  beginner:     'text-green-400 bg-green-400/10 border-green-400/20',
  intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  advanced:     'text-red-400 bg-red-400/10 border-red-400/20',
  elite:        'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

function RadarChart({ scores }: { scores: Record<TrainingRatingCategory, number> }) {
  const categories = Object.keys(categoryLabels) as TrainingRatingCategory[];
  const size = 140;
  const center = size / 2;
  const maxR = 55;
  const n = categories.length;

  const toXY = (angle: number, r: number) => ({
    x: center + r * Math.sin(angle),
    y: center - r * Math.cos(angle),
  });

  const rings = [25, 50, 75, 100];
  const axes = categories.map((_, i) => toXY((2 * Math.PI * i) / n, maxR));
  const points = categories.map((cat, i) => {
    const r = ((scores[cat] || 0) / 100) * maxR;
    return toXY((2 * Math.PI * i) / n, r);
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((r) => (
        <polygon
          key={r}
          points={categories.map((_, i) => {
            const { x, y } = toXY((2 * Math.PI * i) / n, (r / 100) * maxR);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {axes.map((pt, i) => (
        <line key={i} x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" />
      ))}
    </svg>
  );
}

export default function TrainPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [drills, setDrills] = useState<DrillSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'drills' | 'history'>('scenarios');

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    Promise.all([
      RepTrainingService.getTrainingStats(user.uid),
      RepTrainingService.getUserTrainingSessions(user.uid, 10),
      RepTrainingService.getUserDrillSessions(user.uid, 10),
    ]).then(([s, sess, d]) => {
      setStats(s);
      setSessions(sess);
      setDrills(d);
    }).finally(() => setLoading(false));
  }, [user?.uid]);

  const rank = stats?.rank ?? 'rookie';
  const rankInfo = RANK_THRESHOLDS[rank];
  const avgScore = stats?.averageScore ?? 0;
  const isUnlocked = (stats?.averageScore ?? 0) >= 60 && (stats?.totalSessions ?? 0) >= 10;

  const categoryScores: Record<TrainingRatingCategory, number> = stats?.categoryAverages ?? {
    discovery: 0, listening: 0, objection_handling: 0, closing: 0, rapport: 0, control: 0,
  };

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
        {[
          { label: 'Avg Score', value: avgScore > 0 ? `${Math.round(avgScore)}` : '—', sub: avgScore > 0 ? scoreToGrade(avgScore) : 'No sessions yet' },
          { label: 'Sessions', value: stats?.totalSessions ?? 0, sub: `${stats?.totalPracticeMinutes ?? 0} min practice` },
          { label: 'Drills', value: stats?.drillsCompleted ?? 0, sub: stats?.drillAccuracy ? `${Math.round(stats.drillAccuracy)}% accuracy` : 'None yet' },
          { label: 'Streak', value: stats?.currentStreak ?? 0, sub: `${stats?.longestStreak ?? 0} best` },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-4">
            <p className="text-xs text-white/30 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.sub}</p>
          </div>
        ))}
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
                <span className={`text-xs ${key === rank ? 'text-white font-semibold' : 'text-white/30'}`}>
                  {info.label}
                </span>
                <span className="text-xs text-white/20 ml-auto">{info.minScore}+ avg / {info.minSessions}+ sessions</span>
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
                  <span className="text-xs font-semibold text-white">
                    {categoryScores[cat] > 0 ? Math.round(categoryScores[cat]) : '—'}
                  </span>
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
        </div>
      </div>

      {/* Unlock status */}
      {!isUnlocked && (
        <div className={`border rounded-xl p-4 flex items-start gap-3 ${
          isUnlocked
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Lead access locked</p>
            <p className="text-xs text-white/50 mt-0.5">
              Complete 10 roleplays with an average score of 60+ to unlock your lead pipeline. 
              Currently: {stats?.totalSessions ?? 0}/10 sessions, {Math.round(avgScore)}/60 avg score.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {(['scenarios', 'drills', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-white text-black' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab === 'scenarios' ? '🎭 Scenarios' : tab === 'drills' ? '⚡ Drills' : '📋 History'}
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
          {drillTypes.map((dt) => (
            <button
              key={dt.id}
              onClick={() => router.push(`/rep/train/drill?type=${dt.id}`)}
              className="w-full bg-white/5 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-colors text-left group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{dt.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${dt.color}`}>{dt.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{dt.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {loading && <p className="text-white/30 text-sm">Loading...</p>}
          {!loading && sessions.length === 0 && drills.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No sessions yet. Start with a beginner scenario.</p>
            </div>
          )}
          {sessions.filter((s) => s.status === 'completed').map((s) => (
            <button
              key={s.id}
              onClick={() => router.push(`/rep/train/review?session=${s.id}`)}
              className="w-full bg-white/5 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{s.scenario?.name ?? 'Roleplay'}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {s.startedAt instanceof Date
                      ? s.startedAt.toLocaleDateString()
                      : new Date(s.startedAt).toLocaleDateString()}
                    {' · '}
                    {Math.round((s.duration || 0) / 60)}m
                  </p>
                </div>
                {s.rating && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{Math.round(s.rating.overallScore)}</p>
                    <p className="text-xs text-white/40">grade {s.rating.grade}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
          {drills.filter((d) => d.status === 'completed').map((d) => (
            <div key={d.id} className="bg-white/5 border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white capitalize">{d.drillType.replace(/_/g, ' ')} Drill</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {d.completedRounds} rounds · {d.difficulty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{Math.round(d.accuracy)}%</p>
                  <p className="text-xs text-white/40">accuracy</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
