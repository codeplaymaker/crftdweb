import type { MetadataRoute } from 'next';

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
  ];

  // Niche service pages — high SEO value
  const nicheRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services/web-design-for-restaurants`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-dentists`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-salons`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-gyms`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/web-design-for-real-estate`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  // Content / SEO pages
  const contentRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/services/website-cost`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Product pages
  const productRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/playbook`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/engine`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  return [...coreRoutes, ...nicheRoutes, ...contentRoutes, ...productRoutes];
}
