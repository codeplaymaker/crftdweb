import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Strategy Call",
  description: "Schedule a free strategy call with CrftdWeb to see how our AI-powered Engine can grow your business.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
