---
title: "On-Chain Streak Logic"
category: architecture-decisions
tags: [smart-contract, streak, gamification, solidity]
module: Contract
created: 2025-11-23
status: implemented
---

# On-Chain Streak Logic

## Decision

Implement streak tracking directly in the smart contract, not off-chain.

## Contract: JournyLog

```solidity
mapping(address => uint32) public lastEntryTimestamp;
mapping(address => uint16) public currentStreak;

function logEntry(string calldata _cid) external {
    uint256 dt = block.timestamp - lastEntryTimestamp[user];
    
    if (dt < 24 hours) {
        // Same day: streak unchanged (allows multiple entries/day)
    } else if (dt >= 24 hours && dt <= 48 hours) {
        // Next day: streak continues
        currentStreak[user]++;
    } else {
        // Missed a day: streak resets
        currentStreak[user] = 1;
    }
}
```

## Why On-Chain?

1. **Trustless verification**: No backend can fake streaks
2. **Composability**: Other contracts can read streak (e.g., `isEligibleForClanker`)
3. **Transparency**: Users can verify their streak on-chain
4. **Token rewards**: Future $JOURNY rewards can trust streak data

## Gas Considerations

- Uses `uint32` for timestamp (sufficient until 2106)
- Uses `uint16` for streak (max 65535 days = ~179 years)
- Minimal storage: 3 slots per user

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| First entry ever | Streak = 1 |
| Multiple entries same day | Streak unchanged |
| Entry after 24-48h | Streak increments |
| Entry after 48h+ | Streak resets to 1 |
