'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, ClipboardList, Phone, UserCheck, AlertTriangle, CheckCircle2, ArrowLeft, Send, Loader2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { sendTrialTask } from '@/app/actions/sendTrialTask';
import { sendScreeningInvite } from '@/app/actions/sendScreeningInvite';

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
    time: '10 mins',
    color: 'bg-emerald-600/20 text-emerald-400',
    icon: <UserCheck className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-white/70 leading-relaxed">
        <p>Three things to send them immediately after saying yes:</p>
        <div className="space-y-2">
          {[
            { title: 'Onboarding welcome email', desc: 'Use the "Rep onboarding — welcome email" template in Admin → Emails → Rep Templates', accent: 'text-purple-400' },
            { title: 'Google Sheet access', desc: 'Share the leads tracking sheet — columns: Business Name, Contact, Phone/Email, Date Called, Outcome, Next Action', accent: 'text-sky-400' },
            { title: 'Call script PDF', desc: 'Print or send rep-call-script.html from /public/social-posts/', accent: 'text-amber-400' },
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
        <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 mt-1">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Set expectations clearly</p>
          <p className="text-white/55 text-xs">Commission is 15%, paid within 7 days of client payment clearing. No retainer, no salary. Make sure they understand this before they start.</p>
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

// ─── Shortlist Data ───
interface Applicant {
  name: string;
  email: string;
  status: string;
  color: string;
  canSend: boolean;
  canBookCall?: boolean;
}

const shortlist: Applicant[] = [
  { name: 'Shruti Boodhun', email: 'shrutiboodhun12@outlook.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Nicol', email: 'nicol1@live.co.uk', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Brittany Parker', email: 'brittany.parker24@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Thlia Xavier', email: 'thlia.xavier@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Mia Msembe', email: 'miamesembe@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Trisha', email: 'trisha160702@gmail.com', status: 'Book Screening Call', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', canSend: false, canBookCall: true },
  { name: 'James Owain', email: 'Jamesowain234@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Subby', email: 'subby487@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Ebalo Shabani', email: 'ebaloshabani010@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Obinna Eze Elijah', email: 'obiezeelijah@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Gracie Tamplin', email: 'gracie.tamplin@icloud.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Kujembola Mathew', email: 'kujemath97@gmail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Nieah Mundle', email: 'Rita98_2020@yahoo.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'John Williams', email: 'jvw0503007_qwt@indeedemail.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Tapi Mandaza', email: 'Tapiwa.mandaza@outlook.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Chris Cox', email: 'chief2002@outlook.com', status: 'Trial task sent', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', canSend: false },
  { name: 'Joane Cabrera', email: 'joanecabrera10@gmail.com', status: 'Pass', color: 'text-red-400 bg-red-500/10 border-red-500/20', canSend: false },
  { name: 'Sam McLoughlin', email: 'Sam.mcloughlin16@gmail.com', status: 'Pass', color: 'text-red-400 bg-red-500/10 border-red-500/20', canSend: false },
];

// ─── Applicant Row ───
function ApplicantRow({ applicant }: { applicant: Applicant }) {
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
    const result = await sendScreeningInvite(applicant.name.split(' ')[0], email);
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
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-white/70 font-medium truncate">{applicant.name}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${applicant.color}`}>{applicant.status}</span>
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
            callStatus === 'sent' ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> Invite Sent
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
                {openPanel === 'task' ? 'Send trial task to' : 'Send screening invite to'}{' '}
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
                  : 'Subject: "CrftdWeb — Let\'s book a call"'}
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
  { label: 'Commission', value: '15%' },
];

// ─── Page ───
export default function RepsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Admin
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-rose-400/70 mb-2">Admin / Recruitment</p>
          <h1 className="text-3xl font-bold tracking-tight">Rep Recruitment Process</h1>
          <p className="text-white/40 mt-2 text-sm max-w-lg">
            End-to-end process for hiring commission-only sales reps. From CV to first call in under 45 minutes of your time.
          </p>
        </div>

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

        {/* Shortlist tracker */}
        <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/8">
          <h3 className="text-sm font-semibold text-white/70 mb-1 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-400" />
            Current Shortlist
          </h3>
          <p className="text-xs text-white/30 mb-4">Click "Send Trial Task" to fire the email directly from here.</p>
          <div className="space-y-2 text-sm">
            {shortlist.map((applicant) => (
              <ApplicantRow key={applicant.name} applicant={applicant} />
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/8 text-center">
          <p className="text-xs text-white/25">
            Commission is 15% of project value · Paid within 7 days of client payment · No retainer
          </p>
        </div>

      </div>
    </div>
  );
}
