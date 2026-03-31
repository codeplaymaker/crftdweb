'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Briefcase, ChevronDown, DollarSign, Trophy, TrendingUp, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { type RepLead, type LeadStatus, type RepProfile, type RepCommission } from '@/lib/firebase/firestore';

const STATUS_ORDER: LeadStatus[] = [
  'contacted',
  'interested',
  'call_booked',
  'proposal_sent',
  'won',
  'lost',
];

const STATUS_LABELS: Record<LeadStatus, string> = {
  contacted: 'Contacted',
  interested: 'Interested',
  call_booked: 'Call Booked',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
};

const STATUS_COLORS: Record<LeadStatus, { bg: string; border: string; text: string; badge: string }> = {
  contacted: { bg: 'bg-zinc-500/5', border: 'border-zinc-500/15', text: 'text-zinc-300', badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  interested: { bg: 'bg-sky-500/5', border: 'border-sky-500/15', text: 'text-sky-300', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  call_booked: { bg: 'bg-blue-500/5', border: 'border-blue-500/15', text: 'text-blue-300', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  proposal_sent: { bg: 'bg-amber-500/5', border: 'border-amber-500/15', text: 'text-amber-300', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  won: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/15', text: 'text-emerald-300', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  lost: { bg: 'bg-red-500/5', border: 'border-red-500/15', text: 'text-red-300', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

interface WonModal {
  lead: RepLead;
  rep: RepProfile | null;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<RepLead[]>([]);
  const [reps, setReps] = useState<RepProfile[]>([]);
  const [commissions, setCommissions] = useState<RepCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [repFilter, setRepFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [wonModal, setWonModal] = useState<WonModal | null>(null);
  const [dealValue, setDealValue] = useState('');
  const [submittingWon, setSubmittingWon] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/leads').then((r) => r.json()),
      fetch('/api/admin/reps').then((r) => r.json()),
      fetch('/api/admin/commissions').then((r) => r.json()),
    ]).then(([l, r, c]) => {
      setLeads(Array.isArray(l) ? l : []);
      setReps(Array.isArray(r) ? r : []);
      setCommissions(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  const repMap = useMemo(() => {
    const m: Record<string, RepProfile> = {};
    for (const r of reps) m[r.uid] = r;
    return m;
  }, [reps]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const statusOk = statusFilter === 'all' || l.status === statusFilter;
      const repOk = repFilter === 'all' || l.repId === repFilter;
      return statusOk && repOk;
    });
  }, [leads, statusFilter, repFilter]);

  const stats = useMemo(() => {
    const wonLeads = leads.filter((l) => l.status === 'won');
    const totalDealValue = wonLeads.reduce((acc, l) => acc + (l.dealValue ?? 0), 0);
    const totalCommission = commissions.reduce((acc, c) => acc + c.commissionAmount, 0);
    const pendingCommission = commissions
      .filter((c) => c.status === 'pending')
      .reduce((acc, c) => acc + c.commissionAmount, 0);
    return { wonCount: wonLeads.length, totalDealValue, totalCommission, pendingCommission };
  }, [leads, commissions]);

  const handleStatusChange = async (lead: RepLead, newStatus: LeadStatus) => {
    if (newStatus === 'won' && lead.status !== 'won') {
      const rep = repMap[lead.repId] ?? null;
      setWonModal({ lead, rep });
      setDealValue('');
      return;
    }
    setUpdating(lead.id);
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, status: newStatus }),
    });
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status: newStatus } : l));
    setUpdating(null);
  };

  const handleWonSubmit = async () => {
    if (!wonModal) return;
    const val = parseFloat(dealValue);
    if (!val || val <= 0) return;
    setSubmittingWon(true);

    const rep = wonModal.rep;
    const commissionRate = rep?.commissionRate ?? 15;
    const commissionAmount = Math.round((val * commissionRate) / 100 * 100) / 100;

    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: wonModal.lead.id, status: 'won', dealValue: val }),
    });

    const commRes = await fetch('/api/admin/commissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repId: wonModal.lead.repId,
        repName: wonModal.lead.repName,
        leadId: wonModal.lead.id,
        businessName: wonModal.lead.businessName,
        dealValue: val,
        commissionAmount,
      }),
    });
    const commData = await commRes.json();

    setLeads((prev) =>
      prev.map((l) => l.id === wonModal.lead.id ? { ...l, status: 'won', dealValue: val } : l)
    );
    setCommissions((prev) => [...prev, {
      id: commData.id ?? `tmp-${Date.now()}`,
      repId: wonModal.lead.repId,
      repName: wonModal.lead.repName,
      leadId: wonModal.lead.id,
      businessName: wonModal.lead.businessName,
      dealValue: val,
      commissionAmount,
      status: 'pending',
      createdAt: null as any,
      paidAt: null,
    }]);

    setSubmittingWon(false);
    setWonModal(null);
    setDealValue('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-xs text-white/30 hover:text-white/50 transition-colors mb-2 inline-block">
            <ArrowLeft className="w-3 h-3 inline mr-1" />Back to Admin
          </Link>
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-white">Lead Pipeline</h1>
              <p className="text-xs text-white/30 mt-0.5">All rep leads · deal values · commissions</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Leads', value: leads.length, icon: TrendingUp, color: 'sky' },
            { label: 'Deals Won', value: stats.wonCount, icon: Trophy, color: 'emerald' },
            { label: 'Deal Value', value: `£${stats.totalDealValue.toLocaleString()}`, icon: DollarSign, color: 'amber' },
            { label: 'Commission Due', value: `£${stats.pendingCommission.toLocaleString()}`, icon: Check, color: 'violet' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`bg-white/[0.02] border border-white/8 rounded-2xl px-4 py-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
                <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">{label}</span>
              </div>
              <p className={`text-xl font-bold text-${color}-300`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-xs text-white focus:outline-none focus:border-white/25 cursor-pointer"
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-white/30 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-xs text-white focus:outline-none focus:border-white/25 cursor-pointer"
            >
              <option value="all">All reps</option>
              {reps.map((r) => (
                <option key={r.uid} value={r.uid}>{r.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-white/30 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="ml-auto text-xs text-white/30 flex items-center">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Lead List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-white/20" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-white/20">No leads yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLeads.map((lead) => {
              const colors = STATUS_COLORS[lead.status];
              return (
                <div
                  key={lead.id}
                  className={`${colors.bg} border ${colors.border} rounded-2xl px-5 py-4`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-white">{lead.businessName}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                          {STATUS_LABELS[lead.status]}
                        </span>
                        {lead.status === 'won' && lead.dealValue > 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                            £{lead.dealValue.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40">
                        {lead.contactName}
                        {lead.contactEmail ? ` · ${lead.contactEmail}` : ''}
                        {lead.contactPhone ? ` · ${lead.contactPhone}` : ''}
                      </p>
                      <p className="text-[10px] text-white/25 mt-1">Rep: {lead.repName}</p>
                      {lead.notes && (
                        <p className="text-[11px] text-white/30 mt-1.5 italic leading-relaxed">{lead.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {updating === lead.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white/20" />
                      ) : (
                        <div className="relative">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-2.5 pr-6 py-1.5 text-xs text-white/70 focus:outline-none focus:border-white/25 cursor-pointer"
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-white/30 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Commission Payouts Section */}
        {commissions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xs font-semibold tracking-[0.3em] text-white/20 uppercase mb-4">
              Commission Payouts
            </h2>
            <div className="space-y-2">
              {commissions.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between px-5 py-3 rounded-xl border ${
                    c.status === 'paid'
                      ? 'bg-white/[0.02] border-white/8'
                      : 'bg-amber-500/5 border-amber-500/15'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{c.businessName}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{c.repName} · Deal: £{c.dealValue.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-amber-300">£{c.commissionAmount.toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      c.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {c.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Won deal modal */}
      {wonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">Mark as Won</h3>
            </div>
            <p className="text-xs text-white/40 mb-5">
              {wonModal.lead.businessName} · rep: {wonModal.lead.repName}
            </p>

            <label className="block text-xs text-white/50 mb-2">Deal value (£)</label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 2500"
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 mb-2"
            />
            {dealValue && parseFloat(dealValue) > 0 && (
              <p className="text-xs text-emerald-400/70 mb-5">
                Commission ({wonModal.rep?.commissionRate ?? 15}%) = £
                {(Math.round(parseFloat(dealValue) * (wonModal.rep?.commissionRate ?? 15) / 100 * 100) / 100).toLocaleString()}
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setWonModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWonSubmit}
                disabled={!dealValue || parseFloat(dealValue) <= 0 || submittingWon}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-sm font-semibold disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {submittingWon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
                Confirm Win
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
