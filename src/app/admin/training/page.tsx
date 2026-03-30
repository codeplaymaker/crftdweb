'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, GraduationCap, Phone, Trophy, Loader2, TrendingUp } from 'lucide-react';
import { TrainingStats, RepRank } from '@/lib/types/repTraining';
import { RepProfile } from '@/lib/firebase/firestore';

const rankEmoji: Record<RepRank, string> = {
  rookie: '🔰',
  canvasser: '📣',
  booker: '📅',
  hunter: '🎯',
  ace: '♠️',
};

const rankColors: Record<RepRank, string> = {
  rookie: 'text-white/40',
  canvasser: 'text-blue-400',
  booker: 'text-amber-400',
  hunter: 'text-orange-400',
  ace: 'text-purple-400',
};

interface RepRow {
  stats: TrainingStats;
  profile?: RepProfile;
}

export default function AdminTrainingPage() {
  const [rows, setRows] = useState<RepRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/rep-training-stats').then((r) => r.json()),
      fetch('/api/admin/reps').then((r) => r.json()),
    ])
      .then(([stats, reps]: [TrainingStats[], RepProfile[]]) => {
        const repMap = new Map(reps.map((r) => [r.uid, r]));
        const sorted = [...stats].sort((a, b) => b.averageScore - a.averageScore);
        setRows(sorted.map((s) => ({ stats: s, profile: repMap.get(s.userId) })));
      })
      .finally(() => setLoading(false));
  }, []);

  const totalUnlocked = rows.filter((r) => r.stats.unlockedAt).length;
  const avgScore = rows.length
    ? Math.round(rows.reduce((a, r) => a + r.stats.averageScore, 0) / rows.length)
    : 0;
  const totalSessions = rows.reduce((a, r) => a + r.stats.totalSessions, 0);
  const totalDrills = rows.reduce((a, r) => a + (r.stats.drillsCompleted || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white/40 hover:text-white/70">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-white/50" />
                Rep Training
              </h1>
              <p className="text-xs text-white/30">Leaderboard &amp; training stats across all reps</p>
            </div>
          </div>
          <Link
            href="/admin/call"
            className="flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Live Call Tool
          </Link>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total Reps', value: rows.length },
            { label: 'Unlocked', value: totalUnlocked },
            { label: 'Avg Score', value: avgScore },
            { label: 'Sessions', value: totalSessions },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-white/30">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">No training data yet.</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 pb-1 border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
              <span className="w-6">#</span>
              <span className="flex-1">Rep</span>
              <span className="w-16 text-right">Score</span>
              <span className="w-16 text-right">Sessions</span>
              <span className="w-16 text-right">Drills</span>
              <span className="w-16 text-right">Streak</span>
              <span className="w-20 text-right">Unlocked</span>
            </div>
            {rows.map((row, i) => {
              const { stats, profile } = row;
              const name = profile?.name || stats.userId.slice(0, 8) + '…';
              return (
                <div
                  key={stats.userId}
                  className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-4 py-3"
                >
                  <span className="w-6 text-sm text-white/30 font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{name}</p>
                      <span className={`text-xs font-semibold ${rankColors[stats.rank]}`}>
                        {rankEmoji[stats.rank]} {stats.rank}
                      </span>
                    </div>
                    {profile?.email && <p className="text-xs text-white/30 truncate">{profile.email}</p>}
                  </div>
                  <span className="w-16 text-right">
                    <span className={`text-sm font-bold ${stats.averageScore >= 70 ? 'text-green-400' : stats.averageScore >= 50 ? 'text-amber-400' : 'text-white/50'}`}>
                      {Math.round(stats.averageScore)}
                    </span>
                  </span>
                  <span className="w-16 text-right text-sm text-white/50">{stats.totalSessions}</span>
                  <span className="w-16 text-right text-sm text-white/50">{stats.drillsCompleted || 0}</span>
                  <span className="w-16 text-right text-sm text-white/50">{stats.currentStreak}d</span>
                  <span className="w-20 text-right">
                    {stats.unlockedAt ? (
                      <span className="text-xs text-green-400 font-semibold">✓ unlocked</span>
                    ) : (
                      <span className="text-xs text-white/25">locked</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Category averages across all reps */}
        {rows.length > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/30" />
              <p className="text-xs text-white/30 uppercase tracking-widest">Team Category Averages</p>
              <span className="text-xs text-white/20 ml-1">({rows.length} reps, {totalSessions} sessions, {totalDrills} drills)</span>
            </div>
            {(['discovery', 'listening', 'objection_handling', 'closing', 'rapport', 'control'] as const).map((cat) => {
              const avg = rows.reduce((a, r) => a + (r.stats.categoryAverages?.[cat] || 0), 0) / rows.length;
              const label = cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">{label}</span>
                    <span className={avg >= 70 ? 'text-green-400' : avg >= 50 ? 'text-amber-400' : 'text-red-400'}>
                      {Math.round(avg)}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${avg >= 70 ? 'bg-green-500' : avg >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Individual rep cards */}
        {rows.length > 0 && (
          <details className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
            <summary className="px-5 py-3 text-xs text-white/40 uppercase tracking-widest cursor-pointer hover:text-white/60 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Individual Rep Breakdowns
            </summary>
            <div className="px-5 pb-5 pt-2 space-y-4">
              {rows.map(({ stats, profile }) => {
                const name = profile?.name || stats.userId.slice(0, 8);
                return (
                  <div key={stats.userId} className="border border-white/8 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{name}</p>
                        <p className={`text-xs ${rankColors[stats.rank]}`}>{rankEmoji[stats.rank]} {stats.rank}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{Math.round(stats.averageScore)}</p>
                        <p className="text-xs text-white/30">avg score</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-center">
                      {[
                        { label: 'Sessions', v: stats.totalSessions },
                        { label: 'Drills', v: stats.drillsCompleted || 0 },
                        { label: 'Streak', v: `${stats.currentStreak}d` },
                        { label: 'Mins', v: stats.totalPracticeMinutes || 0 },
                      ].map((s) => (
                        <div key={s.label} className="bg-white/5 rounded-lg p-2">
                          <p className="font-bold text-white">{s.v}</p>
                          <p className="text-white/30">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {(['discovery', 'listening', 'objection_handling', 'closing', 'rapport', 'control'] as const).map((cat) => {
                        const v = stats.categoryAverages?.[cat] || 0;
                        return (
                          <div key={cat} className="flex items-center gap-2">
                            <span className="text-xs text-white/30 w-28 truncate">{cat.replace(/_/g, ' ')}</span>
                            <div className="flex-1 bg-white/5 rounded-full h-1">
                              <div className={`h-1 rounded-full ${v >= 70 ? 'bg-green-500' : v >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${v}%` }} />
                            </div>
                            <span className="text-xs text-white/40 w-6 text-right">{Math.round(v)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
