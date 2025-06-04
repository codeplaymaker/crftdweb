'use client';

import { motion } from 'framer-motion';

export default function UiUxPage() {
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">UI/UX Design</h1>
            <p className="text-xl text-muted-foreground mb-12 text-center">
              User-centered design that prioritizes experience and functionality
            </p>

            <div className="grid grid-cols-1 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Design Philosophy</h2>
                <p className="text-muted-foreground mb-6">
                  Our UI/UX design process focuses on creating intuitive, engaging, and efficient user experiences. We combine aesthetic excellence with functional design to deliver interfaces that users love to interact with.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {processes.map((process, index) => (
                  <motion.div
                    key={process.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-xl border bg-background hover:border-black/20 transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
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

const processes = [
  {
    title: "User Research",
    description: "Understanding user needs, behaviors, and preferences through comprehensive research."
  },
  {
    title: "Information Architecture",
    description: "Organizing content and functionality in an intuitive and accessible way."
  },
  {
    title: "Interface Design",
    description: "Creating visually appealing and functional user interfaces."
  },
  {
    title: "Usability Testing",
    description: "Validating design decisions through user testing and iteration."
  }
];
