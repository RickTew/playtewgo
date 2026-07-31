// AI opponent. Direct port of TEWGO/Game/GameAI.swift (iOS repo),
// including the 2026-06-11 upgrade: open-line scoring and the
// capture-vulnerability penalty. Keep scoring weights in sync.

import { GameBoard, SIZE, EMPTY, opponentOf } from './board.js';

const LINE_DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];
const CAPTURE_DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
const CENTER = [Math.floor(SIZE / 2), Math.floor(SIZE / 2)];

function inB(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

export class GameAI {
  /** @param {'easy'|'medium'|'hard'} difficulty */
  constructor(difficulty) {
    this.difficulty = difficulty;
  }

  /** Returns [row, col], or null when no legal move exists (board effectively full). */
  bestMove(board, aiPlayer) {
    const candidates = this.#candidateMoves(board);
    if (candidates.length === 0) return null;

    const opponent = opponentOf(aiPlayer);

    // Win immediately
    for (const [r, c] of candidates) {
      const b = board.clone();
      b.place(aiPlayer, r, c);
      if (b.checkWin(aiPlayer, r, c)) return [r, c];
    }

    // Block opponent win
    for (const [r, c] of candidates) {
      const b = board.clone();
      b.place(opponent, r, c);
      if (b.checkWin(opponent, r, c)) return [r, c];
    }

    switch (this.difficulty) {
      case 'easy':
        return candidates[Math.floor(Math.random() * candidates.length)] ?? CENTER;

      case 'medium': {
        // Plays the best move most of the time, the runner-up sometimes.
        // (Random among the top FOUR made it a pushover - the 3rd/4th
        // choices are often outright blunders on a capture board.)
        const top = this.#scored(candidates, board, aiPlayer).slice(0, 2).map((e) => e[0]);
        if (top.length === 0) return CENTER;
        if (top.length > 1 && Math.random() < 0.3) return top[1];
        return top[0];
      }

      case 'hard':
      default:
        return this.#scored(candidates, board, aiPlayer)[0]?.[0] ?? CENTER;
    }
  }

  // ----- Internals -----

  #scored(candidates, board, aiPlayer) {
    return candidates
      .map(([r, c]) => [[r, c], this.#score(board, r, c, aiPlayer)])
      .sort((a, b) => b[1] - a[1]);
  }

  #candidateMoves(board) {
    const seen = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false));
    const result = [];
    let hasAny = false;

    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        if (board.grid[r][c] === EMPTY) continue;
        hasAny = true;
        for (let dr = -2; dr <= 2; dr += 1) {
          for (let dc = -2; dc <= 2; dc += 1) {
            const nr = r + dr;
            const nc = c + dc;
            if (!inB(nr, nc) || board.grid[nr][nc] !== EMPTY || seen[nr][nc]) continue;
            seen[nr][nc] = true;
            result.push([nr, nc]);
          }
        }
      }
    }
    return hasAny ? result : [CENTER];
  }

  #score(board, row, col, aiPlayer) {
    const opponent = opponentOf(aiPlayer);
    let s = 0;

    // Captures this move yields
    const b = board.clone();
    const captures = b.place(aiPlayer, row, col);
    s += captures.length * 400;

    // Capture count proximity to win
    if (b.captureCount[aiPlayer] >= 4) s += 2000; // one more pair wins

    // Line potential for AI (open ends matter: an open three becomes an
    // unstoppable open four, a closed three is just a shape)
    s += this.#bestLineScore(board, aiPlayer, row, col);

    // Block opponent lines - weighted at 3/4 so denying an open three
    // (2250) beats building our own closed three (500)
    s += Math.floor((this.#bestLineScore(board, opponent, row, col) * 3) / 4);

    // Capture threats created
    s += this.#captureThreatCount(board, row, col, aiPlayer) * 150;

    // Block opponent capture threats
    s += this.#captureThreatCount(board, row, col, opponent) * 80;

    // Don't hand the opponent free pairs: penalize every capturable pair
    // this move creates. With 5 pairs as a win condition this is the
    // difference between a challenge and a farm. Near opponent capture
    // win, a vulnerable pair is potentially game-losing.
    const vulnerablePenalty = b.captureCount[opponent] >= 4 ? 5000 : 350;
    s -= this.vulnerablePairCount(b, row, col, aiPlayer) * vulnerablePenalty;

    return s;
  }

  #lineScore(len, openEnds) {
    if (len >= 5) return 100000;
    if (len === 4 && openEnds === 2) return 20000; // open four: win next move, two ways
    if (len === 4 && openEnds === 1) return 5000; // simple four: forces a response
    if (len === 3 && openEnds === 2) return 3000; // open three: becomes an open four
    if (len === 3 && openEnds === 1) return 500;
    if (len === 2 && openEnds === 2) return 150;
    if (len === 2 && openEnds === 1) return 40;
    return openEnds > 0 ? 10 : 0;
  }

  #bestLineScore(board, player, row, col) {
    return Math.max(...LINE_DIRECTIONS.map(([dr, dc]) => {
      const [len, open] = this.#lineInfo(board, player, row, col, dr, dc);
      return this.#lineScore(len, open);
    }));
  }

  // Length of the line through (row, col) if `player` owned that cell,
  // plus how many of its two ends are open (in bounds and empty).
  #lineInfo(board, player, row, col, dr, dc) {
    let count = 1;
    let open = 0;
    for (const sign of [-1, 1]) {
      let r = row + sign * dr;
      let c = col + sign * dc;
      while (inB(r, c) && board.grid[r][c] === player) {
        count += 1;
        r += sign * dr;
        c += sign * dc;
      }
      if (inB(r, c) && board.grid[r][c] === EMPTY) open += 1;
    }
    return [count, open];
  }

  // Pairs containing the stone just placed at (row, col) that the opponent
  // can capture on their next move: [opp][AI][AI][empty] or the mirror.
  // Evaluated on the post-move board.
  vulnerablePairCount(board, row, col, aiPlayer) {
    const opp = opponentOf(aiPlayer);
    let count = 0;
    for (const [dr, dc] of CAPTURE_DIRECTIONS) {
      const pr = row + dr, pc = col + dc; // partner stone of the pair
      const br = row - dr, bc = col - dc; // end behind the placed stone
      const fr = row + 2 * dr, fc = col + 2 * dc; // end beyond the partner
      if (!inB(pr, pc) || board.grid[pr][pc] !== aiPlayer) continue;
      const behindOpp = inB(br, bc) && board.grid[br][bc] === opp;
      const behindEmpty = inB(br, bc) && board.grid[br][bc] === EMPTY;
      const beyondOpp = inB(fr, fc) && board.grid[fr][fc] === opp;
      const beyondEmpty = inB(fr, fc) && board.grid[fr][fc] === EMPTY;
      if ((behindOpp && beyondEmpty) || (behindEmpty && beyondOpp)) count += 1;
    }
    return count;
  }

  #captureThreatCount(board, row, col, aiPlayer) {
    const opp = opponentOf(aiPlayer);
    let count = 0;
    for (const [dr, dc] of CAPTURE_DIRECTIONS) {
      const r1 = row + dr, c1 = col + dc;
      const r2 = row + 2 * dr, c2 = col + 2 * dc;
      const r3 = row + 3 * dr, c3 = col + 3 * dc;
      if (!inB(r1, c1) || !inB(r2, c2) || !inB(r3, c3)) continue;
      if (board.grid[r1][c1] === opp && board.grid[r2][c2] === opp && board.grid[r3][c3] === aiPlayer) count += 1;
    }
    return count;
  }
}
