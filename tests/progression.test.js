// Tests for engine/progression.js (port of ProgressionManager.swift).
// Storage is injected, so a plain object stands in for localStorage.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProgression, GOLD_WIN_THRESHOLD, THEME_UNLOCK_AFTER } from '../play/engine/progression.js';

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

test('records the result per difficulty as well as overall', () => {
  // Persona round 2 (Priya): beating Easy and beating Expert were the
  // same integer, so the ladder never wrote down which rung you reached.
  const p = createProgression(fakeStorage());
  p.recordWin('space', 'easy');
  p.recordWin('space', 'expert');
  p.recordLoss('expert');
  p.recordLoss('expert');
  assert.equal(p.winsAt('easy'), 1);
  assert.equal(p.winsAt('expert'), 1);
  assert.equal(p.lossesAt('expert'), 2);
  assert.equal(p.lossesAt('hard'), 0, 'an untouched rung reads zero, not undefined');
  // The overall totals still count everything.
  assert.equal(p.wins(), 2);
  assert.equal(p.losses(), 2);
});

test('the by-level row stays hidden until there is a result', () => {
  const p = createProgression(fakeStorage());
  assert.equal(p.hasDifficultyRecord(), false, 'a fresh profile must show no row');
  // A recorded game with no difficulty (a shape the codec allows) still
  // must not light the row up with zeros.
  p.recordWin('space');
  assert.equal(p.hasDifficultyRecord(), false);
  p.recordLoss('medium');
  assert.equal(p.hasDifficultyRecord(), true);
});

test('per-difficulty records survive a reload', () => {
  const storage = fakeStorage();
  const first = createProgression(storage);
  first.recordWin('ocean', 'hard');
  first.recordLoss('hard');
  const second = createProgression(storage);
  assert.equal(second.winsAt('hard'), 1);
  assert.equal(second.lossesAt('hard'), 1);
  assert.equal(second.hasDifficultyRecord(), true);
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

// ---- Theme unlock gating (iOS ProgressionManager.isUnlocked) ----

const ORDER = ['space', 'feudaljapan', 'dungeon', 'ocean', 'undead', 'western', 'desert', 'classic'];

function playGames(p, n) {
  for (let i = 0; i < n; i += 1) p.recordGameCompleted();
}

test('the two starter themes are open on a brand new profile', () => {
  const p = createProgression(fakeStorage());
  assert.equal(p.isThemeUnlocked('space'), true);
  assert.equal(p.isThemeUnlocked('feudaljapan'), true);
  assert.equal(p.gamesUntilTheme('space'), 0);
  for (const id of ORDER.slice(2)) {
    assert.equal(p.isThemeUnlocked(id), false, id + ' should start locked');
  }
});

test('themes open at their thresholds, counting games not wins', () => {
  const p = createProgression(fakeStorage());
  playGames(p, 3);           // three losses still counts as three games
  assert.equal(p.wins(), 0);
  assert.equal(p.isThemeUnlocked('dungeon'), true);
  assert.equal(p.isThemeUnlocked('ocean'), false);
  assert.equal(p.gamesUntilTheme('ocean'), 4);
  playGames(p, 4);
  assert.equal(p.isThemeUnlocked('ocean'), true);
  assert.equal(p.gamesUntilTheme('ocean'), 0);
});

test('every threshold matches the iOS registry', () => {
  const expected = { space: 0, feudaljapan: 0, dungeon: 3, ocean: 7, undead: 12, western: 20, desert: 30, classic: 38 };
  assert.deepEqual(THEME_UNLOCK_AFTER, expected);
  for (const [id, need] of Object.entries(expected)) {
    const p = createProgression(fakeStorage());
    playGames(p, Math.max(0, need - 1));
    assert.equal(p.isThemeUnlocked(id), need === 0, id + ' one game short');
    p.recordGameCompleted();
    assert.equal(p.isThemeUnlocked(id), true, id + ' at the threshold');
  }
});

test('nextLockedTheme walks the registry order and ends at null', () => {
  const p = createProgression(fakeStorage());
  assert.equal(p.nextLockedTheme(ORDER), 'dungeon');
  playGames(p, 3);
  assert.equal(p.nextLockedTheme(ORDER), 'ocean');
  playGames(p, 35);
  assert.equal(p.gamesCompleted(), 38);
  assert.equal(p.nextLockedTheme(ORDER), null);
});

test('the full unlock opens every theme and zeroes the countdowns', () => {
  const p = createProgression(fakeStorage());
  assert.equal(p.hasPro(), false);
  p.grantPro('stripe');
  assert.equal(p.hasPro(), true);
  assert.equal(p.proSource(), 'stripe');
  for (const id of ORDER) {
    assert.equal(p.isThemeUnlocked(id), true, id);
    assert.equal(p.gamesUntilTheme(id), 0, id);
  }
  assert.equal(p.nextLockedTheme(ORDER), null);
});

test('the full unlock persists and remembers which rail granted it', () => {
  const storage = fakeStorage();
  createProgression(storage).grantPro('steam');
  const back = createProgression(storage);
  assert.equal(back.hasPro(), true);
  assert.equal(back.proSource(), 'steam');
  assert.equal(back.isThemeUnlocked('classic'), true);
});

test('an unknown theme id is treated as free rather than locked forever', () => {
  const p = createProgression(fakeStorage());
  assert.equal(p.isThemeUnlocked('brandnew'), true);
  assert.equal(p.gamesUntilTheme('brandnew'), 0);
});
