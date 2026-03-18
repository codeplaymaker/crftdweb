import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { scrapeBusinesses } from '@/lib/hunter/scraper';
import { createHunt, saveBusiness, updateHunt } from '@/lib/hunter/store';
import { sendMessage } from '@/lib/telegram/bot';

/**
 * POST /api/hunter/hunt
 * Body: { niche, city, chatId, country? }
 *
 * Step 1 of the daisy-chain: scrape businesses from Google Places,
 * save them to Firestore, then trigger the audit step.
 * Completes well under 10s (Vercel Hobby limit).
 */
export async function POST(req: NextRequest) {
  try {
    const { niche, city, chatId, country = 'UK' } = await req.json();

    if (!niche || !city) {
      return NextResponse.json({ error: 'niche and city are required' }, { status: 400 });
    }

    // Create hunt record
    const huntId = await createHunt({
      niche,
      city,
      country,
      status: 'running',
      businessCount: 0,
      gradeCounts: { A: 0, B: 0, C: 0, D: 0 },
    });

    if (chatId) {
      await sendMessage(chatId, `🔍 <b>Hunt started</b>\n\n📍 ${niche} in ${city}\n🆔 ${huntId}\n\nSearching Google Maps...`);
    }

    // 1. Scrape businesses (fast — 1-3s)
    const places = await scrapeBusinesses(niche, city, country);

    if (chatId) {
      await sendMessage(chatId, `📋 Found <b>${places.length}</b> businesses. Starting audits...`);
    }

    // 2. Save all businesses to Firestore — collect IDs
    const businessIds: string[] = [];
    for (const place of places) {
      const id = await saveBusiness({
        huntId,
        name: place.name,
        website: place.website || null,
        phone: place.phone || null,
        address: place.formatted_address,
        rating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
        placeId: place.place_id,
        types: place.types || [],
      });
      businessIds.push(id);
    }

    await updateHunt(huntId, { businessCount: places.length });

    // 3. Fire one audit call per business in parallel via after()
    //    Pass businessId directly — no index lookups needed.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
    after(async () => {
      try {
        const results = await Promise.allSettled(
          businessIds.map((businessId) =>
            fetch(`${baseUrl}/api/hunter/hunt/audit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ huntId, chatId, businessId, total: places.length }),
            })
          )
        );
        const failures = results.filter(r => r.status === 'rejected').length;
        if (failures > 0) {
          console.error(`[hunt] ${failures}/${places.length} audit triggers failed`);
        }
      } catch (err) {
        console.error('[hunt] audit trigger failed:', err);
      }
    });

    return NextResponse.json({ success: true, huntId, businessCount: places.length });
  } catch (error) {
    console.error('Hunt error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Hunt failed' },
      { status: 500 },
    );
  }
}
