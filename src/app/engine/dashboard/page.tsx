'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getTruthReports, getOffers, TruthReport, Offer } from '@/lib/firebase/firestore';

function StatCard({ title, value, change, icon }: { title: string; value: string; change?: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-white/50 text-sm mb-1">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

function QuickAction({ title, description, href, icon }: { title: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors cursor-pointer"
      >
        <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
          {icon}
        </div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-white/50 text-sm">{description}</p>
      </motion.div>
    </Link>
  );
}

function RecentActivity({ reports, offers }: { reports: TruthReport[]; offers: Offer[] }) {
  // Combine and sort activities by date
  const activities = [
    ...reports.map(r => ({
      action: 'Generated report',
      item: r.niche,
      time: r.createdAt ? new Date(r.createdAt.seconds * 1000) : new Date(),
    })),
    ...offers.map(o => ({
      action: 'Created new offer',
      item: o.name,
      time: o.createdAt ? new Date(o.createdAt.seconds * 1000) : new Date(),
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-white/50 text-sm">No activity yet. Start by running the Truth Engine!</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
              <div>
                <p className="text-white text-sm">{activity.action}</p>
                <p className="text-white/50 text-sm">{activity.item}</p>
                <p className="text-white/30 text-xs">{formatTime(activity.time)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [reports, setReports] = useState<TruthReport[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [reportsData, offersData] = await Promise.all([
          getTruthReports(user.uid),
          getOffers(user.uid),
        ]);
        setReports(reportsData);
        setOffers(offersData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const userName = profile?.displayName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Welcome back, {userName}! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50"
        >
          Here&apos;s what&apos;s happening with your high-ticket offers.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Reports Generated"
          value={loading ? '...' : reports.length.toString()}
          change={reports.length > 0 ? `${reports.length} total` : undefined}
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Offers Created"
          value={loading ? '...' : offers.length.toString()}
          change={offers.length > 0 ? `${offers.length} total` : undefined}
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="AI Agents Used"
          value={loading ? '...' : (profile?.agentUsage || 0).toString()}
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Credits Remaining"
          value={loading ? '...' : '∞'}
          icon={
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title="Run Truth Engine"
            description="Analyze a niche and get market intelligence"
            href="/engine/dashboard/truth"
            icon={
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
          />
          <QuickAction
            title="Create New Offer"
            description="Build a high-ticket offer in 60 minutes"
            href="/engine/dashboard/offers/new"
            icon={
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <QuickAction
            title="Use AI Agent"
            description="Get help from specialized AI agents"
            href="/engine/dashboard/agents"
            icon={
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Trend Detection & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Market Trends</h3>
                <p className="text-white/50 text-sm">Real-time trend detection</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Live</span>
          </div>
          <div className="space-y-3">
            {[
              { trend: 'AI-Powered Coaching', change: '+127%', direction: 'up', score: 94 },
              { trend: 'Done-For-You Services', change: '+89%', direction: 'up', score: 87 },
              { trend: 'Community-Based Programs', change: '+64%', direction: 'up', score: 81 },
              { trend: 'Traditional Courses', change: '-23%', direction: 'down', score: 42 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.direction === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <svg className={`w-4 h-4 ${item.direction === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                  <span className="text-white text-sm">{item.trend}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${item.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change}
                  </span>
                  <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link 
            href="/engine/dashboard/analytics" 
            className="mt-4 flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            View all trends
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Opportunity Scoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Opportunities</h3>
                <p className="text-white/50 text-sm">Ranked by profit potential</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">AI Scored</span>
          </div>
          <div className="space-y-3">
            {[
              { opportunity: 'AI Accountability Partner SaaS', score: 96, revenue: '$2.4M/yr TAM', hot: true },
              { opportunity: 'Executive Performance Coaching', score: 91, revenue: '$890K/yr TAM', hot: true },
              { opportunity: 'Remote Team Leadership Program', score: 84, revenue: '$650K/yr TAM', hot: false },
              { opportunity: 'Founder Wellness Retreat', score: 78, revenue: '$420K/yr TAM', hot: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{item.score}</span>
                    </div>
                    {item.hot && (
                      <span className="absolute -top-1 -right-1 text-xs">🔥</span>
                    )}
                  </div>
                  <div>
                    <span className="text-white text-sm block">{item.opportunity}</span>
                    <span className="text-white/40 text-xs">{item.revenue}</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all">
            Generate New Opportunities
          </button>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity reports={reports} offers={offers} />
        </div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Getting Started</h3>
          <div className="space-y-3">
            {[
              { text: 'Run your first Truth Engine report', done: false },
              { text: 'Create your first offer', done: false },
              { text: 'Try an AI agent', done: false },
              { text: 'Explore the dashboard', done: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  item.done ? 'bg-purple-500 border-purple-500' : 'border-white/30'
                }`}>
                  {item.done && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={item.done ? 'text-white/50 line-through' : 'text-white'}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
