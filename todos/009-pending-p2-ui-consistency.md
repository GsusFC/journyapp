---
status: pending
priority: p2
issue_id: 003
tags: [ui, design, css]
dependencies: []
---

# Problem Statement
Inconsistent use of borders and colors across components. Some use semantic variables (`border-stroke`), others use raw Tailwind colors (`border-zinc-300`).

# Findings
- `SystemPage.tsx` uses hardcoded `border-zinc-300` / `dark:border-zinc-700`.
- `Header.tsx` uses `border-stroke`.
- `tailwind.config.js` defines semantic colors but they aren't fully utilized.

# Proposed Solutions
1.  **Refactor to Semantic Variables**: Update all hardcoded colors to use `bg-surface`, `border-stroke`, `text-primary`, etc.
2.  **Enhance Palette**: Add `bg-surface-secondary` if needed for cards instead of hardcoded `zinc-100`.

# Recommended Action
Refactor `SystemPage` to use semantic classes.

# Technical Details
- File: `packages/web/src/pages/SystemPage.tsx`

# Acceptance Criteria
- [ ] SystemPage controls look consistent with Header/Footer.
- [ ] Dark mode logic is simplified using variables.
