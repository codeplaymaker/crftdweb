'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { saveSkill, getSkills, deleteSkill, Skill } from '@/lib/firebase/firestore';

const TOOL_LABELS: Record<string, string> = {
  read_saved_offer: 'Read Saved Offer',
  get_truth_report: 'Get Truth Report',
  save_to_memory: 'Save to Memory',
  read_from_memory: 'Read from Memory',
};

const EXAMPLE_SKILLS = [
  'Help me write persuasive cold emails for SaaS prospects',
  'Remember important facts about my leads and clients',
  'Analyse competitor weaknesses and suggest positioning angles',
  'Create social media content from my offer details',
  'Help me handle common sales objections for high-ticket offers',
];

interface GeneratedSkill {
  name: string;
  trigger: string;
  prompt: string;
  tools: string[];
}

export default function SkillsPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Builder state
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedSkill | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoadingSkills(true);
      try {
        const list = await getSkills(user.uid);
        setSkills(list);
      } catch (e) {
        console.error('Error loading skills:', e);
      } finally {
        setLoadingSkills(false);
      }
    }
    load();
  }, [user]);

  const handleGenerate = async () => {
    if (!description.trim() || generating) return;
    setGenerating(true);
    setGenerated(null);
    setError(null);
    setSaved(false);

    try {
      const token = await user?.getIdToken();
      const res = await fetch('/api/engine/skill-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setGenerated(data.skill);
    } catch {
      setError('Failed to generate skill. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated || !user || saving) return;
    setSaving(true);
    try {
      await saveSkill(user.uid, {
        name: generated.name,
        description,
        trigger: generated.trigger,
        prompt: generated.prompt,
        tools: generated.tools,
      });

      const list = await getSkills(user.uid);
      setSkills(list);
      setSaved(true);
      setGenerated(null);
      setDescription('');
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Error saving skill:', e);
      setError('Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skillId: string) => {
    if (!confirm('Delete this skill? The agents will no longer use it.')) return;
    setDeletingId(skillId);
    try {
      await deleteSkill(skillId);
      setSkills(prev => prev.filter(s => s.id !== skillId));
    } catch (e) {
      console.error('Error deleting skill:', e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Skills Builder
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50"
        >
          Describe a capability in plain English — Engine generates a skill and injects it into your agents automatically.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ─── LEFT: Skill Builder ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-white font-semibold">Create a New Skill</h2>
            </div>

            <div className="space-y-3">
              <label className="text-white/60 text-sm">Describe what you want your agent to be able to do</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.metaKey && handleGenerate()}
                placeholder="e.g. Help me write cold emails that get replies from e-commerce brands..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-yellow-500/50 transition-colors text-sm"
              />
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <p className="text-white/40 text-xs">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_SKILLS.map(ex => (
                  <button
                    key={ex}
                    onClick={() => setDescription(ex)}
                    className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 rounded-lg transition-colors"
                  >
                    {ex.length > 40 ? ex.slice(0, 40) + '…' : ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!description.trim() || generating}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Skill
                </>
              )}
            </button>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>

          {/* ─── Generated Preview ─────────────────────────────── */}
          <AnimatePresence>
            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-yellow-400 font-semibold">Generated Skill Preview</h3>
                  <span className="text-xs text-white/40">Review before saving</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-xs mb-1">SKILL NAME</p>
                    <p className="text-white font-medium">{generated.name}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">TRIGGERS</p>
                    <div className="flex flex-wrap gap-1.5">
                      {generated.trigger.split(',').map(t => (
                        <span key={t.trim()} className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-md">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">PROMPT INJECTION</p>
                    <p className="text-white/70 text-sm leading-relaxed bg-white/5 rounded-xl p-3">
                      {generated.prompt}
                    </p>
                  </div>

                  {generated.tools.length > 0 && (
                    <div>
                      <p className="text-white/40 text-xs mb-1">TOOLS ENABLED</p>
                      <div className="flex flex-wrap gap-1.5">
                        {generated.tools.map(t => (
                          <span key={t} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md">
                            {TOOL_LABELS[t] || t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-2.5 bg-yellow-500 text-black font-semibold rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? 'Saving…' : 'Save Skill to Engine'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Skill saved — agents will now use it automatically.
            </motion.div>
          )}
        </motion.div>

        {/* ─── RIGHT: Active Skills ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Active Skills</h2>
            <span className="text-white/40 text-sm">{skills.length} skill{skills.length !== 1 ? 's' : ''}</span>
          </div>

          {loadingSkills ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="p-3 bg-white/5 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-white/40 text-sm">No skills yet</p>
              <p className="text-white/25 text-xs mt-1">Create your first skill to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-yellow-500/20 rounded-lg flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-medium text-sm">{skill.name}</h3>
                    </div>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      disabled={deletingId === skill.id}
                      className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                      title="Delete skill"
                    >
                      {deletingId === skill.id ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="text-white/50 text-xs line-clamp-2">{skill.prompt}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {skill.trigger.split(',').slice(0, 4).map(t => (
                      <span key={t.trim()} className="text-xs px-2 py-0.5 bg-white/5 text-white/40 rounded-md">
                        {t.trim()}
                      </span>
                    ))}
                    {skill.trigger.split(',').length > 4 && (
                      <span className="text-xs px-2 py-0.5 text-white/30 rounded-md">
                        +{skill.trigger.split(',').length - 4} more
                      </span>
                    )}
                  </div>

                  {skill.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {skill.tools.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-purple-500/15 text-purple-400 rounded-md">
                          {TOOL_LABELS[t] || t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* How it works */}
          <div className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-2">
            <p className="text-white/40 text-xs font-medium uppercase tracking-wide">How Skills Work</p>
            <ul className="space-y-1.5 text-white/40 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">1.</span>
                You describe a capability in plain English
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">2.</span>
                Engine generates a structured skill with triggers and a prompt injection
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">3.</span>
                When you chat with any agent, matching skills are automatically activated
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">4.</span>
                Skills that need tools (like memory) execute actions automatically
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
