export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDefinition: string;
  definition: string;
  relatedTerms: string[];
  relatedPages: { label: string; href: string }[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'conversion-rate',
    term: 'Conversion Rate',
    shortDefinition: 'The percentage of website visitors who complete a desired action.',
    definition: 'Conversion rate is the percentage of website visitors who complete a desired action — such as filling out a contact form, making a purchase, or booking an appointment. It is calculated by dividing conversions by total visitors and multiplying by 100. A typical business website conversion rate is 2–5%. High-performing conversion-optimised sites can reach 10%+.',
    relatedTerms: ['cta', 'landing-page', 'bounce-rate', 'split-testing'],
    relatedPages: [{ label: 'Conversion-First Design', href: '/concepts/conversion-first-design' }],
  },
  {
    slug: 'core-web-vitals',
    term: 'Core Web Vitals',
    shortDefinition: 'Google\'s three key metrics for measuring page experience: LCP, INP, and CLS.',
    definition: 'Core Web Vitals are a set of real-world performance metrics defined by Google that measure the user experience of a web page. The three metrics are: Largest Contentful Paint (LCP), which measures loading speed; Interaction to Next Paint (INP), which measures interactivity; and Cumulative Layout Shift (CLS), which measures visual stability. Google uses Core Web Vitals as a ranking signal.',
    relatedTerms: ['page-speed', 'lcp', 'cls'],
    relatedPages: [{ label: 'Core Web Vitals Explained', href: '/concepts/core-web-vitals-explained' }, { label: 'How to Speed Up a Slow Website', href: '/answers/how-to-speed-up-a-slow-website' }],
  },
  {
    slug: 'bounce-rate',
    term: 'Bounce Rate',
    shortDefinition: 'The percentage of visitors who leave after viewing only one page.',
    definition: 'Bounce rate is the percentage of sessions in which a user leaves a website after viewing only one page without taking any action. A high bounce rate (above 70%) can indicate poor user experience, slow load times, irrelevant content, or a mismatch between the page and what the user expected. A low bounce rate suggests visitors are engaging with your content. Industry average bounce rates vary: blogs typically see 70–90%, service businesses 40–60%.',
    relatedTerms: ['conversion-rate', 'page-speed', 'ux-design'],
    relatedPages: [{ label: 'How to Reduce Bounce Rate', href: '/answers/how-to-reduce-bounce-rate' }],
  },
  {
    slug: 'above-the-fold',
    term: 'Above the Fold',
    shortDefinition: 'The portion of a web page visible without scrolling.',
    definition: 'Above the fold refers to the portion of a web page that is visible to a user without scrolling. The term originates from newspaper publishing, where the most important stories appeared on the top half of a folded broadsheet. In web design, the above-the-fold area is critical for capturing attention, communicating value, and driving conversions. Effective above-the-fold sections include a clear headline, sub-heading, and a primary call-to-action.',
    relatedTerms: ['hero-section', 'cta', 'conversion-rate'],
    relatedPages: [{ label: 'Above the Fold Design', href: '/concepts/above-the-fold-design' }],
  },
  {
    slug: 'cta',
    term: 'Call-to-Action (CTA)',
    shortDefinition: 'A design element that directs users to take a specific action.',
    definition: 'A call-to-action (CTA) is a prompt — usually a button, link, or form — that directs a website visitor to take a specific action. Common examples include "Get a Free Quote", "Book a Call", "Download the Guide", or "Start Your Free Trial". Effective CTAs are clear, action-oriented, and positioned prominently in the user\'s flow. The number and placement of CTAs significantly impacts conversion rate.',
    relatedTerms: ['conversion-rate', 'landing-page', 'hero-section'],
    relatedPages: [{ label: 'What Should a Homepage Include', href: '/answers/what-should-a-homepage-include' }],
  },
  {
    slug: 'ux-design',
    term: 'UX Design',
    shortDefinition: 'The process of designing products that are useful, usable, and enjoyable.',
    definition: 'User Experience (UX) design is the process of creating products that provide meaningful, relevant, and enjoyable experiences to users. In web design, UX design covers information architecture, user flows, wireframing, usability testing, and the overall journey from first visit to conversion. Good UX design reduces friction, guides users toward goals, and increases customer satisfaction. UX design is distinct from UI design, which focuses on the visual interface.',
    relatedTerms: ['ui-design', 'wireframe', 'conversion-rate'],
    relatedPages: [{ label: 'What is UI/UX Design', href: '/answers/what-is-ui-ux-design' }],
  },
  {
    slug: 'ui-design',
    term: 'UI Design',
    shortDefinition: 'The design of the visual elements users interact with on a screen.',
    definition: 'User Interface (UI) design is the craft of designing the visual elements that users interact with on a digital product — buttons, icons, typography, colours, spacing, and layout. Good UI design is visually appealing, consistent, and aligned with the brand. UI design works alongside UX design: UX determines what needs to exist and why; UI determines how it looks and feels.',
    relatedTerms: ['ux-design', 'wireframe', 'white-space'],
    relatedPages: [{ label: 'What is UI/UX Design', href: '/answers/what-is-ui-ux-design' }],
  },
  {
    slug: 'seo',
    term: 'SEO (Search Engine Optimisation)',
    shortDefinition: 'The practice of improving a website\'s visibility in search engine results.',
    definition: 'Search Engine Optimisation (SEO) is the practice of improving a website\'s visibility in organic (non-paid) search engine results. SEO covers three main areas: technical SEO (site speed, crawlability, structured data), on-page SEO (content, headings, meta tags), and off-page SEO (backlinks, authority). For local businesses, local SEO — optimising for location-based searches — is particularly important.',
    relatedTerms: ['schema-markup', 'meta-description', 'sitemap', 'page-speed'],
    relatedPages: [{ label: 'Do I Need SEO?', href: '/answers/do-i-need-seo' }, { label: 'What is Technical SEO', href: '/answers/what-is-technical-seo' }],
  },
  {
    slug: 'page-speed',
    term: 'Page Speed',
    shortDefinition: 'How quickly a web page loads and becomes interactive.',
    definition: 'Page speed refers to how quickly a web page loads, renders, and becomes interactive for a user. It is measured by Google PageSpeed Insights using a 0–100 scoring system. Scores above 90 are considered "Good". Page speed affects user experience, conversion rate (each second of delay reduces conversions by ~7%), and SEO rankings. Key factors affecting page speed include image optimisation, JavaScript execution, server response time, and code efficiency.',
    relatedTerms: ['core-web-vitals', 'bounce-rate', 'next-js'],
    relatedPages: [{ label: 'What is a Good PageSpeed Score?', href: '/answers/what-is-a-good-pagespeed-score' }, { label: 'How to Speed Up a Slow Website', href: '/answers/how-to-speed-up-a-slow-website' }],
  },
  {
    slug: 'responsive-design',
    term: 'Responsive Design',
    shortDefinition: 'A design approach where layout adapts to different screen sizes.',
    definition: 'Responsive web design is an approach where a website\'s layout, images, and content adapt fluidly to different screen sizes and orientations — desktop, tablet, and mobile. A responsive site uses flexible grids, fluid images, and CSS media queries to provide an optimal viewing experience on every device. With over 60% of web traffic coming from mobile devices, responsive design is a baseline requirement, not an optional feature.',
    relatedTerms: ['mobile-first', 'ux-design', 'core-web-vitals'],
    relatedPages: [{ label: 'What is Responsive Design?', href: '/answers/what-is-responsive-design' }],
  },
  {
    slug: 'wireframe',
    term: 'Wireframe',
    shortDefinition: 'A low-fidelity blueprint of a web page\'s layout and structure.',
    definition: 'A wireframe is a low-fidelity, schematic representation of a web page that outlines the structure, layout, and content hierarchy without visual design details like colours or fonts. Wireframes are used in the early stages of the design process to plan information architecture, user flows, and page structure. They allow for rapid iteration and stakeholder feedback before expensive visual design work begins.',
    relatedTerms: ['ux-design', 'ui-design', 'site-architecture'],
    relatedPages: [{ label: 'Our Design Process', href: '/about' }],
  },
  {
    slug: 'landing-page',
    term: 'Landing Page',
    shortDefinition: 'A standalone page designed specifically to convert visitors.',
    definition: 'A landing page is a standalone web page designed with a single, focused conversion goal — such as generating leads, selling a product, or collecting email sign-ups. Unlike homepage or service pages, landing pages eliminate distractions (no navigation, no footer links) and direct all visitor attention toward one action. High-converting landing pages have a clear value proposition, social proof, and a prominent call-to-action.',
    relatedTerms: ['conversion-rate', 'cta', 'lead-generation', 'split-testing'],
    relatedPages: [{ label: 'What is a Landing Page?', href: '/answers/what-is-a-landing-page' }],
  },
  {
    slug: 'split-testing',
    term: 'Split Testing (A/B Testing)',
    shortDefinition: 'Testing two versions of a page to see which performs better.',
    definition: 'Split testing, also called A/B testing, is the practice of comparing two versions of a web page (or element) to determine which one achieves a better outcome. One group of visitors sees version A, another sees version B, and performance is measured against a defined goal (e.g., form submissions, clicks, purchases). Split testing removes guesswork and enables data-driven design decisions.',
    relatedTerms: ['conversion-rate', 'landing-page', 'heat-map'],
    relatedPages: [{ label: 'How to Measure Website Success', href: '/answers/how-to-measure-website-success' }],
  },
  {
    slug: 'schema-markup',
    term: 'Schema Markup',
    shortDefinition: 'Structured data code that helps search engines understand your content.',
    definition: 'Schema markup is structured data added to a web page\'s HTML using JSON-LD (or other formats) that provides additional context to search engines about the content on the page. It uses the Schema.org vocabulary and can describe businesses, articles, FAQs, products, events, reviews, and more. Schema markup can trigger rich results in Google Search, such as star ratings, FAQ dropdowns, and breadcrumbs, which increase click-through rates.',
    relatedTerms: ['seo', 'structured-data', 'sitemap'],
    relatedPages: [{ label: 'Schema Markup for Small Business', href: '/concepts/schema-markup-for-small-business' }],
  },
  {
    slug: 'meta-description',
    term: 'Meta Description',
    shortDefinition: 'A 150–160 character summary of a page shown in search results.',
    definition: 'A meta description is an HTML attribute that provides a short summary (typically 150–160 characters) of a web page\'s content. It appears under the page title in search engine results pages (SERPs). While meta descriptions are not a direct Google ranking factor, they significantly influence click-through rate from search results. Effective meta descriptions include the target keyword, communicate the page\'s value, and contain a clear call-to-action.',
    relatedTerms: ['seo', 'sitemap', 'schema-markup'],
    relatedPages: [{ label: 'What is Technical SEO?', href: '/answers/what-is-technical-seo' }],
  },
  {
    slug: 'sitemap',
    term: 'Sitemap',
    shortDefinition: 'A file listing all the pages on a website for search engines.',
    definition: 'A sitemap is a file (usually XML) that lists all the pages, posts, and media on a website and provides metadata about each URL (last modified date, priority, change frequency). Sitemaps help search engine crawlers discover and index your content efficiently. All websites should have a sitemap.xml file submitted to Google Search Console. Next.js can generate sitemaps automatically.',
    relatedTerms: ['seo', 'robots-txt', 'schema-markup'],
    relatedPages: [{ label: 'What is Technical SEO?', href: '/answers/what-is-technical-seo' }],
  },
  {
    slug: 'breadcrumbs',
    term: 'Breadcrumbs',
    shortDefinition: 'Navigation links showing a user\'s location within a website hierarchy.',
    definition: 'Breadcrumbs are a secondary navigation element that shows users their current location within a website\'s hierarchy. For example: Home > Services > Web Design for Restaurants. Breadcrumbs improve user experience by making navigation clearer, and they improve SEO by helping search engines understand site structure. When implemented with BreadcrumbList schema markup, they appear directly in Google search results.',
    relatedTerms: ['seo', 'site-architecture', 'ux-design'],
    relatedPages: [{ label: 'Site Architecture', href: '/concepts/site-architecture' }],
  },
  {
    slug: 'internal-linking',
    term: 'Internal Linking',
    shortDefinition: 'Links between pages on the same website.',
    definition: 'Internal linking refers to hyperlinks that point from one page on a website to another page on the same website. Internal links help users navigate between related content, distribute "link equity" across the site, and help search engine crawlers discover and index all your pages. A well-structured internal link architecture can significantly improve both user experience and SEO performance.',
    relatedTerms: ['seo', 'site-architecture', 'breadcrumbs'],
    relatedPages: [{ label: 'Site Architecture', href: '/concepts/site-architecture' }],
  },
  {
    slug: 'lead-generation',
    term: 'Lead Generation',
    shortDefinition: 'The process of attracting and converting website visitors into potential customers.',
    definition: 'Lead generation is the process of attracting visitors to your website and converting them into potential customers (leads) by capturing their contact information or encouraging them to make an enquiry. Web-based lead generation uses tactics such as contact forms, live chat, free downloads, consultations, and email sign-ups. Effective lead generation design addresses objections, builds trust, and makes the next step obvious.',
    relatedTerms: ['conversion-rate', 'cta', 'landing-page', 'social-proof'],
    relatedPages: [{ label: 'Lead Generation Through Web Design', href: '/concepts/lead-generation-through-web-design' }, { label: 'How to Get More Leads From Your Website', href: '/answers/how-to-get-more-leads-from-your-website' }],
  },
  {
    slug: 'social-proof',
    term: 'Social Proof',
    shortDefinition: 'Evidence that other people trust and value your business.',
    definition: 'Social proof is a psychological principle and a web design pattern where evidence of other people\'s trust or satisfaction is used to influence visitor behaviour. Types of social proof in web design include: testimonials and reviews, case studies, client logos, ratings (e.g., Google star ratings), media mentions, and usage statistics. Social proof reduces perceived risk and increases confidence in making a purchase or enquiry.',
    relatedTerms: ['conversion-rate', 'lead-generation', 'cta'],
    relatedPages: [{ label: 'Trust Engineering', href: '/concepts/trust-engineering' }],
  },
  {
    slug: 'white-space',
    term: 'White Space',
    shortDefinition: 'Empty space between elements that improves readability and focus.',
    definition: 'White space (also called negative space) refers to the empty areas between design elements on a web page — between paragraphs, around images, inside buttons, and between sections. Despite feeling counter-intuitive, generous white space improves readability (by reducing cognitive load), guides attention, and creates a sense of quality and professionalism. Sites with cramped layouts tend to feel overwhelming; well-spaced layouts feel premium.',
    relatedTerms: ['ui-design', 'ux-design', 'hero-section'],
    relatedPages: [],
  },
  {
    slug: 'hero-section',
    term: 'Hero Section',
    shortDefinition: 'The prominent top section of a webpage, designed to capture attention immediately.',
    definition: 'The hero section is the top prominent section of a webpage — the first thing visitors see when the page loads. It typically contains a headline, sub-headline, supporting image or video, and a primary call-to-action. The hero section has the highest impact on conversion rates because it determines whether a visitor stays or leaves. An effective hero section communicates a clear value proposition and answers "why should I stay here?" within 3–5 seconds.',
    relatedTerms: ['above-the-fold', 'cta', 'conversion-rate'],
    relatedPages: [{ label: 'What Should a Homepage Include?', href: '/answers/what-should-a-homepage-include' }],
  },
  {
    slug: 'mobile-first',
    term: 'Mobile-First',
    shortDefinition: 'A design approach that starts with mobile screens before scaling to desktop.',
    definition: 'Mobile-first is a design and development philosophy that starts the design process with the smallest screen size (mobile) and then progressively enhances the experience for larger screens (tablet, desktop). It is the opposite of the traditional approach where desktop designs were scaled down to mobile. Mobile-first ensures the core experience is optimised for the majority of users — over 60% of web traffic now comes from mobile devices.',
    relatedTerms: ['responsive-design', 'core-web-vitals', 'ux-design'],
    relatedPages: [{ label: 'Mobile-First Approach', href: '/concepts/mobile-first-approach' }],
  },
  {
    slug: 'next-js',
    term: 'Next.js',
    shortDefinition: 'A React framework for building high-performance, SEO-friendly websites.',
    definition: 'Next.js is an open-source React framework built by Vercel for creating server-side rendered (SSR) and statically generated websites and web applications. Next.js is the technology stack of choice for high-performance business websites because it offers built-in image optimisation, automatic code splitting, server-side rendering (for SEO), and a file-based routing system. CrftdWeb builds all projects in Next.js.',
    relatedTerms: ['page-speed', 'seo', 'core-web-vitals'],
    relatedPages: [{ label: 'Next.js for Business Websites', href: '/concepts/nextjs-for-business-websites' }, { label: 'WordPress vs Custom-Coded Website', href: '/blog/wordpress-vs-custom-coded-website' }],
  },
  {
    slug: 'heat-map',
    term: 'Heatmap',
    shortDefinition: 'A visual representation of where users click, scroll, and focus on a page.',
    definition: 'A heatmap is a data visualisation tool that shows where users click, scroll, move their mouse, and focus their attention on a web page. Heatmaps are displayed as colour gradations — red/orange for high activity, blue/green for low activity. They provide qualitative insight into user behaviour and are used to identify usability issues, optimise CTAs, and improve page layout. Tools like Hotjar and Microsoft Clarity provide heatmap functionality.',
    relatedTerms: ['ux-design', 'split-testing', 'conversion-rate'],
    relatedPages: [{ label: 'How to Measure Website Success', href: '/answers/how-to-measure-website-success' }],
  },
];

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getAllTermSlugs(): string[] {
  return glossaryTerms.map((t) => t.slug);
}
