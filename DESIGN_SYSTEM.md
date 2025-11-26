# 🎨 DESIGN_SYSTEM.md

**Aesthetic:** "Digital Zen", "Crypto Native", "Clean Hacker".
**Vibe:** Una fusión entre la calma de un editor minimalista y la sofisticación de la criptografía moderna.

## 1. Filosofía Visual
*   **Monospace Everything:** Usamos una única fuente monoespaciada para todo. Transmite precisión, código y crudeza.
*   **Sharp Edges:** Sin bordes redondeados (`border-radius: 0`). Todo es rectangular, preciso y digital.
*   **Zen Unfold:** Las transiciones no son cortes secos; son expansiones fluidas. Abrir un recuerdo es como desplegar un mapa.
*   **Digital Decode:** El texto no aparece, se "decodifica". La privacidad es parte de la experiencia visual.

## 2. Tipografía
*   **Font Family:** `JetBrains Mono` (Google Fonts).
*   **Styles:**
    *   **Headings:** Uppercase, Bold, Tracking-Tighter.
    *   **Labels:** Uppercase, Tracking-Widest, Small text.
    *   **Body:** Regular, Leading-Relaxed.

## 3. Paleta de Colores
### Brand (Electric Purple)
El color de la magia y la criptografía.
*   **Primary:** `#6716e9` (Brand-600) - Usado para acentos, bordes activos y botones principales.
*   **Hover:** `#5b13c7` (Brand-700).

### Surface (Clean Slate)
*   **Background:** `#f7f9fc` (Surface-Default) - Un blanco roto, casi papel digital.
*   **Card Background:** `#ffffff` (White) - Para elevar contenido.
*   **Dark Surface:** `#e9e3ff` (Surface-Dark) - Para elementos secundarios o estados hover.

### Text (High Contrast)
*   **Primary:** `#0f131e` (Casi negro) - Lectura nítida.
*   **Secondary:** `#6716e9` (Púrpura) - Datos técnicos, metadatos.
*   **Muted:** Opacidad 40% o 60% sobre Primary - Para etiquetas y fechas.

## 4. Componentes Core

### The Card (Memoria)
*   Borde sutil (`border-text-primary/10`).
*   Hover: Borde púrpura (`border-brand-600`) + Sombra suave.
*   Interacción: `layoutId` de Framer Motion para expansión fluida.

### The Button
*   Rectangular, sin redondez.
*   Texto Uppercase + Tracking Widest.
*   **Primary:** Fondo oscuro (`surface-dark`), Borde púrpura, Texto púrpura. Hover: Fondo púrpura, Texto blanco.
*   **Ghost:** Solo texto, hover cambia a color Brand.

### The Editor
*   Minimalista.
*   Sin bordes visibles en estado de reposo.
*   Focus: Borde púrpura brillante.
*   Placeholder: "START WRITING..."

## 5. Animaciones (The Magic)
*   **Scramble Text:** Efecto "Matrix" sutil al cargar contenido desencriptado.
*   **Zen Unfold:** Transición de lista a detalle sin cortes.
*   **Blur-In:** Elementos secundarios entran con opacidad y desenfoque.

## 6. Iconografía
*   Minimalista o inexistente. Preferimos texto (`← WRITE`, `CLOSE [X]`) sobre iconos abstractos.