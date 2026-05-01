import { NextRequest, NextResponse } from 'next/server';
import { updatePreview } from '@/lib/hunter/store';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

/**
 * PATCH /api/admin/hunter/preview
 * Body: { previewId, status }
 * Sets preview status (e.g. 'approved', 'built')
 */
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { previewId, status } = await req.json();
  if (!previewId || !status) return NextResponse.json({ error: 'previewId and status required' }, { status: 400 });

  await updatePreview(previewId, { status });
  return NextResponse.json({ updated: true });
}
