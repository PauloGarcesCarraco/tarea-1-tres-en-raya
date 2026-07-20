import { describe, it, expect } from 'vitest';
import { createGame, makeMove, movePiece, GameMode, GamePhase } from '../src/engine.js';

describe('Motor de Juego (Pure Domain)', () => {
  it('CA-M-01: debe inicializar el tablero vacio y turno en X', () => {
    const game = createGame(GameMode.CLASSIC);
    expect(game.board).toEqual(Array(9).fill(null));
    expect(game.turn).toBe('X');
    expect(game.phase).toBe(GamePhase.PLACEMENT);
    expect(game.winner).toBeNull();
  });

  it('CA-M-02 & CA-M-05: debe permitir jugadas legales y alternar turno', () => {
    const g1 = createGame(GameMode.CLASSIC);
    const { success, state: g2 } = makeMove(g1, 0);
    expect(success).toBe(true);
    expect(g2.board[0]).toBe('X');
    expect(g2.turn).toBe('O');
  });

  it('CA-M-03: debe detectar victoria y bloquear jugadas posteriores', () => {
    let g = createGame(GameMode.CLASSIC);
    g = makeMove(g, 0).state; // X
    g = makeMove(g, 3).state; // O
    g = makeMove(g, 1).state; // X
    g = makeMove(g, 4).state; // O
    const result = makeMove(g, 2); // X completa fila 0,1,2
    expect(result.state.winner).toBe('X');
    expect(result.state.phase).toBe(GamePhase.FINISHED);

    const postMove = makeMove(result.state, 5);
    expect(postMove.success).toBe(false);
  });

  it('CA-M-04: debe rechazar jugadas ilegales en casillas ocupadas', () => {
    let g = createGame(GameMode.CLASSIC);
    g = makeMove(g, 4).state;
    const result = makeMove(g, 4);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('CA-M-06: debe detectar empate en modalidad clasica', () => {
    let g = createGame(GameMode.CLASSIC);
    // Tablero sin victoria: X O X / X O O / O X X
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    moves.forEach(idx => { g = makeMove(g, idx).state; });
    expect(g.winner).toBe('DRAW');
    expect(g.phase).toBe(GamePhase.FINISHED);
  });

  it('CA-M-08 & CA-M-09: debe transicionar a fase de movimiento en continua', () => {
    let g = createGame(GameMode.CONTINUOUS);
    const placementMoves = [0, 1, 2, 3, 4, 5]; // 3 de X, 3 de O
    placementMoves.forEach(idx => { g = makeMove(g, idx).state; });
    expect(g.phase).toBe(GamePhase.MOVEMENT);
  });

  it('CA-M-10: debe permitir mover piezas en fase de movimiento', () => {
    let g = createGame(GameMode.CONTINUOUS);
    [0, 1, 2, 3, 4, 5].forEach(idx => { g = makeMove(g, idx).state; });
    const result = movePiece(g, 0, 6); // X mueve de 0 a 6
    expect(result.success).toBe(true);
    expect(result.state.board[0]).toBeNull();
    expect(result.state.board[6]).toBe('X');
    expect(result.state.turn).toBe('O');
  });
});
