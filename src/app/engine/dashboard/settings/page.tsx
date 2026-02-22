'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('engine_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('engine_user', JSON.stringify(user));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50"
        >
          Manage your account and preferences.
        </motion.p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-white font-semibold mb-6">Profile</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center">
              <span className="text-purple-400 text-2xl font-medium">
                {user.name?.[0] || user.email?.[0] || 'U'}
              </span>
            </div>
            <button className="text-purple-400 text-sm hover:text-purple-300">
              Change avatar
            </button>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </motion.div>

      {/* Plan Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Current Plan</h2>
          <span className="bg-purple-500/20 text-purple-400 text-sm font-medium px-3 py-1 rounded-full">
            Free Tier
          </span>
        </div>
        
        <p className="text-white/50 mb-4">
          You&apos;re on the free plan with unlimited credits for testing.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/50">Credits Used</span>
              <span className="text-white">0 / Unlimited</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-white font-semibold mb-6">Notifications</h2>
        
        <div className="space-y-4">
          {[
            { label: 'Email notifications', description: 'Get notified about new features and updates' },
            { label: 'Report notifications', description: 'Get notified when reports are ready' },
            { label: 'Marketing emails', description: 'Receive tips and best practices' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-white/50 text-sm">{item.description}</p>
              </div>
              <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
      >
        <h2 className="text-red-400 font-semibold mb-4">Danger Zone</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Delete Account</p>
            <p className="text-white/50 text-sm">Permanently delete your account and all data</p>
          </div>
          <button className="border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
