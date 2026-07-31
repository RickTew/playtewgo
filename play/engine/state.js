// Serializable game state. Direct port of TEWGO/Game/GameState.swift (iOS repo).
// Same JSON shape as the iOS codec so saved games stay interchangeable.

import { SIZE } from './board.js';

export function initialState() {
  return {
    cells: Array.from({ length: SIZE }, () => new Array(SIZE).fill(0)),
    captureOne: 0,
    captureTwo: 0,
    currentPlayerRaw: 1,
    isGameOver: false,
    winnerRaw: null,
  };
}

// Guards against malformed or hostile payloads: anything that fails this
// would crash GameBoard.fromState or desync the game.
export function isStructurallyValid(state) {
  return Array.isArray(state.cells)
    && state.cells.length === SIZE
    && state.cells.every(
      (row) => Array.isArray(row) && row.length === SIZE
        && row.every((v) => v === 0 || v === 1 || v === 2),
    )
    && Number.isInteger(state.captureOne) && state.captureOne >= 0 && state.captureOne <= 5
    && Number.isInteger(state.captureTwo) && state.captureTwo >= 0 && state.captureTwo <= 5
    && (state.currentPlayerRaw === 1 || state.currentPlayerRaw === 2)
    && (state.winnerRaw == null || state.winnerRaw === 1 || state.winnerRaw === 2);
}

export function encodeState(state) {
  return JSON.stringify(state);
}

/** Returns the state, or null when the payload is malformed. */
export function decodeState(text) {
  let state;
  try {
    state = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof state !== 'object' || state === null || !isStructurallyValid(state)) return null;
  if (state.winnerRaw === undefined) state.winnerRaw = null;
  return state;
}
