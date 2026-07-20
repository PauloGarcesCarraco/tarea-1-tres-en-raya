# Plan Técnico 002: Agentes de Juego (IA Pure Domain)

## 1. Módulo y Responsabilidades
- **Archivo Target:** `src/agents.js`
- **Responsabilidad:** Toma de decisiones automáticas según el nivel de dificultad seleccionado (Sencillo, Medio, Complejo).
- **Restricción de Arquitectura:** Funciones puras que reciben un estado de juego (`GameState`) y retornan el índice numérico (`0..8`) de la jugada elegida o el par de movimiento en modalidad continua. Prohibido el acceso al DOM o dependencias externas.

---

## 2. Estrategia Algorítmica por Nivel

### Nivel 1: Sencillo (`getEasyMove`)
- **Algorithmo:** Selección aleatoria uniforme entre las casillas disponibles (`null`).
- **Complejidad Temporal:** $\mathcal{O}(N)$ donde $N$ es el número de casillas libres.
- **Latencia estimada:** < 1 ms.

### Nivel 2: Medio (`getMediumMove`)
- **Algoritmo (Heurística de 3 pasos):**
  1. **Victoria Inmediata:** Evalúa si alguna jugada legal otorga la victoria al agente en el turno actual.
  2. **Bloqueo Inmediato:** Evalúa si el oponente ganaría en su próximo turno si ocupara una casilla libre; de ser así, la bloquea.
  3. **Heurística de Posición:** Si no hay victoria ni bloqueo, prioriza el centro (índice 4), luego esquinas (0, 2, 6, 8) y finalmente bordes.
- **Complejidad Temporal:** $\mathcal{O}(N \times M)$ (evaluación local de jugadas inmediatas).
- **Latencia estimada:** < 5 ms.

### Nivel 3: Complejo (`getHardMove` con Minimax + Memoización)
- **Algoritmo:** Búsqueda exhaustiva del árbol de juego mediante **Minimax con Poda Alfa-Beta**, garantizando la jugada óptima (teoría de juegos: el agente nunca pierde en modalidad clásica).
- **Estrategia de Memoización (Cache):** 
  - Se implementará un `Map` (o estructura caché en memoria de sesión) donde la clave será la serialización del tablero (p. ej., `'X,O,null,...|turn'`) y el valor será el índice óptimo calculado.
  - Al consultar una posición ya evaluada, la función retorna el resultado en $\mathcal{O}(1)$.
- **Complejidad Temporal:** Sin caché: $\mathcal{O}(b^d)$ (donde en Tic-Tac-Toe el espacio de estados es minúsculo, ~5,478 estados únicos). Con caché: $\mathcal{O}(1)$ en posiciones repetidas.
- **Latencia estimada:** < 20 ms en el primer cálculo; < 1 ms en posiciones memoizadas (cumple holgadamente el límite estricto de 1000 ms).

---

## 3. Contratos de Funciones Puras (API de Agentes)

### `getBestMove(state, difficulty)`
- **Descripción:** Función fachada (Facade) que enruta la decisión según la dificultad.
- **Entrada:** 
  - `state`: Objeto `GameState` actual.
  - `difficulty`: String ('EASY' | 'MEDIUM' | 'HARD').
- **Salida:** `number` (índice de 0 a 8 para colocación) o `{ from: number, to: number }` (para fase de movimiento en continua).
- **Criterios Cumplidos:** CA-A-01 al CA-A-08.

### `clearAIMemory()`
- **Descripción:** Limpia la tabla de memoización (útil para reiniciar sesiones o pruebas unitarias).
- **Criterios Cumplidos:** Soporte para CA-A-07.

---

## 4. Estrategia TDD (Gate P3)
Los tests en `tests/agents.test.js` verificarán el comportamiento observable:
1. **CA-A-01 / CA-A-02:** Verificar que el agente sencillo escoja casillas válidas y no modifique el estado.
2. **CA-A-03:** Verificar que el agente medio elija la casilla ganadora cuando tenga 2 en línea.
3. **CA-A-04:** Verificar que el agente medio bloquee al rival cuando este tenga 2 en línea.
4. **CA-A-06 / CA-A-09:** Simular partidas automáticas entre Agente Complejo vs Sencillo/Medio y asertar que el Complejo tiene 0 derrotas.
5. **CA-A-07:** Verificar que una misma posición consultada dos veces ejecute más rápido o consulte el caché en la segunda llamada.
6. **CA-A-08:** Medir con `performance.now()` que la ejecución de `getBestMove` en nivel HARD tome menos de 1000 ms.
