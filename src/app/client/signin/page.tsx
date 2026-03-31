'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/AuthContext';
import { signIn } from '@/lib/firebase/auth';
import { getClientProfile } from '@/lib/firebase/firestore';
import Image from 'next/image';

export default function ClientSignIn() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2">
          <Image src="/CW-logo-white.png" alt="CrftdWeb" width={90} height={25} className="rounded mb-4" />
          <h1 className="text-2xl font-bold text-white">Client Portal</h1>
          <p className="text-sm text-white/40">Sign in to track your project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-40 transition-all"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
