'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle, AlertCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface CVResult {
  name: string;
  email: string;
  verdict: 'Book Screening Call' | 'Send Trial Task' | 'Pass';
  score: number;
  salesSignals: string[];
  reasons: string[];
  redFlags: string[];
}

const verdictConfig = {
  'Book Screening Call': {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  'Send Trial Task': {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  'Pass': {
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    icon: <XCircle className="w-4 h-4" />,
  },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 7 ? 'bg-emerald-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className="text-sm font-bold text-white/70 w-6 text-right">{score}</span>
    </div>
  );
}

function ResultCard({ result, onSendTask }: { result: CVResult; onSendTask: (email: string, name: string) => Promise<boolean> }) {
  const [expanded, setExpanded] = useState(true);
  const cfg = verdictConfig[result.verdict];
  const storageKey = `cv-task-sent-v2-${result.name.replace(/\s+/g, '-').toLowerCase()}`;
  const alreadySent = typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'sent';
  const [taskSent, setTaskSent] = useState(alreadySent);
  const [manualEmail, setManualEmail] = useState('');
  const [enteringEmail, setEnteringEmail] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const email = result.email || manualEmail;
    if (!email) { setEnteringEmail(true); return; }
    setSending(true);
    const success = await onSendTask(email, result.name);
    setSending(false);
    if (success) {
      localStorage.setItem(storageKey, 'sent');
      setTaskSent(true);
      setEnteringEmail(false);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <p className="font-semibold text-white">{result.name || 'Unknown'}</p>
            {result.email && <p className="text-xs text-white/35 mt-0.5">{result.email}</p>}
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${cfg.color} ${cfg.bg}`}>
            {cfg.icon} {result.verdict}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {result.verdict !== 'Pass' && (
            taskSent ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Task Sent
              </span>
            ) : enteringEmail ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={manualEmail}
                  onChange={e => setManualEmail(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-purple-500/50 w-44"
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={!manualEmail || sending}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition-all disabled:opacity-40"
                >
                  {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition-all disabled:opacity-40"
              >
                {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Send Trial Task
              </button>
            )
          )}
          <button onClick={() => setExpanded(!expanded)} className="text-white/30 hover:text-white/60 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
          {/* Score */}
          <div>
            <p className="text-xs text-white/30 mb-2 uppercase tracking-widest font-semibold">Match Score</p>
            <ScoreBar score={result.score} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sales signals */}
            {result.salesSignals.length > 0 && (
              <div>
                <p className="text-xs text-emerald-400/70 mb-2 uppercase tracking-widest font-semibold">Sales Signals</p>
                <ul className="space-y-1">
                  {result.salesSignals.map((s, i) => (
                    <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reasons */}
            <div>
              <p className="text-xs text-white/30 mb-2 uppercase tracking-widest font-semibold">Assessment</p>
              <ul className="space-y-1">
                {result.reasons.map((r, i) => (
                  <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span className="text-white/30 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Red flags */}
            {result.redFlags.length > 0 && (
              <div>
                <p className="text-xs text-red-400/70 mb-2 uppercase tracking-widest font-semibold">Red Flags</p>
                <ul className="space-y-1">
                  {result.redFlags.map((f, i) => (
                    <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                      <span className="text-red-500 mt-0.5">!</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CVReviewPage() {
  const [cvText, setCvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CVResult[]>([]);
  const [error, setError] = useState('');
  const [sendingFor, setSendingFor] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lifetimeStats, setLifetimeStats] = useState<{ total: number; bookCall: number; sendTask: number; pass: number } | null>(null);

  useEffect(() => {
    fetch('/api/admin/review-cv')
      .then(r => r.json())
      .then(setLifetimeStats)
      .catch(() => {});
  }, [results]); // refetch after each new review

  const analyseFromApi = async (body: BodyInit, headers?: Record<string, string>) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/review-cv', { method: 'POST', headers, body });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(prev => [data, ...prev]);
      setCvText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const analyse = async () => {
    if (!cvText.trim()) return;
    await analyseFromApi(JSON.stringify({ cvText }), { 'Content-Type': 'application/json' });
  };

  const analyseFile = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    await analyseFromApi(formData);
  };

  const handleSendTask = async (email: string, name: string): Promise<boolean> => {
    if (!email) return false;
    setSendingFor(name);
    try {
      const res = await fetch('/api/admin/send-trial-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name.split(' ')[0] }),
      });
      const data = await res.json();
      return res.ok && data.success;
    } catch {
      return false;
    } finally {
      setSendingFor(null);
    }
  };

  const counts = {
    book: results.filter(r => r.verdict === 'Book Screening Call').length,
    task: results.filter(r => r.verdict === 'Send Trial Task').length,
    pass: results.filter(r => r.verdict === 'Pass').length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-2">Admin · CrftdWeb</p>
          <h1 className="text-2xl font-bold text-white mb-1">CV Review</h1>
          <p className="text-sm text-white/40">Paste a CV below — get an instant verdict on whether to book, task, or pass.</p>
        </div>

        {/* Lifetime stats */}
        {lifetimeStats && lifetimeStats.total > 0 && (
          <div className="flex gap-4 mb-6">
            {[
              { label: 'All-time Reviewed', count: lifetimeStats.total, color: 'text-white/70' },
              { label: 'Book Call', count: lifetimeStats.bookCall, color: 'text-emerald-400' },
              { label: 'Send Task', count: lifetimeStats.sendTask, color: 'text-amber-400' },
              { label: 'Pass', count: lifetimeStats.pass, color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 flex-1 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-white/25 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Stats bar */}
        {results.length > 0 && (
          <div className="flex gap-4 mb-8">
            {[
              { label: 'Book Call', count: counts.book, color: 'text-emerald-400' },
              { label: 'Send Task', count: counts.task, color: 'text-amber-400' },
              { label: 'Pass', count: counts.pass, color: 'text-red-400' },
              { label: 'Total', count: results.length, color: 'text-white/50' },
            ].map(s => (
              <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 flex-1 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 mb-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-lg p-1 w-fit">
            {(['paste', 'upload'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${inputMode === mode ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}
              >
                {mode === 'paste' ? 'Paste Text' : 'Upload PDF'}
              </button>
            ))}
          </div>

          {inputMode === 'paste' ? (
            <>
              <textarea
                ref={textareaRef}
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                placeholder="Paste the full CV text here — name, experience, education, everything..."
                rows={10}
                className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-white/20">{cvText.length > 0 ? `${cvText.length} chars` : 'No input'}</p>
                <button
                  onClick={analyse}
                  disabled={loading || !cvText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {loading ? 'Analysing...' : 'Analyse CV'}
                </button>
              </div>
            </>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) analyseFile(f); }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-14 cursor-pointer transition-all ${dragOver ? 'border-purple-500/60 bg-purple-500/5' : 'border-white/10 hover:border-white/20'}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) analyseFile(f); e.target.value = ''; }}
              />
              {loading ? (
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-white/20" />
              )}
              <div className="text-center">
                <p className="text-sm text-white/50">{loading ? 'Extracting and analysing...' : 'Drop a PDF here or click to browse'}</p>
                <p className="text-xs text-white/20 mt-1">PDF only · One at a time</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
            <XCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-white/25 uppercase tracking-widest font-semibold mb-4">Results — {results.length} reviewed</p>
            {results.map((r, i) => (
              <ResultCard
                key={i}
                result={r}
                onSendTask={handleSendTask}
              />
            ))}
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="text-center py-16 text-white/15">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No CVs reviewed yet</p>
          </div>
        )}

      </div>
    </div>
  );
}
