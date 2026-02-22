'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
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
          
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-6">
              Last updated: February 4, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/70">
                By accessing and using Engine ("the Service"), you accept and agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-white/70">
                Engine is an AI-powered platform that helps users build, launch, and automate high-ticket 
                offers. The Service includes market research tools, AI agents, offer builders, and related features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p className="text-white/70 mb-4">
                To use certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
              <p className="text-white/70 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service to send spam or malicious content</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <p className="text-white/70">
                The Service and its content are protected by copyright, trademark, and other laws. 
                You retain ownership of content you create using the Service, but grant us a license 
                to host and display that content as part of providing the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimers</h2>
              <p className="text-white/70">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not guarantee 
                specific results from using the Service. Market research and AI-generated content are 
                for informational purposes and should not be considered professional advice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-white/70">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
              <p className="text-white/70">
                We may modify these Terms at any time. We will notify you of significant changes via 
                email or through the Service. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
              <p className="text-white/70">
                For questions about these Terms, contact us at{' '}
                <a href="mailto:legal@crftdweb.com" className="text-purple-400 hover:text-purple-300">
                  legal@crftdweb.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
