'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Cpu, ExternalLink, Filter, Box, ArrowRight, Radio } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { TelemetryModal } from '@/components/TelemetryModal';
import type { ProjectCategory } from '@traic/shared';

const Project3DInspector = dynamic(
  () => import('@/components/Project3DInspector').then((m) => m.Project3DInspector),
  { ssr: false }
);
const ProjectCard3DPreview = dynamic(
  () => import('@/components/ProjectCard3DPreview').then((m) => m.ProjectCard3DPreview),
  { ssr: false }
);

const PROJECTS = [
  {
    slug: 'autonomous-ugv-rover',
    title: 'Autonomous Field Rover (UGV-X)',
    tagline: 'All-terrain autonomous rover equipped with LiDAR, stereo depth cameras, and ROS2 navigation.',
    category: 'HYBRID' as ProjectCategory,
    year: 2024,
    tech: ['ROS2', 'C++', 'Python', 'RTAB-Map', 'LiDAR', 'CAN Bus', 'NVIDIA Jetson'],
    description: 'Custom CNC aluminum differential-drive robot running real-time 3D SLAM, obstacle avoidance, and waypoint following on NVIDIA Jetson Orin Nano.',
    repoUrl: 'https://github.com/traic-club/autonomous-ugv',
    demoUrl: '',
    modelUrl: '', // Ready for .glb
    featured: true,
  },
  {
    slug: 'edge-neural-pcb',
    title: 'Edge Neural Accelerator Board',
    tagline: 'Custom 4-layer PCB running quantized edge vision models on STM32H7 and Hailo-8 NPU.',
    category: 'HARDWARE' as ProjectCategory,
    year: 2024,
    tech: ['KiCad', 'STM32', 'C', 'FreeRTOS', 'Hailo-8', 'Altium'],
    description: 'High-speed differential routing, power sequencing, and camera interfaces on a custom 4-layer FR4 board for low-power edge detection.',
    repoUrl: 'https://github.com/traic-club/edge-neural-pcb',
    demoUrl: '',
    modelUrl: '', // Ready for .glb
    featured: true,
  },
  {
    slug: 'telemetry-ground-station',
    title: 'Distributed Telemetry Ground Station',
    tagline: 'Sub-millisecond WebSockets and WebRTC ground station platform for live robotic fleet telemetry.',
    category: 'SOFTWARE' as ProjectCategory,
    year: 2024,
    tech: ['Rust', 'Go', 'Next.js', 'WebSockets', 'LoRa', 'Three.js'],
    description: 'Decodes RF packets from rovers and drones in real time, rendering low-latency 3D orientation models, battery thermals, and sensor graphs.',
    repoUrl: 'https://github.com/traic-club/telemetry-station',
    demoUrl: '',
    modelUrl: '',
    featured: true,
  },
  {
    slug: 'hexapod-walking-robot',
    title: 'Adaptive Terrain Hexapod',
    tagline: '18-DOF biomimetic hexapod robot with inverse kinematics and terrain adaptation.',
    category: 'HARDWARE' as ProjectCategory,
    year: 2023,
    tech: ['FreeCAD', 'C++', 'Inverse Kinematics', 'Teensy 4.1', 'Dynamixel'],
    description: 'Designed custom carbon-fiber and 3D printed coxa-femur-tibia legs driven by high-torque digital bus servos with gait sequencing.',
    repoUrl: 'https://github.com/traic-club/hexapod',
    demoUrl: '',
    modelUrl: '',
    featured: false,
  },
  {
    slug: 'smart-grid-energy-monitor',
    title: 'IoT Industrial Energy Monitor',
    tagline: 'DIN-rail mounted 3-phase power quality and fault analyzer with MQTT telemetry.',
    category: 'HYBRID' as ProjectCategory,
    year: 2023,
    tech: ['ESP32', 'FreeRTOS', 'ADE7758', 'MQTT', 'InfluxDB', 'Grafana'],
    description: 'Measures true RMS voltage, active/reactive power, and power factor with isolated current transformers and secure TLS MQTT uplinks.',
    repoUrl: 'https://github.com/traic-club/iot-energy-monitor',
    demoUrl: '',
    modelUrl: '',
    featured: false,
  },
  {
    slug: 'robocon-holonomic-base',
    title: 'Holonomic Mecanum Drive Base',
    tagline: 'Omni-directional drive platform with dual optical mouse odometry for Robocon.',
    category: 'HARDWARE' as ProjectCategory,
    year: 2024,
    tech: ['SolidWorks', 'STM32F4', 'CAN-FD', 'Optical Odometry', 'PID'],
    description: 'Precision trajectory tracking within 5mm error margin at 2.5 m/s acceleration using cascading velocity and position PID loops.',
    repoUrl: 'https://github.com/traic-club/holonomic-base',
    demoUrl: '',
    modelUrl: '',
    featured: false,
  },
];

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState(PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [inspectingProject, setInspectingProject] = useState<{
    title: string;
    category: string;
    tech: string[];
    modelUrl?: string;
  } | null>(null);
  const [showTelemetry, setShowTelemetry] = useState(false);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/public/projects`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProjectsList(
            res.data.map((p: any) => ({
              slug: p.slug,
              title: p.title,
              tagline: p.tagline,
              category: p.category as ProjectCategory,
              year: p.year,
              tech: p.techStack || p.tech || [],
              description: p.descriptionMd || p.description,
              repoUrl: p.repoUrl || '',
              demoUrl: p.demoUrl || '',
              modelUrl: p.model3dAssetUrl || '',
              featured: !!p.featured,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filteredProjects = selectedCategory === 'ALL'
    ? projectsList
    : projectsList.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-bg-0 py-16">
      {/* 3D Model & CAD Inspector Modal */}
      {inspectingProject && (
        <Project3DInspector
          projectTitle={inspectingProject.title}
          category={inspectingProject.category}
          techStack={inspectingProject.tech}
          modelUrl={inspectingProject.modelUrl}
          onClose={() => setInspectingProject(null)}
        />
      )}

      {/* Ground Station Telemetry Simulation Modal */}
      {showTelemetry && <TelemetryModal onClose={() => setShowTelemetry(false)} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent">
            <Cpu className="h-3.5 w-3.5" />
            <span>PORTFOLIO // LAB WORK</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-text-1">
            Projects & Prototypes
          </h1>
          <p className="mt-3 text-base text-text-2 max-w-2xl leading-relaxed">
            From bare-metal firmware to 4-layer PCBs and autonomous robot fleets. Explore the systems engineered in our workshop.
          </p>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border pb-4">
            <span className="mr-2 flex items-center gap-1.5 text-xs font-mono text-text-2">
              <Filter className="h-3.5 w-3.5" />
              <span>CATEGORY:</span>
            </span>
            {['ALL', 'HARDWARE', 'HYBRID', 'SOFTWARE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold font-mono transition-colors ${
                  selectedCategory === cat
                    ? 'bg-accent text-bg-0'
                    : 'bg-surface text-text-2 border border-border hover:text-text-1 hover:border-accent-2/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-col justify-between rounded-xl border border-border bg-surface/70 p-6 transition-all hover:border-accent-2/50 hover:bg-surface hover:-translate-y-1 shadow-sm"
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
                  <span className="text-xs font-mono text-text-2">{project.year}</span>
                </div>

                {/* Interactive 3D Model Preview */}
                <ProjectCard3DPreview
                  category={project.category}
                  slug={project.slug}
                  title={project.title}
                />

                <Link
                  href={`/projects/${project.slug}`}
                  className="text-xl font-bold text-text-1 hover:text-accent-2 transition-colors block"
                >
                  {project.title}
                </Link>
                <p className="mt-2 text-xs font-medium text-accent-2">
                  {project.tagline}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-text-2">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/80">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-bg-1 px-2 py-0.5 text-[10px] font-mono text-text-2 border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3.5 text-xs">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-text-2 hover:text-text-1 transition-colors py-1"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </a>

                    {project.slug === 'telemetry-ground-station' ? (
                      <button
                        onClick={() => setShowTelemetry(true)}
                        className="inline-flex items-center gap-1 text-accent font-semibold hover:underline py-1"
                        title="Open Interactive Telemetry Simulator"
                      >
                        <Radio className="h-3 w-3 animate-pulse" />
                        <span>Demo</span>
                      </button>
                    ) : project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-accent font-semibold hover:underline py-1"
                      >
                        <span>Demo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-accent-2 font-semibold hover:underline py-1"
                    >
                      <span>Specs</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <button
                    onClick={() =>
                      setInspectingProject({
                        title: project.title,
                        category: project.category,
                        tech: project.tech,
                        modelUrl: project.modelUrl,
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent-2/50 bg-accent-2/10 px-3 py-1.5 text-xs font-mono font-semibold text-accent-2 hover:bg-accent-2 hover:text-bg-0 transition-colors shrink-0"
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
    </div>
  );
}
