'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Microbiome Design",
    problem: "A cutting-edge biotech company with real science — but a website that looked like a student project. Investors weren't taking them seriously.",
    process: "Full discovery into their audience (researchers, investors, partners). Rebuilt around credibility signals, clear value proposition, and a conversion-focused layout.",
    result: "A site that matches the quality of their science. Professional presence that gives investors confidence from the first click.",
    image: "/microbiome-design-pic.png",
    category: "Biotech & Design",
    href: "https://microbiome-design.vercel.app",
    tags: ["Custom Design", "Next.js", "Conversion-Focused"],
  },
  {
    title: "The Life Lab HQ",
    problem: "A wellness brand with great content and real expertise — but visitors browsed and left without signing up. The site didn't guide anyone to take action.",
    process: "Mapped the customer journey from first visit to sign-up. Rebuilt every page around a single conversion goal. Added trust signals at each decision point.",
    result: "A platform that turns casual visitors into engaged members. Clear path from landing to sign-up with friction removed at every step.",
    image: "/life-lab.jpg",
    category: "Lifestyle & Wellness",
    href: "https://thelifelabhq.com",
    tags: ["AI-Powered", "Membership Platform", "UX Redesign"],
  },
  {
    title: "MPM Trading Platform",
    problem: "Traders needed a tool for journaling, insights, and custom plans — but existing platforms were clunky and overwhelming. The founder needed a clean, usable product.",
    process: "Designed a minimal, data-focused interface. Built trading journal, insights dashboard, and personalized plan features. Prioritized speed and clarity over feature bloat.",
    result: "A fintech platform that traders actually use daily. Clean interface that makes complex data approachable and actionable.",
    image: "/mpm-hero.jpg",
    category: "FinTech Platform",
    href: "https://www.marketplaymaker.com",
    tags: ["FinTech", "Dashboard Design", "User Auth"],
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Work() {
  return (
    <section className="py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            CASE STUDIES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight leading-tight">
            Real projects.<br className="hidden md:block" />
            <span className="text-muted-foreground">Real problems solved.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We&apos;ve built across biotech, wellness, and fintech.
            Every project starts with a problem — here&apos;s how we solved them.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-16"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              {/* Project image */}
              <Link href={project.href} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-xl bg-accent h-[500px] mb-8">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
                  priority={index === 0}
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <span className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium inline-flex items-center gap-2">
                    Visit Site <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-black">
                    {project.category}
                  </span>
                </div>
              </Link>

              {/* Case study content */}
              <div className="max-w-4xl">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{project.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-5 rounded-xl border border-black/6 bg-accent/50">
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground block mb-2">THE PROBLEM</span>
                    <p className="text-sm text-foreground/80 leading-relaxed">{project.problem}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-black/6 bg-accent/50">
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground block mb-2">THE PROCESS</span>
                    <p className="text-sm text-foreground/80 leading-relaxed">{project.process}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-black text-white">
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 block mb-2">THE RESULT</span>
                    <p className="text-sm text-white/80 leading-relaxed">{project.result}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-medium bg-black/5 text-muted-foreground rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 