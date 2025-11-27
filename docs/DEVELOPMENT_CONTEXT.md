# Journy - Documento de Contexto para Desarrollo

## 1. Qué es Journy

Journy es una aplicación de journaling personal donde las entradas del diario se almacenan de forma **encriptada en IPFS** y se registran **on-chain en Base**. Solo el propietario de la wallet puede leer sus propias entradas.

### Stack Técnico Actual
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Blockchain**: Base Sepolia (testnet) → Base (mainnet)
- **Storage**: IPFS via Pinata
- **Wallet**: Wagmi + Reown (Web3Modal)
- **Encriptación**: AES-256-GCM con clave derivada de firma de wallet

### Flujo de Escritura
```
Usuario escribe → Encripta con clave derivada de wallet → Sube a IPFS → 
Registra CID + timestamp en contrato JournyLog → Incrementa streak
```

### Flujo de Lectura
```
Lee CIDs del contrato → Descarga de IPFS → Desencripta con clave de wallet → Muestra
```

---

## 2. Contrato Actual: JournyLog

```solidity
// Funciones principales
function addEntry(string calldata ipfsCid) external
function getEntryCount(address user) external view returns (uint256)
function getEntry(address user, uint256 index) external view returns (Entry)
function getStreak(address user) external view returns (uint256)
function isEligibleForClanker(address user) external view returns (bool) // 30 días streak
```

**Datos que almacena por usuario:**
- Array de entries (CID + timestamp)
- Streak actual (días consecutivos)
- Último día de escritura

---

## 3. Farcaster Mini App

Journy está diseñado para funcionar como **Farcaster Mini App**, además de como webapp standalone.

### Integración Dual
| Contexto | Wallet | Auth |
|----------|--------|------|
| **Farcaster** | Auto-connect via `miniAppConnector` | Usuario ya logueado |
| **Web normal** | Web3Modal | Conecta manualmente |

### Detección
```tsx
import { sdk } from '@farcaster/miniapp-sdk'
const isInMiniApp = sdk.isInMiniApp()
```

### Consistencia de datos
La identidad es la **wallet**, no el método de conexión. Si el usuario usa la misma wallet en Farcaster y en web, ve las mismas entradas.

---

## 4. Tokenomics Propuesto: $JOURNY

### Lanzamiento via Clanker SDK
Clanker es el launchpad de tokens en Base/Farcaster. Usar el SDK permite:
- Vault con vesting para rewards
- Configurar múltiples recipients de fees
- Pool automático en Uniswap v4
- Verificación en clanker.world

### Distribución Propuesta
```
Total Supply: 1,000,000,000 $JOURNY

┌─────────────────────────────────────────┐
│  80% → Liquidity Pool (Uniswap v4)      │
│  20% → Vault (rewards para usuarios)    │
└─────────────────────────────────────────┘
```

### Trading Fees (del LP)
```
┌─────────────────────────────────────────┐
│  50% → Treasury (desarrollo)            │
│  50% → Rewards Pool (streak rewards)    │
└─────────────────────────────────────────┘
```

---

## 5. Sistema de Puntuación y Gamificación

### Streak (ya implementado)
- Se incrementa cada día que el usuario escribe
- Se resetea si pierde un día
- Milestone actual: 30 días → `isEligibleForClanker`

### Propuesta de Milestones y Rewards

| Streak | Milestone | Reward $JOURNY | Beneficio |
|--------|-----------|----------------|-----------|
| 7 días | Week Warrior | 100 | Badge |
| 14 días | Fortnight | 500 | Badge + Feature? |
| 30 días | Monthly Master | 2,000 | Badge + Clanker eligible |
| 90 días | Quarterly Quest | 10,000 | Badge + Premium? |
| 365 días | Year of Reflection | 100,000 | Badge + Lifetime? |

### Nuevo Contrato: JournyRewards

```solidity
contract JournyRewards {
    IERC20 public journyToken;
    IJournyLog public journyLog;
    
    mapping(address => mapping(uint256 => bool)) public claimedMilestones;
    
    function claimReward(uint256 milestone) external {
        require(journyLog.getStreak(msg.sender) >= milestone, "Streak not reached");
        require(!claimedMilestones[msg.sender][milestone], "Already claimed");
        
        uint256 reward = getRewardForMilestone(milestone);
        claimedMilestones[msg.sender][milestone] = true;
        journyToken.transfer(msg.sender, reward);
    }
}
```

---

## 6. Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    React + Wagmi + SDK                           │
├─────────────────────────────────────────────────────────────────┤
│  WritePage    │  HistoryPage  │  SystemPage  │  RewardsPage     │
│  (escribir)   │  (leer)       │  (config)    │  (claim tokens)  │
└───────┬───────┴───────┬───────┴───────┬──────┴────────┬─────────┘
        │               │               │               │
        ▼               ▼               ▼               ▼
┌───────────────────────────────────────────────────────────────────┐
│                         BLOCKCHAIN (Base)                         │
├───────────────────────┬───────────────────────┬───────────────────┤
│      JournyLog        │    JournyRewards      │   $JOURNY Token   │
│  - entries[]          │  - claimReward()      │   (ERC-20)        │
│  - streak             │  - milestones         │   via Clanker     │
│  - addEntry()         │  - reads JournyLog    │                   │
└───────────────────────┴───────────────────────┴───────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                         STORAGE (IPFS)                            │
│                    Entradas encriptadas                           │
└───────────────────────────────────────────────────────────────────┘
```

---

## 7. Fases de Desarrollo

### Fase 1: Mini App (actual)
- [ ] Integrar Farcaster Mini App SDK
- [ ] Detectar contexto (Mini App vs Web)
- [ ] Configurar `miniAppConnector` para Wagmi
- [ ] Llamar `sdk.actions.ready()`
- [ ] Crear manifest `/.well-known/farcaster.json`
- [ ] Testing en Farcaster preview

### Fase 2: Token Launch
- [ ] Definir tokenomics finales
- [ ] Integrar Clanker SDK
- [ ] Lanzar $JOURNY con vault configurado
- [ ] UI para ver balance de token

### Fase 3: Rewards System
- [ ] Desarrollar contrato JournyRewards
- [ ] Definir milestones y rewards
- [ ] UI para ver milestones y hacer claim
- [ ] Integrar con JournyLog para leer streak

### Fase 4: Gamificación Avanzada
- [ ] Sistema de badges/achievements
- [ ] Leaderboard (opcional, respetando privacidad)
- [ ] Features premium desbloqueables con token
- [ ] Notificaciones push (Farcaster)

---

## 8. Decisiones Pendientes

1. **Tokenomics exactos**: ¿80/20 está bien? ¿Otros splits?
2. **Rewards por milestone**: ¿Cantidades propuestas son correctas?
3. **Utility del token**: ¿Solo rewards o también gating/premium?
4. **Red**: ¿Base Sepolia para testing, luego Base mainnet?
5. **Vault vesting**: ¿Duración del lockup y vesting?

---

## 9. Links de Referencia

- **Farcaster Mini Apps**: https://miniapps.farcaster.xyz/
- **Clanker SDK**: https://clanker.gitbook.io/clanker-documentation/sdk/v4.0.0
- **Contrato JournyLog**: `packages/contract/src/JournyLog.sol`
- **Config Wagmi**: `packages/web/src/config/web3.tsx`

---

*Documento generado el 27/11/2025*
