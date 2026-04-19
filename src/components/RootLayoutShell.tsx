'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPlaybook = pathname?.startsWith('/playbook');
  const isEngine = pathname?.startsWith('/engine');
  const isRep = pathname?.startsWith('/rep');
  const isAdmin = pathname?.startsWith('/admin');
  const isClientPreview = pathname?.startsWith('/beautybyhelen');
  const isClient = pathname?.startsWith('/client');
  const hasOwnLayout = isPlaybook || isEngine || isRep || isAdmin || isClientPreview || isClient;

  return (
    <>
      {!hasOwnLayout && <Navbar />}
      <main className={hasOwnLayout ? '' : 'pt-16'}>
        {children}
      </main>
      {!hasOwnLayout && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        }}
      />
    </>
  );
}
