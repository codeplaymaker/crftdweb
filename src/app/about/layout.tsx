import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about CrftdWeb. Our mission, values, and the team behind premium web experiences.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
