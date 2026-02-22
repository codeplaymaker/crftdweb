'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="pt-20">
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-20">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
                WHO WE ARE
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">About Us</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Crafting digital experiences that stand the test of time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-6">
                  CrftdWeb was founded with a simple yet powerful vision: to create digital experiences that combine the elegance of Apple&apos;s design philosophy with cutting-edge web technologies. Our journey began with a passion for craftsmanship in the digital realm.
                </p>
                <p className="text-muted-foreground">
                  Today, we continue to push the boundaries of what&apos;s possible on the web, delivering solutions that not only look beautiful but perform exceptionally well.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
                <p className="text-muted-foreground mb-6">
                  We believe in the power of minimalism and purpose-driven design. Every pixel, every interaction, and every line of code is crafted with intention. Our approach combines aesthetic excellence with technical precision.
                </p>
                <p className="text-muted-foreground">
                  By staying at the forefront of digital innovation, we ensure our clients receive solutions that are both timeless and forward-thinking.
                </p>
              </div>
            </div>

            <div className="mt-16 p-8 rounded-xl border bg-background">
              <h2 className="text-2xl font-semibold mb-8 text-center tracking-tight">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <h3 className="font-medium mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Ecosystem */}
            <div className="mt-16 p-8 rounded-xl bg-accent text-center">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
                THE CRFTDWEB ECOSYSTEM
              </span>
              <h3 className="text-xl font-bold tracking-tight mb-3">We practice what we preach</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xl mx-auto leading-relaxed">
                We built CrftdWeb the agency. Then we codified our process into the Playbook. Then we productized it into Engine. Three products, one methodology.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/services" className="px-5 py-2.5 border border-black/15 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                  Our Services
                </Link>
                <Link href="/playbook" className="px-5 py-2.5 border border-black/15 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                  The Playbook
                </Link>
                <Link href="/engine" className="px-5 py-2.5 border border-black/15 rounded-full text-sm font-medium hover:bg-black/5 transition-colors">
                  Engine
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Want to work together?</h3>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                We&apos;d love to hear about your project.
              </p>
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-black text-white rounded-full text-sm font-medium inline-flex items-center gap-2 group hover:bg-gray-900 transition-colors"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

const values = [
  {
    title: "Excellence",
    description: "We strive for excellence in every aspect of our work, from design to development."
  },
  {
    title: "Innovation",
    description: "Constantly pushing boundaries and embracing new technologies and methodologies."
  },
  {
    title: "Purpose",
    description: "Every decision we make is guided by purpose and intention."
  }
];
