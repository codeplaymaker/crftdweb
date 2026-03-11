# Component Snippet Library

> Proven component patterns from CrftdWeb projects. Copy and adapt per project.

---

## 1. Hero Section (Problem-First)

```tsx
'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8 block">
            {/* TAGLINE — short, punchy, uppercase */}
            WEBSITES THAT SELL, NOT JUST LOOK GOOD
          </span>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.05]">
            {/* Problem headline — what the visitor wants */}
            Your website should be
            <br />
            <span className="text-muted-foreground">your best salesperson.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            {/* Agitate — describe the pain */}
            Most websites look fine but don't convert. We build sites that
            turn visitors into customers.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/work" className="px-8 py-3.5 bg-black text-white rounded-full hover:bg-gray-900 transition-colors text-sm font-medium">
              See the Results
            </Link>
            <Link href="/contact" className="px-8 py-3.5 border border-black/15 rounded-full hover:bg-black/5 transition-colors text-sm font-medium">
              Start a Project
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

## 2. Process Flow (Numbered Steps)

```tsx
const process = [
  { title: "Discover", description: "We dig into who your customers are and what makes them buy." },
  { title: "Design", description: "Every section answers one question in the buyer's mind." },
  { title: "Develop", description: "Hand-coded with Next.js. No templates. 90+ PageSpeed." },
  { title: "Deliver", description: "Launch, test, and optimize. We make sure it works." },
];

{/* In JSX: */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {process.map((step, index) => (
    <motion.div
      key={step.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center text-sm font-bold mb-4">
        {String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="text-lg font-semibold mb-2 tracking-tight">{step.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
    </motion.div>
  ))}
</div>
```

## 3. Case Study Card (Problem → Process → Result)

```tsx
const projects = [
  {
    title: "Project Name",
    problem: "What wasn't working for the client.",
    process: "What we did to fix it.",
    result: "The outcome they got.",
    image: "/project-image.png",
    category: "Industry or Type",
    href: "https://live-site.com",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
  },
];

{/* In JSX: */}
<div className="space-y-16">
  {projects.map((project) => (
    <div key={project.title} className="group">
      {/* Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
        <Image src={project.image} alt={project.title} fill className="object-cover" quality={95} />
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium">
          {project.category}
        </span>
      </div>

      {/* Title + Link */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
        <a href={project.href} target="_blank" className="text-sm text-muted-foreground hover:text-black transition-colors">
          Visit site →
        </a>
      </div>

      {/* Problem / Process / Result */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-xl border bg-background">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problem</span>
          <p className="text-sm mt-2 leading-relaxed">{project.problem}</p>
        </div>
        <div className="p-4 rounded-xl border bg-background">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Process</span>
          <p className="text-sm mt-2 leading-relaxed">{project.process}</p>
        </div>
        <div className="p-4 rounded-xl bg-black text-white">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Result</span>
          <p className="text-sm mt-2 leading-relaxed">{project.result}</p>
        </div>
      </div>

      {/* Tech tags */}
      <div className="flex gap-2 flex-wrap">
        {project.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-accent rounded-full text-xs font-medium">{tag}</span>
        ))}
      </div>
    </div>
  ))}
</div>
```

## 4. TRAIN Design System Grid

```tsx
const trainSystem = [
  { letter: "T", name: "Typography", description: "Typefaces that say what you mean. Weight, size, and spacing communicate before words do." },
  { letter: "R", name: "Restraint", description: "One decision saves 1,000. Limited palette forces better ideas. Less noise, more signal." },
  { letter: "A", name: "Alignment", description: "Invisible relationships create trust. Grids and geometry make design feel intentional." },
  { letter: "I", name: "Image Treatment", description: "Consistent processing creates instant recognition. Same filter, same crop, same feel." },
  { letter: "N", name: "Negative Space", description: "Space isn't there to fill. It's there to frame. Let the idea breathe." },
];

{/* In JSX: */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
  {trainSystem.map((item, index) => (
    <motion.div
      key={item.letter}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="p-5 rounded-xl border bg-background text-center hover:border-black/20 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">
        {item.letter}
      </div>
      <h3 className="font-semibold text-sm mb-1 tracking-tight">{item.name}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
    </motion.div>
  ))}
</div>
```

## 5. Trust CTA Section

```tsx
'use client';

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8 block">
            LET'S TALK
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight leading-tight">
            {/* Urgency headline */}
            Still wondering why your site isn't making you money?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
            {/* Competitive pressure + simplicity */}
            Your competitors are investing in sites that convert.
            The longer you wait, the more you lose.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-black text-white rounded-full text-sm font-medium inline-flex items-center gap-2 group hover:bg-gray-900 transition-colors"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-6 text-xs text-muted-foreground/50">
            Free consultation · No commitment · Response within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

## 6. Checklist Section

```tsx
import { Check } from 'lucide-react';

const inclusions = [
  "Custom design, no templates",
  "Mobile-first responsive",
  "SEO foundations",
  "90+ PageSpeed score",
  "Conversion-focused layout",
  "Analytics setup",
];

{/* In JSX: */}
<div className="p-8 md:p-12 rounded-2xl bg-accent border">
  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-center">What's included</h2>
  <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
    Every project gets the full treatment.
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
    {inclusions.map((item) => (
      <div key={item} className="flex items-start gap-3 py-2">
        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">{item}</span>
      </div>
    ))}
  </div>
</div>
```

## 7. Contact Form (Minimal)

```tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactForm() {
  const [sending, setSending] = useState(false);

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
          <input
            type="text" id="name" name="name"
            className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
          <input
            type="email" id="email" name="email"
            className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="message">Message</label>
        <textarea
          id="message" name="message" rows={6}
          className="w-full px-4 py-2 rounded-lg border bg-background hover:border-black/20 transition-colors"
          required
        />
      </div>
      <button
        type="submit" disabled={sending}
        className="w-full px-8 py-3.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>
      <p className="text-xs text-center text-muted-foreground/50">
        Free consultation · No commitment · Response within 24 hours
      </p>
    </form>
  );
}
```

## 8. Section Header Pattern

```tsx
{/* Reusable section header — use at the top of every major section */}
<div className="text-center mb-12">
  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
    SECTION LABEL
  </span>
  <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight leading-tight">
    Problem-first headline
  </h2>
  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
    One or two sentences expanding on the headline.
  </p>
</div>
```

## 9. Audience Cards

```tsx
const audiences = [
  { title: "Startups & Founders", description: "You need credibility with investors and early adopters." },
  { title: "Service Businesses", description: "You're great at what you do but your site doesn't reflect that." },
  { title: "Growing Brands", description: "You've outgrown your first website and need something custom." },
];

{/* In JSX: */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {audiences.map((audience, index) => (
    <motion.div
      key={audience.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 rounded-xl border bg-background text-center"
    >
      <h3 className="font-semibold mb-2 tracking-tight">{audience.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{audience.description}</p>
    </motion.div>
  ))}
</div>
```
