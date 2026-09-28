---
name: portfolio-verify
description: Verify one implemented portfolio reorganization plan against its acceptance criteria, repository conventions, responsive behavior, SEO, migrations, lint, and build. Use after portfolio-execute; report failures without fixing implementation code.
---

# Portfolio Verify

Audit one implemented plan and issue the final pass or fail verdict.

## Preconditions

Require a specific plan under `doc/projects-reorganization/plan/` with:

`Status: Implemented - Pending Verification`

Read the full plan, its implementation log, applicable repository instructions, and the actual diff. Do not reinterpret the broader product direction from unrelated documents.

## Verification Rules

- Use the plan's acceptance criteria as the primary contract.
- Check every planned file, step, and approved deviation.
- Identify unplanned changes that belong to the selected implementation.
- Do not edit implementation code during verification.
- Do not expand the plan or silently waive failures.
- Ignore unrelated pre-existing worktree changes, but call out overlap that makes the verdict unreliable.

## Required Checks

Run checks relevant to the plan, including:

1. The validation commands listed in the plan.
2. `npm run lint`.
3. `npm run build`.
4. Existing targeted tests when the affected area has tests.

Also perform conditional checks:

- **UI/layout:** desktop and mobile rendering, overflow, loading, empty, error, focus, and reduced-motion behavior required by the plan.
- **Routes:** navigation, redirects, not-found behavior, and old URL compatibility required by the plan.
- **SEO:** title, description, canonical, Open Graph, Twitter metadata, JSON-LD, sitemap, and robots changes required by the plan.
- **Database:** migration ordering, reversibility, constraints, data preservation, generated types, and local validation required by the plan. Never apply production migrations.
- **Ask AI:** request/response and grounded-content behavior required by the plan without sending private data to external systems.

## Verdict

Pass only when all acceptance criteria and required commands succeed.

### Pass

1. Change the plan status to `Verified`.
2. Append a verification log with commands, visual checks, and results.
3. Report the verified plan path and the next eligible plan, if one is already approved.

### Fail

1. Leave the status as `Implemented - Pending Verification`.
2. Report every failure with file paths, command output, or observed behavior.
3. Separate plan violations from unrelated pre-existing failures.
4. Instruct the user to run `$portfolio-execute` on the same plan for corrections.

Do not fix the failures and do not start another plan.
