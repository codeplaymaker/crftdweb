'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getClientInvoices, ClientInvoice } from '@/lib/firebase/firestore';
import { Receipt, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const STATUS_STYLES: Record<ClientInvoice['status'], string> = {
  unpaid: 'bg-red-500/10 text-red-400 border-red-500/20',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  overdue: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const STATUS_ICONS: Record<ClientInvoice['status'], React.ReactNode> = {
  unpaid: <Clock className="w-3.5 h-3.5" />,
  paid: <CheckCircle2 className="w-3.5 h-3.5" />,
  overdue: <AlertCircle className="w-3.5 h-3.5" />,
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ClientInvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getClientInvoices(user.uid).then(items => {
      setInvoices(items);
      setLoading(false);
    });
  }, [user]);

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Invoices</h1>
        <p className="text-sm text-white/40 mt-1">Your billing history</p>
      </div>

      {totalOutstanding > 0 && (
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-400/70 uppercase tracking-widest font-semibold">Outstanding balance</p>
            <p className="text-2xl font-bold text-amber-300 mt-0.5">£{totalOutstanding.toLocaleString()}</p>
          </div>
          <AlertCircle className="w-7 h-7 text-amber-500/40" />
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-16 border border-white/8 rounded-2xl space-y-2">
          <Receipt className="w-6 h-6 text-white/15 mx-auto" />
          <p className="text-sm text-white/20">No invoices yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white/[0.02] border border-white/8 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-white/30">{inv.invoiceNumber}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[inv.status]}`}>
                      {STATUS_ICONS[inv.status]}
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white/80 mt-1.5">{inv.description}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-white/30">Due {fmt(inv.dueDate)}</span>
                    {inv.status === 'paid' && inv.paidAt && (
                      <span className="text-xs text-emerald-400/60">
                        Paid {fmt((inv.paidAt as unknown as { toDate?: () => Date }).toDate?.()?.toISOString() ?? inv.paidAt as unknown as string)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-white">£{inv.amount.toLocaleString()}</p>
                  {inv.paymentLink && inv.status !== 'paid' && (
                    <a
                      href={inv.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 transition-colors"
                    >
                      Pay now
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
