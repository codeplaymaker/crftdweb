'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'AES-256 Encryption',
      description: 'All data is encrypted at rest and in transit using military-grade AES-256 encryption.',
    },
    {
      icon: '🏢',
      title: 'SOC 2 Type II Compliant',
      description: 'Our infrastructure meets the highest standards for security, availability, and confidentiality.',
    },
    {
      icon: '🌐',
      title: 'GDPR Compliant',
      description: 'Full compliance with European data protection regulations. Request data deletion anytime.',
    },
    {
      icon: '🔒',
      title: 'Zero-Knowledge Architecture',
      description: 'Your research data is completely private. We cannot access your business insights.',
    },
    {
      icon: '🛡️',
      title: 'DDoS Protection',
      description: 'Enterprise-grade protection against distributed denial-of-service attacks.',
    },
    {
      icon: '✅',
      title: 'Regular Security Audits',
      description: 'Third-party penetration testing and security audits performed quarterly.',
    },
  ];

  const certifications = [
    { name: 'SOC 2 Type II', icon: '🏆' },
    { name: 'GDPR', icon: '🇪🇺' },
    { name: 'CCPA', icon: '🇺🇸' },
    { name: 'ISO 27001', icon: '📜' },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Enterprise-Grade Security
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Data Security is Our Priority
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            We implement industry-leading security practices to protect your business intelligence
          </p>
        </motion.div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-20"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Certifications & Compliance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="text-center">
                <span className="text-4xl mb-2 block">{cert.icon}</span>
                <span className="text-white font-medium">{cert.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Infrastructure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Secure Infrastructure
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Data Centers</h3>
              <ul className="space-y-3">
                {[
                  'AWS and Google Cloud infrastructure',
                  'Geographically distributed data centers',
                  '99.99% uptime SLA',
                  'Automatic failover and redundancy',
                  'Physical security controls 24/7',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Application Security</h3>
              <ul className="space-y-3">
                {[
                  'End-to-end TLS 1.3 encryption',
                  'Secure authentication with MFA',
                  'Role-based access controls',
                  'Automated vulnerability scanning',
                  'Secure code review practices',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Bug Bounty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Security Researchers
          </h2>
          <p className="text-white/60 mb-6 max-w-xl mx-auto">
            Found a vulnerability? We appreciate responsible disclosure. 
            Report security issues to our security team.
          </p>
          <a
            href="mailto:security@crftdweb.com"
            className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            security@crftdweb.com
          </a>
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/engine" className="text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to Engine
          </Link>
        </div>
      </div>
    </div>
  );
}
