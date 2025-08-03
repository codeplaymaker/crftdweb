'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Microbiome Design",
    description: "Designing a future with microbes. We combine scientific expertise and creative thinking to unlock the potential of the microbiome for people, products, and the planet.",
    image: "/microbiome-design-pic.png",
    category: "Biotech & Design",
    href: "https://microbiome-design.vercel.app",
    features: [
      "Scientific Expertise",
      "Creative Design",
      "Microbiome Solutions",
      "Sustainable Innovation"
    ]
  },
  {
    title: "The Life Lab HQ",
    description: "Your personal laboratory for balanced living and growth. An AI-powered platform for life transformation.",
    image: "/life-lab.jpg",
    category: "Lifestyle & Wellness",
    href: "https://thelifelabhq.com",
    features: [
      "AI Mentorship",
      "Five Formulas System",
      "Data-Driven Insights",
      "Personal Growth"
    ]
  },
  {
    title: "MPM Trading Platform",
    description: "A trading platform for insights, journal tracking and custom trading plans.",
    image: "/mpm-hero.jpg",
    category: "FinTech Platform",
    href: "https://www.marketplaymaker.com",
    features: [
      "Trading Insights",
      "Trading Journal",
      "Personalized Plans",
      "User Authentication"
    ]
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
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of innovative digital solutions across biotech, wellness, and fintech industries that transform ideas into exceptional user experiences.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl bg-accent h-[600px]"
            >
              <Link href={project.href} className="block h-full relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
                  priority={index === 0}
                  quality={95}
                  style={{ objectPosition: 'center center' }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <span className="px-4 py-2 bg-background text-foreground rounded-lg text-sm font-medium">
                    View Project
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-10">
                  <h3 className="text-white text-2xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-white/80 text-sm mb-3">{project.description}</p>
                  <span className="inline-block mb-2 text-xs font-medium text-white/60 bg-white/10 px-2 py-1 rounded">
                    {project.category}
                  </span>
                  {project.features && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.features.map((feature, i) => (
                        <span key={i} className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 