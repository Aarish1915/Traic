import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function SFIcon({
  size = 24,
  className = '',
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconLogo(props: IconProps) {
  return (
    <SFIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" strokeWidth="1.2" />
      <path d="M7 8.5h10M12 8.5v8.5M9 17h6" strokeWidth="1.8" />
      <circle cx="12" cy="12.5" r="1.2" fill="currentColor" />
      <circle cx="5.5" cy="5.5" r="0.75" fill="currentColor" />
      <circle cx="18.5" cy="5.5" r="0.75" fill="currentColor" />
      <circle cx="5.5" cy="18.5" r="0.75" fill="currentColor" />
      <circle cx="18.5" cy="18.5" r="0.75" fill="currentColor" />
    </SFIcon>
  );
}

export function IconRobot(props: IconProps) {
  return (
    <SFIcon {...props}>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4M9 13v1M15 13v1M2 14h2M20 14h2" />
      <circle cx="12" cy="3.5" r="1" />
    </SFIcon>
  );
}

export function IconChip(props: IconProps) {
  return (
    <SFIcon {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </SFIcon>
  );
}

export function IconIoT(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M4 11a12 12 0 0 1 16 0M7 14.5a7 7 0 0 1 10 0M10 18a2 2 0 0 1 4 0" />
      <circle cx="12" cy="20" r="0.75" />
    </SFIcon>
  );
}

export function IconAI(props: IconProps) {
  return (
    <SFIcon {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
    </SFIcon>
  );
}

export function IconDrone(props: IconProps) {
  return (
    <SFIcon {...props}>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" />
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="19" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M7.2 7.2l2.3 2.3M16.8 7.2l-2.3 2.3M7.2 16.8l2.3-2.3M16.8 16.8l-2.3-2.3" />
    </SFIcon>
  );
}

export function IconGear(props: IconProps) {
  return (
    <SFIcon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9l-2.1 2.1M7 17l-2.1 2.1" />
    </SFIcon>
  );
}

export function IconTrophy(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4M6 5h12v6a6 6 0 0 1-12 0V5zM12 17v4M8 21h8" />
    </SFIcon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M5 13l4 4L19 7" />
    </SFIcon>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M9 5l7 7-7 7" />
    </SFIcon>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M15 19l-7-7 7-7" />
    </SFIcon>
  );
}

export function IconBox(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z M12 12L3 7 M12 12v10 M12 12l9-5" />
    </SFIcon>
  );
}

export function IconHome(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />
    </SFIcon>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <SFIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </SFIcon>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <SFIcon {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 19c0-3.5 3-6 7-6s7 2.5 7 6" />
      <circle cx="17.5" cy="8.5" r="2.5" />
      <path d="M16 13.5c2.5 0 5 1.5 5 4.5" />
    </SFIcon>
  );
}

export function IconSun(props: IconProps) {
  return (
    <SFIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </SFIcon>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <SFIcon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </SFIcon>
  );
}

export function IconMonitor(props: IconProps) {
  return (
    <SFIcon {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </SFIcon>
  );
}
