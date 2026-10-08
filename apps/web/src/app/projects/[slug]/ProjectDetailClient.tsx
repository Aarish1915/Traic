'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, FolderGit2, CheckCircle2, Users, Trophy } from 'lucide-react';
import { SpotlightCard } from '@/components/SpotlightCard';

export interface ProjectDetail {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: number | string;
  tech: string[];
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  status?: string;
  specs?: Array<{ label: string; value: string }>;
  bom?: Array<{ component: string; partNumber: string; function: string }>;
  team?: Array<{ name: string; role: string }>;
  awards?: string[];
}

export function ProjectDetailClient({ project }: { project: ProjectDetail }) {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4 selection:bg-neutral-700 selection:text-white">
      <div className="w-full max-w-apple mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-secondary hover:text-ink-primary min-h-[44px] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hardware Archive</span>
          </Link>
        </div>

        {/* Section 1: Hero & Title */}
        <div className="mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-[11px] font-mono text-ink-primary uppercase tracking-wider font-bold">
              {project.category}
            </span>
            <span className="text-[12px] font-mono text-ink-tertiary">
              CLASS OF {project.year}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-canvas-surface border border-subtle text-[11px] font-mono text-ink-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-primary/70 animate-pulse" />
              <span>{project.status || 'ACTIVE'}</span>
            </div>
          </div>

          <h1 className="text-[36px] sm:text-[50px] font-display font-extrabold tracking-[-0.035em] text-ink-primary leading-[1.08]">
            {project.title}
          </h1>

          <p className="mt-4 text-[17px] text-ink-secondary max-w-[760px] leading-relaxed">
            {project.tagline || project.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-pill bg-canvas-surface hover:bg-canvas-elevated text-ink-primary border border-subtle text-[13px] font-medium transition-all active:scale-95"
              >
                <FolderGit2 className="h-4 w-4 text-ink-tertiary" />
                <span>View CAD &amp; Code Repository</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-pill bg-ink-primary text-canvas hover:opacity-90 text-[13.5px] font-semibold transition-all active:scale-95 shadow-md"
              >
                <span>Live System Demo</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Section 2: 2-Col Split — Architecture Schematic Left, Specs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Architecture Schematic Box */}
          <SpotlightCard className="lg:col-span-7 p-8 sm:p-10 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold block mb-4">
                SYSTEM ARCHITECTURE &amp; TOPOLOGY
              </span>
              <h3 className="text-[22px] font-display font-bold text-ink-primary mb-3">
                Distributed Real-Time Control Loop
              </h3>
              <p className="text-[14.5px] text-ink-secondary leading-relaxed mb-6">
                Dual-tier computing hierarchy separating real-time deterministic motor actuation from high-throughput neural perception. The ARM Cortex-M7 core processes optical encoder interrupts and wheel odometry at 1 kHz, while the Linux coprocessor streams 30 FPS depth frames across an isolated internal bus.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-canvas border border-subtle text-[12px] font-mono text-ink-secondary space-y-2">
              <div className="flex items-center justify-between text-ink-primary font-medium">
                <span>[HIGH SPEED SENSING]</span>
                <span>LiDAR + RealSense D435i</span>
              </div>
              <div className="pl-4 border-l-2 border-subtle text-ink-tertiary">
                ↓ USB 3.0 / PCIe Gen 2
              </div>
              <div className="flex items-center justify-between text-ink-primary font-bold">
                <span>[NEURAL ACCELERATOR]</span>
                <span>Hailo-8 NPU (26 TOPS)</span>
              </div>
              <div className="pl-4 border-l-2 border-subtle text-ink-tertiary">
                ↓ ISO 11898 CAN-FD @ 5.0 Mbps
              </div>
              <div className="flex items-center justify-between text-ink-primary font-medium">
                <span>[REAL-TIME CONTROLLER]</span>
                <span>STM32H753 @ 480 MHz (FreeRTOS)</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Hardware Specifications */}
          <SpotlightCard className="lg:col-span-5 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold block mb-4">
                TECHNICAL BENCHMARKS
              </span>
              <div className="space-y-3">
                {(project.specs && project.specs.length > 0 ? project.specs : [
                  { label: 'Compute Architecture', value: 'NVIDIA Jetson Orin Nano + STM32H753' },
                  { label: 'Neural Throughput', value: '26 TOPS INT8 @ 2.5W' },
                  { label: 'Control Bus', value: 'Isolated ISO CAN-FD (5.0 Mbps)' },
                  { label: 'Power Subsystem', value: '4S LiFePO4 with LTC4151 I2C Coulometer' },
                  { label: 'Chassis Material', value: '6061-T6 Billet Aluminum CNC Milled' },
                ]).map((spec) => (
                  <div key={spec.label} className="p-3.5 rounded-xl bg-canvas border border-subtle">
                    <span className="text-[10.5px] font-mono text-ink-tertiary uppercase block">{spec.label}</span>
                    <span className="text-[13.5px] font-medium text-ink-primary mt-0.5 block">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-subtle text-[11px] font-mono text-ink-tertiary">
              Verified inside DIA Labs Chamber C-302
            </div>
          </SpotlightCard>
        </div>

        {/* Section 3: Engineering Narrative */}
        <SpotlightCard className="mb-16 p-8 sm:p-12 rounded-3xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold block mb-2">
            DESIGN JOURNEY
          </span>
          <h2 className="text-[26px] sm:text-[30px] font-display font-bold text-ink-primary mb-6 tracking-tight">
            Problem Formulation &amp; Solution
          </h2>
          <div className="max-w-none text-[15.5px] text-ink-secondary leading-relaxed space-y-4">
            <p>
              Standard commercial robotic rovers suffer from severe latency jitter when running perception and motor PID controls on a unified single-board computer. Under heavy neural inference loads, thread contention routinely causes skipped encoder ticks and erratic trajectory drifts.
            </p>
            <p>
              We solved this by establishing a decoupled dual-tier architecture. High-level path planning and Point Cloud Library (PCL) voxel filtering run on the Linux coprocessor. Trajectory setpoints are packed into 64-byte CAN-FD frames with CRC-16 checksums and dispatched to the bare-metal STM32 microcontroller. The microcontroller operates a closed-loop FreeRTOS task with hard 1ms execution deadlines, ensuring sub-millimeter positioning accuracy even during CPU throttling events.
            </p>
          </div>
        </SpotlightCard>

        {/* Section 4: Silicon Bill of Materials */}
        <div className="mb-16">
          <div className="mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
              HARDWARE BOM
            </span>
            <h2 className="text-[26px] font-display font-bold text-ink-primary mt-1 tracking-tight">
              Silicon Bill of Materials
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(project.bom && project.bom.length > 0 ? project.bom : [
              { component: 'Primary MCU', partNumber: 'STM32H753VIT6', function: 'ARM Cortex-M7 @ 480MHz, FreeRTOS PID Loop' },
              { component: 'Edge Neural Coprocessor', partNumber: 'Hailo-8 M.2', function: 'YOLOv8 Real-Time Tensor Accelerator' },
              { component: 'CAN-FD Transceiver', partNumber: 'TCAN334GDCNT', function: '5 Mbps Fault-Tolerant Bus Interface' },
              { component: 'Dual H-Bridge Driver', partNumber: 'DRV8874-Q1', function: 'Integrated Current Sensing, 37V Peak' },
              { component: 'Buck Regulator', partNumber: 'LMR33630', function: 'Synchronous Step-Down 36V to 5V 3A' },
              { component: 'Digital IMU', partNumber: 'BMI088', function: '6-Axis Low-Noise Automotive Gyro + Accel' },
            ]).map((item, idx) => (
              <SpotlightCard key={idx} className="p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-ink-primary font-bold block">{item.partNumber}</span>
                  <h4 className="text-[14px] font-semibold text-ink-primary mt-1">{item.component}</h4>
                  <p className="text-[12px] text-ink-secondary mt-1">{item.function}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Section 5: Team & Honors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Builders */}
          <SpotlightCard className="p-6 sm:p-8 rounded-3xl">
            <div className="flex items-center gap-2 mb-4 text-ink-primary">
              <Users className="h-5 w-5" />
              <h3 className="text-[17px] font-display font-bold text-ink-primary">Engineering Cadre</h3>
            </div>
            <div className="space-y-3">
              {(project.team && project.team.length > 0 ? project.team : [
                { name: 'Aarish Ali', role: 'Avionics Architecture & Firmware' },
                { name: 'Rohan Sharma', role: 'LiDAR SLAM & Edge Model Optimization' },
                { name: 'Vikram Mehta', role: 'Mechanical Chassis CNC Milling' },
              ]).map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-[13.5px] py-2 border-b border-subtle/50 last:border-0">
                  <span className="font-medium text-ink-primary">{m.name}</span>
                  <span className="text-ink-secondary text-[12.5px]">{m.role}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Honors */}
          <SpotlightCard className="p-6 sm:p-8 rounded-3xl">
            <div className="flex items-center gap-2 mb-4 text-ink-primary">
              <Trophy className="h-5 w-5" />
              <h3 className="text-[17px] font-display font-bold text-ink-primary">National Accolades</h3>
            </div>
            <div className="space-y-3">
              {(project.awards && project.awards.length > 0 ? project.awards : [
                'Smart India Hackathon 2024 — 1st Place National Champions',
                'Patent Filed — Indian Patent Office Docket No. 2024110892',
              ]).map((a, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-ink-primary shrink-0 mt-0.5" />
                  <span className="text-[13px] font-medium text-ink-primary">{a}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
