'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getPlaybookProgress, PlaybookProgress } from '@/lib/firebase/firestore';

const moduleDefinitions = [
  {
    name: 'Diagnose',
    description: 'Assess your current business stage',
    href: '/playbook/diagnose',
    icon: '🔍',
    color: 'from-red-500/20 to-red-600/10',
    border: 'border-red-500/20',
    key: 'diagnose',
  },
  {
    name: 'Prescribe',
    description: 'Get your personalized action plan',
    href: '/playbook/prescribe',
    icon: '💊',
    color: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/20',
    key: 'prescribe',
  },
  {
    name: 'Track',
    description: 'Monitor milestones & proof of work',
    href: '/playbook/track',
    icon: '📊',
    color: 'from-yellow-500/20 to-yellow-600/10',
    border: 'border-yellow-500/20',
    key: 'track',
  },
  {
    name: 'Systemize',
    description: 'Build your 7 business systems',
    href: '/playbook/systemize',
    icon: '⚙️',
    color: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/20',
    key: 'systemize',
  },
  {
    name: 'Productize',
    description: 'Package skills into scalable offers',
    href: '/playbook/productize',
    icon: '📦',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
    key: 'productize',
  },
  {
    name: 'Prove',
    description: 'Build proof & price loop',
    href: '/playbook/prove',
    icon: '🏆',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/20',
    key: 'prove',
  },
  {
    name: 'Scale',
    description: 'Divorce time from money',
    href: '/playbook/scale',
    icon: '🚀',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/20',
    key: 'scale',
  },
];

const stages = [
  { number: 1, name: 'Mindset', color: 'bg-red-500' },
  { number: 2, name: 'Skill', color: 'bg-orange-500' },
  { number: 3, name: 'Process', color: 'bg-yellow-500' },
  { number: 4, name: 'Reputation', color: 'bg-green-500' },
  { number: 5, name: 'Product', color: 'bg-blue-500' },
  { number: 6, name: 'Authority', color: 'bg-emerald-500' },
];

function getStageNumber(stageName: string): number {
  const map: Record<string, number> = {
    'Mindset': 1, 'Skill': 2, 'Process': 3, 'Reputation': 4, 'Product': 5, 'Authority': 6
  };
  return map[stageName] || 0;
}

function computeFreedomScore(streams: PlaybookProgress['streams']): number {
  if (!streams || streams.length === 0) return 0;
  const totalRevenue = streams.reduce((sum, s) => sum + s.monthlyRevenue, 0);
  if (totalRevenue === 0) return 0;
  const leveragedPercent = Math.round((streams.filter(s => s.type === 'leveraged').reduce((sum, s) => sum + s.monthlyRevenue, 0) / totalRevenue) * 100);
  const passivePercent = Math.round((streams.filter(s => s.type === 'passive').reduce((sum, s) => sum + s.monthlyRevenue, 0) / totalRevenue) * 100);
  return Math.min(100, Math.round(((leveragedPercent * 0.7 + passivePercent * 1.0) / 100) * 100));
}

export default function PlaybookDashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<PlaybookProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getPlaybookProgress(user.uid).then(data => {
        setProgress(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Compute stats from real data
  const modulesVisited = progress?.modulesVisited || [];
  const modulesStarted = modulesVisited.length;
  const totalModules = 7;

  const milestoneValues = progress?.milestones ? Object.values(progress.milestones) : [];
  const milestonesHit = milestoneValues.filter(Boolean).length;
  const totalMilestones = 18;

  const systemStatuses = progress?.systemStatuses || {};
  const systemsBuilt = Object.values(systemStatuses).filter(s => s === 'operational').length;
  const totalSystems = 7;

  const freedomScore = computeFreedomScore(progress?.streams || []);

  const currentStageNumber = progress?.diagnosisStage ? getStageNumber(progress.diagnosisStage) : 0;
  const currentStageName = progress?.diagnosisStage || '';

  const getModuleStatus = (key: string): 'not-started' | 'in-progress' | 'completed' => {
    if (key === 'diagnose' && progress?.diagnosisComplete) return 'completed';
    if (modulesVisited.includes(key)) return 'in-progress';
    return 'not-started';
  };

  const getRecommendations = () => {
    const recommendations = [];
    if (!progress?.diagnosisComplete) {
      recommendations.push({ text: 'Complete your business diagnosis', href: '/playbook/diagnose', tag: 'Start here' });
    }
    if (systemsBuilt === 0) {
      recommendations.push({ text: 'Build your first business system', href: '/playbook/systemize', tag: 'High impact' });
    }
    if (!modulesVisited.includes('productize')) {
      recommendations.push({ text: 'Map your skill → result path', href: '/playbook/productize', tag: 'Quick win' });
    }
    if (milestonesHit === 0 && modulesVisited.includes('diagnose')) {
      recommendations.push({ text: 'Start tracking your milestones', href: '/playbook/track', tag: 'Next step' });
    }
    if (progress?.diagnosisComplete && !modulesVisited.includes('prescribe')) {
      recommendations.push({ text: 'Get your personalized action plan', href: '/playbook/prescribe', tag: 'Recommended' });
    }
    if (recommendations.length === 0) {
      recommendations.push(
        { text: 'Review your milestone progress', href: '/playbook/track', tag: 'Keep going' },
        { text: 'Collect more proof for your work', href: '/playbook/prove', tag: 'Compound' },
        { text: 'Optimize your revenue streams', href: '/playbook/scale', tag: 'Level up' },
      );
    }
    return recommendations.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">Your Playbook</h1>
        <p className="text-white/50">Track your journey from trading time for money to building scalable value.</p>
      </motion.div>

      {/* Stage Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-white font-semibold mb-4">Stage Progress</h2>
        <div className="flex items-center gap-2 mb-4">
          {stages.map((stage) => (
            <div key={stage.number} className="flex-1 relative group">
              <div className={`h-2 rounded-full ${stage.number <= currentStageNumber ? stage.color : 'bg-white/10'}`} />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white/50 text-xs whitespace-nowrap">{stage.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-8">
          {currentStageName ? (
            <p className="text-white/40 text-sm">Currently in <span className="text-orange-400 font-medium">Stage {currentStageNumber}: {currentStageName}</span></p>
          ) : (
            <p className="text-white/40 text-sm">Take the assessment to discover your stage</p>
          )}
          <Link href="/playbook/diagnose" className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
            {progress?.diagnosisComplete ? 'Retake Assessment →' : 'Start Assessment →'}
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Modules Started', value: `${modulesStarted}/${totalModules}`, color: 'text-white' },
          { label: 'Systems Built', value: `${systemsBuilt}/${totalSystems}`, color: 'text-yellow-400' },
          { label: 'Milestones Hit', value: `${milestonesHit}/${totalMilestones}`, color: 'text-emerald-400' },
          { label: 'Freedom Score', value: `${freedomScore}`, color: 'text-emerald-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <p className="text-white/50 text-sm mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-white font-semibold mb-4">Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleDefinitions.map((module, index) => {
            const status = getModuleStatus(module.key);
            return (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Link href={module.href}>
                  <div className={`bg-gradient-to-br ${module.color} border ${module.border} rounded-xl p-5 hover:scale-[1.02] transition-transform cursor-pointer`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{module.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        status === 'not-started' 
                          ? 'bg-white/5 text-white/40' 
                          : status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {status === 'not-started' ? 'Not started' : status === 'completed' ? 'Complete' : 'In progress'}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{module.name}</h3>
                    <p className="text-white/50 text-sm">{module.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6"
      >
        <h2 className="text-white font-semibold mb-4">Recommended Next Steps</h2>
        <div className="space-y-3">
          {getRecommendations().map((action) => (
            <Link key={action.text} href={action.href}>
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/80 text-sm">{action.text}</span>
                </div>
                <span className="text-emerald-400/60 text-xs">{action.tag}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
