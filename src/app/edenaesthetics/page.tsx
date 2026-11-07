'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  Leaf,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  HeartHandshake,
  ChevronDown,
} from 'lucide-react';

/* ── One goal, one CTA: book a consultation.
   Swap BOOKING_URL for the clinic's online booking link when it exists. ── */
const BOOKING_URL = 'https://ig.me/m/edenaestheticsholistichealth';
const INSTAGRAM_URL = 'https://www.instagram.com/edenaestheticsholistichealth/';

/* ── TRAIN: Restraint. 3 colours only (taken from the clinic's own branding) ── */
const brand = {
  green: '#3F5A45',
  sage: '#A9B8A0',
  cream: '#F4F1EA',
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const pillars = [
  {
    icon: Stethoscope,
    title: 'Weight loss support',
    desc: 'A personalised plan built around you, with ongoing advice and check-ins from a nurse prescriber. Treatment is only recommended when it is clinically suitable for you.',
  },
  {
    icon: Sparkles,
    title: 'Skin & aesthetics',
    desc: 'Talk through your skin goals and the options available. Natural-looking results and honest advice, never pressure.',
  },
  {
    icon: HeartHandshake,
    title: 'Whole-person care',
    desc: 'The holistic approach: your health, lifestyle and confidence all considered, not just one treatment.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Book your consultation',
    desc: 'Message us or use the booking link. Pick a time that suits you.',
  },
  {
    n: '02',
    title: 'Talk it through with a nurse prescriber',
    desc: 'Louise or Andrea will go through your goals, health and questions. No pressure to start anything.',
  },
  {
    n: '03',
    title: 'Get a plan that fits',
    desc: 'If treatment is suitable, you will get a clear, personalised plan with transparent pricing.',
  },
];

const included = [
  'A one-to-one conversation with a qualified nurse prescriber',
  'An honest view on what is and is not right for you',
  'Clear pricing, explained before you decide anything',
  'No obligation to book a treatment',
  'Ongoing support and advice if you go ahead',
  'A calm, friendly clinic in Abersychan',
];

const faqs = [
  {
    q: 'Do I have to start treatment after the consultation?',
    a: 'No. The consultation is a conversation. You decide what, if anything, you would like to do next.',
  },
  {
    q: 'Is weight loss treatment suitable for everyone?',
    a: 'No. Our nurse prescribers assess your health and goals first, and only recommend treatment when it is clinically appropriate.',
  },
  {
    q: 'How much will it cost?',
    a: 'Our price list is on our Instagram highlights, and your prescriber will explain all costs clearly during your consultation.',
  },
  {
    q: 'Where are you based?',
    a: 'Abersychan, Pontypool, easy to reach from Cwmbran, Blaenavon, Usk, Abergavenny and Newport.',
  },
];

function CTAButton({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all hover:shadow-lg ${className}`}
      style={dark ? { backgroundColor: brand.cream, color: brand.green } : { backgroundColor: brand.green, color: '#fff' }}
    >
      Book your free consultation
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

export default function EdenAestheticsPage() {
  return (
    <main className="bg-white font-sans text-[#1c2a21] antialiased selection:bg-[#A9B8A0]/30">
      {/* ─── Preview bar ─── */}
      <div
        className="w-full py-2.5 text-center text-xs font-medium uppercase tracking-[0.2em]"
        style={{ backgroundColor: brand.cream, color: brand.green }}
      >
        Website preview for Eden Aesthetics &nbsp;&middot;&nbsp; Prepared by CrftdWeb
      </div>

      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2" aria-label="Eden Aesthetics & Holistic Health">
            <Leaf className="h-5 w-5" style={{ color: brand.green }} />
            <span className="text-lg font-semibold tracking-tight" style={{ color: brand.green }}>
              Eden <span className="font-normal">Aesthetics</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-gray-500 md:flex">
            <a href="#care" className="transition-colors hover:text-black">What we offer</a>
            <a href="#how" className="transition-colors hover:text-black">How it works</a>
            <a href="#team" className="transition-colors hover:text-black">Your nurses</a>
            <a href="#faq" className="transition-colors hover:text-black">FAQ</a>
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: brand.green }}
          >
            Book now
          </a>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-20 top-10 h-80 w-80 rounded-full opacity-60 blur-3xl"
            style={{ backgroundColor: brand.cream }}
          />
          <div
            className="absolute -right-20 bottom-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: brand.sage }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="mx-auto max-w-3xl text-center">
            <motion.span
              variants={fadeUp}
              className="mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: brand.cream, color: brand.green }}
            >
              Nurse prescribers &middot; Abersychan, Pontypool
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            >
              Personalised weight loss and skin care,{' '}
              <span style={{ color: brand.green }}>led by nurses you can talk to.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-500">
              Book a free consultation with Louise or Andrea. Get honest advice, a plan that suits you, and clear
              pricing, with no pressure to start anything.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTAButton />
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-full border border-black/10 px-8 py-4 text-sm font-medium transition-colors hover:bg-black/5"
              >
                How it works
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Qualified nurse prescribers
              </span>
              <span className="hidden h-4 w-px bg-gray-200 sm:block" />
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> Abersychan, Pontypool
              </span>
              <span className="hidden h-4 w-px bg-gray-200 sm:block" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> No obligation
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── What we offer ─── */}
      <section id="care" className="py-24" style={{ backgroundColor: brand.cream }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: brand.green }}>
              What we offer
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start with a conversation, not a sales pitch.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3"
          >
            {pillars.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-2xl border border-black/5 bg-white p-8 transition-colors hover:border-black/15"
              >
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${brand.sage}40`, color: brand.green }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: brand.green }}>
              How it works
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three simple steps.</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-10 md:grid-cols-3"
          >
            {steps.map((s) => (
              <motion.div key={s.n} variants={fadeUp} className="text-center">
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full text-base font-bold text-white"
                  style={{ backgroundColor: brand.green }}
                >
                  {s.n}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <CTAButton />
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section id="team" className="py-24" style={{ backgroundColor: brand.cream }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: brand.green }}>
                Meet your nurses
              </span>
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Louise and Andrea. Real people, real clinical care.
              </h2>
              <p className="mb-4 leading-relaxed text-gray-500">
                You will always speak to one of our nurse prescribers, never a call centre. They take the time to
                understand you before recommending anything.
              </p>
              <p className="leading-relaxed text-gray-500">
                Eden Aesthetics &amp; Holistic Health is a local clinic built on personal, caring, evidence-led
                advice.
              </p>

              <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: brand.green }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              {['Louise', 'Andrea'].map((name) => (
                <div
                  key={name}
                  className="flex aspect-[3/4] flex-col items-center justify-center rounded-3xl bg-white p-6 text-center"
                >
                  {/* Replace with the team's real photos from the clinic */}
                  <div
                    className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-white"
                    style={{ backgroundColor: brand.green }}
                  >
                    {name[0]}
                  </div>
                  <div className="text-lg font-semibold">{name}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-gray-400">Nurse prescriber</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: brand.green }}>
              Questions
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Good to know before you book.</h2>
          </motion.div>

          <div className="divide-y divide-black/10 rounded-2xl border border-black/10">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium">
                  {f.q}
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section id="book" className="relative overflow-hidden py-24" style={{ backgroundColor: brand.green }}>
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/4 top-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: brand.sage }}
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Ready to talk it through?
          </h2>
          <p className="mx-auto mb-3 max-w-xl text-lg leading-relaxed text-white/70">
            Book a free consultation with Louise or Andrea. It takes a minute.
          </p>
          <p className="mb-10 text-sm text-white/50">Free consultation &middot; No obligation &middot; DMs always open</p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <CTAButton dark />
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" />
              See our Instagram
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Abersychan, Pontypool
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" /> Message us on Instagram
            </span>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-black/5 py-10 pb-28 md:pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2" style={{ color: brand.green }}>
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-semibold">Eden Aesthetics &amp; Holistic Health</span>
            </div>
            <p className="max-w-md text-center text-xs leading-relaxed text-gray-400 md:text-left">
              Treatments are only offered following a consultation and where clinically suitable. Individual results
              vary.
            </p>
            <div className="text-xs text-gray-300">
              Website preview by{' '}
              <a
                href="https://crftdweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-black"
                style={{ color: brand.green }}
              >
                CrftdWeb
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Sticky mobile CTA ─── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 p-3 backdrop-blur md:hidden">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium text-white"
          style={{ backgroundColor: brand.green }}
        >
          Book your free consultation
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </main>
  );
}
