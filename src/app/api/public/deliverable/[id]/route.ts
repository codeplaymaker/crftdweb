import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snap = await adminDb.collection('deliverables').doc(id).get();

  if (!snap.exists) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const data = snap.data()!;

  if (!data.isPublic) {
    return NextResponse.json({ error: 'This deliverable is not shared publicly' }, { status: 403 });
  }

  // Return only the fields needed for the public view — never expose userId
  return NextResponse.json({
    id: snap.id,
    title: data.title,
    content: data.content,
    agentId: data.agentId,
    createdAt: data.createdAt,
    refinementOfTitle: data.refinementOfTitle ?? null,
  });
}
