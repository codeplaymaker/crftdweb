import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Eden Aesthetics & Holistic Health | Free Consultation, Pontypool',
  description:
    'Book a free consultation with Louise and Andrea, nurse prescribers at Eden Aesthetics & Holistic Health in Abersychan, Pontypool. Weight loss support and skin & aesthetics.',
  robots: { index: false, follow: false },
};

export default function EdenLayout({ children }: { children: ReactNode }) {
  return children;
}
