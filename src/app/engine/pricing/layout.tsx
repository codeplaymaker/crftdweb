import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engine — AI-Powered Business Tools",
  description: "Build irresistible offers, research markets, and create high-converting content with AI-powered tools for coaches, consultants, and agencies.",
  openGraph: {
    title: "CrftdWeb Engine — AI-Powered Business Tools",
    description: "Build irresistible offers, research markets, and create high-converting content with AI.",
  },
};

export default function EnginePricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
