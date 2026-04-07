import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [emailSnap, replySnap] = await Promise.all([
    adminDb.collection('repEmails').orderBy('sentAt', 'desc').limit(100).get(),
    adminDb.collection('repEmailReplies').orderBy('receivedAt', 'desc').limit(50).get(),
  ]);

  const emails = emailSnap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      sentAt: data.sentAt?.toDate?.()?.toISOString() ?? null,
      repliedAt: data.repliedAt?.toDate?.()?.toISOString() ?? null,
    };
  });

  const replies = replySnap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      receivedAt: data.receivedAt?.toDate?.()?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ emails, replies });
}
