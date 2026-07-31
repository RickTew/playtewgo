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

const HUMAN = ONE;
const AI_PLAYER = TWO;
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
  if (isAiGame()) return player === HUMAN ? 'You' : 'AI';
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

function playSfx(name) {
  if (!soundOn) return;
  const a = new Audio(`audio/${theme}/${name}.m4a`);
  a.play().catch(() => { /* pre-gesture or unsupported: stay silent */ });
}

function ensureMusic() {
  if (!musicOn || gameOver) return;
  if (!music) {
    music = new Audio(`audio/${theme}/ingame.m4a`);
    music.loop = true;
    music.volume = 0.45;
  }
  music.play().catch(() => { /* pre-gesture: retried on next interaction */ });
}

function resetMusicForTheme() {
  stopMusic();
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

  // Last-move ring
  if (lastMove) {
    const [x, y] = pointFor(lastMove[0], lastMove[1], m);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.15, 0, Math.PI * 2);
    ctx.stroke();
  }
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

function updateHud() {
  youLabelEl.textContent = nameOf(ONE);
  aiLabelEl.textContent = nameOf(TWO);
  youPairsEl.textContent = board.captureCount[ONE];
  aiPairsEl.textContent = board.captureCount[TWO];
  youPairsEl.style.color = counterColor(ONE);
  aiPairsEl.style.color = counterColor(TWO);
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
    } else if (isAiGame()) {
      overlayTitleEl.textContent = 'AI wins';
      overlayReasonEl.textContent = captured ? 'The AI captured five pairs.' : 'The AI made five in a row.';
    } else {
      overlayTitleEl.textContent = `${nameOf(winner)} wins!`;
      overlayReasonEl.textContent = captured ? 'Captured five pairs.' : 'Five in a row.';
    }
  }
  shareBtnEl.style.display = winner !== null && (!isAiGame() || winner === HUMAN) ? '' : 'none';
  overlayEl.classList.add('show');
}

// ----- Game flow -----

function canPlay() {
  if (gameOver || aiTimer !== null) return false;
  return isAiGame() ? current === HUMAN : true;
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
    if (winner !== null) playSfx('victory');
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

newGameEl.addEventListener('click', newGame);
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
  for (const s of COLOR_SCHEMES) {
    const btn = document.createElement('button');
    btn.className = `swatch${colorScheme === s.key ? ' selected' : ''}`;
    btn.title = s.name;
    if (s.one) {
      btn.style.background = s.one;
      const dot = document.createElement('span');
      dot.className = 'swatch-dot';
      dot.style.background = s.two;
      btn.appendChild(dot);
    } else {
      btn.classList.add('swatch-original');
    }
    btn.addEventListener('click', () => {
      colorScheme = s.key;
      try { localStorage.setItem(COLOR_KEY, colorScheme); } catch { /* ignore */ }
      buildPicker();
      draw();
      updateHud();
    });
    colorRowEl.appendChild(btn);
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
}

themeEl.addEventListener('change', () => applyTheme(themeEl.value));

// ----- New game setup screen -----
// Arriving fresh (no game in progress) lands on choices first, not
// straight onto a board. Start applies the picks, then the VS intro runs.

const setupEl = document.getElementById('setup');

function openSetup() {
  if (!setupEl) {
    showIntro();
    return;
  }
  document.getElementById('setupTheme').value = theme;
  document.getElementById('setupMode').value = mode;
  document.getElementById('setupDiff').value = difficultyEl.value;
  document.getElementById('setupDiffRow').style.display = mode === 'ai' ? '' : 'none';
  setupEl.classList.add('show');
}

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

const resumed = restore();
if (resumed && isAiGame() && current === AI_PLAYER) scheduleAiMove();
if (!resumed) openSetup();
updateToggles();
draw();
updateHud();

// Dev hook: /play/?sharecard previews the victory card without winning
if (location.search.includes('sharecard')) {
  const preview = renderShareCard();
  preview.style.cssText = 'position:fixed;inset:0;margin:auto;width:min(90vw,90vh);height:min(90vw,90vh);z-index:20;border-radius:16px;';
  document.body.appendChild(preview);
}
