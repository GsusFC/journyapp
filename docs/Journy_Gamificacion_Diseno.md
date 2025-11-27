# **Journy**

Sistema de Gamificación y Competitividad

Documento de Diseño Técnico v1.0 — Noviembre 2025

# **1\. Resumen Ejecutivo**

Journy es una aplicación de journaling personal con almacenamiento encriptado en IPFS y registro on-chain en Base. Este documento define el sistema de gamificación que añade una capa de competitividad social opt-in, respetando la privacidad del contenido mientras aprovecha los datos públicos on-chain (streaks, número de entradas) para crear leaderboards y rewards.

**Principios fundamentales:**

* Opt-in: Solo los usuarios que lo deseen participan en el sistema competitivo  
* Privacidad: El contenido de las entradas permanece encriptado y privado  
* Farcaster-native: Integración profunda con perfiles, Frames y notificaciones  
* Arquitectura híbrida: On-chain para datos inmutables, off-chain para cálculos y rankings

# **2\. Decisión Arquitectónica**

## **2.1 El Dilema: ¿Dónde viven los puntos?**

Se evaluaron tres opciones para el almacenamiento y cálculo del sistema de puntos:

| Opción | Pros | Contras |
| ----- | ----- | ----- |
| **100% On-chain** | Transparente, trustless | Gas costoso ($1,500-6,000/mes con 1K usuarios), cálculos limitados |
| **100% Off-chain** | Flexible, barato, tiempo real | Requiere backend, menos "puro" |
| **Híbrido ✓** | Lo mejor de ambos mundos | Mayor complejidad inicial |

## **2.2 Decisión: Arquitectura Híbrida**

**On-chain (Base):**

* Streak, entries, timestamps (ya existe en JournyLog)  
* Opt-in flag para participar en leaderboard  
* Badges como flags o SBTs (logros inmutables)  
* Claim de rewards $JOURNY (verificable)

**Off-chain (Indexer):**

* Cálculo de puntos con fórmula dinámica  
* Rankings y leaderboards (all-time, semanal, mensual)  
* Challenges temporales  
* Notificaciones y lógica de juego

# **3\. Stack Tecnológico**

## **3.1 Indexer: Ponder**

Ponder es el indexer elegido por las siguientes razones:

1. **TypeScript nativo:** A diferencia de The Graph (AssemblyScript), Ponder es puro TypeScript  
2. **Monorepo friendly:** Se integra como packages/indexer en la estructura existente  
3. **Velocidad local:** Desarrollo rápido sin esperar syncs como en The Graph  
4. **Base de datos SQL:** Queries complejas para leaderboards temporales

## **3.2 Capa Social: Neynar**

Neynar proporciona la API de Farcaster necesaria para:

* Resolución de FID → username, avatar, bio  
* Envío de notificaciones a usuarios  
* Publicación de Frames para compartir logros  
* Acceso al social graph para features futuras

## **3.3 Estructura del Monorepo**

journy/packages/

* **contract/** — La Verdad (Blockchain, Hardhat \+ Solidity)  
* **web/** — La Cara (UI, React \+ Vite)  
* **indexer/** — El Cerebro (Ponder, nuevo)

# **4\. Sistema de Puntos**

## **4.1 Fórmula Base**

**PUNTOS \= BASE × MULT\_STREAK × MULT\_BONUS**

Donde:

* **BASE \= 10** puntos por cada entrada escrita  
* **MULT\_STREAK \= 1 \+ (streak / 10\)** — Recompensa rachas largas  
* **MULT\_BONUS** \= Multiplicadores adicionales por logros

## **4.2 Tabla de Multiplicador por Streak**

| Streak | Base | Multiplicador | Puntos/Entrada |
| :---: | :---: | :---: | :---: |
| 1 día | 10 | 1.1x | 11 |
| 7 días | 10 | 1.7x | 17 |
| 30 días | 10 | 4.0x | 40 |
| 100 días | 10 | 11.0x | 110 |

## **4.3 Multiplicadores Bonus**

| Condición | Bonus | Duración |
| ----- | :---: | :---: |
| Fue líder semanal la semana anterior | \+0.5x | 1 semana |
| Fue líder mensual el mes anterior | \+1.0x | 1 mes |
| Challenge activo completado | \+0.25x | Por challenge |
| Acumulado de liderazgos semanales (5+) | \+0.1x por c/u | Permanente |

# **5\. Sistema de Leaderboards**

## **5.1 Tipos de Leaderboard**

| Tipo | Reset | Beneficio del Líder |
| ----- | ----- | ----- |
| **Semanal** | Lunes 00:00 UTC | \+0.5x mult. siguiente semana |
| **Mensual** | Día 1 00:00 UTC | \+1.0x mult. siguiente mes |
| **All-Time** | Nunca | Reconocimiento y badges especiales |

## **5.2 Flujo de Datos del Leaderboard**

1. Usuario escribe entrada → Evento EntryLogged emitido on-chain  
2. Ponder detecta el evento → Calcula puntos con fórmula → Actualiza DB  
3. Frontend pide a Ponder: "top 10 semanal" (query GraphQL)  
4. Frontend pide a Neynar: "dame username/avatar para estas addresses"  
5. UI muestra leaderboard con perfiles de Farcaster

# **6\. Badges y Achievements**

## **6.1 Badges por Streak (Milestones)**

| Streak | Badge | Reward $JOURNY | Beneficio Extra |
| :---: | ----- | :---: | ----- |
| 7 días | Week Warrior | 100 | Badge visible en perfil |
| 14 días | Fortnight Writer | 500 | Badge \+ ¿Feature especial? |
| 30 días | Monthly Master | 2,000 | Clanker eligible |
| 90 días | Quarterly Quest | 10,000 | Badge \+ ¿Premium? |
| 365 días | Year of Reflection | 100,000 | Badge \+ Lifetime status |

## **6.2 Badges de Liderazgo**

* **Weekly Champion:** Terminó \#1 en leaderboard semanal  
* **Monthly Champion:** Terminó \#1 en leaderboard mensual  
* **Dominant Force:** 5 victorias semanales acumuladas  
* **Legend:** 3 victorias mensuales acumuladas

# **7\. Integración con Farcaster**

## **7.1 Farcaster Frames**

Los usuarios podrán compartir logros como Frames interactivos en su feed:

* Alcancé X días de streak en @journy  
* Desbloqueé el badge \[Badge Name\]  
* Soy el líder semanal en @journy  
* Frame con botón "Start your journey" para nuevos usuarios

## **7.2 Sistema de Notificaciones**

Via Mini App SDK y Neynar, se enviarán notificaciones para:

* **Competitivas:** "@usuario te ha superado en el ranking"  
* **Logros:** "¡Has desbloqueado Week Warrior\! Reclama tu reward"  
* **Challenges:** "Nuevo challenge disponible: Escribe 3 días seguidos"  
* **Retención:** "Tu racha está en riesgo, ¡escribe hoy\!"  
* **Liderazgo:** "Eres el nuevo líder semanal"

## **7.3 Perfil de Usuario**

Los datos del perfil se obtienen de Farcaster via Neynar:

* Username y avatar del perfil de Farcaster  
* FID para identificación única  
* Badges de Journy mostrados junto al perfil

# **8\. Arquitectura Técnica Completa**

## **8.1 Diagrama de Componentes**

**Capa Farcaster:**

* Neynar API → Perfiles, FIDs, notificaciones  
* Mini App SDK → Contexto de usuario, ready()  
* Frames → Compartir logros en feed

**Capa Frontend (packages/web):**

* React \+ Vite \+ TailwindCSS  
* Wagmi para conexión de wallet  
* Queries a Ponder (GraphQL) \+ Neynar (REST)

**Capa Indexer (packages/indexer):**

* Ponder (TypeScript)  
* Escucha eventos de JournyLog  
* Calcula puntos y mantiene leaderboards  
* Base de datos SQL para queries complejas

**Capa Blockchain (packages/contract):**

* JournyLog → Entries, streaks, timestamps  
* JournyRewards → Claims de tokens por milestones  
* $JOURNY Token → ERC-20 via Clanker

## **8.2 Contrato Desplegado**

| Red | Base Sepolia (Chain ID: 84532\) |
| :---- | :---- |
| **Dirección** | 0xf5FeFabd1B0Ad49a0DE92B7c04FBa3518083Dc64 |
| **Evento clave** | EntryLogged(user, cid, timestamp, streak) |

# **9\. Fases de Implementación**

## **Fase 1: Infraestructura del Indexer**

1. Crear packages/indexer con Ponder  
2. Configurar escucha de eventos EntryLogged  
3. Implementar schema: User, Entry, LeaderboardEntry  
4. Implementar cálculo de puntos con fórmula base

## **Fase 2: Leaderboards Básicos**

5. Implementar leaderboard all-time  
6. Añadir leaderboards temporales (semanal, mensual)  
7. Crear UI de leaderboard en frontend  
8. Integrar Neynar para mostrar perfiles de Farcaster

## **Fase 3: Sistema de Opt-in y Badges**

9. Añadir flag de opt-in al contrato o indexer  
10. Implementar sistema de badges en el indexer  
11. Crear UI de perfil con badges  
12. Implementar multiplicadores bonus

## **Fase 4: Farcaster Deep Integration**

13. Implementar Frames para compartir logros  
14. Configurar notificaciones via Mini App SDK  
15. Notificaciones competitivas ("te han superado")  
16. Notificaciones de retención ("racha en riesgo")

## **Fase 5: Challenges y Gamificación Avanzada**

17. Sistema de challenges temporales  
18. Notificaciones push para nuevos challenges  
19. Integración completa con $JOURNY rewards  
20. Refinamiento de fórmula basado en datos reales

# **10\. Decisiones Pendientes**

21. **Curva de multiplicador:** ¿1 \+ (streak/10) es la curva correcta o debería ser logarítmica?  
22. **Badges como SBTs:** ¿On-chain (más inmutable) o off-chain (más flexible)?  
23. **Rewards exactos:** ¿Las cantidades de $JOURNY propuestas son correctas?  
24. **Features de 14 días:** ¿Qué feature especial desbloquea el badge Fortnight?  
25. **Hosting de Ponder:** ¿Self-hosted o servicio managed?  
26. **Frecuencia de snapshots:** ¿Cómo manejar el cambio de semana/mes para leaderboards?

—  
*Documento generado el 27 de Noviembre de 2025*