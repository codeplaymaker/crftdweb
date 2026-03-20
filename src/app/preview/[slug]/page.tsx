'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, Phone, Star, ChevronDown, Shield } from 'lucide-react';
import Link from 'next/link';

interface PreviewData {
  headline: string;
  subheadline: string;
  problemHeadline: string;
  problemSubheadline: string;
  painPoints: string[];
  services: string[];
  ctaText: string;
  businessName: string;
  businessRating: number;
  businessReviewCount: number;
  businessPhone: string | null;
  screenshotUrl: string | null;
}

const sectionAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    async function load() {
      try {
        const { slug } = await params;
        const res = await fetch(`/api/hunter/preview?slug=${slug}`);
        if (!res.ok) throw new Error('not found');
        setData(await res.json());

        // Track click
        fetch(`/api/hunter/preview/track?slug=${slug}`, { method: 'POST' }).catch(() => {});
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm tracking-[0.2em] uppercase text-gray-400"
        >
          Loading Preview
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Preview Not Found</h1>
          <p className="text-gray-500">This preview may have expired or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white text-black font-sans antialiased">
      {/* ─── Hero ─── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="container relative z-10 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.span
              variants={staggerItem}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-8 block"
            >
              {data.businessName.toUpperCase()}
            </motion.span>

            <motion.h1
              variants={staggerItem}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.05]"
            >
              {data.headline.split(' ').slice(0, -3).join(' ')}{' '}
              <span className="text-gray-400">
                {data.headline.split(' ').slice(-3).join(' ')}
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              {data.subheadline}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="#contact"
                className="px-8 py-4 bg-black text-white rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 group hover:bg-gray-900 transition-colors"
              >
                {data.ctaText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              {data.businessPhone && (
                <a
                  href={`tel:${data.businessPhone}`}
                  className="px-8 py-4 border border-black/10 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-black/5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              )}
            </motion.div>

            {/* Trust bar */}
            <motion.div
              variants={staggerItem}
              className="mt-16 flex items-center justify-center gap-6 text-xs text-gray-400"
            >
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                {data.businessRating}/5
              </span>
              <span className="w-px h-3 bg-gray-200" />
              <span>{data.businessReviewCount}+ Reviews</span>
              <span className="w-px h-3 bg-gray-200" />
              <span>Verified Business</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </motion.section>

      {/* ─── Problems ─── */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6 block">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
              {data.problemHeadline}
            </h2>
            {data.problemSubheadline && (
              <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                {data.problemSubheadline}
              </p>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {data.painPoints.map((point, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-6 rounded-xl bg-white border border-black/5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{point}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6 block">
              WHAT WE OFFER
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Everything you need,{' '}
              <span className="text-gray-400">nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {data.services.map((service, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-6 rounded-xl bg-gray-50 border border-black/5 group hover:bg-black hover:text-white transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-black/5 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-black group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-semibold tracking-tight">{service}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Social proof ─── */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6 block">
              TRUSTED
            </span>
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(data.businessRating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Rated {data.businessRating}/5 from {data.businessReviewCount}+ reviews
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              {data.businessName} has been serving the community with
              reliable, professional service. Don&apos;t take our word for
              it — check the reviews.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="contact" className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100/50 to-white" />
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-8 block">
              GET STARTED
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
              Ready to get{' '}
              <span className="text-gray-400">started?</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Get in touch today for a free, no-obligation quote.
              We&apos;ll get back to you within 24 hours.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="px-8 py-4 bg-black text-white rounded-full text-sm font-medium inline-flex items-center gap-2 group hover:bg-gray-900 transition-colors"
              >
                {data.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <p className="mt-6 text-xs text-gray-400">
              Free quote · No obligation · Response within 24 hours
            </p>
          </motion.div>
        </div>

        <div className="hidden md:block absolute top-1/2 left-0 w-72 h-72 bg-gray-100 rounded-full blur-3xl -translate-y-1/2" />
        <div className="hidden md:block absolute top-1/2 right-0 w-72 h-72 bg-gray-100 rounded-full blur-3xl -translate-y-1/2" />
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 border-t border-black/5">
        <div className="container text-center">
          <p className="text-xs text-gray-400">
            Built by{' '}
            <a href="https://www.crftdweb.com" className="underline hover:text-black transition-colors">
              CrftdWeb
            </a>{' '}
            — Websites that sell, not just look good.
          </p>
        </div>
      </footer>
    </main>
  );
}
