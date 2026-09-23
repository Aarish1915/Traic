import { Users, GraduationCap } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';

const LEADERSHIP = [
  {
    name: 'Aarish Ali',
    role: 'Lead Coordinator & Robotics Architect',
    academicYear: '2024–2025',
    bio: 'Directs overall club technical roadmaps, embedded firmware development, and autonomous vehicle integration.',
    skills: ['ROS2', 'STM32', 'FreeRTOS', 'CAN-FD', 'High-Speed PCB'],
    github: 'https://github.com/Aarish1915',
    linkedin: 'https://linkedin.com/in/aarishali',
  },
  {
    name: 'Ananya Verma',
    role: 'Co-Coordinator & AI Research Lead',
    academicYear: '2024–2025',
    bio: 'Oversees neural accelerator deployment, camera pipelines, and real-time obstacle detection algorithms.',
    skills: ['PyTorch', 'TensorRT', 'Edge Inference', 'Computer Vision'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

const DOMAIN_LEADS = [
  {
    name: 'Rohan Sharma',
    role: 'Autonomous Navigation Lead',
    domain: 'Robotics',
    focus: 'SLAM, Nav2, LiDAR Integration, Point Cloud Processing',
  },
  {
    name: 'Priya Patel',
    role: 'Hardware & Circuit Design Lead',
    domain: 'Hardware',
    focus: '4-Layer PCB Layout, Power Sequencing, Signal Integrity',
  },
  {
    name: 'Kavya Nair',
    role: 'Telemetry & Systems Lead',
    domain: 'Software',
    focus: 'Distributed Telemetry, Rust Systems, High-throughput WebSockets',
  },
  {
    name: 'Vikram Mehta',
    role: 'Mechanical & Fabrication Lead',
    domain: 'Mechanical',
    focus: 'CNC Milling, 3D Printing, Finite Element Analysis, Kinematics',
  },
];

const ALUMNI = [
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

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-bg-0 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent">
            <Users className="h-3.5 w-3.5" />
            <span>PEOPLE // LEADERSHIP</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-text-1">
            Engineers & Leads
          </h1>
          <p className="mt-3 text-base text-text-2 leading-relaxed">
            TRAIC is entirely student-governed and senior-mentored. Meet the coordinators and technical domain leads steering our engineering projects.
          </p>
        </div>

        {/* Coordinators */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-accent tracking-wider font-mono uppercase mb-6">
            // Core Coordinators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEADERSHIP.map((lead) => (
              <div
                key={lead.name}
                className="rounded-2xl border border-border bg-surface/80 p-8 shadow-sm transition-all hover:border-accent/40"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-mono font-semibold text-accent border border-accent/30">
                    {lead.academicYear}
                  </span>
                  <div className="flex gap-3 text-text-2">
                    {lead.github && (
                      <a href={lead.github} target="_blank" rel="noreferrer" className="p-1 hover:text-text-1">
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                    {lead.linkedin && (
                      <a href={lead.linkedin} target="_blank" rel="noreferrer" className="p-1 hover:text-accent-2">
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-text-1">{lead.name}</h3>
                <p className="text-sm font-semibold text-accent-2 mt-1">{lead.role}</p>
                <p className="mt-3 text-sm text-text-2 leading-relaxed">{lead.bio}</p>

                <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-1.5">
                  {lead.skills.map((s) => (
                    <span key={s} className="rounded bg-bg-1 px-2.5 py-0.5 text-xs font-mono text-text-2 border border-border">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Leads */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-accent-2 tracking-wider font-mono uppercase mb-6">
            // Domain & Technical Leads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOMAIN_LEADS.map((lead) => (
              <div
                key={lead.name}
                className="rounded-xl border border-border bg-surface/60 p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-accent uppercase tracking-wider block mb-1">
                    {lead.domain} Track
                  </span>
                  <h3 className="text-lg font-bold text-text-1">{lead.name}</h3>
                  <p className="text-xs font-medium text-accent-2 mt-0.5 mb-3">{lead.role}</p>
                  <p className="text-xs text-text-2 leading-relaxed">{lead.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-text-1">
              Alumni Hall of Fame
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ALUMNI.map((alum) => (
              <div
                key={alum.name}
                className="rounded-xl border border-border bg-surface/40 p-6"
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
      </div>
    </div>
  );
}
