---
id: 2026-07-20-04-ci-cd-pipeline
title: "CI/CD Pipeline & Launch Preparation"
type: infrastructure
priority: 🔴 High
status: 🟢 Done
phase: 5
created: 2026-07-20
completed: 2026-07-20
---

## Context

> With the RSVP and Gift Registry fully polished and the UI revamped, we are skipping the heavy manual QA phase and moving directly to deployment and launch preparation (Phase 5).
> The application requires a CI/CD pipeline to automate testing and deployments. We will use GitHub Actions for the pipeline, deploy the Next.js app on Vercel, and configure Railway for backend database infrastructure (MongoDB).

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Infrastructure**   | GitHub Actions workflow for CI (linting, building, testing)                         |
| **Deployment**       | Setup Vercel deployment configuration (`vercel.json` if needed)                     |
| **Database**         | Railway configuration guidelines for MongoDB hosting                                |

---

## Dependencies

> No dependencies — this memory can be started immediately.

---

## Architecture Constraints Reminder

- Deployments MUST pass `npm run lint` with zero errors and zero warnings before shipping to production.
- Environment variables containing secrets (like `MONGODB_URI`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`) must strictly remain server-side and never be prefixed with `NEXT_PUBLIC_`.
- All database interactions must use the cached connection in `src/lib/mongodb.ts`.

---

## AI Agent Instructions

---

### Step 1 — CI/CD Pipeline (GitHub Actions)

> Set up a GitHub Action workflow that automatically runs linting, type-checking, and tests on every push and pull request to the `main` branch.

- [x] Create `.github/workflows/ci.yml`
- [x] Configure it to use Node.js and run `npm ci`, `npm run lint`, `npx tsc --noEmit`, and `npm run test` (if applicable)

---

### Step 2 — Deployment Configuration (Vercel & Railway)

> Prepare the necessary deployment scripts or configuration files required for Vercel and Railway.

- [x] Ensure `next.config.js` or `next.config.ts` is optimized for Vercel production deployment.
- [x] Document the environment variables that need to be injected into the Vercel dashboard and Railway instances.

---

### Step 3 — Environment Variables

- [x] Review `.env.example` to ensure all necessary production variables are documented.
  ```ini
  # [Vercel or Railway deployment URLs/URIs]
  MONGODB_URI=
  NEXTAUTH_SECRET=
  RESEND_API_KEY=
  ```
- [x] Post a summary in chat at the end of the memory.

---

### Step 4 — Docs & Status Update

- [x] Mark all completed tasks as `[x]` in `docs/project-status/project-status.md`
- [x] Set this memory's `status` to `🟢 Done` and populate the `completed` date

---

## Acceptance Criteria

- [x] GitHub Actions CI pipeline is created and syntactically valid
- [x] Project deployment instructions / configs are finalized
- [x] `.env.example` contains all required variables for production
- [x] `docs/project-status/project-status.md` updated with completed task checkmarks
