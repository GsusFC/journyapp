# DEPLOYMENT_RUNBOOK.md

## 1. Requisitos Previos
*   Cuenta en **Pinata** (IPFS) -> Obtener `PINATA_JWT`.
*   Cuenta en **Vercel** -> Conectar repo GitHub.
*   Wallet con ETH en Base Mainnet (para deployar el contrato `JournyLog`).

## 2. Variables de Entorno (.env.production)
```bash
VITE_WALLET_PROJECT_ID=... (Reown/WalletConnect)
VITE_PINATA_JWT=...
VITE_CONTRACT_ADDRESS=... (La dirección de JournyLog en Base)
VITE_CLANKER_API_KEY=... (Si aplica para lectura de datos)