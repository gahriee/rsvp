---
id: 2026-07-16-02-admin-dashboard
title: "Phase 3: Admin Dashboard & Server-Side Authentication"
type: feature
priority: 🔴 High
status: 🔴 To Do
phase: 3
created: 2026-07-16
completed:
---

## Context

> With Phase 1 (Database & Backend Core) and Phase 2 (Guest-Facing Frontend Pages) 100% completed and verified with zero build/lint errors and full atomic gift reservation testing, the next logical step is **Phase 3: Admin Dashboard (`/admin`)**.
> 
> Currently, the guest-facing application can record RSVPs (`/rsvp`) and reserve gifts (`/gifts`), and our backend routes (`/api/v1/rsvp` and `/api/v1/gifts`) have endpoints for listing, updating, and deleting records. However, `isAdminAuthenticated()` in `src/lib/auth.ts` is currently a placeholder that returns `true`, and our admin pages (`/admin`, `/admin/login`, `/admin/rsvps`, `/admin/gifts`) do not yet exist.
> 
> This memory implements a secure, lightweight, server-side authenticated admin portal where the graduate/host can track RSVP responses, monitor attendance stats, manage the registry wishlist, and manually adjust gift statuses or RSVP entries.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | No new Mongoose schemas required (`Gift` and `Rsvp` schemas from Phase 1 are reused) |
| **Service**          | Update `src/lib/auth.ts` for real HMAC/JWT or secure cookie session verification and login/logout helpers; add admin summary stats query helper |
| **Shared Types**     | Add admin login input/response DTO shapes and summary statistics interface to `src/lib/types.ts` |
| **Controller / DTO** | Create `/api/v1/admin/login` and `/api/v1/admin/logout` route handlers; enforce server-side authentication (`isAdminAuthenticated`) across all admin-only endpoints (`GET /api/v1/rsvp`, `PATCH/DELETE /api/v1/rsvp/[id]`, `POST /api/v1/gifts`, `PATCH/DELETE /api/v1/gifts/[id]`) |
| **Frontend**         | Build `src/app/admin/layout.tsx` + `AdminNavbar.tsx`, `/admin/login` page, `/admin` overview dashboard, `/admin/rsvps` management page, and `/admin/gifts` CRUD registry page |

---

## Dependencies

- **Completed**: Phase 1 (`docs/memory/2026-07-13-01-database-and-backend.md`)
- **Completed**: Phase 2 (`docs/memory/2026-07-16-01-guest-facing-frontend-pages.md`)
- _No blocking dependencies — this memory can be started immediately._

---

## Architecture Constraints Reminder

- **Server-Side Authentication Check**: Admin routes (`/admin/*` pages and `/api/v1/*` admin endpoints) **must check authentication server-side before returning data**. Never rely on client-side routing or hidden UI elements as the sole protection.
- **Thin Route Handlers**: Route handlers (`src/app/api/**/route.ts`) must delegate business logic, data access, and validation to `src/lib/` helpers (`src/lib/auth.ts`, `src/lib/services/rsvpService.ts`, `src/lib/services/giftService.ts`).
- **Atomic Operations Preservation**: Manual admin gift reservation changes must preserve data consistency and not violate Mongoose schema constraints (`status: "available" | "reserved"` and `reservedBy`).
- **ESLint & TypeScript Strictness**: Must pass `npm run lint` with 0 warnings/errors and `npm run build` with 0 type checks/errors. No `any` types. No unescaped entities or missing `key` props.
- **Path Aliases**: All imports must strictly utilize the newly established `@/app`, `@/components`, `@/lib`, and `@/models` aliases (`tsconfig.json`).

---

## AI Agent Instructions

---

### Step 1 — Database (`src/models/Gift.ts`, `src/models/Rsvp.ts`)

> Check if any schema modifications are required for admin operations.

- [ ] Verify that `Rsvp` (`guestName`, `email`, `attending`, `numberOfGuests`, `message`, `selectedGift`, `createdAt`) and `Gift` (`name`, `description`, `imageUrl`, `status`, `reservedBy`, `createdAt`) provide all fields needed for admin statistics, filtering, and editing.
- [ ] Write: _No schema changes required in this memory (`Gift` and `Rsvp` already support all needed admin CRUD operations)._

---

### Step 2 — Service & Authentication Layer (`src/lib/auth.ts`, `src/lib/services/adminService.ts`)

> Implement lightweight, zero-dependency or secure cookie-based HMAC session verification using Node standard Web Crypto or secure signed cookies so the app remains compatible with Next.js 16 / React 19 without heavy dependency mismatches.

- [ ] Replace the placeholder `isAdminAuthenticated()` in `src/lib/auth.ts` with real server-side cookie/token verification (`cookies()` from `next/headers`).
  - Read `ADMIN_PASSWORD` or `NEXTAUTH_SECRET` from environment variables (`process.env.ADMIN_PASSWORD || process.env.NEXTAUTH_SECRET`).
  - Create secure helper functions `createAdminSessionToken()` and `verifyAdminSessionToken(token: string): boolean` using HMAC-SHA256 (`crypto.subtle` or `crypto.createHmac`).
- [ ] Create `src/lib/services/adminService.ts` containing:
  - `getAdminOverviewStats()`: Aggregates total RSVPs, attending vs declining counts, total guests attending (`sum(numberOfGuests)` for attending), total gifts, available gifts, and reserved gifts cleanly via Mongoose queries.

---

### Step 3 — Shared Types & Validation (`src/lib/types.ts`, `src/lib/validators.ts`)

> Add admin-specific interfaces and validation schemas.

- [ ] In `src/lib/types.ts`, add:
  - `AdminLoginInput` (`{ password: string }`).
  - `AdminOverviewStats` (`{ totalRsvps: number; attendingRsvps: number; decliningRsvps: number; totalGuestsAttending: number; totalGifts: number; availableGifts: number; reservedGifts: number; }`).
- [ ] In `src/lib/validators.ts`, add:
  - `adminLoginSchema = z.object({ password: z.string().min(1, "Password is required") })`.

---

### Step 4 — Route Handlers (`src/app/api/v1/admin/*` and Auth Hardening of existing API endpoints)

> Implement secure endpoints and enforce server-side auth checks on all admin operations.

- [ ] Create `src/app/api/v1/admin/login/route.ts` (`POST` handler validating `adminLoginSchema` against `process.env.ADMIN_PASSWORD`, setting an `HttpOnly; Secure; SameSite=Strict; Path=/` cookie `admin_session`).
- [ ] Create `src/app/api/v1/admin/logout/route.ts` (`POST` handler clearing the `admin_session` cookie).
- [ ] Create `src/app/api/v1/admin/stats/route.ts` (`GET` handler protected by `isAdminAuthenticated()`, calling `getAdminOverviewStats()`).
- [ ] Update existing `src/app/api/v1/rsvp/route.ts` (`GET` handler for listing RSVPs) to check `if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });`.
- [ ] Update existing `src/app/api/v1/rsvp/[id]/route.ts` (`PATCH` and `DELETE`) to require `isAdminAuthenticated()`.
- [ ] Update existing `src/app/api/v1/gifts/route.ts` (`POST` for creating new gifts) to require `isAdminAuthenticated()`.
- [ ] Update existing `src/app/api/v1/gifts/[id]/route.ts` (`PATCH` and `DELETE` for modifying gifts) to require `isAdminAuthenticated()`.
  > Note: `POST /api/v1/rsvp`, `GET /api/v1/gifts`, and `PATCH /api/v1/gifts/[id]/reserve` remain public/guest-facing as intended.

---

### Step 5 — Realtime / Async Events (`N/A`)

- [ ] Write: _No realtime or async event bus changes required in this memory._

---

### Step 6 — Frontend Components & Pages (`src/app/admin/*`, `src/components/admin/*`)

> Build rich, modern, and responsive administrative dashboards and login flows.

- [ ] Create `src/components/admin/AdminNavbar.tsx` & `src/app/admin/layout.tsx`:
  - `AdminNavbar.tsx`: Provides clean, accessible tabs (`Overview`, `RSVPs`, `Gifts`, `View Live Site` link, and a logout button that hits `/api/v1/admin/logout` and redirects to `/admin/login`).
- [ ] Create `src/app/admin/login/page.tsx` & `src/components/admin/AdminLoginClient.tsx`:
  - Server component `login/page.tsx` checks `if (await isAdminAuthenticated()) redirect("/admin");`.
  - Client component `AdminLoginClient.tsx` features a sleek login box with password visibility eye-toggle, error banner, loading state, and smooth redirection to `/admin`.
- [ ] Create `src/app/admin/page.tsx` & `src/components/admin/AdminOverviewClient.tsx`:
  - Server component `admin/page.tsx` checks `if (!(await isAdminAuthenticated())) redirect("/admin/login");` and fetches `getAdminOverviewStats()`.
  - Client/View component displays stat cards with gradient accents (Total RSVPs, Attending vs Declining, Total Guests Attending, Gifts Available/Reserved) and quick navigation links.
- [ ] Create `src/app/admin/rsvps/page.tsx` & `src/components/admin/RsvpManager.tsx` (replacing the placeholder `RsvpTable.tsx`):
  - Server component protected by server-side auth check.
  - Interactive table (`RsvpManager.tsx` + `RsvpTable.tsx`) with search (filter by guest name/email), attendance tabs (`All`, `Attending`, `Declining`), inline modal/drawer for editing attendance or guest counts (`PATCH /api/v1/rsvp/[id]`), and safe deletion (`DELETE /api/v1/rsvp/[id]`) with confirmation dialogs.
- [ ] Create `src/app/admin/gifts/page.tsx` & `src/components/admin/GiftManager.tsx` (replacing the placeholder `GiftTable.tsx`):
  - Server component protected by server-side auth check.
  - Interactive grid/table (`GiftManager.tsx` + `GiftTable.tsx` + `GiftModalForm.tsx`) for adding new gifts (`POST /api/v1/gifts`), editing gift fields (`PATCH /api/v1/gifts/[id]`), manually toggling gift status (`available` vs `reserved`), and deleting gifts (`DELETE /api/v1/gifts/[id]`).

---

### Step 7 — Tests (`tests/admin.test.ts`)

> Verify authentication enforcement and admin service logic.

- [ ] Create or update unit/integration tests (`tests/admin.test.ts` with `vitest` + `mongodb-memory-server`) to verify:
  - Unauthenticated `GET /api/v1/rsvp` returns `401 Unauthorized`.
  - Unauthenticated `POST /api/v1/gifts` returns `401 Unauthorized`.
  - `getAdminOverviewStats()` accurately calculates `totalGuestsAttending`, `attendingRsvps`, and `reservedGifts` counts.

---

### Step 8 — Environment Variables

- [ ] Ensure `.env.example` includes `ADMIN_PASSWORD` (or `NEXTAUTH_SECRET`) with clear documentation:
  ```ini
  # Admin Dashboard Login Password (default for dev/testing: admin123)
  ADMIN_PASSWORD=admin123
  ```

---

### Step 9 — Docs & Status Update

- [ ] Run `npm run lint` to verify zero warnings or errors.
- [ ] Run `npm run build` to verify zero type checks or compilation issues.
- [ ] Mark all completed Phase 3 tasks as `[x]` in `docs/project-status/project-status.md`.
- [ ] Set `status: 🟢 Done` and populate `completed` date in this memory.

---

## Acceptance Criteria

- [ ] All `/admin/*` server pages and protected `/api/v1/*` routes strictly verify authentication server-side before returning data or rendering components.
- [ ] `npm run lint` passes with **0 errors and 0 warnings**.
- [ ] `npm run build` passes with zero type mismatches or broken route exports.
- [ ] Admin can log in (`/admin/login`), view aggregated attendance & gift stats (`/admin`), filter/search and edit/delete RSVPs (`/admin/rsvps`), and create/edit/delete registry gifts (`/admin/gifts`).
- [ ] No `any` types or `console.log` statements remain in committed code.
- [ ] All new components and routes strictly use `@/app`, `@/components`, `@/lib`, and `@/models` path aliases.
