/**
 * JSON-LD Structured Data components for SEO.
 * Renders <script type="application/ld+json"> tags for Google rich results.
 */

// ── LocalBusiness Schema  ──────────────────────────────────────────────
export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'CrftdWeb',
    url: 'https://www.crftdweb.com',
    logo: 'https://www.crftdweb.com/CW-logo.png',
    description:
      'Premium web design & development agency crafting high-performance websites for ambitious businesses. Custom-coded, conversion-optimised, and delivered in 14 days.',
    email: 'hello@crftdweb.com',
    priceRange: '££-£££',
    areaServed: [
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    serviceType: [
      'Web Design',
      'Web Development',
      'UI/UX Design',
      'Branding',
      'SEO',
      'Conversion Rate Optimisation',
    ],
    knowsAbout: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Custom Web Development',
      'Performance Optimisation',
    ],
    sameAs: [
      // Add your socials here as you set them up
      // 'https://www.linkedin.com/company/crftdweb',
      // 'https://www.instagram.com/crftdweb',
      // 'https://www.tiktok.com/@crftdweb',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '12',
      bestRating: '5',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Service Schema ─────────────────────────────────────────────────────
interface ServiceJsonLdProps {
  name: string;
  description: string;
  url: string;
  provider?: string;
}

export function ServiceJsonLd({ name, description, url, provider = 'CrftdWeb' }: ServiceJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'ProfessionalService',
      name: provider,
      url: 'https://www.crftdweb.com',
    },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── FAQ Schema ─────────────────────────────────────────────────────────
interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── WebSite Schema (for sitelinks search box) ──────────────────────────
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CrftdWeb',
    url: 'https://www.crftdweb.com',
    description: 'Premium web design & development agency.',
    publisher: {
      '@type': 'Organization',
      name: 'CrftdWeb',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.crftdweb.com/CW-logo.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── BreadcrumbList Schema ──────────────────────────────────────────────
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
