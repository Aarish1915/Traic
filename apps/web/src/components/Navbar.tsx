'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/team' },
  { label: 'Learn', href: '/learn' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-bg-0/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-accent shadow-sm">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-text-1">TRAIC</span>
            <span className="hidden text-[10px] tracking-widest text-text-2 uppercase sm:inline-block">Robotics & AI Club</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface text-accent-2 border border-border'
                    : 'text-text-2 hover:bg-surface/60 hover:text-text-1'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button & Theme Switcher */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/join"
            className="flex items-center gap-1.5 rounded-lg border border-accent/60 bg-accent px-4 py-2 text-sm font-semibold text-bg-0 transition-all hover:bg-accent-hover hover:glow-accent"
          >
            <span>Join TRAIC</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-2 hover:text-text-1"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-border bg-bg-1 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-surface text-accent-2 font-semibold'
                    : 'text-text-2 hover:bg-surface hover:text-text-1'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-border/80 pt-3 mt-2 px-1">
              <span className="text-xs font-mono text-text-2">THEME PREFERENCE:</span>
              <ThemeToggle />
            </div>
            <Link
              href="/join"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-0"
            >
              <span>Join TRAIC</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
