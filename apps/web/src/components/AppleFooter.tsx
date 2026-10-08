'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { IconLogo } from './SFSymbols';
import { ThemeToggle } from './ThemeToggle';

export function AppleFooter() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-separator bg-canvas pt-16 pb-28 md:pb-16 text-ink-secondary" aria-label="Footer">
      <div className="w-full max-w-apple mx-auto px-4">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-subtle">
          {/* Brand Identity & Mission */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group min-h-[44px]">
              <div className="w-9 h-9 rounded-xl bg-canvas-surface border border-subtle flex items-center justify-center text-apple-blue shadow-sm group-hover:border-apple-blue/40 transition-colors">
                <IconLogo size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-semibold tracking-tight text-ink-primary group-hover:text-apple-blue transition-colors">
                  TRAIC
                </span>
                <span className="text-[11px] font-mono tracking-widest text-ink-tertiary uppercase">
                  Robotics &amp; AI Community
                </span>
              </div>
            </Link>

            <p className="mt-4 text-[14px] text-ink-secondary leading-[1.6] max-w-[34ch]">
              Collegiate engineering collective dedicated to custom PCBs, real-time embedded control, autonomous robotics, and self-hosted infrastructure.
            </p>

            {/* Social Channels (44x44 Fitts targets) */}
            <div className="mt-6 flex items-center gap-3 text-ink-secondary">
              <a
                href="https://github.com/traiccoer2025-code"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-pill bg-canvas-surface border border-subtle flex items-center justify-center hover:border-apple-blue hover:text-apple-blue transition-colors cursor-pointer"
                aria-label="GitHub Organization"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-pill bg-canvas-surface border border-subtle flex items-center justify-center hover:border-apple-blue hover:text-apple-blue transition-colors cursor-pointer"
                aria-label="LinkedIn Profile"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-pill bg-canvas-surface border border-subtle flex items-center justify-center hover:border-apple-blue hover:text-apple-blue transition-colors cursor-pointer"
                aria-label="Instagram Profile"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Platform & Systems */}
          <div className="md:col-span-3">
            <h4 className="text-[12px] font-mono uppercase tracking-[0.1em] text-ink-primary font-semibold mb-4">
              Hardware &amp; Work
            </h4>
            <ul className="space-y-3 text-[14px] list-none p-0 m-0">
              <li>
                <Link href="/projects" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Hardware Archive
                </Link>
              </li>
              <li>
                <Link href="/gear" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  DIA Labs Instruments
                </Link>
              </li>
              <li>
                <Link href="/self-host" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Systems Sovereignty
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Verified Honors
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Apprenticeship Tracks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Governance */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-mono uppercase tracking-[0.1em] text-ink-primary font-semibold mb-4">
              Community
            </h4>
            <ul className="space-y-3 text-[14px] list-none p-0 m-0">
              <li>
                <Link href="/about" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  About &amp; Creed
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Active Builders
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Alumni Placements
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Workshops &amp; Hackathons
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-apple-blue transition-colors min-h-[44px] inline-flex items-center">
                  Lab Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Physical Facility */}
          <div className="md:col-span-3">
            <h4 className="text-[12px] font-mono uppercase tracking-[0.1em] text-ink-primary font-semibold mb-4">
              Facility &amp; Admissions
            </h4>
            <p className="text-[13.5px] text-ink-secondary leading-[1.6]">
              DIA Labs, Block C-302<br />
              Advanced Robotics &amp; AI Bay<br />
              COER University, Roorkee<br />
              Uttarakhand 247667, India
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-canvas-surface border border-subtle text-[11px] font-mono text-[var(--status-emerald)] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-emerald)] animate-pulse" />
                <span>Lab Operational 24/7</span>
              </div>
              <Link
                href="/join"
                className="mt-2 text-[13px] font-semibold text-apple-blue hover:underline inline-flex items-center gap-1 min-h-[44px]"
              >
                Apply for Cohort 2026 →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Colophon Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-ink-tertiary">
          <p>© {new Date().getFullYear()} TRAIC — DIA Labs, COER University. Open access collegiate research community.</p>
          <div className="flex items-center gap-5 flex-wrap">
            <Link href="/contact" className="hover:text-ink-primary transition-colors min-h-[44px] inline-flex items-center">
              Dispatch Dispatcher
            </Link>
            <Link href="/self-host" className="hover:text-ink-primary transition-colors min-h-[44px] inline-flex items-center">
              Systems Topology
            </Link>
            <div className="inline-flex items-center">
              <ThemeToggle />
            </div>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-ink-primary transition-colors min-h-[44px] cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5 text-apple-blue" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
