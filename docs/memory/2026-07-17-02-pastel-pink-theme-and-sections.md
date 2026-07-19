---
id: 2026-07-17-02-pastel-pink-theme-and-sections
title: "Phase 4 Supplement: Pastel Pink Theme & Landing Page Sections (Timeline, Dress Code, Map Navigation)"
type: feature
priority: 🔴 High
status: 🟢 Done
phase: 4
created: 2026-07-17
completed: 2026-07-17
---

## Context

> Following the scrapbook UI redesign, the user requested shifting the main color scheme to airy **Pastel Pink** and adding three dedicated, aesthetically rich sections to the invitation landing page (`/`):
> 1. **Event Timeline**: A step-by-step visual schedule for the graduation celebration day.
> 2. **Dress Code**: Inspired by the user's reference image (`Dress Code: SEMI FORMAL - NEUTRAL & PASTEL TONES`), featuring an aesthetic grid of circle color swatches (creams, sands, blush taupes, mochas, rich cocoa, and soft greys) with clear attire guidelines.
> 3. **Google Map Navigation**: An interactive location card with direct navigation links (Google Maps, Apple Maps, parking details) for seamless guest arrival.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | _No schema changes required (`Gift` and `Rsvp` models remain unchanged)._           |
| **Service**          | Update `src/lib/constants/eventDetails.ts` with `timeline`, `dressCode`, and `navigation` data. |
| **Shared Types**     | _No shared types changes required._                                                 |
| **Controller / DTO** | _No backend route modifications required._                                          |
| **Realtime**         | _No realtime changes._                                                              |
| **Frontend**         | Create `Timeline.tsx`, `DressCode.tsx`, and `MapNavigation.tsx` in `src/components/invitation/`. Refactor global layout, navbar, footer, landing page, RSVP form, gift registry, and confirmation view to adopt a cohesive airy Pastel Pink (`pink-50/100/200/300/400`) aesthetic. |

---

## Dependencies

- **Completed**: Phase 1 (`docs/memory/2026-07-13-01-database-and-backend.md`)
- **Completed**: Phase 2 (`docs/memory/2026-07-16-01-guest-facing-frontend-pages.md`)
- **Completed**: Phase 4 Core (`docs/memory/2026-07-16-03-polish-and-extras.md`)
- **Completed**: Scrapbook Redesign (`docs/memory/2026-07-17-01-creative-feminine-ui-redesign.md`)
- _No blocking dependencies — ready for execution._

---

## Architecture Constraints Reminder

- **Preserve Atomic Gift Reservation**: Do not alter `PATCH /api/v1/gifts/[id]/reserve`.
- **ESLint Zero Warnings/Errors**: Must run and pass `npm run lint` (`next lint`) and `npm run build` with zero errors or warnings.
- **Image & Icon Best Practices**: Strictly use `next/image` with explicit sizes. Use accessible SVG or standard Unicode icons with `aria-label`.
- **Server vs Client Components**: Keep static landing page sections as Server Components where possible; only mark interactive cards with `"use client"`.

---

## AI Agent Instructions

### Step 1 — Service & Constants (`src/lib/constants/eventDetails.ts`)

- [x] Update `src/lib/constants/eventDetails.ts`:
  - Add `timeline: Array<{ time: string; title: string; description: string; icon: string }>` with 4 key celebration milestones.
  - Add `dressCode: { title: string; subtitle: string; description: string; swatches: Array<{ name: string; hex: string }> }` featuring circle color swatches (e.g. Cream `#FDFBF7`, Warm Sand `#EAE2D6`, Champagne `#D8CABB`, Blush Taupe `#C8A898`, Warm Mocha `#A87C62`, Rich Cocoa `#5E3A26`, Deep Espresso `#381F14`, Soft Bronze `#6B4E2E`, Warm Grey `#8C827A`, Dove Grey `#B3B0AD`).
  - Add `navigation: { googleMapsUrl: string; appleMapsUrl: string; parkingNotes: string; mapCoordinates: { lat: number; lng: number } }`.

---

### Step 2 — Global Pastel Pink Color Refactor (`layout.tsx`, `GuestNavbar.tsx`, `Footer.tsx`)

- [x] Update `src/app/layout.tsx`:
  - Change background gradient to airy, bright pastel pink (`bg-gradient-to-br from-pink-50 via-rose-50/50 to-white text-slate-800`).
- [x] Update `GuestNavbar.tsx` & `Footer.tsx`:
  - Shift active buttons and highlights to pastel pink (`bg-pink-400/90 hover:bg-pink-500 text-white shadow-pink-200/50`).

---

### Step 3 — Create Event Timeline Component (`src/components/invitation/Timeline.tsx`)

- [x] Create `Timeline.tsx`:
  - Render a vertical or zigzag scrapbook timeline with pastel pink cards, cute tape headers, and time badges.

---

### Step 4 — Create Dress Code Component (`src/components/invitation/DressCode.tsx`)

- [x] Create `DressCode.tsx`:
  - Replicate the exact aesthetic of the user's reference photo:
    - Cursive script title (`Dress Code`), all-caps tracking subtitle (`SEMI FORMAL - NEUTRAL & PASTEL TONES`).
    - Circle color swatch grid displaying the neutral/pastel tone circles.
    - Warm, helpful guidelines note at the bottom.

---

### Step 5 — Create Google Map Navigation Component (`src/components/invitation/MapNavigation.tsx`)

- [x] Create `MapNavigation.tsx`:
  - Render a venue card featuring address details, interactive directions buttons (`Get Google Maps Directions 📍`, `Apple Maps 🗺️`), and parking advice framed in a scrapbook style.

---

### Step 6 — Landing Page Assembly & Color Harmony (`src/app/page.tsx`, `Hero.tsx`, etc.)

- [x] Update `src/app/page.tsx`:
  - Integrate `<Timeline />`, `<DressCode />`, and `<MapNavigation />` between the `Hero`/`EventDetails` and `PhotoCollage` sections.
- [x] Update `Hero.tsx`, `EventDetails.tsx`, `PhotoCollage.tsx`, `Countdown.tsx`:
  - Harmonize borders, badges, and gradients with the new pastel pink (`pink-100/200/300/400`) scheme.

---

### Step 7 — Subpage Pastel Pink Alignment (`/rsvp`, `/gifts`, `/confirmation`)

- [x] Update `RsvpForm.tsx`, `GiftGrid.tsx`, `GiftCard.tsx`, `ConfirmationCard.tsx`:
  - Refactor buttons, card borders, and highlight ribbons from deeper rose/berry to airy pastel pink (`pink-400`, `pink-50`, `rose-100`).

---

### Step 8 — Verification & QA

- [x] Run `npm run lint` to confirm 0 errors and 0 warnings.
- [x] Run `npm run build` to verify clean compilation.
- [x] Run `npm test` to verify all backend and reservation integration tests pass.
- [x] Check off tasks in `project-status.md` and mark this memory `status: 🟢 Done`.

---

## Acceptance Criteria

- [x] The primary visual color theme is airy pastel pink across the whole platform (`/`, `/rsvp`, `/gifts`, `/confirmation`).
- [x] Landing page (`/`) prominently displays the new **Timeline**, **Dress Code** (with circle neutral/pastel swatches replicating the reference image), and **Google Map Navigation** sections.
- [x] `npm run lint` passes with **0 errors and 0 warnings**.
- [x] `npm run build` and `npm test` succeed completely.
