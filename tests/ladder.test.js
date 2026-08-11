// Ladder guards, in batches.
//
// These replace the one-game head-to-head guards that used to live in
// ai.test.js. Those passed all the way through the 2026-08-11 bug where
// Hard lost to Easy 39/61 over 100 games: a single deterministic game
// says nothing about strength (12 games once swung a win rate from 83%
// to 41% with no relevant change). A guard that cannot fail when the
// ladder is inverted is worse than no guard, because it reads as proof.
//
// Method, so both engines measure the same thing: tools/sim.js is the
// referee and this file calls straight into it. Seats alternate, opening
// variety is left ON because that is what a player meets, and the seed
// is pinned so a run is reproducible and these never flake.
//
// n = 40 here against n >= 100 for real measurement, purely so the suite
// stays quick; the floor is set well under the measured rate so only a
// collapse trips it. NEVER retune the AI against these numbers - use
// `node tools/sim.js` at n >= 100 per pairing, and land the same change
// on iOS.
//
// Measured 2026-08-11 at n=40 over seeds 1/2/3:
//   medium vs easy   85%   97.5%  87.5%
//   hard vs medium   85%   67.5%  72.5%
//   expert vs hard   72.5% 72.5%  52.5%

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { measure } from '../tools/sim.js';

const GAMES = 40;
const SEED = 1;
const FLOOR = 60;

function guard(stronger, weaker) {
  const r = measure(stronger, weaker, GAMES, SEED);
  assert.ok(r.winPct[stronger] >= FLOOR,
    `${stronger} won only ${r.winPct[stronger]}% of ${GAMES} games vs ${weaker} `
    + `(floor ${FLOOR}%), conceding ${r.pairsConceded[stronger]} pairs a game. `
    + 'The ladder has collapsed at this rung.');
}

test('medium beats easy over a batch', () => {
  guard('medium', 'easy');
});

test('hard beats medium over a batch', () => {
  // The rung that was inverted before 2026-08-11: Hard scored 42% here.
  guard('hard', 'medium');
});

test('expert beats hard over a batch', () => {
  // The narrowest rung by design (Expert's edge is its third ply), so it
  // is the one most worth watching.
  guard('expert', 'hard');
});
