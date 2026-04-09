'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, MapPin, Clock, Instagram, CheckCircle2, Phone } from 'lucide-react';
import Image from 'next/image';

/* ── Animation variants ── */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const sectionAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

/* ── TRAIN: Restraint. 3 colours only ── */
const brand = {
  warm: '#C4A882',
  dark: '#3D2E27',
  cream: '#F5EDE3',
};

/* ── Services: her actual specialties ── */
const primaryServices = [
  {
    name: 'Box Braids',
    desc: 'Classic and knotless box braids in any length, size, or colour. Clean parts, neat finish, long-lasting protective style.',
    icon: 'sparkles',
  },
  {
    name: 'Albaso Braids',
    desc: 'Intricate Albaso braids crafted with precision. A bold, statement protective style that turns heads.',
    icon: 'scissors',
  },
  {
    name: 'Silk Press',
    desc: 'A flawless silk press that leaves your natural hair sleek, shiny, and bouncy — without the damage.',
    icon: 'flame',
  },
  {
    name: 'Wedding Hair',
    desc: 'Bridal and wedding party hair that lasts all day. Braids, updos, and styled looks for your most important moments.',
    icon: 'crown',
  },
];

const serviceIcons: Record<string, React.ReactNode> = {
  // Box Braids — two crossing S-curves + faint centre strand
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
      <path d="M9 3C9 6 15 6 15 9C15 12 9 12 9 15C9 18 15 18 15 21"/>
      <path d="M15 3C15 6 9 6 9 9C9 12 15 12 15 15C15 18 9 18 9 21"/>
      <path d="M12 3C12 5 12 7 12 9C12 11 12 13 12 15C12 17 12 19 12 21" strokeOpacity="0.3"/>
    </svg>
  ),
  // Albaso Braids — zigzag cornrow pattern with 3 rows
  scissors: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 7L6 5L9 7L12 5L15 7L18 5L21 7"/>
      <path d="M3 12L6 10L9 12L12 10L15 12L18 10L21 12"/>
      <path d="M3 17L6 15L9 17L12 15L15 17L18 15L21 17"/>
    </svg>
  ),
  // Silk Press — flat iron tongs with curved handle and heat dots
  flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="7" width="13" height="3.5" rx="1.75"/>
      <rect x="3" y="13.5" width="13" height="3.5" rx="1.75"/>
      <path d="M16 8.75Q21 8.75 21 12Q21 15.25 16 15.25"/>
      <circle cx="6.5" cy="8.75" r="0.8" fill="currentColor" stroke="none"/>
      <circle cx="9.5" cy="8.75" r="0.8" fill="currentColor" stroke="none"/>
      <circle cx="12.5" cy="8.75" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  // Wedding Hair — heart with small ring on top
  crown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 21L4 13C2 10.5 2 7 5 5.5C7.5 4.2 10 5.5 12 8C14 5.5 16.5 4.2 19 5.5C22 7 22 10.5 20 13L12 21Z" fill="currentColor" fillOpacity="0.12"/>
      <path d="M12 21L4 13C2 10.5 2 7 5 5.5C7.5 4.2 10 5.5 12 8C14 5.5 16.5 4.2 19 5.5C22 7 22 10.5 20 13L12 21Z"/>
      <circle cx="12" cy="3.5" r="2" strokeWidth="1.3"/>
      <line x1="12" y1="5.5" x2="12" y2="8" strokeWidth="1.3"/>
    </svg>
  ),
};

const additionalServices = [
  { name: 'Braids', desc: 'All braid styles — from simple to intricate. Natural or with extensions.' },
  { name: 'Protective Styles', desc: 'Low-manipulation styles that protect your edges and promote growth.' },
  { name: 'Twist Styles', desc: 'Two-strand twists, Senegalese twists, and more.' },
  { name: 'Natural Styles', desc: 'Wash-and-go, defined curls, and natural texture styling.' },
  { name: 'Event Styles', desc: 'Styled looks for birthdays, parties, and special occasions.' },
];

/* ── Flow: booking process ── */
const process = [
  { step: '01', title: 'Book', desc: 'Send a message on Instagram or call to book your slot.' },
  { step: '02', title: 'Consult', desc: 'Quick chat about what you want so every detail is right.' },
  { step: '03', title: 'Transform', desc: 'Sit back, relax, and let Helen work her magic.' },
  { step: '04', title: 'Glow', desc: 'Walk out feeling like the best version of yourself.' },
];

/* ── Reviews ── */
const reviews = [
  {
    name: 'Sophie M.',
    text: 'Helen did my box braids and they lasted over two months. Neat parts, no tension, and she actually listened to what I wanted. Best braider I\'ve been to.',
  },
  {
    name: 'Jessica R.',
    text: 'Got a silk press for my birthday and my hair has never looked this good. So shiny and bouncy — I get compliments everywhere I go now.',
  },
  {
    name: 'Amy K.',
    text: 'Helen did my wedding hair and I cried when I saw it. She made me feel so beautiful on the biggest day of my life. Absolutely 10/10.',
  },
];

export default function BeautyByHelenPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <main className="bg-white text-black font-sans antialiased selection:bg-[#C4A882]/20">

      {/* ─── Announcement Bar ─── */}
      <div
        className="w-full py-2.5 text-center text-xs font-medium tracking-[0.2em] uppercase"
        style={{ backgroundColor: brand.cream, color: brand.dark }}
      >
        Website Preview for Beauty by Helen &nbsp;&middot;&nbsp; Braids &middot; Silk Press &middot; Wedding Hair
      </div>

      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Image
            src="/beautybyhelenlogo.png"
            alt="Beauty by Helen"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#services" className="hover:text-black transition-colors">Services</a>
            <a href="#process" className="hover:text-black transition-colors">How It Works</a>
            <a href="#about" className="hover:text-black transition-colors">About</a>
            <a href="#reviews" className="hover:text-black transition-colors">Reviews</a>
          </div>
          <a
            href="#book"
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: brand.dark }}
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* ─── Hero: Problem-first headline ─── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 left-10 w-80 h-80 rounded-full blur-3xl opacity-40"
            style={{ backgroundColor: brand.cream }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-25"
            style={{ backgroundColor: brand.cream }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.span
              variants={staggerItem}
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-8 block"
              style={{ color: brand.warm }}
            >
              BRAIDS · SILK PRESS · STYLES · WEDDING
            </motion.span>

            <motion.h1
              variants={staggerItem}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.05]"
            >
              Life isn&apos;t perfect, but{' '}
              <span style={{ color: brand.warm }}>your hair can be.</span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Most people settle for &ldquo;good enough.&rdquo; Helen doesn&apos;t.
              Expert braids, silk press, and protective styles &mdash; crafted for your hair, your lifestyle, your look.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#book"
                className="px-8 py-4 text-white rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 group transition-all hover:shadow-lg"
                style={{ backgroundColor: brand.dark }}
              >
                Book Your Appointment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="px-8 py-4 border border-black/10 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors hover:bg-black/5"
              >
                View Services
              </a>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" style={{ color: brand.warm, fill: brand.warm }} />
                  ))}
                </div>
                5-Star Rated
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5" />
                1,800+ followers
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Gloucester Rd, Bristol
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 border-2 rounded-full flex justify-center pt-1.5" style={{ borderColor: `${brand.dark}30` }}>
            <div className="w-1 h-1.5 rounded-full" style={{ backgroundColor: brand.dark }} />
          </div>
        </motion.div>
      </motion.section>

      {/* ─── Services ─── */}
      <section id="services" className="py-32" style={{ backgroundColor: brand.cream }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-20"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: brand.warm }}
            >
              What You Get
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Hair that actually suits you.{' '}
              <span style={{ color: brand.warm }}>Braids, silk press & beyond.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 mb-16"
          >
            {primaryServices.map((service) => (
              <motion.div
                key={service.name}
                variants={staggerItem}
                className="bg-white rounded-2xl p-8 border border-black/5 hover:border-black/15 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${brand.warm}15`, color: brand.warm }}
                >
                  {serviceIcons[service.icon]}
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-10"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: brand.warm }}
            >
              Also Available
            </span>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {additionalServices.map((service) => (
              <motion.div
                key={service.name}
                variants={staggerItem}
                className="bg-white rounded-xl p-5 text-center border border-black/5 hover:border-black/15 transition-colors"
              >
                <h4 className="text-sm font-semibold mb-1.5">{service.name}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="mt-16 text-center text-sm text-gray-400"
          >
            <div className="flex items-center justify-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" style={{ color: brand.warm, fill: brand.warm }} />
                ))}
              </div>
              <span>Rated 5 stars by every client who&apos;s walked through the door.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Process: Flow visual device ─── */}
      <section id="process" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-20"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: brand.warm }}
            >
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Four steps to feeling{' '}
              <span style={{ color: brand.warm }}>incredible.</span>
            </h2>
          </motion.div>

          {/* Visual device: Flow with connecting line */}
          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div
              className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{ backgroundColor: `${brand.warm}30` }}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
            >
              {process.map((item, i) => (
                <motion.div key={item.title} variants={staggerItem} className="text-center">
                  {/* Numbered circle: Scale device */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ backgroundColor: brand.warm }}
                    >
                      {item.step}
                    </div>
                    {/* Connector dot */}
                    {i < process.length - 1 && (
                      <div
                        className="hidden lg:block absolute -right-[calc(50%+16px)] top-1/2 -translate-y-1/2"
                      >
                        <ArrowRight className="w-4 h-4" style={{ color: `${brand.warm}60` }} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] mx-auto">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── About: Problem before person ─── */}
      <section id="about" className="py-32" style={{ backgroundColor: brand.cream }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionAnim}
            >
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
                style={{ color: brand.warm }}
              >
                Meet Helen
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                You deserve someone who{' '}
                <span style={{ color: brand.warm }}>actually listens.</span>
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  Too many people leave the salon with something that &ldquo;looks fine&rdquo;
                  but isn&apos;t what they asked for. Helen built her business to fix that.
                </p>
                <p>
                  With years of experience in hair and beauty, every appointment starts with a
                  proper consultation. No rushing. No guessing. Just results you&apos;ll
                  actually love.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-8">
                {[
                  { stat: '500+', label: 'Happy Clients' },
                  { stat: '5.0', label: 'Average Rating' },
                  { stat: '3+', label: 'Years Experience' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-2xl font-bold" style={{ color: brand.dark }}>
                      {item.stat}
                    </div>
                    <div className="text-xs text-gray-400 tracking-wide uppercase mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl bg-white flex items-center justify-center">
                <div className="text-center p-8">
                  <Image
                    src="/beautybyhelenlogo.png"
                    alt="Beauty by Helen logo"
                    width={210}
                    height={210}
                    className="mx-auto mb-6 rounded-2xl"
                  />
                  <p className="text-sm text-gray-400 italic">
                    &ldquo;Making you feel beautiful is my passion.&rdquo;
                  </p>
                  <p className="text-xs mt-2 font-semibold" style={{ color: brand.dark }}>
                    Helen
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Checklist: Stacking visual device ─── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-20"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: brand.warm }}
            >
              Every Appointment
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              What&apos;s included,{' '}
              <span style={{ color: brand.warm }}>every time.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-x-12 gap-y-5"
          >
            {[
              'Personal consultation before every session',
              'Products suited to your hair type and texture',
              'A clean, relaxing studio environment',
              'Honest advice, never upsold',
              'Aftercare tips so results last longer',
              'Easy rebooking for your next visit',
            ].map((item) => (
              <motion.div
                key={item}
                variants={staggerItem}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: brand.warm }} />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center text-sm text-gray-400 mt-12"
          >
            No hidden fees. No awkward upsells. Just great work.
          </motion.p>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section id="gallery" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-20"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: brand.warm }}
            >
              The Results
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              See what Helen&apos;s clients{' '}
              <span style={{ color: brand.warm }}>walk out with.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              'Box Braids',
              'Knotless Braids',
              'Albaso Braids',
              'Silk Press',
              'Wedding Updo',
              'Protective Style',
            ].map((label) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-white"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-8 h-8 opacity-10" style={{ color: brand.warm }}>
                    <path d="M9 3C9 6 15 6 15 9C15 12 9 12 9 15C9 18 15 18 15 21" />
                    <path d="M15 3C15 6 9 6 9 9C9 12 15 12 15 15C15 18 9 18 9 21" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mt-12"
          >
            <a
              href="https://www.instagram.com/beautyby_helenn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: brand.dark }}
            >
              <Instagram className="w-4 h-4" />
              See more on Instagram
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── Comparison: Visual device ─── */}
      <section className="py-32" style={{ backgroundColor: brand.cream }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-20"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: brand.warm }}
            >
              The Difference
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Most salons vs.{' '}
              <span style={{ color: brand.warm }}>Helen.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {/* Left: the problem */}
            <motion.div
              variants={staggerItem}
              className="rounded-2xl p-8 border border-black/10 bg-white"
            >
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-6">Typical Experience</div>
              <ul className="space-y-4">
                {[
                  'Rushed consultations',
                  'Cookie-cutter styles',
                  '"It\'ll grow out" when it\'s wrong',
                  'Upsold products you don\'t need',
                  'Leave feeling just okay',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: the solution */}
            <motion.div
              variants={staggerItem}
              className="rounded-2xl p-8 border-2 bg-white"
              style={{ borderColor: brand.warm }}
            >
              <div className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: brand.warm }}>With Helen</div>
              <ul className="space-y-4">
                {[
                  'Proper consultation, every time',
                  'Styles designed for your face and lifestyle',
                  'Honest about what will and won\'t work',
                  'Only recommends what you actually need',
                  'Leave feeling like the best version of you',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: brand.warm }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Reviews: Trust at every scroll point ─── */}
      <section id="reviews" className="py-32" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="text-center mb-20"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              style={{ color: brand.warm }}
            >
              Don&apos;t Take Our Word For It
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Hear it from{' '}
              <span style={{ color: brand.warm }}>them.</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {reviews.map((review) => (
              <motion.div
                key={review.name}
                variants={staggerItem}
                className="bg-white border border-black/5 rounded-2xl p-8 hover:border-black/15 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ color: brand.warm, fill: brand.warm }} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: brand.warm }}
                  >
                    {review.name[0]}
                  </div>
                  <span className="text-sm font-medium">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA: Risk reversal, one clear action ─── */}
      <section id="book" className="py-32 relative overflow-hidden" style={{ backgroundColor: brand.dark }}>
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: brand.warm }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: brand.cream }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionAnim}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Stop settling for{' '}
              <span style={{ color: brand.warm }}>&ldquo;good enough.&rdquo;</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
              Book a consultation with Helen. Tell her what you want. She&apos;ll
              make it happen.
            </p>

            <p className="text-sm text-white/40 mb-10">
              Free consultation · No commitment · DMs always open
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://www.instagram.com/beautyby_helenn/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 group transition-all text-white"
                style={{ backgroundColor: brand.warm }}
              >
                <Instagram className="w-4 h-4" />
                Book via Instagram
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <a
                href="tel:07405873453"
                className="px-8 py-4 border border-white/20 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                07405 873 453
              </a>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                234 Gloucester Rd, Bristol BS7 8NZ
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Flexible Hours
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" style={{ fill: brand.warm, color: brand.warm }} />
                5-Star Rated
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image
              src="/beautybyhelenlogo.png"
              alt="Beauty by Helen"
              width={100}
              height={40}
              className="h-8 w-auto object-contain"
            />
            <a
              href="https://www.instagram.com/beautyby_helenn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <div className="text-xs text-gray-300">
              Website preview by{' '}
              <a
                href="https://crftdweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black transition-colors"
                style={{ color: brand.warm }}
              >
                CrftdWeb
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
