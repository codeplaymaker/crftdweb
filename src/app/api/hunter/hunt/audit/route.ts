import { NextRequest, NextResponse } from 'next/server';
import { auditWebsite } from '@/lib/hunter/auditor';
import { gradeWebsite } from '@/lib/hunter/grader';
import {
  getBusinessesByHunt, saveAudit, updateHunt, getHunt, getAuditsByHunt,
  incrementAuditCount,
} from '@/lib/hunter/store';
import { sendMessage } from '@/lib/telegram/bot';

/**
 * POST /api/hunter/hunt/audit
 * Body: { huntId, chatId, index, total }
 *
 * Audits ONE business by index. All 20 calls fire in parallel from the hunt route.
 * When a call finishes and detects all audits are complete, it finalizes the hunt.
 * No chaining needed — each call is independent and under 10s.
 */
export async function POST(req: NextRequest) {
  try {
    const { huntId, chatId, index, total } = await req.json();

    if (!huntId || index === undefined) {
      return NextResponse.json({ error: 'huntId and index required' }, { status: 400 });
    }

    const businesses = await getBusinessesByHunt(huntId);
    const biz = businesses[index];

    if (!biz) {
      return NextResponse.json({ error: `No business at index ${index}` }, { status: 404 });
    }

    // Audit this single business
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

    return NextResponse.json({ audited: index, done: completed === total });
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
