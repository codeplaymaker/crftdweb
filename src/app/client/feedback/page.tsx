'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getClientFeedback, submitClientFeedback, ClientFeedback } from '@/lib/firebase/firestore';
import { Plus, X, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

const STATUS_STYLES: Record<ClientFeedback['status'], string> = {
  open: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  acknowledged: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const STATUS_LABELS: Record<ClientFeedback['status'], string> = {
  open: 'Open',
  acknowledged: 'Replied',
  resolved: 'Resolved',
};

export default function ClientFeedbackPage() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<ClientFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getClientFeedback(user.uid).then(f => {
      setFeedback(f);
      setLoading(false);
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const id = await submitClientFeedback(user.uid, { subject, message });
    const newItem: ClientFeedback = {
      id,
      clientId: user.uid,
      subject,
      message,
      status: 'open',
      submittedAt: { toDate: () => new Date() } as never,
      repliedAt: null,
    };
    setFeedback(prev => [newItem, ...prev]);
    setSubject('');
    setMessage('');
    setShowForm(false);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Feedback</h1>
          <p className="text-sm text-white/40 mt-1">Send revision requests or questions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-sm font-semibold text-white/70">New Feedback</p>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Homepage hero text needs changing"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe what you'd like changed or what your question is…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
            />
          </div>
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 disabled:opacity-40">
            {saving ? 'Sending…' : 'Send feedback'}
          </button>
        </form>
      )}

      {feedback.length === 0 ? (
        <div className="text-center py-16 border border-white/8 rounded-2xl space-y-2">
          <MessageSquare className="w-6 h-6 text-white/15 mx-auto" />
          <p className="text-sm text-white/20">No feedback submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map(item => (
            <div key={item.id} className="bg-white/[0.02] border border-white/8 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80">{item.subject}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {item.submittedAt && (
                      new Date((item.submittedAt as unknown as { toDate: () => Date }).toDate?.() ?? item.submittedAt)
                        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    )}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </button>
              {expandedId === item.id && (
                <div className="px-5 pb-5 border-t border-white/6 pt-4 space-y-4">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Your message</p>
                    <p className="text-sm text-white/60 leading-relaxed">{item.message}</p>
                  </div>
                  {item.reply ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">Reply from CrftdWeb</p>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{item.reply}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-white/25">
                      <Clock className="w-3.5 h-3.5" />
                      Awaiting reply
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
