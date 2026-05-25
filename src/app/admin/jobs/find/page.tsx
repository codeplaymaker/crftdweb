'use client';

import { useState, useCallback } from 'react';
import { Loader2, ArrowLeft, Search, ExternalLink, Plus, Check, ChevronDown, ChevronUp, Zap, Copy, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface DraftState {
  message: string;
  loading: boolean;
  copied: boolean;
}

interface JobListing {
  id: string;
  source: 'remotive' | 'arbeitnow';
  title: string;
  company: string;
  location: string;
  remote: boolean;
  url: string;
  tags: string[];
  postedAt: string;
  description: string;
}

const PRESETS = [
  'react typescript nextjs',
  'frontend developer remote',
  'fullstack nextjs firebase',
  'junior frontend developer',
  'react developer uk',
  'next.js developer',
];

const SOURCE_BADGE: Record<string, string> = {
  remotive:  'bg-sky-500/10 text-sky-400 border-sky-500/20',
  arbeitnow: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

function timeAgo(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 86400) return 'today';
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function FindJobsPage() {
  const [query, setQuery] = useState('react typescript nextjs');
  const [results, setResults] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Saved state — track which IDs have been saved to the tracker
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);

  // Expanded description
  const [expanded, setExpanded] = useState<string | null>(null);

  // Quick apply
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});
  const [applyOpen, setApplyOpen] = useState<string | null>(null);

  const handleQuickApply = async (job: JobListing) => {
    if (applyOpen === job.id) { setApplyOpen(null); return; }
    setApplyOpen(job.id);
    if (drafts[job.id]?.message) return;
    setDrafts((prev) => ({ ...prev, [job.id]: { message: '', loading: true, copied: false } }));
    try {
      const res = await fetch('/api/admin/outreach/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'job', company: job.company, role: job.title, description: job.description }),
      });
      const data = await res.json();
      setDrafts((prev) => ({ ...prev, [job.id]: { message: data.message ?? '', loading: false, copied: false } }));
    } catch {
      setDrafts((prev) => ({ ...prev, [job.id]: { message: 'Failed to generate — please try again.', loading: false, copied: false } }));
    }
  };

  const handleCopyDraft = (jobId: string) => {
    const msg = drafts[jobId]?.message;
    if (!msg) return;
    navigator.clipboard.writeText(msg);
    setDrafts((prev) => ({ ...prev, [jobId]: { ...prev[jobId], copied: true } }));
    setTimeout(() => setDrafts((prev) => ({ ...prev, [jobId]: { ...prev[jobId], copied: false } })), 2000);
  };

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResults([]);
    setSearched(true);
    try {
      const res = await fetch(`/api/admin/jobs/find?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleSave = async (job: JobListing) => {
    setSaving(job.id);
    const draftMsg = drafts[job.id]?.message ?? '';
    await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: job.company,
        role: job.title,
        jobUrl: job.url,
        contact: '',
        notes: draftMsg || `Source: ${job.source}. Tags: ${job.tags.slice(0, 5).join(', ')}`,
        status: 'applied',
      }),
    });
    setSaved((prev) => ({ ...prev, [job.id]: true }));
    setSaving(null);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/jobs" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Job Applications
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Find Jobs</h1>
          <p className="text-sm text-white/35">Search live listings — hit <span className="text-amber-400/70">Quick Apply</span> to get an AI-drafted message instantly, then copy and go.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. react typescript nextjs"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>

          {/* Preset chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setQuery(p); search(p); }}
                className="px-3 py-1 rounded-full text-xs border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/15 bg-white/[0.02] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
            <p className="text-sm text-white/25">Searching job boards...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-20 text-white/25 text-sm">
            No results found. Try different keywords.
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <p className="text-xs text-white/30 mb-4">{results.length} listings found</p>
            <div className="space-y-2">
              {results.map((job) => {
                const draft = drafts[job.id];
                const isApplyOpen = applyOpen === job.id;
                return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white/[0.02] border rounded-2xl p-5 transition-colors ${
                    isApplyOpen ? 'border-amber-500/20' : 'border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-white">{job.title}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${SOURCE_BADGE[job.source]}`}>
                          {job.source}
                        </span>
                        {job.remote && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            Remote
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 mb-1">{job.company}</p>
                      <p className="text-xs text-white/35 mb-2">{job.location}{job.postedAt ? ` · ${timeAgo(job.postedAt)}` : ''}</p>

                      {job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {job.tags.slice(0, 6).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-md text-xs bg-white/[0.04] border border-white/[0.06] text-white/40">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {job.description && (
                        <div>
                          <button
                            onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                            className="flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors"
                          >
                            {expanded === job.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {expanded === job.id ? 'Hide' : 'Preview'}
                          </button>
                          <AnimatePresence>
                            {expanded === job.id && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-white/40 mt-2 leading-relaxed overflow-hidden"
                              >
                                {job.description}...
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open job listing"
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {/* Quick Apply */}
                      <button
                        onClick={() => handleQuickApply(job)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                          isApplyOpen
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        {draft?.loading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isApplyOpen ? (
                          <X className="w-3.5 h-3.5" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        {isApplyOpen ? 'Close' : 'Quick Apply'}
                      </button>
                      {/* Save to tracker */}
                      <button
                        onClick={() => handleSave(job)}
                        disabled={!!saved[job.id] || saving === job.id}
                        title="Save to tracker"
                        className={`p-1.5 rounded-lg border transition-colors disabled:opacity-60 ${
                          saved[job.id]
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-white/[0.04] border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15'
                        }`}
                      >
                        {saving === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved[job.id] ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* ── Quick Apply panel ── */}
                  <AnimatePresence>
                    {isApplyOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                          {draft?.loading ? (
                            <div className="flex items-center gap-2 text-sm text-white/40">
                              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                              Drafting your message...
                            </div>
                          ) : draft?.message ? (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-white/35 uppercase tracking-wider">Your message</p>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleCopyDraft(job.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                                      draft.copied
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/80'
                                    }`}
                                  >
                                    {draft.copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {draft.copied ? 'Copied!' : 'Copy'}
                                  </button>
                                  <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Apply now
                                  </a>
                                  {!saved[job.id] && (
                                    <button
                                      onClick={() => handleSave(job)}
                                      disabled={saving === job.id}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
                                    >
                                      {saving === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                      Track it
                                    </button>
                                  )}
                                </div>
                              </div>
                              <pre className="p-4 bg-white/[0.03] border border-amber-500/10 rounded-xl text-sm text-white/70 whitespace-pre-wrap leading-relaxed font-sans">
                                {draft.message}
                              </pre>
                              <p className="text-xs text-white/20 mt-2">Copy the message, then click &ldquo;Apply now&rdquo; to open the listing and paste it.</p>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
