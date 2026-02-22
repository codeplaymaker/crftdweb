'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { TruthReport } from '@/lib/firebase/firestore';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [report, setReport] = useState<TruthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadReport() {
      if (!user || !params.id) return;
      try {
        const docRef = doc(db, 'truthReports', params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReport(docSnap.data() as TruthReport);
        }
      } catch (error) {
        console.error('Error loading report:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [user, params.id]);

  const handleExportPDF = async () => {
    if (!report) return;
    setExporting(true);
    
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
      const pdfDoc = new jsPDF();
      
      const pageWidth = pdfDoc.internal.pageSize.getWidth();
      const pageHeight = pdfDoc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let y = 20;
      let pageNum = 1;

      // ===== HELPER FUNCTIONS =====
      const addFooter = () => {
        // Dark footer bar
        pdfDoc.setFillColor(24, 24, 27);
        pdfDoc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        
        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(160, 160, 160);
        pdfDoc.text('Engine by CRFTD', margin, pageHeight - 6);
        pdfDoc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
        
        // Purple accent line
        pdfDoc.setDrawColor(139, 92, 246);
        pdfDoc.setLineWidth(0.5);
        pdfDoc.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
      };

      const checkPageBreak = (needed: number) => {
        if (y + needed > pageHeight - 25) {
          addFooter();
          pdfDoc.addPage();
          pageNum++;
          y = 20;
          return true;
        }
        return false;
      };

      // Helper to load emoji as image from CDN (Apple emoji via Twemoji/OpenMoji style)
      const loadEmojiImage = async (emoji: string): Promise<string | null> => {
        try {
          // Convert emoji to codepoint for CDN URL
          const codePoint = [...emoji].map(char => char.codePointAt(0)?.toString(16)).filter(Boolean).join('-');
          // Use Apple-style emoji from CDN (high quality)
          const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${codePoint}.png`;
          
          const response = await fetch(url);
          if (!response.ok) return null;
          
          const blob = await response.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch {
          return null;
        }
      };

      // Pre-load all emoji images
      const emojiMap: Record<string, string | null> = {};
      const emojisToLoad = ['📊', '🎯', '🔥', '💡', '⚔️', '🚧', '📢', '📈', '⚠️', '💬', '💰', '🚀', '⏰', '📚'];
      await Promise.all(emojisToLoad.map(async (emoji) => {
        emojiMap[emoji] = await loadEmojiImage(emoji);
      }));

      const drawSectionHeader = (emoji: string, title: string, color: number[]) => {
        checkPageBreak(18);
        
        // Left color bar
        pdfDoc.setFillColor(color[0], color[1], color[2]);
        pdfDoc.roundedRect(margin, y, 3, 10, 1.5, 1.5, 'F');
        
        // Add emoji image if available
        const emojiImg = emojiMap[emoji];
        let textX = margin + 7;
        if (emojiImg) {
          try {
            pdfDoc.addImage(emojiImg, 'PNG', margin + 6, y - 1, 6, 6);
            textX = margin + 14;
          } catch {
            // Fallback to no emoji
          }
        }
        
        // Title
        pdfDoc.setFontSize(12);
        pdfDoc.setTextColor(30, 30, 30);
        pdfDoc.text(title, textX, y + 7);
        
        // Underline
        pdfDoc.setDrawColor(color[0], color[1], color[2]);
        pdfDoc.setLineWidth(0.3);
        pdfDoc.line(textX, y + 10, textX + pdfDoc.getTextWidth(title), y + 10);
        
        y += 16;
      };

      const drawBulletPoint = (text: string, color: number[], indent: number = 0) => {
        checkPageBreak(10);
        
        // Colored bullet
        pdfDoc.setFillColor(color[0], color[1], color[2]);
        pdfDoc.circle(margin + 7 + indent, y - 1.5, 1.5, 'F');
        
        // Text
        pdfDoc.setFontSize(9);
        pdfDoc.setTextColor(55, 55, 55);
        const lines = pdfDoc.splitTextToSize(text, contentWidth - 15 - indent);
        pdfDoc.text(lines, margin + 12 + indent, y);
        y += lines.length * 4.5 + 3;
      };

      // ===== PAGE 1: HEADER =====
      
      // Dark header bar
      pdfDoc.setFillColor(24, 24, 27);
      pdfDoc.rect(0, 0, pageWidth, 42, 'F');
      
      // Purple gradient accent line
      pdfDoc.setFillColor(139, 92, 246);
      pdfDoc.rect(0, 42, pageWidth, 2, 'F');
      
      // Title and subtitle
      pdfDoc.setFontSize(24);
      pdfDoc.setTextColor(255, 255, 255);
      pdfDoc.text('TRUTH ENGINE', margin, 18);
      pdfDoc.setFontSize(11);
      pdfDoc.setTextColor(180, 180, 180);
      pdfDoc.text('Market Intelligence Report', margin, 28);
      
      // Date badge
      pdfDoc.setFillColor(139, 92, 246);
      pdfDoc.roundedRect(pageWidth - margin - 45, 10, 45, 12, 3, 3, 'F');
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(255, 255, 255);
      pdfDoc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), pageWidth - margin - 22.5, 17.5, { align: 'center' });
      
      // Powered by badge
      pdfDoc.setFontSize(7);
      pdfDoc.setTextColor(120, 120, 120);
      pdfDoc.text('Powered by Perplexity AI + Real-Time Data', pageWidth - margin, 36, { align: 'right' });
      
      y = 52;
      
      // ===== NICHE TITLE (dynamic sizing for long titles) =====
      let nicheFontSize = 18;
      if (report.niche.length > 60) nicheFontSize = 14;
      else if (report.niche.length > 40) nicheFontSize = 16;
      
      pdfDoc.setFontSize(nicheFontSize);
      pdfDoc.setTextColor(30, 30, 30);
      const nicheLines = pdfDoc.splitTextToSize(report.niche, contentWidth);
      pdfDoc.text(nicheLines, margin, y);
      y += nicheLines.length * (nicheFontSize * 0.45) + 8;

      // ===== VIABILITY SCORE CARD =====
      const scoreColor = report.viabilityScore >= 70 ? [34, 197, 94] : report.viabilityScore >= 50 ? [234, 179, 8] : [239, 68, 68];
      const scoreLabel = report.viabilityScore >= 70 ? 'High Viability' : report.viabilityScore >= 50 ? 'Moderate Viability' : 'Low Viability';
      const scoreDesc = report.viabilityScore >= 70 ? 'Strong market opportunity - Proceed with confidence' : report.viabilityScore >= 50 ? 'Viable with validation - Test before scaling' : 'High risk - Consider pivoting strategy';
      
      // Card background
      pdfDoc.setFillColor(250, 250, 252);
      pdfDoc.roundedRect(margin, y, contentWidth, 45, 4, 4, 'F');
      
      // Left color bar
      pdfDoc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdfDoc.roundedRect(margin, y, 4, 45, 2, 2, 'F');
      
      // Score circle with ring
      const circleX = margin + 30;
      const circleY = y + 22.5;
      
      // Outer ring
      pdfDoc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdfDoc.setLineWidth(2);
      pdfDoc.circle(circleX, circleY, 15, 'S');
      
      // Inner filled circle
      pdfDoc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdfDoc.circle(circleX, circleY, 12, 'F');
      
      // Score number - center properly
      pdfDoc.setFontSize(16);
      pdfDoc.setTextColor(255, 255, 255);
      pdfDoc.text(String(report.viabilityScore), circleX, circleY + 3, { align: 'center' });
      
      // Score label and description
      pdfDoc.setFontSize(14);
      pdfDoc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdfDoc.text(scoreLabel, margin + 52, y + 15);
      pdfDoc.setFontSize(9);
      pdfDoc.setTextColor(100, 100, 100);
      pdfDoc.text(scoreDesc, margin + 52, y + 23);
      
      // Key metrics row
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(80, 80, 80);
      
      // Market Size
      pdfDoc.setFillColor(139, 92, 246);
      pdfDoc.circle(margin + 52, y + 35, 1.5, 'F');
      pdfDoc.text(`Market: ${report.marketSize || 'N/A'}`, margin + 56, y + 37);
      
      // Growth Rate
      pdfDoc.setFillColor(34, 197, 94);
      pdfDoc.circle(margin + 95, y + 35, 1.5, 'F');
      pdfDoc.text(`Growth: ${report.growthRate || 'N/A'}`, margin + 99, y + 37);
      
      // Competition
      pdfDoc.setFillColor(234, 179, 8);
      pdfDoc.circle(margin + 135, y + 35, 1.5, 'F');
      pdfDoc.text(`Competition: ${report.competition || 'N/A'}`, margin + 139, y + 37);
      
      y += 55;

      // ===== EXECUTIVE SUMMARY =====
      if (report.keyInsights) {
        drawSectionHeader('📊', 'EXECUTIVE SUMMARY', [139, 92, 246]);
        pdfDoc.setFontSize(10);
        pdfDoc.setTextColor(50, 50, 50);
        const insightLines = pdfDoc.splitTextToSize(report.keyInsights, contentWidth - 5);
        pdfDoc.text(insightLines, margin + 5, y);
        y += insightLines.length * 5 + 10;
      }

      // ===== TARGET AUDIENCE =====
      if (report.targetAudience) {
        drawSectionHeader('🎯', 'TARGET AUDIENCE', [59, 130, 246]);
        pdfDoc.setFontSize(10);
        pdfDoc.setTextColor(50, 50, 50);
        const audienceLines = pdfDoc.splitTextToSize(report.targetAudience, contentWidth - 5);
        pdfDoc.text(audienceLines, margin + 5, y);
        y += audienceLines.length * 5 + 10;
      }

      // ===== PAIN POINTS =====
      if (report.painPoints && report.painPoints.length > 0) {
        checkPageBreak(40);
        drawSectionHeader('🔥', 'PAIN POINTS', [239, 68, 68]);
        report.painPoints.forEach((point) => {
          drawBulletPoint(point, [239, 68, 68]);
        });
        y += 5;
      }

      // ===== OPPORTUNITIES =====
      if (report.opportunities && report.opportunities.length > 0) {
        checkPageBreak(40);
        drawSectionHeader('💡', 'OPPORTUNITIES', [34, 197, 94]);
        report.opportunities.forEach((opp) => {
          drawBulletPoint(opp, [34, 197, 94]);
        });
        y += 5;
      }

      // ===== COMPETITOR ANALYSIS =====
      if (report.competitors && report.competitors.length > 0) {
        checkPageBreak(50);
        drawSectionHeader('⚔️', 'COMPETITOR ANALYSIS', [107, 114, 128]);
        
        report.competitors.forEach((comp, i) => {
          const compHeight = 22;
          checkPageBreak(compHeight + 5);
          
          // Card background
          pdfDoc.setFillColor(250, 250, 252);
          pdfDoc.roundedRect(margin + 5, y, contentWidth - 10, compHeight, 3, 3, 'F');
          
          // Number badge
          pdfDoc.setFillColor(139, 92, 246);
          pdfDoc.roundedRect(margin + 8, y + 3, 16, 16, 2, 2, 'F');
          pdfDoc.setFontSize(10);
          pdfDoc.setTextColor(255, 255, 255);
          pdfDoc.text(String(i + 1), margin + 16, y + 13, { align: 'center' });
          
          // Competitor name
          pdfDoc.setFontSize(10);
          pdfDoc.setTextColor(30, 30, 30);
          pdfDoc.text(comp.name, margin + 28, y + 9);
          
          // Pricing tag
          if (comp.pricing) {
            pdfDoc.setFontSize(8);
            pdfDoc.setTextColor(139, 92, 246);
            pdfDoc.text(comp.pricing, margin + 28, y + 16);
          }
          
          // Weakness
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(239, 68, 68);
          const weaknessLines = pdfDoc.splitTextToSize(comp.weakness, 75);
          pdfDoc.text(weaknessLines, pageWidth - margin - 80, y + 10);
          
          y += compHeight + 4;
        });
        y += 8;
      }

      // ===== BARRIERS TO ENTRY =====
      if (report.barriers && report.barriers.length > 0) {
        checkPageBreak(40);
        drawSectionHeader('🚧', 'BARRIERS TO ENTRY', [234, 179, 8]);
        report.barriers.forEach((barrier) => {
          drawBulletPoint(barrier, [234, 179, 8]);
        });
        y += 5;
      }

      // ===== MARKETING CHANNELS =====
      if (report.marketingChannels && report.marketingChannels.length > 0) {
        checkPageBreak(40);
        drawSectionHeader('📢', 'MARKETING CHANNELS', [14, 165, 233]);
        report.marketingChannels.forEach((channel) => {
          drawBulletPoint(channel, [14, 165, 233]);
        });
        y += 5;
      }

      // ===== DEMAND SIGNALS =====
      if (report.demandSignals && report.demandSignals.length > 0) {
        checkPageBreak(40);
        drawSectionHeader('📈', 'DEMAND SIGNALS', [16, 185, 129]);
        report.demandSignals.forEach((signal) => {
          drawBulletPoint(signal, [16, 185, 129]);
        });
        y += 5;
      }

      // ===== RISK FACTORS =====
      if (report.riskFactors && report.riskFactors.length > 0) {
        checkPageBreak(40);
        drawSectionHeader('⚠️', 'RISK FACTORS', [239, 68, 68]);
        report.riskFactors.forEach((risk) => {
          drawBulletPoint(risk, [239, 68, 68]);
        });
        y += 5;
      }

      // ===== REDDIT & COMMUNITY INSIGHTS =====
      if (report.redditInsights || (report.redditQuotes && report.redditQuotes.length > 0)) {
        checkPageBreak(50);
        drawSectionHeader('💬', 'COMMUNITY INSIGHTS', [255, 69, 0]);
        
        if (report.redditInsights) {
          pdfDoc.setFontSize(9);
          pdfDoc.setTextColor(50, 50, 50);
          const redditLines = pdfDoc.splitTextToSize(report.redditInsights, contentWidth - 10);
          pdfDoc.text(redditLines, margin + 5, y);
          y += redditLines.length * 4.5 + 8;
        }

        if (report.redditQuotes && report.redditQuotes.length > 0) {
          pdfDoc.setFontSize(9);
          pdfDoc.setTextColor(80, 80, 80);
          pdfDoc.text('Real quotes from the community:', margin + 5, y);
          y += 8;
          
          report.redditQuotes.forEach((q) => {
            const quoteLines = pdfDoc.splitTextToSize(`"${q.quote}"`, contentWidth - 25);
            const quoteBoxHeight = Math.max(20, (quoteLines.length * 4.5) + 14);
            checkPageBreak(quoteBoxHeight + 5);
            
            // Quote card
            pdfDoc.setFillColor(255, 250, 245);
            pdfDoc.roundedRect(margin + 5, y, contentWidth - 10, quoteBoxHeight, 3, 3, 'F');
            
            // Orange left bar
            pdfDoc.setFillColor(255, 69, 0);
            pdfDoc.roundedRect(margin + 5, y, 3, quoteBoxHeight, 1.5, 1.5, 'F');
            
            // Quote text
            pdfDoc.setFontSize(9);
            pdfDoc.setTextColor(50, 50, 50);
            pdfDoc.text(quoteLines, margin + 12, y + 6);
            
            // Source
            pdfDoc.setFontSize(7);
            pdfDoc.setTextColor(255, 69, 0);
            pdfDoc.text(`— ${q.subreddit || 'Community'} • ${q.context || 'User comment'}`, margin + 12, y + quoteBoxHeight - 4);
            y += quoteBoxHeight + 5;
          });
        }
        y += 5;
      }

      // ===== RECOMMENDED OFFER (Highlight Box) =====
      if (report.recommendedOffer) {
        // Set font BEFORE splitting text (jsPDF needs current font to calculate width)
        pdfDoc.setFontSize(8.5);
        
        // Calculate text width - text starts at margin+10, box ends at margin+contentWidth
        const offerTextWidth = contentWidth - 24;
        const offerLines = pdfDoc.splitTextToSize(report.recommendedOffer, offerTextWidth);
        
        // Calculate box height: header (18) + text lines + padding + pricing row (if exists)
        const textHeight = offerLines.length * 4.5;
        const pricingRowHeight = report.pricingRange ? 20 : 0;
        const offerBoxHeight = 22 + textHeight + pricingRowHeight + 8;
        
        checkPageBreak(offerBoxHeight + 10);
        
        // Gradient-like purple card
        pdfDoc.setFillColor(88, 28, 135);
        pdfDoc.roundedRect(margin, y, contentWidth, offerBoxHeight, 5, 5, 'F');
        
        // Inner lighter area
        pdfDoc.setFillColor(107, 33, 168);
        pdfDoc.roundedRect(margin + 2, y + 2, contentWidth - 4, offerBoxHeight - 4, 4, 4, 'F');
        
        // Header with emoji
        const offerEmoji = emojiMap['💰'];
        let offerTextX = margin + 10;
        if (offerEmoji) {
          try {
            pdfDoc.addImage(offerEmoji, 'PNG', margin + 8, y + 5, 6, 6);
            offerTextX = margin + 17;
          } catch {}
        }
        pdfDoc.setFontSize(12);
        pdfDoc.setTextColor(255, 255, 255);
        pdfDoc.text('RECOMMENDED OFFER', offerTextX, y + 12);
        
        // Offer text (font already set above for proper text splitting)
        pdfDoc.setFontSize(8.5);
        pdfDoc.setTextColor(230, 230, 255);
        pdfDoc.text(offerLines, margin + 10, y + 22);
        
        // Pricing badge - positioned at bottom, wider to fit content
        if (report.pricingRange) {
          const pricingY = y + 22 + textHeight + 5;
          // Measure text width and add padding
          pdfDoc.setFontSize(8);
          const pricingTextWidth = pdfDoc.getTextWidth(report.pricingRange);
          const badgeWidth = Math.max(pricingTextWidth + 14, 60);
          
          pdfDoc.setFillColor(139, 92, 246);
          pdfDoc.roundedRect(margin + 10, pricingY, badgeWidth, 12, 3, 3, 'F');
          pdfDoc.setTextColor(255, 255, 255);
          pdfDoc.text(report.pricingRange, margin + 10 + (badgeWidth / 2), pricingY + 7.5, { align: 'center' });
        }
        y += offerBoxHeight + 10;
      }

      // ===== ACQUISITION STRATEGY =====
      if (report.acquisitionStrategy) {
        checkPageBreak(35);
        drawSectionHeader('🚀', 'ACQUISITION STRATEGY', [139, 92, 246]);
        pdfDoc.setFontSize(9);
        pdfDoc.setTextColor(50, 50, 50);
        const stratLines = pdfDoc.splitTextToSize(report.acquisitionStrategy, contentWidth - 10);
        pdfDoc.text(stratLines, margin + 5, y);
        y += stratLines.length * 4.5 + 10;
      }

      // ===== WHY NOW =====
      if (report.urgencyFactors && report.urgencyFactors.length > 0) {
        checkPageBreak(40);
        drawSectionHeader('⏰', 'WHY NOW?', [249, 115, 22]);
        report.urgencyFactors.forEach((factor) => {
          drawBulletPoint(factor, [249, 115, 22]);
        });
        y += 5;
      }

      // ===== SOURCES =====
      if (report.sources && report.sources.length > 0) {
        checkPageBreak(35);
        drawSectionHeader('📚', 'SOURCES & CITATIONS', [107, 114, 128]);
        pdfDoc.setFontSize(7);
        pdfDoc.setTextColor(100, 100, 100);
        report.sources.slice(0, 8).forEach((source, i) => {
          checkPageBreak(8);
          const sourceLines = pdfDoc.splitTextToSize(`[${i + 1}] ${source}`, contentWidth - 10);
          pdfDoc.text(sourceLines, margin + 5, y);
          y += sourceLines.length * 3.5 + 2;
        });
      }

      // Final footer
      addFooter();
      
      pdfDoc.save(`truth-engine-${report.niche.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High Viability - Strongly recommended';
    if (score >= 60) return 'Moderate Viability - Proceed with validation';
    return 'Low Viability - Consider pivoting';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <h2 className="text-white text-xl mb-4">Report not found</h2>
        <Link href="/engine/dashboard/reports">
          <button className="text-purple-400 hover:text-purple-300">← Back to Reports</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/engine/dashboard/reports" className="text-purple-400 hover:text-purple-300 text-sm mb-2 inline-block">
            ← Back to Reports
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
          >
            {report.niche}
          </motion.h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-2"
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
              localStorage.setItem('lastTruthReport', JSON.stringify({
                ...report,
                query: report.niche,
                savedAt: new Date().toISOString(),
              }));
              router.push('/engine/dashboard/offers/new');
            }}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Build This Offer →
          </button>
        </div>
      </div>

      {/* Viability Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-8"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Market Viability Score</h2>
            <p className="text-white/50 mb-4">Based on demand, competition, profit potential &amp; scalability</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-bold ${getScoreColor(report.viabilityScore)}`}>
                {report.viabilityScore}
              </span>
              <span className="text-2xl text-white/50">/100</span>
            </div>
            <p className={`${getScoreColor(report.viabilityScore)} mt-2`}>
              {getScoreLabel(report.viabilityScore)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-sm">Market Size</p>
              <p className="text-white text-xl font-semibold">{report.marketSize}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-sm">Growth Rate</p>
              <p className="text-white text-xl font-semibold">{report.growthRate}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-sm">Competition</p>
              <p className="text-white text-xl font-semibold">{report.competition}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white/50 text-sm">Price Range</p>
              <p className="text-white text-xl font-semibold">{report.pricingRange}</p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        {report.keyInsights && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white font-medium mb-2">Key Insights</h3>
            <p className="text-white/70">{report.keyInsights}</p>
          </div>
        )}
      </motion.div>

      {/* Target Audience */}
      {report.targetAudience && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            Target Audience
          </h3>
          <p className="text-white/70">{report.targetAudience}</p>
        </motion.div>
      )}

      {/* Pain Points & Opportunities */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            Pain Points Identified
          </h3>
          <ul className="space-y-3">
            {report.painPoints?.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-white/70">
                <span className="text-red-400 mt-0.5">•</span>
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Opportunities
          </h3>
          <ul className="space-y-3">
            {report.opportunities?.map((opp, index) => (
              <li key={index} className="flex items-start gap-3 text-white/70">
                <span className="text-green-400 mt-0.5">•</span>
                {opp}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Barriers to Entry */}
      {report.barriers && report.barriers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Barriers to Entry
          </h3>
          <ul className="space-y-3">
            {report.barriers.map((barrier, index) => (
              <li key={index} className="flex items-start gap-3 text-white/70">
                <span className="text-yellow-400 mt-0.5">•</span>
                {barrier}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Competitor Analysis */}
      {report.competitors && report.competitors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Competitor X-Ray</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.competitors.map((competitor, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4">
                <p className="text-white font-medium mb-2">{competitor.name}</p>
                {competitor.pricing && (
                  <p className="text-white/50 text-sm mb-1">
                    <span className="text-purple-400">Pricing:</span> {competitor.pricing}
                  </p>
                )}
                <p className="text-white/50 text-sm">
                  <span className="text-red-400">Weakness:</span> {competitor.weakness}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Marketing & Acquisition Strategy */}
      <div className="grid md:grid-cols-2 gap-6">
        {report.marketingChannels && report.marketingChannels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              Best Marketing Channels
            </h3>
            <ul className="space-y-3">
              {report.marketingChannels.map((channel, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-blue-400 mt-0.5">{index + 1}.</span>
                  {channel}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {report.urgencyFactors && report.urgencyFactors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full" />
              Why Now?
            </h3>
            <ul className="space-y-3">
              {report.urgencyFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-orange-400 mt-0.5">⚡</span>
                  {factor}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Acquisition Strategy */}
      {report.acquisitionStrategy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full" />
            Customer Acquisition Strategy
          </h3>
          <p className="text-white/70">{report.acquisitionStrategy}</p>
        </motion.div>
      )}

      {/* Reddit Insights */}
      {(report.redditInsights || (report.redditQuotes && report.redditQuotes.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
            Reddit & Forum Insights
          </h3>
          {report.redditInsights && (
            <p className="text-white/70 mb-4">{report.redditInsights}</p>
          )}
          {report.redditQuotes && report.redditQuotes.length > 0 && (
            <div className="space-y-3 mt-4">
              <p className="text-white/50 text-sm font-medium">Actual quotes from communities:</p>
              {report.redditQuotes.map((q, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border-l-2 border-orange-400">
                  <p className="text-white/80 italic">&quot;{q.quote}&quot;</p>
                  <p className="text-orange-400 text-sm mt-1">{q.subreddit} • {q.context}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Demand Signals & Risk Factors */}
      <div className="grid md:grid-cols-2 gap-6">
        {report.demandSignals && report.demandSignals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Demand Signals
            </h3>
            <ul className="space-y-3">
              {report.demandSignals.map((signal, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-green-400 mt-0.5">📈</span>
                  {signal}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {report.riskFactors && report.riskFactors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full" />
              Risk Factors
            </h3>
            <ul className="space-y-3">
              {report.riskFactors.map((risk, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-red-400 mt-0.5">⚠️</span>
                  {risk}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Recommended Offer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-6"
      >
        <h3 className="text-white font-semibold mb-2">Recommended Offer</h3>
        <p className="text-white text-xl mb-4">{report.recommendedOffer}</p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => {
              localStorage.setItem('lastTruthReport', JSON.stringify({
                ...report,
                query: report.niche,
                savedAt: new Date().toISOString(),
              }));
              router.push('/engine/dashboard/offers/new');
            }}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Build This Offer →
          </button>
          <button 
            onClick={() => router.push('/engine/dashboard/agents')}
            className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
          >
            Ask AI Agents
          </button>
        </div>
      </motion.div>

      {/* Sources */}
      {report.sources && report.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white/70 font-medium mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Sources & Citations
          </h3>
          <ul className="space-y-2">
            {report.sources.map((source, index) => (
              <li key={index} className="text-white/50 text-sm flex items-start gap-2">
                <span className="text-purple-400">[{index + 1}]</span>
                <a 
                  href={source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors truncate"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
