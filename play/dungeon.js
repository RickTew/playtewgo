// Dungeon scene backgrounds, echoing the iOS Dungeon intensities (Torchlit,
// Crypt, Lava, Crystal Cavern, Sorcerer's Study, Map Table, Dragon's Hoard,
// Castle Gate, Alchemy Shelf, Dragon's Eye, Vault, Rampart). Same rules as
// the other painters: layered soft glows, seeded, stable between visits.
// Colors follow BackgroundRenderer.swift; iOS y grows up, flipped here.

import { mulberry32, glow } from './space.js';

// Wall-mounted torch with layered glow (addTorch)
function torch(c, x, y, m) {
  glow(c, x, y - 14, m * 0.10, '255, 140, 26', 0.12, 3);
  c.fillStyle = '#40302140';
  c.fillStyle = '#402E1F';
  c.strokeStyle = '#261A0F';
  c.lineWidth = 1;
  c.beginPath();
  c.roundRect(x - 4, y - 11, 8, 22, 2);
  c.fill();
  c.stroke();
  // Flame body + brighter core
  c.fillStyle = 'rgba(255, 153, 13, 0.90)';
  c.beginPath();
  c.moveTo(x, y - 10);
  c.bezierCurveTo(x + 11, y - 18, x + 11, y - 30, x, y - 38);
  c.bezierCurveTo(x - 11, y - 30, x - 11, y - 18, x, y - 10);
  c.fill();
  c.fillStyle = 'rgba(255, 224, 102, 0.85)';
  c.beginPath();
  c.moveTo(x, y - 14);
  c.bezierCurveTo(x + 6, y - 20, x + 6, y - 28, x, y - 32);
  c.bezierCurveTo(x - 6, y - 28, x - 6, y - 20, x, y - 14);
  c.fill();
}

// The stone dungeon room shared by Torchlit / Crypt / Lava (makeDungeon):
// brick wall, slab floor, torches, treasure chest, webs, mood tint.
function dungeonRoom(c, w, h, m, seed, pal) {
  const rand = mulberry32(seed);
  c.fillStyle = pal.bg;
  c.fillRect(0, 0, w, h);
  // Brick wall above the floor line
  const floorH = h * 0.24;
  const wallBottom = h - floorH;
  const brickW = w / 9;
  const brickH = brickW * 0.45;
  c.strokeStyle = pal.brickStroke;
  c.lineWidth = 0.5;
  let row = 0;
  for (let y = wallBottom; y > -brickH; y -= brickH, row += 1) {
    const offset = row % 2 === 0 ? 0 : brickW * 0.5;
    for (let x = -offset; x < w + brickW; x += brickW) {
      const b = rand() * 0.06;
      const [br, bg2, bb] = pal.brick;
      c.fillStyle = `rgb(${Math.round((br + b) * 255)}, ${Math.round((bg2 + b) * 255)}, ${Math.round((bb + b) * 255)})`;
      c.beginPath();
      c.roundRect(x + 1.5, y - brickH + 1.5, brickW - 3, brickH - 3, 1);
      c.fill();
      c.stroke();
    }
  }
  // Stone floor with slab lines and cracks
  c.fillStyle = pal.floor;
  c.fillRect(0, wallBottom, w, floorH);
  c.fillStyle = pal.crack;
  for (let i = 1; i < 3; i += 1) c.fillRect(0, h - (floorH * i) / 3 - 1, w, 2);
  for (const xf of [0.22, 0.50, 0.76]) c.fillRect(w * xf - 0.75, wallBottom, 1.5, floorH);
  // Torches at staggered heights
  torch(c, w * 0.12, h - floorH - h * 0.52 + 10, m);
  torch(c, w * 0.88, h - floorH - h * 0.36 + 10, m);
  // Ceiling shadow
  c.fillStyle = 'rgba(0, 0, 0, 0.55)';
  c.fillRect(0, 0, w, h * 0.08);
  // Treasure chest with spilled coins
  const cx = w * 0.78;
  const chestW = w * 0.14;
  const chestH = h * 0.075;
  const bodyH = chestH * 0.62;
  glow(c, cx, wallBottom + 2, chestW * 0.7, '255, 209, 38', 0.10, 2);
  c.fillStyle = '#D19E29';
  for (const [dx, dy] of [[-0.62, 3], [-0.42, 5], [0.56, 4], [0.74, 2]]) {
    c.beginPath();
    c.arc(cx + dx * chestW, wallBottom + dy, 4, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#663D1A';
  c.strokeStyle = '#331F0A';
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(cx - chestW / 2, wallBottom - bodyH, chestW, bodyH, 2);
  c.fill();
  c.stroke();
  c.fillStyle = '#804D1F';
  c.beginPath();
  c.roundRect(cx - chestW / 2 - 2.5, wallBottom - bodyH - chestH * 0.30, chestW + 5, chestH * 0.30, 2);
  c.fill();
  c.stroke();
  c.fillStyle = '#331F0A';
  c.fillRect(cx - chestW / 2 - 1, wallBottom - bodyH / 2 - 2, chestW + 2, 4);
  for (const xOff of [-chestW * 0.30, chestW * 0.30]) {
    c.fillRect(cx + xOff - 2, wallBottom - chestH * 0.82, 4, chestH * 0.80);
  }
  // Scattered bones, lower left
  c.strokeStyle = 'rgba(214, 209, 189, 0.75)';
  c.lineWidth = 3;
  c.lineCap = 'round';
  for (const [x0, y0, x1, y1] of [[0.10, 0.06, 0.16, 0.09], [0.13, 0.10, 0.18, 0.07], [0.11, 0.14, 0.16, 0.14]]) {
    c.beginPath();
    c.moveTo(w * x0, h - floorH * (1 - y0 * 4));
    c.lineTo(w * x1, h - floorH * (1 - y1 * 4));
    c.stroke();
  }
  // Spider webs in the upper corners
  c.strokeStyle = 'rgba(200, 200, 210, 0.22)';
  c.lineWidth = 1;
  for (const [cwx, cwy, r] of [[0.06, 0.12, 0.09], [0.93, 0.25, 0.07]]) {
    for (let i = 1; i <= 3; i += 1) {
      c.beginPath();
      c.arc(w * cwx, h * cwy, w * r * (i / 3), 0, Math.PI * 2);
      c.stroke();
    }
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      c.beginPath();
      c.moveTo(w * cwx, h * cwy);
      c.lineTo(w * cwx + Math.cos(a) * w * r, h * cwy + Math.sin(a) * w * r);
      c.stroke();
    }
  }
  // Ambient mood tint
  if (pal.tint) {
    c.fillStyle = pal.tint;
    c.fillRect(0, 0, w, h);
  }
}

function paintTorchlit(c, w, h, m) {
  dungeonRoom(c, w, h, m, 100, {
    bg: '#120D0A',
    brick: [0.20, 0.16, 0.12],
    brickStroke: '#140F0A',
    floor: '#473829',
    crack: '#0F0A08',
    tint: null,
  });
}

function paintCrypt(c, w, h, m) {
  dungeonRoom(c, w, h, m, 101, {
    bg: '#0D0F14',
    brick: [0.16, 0.18, 0.20],
    brickStroke: '#0F1217',
    floor: '#33383D',
    crack: '#0A0D12',
    tint: 'rgba(77, 115, 166, 0.18)',
  });
}

function paintLava(c, w, h, m) {
  dungeonRoom(c, w, h, m, 102, {
    bg: '#1A0A08',
    brick: [0.25, 0.12, 0.08],
    brickStroke: '#1F0A05',
    floor: '#52291A',
    crack: '#FF731A',
    tint: 'rgba(255, 77, 13, 0.22)',
  });
}

// A fan of three glowing crystal shards growing from one spot
function crystalCluster(c, x, baseY, height, rgb) {
  glow(c, x, baseY - height * 0.4, height * 1.1, rgb, 0.13, 2);
  for (const [tilt, scale] of [[-0.40, 0.65], [0.05, 1.0], [0.45, 0.75]]) {
    const sh = height * scale;
    const sw = sh * 0.34;
    c.save();
    c.translate(x, baseY);
    c.rotate(-tilt);
    c.fillStyle = `rgba(${rgb}, 0.85)`;
    c.strokeStyle = 'rgba(255, 255, 255, 0.40)';
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(0, -sh);
    c.lineTo(-sw * 0.5, -sh * 0.40);
    c.lineTo(-sw * 0.26, 0);
    c.lineTo(sw * 0.26, 0);
    c.lineTo(sw * 0.5, -sh * 0.40);
    c.closePath();
    c.fill();
    c.stroke();
    c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0, -sh * 0.92);
    c.lineTo(-sw * 0.12, -sh * 0.15);
    c.stroke();
    c.restore();
  }
}

function paintCrystalCavern(c, w, h, m) {
  const rand = mulberry32(103);
  c.fillStyle = '#050A14';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.55, m * 0.5, '38, 166, 191', 0.05, 3);
  // Stalactites from the ceiling
  c.fillStyle = '#0F1A26';
  for (const [xf, wf, hf] of [[0.06, 0.10, 0.12], [0.20, 0.07, 0.08], [0.36, 0.12, 0.15], [0.55, 0.06, 0.07], [0.70, 0.10, 0.11], [0.88, 0.08, 0.13]]) {
    c.beginPath();
    c.moveTo(w * (xf - wf * 0.5), 0);
    c.lineTo(w * xf, h * hf);
    c.lineTo(w * (xf + wf * 0.5), 0);
    c.closePath();
    c.fill();
  }
  // Rocky floor and stalagmites
  const floorH = h * 0.11;
  c.fillStyle = '#0D1421';
  c.fillRect(0, h - floorH, w, floorH);
  c.fillStyle = '#0F1A26';
  for (const [xf, wf, hf] of [[0.30, 0.07, 0.06], [0.48, 0.05, 0.045], [0.94, 0.08, 0.07]]) {
    c.beginPath();
    c.moveTo(w * (xf - wf * 0.5), h - floorH * 0.6);
    c.lineTo(w * xf, h - floorH * 0.6 - h * hf);
    c.lineTo(w * (xf + wf * 0.5), h - floorH * 0.6);
    c.closePath();
    c.fill();
  }
  // Glowing crystal clusters (cyan + magenta)
  const cyan = '64, 217, 242';
  const magenta = '204, 102, 242';
  crystalCluster(c, w * 0.13, h - floorH * 0.8, h * 0.11, cyan);
  crystalCluster(c, w * 0.84, h - floorH * 0.8, h * 0.085, magenta);
  crystalCluster(c, w * 0.58, h - floorH * 0.7, h * 0.06, cyan);
  // Hanging ceiling crystals
  for (const [xf, hf, rgb] of [[0.28, 0.05, magenta], [0.78, 0.06, cyan]]) {
    const sh = h * hf;
    const y0 = h * 0.03;
    c.fillStyle = `rgba(${rgb}, 0.85)`;
    c.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(w * xf - sh * 0.16, y0);
    c.lineTo(w * xf, y0 + sh);
    c.lineTo(w * xf + sh * 0.16, y0);
    c.closePath();
    c.fill();
    c.stroke();
    glow(c, w * xf, y0 + sh * 0.6, sh * 0.8, rgb, 0.08, 2);
  }
  // Drifting light motes
  for (let i = 0; i < 30; i += 1) {
    c.fillStyle = `rgba(64, 217, 242, ${0.08 + rand() * 0.22})`;
    c.beginPath();
    c.arc(w * rand(), h * (0.1 + rand() * 0.79), 0.8 + rand() * 1.2, 0, Math.PI * 2);
    c.fill();
  }
  // Cool ambient tint
  c.fillStyle = 'rgba(38, 140, 179, 0.07)';
  c.fillRect(0, 0, w, h);
}

function paintStudy(c, w, h, m) {
  const rand = mulberry32(104);
  c.fillStyle = '#140D1A';
  c.fillRect(0, 0, w, h);
  // Wooden floor
  const floorH = h * 0.17;
  c.fillStyle = '#2B1A12';
  c.fillRect(0, h - floorH, w, floorH);
  c.fillStyle = '#140D08';
  for (let i = 1; i < 4; i += 1) c.fillRect(0, h - (floorH * i) / 4, w, 1.5);
  // Bookshelves on both walls
  const books = ['#7A2921', '#29426B', '#4D5C29', '#6B521A', '#472152'];
  for (const caseXF of [0.105, 0.895]) {
    const caseW = w * 0.21;
    const caseH = h * 0.52;
    const caseX = w * caseXF;
    const caseBottom = h - floorH;
    c.fillStyle = '#21140D';
    c.strokeStyle = '#0F0805';
    c.lineWidth = 2;
    c.fillRect(caseX - caseW / 2, caseBottom - caseH, caseW, caseH);
    c.strokeRect(caseX - caseW / 2, caseBottom - caseH, caseW, caseH);
    for (let rowI = 0; rowI < 4; rowI += 1) {
      const shelfY = caseBottom - caseH * (0.06 + rowI * 0.24);
      c.fillStyle = '#382114';
      c.fillRect(caseX - caseW * 0.45, shelfY - 1.5, caseW * 0.9, 3);
      let bx = caseX - caseW * 0.40;
      while (bx < caseX + caseW * 0.36) {
        const bw = 5 + rand() * 4;
        const bh = 13 + rand() * 7;
        c.fillStyle = books[Math.floor(rand() * books.length)];
        c.fillRect(bx, shelfY - 2 - bh, bw, bh);
        bx += bw + 1.5;
      }
    }
  }
  // Glowing arcane circle on the floor
  const ccx = w * 0.5;
  const ccy = h - floorH * 0.55;
  const circleW = w * 0.42;
  const circleH = floorH * 0.55;
  glow(c, ccx, ccy, circleW * 0.75, '179, 107, 255', 0.10, 2);
  c.strokeStyle = 'rgba(179, 107, 255, 0.75)';
  c.lineWidth = 1.8;
  for (const scale of [1.0, 0.62]) {
    c.beginPath();
    c.ellipse(ccx, ccy, (circleW * scale) / 2, (circleH * scale) / 2, 0, 0, Math.PI * 2);
    c.stroke();
  }
  c.fillStyle = 'rgba(179, 107, 255, 0.8)';
  for (let i = 0; i < 10; i += 1) {
    const a = (i * Math.PI) / 5;
    c.save();
    c.translate(ccx + Math.cos(a) * circleW * 0.5, ccy + Math.sin(a) * circleH * 0.5);
    c.rotate(a);
    c.fillRect(-1, -3, 2, 6);
    c.restore();
  }
  // Candles on the shelf tops
  for (const xf of [0.105, 0.895]) {
    const px = w * xf;
    const py = h - floorH - h * 0.52;
    c.fillStyle = '#EBE0C7';
    c.beginPath();
    c.roundRect(px - 2.5, py - 14, 5, 14, 1);
    c.fill();
    glow(c, px, py - 18, w * 0.06, '255, 166, 51', 0.08, 2);
    c.fillStyle = 'rgba(255, 191, 64, 0.95)';
    c.beginPath();
    c.ellipse(px, py - 18, 2.5, 4.5, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Drifting magical sparkles
  for (let i = 0; i < 18; i += 1) {
    c.fillStyle = `rgba(179, 107, 255, ${0.15 + rand() * 0.3})`;
    c.beginPath();
    c.arc(w * (0.25 + rand() * 0.5), h * (0.15 + rand() * 0.68), 0.8 + rand() * 1, 0, Math.PI * 2);
    c.fill();
  }
}

function paintMapTable(c, w, h, m) {
  // The war-room table in candlelight: parchment tones, rolled map, compass.
  // Light page tone like the other map scenes on the web.
  const rand = mulberry32(105);
  c.fillStyle = '#D9C28C';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.4, h * 0.3, m * 0.5, '255, 245, 215', 0.4, 3);
  // Ink mountain doodles
  c.strokeStyle = 'rgba(97, 66, 31, 0.6)';
  c.lineWidth = 2;
  for (const [xf, yf, s] of [[0.2, 0.28, 1], [0.30, 0.30, 0.7], [0.72, 0.62, 1.1], [0.62, 0.64, 0.8]]) {
    c.beginPath();
    c.moveTo(w * xf - 22 * s, h * yf + 12 * s);
    c.lineTo(w * xf, h * yf - 12 * s);
    c.lineTo(w * xf + 22 * s, h * yf + 12 * s);
    c.stroke();
  }
  // Dashed route to the X
  c.strokeStyle = 'rgba(140, 40, 30, 0.7)';
  c.setLineDash([8, 7]);
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(w * 0.08, h * 0.15);
  c.quadraticCurveTo(w * 0.45, h * 0.35, w * 0.55, h * 0.52);
  c.stroke();
  c.setLineDash([]);
  c.strokeStyle = 'rgba(150, 30, 20, 0.85)';
  c.lineWidth = 4;
  const xs = m * 0.02;
  c.beginPath();
  c.moveTo(w * 0.56 - xs, h * 0.53 - xs);
  c.lineTo(w * 0.56 + xs, h * 0.53 + xs);
  c.moveTo(w * 0.56 + xs, h * 0.53 - xs);
  c.lineTo(w * 0.56 - xs, h * 0.53 + xs);
  c.stroke();
  // Iron compass rose, lower left
  const roseC = [w * 0.18, h * 0.80];
  const roseR = m * 0.07;
  c.strokeStyle = '#85858F';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(roseC[0], roseC[1], roseR, 0, Math.PI * 2);
  c.stroke();
  for (let i = 0; i < 4; i += 1) {
    const a = (i * Math.PI) / 4;
    c.lineWidth = i === 1 ? 2.5 : 1;
    c.beginPath();
    c.moveTo(roseC[0] - Math.cos(a) * roseR * 0.9, roseC[1] - Math.sin(a) * roseR * 0.9);
    c.lineTo(roseC[0] + Math.cos(a) * roseR * 0.9, roseC[1] + Math.sin(a) * roseR * 0.9);
    c.stroke();
  }
  c.fillStyle = 'rgba(166, 38, 26, 0.9)';
  c.beginPath();
  c.arc(roseC[0], roseC[1] - roseR * 0.65, 3, 0, Math.PI * 2);
  c.fill();
  // Rolled map along the top edge
  c.fillStyle = '#D9C28C';
  c.strokeStyle = '#80612F';
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(w * 0.60, h * 0.06, w * 0.32, 26, 13);
  c.fill();
  c.stroke();
  c.fillStyle = '#BDA36B';
  c.beginPath();
  c.ellipse(w * 0.92, h * 0.06 + 13, 7, 13, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = '#4D2E14';
  c.fillRect(w * 0.68, h * 0.06 - 1, 6, 28);
  // Wax seal, lower right
  glow(c, w * 0.84, h * 0.82, m * 0.03, '166, 38, 26', 0.25, 2);
  c.fillStyle = '#8C2318';
  c.beginPath();
  c.arc(w * 0.84, h * 0.82, m * 0.028, 0, Math.PI * 2);
  c.fill();
}

function paintHoard(c, w, h, m) {
  c.fillStyle = '#0D0808';
  c.fillRect(0, 0, w, h);
  // Gold glow rising from the hoard below
  glow(c, w * 0.5, h * 0.90, m * 0.7, '217, 140, 38', 0.05, 3);
  glow(c, w * 0.5, h * 0.92, m * 0.45, '217, 140, 38', 0.06, 2);
  // Dragon silhouette: neck sweeping in from the right, head over the hoard
  const dragon = '#1C0F14';
  const headY = h * 0.30;
  c.fillStyle = dragon;
  c.beginPath();
  c.moveTo(w * 1.05, h * 0.62);
  c.quadraticCurveTo(w * 0.98, h * 0.20, w * 0.72, headY - h * 0.10);
  c.lineTo(w * 0.82, headY + h * 0.02);
  c.quadraticCurveTo(w * 1.00, h * 0.58, w * 1.05, h * 0.72);
  c.closePath();
  c.fill();
  c.beginPath();
  c.moveTo(w * 0.28, headY - h * 0.012);
  c.lineTo(w * 0.52, headY - h * 0.055);
  c.lineTo(w * 0.58, headY - h * 0.085);
  c.lineTo(w * 0.78, headY - h * 0.075);
  c.lineTo(w * 0.72, headY + h * 0.015);
  c.lineTo(w * 0.40, headY + h * 0.010);
  c.lineTo(w * 0.31, headY + h * 0.028);
  c.closePath();
  c.fill();
  // Swept-back horns
  for (const [baseX, tipDX, tipDY] of [[0.60, 0.10, 0.085], [0.66, 0.085, 0.065]]) {
    c.beginPath();
    c.moveTo(w * baseX, headY - h * 0.075);
    c.quadraticCurveTo(w * (baseX + tipDX * 0.3), headY - h * (0.075 + tipDY), w * (baseX + tipDX), headY - h * (0.075 + tipDY));
    c.lineTo(w * (baseX + 0.045), headY - h * 0.070);
    c.closePath();
    c.fill();
  }
  // Burning eye with slit pupil + nostril ember
  const ex = w * 0.545;
  const ey = headY - h * 0.038;
  glow(c, ex, ey, w * 0.035, '255, 115, 26', 0.30, 2);
  c.fillStyle = '#FF9E1F';
  c.beginPath();
  c.ellipse(ex, ey, w * 0.020, w * 0.009, -0.10, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#000000';
  c.beginPath();
  c.ellipse(ex, ey, w * 0.0035, w * 0.008, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(255, 102, 26, 0.85)';
  c.beginPath();
  c.arc(w * 0.315, headY - h * 0.002, w * 0.009, 0, Math.PI * 2);
  c.fill();
  // Smoke wisps from the nostril
  c.fillStyle = 'rgba(179, 179, 179, 0.07)';
  for (let i = 0; i < 3; i += 1) {
    c.beginPath();
    c.ellipse(w * (0.30 - i * 0.035), headY - h * (0.035 + i * 0.045), w * 0.03, h * 0.008, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Gold mounds across the floor
  for (const [xf, wf, hf, color] of [[0.18, 0.75, 0.30, '#734D12'], [0.66, 0.80, 0.24, '#734D12'], [0.38, 0.60, 0.20, '#9E701A'], [0.88, 0.55, 0.18, '#9E701A']]) {
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(w * xf, h + h * hf * 0.35, (w * wf) / 2, h * hf * 0.75, 0, Math.PI, Math.PI * 2);
    c.fill();
  }
  // Glinting coins on the mounds
  const rand = mulberry32(106);
  c.fillStyle = '#F2C24D';
  for (let i = 0; i < 26; i += 1) {
    c.beginPath();
    c.arc(w * rand(), h * (0.82 + rand() * 0.16), 2 + rand() * 2, 0, Math.PI * 2);
    c.fill();
  }
}

function paintGate(c, w, h, m) {
  const rand = mulberry32(107);
  c.fillStyle = '#0A0814';
  c.fillRect(0, 0, w, h);
  // Stars above the wall
  for (let i = 0; i < 40; i += 1) {
    c.fillStyle = `rgba(230, 230, 230, ${0.2 + rand() * 0.4})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.26, 0.4 + rand() * 0.9, 0, Math.PI * 2);
    c.fill();
  }
  const wall = '#26212E';
  const wallTopY = h * 0.28;
  const wallBotY = h * 0.45;
  c.fillStyle = wall;
  c.fillRect(0, wallTopY, w, wallBotY - wallTopY);
  // Crenellations
  for (let cx = 0; cx < w; cx += w * 0.10) {
    c.fillRect(cx, wallTopY - h * 0.022, w * 0.05, h * 0.022);
  }
  // Towers with a lit arrow slit
  for (const txf of [0.14, 0.86]) {
    const tx = w * txf;
    const tw = w * 0.16;
    c.fillRect(tx - tw / 2, wallBotY - h * 0.33, tw, h * 0.33);
    for (let bx = tx - tw / 2; bx < tx + tw / 2 - 1; bx += tw * 0.40) {
      c.fillRect(bx, wallBotY - h * 0.33 - h * 0.02, tw * 0.22, h * 0.02);
    }
    c.fillStyle = 'rgba(255, 184, 77, 0.9)';
    c.beginPath();
    c.roundRect(tx - 2, wallBotY - h * 0.22 - 7, 4, 14, 2);
    c.fill();
    c.fillStyle = wall;
  }
  // Gate arch with warm interior and portcullis bars
  const archW = w * 0.20;
  const archH = h * 0.13;
  const archX = w * 0.5;
  const archBase = wallBotY - 2;
  glow(c, archX, archBase - archH * 0.4, archW * 0.7, '255, 166, 64', 0.10, 4);
  c.fillStyle = '#8C521F';
  c.strokeStyle = '#140F1A';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(archX - archW / 2, archBase);
  c.lineTo(archX - archW / 2, archBase - archH * 0.6);
  c.quadraticCurveTo(archX, archBase - archH * 1.35, archX + archW / 2, archBase - archH * 0.6);
  c.lineTo(archX + archW / 2, archBase);
  c.closePath();
  c.fill();
  c.stroke();
  c.strokeStyle = '#1A1414';
  c.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const bx = archX - archW / 2 + (archW * (i + 1)) / 6;
    c.beginPath();
    c.moveTo(bx, archBase);
    c.lineTo(bx, archBase - archH * (i === 0 || i === 4 ? 0.62 : 0.85));
    c.stroke();
  }
  c.beginPath();
  c.moveTo(archX - archW / 2, archBase - archH * 0.45);
  c.lineTo(archX + archW / 2, archBase - archH * 0.45);
  c.stroke();
  // Torch flames flanking the gate
  for (const tx of [archX - archW * 0.85, archX + archW * 0.85]) {
    glow(c, tx, wallBotY - h * 0.075 - 6, m * 0.02, '255, 153, 51', 0.20, 3);
    c.fillStyle = 'rgba(255, 184, 64, 0.95)';
    c.beginPath();
    c.ellipse(tx, wallBotY - h * 0.075 - 5, 4, 6.5, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Foreground ground with path stones
  c.fillStyle = '#171217';
  c.fillRect(0, wallBotY, w, h - wallBotY);
  c.fillStyle = '#262126';
  for (const [yf, sw] of [[0.54, 0.10], [0.66, 0.13], [0.80, 0.17], [0.93, 0.21]]) {
    c.beginPath();
    c.ellipse(w * 0.5, h * yf, (w * sw) / 2, h * 0.012, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintAlchemy(c, w, h, m) {
  const rand = mulberry32(108);
  c.fillStyle = '#171214';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 10; i += 1) {
    c.fillStyle = `rgba(13, 10, 13, ${0.25 + rand() * 0.25})`;
    c.beginPath();
    c.ellipse(w * rand(), h * rand(), 30 + rand() * 40, 15 + rand() * 25, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Shelf plank near the top
  const shelfY = h * 0.20;
  c.fillStyle = '#3D2412';
  c.fillRect(w * 0.10, shelfY - 5, w * 0.80, 10);
  c.strokeStyle = '#2E1A0D';
  c.lineWidth = 4;
  for (const bx of [w * 0.16, w * 0.84]) {
    c.beginPath();
    c.moveTo(bx, shelfY + 5);
    c.lineTo(bx + (bx < w / 2 ? 14 : -14), shelfY + 26);
    c.stroke();
  }
  // Round green flask
  const fx = w * 0.24;
  const fy = shelfY - 22;
  glow(c, fx, fy, 18, '77, 255, 115', 0.05, 3);
  c.fillStyle = 'rgba(38, 140, 64, 0.95)';
  c.strokeStyle = 'rgba(140, 217, 153, 0.8)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(fx, fy, 16, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = 'rgba(38, 140, 64, 0.95)';
  c.fillRect(fx - 4, fy - 27, 8, 14);
  // Tall violet bottle
  const bx = w * 0.46;
  const by = shelfY - 26;
  glow(c, bx, by, 16, '179, 89, 255', 0.05, 3);
  c.fillStyle = 'rgba(97, 46, 140, 0.95)';
  c.strokeStyle = 'rgba(179, 128, 230, 0.8)';
  c.beginPath();
  c.roundRect(bx - 8, by - 21, 16, 42, 6);
  c.fill();
  c.stroke();
  c.fillStyle = '#8C6638';
  c.beginPath();
  c.roundRect(bx - 4, by - 28, 8, 7, 2);
  c.fill();
  // Small amber vial
  const vx = w * 0.63;
  const vy = shelfY - 16;
  glow(c, vx, vy, 10, '255, 179, 51', 0.05, 3);
  c.fillStyle = 'rgba(191, 128, 31, 0.95)';
  c.strokeStyle = 'rgba(242, 191, 102, 0.8)';
  c.beginPath();
  c.roundRect(vx - 6, vy - 11, 12, 22, 5);
  c.fill();
  c.stroke();
  // Skull on the shelf
  const sx = w * 0.79;
  const sy = shelfY - 16;
  c.fillStyle = '#C7BFAD';
  c.beginPath();
  c.arc(sx, sy - 4, 13, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#B3AB99';
  c.fillRect(sx - 8, sy + 1, 16, 8);
  c.fillStyle = '#0F0D0F';
  for (const ex of [sx - 5, sx + 5]) {
    c.beginPath();
    c.arc(ex, sy - 5, 3.5, 0, Math.PI * 2);
    c.fill();
  }
  // Candles + scroll near the bottom
  for (const [cxF, ch] of [[0.28, 26], [0.36, 18]]) {
    const px = w * cxF;
    const py = h * 0.915;
    c.fillStyle = '#D9CCAD';
    c.fillRect(px - 5, py - ch, 10, ch);
    glow(c, px, py - ch - 7, 6, '255, 166, 51', 0.07, 4);
    c.fillStyle = 'rgba(255, 191, 77, 0.95)';
    c.beginPath();
    c.ellipse(px, py - ch - 6, 3, 5.5, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.save();
  c.translate(w * 0.68, h * 0.90);
  c.rotate(0.18);
  c.fillStyle = '#CCB88A';
  c.strokeStyle = '#735C33';
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(-32, -8, 64, 16, 8);
  c.fill();
  c.stroke();
  c.restore();
}

function paintDragonEye(c, w, h, m) {
  c.fillStyle = '#1A0A0D';
  c.fillRect(0, 0, w, h);
  // Scale arcs across the hide
  c.strokeStyle = '#291214';
  c.lineWidth = 2;
  let row = 0;
  for (let sy = 0; sy < h; sy += h * 0.05, row += 1) {
    for (let sx = row % 2 === 0 ? 0 : w * 0.06; sx < w + w * 0.1; sx += w * 0.12) {
      c.beginPath();
      c.arc(sx, sy, w * 0.062, Math.PI * 0.15, Math.PI * 0.85);
      c.stroke();
    }
  }
  // The eye - upper half, looking down at the board
  const ecx = w * 0.5;
  const ecy = h * 0.24;
  const eyeW = w * 0.62;
  const eyeH = w * 0.30;
  glow(c, ecx, ecy, eyeW * 0.42, '255, 140, 26', 0.04, 4);
  c.save();
  c.beginPath();
  c.moveTo(ecx - eyeW / 2, ecy);
  c.quadraticCurveTo(ecx, ecy - eyeH, ecx + eyeW / 2, ecy);
  c.quadraticCurveTo(ecx, ecy + eyeH, ecx - eyeW / 2, ecy);
  c.closePath();
  c.clip();
  c.fillStyle = '#EB941F';
  c.beginPath();
  c.arc(ecx, ecy, eyeW * 0.30, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = 'rgba(140, 64, 13, 0.9)';
  c.lineWidth = 6;
  c.beginPath();
  c.arc(ecx, ecy, eyeW * 0.30, 0, Math.PI * 2);
  c.stroke();
  // Slit pupil + glint
  c.fillStyle = '#0D0508';
  c.beginPath();
  c.ellipse(ecx, ecy, eyeW * 0.035, eyeH * 0.75, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(255, 255, 255, 0.85)';
  c.beginPath();
  c.arc(ecx - eyeW * 0.12, ecy - eyeH * 0.35, eyeW * 0.035, 0, Math.PI * 2);
  c.fill();
  c.restore();
  // Lid outline
  c.strokeStyle = '#4D1F1A';
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(ecx - eyeW / 2, ecy);
  c.quadraticCurveTo(ecx, ecy - eyeH, ecx + eyeW / 2, ecy);
  c.quadraticCurveTo(ecx, ecy + eyeH, ecx - eyeW / 2, ecy);
  c.closePath();
  c.stroke();
  // Smoke wisps low on the hide
  c.strokeStyle = 'rgba(140, 140, 140, 0.22)';
  c.lineWidth = 3;
  c.lineCap = 'round';
  for (const [xf, yf] of [[0.25, 0.90], [0.55, 0.93], [0.78, 0.88]]) {
    c.beginPath();
    c.moveTo(w * xf, h * yf);
    c.quadraticCurveTo(w * xf - 22, h * yf - 30, w * xf + 26, h * yf - 60);
    c.stroke();
  }
}

function paintVault(c, w, h, m) {
  const rand = mulberry32(109);
  // Flagstone vault floor, torchlit, treasure in the margins
  c.fillStyle = '#1A171C';
  c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (const yf of [0.15, 0.90]) c.fillRect(0, h * yf, w, 2);
  torch(c, w * 0.16, h * 0.14, m);
  torch(c, w * 0.84, h * 0.14, m);
  // Gold piles between the torches
  for (const [xf, s] of [[0.38, 1.0], [0.55, 1.3], [0.66, 0.8]]) {
    c.fillStyle = 'rgba(242, 199, 64, 0.85)';
    c.strokeStyle = '#B3851A';
    c.lineWidth = 1.5;
    c.beginPath();
    c.ellipse(w * xf, h * 0.14 + 16 * s, 26 * s, 11 * s, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#F2C740';
    for (let i = 0; i < 4; i += 1) {
      c.beginPath();
      c.arc(w * xf + (rand() - 0.5) * 44 * s, h * 0.14 + 16 * s + (rand() - 0.7) * 10, 3, 0, Math.PI * 2);
      c.fill();
    }
  }
  // Chest + scattered coins near the bottom
  const chestX = w * 0.26;
  const chestY = h * 0.93;
  c.fillStyle = '#523319';
  c.strokeStyle = 'rgba(242, 199, 64, 0.8)';
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(chestX - 28, chestY - 15, 56, 30, 4);
  c.fill();
  c.stroke();
  c.strokeStyle = 'rgba(242, 199, 64, 0.7)';
  c.beginPath();
  c.moveTo(chestX - 28, chestY - 6);
  c.lineTo(chestX + 28, chestY - 6);
  c.stroke();
  c.fillStyle = '#F2C740';
  for (let i = 0; i < 8; i += 1) {
    c.globalAlpha = 0.6 + rand() * 0.4;
    c.beginPath();
    c.arc(w * (0.45 + rand() * 0.45), h * (0.88 + rand() * 0.1), 3, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
}

function paintRampart(c, w, h, m) {
  const rand = mulberry32(110);
  // Night sky above the battlements
  c.fillStyle = '#0D0F1F';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.2 + rand() * 0.6})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.18, 0.4 + rand() * 1, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#E6E6CC';
  c.beginPath();
  c.arc(w * 0.78, h * 0.06, m * 0.03, 0, Math.PI * 2);
  c.fill();
  // Distant mountains
  c.fillStyle = '#171A29';
  c.beginPath();
  c.moveTo(0, h * 0.20);
  for (const [xf, hf] of [[0.18, 0.16], [0.40, 0.06], [0.62, 0.20], [0.85, 0.08], [1.0, 0.14]]) {
    c.lineTo(w * xf, h * 0.20 - h * 0.06 * hf * 4);
  }
  c.lineTo(w, h * 0.20);
  c.closePath();
  c.fill();
  // Battlement wall with merlons
  const wallC = '#29262E';
  c.fillStyle = wallC;
  c.fillRect(0, h * 0.20, w, h * 0.10);
  const merlonW = w / 9;
  for (let i = 0; i < 9; i += 2) {
    c.fillRect(i * merlonW, h * 0.20 - 22, merlonW, 22);
  }
  // Rampart floor
  c.fillStyle = '#211F26';
  c.fillRect(0, h * 0.30, w, h * 0.70);
  c.fillStyle = 'rgba(0, 0, 0, 0.25)';
  for (const yf of [0.48, 0.66, 0.84]) c.fillRect(0, h * yf, w, 2);
  // Banner poles in the bottom corners
  for (const xf of [0.10, 0.90]) {
    const px = w * xf;
    c.strokeStyle = '#595959';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(px, h * 0.99);
    c.lineTo(px, h * 0.80);
    c.stroke();
    c.fillStyle = xf < 0.5 ? '#7A1414' : '#141461';
    c.beginPath();
    c.moveTo(px, h * 0.81);
    c.lineTo(px + (xf < 0.5 ? 26 : -26), h * 0.815);
    c.lineTo(px + (xf < 0.5 ? 22 : -22), h * 0.87);
    c.lineTo(px, h * 0.86);
    c.closePath();
    c.fill();
  }
}

export const DUNGEON_SCENES = [
  { key: 'torchlit', name: 'Torchlit', paint: paintTorchlit },
  { key: 'crypt', name: 'Crypt', paint: paintCrypt },
  { key: 'lava', name: 'Lava', paint: paintLava },
  { key: 'crystalCavern', name: 'Crystal Cavern', paint: paintCrystalCavern },
  { key: 'sorcerersStudy', name: "Sorcerer's Study", paint: paintStudy },
  { key: 'mapTable', name: 'Map Table', paint: paintMapTable, light: true },
  { key: 'dragonsHoard', name: "Dragon's Hoard", paint: paintHoard },
  { key: 'castleGate', name: 'Castle Gate', paint: paintGate },
  { key: 'alchemyShelf', name: 'Alchemy Shelf', paint: paintAlchemy },
  { key: 'dragonsEye', name: "Dragon's Eye", paint: paintDragonEye },
  { key: 'vault', name: 'Vault', paint: paintVault },
  { key: 'rampart', name: 'Rampart', paint: paintRampart },
];
