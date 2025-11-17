'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Download, Search, ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

type AssetCategory = 'All Assets' | 'Posters' | 'Socials' | 'TikToks' | 'Banners';

interface Asset {
  id: string;
  title: string;
  description: string;
  category: AssetCategory;
  format: string;
  dimensions: string;
  colors: string[];
  tags: string[];
  gradient: string;
  emoji: string;
}

export default function MarketingPage() {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('All Assets');
  const [searchQuery, setSearchQuery] = useState('');
  const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleDownload = async (asset: Asset) => {
    const previewElement = previewRefs.current[asset.id];
    if (!previewElement) {
      console.error('Preview element not found for:', asset.id);
      return;
    }

    try {
      const [width, height] = asset.dimensions.split('x').map(Number);
      
      // Create canvas with html2canvas at high quality
      const canvas = await html2canvas(previewElement, {
        backgroundColor: null,
        scale: 4, // Increased from 2 to 4 for maximum quality
        width: previewElement.offsetWidth,
        height: previewElement.offsetHeight,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Resize canvas to exact dimensions with high quality
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = width;
      finalCanvas.height = height;
      const ctx = finalCanvas.getContext('2d', { alpha: true });
      
      if (ctx) {
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(canvas, 0, 0, width, height);
      }

      // Convert to blob and download at maximum quality
      finalCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `crftdweb-${asset.id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0); // Quality set to 1.0 (maximum)
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const assets: Asset[] = [
    {
      id: 'instagram-brand-intro',
      title: 'Hero Poster - Transform Your Brand',
      description: 'Main brand poster showcasing core features',
      category: 'Posters',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['hero', 'features', 'minimal'],
      gradient: 'from-black via-gray-900 to-black',
      emoji: '✨'
    },
    {
      id: 'instagram-services',
      title: 'Services Overview - What We Do',
      description: 'Comprehensive services showcase',
      category: 'Posters',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#ffffff', '#000000'],
      tags: ['services', 'features', 'value'],
      gradient: 'from-white via-gray-100 to-gray-200',
      emoji: '🎨'
    },
    {
      id: 'instagram-design-quote',
      title: 'Design Philosophy - Quote Card',
      description: 'Inspirational design quote',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['quote', 'inspiration', 'philosophy'],
      gradient: 'from-gray-900 to-black',
      emoji: '💡'
    },
    {
      id: 'instagram-why-us',
      title: '5 Reasons - Value Proposition',
      description: 'Feature highlight with clear value proposition',
      category: 'Posters',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#ffffff', '#000000'],
      tags: ['features', 'value', 'benefits'],
      gradient: 'from-gray-50 to-white',
      emoji: '⚡'
    },
    {
      id: 'instagram-testimonial',
      title: 'Client Success - Social Proof',
      description: 'Customer testimonial with 5-star rating',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['testimonial', 'social-proof', 'reviews'],
      gradient: 'from-black via-gray-800 to-gray-900',
      emoji: '⭐'
    },
    {
      id: 'instagram-cta',
      title: 'Call to Action - Get Started',
      description: 'Conversion-focused CTA poster',
      category: 'Posters',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['cta', 'conversion', 'action'],
      gradient: 'from-gray-900 via-black to-gray-800',
      emoji: '🚀'
    },
    {
      id: 'tiktok-intro',
      title: 'Brand Introduction - TikTok',
      description: 'Vertical format brand showcase',
      category: 'TikToks',
      format: 'PNG',
      dimensions: '1080x1920',
      colors: ['#000000', '#ffffff'],
      tags: ['vertical', 'brand', 'intro'],
      gradient: 'from-black to-gray-900',
      emoji: '✨'
    },
    {
      id: 'tiktok-services',
      title: 'Services Breakdown - TikTok',
      description: 'Detailed services presentation',
      category: 'TikToks',
      format: 'PNG',
      dimensions: '1080x1920',
      colors: ['#ffffff', '#000000'],
      tags: ['vertical', 'services', 'features'],
      gradient: 'from-white to-gray-100',
      emoji: '🎨'
    },
    {
      id: 'tiktok-why-us',
      title: 'Why Choose Us - TikTok',
      description: 'Compelling reasons vertical format',
      category: 'TikToks',
      format: 'PNG',
      dimensions: '1080x1920',
      colors: ['#000000', '#ffffff'],
      tags: ['vertical', 'benefits', 'value'],
      gradient: 'from-gray-900 to-black',
      emoji: '🚀'
    },
    {
      id: 'tiktok-process',
      title: 'Our Process - TikTok',
      description: 'Step-by-step workflow showcase',
      category: 'TikToks',
      format: 'PNG',
      dimensions: '1080x1920',
      colors: ['#ffffff', '#000000'],
      tags: ['vertical', 'process', 'workflow'],
      gradient: 'from-gray-100 to-white',
      emoji: '🎯'
    },
    {
      id: 'tiktok-success',
      title: 'Client Success Story - TikTok',
      description: 'Testimonial with metrics',
      category: 'TikToks',
      format: 'PNG',
      dimensions: '1080x1920',
      colors: ['#000000', '#ffffff'],
      tags: ['vertical', 'testimonial', 'metrics'],
      gradient: 'from-black via-gray-900 to-gray-800',
      emoji: '⭐'
    },
    {
      id: 'tiktok-cta',
      title: 'Final CTA - Let\'s Build',
      description: 'Strong call-to-action for conversions',
      category: 'TikToks',
      format: 'PNG',
      dimensions: '1080x1920',
      colors: ['#000000', '#ffffff'],
      tags: ['vertical', 'cta', 'conversion'],
      gradient: 'from-black via-gray-900 to-black',
      emoji: '🔥'
    },
    {
      id: 'tip-page-speed',
      title: 'Web Tip: Page Speed Impact',
      description: 'Research-backed insight on page speed and conversions',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['tips', 'research', 'performance'],
      gradient: 'from-black via-gray-900 to-black',
      emoji: '⚡'
    },
    {
      id: 'tip-mobile-first',
      title: 'Web Tip: Mobile-First Design',
      description: 'Why mobile-first design is critical in 2024',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['tips', 'mobile', 'research'],
      gradient: 'from-gray-900 to-black',
      emoji: '📱'
    },
    {
      id: 'tip-white-space',
      title: 'Web Tip: White Space Psychology',
      description: 'How white space improves comprehension by 20%',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#ffffff', '#000000'],
      tags: ['tips', 'design', 'research'],
      gradient: 'from-white via-gray-50 to-gray-100',
      emoji: '✨'
    },
    {
      id: 'tip-above-fold',
      title: 'Web Tip: Above-the-Fold Strategy',
      description: '80% of attention stays above the fold',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['tips', 'ux', 'research'],
      gradient: 'from-black to-gray-800',
      emoji: '👁️'
    },
    {
      id: 'tip-cta-color',
      title: 'Web Tip: CTA Button Psychology',
      description: 'Button color can boost conversions by 35%',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#000000', '#ffffff'],
      tags: ['tips', 'conversion', 'research'],
      gradient: 'from-gray-900 via-black to-gray-800',
      emoji: '🎨'
    },
    {
      id: 'tip-typography',
      title: 'Web Tip: Typography & Readability',
      description: 'Typography is 95% of web design',
      category: 'Socials',
      format: 'PNG',
      dimensions: '1080x1080',
      colors: ['#ffffff', '#000000'],
      tags: ['tips', 'typography', 'research'],
      gradient: 'from-gray-100 to-white',
      emoji: '📝'
    }
  ];

  const categories: AssetCategory[] = ['All Assets', 'Posters', 'Socials', 'TikToks', 'Banners'];

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'All Assets' || asset.category === selectedCategory;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: assets.length,
    posters: assets.filter(a => a.category === 'Posters').length,
    tiktoks: assets.filter(a => a.category === 'TikToks').length,
    socials: assets.filter(a => a.category === 'Socials').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-200 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              Marketing Assets Hub
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              High-quality promotional materials for CrftdWeb. Perfect for social media, ads, and campaigns.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-700 font-medium">Total Assets</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">{stats.posters}</div>
              <div className="text-sm text-gray-700 font-medium">Poster Designs</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-pink-600 mb-1">{stats.tiktoks}</div>
              <div className="text-sm text-gray-700 font-medium">TikTok Posts</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-sm text-gray-700 font-medium">Brand Consistent</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Download All Button */}
            <a
              href="/social-posts/generator.html"
              target="_blank"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All Assets
            </a>
          </div>
        </div>
      </section>

      {/* Assets Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No assets found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                  {/* Asset Preview */}
                  <div className={`${
                    asset.dimensions === '1080x1920' ? 'aspect-[9/16]' : 'aspect-square'
                  } relative overflow-hidden`}>
                    {/* Actual Post Design Preview - Full Size for Download */}
                    <div 
                      ref={(el) => {
                        if (el) previewRefs.current[asset.id] = el;
                      }}
                      className={`absolute inset-0 bg-gradient-to-br ${asset.gradient} flex flex-col items-center justify-center text-white p-8 md:p-12`}
                    >
                      {/* Main Content - Mimics actual post design */}
                      {asset.id === 'instagram-brand-intro' && (
                        <>
                          <div className="text-6xl font-logo mb-3 tracking-tight">CW</div>
                          <h1 className="text-3xl font-black mb-2 text-center">CrftdWeb</h1>
                          <p className="text-base text-center mb-3 font-light">Crafted with Precision</p>
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 max-w-[200px]">
                            <p className="text-xs text-center leading-relaxed">
                              Premium web design & development
                            </p>
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'instagram-services' && (
                        <>
                          <div className="text-3xl font-logo mb-2 tracking-tight text-black">CW</div>
                          <h1 className="text-2xl font-black mb-4 text-center text-black">OUR SERVICES</h1>
                          <div className="space-y-2 w-full max-w-[180px]">
                            <div className="bg-black/5 border border-black/10 rounded-lg p-2 text-center">
                              <div className="text-2xl mb-1">🎨</div>
                              <div className="text-xs font-bold text-black">Brand Identity</div>
                            </div>
                            <div className="bg-black/5 border border-black/10 rounded-lg p-2 text-center">
                              <div className="text-2xl mb-1">💻</div>
                              <div className="text-xs font-bold text-black">Web Design</div>
                            </div>
                            <div className="bg-black/5 border border-black/10 rounded-lg p-2 text-center">
                              <div className="text-2xl mb-1">⚡</div>
                              <div className="text-xs font-bold text-black">UI/UX Design</div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'instagram-design-quote' && (
                        <>
                          <div className="text-4xl font-logo mb-3 tracking-tight">CW</div>
                          <div className="text-lg font-black mb-3 text-center leading-tight max-w-[200px] px-2">
                            &ldquo;Design is how it works.&rdquo;
                          </div>
                          <p className="text-sm mb-3 opacity-70">&mdash; Steve Jobs</p>
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 max-w-[180px]">
                            <p className="text-[10px] text-center leading-relaxed">
                              We craft experiences that combine beauty with functionality
                            </p>
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'instagram-why-us' && (
                        <>
                          <div className="text-3xl font-logo mb-2 tracking-tight text-black">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center text-black">WHY CRFTDWEB?</h1>
                          <div className="space-y-1.5 max-w-[180px] w-full">
                            {['Apple-Inspired', 'Lightning Fast', 'Mobile-First', 'Clean Code', '100% Happy'].map((item, idx) => (
                              <div key={idx} className="bg-black/5 border border-black/10 rounded-lg p-2 flex items-center">
                                <span className="text-base font-black mr-1.5 text-black">✓</span>
                                <span className="text-[11px] font-semibold text-black">{item}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'instagram-testimonial' && (
                        <>
                          <div className="text-3xl font-logo mb-2 tracking-tight">CW</div>
                          <div className="text-3xl mb-3">⭐⭐⭐⭐⭐</div>
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-w-[200px] mb-3">
                            <p className="text-xs font-bold text-center mb-2 leading-tight">
                              &ldquo;CrftdWeb delivered a website that perfectly captures our brand.&rdquo;
                            </p>
                            <div className="text-center">
                              <p className="text-[10px] font-semibold">Jessica Martinez</p>
                              <p className="text-[10px] opacity-70">Founder, TechStart</p>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-70">Join 50+ happy clients</p>
                        </>
                      )}
                      
                      {asset.id === 'instagram-cta' && (
                        <>
                          <div className="text-5xl font-logo mb-2 tracking-tight">CW</div>
                          <h1 className="text-2xl font-black mb-2 text-center leading-tight">READY TO LAUNCH?</h1>
                          <p className="text-sm text-center mb-4 font-semibold">Transform Your Presence</p>
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 max-w-[180px] mb-3">
                            <div className="space-y-1.5 text-xs">
                              {['Free Consultation', 'Custom Solutions', 'Fast Delivery'].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <span className="text-sm">✓</span>
                                  <span className="text-[10px]">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white text-black px-4 py-2 rounded-lg text-[11px] font-black">
                            Get Started →
                          </div>
                        </>
                      )}
                      
                      {/* TikTok Posts */}
                      {asset.id === 'tiktok-intro' && (
                        <>
                          <div className="text-5xl font-logo mb-3 tracking-tight">CW</div>
                          <h1 className="text-3xl font-black mb-2 text-center">CrftdWeb</h1>
                          <p className="text-base text-center mb-3 font-light">Premium Web Design</p>
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 mb-4 max-w-[180px]">
                            <p className="text-xs text-center leading-relaxed">
                              Apple-inspired design meets cutting-edge development
                            </p>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🎨</span>
                              <span>Minimalist Design</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">⚡</span>
                              <span>Lightning Fast</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">💎</span>
                              <span>Premium Quality</span>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'tiktok-services' && (
                        <>
                          <div className="text-4xl font-logo mb-2 tracking-tight text-black">CW</div>
                          <h1 className="text-2xl font-black mb-2 text-black">WHAT WE DO</h1>
                          <p className="text-xs opacity-70 mb-3 text-black">Comprehensive Solutions</p>
                          <div className="space-y-2 w-full max-w-[180px]">
                            {[
                              { emoji: '🎨', title: 'Branding', desc: 'Strategic identity' },
                              { emoji: '💻', title: 'Web Design', desc: 'Stunning websites' },
                              { emoji: '⚡', title: 'UI/UX', desc: 'Intuitive interfaces' },
                              { emoji: '📱', title: 'Responsive', desc: 'All devices' }
                            ].map((service, idx) => (
                              <div key={idx} className="bg-black/5 border border-black/10 rounded-lg p-2 text-center">
                                <div className="text-xl mb-0.5">{service.emoji}</div>
                                <div className="text-xs font-bold mb-0.5 text-black">{service.title}</div>
                                <div className="text-[10px] opacity-70 text-black">{service.desc}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'tiktok-why-us' && (
                        <>
                          <div className="text-4xl font-logo mb-2 tracking-tight text-black">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center leading-tight text-black">WHY CRFTDWEB?</h1>
                          <div className="bg-black/5 border border-black/10 rounded-xl p-3 mb-4 max-w-[180px]">
                            <div className="space-y-2 text-xs">
                              <p className="text-center font-semibold text-black">✓ Apple-Inspired</p>
                              <p className="text-center font-semibold text-black">✓ 90+ PageSpeed</p>
                              <p className="text-center font-semibold text-black">✓ Mobile-First</p>
                              <p className="text-center font-semibold text-black">✓ SEO Optimized</p>
                            </div>
                          </div>
                          <div className="bg-black text-white px-4 py-2 rounded-lg text-[11px] font-black">
                            START PROJECT
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'tiktok-process' && (
                        <>
                          <div className="text-4xl font-logo mb-2 tracking-tight">CW</div>
                          <h1 className="text-2xl font-black mb-2">OUR PROCESS</h1>
                          <p className="text-xs opacity-70 mb-3">From Concept to Launch</p>
                          <div className="space-y-2 w-full max-w-[180px]">
                            {[
                              { num: '1', title: 'Discovery', desc: 'Your vision' },
                              { num: '2', title: 'Design', desc: 'Interfaces' },
                              { num: '3', title: 'Develop', desc: 'With precision' },
                              { num: '4', title: 'Launch', desc: 'Excellence' }
                            ].map((step) => (
                              <div key={step.num} className="bg-white/10 border border-white/20 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-black">{step.num}</div>
                                  <div>
                                    <div className="text-[11px] font-bold">{step.title}</div>
                                    <div className="text-[9px] opacity-70">{step.desc}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'tiktok-success' && (
                        <>
                          <div className="text-4xl font-logo mb-2 tracking-tight">CW</div>
                          <div className="text-3xl mb-3">⭐⭐⭐⭐⭐</div>
                          <h1 className="text-2xl font-black mb-4">CLIENT SUCCESS</h1>
                          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 max-w-[200px]">
                            <p className="text-xs font-bold text-center mb-3 leading-tight">
                              &ldquo;Beautiful and performs flawlessly&rdquo;
                            </p>
                            <div className="text-center mb-3">
                              <p className="text-[11px] font-semibold mb-0.5">Michael Chen</p>
                              <p className="text-[10px] opacity-70">CEO, InnovateHub</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                              <div className="text-center">
                                <div className="text-lg mb-0.5">50+</div>
                                <div className="opacity-70 text-[9px]">Projects</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg mb-0.5">100%</div>
                                <div className="opacity-70 text-[9px]">Satisfaction</div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'tiktok-cta' && (
                        <>
                          <div className="text-5xl font-logo mb-3 tracking-tight">CW</div>
                          <h1 className="text-xl font-black mb-2 text-center leading-tight px-4">LET&apos;S BUILD SOMETHING AMAZING</h1>
                          <p className="text-sm text-center mb-4 font-semibold">Your Vision. Our Expertise.</p>
                          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 w-full max-w-[180px]">
                            <div className="space-y-2 text-xs font-semibold">
                              {['Free consultation', 'Custom solutions', 'Quick turnaround', 'Ongoing support'].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-sm">✓</span>
                                  <span className="text-[10px]">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white text-black px-4 py-2 rounded-lg text-[11px] font-black">
                            START TODAY →
                          </div>
                        </>
                      )}
                      
                      {asset.id === 'tip-page-speed' && (
                        <>
                          <div className="text-4xl mb-4">⚡</div>
                          <div className="text-3xl font-logo mb-4 tracking-tight">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center leading-tight">PAGE SPEED = REVENUE</h1>
                          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 mb-3 max-w-[250px]">
                            <div className="space-y-3 text-xs">
                              <div className="flex items-start gap-2">
                                <span className="text-white">📊</span>
                                <span className="font-semibold">1 second delay = 7% conversion loss</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">⏱️</span>
                                <span className="font-semibold">53% abandon sites taking &gt;3s to load</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">🎯</span>
                                <span className="font-semibold">90+ PageSpeed is the new standard</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-70 mt-3">Source: Google Research 2024</p>
                        </>
                      )}
                      
                      {asset.id === 'tip-mobile-first' && (
                        <>
                          <div className="text-4xl mb-4">📱</div>
                          <div className="text-3xl font-logo mb-4 tracking-tight">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center leading-tight">60% OF TRAFFIC IS MOBILE</h1>
                          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 mb-3 max-w-[250px]">
                            <div className="space-y-3 text-xs">
                              <div className="flex items-start gap-2">
                                <span className="text-white">📱</span>
                                <span className="font-semibold">Mobile users = 60% of web traffic</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">🔍</span>
                                <span className="font-semibold">Google uses mobile-first indexing</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">✓</span>
                                <span className="font-semibold">Responsive design isn&apos;t optional</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-70 mt-3">Source: Statista 2024</p>
                        </>
                      )}
                      
                      {asset.id === 'tip-white-space' && (
                        <>
                          <div className="text-4xl mb-4 text-black">✨</div>
                          <div className="text-3xl font-logo mb-4 tracking-tight text-black">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center leading-tight text-black">WHITE SPACE = 20% BETTER</h1>
                          <div className="bg-black/5 border border-black/10 rounded-xl p-4 mb-3 max-w-[250px]">
                            <div className="space-y-3 text-xs text-black">
                              <div className="flex items-start gap-2">
                                <span>📈</span>
                                <span className="font-semibold">Increases comprehension by 20%</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span>👁️</span>
                                <span className="font-semibold">Makes content 40% easier to scan</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span>🍎</span>
                                <span className="font-semibold">Apple uses 50%+ white space</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-70 mt-3 text-black">Source: MIT Study</p>
                        </>
                      )}
                      
                      {asset.id === 'tip-above-fold' && (
                        <>
                          <div className="text-4xl mb-4">👁️</div>
                          <div className="text-3xl font-logo mb-4 tracking-tight">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center leading-tight">80% SEE ONLY ABOVE-THE-FOLD</h1>
                          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 mb-3 max-w-[250px]">
                            <div className="space-y-3 text-xs">
                              <div className="flex items-start gap-2">
                                <span className="text-white">⚡</span>
                                <span className="font-semibold">80% of attention stays above fold</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">⏱️</span>
                                <span className="font-semibold">Users decide in 0.05 seconds</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">💎</span>
                                <span className="font-semibold">First impression = everything</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-70 mt-3">Source: Nielsen Norman Group</p>
                        </>
                      )}
                      
                      {asset.id === 'tip-cta-color' && (
                        <>
                          <div className="text-4xl mb-4">🎨</div>
                          <div className="text-3xl font-logo mb-4 tracking-tight">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center leading-tight">BUTTON COLOR = 35% MORE</h1>
                          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 mb-3 max-w-[250px]">
                            <div className="space-y-3 text-xs">
                              <div className="flex items-start gap-2">
                                <span className="text-white">📊</span>
                                <span className="font-semibold">High-contrast CTAs boost by 35%</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">🎨</span>
                                <span className="font-semibold">Color drives 85% of purchases</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-white">📍</span>
                                <span className="font-semibold">F-pattern scanning matters</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-70 mt-3">Source: HubSpot Research</p>
                        </>
                      )}
                      
                      {asset.id === 'tip-typography' && (
                        <>
                          <div className="text-4xl mb-4 text-black">📝</div>
                          <div className="text-3xl font-logo mb-4 tracking-tight text-black">CW</div>
                          <h1 className="text-2xl font-black mb-3 text-center leading-tight text-black">TYPOGRAPHY = 95% OF DESIGN</h1>
                          <div className="bg-black/5 border border-black/10 rounded-xl p-4 mb-3 max-w-[250px]">
                            <div className="space-y-3 text-xs text-black">
                              <div className="flex items-start gap-2">
                                <span>✍️</span>
                                <span className="font-semibold">95% of web design is typography</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span>♿</span>
                                <span className="font-semibold">16px minimum for accessibility</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span>📏</span>
                                <span className="font-semibold">1.5-1.6 line height = optimal</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-70 mt-3 text-black">Source: WCAG Standards</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Asset Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {asset.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {asset.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {asset.dimensions}
                      </span>
                      <span className="flex items-center gap-1">
                        Format: {asset.format}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {asset.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Color Palette */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-500 font-medium">Colors:</span>
                      <div className="flex gap-1">
                        {asset.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(asset)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Launch Your Campaign?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Download these high-converting assets and start promoting CrftdWeb today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/social-posts/generator.html"
              target="_blank"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download All Assets
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-bold text-lg hover:bg-blue-500/30 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
