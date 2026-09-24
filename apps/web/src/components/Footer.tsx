'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, DiscordIcon } from '@/components/icons';

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border bg-bg-1 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-surface/80 p-1 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/traic-logo.png" alt="TRAIC Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-text-1">TRAIC</span>
                <span className="text-[10px] tracking-wider text-text-2 uppercase font-medium">Robotics & AI Club</span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-2">
              Engineering workshop meets modern product studio. Designing custom PCBs, autonomous robots, and intelligent software systems.
            </p>
            <div className="mt-6 flex items-center gap-3 text-text-2">
              <a
                href="https://github.com/Aarish1915/Traic"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border p-2 hover:border-accent hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border p-2 hover:border-accent-2 hover:text-accent-2 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border p-2 hover:border-accent hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border p-2 hover:border-accent-2 hover:text-accent-2 transition-colors"
                aria-label="Discord"
              >
                <DiscordIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-text-1 uppercase">Platform</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-text-2">
              <li>
                <Link href="/projects" className="hover:text-accent transition-colors">
                  Projects & Prototypes
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-accent transition-colors">
                  Achievements & Awards
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-accent transition-colors">
                  Hackathons & Events
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-accent transition-colors">
                  Curriculum & Tracks
                </Link>
              </li>
              <li>
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL || 'https://traic-admin.vercel.app'}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-2 transition-colors flex items-center gap-1 text-accent/80 font-mono text-xs"
                >
                  <span>Admin Console</span>
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-text-1 uppercase">Community</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-text-2">
              <li>
                <Link href="/team" className="hover:text-accent transition-colors">
                  Leadership & Leads
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-accent transition-colors">
                  Apply for Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech lab details */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-text-1 uppercase">Makerspace Lab</h4>
            <p className="mt-4 text-sm text-text-2 leading-relaxed">
              Block 4, Ground Floor, TRAIC Innovation Lab<br />
              Equipped with oscilloscopes, SMD rework stations, 3D printers, and edge compute clusters.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></span>
              <span>Lab Active & Open</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-2 gap-4">
          <p>© {new Date().getFullYear()} TRAIC. All rights reserved.</p>

          {/* Go to Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-surface text-text-1 hover:border-accent hover:text-accent transition-all text-xs font-mono font-medium shadow-sm group"
            aria-label="Scroll back to top of page"
          >
            <span>GO TO TOP</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 text-accent" />
          </button>

          <div className="flex gap-6">
            <span>Built by engineers for engineers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
