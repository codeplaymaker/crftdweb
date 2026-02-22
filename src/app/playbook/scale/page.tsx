'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { TimeVsValueComparison, ModuleHeader } from '@/components/playbook/visuals';

interface RevenueStream {
  name: string;
  type: 'active' | 'leveraged' | 'passive';
  monthlyRevenue: number;
  hoursPerMonth: number;
}

const defaultStreams: RevenueStream[] = [
  { name: 'Client web design', type: 'active', monthlyRevenue: 8000, hoursPerMonth: 80 },
  { name: 'Productized landing page sprint', type: 'leveraged', monthlyRevenue: 4000, hoursPerMonth: 20 },
  { name: 'Website template sales', type: 'passive', monthlyRevenue: 1200, hoursPerMonth: 2 },
  { name: 'Consulting calls', type: 'active', monthlyRevenue: 2000, hoursPerMonth: 10 },
  { name: 'Course sales', type: 'passive', monthlyRevenue: 800, hoursPerMonth: 1 },
];

export default function ScalePage() {
  const [streams, setStreams] = useState(defaultStreams);
  const [showAddStream, setShowAddStream] = useState(false);
  const [newStream, setNewStream] = useState<RevenueStream>({ name: '', type: 'active', monthlyRevenue: 0, hoursPerMonth: 0 });

  const totalRevenue = streams.reduce((sum, s) => sum + s.monthlyRevenue, 0);
  const totalHours = streams.reduce((sum, s) => sum + s.hoursPerMonth, 0);
  const effectiveHourly = totalHours > 0 ? Math.round(totalRevenue / totalHours) : 0;

  const activeRevenue = streams.filter(s => s.type === 'active').reduce((sum, s) => sum + s.monthlyRevenue, 0);
  const leveragedRevenue = streams.filter(s => s.type === 'leveraged').reduce((sum, s) => sum + s.monthlyRevenue, 0);
  const passiveRevenue = streams.filter(s => s.type === 'passive').reduce((sum, s) => sum + s.monthlyRevenue, 0);

  const activePercent = totalRevenue > 0 ? Math.round((activeRevenue / totalRevenue) * 100) : 0;
  const leveragedPercent = totalRevenue > 0 ? Math.round((leveragedRevenue / totalRevenue) * 100) : 0;
  const passivePercent = totalRevenue > 0 ? Math.round((passiveRevenue / totalRevenue) * 100) : 0;

  const activeHours = streams.filter(s => s.type === 'active').reduce((sum, s) => sum + s.hoursPerMonth, 0);
  const leveragedHours = streams.filter(s => s.type === 'leveraged').reduce((sum, s) => sum + s.hoursPerMonth, 0);
  const passiveHours = streams.filter(s => s.type === 'passive').reduce((sum, s) => sum + s.hoursPerMonth, 0);

  const addStream = () => {
    if (newStream.name) {
      setStreams([...streams, newStream]);
      setNewStream({ name: '', type: 'active', monthlyRevenue: 0, hoursPerMonth: 0 });
      setShowAddStream(false);
    }
  };

  const removeStream = (index: number) => {
    setStreams(streams.filter((_, i) => i !== index));
  };

  // Freedom Score: higher when more income is leveraged/passive
  const freedomScore = Math.min(100, Math.round(((leveragedPercent * 0.7 + passivePercent * 1.0) / 100) * 100));

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
            tag="SCALE"
            title="Divorcing Time & Money"
            subtitle="Track your transition from money-for-time to money-for-value. When you sell time, the count resets. When you sell value, the count rolls over."
          />

          {/* Visual Device: COMPARISON */}
          <TimeVsValueComparison className="mb-16" />

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-white/50 text-sm mb-1">Monthly Revenue</p>
              <p className="text-white text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-white/50 text-sm mb-1">Effective Hourly</p>
              <p className="text-white text-2xl font-bold">${effectiveHourly}/hr</p>
              <p className="text-white/30 text-xs mt-1">{totalHours} hrs/mo</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="text-white/50 text-sm mb-1">Revenue Streams</p>
              <p className="text-white text-2xl font-bold">{streams.length}</p>
              <p className="text-white/30 text-xs mt-1">Diversification</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5"
            >
              <p className="text-emerald-400/70 text-sm mb-1">Freedom Score</p>
              <p className="text-emerald-400 text-2xl font-bold">{freedomScore}/100</p>
              <p className="text-emerald-400/40 text-xs mt-1">
                {freedomScore < 30 ? 'Time-trapped' : freedomScore < 60 ? 'Building leverage' : freedomScore < 80 ? 'Getting free' : 'Time-free'}
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Breakdown */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-6">Revenue Type Breakdown</h3>
                
                {/* Visual breakdown */}
                <div className="mb-6">
                  <div className="flex rounded-xl overflow-hidden h-8 mb-4">
                    {activePercent > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activePercent}%` }}
                        transition={{ duration: 0.8 }}
                        className="bg-red-500/60 flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-medium">{activePercent}%</span>
                      </motion.div>
                    )}
                    {leveragedPercent > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${leveragedPercent}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-yellow-500/60 flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-medium">{leveragedPercent}%</span>
                      </motion.div>
                    )}
                    {passivePercent > 0 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passivePercent}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-emerald-500/60 flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-medium">{passivePercent}%</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <span className="text-white/70 text-sm">Active</span>
                      </div>
                      <p className="text-white font-semibold">${activeRevenue.toLocaleString()}</p>
                      <p className="text-white/30 text-xs">{activeHours} hrs/mo</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <span className="text-white/70 text-sm">Leveraged</span>
                      </div>
                      <p className="text-white font-semibold">${leveragedRevenue.toLocaleString()}</p>
                      <p className="text-white/30 text-xs">{leveragedHours} hrs/mo</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                        <span className="text-white/70 text-sm">Passive</span>
                      </div>
                      <p className="text-white font-semibold">${passiveRevenue.toLocaleString()}</p>
                      <p className="text-white/30 text-xs">{passiveHours} hrs/mo</p>
                    </div>
                  </div>
                </div>

                {/* Revenue Streams List */}
                <h4 className="text-white/70 text-sm font-medium mb-3 mt-8">Revenue Streams</h4>
                <div className="space-y-2">
                  {streams.map((stream, index) => {
                    const hourlyRate = stream.hoursPerMonth > 0 ? Math.round(stream.monthlyRevenue / stream.hoursPerMonth) : Infinity;
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 bg-black/30 rounded-xl group">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          stream.type === 'active' ? 'bg-red-500/60' :
                          stream.type === 'leveraged' ? 'bg-yellow-500/60' :
                          'bg-emerald-500/60'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white text-sm">{stream.name}</p>
                          <p className="text-white/30 text-xs">{stream.type} · {stream.hoursPerMonth}hrs/mo</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold text-sm">${stream.monthlyRevenue.toLocaleString()}/mo</p>
                          <p className="text-white/30 text-xs">
                            {hourlyRate === Infinity ? '∞' : `$${hourlyRate}`}/hr effective
                          </p>
                        </div>
                        <button
                          onClick={() => removeStream(index)}
                          className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Stream */}
                {showAddStream ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-black/30 rounded-xl space-y-3"
                  >
                    <input
                      type="text"
                      value={newStream.name}
                      onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
                      placeholder="Revenue stream name"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <select
                        value={newStream.type}
                        onChange={(e) => setNewStream({ ...newStream, type: e.target.value as RevenueStream['type'] })}
                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="active" className="bg-black">Active</option>
                        <option value="leveraged" className="bg-black">Leveraged</option>
                        <option value="passive" className="bg-black">Passive</option>
                      </select>
                      <input
                        type="number"
                        value={newStream.monthlyRevenue || ''}
                        onChange={(e) => setNewStream({ ...newStream, monthlyRevenue: Number(e.target.value) })}
                        placeholder="$/month"
                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                      />
                      <input
                        type="number"
                        value={newStream.hoursPerMonth || ''}
                        onChange={(e) => setNewStream({ ...newStream, hoursPerMonth: Number(e.target.value) })}
                        placeholder="hrs/month"
                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={addStream} className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                        Add
                      </button>
                      <button onClick={() => setShowAddStream(false)} className="text-white/40 px-4 py-2 text-sm hover:text-white/70 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowAddStream(true)}
                    className="mt-4 w-full border border-dashed border-white/10 rounded-xl p-3 text-white/40 text-sm hover:text-white/70 hover:border-white/20 transition-colors"
                  >
                    + Add Revenue Stream
                  </button>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* The Framework */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">The Framework</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <p className="text-red-400 font-semibold text-sm mb-1">⏰ Time for Money</p>
                    <p className="text-white/40 text-xs">Do it once, get paid once. The count resets every morning.</p>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-white/20 text-xl">↓</span>
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <p className="text-emerald-400 font-semibold text-sm mb-1">💎 Value for Money</p>
                    <p className="text-white/40 text-xs">Do it once, get paid indefinitely. The count rolls over. Always.</p>
                  </div>
                </div>
              </div>

              {/* Income Decentralization */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Decentralize Income</h3>
                <p className="text-white/50 text-sm mb-4">
                  Lose your job, lose your income. Diversify to make your money anti-fragile.
                </p>
                <div className="space-y-2">
                  {[
                    { name: 'Services', desc: 'Active work for clients' },
                    { name: 'Products', desc: 'Digital assets that sell' },
                    { name: 'Content', desc: 'Audience → monetization' },
                    { name: 'Consulting', desc: 'High-ticket expertise' },
                    { name: 'Community', desc: 'Membership / recurring' },
                  ].map((item) => {
                    const hasStream = streams.some(s => s.name.toLowerCase().includes(item.name.toLowerCase().slice(0, 4)));
                    return (
                      <div key={item.name} className="flex items-center gap-3 p-2">
                        <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${
                          hasStream ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                        }`}>
                          {hasStream && (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm ${hasStream ? 'text-white' : 'text-white/40'}`}>{item.name}</p>
                          <p className="text-white/30 text-xs">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Goal */}
              <div className="bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-emerald-400 font-semibold text-sm mb-2">The Goal</p>
                <p className="text-white/60 text-sm">
                  Compound interest is the eighth wonder of the world. When you sell value, 
                  the count rolls over. Yesterday doesn&apos;t exist — do it now.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/playbook/prove" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              ← Prove
            </Link>
            <Link
              href="/playbook/dashboard"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Go to Dashboard →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
