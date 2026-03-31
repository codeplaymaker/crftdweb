'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getClientDeliverables, ClientDeliverable } from '@/lib/firebase/firestore';
import { ExternalLink, FileText, Monitor, Image, Package, File } from 'lucide-react';

const TYPE_ICONS = {
  mockup: Image,
  staging: Monitor,
  asset: Package,
  document: FileText,
  other: File,
};

const TYPE_COLORS: Record<ClientDeliverable['type'], string> = {
  mockup: 'text-purple-400 bg-purple-500/10',
  staging: 'text-blue-400 bg-blue-500/10',
  asset: 'text-amber-400 bg-amber-500/10',
  document: 'text-sky-400 bg-sky-500/10',
  other: 'text-white/40 bg-white/5',
};

export default function ClientDeliverables() {
  const { user } = useAuth();
  const [deliverables, setDeliverables] = useState<ClientDeliverable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getClientDeliverables(user.uid).then(d => {
      setDeliverables(d);
      setLoading(false);
    });
  }, [user]);

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
        <h1 className="text-2xl font-bold tracking-tight text-white">Deliverables</h1>
        <p className="text-sm text-white/40 mt-1">Files, links and assets shared by CrftdWeb</p>
      </div>

      {deliverables.length === 0 ? (
        <div className="text-center py-16 text-white/20 text-sm border border-white/8 rounded-2xl">
          Nothing shared yet — check back soon.
        </div>
      ) : (
        <div className="space-y-3">
          {deliverables.map(d => {
            const Icon = TYPE_ICONS[d.type] ?? File;
            return (
              <div key={d.id} className="bg-white/[0.02] border border-white/8 rounded-xl px-5 py-4 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[d.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80">{d.label}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-white/30 capitalize">{d.type}</span>
                    {d.notes && <span className="text-[11px] text-white/30">· {d.notes}</span>}
                    {d.addedAt && (
                      <span className="text-[11px] text-white/20">
                        · {new Date((d.addedAt as unknown as { toDate: () => Date }).toDate?.() ?? d.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/50 hover:text-white/80 transition-colors shrink-0"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
