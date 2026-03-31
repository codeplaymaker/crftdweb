'use client';

import { useState, useEffect, useCallback } from 'react';
import { sendClientLoginDetails } from '@/app/actions/sendClientLoginDetails';
import { Users, ChevronDown, ChevronUp, Plus, X, Send, Check, Loader2, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminClient {
  uid: string;
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  projectName: string;
  package: string;
  stage: string;
  startDate: string;
  launchDate?: string;
  status: 'active' | 'paused' | 'complete';
  notes?: string;
  joinedAt: string | null;
}

interface AdminDeliverable {
  id: string;
  clientId: string;
  label: string;
  url: string;
  type: string;
  notes?: string;
  addedAt?: string | null;
}

interface AdminFeedback {
  id: string;
  clientId: string;
  subject: string;
  message: string;
  status: 'open' | 'acknowledged' | 'resolved';
  reply?: string;
  submittedAt?: string | null;
  repliedAt?: string | null;
}

interface AdminInvoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  paymentLink?: string;
  paidAt?: string | null;
  createdAt?: string | null;
}

interface CreatedCredentials {
  uid: string;
  tempPassword: string;
  name: string;
  email: string;
  projectName: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const STAGES = ['discovery', 'design', 'build', 'review', 'launch', 'maintenance'];
const STAGE_LABELS: Record<string, string> = {
  discovery: 'Discovery', design: 'Design', build: 'Build',
  review: 'Review', launch: 'Launch', maintenance: 'Maintenance',
};
const PACKAGES = ['starter', 'standard', 'premium', 'custom'];

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  complete: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  unpaid: 'bg-red-500/10 text-red-400 border-red-500/20',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  overdue: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  open: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  acknowledged: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  resolved: 'bg-white/10 text-white/50 border-white/10',
};

function fmt(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildClientLoginPreviewHtml(name: string, email: string, tempPassword: string, projectName: string): string {
  const firstName = name.split(' ')[0] || name;
  const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/client/signin` : 'https://crftdweb.com/client/signin';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <p style="margin:0;font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">CrftdWeb</p>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Your client portal for <strong>${projectName}</strong> is ready. Log in to track your project, view deliverables, submit feedback, and manage invoices.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
          <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Your Login</p>
          <p style="margin:0 0 6px;font-size:14px;color:#444;"><strong style="color:#111;">Email:</strong> ${email}</p>
          <p style="margin:0;font-size:14px;color:#444;"><strong style="color:#111;">Password:</strong> <span style="font-family:monospace;font-size:15px;letter-spacing:1px;color:#111;">${tempPassword}</span></p>
        </td></tr></table>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:#111;border-radius:8px;">
          <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Access your portal &rarr;</a>
        </td></tr></table>
        <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
        <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

// ─── Credentials Card ─────────────────────────────────────────────────────────

function CredentialsCard({ creds, onDismiss }: { creds: CreatedCredentials; onDismiss: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const previewHtml = buildClientLoginPreviewHtml(creds.name, creds.email, creds.tempPassword, creds.projectName);

  async function handleSend() {
    setSending(true);
    setSendError('');
    const res = await sendClientLoginDetails(creds.name, creds.email, creds.tempPassword, creds.projectName);
    setSending(false);
    if (res.success) setSent(true);
    else setSendError(res.error ?? 'Failed to send email');
  }

  return (
    <div className="border border-emerald-500/30 rounded-2xl bg-emerald-500/5 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Client created</p>
          <p className="text-base font-semibold text-white">{creds.name}</p>
          <p className="text-sm text-white/40">{creds.email}</p>
        </div>
        <button onClick={onDismiss} className="text-white/20 hover:text-white/50 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 space-y-1">
        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Temp Password</p>
        <p className="font-mono text-base text-white tracking-wider">{creds.tempPassword}</p>
      </div>
      {sendError && <p className="text-xs text-red-400">{sendError}</p>}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSend}
          disabled={sending || sent}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          {sent ? 'Sent' : sending ? 'Sending…' : 'Send login details'}
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/50 rounded-xl text-sm hover:text-white/80 hover:border-white/20"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Hide preview' : 'Preview email'}
        </button>
      </div>
      {showPreview && (
        <div className="rounded-xl overflow-hidden border border-white/10">
          <iframe
            srcDoc={previewHtml}
            className="w-full h-80 bg-white"
            title="Email preview"
            sandbox="allow-same-origin"
          />
        </div>
      )}
    </div>
  );
}

// ─── Project Tab ─────────────────────────────────────────────────────────────

function ProjectTab({ client, onUpdated }: { client: AdminClient; onUpdated: (u: Partial<AdminClient>) => void }) {
  const [stage, setStage] = useState(client.stage);
  const [status, setStatus] = useState(client.status);
  const [notes, setNotes] = useState(client.notes ?? '');
  const [launchDate, setLaunchDate] = useState(client.launchDate ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch('/api/admin/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: client.uid, stage, status, notes, launchDate: launchDate || null }),
    });
    setSaving(false);
    setSaved(true);
    onUpdated({ stage, status, notes, launchDate });
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Stage</label>
          <select value={stage} onChange={e => setStage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30">
            {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as AdminClient['status'])} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Launch date</label>
        <input type="date" value={launchDate} onChange={e => setLaunchDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30" />
      </div>
      <div>
        <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Notes</label>
        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 resize-none" />
      </div>
      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
        {saved ? 'Saved' : saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

// ─── Deliverables Tab ────────────────────────────────────────────────────────

function DeliverablesTab({ clientId }: { clientId: string }) {
  const [items, setItems] = useState<AdminDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('other');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/client-deliverables?clientId=${clientId}`);
    setItems(await res.json());
    setLoading(false);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    await fetch('/api/admin/client-deliverables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, label, url, type, notes }),
    });
    setLabel(''); setUrl(''); setType('other'); setNotes('');
    setShowForm(false);
    await load();
    setAdding(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this deliverable?')) return;
    await fetch('/api/admin/client-deliverables', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(prev => prev.filter(d => d.id !== id));
  }

  if (loading) return <div className="py-6 flex justify-center"><div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl text-sm text-white hover:bg-white/15">
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? 'Cancel' : 'Add deliverable'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="border border-white/10 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Label</label>
              <input required value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Homepage mockup" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30">
                <option value="mockup">Mockup</option>
                <option value="staging">Staging</option>
                <option value="asset">Asset</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">URL</label>
            <input required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Notes (optional)</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any context for the client" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
          </div>
          <button type="submit" disabled={adding} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-white/90 disabled:opacity-50">
            {adding ? 'Adding…' : 'Add'}
          </button>
        </form>
      )}
      {items.length === 0
        ? <p className="text-sm text-white/25 text-center py-6">No deliverables yet.</p>
        : items.map(d => (
          <div key={d.id} className="flex items-center gap-3 border border-white/8 rounded-xl px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 font-medium">{d.label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/30 capitalize">{d.type}</span>
                {d.notes && <span className="text-[10px] text-white/25 truncate">{d.notes}</span>}
              </div>
            </div>
            <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button onClick={() => handleDelete(d.id)} className="text-white/20 hover:text-red-400 shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))
      }
    </div>
  );
}

// ─── Feedback Tab ────────────────────────────────────────────────────────────

function FeedbackTab({ clientId }: { clientId: string }) {
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/client-feedback?clientId=${clientId}`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); });
  }, [clientId]);

  async function handleReply(id: string) {
    const reply = replies[id];
    if (!reply?.trim()) return;
    setSaving(p => ({ ...p, [id]: true }));
    await fetch('/api/admin/client-feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reply }),
    });
    setItems(prev => prev.map(f => f.id === id ? { ...f, reply, status: 'acknowledged' } : f));
    setSaving(p => ({ ...p, [id]: false }));
    setReplies(p => ({ ...p, [id]: '' }));
  }

  async function handleStatusChange(id: string, status: AdminFeedback['status']) {
    await fetch('/api/admin/client-feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setItems(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  }

  if (loading) return <div className="py-6 flex justify-center"><div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" /></div>;

  if (items.length === 0) return <p className="text-sm text-white/25 text-center py-6">No feedback submitted yet.</p>;

  return (
    <div className="space-y-3">
      {items.map(f => (
        <div key={f.id} className="border border-white/8 rounded-xl overflow-hidden">
          <button onClick={() => setExpandedId(expandedId === f.id ? null : f.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02]">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 font-medium">{f.subject}</p>
              <p className="text-xs text-white/30 mt-0.5">{fmt(f.submittedAt)}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[f.status]}`}>{f.status}</span>
            {expandedId === f.id ? <ChevronUp className="w-3.5 h-3.5 text-white/30 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30 shrink-0" />}
          </button>
          {expandedId === f.id && (
            <div className="px-4 pb-4 border-t border-white/6 pt-3 space-y-4">
              <p className="text-sm text-white/60 leading-relaxed">{f.message}</p>
              {f.reply && (
                <div className="bg-blue-500/8 border border-blue-500/15 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] text-blue-400/70 uppercase tracking-widest font-bold mb-1">Your reply</p>
                  <p className="text-sm text-white/60">{f.reply}</p>
                </div>
              )}
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={replies[f.id] ?? ''}
                  onChange={e => setReplies(p => ({ ...p, [f.id]: e.target.value }))}
                  placeholder={f.reply ? 'Update reply…' : 'Write a reply…'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none"
                />
                <div className="flex items-center gap-2">
                  <button onClick={() => handleReply(f.id)} disabled={saving[f.id] || !replies[f.id]?.trim()} className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 disabled:opacity-40">
                    {saving[f.id] ? 'Sending…' : 'Send reply'}
                  </button>
                  {f.status !== 'resolved' && (
                    <button onClick={() => handleStatusChange(f.id, 'resolved')} className="px-3 py-1.5 border border-white/10 text-white/50 rounded-lg text-xs hover:text-white/80">
                      Mark resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Invoices Tab ────────────────────────────────────────────────────────────

function InvoicesTab({ clientId }: { clientId: string }) {
  const [items, setItems] = useState<AdminInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ invoiceNumber: '', description: '', amount: '', dueDate: '', paymentLink: '' });
  const [adding, setAdding] = useState(false);
  const [marking, setMarking] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/client-invoices?clientId=${clientId}`);
    setItems(await res.json());
    setLoading(false);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    await fetch('/api/admin/client-invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, ...form, amount: Number(form.amount) }),
    });
    setForm({ invoiceNumber: '', description: '', amount: '', dueDate: '', paymentLink: '' });
    setShowForm(false);
    await load();
    setAdding(false);
  }

  async function handleMarkPaid(id: string) {
    setMarking(p => ({ ...p, [id]: true }));
    await fetch('/api/admin/client-invoices', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'paid' }),
    });
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i));
    setMarking(p => ({ ...p, [id]: false }));
  }

  if (loading) return <div className="py-6 flex justify-center"><div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl text-sm text-white hover:bg-white/15">
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? 'Cancel' : 'New invoice'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="border border-white/10 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Invoice #</label>
              <input required value={form.invoiceNumber} onChange={e => setForm(p => ({ ...p, invoiceNumber: e.target.value }))} placeholder="INV-001" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Amount (£)</label>
              <input required type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Description</label>
            <input required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Standard package — deposit" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Due date</label>
              <input required type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Payment link (opt.)</label>
              <input type="url" value={form.paymentLink} onChange={e => setForm(p => ({ ...p, paymentLink: e.target.value }))} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            </div>
          </div>
          <button type="submit" disabled={adding} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-white/90 disabled:opacity-50">
            {adding ? 'Creating…' : 'Create invoice'}
          </button>
        </form>
      )}
      {items.length === 0
        ? <p className="text-sm text-white/25 text-center py-6">No invoices yet.</p>
        : items.map(inv => (
          <div key={inv.id} className="flex items-center gap-3 border border-white/8 rounded-xl px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white/30">{inv.invoiceNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[inv.status]}`}>{inv.status}</span>
              </div>
              <p className="text-sm text-white/70 mt-0.5">{inv.description}</p>
              <p className="text-xs text-white/30 mt-0.5">Due {fmt(inv.dueDate)}</p>
            </div>
            <p className="text-base font-bold text-white shrink-0">£{inv.amount.toLocaleString()}</p>
            {inv.status !== 'paid' && (
              <button
                onClick={() => handleMarkPaid(inv.id)}
                disabled={marking[inv.id]}
                className="shrink-0 px-2.5 py-1.5 border border-white/10 text-white/50 rounded-lg text-xs hover:text-emerald-400 hover:border-emerald-500/30 disabled:opacity-40"
              >
                {marking[inv.id] ? '…' : 'Mark paid'}
              </button>
            )}
          </div>
        ))
      }
    </div>
  );
}

// ─── Client Detail Panel ─────────────────────────────────────────────────────

type DetailTab = 'project' | 'deliverables' | 'feedback' | 'invoices';

function ClientDetailPanel({ client, onUpdated, onClose }: {
  client: AdminClient;
  onUpdated: (u: Partial<AdminClient>) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>('project');

  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'project', label: 'Project' },
    { id: 'deliverables', label: 'Deliverables' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'invoices', label: 'Invoices' },
  ];

  return (
    <div className="mt-4 border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <div>
          <p className="text-sm font-semibold text-white">{client.name}</p>
          <p className="text-xs text-white/40">{client.projectName} · {client.businessName}</p>
        </div>
        <button onClick={onClose} className="text-white/25 hover:text-white/60 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex border-b border-white/8">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${tab === t.id ? 'text-white border-b-2 border-white' : 'text-white/35 hover:text-white/60'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        {tab === 'project' && <ProjectTab client={client} onUpdated={onUpdated} />}
        {tab === 'deliverables' && <DeliverablesTab clientId={client.uid} />}
        {tab === 'feedback' && <FeedbackTab clientId={client.uid} />}
        {tab === 'invoices' && <InvoicesTab clientId={client.uid} />}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const BLANK_FORM = {
  name: '', businessName: '', email: '', phone: '',
  projectName: '', package: 'standard', startDate: '', launchDate: '', notes: '',
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createdCreds, setCreatedCreds] = useState<CreatedCredentials | null>(null);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then(data => { setClients(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  function field(key: keyof typeof BLANK_FORM, value: string) {
    setForm(p => ({ ...p, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    const res = await fetch('/api/admin/create-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setCreateError(data.error ?? 'Failed'); setCreating(false); return; }

    const newClient: AdminClient = {
      uid: data.uid,
      name: form.name,
      businessName: form.businessName,
      email: form.email,
      phone: form.phone,
      projectName: form.projectName,
      package: form.package,
      stage: 'discovery',
      startDate: form.startDate || new Date().toISOString().split('T')[0],
      launchDate: form.launchDate || undefined,
      status: 'active',
      notes: form.notes,
      joinedAt: new Date().toISOString(),
    };
    setClients(prev => [newClient, ...prev]);
    setCreatedCreds({ uid: data.uid, tempPassword: data.tempPassword, name: form.name, email: form.email, projectName: form.projectName });
    setForm(BLANK_FORM);
    setShowForm(false);
    setCreating(false);
  }

  const selectedClient = clients.find(c => c.uid === selectedUid) ?? null;

  function handleClientUpdated(uid: string, updates: Partial<AdminClient>) {
    setClients(prev => prev.map(c => c.uid === uid ? { ...c, ...updates } : c));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Clients</h1>
            <p className="text-xs text-white/30">{clients.length} active project{clients.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setCreateError(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add client'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="border border-white/10 rounded-2xl p-6 space-y-5">
          <p className="text-sm font-semibold text-white/70">New Client Account</p>
          <div className="grid grid-cols-2 gap-4">
            {([
              ['name', 'Full name', 'text', true],
              ['businessName', 'Business name', 'text', true],
              ['email', 'Email', 'email', true],
              ['phone', 'Phone (opt.)', 'tel', false],
              ['projectName', 'Project name', 'text', true],
            ] as [keyof typeof BLANK_FORM, string, string, boolean][]).map(([key, label, type, req]) => (
              <div key={key}>
                <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">{label}</label>
                <input
                  type={type}
                  required={req}
                  value={form[key]}
                  onChange={e => field(key, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                />
              </div>
            ))}
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Package</label>
              <select value={form.package} onChange={e => field('package', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white capitalize focus:outline-none focus:border-white/30">
                {PACKAGES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Start date</label>
              <input type="date" value={form.startDate} onChange={e => field('startDate', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Launch date (opt.)</label>
              <input type="date" value={form.launchDate} onChange={e => field('launchDate', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Notes (opt.)</label>
            <textarea rows={2} value={form.notes} onChange={e => field('notes', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 resize-none" />
          </div>
          {createError && <p className="text-xs text-red-400">{createError}</p>}
          <button type="submit" disabled={creating} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-50">
            {creating && <Loader2 className="w-4 h-4 animate-spin" />}
            {creating ? 'Creating…' : 'Create client'}
          </button>
        </form>
      )}

      {/* Credentials Card */}
      {createdCreds && (
        <CredentialsCard creds={createdCreds} onDismiss={() => setCreatedCreds(null)} />
      )}

      {/* Client List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 border border-white/8 rounded-2xl">
          <Users className="w-7 h-7 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/25">No clients yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clients.map(client => (
            <div key={client.uid}>
              <button
                onClick={() => setSelectedUid(selectedUid === client.uid ? null : client.uid)}
                className="w-full border border-white/8 rounded-2xl bg-white/[0.02] px-5 py-4 flex items-center gap-4 text-left hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-white/50 shrink-0">
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white/85">{client.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[client.status]}`}>
                      {client.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/35 mt-0.5">{client.businessName} · {client.projectName}</p>
                  <p className="text-xs text-white/25 mt-0.5 capitalize">{STAGE_LABELS[client.stage] ?? client.stage} stage</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-white/30 capitalize">{client.package}</p>
                  <p className="text-[10px] text-white/20 mt-0.5">{fmt(client.joinedAt)}</p>
                </div>
                {selectedUid === client.uid
                  ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
              </button>

              {selectedUid === client.uid && selectedClient && (
                <ClientDetailPanel
                  client={selectedClient}
                  onUpdated={updates => handleClientUpdated(client.uid, updates)}
                  onClose={() => setSelectedUid(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
