'use client';

import { motion } from "framer-motion";
import { Code2, Target, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Conversion-First Design",
    description: "Every section answers one question in the buyer's mind. We don't just make it pretty. We make it sell."
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Hand-Coded. No Templates.",
    description: "Custom-built with Next.js and modern tech. No WordPress themes, no page builders, no compromises."
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Built to Perform",
    description: "90+ PageSpeed scores, sub-2s load times. Because every second of delay costs you customers."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Trust at Every Touchpoint",
    description: "We engineer credibility into your site. Social proof, clear process, risk reversal. So visitors feel safe buying."
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
    <section className="py-32 bg-accent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">
            HOW WE&apos;RE DIFFERENT
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            A pretty site is worthless<br className="hidden md:block" />
            {' '}<span className="text-muted-foreground">if it doesn&apos;t convert.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We build websites that look exceptional <em>and</em> drive real business results.
            Here&apos;s how.
          </p>
        </motion.div>

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
            >
              <div
                className="block p-6 rounded-xl bg-background border border-black/10 hover:border-black/20 transition-colors group shadow-sm h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center mb-5 text-black group-hover:bg-black group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 