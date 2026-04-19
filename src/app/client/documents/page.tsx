'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getClientDocuments, ClientDocument } from '@/lib/firebase/firestore';
import { FileText, FileSignature, FileSearch, File, ExternalLink } from 'lucide-react';

const TYPE_ICONS = {
  contract: FileSignature,
  proposal: FileSearch,
  brief: FileText,
  other: File,
};

const TYPE_LABELS: Record<ClientDocument['type'], string> = {
  contract: 'Contract',
  proposal: 'Proposal',
  brief: 'Brief',
  other: 'Document',
};

const TYPE_COLORS: Record<ClientDocument['type'], string> = {
  contract: 'text-emerald-400 bg-emerald-500/10',
  proposal: 'text-purple-400 bg-purple-500/10',
  brief: 'text-sky-400 bg-sky-500/10',
  other: 'text-white/40 bg-white/5',
};

export default function ClientDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getClientDocuments(user.uid).then(docs => {
      setDocuments(docs);
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
        <h1 className="text-2xl font-bold tracking-tight text-white">Documents</h1>
        <p className="text-sm text-white/40 mt-1">Your contracts, proposals and project briefs</p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 text-white/20 text-sm border border-white/8 rounded-2xl">
          No documents yet — we&apos;ll share them here once ready.
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => {
            const Icon = TYPE_ICONS[doc.type] ?? File;
            return (
              <div key={doc.id} className="flex items-center gap-4 border border-white/8 rounded-2xl px-5 py-4 hover:border-white/15 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLORS[doc.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90">{doc.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${TYPE_COLORS[doc.type]} border-current/20`}>
                      {TYPE_LABELS[doc.type]}
                    </span>
                    {doc.notes && (
                      <span className="text-[11px] text-white/30 truncate">{doc.notes}</span>
                    )}
                  </div>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/8 hover:bg-white/15 rounded-lg text-xs text-white/60 hover:text-white transition-colors shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
