'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Search, Loader2, ChevronRight, Trash2,
  Mail, ExternalLink, RefreshCw, Target, Globe,
  CheckCircle2, Clock, Send, Eye, MousePointerClick, Phone,
} from 'lucide-react';
import Link from 'next/link';

/* ─── Types ─────────────────────────────────── */

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

/* ─── Grade badge ────────────────────────────── */

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

/* ─── Preview status badge ───────────────────── */

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
  approved: <CheckCircle2 className="w-3 h-3" />,
  sent:     <Send className="w-3 h-3" />,
  opened:   <Eye className="w-3 h-3" />,
  clicked:  <MousePointerClick className="w-3 h-3" />,
  booked:   <CheckCircle2 className="w-3 h-3" />,
};

/* ─── Hunt Row ───────────────────────────────── */

function HuntCard({ hunt, onSelect, onDelete }: {
  hunt: Hunt;
  onSelect: (h: Hunt) => void;
  onDelete: (id: string) => void;
}) {
  const progress = hunt.businessCount > 0
    ? Math.round((hunt.auditsCompleted / hunt.businessCount) * 100)
    : 0;

  const date = hunt.createdAt
    ? new Date(hunt.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div
      onClick={() => onSelect(hunt)}
      className="group flex items-center gap-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 cursor-pointer transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
        <Target className="w-4 h-4 text-orange-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">
          {hunt.niche} <span className="text-zinc-500 font-normal">in</span> {hunt.city}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 flex-wrap">
          <span>{hunt.businessCount} biz</span>
          {(hunt.gradeCounts?.C ?? 0) > 0 && <span className="text-amber-400">{hunt.gradeCounts.C}C</span>}
          {(hunt.gradeCounts?.D ?? 0) > 0 && <span className="text-red-400">{hunt.gradeCounts.D}D</span>}
          {(hunt.gradeCounts?.B ?? 0) > 0 && <span className="text-sky-400">{hunt.gradeCounts.B}B</span>}
          <span>· {date}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="hidden sm:flex items-center gap-2">
        {hunt.status === 'running' ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{progress}%</span>
          </div>
        ) : (
          <span className={`text-xs font-medium ${hunt.status === 'complete' ? 'text-emerald-400' : 'text-red-400'}`}>
            {hunt.status}
          </span>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(hunt.id); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
    </div>
  );
}

/* ─── Business Row ───────────────────────────── */

function BusinessRow({ biz, onBuild, onSendOutreach, building, sending }: {
  biz: BusinessRow;
  onBuild: (id: string) => void;
  onSendOutreach: (biz: BusinessRow, email: string) => void;
  building: boolean;
  sending: boolean;
}) {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (!email.trim()) return;
    onSendOutreach(biz, email.trim());
    setShowEmail(false);
    setEmail('');
  };

  const grade = biz.audit?.grade;
  const preview = biz.preview;

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{biz.name}</span>
            {grade && <GradeBadge grade={grade} />}
            {biz.audit && (
              <span className="text-xs text-zinc-500">{biz.audit.performanceScore}/100</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 flex-wrap">
            {biz.phone && (
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{biz.phone}</span>
            )}
            {biz.website && (
              <a
                href={biz.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300"
              >
                <Globe className="w-3 h-3" />{biz.website.replace(/^https?:\/\//, '').split('/')[0]}
              </a>
            )}
            {biz.rating > 0 && <span>⭐ {biz.rating} ({biz.reviewCount})</span>}
          </div>
          {biz.audit?.gradeReason && (
            <p className="text-xs text-zinc-600 mt-1 italic">{biz.audit.gradeReason}</p>
          )}
        </div>

        {/* Screenshot thumbnail */}
        {biz.audit?.screenshotUrl && (
          <img
            src={biz.audit.screenshotUrl}
            alt={biz.name}
            className="w-16 h-12 object-cover rounded border border-white/10 flex-shrink-0"
          />
        )}
      </div>

      {/* Preview status */}
      {preview && (
        <div className="flex items-center gap-2 text-xs">
          <span className={`flex items-center gap-1 ${STATUS_COLORS[preview.status] ?? 'text-zinc-400'}`}>
            {STATUS_ICONS[preview.status]}
            {preview.status}
          </span>
          <a
            href={preview.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300"
          >
            <ExternalLink className="w-3 h-3" />
            preview
          </a>
        </div>
      )}

      {/* Actions */}
      {!biz.preview && biz.audit && (grade === 'C' || grade === 'D') && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBuild(biz.id)}
            disabled={building}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg transition-colors disabled:opacity-50"
          >
            {building ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
            Build preview
          </button>
        </div>
      )}

      {biz.preview && biz.preview.status === 'built' && (
        <div className="space-y-2">
          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg transition-colors"
            >
              <Mail className="w-3 h-3" />
              Send outreach
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="prospect@email.com"
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={sending || !email.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Send
              </button>
              <button
                onClick={() => { setShowEmail(false); setEmail(''); }}
                className="px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────── */

export default function AdminHunterPage() {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loadingHunts, setLoadingHunts] = useState(true);
  const [loadingBiz, setLoadingBiz] = useState(false);

  // New hunt form
  const [niche, setNiche] = useState('');
  const [city, setCity] = useState('');
  const [launching, setLaunching] = useState(false);
  const [launchMsg, setLaunchMsg] = useState('');

  // Per-business action state
  const [building, setBuilding] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);

  // Grade filter
  const [gradeFilter, setGradeFilter] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all');

  /* Fetch hunts */
  const fetchHunts = useCallback(async () => {
    setLoadingHunts(true);
    const res = await fetch('/api/admin/hunter');
    const data = await res.json();
    setHunts(Array.isArray(data) ? data : []);
    setLoadingHunts(false);
  }, []);

  useEffect(() => { fetchHunts(); }, [fetchHunts]);

  /* Fetch businesses for selected hunt */
  const loadHunt = useCallback(async (hunt: Hunt) => {
    setSelectedHunt(hunt);
    setLoadingBiz(true);
    setGradeFilter('all');
    const res = await fetch(`/api/admin/hunter/${hunt.id}`);
    const data = await res.json();
    setBusinesses(Array.isArray(data) ? data : []);
    setLoadingBiz(false);
  }, []);

  /* Launch a new hunt */
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
        setLaunchMsg(`Hunt started — ${data.businessCount ?? '?'} businesses found. Auditing in background...`);
        setNiche('');
        setCity('');
        await fetchHunts();
      }
    } catch {
      setLaunchMsg('Failed to start hunt. Check console.');
    }
    setLaunching(false);
  };

  /* Delete a hunt */
  const handleDelete = async (huntId: string) => {
    if (!confirm('Delete this hunt and all its data?')) return;
    await fetch(`/api/admin/hunter?huntId=${huntId}`, { method: 'DELETE' });
    setHunts((prev) => prev.filter((h) => h.id !== huntId));
    if (selectedHunt?.id === huntId) {
      setSelectedHunt(null);
      setBusinesses([]);
    }
  };

  /* Build a preview */
  const handleBuild = async (businessId: string) => {
    setBuilding(businessId);
    const res = await fetch('/api/hunter/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    });
    const data = await res.json();
    if (data.previewUrl) {
      setBusinesses((prev) => prev.map((b) =>
        b.id === businessId
          ? { ...b, preview: { id: data.previewId, previewUrl: data.previewUrl, status: 'built', emailSentAt: null } }
          : b
      ));
    }
    setBuilding(null);
  };

  /* Send outreach */
  const handleSendOutreach = async (biz: BusinessRow, email: string) => {
    if (!biz.preview) return;
    setSending(biz.id);
    await fetch('/api/hunter/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ previewId: biz.preview.id, email }),
    });
    setBusinesses((prev) => prev.map((b) =>
      b.id === biz.id && b.preview
        ? { ...b, preview: { ...b.preview, status: 'sent' } }
        : b
    ));
    setSending(null);
  };

  /* Filtered businesses */
  const filtered = gradeFilter === 'all'
    ? businesses
    : businesses.filter((b) => b.audit?.grade === gradeFilter);

  const gradeCounts = businesses.reduce((acc, b) => {
    const g = b.audit?.grade;
    if (g) acc[g] = (acc[g] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              AI Hunter
            </h1>
            <p className="text-sm text-zinc-500">Scrape → Audit → Preview → Outreach</p>
          </div>
          <button
            onClick={fetchHunts}
            className="ml-auto p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: hunt list + new hunt form ── */}
          <div className="space-y-4">

            {/* New hunt */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">New Hunt</p>
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Niche (e.g. glazing company)"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
                placeholder="City (e.g. London)"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
              />
              <button
                onClick={handleLaunch}
                disabled={launching || !niche.trim() || !city.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {launching ? 'Launching...' : 'Launch Hunt'}
              </button>
              {launchMsg && (
                <p className="text-xs text-zinc-400">{launchMsg}</p>
              )}
            </div>

            {/* Hunt list */}
            <div className="space-y-2">
              {loadingHunts ? (
                <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading hunts...
                </div>
              ) : hunts.length === 0 ? (
                <p className="text-sm text-zinc-600 py-4">No hunts yet. Launch your first one.</p>
              ) : (
                hunts.map((h) => (
                  <HuntCard
                    key={h.id}
                    hunt={h}
                    onSelect={loadHunt}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── Right: businesses ── */}
          <div className="lg:col-span-2 space-y-4">
            {!selectedHunt ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                <Target className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Select a hunt to see results</p>
              </div>
            ) : (
              <>
                {/* Hunt header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {selectedHunt.niche} — {selectedHunt.city}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      {businesses.length} businesses · {Object.entries(gradeCounts).map(([g, n]) => `${n}${g}`).join(', ')}
                    </p>
                  </div>
                  {selectedHunt.status === 'running' && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Auditing...
                    </div>
                  )}
                </div>

                {/* Grade filter */}
                <div className="flex items-center gap-2">
                  {(['all', 'D', 'C', 'B', 'A'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGradeFilter(g)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        gradeFilter === g
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-transparent border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {g === 'all' ? 'All' : `${g} (${gradeCounts[g] ?? 0})`}
                    </button>
                  ))}
                </div>

                {/* Business list */}
                {loadingBiz ? (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm py-8">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading businesses...
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="text-sm text-zinc-600 py-8">No businesses for this filter.</p>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((biz) => (
                      <BusinessRow
                        key={biz.id}
                        biz={biz}
                        onBuild={handleBuild}
                        onSendOutreach={handleSendOutreach}
                        building={building === biz.id}
                        sending={sending === biz.id}
                      />
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
