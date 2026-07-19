---
id: 2026-07-20-06-vercel-atlas-deployment
title: "Update Deployment to Vercel and MongoDB Atlas"
type: infrastructure
priority: 🔴 High
status: 🟢 Done
phase: 5
created: 2026-07-20
completed: 2026-07-20
---

## Context

> The user requested updating the deployment instructions to rely solely on Vercel for backend API routes (as serverless functions) and MongoDB Atlas for database hosting, rather than manually setting up Fly.io or Railway.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | MongoDB Atlas configuration guidelines for MongoDB hosting                          |
| **Infrastructure**   | Update `docs/deployment-guide.md` and project status to reflect Vercel + Atlas      |
| **Service**          | N/A                                                                                 |
| **Shared Types**     | N/A                                                                                 |
| **Controller / DTO** | N/A                                                                                 |
| **Realtime**         | N/A                                                                                 |
| **Frontend**         | N/A                                                                                 |

---

## Dependencies

> This memory follows memory `2026-07-20-05-migrate-to-fly-io`, replacing it.

---

## Architecture Constraints Reminder

- MongoDB Atlas provides a connection string fully compatible with Vercel and our `src/lib/mongodb.ts` connection code.
- Vercel functions seamlessly connect to Atlas clusters.

---

## AI Agent Instructions

### Step 1 — Database / Infrastructure

- [x] Update `docs/deployment-guide.md` to replace "Fly.io Database Setup" with "MongoDB Atlas Setup".
- [x] Provide clear, step-by-step instructions on provisioning a free shared cluster on MongoDB Atlas and whitelisting IPs for Vercel.

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
- [x] Verified that project configuration is stable. No code changes require re-testing.

---

### Step 8 — Environment Variables

- [x] Review `.env.example` to ensure `MONGODB_URI` is documented for MongoDB Atlas.

---

### Step 9 — Docs & Status Update

- [x] Update `docs/project-status/project-status.md` to reflect MongoDB Atlas instead of Fly.io.
- [x] Mark this memory's `status` as `🟢 Done` and populate `completed` when finished.

---

## Acceptance Criteria

- [x] `docs/deployment-guide.md` reflects MongoDB Atlas instructions.
- [x] `.env.example` comments reflect MongoDB Atlas.
- [x] `docs/project-status/project-status.md` mentions MongoDB Atlas.
- [x] `docs/project-status/project-status.md` updated with completed task checkmarks.
