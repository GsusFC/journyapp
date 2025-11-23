# SMART_CONTRACT_SPECS.md

**Contract Name:** `JournyLog`
**Network:** Base Mainnet
**Solidity Version:** ^0.8.20

## 1. Estructuras de Datos
*   No usar `struct` complejos para ahorrar gas.
*   **Mapping Principal:** `mapping(address => bytes32[]) userEntries`
    *   Usamos `bytes32` para guardar el hash IPFS (si usamos IPFS hash convertidos) o `string` si queremos simplicidad, pero optimizado.
*   **Mapping Gamificación:**
    *   `lastEntryTimestamp (mapping address => uint32)` (uint32 ahorra espacio, válido hasta el año 2106).
    *   `currentStreak (mapping address => uint16)` (Suficiente para 179 años de racha).

## 2. Funciones Core
### `logEntry(string calldata _cid)`
*   **Validación:** `bytes(_cid).length > 0`.
*   **Lógica de Racha:**
    *   `dt = block.timestamp - lastEntryTimestamp[msg.sender]`
    *   Si `dt < 24h`: Error (o permitir sin incrementar racha).
    *   Si `24h <= dt <= 48h`: `currentStreak++`.
    *   Si `dt > 48h`: `currentStreak = 1`.
*   **Almacenamiento:** Push al array. Actualizar timestamp.
*   **Evento:** `emit EntryLogged(msg.sender, _cid, block.timestamp, currentStreak)`

### `isEligibleForClanker(address _user)`
*   **Tipo:** `view`
*   **Return:** `bool`
*   **Lógica:** Retorna `true` si `currentStreak[_user] >= 30`.

## 3. Seguridad
*   Implementar `ReentrancyGuard` (aunque no manejamos ETH, es buena práctica si expandimos).
*   Implementar `Pausable` (OpenZeppelin) por si descubrimos un bug crítico en la lógica de racha.