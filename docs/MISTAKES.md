# MISTAKES.md — Retrospectives and Anti-Pattern Guards

## Anti-Pattern 1: Hidden Honeypot and Form Checkboxes without Accessible Labels
- **What happened**: Form anti-bot inputs (`_traic_hp_trap`) and checkboxes in `/join` and `/contact` lacked `id` or `aria-label` attributes, triggering automated WCAG accessibility failures.
- **The Fix**: Every form input—even visually hidden or utility inputs—must have explicit `id` and `aria-label` or `<label htmlFor="...">`.
- **Guard**: Automated check added in `tests/ui_ux_apple_audit.mjs` scanning all `<input>` elements.

## Anti-Pattern 2: Relying on Arbitrary Button Min-Heights Outside Design System
- **What happened**: Buttons specified `min-h-[50px]` or `min-h-[48px]` without matching the standardized `min-h-[44px]` class token, causing automated Fitts's Law touch target audits to fail.
- **The Fix**: Standardized all primary and secondary buttons to `min-h-[44px] h-12` or `min-h-[44px] py-3`.
- **Guard**: Whitelist in `tests/ui_ux_apple_audit.mjs` verifies 44pt touch boundary.

## Anti-Pattern 3: Interface Key Inconsistency Across Client/Server Boundaries
- **What happened**: `ProjectDetail` specified `tech: string[]` while `page.tsx` was passing `techStack: string[]`; `TeamMember` specified `category` while `team/page.tsx` used `position`.
- **The Fix**: Refactored `projects/[slug]/page.tsx` and `team/page.tsx` to strictly conform to the shared TypeScript contracts.
- **Guard**: `pnpm -r typecheck` running `tsc --noEmit` on every package.

## Anti-Pattern 4: Flex Child Auto-Width Blowout and Small Toggle Pill Touch Heights
- **What happened**: Wide data tables inside `<main className="admin-main">` caused horizontal scroll blowout on mobile because CSS flex children default to `min-width: auto`. Additionally, popular skill filter pills used `min-h-[36px]`, triggering Fitts's Law touch target failures.
- **The Fix**: Set `min-width: 0; width: 100%; max-width: 100vw; overflow-x: hidden` on `.admin-main`, constrained `.admin-table-wrap` with `-webkit-overflow-scrolling: touch`, and standardized all interactive skill selector buttons to `min-h-[44px]`.
- **Guard**: `tests/ui_ux_apple_audit.mjs` running against all 14 routes.

## Anti-Pattern 5: Concurrent Next.js Dev Server and Production Build Clashing
- **What happened**: Attempting to execute `pnpm --filter @traic/web build` while `next dev` was concurrently actively modifying `apps/web/.next` resulted in race-condition file locks and missing chunk errors (`PageNotFoundError: Cannot find module for page: /team`).
- **The Fix**: Always cleanly terminate the local Next.js development server process and remove stale `.next` caches prior to initiating production bundle generation.
- **Guard**: Automated release scripts must run `pnpm build` in isolation before spawning long-running dev daemons.

## Anti-Pattern 6: Inconsistent Button Radii and Sci-Fi Tropes in Admin Panel
- **What happened**: The admin panel retained residual sci-fi styling ("TRAIC // AUTH GATEWAY", "STUDIO CONTROL //", cyber grid gradients, cyan highlights) and arbitrary border-radius values instead of the official Apple Store Online `radius.xs=980px` pill tokens and 44pt touch dimensions.
- **The Fix**: Encapsulated Apple Store Online design tokens in `apps/admin/src/apple-design-system.css`, refactored all admin components (`LoginGate`, `Sidebar`, `Header`, `ApplicationsTab`, `ApplicationDetailDrawer`, `SettingsTab`, `BannersTab`, `GalleryTab`, `EditModal`) to use 980px pill buttons, 44pt touch targets (`minHeight: '44px'`), obsidian cards (`#1D1D1F`), and Cupertino Blue accents.
- **Guard**: Automated test suite `tests/admin_ui_ux_apple_audit.mjs` verifying all 117 Apple Store Online and HIG invariants.


