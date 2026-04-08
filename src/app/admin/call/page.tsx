'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CallTranscriptEntry, CallSummary } from '@/lib/types/repTraining';
import { Phone, PhoneOff, Loader2, Send, Plus, Mic, MicOff, Clipboard, ArrowLeft } from 'lucide-react';

// This is the admin's own live call assistant.
// Unlike the rep version it saves to repCallSessions with repId = 'admin'.

type CallStage = 'prep' | 'active' | 'summary';

interface TalkingPoint { topic: string; question: string; why: string; }
interface Objection { objection: string; response: string; }
interface PrepNotes {
  opener: string;
  keyObjective: string;
  talkingPoints: TalkingPoint[];
  potentialObjections: Objection[];
  closingStrategy: string;
  warningsOrTips: string[];
}

interface AiSuggestion {
  type: string;
  suggestion: string;
  why: string;
  framework: string;
}

export default function AdminCallPage() {
  // Prep form
  const [leadName, setLeadName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [callGoal, setCallGoal] = useState('Book a 15-minute discovery call with Obi');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isPrepping, setIsPrepping] = useState(false);
  const [prepNotes, setPrepNotes] = useState<PrepNotes | null>(null);

  // Active call
  const [callStage, setCallStage] = useState<CallStage>('prep');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<CallTranscriptEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [askText, setAskText] = useState('');
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const [manualEntry, setManualEntry] = useState('');
  const [manualSpeaker, setManualSpeaker] = useState<'rep' | 'prospect'>('rep');

  // Outcome + summary
  const [outcome, setOutcome] = useState<'booked' | 'follow_up' | 'not_interested' | 'callback'>('follow_up');
  const [notes, setNotes] = useState('');
  const [isSummarisingCall, setIsSummarisingCall] = useState(false);
  const [callSummary, setCallSummary] = useState<CallSummary | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    if (callStage === 'active') {
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callStage]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const getPrepNotes = useCallback(async () => {
    if (!leadName.trim()) return;
    setIsPrepping(true);
    try {
      const res = await fetch('/api/rep/call/prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadName, businessType, callGoal, additionalContext }),
      });
      setPrepNotes(await res.json());
    } finally {
      setIsPrepping(false);
    }
  }, [leadName, businessType, callGoal, additionalContext]);

  // Create session via API (need server-side for admin Firestore write)
  const startCall = useCallback(async () => {
    const res = await fetch('/api/admin/call-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadName, businessType, callGoal }),
    });
    const { id } = await res.json();
    setSessionId(id);
    setCallStage('active');
  }, [leadName, businessType, callGoal]);

  const saveTranscriptEntry = useCallback(async (entry: CallTranscriptEntry) => {
    if (!sessionId) return;
    await fetch('/api/admin/call-session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, entry }),
    });
  }, [sessionId]);

  const toggleListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported. Use manual entry.'); return; }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-GB';
    recognitionRef.current = recognition;

    recognition.onresult = async (event) => {
      const text = event.results[event.results.length - 1][0].transcript.trim();
      if (!text) return;
      const entry: CallTranscriptEntry = {
        id: Date.now().toString(), speaker: 'rep', text, timestamp: callDuration, createdAt: new Date(),
      };
      setTranscript((prev) => [...prev, entry]);
      await saveTranscriptEntry(entry);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening, callDuration, saveTranscriptEntry]);

  const addManualEntry = useCallback(async () => {
    if (!manualEntry.trim()) return;
    const entry: CallTranscriptEntry = {
      id: Date.now().toString(), speaker: manualSpeaker, text: manualEntry.trim(), timestamp: callDuration, createdAt: new Date(),
    };
    setTranscript((prev) => [...prev, entry]);
    await saveTranscriptEntry(entry);
    setManualEntry('');
  }, [manualEntry, manualSpeaker, callDuration, saveTranscriptEntry]);

  const askAI = useCallback(async () => {
    if (!transcript.length && !askText.trim()) return;
    setIsGettingSuggestion(true);
    try {
      const lastProspect = [...transcript].reverse().find((t) => t.speaker === 'prospect');
      const res = await fetch('/api/rep/call/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.map((t) => ({ speaker: t.speaker, text: t.text })),
          leadName, businessType,
          lastProspectMessage: lastProspect?.text || '',
          userQuestion: askText,
        }),
      });
      setSuggestion(await res.json());
      setAskText('');
    } finally {
      setIsGettingSuggestion(false);
    }
  }, [transcript, askText, leadName, businessType]);

  const endCall = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    setIsSummarisingCall(true);

    try {
      const res = await fetch('/api/rep/call/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.map((t) => ({ speaker: t.speaker, text: t.text, timestamp: t.timestamp })),
          leadName, businessType, callGoal, duration: callDuration,
        }),
      });
      const summary: CallSummary = await res.json();
      setCallSummary(summary);

      if (sessionId) {
        await fetch('/api/admin/call-session', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, summary, duration: callDuration, outcome, notes }),
        });
      }
    } finally {
      setIsSummarisingCall(false);
      setCallStage('summary');
    }
  }, [transcript, leadName, businessType, callGoal, callDuration, sessionId, outcome, notes]);

  // ── PREP ───────────────────────────────────────────────
  if (callStage === 'prep') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3">
            <Link href="/admin/training" className="text-white/40 hover:text-white/70"><ArrowLeft className="w-4 h-4" /></Link>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Live Call</h2>
              <p className="text-sm text-white/40">Pre-call intel + real-time AI coaching</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-xl p-5 space-y-4">
            <p className="text-xs text-white/30 uppercase tracking-widest">Call Context</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Lead Name *</label>
                <input value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="e.g. Dave at DK Plumbing"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Business Type</label>
                <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. Plumber"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Call Goal</label>
              <input value={callGoal} onChange={(e) => setCallGoal(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Additional Context</label>
              <textarea value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} rows={2}
                placeholder="Any notes about this lead..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 resize-none" />
            </div>
            <button onClick={getPrepNotes} disabled={!leadName.trim() || isPrepping}
              className="w-full border border-white/20 text-white/70 font-semibold py-2.5 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-30 flex items-center justify-center gap-2">
              {isPrepping ? <><Loader2 className="w-4 h-4 animate-spin" /> Prepping...</> : <><Clipboard className="w-4 h-4" /> Get AI Prep Notes</>}
            </button>
          </div>

          {prepNotes && (
            <div className="bg-white/5 border border-white/8 rounded-xl p-5 space-y-4">
              <p className="text-xs text-white/30 uppercase tracking-widest">AI Prep Notes</p>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/30 mb-1">Opening Line</p>
                <p className="text-sm text-white">"{prepNotes.opener}"</p>
              </div>
              <div>
                <p className="text-xs text-white/30 mb-1">Key Objective</p>
                <p className="text-sm text-white/70">{prepNotes.keyObjective}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 mb-2">Talking Points</p>
                {prepNotes.talkingPoints.map((p, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-xs text-white/70">→ {p.question}</p>
                    <p className="text-xs text-white/30">{p.why}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-white/30 mb-2">Predicted Objections</p>
                {prepNotes.potentialObjections.map((o, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-xs text-amber-400/70">⚠ {o.objection}</p>
                    <p className="text-xs text-white/40">↳ {o.response}</p>
                  </div>
                ))}
              </div>
              {prepNotes.warningsOrTips.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 mb-2">Tips</p>
                  {prepNotes.warningsOrTips.map((t, i) => <p key={i} className="text-xs text-green-400/70 mb-1">✓ {t}</p>)}
                </div>
              )}
            </div>
          )}

          <button onClick={startCall} disabled={!leadName.trim()}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-30 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Phone className="w-5 h-5" /> Start Live Call
          </button>
        </div>
      </div>
    );
  }

  // ── SUMMARY ────────────────────────────────────────────
  if (callStage === 'summary') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-5 pb-10">
          <div>
            <h2 className="text-lg font-bold text-white">Call Complete</h2>
            <p className="text-sm text-white/40">{leadName} · {fmt(callDuration)}</p>
          </div>
          {isSummarisingCall ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-white/40" />
              <span className="ml-3 text-sm text-white/40">Summarising call...</span>
            </div>
          ) : callSummary && (
            <>
              <div className={`border rounded-xl p-4 ${callSummary.callBooked ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-semibold ${callSummary.callBooked ? 'text-green-400' : 'text-white/60'}`}>
                    {callSummary.callBooked ? '✓ Call Booked' : 'Call Not Booked'}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${callSummary.sentiment === 'positive' ? 'bg-green-500/10 text-green-400' : callSummary.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' : 'bg-white/10 text-white/40'}`}>{callSummary.sentiment}</span>
                </div>
                <p className="text-sm text-white/70">{callSummary.summary}</p>
              </div>
              {(callSummary.keyPoints?.length ?? 0) > 0 && (
                <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Key Points</p>
                  {callSummary.keyPoints.map((p, i) => <p key={i} className="text-sm text-white/60">→ {p}</p>)}
                </div>
              )}
              {(callSummary.nextSteps?.length ?? 0) > 0 && (
                <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Next Steps</p>
                  {callSummary.nextSteps.map((s, i) => <p key={i} className="text-sm text-white/60">✓ {s}</p>)}
                </div>
              )}
              {callSummary.followUpEmail && (
                <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Follow-Up Email Draft</p>
                  <p className="text-sm text-white/60 whitespace-pre-line">{callSummary.followUpEmail}</p>
                </div>
              )}
            </>
          )}
          <button onClick={() => { setCallStage('prep'); setTranscript([]); setSuggestion(null); setCallSummary(null); setCallDuration(0); setSessionId(null); setPrepNotes(null); }}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors">
            New Call
          </button>
        </div>
      </div>
    );
  }

  // ── ACTIVE CALL ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">{leadName}</p>
            <p className="text-xs text-white/40">{businessType}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-white/60">{fmt(callDuration)}</span>
            </div>
            <button onClick={endCall} disabled={isSummarisingCall}
              className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              {isSummarisingCall ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneOff className="w-4 h-4" />}
              End
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 space-y-3">
            <div className="bg-white/5 border border-white/8 rounded-xl p-3 h-64 overflow-y-auto space-y-1.5">
              {transcript.length === 0
                ? <p className="text-xs text-white/25 italic text-center pt-8">Transcript will appear here</p>
                : transcript.map((t) => (
                  <div key={t.id}>
                    <span className={`text-xs font-semibold ${t.speaker === 'rep' ? 'text-white/50' : 'text-amber-400/70'}`}>{t.speaker.toUpperCase()}: </span>
                    <span className="text-xs text-white/70">{t.text}</span>
                  </div>
                ))}
              <div ref={transcriptEndRef} />
            </div>
            <div className="flex gap-2">
              <select value={manualSpeaker} onChange={(e) => setManualSpeaker(e.target.value as 'rep' | 'prospect')}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/70 outline-none">
                <option value="rep">Rep</option>
                <option value="prospect">Prospect</option>
              </select>
              <input value={manualEntry} onChange={(e) => setManualEntry(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addManualEntry(); }}
                placeholder="Type what was said..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-white/20" />
              <button onClick={addManualEntry} disabled={!manualEntry.trim()} className="bg-white/10 hover:bg-white/15 text-white rounded-lg px-3 disabled:opacity-30">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={toggleListening}
                className={`rounded-lg px-3 py-2 ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="col-span-2 space-y-3">
            {prepNotes && (
              <div className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-1.5">
                <p className="text-xs text-white/30 uppercase tracking-widest">Prep</p>
                <p className="text-xs text-white/50">Opening: <span className="text-white/70">"{prepNotes.opener.slice(0, 60)}..."</span></p>
                {prepNotes.potentialObjections.slice(0, 2).map((o, i) => (
                  <p key={i} className="text-xs text-amber-400/60">⚠ {o.objection.slice(0, 50)}...</p>
                ))}
              </div>
            )}
            <div className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-2">
              <p className="text-xs text-white/30 uppercase tracking-widest">Ask AI</p>
              <textarea value={askText} onChange={(e) => setAskText(e.target.value)} rows={2}
                placeholder="What should I say now?"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 outline-none resize-none focus:border-white/20" />
              <button onClick={askAI} disabled={isGettingSuggestion}
                className="w-full bg-white text-black text-xs font-bold py-2 rounded-lg disabled:opacity-30 hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5">
                {isGettingSuggestion ? <><Loader2 className="w-3 h-3 animate-spin" /> Thinking...</> : <><Send className="w-3 h-3" /> Get Suggestion</>}
              </button>
            </div>
            {suggestion && (
              <div className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/30 uppercase tracking-widest">Suggestion</p>
                  {suggestion.framework && <span className="text-xs text-white/25">{suggestion.framework}</span>}
                </div>
                <p className="text-xs text-white font-medium leading-relaxed">"{suggestion.suggestion}"</p>
                {suggestion.why && <p className="text-xs text-white/40">{suggestion.why}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
          <p className="text-xs text-white/30">Outcome:</p>
          {(['booked', 'follow_up', 'callback', 'not_interested'] as const).map((o) => (
            <button key={o} onClick={() => setOutcome(o)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${outcome === o ? 'bg-white text-black font-semibold' : 'text-white/40 hover:text-white/70'}`}>
              {o.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
