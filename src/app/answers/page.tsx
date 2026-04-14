import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { answers } from '@/lib/answers/answers';

export const metadata: Metadata = {
  title: 'Web Design Answers',
  description: 'Direct answers to the most common web design questions. How much does a website cost? How long does it take? Do I need SEO?',
  alternates: { canonical: '/answers' },
};

export default function AnswersPage() {
  const baseUrl = 'https://www.crftdweb.com';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Answers', url: `${baseUrl}/answers` },
        ]}
      />
      <main className="pt-20">
        <section className="py-32">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                ANSWERS
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">
                Real questions.
                <br className="hidden md:block" />
                <span className="text-muted-foreground">Real answers.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                No pitch. No waffle. Just the thing you came to know.
              </p>
            </div>

            <div className="space-y-4">
              {answers.map((answer) => (
                <Link
                  key={answer.slug}
                  href={`/answers/${answer.slug}`}
                  className="block p-6 border rounded-xl hover:border-black/30 transition-colors group"
                >
                  <h2 className="font-semibold mb-2 group-hover:underline">{answer.question}</h2>
                  <p className="text-sm text-muted-foreground">{answer.shortAnswer}</p>
                </Link>
              ))}
            </div>

            {/* Related Resources */}
            <div className="mt-20 pt-12 border-t">
              <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/faq" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">FAQ</h3>
                  <p className="text-sm text-muted-foreground">Working with us. How it goes.</p>
                </Link>
                <Link href="/glossary" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Glossary</h3>
                  <p className="text-sm text-muted-foreground">Understand the words. Own the outcome.</p>
                </Link>
                <Link href="/concepts" className="p-5 border rounded-xl hover:border-black/30 transition-colors">
                  <h3 className="font-semibold mb-2">Concepts</h3>
                  <p className="text-sm text-muted-foreground">The ideas behind sites that work.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
