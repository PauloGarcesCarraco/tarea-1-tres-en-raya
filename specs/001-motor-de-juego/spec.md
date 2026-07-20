# Spec 001: Motor de Juego (Tres en Raya)

## Resumen
Especificación funcional del motor de juego puro para la aplicación Tres en Raya. Define el modelo de dominio, gestión de turnos, reglas de victoria, empate y las modalidades clásica (por colocación) y continua (por movimiento con 3 fichas).

---

## User Stories

### US-M-01: Reglas Base y Gestión de Turnos
**Como** jugador, **quiero** que el motor gestione el estado del tablero y alterne los turnos automáticamente, **para** jugar de manera fluida sin arbitrar las reglas a mano.

### US-M-02: Modalidad Clásica (Por Colocación)
**Como** jugador, **quiero** colocar fichas alternadamente en un tablero de 3x3 hasta alinear tres o llenar el tablero, **para** competir bajo las reglas tradicionales de colocación.

### US-M-03: Modalidad Continua (Por Movimiento - 3 Fichas)
**Como** jugador, **quiero** disputar partidas continuas donde cada jugador solo posee 3 fichas y las mueve tras la fase de colocación, **para** garantizar que la partida no termine en empate e incentive la estrategia dinámica.

---

## Decisiones de Clarificación [NEEDS CLARIFICATION]

> **Aclaración #1 (Movimiento de Fichas):** 
> *Pregunta:* ¿En la fase de movimiento de la modalidad continua, una ficha puede desplazarse a cualquier casilla vacía o únicamente a casillas adyacentes?
> *Decisión:* Se permite el movimiento a **cualquier casilla vacía** del tablero. Esta regla simplifica la API y garantiza que la partida siempre sea resoluble sin bloqueos totales.

> **Aclaración #2 (Repetición de Posiciones):**
> *Pregunta:* ¿Qué ocurre si dos jugadores repiten indefinidamente una secuencia de movimientos en modalidad continua?
> *Decisión:* La partida continúa hasta que exista una línea ganadora. No existe la regla de tablas o empate por repetición de posiciones.

---

## Criterios de Aceptación (Notación EARS)

### Reglas Generales e Inicialización
* **CA-M-01 (Inicialización):** `EL SISTEMA SHALL` iniciar toda partida nueva con el tablero completamente vacío (9 casillas `null`) y asignar el turno inicial al jugador 'X'.
* **CA-M-02 (Alternancia de Turno):** `WHEN` un jugador realiza una jugada legal, `EL SISTEMA SHALL` actualizar el estado del tablero y transferir el turno inmediatamente al jugador rival.
* **CA-M-03 (Detección de Victoria):** `WHEN` una jugada legal completa tres fichas consecutivas del mismo jugador en fila, columna o diagonal, `EL SISTEMA SHALL` declarar la partida como ganada por dicho jugador, identificar la línea victoriosa y bloquear jugadas posteriores.
* **CA-M-04 (Manejo de Jugadas Ilegales):** `IF` un jugador intenta realizar una jugada ilegal (casilla ocupada, mover ficha ajena o actuar fuera de su turno), `THEN EL SISTEMA SHALL` rechazar la acción entregando el motivo de error, conservando el estado del tablero exactamente intacto.

### Modalidad Clásica
* **CA-M-05 (Colocación Clásica):** `WHILE` la modalidad sea Clásica, `WHEN` el jugador con el turno activo selecciona una casilla vacía, `EL SISTEMA SHALL` colocar su marca ('X' u 'O') en esa posición.
* **CA-M-06 (Detección de Empate):** `WHERE` la modalidad sea Clásica, `WHEN` las 9 casillas del tablero se encuentren ocupadas sin que exista una línea ganadora, `EL SISTEMA SHALL` declarar la partida en estado de empate (DRAW) y bloquear el tablero.
* **CA-M-07 (Precedencia de Victoria):** `WHERE` la modalidad sea Clásica, `IF` la novena y última jugada disponible en el tablero completa una línea ganadora, `THEN EL SISTEMA SHALL` declarar victoria para el jugador activo en lugar de un empate.

### Modalidad Continua
* **CA-M-08 (Fase de Colocación Continua):** `WHILE` la modalidad sea Continua y el tablero contenga menos de 6 fichas en total, `WHEN` un jugador selecciona una casilla vacía, `EL SISTEMA SHALL` colocar su ficha en dicha casilla.
* **CA-M-09 (Transición de Fase):** `WHILE` la modalidad sea Continua, `WHEN` se hayan colocado exactamente 3 fichas de 'X' y 3 fichas de 'O' (6 en total), `EL SISTEMA SHALL` cambiar el estado de la partida automáticamente de la 'fase de colocación' a la 'fase de movimiento'.
* **CA-M-10 (Fase de Movimiento):** `WHILE` la modalidad sea Continua y la partida esté en 'fase de movimiento', `WHEN` un jugador selecciona una de sus fichas existentes y una casilla libre de destino, `EL SISTEMA SHALL` desplazar la ficha a la nueva casilla y ceder el turno al rival.
* **CA-M-11 (Ausencia de Empates):** `WHERE` la modalidad sea Continua, `EL SISTEMA SHALL` mantener activa la partida indefinidamente hasta que se forme una línea ganadora (no existen estados de empate).

---

## Fuera de Alcance (Out of Scope)
* Persistencia de datos en base de datos o almacenamiento local (localStorage).
* Lógica de interfaz gráfica, renders en HTML o gestión de eventos del mouse.
* Lógica de toma de decisiones de agentes de inteligencia artificial.