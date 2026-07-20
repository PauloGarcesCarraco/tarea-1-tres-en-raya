import { checkWinner, GameMode, GamePhase } from './engine.js';

// Memoria caché para memoización de posiciones en la sesión (CA-A-07)
const aiMemory = new Map();

export function clearAIMemory() {
  aiMemory.clear();
}

export function getAIMemorySize() {
  return aiMemory.size;
}

export function getBestMove(state, difficulty = 'EASY') {
  if (state.phase === GamePhase.FINISHED) return null;

  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return getEasyMove(state);
    case 'MEDIUM':
      return getMediumMove(state);
    case 'HARD':
    default:
      return getHardMove(state);
  }
}

// --- NIVEL 1: SENCILLO (Aleatorio uniforme) ---
function getEasyMove(state) {
  const available = getAvailableIndices(state.board);
  if (available.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

// --- NIVEL 2: MEDIO (Heurístico: Ganar -> Bloquear -> Centro/Esquinas) ---
function getMediumMove(state) {
  const available = getAvailableIndices(state.board);
  const myTurn = state.turn;
  const opponentTurn = myTurn === 'X' ? 'O' : 'X';

  // 1. Victoria inmediata
  for (const idx of available) {
    const boardCopy = [...state.board];
    boardCopy[idx] = myTurn;
    if (checkWinner(boardCopy).winner === myTurn) return idx;
  }

  // 2. Bloqueo de amenaza inmediata rival
  for (const idx of available) {
    const boardCopy = [...state.board];
    boardCopy[idx] = opponentTurn;
    if (checkWinner(boardCopy).winner === opponentTurn) return idx;
  }

  // 3. Heurística posicional: Centro > Esquinas > Bordes
  if (available.includes(4)) return 4;
  
  const corners = [0, 2, 6, 8].filter(c => available.includes(c));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return available[0];
}

// --- NIVEL 3: COMPLEJO (Minimax con Memoización Exacta) ---
function getHardMove(state) {
  const available = getAvailableIndices(state.board);
  if (available.length === 0) return null;

  const maximizingPlayer = state.turn;
  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const idx of available) {
    const boardCopy = [...state.board];
    boardCopy[idx] = maximizingPlayer;
    
    const score = minimax(
      boardCopy,
      0,
      false,
      maximizingPlayer,
      state.mode
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = idx;
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing, aiPlayer, mode) {
  const boardKey = board.join(',') + `|${isMaximizing}|${aiPlayer}`;
  if (aiMemory.has(boardKey)) {
    return aiMemory.get(boardKey);
  }

  const winCheck = checkWinner(board);
  const opponent = aiPlayer === 'X' ? 'O' : 'X';

  if (winCheck.winner === aiPlayer) {
    return 10 - depth;
  } else if (winCheck.winner === opponent) {
    return depth - 10;
  }

  const available = getAvailableIndices(board);
  if (available.length === 0) {
    return 0; // Empate en modo clásico
  }

  // Limitar profundidad en modo continuo si el árbol se extiende demasiado para cumplir latencia < 1000ms
  if (mode === GameMode.CONTINUOUS && depth >= 6) {
    return 0;
  }

  const currentTurn = isMaximizing ? aiPlayer : opponent;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const idx of available) {
    board[idx] = currentTurn;

    if (isMaximizing) {
      const score = minimax(board, depth + 1, false, aiPlayer, mode);
      bestScore = Math.max(bestScore, score);
    } else {
      const score = minimax(board, depth + 1, true, aiPlayer, mode);
      bestScore = Math.min(bestScore, score);
    }

    board[idx] = null; // Backtracking
  }

  aiMemory.set(boardKey, bestScore);
  return bestScore;
}

// Auxiliar pura
function getAvailableIndices(board) {
  const indices = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) indices.push(i);
  }
  return indices;
}
