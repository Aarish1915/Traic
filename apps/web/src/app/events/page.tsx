import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

const UPCOMING_EVENTS = [
  {
    slug: 'traic-annual-hardware-hackathon-2025',
    title: 'TRAIC InnoHacks: 36-Hour Hardware Sprint',
    type: 'Hardware Hackathon',
    startsAt: 'Nov 20, 2025 • 09:00 AM',
    venue: 'Central Auditorium & TRAIC Maker Space',
    mode: 'OFFLINE',
    tagline: '36-hour physical hackathon where participants build functional embedded and robotic prototypes from components provided on the spot.',
    tracks: ['Autonomous Mobility', 'Assistive Devices', 'Smart Grid & Renewable Tech'],
    registrationOpen: true,
  },
  {
    slug: 'robotics-and-ros2-bootcamp-2025',
    title: 'Robotics, ROS2 & Embedded Bootcamp 2025',
    type: 'Intensive Bootcamp',
    startsAt: 'Oct 15, 2025 • 10:00 AM',
    venue: 'TRAIC Innovation Lab, Block 4',
    mode: 'OFFLINE',
    tagline: 'From microcontrollers and C firmware to SLAM and autonomous navigation in 4 hands-on weekend sessions.',
    tracks: ['STM32 Firmware', 'ROS2 Navigation', 'LiDAR Sensor Fusion'],
    registrationOpen: true,
  },
];

const PAST_EVENTS = [
  {
    title: 'PCB Design & SMD Soldering Workshop',
    date: 'April 2024',
    venue: 'Lab 402',
    attendees: '85 participants',
    outcome: 'Every attendee designed and etched a custom USB-C development board.',
  },
  {
    title: 'Autonomous Drone Flight & ArduPilot Session',
    date: 'February 2024',
    venue: 'College Sports Ground',
    attendees: '120 participants',
    outcome: 'Live telemetry tuning, GPS waypoint autonomous mission execution.',
  },
  {
    title: 'TRAIC Internal Hackathon 2023',
    date: 'November 2023',
    venue: 'Maker Space',
    attendees: '14 teams',
    outcome: 'Produced 4 projects that later qualified for the Smart India Hackathon.',
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-bg-0 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent">
            <Calendar className="h-3.5 w-3.5" />
            <span>ACTIVITIES // GATHERINGS</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-text-1">
            Events & Hackathons
          </h1>
          <p className="mt-3 text-base text-text-2 leading-relaxed">
            Hands-on bootcamps, 36-hour hardware hackathons, and industrial masterclasses. Learn from seniors, build under pressure, and ship real systems.
          </p>
        </div>

        {/* Upcoming Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-sm font-mono text-accent font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="h-4 w-4" />
            <span>UPCOMING CALENDAR</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {UPCOMING_EVENTS.map((event) => (
              <div
                key={event.slug}
                className="flex flex-col justify-between rounded-2xl border border-accent/40 bg-surface/80 p-8 relative overflow-hidden shadow-lg transition-all hover:border-accent"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="rounded-md bg-accent/20 px-2.5 py-1 text-xs font-mono font-bold text-accent border border-accent/40">
                      {event.type}
                    </span>
                    <span className="rounded-full bg-success/20 px-3 py-0.5 text-xs font-mono text-success border border-success/30 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      Registration Open
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-text-1 mb-3">
                    {event.title}
                  </h2>
                  <p className="text-sm text-text-2 leading-relaxed mb-6">
                    {event.tagline}
                  </p>

                  <div className="space-y-2.5 text-xs text-text-1 font-mono border-y border-border/80 py-4 mb-6">
                    <div className="flex items-center gap-2 text-accent-2">
                      <Clock className="h-4 w-4 text-accent-2" />
                      <span>{event.startsAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-2">
                      <MapPin className="h-4 w-4 text-text-2" />
                      <span>{event.venue} ({event.mode})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-text-2 uppercase tracking-wider block mb-2">Focus Areas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {event.tracks.map((t) => (
                        <span key={t} className="rounded bg-bg-1 px-2 py-0.5 text-xs font-mono text-text-2 border border-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/join"
                    className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-bg-0 hover:bg-accent-hover transition-colors"
                  >
                    <span>Register for Event</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Archive */}
        <div>
          <h2 className="text-2xl font-bold text-text-1 mb-6">
            Past Events Archive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAST_EVENTS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-surface/50 p-6"
              >
                <div className="flex items-center justify-between text-xs font-mono text-text-2 mb-2">
                  <span className="text-accent-2">{item.date}</span>
                  <span>{item.attendees}</span>
                </div>
                <h3 className="text-lg font-bold text-text-1 mb-2">{item.title}</h3>
                <p className="text-xs text-text-2 leading-relaxed mb-4">{item.outcome}</p>
                <div className="text-[11px] font-mono text-text-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>Successfully Concluded</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
