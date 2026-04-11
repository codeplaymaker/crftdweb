'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, ClipboardList, Phone, UserCheck, AlertTriangle, CheckCircle2, ArrowLeft, Send, Loader2, Check, X, Plus, CalendarPlus, Trash2, Clock, Eye, Mail } from 'lucide-react';
import Link from 'next/link';
import { sendLoginDetails } from '@/app/actions/sendLoginDetails';
import { sendTrialTask } from '@/app/actions/sendTrialTask';
import { sendBookingLink } from '@/app/actions/sendBookingLink';
import { getBookingStatuses, BookingStatus } from '@/app/actions/getBookingStatuses';
import { ScreeningSlot, createScreeningSlot } from '@/app/actions/createScreeningSlot';
import { deleteScreeningSlot } from '@/app/actions/deleteScreeningSlot';
import { getScreeningSlots } from '@/app/actions/getScreeningSlots';
import { RepProfile, RepLead, RepCommission } from '@/lib/firebase/firestore';

// ─── Login email preview HTML (mirrors sendLoginDetails.ts template) ───
function buildLoginPreviewHtml(name: string, email: string, tempPassword: string): string {
  const firstName = name.split(' ')[0] || name;
  const loginUrl = 'https://crftdweb.com/rep/signin';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Great news — you've been approved as a CrftdWeb sales rep. Welcome to the team.</p>
        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">Your rep portal is ready. Log in with the credentials below, then complete the training modules before you start outreach.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
          <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Your Login</p>
          <p style="margin:0 0 6px;font-size:14px;color:#444;"><strong style="color:#111;">Email:</strong> ${email}</p>
          <p style="margin:0;font-size:14px;color:#444;"><strong style="color:#111;">Temp password:</strong> <span style="font-family:monospace;font-size:15px;letter-spacing:1px;color:#111;">${tempPassword}</span></p>
        </td></tr></table>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:#111;border-radius:8px;">
          <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Log in to your portal &rarr;</a>
        </td></tr></table>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">Change your password after your first login. If you have any questions, reply to this email.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
        <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

// ─── Types ───
interface Step {
  id: string;
  number: string;
  title: string;
  time: string;
  color: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

// ─── Expandable Step Card ───
function StepCard({ step }: { step: Step }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-white/8 rounded-2xl overflow-hidden bg-white/[0.02]"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${step.color}`}>
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-white/30 tracking-widest uppercase">Step {step.number}</span>
            <span className="text-xs text-white/20">·</span>
            <span className="text-xs text-white/30">{step.time}</span>
          </div>
          <p className="text-base font-semibold text-white/90">{step.title}</p>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/8 pt-5">
              {step.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Steps Data ───
const steps: Step[] = [
  {
    id: 'application',
    number: '1',
    title: 'Application comes in',
    time: '2 mins',
    color: 'bg-purple-600/20 text-purple-400',
    icon: <ClipboardList className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-white/70 leading-relaxed">
        <p>Indeed or Gumtree notifies you by email. Open the CV and ask three quick questions:</p>
        <div className="space-y-2">
          {[
            'Do they have any sales, customer service, or hustle in their background?',
            'Are they based in the UK?',
            'Does their CV show they can communicate clearly?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-purple-400/70 mt-0.5 shrink-0" />
              <span>{q}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">All yes</p>
            <p className="text-white/60 text-xs">Send the trial task email<br />(Admin → Emails → Rep Templates)</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Any no</p>
            <p className="text-white/60 text-xs">Don&apos;t reply, or send a polite decline. Move on.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'trial',
    number: '2',
    title: 'Trial task — 48 hours',
    time: '0 mins your time',
    color: 'bg-sky-600/20 text-sky-400',
    icon: <ClipboardList className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-white/70 leading-relaxed">
        <p>The task: <span className="text-white font-medium">Find 5 UK businesses with a bad website. Write one sentence for each explaining why it needs a redesign.</span></p>
        <p>Use the <span className="text-amber-400">&quot;Rep applicant — trial task&quot;</span> template in Admin → Emails → Rep Templates to send it.</p>
        <p className="text-white/50">What you&apos;re looking for when they reply:</p>
        <div className="space-y-2">
          {[
            { label: 'Did they actually do it?', note: 'Filters out 80% of lazy applicants immediately' },
            { label: 'Are the businesses real and observations sharp?', note: 'Shows commercial awareness' },
            { label: 'Is their writing clear?', note: 'They will be emailing prospects on your behalf' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-sky-400/70 mt-0.5 shrink-0" />
              <div>
                <p className="text-white/80 font-medium">{item.label}</p>
                <p className="text-white/40 text-xs mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Good response</p>
            <p className="text-white/60 text-xs">Book the 15-minute screening call</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">No reply or lazy</p>
            <p className="text-white/60 text-xs">Pass. Don&apos;t follow up.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'screening',
    number: '3',
    title: '15-minute screening call',
    time: '15 mins',
    color: 'bg-amber-600/20 text-amber-400',
    icon: <Phone className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-white/70 leading-relaxed">
        <p>Ask these five questions — and listen for energy, honesty, and realistic expectations:</p>
        <div className="space-y-3">
          {[
            { q: '"Tell me what you know about CrftdWeb so far"', note: 'Did they bother to look?' },
            { q: '"Have you ever sold anything — even informally?"', note: 'Car boot, market stall, freelance gig — anything counts' },
            { q: '"How many calls do you think you could realistically make in a day?"', note: 'Anything under 5 is a red flag' },
            { q: '"This is commission-only — what\'s your current situation, are you okay with that?"', note: 'No surprises later' },
            { q: '"If I gave you a script and a list of businesses, when could you start?"', note: 'Are they ready to move?' },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
              <p className="text-white/85 font-medium">{item.q}</p>
              <p className="text-white/35 text-xs mt-1 italic">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mt-2">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Key signal</p>
          <p className="text-white/60 text-xs">You want someone who is hungry, not desperate. Confident, not cocky. Honest about their availability.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'onboard',
    number: '4',
    title: 'Onboard — if yes',
    time: '15 mins',
    color: 'bg-emerald-600/20 text-emerald-400',
    icon: <UserCheck className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-white/70 leading-relaxed">
        <p>Do these five things immediately after you say yes on the call:</p>
        <div className="space-y-2">
          {[
            {
              title: 'Create their rep account',
              desc: 'Go to Admin → Active Reps → Add Rep. Enter their name, email, phone. Copy the temp password — it only shows once.',
              accent: 'text-purple-400',
            },
            {
              title: 'Send the welcome email',
              desc: 'Go to Admin → Email → Send Email → select "Booking Link" tab isn\'t for this — use Admin → Emails → Copy Templates → Rep Templates → "Rep onboarding — welcome email". Paste their login URL: crftdweb.com/rep/signin',
              accent: 'text-sky-400',
            },
            {
              title: 'Walk them through the portal',
              desc: 'They log in at crftdweb.com/rep/signin. The portal has their dashboard, lead tracker, AI roleplay trainer, and call resources — everything they need. Tell them to complete the training modules before their first call.',
              accent: 'text-emerald-400',
            },
            {
              title: 'Share the call script',
              desc: 'Send them crftdweb.com/public/social-posts/rep-call-script.html or print it. They should have it open or in front of them on every call until it\'s second nature.',
              accent: 'text-amber-400',
            },
            {
              title: 'Set expectations — out loud',
              desc: 'Commission is rank-based: Bronze (trial, 0%) → Silver (10–20%) → Gold → Diamond → Closer → Master → Dragon (22–35%). Paid within 7 days of client deposit. No retainer, no salary, no expenses. They log every prospect in the portal. If they miss a week without contact, they\'re off the team.',
              accent: 'text-rose-400',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
              <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${item.accent}`} />
              <div>
                <p className="text-white/80 font-medium">{item.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Rep portal</p>
            <p className="text-white/60 text-xs">crftdweb.com/rep/signin — dashboard, leads, AI roleplay trainer, resources. Everything in one place.</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">First target</p>
            <p className="text-white/60 text-xs">Complete all training modules, then 10 calls on day one. Don&apos;t let them start calling without doing the AI roleplay first.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'week-one',
    number: '5',
    title: 'First week check-in',
    time: '10 mins',
    color: 'bg-rose-600/20 text-rose-400',
    icon: <AlertTriangle className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-white/70 leading-relaxed">
        <p>Check in on WhatsApp or call after 3 days. Ask:</p>
        <div className="space-y-2">
          {[
            'How many calls have you made so far?',
            'Have you logged any leads in the sheet?',
            'Any blockers or questions about the script?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-rose-400/70 mt-0.5 shrink-0" />
              <span>{q}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Active</p>
            <p className="text-white/60 text-xs">They&apos;ve made calls, logged at least a few leads. Keep going — check in weekly.</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">0 calls, no reason</p>
            <p className="text-white/60 text-xs">Move on quickly. Don&apos;t chase people who won&apos;t perform. Replace them.</p>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 mt-1">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">The real filter</p>
          <p className="text-white/55 text-xs">The interview is just gut feel. The first week is the truth. What they do with zero pressure and no one watching is who they are.</p>
        </div>
      </div>
    ),
  },
];

// ─── Slot Manager ───
function SlotManager() {
  const [slots, setSlots] = useState<ScreeningSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  function formatLabel(dateTime: string): string {
    const d = new Date(dateTime);
    const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const time = d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day} · ${time}`;
  }

  useEffect(() => {
    getScreeningSlots().then((s) => { setSlots(s); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!dateInput || !timeInput) return;
    setAdding(true);
    setAddError('');
    try {
      const dateTime = `${dateInput}T${timeInput}`;
      const label = formatLabel(dateTime);
      const result = await createScreeningSlot(dateTime, label);
      if (result.success && result.slot) {
        setSlots((prev) => [...prev, result.slot!].sort((a, b) => a.dateTime.localeCompare(b.dateTime)));
        setDateInput('');
        setTimeInput('');
      } else {
        setAddError(result.error ?? 'Failed to add slot');
      }
    } catch (err) {
      setAddError('Network error — please try again');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (slotId: string) => {
    setDeleting(slotId);
    await deleteScreeningSlot(slotId);
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
    setDeleting(null);
  };

  return (
    <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/8">
      <h3 className="text-sm font-semibold text-white/70 mb-1 flex items-center gap-2">
        <CalendarPlus className="w-4 h-4 text-sky-400" />
        Available Slots
      </h3>
      <p className="text-xs text-white/30 mb-4">Add times you&apos;re available — applicants pick from these when they click their booking link.</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
        />
        <input
          type="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
        />
        <button
          onClick={handleAdd}
          disabled={!dateInput || !timeInput || adding}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add
        </button>
      </div>

      {addError && (
        <p className="text-xs text-red-400 mb-3">{addError}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-white/30" />
        </div>
      ) : slots.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-3">No slots added yet.</p>
      ) : (
        <div className="space-y-1.5">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                slot.available
                  ? 'bg-white/[0.02] border-white/8 text-white/60'
                  : 'bg-white/[0.01] border-white/5 text-white/25'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs font-medium">{slot.label}</span>
                {!slot.available && slot.bookedByName && (
                  <span className="text-[10px] text-emerald-400/70 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                    Booked · {slot.bookedByName.split(' ')[0]}
                  </span>
                )}
              </div>
              {slot.available && (
                <button
                  onClick={() => handleDelete(slot.id)}
                  disabled={deleting === slot.id}
                  className="flex items-center gap-1 text-[10px] text-red-400/50 hover:text-red-400 transition-colors disabled:opacity-40 ml-2 flex-shrink-0"
                >
                  {deleting === slot.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shortlist Data ───
interface Applicant {
  id: string;
  name: string;
  email: string;
  status: string;
  color: string;
  canSend: boolean;
  canBookCall?: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; canSend: boolean; canBookCall: boolean }> = {
  'New':                  { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', canSend: true,  canBookCall: false },
  'Trial task sent':      { color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false, canBookCall: false },
  'Book Screening Call':  { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', canSend: false, canBookCall: true },
  'Pass':                 { color: 'text-red-400 bg-red-500/10 border-red-500/20',            canSend: false, canBookCall: false },
};
const STATUS_LABELS = Object.keys(STATUS_CONFIG);

const SEED_SHORTLIST: Applicant[] = [
  { id: 'shruti-boodhun',    name: 'Shruti Boodhun',    email: 'shrutiboodhun12@outlook.com',      status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'nicol',             name: 'Nicol',             email: 'nicol1@live.co.uk',                status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'brittany-parker',   name: 'Brittany Parker',   email: 'brittany.parker24@gmail.com',      status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'thlia-xavier',      name: 'Thlia Xavier',      email: 'thlia.xavier@gmail.com',           status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'mia-msembe',        name: 'Mia Msembe',        email: 'miamesembe@gmail.com',             status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'trisha',            name: 'Trisha',            email: 'trisha160702@gmail.com',           status: 'Book Screening Call', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', canSend: false, canBookCall: true },
  { id: 'james-owain',       name: 'James Owain',       email: 'Jamesowain234@gmail.com',          status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'subby',             name: 'Subby',             email: 'subby487@gmail.com',               status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'ebalo-shabani',     name: 'Ebalo Shabani',     email: 'ebaloshabani010@gmail.com',        status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'obinna-eze-elijah', name: 'Obinna Eze Elijah', email: 'obiezeelijah@gmail.com',           status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'gracie-tamplin',    name: 'Gracie Tamplin',    email: 'gracie.tamplin@icloud.com',        status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'kujembola-mathew',  name: 'Kujembola Mathew',  email: 'kujemath97@gmail.com',             status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'nieah-mundle',      name: 'Nieah Mundle',      email: 'Rita98_2020@yahoo.com',            status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'john-williams',     name: 'John Williams',     email: 'jvw0503007_qwt@indeedemail.com',   status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'tapi-mandaza',      name: 'Tapi Mandaza',      email: 'Tapiwa.mandaza@outlook.com',       status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'chris-cox',         name: 'Chris Cox',         email: 'chief2002@outlook.com',            status: 'Trial task sent',     color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',           canSend: false },
  { id: 'joane-cabrera',     name: 'Joane Cabrera',     email: 'joanecabrera10@gmail.com',         status: 'Pass',                color: 'text-red-400 bg-red-500/10 border-red-500/20',           canSend: false },
  { id: 'sam-mcloughlin',    name: 'Sam McLoughlin',    email: 'Sam.mcloughlin16@gmail.com',       status: 'Pass',                color: 'text-red-400 bg-red-500/10 border-red-500/20',           canSend: false },
];

// ─── Applicant Row ───
function ApplicantRow({ applicant, bookingStatus, onDelete, onStatusChange }: {
  applicant: Applicant;
  bookingStatus?: BookingStatus | null;
  onDelete?: () => void;
  onStatusChange?: (status: string) => void;
}) {
  const taskKey = `trial-sent-${applicant.name.replace(/\s+/g, '-').toLowerCase()}`;
  const callKey = `screening-sent-${applicant.name.replace(/\s+/g, '-').toLowerCase()}`;
  const [openPanel, setOpenPanel] = useState<'task' | 'call' | null>(null);
  const [email, setEmail] = useState(applicant.email);
  const [taskStatus, setTaskStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(() =>
    typeof window !== 'undefined' && localStorage.getItem(taskKey) === 'sent' ? 'sent' : 'idle'
  );
  const [callStatus, setCallStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(() =>
    typeof window !== 'undefined' && localStorage.getItem(callKey) === 'sent' ? 'sent' : 'idle'
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendTask = async () => {
    setTaskStatus('sending');
    setErrorMsg('');
    const result = await sendTrialTask(applicant.name.split(' ')[0], email);
    if (result.success) {
      setTaskStatus('sent');
      localStorage.setItem(taskKey, 'sent');
      setOpenPanel(null);
    } else {
      setTaskStatus('error');
      setErrorMsg(result.error || 'Failed to send');
    }
  };

  const handleBookCall = async () => {
    setCallStatus('sending');
    setErrorMsg('');
    const result = await sendBookingLink(applicant.name.split(' ')[0], email);
    if (result.success) {
      setCallStatus('sent');
      localStorage.setItem(callKey, 'sent');
      setOpenPanel(null);
    } else {
      setCallStatus('error');
      setErrorMsg(result.error || 'Failed to send');
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-white/70 font-medium truncate">{applicant.name}</span>
          {onStatusChange ? (
            <select
              value={applicant.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`text-xs font-semibold px-2 py-1 rounded-full border shrink-0 bg-transparent cursor-pointer focus:outline-none ${applicant.color}`}
            >
              {STATUS_LABELS.map((s) => <option key={s} value={s} className="bg-[#0a0a0f] text-white">{s}</option>)}
            </select>
          ) : (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${applicant.color}`}>{applicant.status}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {applicant.canSend && (
            taskStatus === 'sent' ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> Task Sent
              </span>
            ) : (
              <button
                onClick={() => setOpenPanel(openPanel === 'task' ? null : 'task')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition-all"
              >
                <Send className="w-3 h-3" /> Send Trial Task
              </button>
            )
          )}
          {applicant.canBookCall && (
            bookingStatus?.booked ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Call Booked · {bookingStatus.slotLabel}
              </span>
            ) : callStatus === 'sent' ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> Link Sent
              </span>
            ) : (
              <button
                onClick={() => setOpenPanel(openPanel === 'call' ? null : 'call')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 transition-all"
              >
                <Phone className="w-3 h-3" /> Book Screening Call
              </button>
            )
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              title="Remove from shortlist"
              className="ml-1 text-white/15 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5 pt-3">
              <p className="text-xs text-white/40 mb-2">
                {openPanel === 'task' ? 'Send trial task to' : 'Send booking link to'}{' '}
                <span className="text-white/60">{applicant.name.split(' ')[0]}</span>:
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="applicant@email.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50"
                />
                <button
                  onClick={openPanel === 'task' ? handleSendTask : handleBookCall}
                  disabled={(openPanel === 'task' ? taskStatus : callStatus) === 'sending' || !email}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all ${
                    openPanel === 'call' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {(openPanel === 'task' ? taskStatus : callStatus) === 'sending' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : openPanel === 'call' ? (
                    <Phone className="w-3.5 h-3.5" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {(openPanel === 'task' ? taskStatus : callStatus) === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </div>
              {(openPanel === 'task' ? taskStatus : callStatus) === 'error' && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <X className="w-3 h-3" /> {errorMsg}
                </p>
              )}
              <p className="text-xs text-white/25 mt-2">
                {openPanel === 'task'
                  ? 'Subject: "CrftdWeb — Quick task before we chat"'
                  : 'Subject: "CrftdWeb — Book your screening call"'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Stats Bar ───
const stats = [
  { label: 'Your time per recruit', value: '~45 mins' },
  { label: 'Trial task pass rate', value: '~20%' },
  { label: 'Calls/day target', value: '10' },
  { label: 'Commission', value: '10–20%' },
];

// ─── Management Tab ───
interface AdminEmail {
  id: string;
  repId: string;
  repName: string;
  leadId: string;
  businessName: string;
  recipientEmail: string;
  templateKey: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed';
  error?: string;
  sentAt: string | null;
  repliedAt?: string | null;
}

interface AdminReply {
  id: string;
  leadId: string;
  repId: string;
  from: string;
  subject: string;
  textBody: string;
  receivedAt: string | null;
}

function ManagementTab() {
  const [reps, setReps] = useState<RepProfile[]>([]);
  const [leads, setLeads] = useState<RepLead[]>([]);
  const [commissions, setCommissions] = useState<RepCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRep, setShowAddRep] = useState(false);
  const [addRepForm, setAddRepForm] = useState({ name: '', email: '', phone: '' });
  const [addRepStatus, setAddRepStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [newRepResult, setNewRepResult] = useState<{ uid: string; tempPassword: string } | null>(null);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);
  const [loginEmailStatus, setLoginEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [loginEmailError, setLoginEmailError] = useState('');
  const [showLoginPreview, setShowLoginPreview] = useState(false);

  // Email log + settings
  const [emails, setEmails] = useState<AdminEmail[]>([]);
  const [adminReplies, setAdminReplies] = useState<AdminReply[]>([]);
  const [maxEmailsPerDay, setMaxEmailsPerDay] = useState(20);
  const [editingMaxEmails, setEditingMaxEmails] = useState(false);
  const [maxEmailsInput, setMaxEmailsInput] = useState('20');
  const [savingMaxEmails, setSavingMaxEmails] = useState(false);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/reps').then(r => r.json()),
      fetch('/api/admin/leads').then(r => r.json()),
      fetch('/api/admin/commissions').then(r => r.json()),
      fetch('/api/admin/emails').then(r => r.json()),
      fetch('/api/admin/email-settings').then(r => r.json()),
    ]).then(([r, l, c, e, s]) => {
      setReps(r);
      setLeads(l);
      setCommissions(c);
      // Handle both old array format and new { emails, replies } format
      if (Array.isArray(e)) {
        setEmails(e);
      } else {
        setEmails(Array.isArray(e?.emails) ? e.emails : []);
        setAdminReplies(Array.isArray(e?.replies) ? e.replies : []);
      }
      setMaxEmailsPerDay(s?.maxEmailsPerDay ?? 20);
      setMaxEmailsInput(String(s?.maxEmailsPerDay ?? 20));
      setLoading(false);
    });
  }, []);

  async function handleAddRep(e: React.FormEvent) {
    e.preventDefault();
    setAddRepStatus('saving');
    try {
      const res = await fetch('/api/admin/create-rep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addRepForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const data = await res.json();
      setNewRepResult(data);
      setAddRepStatus('done');
      // Refresh reps list
      fetch('/api/admin/reps').then(r => r.json()).then(setReps);
    } catch (err) {
      console.error(err);
      setAddRepStatus('error');
    }
  }

  async function handleSaveMaxEmails() {
    const val = Number(maxEmailsInput);
    if (!val || val < 1 || val > 500) return;
    setSavingMaxEmails(true);
    await fetch('/api/admin/email-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxEmailsPerDay: val }),
    });
    setMaxEmailsPerDay(val);
    setEditingMaxEmails(false);
    setSavingMaxEmails(false);
  }

  async function handleMarkPaid(commissionId: string) {
    setMarkingPaid(commissionId);
    await fetch('/api/admin/commissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: commissionId }),
    });
    setCommissions(prev => prev.map(c => c.id === commissionId ? { ...c, status: 'paid' as const } : c));
    setMarkingPaid(null);
  }

  async function handleUpdateRep(uid: string, field: 'status' | 'tier' | 'careerRank', value: string) {
    await fetch('/api/admin/reps', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, [field]: value }),
    });
    setReps(prev => prev.map(r => r.uid === uid ? { ...r, [field]: value } : r));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-white/30" />
      </div>
    );
  }

  const activeReps = reps.filter(r => r.status === 'active');
  const pendingCommissions = commissions.filter(c => c.status !== 'paid');
  const totalOwed = pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const activeLeads = leads.filter(l => l.status !== 'lost');

  return (
    <div className="space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Reps', value: activeReps.length },
          { label: 'Total Reps', value: reps.length },
          { label: 'Active Leads', value: activeLeads.length },
          { label: 'Commission Owed', value: `£${totalOwed.toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-4 text-center">
            <p className="text-2xl font-black tracking-tight text-white">{s.value}</p>
            <p className="text-xs text-white/35 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add Rep */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white/70">Reps</p>
          <button
            onClick={() => { setShowAddRep(!showAddRep); setAddRepStatus('idle'); setNewRepResult(null); setAddRepForm({ name: '', email: '', phone: '' }); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/80 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Rep
          </button>
        </div>

        {showAddRep && addRepStatus !== 'done' && (
          <form onSubmit={handleAddRep} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-3 space-y-3">
            <p className="text-xs text-white/30 mb-1">Creates a Firebase Auth account + rep profile. A temp password will be shown once.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[{ key: 'name', label: 'Full Name', req: true }, { key: 'email', label: 'Email', req: true }, { key: 'phone', label: 'Phone', req: false }].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-widest">{f.label}</label>
                  <input
                    type={f.key === 'email' ? 'email' : 'text'}
                    value={addRepForm[f.key as keyof typeof addRepForm]}
                    onChange={e => setAddRepForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required={f.req}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={addRepStatus === 'saving'} className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 disabled:opacity-40 flex items-center gap-1.5">
                {addRepStatus === 'saving' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {addRepStatus === 'saving' ? 'Creating...' : 'Create Rep'}
              </button>
              <button type="button" onClick={() => setShowAddRep(false)} className="px-4 py-2 bg-white/5 text-white/50 rounded-lg text-xs hover:bg-white/10">Cancel</button>
            </div>
            {addRepStatus === 'error' && <p className="text-xs text-red-400">Something went wrong. Check the console.</p>}
          </form>
        )}

        {addRepStatus === 'done' && newRepResult && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 mb-3 space-y-4">
            <div>
              <p className="text-sm font-semibold text-emerald-400 mb-1">Rep account created ✓</p>
              <p className="text-xs text-white/50">Send the rep their login details below — the temp password cannot be recovered after you leave this screen.</p>
            </div>

            {/* Credentials */}
            <div className="space-y-1.5 font-mono text-sm bg-white/[0.04] rounded-lg px-4 py-3">
              <p className="text-white/60">Name: <span className="text-white">{addRepForm.name}</span></p>
              <p className="text-white/60">Login: <span className="text-white">{addRepForm.email}</span></p>
              <p className="text-white/60">Password: <span className="text-white bg-white/10 px-2 py-0.5 rounded">{newRepResult.tempPassword}</span></p>
              <p className="text-white/60">Portal: <span className="text-white">crftdweb.com/rep/signin</span></p>
            </div>

            {/* Preview toggle */}
            <div>
              <button
                onClick={() => setShowLoginPreview(!showLoginPreview)}
                className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {showLoginPreview ? 'Hide preview' : 'Preview email'}
              </button>
              <AnimatePresence>
                {showLoginPreview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                      <div className="bg-white/[0.04] border-b border-white/8 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-[10px] text-white/25 font-mono ml-2">welcome email — {addRepForm.email}</span>
                      </div>
                      <iframe
                        srcDoc={buildLoginPreviewHtml(addRepForm.name, addRepForm.email, newRepResult.tempPassword)}
                        className="w-full bg-white"
                        style={{ height: '540px', border: 'none' }}
                        title="Login email preview"
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Send button */}
            <div className="flex items-center gap-3">
              {loginEmailStatus !== 'sent' ? (
                <button
                  onClick={async () => {
                    setLoginEmailStatus('sending');
                    setLoginEmailError('');
                    const result = await sendLoginDetails(addRepForm.name, addRepForm.email, newRepResult.tempPassword);
                    if (result.success) {
                      setLoginEmailStatus('sent');
                    } else {
                      setLoginEmailError(result.error ?? 'Failed to send');
                      setLoginEmailStatus('error');
                    }
                  }}
                  disabled={loginEmailStatus === 'sending'}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 disabled:opacity-40 transition-all"
                >
                  {loginEmailStatus === 'sending' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                  {loginEmailStatus === 'sending' ? 'Sending…' : 'Send login details'}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-semibold text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> Email sent
                </div>
              )}
              <button
                onClick={() => { setShowAddRep(false); setAddRepStatus('idle'); setNewRepResult(null); setLoginEmailStatus('idle'); setLoginEmailError(''); setShowLoginPreview(false); }}
                className="text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                Done
              </button>
            </div>
            {loginEmailStatus === 'error' && loginEmailError && (
              <p className="text-xs text-red-400">{loginEmailError}</p>
            )}
          </div>
        )}

        {/* Reps table */}
        <div className="space-y-2">
          {reps.length === 0 && <p className="text-sm text-white/25 py-4 text-center">No reps yet. Add one above.</p>}
          {reps.map(rep => {
            const repLeads = leads.filter(l => l.repId === rep.uid);
            const wonLeads = repLeads.filter(l => l.status === 'won');
            const repCommissions = commissions.filter(c => c.repId === rep.uid && c.status !== 'paid');
            const owed = repCommissions.reduce((s, c) => s + c.commissionAmount, 0);
            return (
              <div key={rep.uid} className="bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">{rep.name}</p>
                    <p className="text-xs text-white/30">{rep.email}</p>
                    {rep.bankDetails?.sortCode ? (
                      <p className="text-[10px] text-white/20 font-mono mt-0.5">
                        {rep.bankDetails.accountName} · {rep.bankDetails.sortCode} · {rep.bankDetails.accountNumber}
                      </p>
                    ) : (
                      <p className="text-[10px] text-amber-400/50 mt-0.5">No bank details</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-right text-xs">
                    <div>
                      <p className="text-white/60 font-semibold">{repLeads.length}</p>
                      <p className="text-white/25">leads</p>
                    </div>
                    <div>
                      <p className="text-emerald-400 font-semibold">{wonLeads.length}</p>
                      <p className="text-white/25">won</p>
                    </div>
                    {owed > 0 && (
                      <div>
                        <p className="text-amber-400 font-semibold">£{owed.toLocaleString()}</p>
                        <p className="text-white/25">owed</p>
                      </div>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      rep.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      'text-white/30 bg-white/5 border-white/10'
                    }`}>
                      <select
                        value={rep.status}
                        onChange={e => handleUpdateRep(rep.uid, 'status', e.target.value)}
                        className="bg-transparent border-none outline-none cursor-pointer text-inherit text-[10px] font-bold"
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      rep.careerRank === 'dragon' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                      rep.careerRank === 'master' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
                      rep.careerRank === 'closer' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' :
                      rep.careerRank === 'diamond' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                      rep.careerRank === 'gold' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                      rep.careerRank === 'silver' ? 'text-slate-300 bg-slate-400/10 border-slate-400/20' :
                      'text-amber-600 bg-amber-500/10 border-amber-500/20'
                    }`}>
                      <select
                        value={rep.careerRank ?? 'bronze'}
                        onChange={e => handleUpdateRep(rep.uid, 'careerRank', e.target.value)}
                        className="bg-transparent border-none outline-none cursor-pointer text-inherit text-[10px] font-bold"
                      >
                        <option value="bronze">🥉 Bronze</option>
                        <option value="silver">🥈 Silver</option>
                        <option value="gold">🥇 Gold</option>
                        <option value="diamond">💎 Diamond</option>
                        <option value="closer">🎯 Closer</option>
                        <option value="master">🔥 Master</option>
                        <option value="dragon">🐉 Dragon</option>
                      </select>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commission log */}
      <div>
        <p className="text-sm font-semibold text-white/70 mb-3">Pending Commissions</p>
        {pendingCommissions.length === 0 && (
          <p className="text-sm text-white/25 py-4 text-center">No pending commissions.</p>
        )}
        <div className="space-y-2">
          {pendingCommissions.map(c => (
            <div key={c.id} className="bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 font-medium">{c.repName}</p>
                <p className="text-xs text-white/30">{c.businessName} · £{c.dealValue.toLocaleString()} deal</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-amber-400">£{c.commissionAmount.toLocaleString()}</p>
                <button
                  onClick={() => handleMarkPaid(c.id)}
                  disabled={markingPaid === c.id}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-all disabled:opacity-40"
                >
                  {markingPaid === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Mark Paid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Settings + Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white/70">Rep Emails</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/25">Max per rep per day:</span>
            {editingMaxEmails ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={maxEmailsInput}
                  onChange={e => setMaxEmailsInput(e.target.value)}
                  min={1}
                  max={500}
                  className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={handleSaveMaxEmails}
                  disabled={savingMaxEmails}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
                >
                  {savingMaxEmails ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Save
                </button>
                <button
                  onClick={() => { setEditingMaxEmails(false); setMaxEmailsInput(String(maxEmailsPerDay)); }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-white/30 hover:text-white/50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingMaxEmails(true)}
                className="text-xs font-bold text-white/60 bg-white/5 border border-white/8 rounded-lg px-2.5 py-1 hover:bg-white/10 transition-colors"
              >
                {maxEmailsPerDay}
              </button>
            )}
          </div>
        </div>

        {emails.length === 0 && <p className="text-sm text-white/25 py-4 text-center">No emails sent yet.</p>}
        <div className="space-y-1.5">
          {emails.map(email => (
            <div key={email.id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedEmailId(expandedEmailId === email.id ? null : email.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    email.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>{email.status}</span>
                  {email.repliedAt && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 bg-blue-500/20 text-blue-400">replied</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-white/60 truncate">{email.subject}</p>
                    <p className="text-[10px] text-white/25 truncate">{email.repName} → {email.recipientEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-[10px] text-white/20">
                    {email.sentAt ? new Date(email.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                  </span>
                  {expandedEmailId === email.id ? <ChevronUp className="w-3.5 h-3.5 text-white/20" /> : <ChevronDown className="w-3.5 h-3.5 text-white/20" />}
                </div>
              </button>
              {expandedEmailId === email.id && (
                <div className="px-4 pb-3 border-t border-white/5 pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-white/25">Business:</span> <span className="text-white/50">{email.businessName}</span></div>
                    <div><span className="text-white/25">Template:</span> <span className="text-white/50">{email.templateKey.replace('_', ' ')}</span></div>
                    <div><span className="text-white/25">Rep:</span> <span className="text-white/50">{email.repName}</span></div>
                    <div><span className="text-white/25">Time:</span> <span className="text-white/50">{email.sentAt ? new Date(email.sentAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span></div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-3">
                    <p className="text-[10px] text-white/25 mb-1">Body</p>
                    <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{email.body}</p>
                  </div>
                  {email.error && (
                    <p className="text-[10px] text-red-400">Error: {email.error}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prospect Replies */}
      {adminReplies.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-white/70 mb-3">Prospect Replies <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full ml-1">{adminReplies.length}</span></p>
          <div className="space-y-1.5">
            {adminReplies.map(reply => (
              <div key={reply.id} className="bg-blue-500/[0.03] border border-blue-500/10 rounded-xl px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-blue-300/70 truncate">{reply.subject}</p>
                    <p className="text-[10px] text-white/25 truncate">From: {reply.from}</p>
                  </div>
                  <span className="text-[10px] text-white/20 flex-shrink-0 ml-2">
                    {reply.receivedAt ? new Date(reply.receivedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                  </span>
                </div>
                {reply.textBody && (
                  <p className="text-xs text-white/40 mt-1.5 line-clamp-2 leading-relaxed">{reply.textBody}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All leads overview */}
      <div>
        <p className="text-sm font-semibold text-white/70 mb-3">All Leads</p>
        {leads.length === 0 && <p className="text-sm text-white/25 py-4 text-center">No leads logged yet.</p>}
        <div className="space-y-1.5">
          {leads.map(lead => (
            <div key={lead.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  lead.status === 'won' ? 'bg-emerald-500/20 text-emerald-400' :
                  lead.status === 'lost' ? 'bg-red-500/10 text-red-400/60' :
                  lead.status === 'call_booked' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-white/10 text-white/40'
                }`}>{lead.status.replace('_', ' ')}</span>
                <p className="text-sm text-white/60 truncate">{lead.businessName}</p>
              </div>
              <p className="text-xs text-white/30 flex-shrink-0 ml-2">{lead.repName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ───
export default function RepsPage() {
  const [tab, setTab] = useState<'recruitment' | 'management'>('recruitment');
  const [shortlist, setShortlist] = useState<Applicant[]>(() => {
    if (typeof window === 'undefined') return SEED_SHORTLIST;
    try {
      const saved = localStorage.getItem('crftd-shortlist');
      return saved ? (JSON.parse(saved) as Applicant[]) : SEED_SHORTLIST;
    } catch { return SEED_SHORTLIST; }
  });
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, BookingStatus>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', status: 'New' });

  useEffect(() => {
    localStorage.setItem('crftd-shortlist', JSON.stringify(shortlist));
  }, [shortlist]);

  useEffect(() => {
    if (shortlist.length > 0) {
      getBookingStatuses(shortlist.map((a) => a.email)).then(setBookingStatuses);
    }
  }, [shortlist]);

  function handleAddApplicant() {
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    const cfg = STATUS_CONFIG[addForm.status] ?? STATUS_CONFIG['New'];
    const id = `${addForm.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setShortlist((prev) => [...prev, { id, name: addForm.name.trim(), email: addForm.email.trim(), status: addForm.status, ...cfg }]);
    setAddForm({ name: '', email: '', status: 'New' });
    setShowAddForm(false);
  }

  function handleDeleteApplicant(id: string) {
    setShortlist((prev) => prev.filter((a) => a.id !== id));
  }

  function handleStatusChange(id: string, status: string) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['New'];
    setShortlist((prev) => prev.map((a) => a.id === id ? { ...a, status, ...cfg } : a));
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin
          </Link>
          <Link
            href="/admin/calendar"
            className="inline-flex items-center gap-2 text-xs text-sky-400/60 hover:text-sky-300 transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            Calendar view
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-rose-400/70 mb-2">Admin / Reps</p>
          <h1 className="text-3xl font-bold tracking-tight">Rep Management</h1>
          <p className="text-white/40 mt-2 text-sm max-w-lg">
            Recruit, onboard, and manage your commission-only sales reps.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/8 rounded-xl w-fit mb-8">
          {([['recruitment', 'Recruitment'], ['management', 'Active Reps']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'management' && <ManagementTab />}

        {tab === 'recruitment' && (<>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-4 text-center">
              <p className="text-xl font-black tracking-tight text-white">{s.value}</p>
              <p className="text-xs text-white/35 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CV Scoring Guide */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-rose-600/10 to-pink-600/5 border border-rose-500/15">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-rose-400/70 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-white mb-1">Quick CV scoring guide</h2>
              <p className="text-sm text-white/50 mb-3">Takes 2 minutes. Rank on three criteria:</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Sales / BD / hustle background', good: 'BDO, lettings, recruitment, market stall, freelance', bad: 'Lab tech, caregiver, warehouse, no experience' },
                  { label: 'Communication evidence', good: 'Wrote clearly in the application, customer-facing roles', bad: 'Bullet points copied from a template, typos in header' },
                  { label: 'Availability & realism', good: 'UK-based, not overcommitted, commission-ready', bad: 'Still in full-time education, already working 2 jobs' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
                    <p className="text-white/75 font-medium mb-1">{item.label}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-emerald-400/70">✓ {item.good}</span>
                      <span className="text-red-400/60">✗ {item.bad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>

        {/* Slot manager */}
        <SlotManager />

        {/* Shortlist tracker */}
        <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/8">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              Current Shortlist
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/80 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Applicant
            </button>
          </div>
          <p className="text-xs text-white/30 mb-4">Edit status inline, send emails, or remove applicants. Persists in your browser.</p>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-widest">Name</label>
                      <input
                        type="text"
                        value={addForm.name}
                        onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Full name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-widest">Email</label>
                      <input
                        type="email"
                        value={addForm.email}
                        onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="applicant@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-widest">Status</label>
                    <select
                      value={addForm.status}
                      onChange={(e) => setAddForm((p) => ({ ...p, status: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                    >
                      {STATUS_LABELS.map((s) => <option key={s} value={s} className="bg-[#0a0a0f]">{s}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddApplicant}
                      disabled={!addForm.name.trim() || !addForm.email.trim()}
                      className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add to shortlist
                    </button>
                    <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10">
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2 text-sm">
            {shortlist.length === 0 && (
              <p className="text-xs text-white/25 text-center py-4">No applicants yet. Add one above.</p>
            )}
            {shortlist.map((applicant) => (
              <ApplicantRow
                key={applicant.id}
                applicant={applicant}
                bookingStatus={bookingStatuses[applicant.email]}
                onDelete={() => handleDeleteApplicant(applicant.id)}
                onStatusChange={(status) => handleStatusChange(applicant.id, status)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/8 text-center">
          <p className="text-xs text-white/25">
            Commission is 15% of project value · Paid within 7 days of client payment · No retainer
          </p>
        </div>
        </>)}

      </div>
    </div>
  );
}
