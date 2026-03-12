import { NextRequest, NextResponse } from 'next/server';
import { sendToChannel } from '@/lib/telegram/bot';
import { generatePost } from '@/lib/telegram/generate-post';

// This endpoint is designed to be called by a cron job (Vercel Cron, GitHub Actions, etc.)
// It generates a marketing post and sends it to your Telegram channel

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a random post
    const post = await generatePost();

    // Send to Telegram channel
    const result = await sendToChannel(`${post.content}\n\n🔗 crftdweb.com`);

    return NextResponse.json({
      success: true,
      postType: post.type,
      telegramResult: result,
    });
  } catch (error) {
    console.error('Auto-post error:', error);
    return NextResponse.json(
      { error: 'Failed to generate and send post' },
      { status: 500 }
    );
  }
}
