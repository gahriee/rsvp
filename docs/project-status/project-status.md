# Graduation RSVP Website — Project Status

**Status legend:** `[ ]` Not started · `[~]` In progress · `[x]` Done

---

## Phase 0 — Planning & Setup

- [x] Confirm event details (date, time, venue, dress code, RSVP deadline)
- [x] Collect graduate's name, photo(s), and any invitation copy/wording
- [x] Finalize gift list (names, descriptions, images/links) with the graduate
- [x] Decide on domain name / hosting (Vercel project + custom domain if any)
- [x] Set up MongoDB Atlas cluster + connection string
- [x] Initialize Next.js project (App Router, TypeScript, Tailwind)
- [x] Set up `.env.local` (`MONGODB_URI`, `NEXTAUTH_SECRET`, admin credentials)
- [x] Set up GitHub repo + connect to Vercel for deploys

**Phase 0 target completion:** **Completed (2026-07-15)**

---

## Phase 1 — Database & Backend

- [x] Define `Gift` Mongoose schema
- [x] Define `Rsvp` Mongoose schema
- [x] Build `lib/mongodb.ts` connection helper (cached connection)
- [x] `POST /api/rsvp` — create RSVP
- [x] `GET /api/rsvp` — list RSVPs (admin)
- [x] `GET /api/rsvp/[id]` — view single RSVP
- [x] `PATCH /api/rsvp/[id]` — update RSVP
- [x] `DELETE /api/rsvp/[id]` — delete RSVP
- [x] `GET /api/gifts` — list gifts + status
- [x] `POST /api/gifts` — add gift (admin)
- [x] `PATCH /api/gifts/[id]` — edit gift (admin)
- [x] `DELETE /api/gifts/[id]` — remove gift (admin)
- [x] `PATCH /api/gifts/[id]/reserve` — atomic gift reservation (race-condition safe)
- [x] Add input validation (Zod) on all POST/PATCH routes
- [x] Seed database with initial gift list

**Phase 1 target completion:** **Completed (2026-07-14)**

---

## Phase 2 — Frontend Pages (Guest-Facing)

- [x] Landing / Invitation page (`/`) — hero, event details, countdown, CTA
- [x] RSVP form page (`/rsvp`) — name, email, attending, guest count, message
- [x] Gift registry page (`/gifts`) — grid of gift cards, select available gift
- [x] Confirmation page (`/confirmation`) — summary of RSVP + chosen gift
- [x] Responsive design pass (mobile, tablet, desktop)
- [x] Loading & error states for form submissions
- [x] "Gift already taken" real-time handling (refetch/disable on conflict)

**Phase 2 target completion:** **Completed (2026-07-16)**

---

## Phase 3 — Admin Dashboard

- [x] Admin login page (`/admin/login`) + auth middleware
- [x] Admin dashboard overview (`/admin`) — total RSVPs, attending count, gifts remaining
- [x] Manage Gifts page (`/admin/gifts`) — add/edit/delete, mark reserved manually
- [x] View RSVPs page (`/admin/rsvps`) — table/list, filter by attending status
- [x] Protect all `/admin/*` routes and admin API routes from unauthenticated access

**Phase 3 target completion:** **Completed**

---

## Phase 4 — Polish & Extras

- [ ] Email confirmation on RSVP submit (Resend/Nodemailer)
- [ ] Rate limiting on public API routes (`/api/rsvp`, `/api/gifts/[id]/reserve`)
- [ ] SEO/meta tags + social share preview image (Open Graph)
- [ ] Favicon + branding polish (colors, fonts matching invitation theme)
- [ ] Analytics (optional — track RSVP conversion)

**Phase 4 target completion:** **\_\_**

---

## Phase 5 — Testing & QA

- [ ] Test RSVP flow end-to-end (attending + not attending paths)
- [ ] Test gift selection race condition (two simultaneous picks)
- [ ] Cross-browser check (Chrome, Safari, mobile browsers)
- [ ] Admin CRUD flows tested (gifts + RSVPs)
- [ ] Broken link / 404 check
- [ ] Load test with expected guest count (optional, for large guest lists)

**Phase 5 target completion:** **\_\_**

---

## Phase 6 — Launch

- [ ] Final content review with graduate (typos, dates, names)
- [ ] Production environment variables set on Vercel
- [ ] Deploy to production domain
- [ ] Send invitation link out to guests
- [ ] Monitor RSVPs/gift picks in first 48 hours for issues

**Phase 6 target completion:** **\_\_**

---

## Overall Progress Summary

| Phase                  | Status      | % Complete |
| ---------------------- | ----------- | ---------- |
| 0 — Planning & Setup   | Done        | 100%       |
| 1 — Database & Backend | Done        | 100%       |
| 2 — Frontend Pages     | Done        | 100%       |
| 3 — Admin Dashboard    | Done        | 100%       |
| 4 — Polish & Extras    | Not started | 0%         |
| 5 — Testing & QA       | Not started | 0%         |
| 6 — Launch             | Not started | 0%         |

_Update the Status/% columns as work progresses._
