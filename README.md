# TRAIC — Technology, Robotics & AI Club

> The official platform for TRAIC — an engineering community building, learning, and competing at the intersection of hardware and software.

---

## 🚀 Overview

TRAIC is a premier college engineering community dedicated to robotics, embedded systems, artificial intelligence, and software engineering. We build real-world systems, compete in national hackathons, and mentor the next generation of engineers.

This repository is a unified monorepo hosting:
- **`apps/web`**: Public community website built with Next.js (App Router), Tailwind CSS, and 3D progressive enhancement.
- **`apps/admin`**: Secured administration panel built with Vite and React for managing community content, events, achievements, and members.
- **`apps/api`**: Modular REST API built with Node.js, Express, TypeScript, and Prisma ORM.
- **`packages/shared`**: Shared Zod schemas, data contracts, and TypeScript types consumed across all apps.

---

## 🛠 Tech Stack

- **Monorepo**: [pnpm](https://pnpm.io/) workspaces + [Turborepo](https://turbo.build/)
- **Frontend (Public)**: Next.js, React, Tailwind CSS, Three.js / React Three Fiber
- **Frontend (Admin)**: React, Vite, Tailwind CSS
- **Backend**: Express 5, TypeScript, Prisma ORM, PostgreSQL
- **Contracts & Validation**: Zod, TypeScript Strict Mode
- **Testing**: Vitest, Playwright

---

## 📦 Project Structure

```text
├── apps/
│   ├── web/          # Next.js public showcase site
│   ├── admin/        # Vite + React administrative portal
│   └── api/          # Express.js REST API
├── packages/
│   ├── shared/       # Shared TypeScript types and Zod schemas
│   └── config/       # Shared tsconfig, eslint, and prettier presets
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: `v20+` or `v24+`
- **pnpm**: `v9+` (`corepack enable` or `npm install -g pnpm`)

### Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aarish1915/Traic.git
cd Traic

# 2. Install dependencies across all workspaces
pnpm install

# 3. Start development servers
pnpm dev
```

---

## 📜 License

Licensed under the [MIT License](LICENSE).
