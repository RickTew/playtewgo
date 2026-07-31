// Rules engine for TEWGO on the web.
// Direct port of TEWGO/Game/GameBoard.swift in the iOS repo (~/Dev/TEWGO).
// Any rule change must land in BOTH engines, with matching tests.

export const SIZE = 22;
export const EMPTY = 0;
export const ONE = 1;
export const TWO = 2;

export function opponentOf(player) {
  return player === ONE ? TWO : ONE;
}

// 4 axes for line-length (lineLength handles both signs internally)
const LINE_DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];
// All 8 directions for captures - the closing piece can be on either end
const CAPTURE_DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

function inBounds(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

export class GameBoard {
  constructor() {
    this.grid = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));
    this.captureCount = { [ONE]: 0, [TWO]: 0 };
  }

  static fromState(state) {
    const b = new GameBoard();
    b.grid = state.cells.map((row) => row.slice());
    b.captureCount = { [ONE]: state.captureOne, [TWO]: state.captureTwo };
    return b;
  }

  toState(currentPlayer, isGameOver = false, winner = null) {
    return {
      cells: this.grid.map((row) => row.slice()),
      captureOne: this.captureCount[ONE],
      captureTwo: this.captureCount[TWO],
      currentPlayerRaw: currentPlayer,
      isGameOver,
      winnerRaw: winner,
    };
  }

  clone() {
    const b = new GameBoard();
    b.grid = this.grid.map((row) => row.slice());
    b.captureCount = { [ONE]: this.captureCount[ONE], [TWO]: this.captureCount[TWO] };
    return b;
  }

  isValid(row, col) {
    return inBounds(row, col) && this.grid[row][col] === EMPTY;
  }

  /** True when no empty intersections remain (a draw if nobody has won). */
  isFull() {
    return !this.grid.some((row) => row.includes(EMPTY));
  }

  /** Places a stone and applies captures. Returns the captures made, [] if the move was illegal. */
  place(player, row, col) {
    if (!this.isValid(row, col)) return [];
    this.grid[row][col] = player;
    const captures = this.#detectCaptures(player, row, col);
    for (const cap of captures) {
      this.grid[cap.row1][cap.col1] = EMPTY;
      this.grid[cap.row2][cap.col2] = EMPTY;
      this.captureCount[player] += 1;
    }
    return captures;
  }

  checkWin(player, row, col) {
    if (this.captureCount[player] >= 5) return true;
    return LINE_DIRECTIONS.some(([dr, dc]) => this.#lineLength(player, row, col, dr, dc) >= 5);
  }

  /** 'fiveCaptures' | 'fiveInARow', inferred from the final board state after a win. */
  winReason(player) {
    return this.captureCount[player] >= 5 ? 'fiveCaptures' : 'fiveInARow';
  }

  #detectCaptures(player, row, col) {
    const opp = opponentOf(player);
    const captures = [];
    for (const [dr, dc] of CAPTURE_DIRECTIONS) {
      const r1 = row + dr, c1 = col + dc;
      const r2 = row + 2 * dr, c2 = col + 2 * dc;
      const r3 = row + 3 * dr, c3 = col + 3 * dc;
      if (!inBounds(r1, c1) || !inBounds(r2, c2) || !inBounds(r3, c3)) continue;
      if (this.grid[r1][c1] === opp && this.grid[r2][c2] === opp && this.grid[r3][c3] === player) {
        captures.push({ row1: r1, col1: c1, row2: r2, col2: c2 });
      }
    }
    return captures;
  }

  #lineLength(player, row, col, dr, dc) {
    let count = 1;
    for (const sign of [-1, 1]) {
      let r = row + sign * dr;
      let c = col + sign * dc;
      while (inBounds(r, c) && this.grid[r][c] === player) {
        count += 1;
        r += sign * dr;
        c += sign * dc;
      }
    }
    return count;
  }
}
