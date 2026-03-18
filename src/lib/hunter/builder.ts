/**
 * Builder: orchestrates copy generation + preview creation + Firestore storage.
 */

import type { Business, AuditResult } from './types';
import { generatePreviewCopy } from './copywriter';
import { savePreview, getPreviewByBusiness } from './store';

function slugify(name: string, city: string): string {
  return `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/**
 * Build a preview site for a business.
 * Returns the preview ID and URL.
 */
export async function buildPreview(
  business: Business,
  audit: AuditResult,
): Promise<{ previewId: string; previewUrl: string; slug: string }> {
  // Check if preview already exists
  const existing = await getPreviewByBusiness(business.id);
  if (existing) {
    return {
      previewId: existing.id,
      previewUrl: existing.previewUrl,
      slug: existing.slug,
    };
  }

  // Generate copy
  const copy = await generatePreviewCopy(business, audit);

  // Create slug and URL
  const city = business.address.split(',').slice(-2, -1)[0]?.trim() || 'local';
  const slug = slugify(business.name, city);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
  const previewUrl = `${baseUrl}/preview/${slug}`;

  // Store preview
  const previewId = await savePreview({
    businessId: business.id,
    huntId: business.huntId,
    slug,
    previewUrl,
    headline: copy.headline,
    subheadline: copy.subheadline,
    painPoints: copy.painPoints,
    services: copy.services,
    ctaText: copy.ctaText,
    status: 'built',
    emailSentAt: null,
    emailOpenedAt: null,
    previewClickedAt: null,
    callBookedAt: null,
  });

  return { previewId, previewUrl, slug };
}
