'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    level: 'FOUNDATION',
    title: 'Robotics & Hardware Systems',
    summary: 'Master schematic capture, multi-layer PCB layout, motor dynamics, and industrial communication protocols (CAN, UART, SPI, I2C).',
    tools: ['KiCad', 'Altium', 'FreeCAD', 'Oscilloscopes', 'Soldering Stations', 'CAN Analyzers'],
    outcomes: [
      'Design, route, and order 2-to-4 layer custom PCBs',
      'Size BLDC and stepper motors with appropriate MOSFET bridges',
      'Integrate power regulation, isolation, and reverse polarity protections',
    ],
  },
  {
    level: 'INTERMEDIATE',
    title: 'Embedded Firmware & RTOS',
    summary: 'Write production-grade bare-metal and FreeRTOS firmware in modern C/C++ and Rust for ARM Cortex-M and ESP32 targets.',
    tools: ['STM32CubeIDE', 'FreeRTOS', 'ESP-IDF', 'Rust Embedded', 'Logic Analyzers'],
    outcomes: [
      'Write deterministic multi-threaded tasks on FreeRTOS without priority inversions',
      'Implement DMA-driven serial communications without CPU stalls',
      'Deploy encrypted Over-The-Air (OTA) firmware bootloaders',
    ],
  },
  {
    level: 'ADVANCED',
    title: 'ROS2 & Autonomous Navigation',
    summary: 'Develop full autonomous mobile robot pipelines: sensor fusion, 2D/3D SLAM, obstacle avoidance, and edge neural inference.',
    tools: ['ROS2 Humble', 'Nav2', 'Gazebo', 'RTAB-Map', 'NVIDIA Jetson', 'PyTorch'],
    outcomes: [
      'Configure full Nav2 autonomous waypoint navigation on custom chassis',
      'Fuse IMU, wheel odometry, and LiDAR via Extended Kalman Filter (robot_localization)',
      'Quantize and deploy INT8 computer vision models to edge NPUs and TensorRT',
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
          setTracks(
            res.data.map((t: any) => ({
              id: t.id,
              level: t.level || 'CORE',
              title: t.title || 'Engineering Track',
              summary: t.summary || '',
              tools: Array.isArray(t.tools) ? t.tools : [],
              outcomes: Array.isArray(t.outcomes) ? t.outcomes : [],
            }))
          );
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic tracks, falling back to default curriculum:', err);
      });
  }, []);
  return (
    <div className="min-h-screen bg-bg-0 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent">
            <BookOpen className="h-3.5 w-3.5" />
            <span>CURRICULUM // WHAT WE TEACH</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-text-1">
            Engineering Tracks
          </h1>
          <p className="mt-3 text-base text-text-2 leading-relaxed">
            We don&apos;t just assemble hobbyist Arduino kits. Our curriculum takes students from core circuit fundamentals to shipping autonomous robotic systems.
          </p>
        </div>

        {/* Tracks */}
        <div className="space-y-8">
          {tracks.map((track) => (
            <div
              key={track.title}
              className="rounded-2xl border border-border bg-surface/70 p-8 shadow-sm transition-all hover:border-accent-2/40"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4 mb-6">
                <div>
                  <span className="rounded bg-accent/15 px-2.5 py-1 text-xs font-mono font-bold text-accent border border-accent/30">
                    {track.level} TRACK
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-text-1 mt-2">
                    {track.title}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-text-2 leading-relaxed max-w-4xl mb-6">
                {track.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tools */}
                <div>
                  <h3 className="text-xs font-mono text-accent-2 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Tools & Instruments Mastered</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {track.tools.map((t) => (
                      <span key={t} className="rounded bg-bg-1 px-2.5 py-1 text-xs font-mono text-text-1 border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div>
                  <h3 className="text-xs font-mono text-success uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Demonstrated Outcomes</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-text-2">
                    {track.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2">
                        <span className="text-success mt-0.5">•</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 rounded-2xl border border-accent/30 bg-surface/50 p-8 text-center">
          <h3 className="text-2xl font-bold text-text-1">Want to learn with our mentors?</h3>
          <p className="mt-2 text-sm text-text-2">Applications for the next cohort are currently open.</p>
          <div className="mt-6">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-bg-0 hover:bg-accent-hover transition-colors"
            >
              <span>Apply for Cohort 2025</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
