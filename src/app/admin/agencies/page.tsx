'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Plus, Trash2, ExternalLink, ArrowLeft, Copy, Check, Sparkles, X, Mail } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type AgencyStatus = 'cold' | 'contacted' | 'responded' | 'meeting' | 'won' | 'lost';

interface Agency {
  id: string;
  name: string;
  website: string;
  description: string;
  contact: string;
  draftedEmail: string;
  notes: string;
  status: AgencyStatus;
  createdAt: { _seconds: number } | null;
}

const STATUS_ORDER: AgencyStatus[] = ['cold', 'contacted', 'responded', 'meeting', 'won', 'lost'];

const STATUS_CONFIG: Record<AgencyStatus, { label: string; badge: string; dot: string }> = {
  cold:       { label: 'Cold',       badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',         dot: 'bg-zinc-500' },
  contacted:  { label: 'Contacted',  badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',            dot: 'bg-sky-400' },
  responded:  { label: 'Responded',  badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',   dot: 'bg-violet-400' },
  meeting:    { label: 'Meeting',    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',      dot: 'bg-amber-400' },
  won:        { label: 'Won',        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',dot: 'bg-emerald-400' },
  lost:       { label: 'Lost',       badge: 'bg-red-500/10 text-red-400 border-red-500/20',            dot: 'bg-red-500' },
};

const EMPTY_FORM = { name: '', website: '', description: '', contact: '', draftedEmail: '', notes: '', status: 'cold' as AgencyStatus };

function formatDate(ts: { _seconds: number } | null) {
  if (!ts) return '—';
  return new Date(ts._seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildMailto(agency: Agency) {
  const to = agency.contact?.includes('@') ? agency.contact : '';
  const subject = 'Freelance Developer — Overflow / Subcontract Work';
  const params = new URLSearchParams();
  if (to) params.set('to', to);
  params.set('subject', subject);
  params.set('body', agency.draftedEmail || `Hi,\n\nI came across ${agency.name} and wanted to reach out.\n\nI'm a full-stack developer (Next.js, TypeScript, Firebase, OpenAI) with live platforms at crftdweb.com. I'd love to chat about any overflow or subcontract work.\n\nBest,\nObinna Eze-Elijah\nobiezeelijah@gmail.com`);
  return `mailto:${to}?${params.toString()}`;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AgencyStatus | 'all'>('all');

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // AI draft
  const [drafting, setDrafting] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftDesc, setDraftDesc] = useState('');

  // Per-card copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Expanded email view
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchAgencies = () => {
    fetch('/api/admin/agencies')
      .then((r) => r.json())
      .then((data) => {
        setAgencies(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchAgencies(); }, []);

  const filtered = useMemo(() =>
    statusFilter === 'all' ? agencies : agencies.filter((a) => a.status === statusFilter),
  [agencies, statusFilter]);

  const stats = useMemo(() => {
    const counts: Record<AgencyStatus, number> = { cold: 0, contacted: 0, responded: 0, meeting: 0, won: 0, lost: 0 };
    for (const a of agencies) counts[a.status]++;
    return counts;
  }, [agencies]);

  const handleDraft = async () => {
    if (!draftName.trim()) return;
    setDrafting(true);
    const res = await fetch('/api/admin/outreach/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'agency', company: draftName, description: draftDesc }),
    });
    const data = await res.json();
    setForm((f) => ({ ...f, name: draftName, description: draftDesc, draftedEmail: data.message ?? '' }));
    setShowForm(true);
    setDrafting(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/admin/agencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSubmitting(false);
    fetchAgencies();
  };

  const handleStatusUpdate = async (agency: Agency, newStatus: AgencyStatus) => {
    await fetch('/api/admin/agencies', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: agency.id, status: newStatus }),
    });
    setAgencies((prev) => prev.map((a) => a.id === agency.id ? { ...a, status: newStatus } : a));
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/admin/agencies?id=${id}`, { method: 'DELETE' });
    setAgencies((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Admin
          </Link>
          <span className="text-white/20">/</span>
          <Link href="/admin/jobs" className="text-sm text-white/40 hover:text-white/70 transition-colors">
            Jobs
          </Link>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Agency Outreach</h1>
            <p className="text-sm text-white/35">{agencies.length} agenc{agencies.length !== 1 ? 'ies' : 'y'} tracked</p>
          </div>
          <button
            onClick={() => { setShowForm((v) => !v); setDraftName(''); setDraftDesc(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Agency
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`rounded-xl border p-3 text-center transition-all ${
                statusFilter === s
                  ? STATUS_CONFIG[s].badge + ' border-opacity-100'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
              }`}
            >
              <div className="text-lg font-bold text-white">{stats[s]}</div>
              <div className="text-xs text-white/40 mt-0.5">{STATUS_CONFIG[s].label}</div>
            </button>
          ))}
        </div>

        {/* AI Draft Panel */}
        <div className="bg-white/[0.025] border border-indigo-500/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white/80">AI Draft Cold Email</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Agency name *</label>
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="e.g. Studio Thick"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">What they do (optional)</label>
              <input
                value={draftDesc}
                onChange={(e) => setDraftDesc(e.target.value)}
                placeholder="e.g. Branding and Webflow sites for startups"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
              />
            </div>
          </div>
          <button
            onClick={handleDraft}
            disabled={drafting || !draftName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {drafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {drafting ? 'Drafting...' : 'Draft Email'}
          </button>
          <p className="text-xs text-white/25 mt-2">Drafts a personalised cold email and pre-fills the Add Agency form below.</p>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAdd}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Add Agency</h2>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="text-white/30 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Agency name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Studio Thick"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Website</label>
                  <input
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Contact email</label>
                  <input
                    value={form.contact}
                    onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                    placeholder="hello@agency.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">What they do</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="e.g. Webflow sites for SaaS startups"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-1.5 block">Drafted email</label>
                <textarea
                  rows={6}
                  value={form.draftedEmail}
                  onChange={(e) => setForm((f) => ({ ...f, draftedEmail: e.target.value }))}
                  placeholder="Paste or edit your outreach email here..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 resize-none font-mono"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-1.5 block">Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Anything relevant..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AgencyStatus }))}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/40"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s} className="bg-[#111]">{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/25 text-sm">
            {statusFilter === 'all' ? 'No agencies yet — use the AI draft panel above to get started.' : `No agencies with status "${STATUS_CONFIG[statusFilter as AgencyStatus].label}".`}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((agency) => (
              <motion.div
                key={agency.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-semibold text-white">{agency.name}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[agency.status].badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[agency.status].dot}`} />
                        {STATUS_CONFIG[agency.status].label}
                      </span>
                    </div>
                    {agency.description && <p className="text-sm text-white/50 mb-1">{agency.description}</p>}
                    {agency.contact && <p className="text-xs text-white/35 mb-1">Contact: {agency.contact}</p>}
                    {agency.notes && <p className="text-xs text-white/35 italic mb-1">{agency.notes}</p>}
                    <p className="text-xs text-white/20 mt-1">Added {formatDate(agency.createdAt)}</p>

                    {/* Drafted email preview */}
                    {agency.draftedEmail && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedId(expandedId === agency.id ? null : agency.id)}
                          className="text-xs text-indigo-400/70 hover:text-indigo-400 transition-colors"
                        >
                          {expandedId === agency.id ? 'Hide email' : 'Show drafted email'}
                        </button>
                        <AnimatePresence>
                          {expandedId === agency.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <pre className="mt-2 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-white/60 whitespace-pre-wrap font-mono leading-relaxed">
                                {agency.draftedEmail}
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={agency.status}
                      onChange={(e) => handleStatusUpdate(agency, e.target.value as AgencyStatus)}
                      className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 py-1.5 text-xs text-white/60 focus:outline-none hover:border-white/15 transition-colors"
                    >
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s} className="bg-[#111]">{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>

                    {agency.draftedEmail && (
                      <button
                        onClick={() => handleCopy(agency.id, agency.draftedEmail)}
                        title="Copy email"
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-indigo-400 hover:border-indigo-500/20 transition-colors"
                      >
                        {copiedId === agency.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <a
                      href={buildMailto(agency)}
                      title="Open in mail client"
                      className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-indigo-400 hover:border-indigo-500/20 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>

                    {agency.website && (
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(agency.id)}
                      disabled={deletingId === agency.id}
                      className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-red-400 hover:border-red-500/20 transition-colors disabled:opacity-40"
                    >
                      {deletingId === agency.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
