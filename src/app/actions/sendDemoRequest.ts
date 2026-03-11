'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDemoRequest(data: {
  name: string;
  email: string;
  company: string;
  revenue: string;
  challenge: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set');
    return { success: false, error: 'Email configuration error' };
  }

  try {
    // Send notification to admin
    await resend.emails.send({
      from: 'admin@crftdweb.com',
      to: ['admin@crftdweb.com'],
      replyTo: data.email,
      subject: `New Demo Request: ${data.name} - ${data.company || 'No Company'}`,
      html: `
<h2>New Strategy Call Request</h2>
<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
<p><strong>Monthly Revenue:</strong> ${data.revenue || 'Not provided'}</p>
<h3>Biggest Challenge:</h3>
<p>${(data.challenge || 'Not provided').replace(/\n/g, '<br>')}</p>
<hr>
<p><em>Submitted from the Engine Demo page</em></p>
      `,
    });

    // Send confirmation to the prospect
    await resend.emails.send({
      from: 'admin@crftdweb.com',
      to: [data.email],
      subject: 'Your Engine Strategy Call is Confirmed!',
      html: `
<h2>You're booked, ${data.name}!</h2>
<p>Thank you for requesting a strategy call. We've received your information and will be in touch within 24 hours to schedule your session.</p>
<h3>What to expect:</h3>
<ul>
  <li>A personalized strategy session tailored to your business</li>
  <li>A live demo of Engine with your actual niche</li>
  <li>A custom roadmap to launch your first high-ticket offer</li>
  <li>Open Q&A with our team</li>
</ul>
<p>In the meantime, you can explore Engine at <a href="https://crftdweb.com/engine">crftdweb.com/engine</a>.</p>
<p>See you soon!</p>
<p>— The CRFTD Team</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send demo request:', error);
    return { success: false, error: 'Failed to send request' };
  }
}
