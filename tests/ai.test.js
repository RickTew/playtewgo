// Port of TEWGOTests/GameAITests.swift (iOS repo).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GameBoard, ONE, TWO } from '../play/engine/board.js';
import { GameAI } from '../play/engine/ai.js';

const ai = new GameAI('hard');

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
