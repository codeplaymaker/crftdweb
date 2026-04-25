/**
 * Social Listener — Multi-source scanner
 * Sources: Reddit (global + UK subreddits), Hacker News
 * Searches for intent signals ("need a website", etc.)
 * Saves new matches to the `socialLeads` Firestore collection.
 * Called by Vercel cron (daily at 7am) or manually from admin dashboard.
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const CRON_SECRET = process.env.CRON_SECRET;

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (CRON_SECRET && auth === `Bearer ${CRON_SECRET}`) return true;
  const token = req.cookies.get('admin_token')?.value;
  return !!(token && token === process.env.ADMIN_TOKEN);
}

const BOT_UA = 'CrftdWebBot/1.0 (web-agency lead finder; contact admin@crftdweb.com)';

// ─── Reddit ──────────────────────────────────────────────────────────────────

// Global keyword searches (all of Reddit)
const REDDIT_GLOBAL_KEYWORDS = [
  'need a website',
  'looking for a web designer',
  'web developer wanted',
  'need someone to build a website',
  'recommend a web designer',
  'looking for web developer',
  'need a web designer',
  'get a website built',
  'website for my business',
];

// UK-specific subreddit targeted searches
const REDDIT_UK_SEARCHES: Array<{ keyword: string; subreddit: string }> = [
  { keyword: 'website', subreddit: 'ukbusiness' },
  { keyword: 'web designer', subreddit: 'ukbusiness' },
  { keyword: 'website', subreddit: 'AskUK' },
  { keyword: 'web designer', subreddit: 'entrepreneurs' },
  { keyword: 'website', subreddit: 'smallbusiness' },
  { keyword: 'web developer', subreddit: 'forhire' },
  { keyword: 'website design', subreddit: 'forhire' },
];

interface RedditChild {
  data: {
    id: string;
    title: string;
    selftext: string;
    author: string;
    subreddit: string;
    permalink: string;
    created_utc: number;
  };
}

async function searchReddit(query: string): Promise<RedditChild['data'][]> {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=new&t=week&limit=25&type=link`;

  const res = await fetch(url, {
    headers: { 'User-Agent': BOT_UA },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) return [];

  const data = await res.json() as { data?: { children?: RedditChild[] } };
  const posts = (data?.data?.children ?? []).map((c) => c.data);

  // Only keep posts from the last 48 hours
  const cutoff = Date.now() / 1000 - 48 * 60 * 60;
  return posts.filter((p) => p.created_utc > cutoff);
}

// ─── Hacker News ─────────────────────────────────────────────────────────────

const HN_KEYWORDS = [
  'web designer',
  'web developer',
  'need a website',
  'build a website',
];

interface HNHit {
  objectID: string;
  title?: string;
  story_text?: string;
  comment_text?: string;
  author: string;
  created_at: string;
  _tags: string[];
}

async function searchHackerNews(keyword: string): Promise<HNHit[]> {
  // Search last 2 days (numericFilters=created_at_i > unix timestamp)
  const cutoff = Math.floor(Date.now() / 1000) - 48 * 60 * 60;
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(keyword)}&tags=(ask_hn,show_hn)&numericFilters=created_at_i>${cutoff}&hitsPerPage=20`;

  const res = await fetch(url, {
    headers: { 'User-Agent': BOT_UA },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) return [];

  const data = await res.json() as { hits?: HNHit[] };
  return data?.hits ?? [];
}

// ─── Companies House ──────────────────────────────────────────────────────────

// SIC codes to skip: financial holding, property SPVs, dormant
const SKIP_SIC_CODES = new Set([
  '64202', '64205', '64209', '64301', '64302', '64303', '64304', '64305', '64306',
  '64999', '68100', '68201', '68202', '68209', '68320', '98000', '99999',
]);

interface CHCompany {
  company_number: string;
  title: string;
  date_of_creation: string;
  registered_office_address?: {
    postal_code?: string;
    locality?: string;
  };
  sic_codes?: string[];
}

interface CHSearchResponse {
  items?: CHCompany[];
}

interface CHOfficersResponse {
  items?: Array<{
    name: string;
    officer_role: string;
    resigned_on?: string;
  }>;
}

async function scanCompaniesHouse(): Promise<Array<{
  companyNumber: string;
  companyName: string;
  directorName: string | null;
  postcode: string;
  locality: string;
  incorporatedOn: string;
  sicCodes: string[];
}>> {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  if (!apiKey) return [];

  const auth = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
  const fromDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const toDate = new Date().toISOString().split('T')[0];

  // Single query for all Bristol companies — much more efficient than per-postcode loop
  const searchUrl = `https://api.company-information.service.gov.uk/advanced-search/companies?incorporated_from=${fromDate}&incorporated_to=${toDate}&location=Bristol&size=100`;

  const res = await fetch(searchUrl, {
    headers: { Authorization: auth },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) return [];

  const data = await res.json() as CHSearchResponse;
  const companies = data?.items ?? [];

  const results: Awaited<ReturnType<typeof scanCompaniesHouse>> = [];

  for (const company of companies) {
    // Skip if all SIC codes are in the skip list
    const sics = company.sic_codes ?? [];
    if (sics.length > 0 && sics.every((s) => SKIP_SIC_CODES.has(s))) continue;

    // Fetch director name
    let directorName: string | null = null;
    try {
      const officersRes = await fetch(
        `https://api.company-information.service.gov.uk/company/${company.company_number}/officers`,
        { headers: { Authorization: auth }, signal: AbortSignal.timeout(5000) }
      );
      if (officersRes.ok) {
        const officersData = await officersRes.json() as CHOfficersResponse;
        const director = officersData?.items?.find(
          (o) => o.officer_role === 'director' && !o.resigned_on
        );
        if (director) {
          // CH returns names as "SURNAME, Firstname" — normalise
          const parts = director.name.split(',');
          directorName = parts.length >= 2
            ? `${parts[1].trim()} ${parts[0].trim()}`
            : director.name;
        }
      }
    } catch {
      // officer lookup failed — still save the company without director
    }

    results.push({
      companyNumber: company.company_number,
      companyName: company.title,
      directorName,
      postcode: company.registered_office_address?.postal_code ?? '',
      locality: company.registered_office_address?.locality ?? 'Bristol',
      incorporatedOn: company.date_of_creation,
      sicCodes: sics,
    });
  }

  return results;
}

// ─── Save lead helper ─────────────────────────────────────────────────────────

async function saveLead(
  docId: string,
  data: Record<string, unknown>,
  seenIds: Set<string>
): Promise<boolean> {
  if (seenIds.has(docId)) return false;
  seenIds.add(docId);

  const docRef = adminDb.collection('socialLeads').doc(docId);
  const existing = await docRef.get();
  if (existing.exists) return false;

  await docRef.set({ ...data, foundAt: FieldValue.serverTimestamp(), status: 'new' });
  return true;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let newLeads = 0;
  const seenIds = new Set<string>();
  const errors: string[] = [];

  // ── Reddit: global keyword searches ──
  for (const keyword of REDDIT_GLOBAL_KEYWORDS) {
    try {
      const posts = await searchReddit(`"${keyword}"`);
      for (const post of posts) {
        const snippet = post.selftext?.trim()
          ? post.selftext.trim().slice(0, 400)
          : post.title;

        const saved = await saveLead(`reddit_${post.id}`, {
          id: `reddit_${post.id}`,
          source: 'reddit',
          title: post.title,
          snippet,
          url: `https://www.reddit.com${post.permalink}`,
          username: post.author,
          subreddit: post.subreddit,
          postedAt: post.created_utc,
          matchedKeyword: keyword,
          scope: 'global',
        }, seenIds);

        if (saved) newLeads++;
      }
    } catch (err) {
      errors.push(`reddit global "${keyword}": ${err instanceof Error ? err.message : 'failed'}`);
    }
  }

  // ── Reddit: UK subreddit-scoped searches ──
  for (const { keyword, subreddit } of REDDIT_UK_SEARCHES) {
    try {
      const posts = await searchReddit(`${keyword} subreddit:${subreddit}`);
      for (const post of posts) {
        const snippet = post.selftext?.trim()
          ? post.selftext.trim().slice(0, 400)
          : post.title;

        const saved = await saveLead(`reddit_${post.id}`, {
          id: `reddit_${post.id}`,
          source: 'reddit',
          title: post.title,
          snippet,
          url: `https://www.reddit.com${post.permalink}`,
          username: post.author,
          subreddit: post.subreddit,
          postedAt: post.created_utc,
          matchedKeyword: keyword,
          scope: 'uk',
        }, seenIds);

        if (saved) newLeads++;
      }
    } catch (err) {
      errors.push(`reddit r/${subreddit} "${keyword}": ${err instanceof Error ? err.message : 'failed'}`);
    }
  }

  // ── Hacker News ──
  for (const keyword of HN_KEYWORDS) {
    try {
      const hits = await searchHackerNews(keyword);
      for (const hit of hits) {
        const title = hit.title ?? hit.story_text?.slice(0, 100) ?? keyword;
        const snippet = hit.story_text?.slice(0, 400) ?? hit.comment_text?.slice(0, 400) ?? title;
        const postedAt = Math.floor(new Date(hit.created_at).getTime() / 1000);
        const isAsk = hit._tags?.includes('ask_hn');

        const saved = await saveLead(`hn_${hit.objectID}`, {
          id: `hn_${hit.objectID}`,
          source: 'hackernews',
          title,
          snippet,
          url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          username: hit.author,
          subreddit: isAsk ? 'Ask HN' : 'Show HN',
          postedAt,
          matchedKeyword: keyword,
          scope: 'global',
        }, seenIds);

        if (saved) newLeads++;
      }
    } catch (err) {
      errors.push(`hackernews "${keyword}": ${err instanceof Error ? err.message : 'failed'}`);
    }
  }

  // ── Companies House: newly incorporated Bristol businesses ──
  try {
    const chCompanies = await scanCompaniesHouse();
    for (const company of chCompanies) {
      const title = `New Ltd: ${company.companyName}`;
      const directorLine = company.directorName ? `Director: ${company.directorName}. ` : '';
      const snippet = `${directorLine}Incorporated ${company.incorporatedOn}. ${company.locality}, ${company.postcode}. SIC: ${company.sicCodes.join(', ') || 'unknown'}.`;

      const saved = await saveLead(`ch_${company.companyNumber}`, {
        id: `ch_${company.companyNumber}`,
        source: 'companies_house',
        title,
        snippet,
        url: `https://find-and-update.company-information.service.gov.uk/company/${company.companyNumber}`,
        username: company.directorName ?? 'Unknown director',
        subreddit: company.locality,
        postedAt: Math.floor(new Date(company.incorporatedOn).getTime() / 1000),
        matchedKeyword: 'new incorporation',
        scope: 'uk',
        companyNumber: company.companyNumber,
        companyName: company.companyName,
        directorName: company.directorName,
        postcode: company.postcode,
        incorporatedOn: company.incorporatedOn,
        sicCodes: company.sicCodes,
      }, seenIds);

      if (saved) newLeads++;
    }
  } catch (err) {
    errors.push(`companies_house: ${err instanceof Error ? err.message : 'failed'}`);
  }

  return NextResponse.json({ success: true, newLeads, errors });
}
