# TRAIC Master System Engineering Specification: HLD & LLD

> **Status**: Production Blueprint & Engineering Law  
> **Architecture**: Apple Human Interface Guidelines (HIG) + Modular Monolith + Neon Serverless PostgreSQL  
> **Scope**: Frontend, Backend, Database, Security, Animation, Compliance, and Autonomous Human-Inspector Verification  

---

## 1. High-Level Design (HLD)

### 1.1 System Architecture Topology

The TRAIC platform is architected as an ultra-reliable, high-performance monorepo designed to serve prospective students, engineering recruiters, hardware researchers, and student developers with sub-millisecond response times and zero downtime.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT & USER AGENT TIER                                 │
│  [ Desktop Chrome/Safari ]      [ Mobile iOS/Android ]      [ Evaluator / Recruiter ]  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              EDGE & SECURITY GATEWAY TIER                              │
│  [ Cloudflare Edge WAF / CDN ]                                                         │
│  ├─ TLS 1.3 Strict Termination & SSL Wildcard Routing                                  │
│  ├─ HTTP/3 (QUIC) Transport Protocol & Global Anycast Caching                          │
│  ├─ DDoS Shield & Ingress Rate Limiting (100 req/min/IP public, 10 req/15min/IP auth)  │
│  └─ Security Headers (CSP, HSTS Preload, X-Frame-Options: DENY, X-Content-Type: nosniff)│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
┌──────────────────────────────────────────┐  ┌──────────────────────────────────────────┐
│         apps/web (Next.js 15)            │  │          apps/admin (Vite SPA)           │
│  ├─ App Router with Hybrid SSG / ISR     │  │  ├─ Isolated Admin Subdomain             │
│  ├─ Apple HIG Scrollytelling Showcase    │  │  ├─ RBAC-Gated Single Page App           │
│  ├─ Dynamic Layout / Banner Alignment    │  │  ├─ Strict CSP (No unsafe-eval)          │
│  ├─ Event Registration Modal Flow        │  │  ├─ Hardware Gear Inventory CMS          │
│  └─ Zero-Bleed WCAG AAA Token Engine     │  │  └─ Site Setting Feature Flags           │
└────────────────────┬─────────────────────┘  └────────────────────┬─────────────────────┘
                     │                                             │
                     └──────────────────────┬──────────────────────┘
                                            │ Ingress HTTP/JSON (Zod Validated)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND SERVICE MONOLITH TIER                              │
│  [ apps/api (Node.js + Express 5 Modular Monolith) ]                                   │
│  ├─ Centralized Zod Boundary Gateways (packages/shared Contract)                       │
│  ├─ In-Memory V8 Heap RAM Cache (< 0.1ms TTFB for all public read queries)             │
│  ├─ Async Write-Through Mutation Engine                                                │
│  ├─ Timing-Safe Argon2id Password Cryptography (`crypto.timingSafeEqual`)              │
│  ├─ Indian DPDP Act 2023 Statutory Consent Vault                                       │
│  ├─ Silent Spam Honeypot Interceptor (`_traic_hp_trap`)                                │
│  └─ Pino Structured JSON Logging with X-Correlation-ID Tracking                        │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Parameterized SQL over TLS (pg.Pool)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               AUTHORITATIVE DATABASE TIER                               │
│  [ Neon Serverless PostgreSQL Cloud Engine ]                                           │
│  ├─ SSL-Enforced Remote Postgres Cluster                                               │
│  ├─ Dedicated Connection Pooling with Graceful Drain on SIGINT/SIGTERM                 │
│  ├─ 11 System Tables with JSONB Schema Migration:                                      │
│  │   • projects      • events         • achievements     • members     • alumni        │
│  │   • tracks        • banners        • gallery          • settings    • applications  │
│  │   • gear                                                                            │
│  └─ Strict ACID Transactions & Row-Level Consistency for Application Submissions       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Monorepo Boundary Isolation & Dependency Inversion

```
                         ┌───────────────────┐
                         │  packages/shared  │
                         │  (Zod Schemas &   │
                         │   TS Contracts)   │
                         └─────────▲─────────┘
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
    ┌────────┴────────┐   ┌────────┴────────┐   ┌────────┴────────┐
    │    apps/web     │   │   apps/admin    │   │    apps/api     │
    │  (Next.js 15)   │   │   (Vite SPA)    │   │   (Express 5)   │
    └─────────────────┘   └─────────────────┘   └─────────────────┘
```

1. **`packages/shared`**: Sole source of truth for all data contracts (`ProjectSchema`, `EventSchema`, `ApplicationSchema`, `LabGearSchema`, `SiteSettingSchema`). Contains **zero runtime dependencies** and **never imports from any application package**.
2. **`apps/web`**: Public consumer interface. Strictly forbidden from importing backend drivers (`pg`), server filesystem utilities, or database secrets.
3. **`apps/admin`**: Administrative CRUD control plane. Communicates with `apps/api` via authenticated REST endpoints (`/admin/*`).
4. **`apps/api`**: Modular monolith backend. Strictly forbidden from importing React DOM elements or frontend UI stylesheets.

---

## 2. Low-Level Design (LLD): Frontend Engineering Laws

### 2.1 The Apple Human Interface Guidelines (HIG) Standard

The visual language follows the precision aesthetic of Apple's flagship product showcase pages:
- **Spatial Geometry**: 24px continuous squircles (`border-radius: 24px`) across cards; pill geometry (`border-radius: 9999px`) across action buttons and telemetry status badges.
- **Translucent Glass Surfaces**: Multi-layer frosted glass backdrop (`backdrop-filter: blur(20px) saturate(180%)`) with hairline borders (`rgba(255, 255, 255, 0.08)` in dark mode, `rgba(0, 0, 0, 0.08)` in light mode).
- **Typography Hierarchy**:
  - Hero Headline: SF Pro Display Semibold `clamp(44px, 8.5vw, 88px)` with `-0.035em` letter-tracking.
  - Section Titles: 40px Display Bold with `-0.025em` tracking.
  - Body Text: 16px / 18px SF Pro Text with `1.6` line-height for effortless readability.
  - Hardware Telemetry: JetBrains Mono / SF Mono for clock frequencies, bus widths, and serial packet identifiers.

### 2.2 Cognitive Psychology Laws Applied to UX

| Cognitive Law | Psychological Principle | Concrete TRAIC Platform Implementation |
|---|---|---|
| **Fitts's Law** | Target acquisition time is a function of target distance and width: $T = a + b \log_2(2D/W)$. | All interactive CTA buttons maintain a minimum touch target of $\mathbf{\ge 48\times48px}$ (desktop) and $\mathbf{\ge 44\times44px}$ (mobile). Primary actions span the full thumb reach on mobile docks. |
| **Hick's Law** | Decision time increases logarithmically with the number of choices: $T = b \log_2(n + 1)$. | Top navigation bar is constrained to strictly **5 semantic destinations** (*Work*, *Events*, *Achievements*, *Team*, *Lab*). A single primary CTA ("Join TRAIC") is presented in the top-right lockup. |
| **Miller's Law** | Working memory capacity is limited to $7 \pm 2$ discrete chunks of information. | Bento grids chunk engineering verticals into 6 cards grouped by domain (Robotics, Autonomous Systems, Edge AI, Embedded Firmware, RF Comms, Power Systems). |
| **Von Restorff Effect** | When multiple similar items are presented, the one that differs is most memorable. | Across monochromatic dark slate surfaces, only the focal point receives the **Electric Cyan** accent (`#64D2FF` in dark mode, `#0369A1` in light mode), immediately guiding eye-tracking to primary conversions. |
| **Doherty Threshold** | Productivity soars when user computer interactions occur in $< 400\text{ms}$. | All interactive modal triggers, CAD inspection launches, tab switches, and API queries complete in **$< 50\text{ms}$** client render time. |

### 2.3 Apple Scrollytelling Engine: 60 FPS Hardware Reveal

1. **Elimination of Hero 3D WebGL Clutter**:
   - WebGL context initialization in the initial hero viewport was permanently eliminated to avoid context exhaustion, battery drain, and LCP delays.
   - Interactive 3D CAD inspection is deferred to an on-demand modal (`[ Inspect 3D CAD ]`) and dedicated deep-dive pages (`/projects/[slug]`).
2. **Kinetic Perspective Tilt on Scroll**:
   - The hardware stage responds dynamically to window scroll position with sub-pixel CSS 3D transforms:
   $$\text{stageTilt} = \max(0, 8 - \text{scrollY} \times 0.015)$$
   $$\text{stageScale} = \min(1.02, 0.98 + \text{scrollY} \times 0.00008)$$
   - Executed via `requestAnimationFrame` with zero layout thrashing or repaints (`will-change: transform`).
3. **Four Frosted Glass Hardware Callouts**:
   - Embedded around the aerospace chassis stage:
     - `STM32H753 @ 480MHz` (Triple-bus Cortex-M7 Core)
     - `CAN-FD 5.0 Mbps` (Automotive Differential Telemetry)
     - `RTAB-Map 3D LiDAR` (Simultaneous Localization & Mapping)
     - `Hailo-8 26 TOPS` (Deep Neural Edge Inference)

### 2.4 WCAG 2.2 AAA Contrast Mathematics & Cleanroom Light Mode

Contrast ratios are computed using the official W3C Relative Luminance formula:
$$L = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$$
Where each sRGB channel $C \in \{R, G, B\}$ is linearized:
$$C_{\text{linear}} = \begin{cases} \frac{C}{12.92} & \text{if } C \le 0.04045 \\ \left(\frac{C + 0.055}{1.055}\right)^{2.4} & \text{if } C > 0.04045 \end{cases}$$
The contrast ratio $CR$ between lighter luminance $L_1$ and darker luminance $L_2$ is:
$$CR = \frac{L_1 + 0.05}{L_2 + 0.05}$$

#### Contrast Token Validation Matrix:
| Token Name | Dark Mode Value | Dark Surface Contrast | Light Mode Value | Light Surface Contrast | WCAG Rating |
|---|---|---|---|---|---|
| `--ink-primary` | `#F5F5F7` | **15.8:1** (on `#000000`) | `#0F172A` | **14.2:1** (on `#FFFFFF`) | **WCAG AAA** ($\ge 7.0:1$) |
| `--ink-secondary` | `rgba(235, 235, 245, 0.64)` | **9.2:1** (on `#000000`) | `#334155` | **9.3:1** (on `#F1F5F9`) | **WCAG AAA** ($\ge 7.0:1$) |
| `--ink-tertiary` | `rgba(235, 235, 245, 0.38)` | **5.1:1** (on `#000000`) | `#475569` | **6.8:1** (on `#F1F5F9`) | **WCAG AA** ($\ge 4.5:1$) |
| `--cyan-accent` | `#64D2FF` | **11.4:1** (on `#000000`) | `#0369A1` | **5.48:1** (on `#F8FAFC`) | **WCAG AA** ($\ge 4.5:1$) |
| `--status-emerald`| `#34D399` | **11.2:1** (on `#000000`) | `#065F46` | **7.1:1** (on `#F1F5F9`) | **WCAG AAA** ($\ge 7.0:1$) |

---

## 3. Low-Level Design (LLD): Backend, Database & Security Laws

### 3.1 Modular Monolith Directory Contract
The backend follows strict domain isolation. Each module encapsulates its complete lifecycle:
```
apps/api/src/modules/<domain>/
  ├── <domain>.routes.ts      # HTTP verb and route path declarations
  ├── <domain>.controller.ts  # Request extraction and response envelope packaging
  ├── <domain>.service.ts     # Business logic, state mutations, and validation
  ├── <domain>.repo.ts        # Database queries and cache invalidation
  └── <domain>.schema.ts      # Domain-specific validation (re-exported from @traic/shared)
```

### 3.2 Immutable Response & Error Envelope Standard
Every API response strictly follows the standardized envelope format:
```typescript
// Successful Response Envelope
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    cached?: boolean;
    durationMs?: number;
  };
}

// Sanitized Error Response Envelope (Zero Stack Trace Leaks)
interface ApiErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'RATE_LIMITED' | 'INTERNAL_ERROR';
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  timestamp: string;
}
```

### 3.3 Authoritative Cloud Database & Zero-Latency RAM Cache
1. **Authoritative Store**: Neon Serverless PostgreSQL over TLS 1.3. Direct SQL queries parameterized via `pg.Pool`.
2. **Sub-Millisecond In-Memory RAM Cache**:
   - All 11 public collections (`projects`, `events`, `achievements`, `gear`, `gallery`, `alumni`, `members`, `tracks`, `banners`, `settings`) are hydrated into Node.js V8 heap memory upon server bootstrap.
   - Public GET requests resolve from RAM in **$< 0.1\text{ms}$ TTFB**, immune to database network latency or cold starts.
   - When an administrator performs a mutation in `apps/admin`, the mutation writes through to PostgreSQL asynchronously, invalidating and updating the RAM cache simultaneously.

### 3.4 Statutory Compliance: India DPDP Act 2023
In compliance with the **Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)**:
1. **Notice & Purpose Limitation**: Forms clearly articulate that student applicant data is processed solely for TRAIC Cohort admissions and hardware bench allocation.
2. **Affirmative Opt-In Consent**: The consent checkbox is unchecked by default. Forms reject submission if `consentGiven !== true`.
3. **Audit Trail**: Every registration record captures `consentTimestamp: string`, `consentVersion: 'DPDP-2023-V1'`, and `consentIpHash: string`.
4. **Withdrawal of Consent**: Prominently displays the statutory data principal grievance officer contact (`privacy@traic.in`).

### 3.5 Security Hardening & Bot Neutralization
1. **Timing-Safe Cryptography**: Admin authentication compares password hashes using `crypto.timingSafeEqual` over fixed-length buffers, preventing side-channel timing analysis.
2. **Automated Spam Honeypot (`_traic_hp_trap`)**: Public forms include an off-screen, tab-indexed input field invisible to human users. If an automated script populates this field, the backend silently absorbs the payload, returning HTTP 200 without writing to the database.
3. **Sliding-Window Rate Limiting**: In-memory token bucket limits public requests to 100 req/min per IP, and sensitive endpoints (`/admin/login`, `/public/apply`) to 10 req/15min.

---

## 4. End-to-End User Flows & Interaction Sequences

### 4.1 Dedicated Event Registration Flow (Sequence Diagram)

```
[ Participant ]        [ Apple Web App ]          [ API Gateway ]          [ PostgreSQL Store ]
       │                      │                          │                          │
       │─── Click "Register" ─▶                          │                          │
       │                      │── Open Event Modal ─────▶│                          │
       │                      │   (Track, Kit, Consent)  │                          │
       │                      │                          │                          │
       │── Fill Details ─────▶│                          │                          │
       │   (Team, Roll #s)    │                          │                          │
       │                      │                          │                          │
       │── Check DPDP Consent─▶                          │                          │
       │                      │                          │                          │
       │── Submit Form ───────▶                          │                          │
       │                      │── POST /public/events/   │                          │
       │                      │   {slug}/register ──────▶│                          │
       │                      │                          │── Validate Zod Schema ──▶│
       │                      │                          │── Verify Honeypot Empty ─│
       │                      │                          │── Insert Application ───▶│
       │                      │                          │   (ACID Transaction)     │
       │                      │                          │                          │
       │                      │◀── Return Receipt ID ────│                          │
       │                      │    ("INNO-2025-XXXX")    │                          │
       │                      │                          │                          │
       │◀── Display Confirmed ┘                          │                          │
       │    Receipt Dialog                               │                          │
```

---

## 5. Autonomous Human-Inspector Verification Engine

### 5.1 The Inspection Protocol (`scratch/human_inspector_crawler.mjs`)
The platform includes an automated inspection agent operating via Chrome DevTools Protocol (CDP) that validates real-world rendering against human standards:

1. **48 Test Variations Audited**:
   - 12 Production Routes (`/`, `/projects`, `/projects/autonomous-ugv-rover`, `/projects/edge-neural-pcb`, `/projects/telemetry-ground-station`, `/achievements`, `/events`, `/events/traic-annual-hardware-hackathon-2025`, `/team`, `/gallery`, `/learn`, `/join`).
   - 2 Display Form Factors: Desktop ($1440\times900$) and Mobile ($390\times844$).
   - 2 Color Schemes: Native Dark Mode (`[data-theme="dark"]`) and Surgical Cleanroom Light Mode (`[data-theme="light"]`).
2. **Automated Visual Contrast Audit**:
   - Inspects computed styles of all active DOM text nodes.
   - Computes exact relative luminance and contrast ratio against parent surface backdrops.
   - Requires $100\%$ zero-failure pass rate ($\ge 4.5:1$ for body text, $\ge 3.0:1$ for large titles, $\ge 7.0:1$ for primary headings).
3. **Zero Horizontal Layout Overflow**:
   - Checks `document.documentElement.scrollWidth <= window.innerWidth` across all mobile viewports.
4. **Interactive Modal Verification**:
   - Programmatically triggers modal dialogs (Live Telemetry HUD, 3D CAD Exploded Assembly) and captures high-resolution screenshot evidence.
