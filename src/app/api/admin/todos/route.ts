import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && token === process.env.ADMIN_TOKEN;
}

const COLLECTION = 'adminTodos';

// GET /api/admin/todos — fetch all todos
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb.collection(COLLECTION).orderBy('createdAt', 'asc').get();
  const todos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(todos);
}

// POST /api/admin/todos — create a new todo
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as Record<string, unknown>;
  const text = (body.text as string)?.trim();
  if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

  const todo = {
    text,
    done: false,
    priority: ['high', 'normal', 'low'].includes(body.priority as string) ? body.priority : 'normal',
    dueLabel: (body.dueLabel as string)?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  const ref = await adminDb.collection(COLLECTION).add(todo);
  return NextResponse.json({ success: true, todo: { id: ref.id, ...todo } });
}

// PATCH /api/admin/todos — toggle done or update fields
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as { id?: string } & Record<string, unknown>;
  const { id, ...updates } = body;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  await adminDb.collection(COLLECTION).doc(id).update(updates);
  return NextResponse.json({ success: true });
}

// DELETE /api/admin/todos — remove a todo
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await adminDb.collection(COLLECTION).doc(id).delete();
  return NextResponse.json({ success: true });
}
