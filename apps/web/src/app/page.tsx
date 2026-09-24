'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Cpu,
  Trophy,
  Calendar,
  Layers,
  ChevronRight,
  Activity,
  Wrench,
  GraduationCap,
  Box,
  Camera,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { AnimeGlowHero } from '@/components/AnimeGlowHero';
import { HeroHardwareViewport } from '@/components/HeroHardwareViewport';
const Project3DInspector = dynamic(
  () => import('@/components/Project3DInspector').then((m) => m.Project3DInspector),
  { ssr: false }
);
const ProjectCard3DPreview = dynamic(
  () => import('@/components/ProjectCard3DPreview').then((m) => m.ProjectCard3DPreview),
  { ssr: false }
);

const STATS = [
  { value: '5+', label: 'Years of Engineering' },
  { value: '42+', label: 'Hardware & AI Projects' },
  { value: '28+', label: 'National Awards Won' },
  { value: '95+', label: 'Active Student Builders' },
];

const FEATURED_PROJECTS = [
  {
    title: 'Autonomous Field Rover (UGV-X)',
    category: 'HYBRID',
    tagline: 'All-terrain autonomous rover equipped with LiDAR, stereo depth cameras, and ROS2 navigation.',
    tech: ['ROS2', 'C++', 'RTAB-Map', 'LiDAR', 'CAN Bus', 'Jetson Orin'],
    slug: 'autonomous-ugv-rover',
    status: 'Operational',
  },
  {
    title: 'Edge Neural Accelerator Board',
    category: 'HARDWARE',
    tagline: 'Custom 4-layer PCB running quantized edge vision models on STM32H7 and Hailo-8 NPU.',
    tech: ['KiCad', 'STM32', 'C', 'FreeRTOS', 'Hailo-8'],
    slug: 'edge-neural-pcb',
    status: 'Fabricated v2.1',
  },
  {
    title: 'Distributed Telemetry Ground Station',
    category: 'SOFTWARE',
    tagline: 'Sub-millisecond WebSockets and WebRTC ground station platform for live robotic fleet telemetry.',
    tech: ['Rust', 'Go', 'Next.js', 'WebSockets', 'LoRa'],
    slug: 'telemetry-ground-station',
    status: 'Live Deployment',
  },
];

const HIGHLIGHT_ACHIEVEMENTS = [
  {
    award: '1st Prize / Winners',
    event: 'Smart India Hackathon (Hardware Edition)',
    year: '2024',
    category: 'National Level',
    description: 'Developed an autonomous robotic pipeline for pipeline inspection and defect localization under severe environmental constraints.',
  },
  {
    award: 'AIR 4 & Best Engineering Design',
    event: 'DD Robocon India National Stage',
    year: '2024',
    category: 'National Level',
    description: 'Engineered two co-operating holonomic robots with sub-millimeter positioning precision and pneumatics.',
  },
  {
    award: '2nd Place Finalist',
    event: 'IIT Bombay Techfest Autonomous Challenge',
    year: '2023',
    category: 'Inter-College Invitational',
    description: 'High-speed autonomous obstacle traversal and optical target detection using onboard neural inference.',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Learn', desc: 'Core masterclasses in schematic capture, C/C++ firmware, RTOS, and modern ROS2.' },
  { step: '02', title: 'Build', desc: 'Hands-on access to 3D printers, oscilloscopes, SMD soldering stations, and CNC milling.' },
  { step: '03', title: 'Test', desc: 'Hardware-in-the-loop validation, signal integrity probing, and simulation in Gazebo.' },
  { step: '04', title: 'Compete', desc: 'Fielding high-caliber engineering teams into SIH, Robocon, and elite collegiate hackathons.' },
];

const LAB_EQUIPMENT = [
  { name: 'Mixed Signal Oscilloscopes', spec: '100MHz 4-Channel DSO with Protocol Decoders' },
  { name: 'SMD Rework & Soldering', spec: 'Hot air rework stations, micro-soldering irons, microscope' },
  { name: 'CoreXY 3D Printers', spec: 'High-temp direct drive for carbon-fiber nylon & PETG' },
  { name: 'PCB Prototyping Mill', spec: 'CNC isolation routing for dual-sided rapid PCB etching' },
  { name: 'Edge Compute Cluster', spec: 'NVIDIA Jetson Orin Nanos + Hailo-8 M.2 NPU evaluation kits' },
  { name: 'RF & Logic Analyzers', spec: '16-channel 500MS/s logic probes + LoRa/CAN analyzers' },
];

const FEATURED_ALUMNI = [
  {
    name: 'Devansh K.',
    batch: 'Class of 2023',
    role: 'Robotics Software Engineer',
    company: 'Leading Autonomous Vehicle Startup',
    quote: 'TRAIC gave me the experience of debugging real motor jitter and hardware faults that no lecture hall could teach.',
  },
  {
    name: 'Tanvi M.',
    batch: 'Class of 2022',
    role: 'Silicon Validation Engineer',
    company: 'Global Semiconductor Corp',
    quote: 'Designing real PCBs and probing them with oscilloscopes in TRAIC directly landed me my core hardware role.',
  },
];

const INITIAL_GALLERY_PREVIEW = [
  {
    title: 'Smart India Hackathon Grand Finale Winners',
    caption: 'TRAIC Autonomous Pipeline Crawler team receiving the 1st prize trophy at the national grand finale.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    category: 'COMPETITION',
    date: 'Dec 2024',
    location: 'Grand Finale Stage',
  },
  {
    title: 'High-Speed CNC Aluminum Chassis Milling',
    caption: 'Machining custom 6061-T6 aluminum differential wheel hubs and motor mounts for the UGV-X terrain rover.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'FABRICATION',
    date: 'Oct 2024',
    location: 'CNC Milling Bay',
  },
  {
    title: 'Outdoor Autonomous Rover Field Trials',
    caption: 'Field testing RTAB-Map 3D LiDAR SLAM in GPS-denied rough outdoor terrain with live telemetry uplink.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    category: 'ROBOTICS',
    date: 'Sep 2024',
    location: 'Dirt Test Track',
  },
];

export default function HomePage() {
  const [stats, setStats] = useState(STATS);
  const [featuredProjects, setFeaturedProjects] = useState(FEATURED_PROJECTS);
  const [achievements, setAchievements] = useState(HIGHLIGHT_ACHIEVEMENTS);
  const [alumni, setAlumni] = useState(FEATURED_ALUMNI);
  const [galleryPreview, setGalleryPreview] = useState(INITIAL_GALLERY_PREVIEW);
  const [inspectingProject, setInspectingProject] = useState<{
    title: string;
    category: string;
    tech: string[];
    modelUrl?: string;
  } | null>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    fetch(`${API_BASE}/public/settings`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data?.stats) {
          setStats([
            { value: `${res.data.stats.yearsActive ?? '5'}+`, label: 'Years of Engineering' },
            { value: `${res.data.stats.projectsCount ?? '42'}+`, label: 'Hardware & AI Projects' },
            { value: `${res.data.stats.awardsCount ?? '28'}+`, label: 'National Awards Won' },
            { value: `${res.data.stats.buildersCount ?? '95'}+`, label: 'Active Student Builders' },
          ]);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/public/projects`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const featured = res.data.filter((p: any) => p.featured);
          const list = featured.length > 0 ? featured.slice(0, 3) : res.data.slice(0, 3);
          setFeaturedProjects(
            list.map((p: any) => ({
              title: p.title,
              category: p.category,
              tagline: p.tagline,
              tech: p.techStack || p.tech || [],
              slug: p.slug,
              status: p.status === 'PUBLISHED' ? 'Operational' : p.status,
              modelUrl: p.model3dAssetUrl || '',
            }))
          );
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/public/achievements`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAchievements(
            res.data.slice(0, 3).map((a: any) => ({
              award: a.awardTitle || a.award,
              event: a.eventName || a.event,
              year: String(a.year),
              category: a.category || 'National Level',
              description: a.descriptionMd || a.description,
            }))
          );
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/public/alumni`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAlumni(
            res.data.slice(0, 2).map((al: any) => ({
              name: al.name,
              batch: al.graduationYear ? `Class of ${al.graduationYear}` : al.batch,
              role: al.currentRole || al.role,
              company: al.currentCompany || al.company,
              quote: al.quote,
            }))
          );
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/public/gallery`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setGalleryPreview(res.data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3D PROJECT INSPECTOR MODAL */}
      {inspectingProject && (
        <Project3DInspector
          projectTitle={inspectingProject.title}
          category={inspectingProject.category}
          techStack={inspectingProject.tech}
          modelUrl={inspectingProject.modelUrl}
          onClose={() => setInspectingProject(null)}
        />
      )}

      {/* HERO SECTION WITH DEDICATED 3D STAGE & ZERO TEXT OVERLAP */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 circuit-pattern">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-accent/8 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[250px] bg-accent-2/8 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Typography, Badges, CTAs, Live Hardware Terminal */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <AnimeGlowHero>
                {/* Badge */}
                <div className="anime-reveal inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-mono font-medium text-accent-2 backdrop-blur-sm shadow-sm mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span>COLLEGE HARDWARE & SOFTWARE COLLECTIVE // EST. 5+ YEARS</span>
                </div>

                {/* Main Title */}
                <h1 className="anime-reveal text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-1 leading-[1.1]">
                  Where Physical Hardware Meets{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-accent-2">
                    Intelligent Code
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="anime-reveal mt-5 text-base sm:text-lg text-text-2 leading-relaxed max-w-2xl">
                  We are TRAIC — an engineering collective building autonomous robotics, custom 4-layer PCBs, and edge AI systems that solve real-world problems and win national championships like SIH and Robocon.
                </p>

                {/* Action CTAs */}
                <div className="anime-reveal mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/projects"
                    className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-bg-0 shadow-lg transition-all hover:bg-accent-hover hover:glow-accent"
                  >
                    <span>Explore Projects</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/join"
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-text-1 transition-all hover:border-accent-2/50 hover:bg-surface-hover"
                  >
                    <span>Join the 2025 Cohort</span>
                    <ChevronRight className="h-4 w-4 text-text-2" />
                  </Link>
                </div>

                {/* Interactive hardware console snippet */}
                <div className="anime-reveal mt-8 rounded-xl border border-border bg-bg-1/90 p-4 text-left font-mono text-xs shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                      <span className="ml-2 text-text-2">traic-core-v2 // telemetry_stream</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-success text-[11px]">
                      <Activity className="h-3 w-3 animate-pulse" />
                      <span>ALL NODES NOMINAL</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-text-2">
                    <p><span className="text-accent-2">[INIT]</span> ROS2 Humble micro-agent active on STM32H7 dual-core target.</p>
                    <p><span className="text-success">[OK]</span> CAN-FD bus synchronized @ 5 Mbps. 4/4 Motor Controllers acked.</p>
                    <p className="text-text-1 font-semibold"><span className="text-accent-2">[TRAIC]</span> Ready to build. 0 compiler errors. 0 design rule violations.</p>
                  </div>
                </div>
              </AnimeGlowHero>
            </div>

            {/* Right Column: Hero Hardware Viewport (2D Lite by default / 3D on demand) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <HeroHardwareViewport />
            </div>
          </div>
        </div>
      </section>

      {/* STAT STRIP WITH ANIME.JS SCROLL COUNTERS */}
      <section className="border-y border-border bg-bg-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4" data-anime-scroll="stagger">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2"
                  data-anime-scroll="counter"
                  data-counter-target={String(stat.value).replace(/\D/g, '') || '0'}
                  data-counter-suffix="+"
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-text-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS WITH 3D INSPECTION */}
      <section className="py-20 bg-bg-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                <Cpu className="h-4 w-4" />
                <span>Proof of Work</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-1">
                Featured Engineering Systems
              </h2>
            </div>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-2 hover:underline"
            >
              <span>View all projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-anime-scroll="stagger">
            {featuredProjects.map((project) => (
              <div
                key={project.slug}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface/60 p-6 transition-all hover:border-accent-2/50 hover:bg-surface hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-semibold tracking-wider ${
                      project.category === 'HARDWARE'
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : project.category === 'HYBRID'
                        ? 'bg-accent-2/15 text-accent-2 border border-accent-2/30'
                        : 'bg-success/15 text-success border border-success/30'
                    }`}>
                      {project.category}
                    </span>
                    <span className="text-xs text-text-2 font-mono">{project.status}</span>
                  </div>

                  {/* Interactive 3D Model Preview */}
                  <ProjectCard3DPreview
                    category={project.category}
                    slug={project.slug}
                    title={project.title}
                  />

                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xl font-bold text-text-1 group-hover:text-accent-2 transition-colors block"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-2">
                    {project.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-bg-1 px-2 py-0.5 text-[11px] font-mono text-text-2 border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-text-1 hover:text-accent"
                    >
                      <span>Read Specs</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>

                    <button
                      onClick={() =>
                        setInspectingProject({
                          title: project.title,
                          category: project.category,
                          tech: project.tech,
                          modelUrl: (project as any).modelUrl,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-accent-2/40 bg-accent-2/10 px-2.5 py-1 text-xs font-mono font-semibold text-accent-2 hover:bg-accent-2 hover:text-bg-0 transition-colors"
                    >
                      <Box className="h-3.5 w-3.5" />
                      <span>Inspect 3D</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAKERSPACE LAB & EQUIPMENT INVENTORY */}
      <section className="py-20 bg-bg-1 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent uppercase tracking-wider mb-2">
              <Wrench className="h-4 w-4" />
              <span>Lab Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-1">
              Workshop & Fabrication Gear
            </h2>
            <p className="mt-3 text-sm text-text-2 leading-relaxed">
              Our campus lab is fully equipped with industrial-grade test benches, prototyping tools, and compute clusters accessible to every community member.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-anime-scroll="stagger">
            {LAB_EQUIPMENT.map((eq) => (
              <div
                key={eq.name}
                className="rounded-xl border border-border bg-surface/50 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-text-1 mb-1">{eq.name}</h3>
                  <p className="text-xs text-accent-2 font-mono">{eq.spec}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2 text-[11px] font-mono text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span>Available in Maker Space</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS / SOCIAL PROOF */}
      <section className="py-20 bg-bg-0 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent uppercase tracking-wider mb-2">
              <Trophy className="h-4 w-4" />
              <span>Track Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-1">
              Tested on National Arenas
            </h2>
            <p className="mt-3 text-sm text-text-2">
              We don&apos;t just build laboratory prototypes — our robots and systems go head-to-head with the best teams across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-anime-scroll="stagger">
            {achievements.map((ach) => (
              <div
                key={ach.event}
                className="relative rounded-xl border border-border bg-surface p-6 shadow-md"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-2 mb-3">
                  <span className="text-accent font-semibold">{ach.year}</span>
                  <span className="rounded bg-bg-0 px-2 py-0.5 border border-border">{ach.category}</span>
                </div>
                <h3 className="text-lg font-bold text-text-1">{ach.award}</h3>
                <p className="text-sm font-semibold text-accent-2 mt-1">{ach.event}</p>
                <p className="mt-3 text-xs leading-relaxed text-text-2">{ach.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/achievements"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              <span>Explore our complete hall of achievements</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FIELD DISPATCHES & PHOTO GALLERY PREVIEW */}
      <section className="py-20 bg-bg-1 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                <Camera className="h-4 w-4" />
                <span>Field Logs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-1">
                Field Dispatches & Lab Life
              </h2>
              <p className="mt-2 text-sm text-text-2">
                Real visual documentation from late-night debugging, national arenas, and CNC milling bays.
              </p>
            </div>
            <Link
              href="/gallery"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-2 hover:underline"
            >
              <span>Explore all field photography</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-anime-scroll="stagger">
            {galleryPreview.map((item) => (
              <Link
                key={item.title}
                href="/gallery"
                className="group rounded-xl border border-border bg-surface/70 overflow-hidden shadow-sm transition-all hover:border-accent-2/50 hover:bg-surface hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-bg-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded bg-bg-0/80 px-2 py-0.5 text-[10px] font-mono font-bold text-accent-2 backdrop-blur-md border border-border/60">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-text-2 mb-1.5">
                    <span>{item.date}</span>
                    <span className="truncate max-w-[130px]">{item.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-text-1 group-hover:text-accent-2 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-2 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY: HOW TRAIC WORKS */}
      <section className="py-20 bg-bg-1 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-2 uppercase tracking-wider mb-2">
              <Layers className="h-4 w-4" />
              <span>The Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-1">
              How We Turn Beginners Into Elite Builders
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-anime-scroll="stagger">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border bg-surface/50 p-6 relative overflow-hidden"
              >
                <span className="text-4xl font-black font-mono text-border/60 absolute top-4 right-4">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-text-1 mb-2">{item.title}</h3>
                <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALUMNI HALL OF FAME PREVIEW */}
      <section className="py-20 bg-bg-0 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                <GraduationCap className="h-4 w-4" />
                <span>Long-Term Impact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-1">
                Where TRAIC Alumni Build Today
              </h2>
            </div>
            <Link
              href="/team"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-2 hover:underline"
            >
              <span>Meet all leads and alumni</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-anime-scroll="stagger">
            {alumni.map((alum) => (
              <div
                key={alum.name}
                className="rounded-xl border border-border bg-surface/60 p-6"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-2 mb-2">
                  <span className="font-bold text-text-1">{alum.name}</span>
                  <span className="text-accent">{alum.batch}</span>
                </div>
                <p className="text-xs font-semibold text-accent-2 mb-3">
                  {alum.role} • {alum.company}
                </p>
                <blockquote className="text-xs italic text-text-2 border-l-2 border-border pl-3">
                  &ldquo;{alum.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENT BANNER */}
      <section className="py-16 bg-gradient-to-r from-bg-1 via-surface to-bg-1 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-2xl border border-accent/30 bg-bg-0/60 p-8 sm:p-10 shadow-xl backdrop-blur-md"
            data-anime-scroll="scale"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent mb-3 border border-accent/30">
                <Calendar className="h-3.5 w-3.5" />
                <span>UPCOMING FLAGSHIP EVENT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-text-1">
                TRAIC InnoHacks: 36-Hour Physical Hardware Hackathon
              </h2>
              <p className="mt-2 text-sm text-text-2">
                Build functional embedded & robotic prototypes with live hardware kits, 3D printers, and industry mentorship on spot.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                href="/events"
                className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-bg-0 hover:bg-accent-hover transition-colors"
              >
                <span>Event Details</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 bg-bg-0 border-t border-border text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-text-1">
            Ready to Build What Others Only Theorize?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-2 max-w-2xl mx-auto">
            Whether your passion is routing high-speed PCB traces, writing real-time control loops, or training edge vision networks — TRAIC provides the lab, the gear, and the team.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/join"
              className="flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-bg-0 shadow-lg hover:bg-accent-hover hover:glow-accent transition-all"
            >
              <span>Apply for Membership</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
