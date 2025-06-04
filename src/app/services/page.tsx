'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  return (
    <main className="pt-20">
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground mb-12">
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
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
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
