'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { signIn, resetPassword } from '@/lib/firebase/auth';
import { getClientProfile } from '@/lib/firebase/firestore';

export default function ClientSignIn() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    if (!email) { setError('Enter your email address first.'); return; }
    setResetting(true);
    setError('');
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch {
      setError('Could not send reset email. Check the address and try again.');
    } finally {
      setResetting(false);
    }
  }

  useEffect(() => {
    if (loading || !user) return;
    getClientProfile(user.uid).then(p => {
      if (p) router.replace('/client/dashboard');
    });
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const u = await signIn(email, password);
      const profile = await getClientProfile(u.uid);
      if (!profile) {
        setError('No client account found for this email.');
        setSubmitting(false);
        return;
      }
      router.replace('/client/dashboard');
    } catch {
      setError('Incorrect email or password.');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center border border-white/15 rounded-lg px-3 py-1.5 mb-3">
            <p className="text-xl font-logo tracking-tight text-white">CW</p>
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Client Portal</p>
        </div>

        <div className="border-t border-white/[0.06] mb-8" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-40"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {resetSent ? (
          <p className="text-center text-xs text-emerald-400 mt-8">Reset link sent — check your inbox.</p>
        ) : (
          <p className="text-center text-xs text-white/20 mt-8">
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="text-white/40 hover:text-white/60 underline disabled:opacity-40"
            >
              {resetting ? 'Sending…' : 'Forgot password?'}
            </button>
            <span className="mx-2">·</span>
            <a href="mailto:admin@crftdweb.com" className="text-white/40 hover:text-white/60 underline">Contact us</a>
          </p>
        )}
      </div>
    </div>
  );
}
