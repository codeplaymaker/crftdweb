import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Truth Engine — AI Market Research",
  description: "Discover profitable niches with AI-powered market research. Analyze pain points, demand signals, and competitive gaps in seconds.",
};

export default function TruthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
