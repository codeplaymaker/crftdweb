'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase';
import { getIntegrations, saveIntegration, updateIntegration, Integration } from '@/lib/firebase/firestore';
import { Link2, Database, RefreshCw, Settings, X } from 'lucide-react';

// Available integrations that users can connect
const availableIntegrations = [
  {
    provider: 'gohighlevel',
    name: 'GoHighLevel',
    description: 'Full CRM sync, funnels, and automations',
    icon: '🚀',
    category: 'crm' as const
  },
  {
    provider: 'hubspot',
    name: 'HubSpot',
    description: 'Contact and deal management',
    icon: '🧡',
    category: 'crm' as const
  },
  {
    provider: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM integration',
    icon: '☁️',
    category: 'crm' as const
  },
  {
    provider: 'activecampaign',
    name: 'ActiveCampaign',
    description: 'Email marketing & automation',
    icon: '📧',
    category: 'email' as const
  },
  {
    provider: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email campaigns and lists',
    icon: '🐵',
    category: 'email' as const
  },
  {
    provider: 'convertkit',
    name: 'ConvertKit',
    description: 'Creator-focused email marketing',
    icon: '✉️',
    category: 'email' as const
  },
  {
    provider: 'stripe',
    name: 'Stripe',
    description: 'Payment processing & subscriptions',
    icon: '💳',
    category: 'payment' as const
  },
  {
    provider: 'paypal',
    name: 'PayPal',
    description: 'Payment gateway integration',
    icon: '💰',
    category: 'payment' as const
  },
  {
    provider: 'calendly',
    name: 'Calendly',
    description: 'Appointment scheduling',
    icon: '📅',
    category: 'calendar' as const
  },
  {
    provider: 'cal',
    name: 'Cal.com',
    description: 'Open-source scheduling',
    icon: '🗓️',
    category: 'calendar' as const
  },
  {
    provider: 'zapier',
    name: 'Zapier',
    description: 'Connect 5000+ apps',
    icon: '⚡',
    category: 'automation' as const
  },
  {
    provider: 'make',
    name: 'Make (Integromat)',
    description: 'Advanced automation workflows',
    icon: '🔗',
    category: 'automation' as const
  }
];

const categories = [
  { id: 'all', name: 'All Integrations', icon: '📦' },
  { id: 'crm', name: 'CRM', icon: '👥' },
  { id: 'email', name: 'Email Marketing', icon: '📧' },
  { id: 'payment', name: 'Payments', icon: '💳' },
  { id: 'calendar', name: 'Calendar', icon: '📅' },
  { id: 'automation', name: 'Automation', icon: '⚡' }
];

function IntegrationCard({ 
  integration, 
  savedIntegration,
  onConnect, 
  onDisconnect,
  loading 
}: { 
  integration: typeof availableIntegrations[0];
  savedIntegration?: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  loading: boolean;
}) {
  const isConnected = savedIntegration?.connected || false;
  const status = savedIntegration?.status || 'disconnected';
  const lastSync = savedIntegration?.lastSync;
  const records = savedIntegration?.records || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border rounded-2xl p-6 ${
        isConnected ? 'border-green-500/30' : 'border-purple-500/20'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
            {integration.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold">{integration.name}</h3>
            <p className="text-white/50 text-sm">{integration.description}</p>
          </div>
        </div>
        {isConnected && (
          <div className={`px-2 py-1 rounded-full text-xs ${
            status === 'synced' ? 'bg-green-500/20 text-green-400' :
            status === 'syncing' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {status === 'synced' ? '● Connected' :
             status === 'syncing' ? '○ Syncing...' : '● Error'}
          </div>
        )}
      </div>

      {isConnected ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Last synced</span>
            <span className="text-white">
              {lastSync ? (lastSync.toDate ? lastSync.toDate().toLocaleString() : new Date(lastSync as unknown as string).toLocaleString()) : 'Never'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Records synced</span>
            <span className="text-white">{records.toLocaleString()}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button 
              onClick={onDisconnect}
              disabled={loading}
              className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={onConnect}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </button>
      )}
    </motion.div>
  );
}

function SyncActivity({ integrations }: { integrations: Integration[] }) {
  // Generate activity from connected integrations
  const connectedIntegrations = integrations.filter(i => i.connected);
  
  // Create sample activities based on actual connected integrations
  const activities = connectedIntegrations.slice(0, 5).map((integration, index) => {
    const providerInfo = availableIntegrations.find(a => a.provider === integration.provider);
    const actions = ['Synced contacts', 'Data refreshed', 'Records updated', 'New data imported'];
    const randomAction = actions[index % actions.length];
    const timesAgo = ['2 min', '5 min', '12 min', '1 hour', '2 hours'];
    
    return {
      action: randomAction,
      source: providerInfo?.name || integration.provider,
      time: `${timesAgo[index % timesAgo.length]} ago`,
      icon: providerInfo?.icon || '🔗'
    };
  });

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl p-6"
      >
        <h3 className="text-white font-semibold mb-4">Sync Activity</h3>
        <p className="text-white/50 text-sm text-center py-4">
          Connect integrations to see sync activity
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Sync Activity</h3>
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Live</span>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.action}</p>
              <p className="text-white/40 text-xs">{activity.source}</p>
            </div>
            <span className="text-white/40 text-xs">{activity.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedIntegrations, setSavedIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // Load saved integrations from Firestore
  useEffect(() => {
    async function loadIntegrations() {
      if (!user) return;
      try {
        const data = await getIntegrations(user.uid);
        setSavedIntegrations(data);
      } catch (err) {
        console.error('Failed to load integrations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadIntegrations();
  }, [user]);

  const filteredIntegrations = activeCategory === 'all' 
    ? availableIntegrations 
    : availableIntegrations.filter(i => i.category === activeCategory);

  const connectedCount = savedIntegrations.filter(i => i.connected).length;
  const totalRecords = savedIntegrations.reduce((sum, i) => sum + (i.records || 0), 0);

  const handleConnect = async (provider: string) => {
    if (!user) return;
    setConnectingId(provider);
    
    try {
      // Check if already exists
      const existing = savedIntegrations.find(i => i.provider === provider);
      
      if (existing) {
        // Update existing
        await updateIntegration(existing.id, { 
          connected: true, 
          status: 'syncing' 
        });
      } else {
        // Create new
        await saveIntegration(user.uid, {
          provider,
          connected: true,
          status: 'syncing'
        });
      }

      // Reload integrations
      const data = await getIntegrations(user.uid);
      setSavedIntegrations(data);

      // Simulate sync completion after 2 seconds
      setTimeout(async () => {
        const updated = data.find(i => i.provider === provider);
        if (updated) {
          await updateIntegration(updated.id, { 
            status: 'synced',
            records: Math.floor(Math.random() * 500) + 50
          });
          const refreshed = await getIntegrations(user.uid);
          setSavedIntegrations(refreshed);
        }
      }, 2000);
    } catch (err) {
      console.error('Failed to connect integration:', err);
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!user) return;
    
    try {
      const existing = savedIntegrations.find(i => i.provider === provider);
      if (existing) {
        await updateIntegration(existing.id, { 
          connected: false
        });
        const data = await getIntegrations(user.uid);
        setSavedIntegrations(data);
      }
    } catch (err) {
      console.error('Failed to disconnect integration:', err);
    }
  };

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
            <h1 className="text-3xl font-bold text-white">Integrations</h1>
          </div>
          <p className="text-white/50">Connect your favorite tools and sync data automatically</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Request Integration
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Connected</p>
              <p className="text-2xl font-bold text-white">{loading ? '...' : connectedCount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Records Synced</p>
              <p className="text-2xl font-bold text-white">{loading ? '...' : totalRecords.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Auto-sync</p>
              <p className="text-2xl font-bold text-white">Real-time</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Loading integrations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Integrations Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIntegrations.map((integration) => (
                <IntegrationCard 
                  key={integration.provider} 
                  integration={integration}
                  savedIntegration={savedIntegrations.find(s => s.provider === integration.provider)}
                  onConnect={() => handleConnect(integration.provider)}
                  onDisconnect={() => handleDisconnect(integration.provider)}
                  loading={connectingId === integration.provider}
                />
              ))}
            </div>
          </div>

          {/* Sync Activity Sidebar */}
          <div className="space-y-6">
            <SyncActivity integrations={savedIntegrations} />
            
            {/* API Access Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">API Access</h3>
                  <p className="text-white/50 text-sm">Build custom integrations</p>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Access our full REST API to build custom integrations and automate workflows.
              </p>
              <button className="w-full py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all">
                View API Docs
              </button>
            </motion.div>

            {/* Webhook Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Webhooks</h3>
                  <p className="text-white/50 text-sm">Real-time notifications</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/70 text-sm">New Lead</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/70 text-sm">Offer Created</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/70 text-sm">Report Generated</span>
                  <span className="px-2 py-0.5 bg-white/10 text-white/50 text-xs rounded">Inactive</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
