import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, sendPhoto, sendDocument, type TelegramUpdate } from '@/lib/telegram/bot';
import { generatePost, type PostType } from '@/lib/telegram/generate-post';
import { type TemplateType } from '@/lib/telegram/templates';

// Verify the webhook is from Telegram (optional secret token)
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// Allowed user IDs (your Telegram user ID) - restrict who can use the bot
const ALLOWED_USERS = process.env.TELEGRAM_ALLOWED_USERS?.split(',').map(Number) || [];

function isAllowed(userId: number): boolean {
  // If no allowed users configured, allow everyone
  if (ALLOWED_USERS.length === 0) return true;
  return ALLOWED_USERS.includes(userId);
}

export async function POST(req: NextRequest) {
  try {
    // Optional: verify webhook secret
    if (WEBHOOK_SECRET) {
      const secret = req.headers.get('x-telegram-bot-api-secret-token');
      if (secret !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const update: TelegramUpdate = await req.json();
    const message = update.message;

    if (!message?.text || !message.from) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const userId = message.from.id;
    const text = message.text.trim();

    // Check authorization
    if (!isAllowed(userId)) {
      await sendMessage(chatId, '⛔ You are not authorized to use this bot.');
      return NextResponse.json({ ok: true });
    }

    // Command routing
    const command = text.split(' ')[0].toLowerCase();
    const args = text.split(' ').slice(1);

    switch (command) {
      case '/start':
      case '/help': {
        await sendMessage(chatId, `
<b>🚀 CRFTD Web Bot</b>

<b>🔍 Hunter — Find &amp; Close Leads:</b>
/hunt &lt;niche&gt; &lt;city&gt; [country] — Find businesses &amp; audit sites
/results &lt;huntId&gt; — Show hunt results
/grade &lt;A|B|C|D&gt; &lt;huntId&gt; — List by grade
/status &lt;huntId&gt; — Hunt status summary
/build &lt;businessId&gt; — Build one preview
/build-all &lt;D|C&gt; &lt;huntId&gt; — Build previews for grade
/approve &lt;previewId&gt; — Approve preview
/approve-all &lt;huntId&gt; — Approve all built
/send &lt;previewId&gt; &lt;email&gt; — Send outreach email
/send-all &lt;huntId&gt; — Send to all approved
/pipeline — Pipeline stats
/hunts — Recent hunts

<b>📝 Text Posts:</b>
/post — Random marketing post
/post tip|case-study|myth-bust|cta|stat|bts|hot-take
/batch [count] — Generate multiple (default: 5)

<b>🎨 Visuals (TikTok/Social):</b>
/visual — Random branded visual
/visual problem|signs|case|framework|compare|proof|cta|tip|all

/help — Show this menu
        `.trim());
        break;
      }

      case '/post': {
        await sendMessage(chatId, '✍️ Generating your post...');

        const typeArg = args[0];
        const validTypes = ['tip', 'case-study', 'myth-bust', 'cta', 'stat', 'behind-the-scenes', 'hot-take', 'bts'];

        let postType: PostType | undefined;
        if (typeArg === 'bts') {
          postType = 'behind-the-scenes';
        } else if (typeArg && validTypes.includes(typeArg)) {
          postType = typeArg as PostType;
        } else if (typeArg) {
          await sendMessage(chatId, `❌ Unknown post type. Use: ${validTypes.join(', ')}`);
          break;
        }

        const post = await generatePost(postType as PostType | undefined);
        await sendMessage(chatId, `
<b>📝 ${post.type.toUpperCase()}</b>

${post.content}

<i>— Copy and paste wherever you need it</i>
        `.trim());
        break;
      }

      case '/batch': {
        const count = Math.min(parseInt(args[0]) || 5, 7);
        await sendMessage(chatId, `✍️ Generating ${count} posts...`);

        const { generateBatchPosts } = await import('@/lib/telegram/generate-post');
        const posts = await generateBatchPosts(count);

        for (const post of posts) {
          await sendMessage(chatId, `
<b>📝 ${post.type.toUpperCase()}</b>

${post.content}
          `.trim());
        }

        await sendMessage(chatId, `✅ Generated ${posts.length} posts. Copy what you like!`);
        break;
      }

      case '/visual': {
        const visualArg = args[0];
        const visualTypeMap: Record<string, TemplateType> = {
          'problem': 'problem-hook',
          'signs': 'five-signs',
          'case': 'case-study',
          'framework': 'framework',
          'compare': 'cost-comparison',
          'proof': 'proof',
          'cta': 'cta',
          'tip': 'tip',
        };
        const validVisualTypes = Object.keys(visualTypeMap);

        if (visualArg === 'all') {
          await sendMessage(chatId, '🎨 Generating all 8 branded templates...');
          const { DEFAULT_TEMPLATES } = await import('@/lib/telegram/templates');
          const { renderTemplate } = await import('@/lib/telegram/render-image');
          const allTypes: TemplateType[] = ['problem-hook', 'five-signs', 'case-study', 'framework', 'cost-comparison', 'proof', 'cta', 'tip'];

          for (const t of allTypes) {
            try {
              const imageBuffer = await renderTemplate(DEFAULT_TEMPLATES[t]);
              await sendDocument(chatId, imageBuffer, `crftd-${t}.png`, `<b>${t.toUpperCase()}</b>`);
            } catch (err) {
              console.error(`Failed to render ${t}:`, err);
              await sendMessage(chatId, `❌ Failed to render ${t}`);
            }
          }
          await sendMessage(chatId, '✅ All 8 templates sent! Save and post.');
          break;
        }

        if (visualArg && !validVisualTypes.includes(visualArg)) {
          await sendMessage(chatId, `❌ Unknown visual type. Use: ${validVisualTypes.join(', ')}, all`);
          break;
        }

        const selectedVisualType = visualArg ? visualTypeMap[visualArg] : undefined;
        await sendMessage(chatId, '🎨 Generating branded visual...');

        try {
          const { generateVisualContent } = await import('@/lib/telegram/generate-visual');
          const { renderTemplate } = await import('@/lib/telegram/render-image');

          const visualData = await generateVisualContent(selectedVisualType);
          const imageBuffer = await renderTemplate(visualData);

          await sendDocument(chatId, imageBuffer, `crftd-${visualData.type}.png`, `<b>🎨 ${visualData.type.toUpperCase()}</b>\n\n<i>AI-generated • 1080×1920 • Ready to post</i>`);
        } catch (err) {
          console.error('Visual generation failed:', err);
          await sendMessage(chatId, `❌ Failed to generate visual. Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        break;
      }

      // ──────────────────────────────────────────────
      // HUNTER COMMANDS
      // ──────────────────────────────────────────────

      case '/hunt': {
        // Support: /hunt <niche> <city> or /hunt <niche> <city> <country>
        const niche = args[0];
        // Check if last arg looks like a country code (2-3 chars) or known country
        const lastArg = args[args.length - 1];
        const countryPattern = /^(UK|US|USA|AU|CA|NZ|IE|DE|FR|ES|IT|NL|SE|NO|DK|FI|BE|AT|CH|PT|PL|CZ|IN|SG|HK|JP|KR|ZA|BR|MX|AE|SA)$/i;
        let country = 'UK';
        let cityArgs = args.slice(1);
        if (args.length >= 3 && countryPattern.test(lastArg)) {
          country = lastArg.toUpperCase();
          cityArgs = args.slice(1, -1);
        }
        const city = cityArgs.join(' ');
        if (!niche || !city) {
          await sendMessage(chatId, '❌ Usage: /hunt &lt;niche&gt; &lt;city&gt; [country]\nExample: /hunt plumber London\nExample: /hunt dentist Miami US');
          break;
        }

        await sendMessage(chatId, `🔍 Hunting ${niche} in ${city}, ${country}... This may take a few minutes.`);

        // Fire and forget — the API route sends Telegram updates itself
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
        fetch(`${baseUrl}/api/hunter/hunt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ niche, city, chatId: String(chatId), country }),
        }).catch(err => {
          console.error('[hunt] fire-and-forget error:', err);
          sendMessage(chatId, '❌ Hunt failed to start. Check server logs.');
        });
        break;
      }

      case '/results': {
        const huntId = args[0];
        if (!huntId) { await sendMessage(chatId, '❌ Usage: /results &lt;huntId&gt;'); break; }

        const { getBusinessesByHunt } = await import('@/lib/hunter/store');
        const { getAuditsByHunt } = await import('@/lib/hunter/store');
        const businesses = await getBusinessesByHunt(huntId);
        const audits = await getAuditsByHunt(huntId);

        if (businesses.length === 0) {
          await sendMessage(chatId, '❌ No businesses found for this hunt.');
          break;
        }

        const auditMap = new Map(audits.map(a => [a.businessId, a]));
        const lines = businesses.slice(0, 30).map((b, i) => {
          const a = auditMap.get(b.id);
          const grade = a ? a.grade : '?';
          const score = a ? `${a.performanceScore}/100` : 'N/A';
          return `${i + 1}. [${grade}] ${b.name} — ${score}${b.website ? ' 🌐' : ' ❌'}`;
        });

        await sendMessage(chatId, `<b>📊 Hunt Results (${businesses.length} businesses)</b>\n\n${lines.join('\n')}\n\n${businesses.length > 30 ? `...and ${businesses.length - 30} more\n\n` : ''}Use /grade D ${huntId} to filter by grade.`);
        break;
      }

      case '/grade': {
        const grade = args[0]?.toUpperCase() as 'A' | 'B' | 'C' | 'D';
        const huntId = args[1];
        if (!grade || !huntId || !['A', 'B', 'C', 'D'].includes(grade)) {
          await sendMessage(chatId, '❌ Usage: /grade &lt;A|B|C|D&gt; &lt;huntId&gt;');
          break;
        }

        const { getAuditsByGrade } = await import('@/lib/hunter/store');
        const { getBusiness } = await import('@/lib/hunter/store');
        const gradeAudits = await getAuditsByGrade(huntId, grade);

        if (gradeAudits.length === 0) {
          await sendMessage(chatId, `No ${grade}-grade businesses found.`);
          break;
        }

        const lines: string[] = [];
        for (const a of gradeAudits.slice(0, 25)) {
          const biz = await getBusiness(a.businessId);
          lines.push(`• ${biz?.name ?? 'Unknown'} — ${a.performanceScore}/100\n  ${a.gradeReason}\n  ID: <code>${a.businessId}</code>`);
        }

        await sendMessage(chatId, `<b>Grade ${grade} (${gradeAudits.length} businesses)</b>\n\n${lines.join('\n\n')}\n\nUse /build-all ${grade} ${huntId} to generate previews.`);
        break;
      }

      case '/status': {
        const huntId = args[0];
        if (!huntId) { await sendMessage(chatId, '❌ Usage: /status &lt;huntId&gt;'); break; }

        const { getHunt } = await import('@/lib/hunter/store');
        const hunt = await getHunt(huntId);

        if (!hunt) { await sendMessage(chatId, '❌ Hunt not found.'); break; }

        await sendMessage(chatId, `<b>🔍 Hunt: ${hunt.niche} in ${hunt.city}</b>\n\nStatus: ${hunt.status}\nBusinesses: ${hunt.businessCount}\n\nGrades:\n  A: ${hunt.gradeCounts.A}\n  B: ${hunt.gradeCounts.B}\n  C: ${hunt.gradeCounts.C}\n  D: ${hunt.gradeCounts.D}`);
        break;
      }

      case '/hunts': {
        const { getRecentHunts } = await import('@/lib/hunter/store');
        const hunts = await getRecentHunts(10);

        if (hunts.length === 0) {
          await sendMessage(chatId, 'No hunts yet. Use /hunt &lt;niche&gt; &lt;city&gt; to start.');
          break;
        }

        const lines = hunts.map(h =>
          `• ${h.niche} in ${h.city} — ${h.businessCount} biz [${h.status}]\n  ID: <code>${h.id}</code>`,
        );

        await sendMessage(chatId, `<b>📋 Recent Hunts</b>\n\n${lines.join('\n\n')}`);
        break;
      }

      case '/build': {
        const businessId = args[0];
        if (!businessId) { await sendMessage(chatId, '❌ Usage: /build &lt;businessId&gt;'); break; }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
        fetch(`${baseUrl}/api/hunter/build`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessId, chatId: String(chatId) }),
        }).catch(err => {
          console.error('[build] error:', err);
          sendMessage(chatId, '❌ Build failed.');
        });

        await sendMessage(chatId, '🏗️ Building preview...');
        break;
      }

      case '/build-all': {
        const grade = args[0]?.toUpperCase();
        const huntId = args[1];
        if (!grade || !huntId || !['A', 'B', 'C', 'D'].includes(grade)) {
          await sendMessage(chatId, '❌ Usage: /build-all &lt;D|C&gt; &lt;huntId&gt;');
          break;
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
        fetch(`${baseUrl}/api/hunter/build`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ huntId, grade, chatId: String(chatId) }),
        }).catch(err => {
          console.error('[build-all] error:', err);
          sendMessage(chatId, '❌ Batch build failed.');
        });
        break;
      }

      case '/approve': {
        const previewId = args[0];
        if (!previewId) { await sendMessage(chatId, '❌ Usage: /approve &lt;previewId&gt;'); break; }

        const { getPreview, updatePreview } = await import('@/lib/hunter/store');
        const preview = await getPreview(previewId);
        if (!preview) { await sendMessage(chatId, '❌ Preview not found.'); break; }

        await updatePreview(previewId, { status: 'approved' });
        await sendMessage(chatId, `✅ Approved: ${preview.previewUrl}\n\nUse /send ${previewId} &lt;email&gt; to send outreach.`);
        break;
      }

      case '/approve-all': {
        const huntId = args[0];
        if (!huntId) { await sendMessage(chatId, '❌ Usage: /approve-all &lt;huntId&gt;'); break; }

        const { getPreviewsByHunt, updatePreview } = await import('@/lib/hunter/store');
        const previews = await getPreviewsByHunt(huntId);
        const built = previews.filter(p => p.status === 'built');

        if (built.length === 0) {
          await sendMessage(chatId, 'No built previews to approve.');
          break;
        }

        for (const p of built) {
          await updatePreview(p.id, { status: 'approved' });
        }

        await sendMessage(chatId, `✅ Approved ${built.length} previews.\n\nUse /send-all ${huntId} to send outreach emails.`);
        break;
      }

      case '/send': {
        const previewId = args[0];
        const email = args[1];
        if (!previewId || !email) {
          await sendMessage(chatId, '❌ Usage: /send &lt;previewId&gt; &lt;email&gt;');
          break;
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
        fetch(`${baseUrl}/api/hunter/outreach`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ previewId, email, chatId: String(chatId) }),
        }).catch(err => {
          console.error('[send] error:', err);
          sendMessage(chatId, '❌ Send failed.');
        });

        await sendMessage(chatId, `📧 Sending outreach to ${email}...`);
        break;
      }

      case '/send-all': {
        const huntId = args[0];
        if (!huntId) { await sendMessage(chatId, '❌ Usage: /send-all &lt;huntId&gt;'); break; }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crftdweb.com';
        fetch(`${baseUrl}/api/hunter/outreach`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ huntId, chatId: String(chatId) }),
        }).catch(err => {
          console.error('[send-all] error:', err);
          sendMessage(chatId, '❌ Batch send failed.');
        });

        await sendMessage(chatId, '📧 Starting batch outreach...');
        break;
      }

      case '/pipeline': {
        const { getPipelineStats } = await import('@/lib/hunter/store');
        const stats = await getPipelineStats();

        await sendMessage(chatId, `<b>📊 Pipeline Stats</b>\n\n🔍 Hunts: ${stats.totalHunts}\n🏢 Businesses: ${stats.totalBusinesses}\n📋 Audited: ${stats.totalAudited}\n🏗️ Previews: ${stats.totalPreviews}\n📧 Sent: ${stats.totalSent}\n👀 Opened: ${stats.totalOpened}\n🔗 Clicked: ${stats.totalClicked}\n📅 Booked: ${stats.totalBooked}\n\nConversion: ${stats.totalSent > 0 ? ((stats.totalBooked / stats.totalSent) * 100).toFixed(1) : '0'}% booked`);
        break;
      }

      default: {
        await sendMessage(chatId, 'Unknown command. Type /help to see available commands.');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

// Respond to GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook active' });
}
