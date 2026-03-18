import { NextRequest, NextResponse } from 'next/server';
import { getBusiness, getAuditByBusiness, getAuditsByGrade, getBusinessesByHunt } from '@/lib/hunter/store';
import { buildPreview } from '@/lib/hunter/builder';
import { sendMessage } from '@/lib/telegram/bot';

/**
 * POST /api/hunter/build
 * Body: { businessId, chatId } — build a single preview
 *   OR: { huntId, grade, chatId } — build all previews for a grade in a hunt
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId } = body;

    // ─── Single build ───
    if (body.businessId) {
      const { businessId } = body;
      const business = await getBusiness(businessId);
      if (!business) return NextResponse.json({ error: 'business not found' }, { status: 404 });

      const audit = await getAuditByBusiness(businessId);
      if (!audit) return NextResponse.json({ error: 'audit not found' }, { status: 404 });

      const result = await buildPreview(business, audit);

      if (chatId) {
        await sendMessage(
          chatId,
          `✅ Preview built for ${business.name}\n🔗 ${result.previewUrl}`,
        );
      }

      return NextResponse.json(result);
    }

    // ─── Batch build by grade ───
    if (body.huntId && body.grade) {
      const { huntId, grade } = body;
      const audits = await getAuditsByGrade(huntId, grade);

      if (audits.length === 0) {
        return NextResponse.json({ error: `no ${grade}-grade businesses found` }, { status: 404 });
      }

      if (chatId) {
        await sendMessage(chatId, `🏗️ Building ${audits.length} preview sites for grade ${grade}...`);
      }

      const businesses = await getBusinessesByHunt(huntId);
      const bizMap = new Map(businesses.map(b => [b.id, b]));

      const results: { name: string; url: string }[] = [];
      let errors = 0;

      for (const audit of audits) {
        const biz = bizMap.get(audit.businessId);
        if (!biz) { errors++; continue; }

        try {
          const result = await buildPreview(biz, audit);
          results.push({ name: biz.name, url: result.previewUrl });
        } catch {
          errors++;
        }

        // Progress update every 5
        if (results.length % 5 === 0 && chatId) {
          await sendMessage(chatId, `⚙️ Built ${results.length}/${audits.length}...`);
        }
      }

      if (chatId) {
        const summary = results.map(r => `• ${r.name}\n  ${r.url}`).join('\n');
        await sendMessage(
          chatId,
          `✅ Built ${results.length} preview sites${errors ? ` (${errors} errors)` : ''}\n\n${summary}\n\nUse /approve-all ${huntId} to approve and send outreach.`,
        );
      }

      return NextResponse.json({ built: results.length, errors, results });
    }

    return NextResponse.json({ error: 'provide businessId or huntId+grade' }, { status: 400 });
  } catch (err) {
    console.error('[hunter/build]', err);
    return NextResponse.json({ error: 'build failed' }, { status: 500 });
  }
}
