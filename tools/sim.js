// Batch ladder referee. Plays whole AI vs AI games at volume and reports
// win rate and pairs conceded per pairing.
//
// WHY THIS EXISTS: single deterministic games cannot referee an AI change.
// The one-game ladder guards in tests/ai.test.js PASS while Hard loses to
// Easy 39/61 over 100 games, and 12 games once swung a win rate from 83%
// to 41% with no relevant change. Nothing in play/engine/ai.js should be
// retuned without a run of this at n >= 100 per pairing, on both engines.
//
//   node tools/sim.js                     # every pairing, 100 games each
//   node tools/sim.js hard easy           # one pairing
//   node tools/sim.js hard easy 200 7     # 200 games, seed base 7
//
// Seats alternate every game (even game index: the first tier named moves
// first), so first-move advantage cancels. Opening variety is left ON,
// because that is what a player meets; Math.random is replaced by a seeded
// PRNG so a run is reproducible.

import { GameBoard, ONE, TWO, opponentOf } from '../play/engine/board.js';
import { GameAI } from '../play/engine/ai.js';

const TIERS = ['easy', 'medium', 'hard', 'expert'];
const MAX_PLIES = 400;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function playGame(tierFirst, tierSecond, seed) {
  Math.random = mulberry32(seed);
  const board = new GameBoard();
  const ai = { [ONE]: new GameAI(tierFirst, true), [TWO]: new GameAI(tierSecond, true) };
  let player = ONE;
  for (let ply = 0; ply < MAX_PLIES; ply += 1) {
    const move = ai[player].bestMove(board, player);
    if (!move) break;
    board.place(player, move[0], move[1]);
    if (board.checkWin(player, move[0], move[1])) {
      return { winner: player, reason: board.winReason(player), board };
    }
    if (board.isFull()) break;
    player = opponentOf(player);
  }
  return { winner: null, reason: 'draw', board };
}

export function measure(tierA, tierB, games = 100, seedBase = 1) {
  const blank = () => ({ wins: 0, taken: 0, byCapture: 0, byLine: 0 });
  const stat = { [tierA]: blank(), [tierB]: blank() };
  let draws = 0;

  for (let g = 0; g < games; g += 1) {
    const aFirst = g % 2 === 0;
    const first = aFirst ? tierA : tierB;
    const second = aFirst ? tierB : tierA;
    const r = playGame(first, second, seedBase * 100003 + g);
    stat[first].taken += r.board.captureCount[ONE];
    stat[second].taken += r.board.captureCount[TWO];
    if (r.winner === null) { draws += 1; continue; }
    const w = r.winner === ONE ? first : second;
    stat[w].wins += 1;
    if (r.reason === 'fiveCaptures') stat[w].byCapture += 1; else stat[w].byLine += 1;
  }

  const round = (n) => Math.round(n * 100) / 100;
  return {
    pairing: `${tierA} vs ${tierB}`,
    games,
    seedBase,
    winPct: { [tierA]: round((stat[tierA].wins / games) * 100), [tierB]: round((stat[tierB].wins / games) * 100) },
    drawPct: round((draws / games) * 100),
    // Pairs a side CONCEDED is what the other side took off it.
    pairsConceded: { [tierA]: round(stat[tierB].taken / games), [tierB]: round(stat[tierA].taken / games) },
    winsByCapture: { [tierA]: stat[tierA].byCapture, [tierB]: stat[tierB].byCapture },
    winsByLine: { [tierA]: stat[tierA].byLine, [tierB]: stat[tierB].byLine },
  };
}

function line(r) {
  const [a, b] = r.pairing.split(' vs ');
  const pad = (s, n) => String(s).padEnd(n);
  return [
    pad(r.pairing, 22),
    pad(`${r.winPct[a]}% / ${r.winPct[b]}%`, 16),
    pad(`${r.pairsConceded[a]} / ${r.pairsConceded[b]}`, 16),
    `${r.winsByLine[a]}+${r.winsByCapture[a]} / ${r.winsByLine[b]}+${r.winsByCapture[b]}`,
  ].join('');
}

const [, , argA, argB, argGames, argSeed] = process.argv;
const games = Number(argGames ?? 100);
const seed = Number(argSeed ?? 1);

console.log('pairing'.padEnd(22) + 'win %'.padEnd(16) + 'pairs conceded'.padEnd(16) + 'wins by line+capture');
if (argA && argB) {
  console.log(line(measure(argA, argB, games, seed)));
} else {
  for (let i = 0; i < TIERS.length; i += 1) {
    for (let j = i + 1; j < TIERS.length; j += 1) {
      console.log(line(measure(TIERS[j], TIERS[i], games, seed)));
    }
  }
}
