export interface Concept {
  slug: string;
  title: string;
  shortDescription: string;
  body: string[];
  relatedPages: { label: string; href: string }[];
}

export const concepts: Concept[] = [
  {
    slug: 'conversion-first-design',
    title: 'Conversion-First Design',
    shortDescription: 'A design philosophy where every decision on the page exists to move visitors toward a specific action.',
    body: [
      'Most web design agencies build beautiful websites. Conversion-first design builds websites that work. The distinction is critical for any business that needs its website to generate enquiries, bookings, or sales.',
      'Conversion-first design starts with a question before any visual work begins: what is the single most important action a visitor should take on this page? Everything else — layout, copy, imagery, spacing — is structured around removing friction from that path.',
      'Key principles of conversion-first design: (1) One primary CTA per page. Multiple competing calls-to-action reduce conversions. (2) Value above the fold. Visitors decide whether to stay within 3 seconds. Your headline, sub-headline, and CTA must all appear before the scroll. (3) Social proof near the top. Testimonials, star ratings, and client logos reduce perceived risk. (4) Progressive disclosure. Lead with the outcome (what the visitor gets), follow with process (how it works), close with evidence (proof it works). (5) Remove distractions. Every navigation link that is not essential to conversion is a leak in the funnel.',
      'Common mistakes: too many CTA options, homepage copy that describes the business rather than addressing the visitor\'s problem, no social proof, stock photography that erodes trust instead of building it, and slow load times that introduce friction before the visitor even reads the headline.',
      'Conversion-first design is not about being salesy. It is about being clear. A visitor who understands immediately what you offer, why it is right for them, and what to do next converts. A confused visitor leaves.',
    ],
    relatedPages: [
      { label: 'CTA', href: '/glossary/cta' },
      { label: 'Hero Section', href: '/glossary/hero-section' },
      { label: 'Lead Generation', href: '/glossary/lead-generation' },
      { label: 'Social Proof', href: '/glossary/social-proof' },
      { label: 'Our Services', href: '/services' },
    ],
  },
  {
    slug: 'core-web-vitals-explained',
    title: 'Core Web Vitals Explained',
    shortDescription: 'Google\'s three performance metrics that measure how fast and stable your site feels to users — and affect your rankings.',
    body: [
      'Core Web Vitals are three real-world performance metrics that Google uses to measure the user experience of a web page. They became a ranking signal in Google\'s Page Experience update and directly affect how high your pages appear in search results.',
      'The three metrics are:',
      'Largest Contentful Paint (LCP): measures loading speed — specifically, how long it takes for the largest visible content element (usually a hero image or headline) to render. Target: under 2.5 seconds. A slow LCP is usually caused by render-blocking JavaScript, large unoptimised images, or slow server response times.',
      'Interaction to Next Paint (INP): measures interactivity — how quickly the page responds when a user clicks, taps, or types. Target: under 200ms. A high INP is typically caused by heavy JavaScript execution blocking the main thread.',
      'Cumulative Layout Shift (CLS): measures visual stability — how much the page layout moves unexpectedly while loading. Target: below 0.1. Layout shifts are caused by images without dimensions, late-loading ads, or dynamically injected content.',
      'You can measure your Core Web Vitals using Google PageSpeed Insights (lab data), Google Search Console (field data from real users), or Chrome DevTools. All three metrics must be in the "Good" range to pass the Core Web Vitals assessment. Custom-coded Next.js sites consistently achieve this; WordPress sites with plugins often do not.',
    ],
    relatedPages: [
      { label: 'Core Web Vitals', href: '/glossary/core-web-vitals' },
      { label: 'Page Speed', href: '/glossary/page-speed' },
      { label: 'How to Speed Up a Slow Website', href: '/answers/how-to-speed-up-a-slow-website' },
      { label: 'What is a Good PageSpeed Score?', href: '/answers/what-is-a-good-pagespeed-score' },
    ],
  },
  {
    slug: 'site-architecture',
    title: 'Site Architecture',
    shortDescription: 'How your website\'s pages are organised, linked, and structured — the invisible foundation of good SEO and UX.',
    body: [
      'Site architecture is the way a website\'s pages are organised, connected by internal links, and accessed through a logical hierarchy. It determines how easily both users and search engines can navigate and understand your content.',
      'A good site architecture has: a flat structure (most pages reachable within 3 clicks from the homepage), logical URL paths (/services/web-design-for-restaurants rather than /page?id=42), breadcrumb navigation on all sub-pages, a sitemap.xml file listing all URLs, and a robots.txt file directing crawlers appropriately.',
      'Poor site architecture leads to: crawl budget waste (Google crawls useless pages while missing important ones), orphan pages (pages with no internal links pointing to them, invisible to search engines), keyword cannibalisation (multiple pages competing for the same search term), and confusing navigation that increases bounce rate.',
      'For business websites, the ideal architecture groups content into clear silos: core pages (Home, About, Services, Contact), service sub-pages (/services/[niche]), content pages (Blog, Answers, Glossary, Concepts), and product/offer pages (Pricing, Playbook, Engine). Each silo should internally link to related content in other silos to reinforce topical authority.',
      'Internal linking is the connective tissue of site architecture. Every page should reference related content. Blog posts should link to relevant concepts. Glossary terms should link to relevant answers. Service pages should link to related case studies.',
    ],
    relatedPages: [
      { label: 'Sitemap', href: '/glossary/sitemap' },
      { label: 'Breadcrumbs', href: '/glossary/breadcrumbs' },
      { label: 'Internal Linking', href: '/glossary/internal-linking' },
      { label: 'SEO', href: '/glossary/seo' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    slug: 'schema-markup-for-small-business',
    title: 'Schema Markup for Small Business',
    shortDescription: 'How structured data helps Google (and AI systems) understand your business — and why most small business sites get it wrong.',
    body: [
      'Schema markup is code added to your website\'s HTML that tells search engines and AI crawlers what your content means, not just what it says. It uses the Schema.org vocabulary, a shared standard maintained by Google, Bing, Yahoo, and Yandex.',
      'Without schema markup, a search engine reads raw text and makes its best guess. With schema markup, you explicitly state: "This is a LocalBusiness", "This is an FAQ", "This person is the founder". The result is richer search results, better AI citation, and stronger entity recognition.',
      'Essential schema types for small business websites: (1) LocalBusiness or ProfessionalService on the homepage — your name, address, phone, area served, opening hours. (2) WebSite with SearchAction — enables sitelinks search box in Google results. (3) BreadcrumbList on all sub-pages — shows navigation path in search results. (4) FAQPage on any page with questions and answers. (5) Article or BlogPosting on every blog post. (6) Person for any founder or author content. (7) Service on service pages. (8) AggregateRating if you have real reviews.',
      'The most common mistake is adding schema markup to only one page (usually the homepage) and leaving all other pages without it. Schema markup should be on every relevant page. A blog post without Article schema is a missed opportunity. A service page without Service and FAQPage schema is not communicating its full context to search engines.',
      'Schema markup is also increasingly important for AI citation. When ChatGPT, Perplexity, or Claude answers a question using website content, they use schema markup to understand page context and decide what to quote. Speakable schema specifically tells AI systems which text is designed to be cited.',
    ],
    relatedPages: [
      { label: 'Schema Markup', href: '/glossary/schema-markup' },
      { label: 'SEO', href: '/glossary/seo' },
      { label: 'What is Technical SEO?', href: '/answers/what-is-technical-seo' },
      { label: 'Our Services', href: '/services' },
    ],
  },
  {
    slug: 'trust-engineering',
    title: 'Trust Engineering',
    shortDescription: 'The deliberate process of designing credibility into your website so visitors feel confident buying from you.',
    body: [
      'Trust is the invisible gatekeeper between a website visit and a conversion. A visitor may want exactly what you offer, understand the price, and have the budget — and still leave without enquiring because the website didn\'t make them feel safe. Trust engineering is the process of deliberately designing credibility into every touchpoint.',
      'The trust signals that matter most for service businesses: (1) Social proof — real testimonials with names, ratings with review counts, client logos, and case study results. Generic "our clients love us" copy is not social proof. Specific "Jane Smith, Founder of [Company]: ..." is. (2) Transparency — clear pricing (or at least a pricing guide), clear process, clear timelines. Hiding information creates suspicion. (3) Specificity — vague claims ("we deliver results") signal low credibility. Specific claims ("97 PageSpeed score", "+340% conversion increase") signal expertise. (4) Risk reversal — money-back guarantees, free consultations, itemised scope documents, and fixed-price quotes all reduce perceived financial risk. (5) Professional design — a slow, templated, or visually inconsistent site erodes trust before a visitor reads a single word.',
      'Trust is also built through content. A detailed blog post that solves a real problem builds more credibility than any testimonial. A glossary that defines industry terms signals expertise. A transparent pricing guide signals confidence. Answer pages that address objections directly signal honesty.',
      'For local service businesses, additional trust signals matter: a physical address, local phone number, Google reviews (linked with schema), and area-specific social proof. "We have worked with 12 dental practices across London" is more credible than "we work with businesses across the UK".',
    ],
    relatedPages: [
      { label: 'Social Proof', href: '/glossary/social-proof' },
      { label: 'Conversion-First Design', href: '/concepts/conversion-first-design' },
      { label: 'What Should a Homepage Include?', href: '/answers/what-should-a-homepage-include' },
      { label: 'Our Work', href: '/work' },
    ],
  },
  {
    slug: 'lead-generation-through-web-design',
    title: 'Lead Generation Through Web Design',
    shortDescription: 'How to design your website to systematically turn visitors into enquiries, bookings, and leads.',
    body: [
      'A website that doesn\'t generate leads is a cost centre. A website designed for lead generation is a sales asset. The difference is not the technology or the design style — it is the strategic intent behind every decision.',
      'The lead generation funnel for a service business website: (1) Traffic acquisition — people find the site through Google (organic SEO), referrals, or paid ads. (2) First impression — the above-the-fold content must communicate value and credibility within 3 seconds. (3) Problem recognition — the page must confirm that it understands the visitor\'s specific situation. (4) Trust building — social proof, case studies, and credentials establish authority. (5) Action — a clear, low-friction CTA converts interest into a lead.',
      'Friction is the enemy of lead generation. Friction includes: slow page speed (abandonment before the page loads), confusing navigation (can\'t find what they need), unclear messaging (don\'t know if you can solve their problem), too many choices (decision paralysis), complex forms (demands too much effort), and lack of trust signals (not safe enough to share contact details).',
      'High-converting lead generation pages have a few things in common: a single focused offer, social proof visible without scrolling, a short form (name + email + one question), and a clear low-risk next step (free consultation, free quote, free audit). They do not have: multiple competing CTAs, long navigation menus, slow load times, or copy that describes the business rather than the visitor\'s problem.',
      'The most effective organic lead generation strategy for service businesses is content-led: create Answers pages that rank for specific questions your ideal clients search. "How much does a website cost?" "Do I need SEO?" "What is the best website platform for restaurants?" These pages attract in-market visitors and convert at higher rates than generic homepage traffic.',
    ],
    relatedPages: [
      { label: 'Lead Generation', href: '/glossary/lead-generation' },
      { label: 'CTA', href: '/glossary/cta' },
      { label: 'Trust Engineering', href: '/concepts/trust-engineering' },
      { label: 'Conversion-First Design', href: '/concepts/conversion-first-design' },
      { label: 'How to Get More Leads From Your Website', href: '/answers/how-to-get-more-leads-from-your-website' },
    ],
  },
  {
    slug: 'nextjs-for-business-websites',
    title: 'Next.js for Business Websites',
    shortDescription: 'Why modern service businesses should use Next.js instead of WordPress — the technical case in plain English.',
    body: [
      'Next.js is a React-based web framework developed by Vercel. It has become the leading technology choice for high-performance business websites because it solves the three biggest problems with traditional website platforms: speed, SEO, and maintainability.',
      'Speed: Next.js generates pages as static HTML at build time (or server-side at request time), served via a global CDN. There is no database query, no PHP execution, no plugin overhead. A Next.js page loads in under 100ms from cache. A WordPress page with 15 plugins can take 2–5 seconds. Speed is not just a user experience issue — it is a conversion issue. Each additional second of load time reduces conversions by approximately 7%.',
      'SEO: Next.js supports server-side rendering (SSR) and incremental static regeneration (ISR) — meaning every page is fully rendered HTML when it arrives at the browser. Search engine crawlers can read the full content without executing JavaScript. WordPress with client-rendered plugins can present empty shells to crawlers. Next.js also integrates natively with schema markup, sitemap generation, and the Metadata API for clean, programmatic SEO.',
      'Maintainability: A Next.js codebase is version-controlled, type-safe (TypeScript), and component-based. It does not have the security vulnerability surface area of WordPress (no plugin ecosystem to patch, no admin login page to brute-force). Updates are deployed via Git. There is no plugin compatibility matrix to manage.',
      'The tradeoff: Next.js requires a developer to build and maintain. You cannot drag-and-drop content like WordPress. For businesses that need to update content frequently, a headless CMS (like Sanity or Contentful) can be connected to Next.js to provide a content editing interface while retaining all the performance benefits.',
    ],
    relatedPages: [
      { label: 'Next.js', href: '/glossary/next-js' },
      { label: 'Page Speed', href: '/glossary/page-speed' },
      { label: 'Core Web Vitals', href: '/glossary/core-web-vitals' },
      { label: 'WordPress vs Custom-Coded', href: '/blog/wordpress-vs-custom-coded-website' },
      { label: 'Our Services', href: '/services' },
    ],
  },
  {
    slug: 'mobile-first-approach',
    title: 'Mobile-First Web Design',
    shortDescription: 'Why starting with the smallest screen produces better websites — and what mobile-first actually means in practice.',
    body: [
      'Mobile-first design is a methodology where the design and development process starts with the smallest screen (mobile) and progressively enhances the experience for larger screens. It is a philosophical shift from the legacy approach of designing for desktop and then scaling down for mobile.',
      'Why mobile-first? Over 60% of global web traffic now comes from mobile devices. In some industries (restaurants, local services, retail) that figure is over 70%. Google uses mobile-first indexing — meaning it crawls and ranks your site based on the mobile version. A site that looks great on desktop but is clunky on mobile will underperform in both user experience and SEO.',
      'Mobile-first in practice means: (1) Designing the layout for a 375px wide screen first, then adding breakpoints for tablet and desktop. (2) Starting with the most essential content — mobile forces prioritisation. (3) Touch-first interactions — buttons large enough to tap, no hover-only interactions. (4) Performance as a constraint — mobile users are often on slower connections, so every kilobyte matters. (5) Vertical layouts that stack logically — not cramped sidebar-heavy desktop layouts squeezed down.',
      'The content hierarchy benefit: designing mobile-first forces you to prioritise ruthlessly. If your headline, sub-headline, and CTA don\'t fit above the fold on a 375px screen, you need clearer messaging — not smaller font. The discipline of mobile-first produces better information architecture for all screen sizes.',
      'At CrftdWeb, every project is built mobile-first. We design in Figma starting with mobile frames and build in Next.js with Tailwind CSS, where mobile styles are the default and desktop overrides are added with responsive prefixes.',
    ],
    relatedPages: [
      { label: 'Responsive Design', href: '/glossary/responsive-design' },
      { label: 'Mobile-First', href: '/glossary/mobile-first' },
      { label: 'UX Design', href: '/glossary/ux-design' },
      { label: 'Core Web Vitals', href: '/glossary/core-web-vitals' },
    ],
  },
];

export function getConceptBySlug(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}

export function getAllConceptSlugs(): string[] {
  return concepts.map((c) => c.slug);
}
