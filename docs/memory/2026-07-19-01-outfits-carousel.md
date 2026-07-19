---
id: 2026-07-19-01-outfits-carousel
title: "Outfits Carousel UI"
type: feature
priority: 🟡 Medium
status: 🟢 Done
phase: 4
created: 2026-07-19
completed: 2026-07-19
---

## Context

> The user requested to replace the existing "Sweet memories" photo section with a "cool carousel for each outfit". The goal is to better showcase the different outfits (corporate, school attire, toga) using the available images in the `public/` directory.
> This belongs to Phase 4 (Polish & Extras) of `docs/project-status/project-status.md`.

---

## Scope

This memory implements the following paired unit of work _(fill in or mark N/A per row)_:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | N/A                                                                                 |
| **Service**          | N/A                                                                                 |
| **Shared Types**     | N/A                                                                                 |
| **Controller / DTO** | N/A                                                                                 |
| **Realtime**         | N/A                                                                                 |
| **Frontend**         | Update `PhotoCollage.tsx` (or a new component) to render carousels for each outfit category (`corporate`, `schoolattire`, `togapic`). |

---

## Dependencies

> No dependencies — this memory can be started immediately.

---

## Architecture Constraints Reminder

- All shared type shapes live exclusively in `[shared types location]`. Never duplicate a type across apps/services.
- No new routes without checking if it fits the architecture.
- Follow existing Tailwind CSS styling conventions and standard aesthetic (feminine UI redesign / scrapbook).

---

## AI Agent Instructions

### Step 1 — Frontend (`src/components/invitation/PhotoCollage.tsx` or new `OutfitsCarousel.tsx`)

- [ ] Create or update the frontend component to display the images as a cool carousel grouped by outfits: "Corporate", "School Attire", and "Toga".
- [ ] Use images available in `public/`: `corporate_*.JPG`, `schoolattire_*.JPG`, `togapic_*.JPG`.
- [ ] Ensure the component utilizes responsive design (Tailwind) and provides a polished UI (e.g. Swiper, Embla, or a CSS snap-scroll based carousel).

### Step 2 — Docs & Status Update

- [ ] Mark completed tasks in `docs/project-status/project-status.md` (Add "Outfits Carousel" to Phase 4).
- [ ] Set this memory's `status` to `🟢 Done` and populate the `completed` date.

---

## Acceptance Criteria

- [ ] The Sweet memories section is replaced with an Outfits Carousel.
- [ ] The carousel correctly displays the 3 categories of outfits (Corporate, School Attire, Toga).
- [ ] The design feels modern, polished, and aligns with the feminine/scrapbook aesthetic.
- [ ] The page loads correctly with no lint/type errors.
