'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPlaybook = pathname?.startsWith('/playbook');
  const isEngine = pathname?.startsWith('/engine');
  const hasOwnLayout = isPlaybook || isEngine;

  return (
    <>
      {!hasOwnLayout && <Navbar />}
      <main className={hasOwnLayout ? '' : 'pt-16'}>
        {children}
      </main>
      {!hasOwnLayout && <Footer />}
    </>
  );
}
