'use client';

import Link from 'next/link';
import { ArrowRight, FolderGit2 } from 'lucide-react';

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  category: 'LEADERSHIP' | 'DOMAIN_LEAD' | 'MEMBER' | 'ALUMNI';
  domain: string;
  bio: string;
  skills: string[];
  avatar?: string;
  initials: string;
  academicYear?: string;
  github?: string;
  linkedin?: string;
  projects?: Array<{ title: string; slug: string }>;
}

function AvatarBox({ src, initials, name }: { src?: string; initials: string; name: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-16 h-16 rounded-full object-cover border border-subtle shrink-0 shadow-sm"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-canvas-surface border border-subtle flex items-center justify-center font-bold text-ink-primary text-[18px] shrink-0 shadow-sm font-mono text-apple-blue">
      {initials}
    </div>
  );
}

export function ClientTeam({
  leadership,
  domainLeads,
  activeMembers,
}: {
  leadership: TeamMember[];
  domainLeads: TeamMember[];
  activeMembers: TeamMember[];
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto mb-20">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            THE COMMUNITY BUILDERS
          </span>
          <h1 className="text-[36px] sm:text-[50px] font-display font-bold tracking-tight text-ink-primary mt-3 leading-tight">
            The hands that solder, debug, and ship.
          </h1>
          <p className="mt-4 text-[16px] text-ink-secondary leading-relaxed">
            Every member has cleared practical DIA Labs bench assessments. No figureheads, no honorary titles — only active builders committed to hardware integrity.
          </p>
          <div className="mt-6">
            <Link
              href="/alumni"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-apple-blue hover:underline min-h-[44px]"
            >
              <span>Looking for graduated builders? View Alumni Network</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 1 — LEADERSHIP (COORDINATOR & CO-COORDINATOR) */}
        <section className="mb-24">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              EXECUTIVE LEADERSHIP
            </span>
            <h2 className="text-[26px] font-display font-bold text-ink-primary mt-1">
              Coordinators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="p-8 rounded-3xl bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <AvatarBox src={member.avatar} initials={member.initials} name={member.name} />
                      <div>
                        <h3 className="text-[20px] font-display font-bold text-ink-primary">{member.name}</h3>
                        <p className="text-[13px] text-apple-blue font-medium">{member.role}</p>
                        <span className="text-[11px] font-mono text-ink-tertiary">{member.academicYear}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[14px] text-ink-secondary leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary block mb-2">
                        Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.map((s) => (
                          <span key={s} className="px-2.5 py-0.5 rounded-lg bg-canvas border border-subtle text-[11px] font-mono text-ink-secondary">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {member.projects && member.projects.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary block mb-2">
                          Flagship Systems
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {member.projects.map((p) => (
                            <Link
                              key={p.slug}
                              href={`/projects/${p.slug}`}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-pill bg-canvas hover:bg-canvas-elevated border border-subtle text-[12px] text-apple-blue hover:underline"
                            >
                              <FolderGit2 className="h-3 w-3" />
                              <span>{p.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-subtle flex items-center gap-3">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-pill bg-canvas border border-subtle flex items-center justify-center hover:border-apple-blue hover:text-apple-blue transition-colors min-h-[44px] min-w-[44px]"
                      aria-label={`${member.name} GitHub`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-pill bg-canvas border border-subtle flex items-center justify-center hover:border-apple-blue hover:text-apple-blue transition-colors min-h-[44px] min-w-[44px]"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2 — DOMAIN LEADS */}
        <section className="mb-24">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              TECHNICAL DIRECTORS
            </span>
            <h2 className="text-[26px] font-display font-bold text-ink-primary mt-1">
              Domain Leads
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {domainLeads.map((lead) => (
              <div
                key={lead.name}
                className="p-6 rounded-3xl bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <AvatarBox src={lead.avatar} initials={lead.initials} name={lead.name} />
                    <div>
                      <h3 className="text-[17px] font-display font-semibold text-ink-primary">{lead.name}</h3>
                      <p className="text-[12px] text-apple-blue font-medium">{lead.role}</p>
                      <span className="text-[10.5px] font-mono text-ink-tertiary">{lead.academicYear}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink-secondary leading-relaxed mb-4">
                    {lead.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-canvas border border-subtle text-[10.5px] font-mono text-ink-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — ACTIVE BUILDERS & MEMBERS */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              LABORATORY CADRE
            </span>
            <h2 className="text-[26px] font-display font-bold text-ink-primary mt-1">
              Active Builders
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeMembers.map((member) => (
              <div
                key={member.name}
                className="p-5 rounded-2xl bg-canvas-surface border border-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-canvas border border-subtle flex items-center justify-center font-bold text-apple-blue text-[13px] font-mono">
                      {member.initials}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-ink-primary">{member.name}</h4>
                      <p className="text-[11px] text-apple-blue">{member.domain}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-canvas text-[10px] font-mono text-ink-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-subtle text-[10px] font-mono text-ink-tertiary">
                  {member.academicYear}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
