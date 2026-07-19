---
id: 2026-07-20-02-nodemailer-integration
title: "Migrate Email Sending from Resend to Nodemailer"
type: feature
priority: 🔴 High
status: 🟢 Done
phase: 4
created: 2026-07-20
completed: 2026-07-20
---

## Context

> The user requested to use `nodemailer` instead of `resend` for sending RSVP confirmation emails. We need to swap out the underlying email service dependency while maintaining the existing `sendRsvpConfirmationEmail` interface in `src/lib/services/emailService.ts`. This is a Phase 4 feature (Polish & Extras) that updates the email confirmation requirement.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | N/A                                                                                 |
| **Service**          | Update `src/lib/services/emailService.ts` to use `nodemailer` instead of `resend`   |
| **Shared Types**     | N/A                                                                                 |
| **Controller / DTO** | N/A                                                                                 |
| **Realtime**         | N/A                                                                                 |
| **Frontend**         | N/A                                                                                 |

---

## Dependencies

_No dependencies — this memory can be started immediately._

---

## Architecture Constraints Reminder

- **Zero Lint Errors:** The project must maintain 0 ESLint warnings or errors.
- **Error Handling:** The email service must catch and log errors, without crashing the application on network failure.

---

## AI Agent Instructions

### Step 1 — Database (`src/models`)

_No schema changes in this memory._

---

### Step 2 — Service (`src/lib/services/emailService.ts`)

- [x] Run `npm install nodemailer` and `npm install -D @types/nodemailer`.
- [x] Optionally remove `resend` by running `npm uninstall resend`.
- [x] Update `src/lib/services/emailService.ts` to initialize a `nodemailer` transporter using the new SMTP environment variables.
- [x] Refactor `sendRsvpConfirmationEmail` to use `transporter.sendMail()` instead of `resend.emails.send()`. Ensure HTML structure and styling remain exactly the same.
- [x] Log success or catch errors cleanly.

---

### Step 3 — Shared Types / Contracts

_No shared-types changes in this memory._

---

### Step 4 — Controller / Route Handler + DTO

_No controller/route handler changes required as the service interface stays the same._

---

### Step 5 — Realtime / Async Events

_No realtime changes in this memory._

---

### Step 6 — Frontend

_No frontend changes required._

---

### Step 7 — Tests

- [x] Update `tests/polishAndSecurity.test.ts` (or relevant test files) to mock `nodemailer` instead of `resend`.
- [x] Ensure the tests for email service success and failure pathways are properly asserting the new transporter implementation.
- [x] Run `npm run test` and `npx tsc --noEmit` to verify type safety and tests pass.

---

### Step 8 — Environment Variables

- [x] Add the following SMTP variables to `.env.example`:
  ```ini
  # SMTP configuration for Nodemailer
  SMTP_HOST=
  SMTP_PORT=
  SMTP_USER=
  SMTP_PASS=
  SMTP_FROM=
  ```
- [x] Remove `RESEND_API_KEY` from `.env.example`.
- [x] Post a summary in chat at the end of the memory:

  ```
  🔑 New config values required — please add these to your .env:

  SMTP_HOST    → Your SMTP server host (e.g., smtp.gmail.com)
  SMTP_PORT    → Your SMTP server port (e.g., 587)
  SMTP_USER    → Your SMTP username/email
  SMTP_PASS    → Your SMTP password/app-password
  SMTP_FROM    → The sender email address
  ```

---

### Step 9 — Docs & Status Update

- [x] Ensure Phase 4 tasks in `docs/project-status/project-status.md` reflect this updated approach.
- [x] Set this memory's `status` to `🟢 Done` and populate the `completed` date.

---

## Acceptance Criteria

- [x] `nodemailer` is successfully used to send emails instead of `resend`.
- [x] `.env.example` is updated to reflect SMTP config variables instead of Resend variables.
- [x] `npm run lint` and `npx tsc --noEmit` pass with zero errors.
- [x] `npm run test` passes, with email tests properly mocking `nodemailer`.
