import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore CrftdWeb's portfolio of premium websites, brands, and digital products.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
