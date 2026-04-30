'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Search, Loader2, Trash2,
  Mail, ExternalLink, RefreshCw, Target, Globe,
  CheckCircle2, Clock, Send, Eye, MousePointerClick, Phone,
  Zap, BarChart3, ThumbsUp, CalendarCheck, Layers,
} from 'lucide-react';
import Link from 'next/link';

/* ─── Types ─────────────────────────────────── */

interface PipelineStats {
  totalHunts: number;
  totalBusinesses: number;
  totalAudited: number;
  totalPreviews: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBooked: number;
}

interface Hunt {
  id: string;
  niche: string;
  city: string;
  country: string;
  status: 'running' | 'complete' | 'error';
  businessCount: number;
  auditsCompleted: number;
  gradeCounts: { A: number; B: number; C: number; D: number };
  createdAt: string | null;
}

interface AuditRow {
  performanceScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  gradeReason: string;
  mobile: boolean;
  https: boolean;
  lcp: number;
  screenshotUrl: string | null;
}

interface PreviewRow {
  id: string;
  previewUrl: string;
  status: string;
  emailSentAt: string | null;
  headline?: string;
}

interface BusinessRow {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  address: string;
  rating: number;
  reviewCount: number;
  audit: AuditRow | null;
  preview: PreviewRow | null;
}

/* ─── Grade badge ─────────────────────────── */

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  B: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  C: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  D: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${GRADE_COLORS[grade] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
      {grade}
    </span>
  );
}

/* ─── Preview status ──────────────────────── */

const STATUS_COLORS: Record<string, string> = {
  pending:  'text-zinc-400',
  built:    'text-sky-400',
  approved: 'text-blue-400',
  sent:     'text-purple-400',
  opened:   'text-amber-400',
  clicked:  'text-orange-400',
  booked:   'text-emerald-400',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending:  <Clock className="w-3 h-3" />,
  built:    <CheckCircle2 className="w-3 h-3" />,
  approved: <ThumbsUp className="w-3 h-3" />,
  sent:     <Send className="w-3 h-3" />,
  opened:   <Eye className="w-3 h-3" />,
  clicked:  <MousePointerClick className="w-3 h-3" />,
  booked:   <CalendarCheck className="w-3 h-3" />,
};

/* ─── Stats bar ───────────────────────────── */

function StatsBar({ stats }: { stats: PipelineStats | null }) {
  const openRate = stats && stats.totalSent > 0 ? Math.round((stats.totalOpened / stats.totalSent) * 100) : null;
  const clickRate = stats && stats.totalOpened > 0 ? Math.round((stats.totalClicked / stats.totalOpened) * 100) : null;

  const items = [
    { label: 'Hunts',     value: stats?.totalHunts ?? '—',        color: 'text-orange-400' },
    { label: 'Scraped',   value: stats?.totalBusinesses ?? '—',   color: 'text-zinc-300' },
    { label: 'Audited',   value: stats?.totalAudited ?? '—',      color: 'text-zinc-300' },
    { label: 'Previews',  value: stats?.totalPreviews ?? '—',     color: 'text-sky-400' },
    { label: 'Sent',      value: stats?.totalSent ?? '—',         color: 'text-purple-400' },
    { label: 'Open rate', value: openRate !== null ? `${openRate}%` : '—', color: 'text-amber-400' },
    { label: 'Click rate',value: clickRate !== null ? `${clickRate}%` : '—', color: 'text-orange-400' },
    { label: 'Booked',    value: stats?.totalBooked ?? '—',       color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
      {items.map((s) => (
        <div key={s.label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2.5 text-center">
          <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Hunt Card ───────────────────────────── */

function HuntCard({ hunt, selected, onSelect, onDelete }: {
  hunt: Hunt;
  selected: boolean;
  onSelect: (h: Hunt) => void;
  onDelete: (id: string) => void;
}) {
  const progress = hunt.businessCount > 0 ? Math.round((hunt.auditsCompleted / hunt.businessCount) * 100) : 0;
  const date = hunt.createdAt
    ? new Date(hunt.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div
      onClick={() => onSelect(hunt)}
      className={`group flex items-center gap-3 border rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
        selected ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.06]'
      }`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? 'bg-orange-500/20' : 'bg-orange-500/10'}`}>
        <Target className="w-3.5 h-3.5 text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white leading-tight truncate">
          {hunt.niche} <span className="text-zinc-500">in</span> {hunt.city}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-600 flex-wrap">
          <span>{hunt.businessCount} biz</span>
          {(hunt.gradeCounts?.C ?? 0) > 0 && <span className="text-amber-400">{hunt.gradeCounts.C}C</span>}
          {(hunt.gradeCounts?.D ?? 0) > 0 && <span className="text-red-400">{hunt.gradeCounts.D}D</span>}
          {(hunt.gradeCounts?.B ?? 0) > 0 && <span className="text-sky-400">{hunt.gradeCounts.B}B</span>}
          <span>· {date}</span>
        </div>
      </div>
      {hunt.status === 'running' ? (
        <div className="flex items-center gap-1 text-xs text-amber-400 flex-shrink-0">
          <Loader2 className="w-3 h-3 animate-spin" />{progress}%
        </div>
      ) : (
        <span className={`text-xs flex-shrink-0 ${hunt.status === 'complete' ? 'text-emerald-400' : 'text-red-400'}`}>
          {hunt.status}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(hunt.id); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-600 hover:text-red-400 transition-all flex-shrink-0"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─── Business Card ───────────────────────── */

function BusinessCard({ biz, onBuild, onApprove, onSendOutreach, building, approving, sending }: {
  biz: BusinessRow;
  onBuild: (id: string) => void;
  onApprove: (previewId: string, bizId: string) => void;
  onSendOutreach: (biz: BusinessRow, email: string) => void;
  building: boolean;
  approving: boolean;
  sending: boolean;
}) {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [findingEmail, setFindingEmail] = useState(false);

  const grade = biz.audit?.grade;
  const preview = biz.preview;

  const handleFindEmail = async () => {
    if (!biz.website) return;
    setFindingEmail(true);
    const domain = biz.website.replace(/^https?:\/\//, '').split('/')[0];
    const res = await fetch(`/api/admin/hunter/find-email?domain=${encodeURIComponent(domain)}`);
    const data = await res.json();
    if (data.email) setEmail(data.email);
    setShowEmail(true);
    setFindingEmail(false);
  };

  const handleSend = () => {
    if (!email.trim()) return;
    onSendOutreach(biz, email.trim());
    setShowEmail(false);
    setEmail('');
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{biz.name}</span>
            {grade && <GradeBadge grade={grade} />}
            {biz.audit && <span className="text-xs text-zinc-500">{biz.audit.performanceScore}/100</span>}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 flex-wrap">
            {biz.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{biz.phone}</span>}
            {biz.website && (
              <a href={biz.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-sky-400 hover:text-sky-300">
                <Globe className="w-3 h-3" />{biz.website.replace(/^https?:\/\//, '').split('/')[0]}
              </a>
            )}
            {biz.rating > 0 && <span>⭐ {biz.rating} ({biz.reviewCount})</span>}
          </div>
          {biz.audit?.gradeReason && <p className="text-xs text-zinc-600 mt-0.5 italic">{biz.audit.gradeReason}</p>}
        </div>
        {biz.audit?.screenshotUrl && (
          <img src={biz.audit.screenshotUrl} alt={biz.name} className="w-14 h-10 object-cover rounded border border-white/10 flex-shrink-0" />
        )}
      </div>

      {/* Preview status */}
      {preview && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className={`flex items-center gap-1 ${STATUS_COLORS[preview.status] ?? 'text-zinc-400'}`}>
            {STATUS_ICONS[preview.status]}{preview.status}
          </span>
          <a href={preview.previewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300">
            <ExternalLink className="w-3 h-3" />view preview
          </a>
          {preview.headline && <span className="text-zinc-600 truncate max-w-[180px]">"{preview.headline}"</span>}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {!preview && biz.audit && (grade === 'C' || grade === 'D') && (
          <button onClick={() => onBuild(biz.id)} disabled={building}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg transition-colors disabled:opacity-50">
            {building ? <Loader2 className="w-3 h-3 animate-spin" /> : <Layers className="w-3 h-3" />}
            Build preview
          </button>
        )}
        {preview?.status === 'built' && (
          <button onClick={() => onApprove(preview.id, biz.id)} disabled={approving}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-colors disabled:opacity-50">
            {approving ? <Loader2 className="w-3 h-3 animate-spin" /> : <ThumbsUp className="w-3 h-3" />}
            Approve
          </button>
        )}
        {preview && (preview.status === 'approved' || preview.status === 'built') && !showEmail && (
          <button onClick={handleFindEmail} disabled={findingEmail || !biz.website}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg transition-colors disabled:opacity-50">
            {findingEmail ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
            {findingEmail ? 'Finding email...' : 'Send outreach'}
          </button>
        )}
      </div>

      {/* Email input */}
      {showEmail && (
        <div className="flex items-center gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="prospect@email.com"
            className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
            autoFocus />
          <button onClick={handleSend} disabled={sending || !email.trim()}
            className="px-3 py-1.5 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1">
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}Send
          </button>
          <button onClick={() => { setShowEmail(false); setEmail(''); }} className="px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-300">✕</button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ───────────────────────────── */

export default function AdminHunterPage() {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loadingHunts, setLoadingHunts] = useState(true);
  const [loadingBiz, setLoadingBiz] = useState(false);
  const [niche, setNiche] = useState('');
  const [city, setCity] = useState('');
  const [launching, setLaunching] = useState(false);
  const [launchMsg, setLaunchMsg] = useState('');
  const [building, setBuilding] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [bulkBuilding, setBulkBuilding] = useState(false);
  const [bulkSending, setBulkSending] = useState(false);
  const [gradeFilter, setGradeFilter] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all');
  const [view, setView] = useState<'leads' | 'tracking'>('leads');

  const fetchHunts = useCallback(async () => {
    setLoadingHunts(true);
    const res = await fetch('/api/admin/hunter');
    const data = await res.json();
    setHunts(Array.isArray(data?.hunts) ? data.hunts : []);
    setStats(data?.stats ?? null);
    setLoadingHunts(false);
  }, []);

  useEffect(() => { fetchHunts(); }, [fetchHunts]);

  const loadHunt = useCallback(async (hunt: Hunt) => {
    setSelectedHunt(hunt);
    setLoadingBiz(true);
    setGradeFilter('all');
    const res = await fetch(`/api/admin/hunter/${hunt.id}`);
    const data = await res.json();
    setBusinesses(Array.isArray(data) ? data : []);
    setLoadingBiz(false);
  }, []);

  const handleLaunch = async () => {
    if (!niche.trim() || !city.trim()) return;
    setLaunching(true);
    setLaunchMsg('');
    try {
      const res = await fetch('/api/hunter/hunt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche.trim(), city: city.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setLaunchMsg(`Error: ${data.error}`);
      } else {
        setLaunchMsg('Hunt launched — auditing in background...');
        setNiche(''); setCity('');
        await fetchHunts();
      }
    } catch { setLaunchMsg('Failed to start hunt.'); }
    setLaunching(false);
  };

  const handleDelete = async (huntId: string) => {
    if (!confirm('Delete this hunt and all its data?')) return;
    await fetch(`/api/admin/hunter?huntId=${huntId}`, { method: 'DELETE' });
    setHunts((prev) => prev.filter((h) => h.id !== huntId));
    if (selectedHunt?.id === huntId) { setSelectedHunt(null); setBusinesses([]); }
  };

  const handleBuild = async (businessId: string) => {
    setBuilding(businessId);
    const res = await fetch('/api/hunter/build', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    });
    const data = await res.json();
    if (data.previewUrl) {
      setBusinesses((prev) => prev.map((b) =>
        b.id === businessId ? { ...b, preview: { id: data.previewId, previewUrl: data.previewUrl, status: 'built', emailSentAt: null } } : b
      ));
    }
    setBuilding(null);
  };

  const handleApprove = async (previewId: string, bizId: string) => {
    setApproving(bizId);
    await fetch('/api/admin/hunter/preview', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ previewId, status: 'approved' }),
    });
    setBusinesses((prev) => prev.map((b) =>
      b.id === bizId && b.preview ? { ...b, preview: { ...b.preview, status: 'approved' } } : b
    ));
    setApproving(null);
  };

  const handleSendOutreach = async (biz: BusinessRow, email: string) => {
    if (!biz.preview) return;
    setSending(biz.id);
    await fetch('/api/hunter/outreach', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ previewId: biz.preview.id, email }),
    });
    setBusinesses((prev) => prev.map((b) =>
      b.id === biz.id && b.preview ? { ...b, preview: { ...b.preview, status: 'sent' } } : b
    ));
    setSending(null);
  };

  const handleBulkBuild = async () => {
    if (!selectedHunt) return;
    setBulkBuilding(true);
    const targets = businesses.filter((b) => !b.preview && (b.audit?.grade === 'C' || b.audit?.grade === 'D'));
    for (const biz of targets) await handleBuild(biz.id);
    setBulkBuilding(false);
  };

  const handleBulkSend = async () => {
    if (!selectedHunt) return;
    setBulkSending(true);
    await fetch('/api/hunter/outreach', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ huntId: selectedHunt.id }),
    });
    await loadHunt(selectedHunt);
    setBulkSending(false);
  };

  const filtered = (gradeFilter === 'all' ? businesses : businesses.filter((b) => b.audit?.grade === gradeFilter))
    .sort((a, b) => {
      const order: Record<string, number> = { D: 0, C: 1, B: 2, A: 3 };
      return (a.audit ? (order[a.audit.grade] ?? 4) : 5) - (b.audit ? (order[b.audit.grade] ?? 4) : 5);
    });

  const gradeCounts = businesses.reduce((acc, b) => {
    const g = b.audit?.grade; if (g) acc[g] = (acc[g] ?? 0) + 1; return acc;
  }, {} as Record<string, number>);

  const bulkBuildCount = businesses.filter((b) => !b.preview && (b.audit?.grade === 'C' || b.audit?.grade === 'D')).length;
  const approvedCount = businesses.filter((b) => b.preview?.status === 'approved').length;
  const tracked = businesses.filter((b) => b.preview && ['sent', 'opened', 'clicked', 'booked'].includes(b.preview.status));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />AI Hunter
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">Scrape → Audit → Preview → Approve → Outreach</p>
          </div>
          <button onClick={fetchHunts} className="ml-auto p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats bar */}
        <StatsBar stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* Left */}
          <div className="space-y-3">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-2.5">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">New Hunt</p>
              <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche (e.g. glazing company)"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-orange-500/40" />
              <input value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLaunch()} placeholder="City (e.g. London)"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-orange-500/40" />
              <button onClick={handleLaunch} disabled={launching || !niche.trim() || !city.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50">
                {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {launching ? 'Launching...' : 'Launch Hunt'}
              </button>
              {launchMsg && <p className="text-xs text-zinc-500">{launchMsg}</p>}
            </div>
            <div className="space-y-1.5">
              {loadingHunts ? (
                <div className="flex items-center gap-2 text-zinc-500 text-sm py-4"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
              ) : hunts.length === 0 ? (
                <p className="text-sm text-zinc-600 py-4">No hunts yet.</p>
              ) : (
                hunts.map((h) => (
                  <HuntCard key={h.id} hunt={h} selected={selectedHunt?.id === h.id} onSelect={loadHunt} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4 min-w-0">
            {!selectedHunt ? (
              <div className="flex flex-col items-center justify-center py-24 text-zinc-700">
                <Target className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Select a hunt to see results</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedHunt.niche} — {selectedHunt.city}</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">{businesses.length} businesses · {Object.entries(gradeCounts).map(([g, n]) => `${n}${g}`).join(' · ')}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
                      <button onClick={() => setView('leads')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'leads' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        Leads
                      </button>
                      <button onClick={() => setView('tracking')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'tracking' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        Tracking {tracked.length > 0 && <span className="ml-1 text-purple-400">{tracked.length}</span>}
                      </button>
                    </div>
                    {view === 'leads' && bulkBuildCount > 0 && (
                      <button onClick={handleBulkBuild} disabled={bulkBuilding}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg transition-colors disabled:opacity-50">
                        {bulkBuilding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        Build all C/D ({bulkBuildCount})
                      </button>
                    )}
                    {view === 'leads' && approvedCount > 0 && (
                      <button onClick={handleBulkSend} disabled={bulkSending}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg transition-colors disabled:opacity-50">
                        {bulkSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Send approved ({approvedCount})
                      </button>
                    )}
                  </div>
                </div>

                {view === 'leads' && (
                  <>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['all', 'D', 'C', 'B', 'A'] as const).map((g) => (
                        <button key={g} onClick={() => setGradeFilter(g)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${gradeFilter === g ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/[0.06] text-zinc-500 hover:text-zinc-300'}`}>
                          {g === 'all' ? `All (${businesses.length})` : `${g} (${gradeCounts[g] ?? 0})`}
                        </button>
                      ))}
                    </div>
                    {loadingBiz ? (
                      <div className="flex items-center gap-2 text-zinc-500 text-sm py-8"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                    ) : filtered.length === 0 ? (
                      <p className="text-sm text-zinc-600 py-8">No businesses for this filter.</p>
                    ) : (
                      <div className="space-y-2">
                        {filtered.map((biz) => (
                          <BusinessCard key={biz.id} biz={biz}
                            onBuild={handleBuild} onApprove={handleApprove} onSendOutreach={handleSendOutreach}
                            building={building === biz.id} approving={approving === biz.id} sending={sending === biz.id} />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {view === 'tracking' && (
                  <div className="space-y-2">
                    {tracked.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-zinc-700">
                        <BarChart3 className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm">No emails sent for this hunt yet.</p>
                      </div>
                    ) : tracked.map((biz) => (
                      <div key={biz.id} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3.5 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{biz.name}</span>
                            {biz.audit?.grade && <GradeBadge grade={biz.audit.grade} />}
                          </div>
                          {biz.website && (
                            <a href={biz.website} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:text-sky-300">
                              {biz.website.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                          )}
                          {biz.preview?.emailSentAt && (
                            <p className="text-xs text-zinc-600 mt-0.5">
                              Sent {new Date(biz.preview.emailSentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                        {biz.preview && (
                          <div className="flex items-center gap-3 text-xs flex-shrink-0">
                            <span className={`flex items-center gap-1 font-medium ${STATUS_COLORS[biz.preview.status] ?? 'text-zinc-400'}`}>
                              {STATUS_ICONS[biz.preview.status]}{biz.preview.status}
                            </span>
                            <a href={biz.preview.previewUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
