import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { glossaryTerms } from '@/lib/glossary/terms';

export const metadata: Metadata = {
  title: 'Web Design Glossary',
  description: 'Definitions of key web design, development, and digital marketing terms. Plain English explanations for business owners and marketing teams.',
  alternates: { canonical: '/glossary' },
};

export default function GlossaryIndexPage() {
  const baseUrl = 'https://www.crftdweb.com';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Glossary', url: `${baseUrl}/glossary` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                GLOSSARY
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">
                Web Design Glossary
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Plain English definitions of the web design and development terms you need to know.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {glossaryTerms.map((term) => (
                <Link
                  key={term.slug}
                  href={`/glossary/${term.slug}`}
                  className="p-5 border rounded-xl hover:border-black/30 transition-colors group"
                >
                  <h2 className="font-semibold mb-1 group-hover:underline">{term.term}</h2>
                  <p className="text-sm text-muted-foreground">{term.shortDefinition}</p>
                </Link>
              ))}
            </div>

            {/* Related sections */}
            <div className="mt-20 pt-12 border-t">
              <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/answers" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Answers</h3>
                  <p className="text-sm text-muted-foreground">Direct answers to common web design questions.</p>
                </Link>
                <Link href="/concepts" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Concepts</h3>
                  <p className="text-sm text-muted-foreground">Deep dives into web design strategy and methodology.</p>
                </Link>
                <Link href="/blog" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Blog</h3>
                  <p className="text-sm text-muted-foreground">Case studies and guides from real projects.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
