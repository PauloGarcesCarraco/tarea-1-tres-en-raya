// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { initUI, handleCellClick, getUIState } from '../src/ui.js';
import { GameMode, GamePhase } from '../src/engine.js';

describe('Interfaz Gráfica y Gestión de Estado (UI/DOM)', () => {
  beforeEach(() => {
    // Configuración del DOM simulado según el contrato de index.html
    document.body.innerHTML = `
      <div id="game-container">
        <div id="turn-indicator"></div>
        <div id="status-message"></div>
        <div id="board">
          <div class="cell" data-index="0"></div>
          <div class="cell" data-index="1"></div>
          <div class="cell" data-index="2"></div>
          <div class="cell" data-index="3"></div>
          <div class="cell" data-index="4"></div>
          <div class="cell" data-index="5"></div>
          <div class="cell" data-index="6"></div>
          <div class="cell" data-index="7"></div>
          <div class="cell" data-index="8"></div>
        </div>
        <select id="game-mode">
          <option value="CLASSIC">Clásico</option>
          <option value="CONTINUOUS">Continuo</option>
        </select>
        <select id="opponent-type">
          <option value="PVP">Human vs Human</option>
          <option value="PVE">Human vs IA</option>
        </select>
        <select id="ai-difficulty">
          <option value="EASY">Sencillo</option>
          <option value="MEDIUM">Medio</option>
          <option value="HARD">Complejo</option>
        </select>
        <button id="btn-restart">Reiniciar</button>
      </div>
    `;
    initUI();
  });

  it('CA-U-01: debe inicializar el tablero vacío y mostrar el turno inicial de X', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      expect(cell.textContent).toBe('');
      expect(cell.classList.contains('occupied')).toBe(false);
    });
    
    const turnIndicator = document.getElementById('turn-indicator');
    expect(turnIndicator.textContent).toContain('Turno: X');
  });

  it('CA-U-03 & CA-U-04: debe renderizar la jugada y actualizar el indicador de turno en PvP', () => {
    handleCellClick(0); // Juega X en 0
    const cell0 = document.querySelector('.cell[data-index="0"]');
    expect(cell0.textContent).toBe('X');
    expect(cell0.classList.contains('x-piece')).toBe(true);

    const turnIndicator = document.getElementById('turn-indicator');
    expect(turnIndicator.textContent).toContain('Turno: O');
  });

  it('CA-U-02 & CA-U-04: debe gestionar la selección y movimiento en modalidad continua', () => {
    // Forzamos modo continuo
    document.getElementById('game-mode').value = GameMode.CONTINUOUS;
    document.getElementById('btn-restart').click();

    // Colocamos 6 fichas alternadas (0, 1, 2, 3, 4, 5)
    [0, 1, 2, 3, 4, 5].forEach(idx => handleCellClick(idx));

    // Fase de movimiento: Turno de X. Hacemos click en ficha propia (índice 0) para seleccionar
    handleCellClick(0);
    const cell0 = document.querySelector('.cell[data-index="0"]');
    expect(cell0.classList.contains('selected')).toBe(true);
    expect(getUIState().selectedCell).toBe(0);

    // Click en casilla destino libre (índice 6) para mover
    handleCellClick(6);
    const cell6 = document.querySelector('.cell[data-index="6"]');
    expect(cell0.textContent).toBe('');
    expect(cell6.textContent).toBe('X');
    expect(getUIState().selectedCell).toBeNull();
  });

  it('CA-U-05 & CA-U-06: debe mostrar mensaje de victoria, resaltar línea y bloquear clicks posteriores', () => {
    // X gana en fila superior: X(0), O(3), X(1), O(4), X(2)
    handleCellClick(0);
    handleCellClick(3);
    handleCellClick(1);
    handleCellClick(4);
    handleCellClick(2);

    const statusMessage = document.getElementById('status-message');
    expect(statusMessage.textContent).toContain('¡Ganador: X!');

    const cell0 = document.querySelector('.cell[data-index="0"]');
    const cell1 = document.querySelector('.cell[data-index="1"]');
    const cell2 = document.querySelector('.cell[data-index="2"]');
    expect(cell0.classList.contains('win-cell')).toBe(true);
    expect(cell1.classList.contains('win-cell')).toBe(true);
    expect(cell2.classList.contains('win-cell')).toBe(true);

    // Intentar jugar tras el final no debe alterar el tablero (O intenta en celda 8)
    handleCellClick(8);
    const cell8 = document.querySelector('.cell[data-index="8"]');
    expect(cell8.textContent).toBe('');
  });
});
