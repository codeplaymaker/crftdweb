import { NextRequest, NextResponse } from 'next/server';
import { verifyRepAuth } from '@/lib/auth/verifyRepAuth';

export const maxDuration = 60;

const PSI_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const API_KEY = process.env.GOOGLE_PSI_API_KEY || '';

function psiUrl(targetUrl: string, strategy: 'mobile' | 'desktop') {
  const params = new URLSearchParams({
    url: targetUrl,
    strategy,
    ...(API_KEY && { key: API_KEY }),
  });
  ['performance', 'accessibility', 'seo', 'best-practices'].forEach((c) =>
    params.append('category', c),
  );
  return `${PSI_API}?${params}`;
}

export async function POST(req: NextRequest) {
  const authResult = await verifyRepAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { url, strategy = 'mobile' } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    if (strategy !== 'mobile' && strategy !== 'desktop') {
      return NextResponse.json({ error: 'Invalid strategy' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const targetUrl = parsedUrl.toString();

    const res = await fetch(psiUrl(targetUrl, strategy));

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err?.error?.message || 'PageSpeed API error' },
        { status: 502 },
      );
    }

    const data = await res.json();

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
      strategy,
      scores: extractScores(data),
      metrics: extractMetrics(data),
      opportunities: extractOpportunities(data),
    });
  } catch {
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 });
  }
}
