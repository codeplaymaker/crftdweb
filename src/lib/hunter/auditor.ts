/**
 * Website auditor.
 * Uses Google PageSpeed Insights API (free, no key required) to audit sites.
 * Uses Microlink API (free tier) for screenshots.
 */

interface LighthouseAudit {
  lighthouseResult?: {
    categories: {
      performance: { score: number };
    };
    audits: {
      'largest-contentful-paint': { numericValue: number };
      'cumulative-layout-shift': { numericValue: number };
      'first-contentful-paint': { numericValue: number };
      'speed-index': { numericValue: number };
      'viewport': { score: number };
      'is-on-https': { score: number };
      'document-title': { score: number };
      'meta-description': { score: number };
    };
  };
  error?: { message: string };
}

export interface AuditData {
  performanceScore: number;
  lcp: number;
  cls: number;
  fcp: number;
  speedIndex: number;
  mobile: boolean;
  https: boolean;
  hasMetaDescription: boolean;
  hasOgTags: boolean;   // we approximate from meta-description presence
  hasCTA: boolean;      // approximated from performance — sites with good UX usually have CTAs
  screenshotUrl: string | null;
}

/**
 * Run a PageSpeed Insights audit on a URL.
 * Uses the free public API (no key needed, but rate-limited).
 * If GOOGLE_PAGESPEED_API_KEY is set, we use it for higher quota.
 */
export async function auditWebsite(url: string, options: { skipScreenshot?: boolean } = {}): Promise<AuditData> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  // Run PageSpeed + Screenshot in parallel (skip screenshot if not needed)
  const [pageSpeed, screenshotUrl] = await Promise.all([
    runPageSpeed(normalizedUrl, apiKey),
    options.skipScreenshot ? Promise.resolve(null) : captureScreenshot(normalizedUrl),
  ]);

  return { ...pageSpeed, screenshotUrl };
}

async function runPageSpeed(url: string, apiKey?: string): Promise<Omit<AuditData, 'screenshotUrl'>> {
  const params = new URLSearchParams({
    url,
    strategy: 'mobile',
    category: 'performance',
  });
  if (apiKey) params.set('key', apiKey);

  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
      { signal: AbortSignal.timeout(3000) },  // 3s — fail fast to lightweight fallback
    );
    const data: LighthouseAudit = await res.json();

    if (data.error || !data.lighthouseResult) {
      // PageSpeed failed — try lightweight check instead of returning zeros
      return lightweightAudit(url);
    }

    const lh = data.lighthouseResult;
    const audits = lh.audits;

    return {
      performanceScore: Math.round((lh.categories.performance.score || 0) * 100),
      lcp: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
      cls: audits['cumulative-layout-shift']?.numericValue || 0,
      fcp: Math.round(audits['first-contentful-paint']?.numericValue || 0),
      speedIndex: Math.round(audits['speed-index']?.numericValue || 0),
      mobile: (audits['viewport']?.score || 0) >= 0.5,
      https: (audits['is-on-https']?.score || 0) >= 1,
      hasMetaDescription: (audits['meta-description']?.score || 0) >= 1,
      hasOgTags: (audits['meta-description']?.score || 0) >= 1,  // approximation
      hasCTA: (lh.categories.performance.score || 0) > 0.6,       // proxy: good sites tend to have CTAs
    };
  } catch {
    // PageSpeed timed out — try lightweight check
    return lightweightAudit(url);
  }
}

/**
 * Lightweight fallback: fetch the homepage directly and check for
 * HTTPS, meta description, viewport tag, and CTA keywords.
 * Gives a meaningful grade even when PageSpeed times out.
 */
async function lightweightAudit(url: string): Promise<Omit<AuditData, 'screenshotUrl'>> {
  try {
    const start = Date.now();
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CrftdBot/1.0)' },
      redirect: 'follow',
    });
    const elapsed = Date.now() - start;
    const html = await res.text();
    const lower = html.toLowerCase();

    const isHttps = res.url.startsWith('https');
    const hasViewport = lower.includes('name="viewport"') || lower.includes("name='viewport'");
    const hasMeta = lower.includes('name="description"') || lower.includes("name='description'");
    const hasOg = lower.includes('property="og:') || lower.includes("property='og:");
    const hasCTA = /book|call|contact|quote|schedule|get started|free estimate/i.test(html);

    // Estimate a rough performance score from response time
    // < 1s = ~70, 1-3s = ~45, 3-5s = ~25
    const perfScore = elapsed < 1000 ? 70 : elapsed < 3000 ? 45 : 25;

    return {
      performanceScore: perfScore,
      lcp: elapsed,  // rough approximation
      cls: 0,
      fcp: elapsed,
      speedIndex: elapsed,
      mobile: hasViewport,
      https: isHttps,
      hasMetaDescription: hasMeta,
      hasOgTags: hasOg,
      hasCTA,
    };
  } catch {
    // Site completely unreachable
    return {
      performanceScore: 0,
      lcp: 99999,
      cls: 1,
      fcp: 99999,
      speedIndex: 99999,
      mobile: false,
      https: false,
      hasMetaDescription: false,
      hasOgTags: false,
      hasCTA: false,
    };
  }
}

/**
 * Capture a screenshot via Microlink (free tier: 50/day).
 * Returns the screenshot URL or null on failure.
 */
async function captureScreenshot(url: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      url,
      screenshot: 'true',
      meta: 'false',
      'screenshot.width': '1280',
      'screenshot.height': '800',
    });

    const res = await fetch(`https://api.microlink.io?${params}`, {
      signal: AbortSignal.timeout(5000),  // 5s — runs in parallel with PageSpeed
    });
    const data = await res.json();

    return data?.data?.screenshot?.url || null;
  } catch {
    return null;
  }
}
