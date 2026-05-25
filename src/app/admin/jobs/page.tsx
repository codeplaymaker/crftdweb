'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Plus, Trash2, ExternalLink, ArrowLeft, Pencil, Check, X, Mail, Sparkles, Copy, Search } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type JobStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'ghosted';

interface JobApplication {
  id: string;
  company: string;
  role: string;
  jobUrl: string;
  contact: string;
  notes: string;
  status: JobStatus;
  appliedAt: { _seconds: number } | null;
}

const STATUS_ORDER: JobStatus[] = ['applied', 'screening', 'interview', 'offer', 'rejected', 'ghosted'];

const STATUS_CONFIG: Record<JobStatus, { label: string; badge: string; dot: string }> = {
  applied:   { label: 'Applied',    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',       dot: 'bg-sky-400' },
  screening: { label: 'Screening',  badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-400' },
  interview: { label: 'Interview',  badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   dot: 'bg-amber-400' },
  offer:     { label: 'Offer',      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  rejected:  { label: 'Rejected',   badge: 'bg-red-500/10 text-red-400 border-red-500/20',         dot: 'bg-red-400' },
  ghosted:   { label: 'Ghosted',    badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',      dot: 'bg-zinc-500' },
};

const EMPTY_FORM = { company: '', role: '', jobUrl: '', contact: '', notes: '', status: 'applied' as JobStatus };

function buildMailto(job: JobApplication) {
  const to = job.contact?.includes('@') ? job.contact : '';
  const isFollowUp = job.status !== 'applied';
  const subject = isFollowUp
    ? `Following up — ${job.role} application`
    : `Junior Developer Interest — ${job.company}`;
  const body = isFollowUp
    ? `Hi,\n\nI wanted to follow up on my application for the ${job.role} role at ${job.company}.\n\nI'm still very interested and happy to chat at your convenience.\n\nBest,\nObinna Eze-Elijah\nobiezeelijah@gmail.com | github.com/codeplaymaker`
    : `Hi,\n\nI came across ${job.company} and wanted to reach out directly.\n\nI'm a full-stack developer (Next.js, TypeScript, Firebase, OpenAI) with two live production platforms I've built from scratch — crftdweb.com and marketplaymaker.com.\n\nI'd love to find out if you have any junior/contract openings or overflow work where I could add value.\n\nPortfolio: crftdweb.com | GitHub: github.com/codeplaymaker\n\nBest,\nObinna Eze-Elijah\nobiezeelijah@gmail.com`;
  const params = new URLSearchParams();
  if (to) params.set('to', to);
  params.set('subject', subject);
  params.set('body', body);
  return `mailto:${to}?${params.toString()}`;
}

function formatDate(ts: { _seconds: number } | null) {
  if (!ts) return '—';
  return new Date(ts._seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<JobStatus>('applied');
  const [editNotes, setEditNotes] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // AI draft
  const [showDraft, setShowDraft] = useState(false);
  const [draftCompany, setDraftCompany] = useState('');
  const [draftRole, setDraftRole] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [drafting, setDrafting] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleDraft = async () => {
    if (!draftCompany.trim()) return;
    setDrafting(true);
    setDraftResult('');
    const res = await fetch('/api/admin/outreach/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'job', company: draftCompany, role: draftRole, description: draftDesc }),
    });
    const data = await res.json();
    setDraftResult(data.message ?? '');
    setDrafting(false);
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftResult);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const fetchJobs = () => {
    fetch('/api/admin/jobs')
      .then((r) => r.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = useMemo(() =>
    statusFilter === 'all' ? jobs : jobs.filter((j) => j.status === statusFilter),
  [jobs, statusFilter]);

  const stats = useMemo(() => {
    const counts: Record<JobStatus, number> = { applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0, ghosted: 0 };
    for (const j of jobs) counts[j.status]++;
    return counts;
  }, [jobs]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSubmitting(false);
    fetchJobs();
  };

  const handleStatusUpdate = async (job: JobApplication, newStatus: JobStatus) => {
    await fetch('/api/admin/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: job.id, status: newStatus }),
    });
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: newStatus } : j));
  };

  const handleSaveEdit = async (job: JobApplication) => {
    await fetch('/api/admin/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: job.id, status: editStatus, notes: editNotes }),
    });
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: editStatus, notes: editNotes } : j));
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/admin/jobs?id=${id}`, { method: 'DELETE' });
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeletingId(null);
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
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Job Applications</h1>
            <p className="text-sm text-white/35">{jobs.length} application{jobs.length !== 1 ? 's' : ''} tracked</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/agencies"
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white/80 rounded-xl text-sm font-medium transition-colors"
            >
              Agency Outreach
            </Link>
            <Link
              href="/admin/jobs/find"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium transition-colors"
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </Link>
            <button
              onClick={() => { setShowDraft((v) => !v); setDraftResult(''); }}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 rounded-xl text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Draft Message
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Application
            </button>
          </div>
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
        <AnimatePresence>
          {showDraft && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/[0.025] border border-violet-500/10 rounded-2xl p-5 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <h2 className="text-sm font-semibold text-white/80">AI Draft Outreach Message</h2>
                </div>
                <button type="button" onClick={() => { setShowDraft(false); setDraftResult(''); }} className="text-white/30 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Company *</label>
                  <input
                    value={draftCompany}
                    onChange={(e) => setDraftCompany(e.target.value)}
                    placeholder="e.g. Seeing Systems"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Role</label>
                  <input
                    value={draftRole}
                    onChange={(e) => setDraftRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-white/40 mb-1.5 block">Job description / context</label>
                <textarea
                  rows={4}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  placeholder="Paste the job description here or describe what the company does..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40 resize-none"
                />
              </div>
              <button
                onClick={handleDraft}
                disabled={drafting || !draftCompany.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {drafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {drafting ? 'Drafting...' : 'Generate Message'}
              </button>

              {draftResult && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-white/40 uppercase tracking-wider">Generated message</p>
                    <button
                      onClick={handleCopyDraft}
                      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-indigo-400 transition-colors"
                    >
                      {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedDraft ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                    {draftResult}
                  </pre>
                  <button
                    onClick={() => {
                      setForm((f) => ({ ...f, company: draftCompany, role: draftRole, notes: draftResult }));
                      setShowForm(true);
                      setShowDraft(false);
                    }}
                    className="mt-3 text-xs text-indigo-400/70 hover:text-indigo-400 transition-colors"
                  >
                    + Save to tracker
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
              <h2 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">New Application</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Company *</label>
                  <input
                    required
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="e.g. Acme Agency"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Role *</label>
                  <input
                    required
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="e.g. Junior Frontend Developer"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Job URL</label>
                  <input
                    type="url"
                    value={form.jobUrl}
                    onChange={(e) => setForm((f) => ({ ...f, jobUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Contact / Recruiter</label>
                  <input
                    value={form.contact}
                    onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                    placeholder="Name or email"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>
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
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as JobStatus }))}
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
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                  className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/25 text-sm">
            {statusFilter === 'all' ? 'No applications yet — add your first one.' : `No applications with status "${STATUS_CONFIG[statusFilter as JobStatus].label}".`}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors"
              >
                {editingId === job.id ? (
                  /* ── Edit mode ── */
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{job.company}</p>
                        <p className="text-sm text-white/50">{job.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSaveEdit(job)} className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as JobStatus)}
                        className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none"
                      >
                        {STATUS_ORDER.map((s) => (
                          <option key={s} value={s} className="bg-[#111]">{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none resize-none"
                    />
                  </div>
                ) : (
                  /* ── View mode ── */
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span className="font-semibold text-white">{job.company}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[job.status].badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[job.status].dot}`} />
                          {STATUS_CONFIG[job.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-1">{job.role}</p>
                      {job.contact && <p className="text-xs text-white/35 mb-1">Contact: {job.contact}</p>}
                      {job.notes && <p className="text-xs text-white/35 italic">{job.notes}</p>}
                      <p className="text-xs text-white/20 mt-2">Applied {formatDate(job.appliedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Quick status change */}
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusUpdate(job, e.target.value as JobStatus)}
                        className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 py-1.5 text-xs text-white/60 focus:outline-none hover:border-white/15 transition-colors"
                      >
                        {STATUS_ORDER.map((s) => (
                          <option key={s} value={s} className="bg-[#111]">{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>
                      <a
                        href={buildMailto(job)}
                        title={job.contact?.includes('@') ? `Email ${job.contact}` : 'Compose cold outreach'}
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-indigo-400 hover:border-indigo-500/20 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                      {job.jobUrl && (
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => { setEditingId(job.id); setEditStatus(job.status); setEditNotes(job.notes); }}
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={deletingId === job.id}
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-red-400 hover:border-red-500/20 transition-colors disabled:opacity-40"
                      >
                        {deletingId === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
