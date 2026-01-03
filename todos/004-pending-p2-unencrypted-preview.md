---
status: pending
priority: p2
issue_id: "004"
tags: [security, privacy, code-review]
dependencies: []
---

# 🟡 P2: Preview Stored Unencrypted in IPFS

## Problem Statement

The entry preview (first 150 chars) is stored in plaintext alongside encrypted content:

```typescript
// useWriteEntry.ts:64
const preview = lines.slice(0, 2).join('\n').slice(0, 150)

// Uploaded to IPFS as plaintext:
await ipfsService.uploadEncryptedEntry({
  encrypted,
  iv,
  salt,
  timestamp: Math.floor(Date.now() / 1000),
  preview  // ← NOT ENCRYPTED!
})
```

Anyone with the CID can read the preview of every journal entry.

## Impact

- **Privacy violation**: First 150 chars of every entry are public
- **Leaks sensitive info**: Could contain names, feelings, private thoughts
- **Contradicts "Privacy First" promise**

## Proposed Solutions

### Option A: Remove Preview from IPFS
**Effort**: Small | **Risk**: Low

Don't store preview in IPFS at all. Generate it after decryption.

```typescript
// Remove preview from payload
await ipfsService.uploadEncryptedEntry({ encrypted, iv, salt, timestamp })

// Generate preview after decryption in useEntries
```

### Option B: Encrypt Preview Separately
**Effort**: Medium | **Risk**: Low

Store preview as encrypted field, decrypt for list view.

## Acceptance Criteria

- [ ] No plaintext content stored in IPFS
- [ ] Preview generated client-side after decryption
- [ ] Existing entries: document the exposure
