'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconLogo } from './SFSymbols';
import { DynamicBanner } from './DynamicBanner';
import { ThemeToggle } from './ThemeToggle';

export function AppleNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/projects', label: 'Hardware', active: pathname.startsWith('/projects') },
    { href: '/learn', label: 'Curriculum', active: pathname.startsWith('/learn') },
    { href: '/gear', label: 'DIA Labs', active: pathname.startsWith('/gear') },
    { href: '/achievements', label: 'Honors', active: pathname.startsWith('/achievements') },
    { href: '/team', label: 'People', active: pathname.startsWith('/team') || pathname.startsWith('/alumni') },
  ];

  const extraMobileLinks = [
    { href: '/events', label: 'Events & Hackathons', active: pathname.startsWith('/events') },
    { href: '/about', label: 'About & Creed', active: pathname === '/about' },
    { href: '/contact', label: 'Lab Dispatch', active: pathname === '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      <div className="w-full pointer-events-auto">
        <DynamicBanner />
      </div>
      <div className="w-full max-w-apple px-4 pt-3 flex justify-center">
        <nav
          aria-label="Main Navigation"
          className="pointer-events-auto w-full h-14 rounded-pill apple-nav-glass flex items-center justify-between px-3 md:px-5 transition-all duration-300"
        >
          {/* Brand Lockup */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 font-semibold text-[15px] tracking-tight text-ink-primary min-h-[44px] pr-2 focus-visible:outline-apple-blue"
            aria-label="TRAIC Homepage"
          >
            <div className="w-7 h-7 rounded-lg bg-canvas-surface border border-subtle flex items-center justify-center text-apple-blue shadow-sm">
              <IconLogo size={16} />
            </div>
            <span>TRAIC</span>
          </Link>

          {/* Desktop Nav Destinations (Hick's Law: 5 links) */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? 'page' : undefined}
                  className={`inline-flex items-center min-h-[44px] px-3.5 text-[13px] font-medium rounded-pill transition-colors ${
                    link.active
                      ? 'text-apple-blue font-semibold'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Primary CTA, Theme Toggle & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            
            <Link
              href="/join"
              onClick={() => setMobileOpen(false)}
              className="hidden sm:inline-flex items-center justify-center min-h-[44px] px-5 rounded-pill bg-ink-primary text-canvas hover:opacity-90 active:scale-95 font-semibold text-[13.5px] transition-all duration-200 shadow-sm"
            >
              Apply Now
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-11 h-11 min-h-[44px] min-w-[44px] rounded-pill bg-canvas-surface border border-subtle flex items-center justify-center text-ink-primary focus-visible:outline-apple-blue cursor-pointer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Overlay Sheet */}
      {mobileOpen && (
        <div className="md:hidden pointer-events-auto fixed inset-x-0 top-[72px] bottom-0 z-40 bg-black/75 backdrop-blur-2xl px-6 py-6 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary mb-2">
              MAIN DESTINATIONS
            </span>
            {[...navLinks, ...extraMobileLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`min-h-[48px] flex items-center justify-between text-[16px] font-medium border-b border-subtle/50 transition-colors ${
                  link.active ? 'text-apple-blue font-semibold' : 'text-ink-primary hover:text-apple-blue'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-[14px] text-ink-tertiary">↗</span>
              </Link>
            ))}
          </div>

          <div className="pt-6 pb-8 flex flex-col gap-3">
            <Link
              href="/join"
              onClick={() => setMobileOpen(false)}
              className="w-full min-h-[48px] rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-[15px] flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              Apply for Cohort 2026 →
            </Link>
            <p className="text-[11.5px] text-ink-tertiary text-center font-mono">
              DIA LABS • COER UNIVERSITY ROORKEE
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
