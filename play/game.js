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

let board = new GameBoard();
let current = HUMAN;
let gameOver = false;
let winner = null;
let lastMove = null;
let aiTimer = null;

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

// ----- Rendering -----

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

function draw() {
  const m = metrics();
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(m.size * dpr)) {
    canvas.width = Math.round(m.size * dpr);
    canvas.height = Math.round(m.size * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, m.size, m.size);

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

  // Stones
  const radius = m.cell * 0.42;
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const p = board.grid[r][c];
      if (p === 0) continue;
      const [x, y] = pointFor(r, c, m);
      const grad = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, radius * 0.15, x, y, radius);
      if (p === HUMAN) {
        grad.addColorStop(0, '#fff3b0');
        grad.addColorStop(0.5, '#ffd60a');
        grad.addColorStop(1, '#b39500');
      } else {
        grad.addColorStop(0, '#cfe6ff');
        grad.addColorStop(0.5, '#4fa3ff');
        grad.addColorStop(1, '#1d5eb0');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
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

function endIfOver(player) {
  const [r, c] = lastMove;
  if (board.checkWin(player, r, c)) {
    gameOver = true;
    winner = player;
  } else if (board.isFull()) {
    gameOver = true;
    winner = null;
  }
  if (gameOver) showOverlay();
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
      board.place(AI_PLAYER, move[0], move[1]);
      lastMove = move;
      if (!endIfOver(AI_PLAYER)) current = HUMAN;
    }
    save();
    draw();
    updateHud();
  }, AI_DELAY_MS);
}

function handleTap(clientX, clientY) {
  if (gameOver || current !== HUMAN || aiTimer !== null) return;
  const rect = canvas.getBoundingClientRect();
  const m = metrics();
  const col = Math.round((clientX - rect.left - m.margin) / m.cell);
  const row = Math.round((clientY - rect.top - m.margin) / m.cell);
  if (!board.isValid(row, col)) return;
  board.place(HUMAN, row, col);
  lastMove = [row, col];
  if (!endIfOver(HUMAN)) {
    current = AI_PLAYER;
    scheduleAiMove();
  }
  save();
  draw();
  updateHud();
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
  overlayEl.classList.remove('show');
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  save();
  draw();
  updateHud();
}

// ----- Wiring -----

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  handleTap(e.clientX, e.clientY);
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
draw();
updateHud();
