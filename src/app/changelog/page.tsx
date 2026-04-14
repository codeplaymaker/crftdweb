import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'A record of what CrftdWeb has built, shipped, and improved. New pages, features, client projects, and updates — documented as they happen.',
  alternates: { canonical: '/changelog' },
};

const entries = [
  {
    date: '2026-04-14',
    title: 'Launched Answers, Concepts, and Glossary sections',
    description: 'Added 13 answer pages, 8 concept deep-dives, and 24 glossary term definitions to improve content depth and AI discoverability.',
    tag: 'Content',
  },
  {
    date: '2026-04-14',
    title: 'Added llms.txt and llms-full.txt',
    description: 'Created context files for AI crawlers — giving AI systems a clear, structured overview of what CrftdWeb is, what we offer, and where to find key content.',
    tag: 'SEO',
  },
  {
    date: '2026-04-14',
    title: 'Updated robots.txt with AI crawler directives',
    description: 'Explicitly allowed GPTBot, ClaudeBot, and PerplexityBot (citation crawlers). Blocked CCBot and training crawlers.',
    tag: 'SEO',
  },
  {
    date: '2026-04-14',
    title: 'Added Person schema and SearchAction to structured data',
    description: 'Enhanced JSON-LD with Person schema for author authority and SearchAction for sitelinks search box eligibility.',
    tag: 'SEO',
  },
  {
    date: '2026-04-05',
    title: 'Launched FAQ page',
    description: 'Published 12 frequently asked questions with full answers covering pricing, process, timelines, and technology. Full FAQPage schema included.',
    tag: 'Content',
  },
  {
    date: '2026-03-28',
    title: 'Published WordPress vs Custom-Coded Website guide',
    description: 'An honest comparison covering speed, cost, SEO, security, and maintenance. Includes real benchmark data from client projects.',
    tag: 'Blog',
  },
  {
    date: '2026-03-20',
    title: 'Published Microbiome Design case study',
    description: 'Documented the full rebuild of Microbiome Design\'s website — from zero credibility to 97 PageSpeed and investor-grade presence.',
    tag: 'Blog',
  },
  {
    date: '2026-03-15',
    title: 'Published The Life Lab HQ case study',
    description: 'Documented the conversion redesign that delivered +340% increase in sign-ups for The Life Lab HQ membership platform.',
    tag: 'Blog',
  },
  {
    date: '2026-03-01',
    title: 'Launched website-cost pricing guide',
    description: 'Published transparent pricing breakdown for custom websites across different business sizes and complexity levels.',
    tag: 'Content',
  },
  {
    date: '2026-02-20',
    title: 'Added niche service pages',
    description: 'Launched five industry-specific service pages: restaurants, dentists, salons, gyms, and estate agents. Each with tailored content, Service schema, FAQPage schema, and BreadcrumbList.',
    tag: 'Pages',
  },
  {
    date: '2026-02-01',
    title: 'Site launch',
    description: 'Initial launch of crftdweb.com — custom-coded in Next.js, deployed on Vercel. Core pages: Home, About, Services, Work, Blog, Contact.',
    tag: 'Launch',
  },
];

const tagColors: Record<string, string> = {
  Content: 'bg-blue-50 text-blue-700',
  SEO: 'bg-green-50 text-green-700',
  Blog: 'bg-purple-50 text-purple-700',
  Pages: 'bg-orange-50 text-orange-700',
  Launch: 'bg-black text-white',
};

export default function ChangelogPage() {
  const baseUrl = 'https://www.crftdweb.com';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Changelog', url: `${baseUrl}/changelog` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                CHANGELOG
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">
                What We&apos;ve Built
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A running record of pages added, features shipped, and improvements made to crftdweb.com.
              </p>
            </div>

            <div className="space-y-0">
              {entries.map((entry, i) => (
                <div key={i} className="flex gap-6 pb-10 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0" />
                    {i < entries.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-2">
                    <time className="text-xs text-muted-foreground mb-2 block">
                      {new Date(entry.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-semibold text-base">{entry.title}</h2>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColors[entry.tag] || 'bg-gray-100 text-gray-600'}`}>
                        {entry.tag}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Related Resources */}
            <div className="mt-16 pt-12 border-t">
              <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/blog" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Blog</h3>
                  <p className="text-sm text-muted-foreground">Case studies and guides from our work.</p>
                </Link>
                <Link href="/work" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Work</h3>
                  <p className="text-sm text-muted-foreground">Client projects and results.</p>
                </Link>
                <Link href="/about" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">Who we are and how we work.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
