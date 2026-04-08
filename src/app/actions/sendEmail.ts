'use server';

import { Resend } from 'resend';
import { cookies } from 'next/headers';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set');
    return { success: false, error: 'Email configuration error' };
  }

  // Check for rep referral
  const cookieStore = await cookies();
  const repRef = cookieStore.get('rep_ref')?.value;
  let repName = '';

  if (repRef) {
    try {
      const repDoc = await adminDb.collection('reps').doc(repRef).get();
      if (repDoc.exists) {
        const repData = repDoc.data();
        repName = repData?.name || '';

        // Auto-create lead for the rep
        const leadRef = adminDb.collection('repLeads').doc();
        await leadRef.set({
          id: leadRef.id,
          repId: repRef,
          repName,
          businessName: '',
          contactName: name,
          contactEmail: email,
          contactPhone: '',
          status: 'interested',
          source: 'referral',
          dealValue: 0,
          notes: `Auto-created from website contact form.\n\nMessage: ${message}`,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Failed to create referral lead:', err);
    }
  }

  try {
    await resend.emails.send({
      from: 'admin@crftdweb.com',
      to: ['admin@crftdweb.com'],
      replyTo: email,
      subject: `New Contact Form Submission: ${subject || 'Website Enquiry'}${repName ? ` (Ref: ${repName})` : ''}`,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
${repName ? `<p><strong>Referred by:</strong> ${repName}</p>` : ''}
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
