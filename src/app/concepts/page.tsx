import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { concepts } from '@/lib/concepts/concepts';

export const metadata: Metadata = {
  title: 'Web Design Concepts',
  description: 'Deep dives into web design methodology, strategy, and technical concepts. Conversion-first design, Core Web Vitals, site architecture, trust engineering, and more.',
  alternates: { canonical: '/concepts' },
};

export default function ConceptsPage() {
  const baseUrl = 'https://www.crftdweb.com';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Concepts', url: `${baseUrl}/concepts` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                CONCEPTS
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">
                The ideas behind
                <br className="hidden md:block" />
                <span className="text-muted-foreground">high-performing sites.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Strategy first. Design second. Tools last.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {concepts.map((concept) => (
                <Link
                  key={concept.slug}
                  href={`/concepts/${concept.slug}`}
                  className="p-6 border rounded-xl hover:border-black/30 transition-colors group"
                >
                  <h2 className="font-semibold mb-2 group-hover:underline">{concept.title}</h2>
                  <p className="text-sm text-muted-foreground">{concept.shortDescription}</p>
                </Link>
              ))}
            </div>

            {/* Related Resources */}
            <div className="mt-20 pt-12 border-t">
              <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/glossary" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Glossary</h3>
                  <p className="text-sm text-muted-foreground">Understand the words. Own the outcome.</p>
                </Link>
                <Link href="/answers" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Answers</h3>
                  <p className="text-sm text-muted-foreground">Questions asked. Answered directly.</p>
                </Link>
                <Link href="/blog" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Blog</h3>
                  <p className="text-sm text-muted-foreground">Real projects. Real results.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
