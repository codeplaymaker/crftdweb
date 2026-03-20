import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog/posts';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

// ── Static Params ──────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.crftdweb.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const baseUrl = 'https://www.crftdweb.com';

  // Article structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
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
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
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
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
        ]}
      />

      <main className="bg-black text-white min-h-screen">
        {/* Header */}
        <section className="relative py-32 pb-16">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
          <div className="relative container mx-auto px-4 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mb-8"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-medium tracking-wider uppercase text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-[11px] text-white/30">{post.readTime}</span>
              <time className="text-[11px] text-white/30" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-6">
              {post.title}
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              {post.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <article className="container mx-auto px-4 max-w-3xl pb-32">
          <div className="space-y-8">
            {post.content.map((section, i) => {
              switch (section.type) {
                case 'heading':
                  return (
                    <h2 key={i} className="text-2xl md:text-3xl font-bold mt-12 mb-4">
                      {section.text}
                    </h2>
                  );

                case 'paragraph':
                  return (
                    <p key={i} className="text-white/60 leading-relaxed text-base">
                      {section.text}
                    </p>
                  );

                case 'list':
                  return (
                    <ul key={i} className="space-y-3 ml-0">
                      {section.items?.map((item, j) => (
                        <li key={j} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );

                case 'stat':
                  return (
                    <div key={i} className="grid grid-cols-3 gap-6 py-8 border-y border-white/[0.06]">
                      {section.stats?.map((stat, j) => (
                        <div key={j} className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
                            {stat.value}
                          </div>
                          <div className="text-white/40 text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  );

                case 'quote':
                  return (
                    <blockquote
                      key={i}
                      className="border-l-2 border-purple-500/30 pl-6 py-4 my-8"
                    >
                      <p className="text-white/70 text-lg italic leading-relaxed mb-3">
                        &ldquo;{section.text}&rdquo;
                      </p>
                      {section.author && (
                        <footer className="text-white/30 text-sm">
                          — {section.author}
                          {section.role && <span className="text-white/20">, {section.role}</span>}
                        </footer>
                      )}
                    </blockquote>
                  );

                case 'cta':
                  return (
                    <div
                      key={i}
                      className="bg-purple-500/[0.05] border border-purple-500/10 rounded-xl p-8 text-center mt-12"
                    >
                      <h3 className="text-xl font-bold mb-4">{section.text}</h3>
                      <Link
                        href="/contact"
                        className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
                      >
                        Get Your Free Quote →
                      </Link>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </article>
      </main>
    </>
  );
}
