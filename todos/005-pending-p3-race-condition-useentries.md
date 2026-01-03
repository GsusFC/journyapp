---
status: pending
priority: p3
issue_id: "005"
tags: [performance, react, code-review]
dependencies: []
---

# 🔵 P3: Potential Race Condition in useEntries

## Problem Statement

The `loadBatch` function in `useEntries.ts` modifies state while referencing previous state from closure:

```typescript
const loadBatch = useCallback(async (startFrom: number, count: number) => {
  const newPreviews = new Map(previews)  // ← Closure captures stale previews
  // ... async operations ...
  setPreviews(newPreviews)  // ← May overwrite concurrent updates
}, [address, totalEntries, previews])
```

If `loadBatch` is called multiple times (e.g., fast scrolling), concurrent executions may overwrite each other's results.

## Proposed Solutions

### Option A: Use Functional State Updates
**Effort**: Small | **Risk**: Low

```typescript
setPreviews(prev => {
  const newMap = new Map(prev)
  // ... add new entries ...
  return newMap
})
```

### Option B: Add Loading Lock
**Effort**: Small | **Risk**: Low

Already partially done with `isLoadingMore`, but could be more robust.

## Acceptance Criteria

- [ ] State updates use functional pattern `setPreviews(prev => ...)`
- [ ] No data loss on rapid scroll
