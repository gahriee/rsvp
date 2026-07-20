---
id: 2026-07-21-01-update-gift-rsvp-rules
title: "Update Gift Text, RSVP Form and Add Rules"
type: feature
priority: 🔴 High
status: 🟢 Done
phase: 4
created: 2026-07-21
completed: 2026-07-21
---

## Context

> The user requested several content and functional updates to the frontend:
> 1. Update the descriptive text in the `GiftGrid` component.
> 2. Remove the "Guest number" (plus ones) field from the RSVP form and ensure gift selection is required.
> 3. Add a new "Rules" section for the celebration to the landing page.

---

## Scope

This memory implements the following paired unit of work _(fill in or mark N/A per row)_:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | N/A                                                                                 |
| **Service**          | N/A                                                                                 |
| **Shared Types**     | Update RSVP type/schema to remove `guestCount`                                       |
| **Controller / DTO** | Update `/api/rsvp` route handler to remove `guestCount` validation                   |
| **Realtime**         | N/A                                                                                 |
| **Frontend**         | Update `GiftGrid`, `RsvpForm` and add `Rules` section to the landing page           |

---

## Dependencies

> No dependencies — this memory can be started immediately.

---

## Architecture Constraints Reminder

- All shared type shapes live exclusively in `src/lib/types.ts`. Never duplicate a type across apps/services.
- Ensure 0 ESLint errors/warnings.
- Zod schemas must match frontend updates.

---

## AI Agent Instructions

### Step 1 — Shared Types / Contracts (`src/lib/types.ts` & Validation Schema)

- [ ] Remove `guestCount` from `Rsvp` interface and Zod schema.
- [ ] Ensure `giftId` validation is required in the Zod schema if not already.

---

### Step 2 — Controller / Route Handler + DTO (`src/app/api/rsvp/route.ts`)

- [ ] Update `POST` handler to not expect or process `guestCount`.
- [ ] Update any RSVP processing logic to remove `guestCount` dependencies.

---

### Step 3 — Frontend (`src/components/gifts/GiftGrid.tsx`, `src/components/rsvp/RsvpForm.tsx`, `src/app/page.tsx`)

- [ ] Update `src/components/gifts/GiftGrid.tsx`: Replace "flower garden wishlist" text with the new required text.
- [ ] Update `src/components/rsvp/RsvpForm.tsx`: Remove "Guest number" field, and ensure the UI explicitly requires gift selection.
- [ ] Add a new Rules section to the landing page/invitation (either inline in a component or as a new component like `Rules.tsx`).

---

### Step 4 — Tests

- [ ] Run application build and lint commands to verify 0 warnings/errors.

---

### Step 5 — Docs & Status Update

- [ ] Update `docs/project-status/project-status.md` with new features checkmarks if needed.
- [ ] Set this memory's `status` to `🟢 Done` and populate the `completed` date.

---

## Acceptance Criteria

- [ ] No `guestCount` appears in form or API requests.
- [ ] Zod strictly requires a selected gift.
- [ ] Rules are visible on the landing page.
- [ ] Project builds with 0 ESLint errors/warnings.
