import { NextRequest, NextResponse } from 'next/server';
import { setWebhook, deleteWebhook } from '@/lib/telegram/bot';

// Use this endpoint to register/deregister the Telegram webhook
// GET /api/telegram/setup?action=set   → register webhook
// GET /api/telegram/setup?action=delete → remove webhook

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  // Simple protection — must provide the bot token as a query param
  if (secret !== process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const action = req.nextUrl.searchParams.get('action') || 'set';

  if (action === 'delete') {
    const result = await deleteWebhook();
    return NextResponse.json({ action: 'delete', result });
  }

  // Default: set webhook
  const domain = process.env.NEXT_PUBLIC_SITE_URL || `https://www.crftdweb.com`;
  const webhookUrl = `${domain}/api/telegram/webhook`;

  const result = await setWebhook(webhookUrl);
  return NextResponse.json({ action: 'set', webhookUrl, result });
}
