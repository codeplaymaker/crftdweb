'use client';

import { useState, useEffect } from 'react';
import { RepLead, RepEmailLog, RepEmailReply, getLeadEmails, getLeadReplies } from '@/lib/firebase/firestore';
import { EMAIL_TEMPLATES, EmailTemplateKey } from '@/lib/types/repEmail';
import { getAuth } from 'firebase/auth';
import { X, Send, Loader2, Mail, ChevronDown, ChevronUp, Check, AlertCircle, Reply, Inbox } from 'lucide-react';

interface EmailComposeModalProps {
  lead: RepLead;
  repName: string;
  repEmail: string;
  onClose: () => void;
  onSent: () => void;
}

function fillTemplate(text: string, vars: Record<string, string>): string {
  return text
    .replace(/\{\{contactName\}\}/g, vars.contactName || 'there')
    .replace(/\{\{repName\}\}/g, vars.repName || '')
    .replace(/\{\{businessName\}\}/g, vars.businessName || '');
}

export default function EmailComposeModal({ lead, repName, repEmail, onClose, onSent }: EmailComposeModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateKey>('follow_up_no_reply');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Email history
  const [history, setHistory] = useState<RepEmailLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [markingReplied, setMarkingReplied] = useState<string | null>(null);

  // Inbound replies
  const [replies, setReplies] = useState<RepEmailReply[]>([]);
  const [expandedReplyId, setExpandedReplyId] = useState<string | null>(null);

  const vars = {
    contactName: lead.contactName.split(' ')[0],
    repName,
    businessName: lead.businessName,
  };

  // Load template on selection
  useEffect(() => {
    if (selectedTemplate === 'custom') {
      setSubject('');
      setBody('');
      return;
    }
    const tmpl = EMAIL_TEMPLATES.find(t => t.key === selectedTemplate);
    if (tmpl) {
      setSubject(fillTemplate(tmpl.subject, vars));
      setBody(fillTemplate(tmpl.body, vars));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  // Load email history + replies
  useEffect(() => {
    Promise.all([
      getLeadEmails(lead.id, lead.repId),
      getLeadReplies(lead.id, lead.repId),
    ])
      .then(([emails, inbound]) => {
        setHistory(emails);
        setReplies(inbound);
      })
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [lead.id, lead.repId]);

  async function handleMarkReplied(emailId: string) {
    setMarkingReplied(emailId);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch('/api/rep/email/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emailId }),
      });
      if (res.ok) {
        setHistory(prev => prev.map(e =>
          e.id === emailId
            ? { ...e, repliedAt: { toDate: () => new Date() } as never }
            : e
        ));
      }
    } catch {
      // silent fail
    } finally {
      setMarkingReplied(null);
    }
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required');
      return;
    }
    if (!lead.contactEmail) {
      setError('This lead has no email address');
      return;
    }

    setSending(true);
    setError('');

    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch('/api/rep/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leadId: lead.id,
          recipientEmail: lead.contactEmail,
          subject,
          body,
          templateKey: selectedTemplate,
          repName,
          repEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send email');
        return;
      }

      setSent(true);
      setTimeout(() => {
        onSent();
        onClose();
      }, 1500);
    } catch {
      setError('Network error — please try again');
    } finally {
      setSending(false);
    }
  }

  // Success screen
  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-lg font-semibold text-white">Email sent</p>
          <p className="text-sm text-white/40">Follow-up sent to {lead.contactEmail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-white">Follow-up Email</p>
              <p className="text-xs text-white/30 mt-0.5">{lead.businessName} · {lead.contactEmail || 'No email'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* No email warning */}
          {!lead.contactEmail && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-400">This lead has no email address. Add one first via Edit.</p>
            </div>
          )}

          {/* Template picker */}
          <div>
            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Template</label>
            <div className="flex flex-wrap gap-1.5">
              {[...EMAIL_TEMPLATES, { key: 'custom' as EmailTemplateKey, label: 'Custom' }].map(t => (
                <button
                  key={t.key}
                  onClick={() => setSelectedTemplate(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedTemplate === t.key
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/10 hover:text-white/60'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* From */}
          <div>
            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">From</label>
            <p className="text-xs text-white/50 bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2.5">
              {repName} at CrftdWeb &lt;hello@crftdweb.com&gt;
            </p>
          </div>

          {/* To */}
          <div>
            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">To</label>
            <p className="text-xs text-white/50 bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2.5">
              {lead.contactName} &lt;{lead.contactEmail || '—'}&gt;
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Email subject line"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={10}
              placeholder="Type your message..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}

          {/* Email thread */}
          {!loadingHistory && (history.length > 0 || replies.length > 0) && (() => {
            // Merge sent emails + inbound replies into a single timeline
            type ThreadItem =
              | { kind: 'sent'; data: RepEmailLog; time: Date }
              | { kind: 'reply'; data: RepEmailReply; time: Date };

            const thread: ThreadItem[] = [
              ...history.map(e => ({
                kind: 'sent' as const,
                data: e,
                time: e.sentAt?.toDate ? new Date(e.sentAt.toDate()) : new Date(0),
              })),
              ...replies.map(r => ({
                kind: 'reply' as const,
                data: r,
                time: r.receivedAt?.toDate ? new Date(r.receivedAt.toDate()) : new Date(0),
              })),
            ].sort((a, b) => b.time.getTime() - a.time.getTime());

            return (
              <div className="border-t border-white/6 pt-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors"
                >
                  {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Conversation ({thread.length})
                  {replies.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                      {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </button>
                {showHistory && (
                  <div className="mt-3 space-y-2">
                    {thread.map(item => {
                      if (item.kind === 'reply') {
                        const r = item.data;
                        const isExpanded = expandedReplyId === r.id;
                        return (
                          <div key={r.id} className="bg-blue-500/[0.04] border border-blue-500/10 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedReplyId(isExpanded ? null : r.id)}
                              className="w-full p-3 text-left"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Inbox className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                  <p className="text-xs font-medium text-blue-300 truncate">{r.subject}</p>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex-shrink-0">
                                  reply
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-[10px] text-white/25">
                                  From: {r.from} · {item.time.toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                  })}
                                </p>
                                {isExpanded ? <ChevronUp className="w-3 h-3 text-white/20" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
                              </div>
                            </button>
                            {isExpanded && (
                              <div className="px-3 pb-3 border-t border-blue-500/10 pt-2">
                                <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">
                                  {r.textBody || (r.htmlBody ? <span dangerouslySetInnerHTML={{ __html: r.htmlBody }} /> : '(No text content)')}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Sent email
                      const email = item.data;
                      return (
                        <div key={email.id} className="bg-white/[0.03] border border-white/6 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <Send className="w-3 h-3 text-white/20 flex-shrink-0" />
                              <p className="text-xs font-medium text-white/60 truncate">{email.subject}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {email.repliedAt && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                                  <Reply className="w-2.5 h-2.5" />replied
                                </span>
                              )}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                email.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {email.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] text-white/20">
                              {email.sentAt?.toDate ? new Date(email.sentAt.toDate()).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                              }) : '—'}
                            </p>
                            {email.status === 'sent' && !email.repliedAt && (
                              <button
                                onClick={() => handleMarkReplied(email.id)}
                                disabled={markingReplied === email.id}
                                className="flex items-center gap-1 text-[10px] text-blue-400/50 hover:text-blue-400 transition-colors disabled:opacity-40"
                              >
                                {markingReplied === email.id ? (
                                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                ) : (
                                  <Reply className="w-2.5 h-2.5" />
                                )}
                                Mark as replied
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Footer — send */}
        <div className="p-5 border-t border-white/8 flex gap-3">
          <button
            onClick={handleSend}
            disabled={sending || !lead.contactEmail || !subject.trim() || !body.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-white/5 text-white/60 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
