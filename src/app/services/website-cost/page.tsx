import type { Metadata } from 'next';
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'How Much Does a Website Cost in 2026? | Honest Pricing Guide',
  description:
    'Transparent breakdown of website costs in 2026. WordPress vs custom-coded, freelancer vs agency, templates vs bespoke. Real prices, no fluff. Free quote available.',
  alternates: {
    canonical: '/services/website-cost',
  },
  openGraph: {
    title: 'How Much Does a Website Cost in 2026?',
    description: 'Transparent pricing guide for business websites. WordPress vs custom. Freelancer vs agency. Real numbers.',
    url: 'https://www.crftdweb.com/services/website-cost',
    type: 'article',
  },
};

const faqs = [
  {
    question: 'How much does a basic website cost?',
    answer:
      'A basic 5-page business website ranges from £500 (DIY template) to £5,000 (custom-coded). The price depends on whether you use a template, a freelancer, or an agency with custom code.',
  },
  {
    question: 'Is a custom-coded website worth the cost?',
    answer:
      'For businesses that depend on their website for leads, yes. Custom-coded sites load 3-5x faster, score 95+ on Google PageSpeed (a ranking factor), and can be engineered for conversion. Template sites average 4-7 second load times and 50-70 PageSpeed scores.',
  },
  {
    question: 'How much does a WordPress website cost?',
    answer:
      'WordPress sites typically cost £1,000-£5,000 from a freelancer, or £5,000-£15,000 from an agency. However, ongoing costs include hosting (£5-50/month), plugin licences (£100-500/year), security maintenance, and update management.',
  },
  {
    question: 'What are the ongoing costs of a website?',
    answer:
      'Domain name: £10-15/year. Hosting: £0 (Vercel/Netlify free tier for static sites) to £50/month (managed WordPress). SSL: Free with modern hosts. Maintenance: £0 (custom-coded) to £50-200/month (WordPress plugin updates and security patches).',
  },
  {
    question: 'How much does CrftdWeb charge?',
    answer:
      'Our Launch package is £2,497 (5-page custom-coded site). Growth is £4,997 (up to 10 pages with booking integration, blog, and 90-day support). Scale is £9,997+ (unlimited pages, API integrations, 12-month partnership). All include a 100% money-back guarantee.',
  },
  {
    question: 'Why are some websites £500 and others £25,000?',
    answer:
      'The £500 site is a pre-made template with your logo swapped in. The £25,000 site is custom-designed and coded, with conversion strategy, copywriting, SEO, and ongoing support. The difference is like buying a suit off the rack vs. having one tailored — same concept, completely different result.',
  },
];

export default function WebsiteCostPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.crftdweb.com' },
          { name: 'Services', url: 'https://www.crftdweb.com/services' },
          { name: 'Website Cost Guide', url: 'https://www.crftdweb.com/services/website-cost' },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <main className="bg-black text-white">
        {/* Hero */}
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
          <div className="relative container mx-auto px-4 max-w-3xl text-center">
            <p className="text-purple-400 text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Pricing Guide · 2026
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              How Much Does a Website Cost?
            </h1>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed">
              The honest answer every business owner should read before spending a penny.
              No sales fluff — just real numbers and what you actually get for each.
            </p>
          </div>
        </section>

        {/* Content */}
        <article className="container mx-auto px-4 max-w-3xl pb-32">
          <div className="prose prose-invert prose-lg max-w-none space-y-16">

            {/* Quick Answer */}
            <section>
              <div className="bg-purple-500/[0.05] border border-purple-500/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 mt-0">The Quick Answer</h2>
                <p className="text-white/60 leading-relaxed mb-0">
                  A business website in 2026 costs anywhere from <strong className="text-white">£500 to £25,000+</strong>. The
                  massive range exists because &quot;a website&quot; can mean a DIY template you build in a weekend or a
                  fully custom-coded, conversion-engineered digital asset. Here&apos;s how to figure out what <em>you</em> actually need.
                </p>
              </div>
            </section>

            {/* Comparison Table */}
            <section>
              <h2 className="text-3xl font-bold mb-8">Website Cost Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-white/40 font-medium">Option</th>
                      <th className="text-left py-4 px-4 text-white/40 font-medium">Cost</th>
                      <th className="text-left py-4 px-4 text-white/40 font-medium">Timeline</th>
                      <th className="text-left py-4 px-4 text-white/40 font-medium">PageSpeed</th>
                      <th className="text-left py-4 px-4 text-white/40 font-medium">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    <tr className="border-b border-white/[0.06]">
                      <td className="py-4 px-4 font-medium text-white">DIY Template</td>
                      <td className="py-4 px-4">£0-500</td>
                      <td className="py-4 px-4">1-7 days</td>
                      <td className="py-4 px-4 text-red-400">40-60</td>
                      <td className="py-4 px-4">Hobby / test idea</td>
                    </tr>
                    <tr className="border-b border-white/[0.06]">
                      <td className="py-4 px-4 font-medium text-white">WordPress (freelancer)</td>
                      <td className="py-4 px-4">£1,000-5,000</td>
                      <td className="py-4 px-4">2-6 weeks</td>
                      <td className="py-4 px-4 text-amber-400">50-70</td>
                      <td className="py-4 px-4">Budget-conscious SMEs</td>
                    </tr>
                    <tr className="border-b border-white/[0.06]">
                      <td className="py-4 px-4 font-medium text-white">WordPress (agency)</td>
                      <td className="py-4 px-4">£5,000-15,000</td>
                      <td className="py-4 px-4">6-12 weeks</td>
                      <td className="py-4 px-4 text-amber-400">55-75</td>
                      <td className="py-4 px-4">Mid-size businesses</td>
                    </tr>
                    <tr className="border-b border-white/[0.06]">
                      <td className="py-4 px-4 font-medium text-white">Custom-Coded (studio)</td>
                      <td className="py-4 px-4">£2,500-10,000</td>
                      <td className="py-4 px-4">2-4 weeks</td>
                      <td className="py-4 px-4 text-emerald-400">90-100</td>
                      <td className="py-4 px-4">Growth-focused businesses</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium text-white">Enterprise Agency</td>
                      <td className="py-4 px-4">£15,000-100,000+</td>
                      <td className="py-4 px-4">3-12 months</td>
                      <td className="py-4 px-4 text-emerald-400">85-100</td>
                      <td className="py-4 px-4">Large corporations</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Hidden Costs */}
            <section>
              <h2 className="text-3xl font-bold mb-6">The Hidden Costs Nobody Mentions</h2>
              <p className="text-white/60 leading-relaxed">
                The sticker price is never the full story. Here&apos;s what most agencies don&apos;t tell you upfront:
              </p>
              <div className="grid gap-4 mt-8">
                {[
                  { title: 'Hosting', desc: 'WordPress: £5-50/month. Custom-coded on Vercel/Netlify: Free tier covers most business sites.' },
                  { title: 'Plugin licences', desc: 'WordPress sites average £100-500/year in premium plugin renewals. Custom-coded sites: £0.' },
                  { title: 'Maintenance & security', desc: 'WordPress needs monthly updates or risks getting hacked. Custom-coded sites have zero plugins to patch.' },
                  { title: 'Redesign cycle', desc: 'Template sites typically need a full rebuild every 2-3 years as they accumulate plugin bloat. Well-coded sites last 5+ years.' },
                  { title: 'Opportunity cost', desc: 'A site that loads in 5 seconds instead of 1.5 loses 50%+ of visitors. If your customer is worth £500, every lost visitor is real money.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl border border-amber-500/10 bg-amber-500/[0.03]">
                    <div className="w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-0">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What affects price */}
            <section>
              <h2 className="text-3xl font-bold mb-6">What Actually Affects the Price</h2>
              <div className="space-y-6 text-white/60 leading-relaxed">
                <p>
                  <strong className="text-white">Number of pages</strong> — A simple 5-page site costs less than a 20-page
                  site with blog, team profiles, and individual service pages.
                </p>
                <p>
                  <strong className="text-white">Custom functionality</strong> — Online booking, e-commerce, member portals,
                  API integrations, and calculators add complexity and cost.
                </p>
                <p>
                  <strong className="text-white">Design complexity</strong> — A clean, minimalist design costs less than
                  a site with complex animations, 3D elements, and custom illustrations.
                </p>
                <p>
                  <strong className="text-white">Copywriting</strong> — If you provide all the text, it&apos;s cheaper.
                  If the agency writes conversion-optimised copy, that&apos;s a significant value-add.
                </p>
                <p>
                  <strong className="text-white">Ongoing support</strong> — Some agencies charge a monthly retainer for
                  updates, hosting, and support. Others hand over the site and you&apos;re on your own.
                </p>
              </div>
            </section>

            {/* CrftdWeb pricing */}
            <section>
              <h2 className="text-3xl font-bold mb-6">What CrftdWeb Charges</h2>
              <p className="text-white/60 leading-relaxed mb-8">
                We&apos;re transparent about our pricing. Every site is custom-coded in Next.js — the same technology
                used by Nike, Netflix, and Notion. No WordPress, no templates, no bloat.
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    name: 'Launch',
                    price: '£2,497',
                    features: ['5 pages', 'Custom-coded', 'Mobile-first', 'SEO foundations', '30-day support'],
                  },
                  {
                    name: 'Growth',
                    price: '£4,997',
                    features: ['Up to 10 pages', 'Conversion copy structure', 'Booking integration', 'Blog', 'Analytics', '90-day support'],
                    popular: true,
                  },
                  {
                    name: 'Scale',
                    price: '£9,997+',
                    features: ['Unlimited pages', 'Custom features', 'API integrations', 'Full brand system', '12-month partnership'],
                  },
                ].map((tier) => (
                  <div
                    key={tier.name}
                    className={`p-6 rounded-xl border ${
                      tier.popular
                        ? 'border-purple-500/30 bg-purple-500/[0.05]'
                        : 'border-white/[0.06] bg-white/[0.02]'
                    }`}
                  >
                    {tier.popular && (
                      <span className="text-[10px] text-purple-400 font-medium tracking-wider uppercase">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold mt-1">{tier.name}</h3>
                    <div className="text-3xl font-bold text-purple-400 my-4">{tier.price}</div>
                    <ul className="space-y-2">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/50 text-sm">
                          <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-sm text-center mt-6">
                All packages include 100% money-back guarantee. 14-day delivery.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-white/[0.06] rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-0">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center pt-8">
              <h2 className="text-3xl font-bold mb-4">Get Your Free Quote</h2>
              <p className="text-white/40 mb-8">
                Tell us what you need and we&apos;ll send you a transparent quote within 24 hours. No obligations.
              </p>
              <a
                href="/contact"
                className="inline-block px-10 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
              >
                Request a Quote →
              </a>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
