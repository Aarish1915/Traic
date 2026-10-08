import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { SpotlightCard } from '@/components/SpotlightCard';

export const metadata = {
  title: 'Workshops, Hackathons & Bootcamps — TRAIC Events',
  description: 'Hands-on hardware hackathons, embedded firmware bootcamps, and robotics design sprints at DIA Labs, COER University.',
};

export const revalidate = 60; // ISR cache

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface EventItem {
  id?: string;
  slug: string;
  title: string;
  tagline?: string;
  type: string;
  mode: string;
  venue: string;
  startsAt: string;
  endsAt?: string;
  descriptionMd?: string;
  prizePool?: string;
  teamSize?: string;
  capacity?: number;
  tracks?: string[];
  schedule?: { time: string; title: string; description?: string }[];
}

const DEFAULT_EVENTS: EventItem[] = [
  {
    slug: 'amr-navigation-workshop-2026',
    title: 'Autonomous Mobile Robot Navigation with ROS2 & 3D LiDAR',
    tagline: 'A 2-day intensive sprint: Flash STM32 microcontrollers, wire differential drive motors, and map Block C with 3D point-cloud SLAM.',
    type: 'WORKSHOP',
    mode: 'OFFLINE',
    venue: 'DIA Labs, Block C-302, COER University',
    startsAt: '2026-10-24T10:00:00Z',
    endsAt: '2026-10-25T17:00:00Z',
    descriptionMd: 'Complete hardware workshop where each student team builds and navigates a miniature two-wheeled differential robot.',
    prizePool: '₹25,000 in dev boards & sensors',
    teamSize: '1–3 Builders',
    capacity: 30,
    tracks: ['ROS2 Navigation', 'LiDAR SLAM', 'STM32 Hardware HAL'],
    schedule: [
      { time: 'Day 1 · 10:00 AM', title: 'STM32 Motor Driver Calibration', description: 'Differential drive PWM timer setup' },
      { time: 'Day 1 · 02:00 PM', title: 'RPLiDAR A2M12 Point Cloud Ingestion', description: 'Interfacing LiDAR serial node' },
      { time: 'Day 2 · 11:00 AM', title: 'Nav2 Costmap & Waypoint Navigation', description: 'Autonomous obstacle avoidance' },
    ],
  },
  {
    slug: 'pcb-fabrication-bootcamp-2026',
    title: '4-Layer High-Speed PCB Layout & SMD Reflow Bootcamp',
    tagline: 'From blank KiCad 8 schematic to functional circuit board. Hand-solder 0402 passives and reflow QFN packages on hot plates.',
    type: 'BOOTCAMP',
    mode: 'OFFLINE',
    venue: 'DIA Labs Soldering Bay, Block C-302',
    startsAt: '2026-11-07T09:30:00Z',
    endsAt: '2026-11-08T18:00:00Z',
    descriptionMd: 'Learn schematic capture, trace impedance calculations, solder mask clearances, and SMD hot-air rework.',
    prizePool: 'Free custom 4-layer PCB fabrication for top 5 designs',
    teamSize: 'Solo or Pairs',
    capacity: 25,
    tracks: ['High-Speed Layout', 'SMD Reflow', 'Impedance Control'],
  },
  {
    slug: 'traic-hardware-hackathon-2026',
    title: 'TRAIC InnoHacks 2026 — 36-Hour Autonomous Hardware Hackathon',
    tagline: 'Annual flagship engineering challenge: Build working physical prototypes solving real industrial automation and agriculture problems.',
    type: 'HACKATHON',
    mode: 'OFFLINE',
    venue: 'COER University Auditorium & DIA Labs',
    startsAt: '2026-11-20T10:00:00Z',
    endsAt: '2026-11-22T16:00:00Z',
    descriptionMd: 'Flagship hackathon with ₹1,50,000 prize pool, component hardware library access, and direct industry mentor review.',
    prizePool: '₹1,50,000 Cash Prize + Lab Sponsorship',
    teamSize: '2–4 Engineers',
    capacity: 150,
    tracks: ['Industrial Automation', 'AgriTech Robotics', 'Autonomous Drones', 'Edge AI Vision'],
    schedule: [
      { time: 'Nov 20 · 10:00 AM', title: 'Hardware Store Opens & Sprint Start', description: 'Component allocation & unboxing' },
      { time: 'Nov 21 · 02:00 PM', title: 'Midway Prototype Gate Review', description: 'Smoke tests and telemetry demo' },
      { time: 'Nov 22 · 02:00 PM', title: 'Final Arena Pitches & Awards', description: 'Live physical obstacle demonstration' },
    ],
  },
  {
    slug: 'freertos-kernel-architecture-session',
    title: 'FreeRTOS Kernel Primitives & Deterministic Embedded C',
    tagline: 'Deep dive into preemptive task scheduling, semaphores, mutexes, message queues, and memory pools on STM32H7.',
    type: 'SEMINAR',
    mode: 'HYBRID',
    venue: 'Block C Seminar Hall & Live Stream',
    startsAt: '2026-12-05T14:00:00Z',
    endsAt: '2026-12-05T17:00:00Z',
    descriptionMd: 'Advanced software architectural session for embedded firmware developers looking to write production-grade firmware.',
    prizePool: 'STM32H7 Core Boards to top quiz performers',
    teamSize: 'Individual',
    capacity: 100,
    tracks: ['Preemptive Scheduling', 'Memory Allocation', 'Concurrency'],
  },
];

export default async function EventsPage() {
  let events = DEFAULT_EVENTS;

  try {
    const res = await fetch(`${API_BASE}/public/events`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        events = json.data;
      }
    }
  } catch (err) {
    // Fall back to default events
  }

  const featuredEvent = events[0] || DEFAULT_EVENTS[0];
  const remainingEvents = events.slice(1);

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Section 1: Hero */}
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-bold">
            COMMUNITY SESSIONS &amp; HACKATHONS
          </span>
          <h1 className="text-[38px] sm:text-[54px] font-display font-extrabold tracking-[-0.035em] text-ink-primary mt-2 leading-[1.04]">
            Workshops, Sprints &amp; Hardware Hackathons
          </h1>
          <p className="mt-4 text-[17px] text-ink-secondary leading-relaxed">
            Hands-on technical gatherings where students build real circuits, debug firmware, and pitch working physical prototypes.
          </p>
        </div>

        {/* Section 2: Featured Upcoming Event Card */}
        {featuredEvent && (
          <SpotlightCard className="mb-20 p-8 sm:p-12 rounded-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-ink-primary text-[11px] font-mono font-bold uppercase tracking-wider">
                {featuredEvent.type}
              </span>
              <span className="px-3 py-1 rounded-pill bg-canvas border border-subtle text-ink-secondary text-[11px] font-mono">
                {featuredEvent.mode}
              </span>
              {featuredEvent.prizePool && (
                <span className="px-3 py-1 rounded-pill bg-apple-blue/10 text-apple-blue border border-apple-blue/20 text-[11px] font-mono font-bold">
                  {featuredEvent.prizePool}
                </span>
              )}
              {featuredEvent.teamSize && (
                <span className="px-3 py-1 rounded-pill bg-canvas border border-subtle text-ink-secondary text-[11px] font-mono">
                  Team: {featuredEvent.teamSize}
                </span>
              )}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-canvas border border-subtle text-[11px] font-mono text-ink-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-primary/70 animate-pulse" />
                <span>REGISTRATIONS OPEN</span>
              </div>
            </div>

            <h2 className="text-[26px] sm:text-[36px] font-display font-bold text-ink-primary mt-2 leading-snug tracking-tight">
              {featuredEvent.title}
            </h2>

            <p className="mt-4 text-[16px] text-ink-secondary max-w-[800px] leading-relaxed">
              {featuredEvent.tagline || featuredEvent.descriptionMd}
            </p>

            {featuredEvent.tracks && featuredEvent.tracks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {featuredEvent.tracks.map((trk, trkIdx) => (
                  <span key={`${trk}-${trkIdx}`} className="px-3 py-1 rounded-pill bg-canvas border border-subtle text-[11.5px] font-mono text-ink-secondary">
                    {trk}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-6 text-[13px] font-mono text-ink-secondary">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-ink-tertiary" />
                {new Date(featuredEvent.startsAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-ink-tertiary" />
                {featuredEvent.venue}
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-[13px] text-ink-secondary font-mono">
                {featuredEvent.capacity ? `Bench safety limit: ${featuredEvent.capacity} seats` : 'Strict laboratory bench capacity'}
              </span>
              <Link
                href={`/events/${featuredEvent.slug}`}
                className="w-fit inline-flex items-center gap-2 min-h-[44px] px-6 rounded-pill bg-ink-primary text-canvas hover:opacity-90 font-medium text-[13.5px] active:scale-95 transition-all shadow-sm"
              >
                <span>Reserve Lab Bench</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        )}

        {/* Section 3: All Events Editorial List */}
        <div className="mb-20">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-bold">
              SCHEDULE &amp; CALENDAR
            </span>
            <h2 className="text-[28px] font-display font-bold text-ink-primary mt-1">
              Upcoming &amp; Scheduled Sessions
            </h2>
          </div>

          <div className="space-y-4">
            {remainingEvents.map((evt, evtIdx) => (
              <SpotlightCard
                key={`${evt.slug}-${evtIdx}`}
                className="p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="w-24 shrink-0 text-left md:text-center font-mono border-b md:border-b-0 md:border-r border-subtle pb-2 md:pb-0 md:pr-6">
                    <span className="text-[11px] text-ink-tertiary block uppercase">
                      {new Date(evt.startsAt).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-[26px] font-bold text-apple-blue leading-none">
                      {new Date(evt.startsAt).toLocaleDateString('en-US', { day: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-pill bg-canvas border border-subtle text-[10.5px] font-mono text-ink-primary uppercase font-bold">
                        {evt.type}
                      </span>
                      <span className="text-[11px] font-mono text-ink-tertiary">
                        {evt.mode}
                      </span>
                      {evt.prizePool && (
                        <span className="px-2.5 py-0.5 rounded-pill bg-apple-blue/10 text-apple-blue border border-apple-blue/20 text-[10.5px] font-mono font-medium">
                          {evt.prizePool}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[18px] font-display font-semibold text-ink-primary">
                      {evt.title}
                    </h3>
                    {evt.tracks && evt.tracks.length > 0 && (
                      <p className="mt-1 text-[12px] font-mono text-ink-secondary">
                        Tracks: {evt.tracks.join(' · ')}
                      </p>
                    )}
                    <p className="mt-1 text-[13px] text-ink-secondary flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-apple-blue shrink-0" />
                      <span>{evt.venue}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Link
                    href={`/events/${evt.slug}`}
                    className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-pill bg-canvas-surface hover:bg-canvas-elevated text-ink-primary border border-subtle text-[13.5px] font-medium active:scale-95 transition-all"
                  >
                    <span>Details &amp; RSVP</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
