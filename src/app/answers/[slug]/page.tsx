import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { answers, getAllAnswerSlugs, getAnswerBySlug } from '@/lib/answers/answers';

export function generateStaticParams() {
  return getAllAnswerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const answer = getAnswerBySlug(slug);
  if (!answer) return {};
  return {
    title: answer.question,
    description: answer.shortAnswer,
    alternates: { canonical: `/answers/${answer.slug}` },
  };
}

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const answer = getAnswerBySlug(slug);
  if (!answer) notFound();

  const baseUrl = 'https://www.crftdweb.com';

  return (
    <>
      <FaqJsonLd faqs={[{ question: answer.question, answer: answer.fullAnswer }]} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Answers', url: `${baseUrl}/answers` },
          { name: answer.question, url: `${baseUrl}/answers/${answer.slug}` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-3xl mx-auto">
            <Link
              href="/answers"
              className="text-xs text-muted-foreground hover:text-foreground mb-8 inline-block"
            >
              ← All answers
            </Link>

            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
              ANSWERS
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              {answer.question}
            </h1>

            <article>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed font-medium">
                {answer.shortAnswer}
              </p>
              <p className="text-base leading-relaxed">{answer.fullAnswer}</p>
            </article>

            {answer.relatedAnswers.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-lg font-semibold mb-4">Related questions</h2>
                <div className="space-y-3">
                  {answer.relatedAnswers.map((relSlug) => {
                    const rel = answers.find((a) => a.slug === relSlug);
                    if (!rel) return null;
                    return (
                      <Link
                        key={relSlug}
                        href={`/answers/${relSlug}`}
                        className="block p-4 border rounded-xl hover:border-black/30 transition-colors text-sm font-medium"
                      >
                        {rel.question} →
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Resources */}
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-lg font-semibold mb-4">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {answer.relatedPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="p-4 border rounded-xl hover:border-black/30 transition-colors"
                  >
                    <span className="font-medium text-sm">{page.label} →</span>
                  </Link>
                ))}
                <Link href="/faq" className="p-4 border rounded-xl hover:border-black/30 transition-colors">
                  <span className="font-medium text-sm">FAQ →</span>
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
