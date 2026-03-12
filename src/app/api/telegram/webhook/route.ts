import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, type TelegramUpdate } from '@/lib/telegram/bot';
import { generatePost, type PostType } from '@/lib/telegram/generate-post';

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

<b>Commands:</b>
/post — Generate a random marketing post
/post tip — Actionable design/conversion tip
/post case-study — Mini case study teaser
/post myth-bust — Bust a web design myth
/post cta — Call-to-action post
/post stat — Performance stat insight
/post bts — Behind-the-scenes
/post hot-take — Bold industry opinion

/batch [count] — Generate multiple posts (default: 5)
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
