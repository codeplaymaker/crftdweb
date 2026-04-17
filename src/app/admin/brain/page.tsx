'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, ArrowLeft, Zap, RefreshCw, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  { icon: '🎯', label: 'What should I focus on today?', prompt: 'Based on the current state of my business, what are the 3 highest-impact things I should do today? Be specific and tell me exactly why each one matters right now.' },
  { icon: '👥', label: 'Rep pipeline health check', prompt: 'Give me a full rep pipeline analysis. Who\'s stale, who needs chasing, who\'s close to becoming active? Tell me exactly who to contact and what to say.' },
  { icon: '📈', label: 'How do I hit 5 active reps?', prompt: 'I want to get to 5 active reps consistently. Looking at where I am now, what\'s blocking me and what\'s the clearest path to get there?' },
  { icon: '⚡', label: 'I have 2 hours — what\'s best use?', prompt: 'I have 2 hours free right now. Looking at the current business state, what\'s the single highest-value thing I can do with that time?' },
  { icon: '💰', label: 'What\'s the fastest path to revenue?', prompt: 'Looking at my current pipeline — reps, leads, applicants — what\'s the fastest path to a closed deal in the next 7 days? What do I do first?' },
  { icon: '📋', label: 'Build my week plan', prompt: 'It\'s the start of a new week. Based on everything in the CRM, give me a structured day-by-day plan for this week. Delivery, sales, content, and admin — balanced around what\'s most urgent.' },
];

// ── Markdown-lite renderer ─────────────────────────────────────────────────────
function renderContent(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-white font-700 text-base mt-5 mb-2 first:mt-0">
          {line.slice(3)}
        </h2>
      );
    }
    // H3
    else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-white/90 font-600 text-sm mt-4 mb-1.5 first:mt-0">
          {line.slice(4)}
        </h3>
      );
    }
    // Bold line
    else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <p key={i} className="text-white font-semibold text-sm mt-3 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\.\s(.*)/)!;
      elements.push(
        <div key={i} className="flex gap-3 mb-1.5">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs flex items-center justify-center font-bold mt-0.5">
            {num[1]}
          </span>
          <p className="text-white/85 text-sm leading-relaxed flex-1">
            {renderInline(num[2])}
          </p>
        </div>
      );
    }
    // Bullet list
    else if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <div key={i} className="flex gap-2.5 mb-1.5">
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400/60 mt-2" />
          <p className="text-white/85 text-sm leading-relaxed flex-1">
            {renderInline(line.slice(2))}
          </p>
        </div>
      );
    }
    // Horizontal rule
    else if (line.startsWith('---') || line.startsWith('───')) {
      elements.push(<hr key={i} className="border-white/[0.08] my-3" />);
    }
    // Empty line
    else if (line.trim() === '') {
      if (i > 0 && lines[i - 1].trim() !== '') {
        elements.push(<div key={i} className="h-2" />);
      }
    }
    // Normal paragraph
    else {
      elements.push(
        <p key={i} className="text-white/85 text-sm leading-relaxed mb-1.5">
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ── Cursor blink ───────────────────────────────────────────────────────────────
function StreamingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      className="inline-block w-[2px] h-[14px] bg-purple-400 ml-0.5 align-middle rounded-full"
    />
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BrainPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  useEffect(() => {
    if (isStreaming) scrollToBottom();
  }, [streamingText, isStreaming, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Show scroll-to-bottom button
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 120);
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;
    setError(null);
    setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: content.trim() }];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/admin/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content ?? '';
            full += delta;
            setStreamingText(full);
          } catch {}
        }
      }

      setMessages([...newMessages, { role: 'assistant', content: full }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsStreaming(false);
      setStreamingText('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStreamingText('');
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="h-screen flex flex-col bg-[#070710] overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.04] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-black/20 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white/50" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-400/20">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm leading-none">Business Brain</h1>
              <p className="text-white/35 text-xs mt-0.5">Live CRM context · GPT-4o</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/35 hover:text-white/70 border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04] transition-all text-xs font-medium"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto w-full">

          {/* Empty state */}
          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="text-center pt-8 pb-6"
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl" />
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-400/25">
                      <Zap className="w-7 h-7 text-purple-400" />
                    </div>
                  </div>
                </div>
                <h2 className="text-white text-xl font-semibold mb-2">Business Brain</h2>
                <p className="text-white/40 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                  I know your entire business — every rep, applicant, lead, and client — right now. Ask me anything.
                </p>

                {/* Quick prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left max-w-xl mx-auto">
                  {QUICK_PROMPTS.map((qp, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => sendMessage(qp.prompt)}
                      className="group flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-400/25 transition-all text-left"
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">{qp.icon}</span>
                      <span className="text-white/60 group-hover:text-white/85 text-xs leading-relaxed transition-colors">
                        {qp.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message list */}
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* AI avatar */}
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-400/20 flex items-center justify-center mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-purple-600/25 border border-purple-400/20 rounded-tr-sm'
                        : 'bg-white/[0.04] border border-white/[0.07] rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-white/90 text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <div>{renderContent(msg.content)}</div>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-white/60">O</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming message */}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-400/20 flex items-center justify-center mt-0.5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-3 h-3 text-purple-400" />
                  </motion.div>
                </div>
                <div className="max-w-[80%] bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3">
                  {streamingText ? (
                    <>
                      {renderContent(streamingText)}
                      <StreamingCursor />
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 py-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-400/20">
                  <span className="text-red-400 text-xs">{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400/60 hover:text-red-400 text-xs ml-1"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-[88px] right-6 z-20 w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/30 flex items-center justify-center hover:bg-purple-600/50 transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-purple-300" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input bar ── */}
      <div className="relative z-10 px-4 py-4 border-t border-white/[0.06] bg-black/25 backdrop-blur-sm flex-shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your business…"
                disabled={isStreaming}
                rows={1}
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none focus:outline-none focus:border-purple-400/40 focus:bg-white/[0.07] transition-all disabled:opacity-50 leading-relaxed"
                style={{ minHeight: '46px', maxHeight: '140px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 flex items-center justify-center w-[46px] h-[46px] rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-white/20 text-[10px] text-center mt-2">
            Enter to send · Shift+Enter for new line · Reads live CRM data on every message
          </p>
        </form>
      </div>

    </div>
  );
}
