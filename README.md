# TRAIC — Technology, Robotics & AI Community

[![CI Quality Gates](https://github.com/traiccoer2025-code/WebSite/actions/workflows/ci.yml/badge.svg)](https://github.com/traiccoer2025-code/WebSite/actions/workflows/ci.yml)
[![Apple HIG](https://img.shields.io/badge/Design_System-Apple_HIG_v2.0.0-black)](README.md)
[![Tests Passing](https://img.shields.io/badge/Automated_Audits-336%2F336_Passing-brightgreen)](README.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2_Strict-blue)](README.md)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.1-black)](https://nextjs.org/)
[![Express 5](https://img.shields.io/badge/Express-5.0.1-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1)](https://neon.tech/)

> The official engineering showcase and operational platform for **TRAIC** — a collegiate community designing custom PCBs, programming autonomous robots, and deploying bare-metal edge AI systems at DIA Labs, COER University.

---

## 🏛 System Architecture & Topology

```
Visitor (Desktop / Mobile / Tablet)
   │
   ├──► Next.js 15 Public Showcase (SSG / Edge CDN) ────► 14 Prerendered Static Routes
   │    ├─► Apple Vision Pro Specular Ambient Depth (Zero Line Noise)
   │    ├─► Heterogeneous Hardware Dissection (STM32H753 + Hailo-8 M.2 BOM)
   │    └─► Dual-Theme Contrast Engine (WCAG AAA in Obsidian Dark & Clean Light)
   │
Coordinator / Lab Lead
   │
   └──► Vite 6 Admin Console (admin.traic.in) ──────────► Desktop Table / Mobile Inset Grouped Cards
                                                       ├─► 1,000+ Candidate Admissions Engine (RFC-4180 CSV)
                                                       └─► Apple Store Online Tokens (980px Pill Curvature)
                                                                │
                                                                ▼ (Bearer Auth / Cookie)
                                                     Express 5 Modular Monolith API (port 4000)
                                                                │
                                    ┌───────────────────────────┴───────────────────────────┐
                                    ▼                                                       ▼
                        In-Memory RAM Cache                                      Neon Serverless PostgreSQL
                     (Sub-millisecond reads: 0.8ms)                            (11 Structured Tables / SSL)
```

---

## 🍎 Apple Design System & Cognitive Ergonomic Laws

The platform conforms strictly to Apple Human Interface Guidelines (HIG) and cognitive interaction laws:

| Law / Principle | Specification | Monorepo Implementation | Verification |
|---|---|---|---|
| **Fitts's Law** | Minimum $44\text{pt} \times 44\text{pt}$ touch targets | All buttons, links, inputs, and pills enforce `min-h-[44px]` (or `min-h-[48px]`), eliminating mis-taps on touchscreens. | `ui_ux_apple_audit.mjs` |
| **Hick-Hyman Law** | Minimize choices per screen ($T = b \cdot \log_2(n+1)$) | Primary navigation capped at 5 cognitive anchors; secondary links progressively disclosed. | `ui_ux_apple_audit.mjs` |
| **Doherty Threshold** | Computer-human feedback $< 100\text{ms}$ | Micro-scale button feedback (`active:scale-95`, 120ms cubic bezier transitions) delivers tactile certainty. | `verify_non_ai_parameters.mjs` |
| **Gestalt Proximity** | Semantic grouping & optical clearance | Hero top padding calibrated to `pt-24 sm:pt-28 md:pt-32` (28px clearance below floating navbar), eliminating empty gaps. | `multi_device_ui_ux_audit.mjs` |
| **Miller's Law** | Chunking information into $7 \pm 2$ units | 4 Core Engineering Disciplines with unified optical header sequence chips (`01 / 04` through `04 / 04`). | `verify_non_ai_parameters.mjs` |
| **Apple Materiality** | Luminous depth without visual noise | Vision Pro ambient specular radial halo; zero harsh text-cutting grid vectors; inner chamfer bevels. | `verify_non_ai_parameters.mjs` |

---

## ⚡ Live Verification Gates (100% Pass Rate)

Four dedicated automated audit engines enforce continuous compliance across both the public showcase and administrative portal:

```bash
# 1. Monumental Typography, Touch Targets & Silicon BOM Invariants (45/45)
node tests/verify_non_ai_parameters.mjs

# 2. Apple HIG, Cognitive Laws & WCAG Accessibility Across All 14 Routes (131/131)
node tests/ui_ux_apple_audit.mjs

# 3. Multi-Device Fluid Layout (Mobile, Tablet, Desktop) & Dual Responsive Cards (43/43)
node tests/multi_device_ui_ux_audit.mjs

# 4. Admin Console Apple Store Online Tokens & Security Invariants (117/117)
node tests/admin_ui_ux_apple_audit.mjs

# 5. Full Workspace TypeScript Static Verification (0 errors across 5 projects)
pnpm -r typecheck
```

### Combined Audit Summary
- **Total Invariants Tested**: 336
- **Passed**: 336
- **Failed**: 0
- **Success Rate**: **100.0%**

---

## 📦 Monorepo Workspace Structure

```text
traic/
├── apps/
│   ├── web/                  # Next.js 15 App Router showcase (Apple HIG, Tailwind, R3F)
│   ├── admin/                # Vite 6 + React 19 Admin Portal (Apple Store Online tokens)
│   └── api/                  # Express 5 Modular Monolith REST API (Zod + Prisma)
├── packages/
│   ├── shared/               # Single source of truth for Zod schemas & TypeScript types
│   └── config/               # Base tsconfig, eslint, and prettier presets
├── tests/                    # Automated multi-device & HIG audit verification suites
├── reports/                  # Printable executive audit reports for leadership
├── Dockerfile                # Multi-stage Alpine container for API
├── Dockerfile.web            # Multi-stage container for Next.js standalone
├── Dockerfile.admin          # High-speed Nginx container for Admin SPA
├── docker-compose.yml        # Full-stack local container orchestration
├── render.yaml               # 1-Click Render Cloud Blueprint
└── README.md
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js**: `v20.0.0` or higher (`v22+` recommended)
- **pnpm**: `v9.15.4` or higher

### 1. Installation
```bash
git clone https://github.com/traiccoer2025-code/WebSite.git
cd WebSite
pnpm install --frozen-lockfile
```

### 2. Environment Configuration
Copy the template in `apps/api/.env.example` to `apps/api/.env`:
```bash
cp apps/api/.env.example apps/api/.env
```

Configure your environment variables:
```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
ADMIN_PASSWORD=your_secure_admin_password
SESSION_SECRET=your_super_secret_session_key_min_16_chars
PORT=4000
```

### 3. Launch Development Servers
```bash
pnpm dev
```
- **Web Showcase**: `http://localhost:3000`
- **Admin Console**: `http://localhost:5173`
- **REST API**: `http://localhost:4000`

---

## 🚢 Production Deployment

- **Web Showcase (`apps/web`)**: Hosted on Vercel with Next.js 15 App Router and strict security headers (`vercel.json`).
- **Admin Console (`apps/admin`)**: Hosted on Vercel with SPA rewrite rules and isolated CSP headers.
- **REST API (`apps/api`)**: Containerized on Render with health checks at `/health` and direct SSL connectivity to Neon PostgreSQL.

---

## 📄 License & Attribution

Copyright © 2026 TRAIC — DIA Labs, Block C-302, COER University. Open access collegiate research community.
