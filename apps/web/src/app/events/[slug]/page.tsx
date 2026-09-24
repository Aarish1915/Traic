import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Users,
  Wrench,
  Award,
  Terminal,
} from 'lucide-react';

interface EventDetail {
  slug: string;
  title: string;
  type: string;
  startsAt: string;
  duration: string;
  venue: string;
  labLocation: string;
  mode: string;
  tagline: string;
  description: string;
  prizePool?: string;
  tracks: string[];
  schedule: { time: string; activity: string; desc: string }[];
  equipmentProvided: string[];
  mentors: { name: string; role: string }[];
  registrationOpen: boolean;
}

const EVENTS_DATABASE: Record<string, EventDetail> = {
  'traic-annual-hardware-hackathon-2025': {
    slug: 'traic-annual-hardware-hackathon-2025',
    title: 'TRAIC InnoHacks: 36-Hour Hardware Sprint',
    type: 'Hardware Hackathon & Prototype Derby',
    startsAt: 'November 20, 2025 • 09:00 AM IST',
    duration: '36 Continuous Hours',
    venue: 'Central Auditorium & TRAIC Maker Space',
    labLocation: 'Block 4, Innovation Wing, Labs 401-404',
    mode: 'OFFLINE / IN-PERSON',
    tagline: '36-hour physical hackathon where participants build functional embedded and robotic prototypes from components provided on the spot.',
    description: 'TRAIC InnoHacks is the flagship collegiate hardware hackathon designed to test practical engineering rigor under strict time and resource constraints. Unlike traditional software hackathons, every team receives a physical hardware kit containing STM32 microcontrollers, motor drivers, sensor arrays, and direct access to our 3D printers, CNC mill, and SMD soldering benches.',
    prizePool: '₹1,50,000 + Component Grants',
    tracks: [
      'Autonomous Field Mobility & ROS2',
      'Wearable & Assistive Medical Hardware',
      'Smart Grid, Power Distribution & Industrial IoT',
      'Edge AI & Quantized Vision Coprocessors',
    ],
    schedule: [
      { time: 'Day 1 — 09:00 AM', activity: 'Kit Unboxing & Hardware Architecture Briefing', desc: 'Teams receive component kits, problem statements, and power supply allocations.' },
      { time: 'Day 1 — 01:00 PM', activity: 'Schematic Capture & Architecture Checkpoint', desc: 'Senior mentors review circuit schematics, power budgets, and pin assignments.' },
      { time: 'Day 1 — 08:00 PM', activity: 'Fabrication & 3D Printing Queue Cutoff', desc: 'Custom motor mounts and chassis parts dispatched to the CoreXY printer array.' },
      { time: 'Day 2 — 03:00 AM', activity: 'Firmware-in-the-Loop Integration', desc: 'RTOS tasks, CAN bus sequencing, and optical sensor calibrations.' },
      { time: 'Day 2 — 02:00 PM', activity: 'Live Arena Demonstration & Hardware Defense', desc: 'Teams place prototypes in the obstacle arena for physical judging and telemetry validation.' },
      { time: 'Day 2 — 05:00 PM', activity: 'Awards Ceremony & Project Grants Announcement', desc: 'Grand prize presentation and selection for the SIH 2026 incubator pipeline.' },
    ],
    equipmentProvided: [
      'STM32H7 & STM32F4 Development Boards',
      'High-Torque Planetary BLDC & Stepper Actuators',
      'Rigol 100MHz 4-Channel Mixed Signal Oscilloscopes',
      'Hot Air SMD Rework Stations & Soldering Irons',
      'Carbon-fiber nylon 3D printing allotment',
      'Benchtop Regulated Power Supplies (0-30V 5A)',
    ],
    mentors: [
      { name: 'Aarish Ali', role: 'Lead Coordinator & Robotics Architect' },
      { name: 'Priya Patel', role: 'Hardware & Circuit Design Lead' },
      { name: 'Rohan Sharma', role: 'Autonomous Navigation Lead' },
    ],
    registrationOpen: true,
  },
  'robotics-and-ros2-bootcamp-2025': {
    slug: 'robotics-and-ros2-bootcamp-2025',
    title: 'Robotics, ROS2 & Embedded Bootcamp 2025',
    type: 'Intensive Hands-On Masterclass',
    startsAt: 'October 15, 2025 • 10:00 AM IST',
    duration: '4 Intensive Weekend Sessions (32 Hours Total)',
    venue: 'TRAIC Innovation Lab',
    labLocation: 'Block 4, 4th Floor, Electronics Bay',
    mode: 'OFFLINE / IN-PERSON',
    tagline: 'From microcontrollers and C firmware to SLAM and autonomous navigation in 4 hands-on weekend sessions.',
    description: 'A comprehensive engineering bootcamp taught by senior TRAIC competition winners. Designed to take 1st, 2nd, and 3rd year engineering students with basic C knowledge and guide them through bare-metal register manipulation, FreeRTOS scheduling, high-speed PCB schematic design in KiCad, and 3D LiDAR SLAM using ROS2 Humble.',
    prizePool: 'Top 5 Performers Earn Direct Entry to SIH Team 2026',
    tracks: [
      'Bare-Metal STM32 Register Configuration',
      'FreeRTOS Multitasking & Mutex Queues',
      'KiCad 8 Schematic & Dual-Layer PCB Routing',
      'ROS2 Node Graph, DDS & Nav2 Waypoint Navigation',
    ],
    schedule: [
      { time: 'Weekend 1', activity: 'Embedded C, Timers & Hardware Interrupts', desc: 'Register-level manipulation, PWM motor speed control, and DSO signal probing.' },
      { time: 'Weekend 2', activity: 'RTOS & High-Speed Protocols', desc: 'FreeRTOS context switching, UART/SPI/CAN-FD bus packet architectures.' },
      { time: 'Weekend 3', activity: 'Hardware Fabrication & KiCad 8', desc: 'Schematic capture, dual-layer PCB trace layout, DRC checks, and hands-on SMD soldering.' },
      { time: 'Weekend 4', activity: 'ROS2 Humble & Autonomous Robot Field Trial', desc: 'Integrating LiDAR point clouds, RTAB-Map SLAM, and autonomous path tracking on real rovers.' },
    ],
    equipmentProvided: [
      'Personal STM32 Nucleo boards (retained by students)',
      'Digital multimeters, logic probes & breadboards',
      'Access to TRAIC CNC PCB isolation milling machine',
      'Robotics test track and Gazebo simulation workstations',
    ],
    mentors: [
      { name: 'Aarish Ali', role: 'Embedded Systems & ROS2 Mentor' },
      { name: 'Ananya Verma', role: 'Edge AI & Computer Vision Mentor' },
      { name: 'Vikram Mehta', role: 'Mechanical Transmission Mentor' },
    ],
    registrationOpen: true,
  },
};

export function generateStaticParams() {
  return Object.keys(EVENTS_DATABASE).map((slug) => ({ slug }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = EVENTS_DATABASE[slug];

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-0 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 font-mono text-xs text-text-2">
          <Link
            href="/events"
            className="flex items-center gap-1.5 hover:text-accent-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>ALL EVENTS</span>
          </Link>
          <span>/</span>
          <span className="text-accent font-semibold uppercase">{event.type}</span>
          <span>/</span>
          <span className="text-text-1 truncate">{event.title}</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-border bg-gradient-to-b from-surface via-bg-1 to-bg-0 p-8 sm:p-12 mb-12 shadow-xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-md bg-accent/15 px-3 py-1 text-xs font-mono font-bold text-accent border border-accent/40">
              {event.type}
            </span>
            <span className="rounded-md bg-surface px-3 py-1 text-xs font-mono text-text-2 border border-border">
              {event.mode}
            </span>
            {event.registrationOpen && (
              <span className="rounded-full bg-success/20 px-3 py-0.5 text-xs font-mono text-success border border-success/30 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Registrations Active
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-text-1 tracking-tight max-w-4xl">
            {event.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-accent-2 font-medium max-w-3xl leading-relaxed">
            {event.tagline}
          </p>
          <p className="mt-3 text-sm sm:text-base text-text-2 max-w-3xl leading-relaxed">
            {event.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-border/80 py-5">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <span className="text-xs font-mono text-text-2 block">DATE & TIME</span>
                <span className="text-sm font-bold text-text-1">{event.startsAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent-2" />
              <div>
                <span className="text-xs font-mono text-text-2 block">VENUE LOCATION</span>
                <span className="text-sm font-bold text-text-1">{event.venue}</span>
                <span className="text-xs text-text-2 block">{event.labLocation}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-success" />
              <div>
                <span className="text-xs font-mono text-text-2 block">PRIZE & GRANTS</span>
                <span className="text-sm font-bold text-text-1">{event.prizePool}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/join"
              className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-bg-0 hover:bg-accent-hover transition-colors shadow-lg"
            >
              <span>Submit Registration Form</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/learn"
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-text-1 hover:border-accent-2/40 transition-colors"
            >
              <Terminal className="h-4 w-4 text-accent-2" />
              <span>Explore Prerequisites & Syllabus</span>
            </Link>
          </div>
        </div>

        {/* Schedule & Focus Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          {/* Detailed Timeline Schedule */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-mono text-accent font-bold uppercase tracking-wider mb-6">
              <Calendar className="h-4 w-4" />
              <span>EVENT ITINERARY & MILESTONES</span>
            </div>

            <div className="space-y-6">
              {event.schedule.map((item, idx) => (
                <div key={item.time} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-accent font-mono text-xs font-bold border border-accent/40">
                      {idx + 1}
                    </div>
                    {idx < event.schedule.length - 1 && (
                      <div className="w-px flex-1 bg-border/80 my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <span className="text-xs font-mono text-accent-2 font-bold block">{item.time}</span>
                    <h3 className="text-base font-bold text-text-1 mt-0.5">{item.activity}</h3>
                    <p className="text-xs text-text-2 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Provided Lab Tools & Mentors */}
          <div className="lg:col-span-5 space-y-8">
            {/* Provided Equipment */}
            <div className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-mono text-accent font-bold uppercase tracking-wider mb-4">
                <Wrench className="h-4 w-4" />
                <span>PROVIDED LAB HARDWARE</span>
              </div>
              <p className="text-xs text-text-2 mb-4">
                Every participating team receives direct bench access to the following instrumentation:
              </p>
              <div className="space-y-2">
                {event.equipmentProvided.map((eq) => (
                  <div key={eq} className="flex items-start gap-2 text-xs text-text-1 font-mono">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{eq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentors */}
            <div className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-mono text-accent font-bold uppercase tracking-wider mb-4">
                <Users className="h-4 w-4" />
                <span>LEAD MENTORS & EVALUATORS</span>
              </div>
              <div className="space-y-3">
                {event.mentors.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-bg-1/70 p-3"
                  >
                    <div>
                      <div className="font-bold text-text-1 text-xs">{m.name}</div>
                      <div className="text-[11px] font-mono text-accent-2 mt-0.5">{m.role}</div>
                    </div>
                    <Link
                      href="/team"
                      className="text-xs font-mono text-text-2 hover:text-text-1"
                    >
                      Profile →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
