'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, CheckCircle2, Trophy, Users, Layers, Clock, AlertCircle } from 'lucide-react';
import { SpotlightCard } from '@/components/SpotlightCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

interface EventData {
  id?: string;
  slug: string;
  title: string;
  tagline?: string;
  descriptionMd: string;
  type: string;
  mode: string;
  venue: string;
  startsAt: string;
  endsAt?: string | null;
  prizePool?: string | null;
  teamSize?: string | null;
  capacity?: number | null;
  tracks?: string[];
  schedule?: ScheduleItem[];
  customDetails?: Record<string, string>;
}

const FALLBACK_EVENTS: Record<string, EventData> = {
  'amr-navigation-workshop-2026': {
    slug: 'amr-navigation-workshop-2026',
    title: 'Autonomous Mobile Robot Navigation with ROS2 & 3D LiDAR',
    tagline: 'A 2-day intensive sprint: Flash STM32 microcontrollers, wire differential drive motors, and map Block C with 3D point-cloud SLAM.',
    descriptionMd: `This is a hands-on hardware laboratory session. You will not sit and watch a PowerPoint presentation. Each registered team receives a custom differential-drive mobile chassis kit equipped with an STM32 microcontroller and a RPLiDAR A2M12 sensor.\n\nOn Day 1, you will write bare-metal PWM timer routines in C to drive dual H-bridge motor controllers, configure wheel encoder quadrature interrupts, and establish serial telemetry to a host Linux computer.\n\nOn Day 2, you will spin up ROS2 Humble nodes, configure the Nav2 costmap pipeline, and map the corridors of Block C with real-time RTAB-Map 3D LiDAR SLAM.`,
    type: 'WORKSHOP',
    mode: 'OFFLINE',
    venue: 'DIA Labs, Block C-302, COER University',
    startsAt: '2026-10-24T10:00:00Z',
    endsAt: '2026-10-25T17:00:00Z',
    prizePool: '₹25,000 in dev boards & sensors',
    teamSize: '1–3 Builders',
    capacity: 30,
    tracks: ['ROS2 Navigation', 'LiDAR SLAM', 'STM32 Hardware HAL'],
    schedule: [
      { time: 'Day 1 · 10:00 AM', title: 'STM32 Motor Driver Calibration', description: 'Differential drive PWM timer setup and encoder quadrature interrupt wiring' },
      { time: 'Day 1 · 02:00 PM', title: 'RPLiDAR A2M12 Serial Ingestion', description: 'Interfacing sensor nodes and validating laser scan topics' },
      { time: 'Day 2 · 11:00 AM', title: 'Nav2 Costmap & Waypoint Navigation', description: 'Autonomous obstacle avoidance and path planning through Block C' },
    ],
  },
  'pcb-fabrication-bootcamp-2026': {
    slug: 'pcb-fabrication-bootcamp-2026',
    title: '4-Layer High-Speed PCB Layout & SMD Reflow Bootcamp',
    tagline: 'From blank KiCad 8 schematic to functional circuit board. Hand-solder 0402 passives and reflow QFN packages on hot plates.',
    descriptionMd: `Learn high-speed digital and RF PCB design using KiCad 8. We cover controlled impedance routing (50Ω single-ended, 90Ω USB differential pairs), ground planes, decoupling capacitor placement, and thermal relief calculation.\n\nEvery student gets hands-on time in the DIA Labs Soldering Bay with stencil solder paste application, microscope inspection, and hot-plate reflow soldering.`,
    type: 'BOOTCAMP',
    mode: 'OFFLINE',
    venue: 'DIA Labs Soldering Bay, Block C-302',
    startsAt: '2026-11-07T09:30:00Z',
    endsAt: '2026-11-08T18:00:00Z',
    prizePool: 'Free custom 4-layer PCB fabrication for top 5 designs',
    teamSize: 'Solo or Pairs',
    capacity: 25,
    tracks: ['High-Speed Layout', 'SMD Reflow', 'Impedance Control'],
  },
  'traic-hardware-hackathon-2026': {
    slug: 'traic-hardware-hackathon-2026',
    title: 'TRAIC InnoHacks 2026 — 36-Hour Autonomous Hardware Hackathon',
    tagline: 'Annual flagship engineering challenge: Build working physical prototypes solving real industrial automation and agriculture problems.',
    descriptionMd: `TRAIC InnoHacks 2026 is our flagship 36-hour physical prototype sprint. We open the entire inventory of DIA Labs—including STM32 microcontrollers, ESP32-S3 boards, Raspberry Pi CM4 modules, motor drivers, LiDAR sensors, and 3D printing farms.\n\nTeams work around the clock with industry mentors from top robotics and semiconductor firms. Top functional hardware projects win cash prizes and lab incubator grants.`,
    type: 'HACKATHON',
    mode: 'OFFLINE',
    venue: 'COER University Auditorium & DIA Labs',
    startsAt: '2026-11-20T10:00:00Z',
    endsAt: '2026-11-22T16:00:00Z',
    prizePool: '₹1,50,000 Cash Prize + Lab Sponsorship',
    teamSize: '2–4 Engineers',
    capacity: 150,
    tracks: ['Industrial Automation', 'AgriTech Robotics', 'Autonomous Drones', 'Edge AI Vision'],
    schedule: [
      { time: 'Nov 20 · 10:00 AM', title: 'Hardware Store Opens & Sprint Start', description: 'Component allocation and workbench unboxing' },
      { time: 'Nov 21 · 02:00 PM', title: 'Midway Prototype Gate Review', description: 'Smoke tests, system architecture review, and live telemetry check' },
      { time: 'Nov 22 · 02:00 PM', title: 'Final Arena Pitches & Awards', description: 'Live physical obstacle course and mentor jury scoring' },
    ],
  },
  'freertos-kernel-architecture-session': {
    slug: 'freertos-kernel-architecture-session',
    title: 'FreeRTOS Kernel Primitives & Deterministic Embedded C',
    tagline: 'Deep dive into preemptive task scheduling, semaphores, mutexes, message queues, and memory pools on STM32H7.',
    descriptionMd: `A masterclass on building deterministic embedded systems that never miss a deadline. We dissect the FreeRTOS context-switching assembly routine, priority inversion, priority inheritance mutexes, and zero-copy ring buffers.\n\nParticipants write hard real-time tasks and inspect execution traces using Percepio Tracealyzer on Cortex-M7 hardware.`,
    type: 'SEMINAR',
    mode: 'HYBRID',
    venue: 'Block C Seminar Hall & Live Stream',
    startsAt: '2026-12-05T14:00:00Z',
    endsAt: '2026-12-05T17:00:00Z',
    prizePool: 'STM32H7 Core Boards to top quiz performers',
    teamSize: 'Individual',
    capacity: 100,
    tracks: ['Preemptive Scheduling', 'Memory Allocation', 'Concurrency'],
  },
};

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNo: '',
    teamName: '',
    honeypot: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function loadEvent() {
      try {
        const res = await fetch(`${API_BASE}/public/events/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && isMounted) {
            setEvent(json.data);
            if (json.data.tracks && json.data.tracks.length > 0) {
              setSelectedTrack(json.data.tracks[0]);
            }
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall back to local dictionary
      }

      if (isMounted) {
        if (FALLBACK_EVENTS[slug]) {
          setEvent(FALLBACK_EVENTS[slug]);
          if (FALLBACK_EVENTS[slug].tracks && FALLBACK_EVENTS[slug].tracks.length > 0) {
            setSelectedTrack(FALLBACK_EVENTS[slug].tracks[0]);
          }
        } else {
          setNotFound(true);
        }
        setLoading(false);
      }
    }

    loadEvent();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Silent discard bot

    const code = `EVT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReceiptCode(code);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas text-ink-primary pt-36 pb-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-ink-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-[13px] font-mono text-ink-secondary">Loading event specification...</p>
        </div>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-canvas text-ink-primary pt-36 pb-24 px-4">
        <div className="max-w-apple mx-auto text-center py-20">
          <AlertCircle className="w-12 h-12 text-ink-tertiary mx-auto mb-4 opacity-80" />
          <h1 className="text-[28px] font-display font-bold text-ink-primary">Event Not Found</h1>
          <p className="mt-2 text-[14px] text-ink-secondary max-w-md mx-auto">
            The event specified by <code className="font-mono text-ink-primary">/{slug}</code> does not exist or may have been unlisted.
          </p>
          <div className="mt-8">
            <Link
              href="/events"
              className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-pill bg-ink-primary text-canvas hover:opacity-90 text-[14px] font-semibold transition-all active:scale-95 shadow-md"
            >
              Browse All Events →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4 selection:bg-neutral-700 selection:text-white" data-event-slug={slug}>
      <div className="w-full max-w-apple mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-secondary hover:text-ink-primary min-h-[44px] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Events</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-ink-primary text-[11px] font-mono font-bold uppercase tracking-wider">
              {event.type}
            </span>
            <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-ink-secondary text-[11px] font-mono uppercase">
              {event.mode}
            </span>
            {event.prizePool && (
              <span className="px-3 py-1 rounded-pill bg-apple-blue/10 text-apple-blue border border-apple-blue/20 text-[11px] font-mono font-bold flex items-center gap-1.5">
                <Trophy className="h-3 w-3" />
                <span>{event.prizePool}</span>
              </span>
            )}
            {event.teamSize && (
              <span className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-ink-secondary text-[11px] font-mono flex items-center gap-1.5">
                <Users className="h-3 w-3" />
                <span>{event.teamSize}</span>
              </span>
            )}
          </div>

          <h1 className="text-[36px] sm:text-[48px] font-display font-extrabold tracking-[-0.035em] text-ink-primary leading-tight">
            {event.title}
          </h1>

          {event.tagline && (
            <p className="mt-4 text-[16.5px] text-ink-secondary max-w-3xl leading-relaxed">
              {event.tagline}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-6 text-[13.5px] font-mono text-ink-secondary">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-ink-tertiary" />
              {new Date(event.startsAt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              {event.endsAt ? ` – ${new Date(event.endsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-ink-tertiary" />
              {event.venue}
            </span>
            {event.capacity && (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-tertiary" />
                Capacity: {event.capacity} seats
              </span>
            )}
          </div>

          {/* Tracks Pill Bar */}
          {event.tracks && event.tracks.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-ink-tertiary mr-1 flex items-center gap-1 font-bold">
                <Layers className="h-3.5 w-3.5" /> Tracks:
              </span>
              {event.tracks.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-pill bg-canvas-surface border border-subtle text-ink-primary text-[12px] font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Description, Tracks & Schedule */}
          <div className="lg:col-span-7 space-y-8">
            <SpotlightCard className="p-8 rounded-3xl">
              <h2 className="text-[20px] font-display font-bold text-ink-primary mb-4 tracking-tight">
                Syllabus &amp; Overview
              </h2>
              <div className="space-y-4 text-[15px] text-ink-secondary leading-relaxed whitespace-pre-line">
                {event.descriptionMd}
              </div>
            </SpotlightCard>

            {/* Phased Timeline Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <SpotlightCard className="p-8 rounded-3xl">
                <h3 className="text-[18px] font-display font-bold text-ink-primary mb-5 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-ink-primary" />
                  <span>Timeline &amp; Schedule Milestones</span>
                </h3>
                <div className="space-y-4 border-l-2 border-subtle pl-4 ml-1">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-ink-primary border-2 border-canvas" />
                      <div className="text-[11px] font-mono text-ink-tertiary font-bold uppercase">{item.time}</div>
                      <div className="text-[14px] font-bold text-ink-primary mt-0.5">{item.title}</div>
                      {item.description && (
                        <div className="text-[13px] text-ink-secondary mt-1">{item.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            )}

            <SpotlightCard className="p-8 rounded-3xl">
              <h3 className="text-[18px] font-display font-bold text-ink-primary mb-4">
                Laboratory Safety &amp; Requirements
              </h3>
              <ul className="space-y-3 list-none p-0 m-0 text-[14px] text-ink-secondary">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-ink-primary shrink-0 mt-0.5" />
                  <span>Bring personal laptop with required toolchains installed prior to arrival.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-ink-primary shrink-0 mt-0.5" />
                  <span>All specialized test equipment, oscilloscopes, and logic analyzers are provided on lab benches.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-ink-primary shrink-0 mt-0.5" />
                  <span>Participants must hold active university ID for physical security clearance at DIA Labs.</span>
                </li>
              </ul>
            </SpotlightCard>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-5">
            <SpotlightCard className="p-8 rounded-3xl sticky top-28">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-white/[0.08] border border-white/15 text-ink-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 className="h-6 w-6 text-ink-primary" />
                  </div>
                  <h3 className="text-[20px] font-display font-bold text-ink-primary">
                    Registration Confirmed
                  </h3>
                  <p className="mt-2 text-[14px] text-ink-secondary">
                    Your seat is reserved for this session. Show your confirmation at {event.venue}.
                  </p>
                  <div className="mt-6 p-4 rounded-xl bg-canvas border border-subtle font-mono text-[14px] font-bold text-ink-primary">
                    Receipt Code: {receiptCode}
                  </div>
                  {selectedTrack && (
                    <div className="mt-2 text-[12px] font-mono text-ink-tertiary">
                      Registered Track: {selectedTrack}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-[20px] font-display font-bold text-ink-primary">
                      Reserve Participation Seat
                    </h3>
                    <p className="text-[12.5px] text-ink-secondary mt-1">
                      {event.capacity ? `Capped strictly to ${event.capacity} participants.` : 'Free admission for university students.'}
                    </p>
                  </div>

                  {/* Honeypot Bot Trap */}
                  <input
                    type="text"
                    id="_traic_hp_trap"
                    name="_traic_hp_trap"
                    aria-label="Bot trap - leave empty"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <div>
                    <label htmlFor="fullName" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1 font-bold">
                      Lead Participant Name *
                    </label>
                    <input
                      id="fullName"
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Aarish Ali"
                      className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[13.5px] text-ink-primary focus:border-ink-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="rollNo" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1 font-bold">
                      University Roll Number *
                    </label>
                    <input
                      id="rollNo"
                      required
                      type="text"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      placeholder="e.g. 210120101"
                      className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[13.5px] text-ink-primary focus:border-ink-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1 font-bold">
                      Institutional Email *
                    </label>
                    <input
                      id="email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@coer.ac.in"
                      className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[13.5px] text-ink-primary focus:border-ink-primary focus:outline-none"
                    />
                  </div>

                  {event.tracks && event.tracks.length > 0 && (
                    <div>
                      <label htmlFor="selectedTrack" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1 font-bold">
                        Focus Track *
                      </label>
                      <select
                        id="selectedTrack"
                        value={selectedTrack}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                        className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[13.5px] text-ink-primary focus:border-ink-primary focus:outline-none"
                      >
                        {event.tracks.map((t) => (
                          <option key={t} value={t} className="bg-canvas-surface text-ink-primary">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="teamName" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1 font-bold">
                      Team Name (Optional)
                    </label>
                    <input
                      id="teamName"
                      type="text"
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      placeholder="e.g. Team RoverX"
                      className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[13.5px] text-ink-primary focus:border-ink-primary focus:outline-none"
                    />
                  </div>

                  {/* DPDP Consent */}
                  <div className="pt-2">
                    <label htmlFor="dpdpConsent" className="flex items-start gap-3 cursor-pointer text-[12px] text-ink-secondary leading-snug">
                      <input
                        type="checkbox"
                        id="dpdpConsent"
                        aria-label="DPDP statutory consent checkbox"
                        required
                        checked={dpdpConsent}
                        onChange={(e) => setDpdpConsent(e.target.checked)}
                        className="mt-0.5 rounded border-subtle bg-canvas text-ink-primary focus:ring-ink-primary h-4 w-4"
                      />
                      <span>
                        I consent to TRAIC processing my contact details for lab event coordination in compliance with the Indian DPDP Act 2023. Data is never shared with third parties.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!dpdpConsent}
                    className="w-full mt-4 min-h-[48px] rounded-pill bg-ink-primary text-canvas hover:opacity-90 disabled:opacity-50 font-semibold text-[14.5px] transition-all active:scale-95 shadow-md cursor-pointer"
                  >
                    Confirm Registration →
                  </button>
                </form>
              )}
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}
