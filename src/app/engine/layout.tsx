'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 14,
    minutes: 37,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes } = prev;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          return { days: 0, hours: 0, minutes: 0 };
        }
        return { days, hours, minutes };
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
    </span>
  );
}

function EngineNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/engine/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show marketing navbar on dashboard pages
  if (isDashboard) return null;

  return (
    <>
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-white text-sm py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <span className="hidden sm:inline font-medium">FOUNDER'S COHORT: LIVE</span>
          <span className="text-white/80">|</span>
          <CountdownTimer />
          <Link 
            href="/engine/truth#pricing" 
            className="ml-2 text-white hover:text-white/90 font-medium flex items-center gap-1"
          >
            Gain Access →
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
            <Link href="/engine" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-white font-semibold text-lg">Engine</span>
              <span className="text-xs text-white/50 hidden sm:inline">by CrftdWeb</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                CrftdWeb
              </Link>
              <span className="text-white/10">|</span>
              <Link href="/engine#features" className="text-white/70 hover:text-white transition-colors text-sm">
                Features
              </Link>
              <Link href="/engine/pricing" className="text-white/70 hover:text-white transition-colors text-sm">
                Pricing
              </Link>
              <Link href="/engine/whitelabel" className="text-white/70 hover:text-white transition-colors text-sm">
                Whitelabel
              </Link>
              <Link href="/engine/help" className="text-white/70 hover:text-white transition-colors text-sm">
                Help
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link 
                href="/engine/signin" 
                className="text-white/70 hover:text-white transition-colors text-sm hidden sm:block"
              >
                Log in
              </Link>
              <Link 
                href="/engine/demo"
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors hidden sm:block"
              >
                Book a Call
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
              <Link href="/engine#features" className="block text-white/70 hover:text-white transition-colors py-2">Features</Link>
              <Link href="/engine/pricing" className="block text-white/70 hover:text-white transition-colors py-2">Pricing</Link>
              <Link href="/engine/whitelabel" className="block text-white/70 hover:text-white transition-colors py-2">Whitelabel</Link>
              <Link href="/engine/help" className="block text-white/70 hover:text-white transition-colors py-2">Help</Link>
              <hr className="border-white/10" />
              <Link href="/engine/signin" className="block text-white/70 hover:text-white transition-colors py-2">Log in</Link>
              <Link href="/engine/demo" className="block bg-white text-black px-4 py-3 rounded-full text-center font-medium">Book a Call</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EngineFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/engine/dashboard');

  // Don't show footer on dashboard pages
  if (isDashboard) return null;

  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/engine" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-white font-semibold text-lg">Engine</span>
            </Link>
            <p className="text-white/50 text-sm">
              The fastest way to launch and automate high-ticket offers for coaches, consultants, and agency owners.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/engine/truth" className="text-white/50 hover:text-white text-sm transition-colors">Truth Engine</Link></li>
              <li><Link href="/engine#features" className="text-white/50 hover:text-white text-sm transition-colors">Features</Link></li>
              <li><Link href="/engine#agents" className="text-white/50 hover:text-white text-sm transition-colors">AI Agents</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/engine/pricing" className="text-white/50 hover:text-white text-sm transition-colors">Pricing</Link></li>
              <li><Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">CrftdWeb Agency</Link></li>
              <li><Link href="/contact" className="text-white/50 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/engine/help" className="text-white/50 hover:text-white text-sm transition-colors">Help Center</Link></li>
              <li><Link href="/engine/privacy" className="text-white/50 hover:text-white text-sm transition-colors">Privacy</Link></li>
              <li><Link href="/engine/terms" className="text-white/50 hover:text-white text-sm transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Engine by CrftdWeb. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/engine/privacy" className="text-white/40 hover:text-white/60 text-sm transition-colors">Privacy</Link>
            <Link href="/engine/terms" className="text-white/40 hover:text-white/60 text-sm transition-colors">Terms</Link>
            <Link href="/engine/security" className="text-white/40 hover:text-white/60 text-sm transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function EngineLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/engine/dashboard');

  return (
    <div className="min-h-screen bg-black text-white">
      <EngineNavbar />
      <main className={isDashboard ? '' : 'pt-24'}>
        {children}
      </main>
      <EngineFooter />
    </div>
  );
}
