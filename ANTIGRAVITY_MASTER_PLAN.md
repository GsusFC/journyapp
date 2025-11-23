# 📂 ANTIGRAVITY_MASTER_PLAN.md

**Project Name:** Journy
**Type:** Farcaster MiniApp (Frame v2)
**Network:** Base (EVM)
**Core Philosophy:** Privacy First → Proof of Journey → Tokenization (Optional)

## 1. Misión del Proyecto
Construir "Journy", una aplicación de diario personal descentralizada.
*   **Nivel 1 (Core):** El usuario escribe, el contenido se encripta (Client-Side), se sube a IPFS y se registra el hash en un Smart Contract en Base (`MemoryLog`).
*   **Nivel 2 (Gamificación):** El contrato valida la constancia (Rachas/Streaks).
*   **Nivel 3 (Endgame - Clanker):** Si el usuario alcanza un hito de reputación, se desbloquea la interfaz para desplegar un token ERC-20 usando Clanker.

## 2. Stack Tecnológico
*   **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Shadcn/UI.
*   **Web3:** `viem`, `wagmi`.
*   **Smart Contracts:** Solidity ^0.8.20 (Base).
*   **Storage:** IPFS (Pinata/Helia) + Web Crypto API (AES-GCM).
*   **DeFi:** Clanker SDK v4.

## 3. Arquitectura de Agentes
*   **👮‍♂️ The Cryptographer:** Responsable de `src/utils/encryption.ts`.
*   **👷‍♂️ The Solidity Architect:** Responsable de `contracts/MemoryLog.sol`.
*   **🎨 The Designer:** UI/UX "Sealed/Zen Style".
*   **🏦 The Banker:** Responsable de integración Clanker (Fase 3).
