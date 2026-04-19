import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog/posts';
import { getAllTermSlugs } from '@/lib/glossary/terms';
import { getAllAnswerSlugs } from '@/lib/answers/answers';
import { getAllConceptSlugs } from '@/lib/concepts/concepts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.crftdweb.com';
  const now = new Date().toISOString();

  // Core pages
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/changelog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Niche service pages
  const nicheRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services/web-design-for-restaurants`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-dentists`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-salons`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-gyms`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-real-estate`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-science-research`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-lifestyle-brands`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-traders`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  // Content / SEO pages
  const contentRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services/website-cost`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Blog posts
  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Product pages
  const productRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/playbook`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/engine`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Glossary pages
  const glossaryIndex: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/glossary`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
  const glossaryRoutes: MetadataRoute.Sitemap = getAllTermSlugs().map((slug) => ({
    url: `${baseUrl}/glossary/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Answers pages
  const answersIndex: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/answers`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
  const answersRoutes: MetadataRoute.Sitemap = getAllAnswerSlugs().map((slug) => ({
    url: `${baseUrl}/answers/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Concepts pages
  const conceptsIndex: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/concepts`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
  const conceptsRoutes: MetadataRoute.Sitemap = getAllConceptSlugs().map((slug) => ({
    url: `${baseUrl}/concepts/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...coreRoutes,
    ...nicheRoutes,
    ...contentRoutes,
    ...blogRoutes,
    ...productRoutes,
    ...glossaryIndex,
    ...glossaryRoutes,
    ...answersIndex,
    ...answersRoutes,
    ...conceptsIndex,
    ...conceptsRoutes,
  ];
}
