# @journy/indexer

Indexer de eventos on-chain para el sistema de gamificación de Journy.

Usa [Ponder](https://ponder.sh) para escuchar eventos `EntryLogged` del contrato `JournyLog` y calcular puntos/rankings.

## Setup

```bash
# Desde la raíz del monorepo
npm install

# Copiar variables de entorno
cp packages/indexer/.env.example packages/indexer/.env

# Editar .env con tu RPC URL de Base Sepolia
```

## Desarrollo

```bash
# Generar tipos (necesario después de cambios en schema)
npm run indexer:codegen

# Iniciar en modo desarrollo (hot reload)
npm run indexer:dev
```

## Producción

```bash
npm run indexer:start
```

## Schema

### `user`
Datos agregados por usuario para leaderboards:
- `address` - Primary key
- `totalEntries` - Número total de entradas
- `currentStreak` / `maxStreak` - Rachas
- `totalPoints` / `weeklyPoints` / `monthlyPoints` - Puntos calculados
- `isOptedIn` - Si participa en el leaderboard público

### `entry`
Cada entrada individual:
- `id` - txHash-logIndex
- `userAddress` - Referencia al usuario
- `cid` - IPFS CID (encriptado)
- `timestamp` / `streak` / `pointsEarned`

### `leaderboardSnapshot`
Snapshots históricos para rankings semanales/mensuales.

## Fórmula de Puntos

```
PUNTOS = BASE × MULT_STREAK
BASE = 10
MULT_STREAK = 1 + (streak / 10)
```

| Streak | Multiplicador | Puntos |
|--------|---------------|--------|
| 1 día  | 1.1x          | 11     |
| 7 días | 1.7x          | 17     |
| 30 días| 4.0x          | 40     |
| 100 días| 11.0x        | 110    |

## Contrato

- **Red**: Base Sepolia (84532)
- **Dirección**: `0xf5FeFabd1B0Ad49a0DE92B7c04FBa3518083Dc64`
- **Evento**: `EntryLogged(address indexed user, string cid, uint256 timestamp, uint16 streak)`
