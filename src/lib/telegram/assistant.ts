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
      name: 'request_confirmation',
      description: 'Use this BEFORE executing any action that sends an email, creates an account, or changes data. Describe clearly what you are about to do and ask the user to confirm.',
      parameters: {
        type: 'object',
        properties: {
          description: { type: 'string', description: 'Plain-English description of the action, e.g. "Send a job offer to Sarah (sarah@gmail.com)"' },
          tool_to_run: { type: 'string', description: 'The name of the tool to run after confirmation' },
          tool_args: { type: 'object', description: 'The arguments to pass to that tool after confirmation' },
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
        const result = await sendOffer(args.name as string, args.email as string);
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
        const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111;padding:32px;">
<p>Hi ${args.name},</p>
<p>We noticed you missed your scheduled call. No worries — just reply to this email and we'll find a new time that works for you.</p>
<p>Looking forward to speaking soon.</p>
<p>— CrftdWeb</p>
</body></html>`;
        const result = await sendCustomEmail(
          args.name as string,
          args.email as string,
          'CrftdWeb — Missed your call',
          html,
        );
        return result.success ? `No-show email sent to ${args.name}.` : `Failed: ${result.error}`;
      }

      case 'send_offer_reminder': {
        const { sendCustomEmail } = await import('@/app/actions/sendCustomEmail');
        const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111;padding:32px;">
<p>Hi ${args.name},</p>
<p>Just a quick reminder — your CrftdWeb offer expires in <strong>24 hours</strong>.</p>
<p>Check your inbox for the original offer email and click <strong>Accept Offer</strong> before it expires.</p>
<p>— CrftdWeb</p>
</body></html>`;
        const result = await sendCustomEmail(
          args.name as string,
          args.email as string,
          'CrftdWeb — Your offer expires soon',
          html,
        );
        return result.success ? `Offer reminder sent to ${args.name}.` : `Failed: ${result.error}`;
      }

      case 'send_trial_reminder': {
        const { sendCustomEmail } = await import('@/app/actions/sendCustomEmail');
        const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111;padding:32px;">
<p>Hi ${args.name},</p>
<p>Just checking in — your trial task submission is due soon. Log in to your rep portal to complete and submit it.</p>
<p>If you have any questions, reply to this email.</p>
<p>— CrftdWeb</p>
</body></html>`;
        const result = await sendCustomEmail(
          args.name as string,
          args.email as string,
          'CrftdWeb — Trial task reminder',
          html,
        );
        return result.success ? `Trial reminder sent to ${args.name}.` : `Failed: ${result.error}`;
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
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are an AI business assistant for CrftdWeb, a web design agency based in Bristol, UK. You help the founder Obi manage his business operations via Telegram.

Be concise, friendly, and use British English. When listing data, format it clearly. If something is ambiguous, ask a clarifying question before acting.

IMPORTANT — confirmation rule: Before calling any tool that sends an email, changes data, or takes an action (send_offer, send_booking_link, send_no_show_email, send_offer_reminder, send_trial_reminder, change_applicant_status), you MUST first call request_confirmation with a plain-English description of what you're about to do. NEVER call action tools directly without confirmation first. Read-only tools (get_business_summary, list_applicants, list_reps) do NOT need confirmation.

Today is ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

The sales rep pipeline order is: pending → email_sent → booked → screened → offered → accepted.`,
    },
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
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: `Confirmation stored. Tell the user: "${args.description} — shall I go ahead?"`,
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

    return finalResponse.choices[0].message.content ?? 'Done.';
  }

  return aiMessage.content ?? "I'm not sure how to help with that. Try asking about applicants, reps, or sending an email.";
}
