import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { auditWebsite } from '@/lib/hunter/auditor';
import { gradeWebsite } from '@/lib/hunter/grader';
import {
  getBusinessesByHunt, saveAudit, updateHunt, getHunt,
} from '@/lib/hunter/store';
import { sendMessage } from '@/lib/telegram/bot';

const BATCH_SIZE = 2; // Audit 2 businesses per call (in parallel, ~7s, under 10s limit)

/**
 * POST /api/hunter/hunt/audit
 * Body: { huntId, chatId, offset }
 *
 * Daisy-chain step: audits BATCH_SIZE businesses starting at offset,
 * then triggers itself for the next batch. When done, sends summary.
 */
export async function POST(req: NextRequest) {
  try {
    const { huntId, chatId, offset = 0 } = await req.json();

    if (!huntId) {
      return NextResponse.json({ error: 'huntId required' }, { status: 400 });
    }

    const businesses = await getBusinessesByHunt(huntId);
    const batch = businesses.slice(offset, offset + BATCH_SIZE);

    if (batch.length === 0) {
      // All done — finalize
      await finalize(huntId, chatId, businesses.length);
      return NextResponse.json({ done: true, huntId });
    }

    // Audit this batch IN PARALLEL (2 businesses × ~7s each = ~7s total)
    await Promise.all(batch.map(async (biz) => {
      if (biz.website) {
        try {
          const auditData = await auditWebsite(biz.website);
          const { grade, reason } = gradeWebsite(auditData);
          await saveAudit({
            businessId: biz.id,
            huntId,
            ...auditData,
            grade,
            gradeReason: reason,
          });
        } catch {
          // Audit failed — save as D
          await saveAudit({
            businessId: biz.id,
            huntId,
            performanceScore: 0,
            lcp: 0,
            cls: 0,
            fcp: 0,
            speedIndex: 0,
            mobile: false,
            https: false,
            hasMetaDescription: false,
            hasOgTags: false,
            hasCTA: false,
            screenshotUrl: null,
            grade: 'D',
            gradeReason: 'Audit failed — site unreachable or timed out',
          });
        }
      } else {
        // No website — D grade
        await saveAudit({
          businessId: biz.id,
          huntId,
          performanceScore: 0,
          lcp: 0,
          cls: 0,
          fcp: 0,
          speedIndex: 0,
          mobile: false,
          https: false,
          hasMetaDescription: false,
          hasOgTags: false,
          hasCTA: false,
          screenshotUrl: null,
          grade: 'D',
          gradeReason: 'No website',
        });
      }
    }));

    const nextOffset = offset + BATCH_SIZE;
    const progress = Math.min(nextOffset, businesses.length);

    // Trigger next batch via after() — response returns immediately,
    // Vercel keeps function alive to fire the chain trigger
    if (nextOffset < businesses.length) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
      after(async () => {
        try {
          // Progress update every 4 businesses
          if (chatId && progress % 4 === 0) {
            await sendMessage(chatId, `⏳ Audited ${progress}/${businesses.length}...`);
          }
          await fetch(`${baseUrl}/api/hunter/hunt/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ huntId, chatId, offset: nextOffset }),
          });
        } catch (err) {
          console.error('[audit-chain] trigger failed:', err);
        }
      });
    } else {
      // Last batch — finalize
      await finalize(huntId, chatId, businesses.length);
    }

    return NextResponse.json({ audited: progress, total: businesses.length });
  } catch (error) {
    console.error('[hunt/audit] error:', error);
    return NextResponse.json({ error: 'audit batch failed' }, { status: 500 });
  }
}

/**
 * Finalize the hunt: tally grades, update hunt record, send Telegram summary.
 */
async function finalize(huntId: string, chatId: string | null, total: number) {
  const { getAuditsByHunt } = await import('@/lib/hunter/store');
  const audits = await getAuditsByHunt(huntId);
  const hunt = await getHunt(huntId);

  const gradeCounts = { A: 0, B: 0, C: 0, D: 0 };
  for (const a of audits) {
    gradeCounts[a.grade]++;
  }

  await updateHunt(huntId, {
    status: 'complete',
    businessCount: total,
    gradeCounts,
  });

  if (!chatId) return;

  const niche = hunt?.niche ?? 'unknown';
  const city = hunt?.city ?? 'unknown';

  await sendMessage(chatId, `
✅ <b>Hunt complete: ${niche} in ${city}</b>

📊 <b>${total}</b> businesses found
🟢 A: ${gradeCounts.A} · 🟡 B: ${gradeCounts.B} · 🟠 C: ${gradeCounts.C} · 🔴 D: ${gradeCounts.D}

🆔 Hunt ID: <code>${huntId}</code>

💡 Use <code>/grade D ${huntId}</code> to see opportunities
💡 Use <code>/build-all D ${huntId}</code> to auto-build previews
  `.trim());
}
