'use client';

import { motion } from 'framer-motion';

export default function WebDesignPage() {
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">Web Design</h1>
            <p className="text-xl text-muted-foreground mb-12 text-center">
              Premium web design services with Apple-inspired aesthetics
            </p>

            <div className="grid grid-cols-1 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
                <p className="text-muted-foreground mb-6">
                  We combine minimalist aesthetics with intuitive functionality to create websites that leave a lasting impression. Our design process focuses on user experience, performance, and visual excellence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
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

const features = [
  {
    title: "User-Centric Design",
    description: "Creating intuitive interfaces that prioritize user experience and engagement."
  },
  {
    title: "Responsive Design",
    description: "Ensuring your website looks and functions perfectly across all devices."
  },
  {
    title: "Performance Optimization",
    description: "Building fast-loading websites that provide seamless user experiences."
  },
  {
    title: "Modern Technologies",
    description: "Using cutting-edge web technologies to future-proof your digital presence."
  }
];
