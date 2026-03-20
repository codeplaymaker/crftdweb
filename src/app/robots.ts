import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.crftdweb.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/engine/dashboard', '/preview/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
