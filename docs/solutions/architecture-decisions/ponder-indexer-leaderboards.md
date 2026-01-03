---
title: "Ponder Indexer for Leaderboards"
category: architecture-decisions
tags: [ponder, indexer, leaderboard, gamification]
module: Indexer
created: 2025-11-23
status: implemented
---

# Ponder Indexer for Leaderboards

## Decision

Use Ponder to index on-chain events and calculate derived data for leaderboards and analytics.

## Why an Indexer?

Reading directly from blockchain is:
- Slow (multiple RPC calls)
- Expensive (rate limits)
- Stateless (can't aggregate)

Ponder indexes events and builds queryable tables.

## Schema

```typescript
// ponder.schema.ts
export const user = onchainTable("user", (t) => ({
    address: t.hex().primaryKey(),
    totalEntries: t.integer().default(0),
    currentStreak: t.integer().default(0),
    maxStreak: t.integer().default(0),
    totalPoints: t.integer().default(0),
    weeklyPoints: t.integer().default(0),
    monthlyPoints: t.integer().default(0),
}));

export const entry = onchainTable("entry", (t) => ({
    id: t.text().primaryKey(),
    userAddress: t.hex(),
    cid: t.text(),
    timestamp: t.integer(),
    streak: t.integer(),
    pointsEarned: t.integer(),
}));
```

## Points System

Calculated in indexer based on streak:
- Base points per entry
- Streak multipliers
- Weekly/monthly resets

## Leaderboard Queries

With indexed data, leaderboards are simple SQL:

```sql
SELECT address, totalPoints 
FROM user 
ORDER BY totalPoints DESC 
LIMIT 10
```

## Deployment

Indexer runs separately, watching the JournyLog contract for `EntryLogged` events.
