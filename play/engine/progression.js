// Port of TEWGO/Game/ProgressionManager.swift (iOS repo): games/wins/losses
// counters plus per-theme wins, the currency of the Gold rare-finish loop.
// Same anti-grind rule as iOS: pass-and-play games never record (a player
// could grind unlocks against themselves in seconds per game), so game.js
// only calls this for vs-AI games.
// Storage is injected so Node tests can pass a plain object instead of
// localStorage; a quota error or private-mode block just loses persistence,
// never gameplay.

/** Wins in a theme needed to unlock its rare Gold color scheme (iOS
 *  ProgressionManager.rareFinishWinThreshold). */
export const GOLD_WIN_THRESHOLD = 10;

const KEY = 'tewgo.web.progress';

export function createProgression(storage) {
  let data = { gamesCompleted: 0, wins: 0, losses: 0, winsByTheme: {} };
  try {
    const saved = JSON.parse(storage.getItem(KEY));
    if (saved && typeof saved === 'object') {
      data.gamesCompleted = Number.isInteger(saved.gamesCompleted) ? saved.gamesCompleted : 0;
      data.wins = Number.isInteger(saved.wins) ? saved.wins : 0;
      data.losses = Number.isInteger(saved.losses) ? saved.losses : 0;
      if (saved.winsByTheme && typeof saved.winsByTheme === 'object') {
        for (const [k, v] of Object.entries(saved.winsByTheme)) {
          if (Number.isInteger(v) && v > 0) data.winsByTheme[k] = v;
        }
      }
    }
  } catch { /* first run or corrupt save: start at zero */ }

  function persist() {
    try { storage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }

  return {
    recordGameCompleted() {
      data.gamesCompleted += 1;
      persist();
    },
    recordWin(themeId) {
      data.wins += 1;
      if (themeId) data.winsByTheme[themeId] = (data.winsByTheme[themeId] || 0) + 1;
      persist();
    },
    recordLoss() {
      data.losses += 1;
      persist();
    },
    gamesCompleted() { return data.gamesCompleted; },
    wins() { return data.wins; },
    losses() { return data.losses; },
    winsInTheme(themeId) { return data.winsByTheme[themeId] || 0; },
    isGoldUnlocked(themeId) { return this.winsInTheme(themeId) >= GOLD_WIN_THRESHOLD; },
    winsUntilGold(themeId) { return Math.max(0, GOLD_WIN_THRESHOLD - this.winsInTheme(themeId)); },
  };
}
