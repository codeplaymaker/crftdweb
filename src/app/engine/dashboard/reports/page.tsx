'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getTruthReports, deleteTruthReport, TruthReport } from '@/lib/firebase/firestore';
import Link from 'next/link';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<TruthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
      if (!user) return;
      try {
        const data = await getTruthReports(user.uid);
        setReports(data);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [user]);

  const handleDelete = async (reportId: string) => {
    if (!user || !confirm('Are you sure you want to delete this report?')) return;
    setDeleting(reportId);
    try {
      await deleteTruthReport(reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (timestamp: { seconds: number } | undefined) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Reports
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50"
          >
            View and manage all your generated reports.
          </motion.p>
        </div>
        <Link href="/engine/dashboard/truth">
          <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            New Report
          </button>
        </Link>
      </div>

      {/* Reports List */}
      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <Link key={report.id} href={`/engine/dashboard/reports/${report.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{report.niche}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                          Truth Engine
                        </span>
                        <span className="text-white/40 text-sm">{formatDate(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white/50 text-sm">Viability Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(report.viabilityScore)}`}>
                      {report.viabilityScore}/100
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(report.id);
                      }}
                      disabled={deleting === report.id}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === report.id ? (
                        <div className="w-5 h-5 animate-spin border-2 border-red-400 border-t-transparent rounded-full" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Report Preview */}
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/40">Market Size</p>
                  <p className="text-white">{report.marketSize}</p>
                </div>
                <div>
                  <p className="text-white/40">Growth Rate</p>
                  <p className="text-white">{report.growthRate}</p>
                </div>
                <div>
                  <p className="text-white/40">Competition</p>
                  <p className="text-white">{report.competition}</p>
                </div>
                <div>
                  <p className="text-white/40">Price Range</p>
                  <p className="text-white">{report.pricingRange}</p>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No reports yet</h3>
          <p className="text-white/50 max-w-md mx-auto mb-6">
            Run the Truth Engine to generate your first market research report.
          </p>
          <Link href="/engine/dashboard/truth">
            <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Run Truth Engine →
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
