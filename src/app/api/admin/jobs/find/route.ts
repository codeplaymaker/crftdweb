import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export interface JobListing {
  id: string;
  source: 'remotive' | 'arbeitnow';
  title: string;
  company: string;
  location: string;
  remote: boolean;
  url: string;
  tags: string[];
  postedAt: string;
  description: string;
}

async function fetchRemotive(query: string): Promise<JobListing[]> {
  try {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=30`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs ?? []).map((j: Record<string, unknown>) => ({
      id: `remotive-${j['id']}`,
      source: 'remotive' as const,
      title: String(j['title'] ?? ''),
      company: String(j['company_name'] ?? ''),
      location: String(j['candidate_required_location'] ?? 'Remote'),
      remote: true,
      url: String(j['url'] ?? ''),
      tags: Array.isArray(j['tags']) ? (j['tags'] as string[]) : [],
      postedAt: String(j['publication_date'] ?? ''),
      description: String(j['description'] ?? '').replace(/<[^>]+>/g, '').slice(0, 400),
    }));
  } catch {
    return [];
  }
}

async function fetchArbeitnow(query: string): Promise<JobListing[]> {
  try {
    const url = `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []).slice(0, 30).map((j: Record<string, unknown>) => ({
      id: `arbeitnow-${j['slug']}`,
      source: 'arbeitnow' as const,
      title: String(j['title'] ?? ''),
      company: String(j['company_name'] ?? ''),
      location: String(j['location'] ?? 'Remote'),
      remote: Boolean(j['remote']),
      url: String(j['url'] ?? ''),
      tags: Array.isArray(j['tags']) ? (j['tags'] as string[]) : [],
      postedAt: String(j['created_at'] ?? ''),
      description: String(j['description'] ?? '').replace(/<[^>]+>/g, '').slice(0, 400),
    }));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? 'react typescript nextjs';

  const [remotive, arbeitnow] = await Promise.all([
    fetchRemotive(query),
    fetchArbeitnow(query),
  ]);

  // Merge and sort newest first
  const all = [...remotive, ...arbeitnow].sort((a, b) => {
    const da = new Date(a.postedAt).getTime();
    const db = new Date(b.postedAt).getTime();
    return isNaN(db - da) ? 0 : db - da;
  });

  return NextResponse.json(all);
}
