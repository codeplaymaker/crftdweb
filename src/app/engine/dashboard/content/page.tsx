'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase';
import { 
  getGeneratedContent, 
  saveGeneratedContent, 
  GeneratedContent as FirestoreContent 
} from '@/lib/firebase/firestore';

interface ContentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'video' | 'copy' | 'design' | 'email';
  estimatedTime: string;
  popular?: boolean;
}

const contentTypes: ContentType[] = [
  {
    id: 'vsl',
    name: 'Video Sales Letter',
    description: 'High-converting VSL script with hooks and CTAs',
    icon: '🎬',
    category: 'video',
    estimatedTime: '~3 min',
    popular: true
  },
  {
    id: 'webinar',
    name: 'Webinar Script',
    description: 'Complete webinar framework with pitch',
    icon: '🎥',
    category: 'video',
    estimatedTime: '~5 min'
  },
  {
    id: 'youtube',
    name: 'YouTube Script',
    description: 'Engaging YouTube video outline',
    icon: '📺',
    category: 'video',
    estimatedTime: '~2 min'
  },
  {
    id: 'facebook-ad',
    name: 'Facebook Ads',
    description: '5 ad variations with different angles',
    icon: '📘',
    category: 'copy',
    estimatedTime: '~2 min',
    popular: true
  },
  {
    id: 'google-ad',
    name: 'Google Ads',
    description: 'Search & display ad copy sets',
    icon: '🔍',
    category: 'copy',
    estimatedTime: '~2 min'
  },
  {
    id: 'linkedin-ad',
    name: 'LinkedIn Ads',
    description: 'B2B ad copy for professionals',
    icon: '💼',
    category: 'copy',
    estimatedTime: '~2 min'
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Full landing page copy with sections',
    icon: '🖥️',
    category: 'design',
    estimatedTime: '~4 min',
    popular: true
  },
  {
    id: 'sales-page',
    name: 'Sales Page',
    description: 'Long-form sales page copy',
    icon: '📄',
    category: 'design',
    estimatedTime: '~5 min'
  },
  {
    id: 'opt-in',
    name: 'Opt-in Page',
    description: 'Lead magnet opt-in page copy',
    icon: '📥',
    category: 'design',
    estimatedTime: '~2 min'
  },
  {
    id: 'email-sequence',
    name: 'Email Sequence',
    description: '7-day nurture email sequence',
    icon: '📧',
    category: 'email',
    estimatedTime: '~4 min',
    popular: true
  },
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    description: 'Onboarding welcome email series',
    icon: '👋',
    category: 'email',
    estimatedTime: '~2 min'
  },
  {
    id: 'cart-abandonment',
    name: 'Cart Abandonment',
    description: '3-email recovery sequence',
    icon: '🛒',
    category: 'email',
    estimatedTime: '~2 min'
  }
];

const categories = [
  { id: 'all', name: 'All Content', icon: '📦' },
  { id: 'video', name: 'Video', icon: '🎬' },
  { id: 'copy', name: 'Ad Copy', icon: '✍️' },
  { id: 'design', name: 'Pages', icon: '🖥️' },
  { id: 'email', name: 'Email', icon: '📧' }
];

interface LocalContent {
  id: string;
  type: string;
  title: string;
  content?: string;
  createdAt: string;
  status: 'complete' | 'generating' | 'error';
}

function ContentCard({ content, onGenerate }: { content: ContentType; onGenerate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl p-6 cursor-pointer group hover:border-purple-500/40 transition-all"
      onClick={onGenerate}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {content.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">{content.name}</h3>
              {content.popular && (
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">Popular</span>
              )}
            </div>
            <p className="text-white/50 text-sm">{content.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {content.estimatedTime}
        </span>
        <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
          <span className="text-sm font-medium">Generate</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

function GenerationModal({ 
  content, 
  onClose, 
  onSubmit,
  generating,
  generatedContent,
  error
}: { 
  content: ContentType; 
  onClose: () => void;
  onSubmit: (input: string) => void;
  generating: boolean;
  generatedContent: string | null;
  error: string | null;
}) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/30 rounded-2xl p-6 w-full ${
          generatedContent ? 'max-w-4xl max-h-[90vh] overflow-y-auto' : 'max-w-lg'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center text-2xl">
              {content.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{content.name}</h3>
              <p className="text-white/50 text-sm">{content.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {generatedContent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-400 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Content Generated Successfully!</span>
            </div>
            <div className="bg-black/30 rounded-xl p-6 max-h-[50vh] overflow-y-auto">
              <pre className="text-white/80 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {generatedContent}
              </pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(generatedContent)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : generating ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">✨</span>
              </div>
            </div>
            <p className="text-center text-white/70">AI is crafting your {content.name.toLowerCase()}...</p>
            <div className="space-y-2">
              {['Analyzing your offer...', 'Generating compelling hooks...', 'Optimizing for conversion...'].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.5 }}
                  className="flex items-center gap-2 text-white/50 text-sm"
                >
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm block mb-2">
                  Describe your offer or paste your Truth Engine insights
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`E.g., "I help busy executives lose 30 pounds in 90 days through personalized meal plans and accountability coaching. My offer is a $5,000 1-on-1 coaching program..."`}
                  className="w-full h-32 bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-xl">
                <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/60 text-sm">
                  Pro tip: Include your target audience, main promise, and unique mechanism for best results.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Content
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function RecentlyGenerated({ items, onView }: { items: LocalContent[]; onView: (item: LocalContent) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recently Generated</h3>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-8 text-white/40">
          <span className="text-4xl block mb-2">📝</span>
          <p>No content generated yet</p>
          <p className="text-sm">Start by selecting a content type above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <div 
              key={item.id} 
              onClick={() => onView(item)}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                {contentTypes.find(c => c.id === item.type)?.icon || '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{item.title}</p>
                <p className="text-white/40 text-xs">{item.createdAt}</p>
              </div>
              {item.status === 'complete' ? (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Complete</span>
              ) : item.status === 'error' ? (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Error</span>
              ) : (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full animate-pulse">Generating...</span>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function ContentPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedContent, setSelectedContent] = useState<ContentType | null>(null);
  const [generatedItems, setGeneratedItems] = useState<LocalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewingContent, setViewingContent] = useState<LocalContent | null>(null);

  // Load generated content from Firestore
  useEffect(() => {
    async function loadContent() {
      if (!user) return;
      try {
        const content = await getGeneratedContent(user.uid);
        const mapped = content.map(c => ({
          id: c.id,
          type: c.type,
          title: c.title,
          content: c.content,
          createdAt: c.createdAt ? formatTimeAgo(c.createdAt.toDate()) : 'Unknown',
          status: c.status
        }));
        setGeneratedItems(mapped);
      } catch (err) {
        console.error('Failed to load content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [user]);

  const filteredContent = activeCategory === 'all' 
    ? contentTypes 
    : contentTypes.filter(c => c.category === activeCategory);

  // Calculate stats from real data
  const stats = {
    total: generatedItems.filter(i => i.status === 'complete').length,
    vsls: generatedItems.filter(i => i.type === 'vsl' && i.status === 'complete').length,
    ads: generatedItems.filter(i => ['facebook-ad', 'google-ad', 'linkedin-ad'].includes(i.type) && i.status === 'complete').length,
    emails: generatedItems.filter(i => ['email-sequence', 'welcome-email', 'cart-abandonment'].includes(i.type) && i.status === 'complete').length,
  };

  const handleGenerate = async (input: string) => {
    if (!user || !selectedContent) return;
    
    setGenerating(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const response = await fetch('/api/engine/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedContent.id,
          input,
          userId: user.uid
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      // Save to Firestore
      const title = `${selectedContent.name} - ${input.slice(0, 40)}${input.length > 40 ? '...' : ''}`;
      await saveGeneratedContent(user.uid, {
        type: selectedContent.id as FirestoreContent['type'],
        title,
        input,
        content: data.content,
        status: 'complete'
      });

      // Update local state
      const newItem: LocalContent = {
        id: Date.now().toString(),
        type: selectedContent.id,
        title,
        content: data.content,
        createdAt: 'Just now',
        status: 'complete'
      };
      setGeneratedItems([newItem, ...generatedItems]);
      setGeneratedResult(data.content);

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedContent(null);
    setGeneratedResult(null);
    setError(null);
    setGenerating(false);
  };

  const handleViewContent = (item: LocalContent) => {
    setViewingContent(item);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/engine/dashboard" className="text-white/50 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-white">Content Generator</h1>
          </div>
          <p className="text-white/50">Auto-generate VSLs, ads, emails, and landing pages with AI</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-xl">
            <span className="text-white/50 text-sm">Credits: </span>
            <span className="text-white font-bold">∞</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Content Generated', value: loading ? '...' : stats.total.toString(), icon: '📄' },
          { label: 'VSLs Created', value: loading ? '...' : stats.vsls.toString(), icon: '🎬' },
          { label: 'Ads Written', value: loading ? '...' : stats.ads.toString(), icon: '✍️' },
          { label: 'Emails Crafted', value: loading ? '...' : stats.emails.toString(), icon: '📧' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-white/50 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Types Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContent.map((content) => (
              <ContentCard 
                key={content.id} 
                content={content}
                onGenerate={() => setSelectedContent(content)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RecentlyGenerated items={generatedItems} onView={handleViewContent} />
          
          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Pro Tips
            </h3>
            <div className="space-y-3">
              {[
                'Use Truth Engine insights for better personalization',
                'Generate multiple variations and A/B test',
                'Include specific numbers and timeframes',
                'Focus on transformation, not features'
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/70 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Generation Modal */}
      <AnimatePresence>
        {selectedContent && (
          <GenerationModal
            content={selectedContent}
            onClose={handleCloseModal}
            onSubmit={handleGenerate}
            generating={generating}
            generatedContent={generatedResult}
            error={error}
          />
        )}
      </AnimatePresence>

      {/* View Content Modal */}
      <AnimatePresence>
        {viewingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewingContent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/30 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center text-2xl">
                    {contentTypes.find(c => c.id === viewingContent.type)?.icon || '📄'}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{viewingContent.title}</h3>
                    <p className="text-white/50 text-sm">{viewingContent.createdAt}</p>
                  </div>
                </div>
                <button onClick={() => setViewingContent(null)} className="text-white/50 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-black/30 rounded-xl p-6 max-h-[60vh] overflow-y-auto">
                <pre className="text-white/80 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {viewingContent.content || 'Content not available'}
                </pre>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => viewingContent.content && navigator.clipboard.writeText(viewingContent.content)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setViewingContent(null)}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
