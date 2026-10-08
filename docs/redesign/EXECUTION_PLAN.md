# TRAIC — COMPLETE UI/UX ARCHITECTURE & EXECUTION PLAN
> Version: FINAL · Model: EXECUTE CODE ONLY · No planning messages after this.
> Date: 2026-10-08

---

## PROBLEM WITH PREVIOUS SESSIONS

Every session wrote docs, not code. Zero actual UI was shipped.
This plan ends that. Every section below is an order to the AI — execute it, don't discuss it.

---

## THE ONLY THINGS THE AI IS ALLOWED TO DO

1. Write `*.tsx`, `*.ts`, `*.css` files
2. Run `pnpm -r typecheck`, `pnpm test`, `pnpm dev`
3. Fix errors until gates pass
4. Update `STATE.md` at end

**Not allowed:** write planning markdown, ask clarifying questions, summarize what it did in chat.

---

## APPLE DESIGN SYSTEM LAWS (ENFORCED ON EVERY LINE OF JSX)

### Typography — Apple SF Pro (web equivalent)
Apple uses SF Pro internally. On web, the closest system-stack + Google Fonts approach:

```
Display/Headlines: Space Grotesk (loaded via next/font — already in layout.tsx)
Body copy: Inter (loaded via next/font — already in layout.tsx)  
Monospace/specs: JetBrains Mono (loaded via next/font — already in layout.tsx)
```

**Type Scale (enforced, no deviations):**
| Role | Class | Size | Weight | Tracking |
|---|---|---|---|---|
| `display-xl` | Hero headline | `clamp(3rem,7vw,5.5rem)` | 700 | `-0.03em` |
| `display-lg` | Section title | `clamp(2rem,4vw,3rem)` | 700 | `-0.025em` |
| `display-md` | Card title | `1.5rem / 1.75rem` | 600 | `-0.02em` |
| `body-lg` | Lead paragraph | `1.125rem` | 400 | `0` |
| `body-md` | Regular body | `1rem` | 400 | `0` |
| `mono-sm` | Spec chips, badges | `0.8125rem` | 500 | `+0.04em` |
| `eyebrow` | Section labels | `0.6875rem` | 600 | `+0.1em` (uppercase) |

### Color System (60-30-10 Rule)
| Token | Dark value | Light value | Role |
|---|---|---|---|
| `--canvas` | `#000000` | `#fafafc` | 60% — page background |
| `--canvas-2` | `#0a0a0c` | `#f1f5f9` | Sub-sections |
| `--card` | `#111113` | `#ffffff` | 30% — card surfaces |
| `--card-2` | `#1c1c1e` | `#f8fafc` | Elevated popovers, nav |
| `--cyan` | `#64d2ff` | `#0284c7` | 10% — ONE accent |
| `--cyan-fg` | `#000000` | `#ffffff` | Text ON cyan surfaces |
| `--ink-1` | `#f5f5f7` | `#0f172a` | Primary text (14.2:1 contrast) |
| `--ink-2` | `#86868b` | `#475569` | Secondary text |
| `--ink-3` | `#48484a` | `#94a3b8` | Tertiary / disabled |
| `--emerald` | `#34d399` | `#065f46` | Status: OPERATIONAL (7.1:1 AAA) |
| `--border` | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.07)` | Card borders |

### Spacing — 8pt Grid
All padding/margin must be multiples of 8px: `8, 16, 24, 32, 40, 48, 64, 80, 96, 128px`
Tailwind equivalents: `p-2, p-4, p-6, p-8, p-10, p-12, p-16, p-20, p-24, p-32`

### Interaction Laws
| Law | Rule | Enforcement |
|---|---|---|
| **Fitts's Law** | Every tap target ≥ 44×44px | `min-h-[44px] min-w-[44px]` on ALL buttons/links |
| **Hick's Law** | 1 primary CTA per viewport fold | Never two cyan buttons in the same view |
| **Miller's Law** | Max 7 items in any list/nav | Nav = 5 links max + 1 CTA |
| **Von Restorff** | One thing stands out (cyan) | No competing accents: no red, no yellow, no orange |
| **Jakob's Law** | Familiar patterns | Links look like links, buttons look like buttons |
| **Doherty Threshold** | < 400ms feedback | Buttons must have `:hover` and `:active` states |

### Geometry
- Card radius: `rounded-2xl` (16px) for content cards, `rounded-3xl` (24px) for hero containers
- Nav glass: `backdrop-blur-xl saturate-150 bg-card-2/80`
- Button radius: `rounded-full` for primary CTA, `rounded-xl` for secondary

### Accessibility (WCAG 2.2 AA minimum, AAA where possible)
- All images: `alt=""` (decorative) or descriptive alt text
- All forms: `<label htmlFor>` linked to every input
- All icon-only buttons: `aria-label="..."`
- Skip link: `<a href="#main-content" className="skip-link">` at top of layout
- `prefers-reduced-motion`: wrap all CSS animations
- Focus ring: `focus-visible:ring-2 focus-visible:ring-cyan`

---

## COMPLETE PAGE INVENTORY — 12 PAGES + SUB-PAGES

### Why 12 pages (reasoning):
| Page | Why it must exist |
|---|---|
| `/` | First impression — establishes authority in 5s |
| `/about` | Who we are, values, founding story, faculty advisor |
| `/team` | Coordinator, Co-coordinator, Domain Leads, Active Members — distinct roles |
| `/alumni` | Proof of career outcomes — strongest recruitment conversion tool |
| `/projects` | Physical machines = proof of competence |
| `/projects/[slug]` | Deep dive per machine — essential for recruiters and evaluators |
| `/learn` | Curriculum — why students should join |
| `/gear` | DIA Labs physical instruments — unique selling point |
| `/self-host` | Infrastructure program — differentiator from every other club |
| `/achievements` | National proof — SIH, Robocon, Patent |
| `/events` | Current and upcoming workshops/hackathons |
| `/events/[slug]` | Individual event with registration |
| `/gallery` | Visual proof of culture, lab life, competitions |
| `/join` | Conversion — DPDP-compliant application |
| `/contact` | Email + location + contact form |

**Future (do not build now, but plan for):**
- `/blog` — Project write-ups in MDX
- `/resources` — curated reading lists per track

---

## PAGE-BY-PAGE CONTENT SPEC

---

### PAGE 1: `/` — Homepage

**Goal:** Establish authority in 5 seconds. Single CTA. No clutter.

**Section 1 — Hero**
```
[EYEBROW] DESIGN & INNOVATION ACADEMY — COER UNIVERSITY
[H1] We build the machines  
     that think in the real world.
[SUBHEAD] A collegiate engineering community mastering custom circuit boards,
          autonomous robotics, and self-hosted Linux infrastructure — from the ground up.
[CTA] Apply for Cohort 2026 →
[LINK] Explore our disciplines ↓

[4 BENCHMARK CHIPS — horizontal row]
  480 MHz  |  ARM Cortex-M7 real-time controller
  26 TOPS  |  Hailo-8 edge neural accelerator
  5 Mbps   |  CAN-FD deterministic bus
  4-Layer  |  FR-4 impedance-controlled PCB
```

**Section 2 — 4 Pillars (asymmetric, NOT equal grid)**
```
Large left card (Embedded Firmware) + 3 stacked right cards (PCB, Robotics, Self-Host)
```

**Section 3 — Lab Bento (DIA Labs gear)**
```
Eyebrow: DIA LABS — BLOCK C-302
Dense bento: 4 instrument tiles with OPERATIONAL status badges
FROM: GET /public/gear (top 4 by priority)
```

**Section 4 — Top Machine (Featured Project)**
```
8:4 split: Image/schematic left, specs + BOM chips right
FROM: GET /public/projects (first published project)
```

**Section 5 — Credentials Strip**
```
[ SIH 2024 — 1st Place ] [ Robocon AIR 4 ] [ Patent Filed IPO ] [ 90+ Active Members ]
FROM: GET /public/settings (stats), GET /public/achievements (top 3)
```

**Section 6 — Upcoming Event Preview**
```
FROM: GET /public/events (next upcoming, limit=1)
Full-width editorial card with date pill
```

**Section 7 — Apply CTA Footer Strip**
```
Big headline: "Ready to build real things?"
Single CTA: Apply for Cohort 2026
```

**Data fetches (server-side, page.tsx):**
- `GET /public/settings`
- `GET /public/projects`
- `GET /public/gear`
- `GET /public/achievements`
- `GET /public/events`

---

### PAGE 2: `/about` — Our Story

**Goal:** Build trust. Explain what TRAIC is for humans, not engineers.

**Sections:**
1. **Mission Statement** — Full-bleed quote: *"We do not lecture from slides. We put soldering irons into your hands on day one."*
2. **Founding Story** — When founded, why, original members
3. **Three Values** (Honor · Honesty · Sacrifice) — editorial triple-column
4. **Official Creed** — `FROM: GET /public/settings (mottoText)`
5. **Faculty Advisor** — Name, department, photo
6. **Institutional Affiliation** — COER University, AICTE, NIRF

**Admin Control:** `SettingsTab` — club name, tagline, motto, contact email, lab location

---

### PAGE 3: `/team` — Active Members

**Goal:** Show clear leadership hierarchy and domain expertise.

**Section 1 — Coordinators**
```
Large editorial card: Coordinator (COORDINATOR role)
Large editorial card: Co-Coordinator (CO_COORDINATOR role)
Each: photo, name, domain, year, bio, social links (GitHub, LinkedIn)
```

**Section 2 — Domain Leads**
```
Asymmetric 3+2 grid of LEAD role members
Each card: monogram (if no photo), name, domain (Embedded/PCB/Robotics/Self-Host/Operations), year
```

**Section 3 — Active Members**
```
Dense grid: MEMBER role
Smaller cards: name, skills chips (from member.skills[]), year
```

**Data:** `GET /public/team` → filter by `position`: COORDINATOR, CO_COORDINATOR, LEAD, MEMBER
**Admin:** Members tab — add/edit/archive members with role, domain, socials

---

### PAGE 4: `/alumni` — Graduated Builders

**Goal:** Proof of career outcomes. Most powerful conversion tool for applicants.

**Section 1 — Alumni Hero Statement**
```
Eyebrow: WHERE TRAIC ALUMNI BUILD
Headline: "Our builders are at the frontier."
```

**Section 2 — Placement Strip (logos or names)**
```
Texas Instruments · Qualcomm · Bosch Engineering · ISRO · NVIDIA · Microsoft
```

**Section 3 — Alumni by Batch**
```
Grouped by graduation year (batch field)
Each alumni card:
  - Photo or monogram
  - Name, Batch year
  - Current Role @ Company
  - Quote (if available)
  - LinkedIn link
```

**Section 4 — Alumni Stats**
```
[ X+ Companies ] [ Y+ Placements ] [ Z Batches ]
```

**Data:** `GET /public/alumni`
**Admin:** Alumni tab — name, batch, currentRole, company, quote, photo

---

### PAGE 5: `/projects` — Hardware Archive

**Goal:** Physical machines = proof of engineering competence.

**Section 1 — Hero**
```
Eyebrow: HARDWARE ARCHIVE
Headline: "Machines we designed and built."
```

**Section 2 — Featured Machine (12-col spotlight)**
```
First published project (highest priority):
  Left 8 col: Large schematic or photo
  Right 4 col: Title, category tags, 3-line description, BOM silicon chips
```

**Section 3 — All Projects Grid (asymmetric)**
```
NOT uniform 3-col. Mix of:
  - One 2/3 width card (important project)
  - Two 1/3 width cards
  - Full-width divider with category label
Each card: title, tech stack chips, year, link to detail page
```

**Sub-page `/projects/[slug]`:**
```
Section 1: Title + category + year
Section 2: 2-col split — image left, specs right
Section 3: Problem → Solution narrative (descriptionMd rendered)
Section 4: Silicon BOM chips (from project.specs / project.bom)
Section 5: Tech stack used
Section 6: Team members who built it (from project.team)
Section 7: Competition result (linked achievement if any)
```

**Data:** `GET /public/projects`, `GET /public/projects/:slug`
**Admin:** Projects tab — full CRUD + publish/archive toggle

---

### PAGE 6: `/learn` — Engineering Curriculum

**Goal:** Show the structured pathway from zero to systems builder.

**Section 1 — Philosophy**
```
Eyebrow: THE APPRENTICESHIP
Headline: "From zero to systems builder."
Body: Explain hands-on approach — no slides, just oscilloscopes and soldering irons
```

**Section 2 — The 4 Tracks (NOT uniform grid)**
```
Track 1 — Embedded Firmware (large, left)
  ARM Cortex-M7, STM32H7, FreeRTOS, bare-metal C, DMA, CAN-FD
  Tools: STM32CubeIDE, J-Link, Saleae Logic Analyzer

Track 2 — Hardware & PCB Design (medium, right)
  KiCad/Altium, 4-layer FR-4, 50Ω impedance, SMD soldering
  Tools: KiCad 8.0, JLCPCB pipeline, Hakko FR-810B

Track 3 — Autonomous Robotics & AI (medium, left)
  ROS2 Humble, SLAM, Jetson Orin, Hailo-8
  Tools: ROS2, RViz, Gazebo, OpenCV, PyTorch→TensorRT

Track 4 — Self-Hosted Systems (medium, right)
  Linux, Proxmox, Docker, WireGuard, Forgejo, vLLM
  Tools: Debian/Ubuntu Server, Proxmox VE, Prometheus, Grafana
```

**Section 3 — 5-Stage Pipeline**
```
LEARN → BUILD → TEST → DEPLOY → COMPETE
Horizontal progress strip with description for each stage
```

**Section 4 — What You'll Build**
```
Link to 2-3 notable student projects from /public/projects
```

**Data:** `GET /public/tracks`, `GET /public/projects`
**Admin:** Tracks tab — edit track title, summary, tools, outcomes, order

---

### PAGE 7: `/gear` — DIA Labs

**Goal:** Show physical legitimacy. Real instruments, real capability.

**Section 1 — Lab Introduction**
```
Eyebrow: DIA LABS — BLOCK C-302
Headline: "Where hardware engineering happens."
Body: Brief description — access for active members, bench booking process
```

**Section 2 — 5 Lab Stations**
```
Station 1 — Test & Measurement Bench
  Tektronix MDO3024 1GHz Oscilloscope [● OPERATIONAL]
  Rigol DSA815-TG Spectrum Analyzer [● OPERATIONAL]
  Siglent SPD3303X DC Power Supply [● OPERATIONAL]

Station 2 — Soldering & Rework Bench
  Hakko FR-810B Hot Air Rework [● OPERATIONAL]
  Hakko FX-888D Soldering Iron [● OPERATIONAL]
  AmScope Stereo Zoom Microscope [● OPERATIONAL]

Station 3 — Additive Manufacturing
  Bambu Lab X1-Carbon [● OPERATIONAL]
  Creality Ender-3 V3 × 2 [● OPERATIONAL]
  Filament Dryer [● OPERATIONAL]

Station 4 — Machining & Fabrication
  CNC 3018-Pro PCB Router [● OPERATIONAL]
  Drill Press & Bench Grinder [● OPERATIONAL]
  Digital Vernier Calipers [● OPERATIONAL]

Station 5 — Edge Compute Staging
  NVIDIA Jetson Orin Nano (67 TOPS) [● OPERATIONAL]
  Hailo-8 M.2 Modules [● OPERATIONAL]
  Raspberry Pi 5 (8GB) × 4 [● OPERATIONAL]
```

**Section 3 — Safety & Access Rules**
```
- ESD wrist strap mandatory at all electronics benches
- No soldering after 22:00 without buddy present
- Fume extraction must be active during soldering and 3D printing
- Bench booking via DIA Labs portal (link to self-hosted Forgejo issue tracker)
```

**Data:** `GET /public/gear` (real equipment from DB)
**Admin:** Gear tab — name, model, category, status, bench assignment

---

### PAGE 8: `/self-host` — Infrastructure Program

**Goal:** Explain the most unique differentiator. No other college club runs bare-metal servers.

**Section 1 — Philosophy**
```
Eyebrow: SYSTEMS SOVEREIGNTY
Headline: "We own our infrastructure. Every bit of it."
Body: Why we reject cloud lock-in and what students learn instead.
```

**Section 2 — Server Rack Specs**
```
Node 1 — Hypervisor Alpha
  Dell PowerEdge 1U · Dual Intel Xeon · 128GB ECC RAM · 4TB NVMe ZFS
  Running: Proxmox VE 8.2

Node 2 — GPU Inference Rig
  AMD Ryzen 9 7900X · 64GB DDR5 · 2× RTX 4080 Super
  Running: vLLM / Ollama (private code assistant for members)

Node 3 — Storage & Backup
  TrueNAS SCALE · 6× 8TB HDDs · RAID-Z2
  Running: ZFS snapshots, CAD model storage, telemetry archives
```

**Section 3 — Running Services**
```
[Forgejo] Private Git mirrors + Woodpecker CI runners
[BookStack] Internal engineering wiki + pinout docs
[Vaultwarden] Encrypted credential management
[WireGuard] Mesh VPN — off-campus access to lab subnet
[Uptime Kuma] 24/7 availability monitoring
[Ollama/vLLM] Private LLM inference (no data leaves the building)
```

**Section 4 — Student Access**
```
Active members receive:
  ✓ Local Linux shell account
  ✓ Private container namespace (LXC or Docker)
  ✓ WireGuard config for remote lab access
  ✓ Access to private Forgejo repositories and CI runners
```

**Data:** Static (no API needed — infra specs are stable)
**Admin:** No admin tab needed (static content — edit via code)

---

### PAGE 9: `/achievements` — National Track Record

**Goal:** Hard proof of competitive excellence and IP output.

**Section 1 — Hero**
```
Eyebrow: NATIONAL TRACK RECORD
Headline: "We compete. We win. We file patents."
```

**Section 2 — Top 3 Awards (asymmetric bento)**
```
Large card: SIH 2024 — 1st Place National Champions
  Ministry of Education & AICTE Hardware Edition
  Prize: ₹1,00,000 + prototype incubation
  Submission: Autonomous Pipeline Inspection Drone

Medium card: DD Robocon 2024 — All-India Rank 4
  Custom PID dual-flywheel ball launcher
  0.1mm repeatability at national finals

Medium card: Patent Filed — IPO Docket No. 2024110892
  "Distributed Fault-Tolerant CAN-FD Communication Bus for UAV Safety Systems"
  Status: Under examination, Indian Patent Office, New Delhi
```

**Section 3 — All Achievements Grid**
```
Filtered view by level: NATIONAL | EXTERNAL | INTERNAL
FROM: GET /public/achievements
```

**Section 4 — Alumni Placement Strip**
```
"Where TRAIC builders work today:"
Texas Instruments · Qualcomm · Bosch Engineering · ISRO · NVIDIA
```

**Data:** `GET /public/achievements`, `GET /public/alumni`
**Admin:** Achievements tab — title, event, level, rank, year, certificate URL

---

### PAGE 10: `/events` — Workshops & Competitions

**Goal:** Show active, ongoing community life.

**Section 1 — Upcoming Events**
```
Eyebrow: UPCOMING
Featured event card (next event by startsAt)
  - Title, date + time, venue, mode badge (OFFLINE/ONLINE/HYBRID)
  - Register button (links to event detail or external URL)
```

**Section 2 — All Events List**
```
Vertical editorial list, NOT grid:
  Date chip | Title | Type badge (Workshop/Hackathon/Boot Camp) | Venue | Register link
```

**Sub-page `/events/[slug]`:**
```
Section 1: Hero — title, date, venue, mode badge
Section 2: Event description (descriptionMd rendered as markdown)
Section 3: Event details — duration, prerequisites, team size
Section 4: Registration form (if registerUrl is null — in-app form)
  Form fields: Name, Roll No, Email, Team Name, Team Members
  DPDP consent checkbox
  Honeypot field
  Submit → INNO-2026-XXXX receipt code
```

**Data:** `GET /public/events`, `GET /public/events/:slug`
**Admin:** Events tab — full CRUD, startsAt/endsAt, venue, mode, bannerAssetUrl, photos[], status toggle

---

### PAGE 11: `/gallery` — Visual Archive

**Goal:** Show lab culture, competition atmosphere, and physical builds.

**Section 1 — Category Filter**
```
Pills (segmented, 44px touch targets):
  All | Robotics | Fabrication | Competition | Workshop | Lab Life
```

**Section 2 — Masonry Grid**
```
Pinterest-style variable-height masonry
Featured items (featured=true): larger tiles
Each tile: image, title overlay on hover, caption, location, date
Categories map to GalleryCategory enum: ROBOTICS | FABRICATION | COMPETITION | WORKSHOP | LAB_LIFE
```

**Data:** `GET /public/gallery`
**Admin:** Gallery tab — upload imageUrl, caption, category, date, location, featured toggle

---

### PAGE 12: `/join` — Admissions

**Goal:** Convert the most committed applicants. No casual sign-ups.

**Section 1 — What We Offer**
```
4 benefit strips:
  ✓ Access to DIA Labs (Tektronix, Bambu Lab, CNC)
  ✓ Real hardware projects competing at national level
  ✓ Self-hosted Linux shell accounts and private compute
  ✓ Alumni network at TI, Qualcomm, Bosch, ISRO
```

**Section 2 — Selection Process**
```
3 phases:
  Phase 1: Written submission (this form)
  Phase 2: DIA Labs practical task (circuit debug or embedded puzzle)
  Phase 3: Technical interview with domain leads
```

**Section 3 — Application Form (DPDP 2023 Compliant)**
```html
<form action="POST /public/applications">
  Full Legal Name (required)
  University Roll Number (required)
  Institutional Email (required, validated)
  Domain of Interest: [Embedded | PCB Design | Robotics | Self-Hosted Systems] (segmented select, required)
  Problem Statement: "Describe the hardest technical problem you've faced" (textarea, max 500 chars)
  
  [DPDP CONSENT — REQUIRED]
  ☐ I give TRAIC explicit consent to process my application data 
    for cohort admissions under the DPDP Act 2023. My data will 
    not be shared with third parties.
  
  [HIDDEN HONEYPOT]
  <input name="_traic_hp_trap" style="position:absolute;opacity:0;pointer-events:none" tabIndex={-1} />
  
  [Submit] Apply Now →
  
  [On success] Show: "Application received. Reference: TRAIC-2026-XXXX"
</form>
```

**Data:** `POST /public/applications`
**Admin:** Applications tab — review submissions, mark status (PENDING/REVIEWING/ACCEPTED/REJECTED)

---

### PAGE 13: `/contact` — Get in Touch

**Goal:** Simple. One location, one email, one form.

```
Location: Advanced Robotics Lab, Block C-302, COER University
Email: traic@coer.ac.in
GitHub / LinkedIn / Instagram links

Contact Form:
  Name, Email, Subject, Message
  Rate limited on backend (existing middleware)
  POST /public/contact
```

**Data:** `GET /public/settings` (contactEmail, labLocation, socials), `POST /public/contact`
**Admin:** Settings tab — contactEmail, labLocation, socials. Messages tab — view received messages.

---

## SHARED COMPONENTS (build once, used everywhere)

| Component | Purpose |
|---|---|
| `AppleNavbar.tsx` | 52px floating glass bar, 5 nav links, 1 CTA |
| `AppleFooter.tsx` | 4 columns: Hardware / Community / Facility / Connect |
| `MobileTabBar.tsx` | Bottom dock for ≤768px, icons only |
| `DynamicBanner.tsx` | Top announcement bar from `/public/banners` |
| `SFSymbols.tsx` | SVG icon library — no Font Awesome |
| `ThemeToggle.tsx` | Dark/Light segmented pill |

### Navigation links (EXACTLY 5 + 1 CTA):
```
/projects  → Hardware
/learn     → Curriculum
/gear      → DIA Labs
/achievements → Honors
/team      → People
[CTA]      → Apply (→ /join)
```

---

## ADMIN COVERAGE MAP

Every public data field must have an admin edit surface:

| Public Page | Admin Tab | Fields Controlled |
|---|---|---|
| `/` hero | Settings | heroHeadline, heroSubheadline, heroPrimaryCtaText, stats |
| `/about` | Settings | clubName, tagline, mottoText, labLocation, contactEmail |
| `/team` | Members | name, photoUrl, bio, domain, position (COORDINATOR/CO_COORDINATOR/LEAD/MEMBER), skills, order |
| `/alumni` | Alumni | name, batch, currentRole, company, quote, photoUrl, socials |
| `/projects` | Projects | title, slug, descriptionMd, category, techStack, specs, bom, team, status |
| `/learn` | Tracks | title, slug, summary, level, tools, outcomes, modules, order |
| `/gear` | Gear | name, model, category, specifications, status, priority, isPublished |
| `/achievements` | Achievements | title, eventName, level, rank, date, description, certificateAssetUrl, photos |
| `/events` | Events | title, slug, tagline, descriptionMd, type, mode, venue, startsAt, endsAt, bannerAssetUrl, photos |
| `/gallery` | Gallery | title, caption, imageUrl, category, date, location, featured, projectSlug |
| Announcement bar | Banners | message, linkUrl, type, isActive, priority |
| Applications | Applications | Review/status update only (no create from admin) |
| Contact messages | Messages | View only |

---

## IMPLEMENTATION SEQUENCE (15 STEPS — ORDERED)

AI must execute in ORDER. Complete each step before next.

```
STEP  1 → globals.css  — complete design tokens
STEP  2 → DynamicBanner.tsx  — create missing component
STEP  3 → layout.tsx  — fix imports, wire DynamicBanner in nav
STEP  4 → AppleNavbar.tsx  — 5 exact links (Hardware/Curriculum/DIA Labs/Honors/People)
STEP  5 → AppleFooter.tsx  — confirm 4 columns correct
STEP  6 → page.tsx + ClientHome.tsx  — Homepage, 7 sections
STEP  7 → /about/page.tsx  — Club story, values, faculty
STEP  8 → /team/page.tsx  — Coordinators, Leads, Members (fix existing or rebuild)
STEP  9 → /alumni/page.tsx  — Batch grid, placement strip, quotes
STEP 10 → /projects/page.tsx + [slug]/page.tsx  — remove 3D, rebuild clean
STEP 11 → /learn/page.tsx  — 4 tracks, 5-stage pipeline
STEP 12 → /gear/page.tsx  — 5 stations, status badges
STEP 13 → /self-host/page.tsx  — rack specs, services, student access
STEP 14 → /achievements/page.tsx  — asymmetric award bento
STEP 15 → /events/page.tsx + [slug]/page.tsx  — list + detail + registration
STEP 16 → /gallery/page.tsx  — masonry with category filter
STEP 17 → /join/page.tsx  — DPDP form + honeypot + receipt
STEP 18 → /contact/page.tsx  — contact form
STEP 19 → /contact/page.tsx  — contact form
STEP 20 → pnpm -r typecheck → fix ALL errors → 0
STEP 21 → pnpm test → 6/6 · pnpm test:integration → 69/69
STEP 22 → Update STATE.md
```

---

## DEFINITION OF DONE

- [ ] All 13 routes exist and render real data
- [ ] `pnpm -r typecheck` = 0 errors
- [ ] `pnpm test` = 6/6 passing
- [ ] `pnpm test:integration` = 69/69 passing
- [ ] Zero imports of: `Three.js`, `icons.tsx`, `AnimeScrollObserver`, `TelemetryModal`, `Project3DInspector`, `ThreeHeroScene`
- [ ] Every button `min-h-[44px]`
- [ ] Every form has DPDP consent checkbox
- [ ] Every public form has `_traic_hp_trap` honeypot
- [ ] No dead `href="#"` links
- [ ] No horizontal scroll at 375px viewport
- [ ] Dark mode and light mode both work
