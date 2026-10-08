# Backend, Database & Admin Panel Engineering Laws

> **System Standard**: A robust, zero-trust, high-performance architecture governing the API, Database, and Admin Portal. Every frontend section is dynamically controlled by the Vite admin dashboard.

---

## 1. Architectural Strategy & Modular Monolith

### 1.1 Modular Monolith Over Microservices
- **Law**: The backend (`apps/api`) MUST operate as a Modular Monolith.
- **Rule**: Code is organized by feature domain, not technical layers.
  - Correct: `modules/projects/`, `modules/events/`, `modules/gear/`
  - Incorrect: `controllers/`, `services/`, `models/` at the root.
- **Structure within a Module**:
  - `routes.ts`: Defines Express 5 routes.
  - `controller.ts`: Handles req/res parsing, passes to service.
  - `service.ts`: Core business logic.
  - `repo.ts`: Exclusive database access layer.
  - `schema.ts`: (Imported from `packages/shared`) Zod validation.

### 1.2 Full Dynamic Control (Admin ↔ Frontend)
- **Law**: Zero hardcoded content on the frontend.
- **Rule**: Every section in `apps/web/src/app/page.tsx` MUST be powered by an API endpoint managed via `apps/admin`.
  - Hero Section $\to$ `GET /api/public/settings`
  - Projects Bento $\to$ `GET /api/public/projects?featured=true`
  - Lab Gear Carousel $\to$ `GET /api/public/gear`
  - Events & Flagship $\to$ `GET /api/public/events`
  - Stats & Patents $\to$ `GET /api/public/achievements`
  - Team & Alumni $\to$ `GET /api/public/alumni`
- **Admin Capability**: The admin panel MUST provide CRUD forms and visibility toggles (`published: boolean`) for all entities.

---

## 2. Database & Data Integrity Laws

### 2.1 Prisma as the Single Source of Truth
- **Law**: **Prisma only for DB access. No raw string-built SQL.** (AGENTS.md Rule 5).
- **Violation in Old Design**: `apps/api` relying directly on `pg` (raw SQL queries), risking SQL injection and breaking type safety.
- **Implementation**:
  - Integrate `prisma` and `@prisma/client`.
  - Define `schema.prisma` with strict relationships, unique constraints, and indices on frequently queried fields (e.g., `slug`, `category`, `published`).

### 2.2 Zod Contracts (The Boundary Wall)
- **Law**: **Every request body/query/param is validated with a Zod schema from `packages/shared`. No exceptions.**
- **Implementation**:
  - Express routes MUST use a validation middleware intercepting the request before it reaches the controller.
  - Admin panel forms MUST use the exact same Zod schema for client-side validation (via `react-hook-form` + `@hookform/resolvers/zod`).

### 2.3 Idempotency & Concurrency
- **Law**: All state-mutating requests (POST/PUT/DELETE) must handle race conditions.
- **Implementation**:
  - Use Prisma transactions for multi-record updates.
  - Ensure operations like "Register for Event" use unique composite keys (`eventId_userEmail`) to prevent duplicate registrations.

---

## 3. Security & Access Control Laws

### 3.1 Zero-Trust Authentication
- **Law**: **Auth: httpOnly + Secure + SameSite cookie sessions. Never put tokens in localStorage.**
- **Implementation**:
  - Admin login generates an encrypted JWT or opaque session token stored in an `HttpOnly` cookie.
  - The Vite Admin panel relies on cookie-based authentication for all `fetch` requests (`credentials: 'include'`).

### 3.2 BOLA/IDOR Defense & Rate Limiting
- **Law**: Explicitly verify ownership and enforce rate limits.
- **Implementation**:
  - Public endpoints (`/api/public/*`) implement strict rate limiting (e.g., 100 req/15min) via Redis or In-Memory stores to prevent scraping or DDoS.
  - Admin endpoints (`/api/admin/*`) require explicit session validation middleware.

### 3.3 Safe Uploads & Sanitization
- **Law**: **Uploads: allowlist by magic bytes, size caps, re-encode images. No SVG uploads.**
- **Implementation**:
  - Project images and lab photos uploaded via Admin must be verified on the backend (e.g., using `file-type`).
  - No `dangerouslySetInnerHTML` on the frontend without server-side sanitization of markdown/HTML (using `isomorphic-dompurify`).

---

## 4. Performance & Optimizations

### 4.1 Sub-Millisecond TTFB (Time to First Byte)
- **Law**: Public endpoints must resolve instantly to support Next.js dynamic rendering without blocking.
- **Implementation**:
  - **In-Memory Caching**: Cache the results of `/public/settings`, `/public/projects`, etc., using a simple LRU cache or Redis. Invalidate cache upon any Admin mutation (`POST`, `PUT`, `DELETE`).
  - **N+1 Query Prevention**: Always use Prisma's `include` to fetch relations in a single query, rather than looping over results to fetch related data.

### 4.2 Waterfall API Prevention
- **Law**: Admin dashboard must load data concurrently.
- **Implementation**: Use `Promise.all` in backend aggregations, and `React Query` (or SWR) on the Vite Admin frontend to fetch independent data streams concurrently.

---

## 5. Execution Roadmap: The Integration Phase

1. **Step 1: Database Foundation**: Install Prisma in `apps/api`. Scaffold `schema.prisma` covering Projects, Events, Gear, Alumni, Stats, and Global Settings. Generate migrations against Neon PostgreSQL.
2. **Step 2: Shared Contracts**: Define Zod schemas for all entities in `packages/shared/src/schemas.ts` and export inferred types.
3. **Step 3: Backend Monolith**: Build the `modules` structure in Express. Implement `/api/public/*` (cached read-only) and `/api/admin/*` (protected CRUD) endpoints.
4. **Step 4: Admin Portal**: Scaffold Vite screens for managing each entity using reusable form components bound to the shared Zod schemas.
5. **Step 5: Frontend Hydration**: Strip remaining hardcoded data from `apps/web/src/app/page.tsx` and wire it completely to the `/api/public/*` endpoints.
