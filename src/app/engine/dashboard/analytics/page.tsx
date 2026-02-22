'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase';
import { getTruthReports, getOffers, getGeneratedContent, TruthReport, Offer } from '@/lib/firebase/firestore';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  ArrowUpRight,
  Download,
  RefreshCw,
  FileText,
  Zap,
  Sparkles
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'report' | 'offer' | 'content';
  title: string;
  time: string;
  icon: React.ReactNode;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Real data state
  const [reports, setReports] = useState<TruthReport[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // Load data from Firestore
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        const [reportsData, offersData, contentData] = await Promise.all([
          getTruthReports(user.uid, 50),
          getOffers(user.uid),
          getGeneratedContent(user.uid, 50)
        ]);
        
        setReports(reportsData);
        setOffers(offersData);
        setContentCount(contentData.length);
        
        // Build activity feed from all sources
        const activities: Activity[] = [];
        
        reportsData.forEach(r => {
          if (r.createdAt) {
            activities.push({
              id: r.id,
              type: 'report',
              title: `Truth Report: ${r.niche}`,
              time: formatTimeAgo(r.createdAt.toDate()),
              icon: <FileText className="w-4 h-4 text-purple-400" />
            });
          }
        });
        
        offersData.forEach(o => {
          if (o.createdAt) {
            activities.push({
              id: o.id,
              type: 'offer',
              title: `Offer: ${o.name}`,
              time: formatTimeAgo(o.createdAt.toDate()),
              icon: <DollarSign className="w-4 h-4 text-green-400" />
            });
          }
        });
        
        contentData.forEach(c => {
          if (c.createdAt) {
            activities.push({
              id: c.id,
              type: 'content',
              title: c.title,
              time: formatTimeAgo(c.createdAt.toDate()),
              icon: <Sparkles className="w-4 h-4 text-yellow-400" />
            });
          }
        });
        
        // Sort by recency (using time string comparison - "Just now" first, then "Xm ago", etc.)
        activities.sort((a, b) => {
          const timeOrder = (t: string) => {
            if (t === 'Just now') return 0;
            if (t.endsWith('m ago')) return parseInt(t);
            if (t.endsWith('h ago')) return parseInt(t) * 60;
            if (t.endsWith('d ago')) return parseInt(t) * 1440;
            return 9999;
          };
          return timeOrder(a.time) - timeOrder(b.time);
        });
        
        setRecentActivity(activities.slice(0, 10));
        
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user) {
      const [reportsData, offersData, contentData] = await Promise.all([
        getTruthReports(user.uid, 50),
        getOffers(user.uid),
        getGeneratedContent(user.uid, 50)
      ]);
      setReports(reportsData);
      setOffers(offersData);
      setContentCount(contentData.length);
    }
    setRefreshing(false);
  };

  // Calculate real metrics
  const totalReports = reports.length;
  const totalOffers = offers.length;
  const activeOffers = offers.filter(o => o.status === 'active').length;
  const avgViabilityScore = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + (r.viabilityScore || 0), 0) / reports.length)
    : 0;

  // Group reports by month for chart
  const reportsByMonth: Record<string, number> = {};
  reports.forEach(r => {
    if (r.createdAt) {
      const month = r.createdAt.toDate().toLocaleDateString('en-US', { month: 'short' });
      reportsByMonth[month] = (reportsByMonth[month] || 0) + 1;
    }
  });

  // Get top niches from reports
  const nicheData = reports.reduce((acc, r) => {
    const niche = r.niche || 'Unknown';
    acc[niche] = (acc[niche] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topNiches = Object.entries(nicheData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Get top offers
  const topOffersList = offers
    .filter(o => o.status === 'active')
    .slice(0, 5)
    .map(o => ({
      name: o.name,
      price: o.price,
      niche: o.niche
    }));

  const metrics = [
    { 
      label: 'Truth Reports', 
      value: loading ? '...' : totalReports.toString(), 
      change: totalReports > 0 ? 100 : 0, 
      changeLabel: 'total generated', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'purple' 
    },
    { 
      label: 'Offers Created', 
      value: loading ? '...' : totalOffers.toString(), 
      change: activeOffers, 
      changeLabel: 'active', 
      icon: <DollarSign className="w-5 h-5" />, 
      color: 'green' 
    },
    { 
      label: 'Avg Viability', 
      value: loading ? '...' : `${avgViabilityScore}%`, 
      change: avgViabilityScore >= 70 ? avgViabilityScore : 0, 
      changeLabel: 'score', 
      icon: <Target className="w-5 h-5" />, 
      color: 'blue' 
    },
    { 
      label: 'Content Generated', 
      value: loading ? '...' : contentCount.toString(), 
      change: contentCount > 0 ? 100 : 0, 
      changeLabel: 'pieces', 
      icon: <Sparkles className="w-5 h-5" />, 
      color: 'orange' 
    },
  ];

  const chartData = Object.entries(reportsByMonth).slice(-8);
  const maxReports = Math.max(...chartData.map(([, count]) => count), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/engine/dashboard" className="text-white/50 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-400">Real-time insights into your Engine activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {['7d', '30d', '90d', 'All'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button 
            onClick={handleRefresh}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors text-gray-400 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <div className={`p-2 rounded-lg ${
                metric.color === 'green' ? 'bg-green-500/20 text-green-400' :
                metric.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                metric.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {metric.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{metric.value}</p>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{metric.change}</span>
              <span className="text-gray-500 text-sm">{metric.changeLabel}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Reports Generated</h3>
              <p className="text-gray-400 text-sm">Truth Engine reports over time</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-gray-400 text-sm">Reports</span>
            </div>
          </div>
          
          {/* Bar Chart */}
          {chartData.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-48">
              {chartData.map(([month, count]) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-white text-xs font-medium">{count}</span>
                  <div 
                    className="w-full bg-purple-500/80 rounded-t-md transition-all hover:bg-purple-500"
                    style={{ height: `${(count / maxReports) * 140}px`, minHeight: '8px' }}
                  />
                  <span className="text-gray-500 text-xs">{month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No reports generated yet</p>
                <Link href="/engine/dashboard/truth" className="text-purple-400 text-sm hover:underline">
                  Generate your first report →
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Conversion Funnel / Top Niches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Niches Analyzed</h3>
          {topNiches.length > 0 ? (
            <div className="space-y-4">
              {topNiches.map(([niche, count], i) => (
                <div key={niche}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm truncate max-w-[180px]">{niche}</span>
                    <span className="text-gray-400 text-sm">{count} reports</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all"
                      style={{ width: `${(count / (topNiches[0]?.[1] || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No niches analyzed yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Offers</h3>
            <Link href="/engine/dashboard/offers" className="text-purple-400 text-sm hover:underline">
              View all →
            </Link>
          </div>
          {topOffersList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-zinc-800">
                    <th className="pb-3 font-medium">Offer</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                    <th className="pb-3 font-medium text-right">Niche</th>
                  </tr>
                </thead>
                <tbody>
                  {topOffersList.map((offer, i) => (
                    <tr key={i} className="border-b border-zinc-800/50 last:border-0">
                      <td className="py-3">
                        <span className="text-white font-medium">{offer.name}</span>
                      </td>
                      <td className="py-3 text-right text-green-400 font-medium">
                        ${offer.price.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-gray-400 text-sm truncate max-w-[100px]">
                        {offer.niche}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No offers created yet</p>
              <Link href="/engine/dashboard/offers/new" className="text-purple-400 text-sm hover:underline">
                Create your first offer →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{activity.title}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No activity yet</p>
              <p className="text-sm">Start using Engine to see activity here</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
