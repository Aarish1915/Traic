# TRAIC — Technology, Robotics & AI Community

[![CI Quality Gates](https://github.com/Aarish1915/Traic/actions/workflows/ci.yml/badge.svg)](https://github.com/Aarish1915/Traic/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.1-black)](https://nextjs.org/)
[![Express 5](https://img.shields.io/badge/Express-5.0.1-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1)](https://neon.tech/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-orange)](https://threejs.org/)
[![Tests](https://img.shields.io/badge/Tests-50%2F50_Passing-brightgreen)](TESTING.md)

> The official engineering platform for **TRAIC** — a premier collegiate community designing custom PCBs, programming autonomous robots, and deploying edge AI systems.

---

## 🏛 System Architecture & Topology

```
Visitor (Desktop / Mobile)
   │
   ├──► Next.js 15 Public Showcase (SSG / Edge CDN) ────► 19 Prerendered Static Routes
   │    └─► 3D WebGL CAD Viewport (Interactive MCU / UGV Rover / PCB)
   │
Coordinator / Admin
   │
   └──► Vite 6 Admin Console (admin.traic.in) ──────────► Slide-over Candidate Drawer
                                                       └─► QuickVisibilityToggle (1-Click)
                                                                │
                                                                ▼ (Bearer Auth / Cookie)
                                                     Express 5 REST API (port 4000)
                                                                │
                                   ┌────────────────────────────┴────────────────────────────┐
                                   ▼                                                         ▼
                       In-Memory RAM Cache                                        Dual-Mode Persistence
                   (Sub-millisecond reads: 0.8ms)                       ┌────────────────────┴────────────────────┐
                                                                        ▼                                         ▼
                                                             Neon PostgreSQL (Cloud)                     Atomic Disk Storage
                                                             (ACID JSONB Store: 11 Tables)              (traic_store.json)
```

---

## ⚡ Empirical Performance & Latency Benchmarks

Tested and verified against live services with the automated full-system benchmark engine (`benchmark_all.mjs`):

| Layer / Route | Operation | Latency (TTFB) | Status | Architecture Highlight |
|---|---|---|---|---|
| **Public API** (`/public/projects`) | Read Projects | **1.19 ms** | 200 OK | Direct V8 RAM Cache (No network lag) |
| **Public API** (`/public/events`) | Read Events | **0.95 ms** | 200 OK | Zero-bleed filtering (`PUBLISHED` only) |
| **Public API** (`/public/gallery`) | Read Gallery | **0.70 ms** | 200 OK | Permanent Edge CDN asset caching |
| **Public API** (`/public/settings`) | Read Settings | **0.88 ms** | 200 OK | Live stats & announcements |
| **Admin API** (`/admin/auth/login`) | Master Key Auth | **3.54 ms** | 200 OK | Timing-safe crypto + 256-bit token |
| **Admin API** (`/admin/projects`) | Create Project | **5.99 ms** | 201 Created | Instant memory update + Neon write-through |
| **Admin API** (`/admin/projects/:id`) | Toggle Visibility | **4.86 ms** | 200 OK | Instant 1-click status flip (`PUBLISHED` ↔ `DRAFT`) |
| **Admin API** (`/admin/projects/:id`) | Delete Project | **4.75 ms** | 200 OK | Clean purge from memory, disk, and Neon |
| **Admin Portal** (`/`) | Load SPA Shell | **10.56 ms** | 200 OK | Vite 6 chunked distribution |
| **Public Web** (`/`) | Home SSG Page | **347.16 ms** | 200 OK | Statically generated Next.js 15 bundle |

---

## ✨ Key Platform Features

### 1. 3D Progressive Enhancement & CAD Inspection
- **Interactive Three.js Silicon Die**: Live 3D MCU with glowing signal traces, wire bonds, status LEDs, and particle field.
- **Mobile Gesture Disambiguation**: Touch engine automatically discriminates vertical scrolling (`totalDy > totalDx * 1.1`) from horizontal 3D rotation (`totalDx >= totalDy`), eliminating scroll trapping on mobile.
- **Project CAD Inspector**: Full-screen modal supporting procedural 3D models (Autonomous Rover, Multi-layer PCB, Satellite Dish), camera angle presets (Isometric, Top, Front), wireframe mode, and pinch-to-zoom.
- **Low-Power Fallback**: 2D Lite mode and `webglcontextlost`/`webglcontextrestored` event resilience for budget phones.

### 2. Autonomous Dual-Mode Database Engine
- **Cloud Mode (Production)**: When `DATABASE_URL` is set, auto-connects to **Neon Serverless PostgreSQL** over SSL, auto-provisions all 11 tables with `JSONB` document storage, and writes through asynchronously.
- **Offline Mode (Local Dev)**: When `DATABASE_URL` is omitted, operates with **Atomic Disk Persistence** (`data/traic_store.json`), allowing developers to work 100% offline with zero external infrastructure.
- **Sub-Millisecond Read Latency**: All public requests are served directly from RAM (`< 1ms`), outperforming remote database queries by over 50x.

### 3. High-Security Admin Console (`apps/admin`)
- **Timing-Safe Auth Gate**: Restricts access behind `ADMIN_PASSWORD` verified via constant-time string comparison (`crypto.timingSafeEqual`) to prevent side-channel timing attacks.
- **Brute-Force & Bot Defense**: Enforces IP rate limiting (5 attempts locks IP for 15 minutes) with an artificial 500ms delay and honeypot traps (`_traic_hp_trap`).
- **1-Click QuickVisibilityToggle**: Instant publishing toggle (`PUBLISHED` vs `DRAFT`) with optimistic UI and zero-bleed enforcement (drafts are never returned to public visitors).
- **Slide-Over Review Drawer**: Full-depth review pane for candidate applications with localized timestamps, relative time (`2h ago`), large statement-of-purpose viewer, and 1-click status transitions (`REVIEWING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`).

---

## 📦 Monorepo Workspace Organization

```text
traic/
├── apps/
│   ├── web/                  # Next.js 15 App Router showcase (SSG + Three.js)
│   ├── admin/                # Vite 6 + React 19 administrative portal
│   └── api/                  # Express 5 modular monolith REST API
├── packages/
│   ├── shared/               # Single source of truth for Zod schemas & types
│   └── config/               # Base tsconfig, eslint, and prettier presets
├── data/
│   └── traic_store.json      # Atomic local disk backup store
├── Dockerfile                # Multi-stage Alpine container for API
├── Dockerfile.web            # Multi-stage container for Next.js standalone
├── Dockerfile.admin          # High-speed Nginx container for Admin SPA
├── docker-compose.yml        # Local full-stack container orchestration
├── render.yaml               # 1-Click Render Cloud Blueprint
└── README.md
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js**: `v20.0.0` or higher (`v22+` recommended)
- **pnpm**: `v12.0.0+` (`corepack enable && corepack prepare pnpm@latest --activate`)

### 1. Installation
```bash
git clone https://github.com/Aarish1915/Traic.git
cd Traic
pnpm install --frozen-lockfile
```

### 2. Environment Configuration
Copy the template in `apps/api/.env.example` to `apps/api/.env` (or root `.env`):
```bash
cp apps/api/.env.example apps/api/.env
```

To connect to your **Neon PostgreSQL** cluster:
```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
ADMIN_PASSWORD=traic_admin_2025!
SESSION_SECRET=your_super_secret_session_key_min_16_chars
PORT=4000
```
*(If `DATABASE_URL` is omitted, the API will automatically use local atomic file persistence).*

### 3. Launch Development Servers
```bash
pnpm dev
```
- **Web Showcase**: `http://localhost:3000`
- **Admin Console**: `http://localhost:5173`
- **REST API**: `http://localhost:4000`

---

## 🧪 Quality Gates & Automated Verification

The monorepo enforces automated quality kill-gates on every push via GitHub Actions (`.github/workflows/ci.yml`):

```bash
# Typecheck all 4 packages (shared, web, admin, api)
pnpm typecheck

# Lint workspace
pnpm lint

# Production build verification (Next.js SSG + Vite bundle + esbuild standalone)
pnpm build

# Run 50-point full-stack integration & cyber defense suite
node scratch/test_full_suite.mjs
```

---

## 🚢 Production Cloud Deployment

### Web Showcase (`apps/web`) & Admin Portal (`apps/admin`) on Vercel:
1. Import repository into Vercel.
2. For Web: Set Root Directory to `apps/web`. Vercel automatically detects Next.js 15 and applies security headers from `vercel.json`.
3. For Admin: Set Root Directory to `apps/admin`. Vercel applies SPA rewrite rules from `vercel.json`.

### Backend API (`apps/api`) on Render:
1. Connect repository to Render using the Blueprint in [`render.yaml`](render.yaml).
2. Render automatically provisions the `traic-api` web service using Node 22, connects `/health` monitoring, and links environment variables.
3. Add `DATABASE_URL` in the Render Environment tab to connect your Neon PostgreSQL cluster.

---

## 📜 License
Licensed under the [MIT License](LICENSE).
