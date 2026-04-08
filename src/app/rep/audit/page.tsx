'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getAuth } from 'firebase/auth';
import { Search, Loader2, ArrowLeft, Globe, Smartphone, Monitor, AlertTriangle, CheckCircle, ExternalLink, Copy, Check, Share2 } from 'lucide-react';
import Link from 'next/link';

interface AuditScores {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
}

interface AuditMetrics {
  fcp: string;
  lcp: string;
  tbt: string;
  cls: string;
  speedIndex: string;
  interactive: string;
}

interface AuditOpportunity {
  title: string;
  description: string;
  displayValue: string;
}

interface AuditResult {
  url: string;
  strategy: 'mobile' | 'desktop';
  scores: AuditScores;
  metrics: AuditMetrics;
  opportunities: AuditOpportunity[];
}

function ScoreRing({ score, label, size = 72 }: { score: number; label: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  const strokeColor = score >= 90 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={strokeColor} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center font-bold text-lg ${color}`}>
          {score}
        </div>
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function MetricRow({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-sm text-white/50">{label}</span>
      <span className={`text-sm font-mono font-medium ${good === undefined ? 'text-white/70' : good ? 'text-green-400' : 'text-red-400'}`}>
        {value}
      </span>
    </div>
  );
}

function BusinessImpact({ scores }: { scores: AuditScores }) {
  const issues: string[] = [];
  if (scores.performance < 50) issues.push('Your site takes too long to load. Over 50% of visitors leave if a page takes more than 3 seconds. You are losing potential customers every day.');
  else if (scores.performance < 90) issues.push('Your site speed is average. Faster competitors are likely capturing visitors you are losing to slow load times.');
  if (scores.seo < 80) issues.push('Your SEO score is low. This means Google is less likely to show your site in search results — people searching for your services may never find you.');
  if (scores.accessibility < 80) issues.push('Accessibility issues mean some users cannot navigate your site properly. This also affects your Google rankings.');
  if (scores.bestPractices < 80) issues.push('Your site has technical issues that affect security and reliability. This can erode trust with visitors.');
  if (issues.length === 0) issues.push('Your site scores well technically — but scores alone do not guarantee conversions. Design, copy, and user experience matter just as much.');

  return (
    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">What This Means for Your Business</h3>
      {issues.map((issue, i) => (
        <p key={i} className="text-sm text-white/60 leading-relaxed">{issue}</p>
      ))}
    </div>
  );
}

export default function AuditPage() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, AuditResult>>({});
  const [view, setView] = useState<'mobile' | 'desktop'>('mobile');
  const [auditUrl, setAuditUrl] = useState('');
  const [copiedResults, setCopiedResults] = useState(false);

  const fetchStrategy = useCallback(async (targetUrl: string, strategy: 'mobile' | 'desktop') => {
    const token = await getAuth().currentUser?.getIdToken();
    const res = await fetch('/api/rep/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ url: targetUrl, strategy }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Audit failed');
    }

    return (await res.json()) as AuditResult;
  }, []);

  const runAudit = useCallback(async () => {
    if (!url.trim() || !user) return;
    setLoading(true);
    setError(null);
    setResults({});
    setAuditUrl(url.trim());

    try {
      const result = await fetchStrategy(url.trim(), view);
      setResults({ [view]: result });

      // Fetch the other strategy in the background
      const other = view === 'mobile' ? 'desktop' : 'mobile';
      fetchStrategy(url.trim(), other).then((r) =>
        setResults((prev) => ({ ...prev, [other]: r }))
      ).catch(() => { /* silent — user can retry via toggle */ });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed');
    } finally {
      setLoading(false);
    }
  }, [url, user, view, fetchStrategy]);

  const switchView = useCallback(async (strategy: 'mobile' | 'desktop') => {
    setView(strategy);
    if (results[strategy] || !auditUrl) return;
    // Fetch if not cached
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStrategy(auditUrl, strategy);
      setResults((prev) => ({ ...prev, [strategy]: result }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed');
    } finally {
      setLoading(false);
    }
  }, [results, auditUrl, fetchStrategy]);

  const data = results[view] || null;
  const avg = data ? Math.round((data.scores.performance + data.scores.accessibility + data.scores.seo + data.scores.bestPractices) / 4) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div>
        <Link href="/rep/dashboard" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Website Audit</h1>
        <p className="text-sm text-white/40 mt-1">Run a free audit on any prospect&apos;s website. Share the results to start the conversation.</p>
      </div>

      {/* URL Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && runAudit()}
            placeholder="e.g. example.com"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20"
            disabled={loading}
          />
        </div>
        <button
          onClick={runAudit}
          disabled={loading || !url.trim()}
          className="px-5 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors disabled:opacity-30 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Running...' : 'Run Audit'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white/30" />
          <p className="text-sm text-white/40">Analysing website — this takes 15–30 seconds...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Header + Strategy Toggle */}
          <div className="bg-white/5 border border-white/8 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white flex items-center gap-1.5">
                  {data.url} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex bg-white/5 rounded-lg p-0.5">
                <button
                  onClick={() => switchView('mobile')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${view === 'mobile' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                  <Smartphone className="w-3 h-3" /> Mobile
                </button>
                <button
                  onClick={() => switchView('desktop')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${view === 'desktop' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                  <Monitor className="w-3 h-3" /> Desktop
                </button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`text-5xl font-black ${avg >= 90 ? 'text-green-400' : avg >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {avg}
              </div>
              <div className="text-left">
                <p className={`text-sm font-semibold ${avg >= 90 ? 'text-green-400' : avg >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {avg >= 90 ? 'Excellent' : avg >= 70 ? 'Needs Work' : avg >= 50 ? 'Poor' : 'Critical'}
                </p>
                <p className="text-xs text-white/30">Overall Score</p>
              </div>
            </div>

            {/* Score Rings */}
            <div className="grid grid-cols-2 gap-4 sm:flex sm:justify-center sm:gap-6">
              <ScoreRing score={data.scores.performance} label="Speed" />
              <ScoreRing score={data.scores.accessibility} label="Access." />
              <ScoreRing score={data.scores.seo} label="SEO" />
              <ScoreRing score={data.scores.bestPractices} label="Best Prac." />
            </div>
          </div>

          {/* Business Impact */}
          <BusinessImpact scores={data.scores} />

          {/* Key Metrics */}
          <div className="bg-white/5 border border-white/8 rounded-xl p-5">
            <h3 className="text-xs text-white/30 uppercase tracking-widest mb-3">Key Metrics</h3>
            <MetricRow label="First Contentful Paint" value={data.metrics.fcp} />
            <MetricRow label="Largest Contentful Paint" value={data.metrics.lcp} />
            <MetricRow label="Total Blocking Time" value={data.metrics.tbt} />
            <MetricRow label="Cumulative Layout Shift" value={data.metrics.cls} />
            <MetricRow label="Speed Index" value={data.metrics.speedIndex} />
            <MetricRow label="Time to Interactive" value={data.metrics.interactive} />
          </div>

          {/* Issues */}
          {data.opportunities.length > 0 && (
            <div className="bg-white/5 border border-white/8 rounded-xl p-5">
              <h3 className="text-xs text-white/30 uppercase tracking-widest mb-3">Issues Found</h3>
              <div className="space-y-3">
                {data.opportunities.map((opp, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white/70 font-medium">{opp.title}</p>
                      {opp.displayValue && <p className="text-xs text-white/30 mt-0.5">{opp.displayValue}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (!data) return;
                const text = [
                  `Website Audit Report — ${data.url}`,
                  `Strategy: ${view === 'mobile' ? 'Mobile' : 'Desktop'}`,
                  `Overall Score: ${avg}/100 (${avg >= 90 ? 'Excellent' : avg >= 70 ? 'Needs Work' : avg >= 50 ? 'Poor' : 'Critical'})`,
                  '',
                  `Speed: ${data.scores.performance}/100`,
                  `Accessibility: ${data.scores.accessibility}/100`,
                  `SEO: ${data.scores.seo}/100`,
                  `Best Practices: ${data.scores.bestPractices}/100`,
                  '',
                  'Key Metrics:',
                  `  First Contentful Paint: ${data.metrics.fcp}`,
                  `  Largest Contentful Paint: ${data.metrics.lcp}`,
                  `  Total Blocking Time: ${data.metrics.tbt}`,
                  `  Cumulative Layout Shift: ${data.metrics.cls}`,
                  '',
                  ...(data.opportunities.length > 0 ? [
                    'Issues Found:',
                    ...data.opportunities.map(o => `  • ${o.title}${o.displayValue ? ` (${o.displayValue})` : ''}`),
                    '',
                  ] : []),
                  'Want a site that scores 95+? Book a free discovery call:',
                  'https://www.crftdweb.com/contact',
                  '',
                  'Powered by CrftdWeb · Google PageSpeed Insights',
                ].join('\n');
                navigator.clipboard.writeText(text);
                setCopiedResults(true);
                setTimeout(() => setCopiedResults(false), 2000);
              }}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 font-medium transition-colors flex items-center justify-center gap-2"
            >
              {copiedResults ? <><Check className="w-4 h-4 text-green-400" /> Copied to clipboard</> : <><Copy className="w-4 h-4" /> Copy Results</>}
            </button>
            <button
              onClick={() => {
                if (!data) return;
                const text = `I ran a free audit on ${data.url} — it scored ${avg}/100. Here's what I found and how we can fix it. Want me to walk you through it?`;
                navigator.clipboard.writeText(text);
              }}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 font-medium transition-colors flex items-center gap-2"
              title="Copy outreach message"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 text-center space-y-3">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Want a website that scores 95+?</h3>
            <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
              CrftdWeb builds custom-coded sites in Next.js — the same tech used by Nike, Netflix, and Notion.
              Every site we build scores 90–100 on Google PageSpeed. Starting from £997.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-2.5 bg-green-500 text-black font-semibold text-sm rounded-xl hover:bg-green-400 transition-colors"
            >
              Book a Free Discovery Call
            </a>
          </div>

          {/* Powered by */}
          <p className="text-[10px] text-white/20 text-center">
            Powered by Google PageSpeed Insights API · CrftdWeb Website Audit
          </p>
        </>
      )}
    </div>
  );
}
