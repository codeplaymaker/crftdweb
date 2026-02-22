'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ModuleHeader, MilestoneProgressFlow, ConsistencyPattern } from '@/components/playbook/visuals';

interface Milestone {
  id: string;
  stage: string;
  title: string;
  completed: boolean;
}

interface WeeklyMetric {
  week: string;
  revenue: number;
  content: number;
  proof: number;
  systems: number;
}

const defaultMilestones: Milestone[] = [
  // Mindset
  { id: 'm1', stage: 'Mindset', title: 'Calculated burn rate and runway', completed: false },
  { id: 'm2', stage: 'Mindset', title: 'Launched public project under own name', completed: false },
  { id: 'm3', stage: 'Mindset', title: 'Audited limiting beliefs (written)', completed: false },
  // Skill
  { id: 's1', stage: 'Skill', title: 'Completed 3 paid client projects', completed: false },
  { id: 's2', stage: 'Skill', title: 'Built 3 permissionless portfolio pieces', completed: false },
  { id: 's3', stage: 'Skill', title: 'Identified primary value type delivered', completed: false },
  // Process
  { id: 'p1', stage: 'Process', title: 'Named and documented core process', completed: false },
  { id: 'p2', stage: 'Process', title: 'Created first productized service package', completed: false },
  { id: 'p3', stage: 'Process', title: 'Built "problem language" document (10+ ways)', completed: false },
  // Reputation
  { id: 'r1', stage: 'Reputation', title: 'Published content for 30 consecutive days', completed: false },
  { id: 'r2', stage: 'Reputation', title: 'Collected 10+ testimonials systematically', completed: false },
  { id: 'r3', stage: 'Reputation', title: 'Generated first inbound lead from content', completed: false },
  // Product
  { id: 'pr1', stage: 'Product', title: 'Launched a digital product', completed: false },
  { id: 'pr2', stage: 'Product', title: 'Created 3-tier offer stack', completed: false },
  { id: 'pr3', stage: 'Product', title: 'Achieved 20%+ passive/semi-passive income', completed: false },
  // Authority
  { id: 'a1', stage: 'Authority', title: '3+ revenue streams active', completed: false },
  { id: 'a2', stage: 'Authority', title: '50%+ income is leveraged (not hourly)', completed: false },
  { id: 'a3', stage: 'Authority', title: 'Ecosystem flywheel running autonomously', completed: false },
];

const sampleMetrics: WeeklyMetric[] = [
  { week: 'W1', revenue: 0, content: 2, proof: 0, systems: 0 },
  { week: 'W2', revenue: 500, content: 3, proof: 1, systems: 0 },
  { week: 'W3', revenue: 500, content: 5, proof: 1, systems: 1 },
  { week: 'W4', revenue: 1200, content: 5, proof: 2, systems: 1 },
  { week: 'W5', revenue: 1200, content: 7, proof: 3, systems: 2 },
  { week: 'W6', revenue: 2000, content: 7, proof: 4, systems: 2 },
  { week: 'W7', revenue: 2500, content: 8, proof: 5, systems: 3 },
  { week: 'W8', revenue: 3000, content: 10, proof: 6, systems: 3 },
];

export default function TrackPage() {
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [activeStageFilter, setActiveStageFilter] = useState<string | null>(null);
  const [showAddProof, setShowAddProof] = useState(false);
  const [proofEntries, setProofEntries] = useState<{ title: string; type: string; date: string }[]>([
    { title: 'Client website launched — 3x traffic increase', type: 'Case Study', date: '2026-02-20' },
    { title: 'Testimonial from ABC Corp', type: 'Testimonial', date: '2026-02-18' },
  ]);

  const stages = ['Mindset', 'Skill', 'Process', 'Reputation', 'Product', 'Authority'];
  const filteredMilestones = activeStageFilter 
    ? milestones.filter(m => m.stage === activeStageFilter)
    : milestones;

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const overallProgress = (completedCount / totalCount) * 100;

  const toggleMilestone = (id: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  // 80/20 calculation
  const highLeverageHours = 8; // example
  const totalHours = 40; // example
  const leverageRatio = Math.round((highLeverageHours / totalHours) * 100);

  return (
    <section className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <ModuleHeader
            tag="TRACK"
            title="Progress Tracker"
            subtitle="Monitor milestones, proof-of-work, revenue metrics, and content output."
          />

          {/* Stage Milestone Overview Visual */}
          <MilestoneProgressFlow
            stageCompletions={stages.map(s => ({
              stage: s,
              completed: milestones.filter(m => m.stage === s && m.completed).length,
              total: milestones.filter(m => m.stage === s).length,
            }))}
            className="mb-12"
          />

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-white/50 text-sm mb-1">Milestones</p>
              <p className="text-white text-2xl font-bold">{completedCount}/{totalCount}</p>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full" style={{ width: `${overallProgress}%` }} />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-white/50 text-sm mb-1">Proof Items</p>
              <p className="text-white text-2xl font-bold">{proofEntries.length}</p>
              <p className="text-emerald-400 text-xs mt-2">+1 this week</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-white/50 text-sm mb-1">Content Output</p>
              <p className="text-white text-2xl font-bold">10</p>
              <p className="text-emerald-400 text-xs mt-2">pieces this week</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-white/50 text-sm mb-1">80/20 Ratio</p>
              <p className="text-white text-2xl font-bold">{leverageRatio}%</p>
              <p className={`text-xs mt-2 ${leverageRatio >= 20 ? 'text-emerald-400' : 'text-orange-400'}`}>
                {leverageRatio >= 20 ? 'On target' : 'Needs improvement'}
              </p>
            </motion.div>
          </div>

          {/* Revenue Chart (Simple bar visualization) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Consistency Pattern</h3>
            <p className="text-white/40 text-sm mb-4">Building streaks compounds your results. Track your daily output.</p>
            <ConsistencyPattern />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-6">Weekly Revenue Trend</h3>
            <div className="flex items-end gap-2 h-40">
              {sampleMetrics.map((metric, index) => {
                const maxRevenue = Math.max(...sampleMetrics.map(m => m.revenue));
                const height = maxRevenue > 0 ? (metric.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={metric.week} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-white/50 text-xs">${metric.revenue.toLocaleString()}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 4)}%` }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg min-h-[4px]"
                    />
                    <span className="text-white/40 text-xs">{metric.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Milestones */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Stage Milestones</h3>
                </div>

                {/* Stage filter pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setActiveStageFilter(null)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                      !activeStageFilter ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {stages.map(s => (
                    <button
                      key={s}
                      onClick={() => setActiveStageFilter(s)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                        activeStageFilter === s ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredMilestones.map((milestone) => (
                    <button
                      key={milestone.id}
                      onClick={() => toggleMilestone(milestone.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        milestone.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                      }`}>
                        {milestone.completed && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${milestone.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                          {milestone.title}
                        </p>
                      </div>
                      <span className="text-white/30 text-xs">{milestone.stage}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Proof of Work Sidebar */}
            <div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Proof of Work</h3>
                  <button
                    onClick={() => setShowAddProof(!showAddProof)}
                    className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
                  >
                    + Add
                  </button>
                </div>

                {showAddProof && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="What did you accomplish?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                    />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                      <option value="case-study" className="bg-black">Case Study</option>
                      <option value="testimonial" className="bg-black">Testimonial</option>
                      <option value="revenue" className="bg-black">Revenue Milestone</option>
                      <option value="content" className="bg-black">Content Published</option>
                      <option value="system" className="bg-black">System Built</option>
                    </select>
                    <button className="w-full bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                      Save Proof
                    </button>
                  </motion.div>
                )}

                <div className="space-y-3">
                  {proofEntries.map((entry, index) => (
                    <div key={index} className="border-b border-white/5 pb-3 last:border-0">
                      <p className="text-white text-sm">{entry.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-emerald-400/60 text-xs bg-emerald-400/10 px-2 py-0.5 rounded-full">{entry.type}</span>
                        <span className="text-white/30 text-xs">{entry.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 80/20 Tracker */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4">
                <h3 className="text-white font-semibold mb-4">80/20 Principle</h3>
                <p className="text-white/50 text-sm mb-4">
                  Spend 20% of your day building systems to handle 80% of your work.
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-400">System building</span>
                      <span className="text-white/50">20%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Execution</span>
                      <span className="text-white/50">80%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-white/30 h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>
                <p className="text-white/30 text-xs mt-3">Target: Increase system-building time each week</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <Link
              href="/playbook/diagnose"
              className="text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              Retake assessment to update your stage →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
