'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getWorkspaces, saveWorkspace, Workspace } from '@/lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';

function formatTime(ts: Timestamp | null | undefined): string {
  if (!ts) return 'Never';
  const date = new Date(ts.seconds * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const FORM_FIELDS_CLIENT: { label: string; key: 'clientName' | 'niche' | 'offer' | 'audience'; placeholder: string; required?: boolean }[] = [
  { label: 'Client Name *', key: 'clientName', placeholder: 'e.g. Acme Corp or John Smith', required: true },
  { label: 'Niche / Industry', key: 'niche', placeholder: 'e.g. SaaS for accountants' },
  { label: 'Their Offer', key: 'offer', placeholder: 'e.g. Lead generation retainer $3K/mo' },
  { label: 'Target Audience', key: 'audience', placeholder: 'e.g. Series A SaaS founders' },
];

const FORM_FIELDS_OWN: { label: string; key: 'clientName' | 'niche' | 'offer' | 'audience'; placeholder: string; required?: boolean }[] = [
  { label: 'Business Name *', key: 'clientName', placeholder: 'e.g. crftd. web', required: true },
  { label: 'Your Niche', key: 'niche', placeholder: 'e.g. Web design for service businesses' },
  { label: 'Your Offer', key: 'offer', placeholder: 'e.g. Done-for-you websites from £1,500' },
  { label: 'Your Ideal Client', key: 'audience', placeholder: 'e.g. UK trades & service businesses' },
];

export default function WorkspacesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [mode, setMode] = useState<'own' | 'client' | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ clientName: '', niche: '', offer: '', audience: '', goals: '' });

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const ws = await getWorkspaces(user.uid);
        setWorkspaces(ws);
        // Don't auto-open form — let onboarding choice screen show instead
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleStartMode = (m: 'own' | 'client') => {
    setMode(m);
    setForm(m === 'own'
      ? { clientName: '', niche: '', offer: '', audience: '', goals: '' }
      : { clientName: '', niche: '', offer: '', audience: '', goals: '' }
    );
    setShowCreate(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !user || creating) return;
    setCreating(true);
    try {
      const id = await saveWorkspace(user.uid, {
        clientName: form.clientName.trim(),
        niche: form.niche,
        offer: form.offer,
        audience: form.audience,
        goals: form.goals,
        notes: '',
      });
      router.push(`/engine/dashboard/workspaces/${id}`);
    } catch (e) {
      console.error(e);
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Workspaces
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50"
          >
            One workspace per client. Agent loads their context automatically — you just give it a task.
          </motion.p>
        </div>
        {workspaces.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setMode('client'); setShowCreate(!showCreate); }}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-500 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Workspace
          </motion.button>
        )}
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleCreate}
              className="bg-white/5 border border-purple-500/30 rounded-2xl p-6 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-white font-semibold">
                    {mode === 'own' ? 'Set up your business workspace' : 'New Client Workspace'}
                  </h2>
                  {mode === 'own' && (
                    <p className="text-white/40 text-xs mt-0.5">Agents will use this context to produce content for your own business</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {(mode === 'own' ? FORM_FIELDS_OWN : FORM_FIELDS_CLIENT).map(({ label, key, placeholder, required }) => (
                  <div key={key}>
                    <label className="text-white/50 text-xs mb-1.5 block">{label}</label>
                    <input
                      value={form[key]}
                      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required={required}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-white/50 text-xs mb-1.5 block">{mode === 'own' ? 'Your Goals / KPIs' : 'Goals / KPIs'}</label>
                <input
                  value={form.goals}
                  onChange={e => setForm(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="e.g. 50 qualified demos/month, launch funnel by April"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={!form.clientName.trim() || creating}
                  className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-500 disabled:opacity-40 transition-colors text-sm flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating…
                    </>
                  ) : 'Create Workspace →'}
                </button>
                {workspaces.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-6 py-2.5 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : workspaces.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, index) => (
            <motion.div
              key={ws.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/engine/dashboard/workspaces/${ws.id}`}>
                <div className="bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-2xl p-6 cursor-pointer transition-all group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-purple-500/20 rounded-xl">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <h3 className="text-white font-semibold mb-1">{ws.clientName}</h3>
                  {ws.niche && (
                    <p className="text-white/50 text-sm mb-4 truncate">{ws.niche}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-white/30 mt-4">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {ws.deliverableCount || 0} deliverables
                    </span>
                    <span>{formatTime(ws.lastActivityAt)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Onboarding — shown when no workspaces yet */}
      {!loading && workspaces.length === 0 && !showCreate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto py-8 space-y-8"
        >
          {/* Hero */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500/30 to-violet-600/30 border border-purple-500/30 rounded-2xl mb-5">
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Where do you want to start?</h2>
            <p className="text-white/50">Agents use workspace context to produce specific, ready-to-use deliverables — not generic content.</p>
          </div>

          {/* Choice cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Own business */}
            <button
              onClick={() => handleStartMode('own')}
              className="group text-left bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/40 rounded-2xl p-6 transition-all"
            >
              <div className="p-2.5 bg-purple-500/20 rounded-xl w-fit mb-4">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1.5 group-hover:text-purple-300 transition-colors">My Business</h3>
              <p className="text-white/50 text-sm leading-relaxed">Produce your own marketing — ads, VSLs, emails, landing pages — with context about your own offer and audience.</p>
              <div className="mt-4 flex items-center gap-1.5 text-purple-400 text-xs font-medium">
                Start here
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Client */}
            <button
              onClick={() => handleStartMode('client')}
              className="group text-left bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition-all"
            >
              <div className="p-2.5 bg-blue-500/20 rounded-xl w-fit mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1.5 group-hover:text-blue-300 transition-colors">A Client</h3>
              <p className="text-white/50 text-sm leading-relaxed">Create deliverables for one of your clients — VSL scripts, ad copy, email sequences — all loaded with their context.</p>
              <div className="mt-4 flex items-center gap-1.5 text-blue-400 text-xs font-medium">
                Add client workspace
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* How it works */}
          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            {[
              { step: '1', title: 'Set the context', desc: 'Name, niche, offer, audience — agents use this in every response.', color: 'text-purple-400' },
              { step: '2', title: 'Give it a mission', desc: 'Type what you need — VSL, ad copy, emails, landing page — and run it.', color: 'text-yellow-400' },
              { step: '3', title: 'Get the deliverable', desc: 'Complete, specific, ready to use. Refine, export, or share with one click.', color: 'text-green-400' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="bg-white/3 border border-white/5 rounded-xl p-5">
                <span className={`text-3xl font-bold ${color} opacity-60`}>{step}</span>
                <h3 className="text-white font-medium mt-2 mb-1">{title}</h3>
                <p className="text-white/40 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
