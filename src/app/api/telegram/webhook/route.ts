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
<b>🚀 CRFTD Web Marketing Bot</b>

Generate marketing posts on-demand:

<b>📝 Text Posts:</b>
/post — Random marketing post
/post tip — Actionable design/conversion tip
/post case-study — Mini case study teaser
/post myth-bust — Bust a web design myth
/post cta — Call-to-action post
/post stat — Performance stat insight
/post bts — Behind-the-scenes
/post hot-take — Bold industry opinion
/batch [count] — Generate multiple posts (default: 5)

<b>🎨 Visuals (TikTok/Social):</b>
/visual — Random branded visual
/visual problem — Problem hook visual
/visual signs — 5 signs list visual
/visual case — Case study visual
/visual framework — Process framework
/visual compare — Cost comparison
/visual proof — Client testimonials
/visual cta — Call-to-action visual
/visual tip — Web tip visual
/visual all — All 8 default templates

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
