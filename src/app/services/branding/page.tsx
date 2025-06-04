'use client';

import { motion } from 'framer-motion';

export default function BrandingPage() {
  return (
    <main className="pt-20">
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">Digital Branding</h1>
            <p className="text-xl text-muted-foreground mb-12 text-center">
              Comprehensive branding solutions for digital-first businesses
            </p>

            <div className="grid grid-cols-1 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Build Your Brand</h2>
                <p className="text-muted-foreground mb-6">
                  We help businesses establish and strengthen their digital presence through strategic branding that resonates with their target audience. Our comprehensive approach ensures consistency across all digital touchpoints.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

const services = [
  {
    title: "Brand Strategy",
    description: "Developing comprehensive brand strategies that align with your business goals."
  },
  {
    title: "Visual Identity",
    description: "Creating cohesive visual systems that reflect your brand's personality."
  },
  {
    title: "Brand Guidelines",
    description: "Establishing clear guidelines for consistent brand implementation."
  },
  {
    title: "Digital Assets",
    description: "Designing and developing brand assets for digital platforms."
  }
];
