import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getAllConceptSlugs, getConceptBySlug } from '@/lib/concepts/concepts';

export function generateStaticParams() {
  return getAllConceptSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  return {
    title: concept.title,
    description: concept.shortDescription,
    alternates: { canonical: `/concepts/${concept.slug}` },
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();

  const baseUrl = 'https://www.crftdweb.com';

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: concept.title,
    description: concept.shortDescription,
    author: {
      '@type': 'Organization',
      name: 'CrftdWeb',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CrftdWeb',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/CW-logo.png` },
    },
    mainEntityOfPage: `${baseUrl}/concepts/${concept.slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'article p:first-of-type'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Concepts', url: `${baseUrl}/concepts` },
          { name: concept.title, url: `${baseUrl}/concepts/${concept.slug}` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-3xl mx-auto">
            <Link
              href="/concepts"
              className="text-xs text-muted-foreground hover:text-foreground mb-8 inline-block"
            >
              ← All concepts
            </Link>

            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
              CONCEPT
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              {concept.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              {concept.shortDescription}
            </p>

            <article className="space-y-6">
              {concept.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Related Resources */}
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-lg font-semibold mb-4">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {concept.relatedPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="p-4 border rounded-xl hover:border-black/30 transition-colors"
                  >
                    <span className="font-medium text-sm">{page.label} →</span>
                  </Link>
                ))}
                <Link href="/answers" className="p-4 border rounded-xl hover:border-black/30 transition-colors">
                  <span className="font-medium text-sm">Answers →</span>
                </Link>
                <Link href="/glossary" className="p-4 border rounded-xl hover:border-black/30 transition-colors">
                  <span className="font-medium text-sm">Glossary →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
