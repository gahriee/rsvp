---
id: 2026-07-20-03-rsvp-page-music
title: "Add Background Music to RSVP Page"
type: feature
priority: 🟡 Medium
status: 🟢 Done
phase: 4
created: 2026-07-20
completed: 2026-07-20
---

## Context

> The user requested adding background music to the RSVP page with controls to mute or adjust the volume. This falls under Phase 4 (Polish & Extras) to enhance the user experience and add a personal, scrapbook/celebratory touch to the site.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | N/A                                                                                 |
| **Service**          | N/A                                                                                 |
| **Shared Types**     | N/A                                                                                 |
| **Controller / DTO** | N/A                                                                                 |
| **Realtime**         | N/A                                                                                 |
| **Frontend**         | A `MusicPlayer` client component added to `src/app/rsvp/page.tsx` or `RsvpPageClient` |

---

## Dependencies

_No dependencies — this memory can be started immediately._

---

## Architecture Constraints Reminder

- The `MusicPlayer` must be a client component (`"use client"`).
- Autoplay policies in modern browsers usually require user interaction before audio can play. We should either wait for an interaction or start muted by default.
- UI should match the feminine, scrapbook-inspired, pastel pink theme.
- Must result in zero ESLint warnings or errors.

---

## AI Agent Instructions

### Step 1 — Database
_No schema changes in this memory._

---

### Step 2 — Service
_No backend service changes needed._

---

### Step 3 — Shared Types / Contracts
_No shared-types changes in this memory._

---

### Step 4 — Controller / Route Handler + DTO
_No controller changes needed._

---

### Step 5 — Realtime / Async Events
_No realtime changes in this memory._

---

### Step 6 — Frontend (`src/components/ui/MusicPlayer.tsx` and `src/components/rsvp/RsvpPageClient.tsx`)

- [x] Create `src/components/ui/MusicPlayer.tsx` (a client component).
- [x] Implement an HTML5 `<audio>` element with a state to track `isPlaying` and `volume`.
- [x] Include a play/pause button and a volume slider.
- [x] Style the player to fit the scrapbook/pastel pink aesthetic (e.g., using Lucide icons for play/pause/volume, maybe floating or sticky).
- [x] Ensure the component handles browser autoplay policies gracefully.
- [x] Import and place the `MusicPlayer` in `src/components/rsvp/RsvpPageClient.tsx`.
- [x] Use a placeholder URL or prompt the user for an actual audio file.

---

### Step 7 — Tests
- [x] Verify there are no ESLint or TypeScript compilation errors (`npm run lint`, `npx tsc --noEmit`).

---

### Step 8 — Environment Variables
_No new config values introduced in this memory._

---

### Step 9 — Docs & Status Update

- [x] Add this item to `docs/project-status/project-status.md` under Phase 4 and check it off when complete.
- [x] Set this memory's `status` to `🟢 Done` and populate the `completed` date.

---

## Acceptance Criteria

- [x] A music player is visible on the RSVP page.
- [x] The user can toggle play/pause and adjust the volume or mute.
- [x] The UI fits the project's existing feminine, pastel pink aesthetic.
- [x] Browser autoplay restrictions are handled without crashing or breaking the UI.
- [x] `npm run lint` and `npx tsc --noEmit` pass with zero errors.
