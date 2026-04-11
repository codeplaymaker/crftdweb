import OpenAI from 'openai';
import { adminDb } from '@/lib/firebase/admin';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_business_summary',
      description: 'Get a high-level summary of the business: applicant counts by status, rep counts, pipeline health',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_applicants',
      description: 'List all job applicants with their name, email, current pipeline status, and rating',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_reps',
      description: 'List all sales reps with their name, email, pipeline status, and commission rate',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_offer',
      description: 'Send a 72-hour job offer email with an acceptance token to an applicant',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Applicant's full name" },
          email: { type: 'string', description: "Applicant's email address" },
        },
        required: ['name', 'email'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_booking_link',
      description: 'Send a booking link email so an applicant can schedule their screening call',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Applicant's full name" },
          email: { type: 'string', description: "Applicant's email address" },
        },
        required: ['name', 'email'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_no_show_email',
      description: "Send a follow-up email to an applicant who missed their scheduled screening call",
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Applicant's full name" },
          email: { type: 'string', description: "Applicant's email address" },
        },
        required: ['name', 'email'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_offer_reminder',
      description: "Send a reminder email to an applicant whose 72-hour offer is about to expire",
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Applicant's full name" },
          email: { type: 'string', description: "Applicant's email address" },
        },
        required: ['name', 'email'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_trial_reminder',
      description: "Send a reminder email to a rep who hasn't submitted their trial task yet",
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Rep's full name" },
          email: { type: 'string', description: "Rep's email address" },
        },
        required: ['name', 'email'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'change_applicant_status',
      description: "Manually change an applicant's pipeline status",
      parameters: {
        type: 'object',
        properties: {
          applicant_id: { type: 'string', description: "The applicant's Firestore document ID" },
          status: {
            type: 'string',
            enum: ['pending', 'email_sent', 'booked', 'screened', 'offered', 'accepted', 'declined', 'no_show', 'rejected'],
            description: 'The new status to set',
          },
        },
        required: ['applicant_id', 'status'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_custom_message',
      description: 'Send a fully custom branded email to anyone — use when Obi wants to write a personal or one-off message that is not covered by the other email tools',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Recipient's full name" },
          email: { type: 'string', description: "Recipient's email address" },
          subject: { type: 'string', description: 'Email subject line' },
          body: { type: 'string', description: 'The main body of the email in plain text — will be formatted into paragraphs automatically. Write naturally, no HTML.' },
        },
        required: ['name', 'email', 'subject', 'body'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'request_confirmation',
      description: 'Use this BEFORE executing any action that sends an email, creates an account, or changes data. Describe clearly what you are about to do and ask the user to confirm.',
      parameters: {
        type: 'object',
        properties: {
          description: { type: 'string', description: 'Plain-English description of the action, e.g. "Send a job offer to Sarah (sarah@gmail.com)"' },
          tool_to_run: { type: 'string', description: 'The name of the tool to run after confirmation' },
          tool_args: { type: 'object', description: 'The arguments to pass to that tool after confirmation' },
          email_preview: {
            type: 'object',
            description: 'For email actions only — a preview of the email that will be sent',
            properties: {
              subject: { type: 'string', description: 'The email subject line' },
              to: { type: 'string', description: 'Recipient email address' },
              summary: { type: 'string', description: 'A 2–3 sentence plain-text summary of the email body' },
            },
          },
        },
        required: ['description', 'tool_to_run', 'tool_args'],
      },
    },
  },
];

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      case 'get_business_summary': {
        const [applicantsSnap, repsSnap] = await Promise.all([
          adminDb.collection('applicants').get(),
          adminDb.collection('reps').get(),
        ]);

        const statusCounts: Record<string, number> = {};
        applicantsSnap.docs.forEach(d => {
          const s = d.data().status || 'unknown';
          statusCounts[s] = (statusCounts[s] || 0) + 1;
        });

        const repStatusCounts: Record<string, number> = {};
        repsSnap.docs.forEach(d => {
          const s = d.data().status || 'unknown';
          repStatusCounts[s] = (repStatusCounts[s] || 0) + 1;
        });

        const applicantBreakdown = Object.entries(statusCounts)
          .map(([s, n]) => `  ${s}: ${n}`)
          .join('\n');
        const repBreakdown = Object.entries(repStatusCounts)
          .map(([s, n]) => `  ${s}: ${n}`)
          .join('\n') || '  none';

        return `Business summary:\n\nApplicants (${applicantsSnap.size} total):\n${applicantBreakdown || '  none'}\n\nReps (${repsSnap.size} total):\n${repBreakdown}`;
      }

      case 'list_applicants': {
        const snap = await adminDb.collection('applicants').orderBy('createdAt', 'desc').limit(25).get();
        if (snap.empty) return 'No applicants found.';
        const rows = snap.docs.map(d => {
          const a = d.data();
          return `• ${a.name} (${a.email}) | ${a.status} | rating ${a.rating}/5 | ID: ${d.id}`;
        });
        return `${snap.size} applicant${snap.size !== 1 ? 's' : ''}:\n${rows.join('\n')}`;
      }

      case 'list_reps': {
        const snap = await adminDb.collection('reps').get();
        if (snap.empty) return 'No reps found.';
        const rows = snap.docs.map(d => {
          const r = d.data();
          return `• ${r.name} (${r.email}) | ${r.status} | ${r.commissionRate}% commission`;
        });
        return `${snap.size} rep${snap.size !== 1 ? 's' : ''}:\n${rows.join('\n')}`;
      }

      case 'send_offer': {
        const { sendOffer } = await import('@/app/actions/sendOffer');
        // Look up applicant by email so status gets updated to 'offered'
        const emailKey = (args.email as string).trim().toLowerCase();
        const snap = await adminDb.collection('applicants')
          .where('email', '==', emailKey).limit(1).get();
        const applicantId = snap.empty ? undefined : snap.docs[0].id;
        const result = await sendOffer(args.name as string, args.email as string, applicantId);
        return result.success
          ? `Offer sent to ${args.name} (${args.email}). They have 72 hours to accept.`
          : `Failed to send offer: ${result.error}`;
      }

      case 'send_booking_link': {
        const { sendBookingLink } = await import('@/app/actions/sendBookingLink');
        const result = await sendBookingLink(args.name as string, args.email as string);
        return result.success
          ? `Booking link sent to ${args.name} (${args.email}).`
          : `Failed to send booking link: ${result.error}`;
      }

      case 'send_no_show_email': {
        const { sendCustomEmail } = await import('@/app/actions/sendCustomEmail');
        const n = args.name as string;
        const firstName = n.split(' ')[0];
        const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">It looks like we missed each other on the call earlier today.</p>
        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">Happy to reschedule if you're still interested — just reply and let me know a time that works, or use the link below to pick a new slot.</p>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">If you're no longer looking, no worries — just let me know and I'll close your application.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
        <p style="margin:0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
        const result = await sendCustomEmail(
          args.name as string,
          args.email as string,
          'CrftdWeb — Missed call',
          html,
        );
        return result.success ? `No-show email sent to ${args.name}.` : `Failed: ${result.error}`;
      }

      case 'send_offer_reminder': {
        const { sendCustomEmail } = await import('@/app/actions/sendCustomEmail');
        const n = args.name as string;
        const firstName = n.split(' ')[0];
        const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Just checking you received the offer email I sent — the link expires soon, so wanted to make sure it didn't land in your spam.</p>
        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">If you have any questions before accepting, just reply and I'll answer them directly.</p>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">If you'd like to pass, no problem — just let me know so I can move forward with other candidates.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
        <p style="margin:0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
        const result = await sendCustomEmail(
          args.name as string,
          args.email as string,
          'Re: CrftdWeb offer — just checking in',
          html,
        );
        return result.success ? `Offer reminder sent to ${args.name}.` : `Failed: ${result.error}`;
      }

      case 'send_trial_reminder': {
        const { sendCustomEmail } = await import('@/app/actions/sendCustomEmail');
        const n = args.name as string;
        const firstName = n.split(' ')[0];
        const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">Just a quick nudge on the trial task I sent over — are you still planning to submit?</p>
        <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">It shouldn't take long — just 5 businesses with a bad website and one specific sentence each. There's no right or wrong, I'm just looking for how you think.</p>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.6;">If you're no longer interested, no worries — just let me know.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
        <p style="margin:0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
        const result = await sendCustomEmail(
          args.name as string,
          args.email as string,
          'Re: CrftdWeb trial task',
          html,
        );
        return result.success ? `Trial reminder sent to ${args.name}.` : `Failed: ${result.error}`;
      }

      case 'send_custom_message': {
        const { sendCustomEmail } = await import('@/app/actions/sendCustomEmail');
        const n = args.name as string;
        const firstName = n.split(' ')[0];
        const bodyText = args.body as string;
        // Split on double newlines or single newlines for paragraphs
        const paragraphs = bodyText.split(/\n{1,}/).map(p => p.trim()).filter(Boolean);
        const bodyHtml = paragraphs.map(p =>
          `<p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">${p}</p>`
        ).join('\n        ');
        const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="background:#000000;border-radius:12px 12px 0 0;padding:32px 40px;">
        <img src="https://crftdweb.com/CW-logo-white.png" alt="CrftdWeb" width="160" style="display:block;border:0;border-radius:8px;" />
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:40px;">
        <p style="margin:0 0 16px;font-size:16px;color:#111;font-weight:600;">Hi ${firstName},</p>
        ${bodyHtml}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-top:1px solid #e8e8e8;"></td></tr></table>
        <img src="https://crftdweb.com/CW-logo.png" alt="CrftdWeb" width="48" style="display:block;border:0;margin-bottom:8px;" />
        <p style="margin:0;font-size:13px;color:#999;">crftdweb.com &middot; admin@crftdweb.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
        const result = await sendCustomEmail(
          args.name as string,
          args.email as string,
          args.subject as string,
          html,
        );
        return result.success ? `Email sent to ${args.name} (${args.email}).` : `Failed: ${result.error}`;
      }

      case 'change_applicant_status': {
        await adminDb
          .collection('applicants')
          .doc(args.applicant_id as string)
          .update({ status: args.status });
        return `Status updated to "${args.status}" for applicant ${args.applicant_id}.`;
      }

      case 'request_confirmation': {
        // Stored by runAssistant before calling executeTool — this case should not be reached directly
        return `Confirmation requested: ${args.description}`;
      }

      default:
        return `Unknown function: ${name}`;
    }
  } catch (err) {
    console.error(`[assistant] tool error in ${name}:`, err);
    return `Error running ${name}: ${err instanceof Error ? err.message : 'unknown error'}`;
  }
}

// ─── Pending confirmation store (Firestore) ───────────────────────────────────

interface PendingAction {
  toolName: string;
  toolArgs: Record<string, unknown>;
  description: string;
  expiresAt: string;
}

async function getPending(chatId: number): Promise<PendingAction | null> {
  const doc = await adminDb.collection('telegramPending').doc(String(chatId)).get();
  if (!doc.exists) return null;
  const data = doc.data() as PendingAction;
  if (new Date(data.expiresAt) < new Date()) {
    await doc.ref.delete();
    return null;
  }
  return data;
}

async function setPending(chatId: number, action: Omit<PendingAction, 'expiresAt'>): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min
  await adminDb.collection('telegramPending').doc(String(chatId)).set({ ...action, expiresAt });
}

async function clearPending(chatId: number): Promise<void> {
  await adminDb.collection('telegramPending').doc(String(chatId)).delete();
}

// ─── Conversation history store (Firestore) ───────────────────────────────────

const HISTORY_LIMIT = 10;
const HISTORY_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

async function getHistory(chatId: number): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> {
  const doc = await adminDb.collection('telegramHistory').doc(String(chatId)).get();
  if (!doc.exists) return [];
  const { messages } = doc.data() as { messages: HistoryMessage[] };
  const cutoff = new Date(Date.now() - HISTORY_TTL_MS).toISOString();
  return messages
    .filter(m => m.timestamp > cutoff)
    .map(m => ({ role: m.role, content: m.content }));
}

async function appendHistory(chatId: number, userMessage: string, assistantReply: string): Promise<void> {
  const ref = adminDb.collection('telegramHistory').doc(String(chatId));
  const doc = await ref.get();
  const cutoff = new Date(Date.now() - HISTORY_TTL_MS).toISOString();
  const existing: HistoryMessage[] = doc.exists
    ? ((doc.data() as { messages: HistoryMessage[] }).messages ?? []).filter(m => m.timestamp > cutoff)
    : [];
  const now = new Date().toISOString();
  const updated = [
    ...existing,
    { role: 'user' as const, content: userMessage, timestamp: now },
    { role: 'assistant' as const, content: assistantReply, timestamp: now },
  ].slice(-HISTORY_LIMIT);
  await ref.set({ messages: updated });
}

const CONFIRM_WORDS = /^(yes|yeah|yep|go ahead|do it|confirm|ok|okay|sure|yup|absolutely|correct|send it|do that)$/i;

export async function runAssistant(userMessage: string, chatId: number): Promise<string> {
  // ─── Check for a pending confirmation ────────────────────────────────────────
  if (CONFIRM_WORDS.test(userMessage.trim())) {
    const pending = await getPending(chatId);
    if (pending) {
      await clearPending(chatId);
      const result = await executeTool(pending.toolName, pending.toolArgs);
      return result;
    }
  }

  // If user says no / cancel, clear any pending action
  if (/^(no|nope|cancel|never mind|forget it|don't|stop)$/i.test(userMessage.trim())) {
    const pending = await getPending(chatId);
    if (pending) {
      await clearPending(chatId);
      return `OK, cancelled. ${pending.description} — not sent.`;
    }
  }
  const history = await getHistory(chatId);
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are an AI business assistant for CrftdWeb, a web design agency based in Bristol, UK. You help the founder Obi (Obinna Eze-Elijah) manage his business operations via Telegram.

Be concise, friendly, and use British English. When listing data, format it clearly. If something is ambiguous, ask a clarifying question before acting.

You can send emails to anyone Obi asks — personal, professional, or follow-up. Use send_custom_message for any email that isn't covered by the other templates. Never refuse an email request on the grounds that it isn't "business-related" — Obi is the founder and decides what's relevant.

IMPORTANT — confirmation rule: Before calling any tool that sends an email, changes data, or takes an action (send_offer, send_booking_link, send_no_show_email, send_offer_reminder, send_trial_reminder, send_custom_message, change_applicant_status), you MUST first call request_confirmation. Always populate the email_preview field for email actions with the subject line, recipient email, and a 2–3 sentence plain-text summary of what the email says. NEVER call action tools directly without confirmation first. Read-only tools (get_business_summary, list_applicants, list_reps) do NOT need confirmation.

Today is ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

══════════════════════════════════════════
CRFTDWEB — FULL BUSINESS KNOWLEDGE
══════════════════════════════════════════

COMPANY
- Name: CrftdWeb
- Founder: Obinna Eze-Elijah (Obi)
- Location: Bristol, UK
- Contact: admin@crftdweb.com
- Website: crftdweb.com
- Rep portal: crftdweb.com/rep/signin
- Jurisdiction: England and Wales
- Positioning: Hand-coded, conversion-first websites for SMBs. Not a template agency. Premium end of market. "Most business websites look fine and do nothing. We fix that."

PRICING PACKAGES
1. Starter — £997 | 1–2 weeks | 1 custom-coded landing page, mobile-responsive, 1 CTA, basic SEO, contact form, 14-day delivery
2. Launch — £2,497 | 2–3 weeks | 5-page custom-coded website, full SEO foundations, Google Analytics, 30-day support
3. Growth — £4,997 | 3–5 weeks | Up to 10 pages, online booking integration, blog with CMS, advanced analytics, 90-day support
4. Scale — £9,997+ | 6–12 weeks | Unlimited pages, custom features/portals/dashboards, API integrations, full brand system, 12-month partnership
All packages: 100% money-back guarantee, custom code (no WordPress/templates), free SSL, Vercel hosting, full client ownership.
Payment: 50% deposit to start, 50% on launch. Site does not go live until final payment received.

COMMISSION STRUCTURE (rank-based)
Commission depends on the rep's career rank and the package tier:
- Bronze (trial): 0% — must complete training before earning commission
- Silver: 20% Starter / 15% Launch / 12% Growth / 10% Scale
- Gold: 22% / 17% / 14% / 12%
- Diamond: 25% / 20% / 17% / 15%
- Closer: 27% / 22% / 19% / 17%
- Master: 30% / 25% / 22% / 20%
- Dragon: 35% / 30% / 25% / 22%
- Paid within 7 days of client deposit clearing, via bank transfer
- Full commission paid even on payment plans; if client cancels before work starts, commission returned
- No cap on commissions

CAREER RANKS (7 ranks)
- 🥉 Bronze: Trial period. Complete training, prove activity. 0% commission.
- 🥈 Silver: First closed deal. Commission 10–20%.
- 🥇 Gold: 3+ closed deals, consistent activity. Commission 12–22%.
- 💎 Diamond: 5+ deals, mentoring others. Commission 15–25%.
- 🎯 Closer: 10+ deals, handles full sales cycle. Commission 17–27%.
- 🔥 Master: 20+ deals, team leader. Commission 20–30%.
- 🐉 Dragon: 50+ deals, £50k+ revenue generated. Commission 22–35%.
Progression is based on results, not time served.

REP SALES PIPELINE (statuses in order)
pending → email_sent → booked → screened → offered → accepted
After accepted: status = 'trial', careerRank = 'bronze' (0% commission until training complete).

REP ROLE
- Core job: Find businesses that need websites, qualify them, book 15-min discovery calls with CrftdWeb. Obi closes the deal.
- Reps do NOT close, negotiate pricing, or make design decisions.
- Activity minimums (first 30 days): 20+ outreach attempts/day, 5 real conversations/day, 1–2 discovery calls/week.
- High performers: 50+ outreach/day, 3–5 calls booked/week.
- Funnel: 100 outreach → 10 real conversations → 1–2 booked calls → ~1 deal closes at 40% rate.

TRIAL TASK
- Find 5 UK businesses with bad websites; for each write one specific sentence explaining why it needs a redesign.
- Bad example: "it looks old" — NOT accepted.
- Good examples: "No mobile version — the site breaks on any phone." / "No contact number visible above the fold despite being a service business."
- Submission form: crftdweb.com/apply/trial
- Time limit: 48 hours
- Pass rate: ~20%

ONBOARDING FLOW (after offer accepted)
1. Firebase Auth account created automatically with temp password
2. Login credentials emailed to rep
3. Rep logs in at /rep/signin
4. Completes training (must score 60+ avg across 6 categories to unlock)
5. Training categories: Discovery, Listening, Objection Handling, Closing, Rapport, Control
6. After training unlock: accesses full portal (leads, audit tool, live call assistant, resources)

REP PORTAL PAGES
- Dashboard: stats (active leads, deals won, commissions, referral link)
- My Leads: Kanban pipeline (contacted → interested → call_booked → proposal_sent → won/lost)
- Training (/train/roleplay): AI roleplay with 6-category scoring, Auto mode (hands-free mic)
- Live Call Assistant (/call): real-time call support, transcribes live, suggests talking points (locked until training unlocked)
- Site Audit (/audit): enter prospect URL → instant performance/SEO/speed audit via PageSpeed
- Resources: scripts, objection guides, outreach templates, commission calculator, daily targets
- Commissions: live view with Pending/Paid status

COLD CALL OPENERS
Option 1 (Direct): "Hi [Name], this is [Your Name] from CrftdWeb. I help businesses like yours get more customers through their website. I'm not trying to sell you anything right now — I just had a quick question. Do you currently have a website for [their business]?"
Option 2 (Observation): "Hi [Name], I came across [their business] and noticed you don't seem to have a website — or the current one might not be doing you justice. We work with businesses in [their industry] to fix exactly that. Worth a 15-minute chat?"

KEY OBJECTION RESPONSES
- "I already have a website" → "Is it bringing you the customers you want? The difference is ours are built to convert, not just exist."
- "How much does it cost?" → "Starter is £997 for a landing page, up to full multi-page sites. The discovery call is free — 15 minutes and we'll give you an honest answer."
- "I can get one cheaper on Wix" → "You can — but those sites don't rank on Google or convert visitors. Ours are hand-coded, SEO-optimised, built around your business goals."
- "I need to think about it" → "I'll send the proposal over so you've got something concrete to look at."
- "I'm too busy" → "That's exactly why having a site that works for you matters — it brings leads while you're busy. Can we lock in 15 minutes next week?"

TARGET CLIENTS
- UK SMBs in any industry (trades, services, gyms, tutoring, SaaS, startups, e-commerce)
- No website or outdated site that isn't converting
- Decision-maker (owner), serious about growth
- AVOID: anyone asking for under £500, new site (built last month), delayed decision-making

DISCOVERY CALL STRUCTURE (20–30 min)
1. Open (2 min): Make comfortable, set agenda
2. Diagnose (7 min): Ask about business, current site, pain points, goals, timeline
3. Reflect back (2 min): Summarise what you heard
4. Present solution (4 min): Name package, explain why it fits their situation
5. Handle objections (5 min)
6. Close (2 min): "I'll send proposal today" — always follow up same day

REP CONDUCT RULES
- Professional representation at all times
- Log all leads and activity in portal in real-time
- Respond to CrftdWeb messages within 24 hours
- No pricing commitments without CrftdWeb confirmation
- No mass-spamming or misrepresenting services
- 2+ weeks under 50 outreaches = review + potential termination
══════════════════════════════════════════`,
    },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools,
    tool_choice: 'auto',
  });

  const aiMessage = response.choices[0].message;

  if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
    messages.push(aiMessage);

    for (const toolCall of aiMessage.tool_calls) {
      if (toolCall.type !== 'function') continue;
      const args = JSON.parse(toolCall.function.arguments || '{}') as Record<string, unknown>;

      // Intercept request_confirmation — store the pending action instead of executing
      if (toolCall.function.name === 'request_confirmation') {
        await setPending(chatId, {
          toolName: args.tool_to_run as string,
          toolArgs: args.tool_args as Record<string, unknown>,
          description: args.description as string,
        });

        const preview = args.email_preview as { subject?: string; to?: string; summary?: string } | undefined;
        let previewBlock = '';
        if (preview) {
          previewBlock = `\n📧 <b>Email Preview</b>\n<b>To:</b> ${preview.to ?? '—'}\n<b>Subject:</b> ${preview.subject ?? '—'}\n\n${preview.summary ?? ''}\n`;
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: `Confirmation stored. Reply to the user with exactly this (no extra commentary):\n${previewBlock}\n<b>${args.description}</b> — shall I go ahead?`,
        });
        continue;
      }

      const result = await executeTool(toolCall.function.name, args);
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    const finalResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const reply = finalResponse.choices[0].message.content ?? 'Done.';
    await appendHistory(chatId, userMessage, reply);
    return reply;
  }

  const reply = aiMessage.content ?? "I'm not sure how to help with that. Try asking about applicants, reps, or sending an email.";
  await appendHistory(chatId, userMessage, reply);
  return reply;
}
