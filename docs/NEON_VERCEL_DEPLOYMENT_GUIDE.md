# Neon & Vercel Production Deployment Guide (TRAIC v2.0.0)

## Executive Summary
This guide explains how to deploy and update **TRAIC v2.0.0** on **Neon (Serverless PostgreSQL)** and **Vercel (Frontend & Serverless Hosting)**, including environment variables, database schema synchronization, connection pooling, and multi-domain cookie security.

---

## 1. Neon PostgreSQL Database Configuration

Neon is a serverless Postgres provider that separates compute and storage, providing connection pooling via PgBouncer out-of-the-box.

### 1.1 Connection Strings
In your Neon Console (under Dashboard -> Connection Details):
1. **Pooled Connection (`DATABASE_URL`)**:
   Used by runtime API handlers to avoid connection exhaustion under high traffic.
   ```env
   DATABASE_URL="postgres://username:password@ep-cool-butterfly-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
   ```
2. **Direct Connection (`DIRECT_URL`)**:
   Used by Prisma CLI for migrations and schema pushes (which cannot run through PgBouncer connection poolers).
   ```env
   DIRECT_URL="postgres://username:password@ep-cool-butterfly-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### 1.2 Applying the Prisma Schema to Neon
From your local terminal or CI/CD pipeline:
```bash
# Generate Prisma Client
pnpm --filter @traic/api prisma generate

# Push the v2 schema directly to your Neon database
pnpm --filter @traic/api prisma db push
```

### 1.3 Production Seeding
To populate default site settings and initial admin credentials in your Neon database:
```bash
# Seed initial settings and collections
pnpm --filter @traic/api prisma db seed
```

---

## 2. Vercel Deployment Architecture

TRAIC is structured as a Turborepo / pnpm monorepo with three production packages:

```
├── apps/web      -> Next.js 14 App Router (Public Showcase)
├── apps/admin    -> Vite + React (Admin Operations Console)
└── apps/api      -> Express 5 / Node.js API (Backend Monolith)
```

### Option A: Separate Vercel Projects (Recommended)

#### Project 1: Public Website (`traic.org` or `traic.vercel.app`)
- **Framework Preset**: `Next.js`
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm --filter @traic/web build`
- **Output Directory**: `.next`
- **Environment Variables**:
  ```env
  NEXT_PUBLIC_API_URL="https://api.traic.org"
  NEXT_PUBLIC_APP_ENV="production"
  ```

#### Project 2: Admin Panel (`admin.traic.org` or `traic-admin.vercel.app`)
- **Framework Preset**: `Vite`
- **Root Directory**: `apps/admin`
- **Build Command**: `pnpm --filter @traic/admin build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```env
  VITE_API_BASE_URL="https://api.traic.org"
  ```

#### Project 3: API Service (Vercel Serverless or Render / Railway / Fly.io)
If hosting API on Render/Railway/Fly.io (recommended for long-lived Express 5 with WebSocket support):
- **Build Command**: `pnpm --filter @traic/api build`
- **Start Command**: `node apps/api/dist/index.js`
- **Environment Variables**:
  ```env
  PORT=4000
  NODE_ENV=production
  DATABASE_URL="postgres://...@ep-...-pooler.neon.tech/neondb?sslmode=require&pgbouncer=true"
  DIRECT_URL="postgres://...@ep-...neon.tech/neondb?sslmode=require"
  ADMIN_SECRET="<generate-random-32-byte-hex-string>"
  SESSION_SECRET="<generate-random-32-byte-hex-string>"
  CORS_ORIGIN="https://traic.org,https://admin.traic.org"
  ```

---

## 3. Cookie & CORS Security for Multi-Domain Deployments

### Same-Site Subdomain Production Setup (`traic.org`, `admin.traic.org`, `api.traic.org`)
When using subdomains on the same registered apex domain:
- **CORS**: `origin: ['https://traic.org', 'https://admin.traic.org'], credentials: true`
- **Cookies**: `SameSite=Lax; Domain=.traic.org; Secure; HttpOnly`

### Distinct Domains Setup (e.g. `traic-web.vercel.app`, `traic-admin.vercel.app`, `api-traic.onrender.com`)
When testing on distinct third-party domains:
- **CORS**: `origin: ['https://traic-web.vercel.app', 'https://traic-admin.vercel.app'], credentials: true`
- **Cookies**: `SameSite=None; Secure; HttpOnly; Partitioned`

---

## 4. Pre-Deployment Verification Checklist

Before pushing commits to production:
1. `pnpm -r typecheck` (Verify 0 TypeScript compilation errors)
2. `node tests/multi_device_ui_ux_audit.mjs` (Verify 43/43 multi-device invariants)
3. `node tests/admin_ui_ux_apple_audit.mjs` (Verify 117/117 Apple HIG invariants)
4. `node tests/ui_ux_apple_audit.mjs` (Verify 131/131 Web route invariants)
5. `pnpm test` (Verify contract schemas)
6. `pnpm --filter @traic/web build` (Verify Next.js static and dynamic App Router routes)
