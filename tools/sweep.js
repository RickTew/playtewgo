// Anomaly sweep: play whole games at volume through the REAL engine and
// assert on the SHAPE of what comes out. Not about who wins (that is
// tools/sim.js) - about outcomes that should be impossible.
//
//   node tools/sweep.js          # 240 games across every pairing
//   node tools/sweep.js 600      # more
//
// Exits 1 on any finding, so it can gate a commit. Findings are written
// with their exact inputs to tools/sweep_repro.json, because the AI uses
// Math.random: a seed alone does NOT reproduce a case unless the same
// seeded PRNG is reinstalled, so the repro carries the move list too.

import { writeFileSync } from 'node:fs';
import { GameBoard, SIZE, EMPTY, ONE, TWO, opponentOf } from '../play/engine/board.js';
import { GameAI } from '../play/engine/ai.js';
import { decodeState, encodeState, isStructurallyValid } from '../play/engine/state.js';

const TIERS = ['easy', 'medium', 'hard', 'expert'];
const PLY_CAP = 400;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const findings = [];
function flag(kind, detail, ctx) {
  findings.push({ kind, detail, ...ctx });
}

// Independent of checkWin: recount the line through (r,c) from the grid.
function lineThrough(grid, player, row, col) {
  let best = 0;
  for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
    let n = 1;
    for (const sign of [-1, 1]) {
      let r = row + sign * dr;
      let c = col + sign * dc;
      while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && grid[r][c] === player) {
        n += 1; r += sign * dr; c += sign * dc;
      }
    }
    best = Math.max(best, n);
  }
  return best;
}

function playGame(tierFirst, tierSecond, seed) {
  Math.random = mulberry32(seed);
  const ctx = { pairing: `${tierFirst} vs ${tierSecond}`, seed, moves: [] };
  const board = new GameBoard();
  const ai = { [ONE]: new GameAI(tierFirst, true), [TWO]: new GameAI(tierSecond, true) };
  let player = ONE;

  for (let ply = 0; ply < PLY_CAP; ply += 1) {
    let move;
    try {
      move = ai[player].bestMove(board, player);
    } catch (err) {
      flag('engine threw', `${err && err.message}`, { ...ctx, ply });
      return;
    }

    if (!move) {
      // Only legitimate when the board is genuinely full.
      if (!board.isFull()) flag('no move on a board with empty squares', `ply ${ply}`, ctx);
      return;
    }
    const [r, c] = move;
    if (!Number.isInteger(r) || !Number.isInteger(c)) {
      flag('non-integer move', `(${r},${c})`, { ...ctx, ply });
      return;
    }
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) {
      flag('move off the board', `(${r},${c})`, { ...ctx, ply });
      return;
    }
    if (board.grid[r][c] !== EMPTY) {
      flag('move onto an occupied square', `(${r},${c})`, { ...ctx, ply });
      return;
    }

    const before = { [ONE]: board.captureCount[ONE], [TWO]: board.captureCount[TWO] };
    const captures = board.place(player, r, c);
    ctx.moves.push([player, r, c]);

    // Capture bookkeeping must match what place() reported, and the
    // opponent's bank must never move on our turn.
    if (board.captureCount[player] !== before[player] + captures.length) {
      flag('capture count does not match the captures returned',
        `${before[player]} -> ${board.captureCount[player]} on ${captures.length} captures`,
        { ...ctx, ply });
      return;
    }
    if (board.captureCount[opponentOf(player)] !== before[opponentOf(player)]) {
      flag('opponent capture count changed on our move', `ply ${ply}`, { ...ctx, ply });
      return;
    }
    // The save codec rejects a bank above 5, so a multi-capture landing on
    // 6 would make the game unsaveable.
    for (const p of [ONE, TWO]) {
      if (board.captureCount[p] > 5) {
        flag('capture count above 5 (the save codec rejects this state)',
          `player ${p} at ${board.captureCount[p]}`, { ...ctx, ply });
        return;
      }
    }
    // Captured stones must actually be gone.
    for (const cap of captures) {
      if (board.grid[cap.row1][cap.col1] !== EMPTY || board.grid[cap.row2][cap.col2] !== EMPTY) {
        flag('captured stone still on the board', JSON.stringify(cap), { ...ctx, ply });
        return;
      }
    }

    const won = board.checkWin(player, r, c);
    const realLine = lineThrough(board.grid, player, r, c);
    const realPairs = board.captureCount[player];
    if (won && realLine < 5 && realPairs < 5) {
      flag('win declared with neither five in a row nor five pairs',
        `line ${realLine}, pairs ${realPairs}`, { ...ctx, ply });
      return;
    }
    if (!won && (realLine >= 5 || realPairs >= 5)) {
      flag('win missed', `line ${realLine}, pairs ${realPairs}`, { ...ctx, ply });
      return;
    }

    // Whatever the board is, the game must be saveable and reloadable.
    const state = board.toState(opponentOf(player), won, won ? player : null);
    if (!isStructurallyValid(state)) {
      flag('board state fails the save codec', `ply ${ply}`, { ...ctx, ply });
      return;
    }
    const round = decodeState(encodeState(state));
    if (!round || round.captureOne !== state.captureOne || round.captureTwo !== state.captureTwo) {
      flag('state does not survive a save/load round trip', `ply ${ply}`, { ...ctx, ply });
      return;
    }

    if (won) {
      const reason = board.winReason(player);
      if (reason === 'fiveCaptures' && realPairs < 5) {
        flag('win reason says captures but the bank is short', `pairs ${realPairs}`, { ...ctx, ply });
      }
      if (reason === 'fiveInARow' && realLine < 5) {
        flag('win reason says a line but there is none', `line ${realLine}`, { ...ctx, ply });
      }
      return;
    }
    if (board.isFull()) return; // legitimate draw
    player = opponentOf(player);
  }
  flag('game ran to the ply cap without ending', `${PLY_CAP} plies`, ctx);
}

const total = Number(process.argv[2] ?? 240);
const pairings = [];
for (const a of TIERS) for (const b of TIERS) pairings.push([a, b]);
const perPairing = Math.max(1, Math.round(total / pairings.length));

const t0 = Date.now();
let played = 0;
for (const [a, b] of pairings) {
  for (let g = 0; g < perPairing; g += 1) {
    playGame(a, b, 7000019 + played);
    played += 1;
  }
}

const byKind = new Map();
for (const f of findings) byKind.set(f.kind, (byKind.get(f.kind) ?? 0) + 1);

console.log(`${played} games in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (findings.length === 0) {
  console.log('no anomalies');
  process.exit(0);
}
for (const [kind, n] of byKind) {
  console.log(`\n${kind}: ${n}`);
  for (const f of findings.filter((x) => x.kind === kind).slice(0, 5)) {
    console.log(`  ${f.pairing} seed ${f.seed}: ${f.detail}`);
  }
}
writeFileSync(new URL('./sweep_repro.json', import.meta.url), JSON.stringify(findings, null, 2));
console.log(`\nrepro payloads: tools/sweep_repro.json`);
process.exit(1);
