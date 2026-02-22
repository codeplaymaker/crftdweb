'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const modules = [
  {
    name: 'Diagnose',
    description: 'Assess your current business stage',
    href: '/playbook/diagnose',
    icon: '🔍',
    color: 'from-red-500/20 to-red-600/10',
    border: 'border-red-500/20',
    status: 'not-started' as const,
  },
  {
    name: 'Prescribe',
    description: 'Get your personalized action plan',
    href: '/playbook/prescribe',
    icon: '💊',
    color: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/20',
    status: 'not-started' as const,
  },
  {
    name: 'Track',
    description: 'Monitor milestones & proof of work',
    href: '/playbook/track',
    icon: '📊',
    color: 'from-yellow-500/20 to-yellow-600/10',
    border: 'border-yellow-500/20',
    status: 'not-started' as const,
  },
  {
    name: 'Systemize',
    description: 'Build your 7 business systems',
    href: '/playbook/systemize',
    icon: '⚙️',
    color: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/20',
    status: 'not-started' as const,
  },
  {
    name: 'Productize',
    description: 'Package skills into scalable offers',
    href: '/playbook/productize',
    icon: '📦',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
    status: 'not-started' as const,
  },
  {
    name: 'Prove',
    description: 'Build proof & price loop',
    href: '/playbook/prove',
    icon: '🏆',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'border-indigo-500/20',
    status: 'not-started' as const,
  },
  {
    name: 'Scale',
    description: 'Divorce time from money',
    href: '/playbook/scale',
    icon: '🚀',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/20',
    status: 'not-started' as const,
  },
];

const stages = [
  { number: 1, name: 'Explore', color: 'bg-red-500' },
  { number: 2, name: 'Build', color: 'bg-orange-500' },
  { number: 3, name: 'Grow', color: 'bg-yellow-500' },
  { number: 4, name: 'Leverage', color: 'bg-green-500' },
  { number: 5, name: 'Optimize', color: 'bg-blue-500' },
  { number: 6, name: 'Scale', color: 'bg-emerald-500' },
];

export default function PlaybookDashboardPage() {
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
              <div className={`h-2 rounded-full ${stage.number <= 2 ? stage.color : 'bg-white/10'}`} />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white/50 text-xs whitespace-nowrap">{stage.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-8">
          <p className="text-white/40 text-sm">Currently in <span className="text-orange-400 font-medium">Stage 2: Build</span></p>
          <Link href="/playbook/diagnose" className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
            Retake Assessment →
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Modules Started', value: '2/7', color: 'text-white' },
          { label: 'Systems Built', value: '1/7', color: 'text-yellow-400' },
          { label: 'Milestones Hit', value: '4/18', color: 'text-emerald-400' },
          { label: 'Freedom Score', value: '28', color: 'text-emerald-400' },
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
          {modules.map((module, index) => (
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
                      module.status === 'not-started' 
                        ? 'bg-white/5 text-white/40' 
                        : module.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {module.status === 'not-started' ? 'Not started' : module.status === 'completed' ? 'Complete' : 'In progress'}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{module.name}</h3>
                  <p className="text-white/50 text-sm">{module.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
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
          {[
            { text: 'Complete your business diagnosis', href: '/playbook/diagnose', tag: 'Start here' },
            { text: 'Build your first business system', href: '/playbook/systemize', tag: 'High impact' },
            { text: 'Map your skill → result path', href: '/playbook/productize', tag: 'Quick win' },
          ].map((action) => (
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
