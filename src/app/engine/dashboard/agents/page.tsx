'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/lib/firebase/AuthContext';
import { deductCredits, updateUserProfile, saveChatSession, getChatSessions, updateChatSession, ChatSession } from '@/lib/firebase/firestore';

const agents = [
  {
    id: 'offer-architect',
    name: 'Offer Architect',
    description: 'Refine and perfect your high-ticket offer',
    category: 'SALES',
    color: 'green',
    placeholder: 'Describe your target audience and what transformation you want to deliver...',
    contextPlaceholder: 'I can help refine your offer. Ask me about pricing, guarantees, or bonuses.',
    suggestions: [
      "Make my guarantee more compelling",
      "Suggest better bonuses for this offer",
      "Help me justify my pricing",
      "Improve my transformation promise",
      "Write a headline for this offer",
    ],
  },
  {
    id: 'niche-architect',
    name: 'Niche Architect',
    description: 'Validate and refine your niche positioning',
    category: 'RESEARCH',
    color: 'blue',
    placeholder: 'What industry or market are you interested in exploring?',
    contextPlaceholder: 'I can help you validate this niche further. Ask me anything.',
    suggestions: [
      "Is this niche big enough for a premium offer?",
      "What sub-niches should I consider?",
      "Who are the main competitors?",
      "What's the best entry point?",
      "How do I validate demand quickly?",
    ],
  },
  {
    id: 'vsl-builder',
    name: 'VSL Builder OS',
    description: 'Create high-converting Video Sales Letters',
    category: 'CONTENT',
    color: 'orange',
    placeholder: 'Describe your offer and who it\'s for...',
    contextPlaceholder: 'Ready to create a VSL script for your offer.',
    suggestions: [
      "Write a VSL script for my offer",
      "Create a hook that stops the scroll",
      "Write the problem agitation section",
      "Create the offer reveal section",
      "Write a compelling close with urgency",
    ],
  },
  {
    id: 'ads-architect',
    name: 'Ads Architect',
    description: 'Create high-converting ad copy and campaigns',
    category: 'MARKETING',
    color: 'pink',
    placeholder: 'What product/service do you want to advertise?',
    contextPlaceholder: 'Ready to create ads for your offer.',
    suggestions: [
      "Write 5 Facebook ad hooks for my offer",
      "Create a YouTube ad script",
      "Suggest targeting audiences",
      "Write ad copy variations to test",
      "Create a retargeting campaign",
    ],
  },
  {
    id: 'category-architect',
    name: 'Category Architect',
    description: 'Build market categories and positioning',
    category: 'STRATEGY',
    color: 'purple',
    placeholder: 'Describe your business and what makes it unique...',
    contextPlaceholder: 'I can help position your offer as a category leader.',
    suggestions: [
      "Help me create a new category",
      "What's my unique positioning angle?",
      "How do I stand out from competitors?",
      "Write my category story",
      "Create my 'only we' statement",
    ],
  },
  {
    id: 'sales-asset',
    name: 'Sales Asset Architect',
    description: 'Transform content into marketing assets',
    category: 'SALES',
    color: 'green',
    placeholder: 'Paste your call transcript, video transcript, or raw content...',
    contextPlaceholder: 'I can create marketing assets from your offer details.',
    suggestions: [
      "Create 5 LinkedIn posts from my offer",
      "Write an email sequence to sell this",
      "Create a case study template",
      "Turn this into social proof content",
      "Write testimonial request scripts",
    ],
  },
  {
    id: 'landing-page',
    name: 'Landing Page Copywriter',
    description: 'Expert direct response copy for high-converting pages',
    category: 'CONTENT',
    color: 'orange',
    placeholder: 'Describe your offer, target audience, and desired action...',
    contextPlaceholder: 'Ready to write landing page copy for your offer.',
    suggestions: [
      "Write the hero section for my landing page",
      "Create the benefits section",
      "Write the FAQ section",
      "Create the pricing section copy",
      "Write social proof sections",
    ],
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'Comprehensive business research and intelligence',
    category: 'RESEARCH',
    color: 'blue',
    placeholder: 'What do you want to research? Be specific about your questions...',
    contextPlaceholder: 'I can research competitors and market trends for your niche.',
    suggestions: [
      "Research my top 5 competitors",
      "What are the market trends in this niche?",
      "Find case studies of similar offers",
      "What objections will buyers have?",
      "Research pricing in this market",
    ],
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  SALES: { bg: 'bg-green-500/20', text: 'text-green-400' },
  RESEARCH: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  CONTENT: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  MARKETING: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  STRATEGY: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function generateMockResponse(agentId: string, userMessage: string): string {
  const responses: Record<string, string> = {
    'offer-architect': `Based on your input, here's a high-ticket offer framework:

**Offer Name:** The [Transformation] Accelerator

**Target Price:** $4,997 - $7,497

**Core Promise:** Help [target audience] achieve [specific outcome] in [timeframe]

**Offer Stack:**
1. **Core Training** - 8-week implementation program
2. **Weekly Coaching Calls** - Live Q&A and hot seats
3. **Private Community** - 24/7 support and networking
4. **Done-For-You Templates** - Swipe files and frameworks
5. **Bonus: 1:1 Strategy Session** - Personalized roadmap

**Guarantee:** 100% results or we work with you until you get them

Would you like me to elaborate on any of these elements?`,

    'niche-architect': `Here's my analysis of your niche opportunity:

**Market Overview:**
- Total Addressable Market: $2.3B
- Annual Growth Rate: 18%
- Competition Level: Medium

**Top Pain Points:**
1. Struggling to acquire quality clients
2. Unable to scale beyond 1:1 work
3. No predictable revenue system

**Recommended Sub-Niche:**
Focus on [specific segment] because they have:
- Higher willingness to pay
- Clearer buying triggers
- Less competition

**Next Steps:**
1. Validate with 5-10 discovery calls
2. Test messaging on social media
3. Create a minimum viable offer

Want me to help you craft discovery call questions?`,

    'vsl-builder': `Here's your VSL script outline:

**Hook (0-30 sec):**
"If you're a [target audience] who wants [outcome] without [pain point], this might be the most important video you watch this year..."

**Problem (30 sec - 2 min):**
- Agitate the pain
- Show you understand them
- Share why typical solutions fail

**Solution (2-5 min):**
- Introduce your unique mechanism
- Share your story/credibility
- Present the transformation

**Proof (5-7 min):**
- Case studies
- Testimonials
- Results

**Offer (7-10 min):**
- Present the full stack
- Price anchor and reveal
- Guarantee
- Call to action

Would you like me to write out any section in full?`,

    'default': `I've analyzed your request. Here are my recommendations:

**Key Insights:**
1. Your target market shows strong demand signals
2. There's a clear gap in current solutions
3. Premium positioning is viable

**Recommended Actions:**
1. Start with a minimum viable offer
2. Test messaging with your audience
3. Iterate based on feedback

**Next Steps:**
- I can help you dive deeper into any of these areas
- Let me know which aspect you'd like to explore further

What would you like to focus on next?`
  };

  return responses[agentId] || responses['default'];
}

export default function AgentsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [offerContext, setOfferContext] = useState<{
    name?: string;
    niche?: string;
    targetAudience?: string;
    transformation?: string;
    price?: number;
    deliverables?: string[];
    bonuses?: string[];
    guarantee?: string;
  } | null>(null);

  // Load chat sessions when agent is selected
  useEffect(() => {
    async function fetchSessions() {
      if (!user || !selectedAgent) return;
      setLoadingSessions(true);
      try {
        const sessions = await getChatSessions(user.uid, selectedAgent.id);
        setChatSessions(sessions);
      } catch (e) {
        console.error('Error fetching chat sessions:', e);
      } finally {
        setLoadingSessions(false);
      }
    }
    fetchSessions();
  }, [user, selectedAgent]);

  // Load offer context from localStorage on mount
  useEffect(() => {
    const savedContext = localStorage.getItem('currentOfferContext');
    if (savedContext) {
      try {
        const parsed = JSON.parse(savedContext);
        setOfferContext(parsed);
        // Clear after loading so it doesn't persist between sessions
        localStorage.removeItem('currentOfferContext');
      } catch (e) {
        console.error('Error parsing offer context:', e);
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !selectedAgent || !user) return;
    
    // Credits unlimited - no check needed
    
    setError(null);
    const userMessage = input;
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/engine/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          message: userMessage,
          history: messages,
          offerContext: offerContext, // Pass offer context if available
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant' as const, content: data.content };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Save or update chat session
      try {
        if (currentSessionId) {
          // Update existing session
          await updateChatSession(currentSessionId, updatedMessages.map((msg, idx) => ({
            id: `${currentSessionId}-${idx}`,
            agentId: selectedAgent.id,
            role: msg.role,
            content: msg.content,
            createdAt: new Date() as any,
          })));
        } else if (updatedMessages.length >= 2) {
          // Create new session after first exchange
          const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
          const sessionId = await saveChatSession(
            user.uid,
            selectedAgent.id,
            title,
            updatedMessages.map(msg => ({
              agentId: selectedAgent.id,
              role: msg.role,
              content: msg.content,
            }))
          );
          setCurrentSessionId(sessionId);
          // Refresh sessions list
          const sessions = await getChatSessions(user.uid, selectedAgent.id);
          setChatSessions(sessions);
        }
      } catch (saveError) {
        console.error('Error saving chat session:', saveError);
      }
      
      // Credits unlimited - no deduction
      
      // Update agent usage count
      await updateUserProfile(user.uid, {
        agentUsage: (profile?.agentUsage || 0) + 1,
      });
      
      refreshProfile(); // Refresh to update credits display
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAgent = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setMessages([]);
    setCurrentSessionId(null);
    setShowHistory(false);
    setInput('');
  };

  const handleLoadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })));
    setShowHistory(false);
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setShowHistory(false);
    setInput('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          AI Agents
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50"
        >
          Purpose-built AI agents for every business function. Select an agent to get started.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Agent Selection */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold">Select an Agent</h2>
          <div className="space-y-3">
            {agents.map((agent, index) => (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectAgent(agent)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAgent?.id === agent.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[agent.category].bg} ${categoryColors[agent.category].text}`}>
                    {agent.category}
                  </span>
                </div>
                <h3 className="text-white font-medium">{agent.name}</h3>
                <p className="text-white/50 text-sm">{agent.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl h-[600px] flex flex-col relative"
            >
              {/* Agent Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[selectedAgent.category].bg}`}>
                      <svg className={`w-5 h-5 ${categoryColors[selectedAgent.category].text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{selectedAgent.name}</h3>
                      <p className="text-white/50 text-sm">{selectedAgent.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNewChat}
                      className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      + New Chat
                    </button>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-xs px-3 py-1.5 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      History ({chatSessions.length})
                    </button>
                  </div>
                </div>
                {/* Offer Context Banner */}
                {offerContext && (
                  <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-300 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Working with: <strong>{offerContext.name}</strong> ({offerContext.niche})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat History Panel */}
              {showHistory && (
                <div className="absolute inset-0 bg-[#0a0a15]/95 rounded-2xl z-10 p-4 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Chat History</h3>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-white/50 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {loadingSessions ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                  ) : chatSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white/50">No chat history yet</p>
                      <p className="text-white/30 text-sm mt-1">Start a conversation to save it</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chatSessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => handleLoadSession(session)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            currentSessionId === session.id
                              ? 'bg-purple-500/20 border-purple-500/50'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className="text-white text-sm font-medium truncate">{session.title}</p>
                          <p className="text-white/40 text-xs mt-1">
                            {session.messages.length} messages
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className={`w-16 h-16 ${categoryColors[selectedAgent.category].bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <svg className={`w-8 h-8 ${categoryColors[selectedAgent.category].text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    {offerContext ? (
                      <>
                        <h3 className="text-white font-medium mb-2">
                          {selectedAgent.id === 'offer-architect' ? 'Refine Your Offer' : `Use ${selectedAgent.name}`}
                        </h3>
                        <p className="text-white/50 text-sm max-w-md mx-auto mb-4">
                          {selectedAgent.contextPlaceholder || selectedAgent.placeholder}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                          {(selectedAgent.suggestions || []).map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => setInput(suggestion)}
                              className="text-xs px-3 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-white font-medium mb-2">Start a conversation</h3>
                        <p className="text-white/50 text-sm max-w-md mx-auto mb-4">
                          {selectedAgent.placeholder}
                        </p>
                        <p className="text-white/30 text-xs max-w-sm mx-auto">
                          💡 Tip: Run Truth Engine research first, then build an offer to unlock smart suggestions for all agents.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl relative group ${
                        message.role === 'user'
                          ? 'bg-purple-500/30 text-white'
                          : 'bg-white/10 text-white/90'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/10 rounded-lg hover:bg-white/20"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                      {message.role === 'user' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none 
                          prose-headings:text-white prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3
                          prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                          prose-p:text-white/90 prose-p:my-4 prose-p:leading-relaxed
                          prose-li:text-white/90 prose-li:my-1
                          prose-ul:my-4 prose-ol:my-4
                          prose-strong:text-white prose-strong:font-semibold
                          prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-300
                          prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-white/10 prose-pre:my-4
                          [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                          space-y-4">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                {error && (
                  <div className="mb-3 text-red-400 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={selectedAgent.placeholder}
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
                <p className="text-white/30 text-xs mt-2">Unlimited usage</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl h-[600px] flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">Select an Agent</h3>
                <p className="text-white/50 text-sm">Choose an AI agent from the left to start a conversation</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
