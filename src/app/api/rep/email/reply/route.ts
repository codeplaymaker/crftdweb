/**
 * API Route: Mark email as replied
 * Lets reps flag that a prospect replied to a sent email.
 * Updates both the email log and the lead's lastRepliedAt.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { emailId } = await req.json();
  if (!emailId) {
    return NextResponse.json({ error: 'Missing emailId' }, { status: 400 });
  }

  // Fetch the email log entry and verify ownership
  const emailDoc = await adminDb.collection('repEmails').doc(emailId).get();
  if (!emailDoc.exists || emailDoc.data()?.repId !== uid) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  const emailData = emailDoc.data()!;

  // Batch: stamp repliedAt on the email + lastRepliedAt on the lead
  const batch = adminDb.batch();

  batch.update(adminDb.collection('repEmails').doc(emailId), {
    repliedAt: FieldValue.serverTimestamp(),
  });

  batch.update(adminDb.collection('repLeads').doc(emailData.leadId), {
    lastRepliedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return NextResponse.json({ success: true });
}
