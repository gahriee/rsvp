---
description: Commit and push changes to GitHub following Conventional Commits format.
---

# Git Push

```
Please follow the git push workflow below for the current memory.

1. Run git status and git diff to understand the full scope of changes before staging anything.

2. Generate a commit message following Conventional Commits format strictly:
   <type>(<scope>): <description>

   [optional body]

   Type must be one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
   Scope is the module name (e.g. cards, boards, realtime, shared-types, web, e2e)
   Description must be imperative mood and concise (e.g. add moveCard with row-level locking)
   Body (if needed) should explain why, not just what

3. Present the proposed commit message to me and ask:
   "Does this commit message look good?"

4. After I approve, execute:
   git add .
   git commit -m "<generated message>"
   git push origin main

5. After pushing to main, provide a summary of the push.
```
