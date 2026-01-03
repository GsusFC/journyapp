---
title: "IPFS Storage with Pinata"
category: architecture-decisions
tags: [ipfs, pinata, storage, decentralized]
module: Web
created: 2025-11-23
status: implemented
---

# IPFS Storage with Pinata

## Decision

Use IPFS via Pinata for storing encrypted journal entries, with only the CID stored on-chain.

## Flow

```
1. User writes entry
2. Frontend encrypts content (AES-256-GCM)
3. Upload encrypted blob to Pinata → get CID
4. Store CID on-chain via JournyLog.logEntry(cid)
```

## Why IPFS + Pinata?

1. **Content-addressed**: CID is hash of content, immutable
2. **Decentralized**: Content can be retrieved from any IPFS gateway
3. **Cost-effective**: Large content off-chain, only 46-byte CID on-chain
4. **Pinata reliability**: Managed pinning service with high availability

## Configuration

```env
# packages/web/.env
VITE_PINATA_JWT=your_jwt_token
```

## On-Chain vs Off-Chain

| Data | Storage | Reason |
|------|---------|--------|
| Encrypted content | IPFS | Size, cost |
| CID (hash) | Blockchain | Verification, ownership |
| Timestamp | Blockchain | Streak calculation |
| User address | Blockchain | Ownership |

## Reading Back

```
1. Read CIDs from contract: getEntry(user, index)
2. Fetch from IPFS: https://ipfs.io/ipfs/{cid}
3. Decrypt with wallet-derived key
4. Display to user
```
