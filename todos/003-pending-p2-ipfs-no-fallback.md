---
status: pending
priority: p2
issue_id: "003"
tags: [performance, reliability, ipfs, code-review]
dependencies: []
---

# 🟡 P2: No IPFS Gateway Fallback or Retry Logic

## Problem Statement

IPFS fetching uses a single gateway with no retry:

```typescript
// ipfs.ts:53
const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
```

If Pinata gateway is down or slow, the entire app fails.

## Impact

- Single point of failure
- No resilience to network issues
- Poor UX on slow connections

## Proposed Solutions

### Option A: Multiple Gateway Fallback
**Effort**: Medium | **Risk**: Low

```typescript
const GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
]

async fetchWithFallback(cid: string) {
  for (const gateway of GATEWAYS) {
    try {
      const response = await fetch(`${gateway}${cid}`, { timeout: 5000 })
      if (response.ok) return response.json()
    } catch {}
  }
  throw new Error('All gateways failed')
}
```

### Option B: Add Retry with Exponential Backoff
**Effort**: Small | **Risk**: Low

Use a retry library like `p-retry` for transient failures.

## Acceptance Criteria

- [ ] At least 3 gateway fallbacks configured
- [ ] Retry logic with exponential backoff
- [ ] Timeout configured (e.g., 10s max)
