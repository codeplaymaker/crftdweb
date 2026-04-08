import { NextRequest, NextResponse } from 'next/server';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

const PSI_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export async function POST(req: NextRequest) {
  const authResult = await verifyRepAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const targetUrl = parsedUrl.toString();

    // Run both mobile and desktop audits in parallel
    const [mobileRes, desktopRes] = await Promise.all([
      fetch(`${PSI_API}?url=${encodeURIComponent(targetUrl)}&strategy=mobile&category=performance&category=accessibility&category=seo&category=best-practices`),
      fetch(`${PSI_API}?url=${encodeURIComponent(targetUrl)}&strategy=desktop&category=performance&category=accessibility&category=seo&category=best-practices`),
    ]);

    if (!mobileRes.ok || !desktopRes.ok) {
      const err = await (mobileRes.ok ? desktopRes : mobileRes).json();
      return NextResponse.json(
        { error: err?.error?.message || 'PageSpeed API error' },
        { status: 502 },
      );
    }

    const [mobileData, desktopData] = await Promise.all([mobileRes.json(), desktopRes.json()]);

    const extractScores = (data: Record<string, unknown>) => {
      const cats = (data as { lighthouseResult?: { categories?: Record<string, { score?: number }> } }).lighthouseResult?.categories || {};
      return {
        performance: Math.round((cats.performance?.score ?? 0) * 100),
        accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
        bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
      };
    };

    const extractMetrics = (data: Record<string, unknown>) => {
      const audits = (data as { lighthouseResult?: { audits?: Record<string, { displayValue?: string; numericValue?: number }> } }).lighthouseResult?.audits || {};
      return {
        fcp: audits['first-contentful-paint']?.displayValue || '—',
        lcp: audits['largest-contentful-paint']?.displayValue || '—',
        tbt: audits['total-blocking-time']?.displayValue || '—',
        cls: audits['cumulative-layout-shift']?.displayValue || '—',
        speedIndex: audits['speed-index']?.displayValue || '—',
        interactive: audits['interactive']?.displayValue || '—',
      };
    };

    const extractOpportunities = (data: Record<string, unknown>) => {
      const audits = (data as { lighthouseResult?: { audits?: Record<string, { score?: number | null; title?: string; description?: string; displayValue?: string }> } }).lighthouseResult?.audits || {};
      return Object.values(audits)
        .filter((a) => a.score !== undefined && a.score !== null && a.score < 1 && a.title && a.description)
        .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
        .slice(0, 8)
        .map((a) => ({
          title: a.title,
          description: a.description?.split('[')[0]?.trim() || '',
          displayValue: a.displayValue || '',
        }));
    };

    return NextResponse.json({
      url: targetUrl,
      mobile: {
        scores: extractScores(mobileData),
        metrics: extractMetrics(mobileData),
        opportunities: extractOpportunities(mobileData),
      },
      desktop: {
        scores: extractScores(desktopData),
        metrics: extractMetrics(desktopData),
        opportunities: extractOpportunities(desktopData),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 });
  }
}
