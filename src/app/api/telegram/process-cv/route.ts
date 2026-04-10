import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { sendMessage, sendMessageWithButtons } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

const CV_PROMPT = `You are a hiring assistant for CrftdWeb, a UK web design agency looking for commission-only sales reps who cold call small businesses to book website consultations.

The role requires: picking up the phone, calling strangers, handling rejection, and booking calls. No base salary — 15% commission only. Reps need to be confident, persuasive, and resilient.

Analyse this CV and return a JSON object with these exact fields:

- verdict: One of exactly: "Book Screening Call", "Send Trial Task", "Pass"
  - "Book Screening Call" = strong sales/outreach/cold calling background, high confidence
  - "Send Trial Task" = some relevant experience OR strong communicator worth testing
  - "Pass" = no relevant experience, wrong fit
- score: Number 1-10 (10 = perfect fit)
- name: The candidate's full name as on the CV
- email: Their email address if found, otherwise empty string
- salesSignals: Array of up to 3 short strings highlighting relevant experience
- reasons: Array of exactly 2-3 short bullet point strings explaining the verdict
- redFlags: Array of short strings for any concerns. Empty array if none.

Rules:
- Prioritise: cold calling, door-to-door, outbound telesales, estate agency, recruitment, direct sales
- Secondary: any customer-facing role where persuasion was needed
- "communications skills" as a listed skill without evidence = weak signal
- Actual sales targets met, commission earned, outbound calls made = strong signal

CV:
{{CV_TEXT}}

Return ONLY valid JSON, no markdown.`;

export async function POST(req: NextRequest) {
  try {
    const { fileId, chatId } = await req.json();
    if (!fileId || !chatId) return NextResponse.json({ ok: false }, { status: 400 });

    // Download PDF from Telegram
    const fileRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`,
    );
    const fileData = await fileRes.json();
    if (!fileData.ok) throw new Error('Failed to get file info from Telegram');

    const pdfRes = await fetch(
      `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`,
    );
    if (!pdfRes.ok) throw new Error('Failed to download PDF');
    const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

    // Parse PDF text
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const parsed = await pdfParse(pdfBuffer);
    const cvText = parsed.text?.trim() || '';

    if (cvText.length < 50) {
      await sendMessage(chatId, "❌ Couldn't extract text from that PDF. Make sure it's a text-based CV, not a scanned image.");
      return NextResponse.json({ ok: true });
    }

    // Analyse with OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: CV_PROMPT.replace('{{CV_TEXT}}', cvText.slice(0, 3000)) }],
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(res.choices[0]?.message?.content || '{}');
    const verdictEmoji = result.verdict === 'Book Screening Call' ? '✅' : result.verdict === 'Send Trial Task' ? '🟡' : '❌';

    let reply = `${verdictEmoji} <b>${result.verdict}</b> — ${result.name || 'Unknown'} (${result.score}/10)\n`;
    if (result.email) reply += `📧 ${result.email}\n`;
    reply += '\n';
    if (result.salesSignals?.length) {
      reply += `<b>Sales signals:</b>\n${(result.salesSignals as string[]).map((s: string) => `• ${s}`).join('\n')}\n\n`;
    }
    reply += `<b>Verdict:</b>\n${(result.reasons as string[]).map((r: string) => `• ${r}`).join('\n')}`;
    if (result.redFlags?.length) {
      reply += `\n\n<b>Red flags:</b>\n${(result.redFlags as string[]).map((r: string) => `• ${r}`).join('\n')}`;
    }

    const cvEmail = (result.email as string | undefined)?.trim() || '';
    const cvName = (result.name as string | undefined)?.trim() || '';
    if (cvEmail && result.verdict !== 'Pass') {
      const encoded = encodeURIComponent(`${cvName}|||${cvEmail}`);
      const buttons =
        result.verdict === 'Book Screening Call'
          ? [[{ text: '📅 Send Booking Link', callback_data: `cv_action:booking:${encoded}` }]]
          : [[{ text: '📋 Send Trial Task', callback_data: `cv_action:trial:${encoded}` }]];
      await sendMessageWithButtons(chatId, reply, buttons);
    } else {
      await sendMessage(chatId, reply);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[process-cv] error:', err);
    // Best-effort error message — chatId may not be available if JSON parse failed
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
