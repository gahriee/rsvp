---
id: YYYY-MM-DD-NN-feature-name
title: "[Feature Name]"
type: feature | bugfix | refactor | infrastructure | documentation
priority: 🔴 High | 🟡 Medium | 🟢 Low
status: 🔴 To Do | 🟡 In Progress | 🟢 Done
phase: 0 | 1 | 2 | 3 | 4 | 5
created: YYYY-MM-DD
completed:
---

## Context

> Brief description of what this memory implements and why it matters at this stage of development.
> Reference the specific phase and tasks in `docs/project-status/project-status.md` and the relevant section
> in `docs/architecture/architecture.md`.
> If this memory follows a previous one, mention what was completed and what this memory picks up.

---

## Scope

This memory implements the following paired unit of work _(fill in or mark N/A per row)_:

| Layer                | What is being built                                                                 |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Database**         | Schema/entity changes and/or new migration, if any                                  |
| **Service**          | Business logic added or updated in `[backend service path]`                         |
| **Shared Types**     | Type shapes added or updated in `[shared types path]`, if any                       |
| **Controller / DTO** | Request handlers and DTOs added or updated in `[backend service path]`              |
| **Realtime**         | Gateway / pub-sub / event-bus changes in `[realtime layer path]`, if any            |
| **Frontend**         | Server/Client components or views added or updated in `[frontend app path]`, if any |

> Delete or relabel rows that don't apply to your stack (e.g. drop "Realtime" for a project with no live updates,
> or rename "Controller / DTO" to "Route Handler" for a framework that doesn't use that pattern).

---

## Dependencies

> List any memories or features that must be completed before this one can begin.
> If none, write: _No dependencies — this memory can be started immediately._

---

## Architecture Constraints Reminder

> These are non-negotiable. Full rationale lives in `AGENTS.md` and `docs/architecture/architecture.md`.
> Replace the examples below with the actual invariants of your codebase — the point of this section is to
> restate the 5–10 rules that are easiest to accidentally violate when working quickly.

- `[Core mutation]` is the **only** method that may update `[critical field(s)]`. Never add a second write path.
- Concurrency control is `[locking/versioning strategy]`. Do not introduce an alternative mechanism without updating the architecture doc first.
- `[Any structural invariant about your data model]` — e.g. ordering fields, computed columns, denormalized caches.
- Real-time or async events travel **only** through `[event pipeline]` → `[consumer/gateway]` → `[client]`. Business logic never pushes events directly to clients.
- `[Channel/queue/topic naming convention]`. No new channels/topics without updating `docs/architecture/architecture.md` first.
- All shared type shapes live exclusively in `[shared types location]`. Never duplicate a type across apps/services.
- `[App/service A]` and `[App/service B]` never import from each other — cross-boundary imports go through `[shared lib]` only.
- Explicitly list anything that is **out of scope** for this project (e.g. no auth, no audit logging, no soft deletes) so agents don't add it speculatively.

---

## AI Agent Instructions

> ⚠️ Always implement the Service, Controller/DTO (or Route Handler), AND Frontend Component(s) together
> for every user-facing feature memory, unless a step is explicitly marked N/A.
> Complete each Step fully before moving to the next. Never skip steps or leave stubs.

---

### Step 1 — Database (`[database/migrations path]`)

> Schema/entity changes and migration.
> Update the entity/model file(s) under `[entities/models path]`.
> Generate and run a new migration using your project's migration tool.
> Classify the change by risk/impact level if your project uses tiered infrastructure-change levels.
> If no schema changes are needed for this memory, write: _No schema changes in this memory._

- [ ] Task description

---

### Step 2 — Service (`[backend service path]`)

> Business logic only — no HTTP handling, no view/template logic, no direct event/socket emits.
> All logic touching `[critical shared state]` must go through `[the designated core method]` exclusively.
> Use your project's transaction mechanism for any multi-step write, with explicit locking where concurrent writes are possible.
> Follow your language/framework's strictness conventions — e.g. explicit types, no implicit `any`, exhaustive error handling.

- [ ] Task description

---

### Step 3 — Shared Types / Contracts (`[shared types or API contract path]`) _(if applicable)_

> Add or update type shapes / API contracts here **only** — never duplicate in individual apps or services.
> All consumers import from this shared location. If a shape changes, change it once, here.
> If no shared-types changes are needed, write: _No shared-types changes in this memory._

- [ ] Task description

---

### Step 4 — Controller / Route Handler + DTO (`[backend service path]`)

> Request handling only — no direct DB queries, no business logic, no direct event/socket emits.
> All input DTOs/schemas must use your project's validation library.
> No business logic in controllers/handlers — delegate everything to the service layer.
> If multiple entry points exist for the same operation (e.g. UI-triggered and API/automation-triggered), both must call the same underlying service method.

- [ ] Task description

---

### Step 5 — Realtime / Async Events (`[realtime or event pipeline path]`) _(if applicable)_

> Changes to the gateway, event consumer, or pub/sub layer only.
> The consumer's subscription handler is the **only** place client-facing emits may be called.
> Publishes happen in the service layer, immediately after a transaction/write commits — never mid-transaction.
> Follow your project's channel/topic naming convention. Do not introduce additional channels/topics.
> If no realtime/async changes are needed, write: _No realtime changes in this memory._

- [ ] Task description

---

### Step 6 — Frontend (`[frontend app path]`)

> Entry point/page — initial data fetch only (server-rendered or equivalent).
> Client-side entry point — handles live connections (WebSocket/polling/subscriptions) and interactive state.
> Reusable components — pure UI, no direct API calls; data flows in via props/state.
> On user action: update local state immediately, then fire the request. Do not block the UI on a full round-trip if your UX calls for optimistic updates.
> On incoming real-time events: apply to local state for non-initiating clients only.
> All cross-boundary types imported from `[shared types location]` — never redefined here.

- [ ] Task description

---

### Step 7 — Tests

> Any change to a method with concurrency implications **must** include an integration test that fires concurrent calls and asserts correct final state.
> Any change to the realtime/event layer **must** be verified with two simultaneously connected clients/consumers.
> Do not mark this memory complete if its corresponding test is missing or skipped.

- [ ] Task description

---

### Step 8 — Environment Variables _(if applicable)_

> If new config values are introduced, complete the following.
> If none were added, write: _No new config values introduced in this memory._

- [ ] Add all new variables to the project's `.env.example` with a descriptive comment:
  ```ini
  # [Purpose — where to find or generate this value]
  VARIABLE_NAME=
  ```
- [ ] Post a summary in chat at the end of the memory:

  ```
  🔑 New config values required — please add these to your .env:

  VARIABLE_NAME    → Where to get it / how to generate it
  ```

---

### Step 9 — Docs & Status Update

- [ ] Mark all completed tasks as `[x]` in `docs/project-status/project-status.md`
- [ ] Update `docs/architecture/architecture.md` if any architecture decisions changed
- [ ] Set this memory's `status` to `🟢 Done` and populate the `completed` date

---

## Acceptance Criteria

> Specific, verifiable conditions that must all be true before this memory is considered complete.
> Keep the generic criteria below, delete any that don't apply to your stack, and always add feature-specific ones at the bottom.

- [ ] Project-wide type/strictness conventions honoured across all new files — no config loosened to make code pass
- [ ] All functions/methods have explicit parameter and return types (or your language's equivalent discipline)
- [ ] No business logic written directly in a controller/route handler — all logic lives in the service layer
- [ ] No direct client-facing emits outside the designated realtime consumer, if applicable
- [ ] The designated core method remains the only writer of the critical shared field(s), if applicable
- [ ] All cross-boundary type shapes defined in the shared types location only — no duplicates
- [ ] Apps/services that must stay decoupled do not import from each other
- [ ] No placeholder code, no `// TODO`, no incomplete method bodies anywhere in the memory scope
- [ ] All new config values added to `.env.example` with descriptive comments
- [ ] `docs/project-status/project-status.md` updated with completed task checkmarks
- [ ] Add feature-specific criteria below:
- [ ] Criterion 1
- [ ] Criterion 2
