# QA_TESTING_STRATEGY.md

**Enfoque:** Privacy-First & Mobile-First.

## 1. Pruebas de Criptografía (Críticas)
*   **Prueba de Vectores:**
    *   Input: "Hola Mundo"
    *   Action: Encriptar con Wallet A -> Desencriptar con Wallet A -> Resultado: "Hola Mundo".
    *   Action: Encriptar con Wallet A -> Intentar desencriptar con Wallet B -> Resultado: ERROR/BASURA.
*   **Prueba de Persistencia:** Recargar la página y asegurar que la clave de sesión se recupera o se pide firmar de nuevo correctamente.

## 2. Simulación de Farcaster
*   Usar el debugger de Frames v2.
*   **Mobile Viewport:** Forzar pruebas en resolución 390x844 (iPhone 14). Verificar que los botones de Clanker no se salgan de la pantalla.

## 3. Pruebas de Integración Clanker (Testnet)
*   **Mocking:** Simular que el usuario tiene `streak = 30` (inyectar estado en local) para habilitar el botón.
*   **Flow:**
    1. Llenar formulario (Nombre, Ticker).
    2. Confirmar transacción simulada en Base Sepolia.
    3. Verificar que el SDK devuelve la dirección del token.
    4. Verificar que la UI se actualiza a "Token Desplegado".