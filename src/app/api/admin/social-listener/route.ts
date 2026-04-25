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

  return NextResponse.json({ success: true, newLeads, errors });
}
