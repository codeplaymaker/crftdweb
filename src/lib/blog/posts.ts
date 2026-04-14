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
    title: 'Great Science. Amateur Website. Here\'s What Changed.',
    description:
      'Real science. Student-project website. One of those had to change.',
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
        text: 'Real science. Free template website. That\'s the gap investors saw first.',
      },
      {
        type: 'paragraph',
        text: 'Researchers, investors, partners — all arriving at a site that looked made in an afternoon. Slow. Generic. No clear action to take.',
      },
      {
        type: 'paragraph',
        text: 'Every day the site stayed up, it cost them credibility they couldn\'t see.',
      },
      {
        type: 'heading',
        text: 'The Approach',
      },
      {
        type: 'paragraph',
        text: 'Three audiences. Three sets of questions. One site to answer all of them.',
      },
      {
        type: 'paragraph',
        text: 'Researchers want proof. Investors want confidence. Partners want clarity. The old site gave none of the above.',
      },
      {
        type: 'list',
        items: [
          'Mapped what each audience needs to trust first',
          'Built credibility before the scroll',
          'One goal per page. One action per section',
          'Custom-coded in Next.js. Sub-1.5s load. No templates',
          'SEO foundations built in, not bolted on',
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
        text: 'The site now matches the science.',
      },
      {
        type: 'paragraph',
        text: 'First click: confidence. Next step: clear. Every audience gets what they came for.',
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
    title: 'Visitors Browsed. Nobody Signed Up. Here\'s What Changed.',
    description:
      'Great content. No conversions. The funnel didn\'t exist.',
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
        text: 'Good content. Loyal audience. Zero sign-ups.',
      },
      {
        type: 'paragraph',
        text: 'Visitors arrived, read, and left. No funnel. No reason to stay. The sign-up was three clicks deep with nothing pulling them towards it.',
      },
      {
        type: 'paragraph',
        text: 'Traffic without conversion is just noise.',
      },
      {
        type: 'heading',
        text: 'The Approach',
      },
      {
        type: 'paragraph',
        text: 'One question: what stops someone signing up?',
      },
      {
        type: 'paragraph',
        text: 'Mapped every step from first visit to member. Found friction at each one. Removed it.',
      },
      {
        type: 'list',
        items: [
          'Value proposition above the fold. Not buried',
          'Trust signals at every decision point',
          '3 clicks from landing to member',
          'AI content recommendations to keep people exploring',
          'Mobile-first. 68% of their traffic is from phones',
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
        text: 'Browsers became members.',
      },
      {
        type: 'paragraph',
        text: 'Clear path. Removed friction. Right trust signals in the right place.',
      },
      {
        type: 'paragraph',
        text: 'The audience didn\'t change. The funnel did.',
      },
      {
        type: 'cta',
        text: 'Ready to turn your visitors into customers?',
      },
    ],
  },
  {
    slug: 'wordpress-vs-custom-coded-website',
    title: 'WordPress vs Custom Code: The Honest Comparison No One Gives You',
    description:
      'Speed, cost, SEO, security. No bias. Just the numbers.',
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
        text: '43% of the web runs on WordPress. Popular isn\'t the same as right.',
      },
      {
        type: 'paragraph',
        text: 'The choice isn\'t about platforms. It\'s about what your site needs to do.',
      },
      {
        type: 'paragraph',
        text: 'This isn\'t a hit piece. It\'s a comparison based on building both.',
      },
      {
        type: 'heading',
        text: 'Speed',
      },
      {
        type: 'paragraph',
        text: 'Average WordPress site: 4.7 seconds. Average custom Next.js site: 1.2 seconds.',
      },
      {
        type: 'paragraph',
        text: 'That\'s not a small gap. Google says 53% of visitors leave after 3 seconds.',
      },
      {
        type: 'paragraph',
        text: 'Speed isn\'t a feature. It\'s the product.',
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
        text: 'WordPress: database request, PHP render, 20–50 plugins, dynamic load. Every time.',
      },
      {
        type: 'paragraph',
        text: 'Custom code: pre-built, served from a CDN edge. No server. No wait.',
      },
      {
        type: 'heading',
        text: 'Cost',
      },
      {
        type: 'paragraph',
        text: 'WordPress looks cheaper. The bill comes later.',
      },
      {
        type: 'list',
        items: [
          'WordPress: £3,000–8,000 in year one once you add hosting, plugins, and maintenance',
          'Custom code: build cost only. Hosting free. Plugins none. Maintenance near zero',
          'By year two, custom is cheaper. By year three, it\'s not close',
        ],
      },
      {
        type: 'heading',
        text: 'SEO',
      },
      {
        type: 'paragraph',
        text: 'Core Web Vitals are a direct Google ranking signal.',
      },
      {
        type: 'paragraph',
        text: 'Custom sites: 90–100. WordPress average: 50–70.',
      },
      {
        type: 'paragraph',
        text: 'Both handle meta tags and sitemaps. Only one passes the performance test.',
      },
      {
        type: 'heading',
        text: 'Security',
      },
      {
        type: 'paragraph',
        text: '90% of hacked CMS sites in 2025 were WordPress. Popularity is the vulnerability.',
      },
      {
        type: 'paragraph',
        text: 'Each plugin is an attack surface. Each update is a potential break.',
      },
      {
        type: 'paragraph',
        text: 'Custom static sites have no database, no admin panel, no plugins. Nothing to hack.',
      },
      {
        type: 'heading',
        text: 'Use WordPress When',
      },
      {
        type: 'list',
        items: [
          'Non-technical staff need to publish content daily',
          '1,000+ product e-commerce (WooCommerce)',
          'Budget under £2,000 and speed of launch matters more than performance',
          'You need a specific plugin that exists nowhere else',
        ],
      },
      {
        type: 'heading',
        text: 'Go Custom When',
      },
      {
        type: 'list',
        items: [
          'Your site is your primary source of leads',
          'Speed and search ranking are competitive advantages',
          'Your competitors are using the same template as you',
          'You\'re tired of plugin updates breaking things',
          'Ongoing costs close to zero',
        ],
      },
      {
        type: 'heading',
        text: 'The Verdict',
      },
      {
        type: 'paragraph',
        text: 'WordPress works. For the right use case.',
      },
      {
        type: 'paragraph',
        text: 'For service businesses where the site needs to generate leads: faster performance, better ranking, lower long-term cost, nothing to hack.',
      },
      {
        type: 'paragraph',
        text: 'Custom wins on every metric that matters.',
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
