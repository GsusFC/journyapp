# 📂 PROJECT_STRUCTURE.md

**Strategy:** Pnpm Workspaces (Monorepo).

## Structure
*   `packages/contract`: Hardhat environment for `MemoryLog.sol`.
*   `packages/web`: Vite + React environment for the MiniApp.

## Workflow
1.  Change Contract -> `pnpm run deploy:local`
2.  Script copies ABI to `packages/web/src/abis`
3.  Frontend updates automatically.
