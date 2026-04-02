'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/AuthContext';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import { LiveCallSession } from '@/lib/types/repTraining';
import { ArrowLeft, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

const outcomeLabels: Record<string, { label: string; color: string }> = {
  booked:       { label: 'Booked',        color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  follow_up:    { label: 'Follow Up',     color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  callback:     { label: 'Callback',      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  not_interested: { label: 'Not Interested', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function CallHistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveCallSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    RepTrainingService.getUserCallSessions(user.uid, 50)
      .then((s) => setSessions(s.filter((c) => c.status === 'completed')))
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">
      <div className="flex items-center gap-3">
        <Link href="/rep/call" className="text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-white">Call History</h2>
          <p className="text-sm text-white/40">{sessions.length} completed call{sessions.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-white/30" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <Phone className="w-8 h-8 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/30">No completed calls yet</p>
          <Link href="/rep/call" className="text-xs text-white/40 hover:text-white/60 underline mt-1 inline-block">
            Start your first call
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => {
            const outcome = s.outcome ? outcomeLabels[s.outcome] : null;
            const isOpen = expanded === s.id;
            return (
              <div key={s.id} className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
                {/* Row header */}
                <button
                  onClick={() => toggle(s.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{s.leadName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {s.businessType && (
                          <span className="text-xs text-white/30">{s.businessType}</span>
                        )}
                        <span className="text-xs text-white/20">
                          {s.createdAt instanceof Date
                            ? s.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {outcome && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${outcome.color}`}>
                        {outcome.label}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-white/30">
                      <Clock className="w-3 h-3" />
                      {fmt(s.duration)}
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3">
                    {s.summary && (
                      <>
                        <div className={`rounded-lg p-3 ${s.summary.callBooked ? 'bg-green-500/5 border border-green-500/20' : 'bg-white/5'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-xs font-semibold ${s.summary.callBooked ? 'text-green-400' : 'text-white/50'}`}>
                              {s.summary.callBooked ? '✓ Call Booked' : 'Not Booked'}
                            </p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              s.summary.sentiment === 'positive' ? 'bg-green-500/10 text-green-400' :
                              s.summary.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' :
                              'bg-white/10 text-white/40'
                            }`}>{s.summary.sentiment}</span>
                          </div>
                          <p className="text-xs text-white/60">{s.summary.summary}</p>
                        </div>

                        {(s.summary.nextSteps?.length ?? 0) > 0 && (
                          <div>
                            <p className="text-xs text-white/30 uppercase tracking-widest mb-1.5">Next Steps</p>
                            {s.summary.nextSteps.map((step, i) => (
                              <p key={i} className="text-xs text-white/50">✓ {step}</p>
                            ))}
                          </div>
                        )}

                        {s.summary.followUpEmail && (
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-white/30 uppercase tracking-widest mb-1.5">Follow-Up Email</p>
                            <p className="text-xs text-white/50 whitespace-pre-line">{s.summary.followUpEmail}</p>
                          </div>
                        )}
                      </>
                    )}

                    {s.transcript.length > 0 && (
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-widest mb-1.5">Transcript ({s.transcript.length} lines)</p>
                        <div className="max-h-40 overflow-y-auto space-y-1 bg-white/5 rounded-lg p-3">
                          {s.transcript.map((t, i) => (
                            <div key={i}>
                              <span className={`text-xs font-semibold ${t.speaker === 'rep' ? 'text-white/50' : 'text-amber-400/70'}`}>
                                {t.speaker.toUpperCase()}: </span>
                              <span className="text-xs text-white/60">{t.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
