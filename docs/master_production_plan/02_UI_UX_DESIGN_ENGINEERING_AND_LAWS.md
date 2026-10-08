# 02 — UI/UX Design Engineering & Cognitive Laws

## 1. Grounding in Empirical Design Laws

A production-grade interface is not built on subjective aesthetic intuition; it is engineered using empirical laws of human perception and biomechanics:

### A. Fitts’s Law ($T = a + b \log_2(2D/W)$)
* **Application**: Target acquisition time is determined by distance ($D$) and width ($W$).
* **Rules**:
  - Primary Call-to-Action (CTA) buttons must have a minimum interactive tap target of **$48 \times 48\text{px}$** on mobile viewports.
  - Critical actions ("Join Cohort", "Inspect 3D", "Submit Application") must be anchored in high-visibility primary thumb zones on mobile and standard terminal visual endpoints on desktop.
  - Full card surfaces must be interactive tap targets, not just small text links inside them.

### B. Hick-Hyman Law ($T = b \log_2(n + 1)$)
* **Application**: Decision time increases logarithmically with the number of choices ($n$).
* **Rules**:
  - Main navigation is strictly capped at 6 essential destinations (`Projects`, `Achievements`, `Gallery`, `Events`, `Team`, `Learn`).
  - Hero section provides exactly **two** distinct options: Primary action ("Explore Projects" in high-contrast cyan) and Secondary action ("Join 2025 Cohort" in subtle ghost titanium). Zero choice paralysis.
  - Filter bars in `/projects` and `/gallery` use segmented pills with active state contrast, grouping items into mutually exclusive subsets.

### C. Miller’s Law ($7 \pm 2$ Working Memory Capacity)
* **Application**: Humans can only hold 5 to 9 information chunks in working memory.
* **Rules**:
  - Content sections are strictly modularized into distinct visual "chunks" (e.g., 4 key metrics in the stats counter, 3 featured engineering systems on the homepage).
  - Eliminates visual clutter and sensory overload.

### D. Jakob’s Law & Gestalt Principles
* **Jakob's Law**: Users expect standard web conventions. The brand emblem anchors top-left; primary navigation sits in the header center; theme switcher and high-priority CTA sit top-right; the footer provides full sitemap, credentials, and legal attribution.
* **Gestalt Law of Proximity & Common Region**:
  - Tightly coupled data (e.g. Project title, category badge, and CAD specs) share tight $8\text{px}–12\text{px}$ spacing.
  - Distinct content sections are delineated by bounded card surfaces (`.glass-panel`, `.metallic-card`) and generous $80\text{px}–120\text{px}$ vertical section margins.

### E. Doherty Threshold ($< 400\text{ms}$ Response Time)
* **Application**: User productivity peaks when the system reacts within $400\text{ms}$.
* **Rules**:
  - In-memory Node.js caching serves data in $< 1.5\text{ms}$ TTFB.
  - 3D modal transitions and tab filtering update synchronously without skeleton flashing or layout shifts.

---

## 2. Official Logo Prominence & Brand Lockup Architecture

### The Problem
The official TRAIC emblem (`apps/web/public/traic-logo.png`) contains intricate cybernetic mechanical detailing: radial PCB circuit traces, a circular brushed titanium bezel with structural bolts, an abyssal dark core, and stylized angular stencil lettering. Currently, it is shrunken into an obscured $40\text{px}$ box, rendering its fine artwork unreadable.

### The Solution: Engineered Emblem Architecture
```text
┌────────────────────────────────────────────────────────────────────────┐
│                      ENGINEERED LOGO LOCKUP                            │
│                                                                        │
│   ┌──────────────┐   TRAIC                                            │
│   │   [EMBLEM]   │   ─────────────────────────────────────────────     │
│   │ 52x52 High   │   TECHNOLOGY, ROBOTICS & AI COMMUNITY              │
│   │ Titanium     │   COER UNIVERSITY // EST. 2020                     │
│   │ Bezel        │                                                     │
│   └──────────────┘                                                     │
└────────────────────────────────────────────────────────────────────────┘
```
1. **Multi-Scale Vector / High-DPI Rendering**:
   - Provide crisp, uncompressed WebP/PNG assets at $1\times$, $2\times$ (Retina), and $3\times$ densities.
   - Set base navbar emblem dimension to **$48\text{px} \times 48\text{px}$** (desktop) and **$40\text{px} \times 40\text{px}$** (mobile), enclosed in a chamfered aerospace metallic frame (`border: 1.5px solid rgba(0, 229, 255, 0.4)`).
   - Add a subtle ambient cyan back-glow (`box-shadow: 0 0 20px rgba(0, 229, 255, 0.25)`).
2. **Prominent Hero Stage Display**:
   - In the interactive 3D Hardware Viewport, render the official logo directly onto the central silicon die heat spreader plate with anisotropic metallic sheen.

---

## 3. The "Dual Line" Creed Fix: Single Architectural Placement

### The Problem
The motto `HONOR • HONESTY • SACRIFICE` currently appears redundantly across multiple components within the same viewport (Navbar brand text, Hero floating badge, and Footer). This repetition feels amateurish and clutters the interface.

### The Solution
* **Remove from Hero Pill Badge**: Replace the hero badge with a functional system status telemetry indicator (e.g. `LIVE // COHORT 2025 ADMISSIONS OPEN` or `HARDWARE LAB ACTIVE // 480 MHz`).
* **Sole Architectural Placements**:
  1. **Discreet Navbar Brand Sub-Label**: Located directly beneath the bold "TRAIC" heading in uppercase JetBrains Mono ($8\text{px}$, tracking `0.15em`, color `var(--text-2)`).
  2. **Footer Base Seal**: Engraved cleanly into the bottom copyright border line alongside the official college affiliation.

---

## 4. Complete Theme Engineering: Obsidian Dark vs Surgical Cleanroom Light

### A. Dark Mode: Deep Space Obsidian (Mission Control)
Dark mode emulates an advanced aerospace cleanroom / robotics test range control room at night.
* Background: Deepest OLED Obsidian (`#030712`) — provides infinite contrast.
* Surfaces: Brushed Titanium Slate (`#0F172A`, `#1E293B`) with hairline circuit cyan borders (`rgba(56, 189, 248, 0.15)`).
* Primary Accent: Electric Plasma Cyan (`#00E5FF`).
* Secondary Accent: Circuit Sky Blue (`#38BDF8`).
* Primary Typography: Pure Metallic Titanium White (`#F8FAFC`).

### B. Light Mode: Surgical Cleanroom Laboratory (Overhauled)
Light mode is completely re-engineered from the ground up to reflect a state-of-the-art cleanroom workstation (like Intel / ASML semiconductor fabrication facilities).
* **Root Background**: Pure Architectural Slate (`#F8FAFC` / `#FFFFFF`).
* **Elevated Surfaces & Cards**: Pure Cleanroom White (`#FFFFFF`) with high-definition razor-sharp hairline borders (`#CBD5E1` / `#E2E8F0`).
* **Primary Typography**: Deep Carbon Ink (`#0F172A`), delivering an ultra-crisp **14.2:1** contrast ratio (WCAG AAA compliant).
* **Secondary Typography**: Engineering Slate (`#475569`), delivering **7.1:1** contrast ratio.
* **Primary Accent**: High-Contrast Electric Cobalt / Surgical Cyan (`#0284C7`), providing vibrant, eye-catching action cues with pure white text (`#FFFFFF`) at **4.8:1** contrast.
* **Card Lighting & Shadows**: Ambient cleanroom studio soft drop-shadow (`box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.08)`).

| CSS Token | Dark Mode (Obsidian) | Light Mode (Cleanroom) | Visual Role |
|---|---|---|---|
| `--bg-0` | `3 7 18` (`#030712`) | `248 250 252` (`#F8FAFC`) | Canvas base |
| `--bg-1` | `8 14 30` (`#080E1E`) | `241 245 249` (`#F1F5F9`) | Elevated sections |
| `--surface` | `15 23 42` (`#0F172A`) | `255 255 255` (`#FFFFFF`) | Cards & modals |
| `--surface-hover` | `30 41 59` (`#1E293B`) | `241 245 249` (`#F1F5F9`) | Hovered cards |
| `--border` | `56 189 248 / 15%` | `203 213 225` (`#CBD5E1`) | Precision hairlines |
| `--text-1` | `248 250 252` (`#F8FAFC`) | `15 23 42` (`#0F172A`) | Headings & body copy |
| `--text-2` | `148 163 184` (`#94A3B8`) | `71 85 105` (`#475569`) | Subtitles & metadata |
| `--accent` | `0 229 255` (`#00E5FF`) | `2 132 199` (`#0284C7`) | Primary CTA buttons |
| `--accent-fg` | `3 7 18` (`#030712`) | `255 255 255` (`#FFFFFF`) | Text on accent |
| `--accent-2` | `56 189 248` (`#38BDF8`) | `14 165 233` (`#0EA5E9`) | Badges & rim lighting |

---

## 5. Mathematical Spacing Grid & Typographic Scale

### 8pt Spatial Grid Standard
All margins, paddings, and component heights adhere strictly to multiples of 4px / 8px:
- `$4\text{px}$`: Micro badge padding, indicator dots
- `$8\text{px}$`: Inline gaps, icon margins
- `$16\text{px}$`: Card inner padding, form field padding
- `$24\text{px}$`: Grid gaps, modal headers
- `$32\text{px}$`: Section sub-group spacing
- `$64\text{px}–96\text{px}$`: Section vertical rhythm

### Typographic Hierarchy
1. **Hero Headline**: Space Grotesk / Inter Display, $60\text{px}–72\text{px}$, font-black, letter-spacing `tight`, line-height $1.05$.
2. **Section Headings (H2)**: Space Grotesk, $32\text{px}–40\text{px}$, font-extrabold.
3. **Card Titles (H3)**: Inter, $18\text{px}–20\text{px}$, font-bold.
4. **Body Copy**: Inter, $15\text{px}–16\text{px}$, line-height $1.6$, letter-spacing `normal`.
5. **Hardware Telemetry & Badges**: JetBrains Mono, $10\text{px}–12\text{px}$, uppercase, letter-spacing `0.08em`.
