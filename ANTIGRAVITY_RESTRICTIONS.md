Este documento es vital para trabajar con IAs. A menudo, los modelos tienden a "alucinar" soluciones fáciles (como guardar texto plano) o usar patrones antiguos. Este archivo actúa como un **cortafuegos** para evitar errores costosos.

Guárdalo como `ANTIGRAVITY_RESTRICTIONS.md` junto al plan maestro.

***

# ⛔ ANTIGRAVITY_RESTRICTIONS.md

**Project:** Journy
**Status:** Strict Enforcement
**Purpose:** Define límites operativos, anti-patrones y prácticas prohibidas para el desarrollo de este proyecto.

---

## 1. 🚫 SEGURIDAD Y PRIVACIDAD (CRÍTICO)

*   **PROHIBIDO:** Enviar o guardar texto plano (contenido del diario) a IPFS, Servidores o Blockchain.
    *   *Consecuencia:* Ruptura total de la promesa de privacidad del producto.
    *   **CORRECTO:** Todo contenido debe pasar por `EncryptionService` (AES-GCM) en el cliente antes de salir del navegador.
*   **PROHIBIDO:** Almacenar claves de desencriptación en bases de datos o localStorage permanente sin protección.
    *   **CORRECTO:** Las claves deben derivarse efímeramente de la firma de la wallet o guardarse en sesión encriptada.
*   **PROHIBIDO:** Usar librerías de criptografía de Node.js (`crypto`, `buffer`) en el frontend directamente.
    *   **CORRECTO:** Usar Web Crypto API nativa del navegador (`window.crypto.subtle`) para compatibilidad total con MiniApps móviles.

---

## 2. 🚫 SMART CONTRACTS & GAS (BASE NETWORK)

*   **PROHIBIDO:** Guardar el contenido del texto (string) en variables de estado (`storage`) del contrato.
    *   *Consecuencia:* Costes de gas insostenibles.
    *   **CORRECTO:** Guardar solo el **CID de IPFS** (string corto o bytes32) y emitir el resto en **Eventos** (`emit EntryLogged`).
*   **PROHIBIDO:** Iterar arrays o mappings ilimitados dentro de una función de escritura (`for i in userEntries`).
    *   *Consecuencia:* Error "Out of Gas" cuando el usuario tenga muchas entradas.
    *   **CORRECTO:** Usar indexación off-chain (The Graph) o leer arrays solo en funciones `view` (gratis).
*   **PROHIBIDO:** Hardcodear direcciones de contratos sin variables de entorno.
    *   **CORRECTO:** Usar `import.meta.env.VITE_CONTRACT_ADDRESS`.

---

## 3. 🚫 INTEGRACIÓN CLANKER (DEFI)

*   **PROHIBIDO:** Usar una `privateKey` en el backend o en el código para desplegar los tokens de los usuarios.
    *   *Consecuencia:* Centralización, riesgo de seguridad y problemas legales.
    *   **CORRECTO:** Instanciar el SDK de Clanker inyectando el `WalletClient` (provider) del usuario conectado (`window.ethereum` / Coinbase Wallet SDK). El usuario firma, el usuario paga, el usuario es dueño.
*   **PROHIBIDO:** Permitir el despliegue de tokens a usuarios sin historial (`streak < 30`).
    *   *Consecuencia:* Spam de tokens basura que destruye la reputación de Journy.
    *   **CORRECTO:** El botón de despliegue debe estar deshabilitado (disabled) y validado contra el contrato `MemoryLog` antes de mostrarse.
*   **PROHIBIDO:** Ignorar los parámetros de `locking` o `vesting`.
    *   **CORRECTO:** Por defecto, forzar o sugerir fuertemente un bloqueo de liquidez (Vault) para dar legitimidad al "Token de Autor".

---

## 4. 🚫 UI/UX (MINIAPPS CONTEXT)

*   **PROHIBIDO:** Diseñar Desktop-First.
    *   *Consecuencia:* La app se verá rota en el móvil, donde vive Farcaster.
    *   **CORRECTO:** **Mobile-First**. Usar anchos relativos (`w-full`, `max-w-md`), botones grandes para dedos (min 44px height) y evitar hovers que no funcionan en táctil.
*   **PROHIBIDO:** Bloquear la UI sin feedback durante una transacción.
    *   **CORRECTO:** Mostrar siempre un `LoadingSpinner` o `Toast` con el estado: "Encriptando...", "Subiendo a IPFS...", "Confirmando en Base...".
*   **PROHIBIDO:** Asumir que el usuario tiene ETH.
    *   **CORRECTO:** Verificar balance antes de iniciar transacción y mostrar error amigable: "Necesitas unos céntimos de ETH en Base para guardar tu recuerdo".

---

## 5. 🚫 CÓDIGO Y ARQUITECTURA (ANTIGRAVITY AI)

*   **PROHIBIDO:** Cambiar el stack tecnológico arbitrariamente.
    *   *Ejemplo:* No intentes instalar `ethers.js` si ya estamos usando `viem`. No cambies `Vite` por `Next.js` a mitad de camino.
*   **PROHIBIDO:** Crear componentes "God Object" (ej. un `App.tsx` de 500 líneas).
    *   **CORRECTO:** Modularizar: `components/ui`, `features/journal`, `features/clanker`.
*   **PROHIBIDO:** Alucinar importaciones.
    *   **CORRECTO:** Verifica que la librería existe en `package.json` antes de importarla. Si necesitas una nueva (ej. `framer-motion`), pide permiso para instalarla primero.

---

### ⚠️ INSTRUCCIÓN DE CONTROL PARA LA IA

Si te pido una tarea que viole alguna de estas reglas, **DETENTE**.
Responde: *"⛔ [NOMBRE DE LA REGLA VIOLADA]: No puedo proceder con esa solicitud porque compromete la [Seguridad/UX/Arquitectura] del proyecto Journy. Sugiero hacerlo de esta manera: [SOLUCIÓN ALTERNATIVA PERMITIDA]."*

***

### Cómo usar este archivo junto con el Master Plan

Cuando inicies una sesión en Antigravity, tu prompt inicial debe ser:

> "Estás trabajando en el proyecto **Journy**. Lee `ANTIGRAVITY_MASTER_PLAN.md` para saber qué hacer y `ANTIGRAVITY_RESTRICTIONS.md` para saber qué **NO** hacer. Confirma que has entendido las restricciones de seguridad y privacidad antes de escribir una sola línea de código."

Esto crea un entorno de desarrollo blindado.