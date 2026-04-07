/**
 * Rep Email — Types
 * Follow-up email system for CrftdWeb sales reps.
 */

export type EmailTemplateKey =
  | 'call_booked'
  | 'follow_up_no_reply'
  | 'after_portfolio'
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
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: 'call_booked',
    label: 'After Booking a Call',
    subject: 'Your call with CrftdWeb — confirmed',
    body: `Hi {{contactName}},

Just confirming your 15-minute call with the founder of CrftdWeb.

What to expect:
- The site will be reviewed before the call
- You'll get straight feedback on what's working and what isn't
- If there's a fit, you'll hear exactly what we'd build and what it would cost

No pressure, no hard sell.

Talk soon,
{{repName}}
CrftdWeb Rep

crftdweb.com`,
  },
  {
    key: 'follow_up_no_reply',
    label: 'Follow-up (No Reply)',
    subject: 'Re: your website',
    body: `Hi {{contactName}},

Tried you on the phone earlier — just wanted to pass this across.

We build sites for businesses like {{businessName}} that are designed to bring in actual enquiries, not just look decent.

If you've got 15 minutes in the next few days, happy to get you a call with the founder — he'll be honest about whether it makes sense for your business.

Worth it?

{{repName}}`,
  },
  {
    key: 'after_portfolio',
    label: 'After Sending Portfolio',
    subject: 'Examples from CrftdWeb',
    body: `Hi {{contactName}},

Here are a few recent sites we've built: crftdweb.com/work

The process is quick — most sites are live in 2–5 weeks. Starting from £1,200 for a landing page.

If anything looks relevant to what you're after, I can get you 15 minutes with the founder this week.

{{repName}}`,
  },
];
