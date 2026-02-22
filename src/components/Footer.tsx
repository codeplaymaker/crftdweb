'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Don't render on Playbook or Engine pages — they have their own footers
  if (pathname?.startsWith('/playbook') || pathname?.startsWith('/engine')) return null;

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-logo text-2xl tracking-tight block mb-4">
              CrftdWeb
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Premium web design &amp; development studio. Crafting digital excellence since day one.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-white/50 hover:text-white text-sm transition-colors">All Services</Link></li>
              <li><Link href="/services/web-design" className="text-white/50 hover:text-white text-sm transition-colors">Web Design</Link></li>
              <li><Link href="/services/branding" className="text-white/50 hover:text-white text-sm transition-colors">Branding</Link></li>
              <li><Link href="/services/ui-ux" className="text-white/50 hover:text-white text-sm transition-colors">UI/UX Design</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/50 hover:text-white text-sm transition-colors">About</Link></li>
              <li><Link href="/work" className="text-white/50 hover:text-white text-sm transition-colors">Work</Link></li>
              <li><Link href="/contact" className="text-white/50 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wide">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/playbook" className="text-white/50 hover:text-white text-sm transition-colors">The Playbook</Link></li>
              <li><Link href="/engine" className="text-white/50 hover:text-white text-sm transition-colors">Engine</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} CrftdWeb. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-white/40 hover:text-white/60 text-sm transition-colors">Contact</Link>
            <Link href="/playbook" className="text-white/40 hover:text-white/60 text-sm transition-colors">Playbook</Link>
            <Link href="/engine" className="text-white/40 hover:text-white/60 text-sm transition-colors">Engine</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
