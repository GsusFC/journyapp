# Railway Deploy Guide - Journy Indexer

## Resumen

El indexer Ponder necesita un servidor persistente con PostgreSQL. Railway es la opción recomendada por su simplicidad.

## Requisitos

- Cuenta en [railway.app](https://railway.app)
- Repositorio: `https://github.com/GsusFC/journyapp`

## Configuración

### 1. Crear proyecto

1. Ir a [railway.app](https://railway.app) → **New Project**
2. Seleccionar **Deploy from GitHub repo**
3. Conectar cuenta de GitHub si no está conectada
4. Seleccionar repositorio `GsusFC/journyapp`

### 2. Configurar servicio

En **Settings** del servicio:

| Campo | Valor |
|-------|-------|
| **Root Directory** | `packages/indexer` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start` |

### 3. Añadir PostgreSQL

1. Click **+ New** → **Database** → **PostgreSQL**
2. Railway genera automáticamente `DATABASE_URL`
3. La variable se inyecta al servicio

### 4. Variables de entorno

En **Variables** del servicio, añadir:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PONDER_RPC_URL_84532` | `https://sepolia.base.org` | RPC de Base Sepolia |

> **Nota:** Para producción (Base Mainnet), usar `PONDER_RPC_URL_8453` con un RPC privado de Alchemy/Infura.

### 5. Deploy

1. Click **Deploy**
2. Esperar a que el build termine (~2-3 min)
3. El indexer empezará a sincronizar desde el bloque inicial

## URLs generadas

Railway asigna una URL pública automáticamente:

```
https://<proyecto>-production.up.railway.app
```

### Endpoints disponibles

| Endpoint | Descripción |
|----------|-------------|
| `/graphql` | API GraphQL para queries |
| `/health` | Health check |

### Ejemplo de query

```bash
curl -X POST https://tu-url.railway.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users { items { address totalPoints currentStreak } } }"}'
```

## Actualizar Frontend

Después del deploy, actualizar el frontend para usar la URL de Railway:

### 1. Añadir variable de entorno en Netlify

```
VITE_INDEXER_URL=https://tu-url.railway.app
```

### 2. O actualizar el hook directamente

```typescript
// packages/web/src/hooks/useLeaderboard.ts
const INDEXER_URL = import.meta.env.VITE_INDEXER_URL || 'http://localhost:42069'
```

## Monitoreo

### Logs

En Railway dashboard → Servicio → **Logs**

### Métricas

Railway muestra CPU, memoria y red en tiempo real.

### Sync Progress

Los logs mostrarán el progreso del sync:

```
INFO  sync  historical (45.2%) block 34150000
```

## Costes

| Recurso | Coste estimado |
|---------|----------------|
| Servicio (indexer) | ~$5/mes |
| PostgreSQL | ~$5/mes |
| **Total** | ~$10/mes |

Railway ofrece $5 de crédito gratis mensual.

## Troubleshooting

### Error: Database connection failed

- Verificar que PostgreSQL está añadido al proyecto
- Verificar que `DATABASE_URL` está en las variables

### Error: RPC rate limited

- El RPC público tiene límites
- Solución: Usar RPC privado (Alchemy/Infura)

### Sync muy lento

- El RPC público es lento (~2-3 horas para sync completo)
- Con RPC privado: ~15-30 minutos

## Migración a Producción

Cuando migres a Base Mainnet:

1. Desplegar nuevo contrato en Base Mainnet
2. Actualizar `ponder.config.ts`:
   - `chainId: 8453`
   - Nueva dirección de contrato
   - Nuevo `startBlock`
3. Añadir variable `PONDER_RPC_URL_8453` con RPC de mainnet
4. Re-deploy en Railway

## Referencias

- [Ponder Docs - Deploy](https://ponder.sh/docs/production/deploy)
- [Railway Docs](https://docs.railway.app/)
- [Base Sepolia RPC](https://docs.base.org/network-information)
