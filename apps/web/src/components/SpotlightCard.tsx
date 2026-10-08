'use client';

import React, { useRef, useState, useCallback } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(41, 151, 255, 0.15)',
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden bg-canvas-surface/90 backdrop-blur-xl border border-subtle transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 ${className}`}
      style={{
        boxShadow: isHovered
          ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.65)'
          : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.10), 0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      }}
      {...props}
    >
      {/* Dynamic Apple Vision Pro Specular Illumination */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(480px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />
      {/* Content Container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
