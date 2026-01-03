---
title: "Monorepo with Workspaces"
category: architecture-decisions
tags: [monorepo, npm-workspaces, project-structure]
module: Root
created: 2025-11-23
status: implemented
---

# Monorepo with npm Workspaces

## Decision

Use npm workspaces to manage a monorepo with three packages: `contract`, `indexer`, and `web`.

## Structure

```
journy/
├── package.json          # Root with workspaces
├── packages/
│   ├── contract/         # Hardhat + Solidity
│   ├── indexer/          # Ponder indexer
│   └── web/              # React + Vite frontend
└── docs/                 # Documentation
```

## Root package.json

```json
{
    "private": true,
    "workspaces": ["packages/*"],
    "scripts": {
        "build": "npm run build --workspace packages/web",
        "indexer:dev": "npm run dev --workspace packages/indexer"
    }
}
```

## Why This Works

1. **Shared dependencies**: Common packages installed once at root
2. **Cross-package references**: Easy to share types/ABIs between packages
3. **Single git repo**: Atomic commits across contract + frontend
4. **Independent deployments**: Each package deploys separately

## Package Responsibilities

| Package | Purpose | Tech Stack |
|---------|---------|------------|
| `contract` | Smart contracts | Hardhat, Solidity, OpenZeppelin |
| `indexer` | Blockchain indexer | Ponder, TypeScript |
| `web` | User interface | React, Vite, Wagmi, TailwindCSS |

## ABI Sharing Pattern

Contract compiles generate TypeScript types in `typechain-types/`. These can be referenced by other packages for type-safe contract interactions.
