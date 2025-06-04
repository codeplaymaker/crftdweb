'use client';

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Work from "@/components/Work";
import CTA from "@/components/CTA";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  return (
    <main>
      <LoadingScreen />
      <Hero />
      <Features />
      <Work />
      <CTA />
    </main>
  );
}
