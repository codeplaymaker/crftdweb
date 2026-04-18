'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, ArrowLeft, ExternalLink, CheckCircle2, ClipboardCheck, Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TrialEntry {
  business: string;
  url: string;
  diagnosis: string;
}

interface TrialSubmission {
  id: string;
  name?: string;
  email: string;
  entries: TrialEntry[];
  submittedAt: string | null;
  reviewed: boolean;
}

interface TrialNonSubmitter {
  id: string;
  email: string;
  name: string;
  sentAt: string | null;
}

type FilterTab = 'all' | 'pending' | 'reviewed' | 'no_reply';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<TrialSubmission[]>([]);
  const [nonSubmitters, setNonSubmitters] = useState<TrialNonSubmitter[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>('pending');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/trial-submissions').then(r => r.json()),
      fetch('/api/admin/trial-non-submitters').then(r => r.json()),
    ]).then(([subs, nonSubs]) => {
      setSubmissions(Array.isArray(subs) ? subs : []);
      setNonSubmitters(Array.isArray(nonSubs) ? nonSubs : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return submissions;
    if (tab === 'reviewed') return submissions.filter(s => s.reviewed);
    return submissions.filter(s => !s.reviewed);
  }, [submissions, tab]);

  const counts = useMemo(() => ({
    all: submissions.length,
    pending: submissions.filter(s => !s.reviewed).length,
    reviewed: submissions.filter(s => s.reviewed).length,
    no_reply: nonSubmitters.length,
  }), [submissions, nonSubmitters]);

  async function handleToggleReviewed(id: string, reviewed: boolean) {
    setTogglingId(id);
    try {
      const res = await fetch('/api/admin/trial-submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reviewed }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, reviewed } : s));
      }
    } catch {
      // silent
    }
    setTogglingId(null);
  }

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'reviewed', label: 'Reviewed' },
    { key: 'all', label: 'All' },
    { key: 'no_reply', label: 'No Reply' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Trial Submissions</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{submissions.length} total · {counts.pending} pending review</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-white/10 text-white'
                  : 'bg-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]'
              }`}
            >
              {t.label}
              <span className="ml-2 text-xs text-zinc-600">{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 py-20">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading submissions…</span>
          </div>
        ) : tab === 'no_reply' ? (
          nonSubmitters.length === 0 ? (
            <p className="text-zinc-600 text-sm py-10 text-center">Everyone who received the task has submitted. 🎉</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 mb-4">These people were sent the trial task but haven&apos;t submitted yet.</p>
              {nonSubmitters.map(r => (
                <div key={r.id} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
                  <AlertCircle size={14} className="text-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{r.name || '—'}</p>
                    <p className="text-xs text-zinc-500">{r.email}</p>
                  </div>
                  {r.sentAt && (
                    <p className="text-xs text-zinc-600 shrink-0">
                      Sent {new Date(r.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ) : filtered.length === 0 ? (
          <p className="text-zinc-600 text-sm py-10 text-center">
            {tab === 'pending' ? 'No pending submissions.' : tab === 'reviewed' ? 'No reviewed submissions yet.' : 'No submissions found.'}
          </p>
        ) : (
          <div className="space-y-4">
            {filtered.map(submission => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                toggling={togglingId === submission.id}
                onToggle={handleToggleReviewed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SubmissionCard({
  submission,
  toggling,
  onToggle,
}: {
  submission: TrialSubmission;
  toggling: boolean;
  onToggle: (id: string, reviewed: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(!submission.reviewed);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none hover:bg-zinc-800/40 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${submission.reviewed ? 'bg-emerald-400' : 'bg-violet-400'}`} />
        <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-white">{submission.name || submission.email}</span>
            {submission.name && <span className="text-xs text-zinc-500">{submission.email}</span>}
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
              submission.reviewed
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
            }`}>
              <span className="flex items-center gap-1">
                {submission.reviewed ? <CheckCircle2 size={9} /> : <ClipboardCheck size={9} />}
                {submission.reviewed ? 'Reviewed' : 'Pending'}
              </span>
            </span>
          </div>
          {submission.submittedAt && (
            <span className="text-[11px] text-zinc-600 flex items-center gap-1">
              <Clock size={10} />
              {new Date(submission.submittedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onToggle(submission.id, !submission.reviewed)}
            disabled={toggling}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
              submission.reviewed
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            {toggling ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
            {submission.reviewed ? 'Reviewed' : 'Mark reviewed'}
          </button>
        </div>
        {expanded ? <ChevronUp size={16} className="text-zinc-600" /> : <ChevronDown size={16} className="text-zinc-600" />}
      </div>

      {/* Entries */}
      {expanded && (
        <div className="border-t border-zinc-800">
          <div className="grid grid-cols-[auto_1fr_auto_1fr] items-start">
            {submission.entries.map((entry, i) => (
              <div key={i} className="contents">
                <div className="px-5 py-3.5 border-b border-zinc-800/60 flex items-center justify-center">
                  <span className="text-[10px] text-zinc-600 font-mono w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">{i + 1}</span>
                </div>
                <div className="px-2 py-3.5 border-b border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80">{entry.business}</span>
                    <a
                      href={entry.url.startsWith('http') ? entry.url : `https://${entry.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-teal-400 transition-colors"
                    >
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{entry.url}</p>
                </div>
                <div className="px-3 py-3.5 border-b border-zinc-800/60 flex items-start">
                  <span className="text-[10px] text-zinc-700 uppercase tracking-wider font-semibold pt-0.5">Why:</span>
                </div>
                <div className="px-2 py-3.5 border-b border-zinc-800/60">
                  <p className="text-xs text-zinc-400 italic leading-relaxed">&ldquo;{entry.diagnosis}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
