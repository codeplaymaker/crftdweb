'use client';

import { motion } from 'framer-motion';

export default function ServicesPage() {
  return (
    <main className="pt-20">
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
              OUR SERVICES
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight">What We Build</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Premium digital solutions crafted with precision and purpose
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const services = [
  {
    title: "Web Design",
    description: "Premium web design services with Apple-inspired aesthetics that blend form and function."
  },
  {
    title: "Digital Branding",
    description: "Comprehensive branding solutions that establish a strong digital presence."
  },
  {
    title: "UI/UX Design",
    description: "User-centered design focusing on intuitive experiences and seamless interactions."
  },
  {
    title: "Web Development",
    description: "Custom web applications built with modern technologies and best practices."
  },
  {
    title: "E-commerce Solutions",
    description: "Scalable online stores that drive conversions and enhance customer experience."
  },
  {
    title: "Digital Strategy",
    description: "Strategic planning and consulting for digital transformation initiatives."
  }
];
