# TRAIC Platform — Technical Architecture & Runbook

This document details the system architecture, database design, API surface, security measures, and deployment runbooks for the TRAIC community platform.

---

## 1. System Topology

The platform is structured into three discrete applications in a pnpm monorepo:

```text
[ Visitor Browser ]                     [ Administrator ]
         │                                      │
         ▼                                      ▼
   apps/web (Next.js 15)                  apps/admin (Vite 6 SPA)
   - 19 Pre-rendered SSG pages            - Standalone portal on admin.traic.in
   - Interactive 3D Three.js canvas       - Application reviews & live content CRUD
   - ISR on-demand revalidation           - Bearer token / HTTP-only cookie auth
         │                                      │
         └──────────────────┬───────────────────┘
                            │ REST JSON (Port 4000)
                            ▼
                   apps/api (Express 5 + TypeScript)
                   - Modular monolith bundled via esbuild to dist/server.js
                   - In-memory cache for instant public reads (< 1.2ms TTFB)
                   - Helmet security headers, CORS, Zod validation
                            │
                            ▼ SSL Connection (pg.Pool)
                   Neon Serverless PostgreSQL (AWS Singapore)
                   - 11 tables with JSONB documents + updated_at index
                   - ACID transactions & persistence
```

---

## 2. Monorepo Organization

```text
traic/
├── apps/
│   ├── web/          # Public showcase site (Next.js 15 App Router, Tailwind, Three.js)
│   ├── admin/        # Admin portal (Vite 6, React 19, modular tab components)
│   └── api/          # Backend REST API (Express 5, bundled via esbuild)
├── packages/
│   ├── shared/       # Zod schemas and inferred TypeScript types (single source of truth)
│   └── config/       # Shared base tsconfig files
├── scratch/          # Integration tests and headless browser CDP audit scripts
├── Dockerfile        # API container build (multi-stage Alpine)
├── Dockerfile.web    # Next.js standalone container build
├── Dockerfile.admin  # Nginx container for admin SPA
├── docker-compose.yml# Local multi-container orchestration
└── render.yaml       # Render.com Blueprint deployment spec
```

### Module Boundaries
* **`packages/shared`**: Contains all entity Zod schemas (`ProjectSchema`, `EventSchema`, etc.) and inferred TypeScript types. Neither frontend nor backend re-defines data types; all contracts derive from here.
* **`apps/web`**: Static-first public interface. Dynamic routes (`/projects/[slug]`, `/events/[slug]`) compile at build time via `generateStaticParams()`.
* **`apps/admin`**: Client-side SPA behind a terminal auth barrier (`LoginGate.tsx`). Divided into individual tab components under `components/tabs/` to keep file sizes under 250 lines.
* **`apps/api`**: Modular monolith divided into `modules/admin`, `modules/public`, `modules/db`, and `modules/health`.

---

## 3. Database Architecture & Data Lifecycle

### 3.1 Persistent Storage (Neon PostgreSQL)
All data lives in a remote **Neon Serverless PostgreSQL** cluster running on AWS. The API connects over TLS/SSL (`sslmode=require`) using `node-postgres` (`pg.Pool`).

The database uses 11 tables storing entity data as `JSONB` with an indexed timestamp:
```sql
CREATE TABLE IF NOT EXISTS <table_name> (
  id VARCHAR(120) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_<table_name>_updated_at ON <table_name> (updated_at DESC);
```

Managed tables: `projects`, `events`, `achievements`, `members`, `alumni`, `tracks`, `banners`, `gallery`, `settings`, `applications`, `messages`.

### 3.2 Boot Hydration & Read Caching
Public catalog routes (`/public/projects`, `/public/events`, etc.) receive heavy read traffic. To eliminate latency from remote database network round-trips:
1. During server startup, `await store.init()` queries Neon over SSL and loads all records into Node.js heap memory before Express binds port 4000.
2. Incoming public reads are served synchronously from RAM with sub-millisecond Time to First Byte (`< 1.2ms`).

### 3.3 Mutation Lifecycle: Write-Through Updates
When an administrator modifies an entity via the admin portal:
1. The request payload is validated against the corresponding Zod schema in `@traic/shared`.
2. The in-memory array/object is updated immediately for instant optimistic UI responses.
3. A parameterized SQL query (`INSERT ... ON CONFLICT (id) DO UPDATE` or `DELETE`) is dispatched to Neon PostgreSQL over SSL.

---

## 4. API Endpoints

### 4.1 Public Routes (Read-Only & Submissions)
| Method | Endpoint | Description | Guards |
|---|---|---|---|
| `GET` | `/health` | Service healthcheck, uptime, and node environment | None |
| `GET` | `/public/projects` | List published projects | None |
| `GET` | `/public/projects/:slug` | Single project detail by slug | None |
| `GET` | `/public/events` | List published events and workshops | None |
| `GET` | `/public/events/:slug` | Single event detail by slug | None |
| `GET` | `/public/achievements` | List published awards and competition wins | None |
| `GET` | `/public/team` | List active coordinators and domain leads | None |
| `GET` | `/public/alumni` | List alumni network | None |
| `GET` | `/public/tracks` | Engineering curricula (ROS2, Embedded, TinyML) | None |
| `GET` | `/public/banners` | Active announcement bars | None |
| `GET` | `/public/gallery` | Field test dispatches and lab photos | None |
| `GET` | `/public/settings` | Public headline text, socials, and stat counters | None |
| `POST` | `/public/applications` | Submit recruitment application | Rate limit (15/10m), Honeypot (`_traic_hp_trap`), Zod |
| `POST` | `/public/contact` | Submit general contact message | Rate limit (15/10m), Zod |

### 4.2 Admin Routes (Authenticated)
Authentication requires header `Authorization: Bearer <token>` or cookie `traic_admin_session`.
* `POST /admin/auth/login` — Verifies master key via `crypto.timingSafeEqual`. Returns 256-bit token. 5 failed attempts trigger a 15-minute IP lockout.
* `POST /admin/auth/logout` — Invalidates the session.
* `GET /admin/auth/verify` — Validates current session token.
* `GET /admin/stats` — Dashboard counters (totals, pending applications).
* Full CRUD endpoints (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) for:
  `/admin/projects`, `/admin/events`, `/admin/achievements`, `/admin/members`, `/admin/alumni`, `/admin/tracks`, `/admin/banners`, `/admin/gallery`, `/admin/settings`, `/admin/applications`, `/admin/messages`.

### 4.3 Response Envelopes & Status Codes

#### Success Response Envelope
All successful entity queries and mutations return a standardized JSON envelope:
```json
{
  "success": true,
  "data": [ /* Array of records or single entity object */ ]
}
```

#### Error Response Envelope
Handled centrally by `apps/api/src/common/middleware/error.ts`. Stack traces are suppressed in production:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error summary",
    "details": {
      "fieldName": ["Constraint violation description"]
    },
    "requestId": "optional-tracing-id"
  }
}
```

HTTP status codes used across all controllers:
* `200 OK` — Successful query or idempotent update.
* `201 Created` — Successful entity insertion.
* `400 Bad Request` — Request body failed Zod schema validation (`code: "VALIDATION_ERROR"`).
* `401 Unauthorized` — Missing, expired, or invalid session token (`code: "UNAUTHORIZED"`).
* `404 Not Found` — Entity or endpoint path does not exist (`code: "NOT_FOUND"`).
* `413 Payload Too Large` — Body exceeds 1 MB limit (`code: "PAYLOAD_TOO_LARGE"`).
* `429 Too Many Requests` — Form submission rate limit exceeded or IP locked out (`code: "TOO_MANY_REQUESTS"`).
* `500 Internal Server Error` — Unhandled server exception (`code: "INTERNAL_ERROR"`).

---

## 5. Frontend & 3D WebGL Implementation

### 5.1 Next.js 15 Static Site Generation (SSG)
All 19 public routes are pre-rendered as static HTML at build time using `generateStaticParams()`. Client components are isolated to interactive islands (`ThemeToggle`, `TelemetryModal`, 3D Viewports).

### 5.2 Three.js WebGL2 / WebGL1 Probing
On older devices (e.g. iPhone 11 or budget Android), Three.js r174 crashes if it requests WebGL2 without a fallback. `ThreeHeroScene.tsx` and `Project3DInspector.tsx` probe the canvas before initializing:
```typescript
const gl = canvas.getContext('webgl2') || 
           canvas.getContext('webgl') || 
           canvas.getContext('experimental-webgl');
```
Context loss cleanup via `renderer.forceContextLoss()` was removed because it permanently disabled the shared GPU context on mobile WebKit.

### 5.3 Mobile Touch & Gesture Disambiguation
To prevent 3D canvas interaction from hijacking page scroll:
* Canvases use `touch-action: pan-y`.
* Touch movement calculates angle: if vertical displacement dominates (`totalDy > totalDx * 1.1`), the browser scrolls natively. If horizontal displacement dominates, touch rotation engages with `e.preventDefault()`.
* Inspection modals enforce `overscroll-behavior: contain` to prevent browser pull-to-refresh gestures during rotation.

---

## 6. Security

* **Timing-Safe Auth**: Admin passwords are verified using `crypto.timingSafeEqual` with matched buffer lengths to prevent side-channel timing analysis.
* **Brute-Force Lockout**: 5 failed login attempts lock the client IP address for 15 minutes. Failed attempts include an artificial 500ms delay to thwart dictionary attacks.
* **Bot Spam Trapping**: Public forms include a hidden input `_traic_hp_trap`. Automated bots that fill this field receive a fake HTTP 200 without the record ever touching the database.
* **Payload Size Caps**: Body parser is capped at 1 MB (`express.json({ limit: '1mb' })`) to prevent heap exhaustion.
* **Headers**: Helmet disables `x-powered-by`, enforces `X-Content-Type-Options: nosniff`, and sets `X-Frame-Options: SAMEORIGIN`.

---

## 7. Deployment & Operations

### 7.1 Environment Variables

| Variable | App | Purpose |
|---|---|---|
| `DATABASE_URL` | API | Neon Serverless PostgreSQL connection string (with SSL) |
| `ADMIN_PASSWORD` | API | Password for `/admin` panel access |
| `SESSION_SECRET` | API | Secret for signing session cookies |
| `ALLOWED_ORIGINS`| API | Permitted CORS origins (comma-separated) |
| `PORT` | API | HTTP port (default: 4000) |
| `NEXT_PUBLIC_API_URL` | Web | API root URL for client requests |
| `VITE_API_URL` | Admin | API root URL for admin requests |

### 7.2 Cloud Deployment Targets
* **apps/web**: Deploy to Vercel. Set Root Directory to `apps/web`. Vercel automatically runs Next.js SSG build.
* **apps/admin**: Deploy to Vercel or Cloudflare Pages. Set Root Directory to `apps/admin`, build command `pnpm build`, output directory `dist`.
* **apps/api**: Deploy to Render using root `render.yaml`. Build command: `pnpm install --frozen-lockfile && pnpm --filter @traic/api build`. Start command: `node apps/api/dist/server.js`.
* **Local Docker**: Run `docker-compose up --build -d` to spin up Web (3000), Admin (5173), and API (4000).

### 7.3 Local Development & Quality Gate Runbook

```bash
# 1. Install dependencies across workspace with frozen lockfile
pnpm install --frozen-lockfile

# 2. Run all services concurrently in watch mode (Web: 3000, Admin: 5173, API: 4000)
pnpm dev

# 3. Typecheck all packages with zero code emit
pnpm typecheck

# 4. Lint workspace source code
pnpm lint

# 5. Verify production builds (Next.js SSG + Vite SPA bundle + esbuild standalone API)
pnpm build

# 6. Run full-system integration and cyber defense test suite (61 assertions)
node scratch/test_full_suite.mjs

# 7. Run empirical latency benchmarks across all web and API routes
node scratch/benchmark_all.mjs
```

---

## 8. Architectural Trade-offs & Known Technical Debt

1. **JSONB Documents vs Relational DDL**: Using `JSONB` document tables in PostgreSQL enables fast schema additions without migration lockups. However, cross-table joins (e.g. projects by member ID) must be filtered in application logic rather than database engine foreign keys. If the dataset exceeds 50,000+ entities, migrating to a relational schema with Prisma or Drizzle ORM will be appropriate.
2. **Volatile Admin Sessions**: Admin session tokens are currently tracked in process memory (`activeSessions` Map). Container restarts force administrators to re-authenticate. Migrating sessions to a PostgreSQL table or signed JWT cookies is planned for future hardening.
3. **Application Log Memory Retention**: The in-memory cache retains all applicant submissions in heap memory. For high-volume recruitment, this should be transitioned to direct paginated SQL queries (`SELECT ... LIMIT 50 OFFSET X`).
