'use client';

import { motion } from 'framer-motion';

// TODO: Replace ALL placeholder content with real client quotes.
// Ask each client: "What was the problem before, and what changed after we launched?"
// One sentence is enough. Then add their real name, role, and company.
const testimonials = [
  {
    quote: "Replace this with a real quote from your Microbiome Design client.",
    author: "Client Name",
    role: "Founder",
    company: "Microbiome Design",
    initials: "MD",
  },
  {
    quote: "Replace this with a real quote from your Life Lab HQ client.",
    author: "Client Name",
    role: "Founder",
    company: "The Life Lab HQ",
    initials: "LL",
  },
  {
    quote: "Replace this with a real quote from your MPM Trading client.",
    author: "Client Name",
    role: "Founder",
    company: "MPM Trading",
    initials: "MP",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-accent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            CLIENT RESULTS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            What clients say
            <br className="hidden md:block" />
            <span className="text-muted-foreground">after launch.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-background border flex flex-col gap-4"
            >
              <p className="text-sm leading-relaxed text-foreground/80 flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-black/6">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
