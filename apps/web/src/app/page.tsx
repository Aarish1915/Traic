import Link from 'next/link';
import {
  ArrowRight,
  Cpu,
  Trophy,
  Calendar,
  Layers,
  ChevronRight,
  Activity,
} from 'lucide-react';

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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 circuit-pattern">
        {/* Glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-accent-2/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-mono font-medium text-accent-2 backdrop-blur-sm shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>HARDWARE WORKSHOP MEETS DEEP TECH STUDIO</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-1 max-w-5xl mx-auto leading-[1.1]">
            Where Physical Hardware Meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-accent-2">
              Intelligent Code
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-text-2 max-w-3xl mx-auto leading-relaxed">
            We are TRAIC — a college engineering collective building autonomous robotics, custom 4-layer PCBs, and edge AI systems that solve real-world problems and win national championships.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
          <div className="mt-16 mx-auto max-w-3xl rounded-xl border border-border bg-bg-1/90 p-4 text-left font-mono text-xs shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-danger/80" />
                <span className="h-3 w-3 rounded-full bg-accent/80" />
                <span className="h-3 w-3 rounded-full bg-success/80" />
                <span className="ml-2 text-text-2">traic-core-v2 // telemetry_stream</span>
              </div>
              <div className="flex items-center gap-2 text-success">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                <span>ALL NODES NOMINAL</span>
              </div>
            </div>
            <div className="space-y-1 text-text-2">
              <p><span className="text-accent-2">[INIT]</span> Initializing ROS2 Humble micro-agent on STM32H7 dual-core target...</p>
              <p><span className="text-success">[OK]</span> CAN-FD bus synchronized @ 5 Mbps. 4/4 Motor Controllers acked.</p>
              <p><span className="text-accent">[INFO]</span> LiDAR 3D point cloud streaming: 42,000 pts/s | RTAB-Map SLAM loop closure achieved.</p>
              <p className="text-text-1 font-semibold"><span className="text-accent-2">[TRAIC]</span> Ready to build. 0 compiler errors. 0 design rule violations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="border-y border-border bg-bg-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-text-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_PROJECTS.map((project) => (
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

                  <h3 className="text-xl font-bold text-text-1 group-hover:text-accent-2 transition-colors">
                    {project.title}
                  </h3>
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
                  <Link
                    href={`/projects`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-text-1 hover:text-accent"
                  >
                    <span>Read engineering specs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS / SOCIAL PROOF */}
      <section className="py-20 bg-bg-1 border-t border-border">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HIGHLIGHT_ACHIEVEMENTS.map((ach) => (
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

      {/* METHODOLOGY: HOW TRAIC WORKS */}
      <section className="py-20 bg-bg-0 border-t border-border">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* UPCOMING EVENT BANNER */}
      <section className="py-16 bg-gradient-to-r from-bg-1 via-surface to-bg-1 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-2xl border border-accent/30 bg-bg-0/60 p-8 sm:p-10 shadow-xl backdrop-blur-md">
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
