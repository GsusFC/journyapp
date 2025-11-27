# ANTIGRAVITY_PROMPT_LIBRARY.md

Copia estos bloques para activar funciones específicas en el IDE manteniendo la estética "Sealed".

### 🪄 Hechizo: Inicializar UI (Estilo Zen)
> "Actúa como **The Designer**. Configura `tailwind.config.js` y `index.css`.
> 1. Importa la fuente Serif 'Lora' para el cuerpo de texto y 'Inter' para UI desde Google Fonts.
> 2. Define colores personalizados: `paper-dark` (#09090b) y `ink-light` (#e4e4e7).
> 3. Configura la tipografía base para que cualquier `textarea` use la fuente Serif, tamaño XL y leading-loose. Quiero que se sienta como escribir en un papel de alta calidad en modo oscuro."

### 🪄 Hechizo: Crear Editor de Texto (Componente Principal)
> "Crea el componente `JournalEditor.tsx`.
> **Requisitos de Diseño:**
> - Debe ser un `textarea` que se auto-expanda (autosize).
> - Sin bordes (outline-none), fondo transparente.
> - Centrado en pantalla con `max-w-2xl`.
> - Minimalista: Si el usuario no escribe, la pantalla está casi vacía.
> - Al escribir, muestra sutilmente (fade-in) el botón 'Sellar Entrada' en la parte inferior derecha."

### 🪄 Hechizo: Dashboard de "Legado" (Donde vive Clanker)
> "Crea un componente `LegacyDrawer.tsx` (usando Dialog/Sheet de shadcn o custom).
> **Concepto:** Es el único lugar donde mostramos la complejidad Web3.
> - Debe abrirse con un botón discreto (icono de archivo/bóveda) en la esquina.
> - Dentro: Muestra la racha actual con tipografía elegante (ej: '30 Días de Pensamiento').
> - **Sección Clanker:** Si la racha > 30, muestra una tarjeta minimalista con borde dorado sutil: 'Tu voz tiene valor. [Lanzar Token]'.
> - Mantén el estilo limpio, no parezcas un exchange."

### 🪄 Hechizo: Integración Lógica (Manteniendo la paz)
> "Actúa como **The Integrator**. Conecta el `JournalEditor` con `MemoryLog.sol`.
> **UX Flow:**
> 1. Al pulsar 'Sellar', muestra un icono de carga minimalista (un punto pulsando).
> 2. No lances popups invasivos. Usa 'Toast' notifications pequeñas en la parte inferior: 'Encriptando...', 'Guardado en la eternidad'.
> 3. Al terminar, limpia el editor y da un mensaje de refuerzo positivo suave ('Tu día ha quedado registrado')."

### 🪄 Hechizo: Auditoría de Diseño
> "Revisa la pantalla actual. ¿Hay algún elemento que genere ruido visual?
> - Elimina bordes innecesarios.
> - Aumenta el espaciado (padding/margin) para dar aire.
> - Asegúrate de que la fuente del diario sea Serif y legible.
> - Si hay colores brillantes, cámbialos a la paleta Zinc/Slate."