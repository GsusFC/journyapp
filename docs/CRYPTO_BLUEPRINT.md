# 🔐 CRYPTO_BLUEPRINT.md

**Goal:** Zero-Knowledge Architecture.

## 1. Deterministic Key Generation
1.  User signs static message: "Access Journy Vault. Chain ID: 8453. Salt: [APP_CONST]"
2.  Use Signature as Password + Salt -> PBKDF2 -> Generate AES-256 Key.
3.  Key lives in Memory/Session only.

## 2. IPFS Payload Format
```json
{ "v": 1, "iv": "hex", "content": "encrypted_hex", "timestamp": 123 }
