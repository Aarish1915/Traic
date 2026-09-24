# ========================================================
# Fast Multi-Stage Dockerfile for TRAIC API (@traic/api)
# Base: Alpine Linux (lightweight ~130MB, fast startup)
# ========================================================

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --------------------------------------------------------
# 1. Dependency & Build Stage
# --------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy dependency manifests first for maximum Docker layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Fast frozen lockfile install
RUN pnpm install --frozen-lockfile

# Copy source trees
COPY packages/config ./packages/config
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build API distribution
RUN pnpm --filter @traic/api build

# Prune dev dependencies and package for production deployment
RUN pnpm --filter @traic/api --prod deploy /app/pruned-api

# --------------------------------------------------------
# 2. Ultra-Fast Production Runner Stage
# --------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Run as non-privileged node user for container security
USER node

# Copy self-contained deployed application and compiled server
COPY --from=builder --chown=node:node /app/pruned-api ./
COPY --from=builder --chown=node:node /app/apps/api/dist ./dist

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/server.js"]
