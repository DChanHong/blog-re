---
name: portfolio-plan-interview
description: Interview for one portfolio reorganization work unit and write an approved plan under doc/projects-reorganization/plan. Use before changing layout, routes, content models, SEO, database structure, or the AI assistant; do not use for implementation or verification.
---

# Portfolio Plan Interview

Create one implementation-ready plan at a time for the `blog-re` portfolio reorganization.

## Required Sources

Before interviewing, inspect:

1. The current repository code relevant to the requested work.
2. `doc/portfolio-reference/README.md` and only the referenced portfolio documents needed for the topic.
3. Existing files in `doc/projects-reorganization/plan/`, especially the latest verified prerequisite plan.
4. Applicable `AGENTS.md` files.

Treat the current repository as the source of truth for existing behavior. Treat `doc/portfolio-reference/` as a structural and visual reference, not as code to copy blindly.

## Scope Rules

- Handle exactly one numbered plan per invocation.
- Do not implement code, migrations, or configuration while interviewing.
- Ask one decision topic at a time.
- Do not ask questions already answered by the code or approved plans.
- Explicitly separate user decisions from agent recommendations.
- Layout, route structure, SEO, content models, and database schema may all change when the plan justifies them.
- Preserve existing user data unless the user explicitly approves destructive migration behavior.
- Do not assume the reference site's personal content, branding, metrics, or English-first information architecture should be copied.

## First Invocation

When `doc/projects-reorganization/plan/` contains no plan documents, start with:

`00-current-project-audit.md`

This first plan must inventory current routes, layouts, data sources, Supabase tables, SEO behavior, chatbot behavior, reusable code, removal candidates, migration risks, and validation baselines. Its execution produces analysis and decisions, not a visual redesign.

After the audit is verified, propose the next plan based on dependencies. Prefer foundation work before page work: information architecture, data contracts, design tokens, global layout, then individual pages.

## Interview Coverage

Only cover categories relevant to the current work unit:

- Goal and user-visible outcome
- Current behavior and constraints
- Target layout and responsive states
- Routes, redirects, and navigation
- Content and data ownership
- Database schema and migration requirements
- SEO metadata, canonical URLs, sitemap, robots, and structured data
- Loading, error, empty, and accessibility states
- Files expected to be created, changed, retained, or removed
- Validation commands and visual checks
- Explicit non-goals
- Dependencies on earlier or later plans

When the user is unsure, present two or three concrete choices with tradeoffs and recommend one.

## Completion Gate

Do not write the final plan until all of the following are clear:

- The outcome and non-goals
- Decisions that affect routes, data, SEO, or public behavior
- Exact implementation scope and expected file areas
- Database migration and data preservation strategy when applicable
- Acceptance criteria and verification procedure
- Prerequisites and follow-up work

Summarize the decisions and request final approval. Write the plan only after approval.

## Plan Format

Write to `doc/projects-reorganization/plan/NN-topic.md` using the next available number.

Every plan must include:

```markdown
# NN. Title

Status: Approved

## Goal
## References
## Current State
## Decisions
## Scope
## Non-Goals
## Route and Navigation Changes
## Data and Database Changes
## SEO Changes
## File Changes
## Implementation Steps
## Validation
## Acceptance Criteria
## Risks and Rollback
## Follow-Up Plans
```

Use `None` with a short reason for sections that do not apply. File changes should name concrete paths when they can be known from the existing repository.

## Handoff

After saving an approved plan, report its path and instruct the user to invoke `$portfolio-execute` with that plan. Do not begin implementation in the same invocation.
