'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { saveTruthReport, deductCredits } from '@/lib/firebase/firestore';

interface RedditQuote {
  quote: string;
  subreddit: string;
  context: string;
}

interface Report {
  niche: string;
  viabilityScore: number;
  marketSize: string;
  growthRate: string;
  competition: string;
  painPoints: string[];
  opportunities: string[];
  competitors: { name: string; weakness: string; pricing?: string }[];
  recommendedOffer: string;
  pricingRange: string;
  targetAudience?: string;
  keyInsights?: string;
  marketingChannels?: string[];
  acquisitionStrategy?: string;
  barriers?: string[];
  redditInsights?: string;
  redditQuotes?: RedditQuote[];
  urgencyFactors?: string[];
  demandSignals?: string[];
  riskFactors?: string[];
  sources?: string[];
  generatedAt?: string;
  fromCache?: boolean;
}

export default function TruthEngineDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [niche, setNiche] = useState('');
  const [niche2, setNiche2] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [report2, setReport2] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  // Pre-fill niche from offer context
  useEffect(() => {
    const savedNiche = localStorage.getItem('truthEngineNiche');
    if (savedNiche) {
      setNiche(savedNiche);
      localStorage.removeItem('truthEngineNiche');
    }
  }, []);

  const handleExportPDF = async () => {
    if (!report) return;
    setExporting(true);
    
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let y = 20;
      let pageNum = 1;

      // ===== HELPER FUNCTIONS =====
      const addFooter = () => {
        // Dark footer bar
        doc.setFillColor(24, 24, 27);
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text('Engine by CRFTD', margin, pageHeight - 6);
        doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
        
        // Purple accent line
        doc.setDrawColor(139, 92, 246);
        doc.setLineWidth(0.5);
        doc.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
      };

      const checkPageBreak = (needed: number) => {
        if (y + needed > pageHeight - 25) {
          addFooter();
          doc.addPage();
          pageNum++;
          y = 20;
          return true;
        }
        return false;
      };

      // Helper to load emoji as image from CDN (Apple emoji)
      const loadEmojiImage = async (emoji: string): Promise<string | null> => {
        try {
          const codePoint = [...emoji].map(char => char.codePointAt(0)?.toString(16)).filter(Boolean).join('-');
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
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(margin, y, 3, 10, 1.5, 1.5, 'F');
        
        // Add emoji image if available
        const emojiImg = emojiMap[emoji];
        let textX = margin + 7;
        if (emojiImg) {
          try {
            doc.addImage(emojiImg, 'PNG', margin + 6, y - 1, 6, 6);
            textX = margin + 14;
          } catch {
            // Fallback to no emoji
          }
        }
        
        // Title
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text(title, textX, y + 7);
        
        // Underline
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.3);
        doc.line(textX, y + 10, textX + doc.getTextWidth(title), y + 10);
        
        y += 16;
      };

      const drawBulletPoint = (text: string, color: number[], indent: number = 0) => {
        checkPageBreak(10);
        
        // Colored bullet
        doc.setFillColor(color[0], color[1], color[2]);
        doc.circle(margin + 7 + indent, y - 1.5, 1.5, 'F');
        
        // Text
        doc.setFontSize(9);
        doc.setTextColor(55, 55, 55);
        const lines = doc.splitTextToSize(text, contentWidth - 15 - indent);
        doc.text(lines, margin + 12 + indent, y);
        y += lines.length * 4.5 + 3;
      };

      // ===== PAGE 1: HEADER =====
      
      // Dark header bar
      doc.setFillColor(24, 24, 27);
      doc.rect(0, 0, pageWidth, 42, 'F');
      
      // Purple gradient accent line
      doc.setFillColor(139, 92, 246);
      doc.rect(0, 42, pageWidth, 2, 'F');
      
      // Title and subtitle
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('TRUTH ENGINE', margin, 18);
      doc.setFontSize(11);
      doc.setTextColor(180, 180, 180);
      doc.text('Market Intelligence Report', margin, 28);
      
      // Date badge
      doc.setFillColor(139, 92, 246);
      doc.roundedRect(pageWidth - margin - 45, 10, 45, 12, 3, 3, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), pageWidth - margin - 22.5, 17.5, { align: 'center' });
      
      // Powered by badge
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('Powered by Perplexity AI + Real-Time Data', pageWidth - margin, 36, { align: 'right' });
      
      y = 52;
      
      // ===== NICHE TITLE (dynamic sizing for long titles) =====
      let nicheFontSize = 18;
      if (report.niche.length > 60) nicheFontSize = 14;
      else if (report.niche.length > 40) nicheFontSize = 16;
      
      doc.setFontSize(nicheFontSize);
      doc.setTextColor(30, 30, 30);
      const nicheLines = doc.splitTextToSize(report.niche, contentWidth);
      doc.text(nicheLines, margin, y);
      y += nicheLines.length * (nicheFontSize * 0.45) + 8;

      // ===== VIABILITY SCORE CARD =====
      const scoreColor = report.viabilityScore >= 70 ? [34, 197, 94] : report.viabilityScore >= 50 ? [234, 179, 8] : [239, 68, 68];
      const scoreLabel = report.viabilityScore >= 70 ? 'High Viability' : report.viabilityScore >= 50 ? 'Moderate Viability' : 'Low Viability';
      const scoreDesc = report.viabilityScore >= 70 ? 'Strong market opportunity - Proceed with confidence' : report.viabilityScore >= 50 ? 'Viable with validation - Test before scaling' : 'High risk - Consider pivoting strategy';
      
      // Card background
      doc.setFillColor(250, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 45, 4, 4, 'F');
      
      // Left color bar
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.roundedRect(margin, y, 4, 45, 2, 2, 'F');
      
      // Score circle with ring
      const circleX = margin + 30;
      const circleY = y + 22.5;
      
      // Outer ring
      doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.setLineWidth(2);
      doc.circle(circleX, circleY, 15, 'S');
      
      // Inner filled circle
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.circle(circleX, circleY, 12, 'F');
      
      // Score number - center properly
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(String(report.viabilityScore), circleX, circleY + 3, { align: 'center' });
      
      // Score label and description
      doc.setFontSize(14);
      doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.text(scoreLabel, margin + 52, y + 15);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(scoreDesc, margin + 52, y + 23);
      
      // Key metrics row
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      
      // Market Size
      doc.setFillColor(139, 92, 246);
      doc.circle(margin + 52, y + 35, 1.5, 'F');
      doc.text(`Market: ${report.marketSize || 'N/A'}`, margin + 56, y + 37);
      
      // Growth Rate
      doc.setFillColor(34, 197, 94);
      doc.circle(margin + 95, y + 35, 1.5, 'F');
      doc.text(`Growth: ${report.growthRate || 'N/A'}`, margin + 99, y + 37);
      
      // Competition
      doc.setFillColor(234, 179, 8);
      doc.circle(margin + 135, y + 35, 1.5, 'F');
      doc.text(`Competition: ${report.competition || 'N/A'}`, margin + 139, y + 37);
      
      y += 55;

      // ===== EXECUTIVE SUMMARY =====
      if (report.keyInsights) {
        drawSectionHeader('📊', 'EXECUTIVE SUMMARY', [139, 92, 246]);
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const insightLines = doc.splitTextToSize(report.keyInsights, contentWidth - 5);
        doc.text(insightLines, margin + 5, y);
        y += insightLines.length * 5 + 10;
      }

      // ===== TARGET AUDIENCE =====
      if (report.targetAudience) {
        drawSectionHeader('🎯', 'TARGET AUDIENCE', [59, 130, 246]);
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const audienceLines = doc.splitTextToSize(report.targetAudience, contentWidth - 5);
        doc.text(audienceLines, margin + 5, y);
        y += audienceLines.length * 5 + 10;
      }

      // ===== PAIN POINTS =====
      checkPageBreak(40);
      drawSectionHeader('🔥', 'PAIN POINTS', [239, 68, 68]);
      report.painPoints.forEach((point) => {
        drawBulletPoint(point, [239, 68, 68]);
      });
      y += 5;

      // ===== OPPORTUNITIES =====
      checkPageBreak(40);
      drawSectionHeader('💡', 'OPPORTUNITIES', [34, 197, 94]);
      report.opportunities.forEach((opp) => {
        drawBulletPoint(opp, [34, 197, 94]);
      });
      y += 5;

      // ===== COMPETITOR ANALYSIS =====
      checkPageBreak(50);
      drawSectionHeader('⚔️', 'COMPETITOR ANALYSIS', [107, 114, 128]);
      
      report.competitors.forEach((comp, i) => {
        const compHeight = 22;
        checkPageBreak(compHeight + 5);
        
        // Card background
        doc.setFillColor(250, 250, 252);
        doc.roundedRect(margin + 5, y, contentWidth - 10, compHeight, 3, 3, 'F');
        
        // Number badge
        doc.setFillColor(139, 92, 246);
        doc.roundedRect(margin + 8, y + 3, 16, 16, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), margin + 16, y + 13, { align: 'center' });
        
        // Competitor name
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text(comp.name, margin + 28, y + 9);
        
        // Pricing tag
        if (comp.pricing) {
          doc.setFontSize(8);
          doc.setTextColor(139, 92, 246);
          doc.text(comp.pricing, margin + 28, y + 16);
        }
        
        // Weakness
        doc.setFontSize(8);
        doc.setTextColor(239, 68, 68);
        const weaknessLines = doc.splitTextToSize(comp.weakness, 75);
        doc.text(weaknessLines, pageWidth - margin - 80, y + 10);
        
        y += compHeight + 4;
      });
      y += 8;

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
        drawSectionHeader('📢', 'RECOMMENDED MARKETING CHANNELS', [14, 165, 233]);
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
        drawSectionHeader('💬', 'REDDIT & COMMUNITY INSIGHTS', [255, 69, 0]);
        
        if (report.redditInsights) {
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          const redditLines = doc.splitTextToSize(report.redditInsights, contentWidth - 10);
          doc.text(redditLines, margin + 5, y);
          y += redditLines.length * 4.5 + 8;
        }

        if (report.redditQuotes && report.redditQuotes.length > 0) {
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.text('Real quotes from the community:', margin + 5, y);
          y += 8;
          
          report.redditQuotes.forEach((q) => {
            const quoteLines = doc.splitTextToSize(`"${q.quote}"`, contentWidth - 25);
            const quoteBoxHeight = Math.max(20, (quoteLines.length * 4.5) + 14);
            checkPageBreak(quoteBoxHeight + 5);
            
            // Quote card
            doc.setFillColor(255, 250, 245);
            doc.roundedRect(margin + 5, y, contentWidth - 10, quoteBoxHeight, 3, 3, 'F');
            
            // Orange left bar
            doc.setFillColor(255, 69, 0);
            doc.roundedRect(margin + 5, y, 3, quoteBoxHeight, 1.5, 1.5, 'F');
            
            // Quote text
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            doc.text(quoteLines, margin + 12, y + 6);
            
            // Source
            doc.setFontSize(7);
            doc.setTextColor(255, 69, 0);
            doc.text(`— ${q.subreddit || 'Community'} • ${q.context || 'User comment'}`, margin + 12, y + quoteBoxHeight - 4);
            y += quoteBoxHeight + 5;
          });
        }
        y += 5;
      }

      // ===== RECOMMENDED OFFER (Highlight Box) =====
      if (report.recommendedOffer) {
        // Set font BEFORE splitting text (jsPDF needs current font to calculate width)
        doc.setFontSize(8.5);
        
        // Calculate text width - text starts at margin+10, need padding on right too
        const offerTextWidth = contentWidth - 24;
        const offerLines = doc.splitTextToSize(report.recommendedOffer, offerTextWidth);
        
        // Calculate box height: header (18) + text lines + padding + pricing row (if exists)
        const textHeight = offerLines.length * 4.5;
        const pricingRowHeight = report.pricingRange ? 20 : 0;
        const offerBoxHeight = 22 + textHeight + pricingRowHeight + 8;
        
        checkPageBreak(offerBoxHeight + 10);
        
        // Gradient-like purple card
        doc.setFillColor(88, 28, 135);
        doc.roundedRect(margin, y, contentWidth, offerBoxHeight, 5, 5, 'F');
        
        // Inner lighter area
        doc.setFillColor(107, 33, 168);
        doc.roundedRect(margin + 2, y + 2, contentWidth - 4, offerBoxHeight - 4, 4, 4, 'F');
        
        // Header with emoji
        const offerEmoji = emojiMap['💰'];
        let offerTextX = margin + 10;
        if (offerEmoji) {
          try {
            doc.addImage(offerEmoji, 'PNG', margin + 8, y + 5, 6, 6);
            offerTextX = margin + 17;
          } catch {}
        }
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('RECOMMENDED OFFER', offerTextX, y + 12);
        
        // Offer text (font already set above for proper text splitting)
        doc.setFontSize(8.5);
        doc.setTextColor(230, 230, 255);
        doc.text(offerLines, margin + 10, y + 22);
        
        // Pricing badge - positioned at bottom, wider to fit content
        if (report.pricingRange) {
          const pricingY = y + 22 + textHeight + 5;
          // Measure text width and add padding
          doc.setFontSize(8);
          const pricingTextWidth = doc.getTextWidth(report.pricingRange);
          const badgeWidth = Math.max(pricingTextWidth + 14, 60);
          
          doc.setFillColor(139, 92, 246);
          doc.roundedRect(margin + 10, pricingY, badgeWidth, 12, 3, 3, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(report.pricingRange, margin + 10 + (badgeWidth / 2), pricingY + 7.5, { align: 'center' });
        }
        y += offerBoxHeight + 10;
      }

      // ===== ACQUISITION STRATEGY =====
      if (report.acquisitionStrategy) {
        checkPageBreak(35);
        drawSectionHeader('🚀', 'CUSTOMER ACQUISITION STRATEGY', [139, 92, 246]);
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        const stratLines = doc.splitTextToSize(report.acquisitionStrategy, contentWidth - 10);
        doc.text(stratLines, margin + 5, y);
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
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        report.sources.slice(0, 8).forEach((source, i) => {
          checkPageBreak(8);
          const sourceLines = doc.splitTextToSize(`[${i + 1}] ${source}`, contentWidth - 10);
          doc.text(sourceLines, margin + 5, y);
          y += sourceLines.length * 3.5 + 2;
        });
      }

      // Final footer
      addFooter();
      
      doc.save(`truth-engine-${report.niche.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (!report) return;
    
    const escapeCSV = (val: string | number | undefined) => {
      if (val === undefined || val === null) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const rows = [
      ['Truth Engine Report', ''],
      ['Generated', new Date().toLocaleDateString()],
      [''],
      ['Niche', escapeCSV(report.niche)],
      ['Viability Score', report.viabilityScore],
      ['Market Size', escapeCSV(report.marketSize)],
      ['Growth Rate', escapeCSV(report.growthRate)],
      ['Competition', escapeCSV(report.competition)],
      [''],
      ['Executive Summary', escapeCSV(report.keyInsights)],
      ['Target Audience', escapeCSV(report.targetAudience)],
      ['Recommended Offer', escapeCSV(report.recommendedOffer)],
      ['Pricing Range', escapeCSV(report.pricingRange)],
      ['Acquisition Strategy', escapeCSV(report.acquisitionStrategy)],
      [''],
      ['Pain Points'],
      ...report.painPoints.map((p, i) => [`${i + 1}`, escapeCSV(p)]),
      [''],
      ['Opportunities'],
      ...report.opportunities.map((o, i) => [`${i + 1}`, escapeCSV(o)]),
      [''],
      ['Competitors', 'Pricing', 'Weakness'],
      ...report.competitors.map(c => [escapeCSV(c.name), escapeCSV(c.pricing), escapeCSV(c.weakness)]),
      [''],
      ['Barriers to Entry'],
      ...(report.barriers || []).map((b, i) => [`${i + 1}`, escapeCSV(b)]),
      [''],
      ['Marketing Channels'],
      ...(report.marketingChannels || []).map((m, i) => [`${i + 1}`, escapeCSV(m)]),
      [''],
      ['Demand Signals'],
      ...(report.demandSignals || []).map((d, i) => [`${i + 1}`, escapeCSV(d)]),
      [''],
      ['Risk Factors'],
      ...(report.riskFactors || []).map((r, i) => [`${i + 1}`, escapeCSV(r)]),
      [''],
      ['Why Now?'],
      ...(report.urgencyFactors || []).map((u, i) => [`${i + 1}`, escapeCSV(u)]),
      [''],
      ['Reddit Insights', escapeCSV(report.redditInsights)],
      [''],
      ['Reddit Quotes', 'Subreddit', 'Context'],
      ...(report.redditQuotes || []).map(q => [escapeCSV(q.quote), escapeCSV(q.subreddit), escapeCSV(q.context)]),
      [''],
      ['Sources'],
      ...(report.sources || []).map((s, i) => [`${i + 1}`, escapeCSV(s)]),
    ];
    
    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `truth-engine-${report.niche.toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = async () => {
    if (!niche.trim() || !user) return;
    if (compareMode && !niche2.trim()) return;
    
    // Credits unlimited - no check needed
    const creditsNeeded = compareMode ? 20 : 10;
    
    setLoading(true);
    setReport(null);
    setReport2(null);
    setError(null);
    setSaved(false);

    try {
      // Analyze first niche
      const response = await fetch('/api/engine/truth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze niche');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setReport(data);
      setFromCache(data.fromCache || false);
      
      // Save to localStorage for AI Auto-Fill in Offer Builder
      localStorage.setItem('lastTruthReport', JSON.stringify({
        ...data,
        query: niche,
        savedAt: new Date().toISOString(),
      }));

      // If compare mode, analyze second niche
      if (compareMode && niche2.trim()) {
        const response2 = await fetch('/api/engine/truth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ niche: niche2 }),
        });

        if (!response2.ok) {
          throw new Error('Failed to analyze second niche');
        }

        const data2 = await response2.json();
        
        if (data2.error) {
          throw new Error(data2.error);
        }

        setReport2(data2);
        
        // Save second report
        await saveTruthReport(user.uid, {
          niche: data2.niche,
          viabilityScore: data2.viabilityScore,
          marketSize: data2.marketSize,
          growthRate: data2.growthRate,
          competition: data2.competition,
          painPoints: data2.painPoints,
          opportunities: data2.opportunities,
          competitors: data2.competitors,
          recommendedOffer: data2.recommendedOffer,
          pricingRange: data2.pricingRange,
          targetAudience: data2.targetAudience,
          keyInsights: data2.keyInsights,
          marketingChannels: data2.marketingChannels,
          acquisitionStrategy: data2.acquisitionStrategy,
          barriers: data2.barriers,
          redditInsights: data2.redditInsights,
          redditQuotes: data2.redditQuotes,
          urgencyFactors: data2.urgencyFactors,
          demandSignals: data2.demandSignals,
          riskFactors: data2.riskFactors,
          sources: data2.sources,
        });
      }
      
      // Credits unlimited - no deduction
      
      // Save first report to Firestore
      await saveTruthReport(user.uid, {
        niche: data.niche,
        viabilityScore: data.viabilityScore,
        marketSize: data.marketSize,
        growthRate: data.growthRate,
        competition: data.competition,
        painPoints: data.painPoints,
        opportunities: data.opportunities,
        competitors: data.competitors,
        recommendedOffer: data.recommendedOffer,
        pricingRange: data.pricingRange,
        targetAudience: data.targetAudience,
        keyInsights: data.keyInsights,
        marketingChannels: data.marketingChannels,
        acquisitionStrategy: data.acquisitionStrategy,
        barriers: data.barriers,
        redditInsights: data.redditInsights,
        redditQuotes: data.redditQuotes,
        urgencyFactors: data.urgencyFactors,
        demandSignals: data.demandSignals,
        riskFactors: data.riskFactors,
        sources: data.sources,
      });
      
      setSaved(true);
      refreshProfile(); // Refresh to update credits display
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Truth Engine
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50"
        >
          Enter a niche to get AI-powered market intelligence and offer recommendations.
        </motion.p>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        {/* Compare Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <label className="block text-white font-medium">
            {compareMode ? 'Compare two niches' : 'Enter your niche or business idea'}
          </label>
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              setReport2(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              compareMode 
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30' 
                : 'bg-white/5 text-white/60 hover:text-white/80 border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {compareMode ? 'Compare Mode ON' : 'Compare Mode'}
          </button>
        </div>

        {/* Niche Inputs */}
        <div className={`grid ${compareMode ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4 mb-4`}>
          <div className="space-y-2">
            {compareMode && <span className="text-purple-400 text-sm">Niche 1</span>}
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !compareMode && handleAnalyze()}
              placeholder="e.g., AI automation agency..."
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          {compareMode && (
            <div className="space-y-2">
              <span className="text-violet-400 text-sm">Niche 2</span>
              <input
                type="text"
                value={niche2}
                onChange={(e) => setNiche2(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="e.g., Executive coaching..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !niche.trim() || (compareMode && !niche2.trim())}
          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : compareMode ? `Compare Niches (${20} credits)` : `Analyze Niche (${10} credits)`}
        </button>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-white/40 text-sm">Quick picks:</span>
          {['AI automation agency', 'Executive coaching', 'E-commerce consulting', 'Health coaching'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => compareMode && niche ? setNiche2(suggestion) : setNiche(suggestion)}
              className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">Analysis Failed</h3>
              <p className="text-white/60 text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12"
        >
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-3 border-purple-500 border-t-transparent rounded-full mx-auto mb-6" />
            <h3 className="text-white text-xl font-semibold mb-2">
              {compareMode ? `Comparing "${niche}" vs "${niche2}"` : `Analyzing "${niche}"`}
            </h3>
            <p className="text-white/50">
              {compareMode 
                ? 'AI is comparing market signals, competitors, and opportunities for both niches...'
                : 'AI is researching market signals, competitors, and opportunities...'}
            </p>
            
            <div className="mt-8 space-y-3 max-w-md mx-auto text-left">
              {[
                'Analyzing market demand signals...',
                'Scanning competitor landscape...',
                'Identifying pain points & gaps...',
                'Calculating viability score...',
                'Generating offer recommendations...',
              ].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.7 }}
                  className="flex items-center gap-3 text-white/60"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Comparison Results */}
      {report && report2 && compareMode && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Head-to-Head Score Comparison */}
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Head-to-Head Comparison</h2>
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Niche 1 */}
              <div className="text-center">
                <p className="text-purple-400 text-sm mb-2">Niche 1</p>
                <h3 className="text-white font-semibold mb-4">{report.niche}</h3>
                <span className={`text-5xl font-bold ${getScoreColor(report.viabilityScore)}`}>
                  {report.viabilityScore}
                </span>
                <span className="text-xl text-white/50">/100</span>
              </div>
              
              {/* VS */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xl">VS</span>
                </div>
                <p className={`text-sm ${report.viabilityScore > report2.viabilityScore ? 'text-purple-400' : report.viabilityScore < report2.viabilityScore ? 'text-violet-400' : 'text-white/50'}`}>
                  {report.viabilityScore > report2.viabilityScore 
                    ? `${report.niche} wins by ${report.viabilityScore - report2.viabilityScore} points`
                    : report.viabilityScore < report2.viabilityScore 
                      ? `${report2.niche} wins by ${report2.viabilityScore - report.viabilityScore} points`
                      : 'Tie!'}
                </p>
              </div>
              
              {/* Niche 2 */}
              <div className="text-center">
                <p className="text-violet-400 text-sm mb-2">Niche 2</p>
                <h3 className="text-white font-semibold mb-4">{report2.niche}</h3>
                <span className={`text-5xl font-bold ${getScoreColor(report2.viabilityScore)}`}>
                  {report2.viabilityScore}
                </span>
                <span className="text-xl text-white/50">/100</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Niche 1 Metrics */}
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full" />
                {report.niche}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/50">Market Size</span>
                  <span className="text-white font-semibold">{report.marketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Growth Rate</span>
                  <span className="text-white font-semibold">{report.growthRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Competition</span>
                  <span className="text-white font-semibold">{report.competition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Price Range</span>
                  <span className="text-white font-semibold">{report.pricingRange}</span>
                </div>
              </div>
            </div>
            
            {/* Niche 2 Metrics */}
            <div className="bg-white/5 border border-violet-500/30 rounded-2xl p-6">
              <h3 className="text-violet-400 font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full" />
                {report2.niche}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/50">Market Size</span>
                  <span className="text-white font-semibold">{report2.marketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Growth Rate</span>
                  <span className="text-white font-semibold">{report2.growthRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Competition</span>
                  <span className="text-white font-semibold">{report2.competition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Price Range</span>
                  <span className="text-white font-semibold">{report2.pricingRange}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Offers Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6">
              <h4 className="text-white font-medium mb-2">Recommended Offer</h4>
              <p className="text-white/70">{report.recommendedOffer}</p>
              <button 
                onClick={() => {
                  localStorage.setItem('lastTruthReport', JSON.stringify({
                    ...report,
                    query: report.niche,
                    savedAt: new Date().toISOString(),
                  }));
                  window.location.href = '/engine/dashboard/offers/new';
                }}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-500 transition-colors"
              >
                Build This Offer →
              </button>
            </div>
            <div className="bg-gradient-to-r from-violet-600/20 to-violet-900/20 border border-violet-500/30 rounded-2xl p-6">
              <h4 className="text-white font-medium mb-2">Recommended Offer</h4>
              <p className="text-white/70">{report2.recommendedOffer}</p>
              <button 
                onClick={() => {
                  localStorage.setItem('lastTruthReport', JSON.stringify({
                    ...report2,
                    query: report2.niche,
                    savedAt: new Date().toISOString(),
                  }));
                  window.location.href = '/engine/dashboard/offers/new';
                }}
                className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-violet-500 transition-colors"
              >
                Build This Offer →
              </button>
            </div>
          </div>

          {/* Winner Summary */}
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 text-center">
            <h3 className="text-green-400 font-semibold mb-2">🏆 Verdict</h3>
            <p className="text-white text-lg">
              {report.viabilityScore > report2.viabilityScore 
                ? `${report.niche} appears to be the stronger opportunity with a ${report.viabilityScore - report2.viabilityScore} point advantage.`
                : report.viabilityScore < report2.viabilityScore 
                  ? `${report2.niche} appears to be the stronger opportunity with a ${report2.viabilityScore - report.viabilityScore} point advantage.`
                  : 'Both niches scored equally! Consider other factors like your expertise and passion.'}
            </p>
          </div>

          {saved && (
            <p className="text-green-400 text-sm text-center flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Both reports saved to your history
            </p>
          )}
        </motion.div>
      )}

      {/* Report Results */}
      {report && !loading && (!compareMode || !report2) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Cache indicator */}
          {fromCache && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Cached result (no credits used) - analyzed within last 24 hours</span>
              </div>
              <button
                onClick={async () => {
                  setLoading(true);
                  setFromCache(false);
                  try {
                    const response = await fetch('/api/engine/truth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ niche: report.niche, skipCache: true }),
                    });
                    const data = await response.json();
                    if (!data.error) {
                      setReport(data);
                      setFromCache(false);
                      // Update localStorage for AI Auto-Fill
                      localStorage.setItem('lastTruthReport', JSON.stringify({
                        ...data,
                        query: report.niche,
                        savedAt: new Date().toISOString(),
                      }));
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
              >
                Refresh with fresh data
              </button>
            </div>
          )}

          {/* Viability Score */}
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-2xl p-8">
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
          </div>

          {/* Target Audience */}
          {report.targetAudience && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full" />
                Target Audience
              </h3>
              <p className="text-white/70">{report.targetAudience}</p>
            </div>
          )}

          {/* Pain Points & Opportunities */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full" />
                Pain Points Identified
              </h3>
              <ul className="space-y-3">
                {report.painPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/70">
                    <span className="text-red-400 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Opportunities
              </h3>
              <ul className="space-y-3">
                {report.opportunities.map((opp, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/70">
                    <span className="text-green-400 mt-0.5">•</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
          </div>

          {/* Barriers to Entry */}
          {report.barriers && report.barriers.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
            </div>
          )}

          {/* Marketing & Why Now */}
          <div className="grid md:grid-cols-2 gap-6">
            {report.marketingChannels && report.marketingChannels.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
              </div>
            )}

            {report.urgencyFactors && report.urgencyFactors.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
              </div>
            )}
          </div>

          {/* Acquisition Strategy */}
          {report.acquisitionStrategy && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                Customer Acquisition Strategy
              </h3>
              <p className="text-white/70">{report.acquisitionStrategy}</p>
            </div>
          )}

          {/* Reddit Insights */}
          {(report.redditInsights || (report.redditQuotes && report.redditQuotes.length > 0)) && (
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-2xl p-6">
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
            </div>
          )}

          {/* Demand Signals & Risk Factors */}
          <div className="grid md:grid-cols-2 gap-6">
            {report.demandSignals && report.demandSignals.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
              </div>
            )}

            {report.riskFactors && report.riskFactors.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
              </div>
            )}
          </div>

          {/* Recommended Offer */}
          <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-6">
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
                  window.location.href = '/engine/dashboard/offers/new';
                }}
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Build This Offer →
              </button>
              <button 
                onClick={handleExportPDF}
                disabled={exporting}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                    PDF
                  </>
                )}
              </button>
              <button 
                onClick={handleExportCSV}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </button>
              <button 
                onClick={() => window.location.href = '/engine/dashboard/agents'}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                Ask AI Agents
              </button>
            </div>
          </div>

          {/* Sources */}
          {report.sources && report.sources.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
            </div>
          )}

          {/* Generated timestamp */}
          {report.generatedAt && (
            <div className="flex items-center justify-center gap-4">
              {saved && (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved to your reports
                </span>
              )}
              <p className="text-white/30 text-sm">
                Report generated on {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!report && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Ready to find your truth?</h3>
          <p className="text-white/50 max-w-md mx-auto">
            Enter a niche above to get AI-powered market intelligence, competitor analysis, and offer recommendations.
          </p>
        </motion.div>
      )}
    </div>
  );
}
