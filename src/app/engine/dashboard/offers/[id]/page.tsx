'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getOffer, updateOffer, Offer } from '@/lib/firebase/firestore';

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(searchParams.get('edit') === 'true');
  const [exporting, setExporting] = useState(false);
  const [editedOffer, setEditedOffer] = useState<Partial<Offer>>({});

  useEffect(() => {
    async function fetchOffer() {
      if (!user || !id) return;
      try {
        const data = await getOffer(id);
        if (data && data.userId === user.uid) {
          setOffer(data);
          setEditedOffer(data);
        } else {
          router.push('/engine/dashboard/offers');
        }
      } catch (err) {
        console.error('Error fetching offer:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffer();
  }, [user, id, router]);

  const handleStatusChange = async (newStatus: 'draft' | 'active' | 'archived') => {
    if (!offer) return;
    setSaving(true);
    try {
      await updateOffer(offer.id, { status: newStatus });
      setOffer({ ...offer, status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!offer) return;
    setSaving(true);
    try {
      await updateOffer(offer.id, {
        name: editedOffer.name,
        niche: editedOffer.niche,
        targetAudience: editedOffer.targetAudience,
        transformation: editedOffer.transformation,
        timeframe: editedOffer.timeframe,
        price: editedOffer.price,
        guarantee: editedOffer.guarantee,
        deliverables: editedOffer.deliverables,
        bonuses: editedOffer.bonuses,
      });
      setOffer({ ...offer, ...editedOffer } as Offer);
      setEditMode(false);
    } catch (err) {
      console.error('Error saving offer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedOffer(offer || {});
    setEditMode(false);
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...(editedOffer.deliverables || [])];
    newDeliverables[index] = value;
    setEditedOffer({ ...editedOffer, deliverables: newDeliverables });
  };

  const addDeliverable = () => {
    setEditedOffer({ ...editedOffer, deliverables: [...(editedOffer.deliverables || []), ''] });
  };

  const removeDeliverable = (index: number) => {
    const newDeliverables = [...(editedOffer.deliverables || [])];
    newDeliverables.splice(index, 1);
    setEditedOffer({ ...editedOffer, deliverables: newDeliverables });
  };

  const updateBonus = (index: number, value: string) => {
    const newBonuses = [...(editedOffer.bonuses || [])];
    newBonuses[index] = value;
    setEditedOffer({ ...editedOffer, bonuses: newBonuses });
  };

  const addBonus = () => {
    setEditedOffer({ ...editedOffer, bonuses: [...(editedOffer.bonuses || []), ''] });
  };

  const removeBonus = (index: number) => {
    const newBonuses = [...(editedOffer.bonuses || [])];
    newBonuses.splice(index, 1);
    setEditedOffer({ ...editedOffer, bonuses: newBonuses });
  };

  const handleExportPDF = async () => {
    if (!offer) return;
    setExporting(true);
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let y = 0;

      // === HEADER WITH GRADIENT EFFECT ===
      // Dark purple gradient header
      doc.setFillColor(26, 26, 46); // Dark background
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      // Accent line
      doc.setFillColor(139, 92, 246); // Purple accent
      doc.rect(0, 58, pageWidth, 3, 'F');
      
      // Offer name
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(offer.name || 'Premium Offer', contentWidth);
      doc.text(titleLines, margin, 32);
      
      // Tagline
      doc.setFontSize(11);
      doc.setTextColor(180, 180, 200);
      doc.setFont('helvetica', 'normal');
      doc.text(offer.niche || 'High-Ticket Offer', margin, 48);
      
      y = 75;

      // === PRICE CARD ===
      // Price card background
      doc.setFillColor(250, 250, 255);
      doc.roundedRect(margin, y, contentWidth, 40, 4, 4, 'F');
      // Purple left border
      doc.setFillColor(139, 92, 246);
      doc.roundedRect(margin, y, 5, 40, 2, 2, 'F');
      
      // Investment label
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 140);
      doc.setFont('helvetica', 'normal');
      doc.text('INVESTMENT', margin + 15, y + 14);
      
      // Price
      doc.setFontSize(32);
      doc.setTextColor(26, 26, 46);
      doc.setFont('helvetica', 'bold');
      doc.text(`$${(offer.price || 0).toLocaleString()}`, margin + 15, y + 32);
      
      // Timeframe badge
      doc.setFillColor(139, 92, 246);
      const timeframeText = offer.timeframe || '90 days';
      const timeframeWidth = doc.getTextWidth(timeframeText) + 16;
      doc.roundedRect(pageWidth - margin - timeframeWidth - 10, y + 12, timeframeWidth + 10, 18, 9, 9, 'F');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(timeframeText, pageWidth - margin - timeframeWidth - 5, y + 24);
      
      y += 55;

      // === WHO IT'S FOR ===
      doc.setFillColor(26, 26, 46);
      doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('👤  WHO IT\'S FOR', margin + 8, y + 7);
      y += 16;
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 70);
      doc.setFont('helvetica', 'normal');
      const audienceLines = doc.splitTextToSize(offer.targetAudience || 'Not specified', contentWidth);
      doc.text(audienceLines, margin, y);
      y += audienceLines.length * 6 + 12;

      // === TRANSFORMATION ===
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('🚀  THE TRANSFORMATION', margin + 8, y + 7);
      y += 16;
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 70);
      doc.setFont('helvetica', 'normal');
      const transformLines = doc.splitTextToSize(offer.transformation || 'Not specified', contentWidth);
      doc.text(transformLines, margin, y);
      y += transformLines.length * 6 + 12;

      // === DELIVERABLES ===
      if (offer.deliverables?.length && offer.deliverables.some(d => d.trim())) {
        doc.setFillColor(139, 92, 246);
        doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('📦  WHAT\'S INCLUDED', margin + 8, y + 7);
        y += 16;
        
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 70);
        doc.setFont('helvetica', 'normal');
        offer.deliverables.forEach((item, index) => {
          if (item.trim()) {
            // Checkbox style
            doc.setFillColor(139, 92, 246);
            doc.circle(margin + 4, y - 1, 2, 'F');
            const itemLines = doc.splitTextToSize(item, contentWidth - 15);
            doc.text(itemLines, margin + 12, y);
            y += itemLines.length * 6 + 4;
          }
        });
        y += 8;
      }

      // === BONUSES ===
      if (offer.bonuses?.length && offer.bonuses.some(b => b.trim())) {
        // Check if we need a new page
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 30;
        }
        
        doc.setFillColor(234, 179, 8);
        doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('🎁  BONUSES', margin + 8, y + 7);
        y += 16;
        
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 70);
        doc.setFont('helvetica', 'normal');
        offer.bonuses.forEach((item) => {
          if (item.trim()) {
            doc.setTextColor(234, 179, 8);
            doc.text('★', margin + 2, y);
            doc.setTextColor(60, 60, 70);
            const itemLines = doc.splitTextToSize(item, contentWidth - 15);
            doc.text(itemLines, margin + 12, y);
            y += itemLines.length * 6 + 4;
          }
        });
        y += 8;
      }

      // === GUARANTEE ===
      if (offer.guarantee) {
        // Check if we need a new page
        if (y > pageHeight - 60) {
          doc.addPage();
          y = 30;
        }
        
        // Guarantee box with border
        doc.setDrawColor(34, 197, 94);
        doc.setLineWidth(1);
        doc.setFillColor(240, 253, 244);
        const guaranteeLines = doc.splitTextToSize(offer.guarantee, contentWidth - 30);
        const boxHeight = guaranteeLines.length * 6 + 20;
        doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, 'FD');
        
        doc.setFontSize(10);
        doc.setTextColor(34, 197, 94);
        doc.setFont('helvetica', 'bold');
        doc.text('✓  GUARANTEE', margin + 10, y + 14);
        
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 70);
        doc.setFont('helvetica', 'normal');
        doc.text(guaranteeLines, margin + 10, y + 26);
        y += boxHeight + 15;
      }

      // === FOOTER ===
      doc.setFillColor(26, 26, 46);
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 170);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by Engine • CRFTD', margin, pageHeight - 8);
      doc.text(new Date().toLocaleDateString(), pageWidth - margin - 30, pageHeight - 8);

      doc.save(`${offer.name?.replace(/[^a-zA-Z0-9]/g, '-') || 'Offer'}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-20">
        <h2 className="text-white text-xl mb-4">Offer not found</h2>
        <Link href="/engine/dashboard/offers">
          <button className="text-purple-400 hover:text-purple-300">← Back to Offers</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/engine/dashboard/offers" className="text-purple-400 hover:text-purple-300 text-sm mb-2 inline-block">
            ← Back to Offers
          </Link>
          {editMode ? (
            <input
              type="text"
              value={editedOffer.name || ''}
              onChange={(e) => setEditedOffer({ ...editedOffer, name: e.target.value })}
              className="text-3xl font-bold text-white bg-white/5 border border-white/20 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-purple-500/50"
            />
          ) : (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white"
            >
              {offer.name}
            </motion.h1>
          )}
        </div>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button onClick={handleCancel} className="px-4 py-2 rounded-xl text-sm border bg-white/5 text-white/70 border-white/20 hover:bg-white/10">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl text-sm border bg-purple-600 text-white border-purple-500 hover:bg-purple-500 disabled:opacity-50 flex items-center gap-2">
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Save
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded-xl text-sm border bg-white/5 text-white/70 border-white/20 hover:bg-white/10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
              <select
                value={offer.status}
                onChange={(e) => handleStatusChange(e.target.value as 'draft' | 'active' | 'archived')}
                disabled={saving}
                className={`px-4 py-2 rounded-xl font-medium text-sm border ${
                  offer.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : offer.status === 'archived'
                    ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Price Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/50 to-violet-900/50 border border-purple-500/30 rounded-2xl p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 mb-1">Price Point</p>
            {editMode ? (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                <input
                  type="text"
                  value={editedOffer.price || ''}
                  onChange={(e) => setEditedOffer({ ...editedOffer, price: parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0 })}
                  className="text-3xl font-bold text-white bg-white/5 border border-white/20 rounded-xl px-4 py-2 pl-8 w-48 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            ) : (
              <span className="text-4xl font-bold text-white">{formatPrice(offer.price)}</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-white/50 mb-1">Timeframe</p>
            {editMode ? (
              <input
                type="text"
                value={editedOffer.timeframe || ''}
                onChange={(e) => setEditedOffer({ ...editedOffer, timeframe: e.target.value })}
                placeholder="e.g., 90 days"
                className="text-xl font-semibold text-purple-400 bg-white/5 border border-white/20 rounded-xl px-4 py-2 w-40 focus:outline-none focus:border-purple-500/50 text-right"
              />
            ) : (
              <span className="text-2xl font-semibold text-purple-400">{offer.timeframe || 'Not set'}</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Niche & Audience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Target Market
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-white/50 text-sm mb-1">Niche</p>
              {editMode ? (
                <input type="text" value={editedOffer.niche || ''} onChange={(e) => setEditedOffer({ ...editedOffer, niche: e.target.value })} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50" />
              ) : (
                <p className="text-white">{offer.niche}</p>
              )}
            </div>
            <div>
              <p className="text-white/50 text-sm mb-1">Target Audience</p>
              {editMode ? (
                <textarea value={editedOffer.targetAudience || ''} onChange={(e) => setEditedOffer({ ...editedOffer, targetAudience: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50" />
              ) : (
                <p className="text-white">{offer.targetAudience}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Transformation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Transformation
          </h3>
          {editMode ? (
            <textarea value={editedOffer.transformation || ''} onChange={(e) => setEditedOffer({ ...editedOffer, transformation: e.target.value })} rows={5} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50" />
          ) : (
            <p className="text-white">{offer.transformation}</p>
          )}
        </motion.div>
      </div>

      {/* Deliverables */}
      {(offer.deliverables && offer.deliverables.length > 0) || editMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Core Deliverables
          </h3>
          {editMode ? (
            <div className="space-y-3">
              {(editedOffer.deliverables || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-purple-400 mt-3">{index + 1}.</span>
                  <input type="text" value={item} onChange={(e) => updateDeliverable(index, e.target.value)} className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50" />
                  <button onClick={() => removeDeliverable(index)} className="text-red-400 hover:text-red-300 px-2">×</button>
                </div>
              ))}
              <button onClick={addDeliverable} className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add deliverable
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {offer.deliverables?.map((item, index) => item.trim() && (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-purple-400 mt-0.5">✓</span>
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ) : null}

      {/* Bonuses */}
      {(offer.bonuses && offer.bonuses.length > 0) || editMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Bonuses Included
          </h3>
          {editMode ? (
            <div className="space-y-3">
              {(editedOffer.bonuses || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-green-400 mt-3">+</span>
                  <input type="text" value={item} onChange={(e) => updateBonus(index, e.target.value)} className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50" />
                  <button onClick={() => removeBonus(index)} className="text-red-400 hover:text-red-300 px-2">×</button>
                </div>
              ))}
              <button onClick={addBonus} className="text-green-400 text-sm hover:text-green-300 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add bonus
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {offer.bonuses?.map((item, index) => item.trim() && (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5">+</span>
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ) : null}

      {/* Guarantee */}
      {offer.guarantee || editMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Guarantee
          </h3>
          {editMode ? (
            <textarea value={editedOffer.guarantee || ''} onChange={(e) => setEditedOffer({ ...editedOffer, guarantee: e.target.value })} rows={2} placeholder="e.g., 30-day money-back guarantee" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50" />
          ) : (
            <p className="text-white">{offer.guarantee}</p>
          )}
        </motion.div>
      ) : null}

      {/* Actions */}
      {!editMode && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4"
      >
        <button 
          onClick={() => {
            // Save offer context for AI Agents
            localStorage.setItem('currentOfferContext', JSON.stringify({
              name: offer.name,
              niche: offer.niche,
              targetAudience: offer.targetAudience,
              transformation: offer.transformation,
              price: offer.price,
              deliverables: offer.deliverables,
              bonuses: offer.bonuses,
              guarantee: offer.guarantee,
            }));
            window.location.href = '/engine/dashboard/agents';
          }}
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Refine with AI Agents
        </button>
        <button 
          onClick={handleExportPDF}
          disabled={exporting}
          className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </button>
        <button 
          onClick={() => {
            const offerText = `${offer.name}\n${'━'.repeat(30)}\n\nInvestment: $${offer.price?.toLocaleString()}\nTimeframe: ${offer.timeframe || 'Not specified'}\n\nWho It's For:\n${offer.targetAudience}\n\nThe Transformation:\n${offer.transformation}\n\nWhat's Included:\n${offer.deliverables?.map(d => `- ${d}`).join('\n') || 'Not specified'}\n\nBonuses:\n${offer.bonuses?.map(b => `- ${b}`).join('\n') || 'None'}\n\nGuarantee:\n${offer.guarantee || 'Not specified'}`;
            navigator.clipboard.writeText(offerText);
            alert('Offer copied to clipboard!');
          }}
          className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Offer
        </button>
      </motion.div>
      )}
    </div>
  );
}