---
id: 2026-07-20-01-gift-max-reservations
title: "Update Gift Registry for Max 3 Reservations Per Item"
type: feature
priority: 🔴 High
status: 🟢 Done
phase: 4
created: 2026-07-20
completed: 2026-07-20
---

## Context

> The user requested that the gift registry allow items to be reserved up to a maximum of 3 times, rather than just once. This requires changing the data model from a single `reservedBy` reference to an array of references, tracking `maxReservations`, and ensuring the atomic update mechanism gracefully handles concurrent selections without exceeding the maximum limit.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | Update `Gift` schema to replace `reservedBy` with an array, add `maxReservations`   |
| **Service**          | N/A                                                                                 |
| **Shared Types**     | Update `IGift` interface and Zod schemas to handle array and max limits             |
| **Controller / DTO** | Update `PATCH /api/gifts/[id]/reserve` to atomically push to array if below max     |
| **Frontend**         | Update guest `GiftCard` to show "X/3 Reserved" and admin UI to support the limits   |

---

## Dependencies

_No dependencies — this memory can be started immediately._

---

## Architecture Constraints Reminder

- **Atomic Reservations:** The gift reservation logic (`PATCH /api/gifts/[id]/reserve`) must remain atomic. Use MongoDB's atomic operators (e.g., `$push` with a filter checking the array size against `maxReservations` or a pipeline update) to prevent race conditions.
- **Single Source of Truth:** All shared types (`Gift`, API payload shapes) live in `src/lib/types.ts`.
- **Zero Lint Errors:** The project must have 0 ESLint warnings or errors.

---

## AI Agent Instructions

### Step 1 — Database (`src/models/Gift.ts`)

- [x] Update `IGiftDocument` interface:
  - Change `reservedBy: Types.ObjectId | null;` to `reservedBy: Types.ObjectId[];`
  - Add `maxReservations: number;`
  - Ensure the schema sets `reservedBy` to an empty array by default `default: []`.
  - Add `maxReservations` to the schema with `type: Number, default: 3`.

---

### Step 2 — Shared Types / Contracts (`src/lib/types.ts` & `src/lib/validators.ts`)

- [x] Update the `Gift` type in `src/lib/types.ts`:
  - Change `reservedBy: string | null` to `reservedBy: string[]`
  - Add `maxReservations: number`
- [x] Update `createGiftSchema` and `updateGiftSchema` in `src/lib/validators.ts` to optionally accept `maxReservations` (default 3, min 1).

---

### Step 3 — Controller / Route Handler + DTO (`src/app/api/gifts/[id]/reserve/route.ts`)

- [x] Modify the atomic reservation logic in `PATCH /api/gifts/[id]/reserve/route.ts`:
  - Instead of `findOneAndUpdate({ _id: id, status: "available" }, { status: "reserved", reservedBy: rsvpId })`, use a query that checks the array size against `maxReservations`.
  - Example: `findOneAndUpdate({ _id: id, $expr: { $lt: [{ $size: "$reservedBy" }, "$maxReservations"] } }, { $push: { reservedBy: rsvpId } }, { new: true })`.
  - Ensure it still handles 404/Conflict correctly if the gift is already fully reserved.
- [x] Fix any other routes that might expect `reservedBy` to be a single string (e.g., `GET /api/gifts` or admin routes, though they usually just return the JSON).

---

### Step 4 — Frontend (`src/components/gifts/GiftCard.tsx` & `src/components/admin/GiftModalForm.tsx`)

- [x] Update `GiftCard.tsx`:
  - Change the "Available" text to show availability fractions, e.g., "Available ({maxReservations - reservedBy.length}/{maxReservations})".
  - Disable the "Reserve" button only when `reservedBy.length >= maxReservations` (or if `status` logic is adapted).
- [x] Update `GiftModalForm.tsx`:
  - Add a number input for `maxReservations` (defaulting to 3) so admins can change the limit per gift.
- [x] Ensure guest and admin dashboards don't break when `reservedBy` is an array instead of a string.

---

### Step 5 — Docs & Status Update

- [x] Mark tasks as `[x]` in `docs/project-status/project-status.md` under Phase 4/5.
- [x] Set this memory's `status` to `🟢 Done` and populate the `completed` date.

---

## Acceptance Criteria

- [x] `Gift` schema robustly supports an array of `reservedBy` ObjectIds and a `maxReservations` integer.
- [x] Reserving a gift increments the array; if the array length equals `maxReservations`, further reservations fail with a 409 Conflict.
- [x] The atomic nature of the reservation is strictly maintained.
- [x] UI properly reflects partial reservations (e.g., 1/3 reserved).
- [x] ESLint and TypeScript compilation pass with zero errors.
