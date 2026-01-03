---
status: pending
priority: p2
issue_id: "002"
tags: [security, secrets, code-review]
dependencies: []
---

# 🟡 P2: Hardcoded Fallback Project ID

## Problem Statement

The WalletConnect Project ID has a hardcoded fallback in `web3.tsx`:

```typescript
const projectId = import.meta.env.VITE_WALLET_PROJECT_ID || '349ee7a88d119a669be53f17c9449b78'
```

This ID is visible in the source code and could be:
- Rate-limited or banned
- Used for impersonation attacks
- Tracked for analytics

## Proposed Solutions

### Option A: Fail Without Env Var
**Effort**: Small | **Risk**: Low

```typescript
const projectId = import.meta.env.VITE_WALLET_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_WALLET_PROJECT_ID is required')
}
```

### Option B: Dev-only Fallback with Warning
**Effort**: Small | **Risk**: Low

```typescript
const projectId = import.meta.env.VITE_WALLET_PROJECT_ID
if (!projectId && import.meta.env.DEV) {
  console.warn('Using dev Project ID - do not use in production!')
}
```

## Acceptance Criteria

- [ ] No hardcoded Project ID in source code
- [ ] Clear error if env var missing in production
- [ ] Documentation updated with .env requirements
