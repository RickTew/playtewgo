// TEWGO web: board rendering and game flow. The human is player ONE (gold)
// and always moves first; the AI is player TWO (blue). The game auto-saves
// to localStorage through the same state codec the iOS app uses for
// multiplayer payloads.

import { GameBoard, SIZE, ONE, TWO } from './engine/board.js';
import { GameAI } from './engine/ai.js';
import { encodeState, decodeState } from './engine/state.js';

const HUMAN = ONE;
const AI_PLAYER = TWO;
const SAVE_KEY = 'tewgo.web.game';
const DIFFICULTY_KEY = 'tewgo.web.difficulty';
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

let board = new GameBoard();
let current = HUMAN;
let gameOver = false;
let winner = null;
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
  const a = new Audio(`audio/${name}.m4a`);
  a.play().catch(() => { /* pre-gesture or unsupported: stay silent */ });
}

function ensureMusic() {
  if (!musicOn || gameOver) return;
  if (!music) {
    music = new Audio('audio/ingame.m4a');
    music.loop = true;
    music.volume = 0.45;
  }
  music.play().catch(() => { /* pre-gesture: retried on next interaction */ });
}

function stopMusic() {
  if (music) music.pause();
}

function updateToggles() {
  soundToggleEl.textContent = soundOn ? '🔊' : '🔇';
  soundToggleEl.classList.toggle('off', !soundOn);
  musicToggleEl.classList.toggle('off', !musicOn);
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

function stoneGradient(x, y, radius, player) {
  const grad = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, radius * 0.15, x, y, radius);
  if (player === HUMAN) {
    grad.addColorStop(0, '#fff3b0');
    grad.addColorStop(0.5, '#ffd60a');
    grad.addColorStop(1, '#b39500');
  } else {
    grad.addColorStop(0, '#cfe6ff');
    grad.addColorStop(0.5, '#4fa3ff');
    grad.addColorStop(1, '#1d5eb0');
  }
  return grad;
}

function drawStone(x, y, radius, player, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  // Soft halo so stones sit "in space" rather than flat on the panel
  const halo = ctx.createRadialGradient(x, y, radius * 0.6, x, y, radius * 1.6);
  const tint = player === HUMAN ? '255, 214, 10' : '79, 163, 255';
  halo.addColorStop(0, `rgba(${tint}, 0.25)`);
  halo.addColorStop(1, `rgba(${tint}, 0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = stoneGradient(x, y, radius, player);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
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

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < SIZE; i += 1) {
    const [x0, y0] = pointFor(i, 0, m);
    const [x1] = pointFor(i, SIZE - 1, m);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y0);
    ctx.moveTo(y0, x0);
    ctx.lineTo(y0, x1);
  }
  ctx.stroke();

  // Intersection dots
  ctx.fillStyle = 'rgba(255,255,255,0.30)';
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const [x, y] = pointFor(r, c, m);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1, m.cell * 0.07), 0, Math.PI * 2);
      ctx.fill();
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

  // Ghost stone under the mouse
  if (hover && canPlay() && board.isValid(hover[0], hover[1])) {
    const [x, y] = pointFor(hover[0], hover[1], m);
    drawStone(x, y, radius, HUMAN, 0.35);
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

function updateHud() {
  youPairsEl.textContent = board.captureCount[HUMAN];
  aiPairsEl.textContent = board.captureCount[AI_PLAYER];
  if (gameOver) {
    statusEl.textContent = 'Game over';
  } else if (current === HUMAN) {
    statusEl.textContent = 'Your move';
  } else {
    statusEl.textContent = 'AI is thinking…';
  }
}

function showOverlay() {
  if (winner === null) {
    overlayTitleEl.textContent = 'Draw';
    overlayReasonEl.textContent = 'The board is full.';
  } else if (winner === HUMAN) {
    overlayTitleEl.textContent = 'You win!';
    overlayReasonEl.textContent = board.winReason(HUMAN) === 'fiveCaptures'
      ? 'You captured five pairs.' : 'Five in a row.';
  } else {
    overlayTitleEl.textContent = 'AI wins';
    overlayReasonEl.textContent = board.winReason(AI_PLAYER) === 'fiveCaptures'
      ? 'The AI captured five pairs.' : 'The AI made five in a row.';
  }
  overlayEl.classList.add('show');
}

// ----- Game flow -----

function canPlay() {
  return !gameOver && current === HUMAN && aiTimer === null;
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

function handleTap(clientX, clientY) {
  if (!canPlay()) return;
  const cell = cellAt(clientX, clientY);
  if (!cell || !board.isValid(cell[0], cell[1])) return;
  const captures = board.place(HUMAN, cell[0], cell[1]);
  lastMove = cell;
  hover = null;
  pushPop(cell[0], cell[1]);
  pushFades(captures, AI_PLAYER);
  playSfx('place');
  if (captures.length > 0) playSfx('capture');
  if (!endIfOver(HUMAN)) {
    current = AI_PLAYER;
    scheduleAiMove();
  }
  save();
  draw();
  updateHud();
  kickAnims();
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
}

// ----- Wiring -----

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  ensureMusic();
  handleTap(e.clientX, e.clientY);
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
  if (e.pointerType !== 'mouse') return;
  const cell = canPlay() ? cellAt(e.clientX, e.clientY) : null;
  const next = cell && board.isValid(cell[0], cell[1]) ? cell : null;
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
difficultyEl.addEventListener('change', () => {
  try { localStorage.setItem(DIFFICULTY_KEY, difficultyEl.value); } catch { /* ignore */ }
});
window.addEventListener('resize', draw);

try {
  const savedDifficulty = localStorage.getItem(DIFFICULTY_KEY);
  if (savedDifficulty && ['easy', 'medium', 'hard'].includes(savedDifficulty)) {
    difficultyEl.value = savedDifficulty;
  }
} catch { /* ignore */ }

if (restore() && current === AI_PLAYER) scheduleAiMove();
updateToggles();
draw();
updateHud();
