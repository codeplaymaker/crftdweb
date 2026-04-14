import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

// ── Niche Data ──────────────────────────────────────────────────────────

interface NicheData {
  slug: string;
  industry: string;
  headline: string;
  subheadline: string;
  heroDescription: string;
  painPoints: string[];
  solutions: string[];
  stats: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
}

const niches: Record<string, NicheData> = {
  'web-design-for-restaurants': {
    slug: 'web-design-for-restaurants',
    industry: 'Restaurants & Hospitality',
    headline: 'Web Design for Restaurants',
    subheadline: 'Stop losing bookings to a slow, outdated website.',
    heroDescription:
      'Custom-coded websites built specifically for restaurants, cafés, and hospitality businesses. Online reservations, menu management, and Google Maps integration — all optimised to convert hungry visitors into paying customers.',
    painPoints: [
      'Your current site takes 5+ seconds to load — guests leave before seeing the menu',
      'No online booking — you\'re losing reservations to competitors on OpenTable',
      'Menu is a PDF that\'s impossible to read on mobile',
      'You\'re invisible on Google when people search "restaurants near me"',
    ],
    solutions: [
      'Sub-1.5s load times with custom Next.js builds — 3x faster than WordPress',
      'Built-in reservation system or seamless integration with ResDiary, OpenTable, or Resy',
      'Beautiful, mobile-first menu pages that update in seconds — no PDF downloads',
      'Local SEO structure with schema markup to dominate Google Maps results',
      'Instagram feed integration to showcase dishes automatically',
      'Google Business Profile optimisation included',
    ],
    stats: [
      { label: 'Average speed improvement', value: '3.4x' },
      { label: 'Booking increase (90 days)', value: '+280%' },
      { label: 'Google PageSpeed score', value: '97' },
    ],
    faqs: [
      {
        question: 'How much does a restaurant website cost?',
        answer:
          'Our restaurant websites start from £2,497 (Launch) for a 5-page site with menu, booking integration, and mobile optimisation. Our Growth package at £4,997 includes up to 10 pages, blog, events calendar, and 90-day support.',
      },
      {
        question: 'Can you integrate online reservations?',
        answer:
          'Yes. We integrate with all major booking platforms — OpenTable, Resy, ResDiary, or a custom built-in form. Whichever works best for your workflow.',
      },
      {
        question: 'How long does it take to build?',
        answer:
          '14 days from brief to launch. We move fast because every site is custom-coded — no plugins breaking, no theme conflicts.',
      },
      {
        question: 'Will my website rank on Google?',
        answer:
          'Every site includes local SEO foundations: schema markup, optimised meta tags, Google Business integration, and 95+ PageSpeed scores. These are direct ranking signals Google uses.',
      },
    ],
    metaTitle: 'Web Design for Restaurants | Custom Websites That Get Bookings',
    metaDescription:
      'Restaurant website design built to convert. Online reservations, mobile menus, local SEO. Custom-coded, 95+ PageSpeed, delivered in 14 days. Get a free quote.',
  },

  'web-design-for-dentists': {
    slug: 'web-design-for-dentists',
    industry: 'Dental Practices',
    headline: 'Web Design for Dentists',
    subheadline: 'Turn website visitors into booked appointments.',
    heroDescription:
      'Custom websites for dental practices that build trust, showcase treatments, and make booking effortless. GDPR-compliant forms, patient testimonials, and local SEO that puts you on page one.',
    painPoints: [
      'Your website looks dated — patients choose the modern-looking competitor instead',
      'Booking requires a phone call — you\'re losing the 60% who prefer to book online',
      'No treatment pages — patients can\'t find information about Invisalign, implants, or whitening',
      'You\'re not appearing on Google Maps for "dentist near me"',
    ],
    solutions: [
      'Clean, trust-building design with professional imagery and patient testimonials',
      'Online booking integration with Dentally, SOE, or custom appointment forms',
      'Individual treatment pages optimised for search — each one targets a keyword',
      'GDPR-compliant patient forms and privacy-first architecture',
      'Local SEO with dental schema markup and Google Business Profile setup',
      'Before/after gallery for treatments (with patient consent workflow)',
    ],
    stats: [
      { label: 'New patient enquiry increase', value: '+340%' },
      { label: 'Average PageSpeed score', value: '96' },
      { label: 'Time to launch', value: '14 days' },
    ],
    faqs: [
      {
        question: 'How much does a dental website cost?',
        answer:
          'Our dental practice websites start from £2,497 for a 5-page site. Most practices choose the Growth package at £4,997 which includes treatment pages, blog, booking integration, and 90 days of support.',
      },
      {
        question: 'Is the website GDPR compliant?',
        answer:
          'Absolutely. Every form, cookie banner, and data collection point is built GDPR-compliant from day one. We also include a privacy policy template specific to dental practices.',
      },
      {
        question: 'Can patients book appointments online?',
        answer:
          'Yes. We integrate with practice management software (Dentally, SOE, etc.) or build a custom booking form that routes to your inbox or CRM.',
      },
      {
        question: 'Will you help with Google rankings?',
        answer:
          'Every site includes SEO foundations: dental-specific schema markup, individual treatment pages targeting keywords, local SEO structure, and 95+ PageSpeed. These are the building blocks for ranking.',
      },
    ],
    metaTitle: 'Web Design for Dentists | Patient-Focused Websites That Convert',
    metaDescription:
      'Dental website design that gets appointments. Online booking, treatment pages, GDPR-compliant, local SEO. Custom-coded, 95+ PageSpeed, live in 14 days.',
  },

  'web-design-for-salons': {
    slug: 'web-design-for-salons',
    industry: 'Hair & Beauty Salons',
    headline: 'Web Design for Salons',
    subheadline: 'Your salon is stunning — your website should be too.',
    heroDescription:
      'Beautifully crafted websites for salons, spas, and beauty businesses. Online booking, treatment menus, and gallery showcases built to turn browsers into booked clients.',
    painPoints: [
      'Your website doesn\'t reflect the quality of your salon — first impressions lost online',
      'Clients can\'t book online — they call, get voicemail, then book with someone else',
      'No gallery of your work — your Instagram does more selling than your website',
      'You\'re paying for a Wix/Squarespace template that looks like everyone else',
    ],
    solutions: [
      'Bespoke design that matches your salon\'s aesthetic — not a template anyone else has',
      'Seamless booking integration with Fresha, Timely, Booksy, or your current system',
      'Instagram-style gallery showcasing your best work with lightbox zoom',
      'Treatment menu with pricing, duration, and one-click booking per service',
      'Team profiles with individual booking links',
      'Gift voucher integration and loyalty programme pages',
    ],
    stats: [
      { label: 'Online booking increase', value: '+520%' },
      { label: 'Client acquisition cost drop', value: '-45%' },
      { label: 'Google PageSpeed score', value: '98' },
    ],
    faqs: [
      {
        question: 'How much does a salon website cost?',
        answer:
          'Our salon websites start at £2,497 (Launch). The Growth package at £4,997 is most popular — it includes gallery, team profiles, treatment menu, booking integration, and 90-day support.',
      },
      {
        question: 'Can you integrate with Fresha or Timely?',
        answer:
          'Yes — we integrate with all major salon booking platforms including Fresha, Timely, Booksy, and Square Appointments. The booking flow is embedded seamlessly into your site.',
      },
      {
        question: 'Can I update the gallery and prices myself?',
        answer:
          'We can set up a simple content management system so you can update your gallery, prices, and team info without touching any code.',
      },
      {
        question: 'How long does it take?',
        answer: '14 days from brief to launch. We send you designs to approve in the first week and build in the second.',
      },
    ],
    metaTitle: 'Web Design for Salons | Beautiful Websites That Book Clients',
    metaDescription:
      'Salon website design with online booking, galleries, and treatment menus. Custom-coded, mobile-first, 95+ PageSpeed. Built in 14 days. Get your free quote.',
  },

  'web-design-for-gyms': {
    slug: 'web-design-for-gyms',
    industry: 'Gyms & Fitness Studios',
    headline: 'Web Design for Gyms',
    subheadline: 'Convert visitors into members — automatically.',
    heroDescription:
      'High-performance websites for gyms, PT studios, and fitness brands. Class schedules, membership sign-ups, and lead capture — built to convert traffic into members 24/7.',
    painPoints: [
      'Your website is a brochure — it doesn\'t actually sign anyone up',
      'Class schedule is a static image or PDF that\'s always out of date',
      'You\'re losing leads because there\'s no clear call-to-action or trial offer',
      'Competitors with worse facilities are outranking you on Google',
    ],
    solutions: [
      'Conversion-optimised design with prominent CTAs — free trial, class booking, or membership sign-up',
      'Dynamic class schedule that updates automatically or integrates with Mindbody, Glofox, or TeamUp',
      'Membership pricing comparison with clear tier breakdown',
      'Lead capture with automated email nurture setup',
      'Trainer profiles with qualifications, specialities, and booking links',
      'Before/after transformations and member testimonials',
    ],
    stats: [
      { label: 'Lead form conversion increase', value: '+180%' },
      { label: 'Average speed improvement', value: '4.1x' },
      { label: 'Member sign-ups (90 days)', value: '+67%' },
    ],
    faqs: [
      {
        question: 'How much does a gym website cost?',
        answer:
          'Starting from £2,497 for a 5-page site. Most gyms choose Growth at £4,997 for class schedules, membership tiers, trainer profiles, blog, and 90-day support.',
      },
      {
        question: 'Can you integrate with Mindbody or Glofox?',
        answer:
          'Yes — class schedules, membership sign-ups, and booking flows can integrate with Mindbody, Glofox, TeamUp, or any system with an API or embed.',
      },
      {
        question: 'Can members sign up directly on the site?',
        answer:
          'Absolutely. We build membership sign-up flows with pricing comparison, payment integration (Stripe, GoCardless), and automated welcome emails.',
      },
      {
        question: 'How do you help with SEO?',
        answer:
          'Every gym site includes local SEO structure, Google Business setup guidance, fitness-specific schema markup, and 95+ PageSpeed scores. We target keywords like "gym [your area]" and "personal trainer near me".',
      },
    ],
    metaTitle: 'Web Design for Gyms | Websites That Convert Visitors to Members',
    metaDescription:
      'Gym website design with class schedules, membership sign-ups, and lead capture. Custom-coded, mobile-first, 95+ PageSpeed. Delivered in 14 days.',
  },

  'web-design-for-real-estate': {
    slug: 'web-design-for-real-estate',
    industry: 'Real Estate & Property',
    headline: 'Web Design for Estate Agents',
    subheadline: 'Win more instructions. Close more sales.',
    heroDescription:
      'Premium websites for estate agents, lettings agencies, and property developers. Property listings, valuation forms, and market area pages — built to generate vendor and landlord leads.',
    painPoints: [
      'Your website looks like every other Rightmove clone — no differentiation',
      'Vendor leads go to the portals, not your site — you\'re renting your business',
      'No area guide pages — missing massive SEO opportunity for local searches',
      'Property listing pages are slow, clunky, and not mobile-friendly',
    ],
    solutions: [
      'Distinctive brand design that sets you apart from template agencies',
      'Instant valuation tool or book-a-valuation forms that capture vendor leads',
      'Area guide pages targeting "[area] estate agent" keywords — huge SEO value',
      'Property listing integration via API (Reapit, Alto, Jupix, or custom feed)',
      'Market report pages and sold price data to build authority',
      'Landlord-focused landing pages for lettings lead generation',
    ],
    stats: [
      { label: 'Valuation request increase', value: '+180%' },
      { label: 'Organic traffic growth', value: '+340%' },
      { label: 'Cost per lead reduction', value: '-52%' },
    ],
    faqs: [
      {
        question: 'How much does an estate agent website cost?',
        answer:
          'Our property websites start at £4,997 (Growth) which includes property listings integration, area pages, valuation forms, and 90-day support. The Scale package at £9,997+ adds custom API integrations and unlimited pages.',
      },
      {
        question: 'Can you pull listings from Reapit or Jupix?',
        answer:
          'Yes — we integrate with all major property CRMs including Reapit, Alto, Jupix, Street, and Dezrez. Listings sync automatically to your site.',
      },
      {
        question: 'What about Rightmove and Zoopla feeds?',
        answer:
          'Your site works alongside the portals, not against them. We structure it so your own website captures the leads that portals miss — primarily vendor/landlord enquiries via SEO.',
      },
      {
        question: 'How do area guide pages help with SEO?',
        answer:
          'Each area page targets "[town] estate agent" or "houses for sale in [area]" — these are high-intent searches. One page per area you serve, each optimised to rank. This is how independent agents beat the corporates online.',
      },
    ],
    metaTitle: 'Web Design for Estate Agents | Property Websites That Win Instructions',
    metaDescription:
      'Estate agent website design with property listings, valuation tools, and area guides. Custom-coded, 95+ PageSpeed. Built to generate vendor leads. 14-day delivery.',
  },
};

// ── Static Params ──────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(niches).map((slug) => ({ niche: slug }));
}

// ── Dynamic Metadata ───────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string }>;
}): Promise<Metadata> {
  const { niche: slug } = await params;
  const niche = niches[slug];
  if (!niche) return {};

  return {
    title: niche.metaTitle,
    description: niche.metaDescription,
    alternates: {
      canonical: `/services/${niche.slug}`,
    },
    openGraph: {
      title: niche.metaTitle,
      description: niche.metaDescription,
      url: `https://www.crftdweb.com/services/${niche.slug}`,
      type: 'website',
    },
  };
}

// ── Page Component ─────────────────────────────────────────────────────

export default async function NichePage({
  params,
}: {
  params: Promise<{ niche: string }>;
}) {
  const { niche: slug } = await params;
  const niche = niches[slug];
  if (!niche) notFound();

  const baseUrl = 'https://www.crftdweb.com';

  return (
    <>
      {/* Structured Data */}
      <ServiceJsonLd
        name={niche.headline}
        description={niche.heroDescription}
        url={`${baseUrl}/services/${niche.slug}`}
      />
      <FaqJsonLd faqs={niche.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Services', url: `${baseUrl}/services` },
          { name: niche.headline, url: `${baseUrl}/services/${niche.slug}` },
        ]}
      />

      <main className="bg-black text-white">
        {/* ── Hero ────────────────────────────────── */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
          <div className="relative container mx-auto px-4 py-32 text-center max-w-4xl">
            <p className="text-purple-400 text-xs font-medium tracking-[0.2em] uppercase mb-6">
              {niche.industry}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              {niche.headline}
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-light mb-4">
              {niche.subheadline}
            </p>
            <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {niche.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
              >
                Get a Free Quote
              </a>
              <a
                href="/work"
                className="px-8 py-4 border border-white/20 text-white/70 rounded-lg hover:border-white/40 hover:text-white transition-colors text-sm"
              >
                See Our Work
              </a>
            </div>
          </div>
        </section>

        {/* ── Pain Points ─────────────────────────── */}
        <section className="py-24 border-t border-white/[0.06]">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Sound familiar?
            </h2>
            <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
              These are the problems we solve for {niche.industry.toLowerCase()} businesses every week.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {niche.painPoints.map((pain, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-6 rounded-xl border border-red-500/10 bg-red-500/[0.03]"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Solutions ───────────────────────────── */}
        <section className="py-24 border-t border-white/[0.06]">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Here&apos;s what we build for you.
            </h2>
            <p className="text-white/40 text-center mb-16 max-w-2xl mx-auto">
              Every feature is tailored to {niche.industry.toLowerCase()} — not a generic template.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {niche.solutions.map((sol, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-6 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03]"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{sol}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────── */}
        <section className="py-24 border-t border-white/[0.06]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Results that speak for themselves.
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {niche.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ (SEO-rich) ──────────────────────── */}
        <section className="py-24 border-t border-white/[0.06]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {niche.faqs.map((faq, i) => (
                <div key={i} className="border border-white/[0.06] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────── */}
        <section className="py-24 border-t border-white/[0.06]">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your online presence?
            </h2>
            <p className="text-white/40 mb-10 leading-relaxed">
              Get a free, no-obligation quote tailored to your {niche.industry.toLowerCase()} business.
              14-day delivery. 100% money-back guarantee.
            </p>
            <a
              href="/contact"
              className="inline-block px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
            >
              Get Your Free Quote →
            </a>
          </div>
        </section>

        {/* ── Related resources ───────────────────── */}
        <section className="py-20 border-t border-white/[0.06]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-white/80">Related resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="/answers" className="block p-5 rounded-xl border border-white/[0.06] hover:border-white/20 transition-colors">
                <p className="text-xs text-purple-400 mb-1 uppercase tracking-wider">Answers</p>
                <p className="text-sm text-white/70">Quick answers to common web design questions</p>
              </a>
              <a href="/concepts" className="block p-5 rounded-xl border border-white/[0.06] hover:border-white/20 transition-colors">
                <p className="text-xs text-purple-400 mb-1 uppercase tracking-wider">Concepts</p>
                <p className="text-sm text-white/70">Deep dives into design and performance concepts</p>
              </a>
              <a href="/faq" className="block p-5 rounded-xl border border-white/[0.06] hover:border-white/20 transition-colors">
                <p className="text-xs text-purple-400 mb-1 uppercase tracking-wider">FAQ</p>
                <p className="text-sm text-white/70">Everything you need to know before you start</p>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
