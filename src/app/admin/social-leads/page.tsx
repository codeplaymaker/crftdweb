'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Loader2, RefreshCw, ExternalLink, Radio } from 'lucide-react';

interface SocialLead {
  id: string;
  source: 'reddit' | 'hackernews';
  title: string;
  snippet: string;
  url: string;
  username: string;
  subreddit: string;
  postedAt: number;
  status: 'new' | 'dismissed' | 'converted';
  matchedKeyword: string;
  scope?: 'uk' | 'global';
}

type FilterTab = 'new' | 'all' | 'dismissed';
type SourceFilter = 'all' | 'reddit' | 'hackernews';

function timeAgo(unixSeconds: number): string {
  const diff = Date.now() / 1000 - unixSeconds;
  if (diff < 60) return 'just now';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function SocialLeadsPage() {
  const [leads, setLeads] = useState<SocialLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ newLeads: number } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('new');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch('/api/admin/social-leads');
    if (res.ok) {
      const data = await res.json() as SocialLead[];
      setLeads(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }

  async function runScan() {
    setScanning(true);
    setScanResult(null);
    const res = await fetch('/api/admin/social-listener');
    if (res.ok) {
      const data = await res.json() as { newLeads: number };
      setScanResult(data);
      await fetchLeads();
    }
    setScanning(false);
  }

  async function updateStatus(id: string, status: SocialLead['status']) {
    setUpdating(id);
    await fetch('/api/admin/social-leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    setUpdating(null);
  }

  const filtered = useMemo(() => {
    let list = leads;
    if (filter === 'new') list = list.filter((l) => l.status === 'new');
    else if (filter === 'dismissed') list = list.filter((l) => l.status === 'dismissed');
    if (sourceFilter !== 'all') list = list.filter((l) => l.source === sourceFilter);
    return list;
  }, [leads, filter, sourceFilter]);

  const counts = useMemo(() => ({
    new: leads.filter((l) => l.status === 'new').length,
    dismissed: leads.filter((l) => l.status === 'dismissed').length,
    all: leads.length,
  }), [leads]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Admin
            </Link>
            <span className="text-white/10">/</span>
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Radio className="w-4 h-4 text-orange-400" />
                </div>
                <h1 className="text-xl font-semibold text-white tracking-tight">Social Listener</h1>
              </div>
              <p className="text-xs text-white/25 mt-0.5 ml-10.5">Reddit keyword scanner — people asking for web design help</p>
            </div>
          </div>

          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scanning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {scanning ? 'Scanning Reddit…' : 'Run Scan'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Scan result toast */}
        {scanResult && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Scan complete — <strong>{scanResult.newLeads} new lead{scanResult.newLeads !== 1 ? 's' : ''}</strong> found
            <button onClick={() => setScanResult(null)} className="ml-auto text-emerald-400/40 hover:text-emerald-400 transition-colors">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'New Leads', value: counts.new, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
            { label: 'Total Found', value: counts.all, color: 'text-white/60', bg: 'bg-white/[0.03] border-white/[0.06]' },
            { label: 'Dismissed', value: counts.dismissed, color: 'text-white/30', bg: 'bg-white/[0.02] border-white/[0.04]' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-xl px-5 py-4`}>
              <p className="text-xs text-white/30 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/[0.06] pb-4">
          {(['new', 'all', 'dismissed'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                filter === tab
                  ? 'bg-white/[0.08] text-white font-medium'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {tab}
              <span className={`ml-1.5 text-xs ${filter === tab ? 'text-white/50' : 'text-white/15'}`}>
                {counts[tab]}
              </span>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {/* Source filter */}
            {(['all', 'reddit', 'hackernews'] as SourceFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  sourceFilter === s
                    ? 'bg-white/[0.08] text-white/70'
                    : 'text-white/20 hover:text-white/40'
                }`}
              >
                {s === 'hackernews' ? 'HN' : s === 'reddit' ? 'Reddit' : 'All sources'}
              </button>
            ))}
            <span className="text-white/10 text-xs">·</span>
            <div className="flex items-center gap-1.5 text-xs text-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400/60 animate-pulse" />
              Auto-scans daily at 7am
            </div>
          </div>
        </div>

        {/* Leads list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/20">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Radio className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              {filter === 'new' ? 'No new leads — run a scan to check Reddit + HN' : 'Nothing here yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead) => (
              <div
                key={lead.id}
                className={`border rounded-xl p-5 transition-colors ${
                  lead.status === 'dismissed'
                    ? 'border-white/[0.03] bg-white/[0.01] opacity-50'
                    : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Source badge */}
                  <div className="mt-0.5 flex-shrink-0">
                    {lead.source === 'reddit' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF4500] text-[10px] font-semibold tracking-wide">
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <circle cx="10" cy="10" r="10" fill="#FF4500" />
                          <path d="M16.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.08 2.13.45a1 1 0 101.07-.97 1 1 0 00-.96.68l-2.38-.5a.16.16 0 00-.19.12l-.73 3.44a7.14 7.14 0 00-3.82 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 000-.44 1.46 1.46 0 00.4-1.03zM7.5 11a1 1 0 111 1 1 1 0 01-1-1zm5.63 2.65a3.5 3.5 0 01-2.13.6 3.5 3.5 0 01-2.13-.6.16.16 0 01.22-.22 3.27 3.27 0 001.91.5 3.27 3.27 0 001.91-.5.16.16 0 01.22.22zm-.13-1.65a1 1 0 111-1 1 1 0 01-1 1z" fill="white" />
                        </svg>
                        r/{lead.subreddit}
                        {lead.scope === 'uk' && (
                          <span className="ml-1 text-[#FF4500]/60">🇬🇧</span>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF6600]/10 border border-[#FF6600]/20 text-[#FF6600] text-[10px] font-semibold tracking-wide">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                        </svg>
                        {lead.subreddit}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-medium text-white leading-snug">{lead.title}</h3>
                      <span className="text-xs text-white/20 whitespace-nowrap flex-shrink-0">
                        {timeAgo(lead.postedAt)}
                      </span>
                    </div>

                    {lead.snippet && lead.snippet !== lead.title && (
                      <p className="text-xs text-white/35 mt-1.5 leading-relaxed line-clamp-2">
                        {lead.snippet}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-white/20">u/{lead.username}</span>
                      <span className="text-white/10">·</span>
                      <span className="text-[10px] text-white/15 font-mono">matched: &quot;{lead.matchedKeyword}&quot;</span>

                      <div className="ml-auto flex items-center gap-2">
                        <a
                          href={lead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View post
                        </a>

                        {lead.status === 'new' ? (
                          <button
                            onClick={() => updateStatus(lead.id, 'dismissed')}
                            disabled={updating === lead.id}
                            className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] text-white/25 hover:text-white/50 hover:border-white/[0.12] transition-colors disabled:opacity-40"
                          >
                            {updating === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Dismiss'}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(lead.id, 'new')}
                            disabled={updating === lead.id}
                            className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] text-white/25 hover:text-white/50 hover:border-white/[0.12] transition-colors disabled:opacity-40"
                          >
                            {updating === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Restore'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
