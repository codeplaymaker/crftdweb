'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getRepCommissions, RepCommission } from '@/lib/firebase/firestore';
import { PoundSterling, Clock, CheckCircle2 } from 'lucide-react';

export default function CommissionsPage() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<RepCommission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getRepCommissions(user.uid).then(c => {
      setCommissions(c);
      setLoading(false);
    });
  }, [user]);

  const pending = commissions.filter(c => c.status === 'pending');
  const paid = commissions.filter(c => c.status === 'paid');
  const pendingTotal = pending.reduce((sum, c) => sum + c.commissionAmount, 0);
  const paidTotal = paid.reduce((sum, c) => sum + c.commissionAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Commissions</h1>
        <p className="text-sm text-white/40 mt-1">Track every commission — pending and paid.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-2xl font-bold">£{pendingTotal.toLocaleString()}</p>
          <p className="text-xs text-white/30 mt-1">{pending.length} {pending.length === 1 ? 'deal' : 'deals'}</p>
        </div>
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Paid</span>
          </div>
          <p className="text-2xl font-bold">£{paidTotal.toLocaleString()}</p>
          <p className="text-xs text-white/30 mt-1">{paid.length} {paid.length === 1 ? 'deal' : 'deals'}</p>
        </div>
      </div>

      {/* Commission list */}
      {commissions.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <PoundSterling className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No commissions yet.</p>
          <p className="text-xs mt-1">Close your first deal and it&apos;ll show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {commissions.map((c, i) => (
            <div key={c.id || i} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{c.businessName}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Deal: £{c.dealValue.toLocaleString()}
                  {c.createdAt && (
                    <> · {new Date(c.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">£{c.commissionAmount.toLocaleString()}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  c.status === 'paid'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
