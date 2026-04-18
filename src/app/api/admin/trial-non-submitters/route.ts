import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [sentSnap, submittedSnap] = await Promise.all([
    adminDb.collection('trial_tasks_sent').get(),
    adminDb.collection('trial_submissions').get(),
  ]);

  const submittedEmails = new Set(submittedSnap.docs.map(d => d.data().email as string));

  const nonSubmitters = sentSnap.docs
    .map(doc => ({
      id: doc.id,
      email: doc.data().email as string,
      name: doc.data().name as string,
      sentAt: doc.data().sentAt?.toDate?.()?.toISOString() ?? null,
    }))
    .filter(r => !submittedEmails.has(r.email))
    .sort((a, b) => {
      if (!a.sentAt) return 1;
      if (!b.sentAt) return -1;
      return b.sentAt.localeCompare(a.sentAt);
    });

  return NextResponse.json(nonSubmitters);
}
