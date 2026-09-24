'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Trophy,
  Box,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';

interface MemberProject {
  title: string;
  slug: string;
}

interface MemberAchievement {
  title: string;
  year: string;
}

interface TeamMember {
  name: string;
  role: string;
  domain: string;
  academicYear: string;
  bio: string;
  skills: string[];
  avatar?: string;
  initials: string;
  projects?: MemberProject[];
  achievements?: MemberAchievement[];
  github?: string;
  linkedin?: string;
}

interface AlumniItem {
  name: string;
  batch: string;
  role: string;
  company: string;
  legacyProject: string;
  quote: string;
  avatar?: string;
  initials: string;
  linkedin?: string;
}

const LEADERSHIP: TeamMember[] = [
  {
    name: 'Aarish Ali',
    role: 'Lead Coordinator & Robotics Architect',
    domain: 'Robotics & Firmware',
    academicYear: '2024–2025',
    bio: 'Directs overall club technical roadmaps, high-speed PCB fabrication, RTOS firmware development, and autonomous vehicle integration.',
    skills: ['ROS2', 'STM32', 'FreeRTOS', 'CAN-FD', 'High-Speed PCB', 'C++'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    initials: 'AA',
    projects: [
      { title: 'Autonomous Field Rover (UGV-X)', slug: 'autonomous-ugv-rover' },
      { title: 'Holonomic Mecanum Base', slug: 'robocon-holonomic-base' },
    ],
    achievements: [
      { title: '1st Prize — Smart India Hackathon', year: '2024' },
      { title: 'AIR 4 — DD Robocon Nationals', year: '2024' },
    ],
    github: 'https://github.com/Aarish1915',
    linkedin: 'https://linkedin.com/in/aarishali',
  },
  {
    name: 'Ananya Verma',
    role: 'Co-Coordinator & AI Research Lead',
    domain: 'Computer Vision & AI',
    academicYear: '2024–2025',
    bio: 'Oversees neural accelerator deployment, MIPI camera pipelines, and real-time obstacle detection algorithms on NVIDIA Jetson and Hailo-8.',
    skills: ['PyTorch', 'TensorRT', 'Edge Inference', 'Hailo-8', 'OpenCV'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    initials: 'AV',
    projects: [
      { title: 'Edge Neural Accelerator Board', slug: 'edge-neural-pcb' },
    ],
    achievements: [
      { title: '1st Place — IEEE Hardware Sprint', year: '2023' },
      { title: '2nd Prize — IIT Bombay Techfest', year: '2023' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

const DOMAIN_LEADS: TeamMember[] = [
  {
    name: 'Rohan Sharma',
    role: 'Autonomous Navigation Lead',
    domain: 'Robotics',
    academicYear: 'Class of 2025',
    bio: 'Specializes in 3D LiDAR point-cloud registration, Extended Kalman Filters, and Nav2 behavior trees.',
    skills: ['ROS2 Nav2', 'LiDAR', 'RTAB-Map', 'Gazebo', 'Python'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    initials: 'RS',
    projects: [
      { title: 'Autonomous Field Rover (UGV-X)', slug: 'autonomous-ugv-rover' },
    ],
    achievements: [
      { title: 'National Winners — SIH 2024', year: '2024' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Priya Patel',
    role: 'Hardware & Circuit Design Lead',
    domain: 'Hardware',
    academicYear: 'Class of 2025',
    bio: 'Designs multi-layer high-frequency PCBs, impedance-matched differential pairs, and power sequencing rails in KiCad.',
    skills: ['KiCad 8', 'Altium', 'Power Electronics', 'Oscilloscopes'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    initials: 'PP',
    projects: [
      { title: 'Edge Neural Accelerator Board', slug: 'edge-neural-pcb' },
    ],
    achievements: [
      { title: 'Best Hardware Prototype — NIF', year: '2023' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Kavya Nair',
    role: 'Telemetry & Systems Lead',
    domain: 'Software',
    academicYear: 'Class of 2026',
    bio: 'Architects low-latency distributed ground control stations using Go, Rust, WebSockets, and WebRTC streaming.',
    skills: ['Rust', 'Go', 'WebSockets', 'LoRa', 'Next.js'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    initials: 'KN',
    projects: [
      { title: 'Distributed Telemetry Ground Station', slug: 'telemetry-ground-station' },
    ],
    achievements: [
      { title: 'Top Telemetry Architecture — SIH', year: '2024' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Vikram Mehta',
    role: 'Mechanical & Fabrication Lead',
    domain: 'Mechanical',
    academicYear: 'Class of 2025',
    bio: 'Leads CAD structural design, CNC aluminum routing, direct-drive extruders, and finite element stress analysis.',
    skills: ['SolidWorks', 'Fusion 360', 'CNC Milling', 'FEA', '3D Printing'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    initials: 'VM',
    projects: [
      { title: 'Adaptive Terrain Hexapod', slug: 'hexapod-walking-robot' },
      { title: 'Holonomic Mecanum Drive Base', slug: 'robocon-holonomic-base' },
    ],
    achievements: [
      { title: 'Best Engineering Design Trophy — Robocon', year: '2024' },
    ],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

const ALUMNI: AlumniItem[] = [
  {
    name: 'Devansh K.',
    batch: 'Class of 2023',
    role: 'Robotics Software Engineer',
    company: 'Leading Autonomous Vehicle Startup',
    legacyProject: 'Autonomous Rover Trajectory Generation (v1.0)',
    quote: 'TRAIC gave me the experience of debugging real motor jitter and hardware faults that no lecture hall could teach.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    initials: 'DK',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Tanvi M.',
    batch: 'Class of 2022',
    role: 'Silicon Validation Engineer',
    company: 'Global Semiconductor Corp',
    legacyProject: 'STM32 Dual-Core BLDC Motor Driver PCB',
    quote: 'Designing real PCBs and probing them with oscilloscopes in TRAIC directly landed me my core hardware role.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    initials: 'TM',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Aditya Gupta',
    batch: 'Class of 2021',
    role: 'Embedded Firmware Architect',
    company: 'Aerospace & Avionics Systems',
    legacyProject: 'Quad-Rotor Flight Stabilization Controller',
    quote: 'In TRAIC we burned through components and learned to respect signal integrity before shipping code.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    initials: 'AG',
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Rhea Sen',
    batch: 'Class of 2020',
    role: 'Robotics Systems Specialist',
    company: 'Industrial Automation Labs',
    legacyProject: '6-Axis Articulated Robotic Arm Kinematics',
    quote: 'The senior mentorship pipeline at TRAIC is unmatched. You start as a novice and graduate capable of shipping hardware.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    initials: 'RS',
    linkedin: 'https://linkedin.com',
  },
];

function AvatarBox({
  src,
  initials,
  name,
}: {
  src?: string;
  initials: string;
  name: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-accent/20 to-accent-2/20 text-accent font-black text-sm font-mono shadow-sm">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      className="h-14 w-14 rounded-xl border border-border object-cover shadow-sm"
      loading="lazy"
    />
  );
}

export default function TeamPage() {
  const [alumniList, setAlumniList] = useState(ALUMNI);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/public/alumni`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAlumniList(
            res.data.map((al: any) => ({
              name: al.name,
              batch: al.graduationYear ? `Class of ${al.graduationYear}` : al.batch,
              role: al.currentRole || al.role,
              company: al.currentCompany || al.company,
              legacyProject: al.notableProject || 'Hardware Core Subsystems',
              quote: al.quote,
              avatar: al.photoUrl,
              initials: al.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2),
              linkedin: al.socials?.linkedin || 'https://linkedin.com',
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-0 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent">
            <Users className="h-3.5 w-3.5" />
            <span>ORGANIZATION // TECHNICAL LEADERSHIP</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-text-1">
            Engineers & Coordinators
          </h1>
          <p className="mt-3 text-base text-text-2 leading-relaxed">
            TRAIC is entirely student-governed and senior-mentored. Meet the hardware architects, robotics developers, and research coordinators steering our projects.
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-text-1">Club Leadership & Architects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LEADERSHIP.map((lead) => (
              <div
                key={lead.name}
                className="rounded-2xl border border-border bg-surface/80 p-8 shadow-sm transition-all hover:border-accent/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <AvatarBox src={lead.avatar} initials={lead.initials} name={lead.name} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-text-1">{lead.name}</h3>
                          <p className="text-sm font-semibold text-accent-2 mt-0.5">{lead.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="rounded bg-accent/15 px-2 py-0.5 text-[11px] font-mono text-accent border border-accent/30 font-semibold">
                              {lead.domain}
                            </span>
                            <span className="text-xs font-mono text-text-2">{lead.academicYear}</span>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-1.5">
                          {lead.github && (
                            <a
                              href={lead.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-border bg-bg-0 p-2 text-text-2 hover:border-accent hover:text-text-1 transition-colors"
                              aria-label={`${lead.name} GitHub`}
                            >
                              <GithubIcon className="h-4 w-4" />
                            </a>
                          )}
                          {lead.linkedin && (
                            <a
                              href={lead.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-border bg-bg-0 p-2 text-text-2 hover:border-accent hover:text-text-1 transition-colors"
                              aria-label={`${lead.name} LinkedIn`}
                            >
                              <LinkedinIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-text-2 leading-relaxed">{lead.bio}</p>

                  {/* Skills Matrix */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {lead.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-bg-1 px-2 py-0.5 text-[11px] font-mono text-text-2 border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Relational Connectivity: Engineered Systems & Won Awards */}
                <div className="mt-6 pt-5 border-t border-border/80 space-y-3">
                  {lead.projects && lead.projects.length > 0 && (
                    <div>
                      <div className="text-[11px] font-mono text-text-2 mb-1.5 font-semibold flex items-center gap-1">
                        <Box className="h-3 w-3 text-accent-2" />
                        <span>ENGINEERED SYSTEMS:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {lead.projects.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/projects/${p.slug}`}
                            className="inline-flex items-center gap-1 rounded bg-accent-2/10 hover:bg-accent-2/20 border border-accent-2/30 px-2 py-0.5 text-xs font-mono text-accent-2 transition-colors"
                          >
                            <span>{p.title}</span>
                            <ArrowRight className="h-2.5 w-2.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {lead.achievements && lead.achievements.length > 0 && (
                    <div>
                      <div className="text-[11px] font-mono text-text-2 mb-1.5 font-semibold flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-accent" />
                        <span>COMPETITIVE AWARDS:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {lead.achievements.map((ach) => (
                          <Link
                            key={ach.title}
                            href="/achievements"
                            className="inline-flex items-center gap-1 rounded bg-accent/10 hover:bg-accent/20 border border-accent/30 px-2 py-0.5 text-xs font-mono text-accent transition-colors"
                          >
                            <span>{ach.title} ({ach.year})</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Domain Leads */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-5 w-5 text-accent-2" />
            <h2 className="text-xl font-bold text-text-1">Domain Technical Leads</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOMAIN_LEADS.map((lead) => (
              <div
                key={lead.name}
                className="rounded-xl border border-border bg-surface/70 p-6 flex flex-col justify-between shadow-sm hover:border-accent-2/40 transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <AvatarBox src={lead.avatar} initials={lead.initials} name={lead.name} />
                    <div>
                      <h3 className="text-lg font-bold text-text-1">{lead.name}</h3>
                      <span className="rounded bg-accent-2/15 px-1.5 py-0.5 text-[10px] font-mono font-bold text-accent-2 border border-accent-2/30">
                        {lead.domain}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-text-1">{lead.role}</p>
                  <p className="mt-2 text-xs text-text-2 leading-relaxed">{lead.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {lead.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-bg-1 px-1.5 py-0.5 text-[10px] font-mono text-text-2 border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/80">
                  {lead.projects && lead.projects[0] && (
                    <Link
                      href={`/projects/${lead.projects[0].slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-accent-2 hover:underline"
                    >
                      <Box className="h-3 w-3" />
                      <span className="truncate">{lead.projects[0].title}</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEPARATE DEDICATED ALUMNI HALL OF FAME */}
        <div className="border-t border-border pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                <GraduationCap className="h-4 w-4" />
                <span>5+ YEARS OF LEGACY</span>
              </div>
              <h2 className="text-3xl font-black text-text-1">
                Alumni Hall of Fame & Industry Placements
              </h2>
              <p className="mt-2 text-sm text-text-2 max-w-2xl">
                TRAIC graduates build at premier autonomous vehicle startups, semiconductor fabs, aerospace contractors, and robotics research labs globally.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alumniList.map((alum) => (
              <div
                key={alum.name}
                className="rounded-xl border border-border bg-surface/60 p-6 flex flex-col justify-between shadow-sm hover:border-accent/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AvatarBox src={alum.avatar} initials={alum.initials} name={alum.name} />
                      <div>
                        <h3 className="text-lg font-bold text-text-1">{alum.name}</h3>
                        <p className="text-xs font-semibold text-accent-2">{alum.role}</p>
                        <p className="text-xs font-mono text-text-2">{alum.company}</p>
                      </div>
                    </div>
                    <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-mono font-bold text-accent border border-accent/30">
                      {alum.batch}
                    </span>
                  </div>

                  <div className="mt-4 rounded-lg bg-bg-1/80 border border-border p-3 text-xs font-mono text-text-2">
                    <span className="text-accent font-semibold">Foundational Project: </span>
                    <span>{alum.legacyProject}</span>
                  </div>

                  <blockquote className="mt-4 text-xs italic text-text-2 border-l-2 border-accent/40 pl-3 leading-relaxed">
                    &ldquo;{alum.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-text-2">Verified Graduate</span>
                  {alum.linkedin && (
                    <a
                      href={alum.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:underline"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
