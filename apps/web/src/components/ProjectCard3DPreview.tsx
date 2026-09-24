'use client';

import { Box } from 'lucide-react';

interface ProjectCard3DPreviewProps {
  category: string;
  slug?: string;
  title?: string;
}

export function ProjectCard3DPreview({ category, slug, title }: ProjectCard3DPreviewProps) {
  // Determine appropriate high-resolution 3D CAD render image based on category / slug
  let imageSrc = '/images/projects/project-pcb-cad.jpg';
  let badgeLabel = '4-LAYER CAD SCHEMATIC';
  let telemetryTag = 'STM32H7 // MCU';

  if (category === 'HYBRID' || slug?.includes('rover') || slug?.includes('ugv')) {
    imageSrc = '/images/projects/project-rover-cad.jpg';
    badgeLabel = 'AUTONOMOUS 3D CAD';
    telemetryTag = 'LiDAR SLAM // 360°';
  } else if (category === 'SOFTWARE' || slug?.includes('telemetry') || slug?.includes('ground')) {
    imageSrc = '/images/projects/project-telemetry-cad.jpg';
    badgeLabel = 'RF TELEMETRY DISH';
    telemetryTag = 'GIMBAL // DUAL-AXIS';
  }

  return (
    <div className="relative w-full h-[155px] sm:h-[165px] rounded-lg border border-border/80 bg-bg-1 overflow-hidden mb-4 select-none shadow-md group">
      {/* Background CAD Blueprint Ambient Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center z-10">
        <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* High-Resolution CAD 3D Render Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={title || `${category} 3D CAD Engineering Model`}
        className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Subtle Dark Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-0/90 via-transparent to-bg-0/40 pointer-events-none z-10" />

      {/* Top Left: Category Telemetry Tag */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 pointer-events-none">
        <span className="rounded bg-bg-0/85 border border-border/80 px-2 py-0.5 text-[9px] font-mono text-text-2 backdrop-blur-md shadow-sm">
          {telemetryTag}
        </span>
      </div>

      {/* Top Right: 3D CAD Badge */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 rounded bg-bg-0/85 border border-accent-2/50 px-2 py-0.5 text-[10px] font-mono text-accent-2 pointer-events-none backdrop-blur-md shadow-sm">
        <Box className="h-3 w-3 text-accent" />
        <span>{badgeLabel}</span>
      </div>

      {/* Bottom Overlay: Technical Info & Inspection Hint */}
      <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between text-[9px] font-mono text-text-2 pointer-events-none">
        <span className="flex items-center gap-1 text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>REAL CAD MODEL</span>
        </span>
        <span className="opacity-80">Click &quot;Inspect 3D&quot; below</span>
      </div>
    </div>
  );
}
