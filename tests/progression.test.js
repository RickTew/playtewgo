// Tests for engine/progression.js (port of ProgressionManager.swift).
// Storage is injected, so a plain object stands in for localStorage.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProgression, GOLD_WIN_THRESHOLD } from '../play/engine/progression.js';

function fakeStorage(initial = {}) {
  const map = { ...initial };
  return {
    getItem: (k) => (k in map ? map[k] : null),
    setItem: (k, v) => { map[k] = String(v); },
    dump: () => map,
  };
}

test('starts at zero on first run', () => {
  const p = createProgression(fakeStorage());
  assert.equal(p.gamesCompleted(), 0);
  assert.equal(p.wins(), 0);
  assert.equal(p.losses(), 0);
  assert.equal(p.winsInTheme('space'), 0);
  assert.equal(p.isGoldUnlocked('space'), false);
  assert.equal(p.winsUntilGold('space'), GOLD_WIN_THRESHOLD);
});

test('records wins, losses, and completions independently', () => {
  const p = createProgression(fakeStorage());
  p.recordGameCompleted();
  p.recordWin('space');
  p.recordGameCompleted();
  p.recordLoss();
  p.recordGameCompleted(); // a draw: completed, no win or loss
  assert.equal(p.gamesCompleted(), 3);
  assert.equal(p.wins(), 1);
  assert.equal(p.losses(), 1);
  assert.equal(p.winsInTheme('space'), 1);
});

test('gold unlocks per theme at the threshold', () => {
  const p = createProgression(fakeStorage());
  for (let i = 0; i < GOLD_WIN_THRESHOLD - 1; i++) p.recordWin('ocean');
  assert.equal(p.isGoldUnlocked('ocean'), false);
  assert.equal(p.winsUntilGold('ocean'), 1);
  p.recordWin('ocean');
  assert.equal(p.isGoldUnlocked('ocean'), true);
  assert.equal(p.winsUntilGold('ocean'), 0);
  // Other themes stay locked: wins are a per-theme currency.
  assert.equal(p.isGoldUnlocked('space'), false);
  assert.equal(p.winsUntilGold('space'), GOLD_WIN_THRESHOLD);
});

test('persists and reloads through storage', () => {
  const storage = fakeStorage();
  const p = createProgression(storage);
  p.recordGameCompleted();
  p.recordWin('desert');
  p.recordLoss();
  const back = createProgression(storage);
  assert.equal(back.gamesCompleted(), 1);
  assert.equal(back.wins(), 1);
  assert.equal(back.losses(), 1);
  assert.equal(back.winsInTheme('desert'), 1);
});

test('corrupt or foreign saved data resets to zero, not a crash', () => {
  for (const bad of ['not json', '42', '{"wins":"ten","winsByTheme":{"space":-3}}', 'null']) {
    const p = createProgression(fakeStorage({ 'tewgo.web.progress': bad }));
    assert.equal(p.gamesCompleted(), 0);
    assert.equal(p.wins(), 0);
    assert.equal(p.winsInTheme('space'), 0);
  }
});

test('a storage that throws never breaks recording', () => {
  const p = createProgression({
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('quota'); },
  });
  p.recordGameCompleted();
  p.recordWin('space');
  p.recordLoss();
  assert.equal(p.gamesCompleted(), 1);
  assert.equal(p.wins(), 1);
  assert.equal(p.losses(), 1);
});
