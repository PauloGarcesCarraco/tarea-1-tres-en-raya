# Spec 002: Agentes de Juego (Inteligencia Artificial)

## Resumen
Especificación funcional del módulo de agentes de IA para el juego Tres en Raya. Define tres niveles de dificultad distinguibles por su capacidad de resolución y memoria: Sencillo (aleatorio), Medio (heurístico ganar/bloquear) y Complejo (óptimo con Minimax y memoización).

---

## User Stories

### US-A-01: Agente Sencillo (Sin Memoria)
**Como** jugador principiante, **quiero** enfrentarme a un agente que elija jugadas al azar, **para** aprender las reglas básicas del juego sin sentir presión táctica.

### US-A-02: Agente Medio (Heurístico)
**Como** jugador intermedio, **quiero** un agente que reconozca oportunidades inmediatas de victoria y bloqueo, **para** un desafío táctico razonable en partidas casuales.

### US-A-03: Agente Complejo (Invensible con Memoria)
**Como** jugador experimentado, **quiero** enfrentar a un agente perfecto que aplique teoría de juegos y recuerde posiciones de la sesión, **para** tener la certeza de que nunca podré vencerlo en modalidad clásica.

---

## Criterios de Aceptación (Notación EARS)

### Nivel 1: Agente Sencillo
* **CA-A-01 (Selección Aleatoria):** `WHEN` es el turno del agente sencillo, `EL SISTEMA SHALL` seleccionar una jugada legal disponible con probabilidad uniforme.
* **CA-A-02 (Sin Memoria):** `EL SISTEMA SHALL` calcular cada decisión del agente sencillo sin consultar o almacenar información de turnos ni partidas anteriores.

### Nivel 2: Agente Medio
* **CA-A-03 (Prioridad de Victoria Inmediata):** `WHEN` el agente medio detecte que puede alinear tres fichas en su turno actual, `EL SISTEMA SHALL` seleccionar la casilla ganadora de forma prioritaria.
* **CA-A-04 (Bloqueo de Amenaza Inmediata):** `IF` el rival puede completar tres en línea (fila, columna o diagonal) en su siguiente turno, `THEN EL SISTEMA SHALL` seleccionar esa casilla para bloquear la victoria, salvo que aplique CA-A-03.
* **CA-A-05 (Heurística Secundaria):** `WHERE` no existan jugadas de victoria ni bloqueo inmediato, `EL SISTEMA SHALL` priorizar la ocupación del centro (casilla 4) y secundariamente las esquinas disponibles.

### Nivel 3: Agente Complejo
* **CA-A-06 (Juego Óptimo - Minimax):** `WHEN` el agente complejo evalúe una posición de tablero en modalidad clásica, `EL SISTEMA SHALL` aplicar el algoritmo Minimax (con poda α-β) para garantizar que nunca pierda la partida.
* **CA-A-07 (Memoria Persistente de Sesión):** `WHEN` el agente complejo enfrente una posición de tablero que ya fue resuelta en una partida previa de la misma sesión, `EL SISTEMA SHALL` retornar la jugada óptima desde su tabla de memoización en lugar de recalcular el árbol.

### Tiempos de Respuesta y Distinguibilidad
* **CA-A-08 (Límite de Latencia):** `WHEN` corresponda el turno a cualquier nivel de agente (Sencillo, Medio o Complejo), `EL SISTEMA SHALL` entregar la jugada calculada en un tiempo menor a 1000 milisegundos (1 segundo).
* **CA-A-09 (Distinguibilidad Estadísticas):** `WHERE` el agente sencillo y el complejo jueguen 100 partidas clásicas entre sí, `EL SISTEMA SHALL` garantizar que el agente complejo gane la mayoría y no pierda ninguna.

---

## Fuera de Alcance (Out of Scope)
* Modelos de aprendizaje por refuerzo profundo o redes neuronales.
* Renderizado de animaciones de pensamiento en la interfaz gráfica.
* Persistencia del árbol de decisiones en servidor externo.
