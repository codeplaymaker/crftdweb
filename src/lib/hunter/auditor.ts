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
export async function auditWebsite(url: string): Promise<AuditData> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  // Run PageSpeed + Screenshot in parallel
  const [pageSpeed, screenshotUrl] = await Promise.all([
    runPageSpeed(normalizedUrl, apiKey),
    captureScreenshot(normalizedUrl),
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
      { signal: AbortSignal.timeout(7000) },  // 7s — must fit within Vercel 10s limit
    );
    const data: LighthouseAudit = await res.json();

    if (data.error || !data.lighthouseResult) {
      return fallbackAudit();
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
    return fallbackAudit();
  }
}

function fallbackAudit(): Omit<AuditData, 'screenshotUrl'> {
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
