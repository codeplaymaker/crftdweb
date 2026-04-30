import { NextRequest, NextResponse } from 'next/server';
import {
  getBusinessesByHunt,
  getAuditsByHunt,
  getPreviewsByHunt,
} from '@/lib/hunter/store';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

/** GET /api/admin/hunter/[huntId] — returns businesses + audits + previews for a hunt */
export async function GET(req: NextRequest, { params }: { params: Promise<{ huntId: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { huntId } = await params;

  const [businesses, audits, previews] = await Promise.all([
    getBusinessesByHunt(huntId),
    getAuditsByHunt(huntId),
    getPreviewsByHunt(huntId),
  ]);

  // Index audits and previews by businessId for easy lookup
  const auditMap: Record<string, typeof audits[0]> = {};
  for (const a of audits) auditMap[a.businessId] = a;

  const previewMap: Record<string, typeof previews[0]> = {};
  for (const p of previews) previewMap[p.businessId] = p;

  const rows = businesses.map((b) => ({
    ...b,
    createdAt: (b.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? null,
    audit: auditMap[b.id] ? {
      ...auditMap[b.id],
      createdAt: (auditMap[b.id].createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? null,
    } : null,
    preview: previewMap[b.id] ? {
      ...previewMap[b.id],
      createdAt: (previewMap[b.id].createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? null,
      emailSentAt: (previewMap[b.id].emailSentAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? null,
    } : null,
  }));

  return NextResponse.json(rows);
}
