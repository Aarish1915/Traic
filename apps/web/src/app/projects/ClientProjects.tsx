'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FolderGit2 } from 'lucide-react';

export interface ProjectItem {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: number | string;
  tech: string[];
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  specs?: Record<string, string>;
  bom?: Array<{ component: string; partNumber: string; role: string }>;
}

export function ClientProjects({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'ROBOTICS', 'FIRMWARE', 'PCB', 'AI'];

  const filteredProjects = selectedCategory === 'ALL'
    ? initialProjects
    : initialProjects.filter((p) => p.category?.toUpperCase() === selectedCategory);

  const featured = initialProjects.find((p) => p.featured) || initialProjects[0];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero */}
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            HARDWARE ARCHIVE
          </span>
          <h1 className="text-[36px] sm:text-[52px] font-display font-bold tracking-tight text-ink-primary mt-2 leading-[1.08]">
            Machines we designed and built.
          </h1>
          <p className="mt-4 text-[16px] text-ink-secondary leading-relaxed">
            Every entry in our hardware archive was designed, soldered, assembled, and firmware-programmed inside DIA Labs Block C-302.
          </p>
        </div>

        {/* Section 2: Featured Spotlight (12-Col Split) */}
        {featured && (
          <div className="mb-20 rounded-3xl bg-canvas-surface border border-subtle overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 8 Cols: Architectural Schematic View */}
              <div className="lg:col-span-8 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-subtle apple-ambient-glow flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-canvas border border-subtle text-[11px] font-mono text-apple-blue mb-4">
                    <span>FLAGSHIP SYSTEM // {featured.category}</span>
                  </div>
                  <h2 className="text-[28px] sm:text-[36px] font-display font-bold text-ink-primary">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-[15.5px] text-ink-secondary max-w-[620px] leading-relaxed">
                    {featured.tagline || featured.description}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-subtle/50">
                  {featured.tech.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-canvas border border-subtle text-[12px] font-mono text-ink-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right 4 Cols: Specs & Direct CTA */}
              <div className="lg:col-span-4 p-8 bg-canvas flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary block mb-4">
                    Hardware Specifications
                  </span>
                  <div className="space-y-3">
                    {featured.specs ? (
                      Object.entries(featured.specs).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="p-3 rounded-xl bg-canvas-surface border border-subtle">
                          <span className="text-[10.5px] font-mono text-ink-tertiary uppercase block">{k}</span>
                          <span className="text-[13px] font-medium text-ink-primary">{v}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-3 rounded-xl bg-canvas-surface border border-subtle">
                          <span className="text-[10.5px] font-mono text-ink-tertiary uppercase block">Compute Core</span>
                          <span className="text-[13px] font-medium text-ink-primary">NVIDIA Jetson Orin + STM32H753</span>
                        </div>
                        <div className="p-3 rounded-xl bg-canvas-surface border border-subtle">
                          <span className="text-[10.5px] font-mono text-ink-tertiary uppercase block">Perception Bus</span>
                          <span className="text-[13px] font-medium text-ink-primary">ISO 11898 CAN-FD @ 5.0 Mbps</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-subtle">
                  <Link
                    href={`/projects/${featured.slug}`}
                    className="w-full inline-flex items-center justify-center min-h-[44px] px-6 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[13.5px] transition-colors"
                  >
                    View Engineering Deep Dive
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[44px] px-5 rounded-pill text-[13px] font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0071E3] text-white font-medium shadow-sm'
                  : 'bg-canvas-surface hover:bg-canvas-elevated text-ink-secondary hover:text-ink-primary border border-subtle'
              }`}
            >
              {cat === 'ALL' ? 'All Hardware' : cat}
            </button>
          ))}
        </div>

        {/* Section 4: All Projects Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.slug}
              className="p-6 rounded-3xl bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10.5px] font-mono uppercase text-apple-blue tracking-wider font-semibold">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-mono text-ink-tertiary">
                    {project.year}
                  </span>
                </div>

                <h3 className="text-[20px] font-display font-bold text-ink-primary leading-snug">
                  {project.title}
                </h3>

                <p className="mt-2.5 text-[13.5px] text-ink-secondary leading-relaxed line-clamp-3">
                  {project.tagline || project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-canvas border border-subtle text-[10.5px] font-mono text-ink-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-subtle flex items-center justify-between">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-[13px] font-medium text-apple-blue hover:underline inline-flex items-center gap-1 min-h-[44px]"
                >
                  <span>Read Specs</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-tertiary hover:text-ink-primary transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-end"
                    aria-label={`${project.title} GitHub`}
                  >
                    <FolderGit2 className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
