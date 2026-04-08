'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getRepLeads, getRepCommissions, getRepProfile, RepLead, RepCommission, RepProfile } from '@/lib/firebase/firestore';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Phone, PoundSterling, Clock, Copy, Check } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  contacted: 'Contacted',
  interested: 'Interested',
  call_booked: 'Call Booked',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
};

const STATUS_COLORS: Record<string, string> = {
  contacted: 'bg-white/10 text-white/50',
  interested: 'bg-blue-500/20 text-blue-400',
  call_booked: 'bg-yellow-500/20 text-yellow-400',
  proposal_sent: 'bg-purple-500/20 text-purple-400',
  won: 'bg-emerald-500/20 text-emerald-400',
  lost: 'bg-red-500/10 text-red-400/60',
};

export default function RepDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<RepLead[]>([]);
  const [commissions, setCommissions] = useState<RepCommission[]>([]);
  const [profile, setProfile] = useState<RepProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralLink = user ? `https://www.crftdweb.com?ref=${user.uid}` : '';

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getRepLeads(user.uid),
      getRepCommissions(user.uid),
      getRepProfile(user.uid),
    ]).then(([l, c, p]) => {
      setLeads(l);
      setCommissions(c);
      setProfile(p);
    }).catch(console.error).finally(() => {
      setLoading(false);
    });
  }, [user]);

  const activeLeads = leads.filter(l => l.status !== 'lost');
  const wonLeads = leads.filter(l => l.status === 'won');
  const thisWeek = leads.filter(l => {
    const created = l.createdAt?.toDate?.();
    if (!created) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  });

  const pendingCommission = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalEarned = commissions
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const stats = [
    { label: 'Active Leads', value: activeLeads.length, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Added This Week', value: thisWeek.length, icon: Phone, color: 'text-yellow-400' },
    { label: 'Deals Won', value: wonLeads.length, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Pending Commission', value: `£${pendingCommission.toLocaleString()}`, icon: PoundSterling, color: 'text-purple-400' },
  ];

  const recentLeads = [...leads].slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back, {profile?.name?.split(' ')[0] ?? user?.displayName ?? 'Rep'}.
        </h1>
        <p className="text-sm text-white/40 mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          {' · '}10–20% commission · paid within 7 days of deposit
        </p>
      </div>

      {/* Referral Link */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Your Referral Link</p>
          <p className="text-sm text-white/60 truncate font-mono">{referralLink}</p>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex-shrink-0 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70 font-medium transition-colors flex items-center gap-1.5"
        >
          {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
              <Icon className={`w-4 h-4 ${stat.color} mb-3`} />
              <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's goal */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Daily Target</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-white">10</p>
            <p className="text-[11px] text-white/30 mt-0.5">Calls / day</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">2–3</p>
            <p className="text-[11px] text-white/30 mt-0.5">Booked calls / week</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">1</p>
            <p className="text-[11px] text-white/30 mt-0.5">Closed client / week</p>
          </div>
        </div>
      </div>

      {/* Commission summary */}
      {commissions.length > 0 && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Commission Summary</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/30 mb-1">Pending payment</p>
              <p className="text-xl font-bold text-yellow-400">£{pendingCommission.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Total earned all time</p>
              <p className="text-xl font-bold text-white">£{totalEarned.toLocaleString()}</p>
            </div>
          </div>
          {commissions.filter(c => c.status === 'pending').map(c => (
            <div key={c.id} className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
              <div>
                <p className="text-sm text-white/70 font-medium">{c.businessName}</p>
                <p className="text-xs text-white/30">Deal value: £{c.dealValue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-400">£{c.commissionAmount.toLocaleString()}</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <Clock className="w-3 h-3 text-white/20" />
                  <p className="text-[10px] text-white/30">Awaiting payment</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">Recent Leads</p>
          <Link href="/rep/leads" className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 text-center">
            <p className="text-sm text-white/30 mb-3">No leads yet.</p>
            <Link href="/rep/leads" className="text-xs text-white/50 hover:text-white/70 underline">
              Add your first lead →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white/80">{lead.businessName}</p>
                  <p className="text-xs text-white/30">{lead.contactName} · {lead.source.replace('_', ' ')}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${STATUS_COLORS[lead.status]}`}>
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link href="/rep/leads" className="flex items-center justify-between bg-white/[0.02] border border-white/8 hover:border-white/20 rounded-2xl p-5 transition-colors group">
          <div>
            <p className="text-sm font-semibold text-white">Log a new lead</p>
            <p className="text-xs text-white/30 mt-0.5">Add a prospect you've contacted</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/rep/resources" className="flex items-center justify-between bg-white/[0.02] border border-white/8 hover:border-white/20 rounded-2xl p-5 transition-colors group">
          <div>
            <p className="text-sm font-semibold text-white">Call script & templates</p>
            <p className="text-xs text-white/30 mt-0.5">What to say, what to send</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
