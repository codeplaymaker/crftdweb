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
      'Most web design agencies build beautiful websites. Conversion-first design builds websites that work. One gets you awards. The other gets you clients.',
      'The distinction sounds obvious. In practice, most websites are built the wrong way around. The designer starts with mood boards. The developer starts with components. Nobody starts with the question: what action do we need visitors to take, and what is stopping them?',
      'Conversion-first design starts with one question before any visual work begins: what is the single most important action a visitor should take on this page? Every decision that follows serves that answer. Layout, copy, imagery, spacing. All of it.',
      'One primary CTA per page. Multiple options create decision paralysis. Pick the action that matters most and design the whole page toward it.',
      'Value above the fold. Visitors decide in three seconds. Your headline, sub-headline, and CTA must all appear before they touch the scroll.',
      'Social proof near the top. Testimonials, star ratings, and client logos reduce perceived risk before your visitor has read a single claim.',
      'Structure the page in order: outcome first, process second, evidence third. Lead with what they get. Follow with how it works. Close with proof.',
      'Remove distractions. Every navigation link not essential to the conversion is a leak in your funnel.',
      'The most common mistakes: too many CTAs, homepage copy that talks about the business instead of the visitor\'s problem, no social proof, stock photography that erodes trust instead of building it, and load times slow enough to lose visitors before they read a word.',
      'Conversion-first design is not about being salesy. It is about being clear. A visitor who understands what you offer, why it is right for them, and what to do next converts. A confused visitor leaves.',
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
      'The three metrics are Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift. Each one measures a different aspect of how the page feels to a real person. Not a lab test. Not a synthetic benchmark. Observed experience.',
      'Largest Contentful Paint (LCP) measures loading speed. How long does it take for the largest visible element to render? Target: under 2.5 seconds. Slow LCPs are usually caused by render-blocking JavaScript, large unoptimised images, or slow server response times.',
      'Interaction to Next Paint (INP) measures interactivity. How quickly does the page respond when someone clicks, taps, or types? Target: under 200ms. A high INP is usually heavy JavaScript blocking the main thread.',
      'Cumulative Layout Shift (CLS) measures visual stability. Does the page move unexpectedly while loading? Target: below 0.1. Layout shifts are caused by images without set dimensions, late-loading ads, or dynamically injected content.',
      'Why do Core Web Vitals matter beyond rankings? Because they measure real friction. A page that shifts while someone is trying to tap a button loses the tap. A page that takes 4 seconds to load loses the visitor. A page that doesn\'t respond to input loses trust. Google is measuring what users already know and feel.',
      'Most businesses do not know their Core Web Vitals scores. The businesses that do, and that consistently score in the "Good" range, have a compounding advantage: lower bounce rates, better rankings, and higher conversion rates. All from the same investment.',
      'Measure your Core Web Vitals with Google PageSpeed Insights, Google Search Console, or Chrome DevTools. All three metrics must be in the "Good" range to pass the assessment. Custom Next.js sites consistently achieve this. WordPress sites with plugins often do not.',
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
      'Trust is the invisible gatekeeper between a visit and a conversion. A visitor may want exactly what you offer, understand the price, have the budget — and still leave. The website did not make them feel safe. Trust engineering is the process of deliberately designing credibility into every touchpoint.',
      'Social proof does the work no copy can. Real testimonials with names and roles. Review counts, not just star averages. Client logos. Case study results with specific numbers. "Our clients love us" is not social proof. "Jane Smith increased sign-ups by 340% in 60 days" is.',
      'Transparency builds confidence faster than any marketing claim. Clear pricing. Clear process. Clear timelines. Hiding information signals there is something to hide. Showing it signals you have nothing to fear.',
      'Vague claims erode credibility. "We deliver results" means nothing. "97 PageSpeed score" means something. Specificity is evidence. The more precise the claim, the more trustworthy the person making it.',
      'Risk reversal removes the last objection. Free consultations. Fixed-price quotes. Itemised scope documents before any money changes hands. The prospect wants to say yes. Give them a safe way to do it.',
      'Design is trust before a visitor reads a word. A slow site says you do not care about their time. A template says you are not serious about your business. Inconsistent design says no one is checking. First impressions happen before you get to sell.',
      'Trust is also built through content. A detailed post that solves a real problem builds more credibility than any testimonial. A glossary that defines industry terms signals expertise. A transparent pricing guide signals confidence. Answer pages that address objections directly signal honesty.',
      'For local service businesses, location-specific signals matter. A physical address. A local phone number. Google reviews linked with schema. "We have worked with 12 dental practices across London" is more credible than "we work with businesses across the UK". Specificity is credibility.',
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
      'Most business owners think about websites in terms of design. How it looks. Whether it is modern. Whether it matches the brand. These things matter. But they are visible to the visitor after the page loads. Speed determines whether the visitor sees the page at all.',
      'Speed: Next.js generates pages as static HTML at build time, served from a global CDN. No database query. No PHP execution. No plugin overhead. A Next.js page loads in under 100ms from cache. A WordPress page with 15 plugins can take 2-5 seconds. Speed is not a user experience issue. It is a conversion issue. Each additional second of load time costs around 7% of your conversions.',
      'SEO: Next.js supports server-side rendering and static generation. Every page arrives at the browser as complete HTML. Search engine crawlers read the full content immediately, without executing JavaScript. WordPress with client-rendered plugins can send crawlers empty shells. Next.js integrates natively with schema markup, sitemap generation, and the Metadata API.',
      'Maintainability: A Next.js codebase is version-controlled, typed with TypeScript, and component-based. No plugin ecosystem to patch. No admin login page to brute-force. Deploy via Git. No compatibility matrix to manage.',
      'Security is a structural advantage, not a feature. WordPress has a massive plugin ecosystem. Every plugin is a potential attack vector. Every plugin author is a potential weak link. 90% of hacked CMS sites run WordPress. Next.js static sites have no database, no admin panel, no plugin layer. There is nothing to exploit.',
      'The tradeoff: Next.js requires a developer to build and maintain. You cannot drag-and-drop content like WordPress. For businesses that update content frequently, a headless CMS like Sanity or Contentful connects to Next.js and gives you a content editing interface without giving up any of the performance.',
      'For businesses that want their website to rank, convert, and stay fast over time, Next.js is the right tool. Templates and page builders trade performance for convenience. The cost shows up in your rankings and your bounce rate.',
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
