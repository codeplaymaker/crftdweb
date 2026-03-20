// ── Blog Post Data ─────────────────────────────────────────────────────
// Add new posts here. They render at /blog/[slug].
// No CMS needed — just add an object and deploy.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: 'Case Study' | 'Guide' | 'Insight' | 'Comparison';
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  content: BlogSection[];
}

export interface BlogSection {
  type: 'heading' | 'paragraph' | 'stat' | 'quote' | 'list' | 'image' | 'cta';
  text?: string;
  items?: string[];
  stats?: { label: string; value: string }[];
  src?: string;
  alt?: string;
  caption?: string;
  author?: string;
  role?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'microbiome-design-case-study',
    title: 'How We Rebuilt a Science Company\'s Website and Transformed Their Online Presence',
    description:
      'Microbiome Design had groundbreaking science but a website that looked like a student project. Here\'s how we fixed it.',
    date: '2026-03-20',
    category: 'Case Study',
    readTime: '5 min read',
    metaTitle: 'Case Study: Microbiome Design Website Redesign | CrftdWeb',
    metaDescription:
      'How CrftdWeb rebuilt Microbiome Design\'s website with custom code, conversion-focused design, and 95+ PageSpeed. Full case study with results.',
    content: [
      {
        type: 'heading',
        text: 'The Problem',
      },
      {
        type: 'paragraph',
        text: 'Microbiome Design is a cutting-edge company doing real science in the microbiome space. They work with researchers, investors, and partners — but their website looked like a student project. Investors weren\'t taking them seriously, and the site did nothing to communicate the quality of their work.',
      },
      {
        type: 'paragraph',
        text: 'Their existing site was built on a free template with generic stock imagery, slow load times, and no clear path for visitors to take action. For a company seeking investment and research partnerships, this was costing them credibility every single day.',
      },
      {
        type: 'heading',
        text: 'Our Approach',
      },
      {
        type: 'paragraph',
        text: 'We started with a full discovery session to understand their three core audiences: researchers, investors, and potential partners. Each group has different questions and different trust signals they need to see.',
      },
      {
        type: 'list',
        items: [
          'Mapped the decision journey for each audience segment',
          'Rebuilt the site around credibility signals and clear value propositions',
          'Designed a conversion-focused layout that guides visitors to specific CTAs',
          'Custom-coded in Next.js for sub-1.5s load times',
          'Added proper SEO foundations and structured data',
        ],
      },
      {
        type: 'heading',
        text: 'The Results',
      },
      {
        type: 'stat',
        stats: [
          { label: 'PageSpeed Score', value: '97' },
          { label: 'Load Time', value: '1.2s' },
          { label: 'Bounce Rate Drop', value: '-42%' },
        ],
      },
      {
        type: 'paragraph',
        text: 'The new site matches the quality of their science. It gives investors confidence from the first click, clearly communicates their research capabilities, and provides clear paths for each audience to take the next step.',
      },
      {
        type: 'quote',
        text: 'The site finally represents who we actually are. It\'s the first thing we send to potential investors now.',
        author: 'Microbiome Design',
        role: 'Founder',
      },
      {
        type: 'cta',
        text: 'Want results like this for your business?',
      },
    ],
  },
  {
    slug: 'life-lab-hq-case-study',
    title: 'How The Life Lab HQ Turned Casual Browsers Into Engaged Members',
    description:
      'The Life Lab HQ had great content but visitors left without signing up. We rebuilt their conversion funnel from scratch.',
    date: '2026-03-18',
    category: 'Case Study',
    readTime: '4 min read',
    metaTitle: 'Case Study: The Life Lab HQ Membership Platform | CrftdWeb',
    metaDescription:
      'How CrftdWeb rebuilt The Life Lab HQ\'s website to convert visitors into members. AI-powered, conversion-optimised, and custom-coded.',
    content: [
      {
        type: 'heading',
        text: 'The Problem',
      },
      {
        type: 'paragraph',
        text: 'The Life Lab HQ is a lifestyle and wellness brand with expertise, content, and a loyal audience. But their website had one major issue: people browsed and left without ever signing up. The site didn\'t guide anyone to take action.',
      },
      {
        type: 'paragraph',
        text: 'There was no clear conversion funnel. Visitors landed on the homepage, read a few things, and bounced. The membership sign-up was buried three clicks deep with no compelling reason to commit.',
      },
      {
        type: 'heading',
        text: 'Our Approach',
      },
      {
        type: 'paragraph',
        text: 'We mapped the entire customer journey from first visit to sign-up. Every page was rebuilt around a single conversion goal with friction removed at each decision point.',
      },
      {
        type: 'list',
        items: [
          'Redesigned the homepage with a clear value proposition above the fold',
          'Added trust signals (testimonials, social proof) at every decision point',
          'Built a frictionless sign-up flow — 3 clicks from landing to member',
          'Integrated AI-powered content recommendations to increase engagement',
          'Mobile-first responsive design for the 68% of traffic from phones',
        ],
      },
      {
        type: 'heading',
        text: 'The Results',
      },
      {
        type: 'stat',
        stats: [
          { label: 'Sign-up Conversion', value: '+340%' },
          { label: 'Avg. Session Duration', value: '+2.4min' },
          { label: 'Mobile Conversion', value: '+180%' },
        ],
      },
      {
        type: 'paragraph',
        text: 'The platform now turns casual visitors into engaged members. The clear path from landing to sign-up, combined with strategic trust signals, transformed the business\'s online revenue.',
      },
      {
        type: 'cta',
        text: 'Ready to turn your visitors into customers?',
      },
    ],
  },
  {
    slug: 'wordpress-vs-custom-coded-website',
    title: 'WordPress vs Custom-Coded Website: Which Is Right for Your Business in 2026?',
    description:
      'An honest comparison of WordPress and custom-coded websites. Speed, cost, SEO, security, and long-term ROI — no bias, just data.',
    date: '2026-03-15',
    category: 'Comparison',
    readTime: '7 min read',
    metaTitle: 'WordPress vs Custom Website (2026) | Honest Comparison Guide',
    metaDescription:
      'WordPress vs custom-coded website: speed, cost, SEO, security compared. Honest guide with real data to help you choose the right option for your business.',
    content: [
      {
        type: 'heading',
        text: 'The Honest Truth',
      },
      {
        type: 'paragraph',
        text: 'WordPress powers 43% of the web. It\'s the most popular CMS in the world. But popular doesn\'t always mean best. The right choice depends entirely on what your website needs to DO for your business.',
      },
      {
        type: 'paragraph',
        text: 'This isn\'t a hit piece on WordPress — it\'s a genuine comparison based on real data. We\'ve built sites on both platforms and have seen what works (and what doesn\'t) for different types of businesses.',
      },
      {
        type: 'heading',
        text: 'Speed & Performance',
      },
      {
        type: 'paragraph',
        text: 'This is where the gap is largest. The average WordPress site loads in 4.7 seconds on mobile. A custom-coded Next.js site loads in under 1.5 seconds. That\'s not a marginal difference — Google\'s research shows 53% of mobile visitors leave a site that takes longer than 3 seconds to load.',
      },
      {
        type: 'stat',
        stats: [
          { label: 'WordPress Avg. Load', value: '4.7s' },
          { label: 'Custom Code Avg. Load', value: '1.2s' },
          { label: 'Visitors Lost at 3s+', value: '53%' },
        ],
      },
      {
        type: 'paragraph',
        text: 'WordPress is slow because of its architecture: every page request hits a PHP server, queries a MySQL database, loads 20-50 plugins, and renders the page dynamically. Custom-coded sites can be pre-rendered at build time and served from a CDN edge — no server processing at all.',
      },
      {
        type: 'heading',
        text: 'Cost Comparison',
      },
      {
        type: 'paragraph',
        text: 'WordPress seems cheaper upfront, but the total cost of ownership tells a different story:',
      },
      {
        type: 'list',
        items: [
          'WordPress: £1,000-5,000 build + £50-200/month hosting + £100-500/year plugins + £50-200/month maintenance = £3,000-8,000 in year one',
          'Custom-coded: £2,500-10,000 build + £0/month hosting (Vercel free tier) + £0/year plugins + £0/month maintenance = £2,500-10,000 total, with near-zero ongoing costs',
          'By year 2, the custom site is cheaper. By year 3, it\'s significantly cheaper.',
        ],
      },
      {
        type: 'heading',
        text: 'SEO',
      },
      {
        type: 'paragraph',
        text: 'Google uses Core Web Vitals as a direct ranking signal. These measure loading speed (LCP), interactivity (INP), and visual stability (CLS). Custom-coded sites consistently score 90-100 on these metrics. WordPress sites average 50-70 — and that\'s a meaningful ranking disadvantage.',
      },
      {
        type: 'paragraph',
        text: 'Both platforms can implement proper meta tags, structured data, and sitemaps. The difference is in the performance metrics that Google actually measures.',
      },
      {
        type: 'heading',
        text: 'Security',
      },
      {
        type: 'paragraph',
        text: 'WordPress is the #1 target for hackers because of its popularity and plugin ecosystem. 90% of hacked CMS sites in 2025 were WordPress. Plugins are the main attack vector — each one is a potential vulnerability that needs regular updates.',
      },
      {
        type: 'paragraph',
        text: 'Custom-coded static sites have virtually zero attack surface. There\'s no database to hack, no admin panel to brute-force, and no plugins to exploit. The site is just HTML, CSS, and JavaScript served from a CDN.',
      },
      {
        type: 'heading',
        text: 'When to Use WordPress',
      },
      {
        type: 'list',
        items: [
          'You need to publish content daily and want non-technical staff to edit it',
          'You need e-commerce with 1,000+ products (WooCommerce)',
          'Budget is under £2,000 and you need something functional fast',
          'You need a specific plugin that doesn\'t exist elsewhere',
        ],
      },
      {
        type: 'heading',
        text: 'When to Go Custom',
      },
      {
        type: 'list',
        items: [
          'Your website is your primary source of leads or customers',
          'Speed and Google ranking matter to your business',
          'You want a site that stands out from competitors using the same templates',
          'You\'re tired of plugin updates breaking things',
          'You want minimal ongoing costs and maximum long-term value',
        ],
      },
      {
        type: 'heading',
        text: 'The Verdict',
      },
      {
        type: 'paragraph',
        text: 'WordPress is a great tool for certain use cases. But for most service businesses where the website needs to generate leads and build credibility, a custom-coded site delivers better performance, better SEO, lower long-term costs, and zero security headaches.',
      },
      {
        type: 'cta',
        text: 'Want to see what a custom-coded site could do for your business?',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
