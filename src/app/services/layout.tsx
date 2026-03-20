import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design Services | Custom Websites, Branding & SEO",
  description: "Custom-coded websites, branding, UI/UX design, and SEO. Built in Next.js, delivered in 14 days, 95+ PageSpeed guaranteed. View our services and pricing.",
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Web Design Services | CrftdWeb',
    description: 'Custom-coded websites, branding, UI/UX design, and SEO. Delivered in 14 days.',
    url: 'https://www.crftdweb.com/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
