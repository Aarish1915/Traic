'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Cpu, Zap, Activity, Box, Sparkles } from 'lucide-react';

// Dynamically import ThreeHeroScene only on user demand
const ThreeHeroScene = dynamic(
  () => import('./ThreeHeroScene').then((mod) => mod.ThreeHeroScene),
  { ssr: false }
);

export function HeroHardwareViewport() {
  const [mode, setMode] = useState<'image' | '3d'>('image');

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[490px] rounded-2xl border border-border/80 bg-gradient-to-b from-surface/90 via-bg-1/95 to-bg-0 shadow-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between">
      {/* Top Viewport Stage Header with Mode Switcher */}
      <div className="relative z-20 flex items-center justify-between border-b border-border/60 bg-bg-1/90 px-3 sm:px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs font-bold text-text-1 truncate">
            TRAIC H7-CORE // HARDWARE STAGE
          </span>
        </div>

        {/* 2D Lite vs 3D Interactive Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-bg-0/80 p-0.5 text-[10px] font-mono">
          <button
            onClick={() => setMode('image')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-semibold ${
              mode === 'image'
                ? 'bg-accent text-bg-0 shadow-sm'
                : 'text-text-2 hover:text-text-1'
            }`}
            title="Fast, ultra-lightweight image mode (recommended for all devices)"
          >
            <Zap className="h-3 w-3" />
            <span>2D LITE</span>
          </button>
          <button
            onClick={() => setMode('3d')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-semibold ${
              mode === '3d'
                ? 'bg-accent-2 text-bg-0 shadow-sm'
                : 'text-text-2 hover:text-text-1'
            }`}
            title="Interactive 3D WebGL mode (for high-end devices)"
          >
            <Box className="h-3 w-3" />
            <span>3D VIEW</span>
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {mode === 'image' ? (
          // Lightweight High-Resolution 3D Render Image Mode
          <div className="relative w-full h-full flex items-center justify-center p-3 select-none">
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-accent/15 blur-3xl" />
              <div className="w-48 h-48 rounded-full bg-accent-2/15 blur-2xl" />
            </div>

            {/* Background CAD Circuit Grid Pattern */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* High-Res 3D Hardware Core Image */}
            <div className="relative z-10 w-full h-full max-h-[360px] rounded-xl overflow-hidden border border-border/60 shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-hardware-core.jpg"
                alt="TRAIC H7 Advanced Robotics Hardware Computing Core"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />

              {/* Holographic HUD Overlays */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded bg-bg-0/80 border border-accent/40 px-2 py-0.5 text-[10px] font-mono text-accent backdrop-blur-md">
                  <Activity className="h-3 w-3 animate-pulse" />
                  <span>CORE ACTIVE // 480 MHz</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded bg-bg-0/80 border border-border/60 px-2 py-0.5 text-[9px] font-mono text-text-2 backdrop-blur-md">
                  <span>CAN-FD BUS @ 5 Mbps</span>
                </span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 pointer-events-none">
                <span className="rounded bg-bg-0/85 border border-accent-2/40 px-2.5 py-1 text-[9px] font-mono text-accent-2 backdrop-blur-md shadow-lg flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-accent" />
                  <span>ARM CORTEX-M7 ROBOTICS NODE</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          // Interactive 3D WebGL Viewport
          <div className="relative w-full h-full min-h-[280px] cursor-grab active:cursor-grabbing">
            <ThreeHeroScene />
          </div>
        )}
      </div>

      {/* Bottom Stage Instructions & Telemetry Bar */}
      <div className="relative z-20 flex items-center justify-between border-t border-border/60 bg-bg-1/90 px-3 sm:px-4 py-2 backdrop-blur-sm text-[10px] sm:text-[11px] font-mono text-text-2">
        <span className="flex items-center gap-1.5 truncate">
          <span className="text-accent">●</span>
          {mode === 'image'
            ? 'Ultra-lightweight high-res hardware core render (0% GPU)'
            : 'Interactive WebGL 3D active • Drag horizontally to rotate'}
        </span>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <Cpu className="h-3.5 w-3.5 text-accent" />
          <span className="text-text-1 font-semibold">STM32H753</span>
        </div>
      </div>
    </div>
  );
}
