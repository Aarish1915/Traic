# Fresh From-Scratch Specification: Apple HIG Frontend & Admin Studio Pro

> **Document Class**: Master Architectural Blueprint & Implementation Specification  
> **Author Posture**: Senior Apple Human Interface Designer & System Engineer  
> **Grounded In**: [Apple Design Resources](https://developer.apple.com/design/resources/) · [Apple UI on Dribbble](https://dribbble.com/tags/apple-ui) · Cognitive Psychology Laws · Fitts's Law · Indian DPDP Act 2023 · WCAG 2.2 AAA Standards  
> **Core Mandate**: A fresh, from-scratch redesign of both the public web frontend (`apps/web`) and the admin console (`apps/admin`), eliminating all fake gimmicks (no fake telemetry, no procedural 3D fallbacks, no duplicate forms, no hero clutter) and guaranteeing 100% dynamic CMS control over every piece of content.

---

## 1. Executive Philosophy: Extreme Clarity Over Artificial Bloat

### 1.1 The Anti-Gimmick Rules (What Gets Eliminated)
1. **Zero Mock Telemetry Simulators**: Delete `TelemetryModal.tsx` and all mock CAN-FD loops generating random numbers. A serious college robotics collective showcases **verified real-world benchmarks** (e.g. *CAN-FD 5.0 Mbps throughput validated in SIH national finals*), not fake browser animations.
2. **Zero Forced Procedural 3D Boxes**: 3D is strictly an optional progressive enhancement for projects that actually have a human-engineered `.glb` file uploaded via the Admin Console. The default is **high-resolution photography of real fabricated PCBs, real machined 6061 aluminum, real bench oscilloscope probing, and clean Altium schematics**.
3. **Zero Form Duplication**:
   - `/join` is strictly the **Club Induction Application** for students applying to join the laboratory.
   - Hackathons & Workshops have a lightweight **Event RSVP** or link directly to the external competition platform (Unstop / Devfolio) where college events actually run.
4. **Zero Hero Button Clutter**: No more 3 buttons and concatenated badge text. The Hero gets **one statement headline, one subheadline, and ONE dominant Cyan CTA** (`[ Apply for Cohort 2025 ]` or `[ Explore Our Work ]`).
5. **Zero Section Bloat**: Collapse the homepage from 13 repetitive sections down to **5 focused, high-impact Apple editorial chapters**.

---

## 2. Apple Design System Tokens & Materials

### 2.1 The 60-30-10 Color Architecture
*Governing Law*: **Von Restorff Effect** — only one color demands action; everything else recedes into elegant structure.

```
       DARK MODE (Apple Studio Pro)                   LIGHT MODE (Architectural Cleanroom)
┌───────────────────────────────────────┐      ┌───────────────────────────────────────┐
│ 60% Pure Black Canvas (#000000)       │      │ 60% Cleanroom Slate (#F8FAFC)         │
│     Elevated Card Substrate: #1C1C1E  │      │     Elevated Card Substrate: #FFFFFF  │
│     Nested Control Substrate: #2C2C2E │      │     Nested Control Substrate: #F1F5F9 │
├───────────────────────────────────────┤      ├───────────────────────────────────────┤
│ 30% Silver Typography (#F5F5F7)       │      │ 30% Deep Carbon Ink (#0F172A)         │
│     Secondary: rgba(235,235,245,0.64) │      │     Secondary: #475569                │
│     Hairlines: rgba(84,84,88,0.45)    │      │     Hairlines: #E2E8F0                │
├───────────────────────────────────────┤      ├───────────────────────────────────────┤
│ 10% Apple systemCyan (#64D2FF)        │      │ 10% Electric Cobalt Cyan (#0284C7)    │
│     Text on Cyan: #000000 (12.8:1)    │      │     Text on Cyan: #FFFFFF (7.5:1)     │
└───────────────────────────────────────┘      └───────────────────────────────────────┘
```

### 2.2 Typography Scale & Optical Kerning
- **Primary Font Stack**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif`
- **Monospace Telemetry Stack**: `"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`
- **Scale Hierarchy**:
  - **Display Hero**: `clamp(44px, 8.5vw, 84px)` · Weight: `600` · Tracking: `-0.035em` · Line-height: `1.05`
  - **Section Headline**: `clamp(32px, 5.5vw, 56px)` · Weight: `600` · Tracking: `-0.025em` · Line-height: `1.12`
  - **Card Title**: `clamp(20px, 2.5vw, 28px)` · Weight: `600` · Tracking: `-0.015em` · Line-height: `1.25`
  - **Body Copy**: `15px` / `17px` · Weight: `400` · Line-height: `1.55`
  - **Eyebrow / Status**: `11px` / `12px` · Weight: `600` · Tracking: `+0.06em` · Uppercase

### 2.3 Geometry & Fitts's Law Ergonomics
- **Continuous Curvature (Squircle)**:
  - Exterior Cards: `24px` squircle border-radius (`rounded-squircle`)
  - Interior Panels: `16px` border-radius (`rounded-2xl`)
  - Buttons & Badges: `9999px` full radius (`rounded-pill`)
- **Fitts's Law Guarantee**: Minimum `44×44pt` (`min-h-[44px] min-w-[44px]`) on every interactive button, link, filter pill, and input field.

---

## 3. Fresh Public Frontend Architecture (`apps/web`)

### 3.1 The 5 Essential Homepage Chapters

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HERO CHAPTER                                                             │
│    Floating 52px Frosted Glass Navbar (Logo + Work + Gear + Honors + Apply) │
│    Headline: "We build machines. We build ideas."                           │
│    Lead Subheadline: Real engineering collective at COER University         │
│    Actions: Single Cyan [ Apply for Cohort 2025 ] + [ Explore Our Work › ]  │
│    Stage: High-res Flagship Rover photography with 60 FPS perspective tilt  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. FLAGSHIP PROJECTS (3 Asymmetric Cards)                                   │
│    • UGV-X Rover (RTAB-Map SLAM, Machined Aluminum, ROS2)                  │
│    • Edge Neural Accelerator (4-Layer FR4 PCB, Hailo-8 NPU)                │
│    • Ground Telemetry Station (High-Speed RF, WebSockets)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. THE WORKSHOP & INSTRUMENTATION (High-Density Bento)                      │
│    Oscilloscopes (DSO 200MHz), SMD Rework Bay, 3D Printers, CNC Milling     │
│    Real equipment specs + live OPERATIONAL status chips                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. NATIONAL TRACK RECORD & HONORS                                           │
│    SIH 2024 Grand Winners (₹1,00,000) | DD Robocon AIR 4 | Patent IN-2024   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. INDUCTION & ADMISSIONS                                                   │
│    Reciprocity Perks Strip + Clean 3-Field Application Form                 │
│    Statutory Indian DPDP Act 2023 Explicit Consent + Anti-Spam Trap         │
├─────────────────────────────────────────────────────────────────────────────┤
│ FOOTER: 4 Clean Columns · "Honor · Honesty · Sacrifice" Creed · Copyright   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Sub-Page Architecture
- **`/projects` & `/projects/[slug]`**:
  - Filterable by discipline (`ALL`, `HARDWARE`, `HYBRID`, `SOFTWARE`).
  - Project Tech Specs page: Bill of Materials (BOM) silicon table, failure modes narrative, GitHub repo link, and team roster.
- **`/events` & `/events/[slug]`**:
  - Upcoming Hackathons & Masterclasses with live countdown and track breakdown.
  - Lightweight RSVP sheet or direct link to competition portal (Unstop / Devfolio).
- **`/achievements`**:
  - Verified laurels: Smart India Hackathon, DD Robocon India, IIT Techfest, and official patent filings.
- **`/learn`**:
  - 4-Stage Progressive Engineering Cadence (Weeks 1 to 15+) with lab benchmark checklists.
- **`/gallery`**:
  - High-resolution editorial photography of real lab prototyping and arena competitions with lightbox inspector.
- **`/team`**:
  - Technical coordinators with 64px monograms, verified GitHub/LinkedIn links (44pt targets), and global alumni testimonials.
- **`/join`**:
  - Sole admission portal with candidate review workflow and automated reference IDs (`TRAIC-2025-XXXX`).

---

## 4. Fresh Admin Studio Pro Architecture (`apps/admin`)

Modeled on **macOS Sequoia & Apple Developer App Store Connect**: sleek dark frosted sidebar, live system telemetry bar, and **100% dynamic control over every element on the public site**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: [TRAIC STUDIO PRO] | Neon DB: Connected SSL | RAM TTFB: 0.08ms | [Preview Site ↗]│
├──────────────────────────────┬──────────────────────────────────────────────────────────────┤
│ SIDEBAR (macOS Translucent): │ MAIN CONTENT STAGE:                                          │
│ ❖ Site Settings & Hero       │ • Live Tab Data Table with Search & Status Filter            │
│ ▤ Projects & Hardware (4)    │ • 1-Click Visibility Toggles (Publish / Draft)               │
│ ⚙ Lab Gear & Tools (6)       │ • Quick Inline Edit & Delete with Modal Sheets               │
│ ◈ Events & Hackathons (3)    │ • Zero-Hardcoding: Updates propagate to Public site in < 1ms│
│ ★ Achievements (5)           │ • DPDP Compliance Audit Log & Application Management         │
│ ☺ Leadership & Team (6)      │                                                              │
│ ⚑ Alumni Directory (4)       │                                                              │
│ ⌸ Field Gallery (6)          │                                                              │
│ ✉ Announcements & Banners (1)│                                                              │
│ ✎ Admissions & Inbox (12)    │                                                              │
└──────────────────────────────┴──────────────────────────────────────────────────────────────┘
```

### 4.1 The 10 Dynamic CMS Collections & Control Surface
Every string, headline, and item across the public application is editable in real time:

| Tab ID | Managed Entity | Dynamic Controls & Editable Fields |
|---|---|---|
| `settings` | **Site Settings** | Hero Headline, Subheadline, Motto, Stat Numbers & Labels, Section Toggles (`showGear`, `showProjects`, `showStats`, etc.) |
| `projects` | **Projects** | Title, Slug, Tagline, Category, Status (`OPERATIONAL`, etc.), Tech Stack, BOM (Silicon, Part Numbers), Repo URL, Demo URL, Real Image URL |
| `gear` | **Workshop Gear** | Equipment Name, Category, Specifications, Status (`OPERATIONAL`, `MAINTENANCE`), Published toggle |
| `events` | **Events** | Title, Slug, Date, Venue, Prize Pool, Tagline, Description, Tracks, Registration Open toggle |
| `achievements` | **Honors** | Award Title, Event Name, Year, Rank, Level (`NATIONAL`), Summary, Highlights chips |
| `members` | **Leadership** | Name, Role, Domain, Academic Year, Bio narrative, Avatar URL, GitHub URL, LinkedIn URL, Lead toggle |
| `alumni` | **Alumni** | Name, Graduation Batch, Current Role, Current Company (Tesla, ISRO, TI, etc.), Testimonial Quote |
| `gallery` | **Field Media** | Photo Title, Caption, Category, Date, Location, High-Res Image URL, Featured toggle |
| `banners` | **Alerts** | Banner Message, Type (`INFO`, `WARNING`), Link URL, Active toggle |
| `applications` | **Admissions** | Applicant Review, Status Transitions (`REVIEWING` $\to$ `ACCEPTED` $\to$ `REJECTED`), DPDP audit log |

---

## 5. Master Implementation Checklist & Verification Gates

```text
[ ] Phase 1: Strip Mock Gimmicks (Delete TelemetryModal, remove 3D dependency from hero)
[ ] Phase 2: Fresh Frontend Rebuild (5 core chapters, bold Apple typography, real hardware photography)
[ ] Phase 3: Decouple Form Architecture (/join = Club Admissions; Event RSVP = Lightweight / Unstop)
[ ] Phase 4: Fresh Admin Studio Pro (macOS Sequoia layout, live status bar, full 10-collection CMS parity)
[ ] Phase 5: Verification Gates (pnpm typecheck = 0 errors, pnpm test = passing, CDP crawler = 100% PASS)
```
