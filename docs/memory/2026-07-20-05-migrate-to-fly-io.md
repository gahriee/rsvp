---
id: 2026-07-20-05-migrate-to-fly-io
title: "Migrate Database Hosting from Railway to Fly.io"
type: infrastructure
priority: 🔴 High
status: 🟢 Done
phase: 5
created: 2026-07-20
completed: 2026-07-20
---

## Context

> The user requested changing the backend/database hosting platform from Railway to Fly.io. This falls under Phase 5 (Launch & CI/CD Pipeline) and involves updating the deployment documentation and any relevant configuration to reflect Fly.io as the provider for MongoDB.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | Fly.io configuration guidelines for MongoDB hosting                                 |
| **Infrastructure**   | Update `docs/deployment-guide.md` and project status to replace Railway with Fly.io |
| **Service**          | N/A                                                                                 |
| **Shared Types**     | N/A                                                                                 |
| **Controller / DTO** | N/A                                                                                 |
| **Realtime**         | N/A                                                                                 |
| **Frontend**         | N/A                                                                                 |

---

## Dependencies

> This memory follows memory `2026-07-20-04-ci-cd-pipeline`, which initially set up Railway.

---

## Architecture Constraints Reminder

- Fly.io must provide a MongoDB connection string compatible with the `MONGODB_URI` environment variable used by `src/lib/mongodb.ts`.
- Documentation should be updated without changing application code, as the connection mechanism remains identical.

---

## AI Agent Instructions

### Step 1 — Database / Infrastructure

- [x] Update `docs/deployment-guide.md` to replace "Railway Database Setup" with "Fly.io Database Setup".
- [x] Provide clear, step-by-step instructions on provisioning a MongoDB instance on Fly.io.

---

### Step 2 — Service
_No service changes needed._

---

### Step 3 — Shared Types / Contracts
_No shared types changes._

---

### Step 4 — Controller / Route Handler + DTO
_No route handler changes._

---

### Step 5 — Realtime / Async Events
_No realtime changes._

---

### Step 6 — Frontend
_No frontend changes._

---

### Step 7 — Tests
- [x] Verify that `npm run lint` and TypeScript compilation (`npx tsc --noEmit`) continue to pass.

---

### Step 8 — Environment Variables

- [x] Review `.env.example` to ensure `MONGODB_URI` is now documented as coming from Fly.io instead of Railway.
- [x] Post a summary in chat at the end of the memory.

---

### Step 9 — Docs & Status Update

- [x] Update `docs/project-status/project-status.md` to replace "Configure Railway for backend services / MongoDB" with "Configure Fly.io for backend services / MongoDB".
- [x] Mark this memory's `status` as `🟢 Done` and populate `completed` when finished.

---

## Acceptance Criteria

- [x] `docs/deployment-guide.md` reflects Fly.io instructions instead of Railway.
- [x] `.env.example` comments reflect Fly.io.
- [x] `docs/project-status/project-status.md` mentions Fly.io.
- [x] `docs/project-status/project-status.md` updated with completed task checkmarks.
