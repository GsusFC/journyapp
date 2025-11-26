# Journy

**Privacy-first encrypted journal on Base blockchain**

Journy is a decentralized journaling application that combines client-side encryption, IPFS storage, and blockchain verification to create a truly private and permanent record of your thoughts.

## 🎯 Features

- 🔐 **End-to-End Encryption**: All content encrypted client-side using AES-GCM
- 📝 **On-Chain Verification**: Entry hashes stored on Base (Sepolia testnet)
- 🌐 **Decentralized Storage**: Encrypted content stored on IPFS via Pinata
- 🔥 **Streak Tracking**: Build your writing habit with on-chain streak validation
- 🎨 **Minimal Design**: Brutalist UI with JetBrains Mono and purple accents

## 🏗️ Architecture

### Monorepo Structure

```
journy/
├── packages/
│   ├── contract/        # Smart contracts (Hardhat)
│   └── web/            # Frontend (React + Vite)
└── docs/               # Documentation
```

### Tech Stack

**Smart Contracts:**
- Solidity ^0.8.20
- Hardhat
- OpenZeppelin contracts
- Base Sepolia network

**Frontend:**
- React + TypeScript
- Vite
- Wagmi + Viem
- Reown AppKit (Web3Modal)
- Tailwind CSS
- Framer Motion

**Storage & Encryption:**
- IPFS (Pinata)
- Web Crypto API (AES-GCM)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GsusFC/journyapp.git
cd journyapp
```

2. Install contract dependencies:
```bash
cd packages/contract
npm install
```

3. Install web dependencies:
```bash
cd packages/web
npm install
```

### Configuration

#### Smart Contract

1. Copy `.env.example` to `.env` in `packages/contract/`
2. Add your private key and RPC URL

#### Frontend

1. Copy `.env.example` to `.env` in `packages/web/`
2. Add your Pinata JWT token
3. The contract address is already configured for Base Sepolia

### Development

**Smart Contracts:**
```bash
cd packages/contract
npm run compile    # Compile contracts
npm run test       # Run tests
npm run deploy     # Deploy to testnet
```

**Frontend:**
```bash
cd packages/web
npm run dev        # Start dev server
```

## 📝 Smart Contract

**Deployed on Base Sepolia:**
- Address: `0xf5FeFabd1B0Ad49a0DE92B7c04FBa3518083Dc64`
- [View on BaseScan](https://sepolia.basescan.org/address/0xf5FeFabd1B0Ad49a0DE92B7c04FBa3518083Dc64)

### Key Functions

- `logEntry(string cid)`: Log an encrypted entry's IPFS CID
- `currentStreak(address)`: Get user's current writing streak
- `isEligibleForClanker(address)`: Check if user has 30+ day streak

## 🔒 Security

### Privacy Guarantees

1. **Client-Side Encryption**: All journal content is encrypted in your browser before leaving your device
2. **No Plain Text Storage**: We NEVER store or transmit unencrypted content
3. **You Own Your Keys**: Encryption keys derived from your wallet signature
4. **Decentralized Storage**: Content stored on IPFS, not centralized servers
5. **On-Chain Hashes Only**: Blockchain only stores IPFS CIDs, not content

### Security Restrictions

See `ANTIGRAVITY_RESTRICTIONS.md` for detailed security guidelines.

## 🎨 Design System

- **Typography**: JetBrains Mono (monospace)
- **Colors**:
  - Background: `#f7f9fc`
  - Text: `#0f131e`
  - Accent: `#6716e9` (purple)
  - Surface: `#e9e3ff`
- **Aesthetic**: Minimal brutalist with sharp edges (no border radius)

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 🔗 Links

- [Documentation](./docs/)
- [Smart Contract Specs](./SMART_CONTRACT_SPECS.md)
- [Design System](./DESIGN_SYSTEM.md)

---

Built with ❤️ using Base, IPFS, and Web3
"// redeploy 2025-11-23 13:24:59"
