import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@crftdweb.com';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crftdweb.com';

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>;

  const name = (body.name as string)?.trim();
  const email = (body.email as string)?.trim().toLowerCase();
  const phone = (body.phone as string)?.trim() ?? '';
  const location = (body.location as string)?.trim() ?? '';
  const experience = (body.experience as string)?.trim() ?? '';
  const motivation = (body.motivation as string)?.trim() ?? '';

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;

  const applicant = {
    name,
    email,
    phone,
    location,
    salesSignals: experience,
    notes: motivation ? `Motivation: ${motivation}` : '',
    education: '',
    keyStrength: '',
    rating: 3,
    verdict: 'booking',
    indeedEmail: false,
    status: 'pending',
    source: 'public_apply',
    emailSentAt: null,
    bookedAt: null,
    activityLog: [],
    createdAt: new Date().toISOString(),
  };

  await adminDb.collection('applicants').doc(id).set(applicant);

  // Notify admin
  await resend.emails.send({
    from: 'CrftdWeb <noreply@crftdweb.com>',
    to: ADMIN_EMAIL,
    subject: `New rep application — ${name}`,
    text: `New application from ${name} (${email}).

Phone: ${phone || 'not provided'}
Location: ${location || 'not provided'}

Sales experience:
${experience || 'Not provided'}

Motivation:
${motivation || 'Not provided'}

Review in the admin panel: ${BASE_URL}/admin/applicants`,
  });

  return NextResponse.json({ success: true });
}
