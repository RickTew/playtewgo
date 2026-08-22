// The positions Rick actually photographed, replayed through the shipping
// engine so his reports can be checked instead of argued about.
//
//   node tools/field-positions.mjs
//
// Each position records what every tier plays, and for the two four-defence
// positions it also plays the game out twice - once from the block, once from
// the capture - so "which answer is better" is a result, not an opinion.

import { GameBoard, ONE, TWO, opponentOf } from '../play/engine/board.js';
import { GameAI } from '../play/engine/ai.js';

const TIERS = ['easy', 'medium', 'hard', 'expert'];
const MAX_PLIES = 400;

function build(one, two) {
  const b = new GameBoard();
  for (const [r, c] of one) b.place(ONE, r, c);
  for (const [r, c] of two) b.place(TWO, r, c);
  return b;
}

function playOut(board, player, tier) {
  const ai = { [ONE]: new GameAI(tier, false), [TWO]: new GameAI(tier, false) };
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

const fmt = (m) => (m ? `(${m[0]},${m[1]})` : 'none');

// ---------------------------------------------------------------------------
// POSITION G - the 2026-08-10 guard, the one that put `rank = 2` on a
// delaying capture. Human four at row 10 cols 5-8, AI blocking (10,4), so
// (10,9) wins. Capture at (8,6) rips (10,6) out of the four via the
// (9,6)/(10,6) pair anchored on the AI stone at (11,6).
const G = {
  name: 'G  2026-08-10 guard (the position that made the current rule)',
  one: [[10, 5], [10, 6], [10, 7], [10, 8], [9, 6]],
  two: [[10, 4], [11, 6]],
  ai: TWO,
  block: [10, 9],
  capture: [8, 6],
};

// POSITION F - Rick's 2026-08-22 screenshot, item 1 ("Hard level but made an
// easy or medium level choice"). Human four at row 13 cols 8-11, AI blocking
// (13,12), so (13,7) wins. Capture at (11,6) takes the (12,7)/(13,8) diagonal
// pair anchored on the AI stone at (14,9) - and (13,8) is IN the four.
// Structurally the same shape as G, which is the whole problem.
const F = {
  name: 'F  2026-08-22 field report, item 1 (Hard blocked at the far left)',
  one: [[11, 9], [12, 7], [12, 9], [12, 13], [13, 8], [13, 9], [13, 10], [13, 11], [15, 10]],
  two: [[10, 9], [12, 10], [13, 12], [14, 9]],
  ai: TWO,
  block: [13, 7],
  capture: [11, 6],
};

// POSITION E - Rick's 2026-08-22 screenshot, item 6 ("expert made a non
// expert move ... just moved somewhere that looks random"). State BEFORE the
// AI played (12,12). The AI is TWO (robots), Rick is ONE (aliens).
const E = {
  name: 'E  2026-08-22 field report, item 6 (the "random" Expert move)',
  one: [[6, 11], [11, 11], [10, 10], [11, 9], [12, 8]],
  two: [[7, 11], [8, 11], [9, 11], [10, 11], [10, 9]],
  ai: TWO,
};

// POSITION E2 - the same game one ply later: Rick has answered with (9,10).
// The AI's (12,12) armed a capture of the (10,10)/(11,11) pair at (9,9).
const E2 = {
  name: 'E2 ... after AI (12,12) and Rick (9,10): is the armed capture taken?',
  one: [[6, 11], [11, 11], [10, 10], [11, 9], [12, 8], [9, 10]],
  two: [[7, 11], [8, 11], [9, 11], [10, 11], [10, 9], [12, 12]],
  ai: TWO,
};

function reportChoices(pos) {
  console.log('');
  console.log(pos.name);
  const b = build(pos.one, pos.two);
  const threats = [];
  for (let r = 0; r < 22; r += 1) {
    for (let c = 0; c < 22; c += 1) {
      if (b.grid[r][c] !== 0) continue;
      const t = b.clone();
      t.place(opponentOf(pos.ai), r, c);
      if (t.checkWin(opponentOf(pos.ai), r, c)) threats.push([r, c]);
    }
  }
  console.log(`   opponent wins next move at: ${threats.length ? threats.map(fmt).join(' ') : 'nothing immediate'}`);
  for (const tier of TIERS) {
    const move = new GameAI(tier, false).bestMove(b.clone(), pos.ai);
    let tag = '';
    if (pos.block && move && move[0] === pos.block[0] && move[1] === pos.block[1]) tag = '  <- BLOCK';
    if (pos.capture && move && move[0] === pos.capture[0] && move[1] === pos.capture[1]) tag = '  <- CAPTURE';
    // What does the move actually do?
    const t = b.clone();
    const caps = t.place(pos.ai, move[0], move[1]);
    const capNote = caps.length ? `  captures ${caps.length} pair(s)` : '';
    console.log(`   ${tier.padEnd(8)}${fmt(move)}${tag}${capNote}`);
  }
}

function reportArms(pos) {
  if (!pos.block || !pos.capture) return;
  console.log(`   --- play it out from each answer (both sides expert, deterministic) ---`);
  for (const [arm, move] of [['block  ', pos.block], ['capture', pos.capture]]) {
    const b = build(pos.one, pos.two);
    const caps = b.place(pos.ai, move[0], move[1]);
    const r = playOut(b, opponentOf(pos.ai), 'expert');
    const who = r.winner === null ? 'draw' : (r.winner === pos.ai ? 'AI WINS' : 'human wins');
    console.log(
      `   ${arm} ${fmt(move)}  ->  ${who.padEnd(11)} by ${String(r.reason).padEnd(12)}` +
      ` in ${r.plies + 1} plies   (banked ${caps.length} pair on move 1;` +
      ` final pairs AI ${b.captureCount[pos.ai]} / human ${b.captureCount[opponentOf(pos.ai)]})`,
    );
  }
}

for (const pos of [G, F, E, E2]) {
  reportChoices(pos);
  reportArms(pos);
}
console.log('');

// ---------------------------------------------------------------------------
// Move-by-move trace of position F's two arms, so the result can be read
// rather than trusted.
console.log('TRACE - position F, why each answer ends the way it does');
for (const [arm, move] of [['BLOCK', F.block], ['CAPTURE', F.capture]]) {
  const b = build(F.one, F.two);
  const caps0 = b.place(F.ai, move[0], move[1]);
  console.log('');
  console.log(`  ${arm}: AI plays ${fmt(move)}${caps0.length ? `  (+${caps0.length} pair)` : ''}`);
  const ai = { [ONE]: new GameAI('expert', false), [TWO]: new GameAI('expert', false) };
  let p = opponentOf(F.ai);
  for (let ply = 0; ply < 14; ply += 1) {
    const m = ai[p].bestMove(b, p);
    if (!m) break;
    const caps = b.place(p, m[0], m[1]);
    const who = p === F.ai ? 'AI   ' : 'human';
    const note = caps.length ? `  (+${caps.length} pair)` : '';
    const win = b.checkWin(p, m[0], m[1]);
    console.log(`    ${who} ${fmt(m)}${note}${win ? `   *** ${who.trim()} WINS by ${b.winReason(p)} ***` : ''}`);
    if (win) break;
    p = opponentOf(p);
  }
}
console.log('');
