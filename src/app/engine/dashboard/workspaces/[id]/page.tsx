'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getWorkspace, updateWorkspace, getDeliverables, Workspace, Deliverable } from '@/lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

const AGENTS = [
  { id: 'vsl-builder', name: 'VSL Builder', category: 'CONTENT' },
  { id: 'ads-architect', name: 'Ads Architect', category: 'MARKETING' },
  { id: 'offer-architect', name: 'Offer Architect', category: 'SALES' },
  { id: 'sales-asset', name: 'Sales Asset Architect', category: 'SALES' },
  { id: 'landing-page', name: 'Landing Page Copywriter', category: 'CONTENT' },
  { id: 'research-agent', name: 'Research Agent', category: 'RESEARCH' },
  { id: 'niche-architect', name: 'Niche Architect', category: 'RESEARCH' },
  { id: 'category-architect', name: 'Category Architect', category: 'STRATEGY' },
];

const MISSION_SUGGESTIONS = [
  'Write a VSL script for this offer',
  'Create 5 Facebook ad hooks',
  'Write a 5-email welcome sequence',
  'Write the hero section for a landing page',
  'Create a case study from a recent client win',
  'Write 10 LinkedIn posts for this offer',
  'Build an objection handling guide',
  'Research the top 5 competitors in this niche',
];

function formatTime(ts: Timestamp | Date | { seconds: number } | null | undefined): string {
  if (!ts) return 'Never';
  let date: Date;
  if (ts instanceof Date) {
    date = ts;
  } else if ('seconds' in ts) {
    date = new Date((ts as { seconds: number }).seconds * 1000);
  } else {
    return 'Never';
  }
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const CONTEXT_FIELDS = [
  { label: 'CLIENT NAME', key: 'clientName', placeholder: 'e.g. Acme Corp' },
  { label: 'NICHE', key: 'niche', placeholder: 'e.g. SaaS for accountants' },
  { label: 'THEIR OFFER', key: 'offer', placeholder: 'e.g. Lead gen retainer $3K/mo' },
  { label: 'TARGET AUDIENCE', key: 'audience', placeholder: 'e.g. Series A SaaS founders' },
  { label: 'GOALS / KPIs', key: 'goals', placeholder: 'e.g. 50 demos/month by Q2' },
] as const;

export default function WorkspaceDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ clientName: '', niche: '', offer: '', audience: '', goals: '', notes: '', webhookUrl: '' });
  const [saving, setSaving] = useState(false);

  // Mission state
  const [task, setTask] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('vsl-builder');
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  // Deliverable display state
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [newDeliverableId, setNewDeliverableId] = useState<string | null>(null);

  // Refinement state
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [refineTask, setRefineTask] = useState('');
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  // Share state
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [sharedIds, setSharedIds] = useState<Set<string>>(new Set());

  // Rating state
  const [ratings, setRatings] = useState<Record<string, 1 | -1 | null>>({});

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ws, dels] = await Promise.all([
        getWorkspace(workspaceId),
        getDeliverables(workspaceId),
      ]);
      if (!ws || ws.userId !== user.uid) {
        router.push('/engine/dashboard/workspaces');
        return;
      }
      setWorkspace(ws);
      setEditData({
        clientName: ws.clientName,
        niche: ws.niche,
        offer: ws.offer,
        audience: ws.audience,
        goals: ws.goals,
        notes: ws.notes,
        webhookUrl: ws.webhookUrl || '',
      });
      setDeliverables(dels);
      // Hydrate share + rating state from loaded deliverables
      setSharedIds(new Set(dels.filter(d => d.isPublic).map(d => d.id)));
      setRatings(Object.fromEntries(dels.filter(d => d.rating != null).map(d => [d.id, d.rating!])));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, workspaceId, router]);

  useEffect(() => { load(); }, [load]);

  const handleSaveEdit = async () => {
    if (!workspace) return;
    setSaving(true);
    try {
      await updateWorkspace(workspaceId, editData);
      setWorkspace({ ...workspace, ...editData });
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleRunMission = async () => {
    if (!task.trim() || running || !user) return;
    setRunning(true);
    setRunError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/engine/workspace-mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workspaceId, agentId: selectedAgent, task }),
      });

      if (!res.ok) throw new Error('Mission failed');
      const { deliverable } = await res.json();

      // Add to top of deliverables list
      const newItem = {
        ...deliverable,
        createdAt: Timestamp.fromDate(new Date()),
      } as Deliverable;

      setDeliverables(prev => [newItem, ...prev]);
      setNewDeliverableId(deliverable.id);
      setExpanded(deliverable.id);
      setTask('');

      // Update local workspace deliverable count
      setWorkspace(prev =>
        prev ? { ...prev, deliverableCount: (prev.deliverableCount || 0) + 1 } : prev
      );

      setTimeout(() => setNewDeliverableId(null), 4000);
    } catch {
      setRunError('Mission failed. Please try again.');
    } finally {
      setRunning(false);
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (title: string, content: string) => {
    const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.md';
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefine = async (d: Deliverable) => {
    if (!refineTask.trim() || refining || !user) return;
    setRefining(true);
    setRefineError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/engine/workspace-mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspaceId,
          agentId: d.agentId,
          task: refineTask,
          refinementOf: { title: d.title, content: d.content },
        }),
      });
      if (!res.ok) throw new Error('Refinement failed');
      const { deliverable } = await res.json();
      const newItem = { ...deliverable, createdAt: Timestamp.fromDate(new Date()) } as Deliverable;
      setDeliverables(prev => [newItem, ...prev]);
      setNewDeliverableId(deliverable.id);
      setExpanded(deliverable.id);
      setRefiningId(null);
      setRefineTask('');
      setWorkspace(prev => prev ? { ...prev, deliverableCount: (prev.deliverableCount || 0) + 1 } : prev);
      setTimeout(() => setNewDeliverableId(null), 4000);
    } catch {
      setRefineError('Refinement failed. Please try again.');
    } finally {
      setRefining(false);
    }
  };

  const handleShare = async (d: Deliverable) => {
    if (!user || sharingId === d.id) return;
    setSharingId(d.id);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/engine/deliverables/${d.id}/share`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const { isPublic } = await res.json();
      setSharedIds(prev => {
        const next = new Set(prev);
        isPublic ? next.add(d.id) : next.delete(d.id);
        return next;
      });
      if (isPublic) {
        const url = `${window.location.origin}/engine/share/${d.id}`;
        navigator.clipboard.writeText(url);
        alert(`Share link copied!\n\n${url}`);
      }
    } catch {
      // silent
    } finally {
      setSharingId(null);
    }
  };

  const handleRate = async (d: Deliverable, rating: 1 | -1) => {
    if (!user) return;
    const current = ratings[d.id];
    const next = current === rating ? null : rating;
    setRatings(prev => ({ ...prev, [d.id]: next }));
    try {
      const token = await user.getIdToken();
      await fetch(`/api/engine/deliverables/${d.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: next }),
      });
    } catch {
      setRatings(prev => ({ ...prev, [d.id]: current })); // revert
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!workspace) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/engine/dashboard/workspaces"
            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{workspace.clientName}</h1>
            {workspace.niche && <p className="text-white/50 text-sm">{workspace.niche}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full">
            {workspace.deliverableCount || 0} deliverable{workspace.deliverableCount !== 1 ? 's' : ''} produced
          </span>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 rounded-xl transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Details'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-5 gap-6 items-start">

        {/* ── Left: Client Context ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-white font-medium text-sm">Client Context</h2>
            </div>

            {editing ? (
              <div className="space-y-3">
                {CONTEXT_FIELDS.map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="text-white/30 text-xs mb-1 block">{label}</label>
                    <input
                      value={editData[key]}
                      onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-white/30 text-xs mb-1 block">NOTES</label>
                  <textarea
                    value={editData.notes}
                    onChange={e => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Anything else the agent should know about this client..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/30 text-xs mb-1 block">WEBHOOK URL</label>
                  <input
                    value={editData.webhookUrl}
                    onChange={e => setEditData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    type="url"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                  <p className="text-white/25 text-xs mt-1">POSTed every time a deliverable is created. Works with Zapier, Make.com, n8n, or any webhook URL.</p>
                </div>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-500 disabled:opacity-40 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'OFFER', value: workspace.offer },
                  { label: 'AUDIENCE', value: workspace.audience },
                  { label: 'GOALS', value: workspace.goals },
                  { label: 'NOTES', value: workspace.notes },
                ].map(({ label, value }) =>
                  value ? (
                    <div key={label}>
                      <p className="text-white/30 text-xs mb-0.5">{label}</p>
                      <p className="text-white/80 text-sm leading-relaxed">{value}</p>
                    </div>
                  ) : null
                )}
                {!workspace.offer && !workspace.audience && !workspace.goals && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                  >
                    + Add client details so the agent can be more specific
                  </button>
                )}
                {workspace.webhookUrl && (
                  <div className="flex items-center gap-2 mt-1 pt-3 border-t border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-orange-400 text-xs font-medium">Webhook active</p>
                      <p className="text-white/30 text-xs truncate">{workspace.webhookUrl}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{workspace.deliverableCount || 0}</p>
              <p className="text-white/40 text-xs">Deliverables</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-sm font-medium text-white truncate">{formatTime(workspace.lastActivityAt)}</p>
              <p className="text-white/40 text-xs">Last activity</p>
            </div>
          </div>
        </div>

        {/* ── Right: Mission Runner + Deliverables ──────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Mission Runner */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-white font-medium text-sm">New Mission</h2>
            </div>

            <div className="space-y-3">
              <textarea
                value={task}
                onChange={e => setTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.metaKey && handleRunMission()}
                placeholder={`What do you need for ${workspace.clientName}?`}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 resize-none focus:outline-none focus:border-yellow-500/40 transition-colors text-sm"
              />

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {MISSION_SUGGESTIONS.slice(0, 4).map(s => (
                  <button
                    key={s}
                    onClick={() => setTask(s)}
                    className="text-xs px-2.5 py-1 bg-white/5 text-white/40 hover:text-white/70 border border-white/5 hover:border-white/15 rounded-lg transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <select
                  value={selectedAgent}
                  onChange={e => setSelectedAgent(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  {AGENTS.map(a => (
                    <option key={a.id} value={a.id} className="bg-gray-900">
                      {a.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleRunMission}
                  disabled={!task.trim() || running}
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  {running ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Executing…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Run Mission
                    </>
                  )}
                </button>
              </div>
              {runError && <p className="text-red-400 text-sm">{runError}</p>}
            </div>
          </div>

          {/* Running indicator */}
          <AnimatePresence>
            {running && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3"
              >
                <svg className="animate-spin w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Agent executing mission…</p>
                  <p className="text-yellow-400/50 text-xs mt-0.5">
                    Using {workspace.clientName}&apos;s context + your active skills. Takes 5–20 seconds.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deliverables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-medium text-sm">Deliverables</h2>
              <span className="text-white/30 text-xs">{deliverables.length} produced</span>
            </div>

            {deliverables.length === 0 ? (
              <div className="bg-white/3 border border-white/5 rounded-xl p-8 text-center">
                <div className="p-3 bg-white/5 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-white/30 text-sm">No deliverables yet</p>
                <p className="text-white/20 text-xs mt-1">Run your first mission above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deliverables.map(d => (
                  <motion.div
                    key={d.id}
                    initial={d.id === newDeliverableId ? { opacity: 0, y: -12, scale: 0.98 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`border rounded-xl overflow-hidden transition-colors ${
                      d.id === newDeliverableId
                        ? 'border-yellow-500/50 bg-yellow-500/5'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    {/* Header row */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpanded(prev => prev === d.id ? null : d.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 bg-green-500/20 rounded-lg flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{d.title}</p>
                            {d.refinementOfTitle && (
                              <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/20">
                                refined
                              </span>
                            )}
                          </div>
                          <p className="text-white/40 text-xs">
                            {AGENTS.find(a => a.id === d.agentId)?.name || d.agentId} · {formatTime(d.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <button
                          onClick={e => { e.stopPropagation(); handleDownload(d.title, d.content); }}
                          className="p-1.5 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                          title="Download as .md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleShare(d); }}
                          disabled={sharingId === d.id}
                          className={`p-1.5 transition-colors rounded-lg hover:bg-white/10 ${sharedIds.has(d.id) ? 'text-green-400 hover:text-green-300' : 'text-white/30 hover:text-white'}`}
                          title={sharedIds.has(d.id) ? 'Shared — click to unshare' : 'Share (copies link)'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleCopy(d.id, d.content); }}
                          className="p-1.5 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                          title="Copy to clipboard"
                        >
                          {copied === d.id ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        <svg
                          className={`w-4 h-4 text-white/30 transition-transform duration-200 ${expanded === d.id ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expanded === d.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-white/5">
                            <div className="mt-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                              <div className="prose prose-sm prose-invert max-w-none text-white/80 text-sm leading-relaxed">
                                <ReactMarkdown>{d.content}</ReactMarkdown>
                              </div>
                            </div>
                            {/* Refine section */}
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                {/* Rating */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-white/30 text-xs mr-1">Rate:</span>
                                  <button
                                    onClick={() => handleRate(d, 1)}
                                    className={`p-1.5 rounded-lg transition-colors text-sm ${ratings[d.id] === 1 ? 'bg-green-500/20 text-green-400' : 'text-white/30 hover:text-green-400 hover:bg-green-500/10'}`}
                                    title="Good deliverable"
                                  >
                                    👍
                                  </button>
                                  <button
                                    onClick={() => handleRate(d, -1)}
                                    className={`p-1.5 rounded-lg transition-colors text-sm ${ratings[d.id] === -1 ? 'bg-red-500/20 text-red-400' : 'text-white/30 hover:text-red-400 hover:bg-red-500/10'}`}
                                    title="Needs improvement"
                                  >
                                    👎
                                  </button>
                                </div>
                                {/* Refine trigger */}
                                {refiningId !== d.id && (
                                  <button
                                    onClick={() => { setRefiningId(d.id); setRefineTask(''); setRefineError(null); }}
                                    className="flex items-center gap-1.5 text-xs text-purple-400/70 hover:text-purple-400 transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refine this deliverable
                                  </button>
                                )}
                              </div>

                              {/* Refine textarea */}
                              {refiningId === d.id && (
                                <div className="space-y-2 mt-3">
                                  <textarea
                                    value={refineTask}
                                    onChange={e => setRefineTask(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && e.metaKey && handleRefine(d)}
                                    placeholder="What should the agent change or improve?"
                                    rows={2}
                                    autoFocus
                                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 resize-none focus:outline-none focus:border-purple-500/60 transition-colors"
                                  />
                                  {refineError && <p className="text-red-400 text-xs">{refineError}</p>}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleRefine(d)}
                                      disabled={!refineTask.trim() || refining}
                                      className="px-4 py-1.5 bg-purple-600 text-white text-xs rounded-lg font-medium hover:bg-purple-500 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                                    >
                                      {refining ? (
                                        <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Refining…</>
                                      ) : 'Refine'}
                                    </button>
                                    <button
                                      onClick={() => { setRefiningId(null); setRefineTask(''); setRefineError(null); }}
                                      className="px-4 py-1.5 bg-white/5 text-white/50 text-xs rounded-lg hover:text-white transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Version lineage */}
                              {d.refinementOfTitle && (
                                <p className="mt-3 text-white/30 text-xs">
                                  ↻ Refined from: <span className="text-white/50 italic">{d.refinementOfTitle}</span>
                                </p>
                              )}

                              {/* Share link if active */}
                              {sharedIds.has(d.id) && (
                                <div className="mt-3 flex items-center gap-2 bg-green-500/5 border border-green-500/15 rounded-lg px-3 py-2">
                                  <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                  </svg>
                                  <span className="text-green-400 text-xs flex-1 truncate">
                                    {typeof window !== 'undefined' ? `${window.location.origin}/engine/share/${d.id}` : `/engine/share/${d.id}`}
                                  </span>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/engine/share/${d.id}`)}
                                    className="text-green-400/70 hover:text-green-400 text-xs transition-colors flex-shrink-0"
                                  >
                                    Copy
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
