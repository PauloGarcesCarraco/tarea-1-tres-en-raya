import { createGame, makeMove, movePiece, GameMode, GamePhase } from './engine.js';
import { getBestMove } from './agents.js';

let gameState = null;
let uiState = {
  selectedCell: null,
  isAITurn: false,
  hasShownMovementTooltip: false
};

export function getUIState() {
  return uiState;
}

export function initUI() {
  const gameModeSelect = document.getElementById('game-mode');
  const opponentSelect = document.getElementById('opponent-type');
  const restartBtn = document.getElementById('btn-restart');
  const cells = document.querySelectorAll('.cell');

  if (!gameModeSelect || !cells.length) return;

  const startNewGame = () => {
    const mode = gameModeSelect.value;
    gameState = createGame(mode);
    uiState.selectedCell = null;
    uiState.isAITurn = false;
    uiState.hasShownMovementTooltip = false;
    render(gameState, uiState);
  };

  gameModeSelect.addEventListener('change', startNewGame);
  opponentSelect.addEventListener('change', startNewGame);
  document.getElementById('ai-difficulty')?.addEventListener('change', startNewGame);
  restartBtn.addEventListener('click', startNewGame);

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = parseInt(cell.getAttribute('data-index'), 10);
      handleCellClick(idx);
    });
  });

  startNewGame();
}

export function handleCellClick(index) {
  if (!gameState || gameState.phase === GamePhase.FINISHED || uiState.isAITurn) {
    return;
  }

  const opponentType = document.getElementById('opponent-type')?.value || 'PVP';

  if (gameState.phase === GamePhase.PLACEMENT) {
    const result = makeMove(gameState, index);
    if (result.success) {
      gameState = result.state;
      render(gameState, uiState);
      checkAndTriggerAI(opponentType);
    }
  } else if (gameState.phase === GamePhase.MOVEMENT) {
    if (uiState.selectedCell === null) {
      if (gameState.board[index] === gameState.turn) {
        uiState.selectedCell = index;
        uiState.hasShownMovementTooltip = true; // Se oculta apenas interactúa para mover
        render(gameState, uiState);
      }
    } else {
      if (index === uiState.selectedCell) {
        uiState.selectedCell = null;
        render(gameState, uiState);
      } else if (gameState.board[index] === null) {
        const result = movePiece(gameState, uiState.selectedCell, index);
        if (result.success) {
          gameState = result.state;
          uiState.selectedCell = null;
          render(gameState, uiState);
          checkAndTriggerAI(opponentType);
        }
      } else if (gameState.board[index] === gameState.turn) {
        uiState.selectedCell = index;
        render(gameState, uiState);
      }
    }
  }
}

function checkAndTriggerAI(opponentType) {
  if (opponentType === 'PVE' && gameState.turn === 'O' && gameState.phase !== GamePhase.FINISHED) {
    uiState.isAITurn = true;
    const difficulty = document.getElementById('ai-difficulty')?.value || 'HARD';
    
    setTimeout(() => {
      if (gameState.phase === GamePhase.PLACEMENT) {
        const aiMove = getBestMove(gameState, difficulty);
        if (aiMove !== null) {
          gameState = makeMove(gameState, aiMove).state;
        }
      } else if (gameState.phase === GamePhase.MOVEMENT) {
        const myPieces = [];
        gameState.board.forEach((val, idx) => { if (val === 'O') myPieces.push(idx); });
        const emptyCells = [];
        gameState.board.forEach((val, idx) => { if (val === null) emptyCells.push(idx); });
        
        if (myPieces.length > 0 && emptyCells.length > 0) {
          const from = myPieces[Math.floor(Math.random() * myPieces.length)];
          const to = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          gameState = movePiece(gameState, from, to).state;
        }
      }
      uiState.isAITurn = false;
      render(gameState, uiState);
    }, 300);
  }
}

function render(state, ui) {
  const cells = document.querySelectorAll('.cell');
  const turnIndicator = document.getElementById('turn-indicator');
  const statusMessage = document.getElementById('status-message');

  if (!cells.length || !turnIndicator || !statusMessage) return;

  const showTooltip = state.mode === GameMode.CONTINUOUS && 
                      state.phase === GamePhase.MOVEMENT && 
                      !ui.hasShownMovementTooltip && 
                      !ui.isAITurn;

  cells.forEach((cell, idx) => {
    const val = state.board[idx];
    cell.textContent = val || '';
    cell.className = 'cell';
    cell.removeAttribute('data-tooltip');
    cell.removeAttribute('title');
    
    if (val) {
      cell.classList.add('occupied');
      cell.classList.add(val === 'X' ? 'x-piece' : 'o-piece');
      
      // Aplicar tooltip solo en la primera jugada de movimiento a las fichas del jugador actual
      if (showTooltip && val === state.turn) {
        const tooltipText = "Para mover la ficha, haz clic en una y después en la casilla de destino para moverla.";
        cell.setAttribute('data-tooltip', tooltipText);
        cell.setAttribute('title', tooltipText);
      }
    }
    if (ui.selectedCell === idx) {
      cell.classList.add('selected');
    }
  });

  if (state.phase === GamePhase.FINISHED) {
    turnIndicator.textContent = '¡Partida Finalizada!';
    if (state.winner === 'DRAW') {
      statusMessage.textContent = '¡Empate!';
    } else {
      statusMessage.textContent = `¡Ganador: ${state.winner}!`;
      if (state.winningLine) {
        state.winningLine.forEach(idx => {
          document.querySelector(`.cell[data-index="${idx}"]`)?.classList.add('win-cell');
        });
      }
    }
  } else {
    statusMessage.textContent = '';
    const phaseText = state.phase === GamePhase.PLACEMENT ? 'Colocación' : 'Movimiento (Elige y mueve)';
    turnIndicator.textContent = `Turno: ${state.turn} | Fase: ${phaseText}`;
  }
}
