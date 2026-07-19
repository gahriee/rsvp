---
id: 2026-07-17-03-single-page-and-lucide-icons
title: "Phase 4 Supplement: Single-Page Experience & Lucide Icon Modernization (No Emojis)"
type: feature
priority: 🔴 High
status: 🔴 To Do
phase: 4
created: 2026-07-17
completed:
---

## Context

> Following the Pastel Pink aesthetic and section additions, the user requested three architectural and UX updates:
> 1. **Remove all emojis**: Eliminate all emoji characters (`🌸`, `✨`, `🎁`, `💕`, `📍`, `🎟️`, etc.) from guest-facing pages.
> 2. **Use proper icons (`lucide-react`)**: Install `lucide-react` via npm and use clean, professional SVG icons across all components (`Hero`, `EventDetails`, `Timeline`, `DressCode`, `MapNavigation`, `PhotoCollage`, `Countdown`, `RsvpForm`, `GiftGrid`, `GiftCard`, `ConfirmationCard`, `GuestNavbar`, `Footer`).
> 3. **Single-Page Website (No Navigations)**: Consolidate the guest journey into a cohesive **one-page website** (`/`) with no multi-page navigation links. The RSVP form and Gift Registry will live directly on the landing page so guests can browse details, select a gift, and submit their RSVP on a single unified page without navigating across separate route transitions.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | _No schema changes (`Gift` and `Rsvp` models remain unchanged)._                    |
| **Service**          | Update `src/lib/constants/eventDetails.ts` and UI constants to remove emojis.       |
| **Shared Types**     | _No shared types changes._                                                          |
| **Controller / DTO** | _No API route changes (`/api/v1/rsvp`, `/api/v1/gifts/*` remain intact)._           |
| **Realtime**         | _No realtime changes._                                                              |
| **Frontend**         | Install `lucide-react`. Create `SinglePageRsvpApp.tsx` (or update `src/app/page.tsx`) that embeds `Hero`, `EventDetails`, `Timeline`, `DressCode`, `MapNavigation`, `PhotoCollage`, `Countdown`, `GiftGrid`, and `RsvpForm` in a single scrolling layout. Remove multi-page navigation links from `GuestNavbar.tsx` and `Footer.tsx`. Replace all emojis with `lucide-react` icons. |

---

## Dependencies

- **Completed**: Phase 1 (`docs/memory/2026-07-13-01-database-and-backend.md`)
- **Completed**: Phase 2 (`docs/memory/2026-07-16-01-guest-facing-frontend-pages.md`)
- **Completed**: Phase 4 Core (`docs/memory/2026-07-16-03-polish-and-extras.md`)
- **Completed**: Pastel Pink & Sections (`docs/memory/2026-07-17-02-pastel-pink-theme-and-sections.md`)
- _No blocking dependencies — ready for execution._

---

## Architecture Constraints Reminder

- **Preserve Atomic Gift Reservation**: Do not alter `PATCH /api/v1/gifts/[id]/reserve`.
- **ESLint Zero Warnings/Errors**: Must run and pass `npm run lint` (`next lint`) and `npm run build` with zero errors or warnings.
- **No Unused Imports / No Emojis**: Ensure zero emoji remnants (`eslint-plugin-react` / zero warnings) and clean `lucide-react` imports.
- **Single-Page UX**: No multi-page redirects (`/rsvp`, `/gifts`, `/confirmation`) from `GuestNavbar`. All core guest functionality happens smoothly on `/`.

---

## AI Agent Instructions

### Step 1 — Install `lucide-react`
- [ ] Run `npm install lucide-react` using exact package flags.

### Step 2 — Remove Emojis & Replace with Lucide Icons in Constants & Components
- [ ] Update `src/lib/constants/eventDetails.ts` and `src/components/invitation/*` (`Hero`, `EventDetails`, `Timeline`, `DressCode`, `MapNavigation`, `PhotoCollage`, `Countdown`):
  - Strip all emojis (`🌸`, `✨`, `🎁`, `🎉`, `💕`, `📍`, `⏰`, etc.).
  - Import and use `lucide-react` icons (`Calendar`, `MapPin`, `Clock`, `Sparkles`, `CheckCircle2`, `Heart`, `Navigation`, `Camera`, `Gift`, `Shirt`, etc.).
- [ ] Update `src/components/navigation/*` (`GuestNavbar.tsx`, `Footer.tsx`):
  - Remove emojis and multi-page links (`/rsvp`, `/gifts`). Replace with smooth scroll anchor buttons (`#invitation`, `#timeline`, `#wishlist`, `#rsvp`) or simplified branding header.
- [ ] Update `src/components/gifts/*` (`GiftGrid.tsx`, `GiftCard.tsx`) & `src/components/rsvp/*` (`RsvpForm.tsx`):
  - Strip all emojis and use clean `lucide-react` icons (`Gift`, `Heart`, `AlertTriangle`, `Check`, `User`, `Mail`, `Users`, `MessageSquare`, `Send`, `PartyPopper`).
- [ ] Update `ConfirmationCard.tsx`:
  - Strip emojis and use `lucide-react` icons (`CheckCircle2`, `Ticket`, `Heart`, `PartyPopper`).

### Step 3 — Consolidate into a Single Page (`src/app/page.tsx` / Single-Page Experience)
- [ ] Refactor `src/app/page.tsx` and create/refactor `SinglePageApp.tsx` so that `/` hosts the complete guest journey:
  - 1. Invitation Hero & Event Details (`#invitation`)
  - 2. Event Timeline (`#timeline`)
  - 3. Dress Code (`#dresscode`)
  - 4. Map & Navigation (`#location`)
  - 5. Photo Collage & Countdown (`#memories`)
  - 6. Gift Registry Grid (`#wishlist`) — where clicking "Select Gift" updates the selected gift for RSVP without leaving the page.
  - 7. RSVP Form (`#rsvp`) — pre-populated with the selected gift if chosen. When submitted successfully, inline confirmation card (`ConfirmationCard` / Thank You view) is rendered right on the page or inside the RSVP section.
- [ ] Ensure `/rsvp`, `/gifts`, and `/confirmation` routes redirect cleanly to `/` or render the single-page view with appropriate section scroll/state.

### Step 4 — Verification & QA
- [ ] Run `npm run lint` to verify zero ESLint warnings and zero errors.
- [ ] Run `npm run build` to verify clean production compilation.
- [ ] Run `npm test` to verify integration tests pass.
- [ ] Mark checklist items complete and mark this memory `status: 🟢 Done`.

---

## Acceptance Criteria
- [ ] All emojis (`🌸`, `✨`, etc.) are completely removed from all guest-facing components.
- [ ] `lucide-react` SVG icons are used systematically across all sections.
- [ ] The website is strictly **1 page** (`/`) with no multi-page navigation links (`GuestNavbar` links jump to anchors or are simplified, and RSVP + Gift selection + Confirmation happen on the single page).
- [ ] `npm run lint` and `npm run build` pass with zero errors or warnings.
