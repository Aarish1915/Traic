'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface GalleryItem {
  id?: string;
  title: string;
  caption?: string;
  imageUrl: string;
  category: 'ROBOTICS' | 'FABRICATION' | 'COMPETITION' | 'WORKSHOP' | 'LAB_LIFE';
  date?: string;
  location?: string;
  featured?: boolean;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    title: 'Smart India Hackathon Hardware Grand Finale',
    caption: 'Our team testing ultrasonic crack detection transducers on live steel pipeline sections at 3 AM.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    category: 'COMPETITION',
    date: 'Dec 2024',
    location: 'SIH Nodal Center',
    featured: true,
  },
  {
    title: 'Precision SMD Hot Air Rework under Trinocular Microscope',
    caption: 'Soldering 0.4mm pitch QFN neural accelerator chip with Hakko FR-810B turbine air station.',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    category: 'FABRICATION',
    date: 'Nov 2024',
    location: 'DIA Labs Bay 2',
    featured: false,
  },
  {
    title: 'Autonomous Mobile Robot Outdoor Odometry Tuning',
    caption: 'Calibrating RTAB-Map LiDAR point clouds and wheel encoders on rough university campus terrain.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    category: 'ROBOTICS',
    date: 'Oct 2024',
    location: 'COER University Quadrangle',
    featured: true,
  },
  {
    title: 'DIA Labs Additive Prototyping Farm',
    caption: 'Bambu Lab X1-Carbon extruding carbon-fiber reinforced motor brackets for Robocon chassis.',
    imageUrl: 'https://images.unsplash.com/photo-1631557559471-ae60769556ff?auto=format&fit=crop&w=800&q=80',
    category: 'FABRICATION',
    date: 'Sep 2024',
    location: 'DIA Labs Bay 3',
    featured: false,
  },
  {
    title: 'Late Night Kernel Debugging & Oscilloscope Probing',
    caption: 'Isolating high-frequency noise spikes on the CAN-FD differential bus using a 1GHz Tektronix scope.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    category: 'LAB_LIFE',
    date: 'Aug 2024',
    location: 'DIA Labs Block C-302',
    featured: false,
  },
  {
    title: 'Embedded Systems & ROS2 Induction Bootcamp',
    caption: 'Thirty undergraduate recruits wiring STM32 breadboard breakout headers during the fall workshop.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    category: 'WORKSHOP',
    date: 'Sep 2024',
    location: 'DIA Labs Bay 1',
    featured: false,
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);

  const categories = ['ALL', 'ROBOTICS', 'FABRICATION', 'COMPETITION', 'WORKSHOP', 'LAB_LIFE'];

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/public/gallery`)
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setGalleryItems(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = selectedCategory === 'ALL'
    ? galleryItems
    : galleryItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            VISUAL ARCHIVE
          </span>
          <h1 className="text-[36px] sm:text-[52px] font-display font-bold tracking-tight text-ink-primary mt-2 leading-[1.08]">
            The lab, the benches, the arena.
          </h1>
          <p className="mt-4 text-[16px] text-ink-secondary leading-relaxed">
            Real engineering captured in the wild. From high-voltage motor tests to national championship stages.
          </p>
        </div>

        {/* Category Pills (44px touch targets) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[44px] px-5 rounded-pill text-[13px] font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0071E3] text-white font-semibold shadow-sm'
                  : 'bg-canvas-surface hover:bg-canvas-elevated text-ink-secondary hover:text-ink-primary border border-subtle'
              }`}
            >
              {cat === 'ALL' ? 'All Archive' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Masonry / Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.title + idx}
              className={`rounded-3xl bg-canvas-surface border border-subtle overflow-hidden flex flex-col justify-between hover:border-apple-blue/40 transition-colors group ${
                item.featured ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-pill bg-canvas/90 backdrop-blur-md border border-subtle text-[10.5px] font-mono font-bold text-apple-blue uppercase">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-[18px] font-display font-bold text-ink-primary leading-snug">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="mt-2 text-[13.5px] text-ink-secondary leading-relaxed">
                    {item.caption}
                  </p>
                )}

                <div className="mt-6 pt-4 border-t border-subtle flex items-center justify-between text-[11.5px] font-mono text-ink-tertiary">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-apple-blue" />
                    <span>{item.location || 'DIA Labs'}</span>
                  </span>
                  <span>{item.date || '2024'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
