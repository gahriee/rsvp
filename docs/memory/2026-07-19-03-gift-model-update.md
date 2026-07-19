---
id: 2026-07-19-03-gift-model-update
title: "Update Gift Model with Image Upload and Product Link"
type: feature
priority: 🟡 Medium
status: 🟢 Done
phase: 4
created: 2026-07-19
completed: 2026-07-19 2026-07-19
---

## Context

> The graduate requested the ability to upload gift images directly from the admin dashboard (rather than manually pasting an image URL) and the ability to add a product link (e.g., a Shopee or Lazada link) to the gift so guests know exactly where to purchase it. This memory tracks the full-stack update of the `Gift` model to support these fields.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | Update Mongoose `Gift` schema to add `productLink` field.                           |
| **Shared Types**     | Update `zod` schemas and `types.ts` to support `productLink` and base64 `imageUrl`. |
| **Frontend**         | Update `GiftModalForm`, `GiftTable`, and `GiftGrid` to handle file uploads and links. |

---

## Dependencies

_No dependencies — this memory can be started immediately._

---

## Architecture Constraints Reminder

- **Data Size Limit:** Base64 encoded images can be large. The frontend should ideally compress or limit the size of the uploaded image before converting to base64, or enforce a strict max size (e.g., < 2MB).
- All shared type shapes live exclusively in `src/lib/types.ts` and `src/lib/validators.ts`.

---

## AI Agent Instructions

---

### Step 1 — Database (`src/lib/models/Gift.ts`)

> Update the Mongoose schema.
- [x] Add `productLink: { type: String, required: false }` to the `giftSchema`.
- [x] Ensure the schema allows `imageUrl` to store long base64 strings (Mongoose strings have no strict length limit by default, so it should be fine).

---

### Step 2 — Shared Types / Contracts (`src/lib/types.ts` and `src/lib/validators.ts`)

> Update Zod schemas and TypeScript interfaces.
- [x] In `validators.ts`, add `productLink: z.string().url().optional().or(z.literal(""))` to `createGiftSchema` and `updateGiftSchema`.
- [x] In `validators.ts`, update `imageUrl` in `createGiftSchema` and `updateGiftSchema`. Since it will store base64 Data URLs, remove the `.url()` constraint and use `.min(1, "Image is required")`.
- [x] In `types.ts`, add `productLink?: string` to the `Gift` interface.

---

### Step 3 — Controller / Route Handler (`src/app/api/v1/admin/gifts/route.ts` & `[id]/route.ts`)

> Next.js config update for payload size (optional but recommended if base64 payloads are rejected).
- [x] Since we use `NextResponse.json` and standard `Request`, check if body size limits need adjusting. Next.js App Router has a default body size limit of 2MB on Vercel. We might not need changes if we enforce client-side limits, but keep this in mind. No changes needed to the actual route logic as it relies on the Zod schemas updated in Step 2.

---

### Step 4 — Frontend (`src/components/admin` & `src/components/gifts`)

> Update the UI to handle image uploads and display the product link.
- [x] Update `GiftModalForm.tsx`:
  - Change the "Image URL" input to a `<input type="file" accept="image/*" />`.
  - Use `FileReader` to convert the selected file to a base64 Data URL and store it in the `imageUrl` state.
  - Add a new input field for "Product Link (e.g. Shopee)".
- [x] Update `GiftTable.tsx` in the admin area to display an external link icon next to the gift name if `productLink` exists.
- [x] Update `GiftGrid.tsx` (guest facing):
  - Add a "Buy Here" or "View Product" link/button in the gift card if `productLink` is present. Ensure it opens in a new tab (`target="_blank"`).

---

### Step 5 — Docs & Status Update

- [x] Mark this memory's `status` to `🟢 Done` and populate the `completed` date.

---

## Acceptance Criteria

- [x] The Mongoose schema and Zod validators correctly accept a `productLink`.
- [x] The `imageUrl` field accepts base64 strings instead of strictly URLs.
- [x] `GiftModalForm` allows the admin to pick an image from their device, which is converted to base64 before submitting.
- [x] `GiftGrid` displays the product link cleanly for guests.
