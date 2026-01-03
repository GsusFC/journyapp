---
title: "Entry Preview Caching"
category: patterns
tags: [react, caching, performance, ux]
module: Web
created: 2025-11-23
---

# Entry Preview Caching Pattern

## Problem

Decrypting entries for the history page is expensive:
1. Fetch CID from contract
2. Download from IPFS
3. Decrypt with wallet signature

Doing this for every entry on page load = slow UX.

## Solution

Generate and cache previews (first 150 chars) during initial load.

## Implementation

```typescript
const [previews, setPreviews] = useState<Map<number, Preview>>(new Map())

// On load: fetch metadata + generate preview
const preview = {
  timestamp: entry.timestamp,
  preview: await getPreviewForEntry(index) // First 150 chars
}
```

## Preview Generation

1. Full decryption happens once
2. Extract first 150 characters
3. Store in React state (Map by index)
4. Display in list view

## Full Decryption on Demand

When user clicks a card:
1. Check if already decrypted
2. If not, trigger full decryption
3. Show loading spinner
4. Display full content in modal

## Trade-offs

| Approach | Pro | Con |
|----------|-----|-----|
| Decrypt all upfront | Instant clicks | Slow initial load |
| Decrypt on click | Fast load | Wait on click |
| **Preview cache** | Balanced | Some complexity |
