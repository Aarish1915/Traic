# Next.js 15 Frontend Refactor & Migration Plan

> **Scope**: Roadmap for transitioning `apps/web` to the Apple HIG design system without disrupting the existing Express REST API, Neon PostgreSQL cloud database, or Vite Admin Console.

---

## 1. Architecture Alignment

The monorepo architecture remains intact:
- **`packages/shared`**: Unaltered single source of truth for Zod schemas (`ProjectSchema`, `EventSchema`, `LabGearSchema`, `SiteSettingSchema`, `JoinApplicationSchema`).
- **`apps/api`**: Unaltered Express 5 modular monolith serving sub-millisecond RAM cached endpoints backed by Neon PostgreSQL.
- **`apps/admin`**: Unaltered Vite 6 portal managing data CRUD and visibility toggles.
- **`apps/web`**: Overhaul frontend components and CSS tokens to adopt the Apple HIG standards.

---

## 2. Component Mapping & Module Architecture

```text
apps/web/src/
├── app/
│   ├── globals.css              <-- Update tokens: true black #000, surfaces, systemCyan #64D2FF
│   ├── layout.tsx               <-- Add skip-link, Apple system font stack, viewport-fit=cover
│   └── page.tsx                 <-- Compose the 7 core Apple-style sections
├── components/
│   ├── apple/
│   │   ├── AppleNavbar.tsx      <-- 56px translucent floating glass pill
│   │   ├── MobileTabBar.tsx     <-- Bottom thumb-zone navigation dock (screens <= 960px)
│   │   ├── HeroSection.tsx      <-- 88px headline, hardware silhouette, scroll cue
│   │   ├── BentoDisciplines.tsx <-- 3-column bento grid for 6 verticals
│   │   ├── LabCarousel.tsx      <-- Horizontal scroll-snap workshop activity cards
│   │   ├── FeaturedProjects.tsx <-- 2x2 grid + accessible modal dialog case studies
│   │   ├── ProjectModal.tsx     <-- Native dialog with technical specs, BOM, and 3D trigger
│   │   ├── ImpactAuthority.tsx  <-- 4 unified stats + patent spotlight + authority strip
│   │   ├── EventsShowcase.tsx   <-- Hackathon spotlight with live countdown + sessions list
│   │   ├── TeamLeadership.tsx   <-- Domain leads grid with avatar monograms
│   │   ├── JoinFormDPDP.tsx     <-- Reciprocity perks + DPDP Act 2023 compliant form
│   │   └── AppleFooter.tsx      <-- 4-column minimal footer + "Honor · Honesty · Sacrifice"
│   └── icons/
│       └── SFSymbols.tsx        <-- Monoline 1.5px SVG icon library
```

---

## 3. Data Flow & Integration with Existing API

All existing dynamic data hooks and endpoints continue to power the frontend seamlessly:
1. **Projects**: Ingested via `/public/projects`. Filtered for `featured: true` on the homepage 2×2 grid; all published projects accessible in modal triggers.
2. **Site Settings & Toggles**: Ingested via `/public/settings`. `mottoText` centrally hydrates the footer creed; `sectionToggles` dynamically show or hide sections.
3. **Workshop Gear**: Ingested via `/public/gear`. Highlights active equipment in the Lab in Motion carousel.
4. **Events**: Ingested via `/public/events`. Feeds the flagship spotlight and past sessions list.
5. **Join Form**: Submissions post directly to `/public/applications` with validation and honeypot protection.

---

## 4. Phase-by-Phase Execution Checklist

### Phase 1: CSS Design Tokens & Base Primitives
- [ ] Define Apple HIG CSS variables in `globals.css` (Surfaces `#000000`, `#1C1C1E`, `#2C2C2E`; text `#F5F5F7`, `rgba(235,235,245,0.64)`; accent `#64D2FF`).
- [ ] Implement SF Symbols SVG sprite / React icon library with 1.5px monoline stroke.
- [ ] Add skip-to-content bypass link and semantic landmark wrappers in `layout.tsx`.

### Phase 2: Core Components Development
- [ ] Build `AppleNavbar.tsx` and `MobileTabBar.tsx` with `IntersectionObserver` scroll-spy.
- [ ] Build `HeroSection.tsx` with headline scale, tight tracking, and cinematic hardware visual.
- [ ] Build `BentoDisciplines.tsx` and `LabCarousel.tsx` with smooth trackpad and button scrolling.
- [ ] Build `FeaturedProjects.tsx` and `ProjectModal.tsx` using HTML5 `<dialog>` for fast, accessible interaction.
- [ ] Build `ImpactAuthority.tsx` and `EventsShowcase.tsx` with dynamic event countdown calculation.
- [ ] Build `JoinFormDPDP.tsx` with reciprocity proposition, live validation, and DPDP consent checkbox.
- [ ] Build `AppleFooter.tsx` with 4 columns, motto, and copyright.

### Phase 3: Page Integration & Verification
- [ ] Assemble `apps/web/src/app/page.tsx` integrating all components.
- [ ] Test with `pnpm typecheck` across monorepo (0 errors).
- [ ] Test with `pnpm lint`.
- [ ] Verify 69/69 integration and cyber defense test assertions with `pnpm test:integration`.
- [ ] Verify accessibility in real browser via Chrome DevTools (Axe core 0 violations, 44px hit targets, contrast >= 4.5:1).
