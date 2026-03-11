'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      if (message.includes('user-not-found')) {
        setError('No account found with this email address.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/50 text-sm">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-medium">Check your inbox</p>
              <p className="text-white/50 text-sm">
                We sent a password reset link to <span className="text-white">{email}</span>
              </p>
              <Link
                href="/engine/signin"
                className="inline-block mt-4 text-purple-400 text-sm hover:text-purple-300 transition-colors"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-white/40 text-sm">
                Remember your password?{' '}
                <Link href="/engine/signin" className="text-purple-400 hover:text-purple-300">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
