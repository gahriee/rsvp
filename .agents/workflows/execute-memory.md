---
description: Hand an existing memory to the AI agent for execution.
---

# Execute Memory

```
Please read this memory file and adhere to the rules in AGENTS.md and project-status.md.

Before writing a single line of code, you must complete the following pre-execution checklist in order:

1. Read project-status.md to confirm the current phase and which tasks are complete.
2. Read the most recently completed memory in docs/memories/ (the one with the highest date/sequence
   number and status 🟢 Done). Extract:
     - What was built and how it was structured
     - Any implementation decisions or deviations from the original plan
     - Which files were created or modified
     - Any known issues, blockers, or TODOs left behind
3. Read the current memory file in full.
4. Cross-reference the current memory's scope against what the previous memory already delivered.
   Do not re-implement anything that is confirmed complete — only build what is genuinely missing.

Once the checklist is done, execute the tasks outlined in the "AI Agent Instructions" section
of the current memory autonomously, step by step.

Let me know when you are finished or if you need clarification before proceeding.
```

---

## Reading the Previous Memory — What to Look For

When reviewing the previous memory, pay attention to:

- **Files already created** — do not recreate or overwrite them; use targeted edits only
- **Services/modules marked complete** — if a given service, gateway, or shared utility was fully implemented in a prior memory, treat it as done and do not re-scaffold it. _(List your project's core services here once they exist, e.g. `[ServiceA]`, `[ServiceB]`, `[GatewayX]`.)_
- **Shell components already bootstrapped** — page shells, client-side wrappers, and API clients created in a scaffold memory count as existing files; implement the real logic inside them rather than creating new files
- **Routes already registered** — check your project's central routing/module registration file(s) for routes already wired up before adding duplicates
- **Shared types already defined** — check `[path to shared types package]` before adding new shapes; never duplicate a type that already exists there
- **Deviations from the plan** — if the previous agent made a structural decision that differs from the current memory's assumptions (e.g., a different file name, a different method signature), follow the actual implemented structure, not the memory plan

---

## If Architecture Changes During Execution

1. Update `docs/architecture/architecture.md` to reflect the changes.
2. Update `docs/project-status/project-status.md` to mark completed tasks and update status.
3. **If the database schema is affected** (new table, new column, new index, new constraint):
   - Classify the change using the Infrastructure Change Levels table below
   - Update the entity/model file(s) under `[path to entities]`
   - Generate a new migration using your project's migration tooling: `[migration generate command]`
   - Update the project's `.env.example` if a new config value was introduced
4. Update the `AI Agent Instructions` section in the current memory file to reflect any implementation decisions made during execution.

---

## Infrastructure Change Levels

| Level                         | Description                                                                         | Action                                                                          |
| :---------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Level 1 — Fully Automated** | New column on existing entity, new index, new seed row, minor query tweak           | Agent updates entity, generates migration, and updates docs automatically       |
| **Level 2 — Semi-Automated**  | New table/entity, new relation, new channel/topic pattern                           | Agent drafts the entity and migration; developer reviews and runs the migration |
| **Level 3 — Manual Only**     | New hosting environment, SSL certificate, domain setup, external service onboarding | Agent documents the steps; developer executes entirely                          |
