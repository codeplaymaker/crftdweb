'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Mail, ArrowLeft, AlertTriangle, CheckCircle2, Star, MapPin, Phone, ExternalLink, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { sendBookingLink } from '@/app/actions/sendBookingLink';
import { type Verdict, type ApplicantStatus, type ApplicantWithStatus } from '@/app/admin/applicants/data';

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
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>('booking');
  const [sending, setSending] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<TrialSubmission[]>([]);

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

  async function handleSendBooking(applicant: ApplicantWithStatus) {
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Applicants</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Sales rep hiring pipeline · {applicants.length} total</p>
          </div>
        </div>

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
  applicant: ApplicantWithStatus;
  sending: boolean;
  justSent: boolean;
  error?: string;
  onSendBooking: (a: ApplicantWithStatus) => void;
  submission: TrialSubmission | null;
}

function ApplicantRow({ applicant, sending, justSent, error, onSendBooking, submission }: RowProps) {
  const [expanded, setExpanded] = useState(false);
  const canSendBooking = applicant.verdict === 'booking' && applicant.status === 'pending';
  const alreadySent = applicant.status !== 'pending';

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
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <ClipboardCheck size={9} />
                Task submitted
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
                {submission.submittedAt && (
                  <span className="text-[10px] text-zinc-500">
                    {new Date(submission.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
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
        </div>
      )}
    </div>
  );
}
