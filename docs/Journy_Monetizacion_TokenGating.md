# Journy - Monetización via Token-Gating

## Modelo

**Freemium con desbloqueo por holding de $JOURNY token.**

El usuario no paga suscripción. Simplemente holdea tokens en su wallet y las features se desbloquean automáticamente según su balance.

## Decisiones Técnicas

| Aspecto | Decisión | Razón |
|---------|----------|-------|
| Token | $JOURNY | Token nativo de la app (via Clanker cuando streak ≥ 30) |
| Red | Base Mainnet | Producción, bajos fees, ecosistema Farcaster |
| Lectura | Real-time | Mejor UX, balance actualizado al instante |
| Requisito | Hold simple | Sin staking, sin lock, máxima liquidez para el usuario |
| Wallet | Farcaster Wallet | Integración nativa con Mini Apps |

## Tiers por Balance

| Balance $JOURNY | Tier | Features Desbloqueadas |
|-----------------|------|------------------------|
| 0 | **Free** | Escritura básica, 1 fuente (Mono), tema light |
| 100+ | **Writer** | +Fuentes (Sans, Serif), +Dark mode |
| 500+ | **Pro** | +Export (JSON/MD), +Búsqueda en historial |
| 1000+ | **Legend** | +Leaderboard, +Badges, +Features futuras |

> Los números son placeholder. Ajustar según tokenomics y precio de mercado.

## Features por Tier

### Free (0 tokens)
- ✅ Escribir entradas ilimitadas
- ✅ Historial básico (scroll infinito)
- ✅ Encriptación client-side
- ✅ Almacenamiento IPFS + on-chain
- ✅ Streak tracking
- ❌ Solo fuente Mono
- ❌ Solo tema Light

### Writer (100+ tokens)
- ✅ Todo lo de Free
- ✅ 3 fuentes: Mono, Sans (Instrument Sans), Serif (Instrument Serif)
- ✅ Temas: Light + Dark
- ✅ Preferencias de editor (tamaño, line-height)

### Pro (500+ tokens)
- ✅ Todo lo de Writer
- ✅ Export a JSON
- ✅ Export a Markdown
- ✅ Búsqueda en historial
- ✅ Filtros por fecha

### Legend (1000+ tokens)
- ✅ Todo lo de Pro
- ✅ Acceso al Leaderboard
- ✅ Sistema de Badges
- ✅ Estadísticas avanzadas
- ✅ Acceso anticipado a nuevas features
- ✅ Soporte prioritario

## Implementación Técnica

### 1. Leer balance del token

```typescript
// hooks/useJournyBalance.ts
import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'

const JOURNY_TOKEN_ADDRESS = '0x...' // Base Mainnet

export function useJournyBalance() {
  const { address } = useAccount()
  
  const { data: balance } = useReadContract({
    address: JOURNY_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    chainId: 8453, // Base Mainnet
  })
  
  // Convertir de wei a tokens (asumiendo 18 decimales)
  return balance ? Number(balance) / 1e18 : 0
}
```

### 2. Determinar tier del usuario

```typescript
// hooks/usePremiumTier.ts
import { useJournyBalance } from './useJournyBalance'

export type PremiumTier = 'free' | 'writer' | 'pro' | 'legend'

const TIER_THRESHOLDS = {
  legend: 1000,
  pro: 500,
  writer: 100,
  free: 0,
} as const

export function usePremiumTier(): PremiumTier {
  const balance = useJournyBalance()
  
  if (balance >= TIER_THRESHOLDS.legend) return 'legend'
  if (balance >= TIER_THRESHOLDS.pro) return 'pro'
  if (balance >= TIER_THRESHOLDS.writer) return 'writer'
  return 'free'
}

export function useHasFeature(requiredTier: PremiumTier): boolean {
  const currentTier = usePremiumTier()
  const tierOrder: PremiumTier[] = ['free', 'writer', 'pro', 'legend']
  return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requiredTier)
}
```

### 3. Gating en componentes

```tsx
// Ejemplo: Font selector solo para Writer+
function FontSelector() {
  const hasAccess = useHasFeature('writer')
  
  if (!hasAccess) {
    return (
      <LockedFeature 
        feature="Custom Fonts" 
        requiredTier="writer" 
        requiredTokens={100} 
      />
    )
  }
  
  return <ActualFontSelector />
}
```

### 4. Componente de feature bloqueada

```tsx
// components/LockedFeature.tsx
function LockedFeature({ feature, requiredTier, requiredTokens }) {
  return (
    <div className="opacity-50 pointer-events-none relative">
      <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
        <div className="text-center">
          <span className="text-2xl">🔒</span>
          <p className="font-mono text-xs mt-2">
            Hold {requiredTokens}+ $JOURNY to unlock
          </p>
        </div>
      </div>
      {/* Preview del feature bloqueado */}
    </div>
  )
}
```

## Consideraciones

### Rate Limiting
- Real-time significa llamadas frecuentes al RPC
- Usar `staleTime` en React Query para cachear (ej: 30 segundos)
- Si hay problemas, fallback a polling cada X minutos

### UX de Desbloqueo
- Mostrar balance actual del usuario en System
- Indicar cuánto falta para el siguiente tier
- Animación de "unlock" cuando sube de tier

### Edge Cases
- Usuario vende tokens → Features se bloquean inmediatamente
- Usuario compra tokens → Features se desbloquean en siguiente refresh
- Sin wallet conectada → Tier Free por defecto

## Integración con Farcaster Mini App

La wallet de Farcaster ya está conectada, así que:
1. No hay fricción de conexión
2. El balance se lee directamente
3. El usuario puede comprar $JOURNY desde Warpcast

## Roadmap de Implementación

1. **Fase 1**: Crear hooks `useJournyBalance` y `usePremiumTier` (mock)
2. **Fase 2**: Añadir gating a features existentes (fonts, themes, export)
3. **Fase 3**: Desplegar/obtener token $JOURNY en Base Mainnet
4. **Fase 4**: Conectar hooks con token real
5. **Fase 5**: UI de "upgrade" y visualización de tier

## Notas

- El token $JOURNY se creará via Clanker cuando un usuario alcance 30 días de streak
- Los thresholds de tokens son ajustables según precio de mercado
- Considerar snapshot semanal si real-time causa problemas de performance
