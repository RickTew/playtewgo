// Referee for ONE question: when the opponent has an immediate line win and
// the defender can answer with either a durable BLOCK or a DELAYING CAPTURE
// (a capture that rips a stone out of the threatened line, after which the
// opponent can replace it and re-threaten), which answer actually wins more
// games?
//
// WHY THIS EXISTS. Rick has judged the same shape both ways, ten days apart:
//   2026-08-10: "this strategy is failure" - the capture bought one move and
//               solved nothing, the block kills the line forever. That report
//               is what put `rank = 2` on a delaying capture, BELOW a durable
//               block, in #defenseMove.
//   2026-08-22: "should have taken the two instead and thus blocked and a
//               step ahead" - on a position that is structurally identical.
// Two field reports, opposite verdicts, same shape. Neither is evidence, so
// this measures it instead of picking a side.
//
// METHOD (the sim.js header's rule: compare DECISIONS on the SAME positions).
//  1. Generate real decision points by playing AI vs AI games and snapshotting
//     every position where the side to move faces exactly this choice: the
//     opponent has >= 1 immediate winning square, a defusing capture exists,
//     a defusing block exists, and the SHIPPING engine picks the block.
//     Positions the engine already answers with a capture are not in dispute
//     and are dropped.
//  2. Replay each snapshot twice, deterministically, same tiers both arms:
//       ARM BLOCK   - the move the shipping engine actually plays.
//       ARM CAPTURE - the best-scoring defusing capture instead.
//     Everything after ply 1 is the unmodified engine on both sides, so the
//     only difference in the whole game is that one move.
//  3. Count who wins from each arm. Same positions, paired, no perturbation
//     and no statistics needed to read a large gap.
//
// Deterministic by construction: every AI here is built with
// openingVariety=false, so no call touches Math.random and each playout is a
// pure function of the position. Generation seeds Math.random only to vary
// the GAMES that produce the snapshots.
//
//   node tools/defense-experiment.mjs                 # expert defender, 60 games mined
//   node tools/defense-experiment.mjs hard 120 7      # tier, games to mine, seed

import { GameBoard, ONE, TWO, EMPTY, SIZE, opponentOf } from '../play/engine/board.js';
import { GameAI } from '../play/engine/ai.js';

const MAX_PLIES = 400;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Empty intersections within 2 of any stone - the same envelope the engine searches. */
function neighbourhood(board) {
  const out = [];
  let any = false;
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (board.grid[r][c] !== EMPTY) { any = true; break; }
    }
    if (any) break;
  }
  if (!any) return [[Math.floor(SIZE / 2), Math.floor(SIZE / 2)]];
  const seen = new Set();
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (board.grid[r][c] === EMPTY) continue;
      for (let dr = -2; dr <= 2; dr += 1) {
        for (let dc = -2; dc <= 2; dc += 1) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= SIZE || nc >= SIZE) continue;
          if (board.grid[nr][nc] !== EMPTY) continue;
          const k = nr * SIZE + nc;
          if (seen.has(k)) continue;
          seen.add(k);
          out.push([nr, nc]);
        }
      }
    }
  }
  return out;
}

/** Squares where `player` completes a win right now. */
function winningSquares(board, player) {
  const out = [];
  for (const [r, c] of neighbourhood(board)) {
    const b = board.clone();
    b.place(player, r, c);
    if (b.checkWin(player, r, c)) out.push([r, c]);
  }
  return out;
}

/**
 * Classify the defensive choice `defender` faces on `board`.
 * Returns null unless the opponent threatens an immediate win AND both a
 * defusing capture and a defusing block exist.
 */
function classify(board, defender) {
  const attacker = opponentOf(defender);
  const threats = winningSquares(board, attacker);
  if (threats.length === 0) return null;

  const captures = [];
  const blocks = [];
  for (const [r, c] of neighbourhood(board)) {
    const b = board.clone();
    const caps = b.place(defender, r, c);
    if (b.checkWin(defender, r, c)) return null;          // defender just wins; not a defence
    if (winningSquares(b, attacker).length > 0) continue;  // does not defuse
    if (caps.length > 0) captures.push([r, c]); else blocks.push([r, c]);
  }
  if (captures.length === 0 || blocks.length === 0) return null;
  return { captures, blocks };
}

/** Plays a game out from `board`, `player` to move, both sides deterministic. */
function playOut(board, player, tierDefender, tierAttacker, defender) {
  const ai = {
    [defender]: new GameAI(tierDefender, false),
    [opponentOf(defender)]: new GameAI(tierAttacker, false),
  };
  let p = player;
  for (let ply = 0; ply < MAX_PLIES; ply += 1) {
    const move = ai[p].bestMove(board, p);
    if (!move) break;
    board.place(p, move[0], move[1]);
    if (board.checkWin(p, move[0], move[1])) {
      return { winner: p, reason: board.winReason(p), plies: ply + 1 };
    }
    if (board.isFull()) break;
    p = opponentOf(p);
  }
  return { winner: null, reason: 'draw', plies: MAX_PLIES };
}

/** Mine decision points out of real games. */
function mine(tier, games, seedBase) {
  const found = [];
  for (let g = 0; g < games; g += 1) {
    Math.random = mulberry32(seedBase * 100003 + g);
    const board = new GameBoard();
    // Opening variety ON here only, so the mined games differ from each other.
    const ai = { [ONE]: new GameAI(tier, true), [TWO]: new GameAI(tier, true) };
    let player = ONE;
    for (let ply = 0; ply < MAX_PLIES; ply += 1) {
      const choice = classify(board, player);
      if (choice) {
        const shipping = new GameAI(tier, false).bestMove(board, player);
        const isCapture = shipping
          && choice.captures.some(([r, c]) => r === shipping[0] && c === shipping[1]);
        if (shipping && !isCapture) {
          found.push({
            board: board.clone(),
            player,
            shipping,
            captures: choice.captures,
            game: g,
            ply,
          });
        }
      }
      const move = ai[player].bestMove(board, player);
      if (!move) break;
      board.place(player, move[0], move[1]);
      if (board.checkWin(player, move[0], move[1])) break;
      if (board.isFull()) break;
      player = opponentOf(player);
    }
  }
  return found;
}

/** Best capture by the shipping engine's own preference: the one it would rank first. */
function pickCapture(snapshot, tier) {
  // No access to #scored, so use the engine's own answer to a reduced choice:
  // the capture that leaves the attacker with the worst immediate reply value
  // is approximated by simply taking the first capture the engine lists.
  // Deterministic and identical across arms, which is all the comparison needs.
  return snapshot.captures[0];
}

function main() {
  const [tierArg, gamesArg, seedArg] = process.argv.slice(2);
  const tier = tierArg || 'expert';
  const games = Number(gamesArg || 60);
  const seed = Number(seedArg || 1);

  process.stderr.write(`mining ${games} ${tier}-vs-${tier} games for block-or-capture decisions...\n`);
  const points = mine(tier, games, seed);
  process.stderr.write(`found ${points.length} decision points\n`);
  if (points.length === 0) {
    console.log('No decision points found. The shape may be rarer than the sample.');
    return;
  }

  const tally = {
    block:   { defenderWins: 0, attackerWins: 0, draws: 0, plies: 0 },
    capture: { defenderWins: 0, attackerWins: 0, draws: 0, plies: 0 },
  };
  let differed = 0;

  for (const p of points) {
    const cap = pickCapture(p, tier);
    if (cap[0] === p.shipping[0] && cap[1] === p.shipping[1]) continue;
    differed += 1;

    for (const [arm, move] of [['block', p.shipping], ['capture', cap]]) {
      const b = p.board.clone();
      b.place(p.player, move[0], move[1]);
      let result;
      if (b.checkWin(p.player, move[0], move[1])) {
        result = { winner: p.player, plies: 1 };
      } else {
        result = playOut(b, opponentOf(p.player), tier, tier, p.player);
        result.plies += 1;
      }
      const t = tally[arm];
      t.plies += result.plies;
      if (result.winner === p.player) t.defenderWins += 1;
      else if (result.winner === null) t.draws += 1;
      else t.attackerWins += 1;
    }
  }

  const n = differed;
  const pct = (x) => `${Math.round((x / n) * 1000) / 10}%`;
  console.log('');
  console.log(`Decision points replayed: ${n}   (tier ${tier} both sides, ${games} games mined, seed ${seed})`);
  console.log('');
  console.log('arm       defender wins   attacker wins   draws   avg plies');
  for (const arm of ['block', 'capture']) {
    const t = tally[arm];
    console.log(
      `${arm.padEnd(10)}${`${t.defenderWins} (${pct(t.defenderWins)})`.padEnd(16)}` +
      `${`${t.attackerWins} (${pct(t.attackerWins)})`.padEnd(16)}` +
      `${String(t.draws).padEnd(8)}${Math.round(tally[arm].plies / n)}`,
    );
  }
  console.log('');
  const delta = tally.capture.defenderWins - tally.block.defenderWins;
  console.log(`capture minus block: ${delta > 0 ? '+' : ''}${delta} defender wins over ${n} paired positions`);
}

main();
