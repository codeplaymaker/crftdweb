'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { RepTrainingService } from '@/lib/services/repTrainingService';
import {
  TRAINING_SCENARIOS,
  buildRoleplaySystemPrompt,
  buildRatingSystemPrompt,
  scoreToGrade,
} from '@/lib/services/repKnowledgeBase';
import { TrainingMessage, TrainingRating, TrainingRatingCategory } from '@/lib/types/repTraining';
import { ArrowLeft, Phone, PhoneOff, Send, Loader2, Star } from 'lucide-react';

const categoryLabels: Record<TrainingRatingCategory, string> = {
  discovery: 'Discovery', listening: 'Listening', objection_handling: 'Objection Handling',
  closing: 'Closing', rapport: 'Rapport', control: 'Control',
};

function RoleplayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const scenarioId = searchParams?.get('scenario') || null;
  const scenario = TRAINING_SCENARIOS.find((s) => s.id === scenarioId) || null;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TrainingMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showBriefing, setShowBriefing] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<TrainingRating | null>(null);
  const [isRating, setIsRating] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isCallActive) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isCallActive]);

  if (!scenario) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-white/40">Scenario not found.</p>
        <button onClick={() => router.push('/rep/train')} className="mt-4 text-sm text-white/60 underline">
          Back to Training
        </button>
      </div>
    );
  }

  const startCall = useCallback(async () => {
    if (!user?.uid) return;
    const id = await RepTrainingService.createTrainingSession(user.uid, {
      scenarioId: scenario.id,
      scenario,
    });
    setSessionId(id);
    setShowBriefing(false);
    setIsCallActive(true);

    // AI opens the call
    setIsAiThinking(true);
    try {
      const systemPrompt = buildRoleplaySystemPrompt(scenario, scenario.difficulty);
      const response = await fetch('/api/rep/train/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: [],
          difficulty: scenario.difficulty,
        }),
      });

      let aiText = '';
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiText += decoder.decode(value);
        }
      }

      const msg: TrainingMessage = {
        id: Date.now().toString(),
        role: 'prospect',
        content: aiText.trim() || '*picks up the phone* Yeah?',
        timestamp: 0,
      };
      setMessages([msg]);
      await RepTrainingService.addMessage(id, msg);
    } finally {
      setIsAiThinking(false);
    }
  }, [user?.uid, scenario]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || !sessionId || isAiThinking) return;
    const text = inputText.trim();
    setInputText('');

    const repMsg: TrainingMessage = {
      id: Date.now().toString(),
      role: 'rep',
      content: text,
      timestamp: Date.now() - startTimeRef.current,
    };
    const updatedMessages = [...messages, repMsg];
    setMessages(updatedMessages);
    await RepTrainingService.addMessage(sessionId, repMsg);

    // AI responds
    setIsAiThinking(true);
    try {
      const systemPrompt = buildRoleplaySystemPrompt(scenario, scenario.difficulty);
      const response = await fetch('/api/rep/train/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: updatedMessages.map((m) => ({ role: m.role === 'rep' ? 'rep' : 'prospect', content: m.content })),
          difficulty: scenario.difficulty,
        }),
      });

      let aiText = '';
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiText += decoder.decode(value);
        }
      }

      const prospectMsg: TrainingMessage = {
        id: (Date.now() + 1).toString(),
        role: 'prospect',
        content: aiText.trim(),
        timestamp: Date.now() - startTimeRef.current,
      };
      setMessages((prev) => [...prev, prospectMsg]);
      await RepTrainingService.addMessage(sessionId, prospectMsg);
    } finally {
      setIsAiThinking(false);
    }
  }, [inputText, sessionId, isAiThinking, messages, scenario]);

  const endCall = useCallback(async () => {
    if (!sessionId) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCallActive(false);
    setIsRating(true);

    try {
      const ratingSystemPrompt = buildRatingSystemPrompt(scenario);
      const response = await fetch('/api/rep/train/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratingSystemPrompt,
          scenario: {
            name: scenario.name,
            difficulty: scenario.difficulty,
            objectives: scenario.objectives,
            prospectProfile: { name: scenario.prospectProfile.name, businessType: scenario.prospectProfile.businessType },
          },
          messages: messages.map((m) => ({ role: m.role, content: m.content, timestamp: m.timestamp })),
          duration: callDuration,
        }),
      });
      const r: TrainingRating = await response.json();
      setRating(r);

      await RepTrainingService.completeSession(sessionId, r, callDuration);
      if (user?.uid) {
        const session = await RepTrainingService.getTrainingSession(sessionId);
        if (session) await RepTrainingService.updateTrainingStats(user.uid, session);
      }
      setShowRating(true);
    } finally {
      setIsRating(false);
    }
  }, [sessionId, scenario, messages, callDuration, user?.uid]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // Briefing screen
  if (showBriefing) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => router.push('/rep/train')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-white/5 border border-white/8 rounded-xl p-6 space-y-5">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-1">{scenario.difficulty} scenario</p>
            <h2 className="text-xl font-bold text-white">{scenario.name}</h2>
            <p className="text-sm text-white/50 mt-1">{scenario.description}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-white/30 uppercase tracking-widest">Your objectives</p>
            {scenario.objectives.map((o, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-white/30 flex-shrink-0">→</span> {o}
              </div>
            ))}
          </div>
          {scenario.bonusObjectives.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-white/30 uppercase tracking-widest">Bonus objectives</p>
              {scenario.bonusObjectives.map((o, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white/40">
                  <Star className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" /> {o}
                </div>
              ))}
            </div>
          )}
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Prospect</p>
            <p className="text-sm text-white font-medium">{scenario.prospectProfile.name}</p>
            <p className="text-xs text-white/40">{scenario.prospectProfile.businessType} · {scenario.prospectProfile.industry}</p>
          </div>
          <button
            onClick={startCall}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Start Call
          </button>
        </div>
      </div>
    );
  }

  // Rating screen
  if (showRating && rating) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="text-center py-4">
          <p className="text-4xl font-black text-white">{Math.round(rating.overallScore)}</p>
          <p className="text-lg text-white/60">Grade: {rating.grade}</p>
          {rating.callBooked && <p className="text-green-400 text-sm font-semibold mt-1">✓ Call booked</p>}
        </div>
        <div className="bg-white/5 border border-white/8 rounded-xl p-5 space-y-3">
          <p className="text-sm text-white/70">{rating.summary}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-400 font-semibold mb-1">Top Strength</p>
              <p className="text-xs text-white/70">{rating.topStrength}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-xs text-red-400 font-semibold mb-1">Top Weakness</p>
              <p className="text-xs text-white/70">{rating.topWeakness}</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs text-amber-400 font-semibold mb-1">Next Session Focus</p>
            <p className="text-xs text-white/70">{rating.coachingPriority}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-white/30 uppercase tracking-widest">Category Scores</p>
          {(Object.entries(rating.categories) as [TrainingRatingCategory, { score: number; grade: string; feedback: string }][]).map(([cat, data]) => (
            <div key={cat} className="bg-white/5 border border-white/8 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white">{categoryLabels[cat]}</p>
                <span className="text-sm font-bold text-white">{Math.round(data.score)} <span className="text-white/40 text-xs">({data.grade})</span></span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                <div
                  className={`h-1.5 rounded-full ${data.score >= 75 ? 'bg-green-500' : data.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
              <p className="text-xs text-white/40">{data.feedback}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/rep/train')}
            className="flex-1 border border-white/20 text-white/70 font-semibold py-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            Back to Training
          </button>
          <button
            onClick={() => { setMessages([]); setRating(null); setShowRating(false); setShowBriefing(true); setCallDuration(0); setSessionId(null); }}
            className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Active call screen
  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Call header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <p className="text-sm font-semibold text-white">{scenario.prospectProfile.name}</p>
          <p className="text-xs text-white/40">{scenario.prospectProfile.businessType}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-white/60">{fmt(callDuration)}</span>
          <button
            onClick={endCall}
            disabled={isRating}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {isRating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneOff className="w-4 h-4" />}
            {isRating ? 'Rating...' : 'End Call'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'rep' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'rep'
                ? 'bg-white text-black'
                : 'bg-white/8 text-white/90'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isAiThinking && (
          <div className="flex justify-start">
            <div className="bg-white/8 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4 flex-shrink-0">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Type what you'd say on the call..."
          rows={2}
          className="flex-1 bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none outline-none focus:border-white/20"
        />
        <button
          onClick={sendMessage}
          disabled={!inputText.trim() || isAiThinking}
          className="bg-white text-black rounded-xl px-4 disabled:opacity-30 hover:bg-white/90 transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function RoleplayPage() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm">Loading...</div>}>
      <RoleplayContent />
    </Suspense>
  );
}
