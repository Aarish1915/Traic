'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface TrackItem {
  id?: string;
  level: string;
  title: string;
  summary: string;
  tools: string[];
  outcomes: string[];
}

const DEFAULT_TRACKS: TrackItem[] = [
  {
    level: 'TRACK 01',
    title: 'Embedded Firmware & RTOS',
    summary: 'Master register-level peripheral programming, bare-metal C, and deterministic FreeRTOS threading on ARM Cortex-M7 silicon without hobbyist abstractions.',
    tools: ['STM32CubeIDE', 'J-Link Debugger', 'Saleae Logic Analyzer', 'FreeRTOS', 'Bare-Metal C', 'CAN-FD'],
    outcomes: [
      'Configure direct DMA ring buffers and multi-channel ADC continuous scans',
      'Implement real-time PID velocity loops with <10μs jitter deadlines',
      'Build fault-tolerant CAN-FD transceiver networks with CRC verification',
      'Flash and debug ARM Cortex-M7 bootloaders via SWD and JTAG',
    ],
  },
  {
    level: 'TRACK 02',
    title: 'Hardware & Multi-Layer PCB Engineering',
    summary: 'Design industrial circuit boards from schematic capture to SMD reflow. Learn high-speed routing, ground plane returns, and thermal isolation.',
    tools: ['KiCad 8.0', 'JLCPCB Manufacturing Pipeline', 'Hakko FR-810B Hot Air', 'Digital Calipers', 'Microscopes'],
    outcomes: [
      'Route 4-layer FR-4 boards with 50Ω single-ended and 100Ω differential pairs',
      'Calculate thermal dissipation vias for high-current MOSFET power stages',
      'Hand-solder 0402 surface-mount passives and QFN/QFP packages with flux',
      'Generate IPC-compliant Gerber, drill, and pick-and-place BOM packages',
    ],
  },
  {
    level: 'TRACK 03',
    title: 'Autonomous Robotics & Edge AI',
    summary: 'Construct autonomous ground vehicles and aerial platforms. Write ROS2 nodes, perform LiDAR SLAM mapping, and quantize neural models for edge NPUs.',
    tools: ['ROS2 Humble', 'Nav2 Stack', 'RViz & Gazebo', 'Hailo-8 M.2 NPU', 'NVIDIA Jetson', 'PyTorch / TensorRT'],
    outcomes: [
      'Implement Extended Kalman Filter state estimation fusing IMU and wheel ticks',
      'Generate real-time 3D occupancy grid maps using RTAB-Map LiDAR SLAM',
      'Quantize YOLOv8 vision backbones to INT8 running at 60 FPS on edge accelerators',
      'Coordinate distributed multi-node telemetry over DDS and UDP protocols',
    ],
  },
  {
    level: 'TRACK 04',
    title: 'Self-Hosted Systems & Infrastructure',
    summary: 'Own the entire computational stack. Administer bare-metal Proxmox hypervisors, manage ZFS storage racks, and host private LLM inference engines.',
    tools: ['Debian Linux', 'Proxmox VE 8.2', 'ZFS File System', 'Docker / LXC', 'WireGuard', 'vLLM'],
    outcomes: [
      'Deploy and monitor virtualized LXC micro-services with automated health checks',
      'Configure WireGuard cryptographic mesh VPN tunnels for remote lab access',
      'Maintain private Forgejo Git mirrors and Woodpecker CI continuous runners',
      'Host low-latency local quantized LLM inference clusters on on-premise GPUs',
    ],
  },
];

export default function LearnPage() {
  const [tracks, setTracks] = useState<TrackItem[]>(DEFAULT_TRACKS);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/public/tracks`)
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setTracks(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const pipelineStages = [
    { num: '01', title: 'LEARN', desc: 'Read silicon datasheets, understand hardware registers, and master schematic design in DIA Labs.' },
    { num: '02', title: 'BUILD', desc: 'Mill prototype PCBs, hand-solder surface-mount chips, and assemble mechanical frames.' },
    { num: '03', title: 'TEST', desc: 'Hook up 1GHz oscilloscopes, probe signal integrity, and isolate ground loops.' },
    { num: '04', title: 'DEPLOY', desc: 'Run deterministic firmware and field-test autonomous navigation outdoors.' },
    { num: '05', title: 'COMPETE', desc: 'Represent the university at Smart India Hackathon, Robocon, and publish patents.' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero & Philosophy */}
        <div className="text-center max-w-[820px] mx-auto mb-20">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            THE APPRENTICESHIP
          </span>
          <h1 className="text-[36px] sm:text-[52px] font-display font-bold tracking-tight text-ink-primary mt-2 leading-[1.08]">
            From zero to systems builder.
          </h1>
          <p className="mt-4 text-[16px] sm:text-[18px] text-ink-secondary leading-relaxed">
            Our curriculum was authored by senior student engineers who build real robots. We don't grade multiple-choice exams — your code compiles, your board powers on without short-circuiting, and your machine navigates the obstacle course.
          </p>
        </div>

        {/* Section 2: 5-Stage Engineering Pipeline */}
        <div className="mb-24 p-8 sm:p-10 rounded-3xl bg-canvas-surface border border-subtle">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-bold block mb-2">
            THE METHODOLOGY
          </span>
          <h2 className="text-[24px] font-display font-bold text-ink-primary mb-8">
            5-Stage Engineering Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((stage, idx) => (
              <div key={stage.title} className="p-4 rounded-2xl bg-canvas border border-subtle flex flex-col justify-between">
                <div>
                  <span className="text-[18px] font-mono font-bold text-apple-blue">{stage.num}</span>
                  <h3 className="text-[15px] font-display font-semibold text-ink-primary mt-1">{stage.title}</h3>
                  <p className="text-[12px] text-ink-secondary mt-2 leading-relaxed">{stage.desc}</p>
                </div>
                {idx < pipelineStages.length - 1 && (
                  <div className="hidden md:flex justify-end text-ink-tertiary mt-4">
                    <ChevronRight className="h-4 w-4 text-apple-blue/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: The 4 Tracks */}
        <div className="mb-24">
          <div className="mb-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
              CURRICULUM SPECIALIZATIONS
            </span>
            <h2 className="text-[28px] font-display font-bold text-ink-primary mt-1">
              Four Specialized Tracks
            </h2>
            <p className="text-[15px] text-ink-secondary mt-2 max-w-[620px]">
              Every recruit chooses a primary track while collaborating on interdisciplinary teams.
            </p>
          </div>

          <div className="space-y-8">
            {tracks.map((track, i) => (
              <div
                key={track.title + i}
                className="p-8 sm:p-10 rounded-3xl bg-canvas-surface border border-subtle hover:border-apple-blue/30 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Track Info */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-canvas border border-subtle text-[11px] font-mono text-apple-blue mb-4">
                        <span>{track.level}</span>
                      </div>
                      <h3 className="text-[24px] sm:text-[28px] font-display font-bold text-ink-primary leading-tight">
                        {track.title}
                      </h3>
                      <p className="mt-4 text-[14.5px] text-ink-secondary leading-relaxed">
                        {track.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-subtle">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-tertiary block mb-3">
                        Lab Instruments &amp; Toolchain
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {track.tools.map((tool) => (
                          <span key={tool} className="px-2.5 py-1 rounded-lg bg-canvas border border-subtle text-[11px] font-mono text-apple-blue">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Concrete Outcomes */}
                  <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-canvas border border-subtle flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-bold block mb-4">
                        TANGIBLE CAPABILITIES YOU WILL MASTER
                      </span>
                      <ul className="space-y-3.5 list-none p-0 m-0">
                        {track.outcomes.map((outcome, oIdx) => (
                          <li key={oIdx} className="flex items-start gap-3 text-[13.5px] text-ink-secondary leading-relaxed">
                            <CheckCircle2 className="h-4 w-4 text-[var(--status-emerald)] shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-subtle/50 flex items-center justify-between text-[12.5px]">
                      <span className="text-ink-tertiary font-mono">Location: DIA Labs C-302</span>
                      <Link href="/join" className="text-apple-blue hover:underline inline-flex items-center gap-1 font-semibold min-h-[44px]">
                        <span>Enroll via Cohort 2026</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: What You Build & CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-canvas-surface border border-subtle text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            PROOF OF WORK
          </span>
          <h2 className="text-[28px] font-display font-bold text-ink-primary mt-2">
            Curriculum builds real machines, not toys.
          </h2>
          <p className="mt-3 text-[15px] text-ink-secondary max-w-[600px] mx-auto">
            Explore past student machines or apply for the next intake cycle.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-pill bg-canvas-surface hover:bg-canvas-elevated text-ink-primary border border-subtle text-[14px] font-medium transition-colors"
            >
              Explore Hardware Archive
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-medium transition-colors"
            >
              Apply for Cohort 2026 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
