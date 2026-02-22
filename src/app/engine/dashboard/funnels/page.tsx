'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase';
import { getFunnels, saveFunnel, updateFunnel, deleteFunnel, Funnel, FunnelStep } from '@/lib/firebase/firestore';
import { 
  Play, 
  Pause, 
  Plus, 
  Settings, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';

const stepIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  sms: <MessageSquare className="w-4 h-4" />,
  call: <Phone className="w-4 h-4" />,
  wait: <Clock className="w-4 h-4" />,
  webhook: <Zap className="w-4 h-4" />
};

const funnelTemplates = [
  {
    name: 'New Client Welcome',
    description: 'Onboard new clients with a warm welcome sequence',
    trigger: 'New signup',
    steps: [
      { id: '1', type: 'email' as const, title: 'Welcome Email', content: 'Welcome to the family!', status: 'active' as const },
      { id: '2', type: 'wait' as const, title: 'Wait 1 Day', delay: '1 day', status: 'active' as const },
      { id: '3', type: 'email' as const, title: 'Getting Started Guide', content: 'Here\'s how to get started...', status: 'active' as const },
      { id: '4', type: 'wait' as const, title: 'Wait 2 Days', delay: '2 days', status: 'active' as const },
      { id: '5', type: 'sms' as const, title: 'Check-in SMS', content: 'Hey! How are you finding things so far?', status: 'active' as const },
    ]
  },
  {
    name: 'Re-engagement Campaign',
    description: 'Win back inactive leads with targeted messaging',
    trigger: 'Inactive 30 days',
    steps: [
      { id: '1', type: 'email' as const, title: 'We Miss You', content: 'It\'s been a while...', status: 'active' as const },
      { id: '2', type: 'wait' as const, title: 'Wait 3 Days', delay: '3 days', status: 'active' as const },
      { id: '3', type: 'email' as const, title: 'Special Offer', content: 'Exclusive offer just for you', status: 'active' as const },
      { id: '4', type: 'wait' as const, title: 'Wait 2 Days', delay: '2 days', status: 'active' as const },
      { id: '5', type: 'call' as const, title: 'Personal Call', content: 'Follow up call', status: 'active' as const },
    ]
  },
  {
    name: 'Sales Follow-up',
    description: 'Convert warm leads into paying customers',
    trigger: 'After call booked',
    steps: [
      { id: '1', type: 'email' as const, title: 'Call Confirmation', content: 'Looking forward to our call!', status: 'active' as const },
      { id: '2', type: 'wait' as const, title: 'Wait 1 Hour Before', delay: '1 hour', status: 'active' as const },
      { id: '3', type: 'sms' as const, title: 'Reminder SMS', content: 'Our call is in 1 hour!', status: 'active' as const },
      { id: '4', type: 'wait' as const, title: 'Wait Until After Call', delay: '2 hours', status: 'active' as const },
      { id: '5', type: 'email' as const, title: 'Post-Call Summary', content: 'Great speaking with you...', status: 'active' as const },
    ]
  }
];

function FunnelCard({ 
  funnel, 
  expanded, 
  onToggle, 
  onStatusChange, 
  onDelete 
}: { 
  funnel: Funnel; 
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: 'active' | 'paused') => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggle}
              className="text-white/50 hover:text-white transition-colors"
            >
              {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">{funnel.name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  funnel.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : funnel.status === 'paused'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {funnel.status}
                </span>
              </div>
              <p className="text-white/50 text-sm">{funnel.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {funnel.status === 'active' ? (
              <button 
                onClick={() => onStatusChange('paused')}
                className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => onStatusChange('active')}
                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            <button className="p-2 bg-white/10 text-white/50 rounded-lg hover:bg-white/20 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
              <Users className="w-4 h-4" />
              Enrolled
            </div>
            <p className="text-white font-semibold">{funnel.stats?.enrolled || 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/50 text-sm mb-1">Completed</div>
            <p className="text-white font-semibold">{funnel.stats?.completed || 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/50 text-sm mb-1">Revenue</div>
            <p className="text-green-400 font-semibold">${funnel.stats?.revenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Trigger */}
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Zap className="w-4 h-4 text-purple-400" />
          Trigger: <span className="text-white">{funnel.trigger}</span>
        </div>
      </div>

      {/* Expanded Steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-purple-500/20 bg-black/20"
          >
            <div className="p-6">
              <h4 className="text-white font-medium mb-4">Automation Steps</h4>
              <div className="space-y-3">
                {funnel.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        step.type === 'email' ? 'bg-blue-500/20 text-blue-400' :
                        step.type === 'sms' ? 'bg-green-500/20 text-green-400' :
                        step.type === 'call' ? 'bg-orange-500/20 text-orange-400' :
                        step.type === 'wait' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {stepIcons[step.type]}
                      </div>
                      {index < funnel.steps.length - 1 && (
                        <div className="w-0.5 h-6 bg-white/10" />
                      )}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{step.title}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          step.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      {step.delay && <p className="text-white/40 text-xs mt-1">Delay: {step.delay}</p>}
                      {step.content && <p className="text-white/40 text-xs mt-1 truncate">{step.content}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CreateFunnelModal({ 
  onClose, 
  onSubmit 
}: { 
  onClose: () => void;
  onSubmit: (funnel: Omit<Funnel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    const template = selectedTemplate !== null ? funnelTemplates[selectedTemplate] : null;
    
    onSubmit({
      name,
      description: description || (template?.description || ''),
      trigger: trigger || (template?.trigger || 'Manual'),
      status: 'draft',
      steps: template?.steps || [],
      stats: { enrolled: 0, completed: 0, revenue: 0 }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/30 rounded-2xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-6">Create New Funnel</h2>

        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm block mb-2">Funnel Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., New Client Onboarding"
              className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this funnel do?"
              className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-2">Trigger</label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g., New signup, Form submission"
              className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-2">Start from Template (Optional)</label>
            <div className="grid grid-cols-1 gap-2">
              {funnelTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTemplate(selectedTemplate === index ? null : index)}
                  className={`text-left p-3 rounded-xl border transition-colors ${
                    selectedTemplate === index 
                      ? 'bg-purple-500/20 border-purple-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <p className="text-white text-sm font-medium">{template.name}</p>
                  <p className="text-white/50 text-xs">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Funnel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FunnelsPage() {
  const { user } = useAuth();
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFunnel, setExpandedFunnel] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load funnels from Firestore
  useEffect(() => {
    async function loadFunnels() {
      if (!user) return;
      try {
        const data = await getFunnels(user.uid);
        setFunnels(data);
      } catch (err) {
        console.error('Failed to load funnels:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFunnels();
  }, [user]);

  const handleCreateFunnel = async (funnelData: Omit<Funnel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    try {
      const id = await saveFunnel(user.uid, funnelData);
      // Refresh funnels
      const data = await getFunnels(user.uid);
      setFunnels(data);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create funnel:', err);
    }
  };

  const handleStatusChange = async (funnelId: string, status: 'active' | 'paused') => {
    try {
      await updateFunnel(funnelId, { status });
      setFunnels(funnels.map(f => f.id === funnelId ? { ...f, status } : f));
    } catch (err) {
      console.error('Failed to update funnel:', err);
    }
  };

  const handleDeleteFunnel = async (funnelId: string) => {
    if (!confirm('Are you sure you want to delete this funnel?')) return;
    try {
      await deleteFunnel(funnelId);
      setFunnels(funnels.filter(f => f.id !== funnelId));
    } catch (err) {
      console.error('Failed to delete funnel:', err);
    }
  };

  const activeFunnels = funnels.filter(f => f.status === 'active').length;
  const totalEnrolled = funnels.reduce((sum, f) => sum + (f.stats?.enrolled || 0), 0);

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
            <h1 className="text-3xl font-bold text-white">Funnel Automation</h1>
          </div>
          <p className="text-white/50">Create automated sequences to nurture leads and close deals</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Funnel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Total Funnels</p>
              <p className="text-2xl font-bold text-white">{loading ? '...' : funnels.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">{loading ? '...' : activeFunnels}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm">Total Enrolled</p>
              <p className="text-2xl font-bold text-white">{loading ? '...' : totalEnrolled}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Funnels List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Loading funnels...</p>
        </div>
      ) : funnels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-purple-500/20 rounded-2xl"
        >
          <Zap className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No funnels yet</h3>
          <p className="text-white/50 mb-6">Create your first automation funnel to start nurturing leads</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-violet-500 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Funnel
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {funnels.map((funnel) => (
            <FunnelCard
              key={funnel.id}
              funnel={funnel}
              expanded={expandedFunnel === funnel.id}
              onToggle={() => setExpandedFunnel(expandedFunnel === funnel.id ? null : funnel.id)}
              onStatusChange={(status) => handleStatusChange(funnel.id, status)}
              onDelete={() => handleDeleteFunnel(funnel.id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateFunnelModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateFunnel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
