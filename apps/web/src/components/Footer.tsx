import Link from 'next/link';
import { Cpu } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, DiscordIcon } from '@/components/icons';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-1 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-accent">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="text-xl font-black text-text-1">TRAIC</span>
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

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-2">
          <p>© {new Date().getFullYear()} TRAIC. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex gap-6">
            <span>Built by engineers for engineers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
