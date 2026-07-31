// Ocean scene backgrounds, echoing the iOS Ocean intensities (Deep, Coral
// Reef, Lagoon, Moonlit Sea, Storm). Ocean is the visual quality benchmark
// on iOS: layered light, depth haze, and life in the margins. Same rules as
// the Space painters: layered soft glows, seeded, stable between visits.

import { mulberry32, glow, sky } from './space.js';

// Slanted light shafts falling from the surface
function lightRays(c, w, h, rand, rgb, alpha, count = 5) {
  for (let i = 0; i < count; i += 1) {
    const topX = w * (0.1 + rand() * 0.8);
    const spread = w * (0.03 + rand() * 0.05);
    const lean = w * (0.08 + rand() * 0.10);
    const g = c.createLinearGradient(topX, 0, topX + lean * 0.6, h * 0.9);
    g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(topX - spread, 0);
    c.lineTo(topX + spread, 0);
    c.lineTo(topX + lean + spread * 2.5, h * 0.9);
    c.lineTo(topX + lean - spread * 2.5, h * 0.9);
    c.closePath();
    c.fill();
  }
}

function bubbles(c, w, h, rand, count, rgb = '210, 240, 255') {
  for (let i = 0; i < count; i += 1) {
    const x = w * rand();
    const y = h * (0.2 + rand() * 0.8);
    const r = 1 + rand() * 3.5;
    c.strokeStyle = `rgba(${rgb}, ${0.12 + rand() * 0.2})`;
    c.lineWidth = 1;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.stroke();
  }
}

// Swaying kelp ribbon rooted at (x, baseY)
function kelp(c, x, baseY, height, rand, color) {
  const sway = 10 + rand() * 18;
  c.strokeStyle = color;
  c.lineWidth = 4 + rand() * 5;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x, baseY);
  c.bezierCurveTo(
    x + sway, baseY - height * 0.33,
    x - sway, baseY - height * 0.66,
    x + sway * 0.6, baseY - height,
  );
  c.stroke();
}

function fishDash(c, x, y, len, rgb, alpha) {
  c.fillStyle = `rgba(${rgb}, ${alpha})`;
  c.beginPath();
  c.ellipse(x, y, len, len * 0.4, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.moveTo(x - len, y);
  c.lineTo(x - len * 1.6, y - len * 0.5);
  c.lineTo(x - len * 1.6, y + len * 0.5);
  c.closePath();
  c.fill();
}

function paintDeep(c, w, h, m) {
  sky(c, w, h, '#0a3f63', '#052a45', '#021320');
  const rand = mulberry32(77);
  glow(c, w * 0.5, -h * 0.1, m * 0.7, '80, 180, 220', 0.35, 3);
  lightRays(c, w, h, rand, '140, 220, 255', 0.10, 6);
  glow(c, w * 0.15, h * 0.85, m * 0.4, '10, 40, 70', 0.5, 3);
  bubbles(c, w, h, rand, 26);
  for (let i = 0; i < 6; i += 1) {
    const side = i % 2 === 0 ? w * (0.02 + rand() * 0.10) : w * (0.88 + rand() * 0.10);
    kelp(c, side, h + 10, h * (0.2 + rand() * 0.25), rand, 'rgba(12, 60, 45, 0.75)');
  }
  for (let i = 0; i < 5; i += 1) {
    fishDash(c, w * rand(), h * (0.3 + rand() * 0.4), 5 + rand() * 4, '160, 210, 235', 0.25);
  }
}

function paintReef(c, w, h, m) {
  sky(c, w, h, '#0e7a95', '#0a5578', '#083752');
  const rand = mulberry32(78);
  glow(c, w * 0.5, -h * 0.1, m * 0.8, '160, 240, 255', 0.4, 3);
  lightRays(c, w, h, rand, '190, 250, 255', 0.12, 5);
  // Coral clusters along the bottom
  const corals = ['rgba(255, 120, 110, 0.65)', 'rgba(255, 170, 80, 0.6)', 'rgba(230, 90, 160, 0.6)'];
  for (let i = 0; i < 14; i += 1) {
    const x = w * rand();
    const baseY = h - rand() * h * 0.04;
    const color = corals[i % corals.length];
    c.strokeStyle = color;
    c.lineWidth = 3 + rand() * 3;
    c.lineCap = 'round';
    const branches = 3 + Math.floor(rand() * 3);
    for (let b = 0; b < branches; b += 1) {
      const lean = (rand() - 0.5) * 30;
      const tall = h * (0.03 + rand() * 0.06);
      c.beginPath();
      c.moveTo(x, baseY);
      c.quadraticCurveTo(x + lean * 0.5, baseY - tall * 0.6, x + lean, baseY - tall);
      c.stroke();
    }
  }
  bubbles(c, w, h, rand, 20);
  for (let i = 0; i < 8; i += 1) {
    fishDash(c, w * rand(), h * (0.25 + rand() * 0.45), 4 + rand() * 4, '255, 230, 150', 0.4);
  }
}

function paintLagoon(c, w, h, m) {
  sky(c, w, h, '#17a0ab', '#0e6e8a', '#0a4a63');
  const rand = mulberry32(79);
  glow(c, w * 0.65, -h * 0.05, m * 0.9, '220, 255, 240', 0.5, 4);
  lightRays(c, w, h, rand, '230, 255, 250', 0.14, 4);
  // Surface sparkle
  for (let i = 0; i < 40; i += 1) {
    const x = w * rand();
    const y = h * rand() * 0.25;
    c.fillStyle = `rgba(255, 255, 240, ${0.15 + rand() * 0.3})`;
    c.fillRect(x, y, 3 + rand() * 5, 1.5);
  }
  bubbles(c, w, h, rand, 18);
  glow(c, w * 0.12, h * 0.9, m * 0.35, '8, 60, 70', 0.4, 3);
  for (let i = 0; i < 4; i += 1) {
    fishDash(c, w * rand(), h * (0.4 + rand() * 0.4), 5 + rand() * 3, '190, 240, 245', 0.3);
  }
}

function paintMoonlit(c, w, h, m) {
  sky(c, w, h, '#0b1533', '#071026', '#040814');
  const rand = mulberry32(80);
  // Moon with layered halo
  const mx = w * 0.78;
  const my = h * 0.14;
  glow(c, mx, my, m * 0.3, '210, 225, 255', 0.5, 4);
  const g = c.createRadialGradient(mx - m * 0.01, my - m * 0.01, m * 0.005, mx, my, m * 0.045);
  g.addColorStop(0, '#f4f7ff');
  g.addColorStop(1, '#aebadd');
  c.fillStyle = g;
  c.beginPath();
  c.arc(mx, my, m * 0.045, 0, Math.PI * 2);
  c.fill();
  // Shimmering moon path down the water
  for (let i = 0; i < 30; i += 1) {
    const y = h * (0.30 + (i / 30) * 0.65);
    const jitter = (rand() - 0.5) * w * 0.05 * (i / 30 + 0.3);
    const len = 8 + rand() * 26 * (i / 30 + 0.4);
    c.fillStyle = `rgba(205, 220, 255, ${0.28 - (i / 30) * 0.18})`;
    c.fillRect(mx + jitter - len / 2, y, len, 2);
  }
  glow(c, w * 0.15, h * 0.8, m * 0.45, '20, 40, 90', 0.4, 3);
  // A few stars
  for (let i = 0; i < 40; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.2 + rand() * 0.5})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.35, 0.5 + rand(), 0, Math.PI * 2);
    c.fill();
  }
}

function paintStorm(c, w, h, m) {
  sky(c, w, h, '#232f3d', '#141d28', '#0a1017');
  const rand = mulberry32(81);
  glow(c, w * 0.3, h * 0.1, m * 0.5, '90, 110, 140', 0.4, 3);
  // Lightning bolt with glow
  const bx = w * 0.68;
  let x = bx;
  let y = h * 0.02;
  glow(c, bx, h * 0.12, m * 0.28, '200, 220, 255', 0.55, 3);
  c.strokeStyle = 'rgba(235, 245, 255, 0.9)';
  c.lineWidth = 2.5;
  c.beginPath();
  c.moveTo(x, y);
  for (let i = 0; i < 6; i += 1) {
    x += (rand() - 0.45) * w * 0.06;
    y += h * (0.03 + rand() * 0.05);
    c.lineTo(x, y);
  }
  c.stroke();
  // Rain streaks
  c.strokeStyle = 'rgba(180, 200, 220, 0.25)';
  c.lineWidth = 1;
  for (let i = 0; i < 70; i += 1) {
    const rx = w * rand();
    const ry = h * rand();
    c.beginPath();
    c.moveTo(rx, ry);
    c.lineTo(rx - 6, ry + 14);
    c.stroke();
  }
  // Wave crests
  c.strokeStyle = 'rgba(210, 230, 245, 0.35)';
  c.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    const wx = w * rand();
    const wy = h * (0.75 + rand() * 0.2);
    c.beginPath();
    c.arc(wx, wy, 10 + rand() * 22, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
  }
}

export const OCEAN_SCENES = [
  { key: 'deep', name: 'Deep', paint: paintDeep },
  { key: 'reef', name: 'Coral Reef', paint: paintReef },
  { key: 'lagoon', name: 'Lagoon', paint: paintLagoon },
  { key: 'moonlit', name: 'Moonlit Sea', paint: paintMoonlit },
  { key: 'oceanStorm', name: 'Storm', paint: paintStorm },
];
