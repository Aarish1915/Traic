# 06 — Phased Implementation Roadmap & Verification Protocol

## 1. Phased Implementation Roadmap

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TRAIC PRODUCTION ROADMAP                              │
└──────┬──────────────────────┬──────────────────────┬─────────────────┬──────┘
       │                      │                      │                 │
┌──────▼────────┐      ┌──────▼────────┐      ┌──────▼───────┐  ┌──────▼──────┐
│ PHASE 1:      │      │ PHASE 2:      │      │ PHASE 3:     │  │ PHASE 4:    │
│ BRAND & LOGO  │      │ CLEANROOM     │      │ DYNAMIC CMS  │  │ 3D CAD &    │
│ POLISH        │      │ LIGHT MODE    │      │ & LAB GEAR   │  │ PERFORMANCE │
├───────────────┤      ├───────────────┤      ├──────────────┤  ├─────────────┤
│ • 52px Bezel  │      │ • Surgical    │      │ • LabGear    │  │ • Exploded  │
│ • Single Creed│      │   White Base  │      │   Collection │  │   CAD Views │
│ • High-DPI    │      │ • Carbon Ink  │      │ • Dynamic    │  │ • 60 FPS Cap │
│   Emblem      │      │   Typography  │      │   Stats & Copy│  │ • Zero-Load  │
│ • Favicon Sync│      │ • Cobalt Cyan │      │ • Section    │  │   RAM Cache │
│               │      │   Accents     │      │   Toggles    │  │ • ZAP Audit │
└───────────────┘      └───────────────┘      └──────────────┘  └─────────────┘
```

---

### Phase 1: Brand & Logo Prominence Overhaul
* **Goal**: Elevate the brand presence from amateur to industry-grade.
* **Actions**:
  1. Re-render the official emblem with high-DPI retina assets ($48\text{px}$ desktop / $40\text{px}$ mobile) in a chamfered aerospace titanium bezel with ambient cyan aura.
  2. Remove the duplicate `HONOR • HONESTY • SACRIFICE` motto from the hero pill badge, anchoring it strictly in the brand subtitle and footer base lockup.
  3. Ensure favicon and OpenGraph metadata use the crisp vector emblem.

---

### Phase 2: Complete Light Mode Overhaul (Cleanroom Standard)
* **Goal**: Eliminate the washed-out, dull gray light mode and replace it with a high-contrast surgical cleanroom aesthetic.
* **Actions**:
  1. Set root background to Pure Architectural Slate (`#F8FAFC`).
  2. Set cards and panels to Pure Cleanroom White (`#FFFFFF`) with precision hairline borders (`#CBD5E1`).
  3. Set primary text to Deep Carbon Ink (`#0F172A`) for a $14.2:1$ WCAG AAA contrast ratio.
  4. Set primary accent to Electric Cobalt Cyan (`#0284C7`) with crisp white button text (`#FFFFFF`).
  5. Calibrate soft ambient studio drop-shadows.

---

### Phase 3: Dynamic Admin CMS & Workshop Equipment (Ingri World Pattern)
* **Goal**: Ensure 100% of website copy, stats, gear, and sections can be edited dynamically by coordinators without touching code.
* **Actions**:
  1. Add `WorkshopTool` / `LabGear` collection to `@traic/shared`, `apps/api`, and `apps/admin`.
  2. Expand `SiteSetting` schema to include all hero headlines, mission statements, metric counter labels, and homepage section visibility toggles.
  3. Build dedicated **Equipment Manager** and **Site Configuration** tabs in `apps/admin`.

---

### Phase 4: 3D Hardware CAD Exploded View & Cross-Device Engine
* **Goal**: Transform 3D from a simple rotating chip into an interactive, functional engineering tool.
* **Actions**:
  1. Implement **Exploded Assembly Mode** for rover chassis and 4-layer PCB.
  2. Add raycasted component inspection tooltips (showing part numbers, clocks, interfaces).
  3. Enforce strict DPR clamp ($1.0–1.5$) and demand frameloop for $60\text{ FPS}$ mobile rendering with zero battery drain.

---

### Phase 5: Security Hardening & Zero-Load Database Caching
* **Goal**: Enterprise security posture and sub-millisecond public response times.
* **Actions**:
  1. Verify constant-time password checks and sliding-window IP rate limiting.
  2. Enforce strict CSP, HSTS, X-Frame-Options headers.
  3. Sanitize markdown/HTML server-side via DOMPurify.
  4. Maintain write-through RAM caching for $< 1.5\text{ms}$ TTFB reads with zero database query overhead.

---

## 2. Verification Protocol & Quality Gates

| Verification Gate | Command / Tool | Success Criteria |
|---|---|---|
| **Type Safety** | `pnpm typecheck` | 0 errors across `@traic/shared`, `web`, `admin`, `api` |
| **Linting & Hygiene** | `pnpm lint` | 0 blocking lint errors |
| **API & Contract Tests** | `node scratch/test_full_suite.mjs` | 100% assertions passing (all public + admin endpoints) |
| **Visual & a11y Audit** | Headless Chrome CDP / DevTools | Contrast ratio $\ge 4.5:1$ (AA) and $\ge 7:1$ (AAA); 0 layout shifts |
| **Mobile WebGL Audit** | Emulated iPhone / Android CDP | WebGL context acquisition, 0 skeletal flashes, fluid touch rotation |
| **Security Audit** | Rate limit probe & payload test | Max 5 failed logins triggers HTTP 429; $>1\text{MB}$ payload rejected with HTTP 413 |
