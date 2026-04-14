import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Answers to the most common questions about CrftdWeb\'s web design services, pricing, process, and timelines. Custom websites. 14-day delivery. 90+ PageSpeed.',
  alternates: { canonical: '/faq' },
};

const faqs = [
  {
    question: 'How much does a custom website cost?',
    answer: 'Our custom websites typically range from £997 for a small 5-7 page site to £6,000+ for larger service businesses or web applications. The exact cost depends on the number of pages, custom features, and integrations required. We publish a full pricing breakdown at /services/website-cost.',
  },
  {
    question: 'How long does it take to build a website?',
    answer: 'Our standard delivery is 14 days from project kick-off to launch. This covers discovery, design, development, and handover. Larger projects with custom functionality may take 3–6 weeks.',
  },
  {
    question: 'Do you use WordPress or templates?',
    answer: 'No. We hand-code every website from scratch using Next.js, React, and TypeScript. No WordPress themes, no page builders, no templates. This gives you a faster, more secure, and more maintainable site.',
  },
  {
    question: 'What PageSpeed score will my website get?',
    answer: 'We guarantee a 90+ Google PageSpeed score on all projects. Our average is 95+. We have achieved 97 on client sites like Microbiome Design. Speed is built into our process from day one, not added as an afterthought.',
  },
  {
    question: 'Will my website work on mobile?',
    answer: 'Yes. Every website we build is mobile-first. We design and develop for mobile screens first, then scale up to tablet and desktop. Over 60% of web traffic is mobile, so this is not optional.',
  },
  {
    question: 'Do you help with SEO?',
    answer: 'Yes. Every website includes technical SEO built in: proper heading structure, meta descriptions, schema markup (JSON-LD), sitemap.xml, robots.txt, canonical URLs, and performance optimisation. We do not offer ongoing SEO content services, but we build the technical foundation correctly.',
  },
  {
    question: 'What industries do you specialise in?',
    answer: 'We have specific expertise in restaurants, dental practices, salons and beauty businesses, gyms and fitness studios, and estate agents. We also work with startups, coaches, agencies, and service businesses more broadly.',
  },
  {
    question: 'What happens if I need changes after launch?',
    answer: 'All projects include a 30-day support period after launch for bug fixes and minor adjustments. After that, we offer ongoing maintenance retainers or charge for larger changes at our standard hourly rate.',
  },
  {
    question: 'Do you offer hosting?',
    answer: 'We deploy all websites to Vercel, which provides automatic scaling, a global CDN, and zero-downtime deployments. Vercel\'s Pro plan costs £15/month and we set everything up for you. You own the account.',
  },
  {
    question: 'Can you redesign my existing website?',
    answer: 'Yes. Most of our projects are redesigns, not new builds. We start with a discovery session to understand what your current site is missing, then design and build a replacement. We handle the migration and DNS transfer.',
  },
  {
    question: 'Do you work with clients outside the UK?',
    answer: 'Yes. While we are based in the United Kingdom, we work with clients worldwide. All our communication is asynchronous-friendly and we use Zoom for discovery calls and project reviews.',
  },
  {
    question: 'What do I need to provide to get started?',
    answer: 'To start a project we need: your brand assets (logo, colours), your goals and target audience, any existing content or copy you want to use, and examples of websites you like. We guide you through everything else in the discovery session.',
  },
];

export default function FaqPage() {
  const baseUrl = 'https://www.crftdweb.com';

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'FAQ', url: `${baseUrl}/faq` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                FAQ
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about working with CrftdWeb. Can&apos;t find what you&apos;re looking for? <Link href="/contact" className="underline underline-offset-4">Ask us directly.</Link>
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b pb-8">
                  <h2 className="text-lg font-semibold mb-3">{faq.question}</h2>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Related Resources */}
            <div className="mt-20 pt-12 border-t">
              <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/services/website-cost" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Website Cost Guide</h3>
                  <p className="text-sm text-muted-foreground">Full pricing breakdown for custom websites.</p>
                </Link>
                <Link href="/answers" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Answers</h3>
                  <p className="text-sm text-muted-foreground">Direct answers to web design questions.</p>
                </Link>
                <Link href="/contact" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Start a Project</h3>
                  <p className="text-sm text-muted-foreground">Tell us what you need. We&apos;ll tell you what it costs.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
