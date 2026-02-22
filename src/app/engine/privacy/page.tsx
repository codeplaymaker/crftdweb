'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/engine" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
            ← Back to Engine
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">
              Last updated: February 4, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-white/70 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (company name, industry)</li>
                <li>Usage data (reports generated, features used)</li>
                <li>Communications (support requests, feedback)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-white/70 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Develop new features and services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
              <p className="text-white/70">
                We implement appropriate security measures to protect your personal information. 
                All data is encrypted in transit and at rest using industry-standard AES-256 encryption.
                Your research data is completely private and only accessible by you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Retention</h2>
              <p className="text-white/70">
                We retain your information for as long as your account is active or as needed to provide 
                you services. You can request deletion of your data at any time through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
              <p className="text-white/70">
                We may use third-party services for analytics, payment processing, and AI capabilities. 
                These services have their own privacy policies governing how they use information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="text-white/70 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
              <p className="text-white/70">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@crftdweb.com" className="text-purple-400 hover:text-purple-300">
                  privacy@crftdweb.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
