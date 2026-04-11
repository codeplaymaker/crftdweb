'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import {
  getRepLeads, addLead, updateLead, deleteLead,
  getRepProfile, RepLead, LeadStatus, LeadSource, RepProfile
} from '@/lib/firebase/firestore';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import EmailComposeModal from '@/components/rep/EmailComposeModal';
import { sendDiscoveryBookingLink } from '@/app/actions/sendDiscoveryBookingLink';
import { getCommissionRateForRank, CAREER_RANKS, type CareerRank } from '@/lib/types/repRanks';
import { Plus, ChevronDown, ChevronUp, Trash2, Edit2, Check, X, PoundSterling, Lock, GraduationCap, Mail, Reply, CalendarCheck } from 'lucide-react';

const PIPELINE: { key: LeadStatus; label: string; color: string }[] = [
  { key: 'contacted', label: 'Contacted', color: 'border-t-white/20' },
  { key: 'interested', label: 'Interested', color: 'border-t-blue-500/60' },
  { key: 'call_booked', label: 'Call Booked', color: 'border-t-yellow-500/60' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'border-t-purple-500/60' },
  { key: 'won', label: 'Won ✓', color: 'border-t-emerald-500/60' },
  { key: 'lost', label: 'Lost', color: 'border-t-red-500/40' },
];

const STATUS_COLORS: Record<LeadStatus, string> = {
  contacted: 'bg-white/10 text-white/50',
  interested: 'bg-blue-500/20 text-blue-400',
  call_booked: 'bg-yellow-500/20 text-yellow-400',
  proposal_sent: 'bg-purple-500/20 text-purple-400',
  won: 'bg-emerald-500/20 text-emerald-400',
  lost: 'bg-red-500/10 text-red-400/60',
};

const SOURCES: LeadSource[] = ['cold_call', 'linkedin', 'email', 'referral', 'other'];

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

const emptyForm = {
  businessName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  source: 'cold_call' as LeadSource,
  status: 'contacted' as LeadStatus,
  dealValue: '',
  notes: '',
};

export default function RepLeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<RepLead[]>([]);
  const [profile, setProfile] = useState<RepProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [trainingLocked, setTrainingLocked] = useState<boolean | null>(null);
  const [lockInfo, setLockInfo] = useState({ avgScore: 0, totalSessions: 0 });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<'pipeline' | 'list'>('list');
  const [wonLead, setWonLead] = useState<RepLead | null>(null);
  const [wonDealValue, setWonDealValue] = useState('');
  const [wonSaving, setWonSaving] = useState(false);
  const [wonError, setWonError] = useState('');
  const [emailLead, setEmailLead] = useState<RepLead | null>(null);
  const [sendingBookingId, setSendingBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getRepLeads(user.uid),
      getRepProfile(user.uid),
      RepTrainingService.getTrainingStats(user.uid),
    ])
      .then(([l, p, stats]) => {
        setLeads(l);
        setProfile(p);
        const avg = stats?.averageScore ?? 0;
        const sessions = stats?.totalSessions ?? 0;
        setLockInfo({ avgScore: avg, totalSessions: sessions });
        setTrainingLocked(!(Math.round(avg) >= 60 && sessions >= 10));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (trainingLocked) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Leads Locked</h2>
          <p className="text-sm text-white/40 mt-2">Complete your training before accessing leads.<br />You need <strong className="text-white/60">10 roleplay sessions</strong> and an <strong className="text-white/60">average score of 60+</strong>.</p>
        </div>
        <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-3 text-left max-w-xs mx-auto">
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Sessions</span><span>{lockInfo.totalSessions}/10</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${Math.min(100, (lockInfo.totalSessions / 10) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Avg Score</span><span>{Math.round(lockInfo.avgScore)}/60</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${Math.min(100, (lockInfo.avgScore / 60) * 100)}%` }} />
            </div>
          </div>
        </div>
        <Link href="/rep/train" className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-colors">
          <GraduationCap className="w-4 h-4" /> Go to Training
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true);

    if (editingId) {
      await updateLead(editingId, {
        ...form,
        dealValue: Number(form.dealValue) || 0,
      });
      setLeads(prev => prev.map(l =>
        l.id === editingId ? { ...l, ...form, dealValue: Number(form.dealValue) || 0 } : l
      ));
      setEditingId(null);
    } else {
      const id = await addLead({
        repId: user.uid,
        repName: profile.name,
        businessName: form.businessName,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        source: form.source,
        status: form.status,
        dealValue: Number(form.dealValue) || 0,
        notes: form.notes,
      });
      const newLead: RepLead = {
        id,
        repId: user.uid,
        repName: profile.name,
        businessName: form.businessName,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        source: form.source,
        status: form.status,
        dealValue: Number(form.dealValue) || 0,
        notes: form.notes,
        createdAt: { toDate: () => new Date() } as never,
        updatedAt: { toDate: () => new Date() } as never,
      };
      setLeads(prev => [newLead, ...prev]);
    }

    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
  }

  async function handleStatusChange(lead: RepLead, status: LeadStatus) {
    if (status === 'won' && lead.status !== 'won') {
      setWonLead(lead);
      setWonDealValue(lead.dealValue ? String(lead.dealValue) : '');
      setWonError('');
      return;
    }
    await updateLead(lead.id, { status });
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l));
  }

  async function handleWonConfirm() {
    if (!wonLead || !user) return;
    const dv = Number(wonDealValue);
    if (!dv || dv <= 0) { setWonError('Enter a deal value greater than £0'); return; }
    setWonSaving(true);
    setWonError('');
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch('/api/rep/leads/won', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ leadId: wonLead.id, dealValue: dv }),
      });
      if (!res.ok) { const e = await res.json(); setWonError(e.error || 'Something went wrong'); return; }
      setLeads(prev => prev.map(l => l.id === wonLead.id ? { ...l, status: 'won', dealValue: dv } : l));
      setWonLead(null);
      setWonDealValue('');
    } catch {
      setWonError('Network error — please try again');
    } finally {
      setWonSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lead?')) return;
    await deleteLead(id);
    setLeads(prev => prev.filter(l => l.id !== id));
  }

  function startEdit(lead: RepLead) {
    setForm({
      businessName: lead.businessName,
      contactName: lead.contactName,
      contactEmail: lead.contactEmail,
      contactPhone: lead.contactPhone,
      source: lead.source,
      status: lead.status,
      dealValue: lead.dealValue ? String(lead.dealValue) : '',
      notes: lead.notes,
    });
    setEditingId(lead.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSendBookingLink(lead: RepLead) {
    if (!lead.contactEmail || !profile) return;
    setSendingBookingId(lead.id);
    try {
      const result = await sendDiscoveryBookingLink(lead.id, lead.contactName, lead.contactEmail, profile.name);
      if (result.success) {
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'call_booked' as LeadStatus } : l));
      } else {
        alert(result.error || 'Failed to send booking link');
      }
    } catch {
      alert('Network error — please try again');
    } finally {
      setSendingBookingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  const activeLeads = leads.filter(l => l.status !== 'lost');
  const wonLeads = leads.filter(l => l.status === 'won');

  return (
    <div className="max-w-4xl space-y-6">
      {/* Won — deal value modal */}
      {wonLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <PoundSterling className="w-5 h-5 text-emerald-400" />
              <p className="text-base font-semibold text-white">Mark as Won — {wonLead.businessName}</p>
            </div>
            <p className="text-sm text-white/40">Enter the confirmed deal value so your commission can be calculated.</p>
            <div>
              <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Deal Value (£)</label>
              <input
                type="number"
                value={wonDealValue}
                onChange={e => setWonDealValue(e.target.value)}
                placeholder="e.g. 2497"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
              />
              {wonDealValue && Number(wonDealValue) > 0 && (() => {
                const v = Number(wonDealValue);
                const rank: CareerRank = (profile?.careerRank as CareerRank) || 'silver';
                const rankInfo = CAREER_RANKS[rank];
                const rate = getCommissionRateForRank(rank, v);
                return (
                  <p className="text-xs text-emerald-400 mt-1.5">
                    {rankInfo.emoji} {rankInfo.label} commission ({rate}%): £{Math.round(v * rate / 100).toLocaleString()}
                  </p>
                );
              })()}
            </div>
            {wonError && <p className="text-xs text-red-400">{wonError}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleWonConfirm}
                disabled={wonSaving}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-semibold rounded-xl text-sm transition-colors"
              >
                {wonSaving ? 'Saving...' : 'Confirm Win'}
              </button>
              <button
                onClick={() => { setWonLead(null); setWonDealValue(''); setWonError(''); }}
                className="px-4 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Leads</h1>
          <p className="text-sm text-white/30 mt-0.5">{activeLeads.length} active · {wonLeads.length} won</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-sm font-semibold text-white mb-2">{editingId ? 'Edit Lead' : 'New Lead'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'businessName', label: 'Business Name', required: true },
              { key: 'contactName', label: 'Contact Name', required: true },
              { key: 'contactEmail', label: 'Contact Email', required: false },
              { key: 'contactPhone', label: 'Phone Number', required: false },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">{label}</label>
                <input
                  type="text"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  required={required}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                />
              </div>
            ))}
            <div>
              <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Source</label>
              <select
                value={form.source}
                onChange={e => setForm(prev => ({ ...prev, source: e.target.value as LeadSource }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
              >
                {SOURCES.map(s => (
                  <option key={s} value={s} className="bg-[#1a1a1a]">{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value as LeadStatus }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
              >
                {PIPELINE.map(p => (
                  <option key={p.key} value={p.key} className="bg-[#1a1a1a]">{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Deal Value (£)</label>
              <input
                type="number"
                value={form.dealValue}
                onChange={e => setForm(prev => ({ ...prev, dealValue: e.target.value }))}
                placeholder="e.g. 3200"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                placeholder="What did they say? Pain points? Next step?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 disabled:opacity-40">
              {saving ? 'Saving...' : editingId ? 'Update Lead' : 'Save Lead'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm hover:bg-white/10">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* View toggle */}
      <div className="flex items-center gap-2">
        {(['list', 'pipeline'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              view === v ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-2">
          {leads.length === 0 && (
            <div className="text-center py-12 text-white/20 text-sm">No leads yet. Add your first one above.</div>
          )}
          {leads.map(lead => (
            <div key={lead.id} className="bg-white/[0.02] border border-white/8 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[lead.status]}`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">{lead.businessName}</p>
                    <p className="text-xs text-white/30 truncate">{lead.contactName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  {lead.lastRepliedAt && (
                    <span className="text-[10px] text-blue-400 flex items-center gap-1 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                      <Reply className="w-3 h-3" />
                      Replied
                    </span>
                  )}
                  {lead.lastEmailedAt && !lead.lastRepliedAt && (
                    <span className="text-[10px] text-blue-400/60 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {timeAgo(lead.lastEmailedAt.toDate())}
                    </span>
                  )}
                  {lead.dealValue > 0 && (
                    <span className="text-xs text-emerald-400 font-medium">£{lead.dealValue.toLocaleString()}</span>
                  )}
                  {expandedId === lead.id ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </div>
              </button>

              {expandedId === lead.id && (
                <div className="px-4 pb-4 border-t border-white/6 pt-3 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {lead.contactEmail && <div><p className="text-white/30">Email</p><p className="text-white/60 mt-0.5">{lead.contactEmail}</p></div>}
                    {lead.contactPhone && <div><p className="text-white/30">Phone</p><p className="text-white/60 mt-0.5">{lead.contactPhone}</p></div>}
                    <div><p className="text-white/30">Source</p><p className="text-white/60 mt-0.5 capitalize">{lead.source.replace('_', ' ')}</p></div>
                  </div>
                  {lead.notes && (
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <p className="text-xs text-white/30 mb-1">Notes</p>
                      <p className="text-xs text-white/60 leading-relaxed">{lead.notes}</p>
                    </div>
                  )}
                  {/* Discovery call slot */}
                  {lead.discoveryCallSlot && (
                    <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-3 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-emerald-400">Discovery call booked</p>
                        <p className="text-xs text-white/50 mt-0.5">{lead.discoveryCallSlot}</p>
                      </div>
                    </div>
                  )}
                  {lead.bookingLinkSentAt && !lead.discoveryCallSlot && (
                    <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-lg p-3 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <p className="text-xs text-yellow-400/80">Booking link sent — waiting for prospect to pick a time</p>
                    </div>
                  )}
                  {/* Status update */}
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Move to stage</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PIPELINE.filter(p => p.key !== lead.status).map(p => (
                        <button
                          key={p.key}
                          onClick={() => handleStatusChange(lead, p.key)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button onClick={() => setEmailLead(lead)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-400/60 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 transition-colors">
                      <Mail className="w-3 h-3" /> Follow up
                    </button>
                    {lead.contactEmail && lead.status !== 'won' && lead.status !== 'lost' && !lead.discoveryCallSlot && (
                      <button
                        onClick={() => handleSendBookingLink(lead)}
                        disabled={sendingBookingId === lead.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-emerald-400/60 hover:text-emerald-400 bg-white/5 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
                      >
                        <CalendarCheck className="w-3 h-3" /> {sendingBookingId === lead.id ? 'Sending...' : lead.bookingLinkSentAt ? 'Resend Booking Link' : 'Send Booking Link'}
                      </button>
                    )}
                    <button onClick={() => startEdit(lead)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(lead.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400/50 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pipeline view */}
      {view === 'pipeline' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PIPELINE.filter(p => p.key !== 'lost').map(stage => {
            const stageLeads = leads.filter(l => l.status === stage.key);
            return (
              <div key={stage.key} className={`bg-white/[0.02] border-t-2 ${stage.color} border border-white/8 rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/60">{stage.label}</p>
                  <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-full">{stageLeads.length}</span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="bg-white/[0.03] rounded-lg p-2.5">
                      <p className="text-xs font-medium text-white/70 leading-tight">{lead.businessName}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{lead.contactName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.dealValue > 0 && (
                          <span className="text-[10px] text-emerald-400">£{lead.dealValue.toLocaleString()}</span>
                        )}
                        {lead.lastRepliedAt && (
                          <span className="text-[9px] text-blue-400 flex items-center gap-0.5 bg-blue-500/10 px-1 py-0.5 rounded-full">
                            <Reply className="w-2 h-2" />Replied
                          </span>
                        )}
                        {lead.lastEmailedAt && !lead.lastRepliedAt && (
                          <span className="text-[9px] text-blue-400/50 flex items-center gap-0.5">
                            <Mail className="w-2 h-2" />{timeAgo(lead.lastEmailedAt.toDate())}
                          </span>
                        )}
                      </div>
                      {lead.contactEmail && (
                        <button
                          onClick={() => setEmailLead(lead)}
                          className="flex items-center gap-1 mt-1.5 text-[10px] text-blue-400/50 hover:text-blue-400 transition-colors"
                        >
                          <Mail className="w-2.5 h-2.5" /> Follow up
                        </button>
                      )}
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <p className="text-[10px] text-white/15 py-2 text-center">—</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Email compose modal */}
      {emailLead && profile && (
        <EmailComposeModal
          lead={emailLead}
          repName={profile.name}
          repEmail={profile.email}
          onClose={() => setEmailLead(null)}
          onSent={() => {
            // Update local state so badge shows immediately
            setLeads(prev => prev.map(l =>
              l.id === emailLead.id
                ? { ...l, lastEmailedAt: { toDate: () => new Date() } as never }
                : l
            ));
            setEmailLead(null);
          }}
        />
      )}
    </div>
  );
}
