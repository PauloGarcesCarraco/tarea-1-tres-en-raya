export const GameMode = { CLASSIC: 'CLASSIC', CONTINUOUS: 'CONTINUOUS' };
export const GamePhase = { PLACEMENT: 'PLACEMENT', MOVEMENT: 'MOVEMENT', FINISHED: 'FINISHED' };

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function createGame(mode = GameMode.CLASSIC) {
  return {
    board: Array(9).fill(null),
    turn: 'X',
    mode,
    phase: GamePhase.PLACEMENT,
    winner: null,
    winningLine: null
  };
}

export function checkWinner(board) {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  return { winner: null, line: null };
}

export function makeMove(state, positionIndex) {
  if (state.phase === GamePhase.FINISHED) {
    return { success: false, state, error: 'La partida ha finalizado' };
  }
  if (state.board[positionIndex] !== null) {
    return { success: false, state, error: 'Casilla ocupada' };
  }

  const newBoard = [...state.board];
  newBoard[positionIndex] = state.turn;

  const winCheck = checkWinner(newBoard);
  if (winCheck.winner) {
    return {
      success: true,
      state: {
        ...state,
        board: newBoard,
        winner: winCheck.winner,
        winningLine: winCheck.line,
        phase: GamePhase.FINISHED
      }
    };
  }

  if (state.mode === GameMode.CLASSIC && newBoard.every(cell => cell !== null)) {
    return {
      success: true,
      state: {
        ...state,
        board: newBoard,
        winner: 'DRAW',
        phase: GamePhase.FINISHED
      }
    };
  }

  let nextPhase = state.phase;
  if (state.mode === GameMode.CONTINUOUS) {
    const piecesCount = newBoard.filter(c => c !== null).length;
    if (piecesCount === 6) {
      nextPhase = GamePhase.MOVEMENT;
    }
  }

  const nextTurn = state.turn === 'X' ? 'O' : 'X';

  return {
    success: true,
    state: {
      ...state,
      board: newBoard,
      turn: nextTurn,
      phase: nextPhase
    }
  };
}

export function movePiece(state, fromIndex, toIndex) {
  if (state.phase !== GamePhase.MOVEMENT) {
    return { success: false, state, error: 'No se encuentra en fase de movimiento' };
  }
  if (state.board[fromIndex] !== state.turn) {
    return { success: false, state, error: 'Solo puedes mover tus propias fichas' };
  }
  if (state.board[toIndex] !== null) {
    return { success: false, state, error: 'La casilla de destino esta ocupada' };
  }

  const newBoard = [...state.board];
  const activePlayer = state.turn;
  newBoard[fromIndex] = null;
  newBoard[toIndex] = activePlayer;

  const winCheck = checkWinner(newBoard);
  if (winCheck.winner) {
    return {
      success: true,
      state: {
        ...state,
        board: newBoard,
        winner: winCheck.winner,
        winningLine: winCheck.line,
        phase: GamePhase.FINISHED
      }
    };
  }

  const nextTurn = activePlayer === 'X' ? 'O' : 'X';

  return {
    success: true,
    state: {
      ...state,
      board: newBoard,
      turn: nextTurn
    }
  };
}
