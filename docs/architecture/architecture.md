# Graduation RSVP Website — Architecture

## 1. Overview

A web application that lets a graduating student invite guests to their graduation celebration. Guests can:

- View the digital invitation (event details, date, time, venue, photos).
- RSVP (attending / not attending, number of guests, optional message).
- Pick a gift from a curated gift list (gift registry), on a first-come, first-served basis — once a gift is picked, it becomes unavailable to other guests.

The graduate (or an admin) can:

- Manage the list of gifts (add/edit/remove, mark as unavailable/available).
- View all RSVPs and who picked which gift.

**Core constraint:** the gift list must live in a database, since selection status changes in real time and must be consistent across all guests viewing the site.

---

## 2. Tech Stack

| Layer             | Technology                                                  | Notes                                                                                                           |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Framework         | **Next.js** (App Router)                                    | Handles both frontend (React Server/Client Components) and backend (API Routes / Route Handlers) in one project |
| Database          | **MongoDB**                                                 | Document store, good fit for flexible RSVP/gift schemas                                                         |
| ODM               | Mongoose                                                    | Schema validation + easier queries than raw driver                                                              |
| Styling           | Tailwind CSS                                                | Fast to build a clean invitation UI                                                                             |
| Auth (admin only) | NextAuth.js (Credentials provider) or simple JWT + password | Protects the admin dashboard                                                                                    |
| Hosting           | Vercel (app) + MongoDB Atlas (database)                     | Standard pairing for Next.js + MongoDB                                                                          |
| Image handling    | Next.js `Image` + Cloudinary/S3 (optional)                  | For gift photos, event photos                                                                                   |
| Email (optional)  | Resend / Nodemailer                                         | Sends RSVP confirmation emails                                                                                  |

---

## 3. Project Structure

```
graduation-rsvp/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx                    # Landing / Invitation page
│   │   ├── rsvp/
│   │   │   └── page.tsx                 # RSVP form page
│   │   ├── gifts/
│   │   │   └── page.tsx                 # Gift registry / selection page
│   │   ├── confirmation/
│   │   │   └── page.tsx                 # Thank-you / summary page after RSVP
│   │   ├── admin/
│   │   │   ├── login/page.tsx           # Admin login
│   │   │   ├── page.tsx                 # Admin dashboard (overview)
│   │   │   ├── gifts/page.tsx           # Manage gifts (CRUD)
│   │   │   └── rsvps/page.tsx           # View all RSVPs
│   │   └── api/
│   │       ├── rsvp/
│   │       │   ├── route.ts             # POST create RSVP, GET list (admin)
│   │       │   └── [id]/route.ts        # GET/PATCH/DELETE single RSVP
│   │       ├── gifts/
│   │       │   ├── route.ts             # GET list gifts, POST create (admin)
│   │       │   └── [id]/route.ts        # GET/PATCH/DELETE single gift
│   │       ├── gifts/[id]/reserve/
│   │       │   └── route.ts             # PATCH reserve/select a gift
│   │       └── auth/
│   │           └── [...nextauth]/route.ts  # NextAuth handler (admin only)
│   │
│   ├── models/
│   │   ├── Gift.ts                      # Mongoose schema: Gift
│   │   └── Rsvp.ts                      # Mongoose schema: Rsvp
│   │
│   ├── lib/
│   │   ├── mongodb.ts                   # DB connection helper (cached connection)
│   │   ├── auth.ts                      # Auth config/helpers
│   │   └── validators.ts                # Zod schemas for input validation
│   │
│   └── components/
│       ├── invitation/
│       │   ├── Hero.tsx
│       │   └── EventDetails.tsx
│       ├── rsvp/
│       │   └── RsvpForm.tsx
│       ├── gifts/
│       │   ├── GiftCard.tsx
│       │   └── GiftGrid.tsx
│       └── admin/
│           ├── GiftTable.tsx
│           └── RsvpTable.tsx
│
├── public/                          # Static assets (images, favicon)
├── .env.local                       # MONGODB_URI, NEXTAUTH_SECRET, etc.
└── next.config.js
```

---

## 4. Backend List (API Routes)

### Public-facing

| Method  | Route                     | Purpose                                                                                                                                      |
| ------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`  | `/api/rsvp`               | Submit a new RSVP (name, email, attending status, guest count, message, chosen gift ID)                                                      |
| `GET`   | `/api/gifts`              | Fetch all gifts with current status (`available` / `reserved`)                                                                               |
| `PATCH` | `/api/gifts/[id]/reserve` | Guest selects a gift — atomically marks it as reserved and links it to their RSVP (prevents double-booking via a MongoDB conditional update) |

### Admin-only (protected by auth middleware)

| Method     | Route                     | Purpose                                             |
| ---------- | ------------------------- | --------------------------------------------------- |
| `GET`      | `/api/rsvp`               | List all RSVPs                                      |
| `GET`      | `/api/rsvp/[id]`          | View a single RSVP                                  |
| `PATCH`    | `/api/rsvp/[id]`          | Update an RSVP (e.g. correct guest count)           |
| `DELETE`   | `/api/rsvp/[id]`          | Remove an RSVP                                      |
| `POST`     | `/api/gifts`              | Add a new gift to the registry                      |
| `PATCH`    | `/api/gifts/[id]`         | Edit gift details (name, description, image, price) |
| `DELETE`   | `/api/gifts/[id]`         | Remove a gift                                       |
| `POST/GET` | `/api/auth/[...nextauth]` | Admin login/session handling                        |

### Data Models

**Gift**

```ts
{
  _id: ObjectId,
  name: string,
  description: string,
  imageUrl: string,
  status: "available" | "reserved",
  reservedBy: ObjectId | null,   // ref -> Rsvp
  createdAt: Date
}
```

**Rsvp**

```ts
{
  _id: ObjectId,
  guestName: string,
  email: string,
  attending: boolean,
  numberOfGuests: number,
  message: string,
  selectedGift: ObjectId | null,  // ref -> Gift
  createdAt: Date
}
```

**Key backend rule:** reserving a gift must be an atomic `findOneAndUpdate` with a filter of `{ status: "available" }` — this prevents two guests from selecting the same gift at the same time (race condition safety).

---

## 5. Frontend List (Pages / Views)

| Page                 | Route           | Description                                                                                          |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| Invitation (Landing) | `/`             | Hero section with graduate's name/photo, event date/time/venue, countdown, "RSVP Now" call-to-action |
| RSVP Form            | `/rsvp`         | Guest enters name, email, attending Y/N, number of guests, message                                   |
| Gift Registry        | `/gifts`        | Grid of gift cards showing name, image, and status; guest selects one available gift                 |
| Confirmation         | `/confirmation` | Thank-you message summarizing RSVP + chosen gift                                                     |
| Admin Login          | `/admin/login`  | Simple credential login for the graduate/family                                                      |
| Admin Dashboard      | `/admin`        | Overview stats (total RSVPs, attending count, gifts remaining)                                       |
| Admin — Manage Gifts | `/admin/gifts`  | Add/edit/delete gifts, manually mark as reserved                                                     |
| Admin — View RSVPs   | `/admin/rsvps`  | Table/list of all guest responses and their gift picks                                               |

**Suggested flow for guests:** Invitation → RSVP form → (if attending) Gift registry → Confirmation.

---

## 6. Notes on Scalability / Future Additions

- Add rate-limiting on `/api/rsvp` and `/api/gifts/[id]/reserve` to prevent spam/abuse.
- Add email confirmation via Resend/Nodemailer after successful RSVP.
- Add a "waitlist" or "suggest your own gift" field if the fixed gift list runs out.
- Could extend `Gift` with a `price` field and link to an external store (e.g. Amazon) if going with a "gift link" style registry instead of physical gift claiming.
