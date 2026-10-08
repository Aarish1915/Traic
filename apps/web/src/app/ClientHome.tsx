'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { IconChip, IconRobot, IconIoT, IconGear } from '@/components/SFSymbols';

export interface ProjectItem {
  id?: string;
  title: string;
  slug: string;
  tagline?: string;
  category: string;
  tech: string[];
  status?: string;
  description?: string;
  specs?: Record<string, string>;
  bom?: Array<{ component: string; partNumber: string; role: string }>;
}

export interface GearItem {
  id?: string;
  name: string;
  model: string;
  category: string;
  status: string;
  specifications?: Record<string, string>;
}

export interface EventItem {
  id?: string;
  title: string;
  slug: string;
  tagline?: string;
  type: string;
  mode: string;
  venue: string;
  startsAt: string;
}

interface ClientHomeProps {
  heroHeadline: string;
  heroSubheadline: string;
  stats: Array<{ value: string; label: string }>;
  projects: ProjectItem[];
  gear: GearItem[];
  events: EventItem[];
}

export function ClientHome({
  heroHeadline,
  heroSubheadline,
  stats,
  projects,
  gear,
  events,
}: ClientHomeProps) {
  const topProject = projects[0] || {
    title: 'Autonomous Pipeline Inspection Rover',
    slug: 'pipeline-inspection-rover',
    category: 'ROBOTICS',
    tagline: 'Dual-drive tracked crawler with RTAB-Map LiDAR SLAM & ultrasonic thickness probe.',
    tech: ['ROS2 Humble', 'STM32H753', 'Hailo-8', 'CAN-FD', 'SLAM'],
    specs: {
      'Compute Unit': 'NVIDIA Jetson Orin Nano + STM32H7',
      'AI Acceleration': 'Hailo-8 M.2 (26 TOPS)',
      'Telemetry Bus': 'ISO 11898-1 CAN-FD @ 5.0 Mbps',
      'Sensing': 'RPLiDAR A2M12 + RealSense D435i',
    },
    bom: [
      { component: 'Primary MCU', partNumber: 'STM32H753VIT6', role: 'Motor & PID Loop' },
      { component: 'Neural Accel', partNumber: 'Hailo-8 M.2', role: 'Real-time Defect Detection' },
      { component: 'Transceiver', partNumber: 'TCAN334GDCNT', role: '5Mbps CAN-FD PHY' },
    ],
  };

  const nextEvent = events[0] || {
    title: 'Autonomous Mobile Robot Navigation Workshop',
    slug: 'amr-navigation-workshop-2026',
    tagline: 'Hands-on hardware lab: Bring your laptop, flash FreeRTOS, wire motor drivers, and map the lab with 3D LiDAR.',
    type: 'WORKSHOP',
    mode: 'OFFLINE',
    venue: 'DIA Labs, Block C-302, COER University',
    startsAt: '2026-10-24T10:00:00Z',
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink-primary selection:bg-apple-blue selection:text-white">
      {/* SECTION 1 — HERO CHAPTER */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 border-b border-subtle overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-apple-blue/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="w-full max-w-apple mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-[11px] font-mono tracking-wider text-apple-blue uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-apple-blue animate-pulse" />
            <span>DESIGN &amp; INNOVATION ACADEMY — COER UNIVERSITY</span>
          </div>

          <h1 className="text-[34px] sm:text-[48px] md:text-[64px] font-display font-bold tracking-tight text-ink-primary leading-[1.08] max-w-[900px] mx-auto text-balance">
            {heroHeadline}
          </h1>

          <p className="mt-6 text-[16px] sm:text-[19px] text-ink-secondary leading-[1.55] max-w-[680px] mx-auto font-sans font-normal">
            {heroSubheadline}
          </p>

          {/* Action CTAs complying with Hick's Law: 1 primary Apple Blue, 1 subtle text */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[15px] transition-transform duration-200 active:scale-95 shadow-md"
            >
              Apply for Cohort 2026
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#disciplines"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 rounded-pill bg-canvas-surface hover:bg-canvas-elevated text-ink-secondary hover:text-ink-primary border border-subtle font-medium text-[14px] transition-colors"
            >
              Explore our disciplines ↓
            </a>
          </div>

          {/* 4 BENCHMARK CHIPS */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-canvas-surface/80 border border-subtle backdrop-blur-md">
              <div className="text-[22px] md:text-[26px] font-mono font-bold text-apple-blue tracking-tight">480 MHz</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">ARM Cortex-M7 Real-Time MCU</div>
            </div>
            <div className="p-4 rounded-2xl bg-canvas-surface/80 border border-subtle backdrop-blur-md">
              <div className="text-[22px] md:text-[26px] font-mono font-bold text-apple-blue tracking-tight">26 TOPS</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">Hailo-8 Edge AI Inference</div>
            </div>
            <div className="p-4 rounded-2xl bg-canvas-surface/80 border border-subtle backdrop-blur-md">
              <div className="text-[22px] md:text-[26px] font-mono font-bold text-apple-blue tracking-tight">5.0 Mbps</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">CAN-FD Deterministic Bus</div>
            </div>
            <div className="p-4 rounded-2xl bg-canvas-surface/80 border border-subtle backdrop-blur-md">
              <div className="text-[22px] md:text-[26px] font-mono font-bold text-apple-blue tracking-tight">4-Layer</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">Controlled Impedance FR-4 PCB</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — 4 PILLARS (ASYMMETRIC GRID) */}
      <section id="disciplines" className="py-24 px-4 border-b border-subtle">
        <div className="w-full max-w-apple mx-auto">
          <div className="mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              ENGINEERING DISCIPLINES
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-display font-bold tracking-tight text-ink-primary mt-2">
              Four pillars. Zero theoretical fluff.
            </h2>
            <p className="text-[15px] text-ink-secondary mt-2 max-w-[560px]">
              Every TRAIC engineer masters the complete cycle — from raw silicon physics to containerized network infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Left Card: Embedded Firmware (7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl p-8 bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/30 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-canvas flex items-center justify-center text-apple-blue border border-subtle mb-6 shadow-sm">
                  <IconChip size={26} />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-apple-blue font-bold">PILLAR 01</span>
                <h3 className="text-[24px] sm:text-[28px] font-display font-bold text-ink-primary mt-1">
                  Embedded Firmware &amp; Real-Time Systems
                </h3>
                <p className="mt-4 text-[15px] text-ink-secondary leading-[1.6]">
                  We write bare-metal C and deterministic FreeRTOS threads on ARM Cortex-M architecture. Students program register-level peripherals: direct DMA buffers, hardware timers, nested interrupts, and high-speed CAN-FD bus networks without third-party Arduino abstractions.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['STM32H7', 'FreeRTOS', 'Bare-Metal C', 'DMA', 'CAN-FD', 'SPI / I2C', 'Logic Analyzers'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-canvas border border-subtle text-[11px] font-mono text-ink-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-subtle flex items-center justify-between text-[13px] text-apple-blue font-medium">
                <span>Core Instrument: Tektronix 1GHz Oscilloscope</span>
                <Link href="/learn" className="hover:underline inline-flex items-center gap-1">
                  View Syllabus →
                </Link>
              </div>
            </div>

            {/* Right Stack: 3 Cards (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Stack 1: PCB & Hardware */}
              <div className="rounded-3xl p-6 bg-canvas-surface border border-subtle hover:border-apple-blue/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-canvas flex items-center justify-center text-apple-blue border border-subtle">
                    <IconGear size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-apple-blue font-bold">PILLAR 02</span>
                    <h4 className="text-[17px] font-display font-semibold text-ink-primary">Hardware &amp; PCB Design</h4>
                  </div>
                </div>
                <p className="text-[13.5px] text-ink-secondary leading-[1.5]">
                  KiCad 8 schematic capture, differential pair routing, 4-layer stackup design, ground plane stitching, and SMD reflow soldering down to 0402 passives.
                </p>
              </div>

              {/* Stack 2: Autonomous Robotics & AI */}
              <div className="rounded-3xl p-6 bg-canvas-surface border border-subtle hover:border-apple-blue/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-canvas flex items-center justify-center text-apple-blue border border-subtle">
                    <IconRobot size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-apple-blue font-bold">PILLAR 03</span>
                    <h4 className="text-[17px] font-display font-semibold text-ink-primary">Autonomous Robotics &amp; AI</h4>
                  </div>
                </div>
                <p className="text-[13.5px] text-ink-secondary leading-[1.5]">
                  ROS2 Humble nodes, Nav2 path planning, 3D LiDAR SLAM, and TensorRT neural networks running on edge Jetson and Hailo-8 silicon.
                </p>
              </div>

              {/* Stack 3: Self-Hosted Systems */}
              <div className="rounded-3xl p-6 bg-canvas-surface border border-subtle hover:border-apple-blue/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-canvas flex items-center justify-center text-apple-blue border border-subtle">
                    <IconIoT size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-apple-blue font-bold">PILLAR 04</span>
                    <h4 className="text-[17px] font-display font-semibold text-ink-primary">Self-Hosted Infrastructure</h4>
                  </div>
                </div>
                <p className="text-[13.5px] text-ink-secondary leading-[1.5]">
                  Bare-metal Proxmox hypervisors, ZFS storage arrays, private Forgejo Git mirrors, and on-premise local LLM inference engines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — LAB BENTO (DIA LABS GEAR) */}
      <section className="py-24 px-4 bg-canvas border-b border-subtle">
        <div className="w-full max-w-apple mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
                DIA LABS — BLOCK C-302
              </span>
              <h2 className="text-[28px] sm:text-[36px] font-display font-bold tracking-tight text-ink-primary mt-2">
                Physical instruments. Verified calibration.
              </h2>
            </div>
            <Link
              href="/gear"
              className="text-[13.5px] font-medium text-apple-blue hover:underline inline-flex items-center gap-1 min-h-[44px]"
            >
              Tour all 5 lab stations →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(gear.length > 0 ? gear.slice(0, 4) : [
              { name: 'Tektronix MDO3024', model: '1GHz 4-Channel Mixed Domain', category: 'MEASUREMENT', status: 'OPERATIONAL' },
              { name: 'Hakko FR-810B', model: 'High-Power Hot Air Rework', category: 'SOLDERING', status: 'OPERATIONAL' },
              { name: 'Bambu Lab X1-Carbon', model: 'Carbon-Fiber Additive Printer', category: 'FABRICATION', status: 'OPERATIONAL' },
              { name: 'CNC 3018-Pro', model: 'Precision PCB Isolation Router', category: 'MACHINING', status: 'OPERATIONAL' },
            ]).map((item, i) => (
              <div
                key={item.name + i}
                className="p-5 rounded-2xl bg-canvas-surface border border-subtle flex flex-col justify-between hover:border-apple-blue/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase text-ink-tertiary tracking-wider font-semibold">
                      {item.category}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-canvas border border-subtle text-[10px] font-mono text-[var(--status-emerald)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-emerald)] animate-pulse" />
                      <span>{item.status}</span>
                    </div>
                  </div>
                  <h3 className="text-[17px] font-semibold text-ink-primary">{item.name}</h3>
                  <p className="mt-1 text-[13px] text-ink-secondary">{item.model}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-subtle text-[11px] font-mono text-ink-tertiary">
                  DIA Labs Bay C-302
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TOP MACHINE (FEATURED PROJECT) */}
      <section className="py-24 px-4 border-b border-subtle">
        <div className="w-full max-w-apple mx-auto">
          <div className="mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              FLAGSHIP HARDWARE
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-display font-bold tracking-tight text-ink-primary mt-2">
              The Physical Machines
            </h2>
          </div>

          <div className="rounded-3xl bg-canvas-surface border border-subtle overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 8 cols: Project CAD Blueprint Preview */}
              <div className="lg:col-span-8 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-subtle flex flex-col justify-between apple-ambient-glow">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-canvas border border-subtle text-[11px] font-mono text-apple-blue mb-4">
                    <span>FLAGSHIP // {topProject.category}</span>
                  </div>
                  <h3 className="text-[26px] sm:text-[32px] font-display font-bold text-ink-primary leading-tight">
                    {topProject.title}
                  </h3>
                  <p className="mt-4 text-[15px] text-ink-secondary max-w-[620px] leading-relaxed">
                    {topProject.tagline || topProject.description}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-subtle/60">
                  {Object.entries(topProject.specs || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[11px] font-mono text-ink-tertiary uppercase block">{key}</span>
                      <span className="text-[13.5px] font-medium text-ink-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 4 cols: Silicon Bill of Materials */}
              <div className="lg:col-span-4 p-8 bg-canvas flex flex-col justify-between">
                <div>
                  <h4 className="text-[12px] font-mono uppercase tracking-widest text-ink-tertiary font-semibold mb-4">
                    Silicon Bill of Materials
                  </h4>
                  <div className="space-y-3">
                    {(topProject.bom || [
                      { component: 'Primary MCU', partNumber: 'STM32H753VIT6', role: 'Motor & PID Loop' },
                      { component: 'Neural Accel', partNumber: 'Hailo-8 M.2', role: 'Real-time Defect Detection' },
                      { component: 'Transceiver', partNumber: 'TCAN334GDCNT', role: '5Mbps CAN-FD PHY' },
                    ]).map((bomItem, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-canvas-surface border border-subtle">
                        <div className="text-[11px] font-mono text-apple-blue font-bold">{bomItem.partNumber}</div>
                        <div className="text-[13px] font-medium text-ink-primary mt-0.5">{bomItem.component}</div>
                        <div className="text-[11px] text-ink-secondary">{bomItem.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-subtle">
                  <Link
                    href={`/projects/${topProject.slug}`}
                    className="w-full inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl bg-canvas-surface hover:bg-canvas-elevated text-apple-blue font-semibold text-[13.5px] border border-subtle transition-colors"
                  >
                    Examine Full Engineering Specs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CREDENTIALS STRIP */}
      <section className="py-16 px-4 bg-canvas-surface/50 border-b border-subtle">
        <div className="w-full max-w-apple mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4">
                <div className="text-[32px] sm:text-[40px] font-mono font-bold text-apple-blue tracking-tight">
                  {s.value}
                </div>
                <div className="text-[13px] text-ink-secondary mt-1 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — UPCOMING EVENT PREVIEW */}
      <section className="py-24 px-4 border-b border-subtle">
        <div className="w-full max-w-apple mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
                COMMUNITY WORKSHOP
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-display font-bold tracking-tight text-ink-primary mt-1">
                Upcoming Engineering Session
              </h2>
            </div>
            <Link
              href="/events"
              className="text-[13.5px] font-medium text-apple-blue hover:underline inline-flex items-center gap-1 min-h-[44px]"
            >
              Browse all hackathons &amp; workshops →
            </Link>
          </div>

          <div className="rounded-3xl p-8 bg-canvas-surface border border-subtle hover:border-apple-blue/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-[700px]">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-pill bg-apple-blue/15 text-apple-blue border border-apple-blue/30 text-[10.5px] font-mono font-bold uppercase">
                  {nextEvent.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-pill bg-canvas border border-subtle text-ink-secondary text-[10.5px] font-mono">
                  {nextEvent.mode}
                </span>
              </div>
              <h3 className="text-[20px] sm:text-[24px] font-display font-bold text-ink-primary">
                {nextEvent.title}
              </h3>
              <p className="mt-2 text-[14px] text-ink-secondary leading-[1.5]">
                {nextEvent.tagline}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[12.5px] text-ink-tertiary">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-apple-blue" />
                  {new Date(nextEvent.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-apple-blue" />
                  {nextEvent.venue}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <Link
                href={`/events/${nextEvent.slug}`}
                className="w-full md:w-auto inline-flex items-center justify-center min-h-[44px] px-6 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[14px] transition-colors"
              >
                Register Seat
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — APPLY CTA STRIP */}
      <section className="py-24 px-4 bg-canvas text-center">
        <div className="w-full max-w-apple mx-auto">
          <div className="max-w-[720px] mx-auto p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-canvas-surface to-canvas border border-subtle">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-bold">
              ADMISSIONS COHORT 2026
            </span>
            <h2 className="text-[32px] sm:text-[44px] font-display font-bold text-ink-primary mt-2 tracking-tight">
              Ready to build real things?
            </h2>
            <p className="mt-4 text-[15px] sm:text-[17px] text-ink-secondary leading-relaxed">
              We look for curiosity, grit, and hands-on hunger. Every selected student builder gets direct lab bench access, private server compute, and mentorship from senior leads.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/join"
                className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-[15px] transition-transform active:scale-95 shadow-lg"
              >
                Apply for Cohort 2026 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
