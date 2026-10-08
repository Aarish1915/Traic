# Production React / Next.js Frontend Engineering Plan

> **Objective**: Production-grade architectural blueprint for transitioning `apps/web` (Next.js 15 App Router, TypeScript, Tailwind CSS) to the Apple HIG Human-Centered Design System, incorporating all cognitive UX laws, accessibility mandates (WCAG 2.2 AA), Core Web Vitals optimization, and strict server/client boundary discipline.

---

## 1. Core Architectural Tenets

### 1.1 Server vs. Client Boundary Discipline
In Next.js 15, default to **React Server Components (RSC)** for 100% of static layout, metadata, and data-fetching boundaries. Only add `'use client'` to leaf components requiring DOM listeners, state, or browser APIs:

```
[ app/layout.tsx ] (RSC)
  ├── <SkipToContentLink /> (Static HTML)
  ├── <AppleNavbar /> ('use client' - Scroll-spy & Mobile Sheet)
  ├── [ app/page.tsx ] (RSC - Parallel Data Ingestion)
  │     ├── <HeroSection /> (RSC - Semantic HTML, LCP Vector)
  │     ├── <BentoDisciplines /> (RSC - Static Grid)
  │     ├── <LabCarousel /> ('use client' - Scroll Snap & Drag)
  │     ├── <FeaturedProjects /> ('use client' - Modal & 3D Triggers)
  │     │     └── <ProjectCaseStudyModal /> (HTML5 <dialog> Portal)
  │     ├── <ImpactAuthority /> (RSC - Stats & Patent)
  │     ├── <EventsShowcase /> (RSC wrapper with <HackathonCountdown /> client island)
  │     ├── <TeamLeadership /> (RSC - Static Grid)
  │     └── <JoinFormDPDP /> ('use client' - Form State, Validation, DPDP)
  ├── <MobileTabBar /> ('use client' - Bottom Thumb Zone Dock)
  └── <AppleFooter /> (RSC - Semantic Footer)
```

---

## 2. Design Tokens & Tailwind Configuration

### 2.1 Color Tokens & The 60-30-10 Distribution
- **60% Base**: True black `#000000` canvas and elevated `#1C1C1E` card surfaces.
- **30% Structure & Text**: Silver-white typography (`#F5F5F7`), secondary body copy (`rgba(235, 235, 245, 0.64)`), and hairline separators (`rgba(84, 84, 88, 0.55)`).
- **10% Focused Accent**: Apple systemCyan (`#64D2FF`). Strictly restricted to:
  1. Primary CTA buttons.
  2. Exactly one word in the hero headline.
  3. Active navigation scroll-spy state.

### 2.2 Tailwind Configuration (`apps/web/tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#000000',
          elevated: '#1C1C1E',
          surface: '#2C2C2E',
          glass: 'rgba(28, 28, 30, 0.72)',
          nav: 'rgba(0, 0, 0, 0.65)',
        },
        ink: {
          primary: '#F5F5F7',
          secondary: 'rgba(235, 235, 245, 0.64)',
          tertiary: 'rgba(235, 235, 245, 0.36)',
        },
        cyan: {
          DEFAULT: '#64D2FF',
          hover: '#7FE0FF',
          muted: 'rgba(100, 210, 255, 0.16)',
        },
        separator: 'rgba(84, 84, 88, 0.55)',
        subtle: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"SF Mono"', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        squircle: '24px',
        pill: '9999px',
      },
      maxWidth: {
        apple: '1140px',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 3. Cognitive UX Laws & Engineering Rules Checklist

| Law / Principle | Engineering Requirement in React | Verification Metric |
|---|---|---|
| **Von Restorff Effect** | Accent color `#64D2FF` is applied $\le 3$ times on the entire page (Primary CTA, hero emphasis word, active scroll-spy). All tags, chips, and icons use neutral zinc/surface tones. | Accent coverage $< 5\%$ of viewport area |
| **Hick’s Law** | Exactly 5 desktop nav links. Exactly 7 distinct homepage sections. Pruned 4-column footer without dead `#` links. | Decision time $T < 1.5\text{s}$ |
| **Fitts’s Law** | All interactive targets (`<button>`, `<a>`, `<input>`) have `min-height: 44px` and padded clickboxes. On mobile ($\le 960\text{px}$), main navigation docks to a floating bottom tab bar in the natural thumb zone. | 100% elements pass $44\times44\text{px}$ minimum |
| **Jakob’s Law** | Standard mental model: logo links home; standard bento layout; project cards look and act clickable; standard escape-to-close modals. | Zero non-standard UI paradigms |
| **Norman’s Signifiers** | Project cards use cursor pointer and hover lift. Horizontal carousel features prominent circular previous/next navigation buttons ($44\text{px}$). | Affordance clarity 100% |
| **Nielsen Status** | `IntersectionObserver` scroll-spy updates `aria-current="page"` in real time. Recruitment form has loading state (`Submitting...`) and `aria-live` status messages. | Full user awareness |
| **Doherty Threshold** | Sub-400ms feedback: Zero layout shift (`CLS = 0.00`) via explicit CSS aspect ratios (`aspect-[16/9]`, `aspect-[16/10]`). Fast modal opens ($< 5\text{ms}$) via native `<dialog>`. | TTFB $< 100\text{ms}$, CLS $= 0.00$ |
| **Social Proof & Reciprocity** | 4 single-source verified stat counters. Official Patent spotlight card. Clear reciprocity value proposition (free kit, mentorship, credit) displayed before form submission. | Trust and conversion integrity |
| **DPDP Act 2023** | India data protection compliance: explicit consent checkbox, purpose notice, no-marketing guarantee, honeypot protection. | 100% legal compliance |
| **WCAG 2.2 Level AA** | Text contrast $\ge 4.5:1$ (Primary `#F5F5F7` delivers $18.2:1$). Skip-to-content bypass link. Explicit `<label>` on every input. `prefers-reduced-motion` support. | Zero Axe accessibility violations |

---

## 4. Component Implementation Specifications

### 4.1 Navigation System (`AppleNavbar.tsx` & `MobileTabBar.tsx`)
- **Desktop Navbar**:
  - `56px` height, floating glass pill (`backdrop-filter: blur(20px) saturate(180%)`), fixed top with `max-width: 1140px`.
  - Brand lockup with monoline TRAIC emblem.
  - 5 nav links (*Disciplines*, *Projects*, *Patents*, *Events*, *Team*).
  - Pill CTA: **"Join TRAIC"** (`#64D2FF` cyan background, `#000000` text).
- **Mobile Bottom Tab Bar**:
  - Automatically renders on viewports $\le 960\text{px}$.
  - Fixed at `bottom: max(12px, env(safe-area-inset-bottom))`.
  - 5 tab icons with labels: *Home*, *Projects*, *Events*, *Team*, *Join*.
  - `48px` touch targets situated in the natural one-thumb reach zone.

### 4.2 Hero Section (`HeroSection.tsx`)
- **Headline**: Centered, `clamp(44px, 8.5vw, 88px)`, semibold, tracking `-0.035em`, line-height `1.05`:
  `We build machines. We build <span className="text-cyan">ideas.</span>`
- **Subline**: `clamp(18px, 2.2vw, 22px)`, `rgba(235, 235, 245, 0.64)`.
- **Actions**: Primary pill "Join TRAIC" (`min-h-[44px] px-6`) + secondary text chevron link "Explore our work ›".
- **Visual Subject**: High-contrast vector silhouette of the autonomous robotics platform rising from the bottom edge against a subtle radial rim light. Zero clutter, zero tacky neon rings.

### 4.3 Disciplines Bento Grid (`BentoDisciplines.tsx`)
- **Section Heading**: Eyebrow `DISCIPLINES` + Title `"Innovation in every line of code."`.
- **Bento Grid**: 3-column layout with 6 verticals:
  1. *Autonomous Robotics* (Spans 2 columns, hardware schematic media).
  2. *Embedded Systems* (Bare-metal C/C++, ARM Cortex, RTOS).
  3. *Connected IoT* (LoRa meshes, MQTT telemetry).
  4. *Applied Edge AI* (Computer vision, TensorRT, edge inferencing).
  5. *Unmanned Aerial Systems* (Custom quadcopter frames, flight telemetry).
  6. *Automation & Mechatronics* (Closed-loop motor control, actuators).
- **Card Styling**: Elevated `#1C1C1E` substrate, 24px squircle corners, monoline SF-symbols icons, subtle 1px border.

### 4.4 Lab in Motion Carousel (`LabCarousel.tsx`)
- **Horizontal Scroll-Snap**: `scroll-snap-type: x mandatory` with smooth trackpad momentum.
- **Controls**: 44px circular previous/next buttons with accessible ARIA labels.
- **Card Media**: 16:10 aspect ratio preview containers with activity titles and descriptions below.

### 4.5 Featured Projects & Case Study Modal (`FeaturedProjects.tsx`)
- **2×2 Project Grid**:
  1. *Atlas Autonomous Rover* (ROS2 Humble, 2D LiDAR, RTAB-Map SLAM).
  2. *GreenMind Polyhouse IoT* (ESP32-S3, LoRa SX1262, microclimate irrigation).
  3. *SkyFrame Surveying UAV* (PX4 Autopilot, 4K Gimbal, 28-min endurance).
  4. *SortBot Vision Workcell* (NVIDIA Jetson Orin Nano, Delta arm, 90 picks/min).
- **Modal Trigger**: Each card is an accessible button that opens an HTML5 `<dialog>` modal with:
  - Technical narrative, specifications, BOM, and award pedigree.
  - Trigger button to launch the **Interactive 3D CAD Inspector** (`Project3DInspector.tsx`) with Exploded Assembly CAD mode and Raycast Telemetry HUD.

### 4.6 Impact, Authority & Patents (`ImpactAuthority.tsx`)
- **Single Source of Truth Numbers**: 21 Years of Innovation, 100+ Shipped Projects, 500+ Engineers Mentored, 50+ National Trophies.
- **Patent Card**: *Adaptive SLAM Navigation System* with official filing badge.
- **Authority Strip**: Institutional endorsements from COER University Innovation Cell, IEEE, and DST Hardware Grants.

### 4.7 Events Showcase (`EventsShowcase.tsx`)
- **Spotlight Event**: *TRAIC National Hackathon 2026* with live countdown component calculating days remaining.
- **Past Sessions List**: Vertical stack of recent workshops (*Embedded Firmware Bootcamp*, *Edge AI on Jetson*, *Drone Derby*) with chevron links.

### 4.8 Recruitment Form & DPDP Compliance (`JoinFormDPDP.tsx`)
- **Value Reciprocity Strip**: 3 student perks (Free hardware kit, 1-on-1 mentorship, University credit) placed immediately above the form inputs.
- **Inputs**: Full Name, College Email, Focus Domain.
- **DPDP Consent Checkbox**: Statutory consent checkbox guaranteeing data is used solely for orientation updates under India's DPDP Act 2023.
- **Bot Defense**: Honeypot trap (`_traic_hp_trap`).

### 4.9 Apple Footer (`AppleFooter.tsx`)
- 4 semantic columns (*Explore*, *Research*, *Community*, *Location*).
- Brand Creed: **"Honor · Honesty · Sacrifice"**.
- Copyright: `© 2026 The Robotics & Innovation Club (TRAIC), COER University.`

---

## 5. Performance & Core Web Vitals Targets

1. **Largest Contentful Paint (LCP)**: $\le 1.2\text{s}$ (Hero text and SVG vector silhouette rendered immediately).
2. **Cumulative Layout Shift (CLS)**: $\mathbf{0.00}$ (Every image and container uses explicit CSS aspect ratios).
3. **Interaction to Next Paint (INP)**: $\le 80\text{ms}$ (Native CSS transitions, zero runtime CSS compilation).
4. **First Input Delay (FID)**: $\le 15\text{ms}$.
5. **Axe Core Accessibility Violations**: $\mathbf{0}$.

---

## 6. Migration Roadmap (Zero Downtime)

```
[Step 1: Tokens] ──► [Step 2: Shared Icons] ──► [Step 3: Component Build] ──► [Step 4: Page Assembly] ──► [Step 5: Quality Gates]
```

1. **Step 1: CSS Design Tokens & Tailwind**: Update `apps/web/tailwind.config.ts` and `apps/web/src/app/globals.css` with true black and surface tokens.
2. **Step 2: Icon Repository**: Create `apps/web/src/components/apple/SFSymbols.tsx` providing all 1.5px monoline vector icons.
3. **Step 3: Component Implementation**: Build the individual React components under `apps/web/src/components/apple/`.
4. **Step 4: Page Integration**: Compose the clean components in `apps/web/src/app/page.tsx` with dynamic fallback to existing `/public/*` API data.
5. **Step 5: Automated Quality Gates**:
   - `pnpm typecheck` (0 errors across monorepo).
   - `pnpm lint`.
   - `pnpm test` (Offline contract tests).
   - `pnpm test:integration` (69/69 full-system assertions).
