import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getAllTermSlugs, getTermBySlug } from '@/lib/glossary/terms';

export function generateStaticParams() {
  return getAllTermSlugs().map((slug) => ({ term: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const entry = getTermBySlug(term);
  if (!entry) return {};
  return {
    title: `${entry.term} — Web Design Glossary`,
    description: entry.shortDefinition,
    alternates: { canonical: `/glossary/${entry.slug}` },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const entry = getTermBySlug(term);
  if (!entry) notFound();

  const baseUrl = 'https://www.crftdweb.com';

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.term,
    description: entry.definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'CrftdWeb Web Design Glossary',
      url: `${baseUrl}/glossary`,
    },
    url: `${baseUrl}/glossary/${entry.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Glossary', url: `${baseUrl}/glossary` },
          { name: entry.term, url: `${baseUrl}/glossary/${entry.slug}` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-3xl mx-auto">
            <Link
              href="/glossary"
              className="text-xs text-muted-foreground hover:text-foreground mb-8 inline-block"
            >
              ← All terms
            </Link>

            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
              WEB DESIGN GLOSSARY
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{entry.term}</h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              {entry.shortDefinition}
            </p>

            <article>
              <p className="text-base leading-relaxed mb-8">{entry.definition}</p>
            </article>

            {entry.relatedTerms.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-lg font-semibold mb-4">Related terms</h2>
                <div className="flex flex-wrap gap-3">
                  {entry.relatedTerms.map((slug) => (
                    <Link
                      key={slug}
                      href={`/glossary/${slug}`}
                      className="px-4 py-2 border rounded-full text-sm hover:border-black/40 transition-colors"
                    >
                      {slug.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Resources */}
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-lg font-semibold mb-4">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entry.relatedPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="p-4 border rounded-xl hover:border-black/30 transition-colors"
                  >
                    <span className="font-medium text-sm">{page.label} →</span>
                  </Link>
                ))}
                <Link
                  href="/glossary"
                  className="p-4 border rounded-xl hover:border-black/30 transition-colors"
                >
                  <span className="font-medium text-sm">Back to Glossary →</span>
                </Link>
                <Link
                  href="/faq"
                  className="p-4 border rounded-xl hover:border-black/30 transition-colors"
                >
                  <span className="font-medium text-sm">Frequently Asked Questions →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
