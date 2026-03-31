'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp, Mail, RefreshCw, UserCheck, Handshake, Users, Send, Eye, Loader2, CheckCircle2, Sparkles, PenLine } from 'lucide-react';
import { sendTrialTask } from '@/app/actions/sendTrialTask';
import { sendBookingLink } from '@/app/actions/sendBookingLink';
import { sendLoginDetails } from '@/app/actions/sendLoginDetails';
import { sendOverqualified } from '@/app/actions/sendOverqualified';

// ─── Email preview HTML builders (client-side mirrors of server actions) ───
function buildTrialTaskHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>CrftdWeb — Trial Task</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 20px;font-size:16px;color:#111;font-weight:600;">Hi ${name},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Thanks for applying — your background looks interesting.</p>
        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">Before we book a call, I’d like to see how you think.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr><td style="background:#0a0a0a;border-radius:10px;padding:20px 24px;">
            <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Your Task</p>
            <p style="margin:0;font-size:15px;color:#fff;line-height:1.7;">Find <strong>5 UK businesses</strong> with a bad website and write <strong>one specific sentence</strong> for each explaining why it needs a redesign.</p>
          </td></tr>
        </table>
        <p style="margin:0 0 12px;font-size:14px;color:#888;line-height:1.7;">Not just <em>“it looks old”</em> — something specific like: <em>“No mobile version — the site breaks on any phone”</em></p>
        <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;">No formatting required — just reply to this email with your list within <strong style="color:#111;">48 hours</strong>.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
        <p style="margin:3px 0 0;font-size:13px;color:#999;">CrftdWeb &middot; crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function buildBookingLinkHtml(name: string): string {
  const fakeUrl = 'https://crftdweb.com/book/preview-link';
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>CrftdWeb — Book your screening call</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 20px;font-size:16px;color:#111;font-weight:600;">Hi ${name},</p>

        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">I’d like to book a quick <strong style="color:#111;">15-minute call</strong> to have a chat. Use the link below to pick a time that works for you:</p>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
          <tr><td style="background:#111;border-radius:8px;">
            <a href="${fakeUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Pick a time &rarr;</a>
          </td></tr>
        </table>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">The link shows my available slots — takes a few seconds to book. If none of the times work, just reply and we’ll sort something.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
        <p style="margin:3px 0 0;font-size:13px;color:#999;">CrftdWeb &middot; crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function buildLoginDetailsHtml(name: string, repEmail: string, tempPassword: string): string {
  const firstName = name.split(' ')[0];
  const loginUrl = 'https://crftdweb.com/rep/signin';
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
          <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;" />
        </td></tr>
        <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
          <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Great news — you've been approved as a CrftdWeb sales rep. Welcome to the team.</p>
          <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">Your rep portal is ready. Log in with the credentials below, then complete the training modules before you start outreach.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            <tr><td style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:10px;padding:20px 24px;">
              <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;">Your Login</p>
              <p style="margin:0 0 6px;font-size:14px;color:#444;"><strong style="color:#111;">Email:</strong> ${repEmail}</p>
              <p style="margin:0;font-size:14px;color:#444;"><strong style="color:#111;">Temp password:</strong> <span style="font-family:monospace;font-size:15px;letter-spacing:1px;color:#111;">${tempPassword}</span></p>
            </td></tr>
          </table>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            <tr><td style="background:#111;border-radius:8px;">
              <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Log in to your portal &rarr;</a>
            </td></tr>
          </table>
          <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">Change your password after your first login.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
          <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
          <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildOverqualifiedHtml(name: string): string {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
          <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;" />
        </td></tr>
        <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Thanks for applying — I appreciate you taking the time.</p>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">We had a high volume of applicants this round and unfortunately aren't able to move everyone forward. It's not a reflection of your ability — we just had some tough decisions to make.</p>
          <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7;">Thanks again and best of luck with what's next.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
          <p style="margin:0;font-size:15px;color:#111;font-weight:700;">CrftdWeb</p>
          <p style="margin:3px 0 0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const EMAIL_SEND_TEMPLATES = [
  {
    id: 'trial-task',
    label: 'Trial Task',
    subject: 'CrftdWeb — Quick task before we chat',
    description: 'Sent after a promising application — asks them to find 5 bad UK websites.',
    color: 'border-purple-500/30 bg-purple-500/5',
    activeColor: 'border-purple-500 bg-purple-500/15',
    labelColor: 'text-purple-400',
  },
  {
    id: 'booking-link',
    label: 'Booking Link',
    subject: 'CrftdWeb — Book your screening call',
    description: 'Sent after a good trial task response — includes a unique booking link.',
    color: 'border-emerald-500/30 bg-emerald-500/5',
    activeColor: 'border-emerald-500 bg-emerald-500/15',
    labelColor: 'text-emerald-400',
  },
  {
    id: 'login-details',
    label: 'Login Details',
    subject: 'Welcome to CrftdWeb!',
    description: 'Sends approved rep their portal login credentials and a link to sign in.',
    color: 'border-sky-500/30 bg-sky-500/5',
    activeColor: 'border-sky-500 bg-sky-500/15',
    labelColor: 'text-sky-400',
  },
  {
    id: 'overqualified',
    label: 'Decline',
    subject: 'Re: CrftdWeb rep application',
    description: 'Polite no — for applicants you\'re not moving forward with at this stage.',
    color: 'border-orange-500/30 bg-orange-500/5',
    activeColor: 'border-orange-500 bg-orange-500/15',
    labelColor: 'text-orange-400',
  },
] as const;

type SendTemplateId = typeof EMAIL_SEND_TEMPLATES[number]['id'];

// ─── Compose Panel ─────────────────────────────────────────────────────────
function buildComposePreviewHtml(body: string, subject: string): string {
  const lines = body.split('\n').map((line) =>
    line.trim() === '' ? '<br/>' : `<p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.7;">${line}</p>`
  ).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${subject || 'Email preview'}</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        ${lines || '<p style="margin:0;font-size:15px;color:#aaa;font-style:italic;">Your message will appear here…</p>'}
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function ComposePanel() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [context, setContext] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'streaming' | 'done' | 'error'>('idle');
  const [aiError, setAiError] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const handleAISuggest = useCallback(async () => {
    if (!subject.trim() && !context.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setAiStatus('streaming');
    setAiError('');
    setBody('');

    try {
      const res = await fetch('/api/admin/compose-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, context }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => '');
        setAiError(errText || `Request failed (${res.status})`);
        setAiStatus('error');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setBody(accumulated);
      }

      setAiStatus('done');
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setAiError((e as Error).message || 'Unknown error');
        setAiStatus('error');
      }
    }
  }, [to, subject, context]);

  async function handleSend() {
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    setSendStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/send-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: to.trim(), subject: subject.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSendStatus('sent');
        setTimeout(() => { setSendStatus('idle'); setTo(''); setSubject(''); setBody(''); setContext(''); setAiStatus('idle'); }, 3000);
      } else {
        setSendStatus('error');
        setErrorMsg(data.error ?? 'Failed to send');
      }
    } catch {
      setSendStatus('error');
      setErrorMsg('Network error — please try again');
    }
  }

  const canSuggest = (subject.trim().length > 0 || context.trim().length > 0) && aiStatus !== 'streaming';
  const canSend = to.trim() && subject.trim() && body.trim() && sendStatus !== 'sending';

  return (
    <div className="space-y-5">
      {/* To */}
      <div>
        <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">To</label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="recipient@email.com"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Following up — your website"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* AI context */}
      <div>
        <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Context for AI <span className="text-white/20 normal-case tracking-normal">(optional — what's the email about?)</span></label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. follow-up after cold call, they seemed interested but went quiet"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* AI suggest button */}
      <button
        onClick={handleAISuggest}
        disabled={!canSuggest}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        {aiStatus === 'streaming' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Sparkles size={14} />
        )}
        {aiStatus === 'streaming' ? 'Writing…' : (aiStatus === 'done' || aiStatus === 'error') ? 'Regenerate' : 'AI Suggest'}
      </button>
      {aiStatus === 'error' && aiError && (
        <p className="text-xs text-red-400/80 mt-1">{aiError}</p>
      )}

      {/* Body */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[10px] text-white/30 uppercase tracking-widest">Message</label>
          {aiStatus === 'done' && (
            <span className="text-[10px] text-purple-400/60 flex items-center gap-1"><Sparkles size={9} /> AI generated — edit freely</span>
          )}
        </div>
        <textarea
          value={body}
          onChange={(e) => { setBody(e.target.value); if (aiStatus === 'done' || aiStatus === 'error') { setAiStatus('idle'); setAiError(''); } }}
          placeholder="Write your message here, or use AI Suggest above…"
          rows={10}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed font-sans"
        />
      </div>

      {/* Preview toggle */}
      <div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          {showPreview ? 'Hide preview' : 'Preview email'}
        </button>
        <AnimatePresence>
          {showPreview && (
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
                  <span className="text-[10px] text-white/25 font-mono ml-2">email preview — {subject || 'no subject'}</span>
                </div>
                <iframe
                  srcDoc={buildComposePreviewHtml(body, subject)}
                  className="w-full bg-white"
                  style={{ height: '540px', border: 'none' }}
                  title="Email preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Send */}
      {sendStatus === 'sent' ? (
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
          <CheckCircle2 size={16} /> Email sent!
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {sendStatus === 'sending' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {sendStatus === 'sending' ? 'Sending…' : 'Send Email'}
          </button>
          {sendStatus === 'error' && <p className="text-xs text-red-400">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Send Panel ───
function SendPanel() {
  const [templateId, setTemplateId] = useState<SendTemplateId>('trial-task');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const firstName = name.split(' ')[0] || 'there';
  const previewHtml = templateId === 'trial-task'
    ? buildTrialTaskHtml(firstName || 'Hi')
    : templateId === 'booking-link'
    ? buildBookingLinkHtml(firstName || 'Hi')
    : templateId === 'login-details'
    ? buildLoginDetailsHtml(firstName || 'Hi', email || 'rep@email.com', tempPassword || 'TempPass!7')
    : buildOverqualifiedHtml(firstName || 'Hi');

  const selectedTemplate = EMAIL_SEND_TEMPLATES.find((t) => t.id === templateId)!;

  async function handleSend() {
    if (!name.trim() || !email.trim()) return;
    if (templateId === 'login-details' && !tempPassword.trim()) return;
    setSendStatus('sending');
    setErrorMsg('');
    try {
      let result: { success: boolean; error?: string };
      if (templateId === 'trial-task') {
        result = await sendTrialTask(firstName, email.trim());
      } else if (templateId === 'booking-link') {
        result = await sendBookingLink(firstName, email.trim());
      } else if (templateId === 'login-details') {
        result = await sendLoginDetails(name.trim(), email.trim(), tempPassword.trim());
      } else {
        result = await sendOverqualified(name.trim(), email.trim());
      }
      if (result.success) {
        setSendStatus('sent');
        setTimeout(() => { setSendStatus('idle'); setName(''); setEmail(''); setTempPassword(''); }, 3000);
      } else {
        setSendStatus('error');
        setErrorMsg(result.error ?? 'Failed to send');
      }
    } catch {
      setSendStatus('error');
      setErrorMsg('Network error — please try again');
    }
  }

  return (
    <div className="space-y-6">
      {/* Template picker */}
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Select Template</p>
        <div className="grid grid-cols-2 gap-3">
          {EMAIL_SEND_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTemplateId(t.id); setSendStatus('idle'); }}
              className={`text-left p-4 rounded-xl border transition-all ${
                templateId === t.id ? t.activeColor : t.color + ' opacity-60 hover:opacity-100'
              }`}
            >
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${t.labelColor}`}>{t.label}</p>
              <p className="text-xs text-white/50 leading-relaxed">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recipient */}
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Recipient</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-widest">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shruti"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="applicant@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>
        <p className="text-xs text-white/25 mt-2">Subject: <span className="text-white/40 italic">{selectedTemplate.subject}</span></p>
        {templateId === 'login-details' && (
          <div className="mt-3">
            <label className="block text-[10px] text-white/30 mb-1 uppercase tracking-widest">Temp Password</label>
            <input
              type="text"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="e.g. Welcome123!7"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 font-mono"
            />
            <p className="text-[10px] text-white/20 mt-1">This will appear in the email exactly as typed.</p>
          </div>
        )}
      </div>

      {/* Preview toggle */}
      <div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          {showPreview ? 'Hide preview' : 'Preview email'}
        </button>

        <AnimatePresence>
          {showPreview && (
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
                  <span className="text-[10px] text-white/25 font-mono ml-2">email preview — {selectedTemplate.subject}</span>
                </div>
                <iframe
                  srcDoc={previewHtml}
                  className="w-full bg-white"
                  style={{ height: '540px', border: 'none' }}
                  title="Email preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Send button */}
      {sendStatus === 'sent' ? (
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4" /> Email sent successfully!
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={handleSend}
            disabled={!name.trim() || !email.trim() || sendStatus === 'sending'}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {sendStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sendStatus === 'sending' ? 'Sending…' : `Send ${selectedTemplate.label} Email`}
          </button>
          {sendStatus === 'error' && (
            <p className="text-xs text-red-400">{errorMsg}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Types ───
interface Template {
  id: string;
  label: string;
  subject: string;
  body: string;
}

interface Category {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  templates: Template[];
}

// ─── Template Data ───
const categories: Category[] = [
  {
    id: 'cold-outreach',
    icon: <Mail className="w-5 h-5" />,
    title: 'Cold Outreach',
    description: 'First contact with a business you have identified as a prospect.',
    color: 'from-violet-600/20 to-purple-600/10 border-violet-500/20',
    templates: [
      {
        id: 'cold-1',
        label: 'LinkedIn DM — Honest opener',
        subject: 'N/A (DM)',
        body: `Hi [Name],

I came across [Business Name] and had a look at your site.

[One specific, genuine observation about something that could be improved — e.g. "Your homepage takes 8 seconds to load on mobile" or "There's no clear CTA above the fold"]

I build custom websites for [their industry] businesses that fix exactly this — usually in under two weeks.

Worth a quick chat?

— Obi
CrftdWeb`,
      },
      {
        id: 'cold-2',
        label: 'Cold Email — Problem-first',
        subject: 'Your website — quick thought',
        body: `Hi [Name],

I was looking for [type of business] in [location/niche] and came across [Business Name].

Your [service/product] looks solid, but I noticed your website might be costing you enquiries — [specific issue: slow load, no mobile optimisation, weak CTA, no trust signals, etc.].

I'm Obi, and I run CrftdWeb — we build fast, conversion-focused websites for businesses like yours. We've helped [similar business type] increase leads by [X%] in [timeframe].

I've put together a few quick ideas for your site — would it be useful if I sent them over?

No pitch, just value first.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'cold-3',
        label: 'Cold Email — Compliment + gap',
        subject: "Loved what you're doing at [Business Name]",
        body: `Hi [Name],

I came across [Business Name] — what you're doing in [their niche] is genuinely impressive.

I did notice one thing though: your website doesn't seem to reflect the quality of what you offer. [Specific gap — e.g. "The mobile experience is rough" or "There's no social proof visible to a first-time visitor"]. For a business at your level, that's likely losing you clients who check the site and bounce.

I'm Obi — I run CrftdWeb. We build bespoke, high-performance websites for ambitious businesses. 14-day delivery, custom-coded, no templates.

Happy to do a free 10-min audit of your site if that's useful.

— Obi
crftdweb.com`,
      },
    ],
  },
  {
    id: 'follow-up',
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Follow-Up',
    description: 'Chasing leads who went quiet after initial interest or a quote.',
    color: 'from-sky-600/20 to-blue-600/10 border-sky-500/20',
    templates: [
      {
        id: 'follow-1',
        label: 'Follow-up #1 — Soft nudge (3 days)',
        subject: 'Re: [original subject]',
        body: `Hi [Name],

Just circling back on this — did you get a chance to look it over?

Happy to jump on a 15-min call this week if that makes it easier to decide.

— Obi`,
      },
      {
        id: 'follow-2',
        label: 'Follow-up #2 — Add value (7 days)',
        subject: 'Something I noticed about [Business Name]',
        body: `Hi [Name],

While I had your site open, I noticed [one more specific issue or opportunity you spotted].

Just thought it was worth flagging — it's an easy fix and could make a real difference to conversions.

Still happy to chat if the timing's right. No pressure either way.

— Obi
CrftdWeb`,
      },
      {
        id: 'follow-3',
        label: 'Follow-up #3 — Break-up (14 days)',
        subject: 'Closing the loop — [Business Name]',
        body: `Hi [Name],

I'll stop following up after this one — I don't want to be that person in your inbox.

If the timing ever becomes right for a new website, I'd love to help. Our calendar fills up a few weeks in advance so reach out whenever you're ready.

Wishing you well with [business name].

— Obi
CrftdWeb | crftdweb.com`,
      },
    ],
  },
  {
    id: 'proposals',
    icon: <Handshake className="w-5 h-5" />,
    title: 'Proposals & Closing',
    description: 'Sending quotes, handling objections, and getting contracts signed.',
    color: 'from-emerald-600/20 to-green-600/10 border-emerald-500/20',
    templates: [
      {
        id: 'proposal-1',
        label: 'Proposal delivery',
        subject: 'Your CrftdWeb Proposal — [Business Name]',
        body: `Hi [Name],

Great speaking with you — here's everything we discussed.

─────────────────────────
PROJECT SUMMARY
─────────────────────────
Scope: [e.g. 6-page business website, custom-coded in Next.js]
Timeline: [X] weeks from deposit
Investment: £[amount]
Includes: [brief bullet list]

─────────────────────────
NEXT STEPS
─────────────────────────
1. Reply to confirm you're happy to proceed
2. I'll send the contract and invoice for the 50% deposit
3. We kick off within 48 hours of payment

This proposal is valid for 7 days.

Any questions at all, just reply here or message me directly.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'proposal-2',
        label: 'Objection — "Too expensive"',
        subject: 'Re: Proposal — [Business Name]',
        body: `Hi [Name],

Totally understand — budget is always a consideration.

A couple of options:

1. We can scope down to the essentials for phase one and build out later. I can put together a leaner version at [lower price].

2. We can split the payment into 3 milestones to spread the cost.

Worth noting: a website that converts even 1 extra client per month at [their avg deal size] pays for itself in [X months].

Let me know which direction feels right and we'll make it work.

— Obi`,
      },
      {
        id: 'proposal-3',
        label: 'Objection — "Not the right time"',
        subject: 'Re: [Business Name] — timing',
        body: `Hi [Name],

No problem at all — timing matters.

One thing worth considering: the businesses I work with that see the biggest results are usually the ones that invest in their site before the busy season, not during it. Building now means you're ready to capture demand when it hits.

That said, I'd rather you move when it feels right. If [month/quarter] works better, I'm happy to hold a slot. Just let me know.

— Obi
CrftdWeb`,
      },
    ],
  },
  {
    id: 'rep-templates',
    icon: <Users className="w-5 h-5" />,
    title: 'Rep Templates',
    description: 'Emails fired from admin@crftdweb.com on behalf of reps after calls and conversations.',
    color: 'from-rose-600/20 to-pink-600/10 border-rose-500/20',
    templates: [
      {
        id: 'rep-1',
        label: 'Post-cold-call — prospect showed interest',
        subject: 'Following up — [Business Name]',
        body: `Hi [Name],

Great speaking with you earlier — as promised, here's a quick note from the team at CrftdWeb.

We build fast, custom websites for businesses like yours — no templates, no page builders, just clean code built to convert.

I'd love to show you a few examples relevant to [their industry] and talk through what we could do for [Business Name].

Would a 15-minute call this week work for you? You can reply here or book directly: [Calendly link]

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'rep-2',
        label: 'Post-discovery call — recap + next steps',
        subject: 'Great speaking with you — next steps for [Business Name]',
        body: `Hi [Name],

Really enjoyed our call today — you've clearly built something solid with [Business Name].

Here's a quick recap of what we covered:

• [Pain point 1 they mentioned]
• [Pain point 2 they mentioned]
• Goal: [what they want to achieve]

Based on that, I'll put together a tailored proposal and send it over within 24–48 hours.

In the meantime, if anything else comes to mind feel free to reply here.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'rep-3',
        label: 'Prospect went cold after discovery call',
        subject: 'Re: [Business Name] — just checking in',
        body: `Hi [Name],

I know things get busy — just wanted to check in after our call.

I still think there's a real opportunity to fix [specific issue discussed] and get [Business Name] converting better online.

Happy to pick up where we left off whenever the timing is right. Even if that's a few months from now, just reply and we'll get moving quickly.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'rep-4',
        label: 'Rep onboarding — welcome email',
        subject: 'Welcome to CrftdWeb — everything you need to get started',
        body: `Hi [Rep Name],

Welcome aboard — really glad to have you on the team.

Here's everything you need to get started:

─────────────────────────
YOUR ROLE
─────────────────────────
You find businesses that need a better website, start the conversation, and book them in for a call with me. That's it — I handle everything after the call.

─────────────────────────
COMMISSION
─────────────────────────
15% of the project value, paid within 7 days of client payment clearing.

Examples:
• £850 landing page → you earn £127
• £3,000 business site → you earn £450
• £10,000 web app → you earn £1,500

─────────────────────────
HOW TO LOG LEADS
─────────────────────────
Add every prospect to the shared Google Sheet: [Sheet link]
Columns: Business Name, Contact Name, Phone/Email, Date Called, Outcome, Next Action

─────────────────────────
YOUR CALL SCRIPT
─────────────────────────
I've sent your call script separately as a PDF. Print it and keep it next to you.

─────────────────────────
TO GET STARTED
─────────────────────────
Aim for 10 calls on your first day. Don't overthink it — follow the script and focus on booking calls, not selling websites.

Any questions, WhatsApp me directly: [Your number]

Let's go.

— Obi
CrftdWeb`,
      },
      {
        id: 'rep-5',
        label: 'Rep applicant — trial task',
        subject: 'CrftdWeb — Quick task before we chat',
        body: `Hi [Name],

Thanks for applying — your background looks interesting.

Before we book a call, I'd like to see how you think.

Your task: Find 5 UK businesses with a bad website and write one sentence for each explaining why it needs a redesign.

That's it. No formatting required — just reply to this email with your list within 48 hours.

Looking forward to seeing what you come back with.

— Obi
CrftdWeb`,
      },
    ],
  },
  {
    id: 'referrals',
    icon: <UserCheck className="w-5 h-5" />,
    title: 'Referrals & Re-Engagement',
    description: 'Asking past clients for referrals and re-engaging cold contacts.',
    color: 'from-amber-600/20 to-orange-600/10 border-amber-500/20',
    templates: [
      {
        id: 'referral-1',
        label: 'Ask for referral — post-launch',
        subject: 'Quick favour — [Business Name]',
        body: `Hi [Name],

Really glad we got the site live — it's been a great project.

I wanted to ask: do you know anyone else who might benefit from what we built for you? A fellow business owner with an outdated site, or someone launching something new?

I don't run ads — almost all of my work comes from word of mouth, so a recommendation from you genuinely means a lot.

If anyone comes to mind, feel free to send them my way: obi@crftdweb.com

Thank you again for trusting me with this.

— Obi`,
      },
      {
        id: 'referral-2',
        label: 'Re-engage past contact (3–6 months later)',
        subject: 'Checking in — [Business Name]',
        body: `Hi [Name],

Hope things are going well with [business name].

I was thinking about our conversation a few months back — has anything changed on the website front? Lots of businesses I've spoken to recently are finding their current site is holding them back as they grow.

If the timing is better now, I'd love to revisit the conversation. Happy to do a quick updated audit — no charge.

— Obi
CrftdWeb | crftdweb.com`,
      },
      {
        id: 'referral-3',
        label: 'Ask for a testimonial',
        subject: 'One small ask — [Business Name]',
        body: `Hi [Name],

Hope the site is performing well — would love to hear how things are going since launch.

I have a small favour to ask: would you be willing to leave a short testimonial? Even 2–3 sentences about your experience and any results you've seen would genuinely help me win work with similar businesses.

You can send it back as a reply and I'll format it up, or drop it on Google if easier.

Really appreciate it.

— Obi`,
      },
    ],
  },
];

// ─── Copy Button ───
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/60 hover:text-white"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ─── Template Card ───
function TemplateCard({ template }: { template: Template }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div>
          <p className="text-sm font-medium text-white/90">{template.label}</p>
          {template.subject !== 'N/A (DM)' && (
            <p className="text-xs text-white/40 mt-0.5">Subject: <span className="text-white/60 italic">{template.subject}</span></p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
        )}
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
            <div className="px-5 pb-5 border-t border-white/8">
              <div className="flex justify-end mt-3 mb-3">
                <CopyButton text={template.body} />
              </div>
              <pre className="text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">
                {template.body}
              </pre>
              <p className="text-xs text-white/25 mt-3">Replace all <span className="text-amber-400/60">[bracketed placeholders]</span> before sending.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Category Section ───
function CategorySection({ category }: { category: Category }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <div className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br border ${category.color} mb-4`}>
        <div className="text-white/60 mt-0.5">{category.icon}</div>
        <div>
          <h2 className="text-base font-semibold text-white">{category.title}</h2>
          <p className="text-sm text-white/50 mt-0.5">{category.description}</p>
        </div>
      </div>
      {category.templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </motion.div>
  );
}

// ─── Page ───
export default function EmailTemplatesPage() {
  const [pageTab, setPageTab] = useState<'templates' | 'send' | 'compose'>('send');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayed = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-purple-400/70 mb-2">Admin / Outreach</p>
          <h1 className="text-3xl font-bold tracking-tight">Email</h1>
          <p className="text-white/40 mt-2 text-sm max-w-lg">
            Preview and send branded emails, or browse copy templates for manual outreach.
          </p>
        </div>

        {/* Top tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/8 rounded-xl w-fit mb-8">
          {([['send', 'Send Email'], ['compose', 'Compose'], ['templates', 'Copy Templates']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPageTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pageTab === key ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {pageTab === 'send' && (
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <SendPanel />
          </div>
        )}

        {pageTab === 'compose' && (
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <PenLine size={16} className="text-purple-400" />
              <p className="text-sm font-semibold text-white/80">Free Compose</p>
              <span className="text-[10px] text-white/30 ml-1">Send any email with optional AI assist</span>
            </div>
            <ComposePanel />
          </div>
        )}

        {pageTab === 'templates' && (<>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
              activeCategory === null
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                activeCategory === c.id
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

          {/* Template sections */}
          <div className="space-y-10">
            {displayed.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-16 pt-8 border-t border-white/8 text-center">
            <p className="text-xs text-white/25">
              These templates are a starting point. Personalisation is what gets replies.
            </p>
          </div>
        </>)}

      </div>
    </div>
  );
}
