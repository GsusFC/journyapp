---
title: "Infinite Scroll with Intersection Observer"
category: patterns
tags: [react, performance, infinite-scroll, ux]
module: Web
created: 2025-11-23
---

# Infinite Scroll with Intersection Observer

## Pattern

Use `IntersectionObserver` to detect when user scrolls near bottom, then load more entries.

## Implementation

```typescript
// Custom hook
const [loadMoreRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>()

// Effect to trigger load
useEffect(() => {
    if (isIntersecting && hasMore && !isLoadingMore) {
        loadMore()
    }
}, [isIntersecting, hasMore, isLoadingMore, loadMore])

// Sentinel element
<div ref={loadMoreRef} className="h-4" />
```

## Why Intersection Observer?

- Native browser API (no library)
- More performant than scroll events
- Handles visibility correctly
- Works with any scroll container

## Loading States

```tsx
{isLoadingMore ? (
    <div className="animate-spin" />
) : (
    <button onClick={loadMore}>Load More</button>
)}
```

## Entry Batching

Entries loaded in batches (e.g., 10 at a time) from:
1. Contract: `getEntry(user, index)`
2. IPFS: Download and decrypt preview
