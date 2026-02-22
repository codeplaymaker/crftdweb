'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function PlaybookNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/playbook/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboard) return null;

  return (
    <>
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white text-sm py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <span className="hidden sm:inline font-medium">THE CRFTD PLAYBOOK</span>
          <span className="text-white/80">|</span>
          <span className="text-white/90">From service provider to product builder</span>
          <Link 
            href="/playbook/diagnose" 
            className="ml-2 text-white hover:text-white/90 font-medium flex items-center gap-1"
          >
            Take Assessment →
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/playbook" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-semibold text-lg">Playbook</span>
              <span className="text-xs text-white/50 hidden sm:inline">by CrftdWeb</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/playbook#framework" className="text-white/70 hover:text-white transition-colors text-sm">
                Framework
              </Link>
              <Link href="/playbook#stages" className="text-white/70 hover:text-white transition-colors text-sm">
                6 Stages
              </Link>
              <Link href="/playbook#systems" className="text-white/70 hover:text-white transition-colors text-sm">
                Systems
              </Link>
              <Link href="/playbook/diagnose" className="text-white/70 hover:text-white transition-colors text-sm">
                Diagnose
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link 
                href="/playbook/signin" 
                className="text-white/70 hover:text-white transition-colors text-sm hidden sm:block"
              >
                Log in
              </Link>
              <Link 
                href="/playbook/diagnose"
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors hidden sm:block"
              >
                Start Assessment
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-0 right-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link href="/playbook#framework" className="block text-white/70 hover:text-white transition-colors py-2">Framework</Link>
              <Link href="/playbook#stages" className="block text-white/70 hover:text-white transition-colors py-2">6 Stages</Link>
              <Link href="/playbook#systems" className="block text-white/70 hover:text-white transition-colors py-2">Systems</Link>
              <Link href="/playbook/diagnose" className="block text-white/70 hover:text-white transition-colors py-2">Diagnose</Link>
              <hr className="border-white/10" />
              <Link href="/playbook/signin" className="block text-white/70 hover:text-white transition-colors py-2">Log in</Link>
              <Link href="/playbook/diagnose" className="block bg-white text-black px-4 py-3 rounded-full text-center font-medium">Start Assessment</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PlaybookFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/playbook/dashboard');

  if (isDashboard) return null;

  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/playbook" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-semibold text-lg">Playbook</span>
            </Link>
            <p className="text-white/50 text-sm">
              The CRFTD methodology for transforming service providers into product builders. Built on the 6-stage framework.
            </p>
          </div>

          {/* Framework */}
          <div>
            <h4 className="text-white font-semibold mb-4">Framework</h4>
            <ul className="space-y-2">
              <li><Link href="/playbook/diagnose" className="text-white/50 hover:text-white text-sm transition-colors">Diagnose</Link></li>
              <li><Link href="/playbook/prescribe" className="text-white/50 hover:text-white text-sm transition-colors">Prescribe</Link></li>
              <li><Link href="/playbook/systemize" className="text-white/50 hover:text-white text-sm transition-colors">Systemize</Link></li>
            </ul>
          </div>

          {/* Growth */}
          <div>
            <h4 className="text-white font-semibold mb-4">Growth</h4>
            <ul className="space-y-2">
              <li><Link href="/playbook/productize" className="text-white/50 hover:text-white text-sm transition-colors">Productize</Link></li>
              <li><Link href="/playbook/prove" className="text-white/50 hover:text-white text-sm transition-colors">Prove</Link></li>
              <li><Link href="/playbook/scale" className="text-white/50 hover:text-white text-sm transition-colors">Scale</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">CrftdWeb</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">Agency</Link></li>
              <li><Link href="/engine" className="text-white/50 hover:text-white text-sm transition-colors">Engine</Link></li>
              <li><Link href="/contact" className="text-white/50 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2026 The CRFTD Playbook by CrftdWeb. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/playbook" className="text-white/40 hover:text-white/60 text-sm transition-colors">Home</Link>
            <Link href="/engine" className="text-white/40 hover:text-white/60 text-sm transition-colors">Engine</Link>
            <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">CrftdWeb</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PlaybookLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/playbook/dashboard');

  return (
    <div className="min-h-screen bg-black text-white">
      <PlaybookNavbar />
      <main className={isDashboard ? '' : 'pt-24'}>
        {children}
      </main>
      <PlaybookFooter />
    </div>
  );
}
