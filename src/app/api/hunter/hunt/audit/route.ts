import { NextRequest, NextResponse } from 'next/server';
import { auditWebsite } from '@/lib/hunter/auditor';
import { gradeWebsite } from '@/lib/hunter/grader';
import {
  getBusiness, saveAudit, updateHunt, getHunt, getAuditsByHunt,
  incrementAuditCount,
} from '@/lib/hunter/store';
import { sendMessage } from '@/lib/telegram/bot';

/**
 * POST /api/hunter/hunt/audit
 * Body: { huntId, chatId, businessId, total }
 *
 * Audits ONE business by ID. All 20 calls fire in parallel from the hunt route.
 * Each call is independent — no index lookups, no ordering dependency.
 * When a call finishes and its atomic counter hits `total`, it finalizes the hunt.
 */
export async function POST(req: NextRequest) {
  try {
    const { huntId, chatId, businessId, total } = await req.json();

    if (!huntId || !businessId) {
      return NextResponse.json({ error: 'huntId and businessId required' }, { status: 400 });
    }

    const biz = await getBusiness(businessId);

    if (!biz) {
      // Still increment counter so finalize isn't blocked
      const completed = await incrementAuditCount(huntId);
      if (completed === total) await finalize(huntId, chatId, total);
      return NextResponse.json({ error: `Business ${businessId} not found` }, { status: 404 });
    }

    // Audit this single business
    if (biz.website) {
      try {
        const auditData = await auditWebsite(biz.website, { skipScreenshot: true });
        const { grade, reason } = gradeWebsite(auditData);
        await saveAudit({
          businessId: biz.id,
          huntId,
          ...auditData,
          grade,
          gradeReason: reason,
        });
      } catch {
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

    // Atomically increment counter — only the call that hits `total` finalizes
    const completed = await incrementAuditCount(huntId);

    // Progress updates at 25%, 50%, 75%
    if (chatId && total > 0) {
      const pct = completed / total;
      const prevPct = (completed - 1) / total;
      const milestones = [0.25, 0.5, 0.75];
      for (const m of milestones) {
        if (pct >= m && prevPct < m) {
          await sendMessage(chatId, `⏳ Audited ${completed}/${total}...`);
          break;
        }
      }
    }

    if (completed === total) {
      await finalize(huntId, chatId, total);
    }

    return NextResponse.json({ audited: businessId, done: completed === total });
  } catch (error) {
    console.error('[hunt/audit] error:', error);
    return NextResponse.json({ error: 'audit failed' }, { status: 500 });
  }
}

/**
 * Finalize the hunt: tally grades, update hunt record, send Telegram summary.
 */
async function finalize(huntId: string, chatId: string | null, total: number) {
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
