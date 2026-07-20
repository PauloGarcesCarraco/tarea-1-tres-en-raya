import { describe, it, expect, beforeEach } from 'vitest';
import { createGame, makeMove, GameMode, GamePhase } from '../src/engine.js';
import { getBestMove, clearAIMemory, getAIMemorySize } from '../src/agents.js';

describe('Agentes de IA (Pure Domain & Minimax)', () => {
  beforeEach(() => {
    clearAIMemory();
  });

  it('CA-A-01: Agente Sencillo debe elegir una casilla valida disponible', () => {
    const game = createGame(GameMode.CLASSIC);
    const move = getBestMove(game, 'EASY');
    expect(game.board[move]).toBeNull();
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  it('CA-A-03: Agente Medio debe tomar la victoria inmediata si esta disponible', () => {
    let g = createGame(GameMode.CLASSIC);
    // X tiene 0 y 1 ocupados, el 2 está libre para ganar
    g = makeMove(g, 0).state; // X
    g = makeMove(g, 3).state; // O
    g = makeMove(g, 1).state; // X
    g = makeMove(g, 4).state; // O
    // Turno de X: debería elegir el índice 2 para ganar
    const move = getBestMove(g, 'MEDIUM');
    expect(move).toBe(2);
  });

  it('CA-A-04: Agente Medio debe bloquear la victoria inmediata del rival', () => {
    let g = createGame(GameMode.CLASSIC);
    // X tiene 0 y 1 ocupados (amenaza en 2). Es turno de O.
    g = makeMove(g, 0).state; // X
    g = makeMove(g, 3).state; // O
    g = makeMove(g, 1).state; // X
    // Turno de O: debe bloquear en 2
    const move = getBestMove(g, 'MEDIUM');
    expect(move).toBe(2);
  });

  it('CA-A-06 & CA-A-09: Agente Complejo (Minimax) no debe perder ninguna partida clásica en 50 intentos contra Sencillo', () => {
    let complexLosses = 0;
    const TOTAL_GAMES = 50;

    for (let i = 0; i < TOTAL_GAMES; i++) {
      let g = createGame(GameMode.CLASSIC);
      // Alternar quién empieza: en pares empieza Complejo (X), en impares empieza Sencillo (X)
      const complexPlayer = i % 2 === 0 ? 'X' : 'O';

      while (g.phase !== GamePhase.FINISHED) {
        let move;
        if (g.turn === complexPlayer) {
          move = getBestMove(g, 'HARD');
        } else {
          move = getBestMove(g, 'EASY');
        }
        g = makeMove(g, move).state;
      }

      if (g.winner && g.winner !== 'DRAW' && g.winner !== complexPlayer) {
        complexLosses++;
      }
    }

    expect(complexLosses).toBe(0);
  });

  it('CA-A-07: Agente Complejo debe almacenar y reutilizar posiciones memoizadas de la sesión', () => {
    const g = createGame(GameMode.CLASSIC);
    expect(getAIMemorySize()).toBe(0);
    
    // Primer cálculo: llena el caché
    getBestMove(g, 'HARD');
    const sizeAfterFirst = getAIMemorySize();
    expect(sizeAfterFirst).toBeGreaterThan(0);

    // Segundo cálculo en exactamente la misma posición: no debe aumentar el tamaño de la memoria
    getBestMove(g, 'HARD');
    expect(getAIMemorySize()).toBe(sizeAfterFirst);
  });

  it('CA-A-08: El agente en cualquier dificultad debe responder en menos de 1000 milisegundos', () => {
    const g = createGame(GameMode.CLASSIC);
    const start = performance.now();
    getBestMove(g, 'HARD');
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(1000);
  });
});
