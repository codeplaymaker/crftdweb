import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Work from "@/components/Work";
import Industries from "@/components/Industries";
import BlogHighlights from "@/components/BlogHighlights";
import CTA from "@/components/CTA";
import Paths from "@/components/Paths";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  return (
    <main>
      <LoadingScreen />
      <Hero />
      <Features />
      <HowItWorks />
      <Work />
      <Industries />
      <BlogHighlights />
      <Paths />
      <CTA />
    </main>
  );
}
