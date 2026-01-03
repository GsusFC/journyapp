---
title: "Client-Side Encryption Architecture"
category: architecture-decisions
tags: [encryption, aes-gcm, web-crypto, privacy, security]
module: Web
created: 2025-11-23
status: implemented
---

# Client-Side Encryption Architecture

## Decision

All journal content is encrypted client-side using **AES-256-GCM** before leaving the user's device. The encryption key is derived from a wallet signature, ensuring only the wallet owner can decrypt their entries.

## Context

Journy is a privacy-first journaling app. Users need absolute confidence that:
1. No one can read their journal entries (not even the developers)
2. Their data is truly decentralized
3. They own and control their data

## Solution

### Encryption Flow

```
User writes → AES-256-GCM encrypt → Upload to IPFS → Store CID on-chain
```

### Key Derivation

```typescript
// User signs a deterministic message with their wallet
const signature = await signMessage("Journy Encryption Key")
// SHA-256 hash of signature becomes the encryption key
const key = await crypto.subtle.digest('SHA-256', signature)
```

### Why This Works

1. **Wallet-based keys**: No passwords to remember, key derived from wallet ownership
2. **AES-256-GCM**: Industry-standard symmetric encryption with authentication
3. **Client-side only**: Server/IPFS only sees encrypted blobs
4. **Deterministic**: Same wallet = same key = access to all entries

## Files Involved

- `packages/web/src/hooks/useWriteEntry.ts` - Encryption during save
- `packages/web/src/hooks/useEntries.ts` - Decryption during read
- `packages/web/src/services/encryption.ts` - Core crypto functions (if exists)

## Trade-offs

| Pro | Con |
|-----|-----|
| True privacy | Lost wallet = lost data |
| No server trust | Can't recover entries without wallet |
| Decentralized | Slightly more complex UX |

## Prevention

- Always remind users: **Your wallet IS your password**
- Consider future: Multi-sig recovery? Seed phrase backup?
