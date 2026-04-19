'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import {
  getClientProfile, getClientDeliverables, getClientFeedback, getClientInvoices,
  ClientProfile, ClientDeliverable, ClientFeedback, ClientInvoice, ClientStage
} from '@/lib/firebase/firestore';
import { FolderOpen, MessageSquare, Receipt, CheckCircle2 } from 'lucide-react';

const STAGES: { key: ClientStage; label: string }[] = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'design', label: 'Design' },
  { key: 'build', label: 'Build' },
  { key: 'review', label: 'Review' },
  { key: 'launch', label: 'Launch' },
  { key: 'maintenance', label: 'Maintenance' },
];

const STAGE_COLORS: Record<ClientStage, string> = {
  discovery: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  design: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  build: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  launch: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  maintenance: 'bg-white/10 text-white/50 border-white/20',
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [deliverables, setDeliverables] = useState<ClientDeliverable[]>([]);
  const [feedback, setFeedback] = useState<ClientFeedback[]>([]);
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getClientProfile(user.uid),
      getClientDeliverables(user.uid),
      getClientFeedback(user.uid),
      getClientInvoices(user.uid),
    ]).then(([p, d, f, i]) => {
      setProfile(p);
      setDeliverables(d);
      setFeedback(f);
      setInvoices(i);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = profile.name.split(' ')[0];
  const stageIndex = STAGES.findIndex(s => s.key === profile.stage);
  const openFeedback = feedback.filter(f => f.status === 'open').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid');
  const totalOwed = unpaidInvoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Hey {firstName} 👋</h1>
        <p className="text-sm text-white/40 mt-1">{profile.projectName} · {profile.businessName}</p>
      </div>

      {/* Project stage */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-white/70">Project Stage</p>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STAGE_COLORS[profile.stage]}`}>
            {STAGES.find(s => s.key === profile.stage)?.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {STAGES.slice(0, 5).map((stage, i) => (
            <div key={stage.key} className="flex items-center flex-1">
              <div className={`flex-1 h-1.5 rounded-full transition-all ${
                i <= stageIndex ? 'bg-white' : 'bg-white/10'
              }`} />
              {i < 4 && <div className="w-1" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STAGES.slice(0, 5).map((stage, i) => (
            <p key={stage.key} className={`text-[10px] ${i <= stageIndex ? 'text-white/60' : 'text-white/20'}`}>
              {stage.label}
            </p>
          ))}
        </div>
        {profile.launchDate && (
          <p className="text-xs text-white/30 mt-4">
            Target launch: <span className="text-white/60">
              {new Date(profile.launchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </p>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
          <FolderOpen className="w-4 h-4 text-white/30 mx-auto mb-2" />
          <p className="text-2xl font-black text-white">{deliverables.length}</p>
          <p className="text-xs text-white/30 mt-1">Deliverable{deliverables.length !== 1 ? 's' : ''}</p>
        </div>
        <div className={`border rounded-xl p-4 text-center ${openFeedback > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/[0.03] border-white/8'}`}>
          <MessageSquare className={`w-4 h-4 mx-auto mb-2 ${openFeedback > 0 ? 'text-amber-400/60' : 'text-white/30'}`} />
          <p className={`text-2xl font-black ${openFeedback > 0 ? 'text-amber-400' : 'text-white'}`}>{feedback.length}</p>
          <p className={`text-xs mt-1 ${openFeedback > 0 ? 'text-amber-400/60' : 'text-white/30'}`}>
            {openFeedback > 0 ? `${openFeedback} open` : 'Feedback'}
          </p>
        </div>
        <div className={`border rounded-xl p-4 text-center ${totalOwed > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.03] border-white/8'}`}>
          <Receipt className={`w-4 h-4 mx-auto mb-2 ${totalOwed > 0 ? 'text-red-400/60' : 'text-white/30'}`} />
          <p className={`text-2xl font-black ${totalOwed > 0 ? 'text-red-400' : 'text-white'}`}>
            {totalOwed > 0 ? `£${totalOwed.toLocaleString()}` : invoices.length}
          </p>
          <p className={`text-xs mt-1 ${totalOwed > 0 ? 'text-red-400/60' : 'text-white/30'}`}>
            {totalOwed > 0 ? 'Outstanding' : 'Invoice' + (invoices.length !== 1 ? 's' : '')}
          </p>
        </div>
      </div>

      {/* Latest deliverable */}
      {deliverables.length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Latest Deliverable</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">{deliverables[0].label}</p>
              <p className="text-xs text-white/30 capitalize mt-0.5">{deliverables[0].type}</p>
            </div>
            <a
              href={deliverables[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/50 hover:text-white/80 transition-colors"
            >
              View →
            </a>
          </div>
        </div>
      )}

      {/* All done state */}
      {profile.stage === 'launch' && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">Your project is live!</p>
            <p className="text-xs text-white/40 mt-0.5">Congratulations — your new website is out in the world.</p>
          </div>
        </div>
      )}
    </div>
  );
}
