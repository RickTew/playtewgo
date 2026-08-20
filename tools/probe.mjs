// POSITIONAL PROBES: does the AI find the one right move in a position
// built to test a single idea?
//
// WHY THIS EXISTS, ALONGSIDE tools/sim.js. sim.js referees STRENGTH over
// volume and it is the right tool for tuning a weight. It is the wrong
// tool for finding out WHAT the engine cannot see, because a blind spot
// that both sides share cancels out in AI-vs-AI and reads as 50%. On
// 2026-08-20 these three probes found in seconds a defect that 600 refereed
// games could not: Expert is FORK-BLIND. It failed all three.
//
//   node tools/probe.mjs
//
// Add a probe whenever a field report says "the AI didn't see X". A probe
// is cheap, it is a permanent regression guard, and unlike a win rate it
// tells you the reason.

import { GameBoard, ONE, TWO } from '../play/engine/board.js';
import { GameAI } from '../play/engine/ai.js';

function mk(stones) {
  const b = new GameBoard();
  for (const [p, r, c] of stones) b.grid[r][c] = p;
  return b;
}

const eq = (m, [r, c]) => m && m[0] === r && m[1] === c;
let failures = 0;

function probe(name, board, tier, want, why) {
  // openingVariety OFF: a probe must be a pure function of the position.
  const move = new GameAI(tier, false).bestMove(board, TWO);
  const ok = eq(move, want);
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  console.log(`        played [${move}]  wanted [${want}]`);
  if (!ok) console.log(`        ${why}`);
}

// A double open three is the fork every human finds by accident: two open
// threes at once, and the opponent can only block one. #bestLineScore takes
// a Math.max over the four axes, so a move making TWO open threes scores
// exactly what one scores (3000) - the shape is invisible to the engine on
// both the attacking and the defending side.

probe(
  'Expert BUILDS a double open three',
  mk([
    [TWO, 10, 11], [TWO, 10, 12],   // leg A: open two on row 10
    [TWO, 11, 10], [TWO, 12, 10],   // leg B: open two on col 10  -> fork at (10,10)
    [TWO, 4, 4], [TWO, 4, 5], [TWO, 4, 6], [ONE, 4, 3], // a walled three: (4,7) is a dead simple four
    [ONE, 15, 15], [ONE, 16, 16], [ONE, 2, 18],
  ]),
  'expert', [10, 10],
  'Took the simple four instead (5000 > 3000). The four is answered by one block; the fork is not.',
);

probe(
  'Expert BLOCKS a double open three',
  mk([
    [ONE, 10, 11], [ONE, 10, 12],
    [ONE, 11, 10], [ONE, 12, 10],   // human forks at (10,10) next move
    [TWO, 3, 3], [TWO, 3, 4], [TWO, 17, 17],
  ]),
  'expert', [10, 10],
  'Extended its own open two instead: blocking pays 3/4 x 3000 = 2250, building pays 3000. It prefers to lose.',
);

probe(
  'Expert blocks the FORK, not an unrelated open three',
  mk([
    [ONE, 10, 11], [ONE, 10, 12],
    [ONE, 11, 10], [ONE, 12, 10],   // fork at (10,10)
    [ONE, 5, 5], [ONE, 5, 6],       // a plain open two elsewhere
    [TWO, 18, 3], [TWO, 18, 4],
  ]),
  'expert', [10, 10],
  'Both squares look like a lone open three to the eval, so the fork does not stand out.',
);

// ---------------------------------------------------------------------
// BROKEN (split) THREES. `#lineInfo` counts only CONTIGUOUS stones, so
// `X X _ X` reads as a two. The gap square itself is still scored
// correctly (placing there makes a contiguous four), which is why these
// two may well pass - run them, do not assume. If they pass, the gap is
// narrower than "the engine cannot see broken shapes" and the fix should
// not be sold as if it were.
// ---------------------------------------------------------------------

probe(
  'Expert blocks a broken three before it is an open four',
  mk([
    [ONE, 10, 10], [ONE, 10, 11], [ONE, 10, 13], // _ X X _ X _ , gap at (10,12)
    [TWO, 4, 4], [TWO, 4, 5],
  ]),
  'expert', [10, 12],
  'The human plays the gap next move for an OPEN four - two winning ends, one block. Must be taken now.',
);

probe(
  'Expert plays the gap of its OWN broken three',
  mk([
    [TWO, 10, 10], [TWO, 10, 11], [TWO, 10, 13], // gap at (10,12) makes an open four
    [ONE, 4, 4], [ONE, 4, 5], [ONE, 16, 16],
  ]),
  'expert', [10, 12],
  'An open four wins next move two ways. Anything else throws away a won position.',
);

// ---------------------------------------------------------------------
// KEYSTONE BUILDING - reported as an OBSERVATION, never a pass/fail.
// This is Pente theory, not a rule: a contiguous pair can be captured, a
// split pair (X _ X) cannot, so strong players build with gaps early.
// `#lineScore` pays 150 for the capturable shape and 10 for the safe one,
// which is a POLICY-LEVEL preference for the shape the opponent farms.
// Whether that is wrong is a tuning call and Rick tunes, not the probe.
// ---------------------------------------------------------------------

function observe(label, board, tier, notes) {
  const move = new GameAI(tier, false).bestMove(board, TWO);
  console.log(`\nOBSERVE  ${label}`);
  console.log(`         played [${move}]`);
  for (const n of notes) console.log(`         ${n}`);
}

observe(
  'Building shape: safe gap, or capturable pair?',
  mk([[TWO, 10, 10], [ONE, 4, 4], [ONE, 16, 16]]),
  'expert',
  ['[10,11] or [10,9] = a CONTIGUOUS pair, worth 150 and capturable the',
   '  moment the opponent takes either end.',
   '[10,12] or [10,8] = a SPLIT pair, worth 10 and impossible to capture.',
   'Pente theory says build with the gap early. The eval says the opposite',
   '  by 15 to 1. Tuning question for Rick, not a defect.'],
);

console.log(`\n${failures} of 5 pass/fail probes failing.`);
process.exit(failures === 0 ? 0 : 1);
