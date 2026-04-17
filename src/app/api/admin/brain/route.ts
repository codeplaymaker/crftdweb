import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token === process.env.ADMIN_TOKEN;
}

async function getBusinessSnapshot() {
  const now = new Date();

  const [repsSnap, applicantsSnap, clientsSnap, leadsSnap, commissionsSnap, trialsSnap] =
    await Promise.all([
      adminDb.collection('reps').get(),
      adminDb.collection('applicants').get(),
      adminDb.collection('clients').get(),
      adminDb.collection('repLeads').orderBy('createdAt', 'desc').limit(100).get(),
      adminDb.collection('repCommissions').where('status', '==', 'pending').get(),
      adminDb.collection('trial_submissions').get(),
    ]);

  // ── Reps ──────────────────────────────────────────────────────────────
  const reps = repsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record<string, unknown>));
  const activeReps = reps.filter(r => r.status === 'active');
  const inactiveReps = reps.filter(r => r.status !== 'active');

  // ── Applicants ────────────────────────────────────────────────────────
  const applicants = applicantsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record<string, unknown>));
  const byStatus = (s: string) => applicants.filter(a => a.status === s);

  const staleChaseable = applicants.filter(a => {
    if (a.status !== 'trial_sent' || !a.emailSentAt) return false;
    const sentAt = new Date(a.emailSentAt as string);
    return (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24) > 3;
  });

  const staleDesc = staleChaseable.length
    ? staleChaseable
        .map(a => {
          const days = Math.round(
            (now.getTime() - new Date(a.emailSentAt as string).getTime()) / (1000 * 60 * 60 * 24)
          );
          return `${a.name} (${days}d ago)`;
        })
        .join(', ')
    : 'None';

  // ── Trial submissions ─────────────────────────────────────────────────
  const trials = trialsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record<string, unknown>));
  const unreviewedTrials = trials.filter(t => !t.reviewed);

  // ── Clients ───────────────────────────────────────────────────────────
  const clients = clientsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record<string, unknown>));
  const activeClients = clients.filter(c => c.status === 'active');

  // ── Leads ─────────────────────────────────────────────────────────────
  const leads = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record<string, unknown>));
  const openLeads = leads.filter(l => l.status === 'open' || l.status === 'contacted' || l.status === 'pending');
  const closedLeads = leads.filter(l => l.status === 'closed' || l.status === 'won');

  // ── Commissions ───────────────────────────────────────────────────────
  const pendingComms = commissionsSnap.docs.map(d => d.data() as Record<string, unknown>);
  const pendingCommTotal = pendingComms.reduce((sum, c) => sum + ((c.commissionAmount as number) || 0), 0);

  return {
    reps: {
      total: reps.length,
      active: activeReps.length,
      inactive: inactiveReps.length,
      activeNames: activeReps.map(r => r.name || 'Unknown').join(', ') || 'None',
    },
    applicants: {
      total: applicants.length,
      pending: byStatus('pending').length,
      booked: byStatus('booked').length,
      trialSent: byStatus('trial_sent').length,
      staleCount: staleChaseable.length,
      staleDesc,
    },
    trials: {
      total: trials.length,
      unreviewed: unreviewedTrials.length,
    },
    clients: {
      total: clients.length,
      active: activeClients.length,
    },
    leads: {
      total: leads.length,
      open: openLeads.length,
      closed: closedLeads.length,
    },
    commissions: {
      pendingCount: pendingComms.length,
      pendingTotal: pendingCommTotal,
    },
  };
}

// ─── Static business context ──────────────────────────────────────────────────
const BUSINESS_CONTEXT = `You are the Business Brain for CrftdWeb — a UK web agency founded and run by Obinna Eze-Elijah (known as Obi).

## THE BUSINESS
CrftdWeb builds hand-coded, high-performance websites for UK SMBs. No templates, no Wix, no page builders. Everything is custom-built for speed, SEO, and conversion.
Target market: UK businesses with bad, slow, or outdated websites — especially trades, service businesses, and local SMBs.

## SERVICES & PRICING
- Starter Site: £997 — 3–5 pages, fast, mobile-ready, SEO-optimised. Delivered in ~2 weeks.
- Launch Site: £2,497 — 5–8 pages, advanced SEO, conversion-focused.
- Growth Site: £4,997 — Full lead generation, CRM integrations.
- Scale Site: £9,997 — Enterprise-level, full digital presence.

## SALES REP MODEL
Commission-only reps find leads, CrftdWeb closes and builds, reps get paid:
- Starter deal: £199 commission (20%)
- Launch deal: £375 commission (15%)
- Growth deal: £600 commission (12%)
- Scale deal: £1,000 commission (10%)

Rep pipeline: Applied → Screened → Trial task sent → Trial submitted → Active rep

## OBINNA'S SITUATION
Obi runs the business solo. He juggles: client delivery, rep recruiting & management, content (TikTok/IG), admin, and sales — all at once. His biggest struggle is knowing what to prioritise when everything feels urgent.
His goal: 5+ active reps generating consistent deal flow, while delivering excellent client work and growing the brand online.

## YOUR ROLE
You are Obinna's business co-pilot and strategic brain. You have full access to live CRM data.
- Be direct, specific, and actionable. No vague advice. Never say "consider doing X" — say "do X, here's why."
- When you see problems in the data (stale leads, unreviewed trials, inactive reps), name them specifically.
- Prioritise by revenue impact and momentum.
- Think like a business partner who's invested in this working, not a polite assistant.
- Keep responses tight and structured. Use numbered lists for action items, short paragraphs for context.
- You can help with: daily/weekly prioritisation, rep management, client strategy, content direction, pricing, hiring, and anything else business-related.`;

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array required' }, { status: 400 });
  }

  // Fetch live snapshot
  const snapshot = await getBusinessSnapshot();

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const liveContext = `## LIVE CRM SNAPSHOT — ${dateStr}

### Rep Pipeline
- Total reps on file: ${snapshot.reps.total}
- Active reps: ${snapshot.reps.active} — ${snapshot.reps.activeNames}
- Inactive / off-board: ${snapshot.reps.inactive}

### Applicant Pipeline
- Total applicants: ${snapshot.applicants.total}
- Pending review: ${snapshot.applicants.pending}
- Booking links sent (awaiting screening call): ${snapshot.applicants.booked}
- Trial tasks sent (awaiting submission): ${snapshot.applicants.trialSent}
- STALE — trial sent 3+ days ago, no response: ${snapshot.applicants.staleCount} → ${snapshot.applicants.staleDesc}

### Trial Submissions
- Total trial tasks submitted: ${snapshot.trials.total}
- Awaiting your review: ${snapshot.trials.unreviewed}

### Clients
- Total clients: ${snapshot.clients.total}
- Active projects: ${snapshot.clients.active}

### Lead Pipeline (submitted by reps)
- Total leads: ${snapshot.leads.total}
- Open / in progress: ${snapshot.leads.open}
- Closed / won: ${snapshot.leads.closed}

### Commissions
- Pending payment: ${snapshot.commissions.pendingCount} commissions
- Total pending value: £${snapshot.commissions.pendingTotal.toLocaleString()}`;

  const systemPrompt = `${BUSINESS_CONTEXT}\n\n${liveContext}`;

  const oaiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: oaiMessages,
      stream: true,
      temperature: 0.65,
      max_tokens: 1400,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('OpenAI error:', errText);
    return NextResponse.json({ error: 'OpenAI request failed' }, { status: 500 });
  }

  return new NextResponse(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
