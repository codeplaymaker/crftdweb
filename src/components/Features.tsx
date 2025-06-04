'use client';

import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Custom Development",
    description: "Tailored solutions built with cutting-edge technologies and best practices."
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "UI/UX Design",
    description: "Intuitive and engaging user experiences that captivate your audience."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Responsive Design",
    description: "Seamless experiences across all devices and screen sizes."
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Performance",
    description: "Lightning-fast load times and optimized user experiences."
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

export default function Features() {
  return (
    <section className="py-24 bg-accent">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl bg-background border border-black/10 hover:border-black/20 transition-colors group shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center mb-4 text-black group-hover:bg-black group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 