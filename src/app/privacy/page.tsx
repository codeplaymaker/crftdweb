import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — CrftdWeb',
  description: 'How CrftdWeb collects, uses, and protects your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-black min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: 10 April 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Who We Are</h2>
            <p className="text-gray-600">
              CrftdWeb is a web design and development studio operating in the United Kingdom. When we refer to
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our,&rdquo; we mean CrftdWeb. Our contact email
              is <a href="mailto:hello@crftdweb.com" className="text-black underline">hello@crftdweb.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. What Data We Collect</h2>
            <p className="text-gray-600 mb-3">We collect the following personal data depending on how you interact with us:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><strong>Contact form / enquiries:</strong> Name, email address, phone number, business name, message content.</li>
              <li><strong>Rep applications:</strong> Name, email address, phone number, location, experience, motivation.</li>
              <li><strong>Rep portal:</strong> Name, email address, login credentials, bank/payment details, lead data, email correspondence.</li>
              <li><strong>Client projects:</strong> Name, email, business information, project details.</li>
              <li><strong>Website usage:</strong> Pages visited, referral source, device type (via anonymous analytics).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Why We Collect It (Lawful Basis)</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><strong>Legitimate interest:</strong> To respond to enquiries, process applications, manage client projects, and improve our services.</li>
              <li><strong>Contract:</strong> To fulfil our obligations under client agreements and rep contractor arrangements.</li>
              <li><strong>Consent:</strong> Where you have opted in to marketing or newsletters (you can withdraw at any time).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. How We Use Your Data</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>To respond to your enquiry or application.</li>
              <li>To provide and manage our web design services.</li>
              <li>To operate the rep portal (lead management, commission tracking, email follow-ups).</li>
              <li>To process payments and commissions.</li>
              <li>To improve our website and services.</li>
              <li>To send transactional emails (project updates, account notifications).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Who We Share Data With</h2>
            <p className="text-gray-600 mb-3">We do not sell your personal data. We share data with the following service providers who process data on our behalf:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><strong>Firebase (Google):</strong> Authentication and database hosting.</li>
              <li><strong>Resend:</strong> Transactional email delivery.</li>
              <li><strong>Vercel:</strong> Website hosting.</li>
            </ul>
            <p className="text-gray-600 mt-3">These providers have their own privacy policies and process data under appropriate safeguards.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. How Long We Keep Data</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><strong>Enquiries:</strong> Up to 12 months after last contact.</li>
              <li><strong>Rep applicants:</strong> Up to 6 months if unsuccessful, duration of engagement if accepted.</li>
              <li><strong>Client data:</strong> Duration of the project plus 6 years (for legal/accounting purposes).</li>
              <li><strong>Analytics:</strong> Aggregated and anonymised, retained indefinitely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <p className="text-gray-600 mb-3">Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><strong>Access</strong> the personal data we hold about you.</li>
              <li><strong>Rectify</strong> inaccurate data.</li>
              <li><strong>Erase</strong> your data (in certain circumstances).</li>
              <li><strong>Object</strong> to processing based on legitimate interest.</li>
              <li><strong>Withdraw consent</strong> at any time where consent is the basis for processing.</li>
              <li><strong>Lodge a complaint</strong> with the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-black underline">Information Commissioner&apos;s Office (ICO)</a>.</li>
            </ul>
            <p className="text-gray-600 mt-3">
              To exercise any of these rights, email us at{' '}
              <a href="mailto:hello@crftdweb.com" className="text-black underline">hello@crftdweb.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
            <p className="text-gray-600">
              We use essential cookies to ensure the website functions correctly. We may use analytics cookies to
              understand how visitors use the site. No advertising or third-party tracking cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Security</h2>
            <p className="text-gray-600">
              We use industry-standard measures to protect your data, including encrypted connections (HTTPS),
              secure authentication, and access controls on our database. No system is 100% secure, but we take
              reasonable steps to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top of this page
              will reflect any changes. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
            <p className="text-gray-600">
              If you have questions about this privacy policy, contact us at{' '}
              <a href="mailto:hello@crftdweb.com" className="text-black underline">hello@crftdweb.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
