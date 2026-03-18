'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { updateUserProfile } from '@/lib/firebase/firestore';
import { updateProfile, deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc, getFirestore } from 'firebase/firestore';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    reports: true,
    marketing: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.displayName || '');
      setEmail(user?.email || '');
      // Load saved notification preferences
      if (profile.notifications) {
        setNotifications(profile.notifications);
      }
    } else if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update Firebase Auth display name
      await updateProfile(user, { displayName: name });
      // Update Firestore profile
      await updateUserProfile(user.uid, { displayName: name });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const toggleNotification = async (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    if (user) {
      try {
        await updateUserProfile(user.uid, { notifications: updated });
      } catch {
        // Silently revert on error
        setNotifications(notifications);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'engine_users', user.uid));
      await firebaseDeleteUser(user);
      router.push('/engine');
    } catch {
      // If re-auth is needed, sign out and redirect
      await signOut();
      router.push('/engine/signin');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
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
                {name?.[0] || email?.[0] || 'U'}
              </span>
            </div>
            <div>
              <button 
                onClick={handleAvatarClick}
                className="text-purple-400 text-sm hover:text-purple-300"
              >
                Change avatar
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Upload to Firebase Storage when configured
                    toast('Avatar upload coming soon.');
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white/50 placeholder-white/40 focus:outline-none cursor-not-allowed"
            />
            <p className="text-white/30 text-xs mt-1">Email cannot be changed from settings.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
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
            { key: 'email' as const, label: 'Email notifications', description: 'Get notified about new features and updates' },
            { key: 'reports' as const, label: 'Report notifications', description: 'Get notified when reports are ready' },
            { key: 'marketing' as const, label: 'Marketing emails', description: 'Receive tips and best practices' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-white/50 text-sm">{item.description}</p>
              </div>
              <button 
                onClick={() => toggleNotification(item.key)}
                className={`w-12 h-6 rounded-full relative transition-colors ${notifications[item.key] ? 'bg-purple-500' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.key] ? 'right-1' : 'left-1'}`} />
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
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-white font-medium mb-2">Are you sure?</p>
            <p className="text-white/50 text-sm mb-4">This action cannot be undone. All your data, reports, and offers will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
