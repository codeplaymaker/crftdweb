import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Resources",
  description: "Free marketing tools, templates, and resources to help grow your business with CrftdWeb.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
