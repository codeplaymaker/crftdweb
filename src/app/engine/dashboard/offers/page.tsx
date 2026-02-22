'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getOffers, updateOffer, deleteOffer, Offer } from '@/lib/firebase/firestore';

export default function OffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffers() {
      if (!user) return;
      try {
        const data = await getOffers(user.uid);
        setOffers(data);
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, [user]);

  const handleStatusChange = async (offerId: string, newStatus: 'draft' | 'active' | 'archived') => {
    try {
      await updateOffer(offerId, { status: newStatus });
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: newStatus } : o));
      setMenuOpen(null);
    } catch (err) {
      console.error('Error updating offer:', err);
    }
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteOffer(offerId);
      setOffers(offers.filter(o => o.id !== offerId));
      setMenuOpen(null);
    } catch (err) {
      console.error('Error deleting offer:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp: { toDate: () => Date } | Date) => {
    const date = timestamp && 'toDate' in timestamp ? timestamp.toDate() : new Date();
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

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
            Offer Builder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50"
          >
            Create and manage your high-ticket offers.
          </motion.p>
        </div>
        <Link
          href="/engine/dashboard/offers/new"
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          + Create New Offer
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      )}

      {/* Offers Grid */}
      {!loading && offers.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors relative group"
            >
              {/* Clickable overlay for navigation */}
              <Link href={`/engine/dashboard/offers/${offer.id}`} className="absolute inset-0 z-0" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  offer.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : offer.status === 'archived'
                    ? 'bg-gray-500/20 text-gray-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {offer.status.toUpperCase()}
                </span>
                <div className="relative">
                  <button 
                    onClick={(e) => { e.preventDefault(); setMenuOpen(menuOpen === offer.id ? null : offer.id); }}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {menuOpen === offer.id && (
                    <div className="absolute right-0 top-8 bg-[#1a1a2e] border border-white/10 rounded-xl py-2 min-w-[160px] z-10 shadow-xl">
                      {offer.status !== 'active' && (
                        <button
                          onClick={() => handleStatusChange(offer.id, 'active')}
                          className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-white/5"
                        >
                          Mark Active
                        </button>
                      )}
                      {offer.status !== 'draft' && (
                        <button
                          onClick={() => handleStatusChange(offer.id, 'draft')}
                          className="w-full px-4 py-2 text-left text-sm text-yellow-400 hover:bg-white/5"
                        >
                          Move to Draft
                        </button>
                      )}
                      {offer.status !== 'archived' && (
                        <button
                          onClick={() => handleStatusChange(offer.id, 'archived')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-white/5"
                        >
                          Archive
                        </button>
                      )}
                      <hr className="my-2 border-white/10" />
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-white text-lg font-semibold mb-2">{offer.name}</h3>
              <p className="text-white/50 text-sm mb-2">{offer.niche}</p>
              {offer.transformation && (
                <p className="text-white/40 text-xs mb-4 line-clamp-2">{offer.transformation}</p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-purple-400 font-semibold">{formatPrice(offer.price)}</span>
                <span className="text-white/40 text-sm">{formatDate(offer.createdAt)}</span>
              </div>
              
              {/* Quick Actions (visible on hover) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a15] via-[#0a0a15]/90 to-transparent pt-8 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl z-10">
                <div className="flex gap-2">
                  <Link
                    href={`/engine/dashboard/offers/${offer.id}?edit=true`}
                    className="flex-1 bg-purple-500/20 text-purple-400 text-xs font-medium py-2 px-3 rounded-lg hover:bg-purple-500/30 transition-colors text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleStatusChange(offer.id, offer.status === 'active' ? 'draft' : 'active'); }}
                    className={`flex-1 text-xs font-medium py-2 px-3 rounded-lg transition-colors ${
                      offer.status === 'active' 
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {offer.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(offer.id); }}
                    className="bg-red-500/20 text-red-400 text-xs font-medium py-2 px-3 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Create New Card */}
          <Link href="/engine/dashboard/offers/new">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: offers.length * 0.1 }}
              className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center min-h-[200px] cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-white font-medium">Create New Offer</p>
              <p className="text-white/50 text-sm">Build in 5 minutes</p>
            </motion.div>
          </Link>
        </div>
      )}

      {/* Empty State */}
      {!loading && offers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No offers yet</h3>
          <p className="text-white/50 max-w-md mx-auto mb-6">
            Create your first high-ticket offer and start selling premium services.
          </p>
          <Link
            href="/engine/dashboard/offers/new"
            className="inline-block bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Create Your First Offer
          </Link>
        </motion.div>
      )}

      {/* Click outside to close menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setMenuOpen(null)}
        />
      )}
    </div>
  );
}
