import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Portfolio & Case Studies",
  description: "See real results: +340% traffic, +520% bookings, +180% leads. Explore CrftdWeb's portfolio of custom-coded websites and digital products.",
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Our Work | CrftdWeb Portfolio',
    description: 'Real results: +340% traffic, +520% bookings. View our case studies.',
    url: 'https://www.crftdweb.com/work',
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
