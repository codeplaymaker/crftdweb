import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Web design, branding, UI/UX. Premium digital services crafted to grow your business.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
