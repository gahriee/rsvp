---
id: 2026-07-21-02-update-location
title: "Update Venue Location"
type: feature
priority: 🟡 Medium
status: 🟢 Done
phase: 5
created: 2026-07-21
completed: 2026-07-21
---

## Context

> The venue for the graduation celebration has been updated to "Jollibee Marilaque near SM Cherry". This memory handles updating the location text and the Google Maps embedded link on the invitation page to ensure guests can easily navigate to the correct venue. This falls under Phase 5 (Launch & CI/CD) as a final content review adjustment before full deployment.

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
| **Frontend**         | Update `MapNavigation.tsx` (and `eventDetails.ts` if applicable) with new venue location |

---

## Dependencies

> No dependencies — this memory can be started immediately.

---

## Architecture Constraints Reminder

- **Frontend First:** This is a purely visual/content change in the frontend components and constants.
- **Maintain Styling:** Ensure any embedded maps or location texts retain the existing scrapbook/feminine aesthetic.

---

## AI Agent Instructions

### Step 1 — Frontend (`src/components/invitation/MapNavigation.tsx`)

> Update the venue address and embedded map link.

- [x] Open `src/components/invitation/MapNavigation.tsx` (and `src/lib/constants/eventDetails.ts` if venue info is centralized).
- [x] Change the text/location to "Jollibee Marilaque near SM Cherry".
- [x] Update the `iframe` or `href` map link to the newly provided Google Maps URL: `https://www.google.com/maps/place/Jollibee+Marilaque/@14.6247071,121.1320907,223m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3397b96f9415d22f:0xb17e83968c0b5620!2sJollibee+SM+Cherry+Antipolo!8m2!3d14.624897!4d121.1338348!16s%2Fg%2F11h3spw_p6!3m5!1s0x3397b90015d7e11d:0x5fbacbdc1c3fd310!8m2!3d14.6245766!4d121.1323038!16s%2Fg%2F11lv_vrx7c?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D`.

---

### Step 2 — Tests

- [x] Ensure `npm run lint` and `npm run build` pass successfully after the content update.

---

### Step 3 — Environment Variables _(if applicable)_

- [x] _No new config values introduced in this memory._

---

### Step 4 — Docs & Status Update

- [x] Set this memory's `status` to `🟢 Done` and populate the `completed` date.

---

## Acceptance Criteria

- [x] The venue map correctly points to "Jollibee Marilaque near SM Cherry" when clicked or viewed.
- [x] `npm run lint` passes with 0 errors.
- [x] `npm run build` passes with 0 errors.
