import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Blog | Web Design Tips, Case Studies & Guides',
  description:
    'Web design insights, case studies, and honest guides from CrftdWeb. Learn about custom-coded websites, SEO, conversion optimisation, and growing your business online.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'CrftdWeb Blog',
    description: 'Web design insights, case studies, and guides.',
    url: 'https://www.crftdweb.com/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.crftdweb.com' },
          { name: 'Blog', url: 'https://www.crftdweb.com/blog' },
        ]}
      />

      <main className="bg-black text-white min-h-screen">
        {/* Hero */}
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
          <div className="relative container mx-auto px-4 max-w-4xl text-center">
            <p className="text-purple-400 text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Blog
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Insights & Case Studies
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
              Honest web design advice, real client results, and guides that actually help you grow your business online.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="pb-32">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-medium tracking-wider uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-white/30">{post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-semibold mb-3 leading-snug group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-[11px] text-white/20" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="text-xs text-white/30 group-hover:text-purple-400 transition-colors">
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="pb-32">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold mb-8 text-white">Related resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/answers" className="p-5 border border-white/10 rounded-xl hover:border-white/30 transition-colors">
                <h3 className="font-semibold mb-2 text-white">Answers</h3>
                <p className="text-sm text-white/50">Direct answers to web design questions.</p>
              </Link>
              <Link href="/concepts" className="p-5 border border-white/10 rounded-xl hover:border-white/30 transition-colors">
                <h3 className="font-semibold mb-2 text-white">Concepts</h3>
                <p className="text-sm text-white/50">Deep dives into web design strategy.</p>
              </Link>
              <Link href="/glossary" className="p-5 border border-white/10 rounded-xl hover:border-white/30 transition-colors">
                <h3 className="font-semibold mb-2 text-white">Glossary</h3>
                <p className="text-sm text-white/50">Definitions of key terms.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
