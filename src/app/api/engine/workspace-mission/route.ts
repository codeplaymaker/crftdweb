import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, unauthorizedResponse } from '@/lib/engine/auth-guard';
import { adminDb } from '@/lib/firebase/admin';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Execution-mode prompts — these produce complete deliverables, not conversation
const EXECUTION_PROMPTS: Record<string, string> = {
  'offer-architect': `You are an expert high-ticket offer designer with 15+ years of experience. You produce complete, client-specific offer assets. When given a mission, execute it fully — write the actual copy, frameworks, or documents requested. Do not ask clarifying questions. Use the client context to make everything specific and named.`,

  'vsl-builder': `You are a Video Sales Letter copywriting expert who has written scripts generating millions in revenue. You write complete, ready-to-record VSL scripts. When given a mission, produce the full script — hook, story, problem, solution, proof, offer, CTA — using the client context to make everything specific. No frameworks or outlines. The actual script.`,

  'ads-architect': `You are a paid advertising copy expert specialising in high-ticket offer campaigns. You produce complete, ready-to-run ad copy. When given a mission, write the actual ads — primary text, headlines, descriptions, variations — using the client context for specificity. No theory. The actual ads.`,

  'sales-asset': `You are a content repurposing and sales asset expert. You produce complete, ready-to-use marketing assets. When given a mission, deliver the full asset — every piece of copy, every email, every post — using the client context to make it specific. Not a template. The actual content.`,

  'landing-page': `You are a direct response landing page copywriting expert. You write copy that converts at 20%+. When given a mission, produce the full copy — every section, headline, body copy, CTA — using the client context for specificity. Write as if this page is going live tomorrow.`,

  'research-agent': `You are a business research expert providing comprehensive market intelligence. You produce thorough, actionable research reports. When given a mission, deliver a complete analysis with specific insights, competitor data, and strategic recommendations — not generic observations.`,

  'niche-architect': `You are a niche research and validation expert. You produce thorough niche analyses with actionable recommendations. When given a mission, deliver the complete research: market sizing, competitor analysis, positioning opportunities, and specific next steps.`,

  'category-architect': `You are a market positioning and category design expert. You produce complete positioning frameworks and messaging systems. When given a mission, deliver the full strategy: category name, positioning statement, differentiation narrative, and key messaging — using the client context throughout.`,
};

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) return unauthorizedResponse();

  try {
    const { workspaceId, agentId, task } = await request.json();

    if (!workspaceId || !task?.trim()) {
      return NextResponse.json({ error: 'Workspace ID and task are required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const uid = auth.uid;

    // ── Load workspace (verify ownership) ──────────────────────────────────
    const wsSnap = await adminDb.collection('workspaces').doc(workspaceId).get();
    if (!wsSnap.exists || wsSnap.data()?.userId !== uid) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }
    const workspace = wsSnap.data()!;

    // ── Build system prompt ─────────────────────────────────────────────────
    const basePrompt = EXECUTION_PROMPTS[agentId] || EXECUTION_PROMPTS['research-agent'];

    let systemPrompt = basePrompt + `

--- CLIENT WORKSPACE CONTEXT ---
You are executing a mission inside a client workspace. Everything you produce must be specific to this client — use their name, niche, offer, and audience throughout.

Client: ${workspace.clientName}
Niche: ${workspace.niche || 'Not specified'}
Offer: ${workspace.offer || 'Not specified'}
Target Audience: ${workspace.audience || 'Not specified'}
Goals: ${workspace.goals || 'Not specified'}
Notes: ${workspace.notes || 'None'}
--- END CONTEXT ---

MISSION MODE: Produce the complete deliverable. No preamble, no "here's what I'll do", no asking for more information. Just execute. Use markdown formatting for structure. Make it specific to ${workspace.clientName}, not generic.`;

    // ── Load matching skills ────────────────────────────────────────────────
    try {
      const skillsSnap = await adminDb
        .collection('skills')
        .where('userId', '==', uid)
        .limit(20)
        .get();

      if (!skillsSnap.empty) {
        const contextText = task.toLowerCase();
        const matched: string[] = [];

        skillsSnap.docs.forEach(doc => {
          const skill = doc.data();
          const keywords = (skill.trigger as string).split(',').map((k: string) => k.trim().toLowerCase());
          if (keywords.some(kw => kw.length > 2 && contextText.includes(kw))) {
            matched.push(skill.prompt as string);
          }
        });

        if (matched.length > 0) {
          systemPrompt += `\n\n--- ACTIVE SKILLS ---\n${matched.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}\n--- END SKILLS ---`;
        }
      }
    } catch (e) {
      console.error('Skill load error (non-fatal):', e);
    }

    // ── Run OpenAI ──────────────────────────────────────────────────────────
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `MISSION: ${task}` },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI error on workspace mission');
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // ── Save deliverable ────────────────────────────────────────────────────
    const deliverableRef = adminDb.collection('deliverables').doc();
    const deliverable = {
      id: deliverableRef.id,
      userId: uid,
      workspaceId,
      type: agentId,
      title: task.length > 80 ? task.slice(0, 80) + '…' : task,
      content,
      agentId,
      task,
      createdAt: new Date(),
    };
    await deliverableRef.set(deliverable);

    // ── Update workspace activity + count ───────────────────────────────────
    await adminDb.collection('workspaces').doc(workspaceId).update({
      deliverableCount: (workspace.deliverableCount || 0) + 1,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ deliverable });
  } catch (error) {
    console.error('Workspace mission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
