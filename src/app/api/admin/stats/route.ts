import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [repsSnap, leadsSnap, commissionsSnap, applicantsSnap] = await Promise.all([
    adminDb.collection('reps').where('status', '==', 'active').get(),
    adminDb.collection('repLeads').get(),
    adminDb.collection('repCommissions').where('status', '==', 'pending').get(),
    adminDb.collection('applicants').get(),
  ]);

  const openLeads = leadsSnap.docs.filter(d => {
    const s = d.data().status as string;
    return s !== 'won' && s !== 'lost';
  }).length;

  const pendingCommissionTotal = commissionsSnap.docs.reduce((sum, d) => {
    return sum + (d.data().commissionAmount as number ?? 0);
  }, 0);

  return NextResponse.json({
    activeReps: repsSnap.size,
    openLeads,
    pendingCommissions: commissionsSnap.size,
    pendingCommissionTotal: Math.round(pendingCommissionTotal),
    totalApplicants: applicantsSnap.size,
  });
}
