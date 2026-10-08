import React from 'react';

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  withText?: boolean;
}

export function TraicLogo({ size = 26, className = '', withText = false, ...props }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Silicon Hex-Delta Insignia (Stark Monochrome) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform active:scale-95"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {/* Outer Isometric Die Frame */}
        <rect
          x="2.5"
          y="2.5"
          width="27"
          height="27"
          rx="6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          className="opacity-40"
        />

        {/* 4 Corner Silicon Contact Vias */}
        <circle cx="6.5" cy="6.5" r="1.1" fill="currentColor" className="opacity-80" />
        <circle cx="25.5" cy="6.5" r="1.1" fill="currentColor" className="opacity-80" />
        <circle cx="6.5" cy="25.5" r="1.1" fill="currentColor" className="opacity-80" />
        <circle cx="25.5" cy="25.5" r="1.1" fill="currentColor" className="opacity-80" />

        {/* Architectural 'T' & Intersecting Trace */}
        <path
          d="M8.5 10.5H23.5M16 10.5V23M11.5 23H20.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Neural Center Core Via */}
        <circle cx="16" cy="16.5" r="1.5" fill="currentColor" />
      </svg>

      {withText && (
        <span className="font-display font-bold text-[15px] tracking-tight text-ink-primary">
          TRAIC
        </span>
      )}
    </div>
  );
}
