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

/**
 * Games completed before each theme opens, copied from unlockAfterGames in
 * the iOS ThemeRegistry. Space and Feudal Japan are free so a new player has
 * two worlds to play in; the rest are earned. Note this counts COMPLETED
 * GAMES, not wins, so losing still makes progress.
 */
export const THEME_UNLOCK_AFTER = {
  space: 0,
  feudaljapan: 0,
  dungeon: 3,
  ocean: 7,
  undead: 12,
  western: 20,
  desert: 30,
  classic: 38,
};

const KEY = 'tewgo.web.progress';
const PRO_KEY = 'tewgo.web.pro';

export function createProgression(storage) {
  let data = { gamesCompleted: 0, wins: 0, losses: 0, winsByTheme: {} };
  // The paid full unlock. Kept in its own key, and stored as the name of the
  // rail that granted it ('stripe', 'steam', ...) rather than a bare true, so
  // a second rail can be added later without a migration. This is a local
  // convenience cache only: it is trivially editable in devtools, so anything
  // that costs money must re-verify server side before it is honored.
  let proSource = null;
  try {
    const s = storage.getItem(PRO_KEY);
    if (s) proSource = String(s);
  } catch { /* private mode: no entitlement cache, re-check on demand */ }
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

    /** Which rail granted the full unlock ('stripe', 'steam'), or null. */
    proSource() { return proSource; },
    hasPro() { return proSource !== null; },
    /** Called by a payment rail once its own verification has succeeded. */
    grantPro(source) {
      proSource = String(source);
      try { storage.setItem(PRO_KEY, proSource); } catch { /* ignore */ }
    },

    /**
     * Mirrors ProgressionManager.isUnlocked: free themes are always open, the
     * full unlock opens everything, otherwise it is earned by finishing games.
     * Unknown theme ids are treated as free so a new theme can never lock
     * itself out by being added here before the table is updated.
     */
    isThemeUnlocked(themeId) {
      const need = THEME_UNLOCK_AFTER[themeId];
      if (need === undefined || need === 0) return true;
      return proSource !== null || data.gamesCompleted >= need;
    },
    gamesUntilTheme(themeId) {
      const need = THEME_UNLOCK_AFTER[themeId];
      if (need === undefined || proSource !== null) return 0;
      return Math.max(0, need - data.gamesCompleted);
    },
    /**
     * The next theme the player is working toward, in registry order, or null
     * when everything is open. Drives the "next unlock" card on the profile.
     */
    nextLockedTheme(order) {
      return order.find((id) => !this.isThemeUnlocked(id)) ?? null;
    },
  };
}
