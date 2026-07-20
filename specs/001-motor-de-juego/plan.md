# Plan Tecnico 001: Motor de Juego (Pure Domain)

## 1. Modulo y Responsabilidades
- **Archivo Target:** src/engine.js
- **Responsabilidad:** Logica pura del juego (estado del tablero, validacion de reglas, turnos, victoria y empate).
- **Restriccion de Arquitectura:** 100% funciones puras. Prohibido manipular el DOM.

## 2. Estructura de Datos
const GameMode = { CLASSIC: 'CLASSIC', CONTINUOUS: 'CONTINUOUS' };
const GamePhase = { PLACEMENT: 'PLACEMENT', MOVEMENT: 'MOVEMENT', FINISHED: 'FINISHED' };

## 3. API del Motor
- createGame(mode)
- makeMove(state, positionIndex)
- movePiece(state, fromIndex, toIndex)
- checkWinner(board)

## 4. Estrategia TDD (Gate P3)
Pruebas automatizadas en tests/engine.test.js asociadas a CA-M-01 hasta CA-M-11.
