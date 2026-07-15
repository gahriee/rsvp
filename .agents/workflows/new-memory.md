---
description: Create a new memory for the next development priority.
---

# 🆕 New Memory

```
Steps:
1. Review docs/architecture/architecture.md, docs/project-status/project-status.md, and the previous memory file in docs/memory/
   to understand the current architecture, context, and determine the most logical next
   development priority.

2. Create a new memory file in docs/memory/ using MEMORY_TEMPLATE.md as the base.
   - Sequential filename format: YYYY-MM-DD-NN-feature-name.md
     Check the folder for today's highest NN and increment by 1.
   - Set Type, Priority, and Status (🔴 To Do) appropriately.
   - Set Phase to match the current or next phase in project-status.md.
   - Draft the full AI Agent Instructions section following the Paired Development Rule:
     Every memory for a user-facing feature MUST implement every relevant layer
     (e.g. service, controller/API, and frontend component) together in the same memory.
     Never implement a service-only or component-only memory for a user-facing feature.

3. Verify the memory does not plan anything that conflicts with AGENTS.md constraints.
   Replace the example checks below with your own project's actual constraints
   (pull them from your Architecture Constraints section in AGENTS.md / architecture.md):
   - No second write path for [critical mutation, e.g. "resource position/state"]
   - No [disallowed concurrency strategy, e.g. "optimistic locking or version column"] if your project has standardized on a different approach
   - No direct emits to clients from services or controllers, if realtime is involved
   - No new channels/topics without updating docs/architecture/architecture.md
   - No cross-app imports between `[app A]` and `[app B]`
   - No auth, audit logging, or soft deletes unless explicitly requested (or whatever your project's stated non-goals are)

4. Confirm the memory's phase matches the current phase in project-status.md.
   If it belongs to a future phase, flag it clearly at the top of the memory.
```
