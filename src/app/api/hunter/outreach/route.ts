import { NextRequest, NextResponse } from 'next/server';
import {
  getPreview, getPreviewsByHunt, updatePreview,
  getBusiness, getAuditByBusiness,
} from '@/lib/hunter/store';
import { sendOutreachEmail } from '@/lib/hunter/outreach';
import { sendMessage } from '@/lib/telegram/bot';
import { Timestamp } from 'firebase/firestore';

/**
 * POST /api/hunter/outreach
 * Body: { previewId, email, chatId } — send outreach for one preview
 *   OR: { huntId, chatId }           — send outreach for all approved previews in a hunt
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId } = body;

    // ─── Single outreach ───
    if (body.previewId && body.email) {
      const preview = await getPreview(body.previewId);
      if (!preview) return NextResponse.json({ error: 'preview not found' }, { status: 404 });

      const business = await getBusiness(preview.businessId);
      if (!business) return NextResponse.json({ error: 'business not found' }, { status: 404 });

      const audit = await getAuditByBusiness(preview.businessId);
      if (!audit) return NextResponse.json({ error: 'audit not found' }, { status: 404 });

      const msgId = await sendOutreachEmail(business, audit, preview, body.email);

      if (msgId) {
        await updatePreview(preview.id, {
          status: 'sent',
          emailSentAt: Timestamp.now(),
        });
      }

      if (chatId) {
        await sendMessage(
          chatId,
          msgId
            ? `✅ Email sent to ${body.email} for ${business.name}`
            : `❌ Failed to send email to ${body.email}`,
        );
      }

      return NextResponse.json({ sent: !!msgId, messageId: msgId });
    }

    // ─── Batch outreach for a hunt ───
    if (body.huntId) {
      const previews = await getPreviewsByHunt(body.huntId);
      const approved = previews.filter(p => p.status === 'approved');

      if (approved.length === 0) {
        return NextResponse.json({ error: 'no approved previews found' }, { status: 404 });
      }

      if (chatId) {
        await sendMessage(chatId, `📧 Sending outreach to ${approved.length} businesses...`);
      }

      let sent = 0;
      let failed = 0;

      for (const preview of approved) {
        const business = await getBusiness(preview.businessId);
        if (!business) { failed++; continue; }

        // We need an email — in practice this would be found during scraping
        // or via Hunter.io / Apollo enrichment. For now skip if no website.
        if (!business.website) { failed++; continue; }

        // Derive contact email from website domain as fallback
        const domain = new URL(business.website).hostname.replace('www.', '');
        const email = body.email || `info@${domain}`;

        const audit = await getAuditByBusiness(preview.businessId);
        if (!audit) { failed++; continue; }

        const msgId = await sendOutreachEmail(business, audit, preview, email);

        if (msgId) {
          await updatePreview(preview.id, {
            status: 'sent',
            emailSentAt: Timestamp.now(),
          });
          sent++;
        } else {
          failed++;
        }

        // Rate limit: ~2 per second to be safe with Resend
        await new Promise(r => setTimeout(r, 500));
      }

      if (chatId) {
        await sendMessage(
          chatId,
          `📧 Outreach complete: ${sent} sent, ${failed} failed\n\nUse /pipeline to check engagement stats.`,
        );
      }

      return NextResponse.json({ sent, failed });
    }

    return NextResponse.json({ error: 'provide previewId+email or huntId' }, { status: 400 });
  } catch (err) {
    console.error('[hunter/outreach]', err);
    return NextResponse.json({ error: 'outreach failed' }, { status: 500 });
  }
}
