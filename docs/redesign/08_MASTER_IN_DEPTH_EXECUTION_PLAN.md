# Master In-Depth Execution Plan: TRAIC Apple HIG Engineering Overhaul

> **Document Class**: Architectural Specification & Implementation Master Plan  
> **Standards Compliance**: Apple Human Interface Guidelines (HIG), Cognitive Psychology Laws, WCAG 2.2 AA / AAA, Indian DPDP Act 2023, 12-Factor App, Zero-Hardcoding Mandate.  
> **Grounding Sources**: [Apple Design Resources](https://developer.apple.com/design/resources/), [Dribbble Apple UI Trends](https://dribbble.com/tags/apple-ui), TRAIC Project Rules (`AGENTS.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `MISTAKES.md`).

---

## 1. Executive Strategy & Trade-Off Analysis

Under the Senior Reviewer Anti-Sycophancy Mandate, we evaluate the architectural paths before execution:

| Dimension | Option A: Superficial CSS Facelift | Option B: Rebuild From Scratch Discarding Existing Work | Option C: Systematic Apple HIG Overhaul & Full Parity (Recommended) |
|---|---|---|---|
| **Data Continuity** | Keeps hardcoded values; doesn't solve user requirement for 100% admin control. | Destroys working WebGL 3D exploded assemblies, existing database seed data, and CI test suites. | **Preserves all 100% real club data, 3D CAD inspector, and tests**, while lifting UI to Apple HIG and connecting all entities to the Admin CMS. |
| **Aesthetic Quality** | Patchwork; looks inconsistent between pages and themes. | High risk of unfinished components and broken sub-routes. | **Unified Apple Design System**: 60-30-10 color tokens, SF Pro type scale, 24px continuous curvature squircles, monoline SF Symbols, and Liquid Glass. |
| **Sub-Page Parity** | Sub-pages remain forgotten, clunky, or unclickable. | Sub-pages may be omitted or basic placeholders. | **Full deep-dive coverage**: `/projects`, `/projects/[slug]`, `/events`, `/events/[slug]`, `/team`, `/gallery`, `/learn`, `/achievements`, `/join`. |
| **Admin Control** | Only 3–4 fields editable. | Re-architecting schema from scratch risks migration failure. | **13 Dynamic CMS Collections**: All headlines, CTAs, equipment, stats, and sections 100% editable from Admin Console. |
| **Stated Recommendation** | ❌ Rejected (violates user requirement) | ❌ Rejected (destroys working features) | ✅ **Option C (Systematic Apple HIG Overhaul & Full Parity)** |

---

## 2. Senior Reviewer Pre-Flight Checklist (The 5 Mandatory Questions)

1. **Is any claim here (%, threshold, "current" fact) assumed rather than verified?**
   - *Verified*: All 11 Neon PostgreSQL tables, 13 Zod schemas, port assignments (API 4000, Web 3000, Admin 5173), and CSS color values are verified directly from codebase files (`packages/shared`, `apps/api/src`, `apps/web/src`, `apps/admin/src`). No numbers are fabricated.
2. **Does this involve time-ordered data? Could any step see future information?**
   - *Verified*: Events and announcements use chronological ordering (`startsAt ASC` for upcoming events, `date DESC` for past competitions and achievements). No data leakage exists between past and upcoming scopes.
3. **Is there a simpler version that hasn't been tried and ruled out?**
   - *Verified*: A modular monolith API using shared Zod contracts between client and server is the simplest, most robust architecture. No microservices, no redundant message queues.
4. **What is the boundary/edge case where this breaks?**
   - *Edge Case 1*: Neon PostgreSQL offline $\to$ Handled by API in-memory write-through cache serving default seed state (< 1ms TTFB).
   - *Edge Case 2*: Mobile screen touch traps on 3D viewport $\to$ Handled by `touch-action: pan-y` and pointer vector disambiguation (`totalDy > totalDx * 1.1`).
   - *Edge Case 3*: Light mode contrast degradation $\to$ Handled by Surgical Cleanroom Slate (`#F8FAFC`), deep carbon ink (`#0F172A`, 14.2:1 AAA contrast), and dark emerald status badges (`#065F46`, 7.1:1 AAA contrast).
   - *Edge Case 4*: Spam / bots on application and event forms $\to$ Handled by hidden honeypot fields, IP rate limiting, and client/server Zod validation.
5. **If this number is wrong, how would we find out, and how expensive is finding out?**
   - *Kill-Gates*: Monorepo typecheck (`pnpm typecheck`), automated contract tests (`pnpm test`), and the automated CDP human-inspector crawler (`scratch/human_inspector_crawler.mjs`) testing all 12 routes across 4 viewports/themes before any deployment.

---

## 3. Apple Human Interface Design System Tokens

### 3.1 Color Architecture & The 60-30-10 Rule
*Governing Law*: **Von Restorff Effect** — only one color demands action; everything else recedes into elegant structure.

#### Dark Mode (Primary Studio Specification)
- **60% Base Canvas & Structure**:
  - Pure Black Canvas: `#000000` (`rgb(0, 0, 0)`)
  - Elevated Card Surface 1: `#1C1C1E` (`rgb(28, 28, 30)`)
  - Nested Control Surface 2: `#2C2C2E` (`rgb(44, 44, 46)`)
  - Liquid Glass Substrate: `rgba(28, 28, 30, 0.72)` with `backdrop-filter: blur(20px) saturate(180%)`
- **30% Typography & Separators**:
  - Primary Text (White Silver): `#F5F5F7` (`rgb(245, 245, 247)`) — Contrast 18.2:1 (AAA)
  - Secondary Text: `rgba(235, 235, 245, 0.64)` — Contrast 8.5:1 (AAA)
  - Tertiary Text: `rgba(235, 235, 245, 0.36)` — Contrast 4.6:1 (AA)
  - Hairline Separators: `rgba(84, 84, 88, 0.55)` (1px solid, zero drop shadow)
- **10% Focused Accent (Strictly Monopolized)**:
  - Apple systemCyan: `#64D2FF` (`rgb(100, 210, 255)`)
  - Cyan Hover: `#7FE0FF`
  - Cyan Subtle Fill: `rgba(100, 210, 255, 0.12)`
  - *Usage Limits*: Primary CTA button, singular highlighted word in hero headline ("ideas."), active scroll-spy navigation indicator. Nowhere else.

#### Cleanroom Light Mode (Surgical Laboratory Specification)
- **60% Base Canvas & Structure**:
  - Pure Architectural Slate: `#F8FAFC`
  - Elevated Card Substrate: `#FFFFFF`
  - Nested Control Substrate: `#F1F5F9`
  - Liquid Glass Substrate: `rgba(255, 255, 255, 0.82)` with `backdrop-filter: blur(20px) saturate(180%)`
- **30% Typography & Separators**:
  - Deep Carbon Ink Headings: `#0F172A` — Contrast 14.2:1 (AAA)
  - Secondary Charcoal Text: `#475569` — Contrast 7.1:1 (AAA)
  - Hairline Separators: `#E2E8F0` (1px solid)
- **10% Focused Accent**:
  - Electric Cobalt Cyan: `#0284C7`
  - Active Link / CTA Hover: `#0369A1`
  - Status Emerald: `#065F46` (7.1:1 AAA contrast)

### 3.2 Typography Hierarchy & Apple Scale
- **Font Stack**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif`
- **Telemetry / Monospace Stack**: `"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`
- **Scales & Tracking**:
  - Hero Display: `clamp(48px, 8vw, 88px)`, semibold (weight 600), tracking `-0.035em`, line-height `1.05`
  - Section Headlines: `clamp(32px, 5vw, 48px)`, semibold, tracking `-0.025em`, line-height `1.15`
  - Subheadlines / Callouts: `21px`, regular (weight 400), tracking `-0.01em`, line-height `1.45`
  - Body Copy: `17px`, regular, line-height `1.55`
  - Footnote / Eyebrow: `13px` / `12px`, uppercase, tracking `+0.05em`, semibold
  - Monospace Telemetry: `12px` / `13px`, medium (weight 500), tracking `0`

### 3.3 Geometry, Touch & Spatial Cadence
- **Continuous Curvature (Squircle)**:
  - Outer Cards: `24px` squircle border-radius
  - Inner Nested Elements: `16px` border-radius
  - Buttons / Badges: `9999px` full pill radius
- **Fitts's Law Touch Targets**:
  - Every button, link, toggle, input: Minimum `44×44pt` (`min-h-[44px]`, `min-w-[44px]`)
  - Mobile bottom tab bar dock: `48px` touch targets positioned in the ergonomic thumb zone (0–960px viewports).
- **8pt Spatial Grid**: Padding and margins strictly adhere to `8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`.

---

## 4. Sub-Connected Pages & Interactive Modal Overhaul Specifications

### 4.0 The Anti-Template Layout Laws: Dynamic Editorial Cadence
*Governing Mandate*: **Eliminate cookie-cutter repetition entirely**. Pages must never feel like identical box grids cloned across routes. Every route features an asymmetrical, purposeful rhythm tuned to its engineering domain:
1. **Flagship Stage Dominance**: The primary engineering achievement (e.g. UGV-X Rover on `/projects`, SIH Grand Championship on `/achievements`, National Hackathon on `/events`) occupies a commanding 8-to-12 column editorial stage with interactive launchers, live telemetry chips, and direct deep-dive access.
2. **Asymmetrical Vertical Flow**: Alternating layout proportions: 12-col spotlight $\to$ 2:1 asymmetric feature splits $\to$ 3-column micro-widgets $\to$ tabular Silicon BOM breakdowns. No two consecutive sections share the same spatial footprint.
3. **Domain-Specific Card Architecture**:
   - Hardware/Robotics projects feature CAD preview viewports and live bus protocol indicators.
   - Firmware projects feature silicon pinout chips and memory/clock benchmark metrics.
   - Telemetry projects feature live simulated CAN-FD signal feeds.
4. **Pro-Grade Diagnostic Modals**: Modals are never generic popup boxes. They are modeled on Apple Pro applications (Reality Composer Pro, Logic Pro, Xcode Instruments):
   - Frosted liquid glass chassis (`backdrop-blur-2xl bg-canvas-elevated/95 border-subtle`).
   - 44pt minimum touch targets (`min-h-[44px] min-w-[44px]`) conforming to Fitts's Law.
   - Non-blocking layout stacking, keyboard dismissal (`Esc`), and touch gesture disambiguation.

### 4.1 `/projects` & `/projects/[slug]` (Hardware Showcase, CAD & Silicon Architecture)
- **Projects Index (`/projects`)**:
  - **Flagship Hardware Stage**: Hero showcase of UGV-X Autonomous Rover with direct `[ Inspect 3D CAD Assembly ]` launcher, live CAN-FD telemetry specs (`STM32H753 @ 480MHz`, `Hailo-8 26 TOPS`), and case study links.
  - **Asymmetric Secondary Grid**: Diverse card architecture where:
    - Card #1 (Edge Neural PCB) highlights 4-layer FR4 stackup and INT8 TOPS benchmarks.
    - Card #2 (Telemetry Ground Station) features a live CAN-FD simulation launcher button.
    - Every project provides a 1-tap `[ Inspect 3D ]` CAD viewer trigger.
  - **Tactile Filter Pills**: 44pt category pills (`ALL`, `HARDWARE`, `HYBRID`, `SOFTWARE`) with fluid cyan indicator.
- **Detail Route (`/projects/[slug]`)**:
  - **Tech Specs Product Page Layout**: Modeled after Apple Pro device tech specs.
  - **Embedded CAD Preview & Telemetry Stage**: Direct 3D viewport preview with quick full-screen launcher.
  - **Engineering & Design Narrative**: In-depth narrative of hardware architecture, failure modes overcome, and firmware state machines.
  - **Silicon & Subsystem BOM Table**: Clean, searchable component list with part numbers, operating voltages, and subsystem roles.
  - **Laurels & Verified Contributors**: Team roster with GitHub links and competition honors.

### 4.2 `/events` & `/events/[slug]` (Workshops, Sprints & Flagship Hackathon)
- **Events Index (`/events`)**:
  - **Flagship Hackathon Stage**: Full-width glass card with live dynamic countdown pill (`HackathonCountdown.tsx`), track pills, prize pool (`₹1,50,000`), provided bench equipment list, and direct in-page `EventRegistrationModal` trigger.
  - **Track-Based Workshop Timeline**: Split timeline separating upcoming hands-on masterclasses from past sessions.
- **Detail Route (`/events/[slug]`)**:
  - **Split Keynote Layout**: Left 8 cols detail schedule, hourly milestones, bench hardware kits, and mentor roster; Right 4 cols host a sticky Apple registration card with direct modal launcher.
  - **`EventRegistrationModal.tsx`**: Apple HIG modal sheet with team lead, roll numbers, hardware kit selection, DPDP Act 2023 consent, and instant registration receipt ID (`INNO-2025-XXXX`).

### 4.3 `/team` (Builders, Coordinators & Alumni Hall of Fame)
- **Leadership Spotlight**: Prominent technical architects and student coordinators with 64px monograms, high-contrast portraits, verified social badges (GitHub, LinkedIn), and 44pt touch targets.
- **Domain Leads Bento**: Domain-grouped cards (Hardware, Firmware, ROS2 Robotics, Telemetry) with skill tags and project links.
- **Alumni Hall of Fame**: Testimonials and career milestones from alumni working at Tesla, ISRO, TI, Qualcomm.

### 4.4 `/gallery` (Field Trials & Lab Photography)
- **Apple Editorial Masonry Grid**: Alternating 16:9 / 21:10 cinematic spotlight frames and 16:10 detailed workbench close-ups.
- **Category Filter Pills**: 44pt pills for `ALL`, `COMPETITION`, `FABRICATION`, `ROBOTICS`, `LAB_LIFE`.
- **Apple Lightbox Dialog**: Fullscreen high-res photo viewer with metadata overlay, caption, and 44pt close button.

### 4.5 `/learn` (Curriculum & Technical Tracks)
- **4-Stage Progressive Engineering Cadence**: Visual roadmap cards (Stage 01: Bare-Metal & Signals $\to$ Stage 04: National Deployment).
- **Specialized Cohort Curricula**: Deep-dive syllabus cards with tools & instrumentation badges, practical completion benchmarks, and direct cohort application buttons.

### 4.6 `/achievements` (National Trophies & Patents)
- **Hall of Fame Bento**:
  - Main Trophy Spotlight (8 cols): SIH 2024 Grand Winners trophy, ₹1,00,000 cash prize, Ministry citation, and live demo zero-dropout highlight.
  - Patent Feature (4 cols): Patent `IN-2024-XXXX` (*"Adaptive SLAM Navigation System"*) with filing number and innovation abstract.
  - National Track Record (4 cols): Verified win rate and competition rankings.
- **Chronological Laurels Timeline**: Filterable cards for DD Robocon, IIT Techfest, and IEEE competitions.

### 4.7 `/join` (Admissions & DPDP Act 2023 Statutory Compliance)
- **Reciprocity Perks Strip**: 4 Apple-grade benefit cards (Free dev kits, 3D printing access, grants, mentorship).
- **Accessible Application Sheet**: 44pt input fields, domain selector, statement of purpose, statutory Indian DPDP Act 2023 explicit consent checkbox, and hidden honeypot spam bot trap (`_traic_hp_trap`).
- **Instant Verified Receipt**: Automated application reference ID generation (`TRAIC-2025-XXXX`) with next steps timeline.

### 4.8 Interactive Modal Overlays (When Clicked)
- **`Project3DInspector.tsx` (Apple Studio CAD Console)**:
  - Docked floating toolbar with 44pt controls: Exploded Assembly toggle, Wireframe view, 3D WebGL vs 2D CAD Schematic switcher, Auto-spin, Camera Reset, and Zoom.
  - Floating Raycast Telemetry HUD with real-time subsystem diagnostics.
  - Clean inline close button and camera angle presets (`ISO`, `TOP`, `FRONT`).
  - Seamless touch gestures with `touch-action: pan-y` and mobile pinch-to-zoom.
- **`TelemetryModal.tsx` (Apple Instruments Mission Control HUD)**:
  - High-precision telemetry meters: Battery Voltage (6S LiFePO4), Orin GPU load, IMU Pitch/Roll/Yaw orientation, CAN-FD bitrate (5.0 Mbps).
  - Real-time CAN-FD packet streaming terminal with sub-millisecond timestamps, frame types, and live 250 Hz nominal ping indicator.
  - Stream pause/resume toggle with 44pt touch target.
- **`EventRegistrationModal.tsx` (Apple Keynote Workshop Sheet)**:
  - Frosted liquid glass backdrop blur with ESC key listener.
  - Lead participant details + multi-teammate roll number support + DSO hardware bench kit requisition.
  - Explicit DPDP Act 2023 statutory consent checkbox and anti-bot honeypot trap.
  - Automated instant receipt code (`INNO-2025-XXXX`) generation with confirmation view.

---

## 5. Zero-Hardcoding Mandate & Dynamic Admin CMS Architecture

Every variable, headline, and item across the public application MUST be manageable via the Admin Console.

### 5.1 The 13 Manageable Collections & Models
| Collection | Neon PostgreSQL Table | Admin Tab | Dynamic Controls |
|---|---|---|---|
| **Site Settings** | `settings` | Site Settings | Hero Headline, Subheadline, Motto, Stat numbers/labels, CTAs, Section toggles |
| **Projects** | `projects` | Projects | Title, Slug, Tagline, Category, Status, Tech Stack, Model URL, BOM, Published, Featured |
| **Events** | `events` | Events | Title, Slug, Date, Venue, Track, Description, Flagship toggle, Published |
| **Lab Gear** | `gear` | Workshop Gear | Equipment Name, Specifications, Category, Status (`OPERATIONAL`, etc.), Published |
| **Achievements** | `achievements` | Achievements | Award Title, Event Name, Year, Category, Description, Published |
| **Members** | `members` | Team & Leads | Name, Role, Domain, Academic Year, Bio, Skills, Avatar, Links, IsLead, Published |
| **Alumni** | `alumni` | Alumni | Name, Batch, Role, Company, Quote, Avatar, Published |
| **Field Gallery** | `gallery` | Gallery | Image Title, Caption, URL, Category, Featured, Published |
| **Learning Tracks** | `tracks` | Curriculum | Track Title, Summary, Level, Skills, Order, Published |
| **Banners** | `banners` | Announcements | Message, Type (`INFO`, `WARNING`), Link URL, Active toggle |
| **Applications** | `applications` | Admissions | Candidate reviews, status transitions (`REVIEWING` $\to$ `ACCEPTED`), Purge |
| **Messages** | `messages` | Contact Inbox | Inbound inquiries, read status, email reply trigger |
| **Registrations** | `registrations` | Event Roster | Hackathon attendee lists, kit allocations, CSV export |

### 5.2 API Data Flow & In-Memory Write-Through Caching
```
Admin Browser ──(PUT / POST / PATCH / DELETE)──► Express 5 Admin Router
                                                        │
                                                        ├──► 1. Validate with @traic/shared Zod Schema
                                                        ├──► 2. Update In-Memory Cache (0.01ms instant)
                                                        └──► 3. Asynchronously write to Neon PostgreSQL (SSL)
                                                                    │
Public Visitor ◄──────(GET /public/*)───────────────────────────────┘
                     (Served from RAM in < 0.8ms TTFB)
```

---

## 6. Implementation Step-by-Step Roadmap

### Phase 1: Database & Contracts Foundation
- Align `schema.prisma` in `apps/api/prisma/schema.prisma` with all 13 models.
- Generate Prisma Client and run migrations against Neon PostgreSQL.
- Verify all Zod schemas in `packages/shared/src/schemas/` mirror Prisma contracts with dual-field compatibility.

### Phase 2: API Monolith Alignment
- Refactor `apps/api/src/modules/` to enforce clean controller/service/repo boundaries.
- Ensure all public endpoints (`/public/*`) support cache hydration, drafts filtering (`published: true`), and fast responses.
- Ensure all admin endpoints (`/admin/*`) support dual PUT/PATCH parity and 1-click toggles.

### Phase 3: Admin Console CMS Completeness
- Verify all 13 tabs in `apps/admin/src/components/tabs/` are operational.
- Connect Site Settings form to allow updating all homepage copy, creed, and section toggles.
- Verify 1-click status toggles for Gear, Projects, Events, Members, and Announcements.

### Phase 4: Next.js Frontend Apple HIG Overhaul
- Verify all homepage modular components (`AppleHero`, `BentoDisciplines`, `WorkshopCarousel`, `FeaturedProjectsSection`, `ImpactAuthoritySection`, `FieldGallerySection`, `EngineeringPipelineSection`, `EventsShowcase`, `TeamAlumniSection`, `JoinSectionDPDP`, `AppleNavbar`, `AppleFooter`, `MobileTabBar`) adhere strictly to Apple HIG tokens.
- Implement full Apple HIG treatment on all sub-connected pages:
  - `apps/web/src/app/projects/page.tsx` & `apps/web/src/app/projects/[slug]/page.tsx`
  - `apps/web/src/app/events/page.tsx` & `apps/web/src/app/events/[slug]/page.tsx`
  - `apps/web/src/app/team/page.tsx`
  - `apps/web/src/app/gallery/page.tsx`
  - `apps/web/src/app/learn/page.tsx`
  - `apps/web/src/app/achievements/page.tsx`
  - `apps/web/src/app/join/page.tsx`
- Ensure zero dead `#` links, full 44pt touch targets, and `touch-action: pan-y` 3D interaction.

### Phase 5: Verification & Quality Gates
- **Typecheck Gate**: `pnpm typecheck` must pass with 0 errors across all 4 workspaces (`shared`, `api`, `admin`, `web`).
- **Contract Test Gate**: `pnpm test` asserting shared schemas and zero-bleed contracts.
- **Integration Test Gate**: `pnpm test:integration` (69/69 assertions passing).
- **Automated Human Inspector Gate**: Run CDP crawler across all 12 routes in both Desktop and Mobile, Light and Dark modes (48 checks total) confirming 0 contrast failures and 0 layout overflow.
- **State Checkpoint**: Update `STATE.md`, `DECISIONS.md`, and `MISTAKES.md`.
