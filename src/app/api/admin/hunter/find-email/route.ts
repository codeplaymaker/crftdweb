import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

interface HunterFindResponse {
  data?: {
    email?: string;
    score?: number;
    sources?: { uri: string }[];
  };
  errors?: { details: string }[];
}

/**
 * GET /api/admin/hunter/find-email?domain=example.com
 * Uses Hunter.io Email Finder to find the most likely contact email for a domain.
 * Falls back to a guessed info@ address if Hunter.io has no key or no result.
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const domain = req.nextUrl.searchParams.get('domain');
  if (!domain) return NextResponse.json({ error: 'domain required' }, { status: 400 });

  // Normalise domain — strip protocol/path
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');

  const apiKey = process.env.HUNTER_API_KEY;

  if (apiKey) {
    try {
      const url = new URL('https://api.hunter.io/v2/domain-search');
      url.searchParams.set('domain', cleanDomain);
      url.searchParams.set('api_key', apiKey);
      url.searchParams.set('limit', '1');
      url.searchParams.set('type', 'personal');

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) });
      const data = await res.json();

      if (data?.data?.emails?.[0]?.value) {
        return NextResponse.json({
          email: data.data.emails[0].value,
          confidence: data.data.emails[0].confidence,
          source: 'hunter',
        });
      }

      // Try email finder (first/last name not known, use domain search fallback)
      const findUrl = new URL('https://api.hunter.io/v2/email-finder');
      findUrl.searchParams.set('domain', cleanDomain);
      findUrl.searchParams.set('api_key', apiKey);

      const findRes = await fetch(findUrl.toString(), { signal: AbortSignal.timeout(5000) });
      const findData: HunterFindResponse = await findRes.json();

      if (findData?.data?.email) {
        return NextResponse.json({
          email: findData.data.email,
          confidence: findData.data.score,
          source: 'hunter',
        });
      }
    } catch {
      // Fall through to guessed fallback
    }
  }

  // Fallback: guess info@ from domain
  return NextResponse.json({
    email: `info@${cleanDomain}`,
    confidence: null,
    source: 'guessed',
  });
}
