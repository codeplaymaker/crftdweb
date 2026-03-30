'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const AGENT_LABELS: Record<string, string> = {
  'vsl-builder': 'VSL Builder',
  'ads-architect': 'Ads Architect',
  'offer-architect': 'Offer Architect',
  'sales-asset': 'Sales Asset Architect',
  'landing-page': 'Landing Page Copywriter',
  'research-agent': 'Research Agent',
  'niche-architect': 'Niche Architect',
  'category-architect': 'Category Architect',
};

interface SharedDeliverable {
  id: string;
  title: string;
  content: string;
  agentId: string;
  createdAt: { seconds: number } | null;
  refinementOfTitle: string | null;
}

export default function SharePage() {
  const params = useParams();
  const id = params.id as string;

  const [deliverable, setDeliverable] = useState<SharedDeliverable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public/deliverable/${id}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Not found');
          return;
        }
        const data = await res.json();
        setDeliverable(data);
      } catch {
        setError('Failed to load deliverable');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCopy = () => {
    if (!deliverable) return;
    navigator.clipboard.writeText(deliverable.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !deliverable) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-4">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center max-w-md">
          <p className="text-red-400 font-medium mb-1">Deliverable not available</p>
          <p className="text-white/40 text-sm">{error}</p>
        </div>
        <Link href="/engine" className="text-purple-400 text-sm hover:underline">
          Create your own with Engine →
        </Link>
      </div>
    );
  }

  const date = deliverable.createdAt
    ? new Date(deliverable.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/engine" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="text-white/70 text-sm font-semibold">Engine</span>
        </Link>
        <span className="text-white/30 text-xs">Shared deliverable</span>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="mb-8">
          {deliverable.refinementOfTitle && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/15 border border-purple-500/25 rounded-full text-purple-400 text-xs mb-4">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refined deliverable
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
            {deliverable.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs px-2.5 py-1 bg-white/10 text-white/60 rounded-full">
              {AGENT_LABELS[deliverable.agentId] || deliverable.agentId}
            </span>
            {date && <span className="text-white/30 text-xs">{date}</span>}
          </div>
        </div>

        {/* Copy button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 rounded-xl text-sm transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        {/* Deliverable content */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="prose prose-invert max-w-none text-white/85 leading-relaxed">
            <ReactMarkdown>{deliverable.content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm mb-3">Generated with Engine — AI execution for agencies</p>
          <Link
            href="/engine"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Build yours with Engine →
          </Link>
        </div>
      </div>
    </div>
  );
}
