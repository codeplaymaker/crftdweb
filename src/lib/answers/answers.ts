export interface Answer {
  slug: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  relatedAnswers: string[];
  relatedPages: { label: string; href: string }[];
}

export const answers: Answer[] = [
  {
    slug: 'how-much-does-a-website-cost',
    question: 'How much does a website cost?',
    shortAnswer: 'A custom-coded business website typically costs between £1,500 and £6,000 depending on size and features.',
    fullAnswer: 'A custom-coded business website typically costs between £1,500 and £6,000 depending on the number of pages, custom functionality, and integrations required. A simple 5-7 page site for a small business usually falls in the £1,500–£3,000 range. A full service business website with industry-specific features (booking systems, product pages, client portals) is typically £3,000–£6,000. Complex web applications or membership platforms with user authentication start at £6,000 and can go significantly higher. These prices include design, development, SEO setup, schema markup, and a 90+ PageSpeed guarantee. They do not include ongoing hosting (Vercel charges approximately £15/month) or content writing.',
    relatedAnswers: ['how-long-does-it-take-to-build-a-website', 'what-is-a-good-pagespeed-score', 'what-should-a-homepage-include'],
    relatedPages: [{ label: 'Website Cost Guide', href: '/services/website-cost' }, { label: 'Our Services', href: '/services' }, { label: 'FAQ', href: '/faq' }],
  },
  {
    slug: 'how-long-does-it-take-to-build-a-website',
    question: 'How long does it take to build a website?',
    shortAnswer: 'A custom website takes 14 days for standard projects. Complex sites with custom features take 3–6 weeks.',
    fullAnswer: 'A standard custom website takes 14 days from project kick-off to launch. This timeline covers: Day 1–2 (discovery and strategy), Day 3–6 (design and client review), Day 7–12 (development), Day 13–14 (testing and launch). For more complex projects — web applications, membership platforms, multi-language sites, or e-commerce builds — the timeline is typically 3–6 weeks. The limiting factor is usually client response time on feedback and content delivery. Projects with all content provided upfront consistently hit the 14-day deadline.',
    relatedAnswers: ['how-much-does-a-website-cost', 'what-should-a-homepage-include', 'do-i-need-seo'],
    relatedPages: [{ label: 'Our Process', href: '/about' }, { label: 'Start a Project', href: '/contact' }],
  },
  {
    slug: 'what-is-a-good-pagespeed-score',
    question: 'What is a good Google PageSpeed score?',
    shortAnswer: 'A score of 90+ is "Good". 50–89 is "Needs Improvement". Below 50 is "Poor".',
    fullAnswer: 'Google PageSpeed Insights scores pages on a 0–100 scale. Scores are categorised as: 90–100 "Good" (green), 50–89 "Needs Improvement" (amber), 0–49 "Poor" (red). For business websites, you should aim for a minimum score of 90 on both desktop and mobile. The mobile score is more important as it is what Google primarily uses for ranking. Most WordPress sites built with themes and plugins score in the 40–65 range. Custom-coded Next.js sites consistently achieve 90–98. Every CrftdWeb project is built to hit 90+ as a minimum requirement.',
    relatedAnswers: ['how-to-speed-up-a-slow-website', 'what-is-technical-seo', 'do-i-need-seo'],
    relatedPages: [{ label: 'Core Web Vitals', href: '/glossary/core-web-vitals' }, { label: 'Page Speed', href: '/glossary/page-speed' }, { label: 'Our Services', href: '/services' }],
  },
  {
    slug: 'do-i-need-seo',
    question: 'Do I need SEO for my website?',
    shortAnswer: 'Yes. If you want your website to be found by people searching for your services, you need SEO built in from day one.',
    fullAnswer: 'Yes. SEO (Search Engine Optimisation) is the practice of making your website visible in search engine results. Without it, your site exists but people cannot find it through Google. For business websites, technical SEO (proper heading structure, fast page speed, schema markup, sitemap, meta descriptions) should be built in from day one — not added later. This is standard in every CrftdWeb project. Content SEO (writing keyword-targeted blog posts, answer pages, and landing pages) is an ongoing effort that compounds over time. Local SEO — optimising for location-based searches like "web designer near me" — is especially important for service businesses.',
    relatedAnswers: ['what-is-technical-seo', 'what-is-a-good-pagespeed-score', 'how-much-does-a-website-cost'],
    relatedPages: [{ label: 'SEO', href: '/glossary/seo' }, { label: 'Schema Markup', href: '/glossary/schema-markup' }, { label: 'Our Services', href: '/services' }],
  },
  {
    slug: 'what-is-technical-seo',
    question: 'What is technical SEO?',
    shortAnswer: 'Technical SEO covers the behind-the-scenes setup that allows search engines to crawl, index, and rank your site correctly.',
    fullAnswer: 'Technical SEO covers all the behind-the-scenes configuration that allows search engines to crawl, index, and rank your website correctly. It includes: site speed and Core Web Vitals, mobile-friendliness, HTTPS security, proper URL structure, canonical tags (to avoid duplicate content), sitemap.xml (so Google knows all your pages), robots.txt (controlling crawler access), structured data/schema markup (giving context to search engines), internal linking structure, and fixing broken links and redirects. Technical SEO is the foundation that all other SEO effort depends on. A site with great content but poor technical SEO will underperform.',
    relatedAnswers: ['do-i-need-seo', 'what-is-a-good-pagespeed-score', 'how-much-does-a-website-cost'],
    relatedPages: [{ label: 'SEO', href: '/glossary/seo' }, { label: 'Schema Markup', href: '/glossary/schema-markup' }, { label: 'Sitemap', href: '/glossary/sitemap' }],
  },
  {
    slug: 'what-should-a-homepage-include',
    question: 'What should a homepage include?',
    shortAnswer: 'A homepage needs: a clear headline, a sub-headline, social proof, your core service, and a call-to-action — all above the fold.',
    fullAnswer: 'A high-converting homepage should include, in order of priority: (1) A clear headline that states what you do and who you do it for — above the fold. (2) A sub-headline that explains your key differentiator or biggest benefit. (3) A primary call-to-action (e.g., "Get a Free Quote" or "Book a Call"). (4) Social proof near the top — star ratings, client logos, or a key testimonial. (5) A brief description of your core service offering. (6) Visual credibility signals — case study previews, portfolio images. (7) A secondary CTA or contact section. The homepage is not a brochure. Every section should answer one question in the visitor\'s mind and move them toward taking action.',
    relatedAnswers: ['how-much-does-a-website-cost', 'how-long-does-it-take-to-build-a-website', 'do-i-need-seo'],
    relatedPages: [{ label: 'CTA', href: '/glossary/cta' }, { label: 'Hero Section', href: '/glossary/hero-section' }, { label: 'Social Proof', href: '/glossary/social-proof' }, { label: 'Our Work', href: '/work' }],
  },
  {
    slug: 'how-to-speed-up-a-slow-website',
    question: 'How do I speed up a slow website?',
    shortAnswer: 'The top fixes are: compress images, switch to a faster framework (Next.js), remove unused plugins, and use a CDN.',
    fullAnswer: 'To speed up a slow website: (1) Compress and convert images to WebP format — this alone can cut page weight by 60–70%. (2) Remove unused JavaScript and CSS — WordPress plugins are a major culprit. (3) Use a Content Delivery Network (CDN) to serve files from servers near the user. (4) Enable lazy loading for images below the fold. (5) Minimise render-blocking resources. (6) Use browser caching. (7) Upgrade your hosting to a performant provider (Vercel, Netlify, or a modern VPS). If your site is built on WordPress with multiple plugins, the most effective fix is often to rebuild it in a modern framework like Next.js, which achieves 90+ PageSpeed scores by default.',
    relatedAnswers: ['what-is-a-good-pagespeed-score', 'what-is-technical-seo', 'do-i-need-seo'],
    relatedPages: [{ label: 'Core Web Vitals', href: '/glossary/core-web-vitals' }, { label: 'Page Speed', href: '/glossary/page-speed' }, { label: 'WordPress vs Custom-Coded', href: '/blog/wordpress-vs-custom-coded-website' }],
  },
  {
    slug: 'what-is-ui-ux-design',
    question: 'What is UI/UX design?',
    shortAnswer: 'UI is how a website looks. UX is how it works and how it guides users toward a goal.',
    fullAnswer: 'UI (User Interface) design is the visual craft of designing the elements users see and interact with — buttons, typography, colour, spacing, and layout. UX (User Experience) design is the strategic discipline of designing the overall experience of using a product — how information is organised, how users navigate, how friction is removed, and how users are guided from first visit to desired action. The two work together: UX determines what needs to exist and why; UI determines how it looks and feels. For business websites, both matter: beautiful design without sound UX produces low conversion rates; functional UX without good UI design erodes trust.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-reduce-bounce-rate', 'what-is-a-good-pagespeed-score'],
    relatedPages: [{ label: 'UX Design', href: '/glossary/ux-design' }, { label: 'UI Design', href: '/glossary/ui-design' }, { label: 'Our Services', href: '/services' }],
  },
  {
    slug: 'how-to-reduce-bounce-rate',
    question: 'How do I reduce my website\'s bounce rate?',
    shortAnswer: 'Faster page speed, clearer headlines, and content that matches search intent are the top fixes.',
    fullAnswer: 'To reduce bounce rate: (1) Improve page speed — slow sites drive users away immediately (each additional second of load time increases bounce rate by ~20%). (2) Ensure content matches what users expected when they clicked your link — mismatched intent is a primary cause of bounces. (3) Improve the above-the-fold content — your headline and opening paragraph must communicate value instantly. (4) Add internal links so visitors can easily navigate to related content. (5) Make your call-to-action clear and prominent. (6) Ensure mobile usability is excellent. Note: not all bounces are bad — a visitor who reads your entire contact page and then calls you will register as a "bounce" even though they converted perfectly.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-speed-up-a-slow-website', 'what-is-ui-ux-design'],
    relatedPages: [{ label: 'Bounce Rate', href: '/glossary/bounce-rate' }, { label: 'Core Web Vitals', href: '/glossary/core-web-vitals' }],
  },
  {
    slug: 'how-to-get-more-leads-from-your-website',
    question: 'How do I get more leads from my website?',
    shortAnswer: 'Fix your headline, add social proof above the fold, and make the next step obvious with a single strong CTA.',
    fullAnswer: 'To get more leads from your website: (1) Clarify your headline — it should state what you do, who you do it for, and what makes you different in one sentence. (2) Add social proof above the fold — a star rating, a key testimonial, or a "trusted by" logo strip. (3) Make the CTA obvious — one primary action per page. (4) Create dedicated landing pages for specific services or audiences. (5) Add trust signals throughout — case studies, before/after results, certifications, guarantees. (6) Speed up the site — every second of load time reduces leads. (7) Add a contact form or booking widget to the page, not just the contact page. (8) Create FAQ content to capture search traffic from people researching your services.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-reduce-bounce-rate', 'do-i-need-seo'],
    relatedPages: [{ label: 'Lead Generation', href: '/glossary/lead-generation' }, { label: 'Social Proof', href: '/glossary/social-proof' }, { label: 'Our Work', href: '/work' }],
  },
  {
    slug: 'what-is-a-landing-page',
    question: 'What is a landing page?',
    shortAnswer: 'A landing page is a standalone page with a single conversion goal — no distractions, no nav, just one action.',
    fullAnswer: 'A landing page is a standalone web page designed with a single, focused conversion goal. Unlike homepage or service pages, landing pages typically remove navigation and footer links to eliminate distractions and direct all visitor attention to one action — such as booking a call, downloading a resource, or making a purchase. Landing pages are commonly used for paid advertising campaigns, where you want to match the page content precisely to the ad the visitor clicked. Conversion-optimised landing pages include: a strong headline, benefit-focused copy, social proof, and a single prominent CTA.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-get-more-leads-from-your-website', 'how-much-does-a-website-cost'],
    relatedPages: [{ label: 'Landing Page', href: '/glossary/landing-page' }, { label: 'CTA', href: '/glossary/cta' }, { label: 'Conversion Rate', href: '/glossary/conversion-rate' }],
  },
  {
    slug: 'how-to-measure-website-success',
    question: 'How do I measure website success?',
    shortAnswer: 'Measure conversion rate, organic traffic, bounce rate, PageSpeed score, and enquiries/leads generated.',
    fullAnswer: 'The key metrics for measuring website success are: (1) Conversion rate — what percentage of visitors take your desired action (enquiry, booking, purchase). This is the most important metric for business websites. (2) Organic search traffic — how many people find your site through Google. (3) Bounce rate — how many people leave after one page. (4) Average session duration — how long people stay. (5) PageSpeed score — your Core Web Vitals performance. (6) Number of leads/enquiries generated per month. (7) Cost per lead (if you are running paid ads). Use Google Analytics 4 for tracking and Google Search Console for organic search data. Focus on revenue-correlated metrics first.',
    relatedAnswers: ['do-i-need-seo', 'how-to-get-more-leads-from-your-website', 'how-to-reduce-bounce-rate'],
    relatedPages: [{ label: 'Conversion Rate', href: '/glossary/conversion-rate' }, { label: 'Heatmap', href: '/glossary/heat-map' }, { label: 'Split Testing', href: '/glossary/split-testing' }],
  },
  {
    slug: 'what-is-responsive-design',
    question: 'What is responsive web design?',
    shortAnswer: 'Responsive design means the website layout adapts automatically to fit any screen size — mobile, tablet, or desktop.',
    fullAnswer: 'Responsive web design is an approach where the website layout, images, and content adapt fluidly to different screen sizes and orientations. A responsive site looks and works correctly on a mobile phone, tablet, laptop, and large monitor — using flexible grids, scalable images, and CSS media queries. Responsive design is not the same as having a "mobile version" of your site. It is one codebase that responds to the available screen space. Since Google\'s shift to mobile-first indexing in 2019, a non-responsive site is penalised in search rankings. Every website CrftdWeb builds is responsive by default — built mobile-first.',
    relatedAnswers: ['what-is-ui-ux-design', 'do-i-need-seo', 'what-is-a-good-pagespeed-score'],
    relatedPages: [{ label: 'Responsive Design', href: '/glossary/responsive-design' }, { label: 'Mobile-First', href: '/glossary/mobile-first' }],
  },
  {
    slug: 'what-is-a-landing-page',
    question: 'What is a landing page?',
    shortAnswer: 'A landing page is a standalone web page designed with a single goal — to convert visitors into leads or customers.',
    fullAnswer: 'A landing page is a dedicated web page created specifically to convert visitors into leads or customers. Unlike regular website pages that encourage exploration, a landing page has a single focused call-to-action (CTA) — such as booking a call, signing up for a newsletter, or purchasing a product. Landing pages remove navigation distractions, focus on benefits over features, use social proof to build credibility, and guide the visitor toward one specific action. They are typically used in paid advertising campaigns (Google Ads, Facebook Ads) or email marketing to maximise conversion rates from traffic.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-much-does-a-website-cost', 'how-to-get-more-leads-from-your-website'],
    relatedPages: [{ label: 'Landing Page', href: '/glossary/landing-page' }, { label: 'Conversion Rate', href: '/glossary/conversion-rate' }, { label: 'Conversion-First Design', href: '/concepts/conversion-first-design' }],
  },
  {
    slug: 'should-i-use-wordpress-or-custom-code',
    question: 'Should I use WordPress or a custom-coded website?',
    shortAnswer: 'WordPress is easier to manage yourself, but custom code is faster, more secure, and better for conversion.',
    fullAnswer: 'The right choice depends on your priorities. WordPress is a popular CMS that powers 43% of websites — it is easy to manage, has thousands of plugins, and allows non-technical users to update content. However, WordPress sites are frequently slower (due to plugin bloat), more vulnerable to security attacks, and rely on themes that limit custom design. Custom-coded websites (built with frameworks like Next.js) load significantly faster (which improves SEO and conversion rates), are built exactly to your design requirements, and have no plugin dependency vulnerabilities. At CrftdWeb, we build custom-coded websites in Next.js — resulting in 95+ PageSpeed scores that WordPress templates cannot match. For most businesses focused on performance and conversion, custom code is the better long-term investment.',
    relatedAnswers: ['how-much-does-a-website-cost', 'how-long-does-it-take-to-build-a-website', 'what-is-a-good-pagespeed-score'],
    relatedPages: [{ label: 'Next.js', href: '/glossary/next-js' }, { label: 'WordPress vs Custom-Coded Website', href: '/blog/wordpress-vs-custom-coded-website' }, { label: 'Next.js for Business Websites', href: '/concepts/nextjs-for-business-websites' }],
  },
  {
    slug: 'how-do-i-improve-my-google-rankings',
    question: 'How do I improve my Google rankings?',
    shortAnswer: 'Improve page speed, add schema markup, create quality content, build backlinks, and fix technical SEO issues.',
    fullAnswer: 'Improving Google rankings requires addressing three areas: technical SEO, on-page SEO, and off-page SEO. Technical SEO means ensuring your site loads fast (Core Web Vitals), is mobile-friendly, uses HTTPS, has a clean URL structure, proper XML sitemap, and schema markup. On-page SEO means creating high-quality, relevant content that targets specific keywords in your titles, headings, and meta descriptions. Off-page SEO means earning backlinks from reputable websites in your industry. For local businesses, Google Business Profile optimisation and local citations are also critical. A well-built website handles the technical foundation automatically — letting you focus on creating content that answers your customers\' questions.',
    relatedAnswers: ['do-i-need-seo', 'what-is-technical-seo', 'what-is-a-good-pagespeed-score'],
    relatedPages: [{ label: 'SEO', href: '/glossary/seo' }, { label: 'Technical SEO', href: '/glossary/technical-seo' }, { label: 'Schema Markup', href: '/glossary/schema-markup' }],
  },
];

export function getAnswerBySlug(slug: string): Answer | undefined {
  return answers.find((a) => a.slug === slug);
}

export function getAllAnswerSlugs(): string[] {
  return answers.map((a) => a.slug);
}
