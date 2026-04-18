'use client';

import { useState } from 'react';
import Image from 'next/image';

const EMPTY_ENTRY = { business: '', url: '', diagnosis: '' };

export default function TrialTaskPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [entries, setEntries] = useState(Array.from({ length: 5 }, () => ({ ...EMPTY_ENTRY })));
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function updateEntry(i: number, field: keyof typeof EMPTY_ENTRY, value: string) {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/trial-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), entries }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('done');
      }
    } catch {
      setErrorMsg('Network error — please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Task submitted</h1>
            <p className="text-white/50 text-sm leading-relaxed">
              We&apos;ve received your entries. If your task passes review, we&apos;ll be in touch within 48 hours to book a screening call.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        {/* Header */}
        <div className="space-y-6">
          <Image src="/CW-logo-white.png" alt="CrftdWeb" width={100} height={28} className="rounded" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Trial Task Submission</h1>
            <p className="text-white/50 text-sm leading-relaxed">
              Find 5 UK businesses with a bad website. For each one, write one specific sentence explaining
              why it needs a redesign — not &quot;it looks old&quot;, but something concrete.
            </p>
          </div>

          {/* Examples */}
          <div className="bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">Good examples</p>
            {[
              'No clear call-to-action — visitors land on the page with no way to enquire or book',
              'Hero section is a blurry stock photo with no headline — you can\'t tell what they sell',
              'Contact form is buried three clicks deep — nobody\'s filling that out',
            ].map((ex, i) => (
              <div key={i} className="flex gap-3 text-sm text-white/50">
                <span className="text-white/20 shrink-0">→</span>
                <span className="italic">&ldquo;{ex}&rdquo;</span>
              </div>
            ))}
          </div>

          {/* How to find businesses */}
          <div className="bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 space-y-3">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">How to find businesses</p>
            <p className="text-sm text-white/40 leading-relaxed">Search Google for local UK businesses in any industry — trades, salons, gyms, restaurants, tutors, accountants. Look at their website and ask yourself: would a stranger know what to do next?</p>
            <div className="space-y-2 pt-1">
              {[
                { label: 'Google search', tip: '"plumber Bristol" or "electrician Manchester" — click the small business websites, not the directories' },
                { label: 'Google Maps', tip: 'Search any trade or service, click a business, then visit their website link' },
                { label: 'What to look for', tip: 'No phone number visible, no booking button, no photos, confusing layout, broken links, text-only pages' },
              ].map(({ label, tip }) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="text-white/60 font-semibold shrink-0 w-28">{label}</span>
                  <span className="text-white/30">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What makes a good diagnosis */}
          <div className="bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1">What makes a good diagnosis</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-[10px] text-emerald-400/70 uppercase tracking-wider font-semibold">✓ Do this</p>
                {[
                  'Be specific about what\'s missing or broken',
                  'Explain the impact (lost bookings, confused visitors)',
                  'One clear sentence per business',
                ].map(t => <p key={t} className="text-xs text-white/40">{t}</p>)}
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-red-400/70 uppercase tracking-wider font-semibold">✗ Avoid this</p>
                {[
                  '"The website looks outdated" — too vague',
                  '"Needs better SEO" — not observable from the site',
                  'Copying the examples above word for word',
                ].map(t => <p key={t} className="text-xs text-white/40">{t}</p>)}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Name */}
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-2">Your name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="First and last name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-2">Your email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* 5 entries */}
          <div className="space-y-6">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Your 5 businesses</p>
            {entries.map((entry, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/8 rounded-xl p-5 space-y-4">
                <p className="text-xs font-semibold text-white/40">Business {i + 1}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/25 uppercase tracking-widest mb-1.5">Business name</label>
                    <input
                      type="text"
                      required
                      value={entry.business}
                      onChange={e => updateEntry(i, 'business', e.target.value)}
                      placeholder="e.g. Smiths Plumbing Ltd"
                      className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/25 uppercase tracking-widest mb-1.5">Website URL</label>
                    <input
                      type="url"
                      required
                      value={entry.url}
                      onChange={e => updateEntry(i, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-white/25 uppercase tracking-widest mb-1.5">One-sentence diagnosis</label>
                  <input
                    type="text"
                    required
                    value={entry.diagnosis}
                    onChange={e => updateEntry(i, 'diagnosis', e.target.value)}
                    placeholder="Why does this business need a new website?"
                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          {status === 'error' && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-40 transition-all"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit task'}
          </button>
        </form>
      </div>
    </div>
  );
}
