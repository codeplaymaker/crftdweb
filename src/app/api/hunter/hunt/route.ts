import { NextRequest, NextResponse } from 'next/server';
import { scrapeBusinesses } from '@/lib/hunter/scraper';
import { auditWebsite } from '@/lib/hunter/auditor';
import { gradeWebsite } from '@/lib/hunter/grader';
import { createHunt, saveBusiness, saveAudit, updateHunt } from '@/lib/hunter/store';
import { sendMessage } from '@/lib/telegram/bot';

/**
 * POST /api/hunter/hunt
 * Body: { niche, city, chatId, country? }
 * Starts a full hunt: scrape → audit → grade → store.
 * Sends progress updates to Telegram.
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

    // Send initial message
    if (chatId) {
      await sendMessage(chatId, `🔍 <b>Hunt started</b>\n\n📍 ${niche} in ${city}\n🆔 ${huntId}\n\nSearching Google Maps...`);
    }

    // 1. Scrape businesses
    const places = await scrapeBusinesses(niche, city, 60);

    if (chatId) {
      await sendMessage(chatId, `📋 Found <b>${places.length}</b> businesses. Auditing websites...`);
    }

    // 2. Save businesses + audit each website
    const gradeCounts = { A: 0, B: 0, C: 0, D: 0 };
    let audited = 0;
    const results: Array<{ name: string; grade: string; reason: string; website: string | null }> = [];

    for (const place of places) {
      // Save business
      const businessId = await saveBusiness({
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

      // Only audit if they have a website
      if (place.website) {
        try {
          const auditData = await auditWebsite(place.website);
          const { grade, reason } = gradeWebsite(auditData);

          await saveAudit({
            businessId,
            huntId,
            ...auditData,
            grade,
            gradeReason: reason,
          });

          gradeCounts[grade]++;
          results.push({ name: place.name, grade, reason, website: place.website });
        } catch {
          // Audit failed — mark as D
          gradeCounts.D++;
          results.push({ name: place.name, grade: 'D', reason: 'audit failed', website: place.website });
        }
      } else {
        // No website at all — grade D
        gradeCounts.D++;
        results.push({ name: place.name, grade: 'D', reason: 'no website', website: null });
      }

      audited++;

      // Progress update every 10 businesses
      if (chatId && audited % 10 === 0) {
        await sendMessage(chatId, `⏳ Audited ${audited}/${places.length}...`);
      }
    }

    // 3. Update hunt with final counts
    await updateHunt(huntId, {
      status: 'complete',
      businessCount: places.length,
      gradeCounts,
    });

    // 4. Send results summary to Telegram
    if (chatId) {
      // Summary
      await sendMessage(chatId, `
✅ <b>Hunt complete: ${niche} in ${city}</b>

📊 <b>${places.length}</b> businesses found
🟢 A: ${gradeCounts.A} · 🟡 B: ${gradeCounts.B} · 🟠 C: ${gradeCounts.C} · 🔴 D: ${gradeCounts.D}

🆔 Hunt ID: <code>${huntId}</code>
      `.trim());

      // Top D-grade businesses (the opportunities)
      const dGrades = results.filter(r => r.grade === 'D').slice(0, 15);
      if (dGrades.length > 0) {
        const list = dGrades
          .map((r, i) => `${i + 1}. <b>${r.name}</b>\n   🔴 ${r.reason}${r.website ? `\n   🌐 ${r.website}` : '\n   ❌ No website'}`)
          .join('\n\n');

        await sendMessage(chatId, `🎯 <b>Top opportunities (D-grade):</b>\n\n${list}\n\n💡 Use <code>/build-all D ${huntId}</code> to auto-build previews`);
      }

      // Top C-grade
      const cGrades = results.filter(r => r.grade === 'C').slice(0, 10);
      if (cGrades.length > 0) {
        const list = cGrades
          .map((r, i) => `${i + 1}. <b>${r.name}</b> — ${r.reason}`)
          .join('\n');

        await sendMessage(chatId, `🟠 <b>C-grade sites (fixable):</b>\n\n${list}`);
      }
    }

    return NextResponse.json({
      success: true,
      huntId,
      businessCount: places.length,
      gradeCounts,
    });
  } catch (error) {
    console.error('Hunt error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Hunt failed' },
      { status: 500 },
    );
  }
}
