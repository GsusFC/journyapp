---
status: pending
priority: p2
issue_id: 002
tags: [ux, wallet, theme]
dependencies: []
---

# Problem Statement
The Wallet Connection modal (AppKit) does not match the application's selected theme. It is hardcoded to 'light' in `web3.tsx`.

# Findings
- `packages/web/src/config/web3.tsx`: `themeMode: 'light'` is hardcoded.
- `App.tsx`: Uses `next-themes` provider.
- These two systems are disconnected.

# Proposed Solutions
1.  **Dynamic Update**: In `App.tsx` (or a new `ThemeSync` component), use `useTheme` hook to detect changes and call AppKit's `setThemeMode` function (need to verify if exposed via `useAppKit` hook or adapter).
2.  **AppKit Hook**: Reown AppKit usually exports a hook like `useAppKitTheme` or allows setting it via the instance.

# Recommended Action
Implement a `ThemeSync` component inside `App.tsx` that listens to `useTheme` and updates AppKit.

# Technical Details
- File: `packages/web/src/App.tsx`
- File: `packages/web/src/config/web3.tsx`

# Acceptance Criteria
- [ ] Changing app theme to Dark updates Wallet Modal to Dark.
- [ ] Changing app theme to Light updates Wallet Modal to Light.
