'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import { CallTranscriptEntry, CallSummary } from '@/lib/types/repTraining';
import Link from 'next/link';
import {
  Phone, PhoneOff, Loader2, Send, Plus, Mic, MicOff, Clipboard,
  History, Lock, GraduationCap, Monitor, Download, FileText,
  Minimize2, Maximize2, ChevronUp, ChevronDown, Circle, Square,
} from 'lucide-react';

type CallStage = 'context' | 'prep' | 'active' | 'summary';

interface TopicToExplore { topic: string; trigger: string; question: string; }
interface TalkingPoint { topic: string; question: string; why: string; }
interface Objection { objection: string; response: string; }
interface PrepNotes {
  opener: string;
  keyObjective: string;
  talkingPoints: TalkingPoint[];
  topicsToExplore: TopicToExplore[];
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

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: { length: number; [i: number]: { isFinal: boolean; [j: number]: { transcript: string } } }; resultIndex: number }) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export default function LiveCallPage() {
  const { user } = useAuth();
  const [trainingLocked, setTrainingLocked] = useState<boolean | null>(null);
  const [lockInfo, setLockInfo] = useState({ avgScore: 0, totalSessions: 0 });

  useEffect(() => {
    if (!user) return;
    RepTrainingService.getTrainingStats(user.uid).then((stats) => {
      const avg = stats?.averageScore ?? 0;
      const sessions = stats?.totalSessions ?? 0;
      setLockInfo({ avgScore: avg, totalSessions: sessions });
      setTrainingLocked(!(avg >= 60 && sessions >= 10));
    }).catch(() => setTrainingLocked(true));
  }, [user]);

  // Call context (pre-call setup)
  const [callContext, setCallContext] = useState({
    contactName: '',
    callerType: '',
    callGoal: 'Book a 15-minute discovery call with CrftdWeb',
    additionalContext: '',
  });

  // Prep
  const [isPrepping, setIsPrepping] = useState(false);
  const [prepNotes, setPrepNotes] = useState<PrepNotes | null>(null);
  const [showPrep, setShowPrep] = useState(true);
  const [usedTopics, setUsedTopics] = useState<Set<string>>(new Set());

  // Active call
  const [callStage, setCallStage] = useState<CallStage>('context');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<CallTranscriptEntry[]>([]);
  const [liveText, setLiveText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [askText, setAskText] = useState('');
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  const [manualEntry, setManualEntry] = useState('');
  const [manualSpeaker, setManualSpeaker] = useState<'rep' | 'prospect'>('rep');
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [isOverlayMode, setIsOverlayMode] = useState(false);

  // Audio source + recording
  const [audioSource, setAudioSource] = useState<'mic' | 'system'>('mic');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [useDeepgram, setUseDeepgram] = useState(true);

  // Outcome + summary
  const [outcome, setOutcome] = useState<'booked' | 'follow_up' | 'not_interested' | 'callback'>('follow_up');
  const [notes, setNotes] = useState('');
  const [isSummarisingCall, setIsSummarisingCall] = useState(false);
  const [callSummary, setCallSummary] = useState<CallSummary | null>(null);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speechRef = useRef<ISpeechRecognition | null>(null);
  const deepgramSocketRef = useRef<WebSocket | null>(null);
  const deepgramRecorderRef = useRef<MediaRecorder | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const lastAutoSuggestLength = useRef(0);
  const isActiveRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const systemStreamRef = useRef<MediaStream | null>(null);
  const callDurationRef = useRef(0);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, liveText]);

  // Keep duration ref in sync
  useEffect(() => { callDurationRef.current = callDuration; }, [callDuration]);

  // Auto-suggest when prospect speaks
  useEffect(() => {
    if (callStage !== 'active' || !autoSuggest) return;
    if (transcript.length <= lastAutoSuggestLength.current) return;
    const last = transcript[transcript.length - 1];
    if (last?.speaker !== 'prospect') return;
    lastAutoSuggestLength.current = transcript.length;
    setIsGettingSuggestion(true);
    fetch('/api/rep/call/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: transcript.map((t) => ({ speaker: t.speaker, text: t.text })),
        leadName: callContext.contactName,
        businessType: callContext.callerType,
        lastProspectMessage: last.text,
        userQuestion: '',
      }),
    })
      .then((r) => r.json())
      .then((data) => setSuggestion(data))
      .catch(() => null)
      .finally(() => setIsGettingSuggestion(false));
  }, [transcript, callStage, callContext.contactName, callContext.callerType, autoSuggest]);

  useEffect(() => {
    if (callStage === 'active') {
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callStage]);

  useEffect(() => { isActiveRef.current = callStage === 'active'; }, [callStage]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Audio Recording ───────────────────────────────────
  const startAudioRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
      });
      recordingStreamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecordingAudio(true);
    } catch {
      alert('Could not access microphone. Please allow microphone access.');
    }
  }, []);

  const stopAudioRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (!audioBlob || !audioUrl) return;
    const ext = audioBlob.type.includes('webm') ? 'webm' : 'm4a';
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `call-${callContext.contactName || 'recording'}-${new Date().toISOString().slice(0, 10)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [audioBlob, audioUrl, callContext.contactName]);

  // ── Whisper Transcription ──────────────────────────────
  const transcribeRecording = useCallback(async () => {
    if (!audioBlob) return;
    const fileSizeMB = audioBlob.size / (1024 * 1024);
    if (fileSizeMB > 4) {
      alert(`Audio file is too large (${fileSizeMB.toFixed(1)}MB). Please record a shorter clip (under 4MB).`);
      return;
    }
    setIsTranscribing(true);
    try {
      const ext = audioBlob.type.includes('webm') ? 'webm' : 'm4a';
      const file = new File([audioBlob], `recording.${ext}`, { type: audioBlob.type });
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/rep/call/whisper', { method: 'POST', body: formData });
      if (response.status === 413) throw new Error('File too large. Please record a shorter clip.');
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Transcription failed');
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to transcribe';
      alert(msg);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, [audioBlob]);

  // ── System Audio ───────────────────────────────────────
  const requestSystemAudio = async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } as MediaTrackConstraints,
      });
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        alert('No audio track captured. Make sure to check "Share audio" when selecting the tab/screen.');
        stream.getTracks().forEach((t) => t.stop());
        return null;
      }
      stream.getVideoTracks().forEach((t) => t.stop());
      return stream;
    } catch {
      return null;
    }
  };

  // ── Deepgram Transcription ─────────────────────────────
  const startDeepgramTranscription = async (stream: MediaStream) => {
    try {
      const tokenRes = await fetch('/api/rep/call/deepgram');
      if (!tokenRes.ok) return false;
      const { apiKey } = await tokenRes.json();

      const socket = new WebSocket(
        'wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true&endpointing=300',
        ['token', apiKey]
      );
      deepgramSocketRef.current = socket;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });
      deepgramRecorderRef.current = mediaRecorder;

      socket.onopen = () => {
        setIsListening(true);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };
        mediaRecorder.start(250);
      };

      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'Results' && data.channel?.alternatives?.[0]) {
          const text = data.channel.alternatives[0].transcript;
          const isFinal = data.is_final;
          if (text) {
            if (isFinal) {
              setTranscript((p) => [...p, {
                id: `dg_${Date.now()}`,
                speaker: 'prospect',
                text,
                timestamp: callDurationRef.current,
                confidence: data.channel.alternatives[0].confidence || 0.95,
                createdAt: new Date(),
              }]);
              setLiveText('');
            } else {
              setLiveText(text);
            }
          }
        }
      };

      socket.onerror = () => {};
      socket.onclose = () => {
        setIsListening(false);
        if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      };

      return true;
    } catch {
      return false;
    }
  };

  // ── Get Prep Notes ─────────────────────────────────────
  const getPrepNotes = useCallback(async () => {
    if (!callContext.contactName.trim()) return;
    setIsPrepping(true);
    try {
      const res = await fetch('/api/rep/call/prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: callContext.contactName,
          businessType: callContext.callerType,
          callGoal: callContext.callGoal,
          additionalContext: callContext.additionalContext,
        }),
      });
      const data = await res.json();
      setPrepNotes(data);
      setCallStage('prep');
    } finally {
      setIsPrepping(false);
    }
  }, [callContext]);

  const markTopicUsed = (topic: string) => {
    setUsedTopics((prev) => new Set([...prev, topic]));
  };

  const useTopicQuestion = (question: string, topic: string) => {
    setSuggestion({ type: 'question', suggestion: question, why: `From prep: ${topic}`, framework: '' });
    markTopicUsed(topic);
  };

  // ── Start Call ─────────────────────────────────────────
  const startCall = useCallback(async () => {
    if (!user?.uid) return;

    const id = await RepTrainingService.createLiveCallSession(user.uid, {
      leadName: callContext.contactName || 'Prospect',
      businessType: callContext.callerType,
      callGoal: callContext.callGoal,
    });
    setSessionId(id);
    setCallStage('active');
    setCallDuration(0);

    // Get mic stream
    let micStream: MediaStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
    } catch {
      alert('Could not access microphone. Please allow microphone access.');
      return;
    }

    // Try Deepgram first, fall back to Web Speech API
    if (useDeepgram) {
      const started = await startDeepgramTranscription(micStream);
      if (started) {
        startAudioRecording();
        return;
      }
    }

    // Fallback: Web Speech API
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported. Use Chrome or Edge.'); return; }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB';

    recognition.onresult = (event) => {
      let interim = '', final_text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final_text += t;
        else interim += t;
      }
      setLiveText(interim);
      if (final_text) {
        setTranscript((p) => [...p, {
          id: `ws_${Date.now()}`,
          speaker: 'rep',
          text: final_text.trim(),
          timestamp: callDurationRef.current,
          createdAt: new Date(),
        }]);
        setLiveText('');
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      if (isActiveRef.current && speechRef.current) {
        try { recognition.start(); } catch { /* ignore */ }
      } else { setIsListening(false); }
    };

    speechRef.current = recognition;
    recognition.start();
    setIsListening(true);
    startAudioRecording();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, callContext, useDeepgram, startAudioRecording]);

  // ── Start Call with System Audio ───────────────────────
  const startCallWithSystemAudio = useCallback(async () => {
    if (!user?.uid) return;

    const stream = await requestSystemAudio();
    if (!stream) {
      alert('Could not capture system audio. Try using microphone instead.');
      return;
    }
    systemStreamRef.current = stream;

    const id = await RepTrainingService.createLiveCallSession(user.uid, {
      leadName: callContext.contactName || 'Prospect',
      businessType: callContext.callerType,
      callGoal: callContext.callGoal,
    });
    setSessionId(id);
    setCallStage('active');
    setCallDuration(0);

    // Use Deepgram with system audio if available
    if (useDeepgram) {
      const started = await startDeepgramTranscription(stream);
      if (started) {
        startAudioRecording();
        stream.getAudioTracks()[0].onended = () => { if (isActiveRef.current) endCall(); };
        return;
      }
    }

    // Fallback: Web Speech API (mic only, system audio recorded separately)
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition not supported. Use Chrome or Edge.');
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB';

    recognition.onresult = (event) => {
      let interim = '', final_text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final_text += t;
        else interim += t;
      }
      setLiveText(interim);
      if (final_text) {
        setTranscript((p) => [...p, {
          id: `ws_${Date.now()}`,
          speaker: 'rep',
          text: final_text.trim(),
          timestamp: callDurationRef.current,
          createdAt: new Date(),
        }]);
        setLiveText('');
      }
    };
    recognition.onerror = () => {};
    recognition.onend = () => {
      if (isActiveRef.current && speechRef.current) {
        try { recognition.start(); } catch { /* ignore */ }
      } else { setIsListening(false); }
    };

    speechRef.current = recognition;
    recognition.start();
    setIsListening(true);
    startAudioRecording();

    stream.getAudioTracks()[0].onended = () => {
      if (isActiveRef.current) endCall();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, callContext, useDeepgram, startAudioRecording]);

  // Manual transcript entry
  const addManualEntry = useCallback(async () => {
    if (!manualEntry.trim()) return;
    const entry: CallTranscriptEntry = {
      id: Date.now().toString(),
      speaker: manualSpeaker,
      text: manualEntry.trim(),
      timestamp: callDuration,
      createdAt: new Date(),
    };
    setTranscript((prev) => [...prev, entry]);
    if (sessionId) await RepTrainingService.addCallTranscriptEntry(sessionId, entry);
    setManualEntry('');
  }, [manualEntry, manualSpeaker, callDuration, sessionId]);

  // Ask AI for suggestion
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
          leadName: callContext.contactName,
          businessType: callContext.callerType,
          lastProspectMessage: lastProspect?.text || '',
          userQuestion: askText,
        }),
      });
      const data = await res.json();
      setSuggestion(data);
      setAskText('');
    } finally {
      setIsGettingSuggestion(false);
    }
  }, [transcript, askText, callContext.contactName, callContext.callerType]);

  // ── End Call → Summary ─────────────────────────────────
  const endCall = useCallback(async () => {
    isActiveRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);

    // Stop Deepgram
    if (deepgramSocketRef.current) {
      deepgramSocketRef.current.close();
      deepgramSocketRef.current = null;
    }
    if (deepgramRecorderRef.current && deepgramRecorderRef.current.state !== 'inactive') {
      deepgramRecorderRef.current.stop();
    }

    // Stop Web Speech
    if (speechRef.current) {
      speechRef.current.stop();
      speechRef.current = null;
    }
    setIsListening(false);

    // Stop audio recording and wait for blob
    let recordedBlob: Blob | null = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        recordedBlob = await new Promise<Blob>((resolve, reject) => {
          const mr = mediaRecorderRef.current!;
          const timeout = setTimeout(() => reject(new Error('timeout')), 5000);
          mr.onstop = () => {
            clearTimeout(timeout);
            const blob = new Blob(audioChunksRef.current, { type: mr.mimeType });
            setAudioBlob(blob);
            setAudioUrl(URL.createObjectURL(blob));
            recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
            resolve(blob);
          };
          mr.stop();
          setIsRecordingAudio(false);
        });
      } catch { /* continue without recording */ }
    }

    // Stop system audio
    if (systemStreamRef.current) {
      systemStreamRef.current.getTracks().forEach((t) => t.stop());
      systemStreamRef.current = null;
    }

    setIsSummarisingCall(true);

    try {
      // Whisper re-transcription if we have a recording
      let finalTranscript = transcript;
      if (recordedBlob) {
        const fileSizeMB = recordedBlob.size / (1024 * 1024);
        if (fileSizeMB <= 4) {
          try {
            const ext = recordedBlob.type.includes('webm') ? 'webm' : 'm4a';
            const file = new File([recordedBlob], `recording.${ext}`, { type: recordedBlob.type });
            const formData = new FormData();
            formData.append('audio', file);

            const whisperRes = await fetch('/api/rep/call/whisper', { method: 'POST', body: formData });
            if (whisperRes.ok) {
              const whisperData = await whisperRes.json();
              if (whisperData.text) {
                const sentences = whisperData.text.split(/(?<=[.!?])\s+/).filter((s: string) => s.trim());
                finalTranscript = sentences.map((text: string, i: number) => ({
                  id: `whisper_${Date.now()}_${i}`,
                  speaker: 'unknown' as const,
                  text: text.trim(),
                  timestamp: Math.floor((i / sentences.length) * callDurationRef.current),
                  confidence: 0.95,
                  createdAt: new Date(),
                }));
              }
            }
          } catch { /* use live transcript */ }
        }
      }

      const res = await fetch('/api/rep/call/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: finalTranscript.map((t) => ({ speaker: t.speaker, text: t.text, timestamp: t.timestamp })),
          leadName: callContext.contactName,
          businessType: callContext.callerType,
          callGoal: callContext.callGoal,
          duration: callDurationRef.current,
          notes,
        }),
      });
      const summary: CallSummary = await res.json();
      setCallSummary(summary);

      if (sessionId) {
        await RepTrainingService.completeCallSession(
          sessionId, summary, callDurationRef.current, outcome, notes, undefined, finalTranscript
        );
      }
    } catch { /* ignore */ } finally {
      setIsSummarisingCall(false);
      setCallStage('summary');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, callContext, sessionId, outcome, notes]);

  // Quick pick options for context
  const callerTypeOptions = [
    'Local business needing a website',
    'Business wanting website revamp',
    'Warm lead / referral',
    'Cold outreach',
    'Follow-up from previous call',
  ];

  // ── TRAINING GATE ─────────────────────────────────────
  if (trainingLocked) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Live Call Locked</h2>
          <p className="text-sm text-white/40 mt-2">Complete your training before using the live call tool.<br />You need <strong className="text-white/60">10 roleplay sessions</strong> and an <strong className="text-white/60">average score of 60+</strong>.</p>
        </div>
        <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-3 text-left max-w-xs mx-auto">
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Sessions</span><span>{lockInfo.totalSessions}/10</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${Math.min(100, (lockInfo.totalSessions / 10) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Avg Score</span><span>{Math.round(lockInfo.avgScore)}/60</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${Math.min(100, (lockInfo.avgScore / 60) * 100)}%` }} />
            </div>
          </div>
        </div>
        <Link href="/rep/train" className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-colors">
          <GraduationCap className="w-4 h-4" /> Go to Training
        </Link>
      </div>
    );
  }

  // ── CONTEXT SETUP STAGE ────────────────────────────────
  if (callStage === 'context') {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Live Call Assistant</h2>
            <p className="text-sm text-white/40">Set up your call context, then get AI prep notes</p>
          </div>
          <Link href="/rep/call/history" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <History className="w-3.5 h-3.5" />
            Past Calls
          </Link>
        </div>

        <div className="bg-white/5 border border-white/8 rounded-xl p-5 space-y-4">
          <p className="text-xs text-white/30 uppercase tracking-widest">Call Context</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Contact / Business Name *</label>
              <input
                value={callContext.contactName}
                onChange={(e) => setCallContext((p) => ({ ...p, contactName: e.target.value }))}
                placeholder="e.g. Dave at DK Plumbing"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Type of Contact</label>
              <input
                value={callContext.callerType}
                onChange={(e) => setCallContext((p) => ({ ...p, callerType: e.target.value }))}
                placeholder="e.g. Plumber"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Quick picks for caller type */}
          <div className="flex flex-wrap gap-1.5">
            {callerTypeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setCallContext((p) => ({ ...p, callerType: opt }))}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  callContext.callerType === opt
                    ? 'bg-white text-black font-semibold'
                    : 'text-white/30 border border-white/10 hover:text-white/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1 block">Call Goal</label>
            <input
              value={callContext.callGoal}
              onChange={(e) => setCallContext((p) => ({ ...p, callGoal: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Additional Context (optional)</label>
            <textarea
              value={callContext.additionalContext}
              onChange={(e) => setCallContext((p) => ({ ...p, additionalContext: e.target.value }))}
              placeholder="Any notes about this lead, their website, industry situation..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 resize-none"
            />
          </div>
          <button
            onClick={getPrepNotes}
            disabled={!callContext.contactName.trim() || isPrepping}
            className="w-full border border-white/20 text-white/70 font-semibold py-2.5 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {isPrepping ? <><Loader2 className="w-4 h-4 animate-spin" /> Prepping...</> : <><Clipboard className="w-4 h-4" /> Get AI Prep Notes</>}
          </button>
        </div>

        {/* Skip to call directly */}
        <button
          onClick={() => setCallStage('prep')}
          disabled={!callContext.contactName.trim()}
          className="w-full text-white/30 text-xs hover:text-white/50 transition-colors disabled:opacity-30"
        >
          Skip prep, go straight to call →
        </button>
      </div>
    );
  }

  // ── PREP STAGE (with prep notes + start call) ──────────
  if (callStage === 'prep') {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Pre-Call Prep</h2>
            <p className="text-sm text-white/40">{callContext.contactName} {callContext.callerType ? `· ${callContext.callerType}` : ''}</p>
          </div>
          <button onClick={() => setCallStage('context')} className="text-xs text-white/30 hover:text-white/60 transition-colors">
            ← Edit Context
          </button>
        </div>

        {prepNotes ? (
          <div className="bg-white/5 border border-white/8 rounded-xl p-5 space-y-4">
            <p className="text-xs text-white/30 uppercase tracking-widest">AI Prep Notes</p>

            {/* Key Objective */}
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/30 mb-1">Key Objective</p>
              <p className="text-sm text-white font-medium">{prepNotes.keyObjective}</p>
            </div>

            {/* Opening Line */}
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/30 mb-1">Opening Line</p>
              <p className="text-sm text-white">&ldquo;{prepNotes.opener}&rdquo;</p>
            </div>

            {/* Topics to Explore */}
            {prepNotes.topicsToExplore?.length > 0 && (
              <div>
                <p className="text-xs text-white/30 mb-2">Topics to Explore</p>
                {prepNotes.topicsToExplore.map((t, i) => (
                  <div key={i} className="mb-2 bg-white/3 rounded-lg p-3">
                    <p className="text-xs text-white/70 font-medium">{t.topic}</p>
                    <p className="text-xs text-white/30 mt-0.5">When: {t.trigger}</p>
                    <p className="text-xs text-white/50 mt-1">&ldquo;{t.question}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}

            {/* Talking Points */}
            <div>
              <p className="text-xs text-white/30 mb-2">Talking Points</p>
              {prepNotes.talkingPoints.map((p, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs text-white/70">→ {p.question}</p>
                  <p className="text-xs text-white/30">{p.why}</p>
                </div>
              ))}
            </div>

            {/* Predicted Objections */}
            <div>
              <p className="text-xs text-white/30 mb-2">Predicted Objections</p>
              {prepNotes.potentialObjections.map((o, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs text-amber-400/70">⚠ {o.objection}</p>
                  <p className="text-xs text-white/40">↳ {o.response}</p>
                </div>
              ))}
            </div>

            {/* Closing Strategy */}
            <div>
              <p className="text-xs text-white/30 mb-1">Closing Strategy</p>
              <p className="text-xs text-white/60">{prepNotes.closingStrategy}</p>
            </div>

            {prepNotes.warningsOrTips.length > 0 && (
              <div>
                <p className="text-xs text-white/30 mb-2">Tips</p>
                {prepNotes.warningsOrTips.map((t, i) => (
                  <p key={i} className="text-xs text-green-400/70 mb-1">✓ {t}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/8 rounded-xl p-10 text-center">
            <p className="text-sm text-white/30">No prep notes loaded. Press &quot;Get AI Prep Notes&quot; on the context screen, or start the call directly.</p>
          </div>
        )}

        {/* Audio Source Toggle */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-3">
          <p className="text-xs text-white/30 uppercase tracking-widest">Audio Source</p>
          <div className="flex gap-2">
            <button
              onClick={() => setAudioSource('mic')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                audioSource === 'mic' ? 'bg-white text-black' : 'text-white/40 border border-white/10 hover:text-white/60'
              }`}
            >
              <Mic className="w-4 h-4" /> Microphone
            </button>
            <button
              onClick={() => setAudioSource('system')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                audioSource === 'system' ? 'bg-white text-black' : 'text-white/40 border border-white/10 hover:text-white/60'
              }`}
            >
              <Monitor className="w-4 h-4" /> Browser Tab
            </button>
          </div>
          {audioSource === 'system' && (
            <p className="text-xs text-amber-400/70 text-center">Select the browser tab with your call (Zoom, Meet, etc.) and check &quot;Share audio&quot;</p>
          )}

          {/* Deepgram toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">Use Deepgram (higher accuracy)</span>
            <button
              onClick={() => setUseDeepgram(!useDeepgram)}
              className={`w-10 h-5 rounded-full transition-colors relative ${useDeepgram ? 'bg-green-500' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${useDeepgram ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Start Call */}
        <button
          onClick={audioSource === 'mic' ? startCall : startCallWithSystemAudio}
          disabled={!callContext.contactName.trim()}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-30 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-5 h-5" />
          {audioSource === 'mic' ? 'Start Live Call' : 'Start Call (Browser Tab)'}
        </button>

        <details className="bg-white/5 border border-white/8 rounded-xl">
          <summary className="text-xs text-white/40 uppercase tracking-widest cursor-pointer px-5 py-3 hover:text-white/60 select-none">
            How it works
          </summary>
          <div className="px-5 pb-4 space-y-2 text-sm text-white/50">
            <p>1. Fill in the prospect details above, then hit <span className="text-white/70 font-medium">Start Live Call</span>. AI prep notes will generate automatically.</p>
            <p>2. Call the prospect on your phone. The assistant listens through your mic and transcribes in real time.</p>
            <p>3. Toggle <span className="text-white/70 font-medium">Auto-Suggest</span> to get live talking points and topic prompts as the conversation flows.</p>
            <p>4. Click topics to mark them as covered. When done, hit <span className="text-white/70 font-medium">End Call</span> for a full summary, action items, and follow-up draft.</p>
          </div>
        </details>
      </div>
    );
  }

  // ── SUMMARY STAGE ────────────────────────────────────────
  if (callStage === 'summary') {
    return (
      <div className="max-w-2xl mx-auto space-y-5 pb-10">
        <div>
          <h2 className="text-lg font-bold text-white">Call Complete</h2>
          <p className="text-sm text-white/40">{callContext.contactName} · {fmt(callDuration)}</p>
        </div>

        {isSummarisingCall ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-white/40" />
            <span className="ml-3 text-sm text-white/40">Summarising call...</span>
          </div>
        ) : callSummary ? (
          <>
            <div className={`border rounded-xl p-4 ${callSummary.callBooked ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`font-semibold ${callSummary.callBooked ? 'text-green-400' : 'text-white/60'}`}>
                  {callSummary.callBooked ? '✓ Call Booked' : 'Call Not Booked'}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  callSummary.sentiment === 'positive' ? 'bg-green-500/10 text-green-400' :
                  callSummary.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' :
                  'bg-white/10 text-white/40'
                }`}>{callSummary.sentiment}</span>
              </div>
              <p className="text-sm text-white/70">{callSummary.summary}</p>
            </div>

            {(callSummary.keyPoints?.length ?? 0) > 0 && (
              <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-1">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Key Points</p>
                {callSummary.keyPoints.map((p, i) => <p key={i} className="text-sm text-white/60">→ {p}</p>)}
              </div>
            )}

            {(callSummary.nextSteps?.length ?? 0) > 0 && (
              <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-1">
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
        ) : null}

        {/* Audio Recording Playback */}
        {audioUrl && (
          <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-3">
            <p className="text-xs text-white/30 uppercase tracking-widest">Call Recording</p>
            <audio src={audioUrl} controls className="w-full h-10" />
            <div className="flex gap-2">
              <button
                onClick={downloadRecording}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button
                onClick={transcribeRecording}
                disabled={isTranscribing}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors disabled:opacity-30"
              >
                <FileText className="w-3.5 h-3.5" /> {isTranscribing ? 'Transcribing...' : 'Re-transcribe (Whisper)'}
              </button>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-2 max-h-60 overflow-y-auto">
            <p className="text-xs text-white/30 uppercase tracking-widest sticky top-0">Transcript</p>
            {transcript.map((t) => (
              <div key={t.id}>
                <span className={`text-xs font-semibold ${t.speaker === 'rep' ? 'text-white/50' : t.speaker === 'prospect' ? 'text-amber-400/70' : 'text-blue-400/70'}`}>
                  {t.speaker.toUpperCase()}: </span>
                <span className="text-xs text-white/60">{t.text}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setCallStage('context');
            setTranscript([]);
            setSuggestion(null);
            setCallSummary(null);
            setCallDuration(0);
            setSessionId(null);
            setPrepNotes(null);
            setAudioBlob(null);
            setAudioUrl(null);
            setUsedTopics(new Set());
            setCallContext({ contactName: '', callerType: '', callGoal: 'Book a 15-minute discovery call with CrftdWeb', additionalContext: '' });
          }}
          className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors"
        >
          New Call
        </button>
      </div>
    );
  }

  // ── ACTIVE CALL STAGE ────────────────────────────────────
  return (
    <div className={`${isOverlayMode ? 'max-w-md mx-auto' : 'max-w-2xl mx-auto'} space-y-4`}>
      {/* Call header */}
      <div className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{callContext.contactName}</p>
          <p className="text-xs text-white/40">{callContext.callerType}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Overlay toggle */}
          <button
            onClick={() => setIsOverlayMode(!isOverlayMode)}
            className={`p-1.5 rounded-lg transition-colors ${isOverlayMode ? 'bg-white/10 text-white/60' : 'text-white/25 hover:text-white/50'}`}
            title={isOverlayMode ? 'Full view' : 'Compact view'}
          >
            {isOverlayMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Recording indicator */}
          {isRecordingAudio && (
            <div className="flex items-center gap-1 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-xs">REC</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-white/60">{fmt(callDuration)}</span>
          </div>
          <button
            onClick={endCall}
            disabled={isSummarisingCall}
            className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
          >
            {isSummarisingCall ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneOff className="w-4 h-4" />}
            End
          </button>
        </div>
      </div>

      <div className={`grid ${isOverlayMode ? 'grid-cols-1' : 'grid-cols-5'} gap-4`}>
        {/* Transcript panel */}
        <div className={`${isOverlayMode ? '' : 'col-span-3'} space-y-3`}>
          <div className="bg-white/5 border border-white/8 rounded-xl p-3 h-64 overflow-y-auto space-y-1.5">
            {transcript.length === 0 && !liveText ? (
              <p className="text-xs text-white/25 italic text-center pt-8">Transcript will appear here</p>
            ) : (
              <>
                {transcript.map((t) => (
                  <div key={t.id}>
                    <span className={`text-xs font-semibold ${t.speaker === 'rep' ? 'text-white/50' : t.speaker === 'prospect' ? 'text-amber-400/70' : 'text-blue-400/70'}`}>
                      {t.speaker.toUpperCase()}: </span>
                    <span className="text-xs text-white/70">{t.text}</span>
                  </div>
                ))}
                {liveText && (
                  <div className="opacity-50">
                    <span className="text-xs font-semibold text-amber-400/50">...</span>
                    <span className="text-xs text-white/40 italic"> {liveText}</span>
                  </div>
                )}
              </>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Manual entry */}
          <div className="flex gap-2">
            <select
              value={manualSpeaker}
              onChange={(e) => setManualSpeaker(e.target.value as 'rep' | 'prospect')}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/70 outline-none"
            >
              <option value="rep">Rep</option>
              <option value="prospect">Prospect</option>
            </select>
            <input
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addManualEntry(); }}
              placeholder="Type what was said..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-white/20"
            />
            <button onClick={addManualEntry} disabled={!manualEntry.trim()} className="bg-white/10 hover:bg-white/15 text-white rounded-lg px-3 disabled:opacity-30">
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (isListening) {
                  if (speechRef.current) speechRef.current.stop();
                  setIsListening(false);
                } else if (speechRef.current) {
                  speechRef.current.start();
                  setIsListening(true);
                }
              }}
              className={`rounded-lg px-3 py-2 ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Audio recording controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                isRecordingAudio ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40 hover:text-white/60'
              }`}
            >
              {isRecordingAudio ? <><Square className="w-3 h-3" /> Stop Recording</> : <><Circle className="w-3 h-3" /> Record Audio</>}
            </button>
            {audioUrl && !isRecordingAudio && (
              <>
                <audio src={audioUrl} controls className="h-8 flex-1" />
                <button onClick={downloadRecording} className="text-xs text-white/30 hover:text-white/50">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* AI suggestion panel + prep */}
        <div className={`${isOverlayMode ? '' : 'col-span-2'} space-y-3`}>
          {/* Prep notes quick view (collapsible) */}
          {prepNotes && (
            <div className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-1.5">
              <button onClick={() => setShowPrep(!showPrep)} className="flex items-center justify-between w-full">
                <p className="text-xs text-white/30 uppercase tracking-widest">Prep</p>
                {showPrep ? <ChevronUp className="w-3 h-3 text-white/20" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
              </button>
              {showPrep && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs text-white/50">Opening: <span className="text-white/70">&ldquo;{prepNotes.opener.slice(0, 80)}{prepNotes.opener.length > 80 ? '...' : ''}&rdquo;</span></p>

                  {/* Clickable topics to explore */}
                  {prepNotes.topicsToExplore?.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => useTopicQuestion(t.question, t.topic)}
                      disabled={usedTopics.has(t.topic)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                        usedTopics.has(t.topic)
                          ? 'text-white/20 line-through'
                          : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                      }`}
                    >
                      {usedTopics.has(t.topic) ? '✓' : '→'} {t.topic}
                    </button>
                  ))}

                  {/* Clickable talking points */}
                  {prepNotes.talkingPoints.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => useTopicQuestion(p.question, p.topic)}
                      disabled={usedTopics.has(p.topic)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                        usedTopics.has(p.topic)
                          ? 'text-white/20 line-through'
                          : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                      }`}
                    >
                      {usedTopics.has(p.topic) ? '✓' : '→'} {p.topic}
                    </button>
                  ))}

                  {/* Objections */}
                  {prepNotes.potentialObjections.slice(0, 3).map((o, i) => (
                    <button
                      key={i}
                      onClick={() => setSuggestion({ type: 'objection_handler', suggestion: o.response, why: `Handles: "${o.objection}"`, framework: '' })}
                      className="w-full text-left text-xs text-amber-400/50 hover:text-amber-400/80 px-2 py-1 rounded-lg transition-colors"
                    >
                      ⚠ {o.objection.slice(0, 40)}{o.objection.length > 40 ? '...' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Auto-suggest toggle */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-white/20">Auto-suggest</span>
            <button
              onClick={() => setAutoSuggest(!autoSuggest)}
              className={`w-8 h-4 rounded-full transition-colors relative ${autoSuggest ? 'bg-green-500' : 'bg-white/15'}`}
            >
              <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${autoSuggest ? 'left-4' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Ask AI */}
          <div className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-2">
            <p className="text-xs text-white/30 uppercase tracking-widest">Ask AI</p>
            <textarea
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              placeholder="What should I say now? How do I handle this?"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 outline-none resize-none focus:border-white/20"
            />
            <button
              onClick={askAI}
              disabled={isGettingSuggestion}
              className="w-full bg-white text-black text-xs font-bold py-2 rounded-lg disabled:opacity-30 hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5"
            >
              {isGettingSuggestion ? <><Loader2 className="w-3 h-3 animate-spin" /> Thinking...</> : <><Send className="w-3 h-3" /> Get Suggestion</>}
            </button>
          </div>

          {/* Suggestion result */}
          {suggestion && (
            <div className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/30 uppercase tracking-widest">Suggestion</p>
                {suggestion.framework && <span className="text-xs text-white/25">{suggestion.framework}</span>}
              </div>
              <p className="text-xs text-white font-medium leading-relaxed">&ldquo;{suggestion.suggestion}&rdquo;</p>
              {suggestion.why && <p className="text-xs text-white/40">{suggestion.why}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Outcome selector */}
      <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
        <p className="text-xs text-white/30">Outcome:</p>
        {(['booked', 'follow_up', 'callback', 'not_interested'] as const).map((o) => (
          <button
            key={o}
            onClick={() => setOutcome(o)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${outcome === o ? 'bg-white text-black font-semibold' : 'text-white/40 hover:text-white/70'}`}
          >
            {o.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}
