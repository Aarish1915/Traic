'use client';

import Link from 'next/link';
import { IconBox, IconChevronRight } from './SFSymbols';

export interface ProjectItem {
  title: string;
  category: string;
  tagline: string;
  tech: string[];
  slug: string;
  status: string;
  modelUrl?: string;
}

interface FeaturedProjectsSectionProps {
  projects: ProjectItem[];
  onInspect3D?: (project: ProjectItem) => void;
}

export function FeaturedProjectsSection({
  projects,
  onInspect3D,
}: FeaturedProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 px-4 bg-canvas" aria-labelledby="projects-title">
      <div className="w-full max-w-apple mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-secondary mb-3">
              Portfolio
            </p>
            <h2 id="projects-title" className="text-[clamp(34px,4.8vw,56px)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink-primary max-w-[16ch]">
              Built by students. Made to work.
            </h2>
            <p className="text-[clamp(17px,1.8vw,20px)] text-ink-secondary leading-[1.45] max-w-[54ch] mt-4">
              Explore custom-machined rovers, 4-layer edge neural PCBs, and real-time telemetry systems.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-apple-blue hover:underline underline-offset-4 min-h-[44px] text-[15px] font-medium"
          >
            <span>View all projects</span>
            <IconChevronRight size={16} />
          </Link>
        </div>

        {/* 2x2 Grid of Rich Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <article
              key={p.slug}
              className="apple-card overflow-hidden min-h-[420px] flex flex-col justify-between p-8 md:p-10 relative group"
            >
              {/* Card Top: Category and Status Pill */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="inline-block px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-[12px] font-mono font-medium text-ink-secondary">
                  {p.category}
                </span>
                <span className="text-[12px] font-mono text-ink-tertiary">
                  {p.status || 'Fabricated'}
                </span>
              </div>

              {/* Card Middle: Title, Tagline, Tech Chips */}
              <div>
                <h3 className="text-[28px] font-semibold leading-[1.18] text-ink-primary mb-3">
                  {p.title}
                </h3>
                <p className="text-[15px] text-ink-secondary leading-[1.5] max-w-[42ch] mb-6">
                  {p.tagline}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tech.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-canvas-surface border border-subtle text-[12px] font-mono text-ink-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Interactive Actions */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-subtle flex-wrap">
                {onInspect3D && p.modelUrl ? (
                  <button
                    type="button"
                    onClick={() => onInspect3D(p)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-pill bg-canvas-surface hover:border-apple-blue/50 hover:text-apple-blue active:scale-95 text-ink-primary border border-subtle text-[13px] font-semibold transition-all cursor-pointer"
                  >
                    <IconBox size={16} className="text-apple-blue" />
                    <span>Inspect 3D CAD</span>
                  </button>
                ) : (
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-pill bg-canvas-surface hover:border-apple-blue/40 text-ink-primary border border-subtle text-[13px] font-medium"
                  >
                    <span>View Specifications</span>
                  </Link>
                )}

                <Link
                  href={`/projects/${p.slug}`}
                  className="inline-flex items-center gap-1.5 text-apple-blue hover:underline text-[14px] font-medium min-h-[44px]"
                >
                  <span>Case Study</span>
                  <IconChevronRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
