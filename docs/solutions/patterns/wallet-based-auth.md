---
title: "Wallet-Based Authentication"
category: patterns
tags: [wagmi, wallet, authentication, web3]
module: Web
created: 2025-11-23
---

# Wallet-Based Authentication Pattern

## Overview

Journy uses wallet connection as the sole authentication method. No usernames, no passwords, no OAuth.

## Implementation

```typescript
// Using Wagmi hooks
const { isConnected, address } = useAccount()

// Protected routes
<Route
  path="/write"
  element={isConnected ? <WritePage /> : <Navigate to="/" />}
/>
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `useAccount()` | Get connection state and address |
| `useConnect()` | Initiate wallet connection |
| `useDisconnect()` | Log out |
| `useSignMessage()` | Sign for encryption key derivation |

## UX Flow

1. User lands on `/` (LandingPage)
2. Clicks "Connect Wallet"
3. Web3Modal opens, user connects
4. Auto-redirect to `/write`
5. Wallet address = user identity

## Benefits

- No password management
- No email verification
- No database of credentials
- Works with any EVM wallet
- Consistent identity across devices (same wallet)
