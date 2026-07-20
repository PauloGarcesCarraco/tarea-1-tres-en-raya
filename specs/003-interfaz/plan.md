# Plan Técnico 003: Interfaz Gráfica y Gestión de Estado (UI/DOM)

## 1. Módulo y Responsabilidades
- **Archivos Target:** 
  - `index.html`: Estructura semántica del tablero, controles de configuración y paneles de estado.
  - `src/style.css`: Estilos visuales, diseño responsivo (CSS Grid/Flexbox), transiciones y resaltado de victoria.
  - `src/ui.js`: Controlador de interfaz (Presentational Layer) que maneja eventos del DOM, temporización del agente IA y renderizado del estado.
  - `src/main.js`: Punto de entrada (Entry point) de Vite que inicializa la aplicación.
- **Responsabilidad:** Conectar el motor de juego (`engine.js`) y la IA (`agents.js`) con el navegador, capturando interacciones del usuario y reflejando visualmente el estado del juego sin contener lógica de reglas de negocio.

---

## 2. Arquitectura de Presentación (Unidirectional Data Flow)

### Flujo de Estado
1. **Acción de Usuario:** Click en una celda del tablero o en un control de configuración.
2. **Actualización de Estado:** El controlador de UI llama a `makeMove(...)`, `movePiece(...)` o `createGame(...)` en el motor.
3. **Pausa Artificial (Modo vs IA):** Si el turno resultante pertenece a la IA, se introduce un retardo visual (`setTimeout` de ~300ms a 500ms) para que el movimiento del computador se sienta natural para el ser humano, llamando luego a `getBestMove(...)`.
4. **Renderizado Determinista:** La función central `render(state, uiState)` repinta el DOM basándose *únicamente* en el objeto de estado recibido.

### Gestión de Movimiento en Modalidad Continua
- **Problema:** En fase `MOVEMENT`, el jugador debe seleccionar primero qué ficha mover (origen) y luego a dónde moverla (destino).
- **Solución (UI State):** El módulo `src/ui.js` mantendrá un estado temporal de presentación: `selectedCell: number | null`.
  - **1er Click (sobre ficha propia):** Fija `selectedCell = index` y aplica una clase CSS de resaltado visual (`.selected`).
  - **2do Click (sobre celda vacía):** Ejecuta `movePiece(state, selectedCell, targetIndex)`, limpia `selectedCell` y gatilla el renderizado.

---

## 3. Contratos de Elementos y Selección DOM

### Elementos Clave del DOM (`index.html`)
- **Controles de Configuración:**
  - `#game-mode`: Selector (Clásico | Continuo).
  - `#opponent-type`: Selector (Humano vs Humano | Humano vs IA).
  - `#ai-difficulty`: Selector (Sencillo | Medio | Complejo).
  - `#btn-restart`: Botón de nueva partida.
- **Tablero y Celdas:**
  - `#board`: Contenedor Grid 3x3.
  - `.cell[data-index="0..8"]`: Celdas individuales interactivas.
- **Paneles de Información:**
  - `#turn-indicator`: Muestra el turno actual ('X' u 'O') y la fase ('Colocación' o 'Movimiento').
  - `#status-message`: Mensaje dinámico de victoria, empate o error temporal.

---

## 4. Criterios de Aceptación Cubiertos (CA-U-01..CA-U-06)
- **CA-U-01:** Renderizado preciso del tablero Grid 3x3 reflejando el array `board` del estado.
- **CA-U-02:** Cambio dinámico de modalidad entre Clásico y Continuo con reinicio de estado.
- **CA-U-03:** Soporte para partidas PvP (Local) y PvE (IA) respetando el nivel de dificultad seleccionado.
- **CA-U-04:** Indicación visual clara del jugador activo (`turn`) y transición visual al entrar en fase de movimiento (`phase === MOVEMENT`).
- **CA-U-05:** Resaltado visual del ganador (`winner`) y pintado de la línea de victoria (`winningLine`) con estilos CSS distintivos al finalizar (`phase === FINISHED`).
- **CA-U-06:** Prevención de interacciones ilegales (bloqueo de clicks durante el turno de la IA o tras el fin de la partida).

---

## 5. Estrategia de Pruebas y Validación TDD
Dado que el entorno de desarrollo es Vite + Vitest en Vanilla JS, las pruebas en `tests/ui.test.js` simularán interacciones del controlador utilizando JSDOM (integrado en Vitest) para verificar:
1. Inicialización correcta del estado visual y renderizado inicial del tablero vacío.
2. Cambio de texto en el indicador de turnos al alternar jugadas.
3. Asignación correcta de la propiedad `selectedCell` durante la fase de movimiento en modo continuo.
4. Activación de la bandera de bloqueo de UI mientras la IA calcula su turno.
