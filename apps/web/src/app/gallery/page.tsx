'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, MapPin, Calendar, X, ArrowRight, Filter, ExternalLink, Layers } from 'lucide-react';
import type { GalleryCategory } from '@traic/shared';

interface GalleryItem {
  id?: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: GalleryCategory;
  date: string;
  location?: string;
  featured?: boolean;
  projectSlug?: string;
}

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    title: 'Smart India Hackathon Grand Finale Winners',
    caption: 'TRAIC Autonomous Pipeline Crawler team receiving the 1st prize trophy at the national grand finale after 36 hours of continuous live judging.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    category: 'COMPETITION',
    date: 'Dec 2024',
    location: 'National Grand Finale Stage',
    featured: true,
    projectSlug: 'autonomous-ugv-rover',
  },
  {
    title: 'High-Speed CNC Aluminum Chassis Milling',
    caption: 'Machining custom 6061-T6 aluminum differential wheel hubs and motor mounts for the UGV-X terrain rover.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    category: 'FABRICATION',
    date: 'Oct 2024',
    location: 'TRAIC Workshop CNC Bay',
    featured: true,
  },
  {
    title: 'SMD Micro-Soldering & Thermal Profiling',
    caption: 'Probing 0.4mm pitch QFN pins and power sequencing rails on the Edge Neural Accelerator 4-layer prototype board.',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80',
    category: 'LAB_LIFE',
    date: 'Aug 2024',
    location: 'Electronics Probing Station 03',
    featured: true,
    projectSlug: 'edge-neural-pcb',
  },
  {
    title: 'Outdoor Autonomous Rover Field Trials',
    caption: 'Field testing RTAB-Map 3D LiDAR SLAM in GPS-denied rough outdoor terrain with live WebSockets telemetry uplink.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    category: 'ROBOTICS',
    date: 'Sep 2024',
    location: 'Campus Botanical Dirt Track',
    featured: true,
    projectSlug: 'autonomous-ugv-rover',
  },
  {
    title: 'DD Robocon Arena Match Simulation',
    caption: 'Holonomic Mecanum platform executing high-speed trajectory sequences and pneumatic ball ejector firing under 5mm repeatability.',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    category: 'COMPETITION',
    date: 'Jun 2024',
    location: 'National Robocon Arena, Pune',
    featured: true,
    projectSlug: 'robocon-holonomic-base',
  },
  {
    title: 'Freshman Hands-On STM32 Bootcamp',
    caption: 'Seniors mentoring 1st and 2nd year students on bare-metal register configuration, GPIO interrupts, and oscilloscope signal debugging.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    category: 'WORKSHOP',
    date: 'Feb 2024',
    location: 'Innovation Lab 402',
    featured: false,
  },
];

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'ALL DISPATCHES', value: 'ALL' },
  { label: 'ROBOTICS & TRIALS', value: 'ROBOTICS' },
  { label: 'PCB & FABRICATION', value: 'FABRICATION' },
  { label: 'COMPETITIONS & WINS', value: 'COMPETITION' },
  { label: 'WORKSHOPS & SESSIONS', value: 'WORKSHOP' },
  { label: 'LAB INFRASTRUCTURE', value: 'LAB_LIFE' },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/public/gallery`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-bg-0 py-16">
      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-bg-1">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black transition-colors"
                aria-label="Close photo"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="rounded-md bg-accent/15 px-2.5 py-1 text-xs font-mono font-bold text-accent border border-accent/30">
                  {activePhoto.category}
                </span>
                <div className="flex items-center gap-4 text-xs font-mono text-text-2">
                  {activePhoto.date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-accent-2" />
                      {activePhoto.date}
                    </span>
                  )}
                  {activePhoto.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {activePhoto.location}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-black text-text-1 mb-2">
                {activePhoto.title}
              </h2>
              <p className="text-sm text-text-2 leading-relaxed mb-4">
                {activePhoto.caption}
              </p>
              {activePhoto.projectSlug && (
                <Link
                  href={`/projects/${activePhoto.projectSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-2 hover:underline"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Inspect Related Project System</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent">
            <Camera className="h-3.5 w-3.5" />
            <span>DISPATCHES // FIELD PHOTOGRAPHY</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-text-1">
            Engineering Gallery & Field Logs
          </h1>
          <p className="mt-3 text-base text-text-2 leading-relaxed">
            Real photography from the TRAIC workshop, CNC bays, national competition arenas, and autonomous outdoor trials.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border pb-4">
            <span className="mr-2 flex items-center gap-1.5 text-xs font-mono text-text-2">
              <Filter className="h-3.5 w-3.5" />
              <span>FILTER:</span>
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-accent text-bg-0 font-bold shadow-sm'
                    : 'border border-border bg-surface text-text-2 hover:border-accent/40 hover:text-text-1'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setActivePhoto(item)}
              className="group cursor-pointer rounded-2xl border border-border bg-surface/70 overflow-hidden shadow-sm transition-all hover:border-accent-2/50 hover:bg-surface hover:-translate-y-1"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-bg-1">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-md bg-bg-0/80 px-2.5 py-1 text-[11px] font-mono font-bold text-accent-2 backdrop-blur-md border border-border/60">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between text-xs font-mono text-text-2 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent" />
                    {item.date}
                  </span>
                  {item.location && (
                    <span className="truncate max-w-[150px]">{item.location}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-text-1 group-hover:text-accent-2 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-text-2 leading-relaxed line-clamp-2">
                  {item.caption}
                </p>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-accent">
                  <span>View Full Photo & Logs</span>
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
