const { Resend } = require('resend');

// Get API key from environment or .env.local file
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const apiKeyMatch = envContent.match(/RESEND_API_KEY=(.+)/);
  if (apiKeyMatch && !process.env.RESEND_API_KEY) {
    process.env.RESEND_API_KEY = apiKeyMatch[1].trim();
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing email configuration...\n');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set!');
    process.exit(1);
  }

  console.log('✅ RESEND_API_KEY found');
  console.log(`📧 Sending test email to: admin@crftdweb.com\n`);

  try {
    const response = await resend.emails.send({
      from: 'admin@crftdweb.com',
      to: ['admin@crftdweb.com'],
      replyTo: 'test@example.com',
      subject: 'Test Email from CrftdWeb Contact Form',
      html: `
        <h2>Test Email Submission</h2>
        <p><strong>Name:</strong> Test User</p>
        <p><strong>Email:</strong> test@example.com</p>
        <p><strong>Subject:</strong> Testing Email Configuration</p>
        <h3>Message:</h3>
        <p>This is a test email to verify that the contact form email configuration is working correctly.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
      `,
    });

    console.log('✅ Email sent successfully!\n');
    console.log('Response:', response);
    console.log('\n📧 Check your inbox at admin@crftdweb.com for the test email');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error(error);
    process.exit(1);
  }
}

testEmail();
