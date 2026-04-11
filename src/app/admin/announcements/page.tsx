'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Megaphone, Loader2, Check, Eye, EyeOff } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/announcement')
      .then((r) => r.json())
      .then((a) => {
        if (a.text) setText(a.text);
        if (a.enabled) setEnabled(a.enabled);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch('/api/admin/announcement', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), enabled }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/40 hover:text-white/70">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-white/50" />
              Announcement Bar
            </h1>
            <p className="text-xs text-white/30">Set a message that appears on every rep&apos;s dashboard</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            {text.trim() && (
              <div className="space-y-2">
                <p className="text-xs text-white/30 uppercase tracking-widest">Preview</p>
                <div className={`rounded-xl px-4 py-3 text-sm text-center font-medium transition-opacity ${enabled ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/5 border border-white/8 text-white/30'}`}>
                  {text}
                </div>
              </div>
            )}

            {/* Text input */}
            <div className="space-y-2">
              <label className="text-xs text-white/30 uppercase tracking-widest">Message</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Power day: hit 50 outreaches today and earn a bonus shoutout"
                rows={3}
                maxLength={280}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
              />
              <p className="text-xs text-white/20 text-right">{text.length}/280</p>
            </div>

            {/* Toggle + Save */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setEnabled(!enabled)}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${
                  enabled
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {enabled ? 'Live' : 'Hidden'}
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !text.trim()}
                className="flex items-center gap-2 bg-white text-black text-sm font-bold px-5 py-2 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saved ? (
                  <Check className="w-4 h-4" />
                ) : null}
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
