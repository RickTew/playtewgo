// Port of TEWGOTests/GameAITests.swift (iOS repo) at commit c6c8c11.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GameBoard, ONE, TWO } from '../play/engine/board.js';
import { GameAI } from '../play/engine/ai.js';

const ai = new GameAI('hard', false);
const expert = new GameAI('expert', false);

// Build a board by placing stones; positions chosen so no captures fire.
function board({ one = [], two = [] } = {}) {
  const b = new GameBoard();
  for (const [r, c] of one) b.place(ONE, r, c);
  for (const [r, c] of two) b.place(TWO, r, c);
  return b;
}

test('takes immediate line win', () => {
  // AI (TWO) has four in a row at row 10, cols 5-8; 9 completes five.
  const b = board({
    one: [[2, 2], [3, 3], [4, 4]],
    two: [[10, 5], [10, 6], [10, 7], [10, 8]],
  });
  const move = ai.bestMove(b, TWO);
  assert.ok(move);
  const [r, c] = move;
  assert.ok(r === 10 && (c === 9 || c === 4), `expected winning move, got (${r},${c})`);
});

test('blocks immediate line win', () => {
  // Human (ONE) has an open four at row 10 cols 5-8 plus scattered AI
  // stones; AI must take one of the two winning ends.
  const b = board({
    one: [[10, 5], [10, 6], [10, 7], [10, 8]],
    two: [[2, 2], [3, 3], [4, 4]],
  });
  const move = ai.bestMove(b, TWO);
  assert.ok(move);
  const [r, c] = move;
  assert.ok(r === 10 && (c === 4 || c === 9), `expected block at an end, got (${r},${c})`);
});

test('blocks open three', () => {
  // Human open three at row 10, cols 6-8, both ends empty. Letting it
  // grow makes an open four. AI's own stones are an unconnected pair,
  // so the right play is one of the two ends (or a capture threat
  // against the three, which this position does not offer).
  const b = board({
    one: [[10, 6], [10, 7], [10, 8]],
    two: [[2, 2], [3, 4]],
  });
  const move = ai.bestMove(b, TWO);
  assert.ok(move);
  const [r, c] = move;
  assert.ok(r === 10 && (c === 5 || c === 9), `expected open-three block at (10,5)/(10,9), got (${r},${c})`);
});

test('vulnerable pair detection', () => {
  // [opp][AI][AI][empty] horizontally: ONE at (10,4), TWO at (10,5)
  // and the new stone at (10,6); (10,7) empty. One capturable pair.
  const b = board({ one: [[10, 4]], two: [[10, 5], [10, 6]] });
  assert.equal(ai.vulnerablePairCount(b, 10, 6, TWO), 1);
  // Close the open end and the pair is safe.
  const safe = board({ one: [[10, 4]], two: [[10, 5], [10, 6], [10, 7]] });
  assert.equal(ai.vulnerablePairCount(safe, 10, 6, TWO), 0);
});

test('avoids creating free capture', () => {
  // Human stone at (10,4); AI stone at (10,5). Playing (10,6) would
  // create [opp][AI][AI][empty] and gift a capture. With no other
  // pressure on the board, hard AI should prefer any other move.
  const b = board({ one: [[10, 4]], two: [[10, 5]] });
  const move = ai.bestMove(b, TWO);
  assert.ok(move);
  const [r, c] = move;
  assert.ok(!(r === 10 && c === 6), 'AI created a free capture for the opponent');
});

// ----- Expert (2-ply) -----

test('expert takes immediate line win', () => {
  const b = board({
    one: [[2, 2], [3, 3], [4, 4]],
    two: [[10, 5], [10, 6], [10, 7], [10, 8]],
  });
  const move = expert.bestMove(b, TWO);
  assert.ok(move);
  const [r, c] = move;
  assert.ok(r === 10 && (c === 9 || c === 4), `expected winning move, got (${r},${c})`);
});

test('expert blocks immediate line win', () => {
  const b = board({
    one: [[10, 5], [10, 6], [10, 7], [10, 8]],
    two: [[2, 2], [3, 3], [4, 4]],
  });
  const move = expert.bestMove(b, TWO);
  assert.ok(move);
  const [r, c] = move;
  assert.ok(r === 10 && (c === 4 || c === 9), `expected block at an end, got (${r},${c})`);
});

test('expert avoids capture-win trap', () => {
  // Human (ONE) sits at 4 captured pairs. AI (TWO) has a three at
  // (10,5)-(10,7); extending to (10,8) makes an open four (the greedy
  // dream move) BUT pairs the new stone with (11,8) under the human
  // stone at (12,8) - the human reply (9,8) captures the pair for the
  // 5th pair and wins on the spot. Until 2026-08-10 the one-ply eval
  // took the bait (open four 20000 minus flat penalty 5000 topped the
  // list) and only the 2-ply tiers could refuse; the scaled
  // vulnerablePairPenalty (30000 at four opponent pairs) now makes
  // every scoring tier refuse the game-losing pair outright.
  const b = new GameBoard();
  for (const [r, c] of [[10, 5], [10, 6], [10, 7], [11, 8]]) b.place(TWO, r, c);
  for (const [r, c] of [[10, 3], [12, 8]]) b.place(ONE, r, c);
  // Manufacture 4 prior pairs for the human by replaying real captures
  // far from the trap rows.
  for (let i = 0; i < 4; i += 1) {
    const r = i * 2;
    b.place(ONE, r, 14);
    b.place(TWO, r, 15);
    b.place(TWO, r, 16);
    b.place(ONE, r, 17); // captures the pair
  }
  assert.equal(b.captureCount[ONE], 4);

  for (const difficulty of ['medium', 'hard', 'expert']) {
    const move = new GameAI(difficulty, false).bestMove(b, TWO);
    assert.ok(move);
    assert.ok(!(move[0] === 10 && move[1] === 8),
      `${difficulty} played into the capture-win trap`);
  }
});

// ----- Persona round 1 and 2 answers -----

test('easy takes an available capture', () => {
  // Round 1: Maya, Leo and Priya each finished their first game without
  // a single capture happening, so Easy taught them the game was plain
  // five-in-a-row. Easy must take a capture sitting in front of it:
  // [AI][human][human][empty at (10,7)].
  const b = board({ one: [[10, 5], [10, 6]], two: [[10, 4], [2, 2]] });
  const move = new GameAI('easy', false).bestMove(b, TWO);
  assert.ok(move);
  assert.ok(move[0] === 10 && move[1] === 7,
    `Easy walked past a free capture, got (${move[0]},${move[1]})`);
});

test('easy still wanders without a capture', () => {
  // The other half of the rule: Easy takes what is there, it does not
  // start hunting. With no capture available it must still be the
  // wandering tier, not a greedy one.
  const b = board({ one: [[10, 6], [10, 7]], two: [[2, 2]] });
  const easy = new GameAI('easy', false);
  const seen = new Set();
  for (let i = 0; i < 25; i += 1) {
    const m = easy.bestMove(b, TWO);
    if (m) seen.add(`${m[0]},${m[1]}`);
  }
  assert.ok(seen.size > 1, 'Easy stopped wandering; it now plays one fixed move');
});

test('opening variety gives different games', () => {
  // Round 2: Priya beat every tier by replaying one memorized line. A
  // fresh Expert must not answer the same opening identically forever.
  const b = new GameBoard();
  b.place(ONE, 11, 11);
  const expertVaried = new GameAI('expert');
  const replies = new Set();
  for (let i = 0; i < 25; i += 1) {
    const m = expertVaried.bestMove(b, TWO);
    if (m) replies.add(`${m[0]},${m[1]}`);
  }
  assert.ok(replies.size > 1,
    'Expert answered the same opening identically every time - rematches are replays');
});

test('opening variety off is fully reproducible', () => {
  // The flag the tests rely on: with variety off the same position must
  // always give the same move, or every ladder guard is meaningless.
  const b = new GameBoard();
  b.place(ONE, 11, 11);
  const fixed = new GameAI('expert', false);
  const first = fixed.bestMove(b, TWO);
  assert.ok(first);
  for (let i = 0; i < 10; i += 1) {
    const again = fixed.bestMove(b, TWO);
    assert.ok(again[0] === first[0] && again[1] === first[1],
      'openingVariety false was not reproducible');
  }
});

test('opening variety never overrides a tactic', () => {
  // Variety runs after the win/defend scans, so it must never appear in
  // a position that has a tactic - even an almost-empty one. The human
  // threatens five at (10,9) with only 4 stones on the board.
  const b = board({ one: [[10, 5], [10, 6], [10, 7], [10, 8]] });
  const varied = new GameAI('expert');
  for (let i = 0; i < 10; i += 1) {
    const move = varied.bestMove(b, TWO);
    assert.ok(move);
    assert.ok(move[0] === 10 && (move[1] === 4 || move[1] === 9),
      `opening variety overrode a forced block, got (${move[0]},${move[1]})`);
  }
});

// ----- Capture economy (2026-08-10 pair-gifting fix) -----

test('capture economy tables', () => {
  // Pins the scaled weight tables so they mirror GameAI.swift exactly
  // and any retune on either side is loud.
  assert.deepEqual([0, 1, 2, 3, 4].map((n) => ai.captureValue(n)),
    [400, 550, 800, 1200, 20000]);
  assert.deepEqual([0, 1, 2, 3, 4].map((n) => ai.vulnerablePairPenalty(n)),
    [1000, 1400, 2000, 3200, 30000]);
  assert.deepEqual([0, 1, 2, 3, 4].map((n) => ai.captureContestBonus(n)),
    [0, 0, 0, 1200, 1600]);
  // The penalty must always exceed a closed three (500) so shape
  // hunting never parks a pair for free, and at four opponent pairs it
  // must exceed even an open four (20000) - the capture wins the game.
  // (Raising the base tiers further needs the sim harness as referee;
  // see the tuning note on vulnerablePairPenalty.)
  assert.ok(ai.vulnerablePairPenalty(0) > 500);
  assert.ok(ai.vulnerablePairPenalty(4) > 20000);
});

test('all tiers avoid gifting a pair while blocking', () => {
  // Field report 2026-08-10: Expert placed pairs directly into
  // capturable positions. Both ends of the human open three at
  // (10,5)-(10,7) block it equally, but blocking at (10,8) pairs the
  // new stone with the AI stone at (11,8) over the human stone at
  // (12,8) - a free capture at (9,8). Every tier that scores moves
  // must pick the safe end at (10,4) instead.
  const b = board({
    one: [[10, 5], [10, 6], [10, 7], [12, 8]],
    two: [[11, 8], [2, 2]],
  });
  for (const difficulty of ['medium', 'hard', 'expert']) {
    const move = new GameAI(difficulty, false).bestMove(b, TWO);
    assert.ok(move);
    assert.ok(!(move[0] === 10 && move[1] === 8),
      `${difficulty}: blocked into a free capture at (10,8)`);
  }

  // Stronger position: under the old flat 350 penalty greedy Medium
  // provably gifted a pair here (shape bonuses at (10,8) and (11,7)
  // both outweighed the safe block at (10,4) by hundreds of points);
  // the scaled penalty makes the safe block win outright.
  const b2 = board({
    one: [[10, 5], [10, 6], [10, 7], [12, 10], [13, 8]],
    two: [[11, 8], [12, 8], [11, 9]],
  });
  const mediumMove = new GameAI('medium', false).bestMove(b2, TWO);
  assert.ok(mediumMove);
  assert.ok(mediumMove[0] === 10 && mediumMove[1] === 4,
    `Medium: expected the safe block at (10,4), got (${mediumMove[0]},${mediumMove[1]})`);
});

test('expert blocks open three despite distractions', () => {
  // Human open three at (10,6)-(10,8), both ends free with room: one
  // more human stone makes an open four (a won game). The AI gets four
  // separate open pairs, so a dozen of ITS moves outscore the humble
  // block at 1-ply - exactly the pruning hole that made the first
  // Expert "ignore" open threes. The only non-losing answers sit on
  // row 10 next to the three.
  const b = board({
    one: [[10, 6], [10, 7], [10, 8]],
    two: [[3, 3], [3, 4], [5, 15], [5, 16], [16, 4], [16, 5], [14, 14], [14, 15]],
  });
  const move = expert.bestMove(b, TWO);
  assert.ok(move);
  const answers = [[10, 4], [10, 5], [10, 9], [10, 10]];
  assert.ok(answers.some(([r, c]) => r === move[0] && c === move[1]),
    `expected a block on row 10, got (${move[0]},${move[1]})`);
});

test('expert completes open three to open four', () => {
  // AI open three at (10,5)-(10,7) with both ends and the squares
  // beyond them free; the human has only quiet stones. Extending to
  // (10,4) or (10,8) makes an open four: two winning ends, no capture
  // available to break it - a won game Expert must recognize and take.
  const b = board({
    one: [[2, 2], [2, 15]],
    two: [[10, 5], [10, 6], [10, 7]],
  });
  const move = expert.bestMove(b, TWO);
  assert.ok(move);
  assert.ok(move[0] === 10 && (move[1] === 4 || move[1] === 8),
    `expected the open four at (10,4)/(10,8), got (${move[0]},${move[1]})`);
});

// The ladder guards used to live here as single deterministic games.
// They passed throughout the 2026-08-11 bug in which Hard lost to both
// tiers under it, so they moved to tests/ladder.test.js and became batch
// measurements over tools/sim.js. Do not add a one-game strength
// assertion back: it cannot fail when the ladder is inverted.

test('blocks four instead of delaying capture', () => {
  // Field report 2026-08-10 (supersedes the 2026-08-04 capture-first
  // rule): Human (ONE) four at (10,5)-(10,8), left end blocked by AI
  // at (10,4), so (10,9) completes five. Capturing the (9,6)/(10,6)
  // pair via (8,6) rips (10,6) out of the four, but the human just
  // replays (10,6) and the four re-forms with (10,9) still open - the
  // capture bought one move and solved nothing ("this strategy is
  // failure", Rick, after beating Expert with exactly this rebuild).
  // The block at (10,9) kills the line forever. Every tier blocks.
  const b = board({
    one: [[10, 5], [10, 6], [10, 7], [10, 8], [9, 6]],
    two: [[10, 4], [11, 6]],
  });
  for (const difficulty of ['easy', 'medium', 'hard', 'expert']) {
    const move = new GameAI(difficulty, false).bestMove(b, TWO);
    assert.ok(move);
    assert.ok(move[0] === 10 && move[1] === 9,
      `${difficulty}: expected the durable block at (10,9), got (${move[0]},${move[1]})`);
  }
});

test('delaying capture is right when winning the pair race', () => {
  // Same position as the block test, but the AI already banked 3
  // pairs. Now the delaying capture is correct for Hard/Expert: it
  // brings the AI to 4 pairs, so the rebuild exchange the human wants
  // IS the AI's own win condition (the next capture ends the game).
  const b = new GameBoard();
  for (const [r, c] of [[10, 5], [10, 6], [10, 7], [10, 8], [9, 6]]) b.place(ONE, r, c);
  for (const [r, c] of [[10, 4], [11, 6]]) b.place(TWO, r, c);
  // Manufacture 3 prior pairs for the AI by replaying real captures
  // far from the trap rows.
  for (let i = 0; i < 3; i += 1) {
    const r = i * 2;
    b.place(TWO, r, 14);
    b.place(ONE, r, 15);
    b.place(ONE, r, 16);
    b.place(TWO, r, 17); // captures the pair
  }
  assert.equal(b.captureCount[TWO], 3);
  for (const difficulty of ['hard', 'expert']) {
    const move = new GameAI(difficulty, false).bestMove(b, TWO);
    assert.ok(move);
    assert.ok(move[0] === 8 && move[1] === 6,
      `${difficulty}: expected the race capture at (8,6), got (${move[0]},${move[1]})`);
  }
});

test('capture win is taken', () => {
  // AI has 4 captured pairs already and a capture available:
  // [AI][opp][opp][empty at (10,7)] - placing there captures and wins.
  const b = new GameBoard();
  b.place(TWO, 10, 4);
  b.place(ONE, 10, 5);
  b.place(ONE, 10, 6);
  // Manufacture 4 prior pairs for AI (TWO) by replaying real captures
  // far from the test rows.
  for (let i = 0; i < 4; i += 1) {
    const r = i * 2;
    b.place(TWO, r, 14);
    b.place(ONE, r, 15);
    b.place(ONE, r, 16);
    b.place(TWO, r, 17); // captures the pair
  }
  assert.equal(b.captureCount[TWO], 4);
  const move = ai.bestMove(b, TWO);
  assert.ok(move);
  assert.equal(move[0], 10);
  assert.equal(move[1], 7, `expected capture-out win at (10,7), got (${move[0]},${move[1]})`);
});
