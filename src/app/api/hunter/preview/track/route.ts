import { NextRequest, NextResponse } from 'next/server';
import { getPreviewBySlug, updatePreview } from '@/lib/hunter/store';
import { FieldValue } from 'firebase-admin/firestore';
import type { Preview } from '@/lib/hunter/types';

export async function POST(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const preview = await getPreviewBySlug(slug);
  if (!preview) return NextResponse.json({ error: 'not found' }, { status: 404 });

  // Only update if first click
  if (!preview.previewClickedAt) {
    await updatePreview(preview.id, {
      previewClickedAt: FieldValue.serverTimestamp(),
      status: preview.status === 'sent' || preview.status === 'opened' ? 'clicked' : preview.status,
    });
  }

  return NextResponse.json({ ok: true });
}
