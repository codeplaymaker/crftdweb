import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentHunts,
  getPipelineStats,
  deleteHunt,
} from '@/lib/hunter/store';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

/** GET /api/admin/hunter — returns recent hunts + pipeline stats */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [hunts, stats] = await Promise.all([getRecentHunts(20), getPipelineStats()]);

  const serialized = hunts.map((h) => ({
    ...h,
    createdAt: (h.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? null,
  }));

  return NextResponse.json({ hunts: serialized, stats });
}

/** DELETE /api/admin/hunter?huntId=xxx */
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const huntId = req.nextUrl.searchParams.get('huntId');
  if (!huntId) return NextResponse.json({ error: 'huntId required' }, { status: 400 });

  const result = await deleteHunt(huntId);
  return NextResponse.json({ deleted: true, ...result });
}
