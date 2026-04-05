'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Mail, ArrowLeft, AlertTriangle, CheckCircle2, Star, MapPin, Phone, ExternalLink, ClipboardCheck, Plus, X, Send, Clock } from 'lucide-react';
import Link from 'next/link';
import { sendBookingLink } from '@/app/actions/sendBookingLink';
import { type Verdict, type ApplicantStatus, type ApplicantWithStatus } from '@/app/admin/applicants/data';

// ─── Activity Log ──────────────────────────────────────────────────────────
interface ActivityEntry {
  text: string;
  timestamp: string;
}

interface ApplicantWithActivity extends ApplicantWithStatus {
  activityLog?: ActivityEntry[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const VERDICT_STYLES: Record<Verdict, string> = {
  booking: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  trial: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  decline: 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20',
};

const VERDICT_LABELS: Record<Verdict, string> = {
  booking: 'Booking',
  trial: 'Trial Task',
  decline: 'Decline',
};

const STATUS_STYLES: Record<ApplicantStatus, string> = {
  pending: 'bg-zinc-800 text-zinc-400',
  email_sent: 'bg-sky-500/10 text-sky-400',
  booked: 'bg-blue-500/10 text-blue-400',
  screened: 'bg-purple-500/10 text-purple-400',
  no_show: 'bg-orange-500/10 text-orange-400',
  rejected: 'bg-red-500/10 text-red-400',
};

const STATUS_LABELS: Record<ApplicantStatus, string> = {
  pending: 'Pending',
  email_sent: 'Email Sent',
  booked: 'Booked',
  screened: 'Screened',
  no_show: 'No Show',
  rejected: 'Rejected',
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          className={i < count ? 'text-amber-400 fill-amber-400' : 'text-zinc-700 fill-zinc-700'}
        />
      ))}
    </div>
  );
}

type FilterTab = 'all' | Verdict;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'booking', label: 'Booking' },
  { key: 'trial', label: 'Trial Task' },
  { key: 'decline', label: 'Decline' },
];

// ─── Types ─────────────────────────────────────────────────────────────────

interface TrialEntry {
  business: string;
  url: string;
  diagnosis: string;
}

interface TrialSubmission {
  id: string;
  email: string;
  entries: TrialEntry[];
  submittedAt: string | null;
  reviewed: boolean;
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantWithActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>('booking');
  const [sending, setSending] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<TrialSubmission[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingApplicant, setAddingApplicant] = useState(false);
  const [togglingReview, setTogglingReview] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/applicants').then(r => r.json()),
      fetch('/api/admin/trial-submissions').then(r => r.json()),
    ]).then(([applicantData, submissionData]) => {
      setApplicants(Array.isArray(applicantData) ? applicantData : []);
      setSubmissions(Array.isArray(submissionData) ? submissionData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const base = tab === 'all' ? applicants : applicants.filter((a) => a.verdict === tab);
    return [...base].sort((a, b) => b.rating - a.rating);
  }, [applicants, tab]);

  const counts = useMemo(() => ({
    all: applicants.length,
    booking: applicants.filter((a) => a.verdict === 'booking').length,
    trial: applicants.filter((a) => a.verdict === 'trial').length,
    decline: applicants.filter((a) => a.verdict === 'decline').length,
  }), [applicants]);

  async function handleSendBooking(applicant: ApplicantWithActivity) {
    setSending(applicant.id);
    setErrors((e) => { const n = { ...e }; delete n[applicant.id]; return n; });

    const result = await sendBookingLink(applicant.name, applicant.email);

    if (result.success) {
      // Update status in Firestore
      await fetch('/api/admin/applicants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: applicant.id,
          status: 'email_sent',
          emailSentAt: new Date().toISOString(),
        }),
      });

      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicant.id
            ? { ...a, status: 'email_sent', emailSentAt: new Date().toISOString() }
            : a
        )
      );
      setSentIds((s) => new Set(s).add(applicant.id));
    } else {
      setErrors((e) => ({ ...e, [applicant.id]: result.error ?? 'Failed to send' }));
    }

    setSending(null);
  }

  async function handleAddApplicant(formData: {
    name: string; email: string; phone: string; location: string;
    rating: number; verdict: Verdict; salesSignals: string; education: string;
    keyStrength: string; notes: string;
  }) {
    setAddingApplicant(true);
    try {
      const res = await fetch('/api/admin/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.applicant) {
        setApplicants((prev) => [...prev, {
          ...data.applicant,
          indeedEmail: false,
          activityLog: [],
        }]);
        setShowAddForm(false);
      }
    } catch {
      // silent
    } finally {
      setAddingApplicant(false);
    }
  }

  async function handleAddActivity(applicantId: string, text: string) {
    const res = await fetch('/api/admin/applicants', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: applicantId, activityEntry: { text } }),
    });
    const data = await res.json();
    if (data.success && data.entry) {
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicantId
            ? { ...a, activityLog: [...(a.activityLog ?? []), data.entry] }
            : a
        )
      );
    }
  }

  async function handleToggleReviewed(submissionId: string, reviewed: boolean) {
    setTogglingReview(submissionId);
    try {
      const res = await fetch('/api/admin/trial-submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, reviewed }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions((prev) =>
          prev.map((s) => s.id === submissionId ? { ...s, reviewed } : s)
        );
      }
    } catch {
      // silent
    }
    setTogglingReview(null);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Applicants</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Sales rep hiring pipeline · {applicants.length} total</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 bg-white text-zinc-900 text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <Plus size={14} />
            Add Applicant
          </button>
        </div>

        {/* Add Applicant Modal */}
        {showAddForm && (
          <AddApplicantModal
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddApplicant}
            submitting={addingApplicant}
          />
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-zinc-900 rounded-lg p-1 w-fit">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                tab === key
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
              <span className={`ml-2 text-xs ${tab === key ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 py-20">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading applicants…</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((applicant) => (
              <ApplicantRow
                key={applicant.id}
                applicant={applicant}
                sending={sending === applicant.id}
                justSent={sentIds.has(applicant.id)}
                error={errors[applicant.id]}
                onSendBooking={handleSendBooking}
                onAddActivity={handleAddActivity}
                onToggleReviewed={handleToggleReviewed}
                togglingReview={togglingReview === applicant.id}
                submission={submissions.find(s => s.email === applicant.email.toLowerCase()) ?? null}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-zinc-600 text-sm py-10 text-center">No applicants in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Row Component ─────────────────────────────────────────────────────────

interface RowProps {
  applicant: ApplicantWithActivity;
  sending: boolean;
  justSent: boolean;
  error?: string;
  onSendBooking: (a: ApplicantWithActivity) => void;
  onAddActivity: (applicantId: string, text: string) => void;
  onToggleReviewed: (submissionId: string, reviewed: boolean) => void;
  togglingReview: boolean;
  submission: TrialSubmission | null;
}

function ApplicantRow({ applicant, sending, justSent, error, onSendBooking, onAddActivity, onToggleReviewed, togglingReview, submission }: RowProps) {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const canSendBooking = applicant.verdict === 'booking' && applicant.status === 'pending';
  const alreadySent = applicant.status !== 'pending';

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await onAddActivity(applicant.id, noteText.trim());
    setNoteText('');
    setAddingNote(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Main row */}
      <div
        className="flex items-start gap-4 px-5 py-4 cursor-pointer select-none hover:bg-zinc-800/40 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Rating */}
        <div className="pt-0.5 shrink-0">
          <Stars count={applicant.rating} />
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-white">{applicant.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${VERDICT_STYLES[applicant.verdict]}`}>
              {VERDICT_LABELS[applicant.verdict]}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[applicant.status]}`}>
              {STATUS_LABELS[applicant.status]}
            </span>
            {applicant.indeedEmail && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <AlertTriangle size={9} />
                Indeed email
              </span>
            )}
            {submission && (
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${submission.reviewed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'}`}>
                <ClipboardCheck size={9} />
                {submission.reviewed ? 'Reviewed' : 'Task submitted'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Mail size={11} />
              {applicant.email}
            </span>
            {applicant.phone && (
              <span className="flex items-center gap-1">
                <Phone size={11} />
                {applicant.phone}
              </span>
            )}
            {applicant.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {applicant.location}
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0 flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
          {applicant.verdict === 'booking' && (
            <>
              {canSendBooking && (
                <button
                  onClick={() => onSendBooking(applicant)}
                  disabled={sending}
                  className="flex items-center gap-1.5 bg-white text-zinc-900 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Mail size={12} />
                  )}
                  {sending ? 'Sending…' : 'Send Booking Email'}
                </button>
              )}
              {(alreadySent || justSent) && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 size={12} />
                  {STATUS_LABELS[applicant.status]}
                </span>
              )}
            </>
          )}
          {error && (
            <span className="text-[11px] text-red-400">{error}</span>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-zinc-800 pt-3 space-y-2">
          {applicant.keyStrength && (
            <p className="text-xs text-zinc-300">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold mr-2">Strength</span>
              {applicant.keyStrength}
            </p>
          )}
          <p className="text-xs text-zinc-400">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold mr-2">Sales signals</span>
            {applicant.salesSignals}
          </p>
          <p className="text-xs text-zinc-500">
            <span className="text-zinc-600 uppercase tracking-wider text-[10px] font-semibold mr-2">Education</span>
            {applicant.education}
          </p>
          {applicant.notes && (
            <p className="text-xs text-orange-400/80 flex items-start gap-1.5">
              <AlertTriangle size={11} className="mt-0.5 shrink-0" />
              {applicant.notes}
            </p>
          )}
          {applicant.emailSentAt && (
            <p className="text-[11px] text-zinc-600">
              Email sent {new Date(applicant.emailSentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          {submission && (
            <div className="mt-3 border border-violet-500/20 rounded-xl overflow-hidden">
              <div className="bg-violet-500/10 px-4 py-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-violet-400 flex items-center gap-1.5">
                  <ClipboardCheck size={12} />
                  Trial task submission
                </span>
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  {submission.submittedAt && (
                    <span className="text-[10px] text-zinc-500">
                      {new Date(submission.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <button
                    onClick={() => onToggleReviewed(submission.id, !submission.reviewed)}
                    disabled={togglingReview}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-50 ${
                      submission.reviewed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    {togglingReview ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
                    {submission.reviewed ? 'Reviewed' : 'Mark reviewed'}
                  </button>
                </div>
              </div>
              <div className="divide-y divide-zinc-800">
                {submission.entries.map((entry, i) => (
                  <div key={i} className="px-4 py-3 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600 font-mono">{i + 1}</span>
                      <span className="text-xs font-medium text-white/80">{entry.business}</span>
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        <ExternalLink size={10} />
                      </a>
                    </div>
                    <p className="text-xs text-zinc-400 pl-5 italic">&ldquo;{entry.diagnosis}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="mt-3 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-zinc-800/50 px-4 py-2.5">
              <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                <Clock size={12} />
                Activity Notes
                {(applicant.activityLog?.length ?? 0) > 0 && (
                  <span className="text-[10px] text-zinc-600 ml-1">({applicant.activityLog!.length})</span>
                )}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              {(applicant.activityLog ?? []).map((entry, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300">{entry.text}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">
                      {new Date(entry.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {(applicant.activityLog ?? []).length === 0 && (
                <p className="text-[10px] text-zinc-600">No activity logged yet</p>
              )}
              <div className="flex gap-2 pt-2 border-t border-zinc-800" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder="Called, no answer — try Thursday…"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || addingNote}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs disabled:opacity-30 transition-colors"
                >
                  {addingNote ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Applicant Modal ───────────────────────────────────────────────────

function AddApplicantModal({
  onClose,
  onSubmit,
  submitting,
}: {
  onClose: () => void;
  onSubmit: (data: {
    name: string; email: string; phone: string; location: string;
    rating: number; verdict: Verdict; salesSignals: string; education: string;
    keyStrength: string; notes: string;
  }) => void;
  submitting: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(3);
  const [verdict, setVerdict] = useState<Verdict>('booking');
  const [salesSignals, setSalesSignals] = useState('');
  const [education, setEducation] = useState('');
  const [keyStrength, setKeyStrength] = useState('');
  const [notes, setNotes] = useState('');

  const canSubmit = name.trim() && email.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-bold text-white">Add Applicant</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500" placeholder="Full name" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Email *</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500" placeholder="email@example.com" />
            </div>
          </div>

          {/* Phone + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500" placeholder="07xxx xxxxxx" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500" placeholder="City" />
            </div>
          </div>

          {/* Rating + Verdict */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Rating</label>
              <div className="flex gap-1 mt-1.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} onClick={() => setRating(r)} className="p-0.5">
                    <Star size={16} className={r <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Verdict</label>
              <div className="flex gap-1.5 mt-1.5">
                {(['booking', 'trial', 'decline'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVerdict(v)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      verdict === v ? VERDICT_STYLES[v] : 'border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {VERDICT_LABELS[v]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Strength */}
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Key Strength</label>
            <input value={keyStrength} onChange={(e) => setKeyStrength(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500" placeholder="Main hiring differentiator" />
          </div>

          {/* Sales Signals */}
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Sales Signals</label>
            <textarea value={salesSignals} onChange={(e) => setSalesSignals(e.target.value)} rows={2} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none" placeholder="B2B experience, KPIs, tools used…" />
          </div>

          {/* Education */}
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Education</label>
            <input value={education} onChange={(e) => setEducation(e.target.value)} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500" placeholder="Degree, certifications" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Private Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none" placeholder="Internal notes about this candidate" />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-zinc-800">
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors">Cancel</button>
          <button
            onClick={() => onSubmit({ name, email, phone, location, rating, verdict, salesSignals, education, keyStrength, notes })}
            disabled={!canSubmit || submitting}
            className="flex items-center gap-1.5 bg-white text-zinc-900 text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            {submitting ? 'Adding…' : 'Add Applicant'}
          </button>
        </div>
      </div>
    </div>
  );
}
