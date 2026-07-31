// Port of TEWGOTests/GameBoardTests.swift (iOS repo). Locks in the rules
// engine: wins, captures, edges, validation and draw behavior.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GameBoard, SIZE, EMPTY, ONE, TWO } from '../play/engine/board.js';
import { initialState } from '../play/engine/state.js';

function board({ one = [], two = [] } = {}) {
  const b = new GameBoard();
  for (const [r, c] of one) b.place(ONE, r, c);
  for (const [r, c] of two) b.place(TWO, r, c);
  return b;
}

// ----- Wins -----

test('five in a row wins on all four axes', () => {
  for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
    const b = new GameBoard();
    let last = [0, 0];
    for (let i = 0; i < 5; i += 1) {
      const r = 10 + i * dr;
      const c = 10 + i * dc;
      b.place(ONE, r, c);
      last = [r, c];
    }
    assert.ok(b.checkWin(ONE, last[0], last[1]), `no win on axis (${dr},${dc})`);
  }
});

test('four in a row is not a win', () => {
  const b = board({ one: [[10, 5], [10, 6], [10, 7], [10, 8]] });
  assert.equal(b.checkWin(ONE, 10, 8), false);
});

test('overline counts as win', () => {
  // Six in a row: standard Pente treats 5+ as a win.
  const b = new GameBoard();
  for (let c = 5; c <= 10; c += 1) b.place(ONE, 10, c);
  assert.ok(b.checkWin(ONE, 10, 7));
});

test('win at board edge', () => {
  const b = new GameBoard();
  for (let c = 0; c <= 4; c += 1) b.place(ONE, 0, c);
  assert.ok(b.checkWin(ONE, 0, 0));
});

test('five captured pairs win', () => {
  const b = new GameBoard();
  for (let i = 0; i < 5; i += 1) {
    const r = i * 3;
    b.place(TWO, r, 14);
    b.place(ONE, r, 15);
    b.place(ONE, r, 16);
    b.place(TWO, r, 17); // captures the pair
  }
  assert.equal(b.captureCount[TWO], 5);
  assert.ok(b.checkWin(TWO, 12, 17));
  assert.equal(b.winReason(TWO), 'fiveCaptures');
});

// ----- Captures -----

test('capture both directions from one move', () => {
  // Placing at (10,7) closes pairs on both sides:
  // [two][one][one][*] left and [*][one][one][two] right.
  const b = new GameBoard();
  b.place(TWO, 10, 4);
  b.place(ONE, 10, 5);
  b.place(ONE, 10, 6);
  b.place(ONE, 10, 8);
  b.place(ONE, 10, 9);
  b.place(TWO, 10, 10);
  const captures = b.place(TWO, 10, 7);
  assert.equal(captures.length, 2);
  assert.equal(b.captureCount[TWO], 2);
  assert.equal(b.grid[10][5], EMPTY);
  assert.equal(b.grid[10][6], EMPTY);
  assert.equal(b.grid[10][8], EMPTY);
  assert.equal(b.grid[10][9], EMPTY);
});

test('no self-capture when placing into flank', () => {
  // Standard Pente: moving INTO [opp][.][.][opp] with your pair is safe.
  const b = new GameBoard();
  b.place(TWO, 10, 4);
  b.place(TWO, 10, 7);
  b.place(ONE, 10, 5);
  const captures = b.place(ONE, 10, 6);
  assert.equal(captures.length, 0);
  assert.equal(b.grid[10][5], ONE);
  assert.equal(b.grid[10][6], ONE);
});

test('no capture across board edge', () => {
  // [one][one][two] hugging the left edge: no fourth cell, no capture.
  const b = new GameBoard();
  b.place(ONE, 10, 0);
  b.place(ONE, 10, 1);
  const captures = b.place(TWO, 10, 2);
  assert.equal(captures.length, 0);
  assert.equal(b.grid[10][0], ONE);
});

test('single stone is not capturable', () => {
  // [two][one][two] must not capture: pairs only.
  const b = new GameBoard();
  b.place(TWO, 10, 4);
  b.place(ONE, 10, 5);
  const captures = b.place(TWO, 10, 6);
  assert.equal(captures.length, 0);
  assert.equal(b.grid[10][5], ONE);
});

// ----- Validation and draw -----

test('place on occupied cell is rejected', () => {
  const b = new GameBoard();
  b.place(ONE, 10, 10);
  const captures = b.place(TWO, 10, 10);
  assert.equal(captures.length, 0);
  assert.equal(b.grid[10][10], ONE, 'occupied cell was overwritten');
});

test('place out of bounds is rejected', () => {
  const b = new GameBoard();
  b.place(ONE, -1, 0);
  b.place(ONE, 0, SIZE);
  assert.equal(b.isFull(), false);
  assert.ok(b.grid.every((row) => row.every((v) => v === EMPTY)));
});

test('isFull', () => {
  let b = new GameBoard();
  assert.equal(b.isFull(), false);
  // Filling in a capture-free way is complex; instead rebuild from a full
  // GameState, the same code path used by multiplayer restore on iOS.
  const state = initialState();
  state.cells = state.cells.map(() => new Array(SIZE).fill(1));
  state.cells[0][0] = 2;
  b = GameBoard.fromState(state);
  assert.ok(b.isFull());
});
