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
                START A PROJECT
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">Let&apos;s fix your website.</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Tell us what&apos;s not working and we&apos;ll tell you honestly if we can help.
                No pitch deck, no pressure.
              </p>
              <p className="text-xs text-muted-foreground/50 mt-4">
                We&apos;ve built across multiple industries · Response within 24 hours
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
                <label className="block text-sm font-medium mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell us what's not working with your current site, what you're trying to achieve, and your rough timeline."
                  className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors placeholder:text-muted-foreground/40"
                  required
                ></textarea>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <p>{message.text}</p>
                  {message.type === 'success' && (
                    <div className="flex gap-3 mt-3">
                      <a href="/work" className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity">Browse our work</a>
                      <a href="/playbook" className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity">Explore the Playbook</a>
                      <a href="/engine" className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity">Try Engine</a>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full px-8 py-3.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-xs text-center text-muted-foreground/50">
                Free consultation · No commitment · We&apos;ll follow up within 24 hours
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-20 border-t border-black/[0.06]">
        <div className="container max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-6 tracking-tight">What happens next</h2>
              <ol className="space-y-5 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground block mb-1">1. We read your message</span>
                  Every enquiry is reviewed directly. Not an automated system. Not a sales team.
                </li>
                <li>
                  <span className="font-medium text-foreground block mb-1">2. We reply within 24 hours</span>
                  Usually faster. You get a real response with direct questions or a call invite.
                </li>
                <li>
                  <span className="font-medium text-foreground block mb-1">3. We scope the project together</span>
                  Free 30-minute call. We define the problem, the deliverables, and the timeline.
                </li>
                <li>
                  <span className="font-medium text-foreground block mb-1">4. You receive a fixed-price quote</span>
                  No surprises. No hourly billing. A clear scope and a clear price before any work starts.
                </li>
              </ol>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-6 tracking-tight">Who this is for</h2>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li>Service businesses with a website that does not generate leads</li>
                <li>Startups that need to look credible before they feel credible</li>
                <li>Local businesses competing with national brands online</li>
                <li>Anyone paying a monthly retainer for a WordPress site that performs like a template</li>
              </ul>
              <h3 className="font-semibold mb-3 text-sm">Not the right fit:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>E-commerce stores needing a Shopify build</li>
                <li>Businesses wanting a website under £1,000</li>
                <li>Projects without a clear brief or timeline</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing note */}
      <section className="py-16 border-t border-black/[0.06]">
        <div className="container max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We do not take on every project. We take on the right ones. That means we ask hard questions before we quote, and we are honest when we think a different solution would serve you better.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Most of our clients come from referrals. They come back because the work performs, not because of a clever sales pitch.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If your website is currently invisible, or brings visitors who do not convert, there is a reason for both. We will find it, explain it plainly, and fix it properly. That is what we do.
          </p>
        </div>
      </section>
    </main>
  );
}
