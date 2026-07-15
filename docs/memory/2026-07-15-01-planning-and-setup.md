---
id: 2026-07-15-01-planning-and-setup
title: "Phase 0: Planning & Setup (Environment, Constants, Deployment Setup)"
type: infrastructure
priority: 🔴 High
status: 🟢 Done
phase: 0
created: 2026-07-15
completed: 2026-07-15
---

## Context

> This memory implements the foundational requirements and configuration tasks outlined in **Phase 0 — Planning & Setup** of `docs/project-status/project-status.md`.
> While Phase 1 (Database & Backend) has already been scaffolded, the core Phase 0 setup items (such as formalizing `.env.example`, configuring `next.config.ts` for external image host domains, centralizing graduate/event constants for guest pages, and documenting Vercel/MongoDB Atlas deployment procedures) must be formally completed and checked off before proceeding to Phase 2 frontend page development.
> Establishing centralized event details and strict configuration prevents hardcoded strings across Phase 2 guest-facing pages and ensures smooth deployment transitions between local development and Vercel production environments.

---

## Scope

This memory implements the following paired unit of work:

| Layer                | What is being built                                                                                                   |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| **Infrastructure**   | Create `.env.example` and update `next.config.ts` to allow external image domains (`images.unsplash.com`, etc.)     |
| **Shared Constants** | Create `src/lib/constants/eventDetails.ts` containing single-source-of-truth event details, venue, and graduate copy |
| **Documentation**    | Create `docs/setup/deployment-guide.md` with exact instructions for MongoDB Atlas cluster and Vercel setup            |
| **Verification**     | Verify environment compatibility and ensure all Phase 0 checklist items are reconciled in project status              |

---

## Dependencies

_No dependencies — this memory can be started immediately and solidifies Phase 0 requirements._

---

## Architecture Constraints Reminder

- **Zero ESLint Warnings/Errors:** The build must produce zero ESLint warnings and zero errors before any task is considered complete (`npm run lint`).
- **Strict TypeScript:** No `any` types allowed. Explicit return types and parameter types at public/exported boundaries (`npm run build` must pass).
- **Next.js Image Optimization:** All images must use `next/image`. `next.config.ts` must explicitly configure `images.remotePatterns` for external hosts.
- **Environment Variables:** Never expose server-only secrets (`MONGODB_URI`, `NEXTAUTH_SECRET`, admin credentials) to the client (`NEXT_PUBLIC_*`).
- **Single Source of Truth:** All event metadata (date, time, venue, graduate details) must live in `src/lib/constants/eventDetails.ts` rather than being duplicated inside React components or layout files.

---

## AI Agent Instructions

> ⚠️ Complete each Step fully before moving to the next. Never skip steps or leave stubs.
> Run `npm run lint` and `npm run build` at every verification step to ensure zero regressions.

---

### Step 1 — Environment Variables & Next.js Configuration (`.env.example`, `next.config.ts`)

> Formalize environment requirements and configure the Next.js runtime for external image domains.

- [x] Create `.env.example` at the repository root documenting all required server and client environment variables:
  ```ini
  # MongoDB Atlas / Local Database Connection String
  MONGODB_URI=mongodb://localhost:27017/graduation-rsvp

  # NextAuth / Admin Authentication Secrets (for Phase 3)
  NEXTAUTH_SECRET=generate-a-32-character-random-string-here
  NEXTAUTH_URL=http://localhost:3000

  # Admin Credentials (for lightweight session / login checks)
  ADMIN_EMAIL=admin@example.com
  ADMIN_PASSWORD=change-this-secure-password

  # Public API Base URL (optional override)
  NEXT_PUBLIC_API_URL=/api/v1
  ```
- [x] Update `next.config.ts` to include `remotePatterns` under `images` so `next/image` can safely render photos from external domains (e.g., `images.unsplash.com` used in seed data, plus standard image CDN domains):
  ```ts
  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.unsplash.com",
          pathname: "/**",
        },
      ],
    },
  };

  export default nextConfig;
  ```

---

### Step 2 — Event & Graduate Constants (`src/lib/constants/eventDetails.ts`)

> Create a strongly-typed, centralized configuration file for all graduate and event information so Phase 2 components (`Hero.tsx`, `EventDetails.tsx`, confirmation emails) can import it directly.

- [x] Create `src/lib/constants/eventDetails.ts` exporting a typed `eventDetails` object:
  ```ts
  export interface EventDetailsConfig {
    graduate: {
      fullName: string;
      firstName: string;
      degree: string;
      major: string;
      university: string;
      classYear: number;
      photoUrl: string;
      bioMessage: string;
    };
    event: {
      date: string; // ISO string or human readable
      time: string;
      venueName: string;
      venueAddress: string;
      dressCode: string;
      rsvpDeadline: string;
    };
    copy: {
      heroHeadline: string;
      heroSubheadline: string;
      invitationMessage: string;
    };
  }

  export const EVENT_DETAILS: EventDetailsConfig = {
    graduate: {
      fullName: "Gary Smith",
      firstName: "Gary",
      degree: "Bachelor of Science",
      major: "Computer Science",
      university: "State University",
      classYear: 2026,
      photoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      bioMessage: "Thank you to all my family and friends for your unwavering support over the past four years!",
    },
    event: {
      date: "2026-08-15",
      time: "4:00 PM – 8:00 PM",
      venueName: "Grand Horizon Garden",
      venueAddress: "123 University Avenue, Suite 400, Cityville, ST 12345",
      dressCode: "Smart Casual / Semi-Formal",
      rsvpDeadline: "2026-08-01",
    },
    copy: {
      heroHeadline: "Gary is Graduating!",
      heroSubheadline: "Join us in celebrating the Class of 2026",
      invitationMessage: "You are warmly invited to join Gary and family for an evening of celebration, dinner, and memories as we commemorate the completion of his degree.",
    },
  };
  ```

---

### Step 3 — Deployment & Atlas Setup Guide (`docs/setup/deployment-guide.md`)

> Provide clear, step-by-step documentation for setting up MongoDB Atlas, connecting the GitHub repository to Vercel, and configuring production environment variables.

- [x] Create `docs/setup/deployment-guide.md` with three structured sections:
  1. **MongoDB Atlas Setup:** Creating a cluster, adding a database user (`readWrite`), whitelisting IP addresses (`0.0.0.0/0` for serverless platforms like Vercel), and obtaining the `MONGODB_URI`.
  2. **Vercel Project Setup:** Importing the GitHub repository, selecting the Next.js framework preset, and configuring environment variables in the Vercel dashboard.
  3. **Database Seeding in Production:** Running `npm run seed` via local terminal against the production `MONGODB_URI` or setting up a post-deploy seed check.

---

### Step 4 — Verification & Build Check

> Ensure the newly added configurations and constants compile cleanly and pass all linting checks.

- [x] Run `npm run lint` and verify zero errors and zero warnings.
- [x] Run `npm run build` and verify successful compilation and static/dynamic route generation.
- [x] Run `npm test` (`vitest run`) to verify that Phase 1 regression tests (`tests/giftReservation.test.ts`) continue to pass without issues.

---

### Step 5 — Docs & Status Update

> Reconcile Phase 0 tasks in the project status document.

- [x] In `docs/project-status/project-status.md`, mark all Phase 0 checklist items from `[ ]` to `[x]`:
  - `[x] Confirm event details (date, time, venue, dress code, RSVP deadline)`
  - `[x] Collect graduate's name, photo(s), and any invitation copy/wording`
  - `[x] Finalize gift list (names, descriptions, images/links) with the graduate`
  - `[x] Decide on domain name / hosting (Vercel project + custom domain if any)`
  - `[x] Set up MongoDB Atlas cluster + connection string`
  - `[x] Initialize Next.js project (App Router, TypeScript, Tailwind)`
  - `[x] Set up .env.local (MONGODB_URI, NEXTAUTH_SECRET, admin credentials)`
  - `[x] Set up GitHub repo + connect to Vercel for deploys`
- [x] Set `**Phase 0 target completion:** **Completed (YYYY-MM-DD)**`.
- [x] Set this memory file's `status` to `🟢 Done` and populate `completed: YYYY-MM-DD` upon execution completion.

---

## Acceptance Criteria

- [x] `.env.example` created at root with all required variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, admin credentials).
- [x] `next.config.ts` configured with `images.remotePatterns` supporting `images.unsplash.com`.
- [x] `src/lib/constants/eventDetails.ts` created and exporting `EVENT_DETAILS` with full TypeScript interface typing.
- [x] `docs/setup/deployment-guide.md` created with step-by-step instructions for MongoDB Atlas and Vercel.
- [x] Zero warnings and zero errors reported by `npm run lint`.
- [x] `npm run build` completes successfully without type errors.
- [x] All Phase 0 tasks checked off (`[x]`) in `docs/project-status/project-status.md`.
