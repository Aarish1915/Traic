'use client';

import { useState } from 'react';
import { Cpu, Zap } from 'lucide-react';

export function ThreeHeroFallback() {
  const [tilt, setTilt] = useState({ rx: 18, ry: -22 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: 18 - y * 30,
      ry: -22 + x * 35,
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 18, ry: -22 });
  };

  return (
    <div
      className="relative w-full h-full min-h-[260px] flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={() => setIsHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsHovered(false)}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: 'pan-y' }}
      aria-label="TRAIC Silicon Hardware Core Isometric View"
    >
      {/* Ambient Radial Cyber Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="w-44 h-44 rounded-full bg-accent-2/15 blur-2xl" />
      </div>

      {/* Background CAD Circuit Grid */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* 3D Isometric Tilt Container */}
      <div
        className="relative transition-transform duration-150 ease-out flex items-center justify-center"
        style={{
          transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shadow Projection */}
        <div
          className="absolute -bottom-8 w-48 h-48 rounded-2xl bg-black/60 blur-xl pointer-events-none"
          style={{ transform: 'rotateX(90deg) translateZ(-40px)' }}
        />

        {/* Outer Connection Pins Layer */}
        <div className="relative w-52 h-52 flex items-center justify-center">
          {/* Top/Bottom Pins */}
          <div className="absolute -top-3 left-6 right-6 flex justify-between pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <span key={`pt-${i}`} className="w-1.5 h-3.5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-sm shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            ))}
          </div>
          <div className="absolute -bottom-3 left-6 right-6 flex justify-between pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <span key={`pb-${i}`} className="w-1.5 h-3.5 bg-gradient-to-t from-amber-400 to-amber-600 rounded-b-sm shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            ))}
          </div>
          {/* Left/Right Pins */}
          <div className="absolute -left-3 top-6 bottom-6 flex flex-col justify-between pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <span key={`pl-${i}`} className="h-1.5 w-3.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-l-sm shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            ))}
          </div>
          <div className="absolute -right-3 top-6 bottom-6 flex flex-col justify-between pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <span key={`pr-${i}`} className="h-1.5 w-3.5 bg-gradient-to-l from-amber-400 to-amber-600 rounded-r-sm shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            ))}
          </div>

          {/* Main Silicon Chip Die */}
          <div className="relative w-44 h-44 rounded-xl border-2 border-accent-2/60 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3 shadow-2xl flex flex-col items-center justify-between overflow-hidden">
            {/* Corner Status LEDs */}
            <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" />
            <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />

            {/* Glowing Circuit Bus Traces */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg className="w-full h-full" viewBox="0 0 160 160" fill="none">
                <path d="M20 20 L50 50 L110 50 L140 20" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                <path d="M20 140 L50 110 L110 110 L140 140" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
                <path d="M20 80 L60 80 M100 80 L140 80" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="80" cy="80" r="28" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Metallic Heat Spreader Center Plate */}
            <div className="relative z-10 w-28 h-28 mt-2 rounded-lg border border-slate-700 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-inner flex flex-col items-center justify-center p-2 text-center">
              <div className="flex items-center gap-1 text-accent mb-1">
                <Cpu className="h-5 w-5 animate-pulse" />
              </div>
              <p className="font-mono text-[11px] font-black tracking-widest text-text-1">TRAIC-H7</p>
              <p className="font-mono text-[8px] font-semibold text-accent-2 tracking-wider">ARM CORTEX-M7</p>
              <div className="mt-1 flex items-center gap-1 font-mono text-[7px] text-emerald-400">
                <Zap className="h-2 w-2" />
                <span>480 MHz // 5 Mbps CAN</span>
              </div>
            </div>

            {/* Micro Serial Footnote */}
            <span className="font-mono text-[8px] text-text-2 tracking-widest opacity-80 pb-0.5">
              ROBOTICS HARDWARE CORE
            </span>
          </div>
        </div>
      </div>

      {/* Floating Interactive Badge */}
      <div className="absolute bottom-2 right-3 font-mono text-[9px] text-accent-2/80 bg-surface/90 border border-border/60 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
        {isHovered ? 'TILTING ACTIVE' : 'TOUCH / DRAG TO TILT'}
      </div>
    </div>
  );
}
