---
name: portfolio-execute
description: Implement exactly one approved plan from doc/projects-reorganization/plan for the blog-re portfolio reorganization. Use after portfolio-plan-interview; do not use to invent missing product decisions or issue the final verification verdict.
---

# Portfolio Execute

Implement one approved portfolio reorganization plan without expanding its scope.

## Preconditions

Require a specific plan path under `doc/projects-reorganization/plan/`.

Before editing:

1. Read the complete plan and confirm `Status: Approved`.
2. Read every source the plan lists under References.
3. Inspect applicable `AGENTS.md` files and the current versions of every affected file.
4. Check `git status` and preserve unrelated user changes.
5. Confirm prerequisite plans are verified when the current plan depends on them.

If the plan is absent, unapproved, or blocked by an unverified prerequisite, stop and report the exact issue.

## Execution Rules

- Implement only the selected plan.
- Follow the plan's file list, implementation order, data migration strategy, and acceptance criteria.
- Reuse existing data access, SEO, and service boundaries when the plan preserves them.
- Prefer root-cause changes over compatibility patches.
- Keep database migrations explicit, reviewable, and non-destructive by default.
- Do not apply migrations to remote or production databases without separate user authorization.
- Do not delete routes, tables, columns, content, or assets unless the plan explicitly authorizes it.
- Do not copy personal content, branding, or metrics from the reference portfolio.
- Preserve unrelated dirty-worktree changes.

## Plan Gaps and Conflicts

Stop when implementation requires a material decision not present in the plan.

Classify the issue before asking the user:

- **Plan gap:** required behavior, copy, data contract, migration rule, or acceptance criterion is missing.
- **Code conflict:** the plan assumes code, schema, or dependencies that differ from the repository.

Explain the exact gap or conflict, present viable options, and obtain a decision. Update the plan with the approved decision before resuming implementation.

Do not interrupt for routine implementation details that are already constrained by repository conventions.

## Checks During Implementation

Run focused checks needed to finish the code safely, such as targeted TypeScript, lint, or tests for changed modules. These checks do not replace final verification.

For UI work, inspect both desktop and mobile behavior described in the plan. For SEO work, inspect generated metadata behavior. For database work, validate migration syntax and data-preservation assumptions without touching production.

## Completion

When all planned changes are implemented:

1. Confirm every planned file and step is covered.
2. Update the selected plan status to `Implemented - Pending Verification`.
3. Add a short implementation log listing changed files, focused checks, and any approved deviations.
4. Report the result and instruct the user to invoke `$portfolio-verify` with the same plan.

Do not declare the plan verified and do not start the next plan.
