---
status: pending
priority: p1
issue_id: "001"
tags: [security, encryption, code-review]
dependencies: []
---

# 🔴 P1: Weak Encryption Key Derivation

## Problem Statement

The encryption key is derived **only** from the user's wallet address using PBKDF2:

```typescript
// encryption.ts:51
const key = await this.deriveKey(userAddress.toLowerCase(), salt)
```

Wallet addresses are **public** and can be extracted from blockchain transactions. Anyone can see a user's address and attempt to derive their encryption key.

## Why This Matters

- **Address is public info**: Not a secret, anyone can see it.
- **Predictable key material**: Same address = same base key.
- **IPFS data is public**: Encrypted payloads are publicly accessible.

An attacker could:
1. Find a target's address (public)
2. Download their IPFS entries (public)
3. Derive the "secret" key from public address
4. Decrypt all their journal entries

## Proposed Solutions

### Option A: Require Wallet Signature (Recommended)
**Effort**: Medium | **Risk**: Low

```typescript
// Request user to sign a message (produces unique signature)
const signature = await signMessage("Journy Encryption Key v1")
const key = await deriveKey(signature, salt)
```

**Pros:**
- Signature is unique and secret
- Requires wallet interaction (proof of ownership)
- Standard Web3 pattern

**Cons:**
- UX: requires signature on first use
- Key recovery: lost if wallet lost

### Option B: Hardware-bound key + Signature
**Effort**: High | **Risk**: Medium

Combine signature with device-specific entropy.

## Acceptance Criteria

- [ ] Encryption key derived from wallet signature, not address
- [ ] Migration path for existing entries (or clarify they're at risk)
- [ ] Document the new security model
