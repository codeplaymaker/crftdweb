import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CrftdWeb. Let's discuss your next web project, branding, or digital product.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
