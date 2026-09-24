'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  ArrowLeft,
  Box,
  Activity,
  Trophy,
  Users,
  Radio,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { ProjectCard3DPreview } from '@/components/ProjectCard3DPreview';
import { Project3DInspector } from '@/components/Project3DInspector';
import { TelemetryModal } from '@/components/TelemetryModal';

export interface ProjectDetail {
  slug: string;
  title: string;
  category: 'HARDWARE' | 'HYBRID' | 'SOFTWARE';
  year: number;
  status: string;
  tagline: string;
  description: string;
  fullNarrative: string;
  techStack: string[];
  repoUrl: string;
  hasTelemetryDemo?: boolean;
  specs: { label: string; value: string }[];
  bom: { component: string; partNumber: string; function: string }[];
  team: { name: string; role: string }[];
  awards?: string[];
  modelUrl?: string;
}

export function ProjectDetailClient({ project }: { project: ProjectDetail }) {
  const [inspectingCAD, setInspectingCAD] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);

  return (
    <div className="min-h-screen bg-bg-0 py-12">
      {/* 3D CAD Modal */}
      {inspectingCAD && (
        <Project3DInspector
          projectTitle={project.title}
          category={project.category}
          techStack={project.techStack}
          modelUrl={project.modelUrl}
          onClose={() => setInspectingCAD(false)}
        />
      )}

      {/* Telemetry Simulator Modal */}
      {showTelemetry && <TelemetryModal onClose={() => setShowTelemetry(false)} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 font-mono text-xs text-text-2">
          <Link
            href="/projects"
            className="flex items-center gap-1.5 hover:text-accent-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>ALL PROJECTS</span>
          </Link>
          <span>/</span>
          <span className="text-accent font-semibold uppercase">{project.category}</span>
          <span>/</span>
          <span className="text-text-1 truncate">{project.title}</span>
        </div>

        {/* Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 rounded-3xl border border-border bg-gradient-to-b from-surface via-bg-1 to-bg-0 p-8 sm:p-10 shadow-2xl">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-accent/15 px-3 py-1 text-xs font-mono font-bold text-accent border border-accent/40">
                {project.category}
              </span>
              <span className="rounded-md bg-surface px-3 py-1 text-xs font-mono text-text-2 border border-border">
                {project.year}
              </span>
              <span className="rounded-full bg-success/20 px-3 py-0.5 text-xs font-mono text-success border border-success/30 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                {project.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-1 leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-text-2 font-medium leading-relaxed">
              {project.tagline}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setInspectingCAD(true)}
                className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-bg-0 shadow-lg hover:bg-accent-hover transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Box className="h-4 w-4" />
                <span>INSPECT 3D CAD MODEL</span>
              </button>

              {project.hasTelemetryDemo && (
                <button
                  type="button"
                  onClick={() => setShowTelemetry(true)}
                  className="flex items-center gap-2 rounded-xl border border-accent-2/60 bg-accent-2/15 px-5 py-3.5 text-sm font-bold text-accent-2 hover:bg-accent-2/25 transition-all shadow-sm"
                >
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span>LIVE TELEMETRY STATION</span>
                </button>
              )}

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-text-1 hover:border-accent-2/50 hover:bg-surface-hover transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GITHUB REPO</span>
              </a>
            </div>

            {/* Tech stack tags */}
            <div className="pt-2">
              <div className="text-xs font-mono text-text-2 uppercase tracking-wider mb-2">Technologies Used</div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-bg-0 px-3 py-1 font-mono text-xs font-semibold text-accent-2 border border-accent-2/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Embedded 3D Mini Viewport on Top Right */}
          <div className="lg:col-span-5 w-full flex flex-col items-center">
            <div
              className="relative w-full h-[280px] sm:h-[340px] rounded-2xl border border-border/80 bg-bg-1/90 shadow-inner overflow-hidden flex flex-col justify-between"
              style={{ touchAction: 'pan-y' }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-surface/80 text-[11px] font-mono text-text-2">
                <span className="flex items-center gap-1.5 font-bold text-text-1">
                  <Cpu className="h-3.5 w-3.5 text-accent" />
                  CAD PREVIEW
                </span>
                <span className="text-[10px] text-accent border border-accent/40 rounded px-1.5 py-0.5">SWIPE 3D</span>
              </div>

              <div className="relative flex-1 w-full min-h-[220px]">
                <ProjectCard3DPreview category={project.category} slug={project.slug} title={project.title} />
              </div>

              <div className="px-3 py-2 border-t border-border/60 bg-surface/80 text-center">
                <button
                  type="button"
                  onClick={() => setInspectingCAD(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-accent-2 hover:underline"
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>OPEN FULL 3D INSPECTOR STAGE →</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Engineering Deep-Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Engineering Narrative */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
              <h2 className="text-xl font-bold text-text-1 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                <span>Engineering & Design Narrative</span>
              </h2>
              <p className="text-text-2 leading-relaxed text-base mb-4">
                {project.fullNarrative}
              </p>
              <p className="text-text-2 leading-relaxed text-base">
                {project.description}
              </p>
            </div>

            {/* Bill of Materials (BOM) Table */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-1 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-accent-2" />
                  <span>Bill of Materials (BOM) & Key Silicon</span>
                </h2>
                <span className="font-mono text-xs text-text-2">{project.bom.length} PRIMARY COMPONENTS</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-2 bg-bg-1/80">
                      <th className="py-3 px-4 font-semibold">SUBSYSTEM</th>
                      <th className="py-3 px-4 font-semibold">PART NUMBER</th>
                      <th className="py-3 px-4 font-semibold">PRIMARY ROLE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {project.bom.map((b) => (
                      <tr key={b.partNumber} className="hover:bg-surface-hover/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-text-1">{b.component}</td>
                        <td className="py-3.5 px-4 text-accent">{b.partNumber}</td>
                        <td className="py-3.5 px-4 text-text-2">{b.function}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar: Technical Specifications, Awards & Team */}
          <div className="space-y-8">
            {/* Technical Specifications */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-sm font-mono font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span>Hardware Specifications</span>
              </h3>
              <dl className="space-y-3 font-mono text-xs">
                {project.specs.map((s) => (
                  <div key={s.label} className="border-b border-border/60 pb-2.5 last:border-none last:pb-0">
                    <dt className="text-text-2 text-[11px] mb-0.5">{s.label}</dt>
                    <dd className="font-bold text-text-1 text-xs">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Awards & Recognition */}
            {project.awards && project.awards.length > 0 && (
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 shadow-sm">
                <h3 className="text-sm font-mono font-bold text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Honors & Championships</span>
                </h3>
                <ul className="space-y-2 font-mono text-xs text-text-1">
                  {project.awards.map((award) => (
                    <li key={award} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">★</span>
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contributing Engineers */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="text-sm font-mono font-bold text-text-1 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-accent-2" />
                <span>TRAIC Core Team</span>
              </h3>
              <ul className="space-y-3 font-mono text-xs">
                {project.team.map((member) => (
                  <li key={member.name} className="flex flex-col border-b border-border/50 pb-2 last:border-none last:pb-0">
                    <span className="font-bold text-text-1">{member.name}</span>
                    <span className="text-[11px] text-text-2">{member.role}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 mt-4 border-t border-border">
                <Link
                  href="/team"
                  className="flex items-center justify-between text-xs font-mono font-semibold text-accent-2 hover:underline"
                >
                  <span>Meet All Student Builders</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
