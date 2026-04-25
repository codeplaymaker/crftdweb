/**
 * Social Listener — Reddit Scanner
 * Searches Reddit for intent signals ("need a website", etc.)
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

const KEYWORDS = [
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

async function searchReddit(keyword: string): Promise<RedditChild['data'][]> {
  const url =
    `https://www.reddit.com/search.json?q=${encodeURIComponent(`"${keyword}"`)}&sort=new&t=week&limit=25&type=link`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CrftdWebBot/1.0 (web-agency lead finder; contact admin@crftdweb.com)',
    },
    // 8 second timeout
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) return [];

  const data = await res.json() as { data?: { children?: RedditChild[] } };
  const posts = (data?.data?.children ?? []).map((c) => c.data);

  // Only keep posts from the last 48 hours
  const cutoff = Date.now() / 1000 - 48 * 60 * 60;
  return posts.filter((p) => p.created_utc > cutoff);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let newLeads = 0;
  const seenIds = new Set<string>();
  const errors: string[] = [];

  for (const keyword of KEYWORDS) {
    let posts: RedditChild['data'][];
    try {
      posts = await searchReddit(keyword);
    } catch (err) {
      errors.push(`${keyword}: ${err instanceof Error ? err.message : 'fetch failed'}`);
      continue;
    }

    for (const post of posts) {
      if (seenIds.has(post.id)) continue;
      seenIds.add(post.id);

      // Use Reddit post ID as doc ID — guarantees no duplicates
      const docRef = adminDb.collection('socialLeads').doc(post.id);
      const existing = await docRef.get();
      if (existing.exists) continue;

      const snippet = post.selftext?.trim()
        ? post.selftext.trim().slice(0, 400)
        : post.title;

      await docRef.set({
        id: post.id,
        source: 'reddit',
        title: post.title,
        snippet,
        url: `https://www.reddit.com${post.permalink}`,
        username: post.author,
        subreddit: post.subreddit,
        postedAt: post.created_utc,
        foundAt: FieldValue.serverTimestamp(),
        status: 'new',
        matchedKeyword: keyword,
      });

      newLeads++;
    }
  }

  return NextResponse.json({ success: true, newLeads, errors });
}
