'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { IconChip, IconRobot, IconIoT, IconGear } from '@/components/SFSymbols';
import { SpotlightCard } from '@/components/SpotlightCard';
import { SpatialExplodedHardware } from '@/components/SpatialExplodedHardware';

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

function StatCounter({ value, label }: { value: string; label: string }) {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const ref = useRef<HTMLDivElement>(null);
  const animatedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const match = value.match(/^(\d+)(.*)$/);
          if (!match) {
            setDisplayValue(value);
            return;
          }
          const targetNum = parseInt(match[1], 10);
          const suffix = match[2] || '';
          const duration = 1200;
          const startTime = performance.now();

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * targetNum);
            setDisplayValue(`${current}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="p-4 flex flex-col items-center">
      <div className="text-[38px] sm:text-[54px] font-mono font-bold text-ink-primary tracking-tight tabular-nums">
        {displayValue}
      </div>
      <div className="w-12 h-px bg-border-separator my-3" />
      <div className="text-[13px] text-ink-secondary font-medium tracking-wide">
        {label}
      </div>
    </div>
  );
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
    category: 'AUTONOMOUS ROBOTICS',
    tagline: 'Dual-drive tracked crawler with RTAB-Map LiDAR SLAM and ultrasonic thickness inspection.',
    tech: ['ROS2 Humble', 'STM32H753', 'Hailo-8 M.2', 'CAN-FD', 'KiCad 8'],
    specs: {
      'Primary Compute': 'STM32H753 (480 MHz ARM Cortex-M7)',
      'Neural Acceleration': 'Hailo-8 M.2 Key A+E (26 TOPS)',
      'Deterministic Bus': 'ISO 11898-1 CAN-FD @ 5.0 Mbps',
      'Telemetry Sampling': 'DMA-backed 16-bit ADC @ 2.0 MSPS',
    },
    bom: [
      { component: 'Primary MCU', partNumber: 'STM32H753VIT6', role: 'Motor & PID Loop (480MHz)' },
      { component: 'Neural Accel', partNumber: 'Hailo-8 M.2', role: '26 TOPS Edge Vision Inference' },
      { component: 'CAN-FD PHY', partNumber: 'TCAN334GDCNT', role: '5Mbps Bus Transceiver' },
    ],
  };

  const nextEvent = events[0] || {
    title: 'Autonomous Mobile Robot Navigation Lab',
    slug: 'amr-navigation-workshop-2026',
    tagline: 'Hands-on hardware lab: Bring your laptop, flash FreeRTOS, wire motor drivers, and map the lab with 3D LiDAR.',
    type: 'WORKSHOP',
    mode: 'OFFLINE',
    venue: 'DIA Labs, Block C-302, COER University',
    startsAt: '2026-10-24T10:00:00Z',
  };

  const bay1 = (gear && gear.find((g) => g.name.toLowerCase().includes('tektronix'))) || gear?.[0] || {
    name: 'Tektronix MDO3024',
    model: '1GHz 4-Channel Mixed Domain Oscilloscope with integrated spectrum analyzer.',
    category: 'TESTING // RF & SIGNALS',
    status: 'OPERATIONAL',
  };
  const bay2 = (gear && gear.find((g) => g.name.toLowerCase().includes('hakko'))) || gear?.[1] || {
    name: 'Hakko FR-810B',
    model: 'High-Power Hot Air Rework Station for fine-pitch QFN and BGA rework.',
    category: 'SOLDERING',
    status: 'OPERATIONAL',
  };
  const bay3 = (gear && gear.find((g) => g.name.toLowerCase().includes('bambu'))) || gear?.[2] || {
    name: 'Bambu Lab X1-Carbon',
    model: 'Carbon-Fiber Reinforced Additive Printer with 500 mm/s acceleration.',
    category: 'FABRICATION',
    status: 'OPERATIONAL',
  };
  const bay4 = (gear && gear.find((g) => g.name.toLowerCase().includes('cnc'))) || gear?.[3] || {
    name: 'CNC 3018-Pro Milling Station',
    model: 'Precision PCB Isolation Router for rapid on-site double-sided copper clad milling.',
    category: 'MACHINING // ISOLATION ROUTING',
    status: 'OPERATIONAL',
  };

  // Fluid and Orchestrated Scroll Reveal
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Graceful Hero Parallax
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero-content');
      if (hero) {
        const scrollY = window.scrollY;
        const opacity = Math.max(0.35, 1 - scrollY / 900);
        hero.style.opacity = `${opacity}`;
        hero.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink-primary selection:bg-neutral-700 selection:text-white transition-colors duration-200">
      {/* =========================================================================
          CHAPTER 1: EDITORIAL APPLE VISION PRO HERO
         ========================================================================= */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-24 px-4 border-b border-subtle overflow-hidden bg-canvas">
        {/* Apple Vision Pro Ambient Specular Halo (Luminous chromatic depth without line noise) */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none rounded-full blur-[140px] opacity-75 dark:opacity-100"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(41, 151, 255, 0.16) 0%, rgba(41, 151, 255, 0.03) 50%, transparent 75%)',
          }}
        />

        <div id="hero-content" className="w-full max-w-apple mx-auto relative z-10 text-center transition-transform duration-75">
          {/* Subtle Location Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-canvas-surface/90 border border-subtle text-[11px] font-mono tracking-widest text-ink-secondary uppercase mb-5 sm:mb-6 shadow-xs backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-apple-blue animate-pulse" />
            <span>DESIGN &amp; INNOVATION ACADEMY • COER UNIVERSITY</span>
          </div>

          {/* Monumental Hero Headline */}
          <h1 className="text-[34px] sm:text-[50px] md:text-[72px] lg:text-[88px] font-display font-extrabold tracking-[-0.035em] text-ink-primary leading-[1.08] sm:leading-[1.04] max-w-[960px] mx-auto text-balance">
            {heroHeadline}
          </h1>

          {/* Refined Understated Copy */}
          <p className="mt-8 text-[17px] sm:text-[21px] text-ink-secondary leading-[1.5] max-w-[720px] mx-auto font-sans font-normal">
            {heroSubheadline}
          </p>

          {/* Clean Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 rounded-pill bg-ink-primary text-canvas hover:opacity-90 font-semibold text-[14.5px] transition-all duration-200 active:scale-95 shadow-md"
            >
              Apply for Cohort 2026
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-7 rounded-pill bg-canvas-surface hover:bg-canvas-elevated text-ink-primary border border-subtle font-medium text-[14px] transition-colors active:scale-95 shadow-sm"
            >
              Examine Hardware Archive →
            </Link>
          </div>

          {/* 4 STARK MONOCHROME BENCHMARKS */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3.5 text-left max-w-[880px] mx-auto">
            <SpotlightCard className="p-4 rounded-2xl bg-canvas-surface border border-subtle reveal-on-scroll stagger-1 shadow-sm">
              <div className="text-[24px] md:text-[28px] font-mono font-bold text-ink-primary tracking-tight">480 MHz</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">ARM Cortex-M7 Core</div>
            </SpotlightCard>
            <SpotlightCard className="p-4 rounded-2xl bg-canvas-surface border border-subtle reveal-on-scroll stagger-2 shadow-sm">
              <div className="text-[24px] md:text-[28px] font-mono font-bold text-ink-primary tracking-tight">26 TOPS</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">Hailo-8 Edge AI Silicon</div>
            </SpotlightCard>
            <SpotlightCard className="p-4 rounded-2xl bg-canvas-surface border border-subtle reveal-on-scroll stagger-3 shadow-sm">
              <div className="text-[24px] md:text-[28px] font-mono font-bold text-ink-primary tracking-tight">5.0 Mbps</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">CAN-FD Deterministic Bus</div>
            </SpotlightCard>
            <SpotlightCard className="p-4 rounded-2xl bg-canvas-surface border border-subtle reveal-on-scroll stagger-4 shadow-sm">
              <div className="text-[24px] md:text-[28px] font-mono font-bold text-ink-primary tracking-tight">4-Layer</div>
              <div className="text-[12px] font-medium text-ink-secondary mt-1">Controlled-Impedance PCB</div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 1.5: APPLE VISION PRO SPATIAL HARDWARE DISSECTION
         ========================================================================= */}
      <div className="px-4 py-8 border-b border-subtle bg-canvas">
        <SpatialExplodedHardware />
      </div>

      {/* =========================================================================
          CHAPTER 2: ASYMMETRIC 4-PILLAR EDITORIAL BENTO (REFINED VISUAL ANCHORS)
         ========================================================================= */}
      <section id="disciplines" className="py-24 px-4 border-b border-subtle bg-canvas">
        <div className="w-full max-w-apple mx-auto">
          <div className="mb-14 reveal-on-scroll">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
              ENGINEERING ARCHITECTURE
            </span>
            <h2 className="text-[32px] sm:text-[42px] font-display font-bold tracking-tight text-ink-primary mt-2">
              Four Core Disciplines
            </h2>
            <p className="text-[16px] text-ink-secondary mt-3 max-w-[620px] leading-relaxed">
              Every TRAIC engineer masters the complete stack — from register-level silicon physics to containerized bare-metal infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pillar 1: Large Anchor Hero Card (7 Cols) */}
            <SpotlightCard className="lg:col-span-7 rounded-3xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden reveal-on-scroll stagger-1 shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-canvas-elevated border border-subtle flex items-center justify-center text-ink-primary shadow-sm">
                    <IconChip size={26} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas-elevated border border-subtle text-[11.5px] font-mono text-ink-tertiary font-bold tracking-wider">
                    <span className="text-ink-primary">01</span>
                    <span className="opacity-30">/</span>
                    <span className="opacity-60">04</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-pill bg-canvas-elevated border border-subtle text-[11px] font-mono text-ink-secondary font-bold uppercase mb-3">
                  <span>DISCIPLINE 01 // SILICON &amp; FIRMWARE</span>
                </div>
                <h3 className="text-[26px] sm:text-[32px] font-display font-bold text-ink-primary">
                  Embedded Firmware &amp; Real-Time Systems
                </h3>
                <p className="mt-4 text-[15.5px] text-ink-secondary leading-[1.65]">
                  We program bare-metal C and FreeRTOS tasks on 480 MHz ARM Cortex-M architecture. Students configure DMA ring buffers, hardware timers, nested interrupt controllers (NVIC), and high-speed CAN-FD bus transceivers without relying on high-level wrappers.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['STM32H753', 'FreeRTOS', 'Bare-Metal C', 'DMA Buffers', 'CAN-FD', 'SPI / I2C', 'Logic Analyzers'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-canvas-elevated border border-subtle text-[11.5px] font-mono text-ink-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13.5px] text-ink-secondary">
                <span>Core Instrument: Tektronix 1GHz Scope</span>
                <Link href="/learn" className="text-apple-blue hover:underline inline-flex items-center gap-1 font-medium min-h-[44px]">
                  View Syllabus →
                </Link>
              </div>
            </SpotlightCard>

            {/* Right Stack: 3 Asymmetric Pillars (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Stack 1: PCB Design */}
              <SpotlightCard className="rounded-3xl p-6 md:p-7 relative overflow-hidden reveal-on-scroll stagger-2 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-canvas-elevated border border-subtle flex items-center justify-center text-ink-primary">
                      <IconGear size={20} />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-tertiary font-bold">DISCIPLINE 02</span>
                      <h4 className="text-[18px] font-display font-semibold text-ink-primary">Hardware &amp; PCB Design</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-mono text-ink-tertiary px-2 py-0.5 rounded bg-canvas-elevated border border-subtle">
                      4L STACKUP
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary font-bold px-2 py-0.5 rounded bg-canvas-elevated border border-subtle">
                      02 / 04
                    </span>
                  </div>
                </div>
                <p className="text-[14px] text-ink-secondary leading-[1.55]">
                  KiCad 8 schematic capture, differential pair trace impedance matching, 4-layer stackups, ground plane stitching, and SMD reflow soldering down to 0402 passives.
                </p>
              </SpotlightCard>

              {/* Stack 2: Autonomous Robotics & AI */}
              <SpotlightCard className="rounded-3xl p-6 md:p-7 relative overflow-hidden reveal-on-scroll stagger-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-canvas-elevated border border-subtle flex items-center justify-center text-ink-primary">
                      <IconRobot size={20} />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-tertiary font-bold">DISCIPLINE 03</span>
                      <h4 className="text-[18px] font-display font-semibold text-ink-primary">Autonomous Robotics &amp; AI</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-mono text-ink-tertiary px-2 py-0.5 rounded bg-canvas-elevated border border-subtle">
                      26 TOPS NPU
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary font-bold px-2 py-0.5 rounded bg-canvas-elevated border border-subtle">
                      03 / 04
                    </span>
                  </div>
                </div>
                <p className="text-[14px] text-ink-secondary leading-[1.55]">
                  ROS2 Humble nodes, Nav2 path planning, 3D LiDAR SLAM, and TensorRT neural networks running on edge Jetson and Hailo-8 silicon.
                </p>
              </SpotlightCard>

              {/* Stack 3: Self-Hosted Infrastructure */}
              <SpotlightCard className="rounded-3xl p-6 md:p-7 relative overflow-hidden reveal-on-scroll stagger-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-canvas-elevated border border-subtle flex items-center justify-center text-ink-primary">
                      <IconIoT size={20} />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-tertiary font-bold">DISCIPLINE 04</span>
                      <h4 className="text-[18px] font-display font-semibold text-ink-primary">Self-Hosted Infrastructure</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-mono text-ink-tertiary px-2 py-0.5 rounded bg-canvas-elevated border border-subtle">
                      PROXMOX VE
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary font-bold px-2 py-0.5 rounded bg-canvas-elevated border border-subtle">
                      04 / 04
                    </span>
                  </div>
                </div>
                <p className="text-[14px] text-ink-secondary leading-[1.55]">
                  Bare-metal Proxmox hypervisors, ZFS storage pools, private Forgejo Git mirrors, and on-premise local LLM inference engines.
                </p>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: FLAGSHIP PROJECT DEEP DIVE
         ========================================================================= */}
      <section className="py-24 px-4 border-b border-subtle bg-canvas-elevated/40">
        <div className="w-full max-w-apple mx-auto">
          <div className="mb-12 reveal-on-scroll">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
              FLAGSHIP HARDWARE
            </span>
            <h2 className="text-[32px] sm:text-[42px] font-display font-bold tracking-tight text-ink-primary mt-2">
              The Physical Machines
            </h2>
          </div>

          <SpotlightCard className="rounded-3xl overflow-hidden bg-canvas-surface reveal-on-scroll stagger-1 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left 7 Cols: Project Overview */}
              <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-subtle flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-canvas-elevated border border-subtle text-[11px] font-mono text-ink-secondary mb-4">
                    <span>FLAGSHIP // {topProject.category}</span>
                  </div>
                  <h3 className="text-[28px] sm:text-[34px] font-display font-bold text-ink-primary leading-tight">
                    {topProject.title}
                  </h3>
                  <p className="mt-4 text-[15.5px] text-ink-secondary leading-relaxed">
                    {topProject.tagline || topProject.description}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-subtle/60">
                  {Object.entries(topProject.specs || {}).map(([key, value]) => (
                    <div key={key} className="p-3.5 rounded-xl bg-canvas border border-subtle">
                      <span className="text-[10.5px] font-mono text-ink-tertiary uppercase block">{key}</span>
                      <span className="text-[13.5px] font-medium text-ink-primary mt-1 block">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Silicon Bill of Materials */}
              <div className="lg:col-span-5 p-8 md:p-12 bg-canvas flex flex-col justify-between">
                <div>
                  <h4 className="text-[11.5px] font-mono uppercase tracking-widest text-ink-tertiary font-bold mb-4">
                    SILICON BILL OF MATERIALS
                  </h4>
                  <div className="space-y-3">
                    {(topProject.bom || []).map((bomItem, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-canvas-surface border border-subtle shadow-xs">
                        <div className="text-[11.5px] font-mono text-ink-primary font-bold">{bomItem.partNumber}</div>
                        <div className="text-[13.5px] font-medium text-ink-primary mt-0.5">{bomItem.component}</div>
                        <div className="text-[11.5px] text-ink-secondary">{bomItem.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-subtle">
                  <Link
                    href={`/projects/${topProject.slug}`}
                    className="w-full inline-flex items-center justify-center min-h-[46px] px-6 rounded-pill bg-ink-primary text-canvas hover:opacity-90 font-semibold text-[14px] transition-transform active:scale-95 shadow-md"
                  >
                    Examine Full Engineering Specs →
                  </Link>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 4: DIA LABS PHYSICAL STATIONS (ASYMMETRIC BAY CARDS)
         ========================================================================= */}
      <section className="py-24 px-4 border-b border-subtle bg-canvas section-circuit-bg">
        <div className="w-full max-w-apple mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 reveal-on-scroll">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
                DIA LABS • BAY C-302
              </span>
              <h2 className="text-[30px] sm:text-[40px] font-display font-bold tracking-tight text-ink-primary mt-2">
                Physical Workstations
              </h2>
            </div>
            <Link
              href="/gear"
              className="text-[14px] font-semibold text-apple-blue hover:underline inline-flex items-center gap-1 min-h-[44px]"
            >
              Tour complete lab registry →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Bay 1: Tektronix Scope (Featured 2-Col Card with Oscilloscope Waveform) */}
            <SpotlightCard className="col-span-1 md:col-span-2 p-6 md:p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden reveal-on-scroll stagger-1 transition-all duration-300 hover:border-white/20 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10.5px] font-mono uppercase text-ink-tertiary tracking-wider font-bold">
                    {bay1.category}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-canvas-elevated border border-subtle text-[10.5px] font-mono text-ink-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                    <span>{bay1.status}</span>
                  </div>
                </div>
                <h3 className="text-[22px] font-bold text-ink-primary">{bay1.name}</h3>
                <p className="mt-1 text-[14px] text-ink-secondary leading-normal">
                  {bay1.model}
                </p>

                {/* Oscilloscope Waveform SVG Trace Line */}
                <div className="my-5 p-3 rounded-xl bg-canvas border border-subtle">
                  <div className="text-[9.5px] font-mono text-ink-tertiary mb-1 uppercase tracking-wider">CH1 LIVE TRACE // 500MSPS</div>
                  <svg className="w-full h-10 stroke-ink-primary/30 fill-none" viewBox="0 0 320 40">
                    <path d="M0 20 H60 L75 6 L90 34 L105 6 L120 34 L135 20 H200 L215 10 L225 30 L235 20 H320" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div className="pt-4 border-t border-subtle text-[11.5px] font-mono text-ink-tertiary">
                DIA Labs Bay B-04 // RF Test Bench
              </div>
            </SpotlightCard>

            {/* Bay 2: Hakko FR-810B */}
            <SpotlightCard className="p-6 rounded-3xl flex flex-col justify-between reveal-on-scroll stagger-2 transition-all duration-300 hover:border-white/20 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10.5px] font-mono uppercase text-ink-tertiary tracking-wider font-bold">
                    {bay2.category}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-canvas-elevated border border-subtle text-[10.5px] font-mono text-ink-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                    <span>{bay2.status}</span>
                  </div>
                </div>
                <h3 className="text-[18px] font-bold text-ink-primary">{bay2.name}</h3>
                <p className="mt-1 text-[13.5px] text-ink-secondary leading-normal">
                  {bay2.model}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-subtle text-[11.5px] font-mono text-ink-tertiary">
                DIA Labs Bay B-06 // SMD Rework
              </div>
            </SpotlightCard>

            {/* Bay 3: Bambu Lab X1-Carbon */}
            <SpotlightCard className="p-6 rounded-3xl flex flex-col justify-between reveal-on-scroll stagger-3 transition-all duration-300 hover:border-white/20 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10.5px] font-mono uppercase text-ink-tertiary tracking-wider font-bold">
                    {bay3.category}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-canvas-elevated border border-subtle text-[10.5px] font-mono text-ink-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                    <span>{bay3.status}</span>
                  </div>
                </div>
                <h3 className="text-[18px] font-bold text-ink-primary">{bay3.name}</h3>
                <p className="mt-1 text-[13.5px] text-ink-secondary leading-normal">
                  {bay3.model}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-subtle text-[11.5px] font-mono text-ink-tertiary">
                DIA Labs Bay B-07 // Prototyping
              </div>
            </SpotlightCard>

            {/* Bay 4: CNC 3018-Pro */}
            <SpotlightCard className="col-span-1 md:col-span-2 lg:col-span-4 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 reveal-on-scroll stagger-4 transition-all duration-300 hover:border-white/20 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10.5px] font-mono uppercase text-ink-tertiary tracking-wider font-bold">
                    {bay4.category}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-canvas-elevated border border-subtle text-[10.5px] font-mono text-ink-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                    <span>{bay4.status}</span>
                  </div>
                </div>
                <h3 className="text-[18px] font-bold text-ink-primary">{bay4.name}</h3>
                <p className="text-[13.5px] text-ink-secondary mt-0.5">
                  {bay4.model}
                </p>
              </div>
              <div className="text-[11.5px] font-mono text-ink-tertiary whitespace-nowrap">
                DIA Labs Bay B-08 // Machining Cell
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 5: COMMUNITY ENGAGEMENT & ANIMATED STATS
         ========================================================================= */}
      <section className="py-20 px-4 bg-canvas-elevated border-y border-subtle">
        <div className="w-full max-w-apple mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <StatCounter key={idx} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 6: UPCOMING SESSION & ADMISSIONS
         ========================================================================= */}
      <section className="py-24 px-4 border-b border-subtle bg-canvas-elevated/40">
        <div className="w-full max-w-apple mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 reveal-on-scroll">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
                COMMUNITY WORKSHOPS &amp; HACKATHONS
              </span>
              <h2 className="text-[28px] sm:text-[36px] font-display font-bold tracking-tight text-ink-primary mt-1">
                Next In-Person Lab Session
              </h2>
            </div>
            <Link
              href="/events"
              className="text-[14px] font-semibold text-apple-blue hover:underline inline-flex items-center gap-1 min-h-[44px]"
            >
              Browse all sessions →
            </Link>
          </div>

          <SpotlightCard className="rounded-3xl p-8 md:p-10 flex flex-col justify-between gap-6 reveal-on-scroll stagger-1 shadow-sm">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-pill bg-canvas-elevated border border-subtle text-ink-primary text-[11px] font-mono font-bold uppercase tracking-wider">
                  {nextEvent.type}
                </span>
                <span className="px-3 py-1 rounded-pill bg-canvas-elevated border border-subtle text-ink-secondary text-[11px] font-mono">
                  {nextEvent.mode}
                </span>
              </div>
              <h3 className="text-[22px] sm:text-[28px] font-display font-bold text-ink-primary tracking-tight">
                {nextEvent.title}
              </h3>
              <p className="mt-2.5 text-[15.5px] text-ink-secondary leading-relaxed max-w-[800px]">
                {nextEvent.tagline}
              </p>
            </div>

            <div className="mt-2 pt-6 border-t border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-5 text-[13px] text-ink-secondary font-mono">
                <span className="inline-flex items-center gap-1.5 text-ink-secondary">
                  <Calendar className="h-4 w-4 text-ink-tertiary" />
                  {new Date(nextEvent.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-ink-secondary">
                  <MapPin className="h-4 w-4 text-ink-tertiary" />
                  {nextEvent.venue}
                </span>
              </div>

              <Link
                href={`/events/${nextEvent.slug}`}
                className="w-fit inline-flex items-center gap-2 min-h-[44px] px-6 rounded-pill bg-ink-primary text-canvas hover:opacity-90 font-semibold text-[13.5px] active:scale-95 transition-all shadow-sm"
              >
                <span>Reserve Lab Bench</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 7: ADMISSIONS COHORT 2026 APPLE VP INVITATION
         ========================================================================= */}
      <section className="relative py-28 px-4 bg-canvas text-center overflow-hidden">
        {/* Apple Vision Pro Ambient Radial Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] pointer-events-none rounded-full blur-[140px] opacity-75 dark:opacity-100"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(41, 151, 255, 0.14) 0%, transparent 70%)',
          }}
        />

        <div className="w-full max-w-apple mx-auto relative z-10 reveal-on-scroll">
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
            COHORT 2026 • ADMISSIONS OPEN
          </span>
          <h2 className="text-[36px] sm:text-[52px] md:text-[64px] font-display font-extrabold text-ink-primary mt-3 tracking-tight leading-[1.08] max-w-[840px] mx-auto text-balance">
            Ready to engineer real physical systems?
          </h2>
          <p className="mt-5 text-[16px] sm:text-[19px] text-ink-secondary leading-relaxed max-w-[640px] mx-auto font-normal">
            We look for hunger, grit, and hands-on curiosity. Selected cohort members receive direct 24/7 bench access to DIA Labs, private server compute, and direct mentorship on tier-1 engineering projects.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 rounded-pill bg-ink-primary text-canvas hover:opacity-90 font-semibold text-[14.5px] transition-all active:scale-95 shadow-md"
            >
              Apply for Cohort 2026 →
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 text-[14.5px] font-medium text-apple-blue hover:underline transition-colors"
            >
              Examine Hardware Archive →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
