---
id: 2026-07-13-01-database-and-backend
title: "Database & Backend Core Implementation (Phase 1)"
type: feature
priority: 🔴 High
status: 🔴 To Do
phase: 1
created: 2026-07-13
completed:
---

## Context

> The project is currently in Phase 0/Phase 1 of development (`docs/project-status/project-status.md`). All core model, helper, route, and component files (`src/models/*`, `src/lib/*`, `src/app/api/v1/*`, and `src/components/*`) exist as empty `0-byte` placeholder files. Furthermore, `mongoose` is not yet installed in `package.json`.
> This memory implements the foundational MongoDB connection layer, Mongoose schemas (`Gift` and `Rsvp`), shared Zod validators/types (`src/lib/validators.ts` and `src/lib/types.ts`), service layer (`src/lib/services/*`), and all Phase 1 API route handlers (`/api/v1/rsvp`, `/api/v1/gifts`, and atomic gift reservation `/api/v1/gifts/[id]/reserve`). It also sets up the initial frontend data hooks/scaffolding to satisfy the Paired Development Rule.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built |
| :------------------- | :------------------ |
| **Database**         | Install `mongoose` and `zod`. Create/populate `Gift` and `Rsvp` Mongoose schemas (`src/models/Gift.ts`, `src/models/Rsvp.ts`) and cached MongoDB connection helper (`src/lib/mongodb.ts`). Fix typo where model file was named `Rvsp.ts`. |
| **Service**          | Create `src/lib/services/giftService.ts` and `src/lib/services/rsvpService.ts` containing all data-access and business logic. Specifically, implement `reserveGiftAtomically(giftId, rsvpId)` using `findOneAndUpdate` filtered on `{ status: "available" }`. |
| **Shared Types**     | Define shared TypeScript interfaces (`Gift`, `Rsvp`, API payloads) inside `src/lib/types.ts` and Zod validation schemas inside `src/lib/validators.ts`. |
| **Controller / DTO** | Implement Next.js App Router API route handlers: `POST/GET /api/v1/rsvp`, `GET/PATCH/DELETE /api/v1/rsvp/[id]`, `GET/POST /api/v1/gifts`, `PATCH/DELETE /api/v1/gifts/[id]`, and `PATCH /api/v1/gifts/[id]/reserve`. Ensure routes delegate entirely to services and Zod. |
| **Realtime**         | N/A (No real-time WebSocket server; frontend will handle conflicts via refetching/optimistic UI upon reservation response). |
| **Frontend**         | Scaffold foundational data fetching/action wrappers inside `src/lib/apiClient.ts` and wire them into `src/components/gifts/GiftGrid.tsx`, `GiftCard.tsx`, and `RsvpForm.tsx` to prepare for Phase 2 guest pages. |

---

## Dependencies

_No dependencies — this memory can be started immediately as the highest development priority._

---

## Architecture Constraints Reminder

- **Atomic Conditional Updates Only:** Gift reservation (`PATCH /api/v1/gifts/[id]/reserve`) **must** use an atomic conditional update (`findOneAndUpdate` filtered on `{ _id: giftId, status: "available" }`). Never read-then-write across two separate DB calls or queries.
- **Single Cached DB Connection:** All MongoDB access must go through `src/lib/mongodb.ts`'s cached connection helper (`global._mongoose`). Never `mongoose.connect()` directly inside a route handler.
- **Shared Types Single Source of Truth:** All shared types (`Gift`, `Rsvp`, request/response DTOs) must live in `src/lib/types.ts` and `src/lib/validators.ts`. Never redefine types inside route handlers or UI components.
- **Thin Controllers:** No business logic or direct Mongoose queries inside `route.ts` files. Delegate all validation to Zod (`src/lib/validators.ts`) and database/business operations to `src/lib/services/`.
- **Zero ESLint Warnings/Errors:** Every file must pass `npm run lint` and `npm run build` cleanly before completing the task. No `any` types, no unused variables, and no floating promises.

---

## AI Agent Instructions

> ⚠️ Always implement the Service, Controller/DTO (or Route Handler), AND Frontend Component(s) together. Complete each Step fully before moving to the next. Never skip steps or leave stubs.

---

### Step 1 — Database & Dependencies (`package.json`, `src/lib/mongodb.ts`, `src/models/*`)

- [ ] Install `mongoose` via `npm install mongoose` and `@types/mongoose` if required.
- [ ] Implement `src/lib/mongodb.ts` following Next.js Serverless caching best practices (using `global._mongoose` cache to prevent connection pooling exhaustion during dev/HMR).
- [ ] Rename `src/models/Rvsp.ts` to `src/models/Rsvp.ts` if needed, and implement the Mongoose schemas with strict TypeScript interfaces:
  - `Gift.ts`: `name` (string), `description` (string), `imageUrl` (string), `status` (`"available" | "reserved"` default `"available"`), `reservedBy` (ObjectId ref to `Rsvp`, default `null`).
  - `Rsvp.ts`: `guestName` (string), `email` (string), `attending` (boolean), `numberOfGuests` (number), `message` (string), `selectedGift` (ObjectId ref to `Gift`, default `null`).
- [ ] Ensure Mongoose models check `mongoose.models.Gift || mongoose.model("Gift", giftSchema)` to avoid OverwriteModelError in dev.

---

### Step 2 — Shared Types & Validation (`src/lib/types.ts`, `src/lib/validators.ts`)

- [ ] Create `src/lib/validators.ts` and define Zod schemas for:
  - `createRsvpSchema` & `updateRsvpSchema`
  - `createGiftSchema` & `updateGiftSchema`
  - `reserveGiftSchema` (requiring `rsvpId`)
- [ ] Create `src/lib/types.ts` and export shared interfaces inferred from Zod schemas or corresponding directly to `Gift` and `Rsvp` database entities (`z.infer<typeof createRsvpSchema>`, etc.).

---

### Step 3 — Service Layer (`src/lib/services/giftService.ts`, `src/lib/services/rsvpService.ts`)

- [ ] Create `src/lib/services/giftService.ts` with typed methods:
  - `getAllGifts()`, `getGiftById(id)`, `createGift(data)`, `updateGift(id, data)`, `deleteGift(id)`.
  - `reserveGiftAtomically(giftId: string, rsvpId: string)`: Must execute `findOneAndUpdate({ _id: giftId, status: "available" }, { $set: { status: "reserved", reservedBy: rsvpId } }, { new: true })`. If null is returned, throw a custom `GiftUnavailableError`.
- [ ] Create `src/lib/services/rsvpService.ts` with typed methods:
  - `createRsvp(data)`, `getAllRsvps()`, `getRsvpById(id)`, `updateRsvp(id, data)`, `deleteRsvp(id)`.
  - Ensure that if `data.selectedGift` is provided during RSVP creation, it invokes `giftService.reserveGiftAtomically()` and links the RSVP cleanly.

---

### Step 4 — Route Handlers / API Controllers (`src/app/api/v1/*`)

- [ ] Implement `src/app/api/v1/gifts/route.ts` (`GET`, `POST`).
- [ ] Implement `src/app/api/v1/gifts/[id]/route.ts` (`GET`, `PATCH`, `DELETE`).
- [ ] Implement `src/app/api/v1/gifts/[id]/reserve/route.ts` (`PATCH`). Catch `GiftUnavailableError` and return `409 Conflict` (`{ error: "Gift is already reserved" }`).
- [ ] Implement `src/app/api/v1/rsvp/route.ts` (`POST`, `GET`).
- [ ] Implement `src/app/api/v1/rsvp/[id]/route.ts` (`GET`, `PATCH`, `DELETE`).
- [ ] Ensure all handlers call `await connectToDatabase()`, validate request JSON via Zod (`validator.parse(body)`), and return properly typed JSON responses (`NextResponse.json`).

---

### Step 5 — Frontend API Client & Component Structure (`src/lib/apiClient.ts`, `src/components/*`)

- [ ] Create `src/lib/apiClient.ts` with clean, type-safe wrapper functions for client components (`fetchGifts()`, `submitRsvp(payload)`, `reserveGift(giftId, rsvpId)`).
- [ ] Update `src/components/gifts/GiftCard.tsx` and `src/components/gifts/GiftGrid.tsx` with proper TypeScript props (accepting `Gift` types from `src/lib/types.ts`) and interactive reservation/conflict handling UI props.
- [ ] Update `src/components/rsvp/RsvpForm.tsx` with form state scaffolding and Zod validation integration ready for Phase 2 guest pages.

---

### Step 6 — Tests & Verification (`tests/giftReservation.test.ts`)

- [ ] Create an integration/unit test verifying atomic concurrency: simulate two simultaneous `reserveGiftAtomically(giftId, rsvpId)` calls for the exact same available gift, and assert that exactly one succeeds while the second throws `GiftUnavailableError` (`409 Conflict`).
- [ ] Run `npm run lint` and `npm run build` to confirm zero warnings, zero errors, and strict compilation compliance.

---

### Step 7 — Environment Variables (`.env.example`)

- [ ] Ensure `.env.example` explicitly lists all necessary environment variables:
  ```ini
  # MongoDB Atlas connection string (or local mongodb://localhost:27017/rvsp)
  MONGODB_URI=
  # NextAuth secret key for admin authentication
  NEXTAUTH_SECRET=
  # Admin credentials
  ADMIN_USERNAME=
  ADMIN_PASSWORD=
  ```

---

### Step 8 — Docs & Status Update

- [ ] Mark Phase 1 tasks (`[x] Define Gift schema`, `[x] Define Rsvp schema`, `[x] Build lib/mongodb.ts`, etc.) as completed in `docs/project-status/project-status.md`.
- [ ] Update `status` to `🟢 Done` and add `completed: YYYY-MM-DD` once all above steps pass cleanly.

---

## Acceptance Criteria

- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `npm run build` passes with no TypeScript errors.
- [ ] No `console.log` debugging statements or `any` types in newly added code.
- [ ] `PATCH /api/v1/gifts/[id]/reserve` uses `findOneAndUpdate` with `{ status: "available" }` filter; never read-then-write across two calls.
- [ ] All API handlers validate request inputs with Zod schemas defined in `src/lib/validators.ts`.
- [ ] Concurrency test proves that two simultaneous reservation attempts for the same gift result in exactly 1 success and 1 conflict failure.
