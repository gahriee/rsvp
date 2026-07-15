# AGENTS.md — Graduation RSVP Website

This file defines the rules an AI coding agent (or human contributor) must follow when working in this repository. It complements `docs/architecture/architecture.md` and `docs/project-status/project-status.md`. When in doubt, these rules take precedence over general habits or defaults.

---

## 1. Project Overview

A Next.js + MongoDB website where a graduating student's guests can view a digital invitation, RSVP, and select a gift from a shared registry (first-come, first-served).

---

## 2. Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Database:** MongoDB (Mongoose)
- **Styling:** Tailwind CSS
- **Auth (admin only):** NextAuth.js or lightweight JWT-based session
- **Validation:** Zod
- **Hosting:** Vercel + MongoDB Atlas
- **Linting/Formatting:** ESLint + Prettier

---

## 3. Non-Negotiable Architecture Rules

- Gift reservation (`PATCH /api/gifts/[id]/reserve`) must use an **atomic conditional update** (`findOneAndUpdate` filtered on `status: "available"`). Never read-then-write in two separate calls — this creates a race condition where two guests could claim the same gift.
- All MongoDB access goes through `src/lib/mongodb.ts`'s cached connection helper. Never open a new connection inside a route handler.
- All shared types (`Gift`, `Rsvp`, API request/response shapes) live in `src/lib/types.ts` (or `src/types/` if the project grows). Never redefine the same shape in multiple files.
- Admin routes (`/admin/*` pages and `/api/admin/*` or admin-guarded routes) must check authentication server-side before returning data — never rely on the client to hide the UI as the only protection.
- No business logic inside `page.tsx`/route handler bodies beyond orchestration — delegate data access and validation to `src/lib/` helpers so routes stay thin and testable.
- Out of scope unless explicitly requested: user accounts/sign-up for guests, payment processing, multi-event support.

---

## 4. ESLint — Zero Warnings, Zero Errors

**The build must produce zero ESLint warnings and zero errors before any task is considered complete.** Run `npm run lint` (or `next lint`) as the last step of every change and fix everything it reports — do not suppress rules to make output "clean."

Rules to follow to avoid the most common violations:

- **No unused variables/imports** (`@typescript-eslint/no-unused-vars`): remove dead imports and variables immediately; don't leave them "for later."
- **No `any`** (`@typescript-eslint/no-explicit-any`): give every function parameter, return value, and API payload a real type or interface. Use `unknown` + a type guard if the shape is genuinely uncertain.
- **Exhaustive hooks dependencies** (`react-hooks/exhaustive-deps`): every value used inside `useEffect`/`useMemo`/`useCallback` must be listed in the dependency array. If a value is intentionally excluded, extract it outside the component or wrap it in a ref — don't disable the rule inline.
- **No floating promises** (`@typescript-eslint/no-floating-promises` if enabled): always `await` or explicitly `.catch()` async calls, including inside event handlers (`onClick={async () => { ... }}` should still handle rejections).
- **Consistent imports:** no default-export/named-export mismatches; keep import order consistent (external packages, then internal aliases, then relative imports) — let `eslint-plugin-import` or Prettier's import sort handle ordering, don't fight it manually.
- **No unescaped entities in JSX** (`react/no-unescaped-entities`): use `&apos;`/`&quot;` or template literals for apostrophes/quotes in visible text (e.g. "You're invited" needs escaping).
- **No console statements in committed code** (`no-console`): remove `console.log` debugging before finishing a task; `console.error` in actual error-handling paths is fine if the project's ESLint config allows it.
- **Keys on list items** (`react/jsx-key`): every element in a `.map()` needs a stable, unique `key` — never use array index if the list can reorder or filter.
- **No use of `<img>` where `next/image` is expected** (`@next/next/no-img-element`): use `next/image` for any content image so Next.js can optimize it.
- Never add `/* eslint-disable */` (file-level or rule-level) to silence a warning — fix the underlying issue. If a rule is genuinely wrong for a specific line, use a scoped `// eslint-disable-next-line [rule-name]` with a one-line comment explaining why, and only as a last resort.

---

## 5. Next.js Best Practices

- **Server vs Client Components:** default to Server Components. Only add `"use client"` to a component that needs interactivity (state, effects, event handlers, browser APIs). Keep the client boundary as small and as low in the tree as possible — don't mark a whole page `"use client"` just because one child needs it.
- **Data fetching:** fetch data in Server Components or Route Handlers, not in `useEffect` on the client, unless the data is genuinely user-triggered/interactive (e.g. re-checking gift availability after a conflict).
- **Route Handlers:** use `src/app/api/**/route.ts` with named exports (`GET`, `POST`, `PATCH`, `DELETE`) — never a single catch-all handler switching on method internally.
- **Metadata:** use the `metadata` export (or `generateMetadata`) per page instead of manually injecting `<head>` tags.
- **Images:** always use `next/image` with explicit `width`/`height` (or `fill` + a sized parent) to avoid layout shift.
- **Fonts:** use `next/font` for any custom font instead of a `<link>` tag to Google Fonts, to avoid render-blocking requests.
- **Environment variables:** never expose secrets (DB URI, NextAuth secret) via `NEXT_PUBLIC_*`. Only prefix with `NEXT_PUBLIC_` values that are safe to ship to the browser.
- **Loading and error states:** use `loading.tsx` and `error.tsx` conventions for route segments that fetch data, instead of manual spinner/try-catch scaffolding in every page.
- **Revalidation:** be explicit about caching — use `revalidatePath`/`revalidateTag` after a mutation (e.g. after a gift is reserved) rather than relying on default caching to "just work," since gift availability must be fresh.
- **File organization:** colocate a route's server-only helpers under `src/lib/` (or a route-local `_lib/` folder) — never import server-only code (e.g. Mongoose models) into a file marked `"use client"`.
- **Avoid unnecessary client-side libraries:** don't reach for a global state manager (Redux, Zustand, etc.) unless local/server state genuinely can't do the job — this is a small app.

---

## 6. Code Style

- TypeScript strict mode is on. Every function parameter and return type should be explicit at public/exported boundaries (internal, obviously-inferred locals don't need annotation).
- Use Zod schemas for all API input validation, and infer TypeScript types from the schema (`z.infer<typeof schema>`) rather than writing the type twice.
- Prefer named exports over default exports for components and utilities (default exports are fine for Next.js special files like `page.tsx`, `layout.tsx`, `route.ts` since the framework requires them).
- Keep components small and focused — if a component's JSX exceeds ~150 lines or mixes multiple concerns, split it.

---

## 7. Testing

- Any change to the gift-reservation logic must include a test that simulates two concurrent reservation attempts on the same gift and asserts only one succeeds.
- Prefer integration tests over heavily-mocked unit tests for API routes that touch MongoDB (use an in-memory MongoDB instance such as `mongodb-memory-server` for CI).

---

## 8. Docs & Status Updates

- After completing any task, mark the corresponding checklist items as `[x]` in `docs/project-status/project-status.md`.
- If an architectural decision changes mid-task (e.g. a different gift-reservation strategy), update `docs/architecture/architecture.md` before marking the task done.

---

## 9. Definition of Done

A task is not complete until:

- [ ] `npm run lint` passes with zero warnings and zero errors
- [ ] `npm run build` (or `tsc --noEmit`) passes with no type errors
- [ ] No `console.log` debugging statements remain
- [ ] No `any` types remain in new code
- [ ] All new API routes validate input with Zod
- [ ] Relevant project-status checklist items are updated
