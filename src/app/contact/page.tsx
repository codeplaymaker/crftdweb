'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { sendEmail } from '../actions/sendEmail';

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  return (
    <main className="pt-20">
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                CONTACT
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">Get in Touch</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Let&apos;s discuss how we can help transform your digital presence
              </p>
            </div>

            <form 
              className="space-y-8" 
              action={async (formData) => {
                setSending(true);
                setMessage(null);
                try {
                  const result = await sendEmail(formData);
                  if (result.success) {
                    setMessage({ type: 'success', text: 'Message sent successfully! We\'ll get back to you soon.' });
                    (document.getElementById('contact-form') as HTMLFormElement).reset();
                  } else {
                    setMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
                  }
                } catch (error) {
                  console.error('Contact form error:', error);
                  setMessage({ 
                    type: 'error', 
                    text: 'Failed to send message. Please make sure you\'re connected to the internet and try again.' 
                  });
                }
                setSending(false);
              }}
              id="contact-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="subject">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors"
                  required
                ></textarea>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full px-8 py-3.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
