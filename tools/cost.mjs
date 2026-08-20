// SEARCH COST METER. What does one bestMove() actually cost, counted in
// NODES (board.place() calls), not milliseconds?
//
// WHY NODES. When Expert becomes a real search, its work has to be bounded,
// and the bound must be a NODE COUNT with a wall-clock ceiling only as a
// bail-out that never fires in normal play. A wall-clock BUDGET would make
// bestMove depend on machine load, and this project's whole referee
// apparatus assumes bestMove is a pure function of the position: sim.js
// pins seeds, ladder.test.js runs n=40 over seeds 1/2/3, ai.test.js and the
// iOS GameAITests both ASSERT reproducibility outright. Tuning under a
// clock would mean tuning an engine we can no longer referee - the same
// class of mistake as tuning it against itself.
//
// Baseline measured 2026-08-20 on the shipping heuristic Expert:
//   opening  mean 3.4k nodes   midgame  mean 9.4k   late  mean 8.5k
//   worst observed single move: ~14.8k nodes (~45ms on an M-series Mac)
// So a real search has room: the AI already pauses ~450ms before replying,
// which is the budget a node count has to fit inside on the SLOWEST phone
// we care about, not on this laptop.
//
//   node tools/cost.mjs
//
import { GameBoard, ONE, TWO } from '/Users/ricktew/Dev/playtewgo/play/engine/board.js';
import { GameAI } from '/Users/ricktew/Dev/playtewgo/play/engine/ai.js';

function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}

// Instrument the board: every place() during a search is one node.
let nodes = 0;
const realPlace = GameBoard.prototype.place;
GameBoard.prototype.place = function (...a) { nodes += 1; return realPlace.apply(this, a); };
const realClone = GameBoard.prototype.clone;
let clones = 0;
GameBoard.prototype.clone = function () { clones += 1; return realClone.call(this); };

const phases = { opening: [], midgame: [], late: [] };
const times = { opening: [], midgame: [], late: [] };

Math.random = mulberry32(99);
for (let game = 0; game < 6; game += 1) {
  const board = new GameBoard();
  const ai = { [ONE]: new GameAI('expert'), [TWO]: new GameAI('hard') };
  let player = ONE;
  for (let ply = 0; ply < 90; ply += 1) {
    nodes = 0; clones = 0;
    const t0 = process.hrtime.bigint();
    const move = ai[player].bestMove(board, player);
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    if (!move) break;
    if (player === ONE) { // only measure Expert
      const bucket = ply < 8 ? 'opening' : ply < 40 ? 'midgame' : 'late';
      phases[bucket].push(nodes);
      times[bucket].push(ms);
    }
    board.place(player, move[0], move[1]);
    if (board.checkWin(player, move[0], move[1])) break;
    if (board.isFull()) break;
    player = player === ONE ? TWO : ONE;
  }
}

const stat = (xs) => {
  if (!xs.length) return 'n/a';
  const s = xs.slice().sort((a, b) => a - b);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return `mean ${mean.toFixed(0)}  median ${s[s.length >> 1].toFixed(0)}  max ${s[s.length - 1].toFixed(0)}  (n=${xs.length})`;
};
console.log('EXPERT cost per move, measured as board.place() calls (= nodes):');
for (const k of Object.keys(phases)) console.log(`  ${k.padEnd(9)} ${stat(phases[k])}`);
console.log('\nWall clock on THIS machine, for scale only (never a budget):');
for (const k of Object.keys(times)) console.log(`  ${k.padEnd(9)} ${stat(times[k])} ms`);
