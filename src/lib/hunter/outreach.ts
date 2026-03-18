/**
 * Outreach: send comparison emails to prospects via Resend.
 *
 * Email shows: your current site screenshot vs. preview link.
 * Free tier: 100 emails/day, 3 000/month.
 */

import type { Business, AuditResult, Preview } from './types';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.OUTREACH_FROM_EMAIL || 'hello@crftdweb.com';
const REPLY_TO = process.env.OUTREACH_REPLY_TO || 'hello@crftdweb.com';
const CALENDLY_LINK = process.env.CALENDLY_LINK || 'https://calendly.com/crftdweb/intro';

function buildEmailHtml(business: Business, audit: AuditResult, preview: Preview): string {
  const firstName = business.name.split(' ')[0];
  const performanceLabel =
    audit.performanceScore < 30 ? 'critically low' :
    audit.performanceScore < 50 ? 'below average' :
    audit.performanceScore < 70 ? 'average' : 'decent';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background: #fafafa; }
    .container { max-width: 580px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #fff; border-radius: 12px; border: 1px solid #eee; padding: 32px; margin-bottom: 24px; }
    .screenshot { border-radius: 8px; border: 1px solid #eee; width: 100%; max-width: 520px; }
    .btn { display: inline-block; padding: 14px 28px; background: #000; color: #fff; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 500; }
    .btn-outline { display: inline-block; padding: 14px 28px; background: #fff; color: #000; border: 1px solid #ddd; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 500; }
    .score { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; }
    .score-bad { background: #fef2f2; color: #dc2626; }
    .score-mid { background: #fffbeb; color: #d97706; }
    .score-good { background: #f0fdf4; color: #16a34a; }
    .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    .muted { color: #888; font-size: 13px; }
    h1 { font-size: 22px; font-weight: 700; line-height: 1.3; margin: 0 0 8px; }
    p { line-height: 1.6; margin: 0 0 16px; font-size: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <p class="muted" style="margin-bottom: 24px;">Quick site check for ${business.name}</p>
      
      <h1>Your website scored ${audit.performanceScore}/100</h1>
      <p>Hey — I ran a quick performance audit on your site and the results were ${performanceLabel}.</p>
      
      <p>
        <span class="score ${audit.performanceScore < 40 ? 'score-bad' : audit.performanceScore < 70 ? 'score-mid' : 'score-good'}">
          Performance: ${audit.performanceScore}/100
        </span>
      </p>

      ${audit.screenshotUrl ? `
      <p style="margin-top: 16px;"><strong>Your current site:</strong></p>
      <img src="${audit.screenshotUrl}" alt="Current website" class="screenshot" />
      ` : ''}

      <hr class="divider" />

      <h1 style="font-size: 18px;">We mocked up what it could look like</h1>
      <p>No commitment, no charge — just wanted to show what&apos;s possible. Built this preview in your brand&apos;s style:</p>
      
      <p style="text-align: center; margin: 28px 0;">
        <a href="${preview.previewUrl}" class="btn">See Your Preview →</a>
      </p>

      <hr class="divider" />

      <p>If you like what you see, happy to jump on a quick 15-min call:</p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${CALENDLY_LINK}" class="btn-outline">Book a Free Call</a>
      </p>

      <p class="muted">
        — The CrftdWeb Team<br />
        Websites that sell, not just look good.
      </p>
    </div>

    <p class="muted" style="text-align: center; font-size: 11px;">
      You received this because we audited publicly available websites in your area. 
      No further emails will be sent unless you reply.
    </p>
  </div>
</body>
</html>`;
}

function buildPlainText(business: Business, audit: AuditResult, preview: Preview): string {
  return `Quick site check for ${business.name}

Your website scored ${audit.performanceScore}/100 on our performance audit.

We built a free preview of what an upgraded version could look like:
${preview.previewUrl}

If you're interested, book a free 15-min call:
${CALENDLY_LINK}

— CrftdWeb Team
Websites that sell, not just look good.`;
}

/**
 * Send outreach email via Resend.
 * Returns the Resend message ID on success, or null on failure.
 */
export async function sendOutreachEmail(
  business: Business,
  audit: AuditResult,
  preview: Preview,
  recipientEmail: string,
): Promise<string | null> {
  if (!RESEND_API_KEY) {
    console.warn('[outreach] RESEND_API_KEY not set — skipping email');
    return null;
  }

  const html = buildEmailHtml(business, audit, preview);
  const text = buildPlainText(business, audit, preview);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: recipientEmail,
      reply_to: REPLY_TO,
      subject: `${business.name} — your site scored ${audit.performanceScore}/100 (free preview inside)`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[outreach] Resend error:', err);
    return null;
  }

  const data = await res.json();
  return data.id ?? null;
}
