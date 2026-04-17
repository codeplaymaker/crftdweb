/**
 * Rep Email — Types
 * Follow-up email system for CrftdWeb sales reps.
 */

export type EmailTemplateKey =
  | 'call_booked'
  | 'follow_up_no_reply'
  | 'after_portfolio'
  | 'nudge_to_book'
  | 'proposal_follow_up'
  | 'soft_check_in'
  | 'custom';

export interface EmailTemplate {
  key: EmailTemplateKey;
  label: string;
  subject: string;
  /** Body with placeholders: {{contactName}}, {{repName}}, {{businessName}} */
  body: string;
}

export interface RepEmailLog {
  id: string;
  repId: string;
  repName: string;
  leadId: string;
  businessName: string;
  recipientEmail: string;
  templateKey: EmailTemplateKey;
  subject: string;
  body: string;
  resendId: string | null;
  status: 'sent' | 'failed';
  error?: string;
  sentAt: import('firebase/firestore').Timestamp;
  repliedAt?: import('firebase/firestore').Timestamp | null;
  openedAt?: import('firebase/firestore').Timestamp | null;
  clickedAt?: import('firebase/firestore').Timestamp | null;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: 'call_booked',
    label: 'After Booking a Call',
    subject: 'Your call with CrftdWeb is confirmed',
    body: `Just confirming your free 15-minute consultation with CrftdWeb.

What to expect:
The site will be reviewed before the call
You'll get straight feedback on what's working and what isn't
If there's a fit, you'll hear exactly what we'd build and what it would cost

No pressure, no hard sell.

Talk soon,`,
  },
  {
    key: 'follow_up_no_reply',
    label: 'Follow-up (No Reply)',
    subject: 'Re: your website',
    body: `Tried you on the phone earlier, just wanted to pass this across.

We build sites for businesses like {{businessName}} that are designed to bring in actual enquiries, not just look decent.

If you've got 15 minutes in the next few days, happy to set up a free consultation. We'll be straight with you about whether it makes sense for your business.

Worth it?`,
  },
  {
    key: 'after_portfolio',
    label: 'After Sending Portfolio',
    subject: 'Examples from CrftdWeb',
    body: `Here are a few recent sites we've built: crftdweb.com/work

The process is quick, most sites are live in 2 to 5 weeks. Starting from £997 for a landing page.

If anything looks relevant to what you're after, I can get you a free 15-minute consultation this week.`,
  },
  {
    key: 'nudge_to_book',
    label: 'Nudge to Book Call',
    subject: 'Free 15-min call this week?',
    body: `You mentioned you were interested in sorting the website out — just wanted to make it easy.

I've set aside a few 15-minute slots this week for a free consultation. No pitch, just a straight look at what's working and what could be better.

Worth a quick chat?`,
  },
  {
    key: 'proposal_follow_up',
    label: 'Proposal Follow-up',
    subject: 'Re: your proposal from CrftdWeb',
    body: `Just checking in — did you get a chance to look over the proposal?

Happy to jump on a quick call if anything needs clarifying. No rush, but I'd rather you had all the info before making a decision.

Let me know either way.`,
  },
  {
    key: 'soft_check_in',
    label: 'Soft Check-in',
    subject: 'Quick one about {{businessName}}',
    body: `It's been a little while since we last spoke — just wanted to check in.

If the website is still on your radar, we're here. If the timing isn't right, no problem at all — just reply whenever you're ready and we'll pick up where we left off.

Either way, hope business is going well.`,
  },
];
