const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID; // e.g. @crftdweb or -100xxxxx

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendMessage(chatId: string | number, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    }),
  });
  return res.json();
}

export async function sendToChannel(text: string) {
  if (!TELEGRAM_CHANNEL_ID) {
    throw new Error('TELEGRAM_CHANNEL_ID is not configured');
  }
  return sendMessage(TELEGRAM_CHANNEL_ID, text);
}

export async function setWebhook(url: string) {
  const res = await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return res.json();
}

export async function deleteWebhook() {
  const res = await fetch(`${TELEGRAM_API}/deleteWebhook`, {
    method: 'POST',
  });
  return res.json();
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
    date: number;
  };
}
