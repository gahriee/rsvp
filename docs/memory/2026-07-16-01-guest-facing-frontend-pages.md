---
id: 2026-07-16-01-guest-facing-frontend-pages
title: "Guest-Facing Frontend Pages & Invitation Flow (Phase 2)"
type: feature
priority: 🔴 High
status: 🟢 Done
phase: 2
created: 2026-07-16
completed: 2026-07-16
---

## Context

> The project has completed Phase 0 (Planning & Setup) and Phase 1 (Database & Backend Core Implementation). All foundational Mongoose models (`Gift`, `Rsvp`), API route handlers (`/api/v1/rsvp`, `/api/v1/gifts`, `/api/v1/gifts/[id]/reserve`), Zod validators, and centralized event constants (`EVENT_DETAILS`) are fully functional and tested.
> Currently, the guest-facing pages (`/`, `/rsvp`, `/gifts`, `/confirmation`) are either bare placeholders or non-existent, and invitation components (`Hero.tsx`, `EventDetails.tsx`) are stubs.
> This memory implements the complete Phase 2 guest-facing frontend experience: the rich digital invitation landing page (`/`), the interactive RSVP submission form (`/rsvp`), the gift registry selection grid (`/gifts`) with real-time race-condition conflict handling, and the confirmation summary page (`/confirmation`).

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built |
| :------------------- | :------------------ |
| **Database**         | _No schema changes required — utilizes existing `Gift` and `Rsvp` Mongoose models._ |
| **Service**          | _No service changes required — utilizes existing `giftService.ts` and `rsvpService.ts` operations._ |
| **Shared Types**     | Ensure `src/lib/types.ts` exports any UI-specific DTOs or query parameters if needed for confirmation summaries. |
| **Controller / DTO** | Verify and utilize existing `POST /api/v1/rsvp`, `GET /api/v1/gifts`, and `PATCH /api/v1/gifts/[id]/reserve` routes. |
| **Realtime**         | Implement optimistic UI updating and `409 Conflict` catch/retry logic inside gift selection components when a gift is claimed concurrently. |
| **Frontend**         | Build rich UI components (`Hero.tsx`, `EventDetails.tsx`, `Navigation.tsx` / header footer) and guest pages (`src/app/page.tsx`, `src/app/rsvp/page.tsx`, `src/app/gifts/page.tsx`, `src/app/confirmation/page.tsx`) with modern styling, responsive layouts, and loading/error states. |

---

## Dependencies

> All prior Phase 0 (`2026-07-15-01-planning-and-setup.md`) and Phase 1 (`2026-07-13-01-database-and-backend.md`) tasks are complete.
> _No dependencies — this memory can be started immediately as the highest development priority._

---

## Architecture Constraints Reminder

- **Zero ESLint Warnings/Errors:** The build must produce zero ESLint warnings and zero errors before any task is considered complete (`npm run lint`).
- **Strict TypeScript:** No `any` types allowed. All component props and state must be explicitly typed (`npm run build` must pass cleanly).
- **No `<img>` Tags:** Must use `next/image` with explicit `width`/`height` or `fill` + sized parent containers for all photos (graduate photo, gift images, badges).
- **Server vs Client Components:** Default to Server Components (`page.tsx`) for initial static or server-side data loading, and only add `"use client"` to interactive leaf components (`RsvpForm.tsx`, `GiftGrid.tsx`, countdown timers).
- **Atomic Gift Reservation UI Handling:** When a guest selects a gift (`PATCH /api/v1/gifts/[id]/reserve`), if the server returns a `409 Conflict` (`GiftUnavailableError`), the UI must immediately catch this error, display a clear notice ("This gift was just claimed by another guest!"), and re-fetch `fetchGifts()` to refresh the grid without crashing.
- **Single Source of Truth:** All event details, venue address, dates, and graduate bio/photo must be imported from `src/lib/constants/eventDetails.ts` (`EVENT_DETAILS`). Never hardcode strings or dates in UI components.
- **No `console.log`:** Remove all debugging statements before finishing tasks.

---

## AI Agent Instructions

> ⚠️ Always implement the Service/Client wrapper, UI Components, and Page routes together. Complete each Step fully before moving to the next. Never skip steps or leave stubs.
> Run `npm run lint` and `npm run build` at every verification step to ensure zero regressions.

---

### Step 1 — Invitation Components (`src/components/invitation/*`)

> Build rich, visually stunning UI components for the digital invitation landing page using `EVENT_DETAILS` (`src/lib/constants/eventDetails.ts`).

- [x] Implement `src/components/invitation/Hero.tsx`:
  - Display the graduate's photo (`next/image` using `EVENT_DETAILS.graduate.photoUrl`), name, degree, and major.
  - Display `EVENT_DETAILS.copy.heroHeadline` and `EVENT_DETAILS.copy.heroSubheadline` with celebratory gradient typography.
  - Add a dynamic countdown timer (client component or embedded widget) counting down to `EVENT_DETAILS.event.date`.
  - Add prominent Call-To-Action (CTA) buttons: "RSVP Now" (`/rsvp`) and "View Gift Registry" (`/gifts`).
- [x] Implement `src/components/invitation/EventDetails.tsx`:
  - Display full event schedule and details: `date`, `time`, `venueName`, `venueAddress`, `dressCode`, and `rsvpDeadline`.
  - Include an interactive or styled map/directions link (e.g., Google Maps search link for `EVENT_DETAILS.event.venueAddress`).
  - Display the graduate's personal bio/thank-you message (`EVENT_DETAILS.graduate.bioMessage`).

---

### Step 2 — Landing / Invitation Page (`src/app/page.tsx`)

> Assemble the main public entry point for invited guests.

- [x] Update `src/app/page.tsx`:
  - Structure as a responsive Server Component rendering `Hero`, `EventDetails`, and a clean footer.
  - Configure page-level `metadata` (Title: `{graduate.firstName}'s Graduation Celebration`, Description: `RSVP and Gift Registry for {graduate.fullName}`).

---

### Step 3 — RSVP Form & Page (`src/components/rsvp/RsvpForm.tsx`, `src/app/rsvp/page.tsx`)

> Implement the interactive RSVP submission workflow.

- [x] Refine `src/components/rsvp/RsvpForm.tsx`:
  - Ensure full alignment with Zod validation (`createRsvpSchema`) and `submitRsvp` API client helper.
  - Support pre-selecting a gift (`selectedGiftId` query param or state) or selecting/changing the gift via a button linking to `/gifts?rsvp=true`.
  - Add clear loading spinners/button states and error banners during network requests.
- [x] Implement `src/app/rsvp/page.tsx`:
  - Render the RSVP form inside a beautifully styled layout with a header banner and breadcrumbs/back link to `/`.
  - On successful submission (`onSubmit`), redirect the guest cleanly using `useRouter().push('/confirmation?rsvpId=...')` (or via state/session).

---

### Step 4 — Gift Registry Grid & Page (`src/components/gifts/*`, `src/app/gifts/page.tsx`)

> Implement the interactive first-come, first-served gift registry page.

- [x] Refine `src/components/gifts/GiftGrid.tsx` and `src/components/gifts/GiftCard.tsx`:
  - Add filter/search capabilities (e.g., filter by "All", "Available", "Reserved").
  - Enhance `onSelectGift` click handling: if selecting a gift directly, or selecting a gift to attach to an RSVP, handle both modes smoothly.
  - Implement real-time conflict handling: when `reserveGift(giftId, rsvpId)` returns `409 Conflict`, display a friendly modal or alert explaining that another guest claimed the item, and automatically invoke `fetchGifts()` to refresh the item status to `"reserved"`.
- [x] Implement `src/app/gifts/page.tsx`:
  - Fetch all gifts initially (server-side or client-side with SWR/useEffect and loading state).
  - Render a summary banner showing "Gifts Available: X / Y".
  - Include easy navigation back to `/rsvp` or `/` after selecting a gift.

---

### Step 5 — Confirmation Page (`src/app/confirmation/page.tsx`)

> Implement the summary page shown after completing an RSVP or reserving a gift.

- [x] Implement `src/app/confirmation/page.tsx`:
  - Read query params (e.g. `rsvpId` or guest summary data) or retrieve the single RSVP details (`GET /api/v1/rsvp/[id]`).
  - Display a celebratory confirmation badge ("Thank You, {guestName}! We've recorded your RSVP.").
  - Summarize attending status, guest count, and the chosen gift (with gift photo and description if selected).
  - Provide buttons to "Return to Invitation (`/`)" or "Browse Registry (`/gifts`)".
  - Handle loading (`loading.tsx`) and error states (`error.tsx`) gracefully if ID lookup fails.

---

### Step 6 — Navigation & Responsive Polish (`src/app/layout.tsx`)

> Ensure cohesive navigation and flawless responsive presentation across all viewports.

- [x] Add a clean, lightweight guest header/navigation bar across guest routes (`/`, `/rsvp`, `/gifts`) with mobile hamburger or responsive flex layout.
- [x] Test and adjust spacing, typography scaling, and glassmorphism/shadow cards on mobile (`375px`), tablet (`768px`), and desktop (`1280px`).

---

### Step 7 — Verification & Automated Quality Checks

> Confirm zero regressions and full alignment with project rules.

- [x] Run `npm run lint` and verify exactly 0 errors and 0 warnings.
- [x] Run `npm run build` and verify all static and dynamic pages compile cleanly without TypeScript errors.
- [x] Run `npm test` to verify Phase 1 atomic gift reservation integration tests continue passing.

---

### Step 8 — Docs & Status Update

- [x] Mark Phase 2 tasks (`[x] Landing / Invitation page`, `[x] RSVP form page`, `[x] Gift registry page`, `[x] Confirmation page`, etc.) as completed in `docs/project-status/project-status.md`.
- [x] Update this memory's `status` to `🟢 Done` and add `completed: YYYY-MM-DD` upon clean execution.

---

## Acceptance Criteria

- [x] `npm run lint` passes with 0 errors and 0 warnings.
- [x] `npm run build` completes cleanly with no TypeScript compilation errors.
- [x] No `console.log` debugging statements or `any` types in newly added code.
- [x] All images (`graduate.photoUrl`, gift cards) use `next/image` with proper sizing/fill props (`<img>` forbidden).
- [x] Landing page (`/`) renders `EVENT_DETAILS` data dynamically without hardcoded strings.
- [x] RSVP form (`/rsvp`) validates input via Zod and redirects to `/confirmation` on success.
- [x] Gift selection gracefully handles `409 Conflict` (race condition) by showing a notice and re-fetching the updated list without crashing.
- [x] All Phase 2 items marked `[x]` in `docs/project-status/project-status.md` after completion.
