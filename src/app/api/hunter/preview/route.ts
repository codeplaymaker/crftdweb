import { NextRequest, NextResponse } from 'next/server';
import { getPreviewBySlug } from '@/lib/hunter/store';
import { getBusiness } from '@/lib/hunter/store';
import { getAuditByBusiness } from '@/lib/hunter/store';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const preview = await getPreviewBySlug(slug);
  if (!preview) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const business = await getBusiness(preview.businessId);
  const audit = business ? await getAuditByBusiness(business.id) : null;

  return NextResponse.json({
    headline: preview.headline,
    subheadline: preview.subheadline,
    painPoints: preview.painPoints,
    services: preview.services,
    ctaText: preview.ctaText,
    businessName: business?.name ?? 'Business',
    businessRating: business?.rating ?? 4.5,
    businessReviewCount: business?.reviewCount ?? 50,
    businessPhone: business?.phone ?? null,
    screenshotUrl: audit?.screenshotUrl ?? null,
  });
}
