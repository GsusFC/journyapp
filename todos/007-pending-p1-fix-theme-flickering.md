---
status: pending
priority: p1
issue_id: 001
tags: [performance, css, theme]
dependencies: []
---

# Problem Statement
When switching between Light and Dark modes, the entire UI "flickers" or feels laggy. This is causing a jarring user experience.

# Findings
- `packages/web/src/index.css` applies `transition-colors duration-300` to `html` and `body`.
- This forces the browser to interpolate *every* color change on the root elements, which can be performance-heavy and cause visual "flashing" (FOUC-like behavior) if the new theme variables aren't fully recalculated before the paint.
- Hardcoded pure black/white colors in transitions often look bad during the midpoint.

# Proposed Solutions
1.  **Remove Global Transition**: Delete the transition rule from `html, body`. Theme switches will be instant (snappy).
2.  **Scoped Transitions**: Apply transitions only to specific interactive elements (buttons, cards) rather than the entire document root.

# Recommended Action
Option 1 is safer and simpler for now. Instant theme switching is generally preferred over laggy transitions.

# Technical Details
- File: `packages/web/src/index.css`
- Change: Remove `@apply ... transition-colors duration-300;`

# Acceptance Criteria
- [ ] Switching theme happens instantly without visual lag.
- [ ] No "flash" of the wrong color.
