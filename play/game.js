// TEWGO web: board rendering and game flow. The human is player ONE (gold)
// and always moves first; the AI is player TWO (blue). The game auto-saves
// to localStorage through the same state codec the iOS app uses for
// multiplayer payloads.

import { GameBoard, SIZE, ONE, TWO, opponentOf } from './engine/board.js';
import { GameAI } from './engine/ai.js';
import { encodeState, decodeState } from './engine/state.js';
import { THEMES, NEUTRALS, sceneByKey, paintScene } from './themes.js';
import { FIGURES, figureHeight, drawFigure, traceFigure, COLOR_SCHEMES, paletteFor } from './pieces.js';
import { boardsForTheme, boardByKey, paintBoardRect } from './boards.js';
import { createProgression, GOLD_WIN_THRESHOLD, THEME_ORDER, THEME_UNLOCK_AFTER } from './engine/progression.js';
import { startCheckout, handleReturn, restoreWithCode, savedCode } from './unlock.js';

const HUMAN = ONE;
const AI_PLAYER = TWO;
const progression = createProgression(localStorage);
const SAVE_KEY = 'tewgo.web.game';
const DIFFICULTY_KEY = 'tewgo.web.difficulty';
const MODE_KEY = 'tewgo.web.mode';
const THEME_KEY = 'tewgo.web.theme';
const AI_DELAY_MS = 350;
const POP_MS = 160;
const FADE_MS = 320;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const youPairsEl = document.getElementById('youPairs');
const aiPairsEl = document.getElementById('aiPairs');
const overlayEl = document.getElementById('overlay');
const overlayTitleEl = document.getElementById('overlayTitle');
const overlayReasonEl = document.getElementById('overlayReason');
const difficultyEl = document.getElementById('difficulty');
const newGameEl = document.getElementById('newGame');
const playAgainEl = document.getElementById('playAgain');
const soundToggleEl = document.getElementById('soundToggle');
const musicToggleEl = document.getElementById('musicToggle');
const introEl = document.getElementById('intro');
const introAiNameEl = document.getElementById('introAiName');
const introP1NameEl = document.getElementById('introP1Name');
const shareBtnEl = document.getElementById('shareBtn');
const modeEl = document.getElementById('mode');
const difficultyLabelEl = document.getElementById('difficultyLabel');
const youLabelEl = document.getElementById('youLabel');
const aiLabelEl = document.getElementById('aiLabel');

let board = new GameBoard();
let current = HUMAN;
let gameOver = false;
let winner = null;
let mode = 'ai'; // 'ai' | '2p' (pass and play on one device)
let theme = 'space';
let sceneKey = THEMES.space.defaultScene;
const pieceKind = { [ONE]: 'robot', [TWO]: 'alien' };

// The player's own name, shown on their shelf and their profile. Declared up
// here with the rest of the player state because nameOf() reads it.
const NAME_KEY = 'tewgo.web.playerName';
let playerName = 'Player One';
try {
  const savedName = localStorage.getItem(NAME_KEY);
  if (savedName && savedName.trim()) playerName = savedName.trim().slice(0, 20);
} catch { /* private mode: stay with the default name */ }

// Piece TYPE (iOS PieceVariant): flat disc / chip / compact figure / tall
// figure. Global across themes, like tewgo.pieceVariant on iOS.
const VARIANT_KEY = 'tewgo.web.pieceVariant';
const VARIANTS = [
  { key: 'flat', name: 'Flat' },
  { key: 'chip', name: 'Chip' },
  { key: 'half', name: 'Half' },
  { key: 'tall', name: 'Tall' },
];
let variant = 'tall';

// Board surface (iOS BoardPanelStyle). Global, like tewgo.boardPanelStyle.
const BOARD_KEY = 'tewgo.web.board';
let boardKey = 'none';

// Grid style (iOS BoardStyle): dots (iOS default) / grid lines / boxes /
// none. Boxes shifts the lines half a cell so pieces sit inside cells.
const GRID_KEY = 'tewgo.web.boardStyle';
const GRID_STYLES = [
  { key: 'dots', name: 'Dots' },
  { key: 'grid', name: 'Lines' },
  { key: 'boxes', name: 'Boxes' },
  { key: 'none', name: 'None' },
];
let gridStyle = 'dots';

// Piece FINISH (iOS tewgo.pieceFinish): classic | dimensional faux-3D.
const FINISH_KEY = 'tewgo.web.pieceFinish';
let finish = 'classic';

// Color scheme (iOS tewgo.pieceColor): recolors both sides as a pair.
const COLOR_KEY = 'tewgo.web.pieceColor';
let colorScheme = 'original';

// Effective palette for a side under the current color scheme.
function styleFor(side) {
  return paletteFor(pieceKind[side], side === ONE ? 0 : 1, colorScheme);
}

function themeDef() {
  return THEMES[theme];
}

function pieceStorageKey(side) {
  return `tewgo.web.piece.${theme}.${side}`;
}

function sceneStorageKey() {
  return `tewgo.web.scene.${theme}`;
}

// Scene + piece choices are remembered per theme, like the iOS
// tewgo.piece.<themeId> / tewgo.bg.<themeId> keys.
function loadThemePrefs() {
  const t = themeDef();
  [pieceKind[ONE], pieceKind[TWO]] = t.defaults;
  sceneKey = t.defaultScene;
  try {
    for (const side of [ONE, TWO]) {
      const saved = localStorage.getItem(pieceStorageKey(side));
      if (saved && t.figures.includes(saved)) pieceKind[side] = saved;
    }
    if (pieceKind[ONE] === pieceKind[TWO]) [pieceKind[ONE], pieceKind[TWO]] = t.defaults;
    const savedScene = localStorage.getItem(sceneStorageKey());
    if (savedScene && (t.scenes.some((s) => s.key === savedScene) || NEUTRALS.some((n) => n.key === savedScene))) {
      sceneKey = savedScene;
    }
  } catch { /* ignore */ }
}

function isAiGame() {
  return mode === 'ai';
}

function nameOf(player) {
  // Pass-and-play has two humans at one device, so the figures name the
  // sides; vs AI, the player's own name goes on their shelf.
  if (isAiGame()) return player === HUMAN ? playerName : 'AI';
  return FIGURES[pieceKind[player]].name;
}
let lastMove = null;
let aiTimer = null;
let hover = null; // [row, col] ghost-stone preview, mouse only
let anims = []; // {type:'pop'|'fade', row, col, player, start}
let rafId = null;

// ----- Audio -----
// Mirrors the iOS AudioManager behavior: place on every stone, capture
// layered on top when a capture fires, looping in-game music, and on game
// over the music stops and the victory sting plays. Space theme tracks.
// Browsers block audio until the first user gesture, so music starts on
// the first interaction rather than on page load.

const SOUND_KEY = 'tewgo.web.sound';
const MUSIC_KEY = 'tewgo.web.music';

function readPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === '1';
  } catch { return fallback; }
}

function writePref(key, value) {
  try { localStorage.setItem(key, value ? '1' : '0'); } catch { /* ignore */ }
}

let soundOn = readPref(SOUND_KEY, true);
let musicOn = readPref(MUSIC_KEY, true);
let music = null;
// The victory track can be a full song (Ocean's fanfare), so it needs a
// handle: starting the next game's music must replace it, like the iOS
// single music channel - otherwise it plays OVER the new game's music.
let victoryAudio = null;

function playSfx(name) {
  if (!soundOn) return;
  const a = new Audio(`audio/${theme}/${name}.m4a`);
  a.play().catch(() => { /* pre-gesture or unsupported: stay silent */ });
}

function playVictory() {
  if (!soundOn) return;
  victoryAudio = new Audio(`audio/${theme}/victory.m4a`);
  victoryAudio.play().catch(() => { /* pre-gesture: stay silent */ });
}

function stopVictory() {
  if (victoryAudio) {
    victoryAudio.pause();
    victoryAudio = null;
  }
}

function ensureMusic() {
  if (gameOver) return;
  stopVictory();
  if (!musicOn) return;
  if (!music) {
    music = new Audio(`audio/${theme}/ingame.m4a`);
    music.loop = true;
    music.volume = 0.45;
  }
  music.play().catch(() => { /* pre-gesture: retried on next interaction */ });
}

function resetMusicForTheme() {
  stopMusic();
  stopVictory();
  music = null;
}

function stopMusic() {
  if (music) music.pause();
}

function updateToggles() {
  soundToggleEl.classList.toggle('off', !soundOn);
  musicToggleEl.classList.toggle('off', !musicOn);
}

// ----- Match intro -----
// Mirrors the iOS MatchIntroView: contenders slide in around a VS mark,
// auto-dismisses after 2.2s, any tap skips it.

let introTimer = null;

function difficultyLabel() {
  const v = difficultyEl.value;
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function drawIntroPiece(canvasEl, side) {
  const kind = pieceKind[side];
  const c = canvasEl.getContext('2d');
  c.setTransform(2, 0, 0, 2, 0, 0); // canvas is 184px backing for 92px CSS
  c.clearRect(0, 0, 92, 92);
  const r = 25;
  const feetY = (92 + figureHeight(kind) * r) / 2;
  drawFigure(c, kind, 46, feetY, r, 1, { palette: styleFor(side), finish });
}

function showIntro() {
  document.getElementById('introCaption').textContent = themeDef().name.toUpperCase();
  introP1NameEl.textContent = isAiGame() ? `You · ${FIGURES[pieceKind[ONE]].name}` : nameOf(ONE);
  introAiNameEl.textContent = isAiGame() ? `AI · ${difficultyLabel()}` : nameOf(TWO);
  drawIntroPiece(document.getElementById('introP1Piece'), ONE);
  drawIntroPiece(document.getElementById('introP2Piece'), TWO);
  introEl.classList.remove('appear', 'leaving');
  introEl.classList.add('show');
  // setTimeout, not requestAnimationFrame: rAF never fires in hidden tabs,
  // which would leave the intro stuck in its pre-animation state.
  setTimeout(() => introEl.classList.add('appear'), 30);
  introTimer = setTimeout(dismissIntro, 2200);
}

function dismissIntro() {
  if (introTimer) {
    clearTimeout(introTimer);
    introTimer = null;
  }
  if (!introEl.classList.contains('show') || introEl.classList.contains('leaving')) return;
  introEl.classList.add('leaving');
  setTimeout(() => introEl.classList.remove('show', 'appear', 'leaving'), 320);
}

// ----- Victory share card -----
// Mirrors the iOS VictoryShareCard 900x900 layout, plus the site URL since
// on the web the card doubles as the invite link.

function renderShareCard() {
  const size = 900;
  const scale = 2;
  const card = document.createElement('canvas');
  card.width = size * scale;
  card.height = size * scale;
  const c = card.getContext('2d');
  c.scale(scale, scale);

  c.fillStyle = '#0d0d1f';
  c.fillRect(0, 0, size, size);

  c.textAlign = 'center';
  const setSpacing = (px) => { try { c.letterSpacing = `${px}px`; } catch { /* older browser */ } };

  const w = winner ?? ONE; // dev preview hook renders player one's card
  const title = isAiGame() ? 'YOU WIN!' : `${nameOf(w).toUpperCase()} WINS!`;

  c.fillStyle = '#ffd60a';
  c.font = '900 64px system-ui, -apple-system, sans-serif';
  setSpacing(0);
  c.fillText(title, size / 2, 300);

  c.fillStyle = 'rgba(255,255,255,0.85)';
  c.font = '600 26px system-ui, -apple-system, sans-serif';
  setSpacing(3);
  const reason = board.winReason(w) === 'fiveCaptures' ? 'CAPTURED FIVE PAIRS' : 'FIVE IN A ROW';
  c.fillText(reason, size / 2, 370);

  // Row of five winner figures
  const kind = pieceKind[w];
  const rf = 40;
  const feetY = 490 + (figureHeight(kind) * rf) / 2;
  for (let i = 0; i < 5; i += 1) {
    drawFigure(c, kind, size / 2 + (i - 2) * 130, feetY, rf, 1, { palette: styleFor(w), finish });
  }

  c.fillStyle = 'rgba(255,255,255,0.65)';
  c.font = '700 18px system-ui, -apple-system, sans-serif';
  setSpacing(4);
  c.fillText(themeDef().name.toUpperCase(), size / 2, 690);

  c.font = '900 48px system-ui, -apple-system, sans-serif';
  setSpacing(0);
  const tewWidth = c.measureText('TEW').width;
  const goWidth = c.measureText('GO').width;
  const logoLeft = size / 2 - (tewWidth + goWidth) / 2;
  c.textAlign = 'left';
  c.fillStyle = '#ffffff';
  c.fillText('TEW', logoLeft, 760);
  c.fillStyle = '#ffd60a';
  c.fillText('GO', logoLeft + tewWidth, 760);
  c.textAlign = 'center';

  c.fillStyle = '#8e8e93';
  c.font = '14px system-ui, -apple-system, sans-serif';
  setSpacing(2);
  c.fillText('five in a row  ·  two to capture', size / 2, 800);

  c.fillStyle = '#ffd60a';
  c.font = '600 20px system-ui, -apple-system, sans-serif';
  setSpacing(1);
  c.fillText('play free at playtewgo.com', size / 2, 850);

  return card;
}

async function shareCard() {
  const card = renderShareCard();
  const blob = await new Promise((res) => card.toBlob(res, 'image/png'));
  if (!blob) return;
  const file = new File([blob], 'tewgo-victory.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'TEWGO',
        text: `${isAiGame() ? 'I' : nameOf(winner ?? ONE)} won at TEWGO! Play free: https://playtewgo.com/play/`,
      });
      return;
    } catch { /* user cancelled the share sheet: fall through to nothing */ return; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tewgo-victory.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ----- Persistence -----

function save() {
  try {
    localStorage.setItem(SAVE_KEY, encodeState(board.toState(current, gameOver, winner)));
  } catch { /* private browsing: play without saving */ }
}

function restore() {
  let text = null;
  try { text = localStorage.getItem(SAVE_KEY); } catch { return false; }
  const state = text && decodeState(text);
  if (!state || state.isGameOver) return false;
  // An untouched board is not a game in progress: those visitors should
  // land on the setup screen, not resume onto an empty board.
  if (!state.cells.some((row) => row.some((v) => v !== 0))) return false;
  board = GameBoard.fromState(state);
  current = state.currentPlayerRaw;
  gameOver = false;
  winner = null;
  return true;
}

// ----- Layout -----

// Intersection-based layout, like the iOS board: dots on intersections,
// stones centered on them.
function metrics() {
  const size = canvas.clientWidth;
  const cell = size / (SIZE + 0.6);
  const margin = (size - cell * (SIZE - 1)) / 2;
  return { size, cell, margin };
}

function pointFor(row, col, m) {
  return [m.margin + col * m.cell, m.margin + row * m.cell];
}

function cellAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const m = metrics();
  const col = Math.round((clientX - rect.left - m.margin) / m.cell);
  const row = Math.round((clientY - rect.top - m.margin) / m.cell);
  if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return null;
  return [row, col];
}

// ----- Animations -----

function pushPop(row, col) {
  anims.push({ type: 'pop', row, col, player: null, start: performance.now() });
}

function pushFades(captures, capturedPlayer) {
  const start = performance.now();
  for (const cap of captures) {
    anims.push({ type: 'fade', row: cap.row1, col: cap.col1, player: capturedPlayer, start });
    anims.push({ type: 'fade', row: cap.row2, col: cap.col2, player: capturedPlayer, start });
  }
}

function animTick() {
  rafId = null;
  draw();
  const now = performance.now();
  anims = anims.filter((a) => now - a.start < (a.type === 'pop' ? POP_MS : FADE_MS));
  if (anims.length > 0) rafId = requestAnimationFrame(animTick);
}

function kickAnims() {
  if (rafId === null && anims.length > 0) rafId = requestAnimationFrame(animTick);
}

// ----- Rendering -----

// A "stone" renders per the chosen piece TYPE (iOS PieceVariant):
// flat = pebble disc with accent eye; chip = checker disc with the figure
// silhouette as a logo; half = compact figure (~1 cell); tall = chess-style
// figure that deliberately overhangs the cell above (drawn top row first,
// so nearer pieces overlap ones behind).
function drawStone(x, y, radius, player, alpha = 1) {
  const kind = pieceKind[player];
  const f = styleFor(player);
  if (variant === 'half' || variant === 'tall') {
    const rf = variant === 'tall' ? radius : radius * 0.68;
    drawFigure(ctx, kind, x, y + radius * 0.98, rf, alpha, { palette: f, finish });
    return;
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  const halo = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 1.5);
  halo.addColorStop(0, `rgba(${f.glowRgb}, 0.18)`);
  halo.addColorStop(1, `rgba(${f.glowRgb}, 0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
  ctx.fill();

  if (variant === 'flat') {
    ctx.fillStyle = f.primary;
    ctx.strokeStyle = f.stroke;
    ctx.lineWidth = Math.max(1, radius * 0.09);
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.92, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = f.accent;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // chip: visible depth + white figure-silhouette logo
    const cr = radius * 1.02;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.arc(x, y + cr * 0.16, cr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = f.primary;
    ctx.strokeStyle = f.stroke;
    ctx.lineWidth = Math.max(1, radius * 0.08);
    ctx.beginPath();
    ctx.arc(x, y, cr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    const lr = (cr * 1.7) / figureHeight(kind);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    traceFigure(ctx, kind, x, y + (figureHeight(kind) * lr) / 2, lr);
    ctx.fill();
  }
  ctx.restore();
}

function draw() {
  const m = metrics();
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(m.size * dpr)) {
    canvas.width = Math.round(m.size * dpr);
    canvas.height = Math.round(m.size * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, m.size, m.size);

  const now = performance.now();
  const radius = m.cell * 0.42;

  // Board slab beneath the grid (BoardPanelStyle equivalent)
  if (boardKey !== 'none') {
    const pad = m.cell * 0.55;
    paintBoardRect(ctx, boardKey, m.margin - pad, m.margin - pad,
      m.size - 2 * (m.margin - pad), m.size - 2 * (m.margin - pad));
  }

  // Grid per the iOS BoardStyle: dark overlay whenever the surface under
  // it is light (a light board wins over the scene, like isLightSurface)
  const lightSurface = boardKey !== 'none'
    ? !!boardByKey(boardKey)?.light
    : sceneByKey(sceneKey)?.light;
  if (gridStyle === 'grid' || gridStyle === 'boxes') {
    const count = gridStyle === 'boxes' ? SIZE + 1 : SIZE;
    const offset = gridStyle === 'boxes' ? -0.5 : 0;
    const lo = m.margin + offset * m.cell;
    const hi = m.margin + (count - 1 + offset) * m.cell;
    ctx.strokeStyle = lightSurface ? 'rgba(20,20,30,0.20)' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < count; i += 1) {
      const p = m.margin + (i + offset) * m.cell;
      ctx.moveTo(lo, p);
      ctx.lineTo(hi, p);
      ctx.moveTo(p, lo);
      ctx.lineTo(p, hi);
    }
    ctx.stroke();
  } else if (gridStyle === 'dots') {
    ctx.fillStyle = lightSurface ? 'rgba(20,20,30,0.38)' : 'rgba(255,255,255,0.30)';
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        const [x, y] = pointFor(r, c, m);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, m.cell * 0.07), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Stones (with a scale-in pop on the newest one)
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const p = board.grid[r][c];
      if (p === 0) continue;
      const [x, y] = pointFor(r, c, m);
      let scale = 1;
      const pop = anims.find((a) => a.type === 'pop' && a.row === r && a.col === c);
      if (pop) {
        const t = Math.min(1, (now - pop.start) / POP_MS);
        scale = 0.55 + 0.45 * t;
      }
      drawStone(x, y, radius * scale, p);
    }
  }

  // Captured stones shrinking away (already removed from the grid)
  for (const a of anims) {
    if (a.type !== 'fade') continue;
    const t = Math.min(1, (now - a.start) / FADE_MS);
    const [x, y] = pointFor(a.row, a.col, m);
    drawStone(x, y, radius * (1 - 0.5 * t), a.player, 1 - t);
  }

  // Ghost stone under the mouse, in the color of whoever is to move
  if (hover && canPlay() && board.isValid(hover[0], hover[1])) {
    const [x, y] = pointFor(hover[0], hover[1], m);
    drawStone(x, y, radius, current, 0.35);
  }

  // Touch aim: crosshair guides across the board plus ghost and ring, so
  // the target row/column stay readable outside the finger
  if (touchAim && canPlay() && board.isValid(touchAim[0], touchAim[1])) {
    const [x, y] = pointFor(touchAim[0], touchAim[1], m);
    const [x0] = pointFor(0, 0, m);
    const [x1] = pointFor(0, SIZE - 1, m);
    ctx.strokeStyle = `rgba(${styleFor(current).glowRgb}, 0.45)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.moveTo(x, x0);
    ctx.lineTo(x, x1);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2);
    ctx.stroke();
    drawStone(x, y, radius, current, 0.55);
  }

  // No last-move marker: iOS draws none, and the web ring read as a stray
  // white circle. lastMove itself stays - endIfOver checks the win from it.
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 0xff) + 0.114 * (n & 0xff);
}

// Counter tint: the darker of the piece's two colors on light scenes,
// the lighter on dark scenes, so it stays readable either way.
function counterColor(side) {
  const f = styleFor(side);
  const sorted = [f.primary, f.stroke].sort((a, b) => luminance(a) - luminance(b));
  return sceneByKey(sceneKey)?.light ? sorted[0] : sorted[1];
}

// ----- Capture shelves -----
// Five sockets per side. A filled socket holds the PAIR that side captured,
// drawn as two of the enemy's own figures leaning together, so the shelf
// shows both how close the win is and whose pieces are gone.
const CAPTURES_TO_WIN = 5;
const shelfCanvases = { [ONE]: document.getElementById('youShelf'), [TWO]: document.getElementById('aiShelf') };
const shelfShown = { [ONE]: -1, [TWO]: -1 };

function drawShelf(side) {
  const cv = shelfCanvases[side];
  if (!cv) return;
  const count = board.captureCount[side];
  const cssW = cv.clientWidth;
  if (cssW === 0) return;
  // Sockets are square-ish and sized to the strip, so the shelf shrinks with
  // the board on a phone instead of overflowing it.
  const gap = Math.max(3, cssW * 0.02);
  const slot = (cssW - gap * (CAPTURES_TO_WIN - 1)) / CAPTURES_TO_WIN;
  const cssH = slot * 0.94;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(cssW * dpr);
  cv.height = Math.round(cssH * dpr);
  cv.style.height = cssH + 'px';
  const c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);

  const enemy = opponentOf(side);
  const light = sceneByKey(sceneKey)?.light;
  const full = count >= CAPTURES_TO_WIN;
  for (let i = 0; i < CAPTURES_TO_WIN; i += 1) {
    const x = i * (slot + gap);
    // The right-hand shelf fills toward its own edge so each side's trophies
    // sit under that side's label instead of drifting to the middle.
    const filled = side === ONE ? i < count : i >= CAPTURES_TO_WIN - count;
    c.beginPath();
    c.roundRect(x + 0.5, 0.5, slot - 1, cssH - 1, Math.max(4, slot * 0.16));
    c.fillStyle = light
      ? (filled ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.04)')
      : (filled ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.035)');
    c.fill();
    if (full) {
      c.strokeStyle = 'rgba(255,214,10,0.85)';
      c.lineWidth = 1.5;
    } else {
      c.strokeStyle = light ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.14)';
      c.lineWidth = 1;
    }
    c.stroke();
    if (!filled) continue;

    // Always the figure, never the flat/chip disc: a trophy shelf has to say
    // WHO was captured, and a plain disc says nothing.
    const kind = pieceKind[enemy];
    const r = (cssH * 0.72) / figureHeight(kind);
    const feetY = cssH - cssH * 0.13;
    const lean = slot * 0.15;
    for (const [dx, rot] of [[-lean, -0.2], [lean, 0.2]]) {
      c.save();
      c.translate(x + slot / 2 + dx, feetY);
      c.rotate(rot);
      drawFigure(c, kind, 0, 0, r, 1, { palette: styleFor(enemy), finish });
      c.restore();
    }
  }
  // A freshly taken pair pops the whole strip, which reads at a glance even
  // when the board has the player's attention.
  if (shelfShown[side] >= 0 && count > shelfShown[side]) {
    cv.classList.remove('bump');
    void cv.offsetWidth;
    cv.classList.add('bump');
  }
  shelfShown[side] = count;
}

function updateHud() {
  youLabelEl.textContent = nameOf(ONE);
  aiLabelEl.textContent = nameOf(TWO);
  youPairsEl.textContent = board.captureCount[ONE];
  aiPairsEl.textContent = board.captureCount[TWO];
  youPairsEl.style.color = counterColor(ONE);
  aiPairsEl.style.color = counterColor(TWO);
  drawShelf(ONE);
  drawShelf(TWO);
  if (gameOver) {
    statusEl.textContent = 'Game over';
  } else if (isAiGame()) {
    statusEl.textContent = current === HUMAN ? 'Your move' : 'AI is thinking…';
  } else {
    statusEl.textContent = `${nameOf(current)}'s move`;
  }
}

function showOverlay() {
  if (winner === null) {
    overlayTitleEl.textContent = 'Draw';
    overlayReasonEl.textContent = 'The board is full.';
  } else {
    const captured = board.winReason(winner) === 'fiveCaptures';
    if (isAiGame() && winner === HUMAN) {
      overlayTitleEl.textContent = 'You win!';
      overlayReasonEl.textContent = captured ? 'You captured five pairs.' : 'Five in a row.';
      if (goldJustUnlocked) {
        goldJustUnlocked = false;
        overlayReasonEl.textContent += ` Gold colors unlocked for ${themeDef().name}!`;
      }
    } else if (isAiGame()) {
      overlayTitleEl.textContent = 'AI wins';
      overlayReasonEl.textContent = captured ? 'The AI captured five pairs.' : 'The AI made five in a row.';
    } else {
      overlayTitleEl.textContent = `${nameOf(winner)} wins!`;
      overlayReasonEl.textContent = captured ? 'Captured five pairs.' : 'Five in a row.';
    }
  }
  if (themeJustUnlocked && THEMES[themeJustUnlocked]) {
    overlayReasonEl.textContent +=
      ` ${THEMES[themeJustUnlocked].name} is now unlocked!`;
    themeJustUnlocked = null;
  }
  shareBtnEl.style.display = winner !== null && (!isAiGame() || winner === HUMAN) ? '' : 'none';
  overlayEl.classList.add('show');
}

// ----- Game flow -----

function canPlay() {
  if (gameOver || aiTimer !== null) return false;
  return isAiGame() ? current === HUMAN : true;
}

// Progression counts finished vs-AI games only, mirroring the iOS rule that
// pass-and-play never records (a player could grind Gold against themselves
// in seconds per game). Draws complete a game but record no win or loss.
let goldJustUnlocked = false;
let themeJustUnlocked = null;
function recordFinishedGame() {
  if (!isAiGame()) return;
  const before = progression.nextLockedTheme(THEME_ORDER);
  progression.recordGameCompleted();
  if (winner === HUMAN) {
    progression.recordWin(theme);
    goldJustUnlocked = progression.winsInTheme(theme) === GOLD_WIN_THRESHOLD;
  } else if (winner !== null) {
    progression.recordLoss();
  }
  // This game may have crossed a world's threshold. Worth announcing on the
  // victory card, and it repaints the dock behind the overlay either way.
  themeJustUnlocked = before && progression.isThemeUnlocked(before) ? before : null;
  updateDock();
  buildWorlds();
}

function endIfOver(player) {
  const [r, c] = lastMove;
  if (board.checkWin(player, r, c)) {
    gameOver = true;
    winner = player;
  } else if (board.isFull()) {
    gameOver = true;
    winner = null;
  }
  if (gameOver) {
    stopMusic();
    if (winner !== null) playVictory();
    recordFinishedGame();
    showOverlay();
  }
  return gameOver;
}

function scheduleAiMove() {
  aiTimer = setTimeout(() => {
    aiTimer = null;
    const ai = new GameAI(difficultyEl.value);
    const move = ai.bestMove(board, AI_PLAYER);
    if (!move) {
      gameOver = true;
      winner = null;
      recordFinishedGame();
      showOverlay();
    } else {
      const captures = board.place(AI_PLAYER, move[0], move[1]);
      lastMove = move;
      pushPop(move[0], move[1]);
      pushFades(captures, HUMAN);
      playSfx('place');
      if (captures.length > 0) playSfx('capture');
      if (!endIfOver(AI_PLAYER)) current = HUMAN;
    }
    save();
    draw();
    updateHud();
    kickAnims();
  }, AI_DELAY_MS);
}

function placeAt(row, col) {
  if (!canPlay() || !board.isValid(row, col)) return;
  const mover = current;
  const captures = board.place(mover, row, col);
  lastMove = [row, col];
  hover = null;
  pushPop(row, col);
  pushFades(captures, opponentOf(mover));
  playSfx('place');
  if (captures.length > 0) playSfx('capture');
  if (!endIfOver(mover)) {
    current = opponentOf(mover);
    if (isAiGame()) scheduleAiMove();
  }
  save();
  draw();
  updateHud();
  kickAnims();
}

function handleTap(clientX, clientY) {
  if (!canPlay()) return;
  const cell = cellAt(clientX, clientY);
  if (cell) placeAt(cell[0], cell[1]);
}

function newGame() {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
  board = new GameBoard();
  current = HUMAN;
  gameOver = false;
  winner = null;
  lastMove = null;
  hover = null;
  anims = [];
  // Empty shelves are the starting state, not a capture: clearing this stops
  // the pop animation firing on a fresh board.
  shelfShown[ONE] = -1;
  shelfShown[TWO] = -1;
  overlayEl.classList.remove('show');
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  ensureMusic();
  save();
  draw();
  updateHud();
  showIntro();
}

// ----- Wiring -----

// Touch input aims first: finger down shows the ghost with crosshair
// guides, dragging fine-tunes, lifting places, dragging off the board
// cancels. Mouse input stays click-to-place with a hover ghost. This is
// the phone answer to 22x22 tap targets.
let touchAim = null;

function aimFromEvent(e) {
  if (!canPlay()) return null;
  const cell = cellAt(e.clientX, e.clientY);
  return cell && board.isValid(cell[0], cell[1]) ? cell : null;
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  ensureMusic();
  if (e.pointerType === 'mouse') {
    handleTap(e.clientX, e.clientY);
    return;
  }
  try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic event */ }
  touchAim = aimFromEvent(e);
  draw();
});

canvas.addEventListener('pointerup', (e) => {
  if (e.pointerType === 'mouse') return;
  if (touchAim) placeAt(touchAim[0], touchAim[1]);
  touchAim = null;
  draw();
});

canvas.addEventListener('pointercancel', () => {
  touchAim = null;
  draw();
});

soundToggleEl.addEventListener('click', () => {
  soundOn = !soundOn;
  writePref(SOUND_KEY, soundOn);
  updateToggles();
});

musicToggleEl.addEventListener('click', () => {
  musicOn = !musicOn;
  writePref(MUSIC_KEY, musicOn);
  if (musicOn) ensureMusic();
  else stopMusic();
  updateToggles();
});

canvas.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') {
    if (e.buttons === 0) return;
    const next = aimFromEvent(e);
    const changed = (touchAim === null) !== (next === null)
      || (touchAim && next && (touchAim[0] !== next[0] || touchAim[1] !== next[1]));
    if (changed) {
      touchAim = next;
      draw();
    }
    return;
  }
  const next = aimFromEvent(e);
  const changed = (hover === null) !== (next === null)
    || (hover && next && (hover[0] !== next[0] || hover[1] !== next[1]));
  if (changed) {
    hover = next;
    draw();
  }
});

canvas.addEventListener('pointerleave', () => {
  if (hover) {
    hover = null;
    draw();
  }
});

// New game goes through the setup screen (theme/mode/level first);
// Play again is an instant rematch with the same settings.
newGameEl.addEventListener('click', () => openSetup());
playAgainEl.addEventListener('click', newGame);
shareBtnEl.addEventListener('click', shareCard);
introEl.addEventListener('pointerdown', () => {
  ensureMusic();
  dismissIntro();
});
difficultyEl.addEventListener('change', () => {
  try { localStorage.setItem(DIFFICULTY_KEY, difficultyEl.value); } catch { /* ignore */ }
});

function applyModeUI() {
  difficultyLabelEl.style.display = isAiGame() ? '' : 'none';
}

// ----- Scene picker -----

const scenePickerEl = document.getElementById('scenePicker');
const sceneColEl = document.getElementById('sceneCol');
const neutralColEl = document.getElementById('neutralCol');

function applyScene() {
  paintScene(sceneEl, sceneKey);
  document.body.classList.toggle('light', !!sceneByKey(sceneKey).light);
  draw();
  updateHud();
  // The avatar is the player's piece on the player's background, so it
  // follows both.
  drawAvatar();
}

const boardColEl = document.getElementById('boardCol');

function selectScene(key) {
  sceneKey = key;
  try { localStorage.setItem(sceneStorageKey(), key); } catch { /* ignore */ }
  applyScene();
  buildScenePicker();
}

// Deploy-cache reality: for up to ~10 minutes after a push, a visitor can
// hold a NEW index.html with an OLD game.js or vice versa (GitHub Pages
// max-age=600). New controls are therefore guarded so a mixed pair
// degrades to "control missing/dead" instead of a dead page.
const boardSelEl = document.getElementById('boardSel');
const variantSelEl = document.getElementById('variantSel');
const gridSelEl = document.getElementById('gridSel');

function rebuildBoardSelect() {
  if (!boardSelEl) return;
  boardSelEl.innerHTML = '';
  for (const b of boardsForTheme(theme)) {
    const opt = document.createElement('option');
    opt.value = b.key;
    opt.textContent = b.name;
    boardSelEl.appendChild(opt);
  }
  boardSelEl.value = boardKey;
}

function selectBoard(key) {
  boardKey = key;
  try { localStorage.setItem(BOARD_KEY, key); } catch { /* ignore */ }
  if (boardSelEl) boardSelEl.value = key;
  draw();
  buildScenePicker();
}

boardSelEl?.addEventListener('change', () => selectBoard(boardSelEl.value));
variantSelEl?.addEventListener('change', () => setVariant(variantSelEl.value));
gridSelEl?.addEventListener('change', () => {
  gridStyle = GRID_STYLES.some((g) => g.key === gridSelEl.value) ? gridSelEl.value : 'dots';
  try { localStorage.setItem(GRID_KEY, gridStyle); } catch { /* ignore */ }
  draw();
});

function sceneOptionButton(name, selected, onPick, paintThumb) {
  const btn = document.createElement('button');
  btn.className = `piece-option scene-option${selected ? ' selected' : ''}`;
  const cv = document.createElement('canvas');
  cv.width = 112;
  cv.height = 72;
  paintThumb(cv);
  const label = document.createElement('span');
  label.textContent = name;
  btn.append(cv, label);
  btn.addEventListener('click', onPick);
  return btn;
}

function buildScenePicker() {
  boardColEl.innerHTML = '';
  sceneColEl.innerHTML = '';
  neutralColEl.innerHTML = '';
  for (const b of boardsForTheme(theme)) {
    boardColEl.appendChild(sceneOptionButton(b.name, b.key === boardKey, () => selectBoard(b.key), (cv) => {
      const cc = cv.getContext('2d');
      if (b.key === 'none') {
        cc.strokeStyle = 'rgba(255,255,255,0.25)';
        cc.setLineDash([5, 4]);
        cc.strokeRect(8, 8, 96, 56);
      } else {
        paintBoardRect(cc, b.key, 6, 6, 100, 60);
      }
    }));
  }
  for (const scene of [...themeDef().scenes, ...NEUTRALS]) {
    const btn = sceneOptionButton(scene.name, scene.key === sceneKey,
      () => selectScene(scene.key), (cv) => paintScene(cv, scene.key, 112, 72));
    (scene.neutral ? neutralColEl : sceneColEl).appendChild(btn);
  }
}

document.getElementById('sceneBtn').addEventListener('click', () => {
  buildScenePicker();
  scenePickerEl.classList.add('show');
});
document.getElementById('sceneDone').addEventListener('click', () => {
  scenePickerEl.classList.remove('show');
});

// ----- Piece picker -----

const piecePickerEl = document.getElementById('piecePicker');
const pickerCols = [
  [document.getElementById('pickerCol1'), document.getElementById('pickerTitle1'), ONE],
  [document.getElementById('pickerCol2'), document.getElementById('pickerTitle2'), TWO],
];

function savePieces() {
  try {
    localStorage.setItem(pieceStorageKey(ONE), pieceKind[ONE]);
    localStorage.setItem(pieceStorageKey(TWO), pieceKind[TWO]);
  } catch { /* ignore */ }
}

function selectPiece(side, kind) {
  const other = side === ONE ? TWO : ONE;
  // Keep the sides distinct, like the iOS picker: stealing the other
  // side's figure hands them your old one.
  if (pieceKind[other] === kind) pieceKind[other] = pieceKind[side];
  pieceKind[side] = kind;
  savePieces();
  buildPicker();
  draw();
  updateHud();
  drawAvatar();
}

function setVariant(v) {
  variant = v;
  try { localStorage.setItem(VARIANT_KEY, variant); } catch { /* ignore */ }
  if (variantSelEl) variantSelEl.value = variant;
  buildVariantRow();
  draw();
}

function buildVariantRow() {
  const rowEl = document.getElementById('variantRow');
  rowEl.innerHTML = '';
  for (const v of VARIANTS) {
    const btn = document.createElement('button');
    btn.className = `piece-option variant-btn${variant === v.key ? ' selected' : ''}`;
    btn.textContent = v.name;
    btn.addEventListener('click', () => setVariant(v.key));
    rowEl.appendChild(btn);
  }
  const finishRowEl = document.getElementById('finishRow');
  finishRowEl.innerHTML = '';
  for (const f of [['classic', 'Classic'], ['dimensional', '3D']]) {
    const btn = document.createElement('button');
    btn.className = `piece-option variant-btn${finish === f[0] ? ' selected' : ''}`;
    btn.textContent = f[1];
    btn.addEventListener('click', () => {
      finish = f[0];
      try { localStorage.setItem(FINISH_KEY, finish); } catch { /* ignore */ }
      buildPicker();
      draw();
    });
    finishRowEl.appendChild(btn);
  }
  const colorRowEl = document.getElementById('colorRow');
  colorRowEl.innerHTML = '';
  // Gold is per-theme: 10 wins in the CURRENT theme unlock it there, like
  // the iOS rare-finish loop. Locked shows the swatch dimmed with a padlock.
  const goldLocked = !progression.isGoldUnlocked(theme);
  for (const s of COLOR_SCHEMES) {
    const locked = s.rare && goldLocked;
    const btn = document.createElement('button');
    btn.className = `swatch${colorScheme === s.key ? ' selected' : ''}${locked ? ' locked' : ''}`;
    btn.title = locked ? `${s.name} (locked)` : s.name;
    if (s.one) {
      btn.style.background = s.one;
      const dot = document.createElement('span');
      dot.className = 'swatch-dot';
      dot.style.background = s.two;
      btn.appendChild(dot);
    } else {
      btn.classList.add('swatch-original');
    }
    if (locked) {
      const lock = document.createElement('span');
      lock.className = 'swatch-lock';
      lock.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
      btn.appendChild(lock);
    }
    btn.addEventListener('click', () => {
      if (locked) return;
      colorScheme = s.key;
      try { localStorage.setItem(COLOR_KEY, colorScheme); } catch { /* ignore */ }
      buildPicker();
      draw();
      updateHud();
    });
    colorRowEl.appendChild(btn);
  }
  if (goldLocked) {
    const toGo = progression.winsUntilGold(theme);
    const note = document.createElement('div');
    note.className = 'gold-note';
    note.textContent = `GOLD: win ${toGo} more ${themeDef().name} game${toGo === 1 ? '' : 's'}`;
    colorRowEl.appendChild(note);
  }
}

function buildPicker() {
  buildVariantRow();
  for (const [colEl, titleEl, side] of pickerCols) {
    titleEl.textContent = isAiGame() ? (side === ONE ? 'You' : 'AI') : `Player ${side}`;
    colEl.innerHTML = '';
    for (const kind of themeDef().figures) {
      const btn = document.createElement('button');
      btn.className = `piece-option${pieceKind[side] === kind ? ' selected' : ''}`;
      const cv = document.createElement('canvas');
      cv.width = 68;
      cv.height = 88;
      const cc = cv.getContext('2d');
      cc.scale(2, 2);
      const r = 11;
      drawFigure(cc, kind, 17, (44 + figureHeight(kind) * r) / 2, r, 1,
        { palette: paletteFor(kind, side === ONE ? 0 : 1, colorScheme), finish });
      const label = document.createElement('span');
      label.textContent = FIGURES[kind].name;
      btn.append(cv, label);
      btn.addEventListener('click', () => selectPiece(side, kind));
      colEl.appendChild(btn);
    }
  }
}

document.getElementById('pieceBtn').addEventListener('click', () => {
  buildPicker();
  piecePickerEl.classList.add('show');
});
document.getElementById('pickerDone').addEventListener('click', () => {
  piecePickerEl.classList.remove('show');
});

modeEl.addEventListener('change', () => {
  mode = modeEl.value === '2p' ? '2p' : 'ai';
  try { localStorage.setItem(MODE_KEY, mode); } catch { /* ignore */ }
  applyModeUI();
  newGame();
});

// Theme switch re-skins the world live (scene, pieces, music) without
// resetting the game in progress, matching the iOS model where a theme
// is purely visual.
const themeEl = document.getElementById('theme');

function applyTheme(key) {
  theme = THEMES[key] ? key : 'space';
  themeEl.value = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  resetMusicForTheme();
  loadThemePrefs();
  if (!boardsForTheme(theme).some((b) => b.key === boardKey)) boardKey = 'none';
  rebuildBoardSelect();
  applyScene();
  ensureMusic();
  updateDock();
  buildWorlds();
}

themeEl.addEventListener('change', () => applyTheme(themeEl.value));

// ----- Profile dock and world medallions -----

const avatarCvEl = document.getElementById('avatarCv');
const playerNameEl = document.getElementById('playerName');
const dockRecordEl = document.getElementById('dockRecord');
const worldsEl = document.getElementById('worlds');
const worldsHintEl = document.getElementById('worldsHint');
const LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>';

/** Paints a theme's default scene with a figure standing on it. */
function paintMedallion(cv, themeKey, px) {
  paintScene(cv, THEMES[themeKey].defaultScene, px, px);
  cv.style.width = px / 2 + 'px';
  cv.style.height = px / 2 + 'px';
  const c = cv.getContext('2d');
  c.setTransform(2, 0, 0, 2, 0, 0);
  const kind = THEMES[themeKey].defaults[0];
  const h = px / 2;
  drawFigure(c, kind, h / 2, h * 0.94, (h * 0.74) / figureHeight(kind));
}

function drawAvatar() {
  if (!avatarCvEl) return;
  paintScene(avatarCvEl, sceneKey, 108, 108);
  avatarCvEl.style.width = '54px';
  avatarCvEl.style.height = '54px';
  const c = avatarCvEl.getContext('2d');
  c.setTransform(2, 0, 0, 2, 0, 0);
  // The player's own piece, in their own colors, on their own background.
  drawFigure(c, pieceKind[ONE], 27, 50, 38 / figureHeight(pieceKind[ONE]), 1,
    { palette: styleFor(ONE), finish });
}

function updateDock() {
  if (playerNameEl) playerNameEl.textContent = playerName;
  drawAvatar();
  if (dockRecordEl) {
    const games = progression.gamesCompleted();
    dockRecordEl.innerHTML = games === 0
      ? 'No games yet. Your record shows up here.'
      : `<b>${progression.wins()}</b> won &middot; <b>${progression.losses()}</b> lost vs AI`;
  }
}

// Remembered so a world that opens mid-session gets the gold flash exactly
// once. The first build seeds the set silently: arriving at the page with
// three worlds already earned should not flash two of them.
const seenUnlocked = new Set();
let worldsBuilt = false;

function buildWorlds() {
  if (!worldsEl) return;
  worldsEl.innerHTML = '';
  for (const key of THEME_ORDER) {
    if (!THEMES[key]) continue;
    const unlocked = progression.isThemeUnlocked(key);
    const b = document.createElement('button');
    b.className = 'world' + (unlocked ? '' : ' locked') + (key === theme ? ' selected' : '');
    const left = progression.gamesUntilTheme(key);
    b.title = unlocked
      ? THEMES[key].name
      : `${THEMES[key].name}: ${left} more game${left === 1 ? '' : 's'}`;
    const cv = document.createElement('canvas');
    paintMedallion(cv, key, 92);
    b.appendChild(cv);
    if (!unlocked) {
      const lk = document.createElement('span');
      lk.className = 'wlock';
      lk.innerHTML = LOCK_SVG;
      b.appendChild(lk);
    } else if (worldsBuilt && !seenUnlocked.has(key)) {
      b.classList.add('just');
    }
    b.addEventListener('click', () => {
      if (progression.isThemeUnlocked(key)) {
        applyTheme(key);
        return;
      }
      // Locked worlds are not dead: they say what it takes to open them.
      const n = progression.gamesUntilTheme(key);
      worldsHintEl.innerHTML =
        `<b>${THEMES[key].name}</b> opens after ${n} more game${n === 1 ? '' : 's'}. Finishing counts, win or lose.`;
    });
    worldsEl.appendChild(b);
    if (unlocked) seenUnlocked.add(key);
  }
  worldsBuilt = true;
  // The standing hint is whatever is next on the ladder.
  const next = progression.nextLockedTheme(THEME_ORDER);
  if (next && THEMES[next]) {
    const n = progression.gamesUntilTheme(next);
    worldsHintEl.innerHTML =
      `Next: <b>${THEMES[next].name}</b> in ${n} game${n === 1 ? '' : 's'}.`;
  } else {
    worldsHintEl.textContent = progression.hasPro()
      ? 'Every world unlocked.'
      : 'Every world unlocked. Nice.';
  }
}

// ----- Profile overlay (iOS ProfileView) -----

const profileEl = document.getElementById('profile');
const CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
// Sections start open on the two that are worth showing off.
const pfOpen = { worlds: true, figures: true, backgrounds: false, soundtracks: false };

function unlockedThemes() {
  return THEME_ORDER.filter((k) => THEMES[k] && progression.isThemeUnlocked(k));
}

/** A gallery row of theme scenes, one per world. */
function sceneStrip(gal, perTheme) {
  for (const k of THEME_ORDER) {
    if (!THEMES[k]) continue;
    const locked = !progression.isThemeUnlocked(k);
    for (const sc of perTheme(k)) {
      const it = document.createElement('div');
      it.className = 'gitem' + (locked ? ' locked' : '');
      const cv = document.createElement('canvas');
      paintScene(cv, sc.key, 112, 72);
      cv.style.width = '56px';
      cv.style.height = '36px';
      it.appendChild(cv);
      if (sc.label) {
        const l = document.createElement('div');
        l.className = 'gl';
        l.textContent = sc.label;
        it.appendChild(l);
      }
      gal.appendChild(it);
    }
  }
}

function buildCollection() {
  const host = document.getElementById('pfCollect');
  if (!host) return;
  host.innerHTML = '';
  const open = unlockedThemes();
  const themeTotal = THEME_ORDER.filter((k) => THEMES[k]).length;
  const sum = (keys, f) => keys.reduce((n, k) => n + f(k), 0);
  const sections = [
    {
      key: 'worlds', title: 'WORLDS',
      have: open.length, total: themeTotal,
      fill: (gal) => sceneStrip(gal, (k) => [{ key: THEMES[k].defaultScene, label: THEMES[k].name }]),
    },
    {
      key: 'figures', title: 'FIGURES',
      have: sum(open, (k) => THEMES[k].figures.length),
      total: sum(THEME_ORDER.filter((k) => THEMES[k]), (k) => THEMES[k].figures.length),
      fill: (gal) => {
        for (const k of THEME_ORDER) {
          if (!THEMES[k]) continue;
          const locked = !progression.isThemeUnlocked(k);
          for (const kind of THEMES[k].figures) {
            const it = document.createElement('div');
            it.className = 'gitem' + (locked ? ' locked' : '');
            const cv = document.createElement('canvas');
            cv.width = 88; cv.height = 108;
            cv.style.width = '44px'; cv.style.height = '54px';
            const c = cv.getContext('2d');
            c.setTransform(2, 0, 0, 2, 0, 0);
            drawFigure(c, kind, 22, 52, 48 / figureHeight(kind));
            it.appendChild(cv);
            const l = document.createElement('div');
            l.className = 'gl';
            l.textContent = FIGURES[kind].name;
            it.appendChild(l);
            gal.appendChild(it);
          }
        }
      },
    },
    {
      key: 'backgrounds', title: 'BACKGROUNDS',
      have: sum(open, (k) => THEMES[k].scenes.length),
      total: sum(THEME_ORDER.filter((k) => THEMES[k]), (k) => THEMES[k].scenes.length),
      fill: (gal) => sceneStrip(gal, (k) => THEMES[k].scenes),
    },
    {
      key: 'soundtracks', title: 'SOUNDTRACKS',
      have: open.length, total: themeTotal,
      fill: (gal) => sceneStrip(gal, (k) => [{ key: THEMES[k].defaultScene, label: THEMES[k].name }]),
    },
  ];

  for (const sec of sections) {
    const wrap = document.createElement('div');
    wrap.className = 'csec' + (pfOpen[sec.key] ? ' open' : '');
    const head = document.createElement('button');
    head.className = 'csec-head';
    head.innerHTML = `<span class="chev">${CHEV_SVG}</span>`
      + `<span class="ct">${sec.title}</span>`
      + `<span class="cn"><b>${sec.have}</b> of ${sec.total}</span>`;
    head.addEventListener('click', () => {
      pfOpen[sec.key] = !pfOpen[sec.key];
      wrap.classList.toggle('open', pfOpen[sec.key]);
    });
    wrap.appendChild(head);
    const body = document.createElement('div');
    body.className = 'csec-body';
    const gal = document.createElement('div');
    gal.className = 'gallery';
    sec.fill(gal);
    body.appendChild(gal);
    wrap.appendChild(body);
    host.appendChild(wrap);
  }
}

function openProfile() {
  if (!profileEl) return;
  const games = progression.gamesCompleted();
  const won = progression.wins();
  document.getElementById('pfName').textContent = playerName;
  document.getElementById('pfBadges').innerHTML = progression.hasPro()
    ? '<span class="pro">PRO</span>'
    : '<span class="local">LOCAL PROFILE</span>';
  document.getElementById('pfPlayed').textContent = games;
  document.getElementById('pfWon').textContent = won;
  document.getElementById('pfLost').textContent = progression.losses();
  document.getElementById('pfRate').textContent = games ? Math.round((won / games) * 100) : 0;

  const pfCv = document.getElementById('pfAvatarCv');
  paintScene(pfCv, sceneKey, 144, 144);
  pfCv.style.width = '72px';
  pfCv.style.height = '72px';
  const pc = pfCv.getContext('2d');
  pc.setTransform(2, 0, 0, 2, 0, 0);
  drawFigure(pc, pieceKind[ONE], 36, 66, 50 / figureHeight(pieceKind[ONE]), 1,
    { palette: styleFor(ONE), finish });

  // Next unlock
  const nextEl = document.getElementById('pfNext');
  const next = progression.nextLockedTheme(THEME_ORDER);
  if (next && THEMES[next]) {
    nextEl.style.display = '';
    const need = THEME_UNLOCK_AFTER[next];
    const left = progression.gamesUntilTheme(next);
    document.getElementById('pfNextTogo').textContent =
      `${left} GAME${left === 1 ? '' : 'S'} TO GO`;
    document.getElementById('pfNextName').textContent = THEMES[next].name.toUpperCase();
    document.getElementById('pfNextRoster').textContent =
      THEMES[next].figures.map((k) => FIGURES[k].name).join(', ');
    document.getElementById('pfNextFill').style.width =
      Math.round((Math.min(games, need) / need) * 100) + '%';
    document.getElementById('pfNextCount').textContent = `${Math.min(games, need)} of ${need} games`;
    const nc = document.getElementById('pfNextCv');
    paintScene(nc, THEMES[next].defaultScene, 128, 128);
    nc.style.width = '64px';
    nc.style.height = '64px';
    const ncx = nc.getContext('2d');
    ncx.setTransform(2, 0, 0, 2, 0, 0);
    const nk = THEMES[next].defaults[0];
    drawFigure(ncx, nk, 32, 60, 46 / figureHeight(nk));
    nextEl.querySelector('.lk').innerHTML = LOCK_SVG;
  } else {
    nextEl.style.display = 'none';
  }

  // Gold progress in the world they are actually playing
  const goldEl = document.getElementById('pfGold');
  const themeWins = progression.winsInTheme(theme);
  if (progression.isGoldUnlocked(theme)) {
    goldEl.querySelector('.glabel').innerHTML =
      `<b>GOLD</b> unlocked in ${themeDef().name}`;
    document.getElementById('pfGoldFill').style.width = '100%';
  } else {
    goldEl.querySelector('.glabel').innerHTML =
      `${themeWins} of ${GOLD_WIN_THRESHOLD} ${themeDef().name} wins to <b>GOLD</b>`;
    document.getElementById('pfGoldFill').style.width =
      Math.round((themeWins / GOLD_WIN_THRESHOLD) * 100) + '%';
  }

  // Bought or not bought: the buy panel and the owned panel swap places,
  // and the owned one carries the code needed to restore elsewhere.
  const owned = progression.hasPro();
  document.getElementById('pfUnlock').style.display = owned ? 'none' : '';
  const ownedEl = document.getElementById('pfOwned');
  ownedEl.classList.toggle('show', owned);
  if (owned) {
    const code = savedCode(localStorage);
    ownedEl.querySelector('.owned-note').style.display = code ? '' : 'none';
    document.getElementById('pfOwnedCode').textContent = code ?? '';
  }
  buildCollection();
  profileEl.classList.add('show');
}

document.getElementById('profileBtn')?.addEventListener('click', openProfile);
document.getElementById('profileDone')?.addEventListener('click', () => {
  profileEl.classList.remove('show');
});
document.getElementById('avatarBtn')?.addEventListener('click', openProfile);
// ----- The paid full unlock -----

const unlockNoteEl = document.getElementById('pfUnlockNote');

function setUnlockNote(text, kind) {
  if (!unlockNoteEl) return;
  unlockNoteEl.textContent = text ?? '';
  unlockNoteEl.className = 'unlock-note' + (kind ? ` ${kind}` : '');
}

/** Applies a confirmed unlock everywhere it shows. */
function applyUnlock(source) {
  progression.grantPro(source);
  buildWorlds();
  updateDock();
  if (profileEl?.classList.contains('show')) openProfile();
}

document.getElementById('pfUnlockBtn')?.addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  setUnlockNote('Opening the secure checkout...', null);
  const failure = await startCheckout();
  // On success the browser has already left for Stripe, so reaching here at
  // all means it did not work.
  btn.disabled = false;
  setUnlockNote(failure, 'bad');
});

document.getElementById('pfRestoreBtn')?.addEventListener('click', () => {
  document.getElementById('pfRestoreRow')?.classList.toggle('show');
  document.getElementById('pfRestoreCode')?.focus();
});

async function submitRestore() {
  const input = document.getElementById('pfRestoreCode');
  const go = document.getElementById('pfRestoreGo');
  if (!input) return;
  go.disabled = true;
  setUnlockNote('Checking that code...', null);
  const r = await restoreWithCode(localStorage, input.value);
  go.disabled = false;
  if (r.ok) {
    setUnlockNote('Restored. Every world is open.', 'good');
    applyUnlock('stripe');
  } else {
    setUnlockNote(r.message, 'bad');
  }
}
document.getElementById('pfRestoreGo')?.addEventListener('click', submitRestore);
document.getElementById('pfRestoreCode')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitRestore();
});

// Coming back from Stripe: verify server side before anything unlocks.
handleReturn(localStorage).then((r) => {
  if (r.state === 'unlocked') {
    applyUnlock('stripe');
    openProfile();
    setUnlockNote(null, null);
  } else if (r.state === 'cancelled' || r.state === 'failed') {
    openProfile();
    setUnlockNote(r.message, r.state === 'failed' ? 'bad' : null);
  }
});

document.getElementById('nameBtn')?.addEventListener('click', () => {
  const next = prompt('What should we call you?', playerName);
  if (next === null) return;
  const clean = next.trim().slice(0, 20);
  if (!clean) return;
  playerName = clean;
  try { localStorage.setItem(NAME_KEY, playerName); } catch { /* ignore */ }
  updateDock();
  updateHud();
});

// ----- New game setup screen -----
// Arriving fresh (no game in progress) lands on choices first, not
// straight onto a board. Start applies the picks, then the VS intro runs.

const setupEl = document.getElementById('setup');

function openSetup() {
  if (!setupEl) {
    showIntro();
    return;
  }
  // Locked worlds stay listed but unpickable, with the cost spelled out, so
  // the setup screen shows the same ladder the medallions do.
  for (const opt of document.getElementById('setupTheme').options) {
    const unlocked = progression.isThemeUnlocked(opt.value);
    const base = THEMES[opt.value]?.name ?? opt.value;
    opt.disabled = !unlocked;
    opt.textContent = unlocked
      ? base
      : `${base} (${progression.gamesUntilTheme(opt.value)} more games)`;
  }
  document.getElementById('setupTheme').value = theme;
  document.getElementById('setupMode').value = mode;
  document.getElementById('setupDiff').value = difficultyEl.value;
  document.getElementById('setupDiffRow').style.display = mode === 'ai' ? '' : 'none';
  // The record line appears once there is a record: vs-AI games only, so a
  // fresh player (or a pass-and-play-only device) sees no zeros clutter.
  const recordEl = document.getElementById('setupRecord');
  if (recordEl) {
    const games = progression.gamesCompleted();
    recordEl.style.display = games > 0 ? '' : 'none';
    if (games > 0) {
      const w = progression.wins();
      const l = progression.losses();
      recordEl.textContent =
        `Your record vs AI: ${w} win${w === 1 ? '' : 's'} · ${l} loss${l === 1 ? '' : 'es'} · ${games} game${games === 1 ? '' : 's'} played`;
    }
  }
  // Continue only makes sense when there is a live game behind the overlay
  const hasLiveGame = !gameOver && board.grid.some((row) => row.some((v) => v !== 0));
  const cancelEl = document.getElementById('setupCancel');
  if (cancelEl) cancelEl.style.display = hasLiveGame ? '' : 'none';
  const startEl = document.getElementById('startGame');
  if (startEl) startEl.className = hasLiveGame ? 'btn-ghost' : 'btn-gold';
  setupEl.classList.add('show');
}

document.getElementById('setupCancel')?.addEventListener('click', () => {
  setupEl.classList.remove('show');
});

document.getElementById('setupMode')?.addEventListener('change', () => {
  document.getElementById('setupDiffRow').style.display =
    document.getElementById('setupMode').value === 'ai' ? '' : 'none';
});

document.getElementById('startGame')?.addEventListener('click', () => {
  const pickedTheme = document.getElementById('setupTheme').value;
  const pickedMode = document.getElementById('setupMode').value === '2p' ? '2p' : 'ai';
  difficultyEl.value = document.getElementById('setupDiff').value;
  try { localStorage.setItem(DIFFICULTY_KEY, difficultyEl.value); } catch { /* ignore */ }
  if (pickedMode !== mode) {
    mode = pickedMode;
    modeEl.value = pickedMode;
    try { localStorage.setItem(MODE_KEY, mode); } catch { /* ignore */ }
    applyModeUI();
  }
  if (THEMES[pickedTheme] && pickedTheme !== theme) applyTheme(pickedTheme);
  setupEl.classList.remove('show');
  ensureMusic();
  newGame();
});
// Install-as-app: the button appears only when the browser offers a
// native install prompt (Chrome/Edge on Android and desktop; iOS Safari
// has no such event and keeps its App Store link instead).
let installPrompt = null;
const installBtnEl = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  installBtnEl.style.display = '';
});
installBtnEl.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice.catch(() => {});
  installPrompt = null;
  installBtnEl.style.display = 'none';
});
window.addEventListener('appinstalled', () => {
  installBtnEl.style.display = 'none';
});

const sceneEl = document.getElementById('scene');
window.addEventListener('resize', () => {
  paintScene(sceneEl, sceneKey);
  draw();
  // The shelves size themselves from their CSS width, so they have to be
  // repainted whenever the board strip changes width.
  drawShelf(ONE);
  drawShelf(TWO);
});

try {
  const savedDifficulty = localStorage.getItem(DIFFICULTY_KEY);
  if (savedDifficulty && ['easy', 'medium', 'hard'].includes(savedDifficulty)) {
    difficultyEl.value = savedDifficulty;
  }
  const savedMode = localStorage.getItem(MODE_KEY);
  if (savedMode === '2p' || savedMode === 'ai') {
    mode = savedMode;
    modeEl.value = savedMode;
  }
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme && THEMES[savedTheme]) {
    theme = savedTheme;
    document.getElementById('theme').value = savedTheme;
  }
  const savedVariant = localStorage.getItem(VARIANT_KEY);
  if (savedVariant && VARIANTS.some((v) => v.key === savedVariant)) variant = savedVariant;
  const savedBoard = localStorage.getItem(BOARD_KEY);
  if (savedBoard && boardsForTheme(theme).some((b) => b.key === savedBoard)) boardKey = savedBoard;
  const savedFinish = localStorage.getItem(FINISH_KEY);
  if (savedFinish === 'classic' || savedFinish === 'dimensional') finish = savedFinish;
  const savedColor = localStorage.getItem(COLOR_KEY);
  if (savedColor && COLOR_SCHEMES.some((s) => s.key === savedColor)) colorScheme = savedColor;
  const savedGrid = localStorage.getItem(GRID_KEY);
  if (savedGrid && GRID_STYLES.some((g) => g.key === savedGrid)) gridStyle = savedGrid;
} catch { /* ignore */ }
loadThemePrefs();
if (variantSelEl) {
  for (const v of VARIANTS) {
    const opt = document.createElement('option');
    opt.value = v.key;
    opt.textContent = v.name;
    variantSelEl.appendChild(opt);
  }
  variantSelEl.value = variant;
}
if (gridSelEl) {
  for (const g of GRID_STYLES) {
    const opt = document.createElement('option');
    opt.value = g.key;
    opt.textContent = g.name;
    gridSelEl.appendChild(opt);
  }
  gridSelEl.value = gridStyle;
}
rebuildBoardSelect();
applyModeUI();
applyScene();

// The options screen is the front door on every arrival; a saved game
// adds a gold "Continue game" button (Rick: "Continue and New so we can
// see the options screen from the front").
const resumed = restore();
if (resumed && isAiGame() && current === AI_PLAYER) scheduleAiMove();
openSetup();
updateToggles();
draw();
updateHud();
updateDock();
buildWorlds();

// Dev hook: /play/?sharecard previews the victory card without winning
if (location.search.includes('sharecard')) {
  const preview = renderShareCard();
  preview.style.cssText = 'position:fixed;inset:0;margin:auto;width:min(90vw,90vh);height:min(90vw,90vh);z-index:20;border-radius:16px;';
  document.body.appendChild(preview);
}
