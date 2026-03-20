import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Quote",
  description: "Get a free, no-obligation quote for your website project. Custom-coded websites from £2,497. 14-day delivery. 100% money-back guarantee.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact CrftdWeb | Free Quote',
    description: 'Get a free quote for your website. Custom-coded from £2,497. 14-day delivery.',
    url: 'https://www.crftdweb.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
