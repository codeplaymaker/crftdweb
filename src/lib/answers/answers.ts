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
    shortAnswer: 'Cheap sites cost more. They just bill you later.',
    fullAnswer: 'A custom-coded business website costs between £1,500 and £6,000. The range depends on pages, features, and integrations. A 5-7 page site for a small business sits at £1,500 to £3,000. A full-service site with booking systems, product pages, or client portals runs £3,000 to £6,000. Web apps and membership platforms start at £6,000 and scale up. Every project includes design, development, SEO setup, schema markup, and a 90+ PageSpeed guarantee. Hosting is separate. Vercel costs around £15 per month. Content writing is not included.',
    relatedAnswers: ['how-long-does-it-take-to-build-a-website', 'what-is-a-good-pagespeed-score', 'what-should-a-homepage-include'],
    relatedPages: [{ label: 'Website Cost Guide', href: '/services/website-cost' }, { label: 'Our Services', href: '/services' }, { label: 'FAQ', href: '/faq' }],
  },
  {
    slug: 'how-long-does-it-take-to-build-a-website',
    question: 'How long does it take to build a website?',
    shortAnswer: '14 days for standard projects. Content ready on day one, live by day fourteen.',
    fullAnswer: 'Standard custom websites take 14 days from kick-off to launch. Day 1-2 is discovery and strategy. Day 3-6 is design and client review. Day 7-12 is development. Day 13-14 is testing and launch. Complex projects take 3-6 weeks. Web apps, membership platforms, multi-language sites, and e-commerce builds fall in that range. The limiting factor is almost always client feedback speed and content delivery. Projects with content provided upfront hit the 14-day mark consistently.',
    relatedAnswers: ['how-much-does-a-website-cost', 'what-should-a-homepage-include', 'do-i-need-seo'],
    relatedPages: [{ label: 'Our Process', href: '/about' }, { label: 'Start a Project', href: '/contact' }],
  },
  {
    slug: 'what-is-a-good-pagespeed-score',
    question: 'What is a good Google PageSpeed score?',
    shortAnswer: '90 is the floor. Below 50 is the problem.',
    fullAnswer: 'Google PageSpeed Insights scores on a 0-100 scale. 90-100 is Good. 50-89 Needs Improvement. 0-49 is Poor. Aim for 90 minimum on both desktop and mobile. Mobile score matters more. Google uses it for ranking. WordPress sites with themes and plugins typically score 40-65. Custom Next.js sites consistently hit 90-98. Every CrftdWeb project is built to reach 90 as a minimum. Not a target. A requirement.',
    relatedAnswers: ['how-to-speed-up-a-slow-website', 'what-is-technical-seo', 'do-i-need-seo'],
    relatedPages: [{ label: 'Core Web Vitals', href: '/glossary/core-web-vitals' }, { label: 'Page Speed', href: '/glossary/page-speed' }, { label: 'Our Services', href: '/services' }],
  },
  {
    slug: 'do-i-need-seo',
    question: 'Do I need SEO for my website?',
    shortAnswer: 'Your site exists. SEO decides if anyone sees it.',
    fullAnswer: 'Yes. SEO makes your site visible in search results. Without it, you have a site nobody finds. Technical SEO covers heading structure, page speed, schema markup, sitemap, and meta descriptions. It should be built in from day one. Not retrofitted. Content SEO means keyword-targeted blog posts, answers, and landing pages. It compounds over time. Local SEO targets searches like "web designer near me". Critical for service businesses. Every CrftdWeb project includes the technical foundation by default.',
    relatedAnswers: ['what-is-technical-seo', 'what-is-a-good-pagespeed-score', 'how-much-does-a-website-cost'],
    relatedPages: [{ label: 'SEO', href: '/glossary/seo' }, { label: 'Schema Markup', href: '/glossary/schema-markup' }, { label: 'Our Services', href: '/services' }],
  },
  {
    slug: 'what-is-technical-seo',
    question: 'What is technical SEO?',
    shortAnswer: 'Great content on a broken foundation ranks nowhere.',
    fullAnswer: 'Technical SEO is everything search engines check before they read your content. Speed and Core Web Vitals. Mobile-friendliness. HTTPS. Clean URL structure. Canonical tags to prevent duplicate content. A sitemap.xml so Google knows every page. Robots.txt to control crawler access. Schema markup to give context, not just text. Internal linking. No broken links or broken redirects. Technical SEO is the foundation. Content SEO is what builds on top. Get the foundation wrong and nothing else matters.',
    relatedAnswers: ['do-i-need-seo', 'what-is-a-good-pagespeed-score', 'how-much-does-a-website-cost'],
    relatedPages: [{ label: 'SEO', href: '/glossary/seo' }, { label: 'Schema Markup', href: '/glossary/schema-markup' }, { label: 'Sitemap', href: '/glossary/sitemap' }],
  },
  {
    slug: 'what-should-a-homepage-include',
    question: 'What should a homepage include?',
    shortAnswer: 'One offer. One CTA. Everything else is noise.',
    fullAnswer: 'A high-converting homepage has a clear order. First: a headline that states what you do and who you do it for. Second: a subheadline with your key differentiator. Third: a single primary CTA. Fourth: social proof near the top. Ratings, logos, a testimonial. Fifth: your core service offering. Sixth: credibility signals. Case studies, portfolio images. Seventh: a second CTA or contact section. The homepage is not a brochure. Every section answers one question in the visitor\'s mind. Then moves them forward. Confusion is conversion death.',
    relatedAnswers: ['how-much-does-a-website-cost', 'how-long-does-it-take-to-build-a-website', 'do-i-need-seo'],
    relatedPages: [{ label: 'CTA', href: '/glossary/cta' }, { label: 'Hero Section', href: '/glossary/hero-section' }, { label: 'Social Proof', href: '/glossary/social-proof' }, { label: 'Our Work', href: '/work' }],
  },
  {
    slug: 'how-to-speed-up-a-slow-website',
    question: 'How do I speed up a slow website?',
    shortAnswer: 'Compress images. Cut plugins. Use a CDN. Or rebuild in Next.js.',
    fullAnswer: 'Start with images. Convert to WebP format. This alone cuts page weight by 60-70%. Remove unused JavaScript and CSS. WordPress plugins are the biggest culprit here. Add a CDN so files load from servers near the user. Enable lazy loading for images below the fold. Minimise render-blocking resources. Enable browser caching. Upgrade to a performant host like Vercel or Netlify. If you are on WordPress with multiple plugins, the most effective fix is a rebuild in Next.js. It hits 90+ PageSpeed by default. Not by configuration.',
    relatedAnswers: ['what-is-a-good-pagespeed-score', 'what-is-technical-seo', 'do-i-need-seo'],
    relatedPages: [{ label: 'Core Web Vitals', href: '/glossary/core-web-vitals' }, { label: 'Page Speed', href: '/glossary/page-speed' }, { label: 'WordPress vs Custom-Coded', href: '/blog/wordpress-vs-custom-coded-website' }],
  },
  {
    slug: 'what-is-ui-ux-design',
    question: 'What is UI/UX design?',
    shortAnswer: 'UI is how it looks. UX is whether it works.',
    fullAnswer: 'UI design is the visual layer. Buttons, typography, colour, spacing, layout. UX design is the strategic layer. How information is organised. How users navigate. Where friction exists and how to remove it. How a visitor moves from first click to conversion. UI determines how it looks. UX determines whether it works. Both matter. Beautiful design with broken UX produces low conversion. Sound UX with weak UI erodes trust before anyone reads a word. The best sites get both right.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-reduce-bounce-rate', 'what-is-a-good-pagespeed-score'],
    relatedPages: [{ label: 'UX Design', href: '/glossary/ux-design' }, { label: 'UI Design', href: '/glossary/ui-design' }, { label: 'Our Services', href: '/services' }],
  },
  {
    slug: 'how-to-reduce-bounce-rate',
    question: 'How do I reduce my website\'s bounce rate?',
    shortAnswer: 'Faster speed, clearer headlines, content that matches what they searched.',
    fullAnswer: 'Speed first. Every extra second of load time increases bounce rate by around 20%. Next, match intent. If someone clicked your link expecting X and you show them Y, they leave. Your headline and opening line must communicate value immediately. Add internal links so visitors have somewhere logical to go next. Make the CTA obvious and single. Fix mobile usability. One note: not all bounces are bad. A visitor who reads your contact page in full and calls you will register as a bounce. Context matters more than the number.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-speed-up-a-slow-website', 'what-is-ui-ux-design'],
    relatedPages: [{ label: 'Bounce Rate', href: '/glossary/bounce-rate' }, { label: 'Core Web Vitals', href: '/glossary/core-web-vitals' }],
  },
  {
    slug: 'how-to-get-more-leads-from-your-website',
    question: 'How do I get more leads from my website?',
    shortAnswer: 'Fix the headline. Add social proof above the fold. Make the next step obvious.',
    fullAnswer: 'Start with the headline. One sentence that states what you do, who you do it for, and what makes you different. Add social proof above the fold. A star rating, a testimonial, a logo strip. One primary CTA per page. Not three. Dedicated landing pages for each service or audience. Trust signals throughout: case studies, results, guarantees. Speed up the site. Every second costs leads. Add a contact form or booking widget to the page itself, not just the contact page. Create FAQ content that captures people researching your services before they are ready to buy.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-reduce-bounce-rate', 'do-i-need-seo'],
    relatedPages: [{ label: 'Lead Generation', href: '/glossary/lead-generation' }, { label: 'Social Proof', href: '/glossary/social-proof' }, { label: 'Our Work', href: '/work' }],
  },
  {
    slug: 'what-is-a-landing-page',
    question: 'What is a landing page?',
    shortAnswer: 'One page. One goal. No distractions.',
    fullAnswer: 'A landing page is a standalone page with a single conversion goal. No navigation. No footer links. Nothing to click except the one action you want the visitor to take. Book a call. Download a resource. Buy the product. Landing pages are used in paid ad campaigns where every click costs money. You match the page content to the exact ad the visitor came from. Conversion-optimised landing pages have a strong headline, benefit-focused copy, social proof, and a single prominent CTA. That is the entire formula.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-to-get-more-leads-from-your-website', 'how-much-does-a-website-cost'],
    relatedPages: [{ label: 'Landing Page', href: '/glossary/landing-page' }, { label: 'CTA', href: '/glossary/cta' }, { label: 'Conversion Rate', href: '/glossary/conversion-rate' }],
  },
  {
    slug: 'how-to-measure-website-success',
    question: 'How do I measure website success?',
    shortAnswer: 'Conversion rate, organic traffic, leads generated. In that order.',
    fullAnswer: 'The most important metric is conversion rate. What percentage of visitors take your desired action. Enquiry, booking, purchase. After that: organic search traffic. How many people find you through Google. Then bounce rate and session duration. How long people stay and how many pages they read. PageSpeed score. Number of leads or enquiries per month. Cost per lead if you run paid ads. Use Google Analytics 4 for on-site tracking. Google Search Console for search data. Focus on the metrics that connect directly to revenue. Vanity metrics are not a business.',
    relatedAnswers: ['do-i-need-seo', 'how-to-get-more-leads-from-your-website', 'how-to-reduce-bounce-rate'],
    relatedPages: [{ label: 'Conversion Rate', href: '/glossary/conversion-rate' }, { label: 'Heatmap', href: '/glossary/heat-map' }, { label: 'Split Testing', href: '/glossary/split-testing' }],
  },
  {
    slug: 'what-is-responsive-design',
    question: 'What is responsive web design?',
    shortAnswer: 'One site. Every screen. No separate mobile version.',
    fullAnswer: 'Responsive design means the layout adapts to the screen size automatically. Mobile, tablet, laptop, large monitor. One codebase. Flexible grids, scalable images, CSS media queries. It is not a separate mobile site. It is one site that responds to the available space. Google shifted to mobile-first indexing in 2019. Non-responsive sites are penalised in rankings. Over 60% of web traffic is now mobile. In restaurants, local services, and retail it is closer to 70-80%. Every site CrftdWeb builds is responsive by default. Built mobile-first, then scaled up.',
    relatedAnswers: ['what-is-ui-ux-design', 'do-i-need-seo', 'what-is-a-good-pagespeed-score'],
    relatedPages: [{ label: 'Responsive Design', href: '/glossary/responsive-design' }, { label: 'Mobile-First', href: '/glossary/mobile-first' }],
  },
  {
    slug: 'what-is-a-landing-page-guide',
    question: 'What makes a good landing page?',
    shortAnswer: 'One headline. One offer. One button. Nothing else.',
    fullAnswer: 'A good landing page removes everything that is not the conversion. No navigation. No competing CTAs. No tangents. The headline states the offer. The copy explains the benefit, not the feature. Social proof proves the claim. One button closes the loop. Landing pages are used in paid campaigns where every click has a cost. You cannot afford distraction. Conversion rate is the only metric that matters. A landing page that loads in under 1.5 seconds and makes the offer unmissable will outperform a beautifully designed page that makes the visitor think.',
    relatedAnswers: ['what-should-a-homepage-include', 'how-much-does-a-website-cost', 'how-to-get-more-leads-from-your-website'],
    relatedPages: [{ label: 'Landing Page', href: '/glossary/landing-page' }, { label: 'Conversion Rate', href: '/glossary/conversion-rate' }, { label: 'Conversion-First Design', href: '/concepts/conversion-first-design' }],
  },
  {
    slug: 'should-i-use-wordpress-or-custom-code',
    question: 'Should I use WordPress or a custom-coded website?',
    shortAnswer: 'WordPress looks cheaper. The bill comes later.',
    fullAnswer: 'WordPress powers 43% of websites. It is easy to manage, has thousands of plugins, and lets non-technical users update content. The cost appears low. The real cost shows up later. Plugin bloat makes pages slow. Slow pages lose rankings and conversions. A plugin ecosystem means a vulnerability surface. Theme constraints mean your site looks like everyone else on the same theme. Custom-coded sites built in Next.js load in under 100ms from cache. They score 95+ on PageSpeed. They are built to your exact design. No plugin dependencies. No hacked login pages. For businesses where performance and conversion matter, custom code is the better investment.',
    relatedAnswers: ['how-much-does-a-website-cost', 'how-long-does-it-take-to-build-a-website', 'what-is-a-good-pagespeed-score'],
    relatedPages: [{ label: 'Next.js', href: '/glossary/next-js' }, { label: 'WordPress vs Custom-Coded Website', href: '/blog/wordpress-vs-custom-coded-website' }, { label: 'Next.js for Business Websites', href: '/concepts/nextjs-for-business-websites' }],
  },
  {
    slug: 'how-do-i-improve-my-google-rankings',
    question: 'How do I improve my Google rankings?',
    shortAnswer: 'Speed, schema, content, backlinks. In that order.',
    fullAnswer: 'Rankings improve across three levels. Technical SEO is the foundation. Fast load times, Core Web Vitals, mobile-friendliness, HTTPS, clean URLs, XML sitemap, schema markup. Get this right first. On-page SEO is the content layer. Quality content targeting specific keywords in titles, headings, and meta descriptions. Answer the questions your customers are searching. Off-page SEO is authority. Backlinks from reputable sites in your industry. For local businesses, Google Business Profile and local citations are also critical. A well-built site handles the technical layer automatically. That frees you to focus on content.',
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
