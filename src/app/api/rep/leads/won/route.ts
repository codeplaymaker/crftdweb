/**
 * API Route: Rep Lead — Mark Won
 * Updates lead status + dealValue and creates a commission record.
 * Must run server-side because repCommissions is write-blocked on the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getCommissionRateForRank, type CareerRank } from '@/lib/types/repRanks';

export async function POST(req: NextRequest) {
  // Verify Firebase ID token from Authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let uid: string;
  try {
    const token = authHeader.slice(7);
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { leadId, dealValue } = await req.json();

  if (!leadId || typeof dealValue !== 'number' || dealValue <= 0) {
    return NextResponse.json({ error: 'leadId and a positive dealValue are required' }, { status: 400 });
  }

  // Verify the lead belongs to this rep
  const leadDoc = await adminDb.collection('repLeads').doc(leadId).get();
  if (!leadDoc.exists || leadDoc.data()?.repId !== uid) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const lead = leadDoc.data()!;

  // Fetch the rep profile to get careerRank (or fallback commissionRate)
  const repDoc = await adminDb.collection('reps').doc(uid).get();
  const repData = repDoc.data();
  const careerRank: CareerRank = (repData?.careerRank as CareerRank) || 'silver';
  const commissionRate = getCommissionRateForRank(careerRank, dealValue);

  const commissionAmount = Math.round((dealValue * commissionRate) / 100);

  // Guard: don't create a duplicate commission if one already exists for this lead
  const existingComm = await adminDb
    .collection('repCommissions')
    .where('leadId', '==', leadId)
    .limit(1)
    .get();

  if (!existingComm.empty) {
    // Just update the lead detail (deal value may have changed) but skip commission creation
    await adminDb.collection('repLeads').doc(leadId).update({
      status: 'won',
      dealValue,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true, commissionId: existingComm.docs[0].id, commissionAmount, alreadyExisted: true });
  }

  // Update lead + create commission atomically
  const batch = adminDb.batch();

  batch.update(adminDb.collection('repLeads').doc(leadId), {
    status: 'won',
    dealValue,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const commissionRef = adminDb.collection('repCommissions').doc();
  batch.set(commissionRef, {
    id: commissionRef.id,
    repId: uid,
    repName: lead.repName || '',
    leadId,
    businessName: lead.businessName || '',
    dealValue,
    commissionAmount,
    status: 'pending',
    createdAt: FieldValue.serverTimestamp(),
    paidAt: null,
  });

  await batch.commit();

  return NextResponse.json({ success: true, commissionId: commissionRef.id, commissionAmount });
}
