'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Loader2 } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function RepApplyPage() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setState('submitting');
    setError('');

    try {
      const res = await fetch('/api/rep-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, location, experience, motivation }),
      });
      const data = await res.json();
      if (data.success) {
        setState('success');
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <main className="pt-20">
        <section className="py-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto text-center"
            >
              <Link href="/" className="inline-block mb-8">
                <Image src="/CW-logo.png" alt="CrftdWeb" width={48} height={48} className="mx-auto" />
              </Link>
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-emerald-500" size={24} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">Application received</h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Thanks {name.split(' ')[0]} — we&apos;ve got your application. If you&apos;re a fit, we&apos;ll be in touch within a few days.
              </p>
              <Link href="/" className="text-sm font-medium underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors">
                Back to CrftdWeb
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-20">
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-14">
              <Link href="/" className="inline-block mb-8">
                <Image src="/CW-logo.png" alt="CrftdWeb" width={48} height={48} className="mx-auto" />
              </Link>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                SALES REP ROLE
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight leading-tight">
                Apply to become a CrftdWeb Rep
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Remote, commission-based, no ceiling. Sell high-quality websites and earn up to 20% per deal.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <span>🏠 Fully remote</span>
                <span>💸 20% commission on Starter</span>
                <span>📈 Career progression</span>
              </div>
            </div>

            <div className="bg-muted/40 border rounded-2xl p-6 md:p-8 mb-8">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">What you&apos;ll be doing</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />Reaching out to small businesses and startups that need a better website</li>
                <li className="flex items-start gap-2"><span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />Qualifying leads and booking them in for a discovery call</li>
                <li className="flex items-start gap-2"><span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />Earning commission on every project you close — from £199 to £999+</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="name">Full name *</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border bg-background hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border bg-background hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="jane@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="07xxx xxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="City, UK"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="experience">Any sales or outreach experience?</label>
                <textarea
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                  placeholder="Previous sales roles, cold outreach, B2B experience, tools you've used…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="motivation">Why do you want this role?</label>
                <textarea
                  id="motivation"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background hover:border-black/20 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                  placeholder="What draws you to this and what you're looking for…"
                />
              </div>

              {state === 'error' && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={state === 'submitting' || !name.trim() || !email.trim()}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {state === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                We review every application personally. You&apos;ll hear back within a few days.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
