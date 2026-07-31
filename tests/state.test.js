// Port of TEWGOTests/GameStateTests.swift (iOS repo). Round-trips and
// payload validation for the state codec.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GameBoard, EMPTY, ONE, TWO } from '../play/engine/board.js';
import { initialState, encodeState, decodeState } from '../play/engine/state.js';

test('round trip preserves everything', () => {
  const b = new GameBoard();
  b.place(ONE, 0, 0);
  b.place(TWO, 21, 21);
  b.place(ONE, 10, 10);
  // A real capture so captureCount is nonzero
  b.place(TWO, 5, 5);
  b.place(ONE, 5, 6);
  b.place(ONE, 5, 7);
  b.place(TWO, 5, 8);

  const state = b.toState(TWO, true, TWO);
  const back = decodeState(encodeState(state));
  assert.ok(back);

  assert.deepEqual(back.cells, state.cells);
  assert.equal(back.captureOne, state.captureOne);
  assert.equal(back.captureTwo, state.captureTwo);
  assert.equal(back.currentPlayerRaw, 2);
  assert.equal(back.isGameOver, true);
  assert.equal(back.winnerRaw, 2);

  // Board rebuilt from the state matches the original grid
  const rebuilt = GameBoard.fromState(back);
  assert.equal(rebuilt.grid[10][10], ONE);
  assert.equal(rebuilt.grid[5][6], EMPTY, 'captured stone came back');
  assert.equal(rebuilt.captureCount[TWO], 1);
});

test('draw state round trips', () => {
  const state = new GameBoard().toState(ONE, true, null);
  const back = decodeState(encodeState(state));
  assert.ok(back);
  assert.equal(back.isGameOver, true);
  assert.equal(back.winnerRaw, null);
});

test('malformed payloads are rejected', () => {
  assert.equal(decodeState('garbage'), null);

  // Truncated grid: 5 rows instead of 22 (would crash GameBoard.fromState)
  let bad = initialState();
  bad.cells = bad.cells.slice(0, 5);
  assert.equal(decodeState(encodeState(bad)), null);

  // Short row
  bad = initialState();
  bad.cells[3] = bad.cells[3].slice(0, 2);
  assert.equal(decodeState(encodeState(bad)), null);

  // Out-of-range cell value
  bad = initialState();
  bad.cells[0][0] = 9;
  assert.equal(decodeState(encodeState(bad)), null);

  // Impossible capture count and bad player raw
  bad = initialState();
  bad.captureOne = 99;
  assert.equal(decodeState(encodeState(bad)), null);

  bad = initialState();
  bad.currentPlayerRaw = 3;
  assert.equal(decodeState(encodeState(bad)), null);
});

test('valid initial state decodes', () => {
  assert.ok(decodeState(encodeState(initialState())));
});
