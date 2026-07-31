// Classic scene backgrounds, echoing the iOS Classic intensities (Wood,
// Bamboo, Slate, Marble, Green Felt, Library, Game Night, Vintage Map,
// Checkmate, Fireside, Study Desk, Park). Same rules as the other
// painters: layered soft glows, seeded, stable between visits. Colors
// follow BackgroundRenderer.swift; iOS y grows up, flipped here.
// The Slate scene key is classicSlate because the neutral backdrop owns
// 'slate'.

import { mulberry32, glow } from './space.js';

function paintWood(c, w, h, m) {
  const rand = mulberry32(155);
  // Honey wood with fine grain, knots, vignette, inset border
  c.fillStyle = '#BD8738';
  c.fillRect(0, 0, w, h);
  let y = 0;
  while (y < h) {
    const gh = 1 + rand() * 2;
    const d = rand() * 0.035;
    if (d > 0.005) {
      c.fillStyle = `rgb(${Math.round((0.74 - d) * 255)}, ${Math.round((0.53 - d * 0.6) * 255)}, ${Math.round((0.22 - d * 0.3) * 255)})`;
      c.fillRect(0, y, w, gh);
    }
    y += gh;
  }
  for (let i = 0; i < 10; i += 1) {
    c.fillStyle = `rgba(82, 46, 18, ${0.03 + rand() * 0.04})`;
    c.fillRect(w * rand(), 0, 0.5 + rand(), h);
  }
  // Wood knots
  c.lineWidth = 1;
  for (const [kx, ky] of [[w * 0.18, h * 0.70], [w * 0.76, h * 0.30]]) {
    for (let ring = 1; ring <= 4; ring += 1) {
      c.strokeStyle = `rgba(89, 51, 20, ${0.09 / ring})`;
      c.beginPath();
      c.ellipse(kx, ky, ring * 9, ring * 4.5, 0, 0, Math.PI * 2);
      c.stroke();
    }
  }
  // Corner vignette
  for (const [cx, cy] of [[0, 0], [w, 0], [0, h], [w, h]]) {
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, w * 0.55);
    g.addColorStop(0, 'rgba(0, 0, 0, 0.18)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  }
  // Inset border frame
  c.fillStyle = '#4D290D';
  c.fillRect(0, 0, w, 8);
  c.fillRect(0, h - 8, w, 8);
  c.fillRect(0, 0, 8, h);
  c.fillRect(w - 8, 0, 8, h);
}

function paintBamboo(c, w, h, m) {
  const rand = mulberry32(156);
  // Pale kaya tan with bamboo stalk silhouettes. Light page tone.
  c.fillStyle = '#EBCC8C';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 14; i += 1) {
    c.fillStyle = `rgba(184, 140, 71, ${0.02 + rand() * 0.04})`;
    c.fillRect(0, (h * i) / 14, w, h / 14);
  }
  for (let i = 0; i < 5; i += 1) {
    const cx = w * (0.08 + i * 0.21);
    c.fillStyle = 'rgba(140, 166, 82, 0.18)';
    c.beginPath();
    c.roundRect(cx - 9, 0, 18, h, 2);
    c.fill();
    let ringY = 20 + rand() * 40;
    while (ringY < h) {
      c.fillStyle = 'rgba(89, 115, 51, 0.28)';
      c.fillRect(cx - 10, ringY, 22, 3);
      ringY += 70 + rand() * 40;
    }
    c.fillStyle = 'rgba(77, 102, 46, 0.20)';
    c.fillRect(cx + 5.5, 0, 2, h);
  }
  // Fine grain flecks + top vignette
  for (let i = 0; i < 60; i += 1) {
    c.fillStyle = `rgba(140, 102, 51, ${0.1 + rand() * 0.2})`;
    c.fillRect(w * rand(), h * rand(), 2 + rand() * 4, 1);
  }
  c.fillStyle = 'rgba(77, 51, 26, 0.18)';
  c.fillRect(0, 0, w, h * 0.15);
}

function paintClassicSlate(c, w, h, m) {
  const rand = mulberry32(157);
  // Cold blue-grey slate with seams and mineral flecks
  c.fillStyle = '#292E38';
  c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(61, 66, 77, 0.45)';
  c.fillRect(0, h * 0.30, w, h * 0.40);
  for (let i = 0; i < 8; i += 1) {
    const sx = w * rand();
    const sy = h * rand();
    const len = 40 + rand() * 80;
    const angle = (rand() - 0.5) * 0.8;
    c.strokeStyle = 'rgba(13, 15, 20, 0.60)';
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    c.stroke();
  }
  for (let i = 0; i < 70; i += 1) {
    const isLight = rand() < 0.2;
    c.fillStyle = isLight
      ? `rgba(166, 173, 184, ${0.2 + rand() * 0.25})`
      : `rgba(13, 15, 20, ${0.25 + rand() * 0.25})`;
    c.beginPath();
    c.arc(w * rand(), h * rand(), 0.6 + rand() * 1.2, 0, Math.PI * 2);
    c.fill();
  }
  glow(c, w * 0.5, -h * 0.05, w * 0.45, '166, 179, 204', 0.08, 2);
  c.fillStyle = '#0D0F14';
  c.fillRect(0, 0, w, 3);
  c.fillRect(0, h - 3, w, 3);
  c.fillRect(0, 0, 3, h);
  c.fillRect(w - 3, 0, 3, h);
}

function paintMarble(c, w, h, m) {
  const rand = mulberry32(158);
  // White marble with meandering grey veins. Light page tone.
  c.fillStyle = '#EDEDF0';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i += 1) {
    c.save();
    c.translate(w * rand(), h * rand());
    c.rotate(rand() * Math.PI);
    c.fillStyle = `rgba(153, 158, 168, ${0.02 + rand() * 0.03})`;
    c.beginPath();
    c.ellipse(0, 0, 60 + rand() * 90, 40 + rand() * 60, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
  for (let i = 0; i < 8; i += 1) {
    c.strokeStyle = `rgba(140, 148, 163, ${0.14 + rand() * 0.18})`;
    c.lineWidth = 0.8 + rand();
    c.beginPath();
    let px = -30 + rand() * w * 0.55;
    let py = -10;
    c.moveTo(px, py);
    while (py < h + 20) {
      const nx = px + 10 + rand() * 70;
      const ny = py + 90 + rand() * 130;
      c.quadraticCurveTo((px + nx) / 2 + (rand() - 0.5) * 90, (py + ny) / 2 + (rand() - 0.5) * 70, nx, ny);
      px = nx;
      py = ny;
    }
    c.stroke();
    // Short branch
    c.strokeStyle = 'rgba(140, 148, 163, 0.12)';
    c.lineWidth = 0.8;
    const bx = px - 30 - rand() * 90;
    const by = py - 150 - rand() * 200;
    c.beginPath();
    c.moveTo(bx, by);
    c.quadraticCurveTo(bx + (rand() - 0.3) * 60, by + 10 + rand() * 60, bx + 40 + rand() * 60, by + 40 + rand() * 70);
    c.stroke();
  }
}

function paintFelt(c, w, h, m) {
  const rand = mulberry32(159);
  // Deep casino felt under a table lamp, gold pinstripe
  c.fillStyle = '#0B381D';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.5, m * 0.6, '22, 82, 43', 0.35, 3);
  for (let i = 0; i < 60; i += 1) {
    c.fillStyle = `rgba(0, 31, 15, ${0.08 + rand() * 0.10})`;
    c.beginPath();
    c.arc(w * rand(), h * rand(), 0.5 + rand() * 0.7, 0, Math.PI * 2);
    c.fill();
  }
  for (let i = 0; i < 30; i += 1) {
    c.fillStyle = `rgba(77, 153, 102, ${0.04 + rand() * 0.04})`;
    c.beginPath();
    c.arc(w * rand(), h * rand(), 0.5 + rand() * 0.5, 0, Math.PI * 2);
    c.fill();
  }
  // Edge vignette + gold pinstripe
  c.fillStyle = 'rgba(0, 10, 5, 0.30)';
  const edgeW = w * 0.10;
  c.fillRect(0, 0, edgeW, h);
  c.fillRect(w - edgeW, 0, edgeW, h);
  c.fillRect(0, 0, w, edgeW);
  c.fillRect(0, h - edgeW, w, edgeW);
  c.strokeStyle = 'rgba(217, 179, 77, 0.50)';
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(16, 16, w - 32, h - 32, 20);
  c.stroke();
}

function paintLibrary(c, w, h, m) {
  const rand = mulberry32(160);
  c.fillStyle = '#241710';
  c.fillRect(0, 0, w, h);
  // Tall bookcases hugging both edges
  const books = ['#66241C', '#263D2E', '#59451A', '#2E2947', '#4D2E14'];
  const floorH = h * 0.15;
  for (const cxf of [0.115, 0.885]) {
    const caseW = w * 0.23;
    const caseH = h * 0.72;
    const caseX = w * cxf;
    c.fillStyle = '#1C120A';
    c.strokeStyle = '#0D0805';
    c.lineWidth = 2;
    c.fillRect(caseX - caseW / 2, h - floorH - caseH, caseW, caseH);
    c.strokeRect(caseX - caseW / 2, h - floorH - caseH, caseW, caseH);
    for (let row = 0; row < 6; row += 1) {
      const shelfY = h - floorH - caseH * (0.04 + row * 0.16);
      c.fillStyle = '#331F12';
      c.fillRect(caseX - caseW * 0.45, shelfY - 1.5, caseW * 0.9, 3);
      let bx = caseX - caseW * 0.40;
      while (bx < caseX + caseW * 0.36) {
        const bw = 5 + rand() * 4;
        const bh = 14 + rand() * 8;
        c.fillStyle = books[Math.floor(rand() * books.length)];
        c.fillRect(bx, shelfY - 2 - bh, bw, bh);
        bx += bw + 1.5;
      }
    }
  }
  // Leaning ladder against the right bookcase
  c.strokeStyle = '#4D331A';
  c.lineCap = 'round';
  c.lineWidth = 3.5;
  for (const railDX of [-7, 7]) {
    c.beginPath();
    c.moveTo(w * 0.70 + railDX, h - floorH);
    c.lineTo(w * 0.80 + railDX, h - floorH - h * 0.55);
    c.stroke();
  }
  c.lineWidth = 2.5;
  for (let i = 1; i < 7; i += 1) {
    const t = i / 7;
    const rx = w * 0.70 + (w * 0.10) * t;
    const ry = h - floorH - h * 0.55 * t;
    c.beginPath();
    c.moveTo(rx - 8.5, ry + 1);
    c.lineTo(rx + 8.5, ry - 1);
    c.stroke();
  }
  // Warm chandelier light from above
  glow(c, w * 0.5, h * 0.07, w * 0.3, '255, 199, 102', 0.08, 3);
  // Wood floor with an oriental rug
  c.fillStyle = '#38241;';
  c.fillStyle = '#382414';
  c.fillRect(0, h - floorH, w, floorH);
  c.fillStyle = '#5C1C1A';
  c.strokeStyle = 'rgba(166, 128, 56, 0.8)';
  c.lineWidth = 2;
  c.fillRect(w * 0.29, h - floorH * 0.80, w * 0.42, floorH * 0.62);
  c.strokeRect(w * 0.29, h - floorH * 0.80, w * 0.42, floorH * 0.62);
  c.strokeStyle = 'rgba(166, 128, 56, 0.45)';
  c.lineWidth = 1.2;
  c.strokeRect(w * 0.29 + 9, h - floorH * 0.80 + 7, w * 0.42 - 18, floorH * 0.62 - 14);
  // Globe on a stand, bottom-left
  c.fillStyle = '#B8945C';
  c.strokeStyle = '#66471F';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(w * 0.105, h - floorH - w * 0.052 + w * 0.052, w * 0.048, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(w * 0.105 - w * 0.03, h - floorH + w * 0.04);
  c.lineTo(w * 0.105 + w * 0.03, h - floorH + w * 0.04);
  c.stroke();
}

function paintGameNight(c, w, h, m) {
  // Big dice, dominoes, card fan, poker chips on felt
  c.fillStyle = '#0D361C';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.45, m * 0.6, '242, 217, 140', 0.07, 3);
  // Pair of big dice
  const die = (x, y, side, rot, pips) => {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.fillStyle = '#F2F0E6';
    c.strokeStyle = '#59544D';
    c.lineWidth = 2;
    c.beginPath();
    c.roundRect(-side / 2, -side / 2, side, side, side * 0.18);
    c.fill();
    c.stroke();
    c.fillStyle = '#1A1A1A';
    const pp = side * 0.26;
    const spots = {
      3: [[-pp, -pp], [0, 0], [pp, pp]],
      5: [[-pp, -pp], [pp, -pp], [0, 0], [-pp, pp], [pp, pp]],
    }[pips];
    for (const [dx, dy] of spots) {
      c.beginPath();
      c.arc(dx, dy, side * 0.09, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  };
  die(w * 0.36, h * 0.38, w * 0.17, 0.18, 5);
  die(w * 0.56, h * 0.48, w * 0.14, -0.24, 3);
  // Dominoes
  const domino = (x, y, dw, rot, top, bottom) => {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    const dh = dw * 2;
    c.fillStyle = '#F5F2EB';
    c.strokeStyle = '#4D473D';
    c.lineWidth = 1.5;
    c.beginPath();
    c.roundRect(-dw / 2, -dh / 2, dw, dh, 5);
    c.fill();
    c.stroke();
    c.beginPath();
    c.moveTo(-dw / 2, 0);
    c.lineTo(dw / 2, 0);
    c.stroke();
    c.fillStyle = '#1A1A1A';
    const layout = (n, cy) => {
      const off = dw * 0.22;
      const spots = { 1: [[0, 0]], 2: [[-off, -off], [off, off]], 3: [[-off, -off], [0, 0], [off, off]], 4: [[-off, -off], [off, -off], [-off, off], [off, off]] }[n];
      for (const [dx, dy] of spots) {
        c.beginPath();
        c.arc(dx, cy + dy, dw * 0.07, 0, Math.PI * 2);
        c.fill();
      }
    };
    layout(top, -dh / 4);
    layout(bottom, dh / 4);
    c.restore();
  };
  domino(w * 0.78, h * 0.30, w * 0.085, -0.5, 3, 1);
  domino(w * 0.18, h * 0.62, w * 0.085, 0.65, 2, 4);
  // Card fan, bottom-left
  for (const [i, rot] of [[0, 0.35], [1, 0.10], [2, -0.18]]) {
    c.save();
    c.translate(w * (0.20 + i * 0.06), h * 0.82);
    c.rotate(rot);
    c.fillStyle = '#F2F0E6';
    c.strokeStyle = 'rgba(89, 77, 56, 0.8)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.roundRect(-w * 0.065, -w * 0.0925, w * 0.13, w * 0.185, 7);
    c.fill();
    c.stroke();
    const hs = w * 0.0234;
    if (i === 1) {
      c.fillStyle = '#C71F24';
      c.beginPath();
      c.moveTo(0, hs);
      c.quadraticCurveTo(-hs * 1.2, hs * 0.4, -hs, -hs * 0.35);
      c.quadraticCurveTo(-hs * 0.5, -hs * 0.95, 0, -hs * 0.25);
      c.quadraticCurveTo(hs * 0.5, -hs * 0.95, hs, -hs * 0.35);
      c.quadraticCurveTo(hs * 1.2, hs * 0.4, 0, hs);
      c.fill();
    } else {
      c.fillStyle = '#141414';
      c.beginPath();
      c.moveTo(0, -hs);
      c.lineTo(hs * 0.7, 0);
      c.lineTo(0, hs);
      c.lineTo(-hs * 0.7, 0);
      c.closePath();
      c.fill();
    }
    c.restore();
  }
  // Poker chips, top-right
  for (const [i, color] of [[0, '#BF2121'], [1, '#2147A6']]) {
    const cx = w * (0.74 + i * 0.12);
    const cy = h * (0.14 + i * 0.06);
    c.fillStyle = color;
    c.strokeStyle = 'rgba(242, 242, 242, 0.9)';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, cy, w * 0.052, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = 'rgba(242, 242, 242, 0.9)';
    for (let tick = 0; tick < 6; tick += 1) {
      const a = (tick / 6) * Math.PI * 2;
      c.save();
      c.translate(cx + Math.cos(a) * w * 0.043, cy + Math.sin(a) * w * 0.043);
      c.rotate(a);
      c.fillRect(-w * 0.009, -w * 0.004, w * 0.018, w * 0.008);
      c.restore();
    }
  }
}

function paintVintageMap(c, w, h, m) {
  const rand = mulberry32(161);
  // Sepia world map: graticule, landmasses, dashed route, compass
  c.fillStyle = '#DECA99';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 10; i += 1) {
    c.fillStyle = `rgba(191, 166, 115, ${0.10 + rand() * 0.12})`;
    c.beginPath();
    c.ellipse(w * rand(), h * rand(), 30 + rand() * 50, 20 + rand() * 25, 0, 0, Math.PI * 2);
    c.fill();
  }
  const ink = 'rgba(107, 77, 41, 1)';
  c.fillStyle = 'rgba(107, 77, 41, 0.10)';
  const step = w / 5;
  for (let gx = step; gx < w; gx += step) c.fillRect(gx, 0, 1, h);
  for (let gy = step; gy < h; gy += step) c.fillRect(0, gy, w, 1);
  // Two landmasses toward opposite corners
  c.fillStyle = '#B39E66';
  c.strokeStyle = 'rgba(107, 77, 41, 0.7)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(-w * 0.05, h * 0.02);
  c.quadraticCurveTo(w * 0.18, h * 0.00, w * 0.30, h * 0.12);
  c.quadraticCurveTo(w * 0.34, h * 0.23, w * 0.18, h * 0.26);
  c.quadraticCurveTo(w * 0.04, h * 0.29, -w * 0.05, h * 0.20);
  c.closePath();
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(w * 1.05, h * 0.96);
  c.quadraticCurveTo(w * 0.86, h * 1.00, w * 0.68, h * 0.90);
  c.quadraticCurveTo(w * 0.62, h * 0.78, w * 0.80, h * 0.74);
  c.quadraticCurveTo(w * 0.96, h * 0.69, w * 1.05, h * 0.80);
  c.closePath();
  c.fill();
  c.stroke();
  // Dashed sea route between them
  c.strokeStyle = 'rgba(158, 46, 31, 0.85)';
  c.lineWidth = 2;
  c.setLineDash([9, 8]);
  c.beginPath();
  c.moveTo(w * 0.20, h * 0.15);
  c.quadraticCurveTo(w * 0.95, h * 0.42, w * 0.76, h * 0.84);
  c.stroke();
  c.setLineDash([]);
  // Tiny ship on the route
  const sx = w * 0.62;
  const sy = h * 0.44;
  c.strokeStyle = ink;
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(sx - 11, sy);
  c.quadraticCurveTo(sx, sy + 8, sx + 11, sy);
  c.stroke();
  c.beginPath();
  c.moveTo(sx, sy - 1);
  c.lineTo(sx, sy - 12);
  c.lineTo(sx + 9, sy - 3);
  c.closePath();
  c.stroke();
  // Compass rose, bottom-right
  const rc = [w * 0.82, h * 0.10];
  c.strokeStyle = ink;
  for (const r of [20, 12]) {
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(rc[0], rc[1], r, 0, Math.PI * 2);
    c.stroke();
  }
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    c.strokeStyle = i === 2 ? 'rgba(158, 46, 31, 1)' : ink;
    c.lineWidth = i === 2 ? 2.5 : 1;
    c.beginPath();
    c.moveTo(rc[0], rc[1]);
    c.lineTo(rc[0] + Math.cos(a) * 18, rc[1] - Math.sin(a) * 18);
    c.stroke();
  }
}

function paintCheckmate(c, w, h, m) {
  // Big king + knight silhouettes under a spotlight
  c.fillStyle = '#1A1A21';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.78, m * 0.45, '255, 224, 158', 0.06, 5);
  const ink = '#0A0A0F';
  const rim = 'rgba(217, 191, 128, 0.55)';
  // King, right of center
  const kx = w * 0.62;
  const kBase = h * 0.94;
  const ku = w * 0.075;
  c.fillStyle = ink;
  c.strokeStyle = rim;
  c.lineWidth = 1.5;
  c.beginPath();
  c.ellipse(kx, kBase, ku * 1.2, ku * 0.35, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(kx - ku * 0.95, kBase - ku * 0.2);
  c.quadraticCurveTo(kx - ku * 0.30, kBase - ku * 1.5, kx - ku * 0.38, kBase - ku * 3.1);
  c.lineTo(kx + ku * 0.38, kBase - ku * 3.1);
  c.quadraticCurveTo(kx + ku * 0.30, kBase - ku * 1.5, kx + ku * 0.95, kBase - ku * 0.2);
  c.closePath();
  c.fill();
  c.stroke();
  c.beginPath();
  c.ellipse(kx, kBase - ku * 3.15, ku * 0.65, ku * 0.2, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.beginPath();
  c.arc(kx, kBase - ku * 3.6, ku * 0.42, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillRect(kx - 2, kBase - ku * 4.8, 4, ku * 0.85);
  c.fillRect(kx - ku * 0.32, kBase - ku * 4.26 - 2, ku * 0.64, 4);
  // Knight, left of center
  const nx = w * 0.35;
  const nBase = h * 0.94;
  const nu = w * 0.065;
  c.beginPath();
  c.ellipse(nx, nBase, nu * 1.15, nu * 0.32, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(nx - nu * 0.85, nBase - nu * 0.2);
  c.quadraticCurveTo(nx - nu * 0.30, nBase - nu * 1.2, nx - nu * 0.45, nBase - nu * 2.2);
  c.quadraticCurveTo(nx - nu * 1.05, nBase - nu * 2.35, nx - nu * 1.15, nBase - nu * 2.9);
  c.lineTo(nx - nu * 1.05, nBase - nu * 3.25);
  c.quadraticCurveTo(nx - nu * 0.45, nBase - nu * 3.55, nx + nu * 0.10, nBase - nu * 3.7);
  c.lineTo(nx + nu * 0.32, nBase - nu * 4.15);
  c.lineTo(nx + nu * 0.55, nBase - nu * 3.45);
  c.quadraticCurveTo(nx + nu * 0.75, nBase - nu * 1.6, nx + nu * 0.85, nBase - nu * 0.2);
  c.closePath();
  c.fill();
  c.stroke();
}

function paintFireside(c, w, h, m) {
  // Stone hearth with fire, mantel clock, armchair, book stack
  c.fillStyle = '#211410';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.20, m * 0.5, '255, 153, 64', 0.05, 6);
  // Floor
  c.fillStyle = '#331F12';
  c.fillRect(0, h * 0.84, w, h * 0.16);
  // Hearth surround + mantel
  const hx = w * 0.5;
  const hy = h * 0.20;
  const hearthW = w * 0.34;
  const hearthH = h * 0.13;
  c.fillStyle = '#4D4038';
  c.strokeStyle = '#29211C';
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(hx - hearthW / 2, hy - hearthH / 2, hearthW, hearthH, 6);
  c.fill();
  c.stroke();
  c.fillStyle = '#5C381F';
  c.fillRect(hx - hearthW * 0.62, hy - hearthH * 0.5 - 9, hearthW * 1.24, 9);
  // Mantel clock
  const clkX = hx - hearthW * 0.30;
  const clkY = hy - hearthH * 0.5 - 22 - 9;
  c.fillStyle = '#D9CCAD';
  c.strokeStyle = '#66471F';
  c.beginPath();
  c.arc(clkX, clkY, 11, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.strokeStyle = '#33240F';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(clkX, clkY);
  c.lineTo(clkX + 5, clkY - 4);
  c.moveTo(clkX, clkY);
  c.lineTo(clkX, clkY - 7);
  c.stroke();
  // Firebox with layered flames
  c.fillStyle = '#0F0805';
  c.beginPath();
  c.roundRect(hx - hearthW * 0.31, hy - hearthH * 0.23, hearthW * 0.62, hearthH * 0.66, 5);
  c.fill();
  glow(c, hx, hy + hearthH * 0.10, hearthW * 0.20, '255, 140, 38', 0.035, 6);
  for (const [color, wf, hf] of [['rgba(242, 107, 26, 0.95)', 1.0, 1.0], ['rgba(255, 166, 46, 0.95)', 0.66, 0.75], ['rgba(255, 217, 102, 0.95)', 0.36, 0.5]]) {
    const fw = hearthW * 0.36 * wf;
    const fh = hearthH * 0.52 * hf;
    const baseY = hy + hearthH * 0.34;
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(hx - fw / 2, baseY);
    c.quadraticCurveTo(hx - fw * 0.42, baseY - fh * 0.7, hx, baseY - fh);
    c.quadraticCurveTo(hx + fw * 0.42, baseY - fh * 0.7, hx + fw / 2, baseY);
    c.closePath();
    c.fill();
  }
  c.fillStyle = '#381F0F';
  c.beginPath();
  c.roundRect(hx - hearthW * 0.25, hy + hearthH * 0.34, hearthW * 0.5, 8, 4);
  c.fill();
  // Rug + armchair silhouette + book stack near the bottom
  c.fillStyle = '#6B291F';
  c.strokeStyle = 'rgba(166, 115, 64, 0.7)';
  c.lineWidth = 2;
  c.beginPath();
  c.ellipse(w * 0.46, h * 0.925, w * 0.275, h * 0.0375, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  const chairInk = '#401A14';
  const chairX = w * 0.84;
  c.fillStyle = chairInk;
  c.fillRect(chairX - w * 0.085, h * 0.895, w * 0.17, h * 0.060);
  c.beginPath();
  c.roundRect(chairX + w * 0.05, h * 0.845, w * 0.06, h * 0.11, 8);
  c.fill();
  c.fillStyle = '#522418';
  c.beginPath();
  c.roundRect(chairX - w * 0.08, h * 0.886, w * 0.14, h * 0.018, 6);
  c.fill();
  const bookColors = ['#4D4D73', '#733F2E', '#385940'];
  for (let i = 0; i < 3; i += 1) {
    c.fillStyle = bookColors[i];
    c.beginPath();
    c.roundRect(w * 0.13 - (w * (0.10 - i * 0.015)) / 2, h * 0.955 - i * 8 - 7, w * (0.10 - i * 0.015), 7, 2);
    c.fill();
  }
}

function paintStudyDesk(c, w, h, m) {
  const rand = mulberry32(162);
  // Study desk: banker's lamp, book stack, inkwell, pen, spectacles
  c.fillStyle = '#452919';
  c.fillRect(0, 0, w, h);
  c.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 8; i += 1) {
    const gy = h * rand();
    c.beginPath();
    c.moveTo(0, gy);
    c.lineTo(w, gy + (rand() - 0.5) * 12);
    c.stroke();
  }
  // Banker's lamp, top-left
  const lampX = w * 0.24;
  const lampBase = h * 0.20;
  glow(c, lampX, lampBase - 25, w * 0.2, '255, 204, 102', 0.12, 3);
  const brass = '#B38C40';
  c.fillStyle = brass;
  c.beginPath();
  c.ellipse(lampX, lampBase, 20, 4.5, 0, 0, Math.PI * 2);
  c.fill();
  c.fillRect(lampX - 1.75, lampBase - 42, 3.5, 42);
  c.fillStyle = '#1A6640';
  c.strokeStyle = 'rgba(179, 140, 64, 0.9)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(lampX - 34, lampBase - 42);
  c.lineTo(lampX + 34, lampBase - 42);
  c.lineTo(lampX + 22, lampBase - 62);
  c.lineTo(lampX - 22, lampBase - 62);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = 'rgba(255, 217, 128, 0.55)';
  c.beginPath();
  c.ellipse(lampX, lampBase - 40, 28, 4, 0, 0, Math.PI * 2);
  c.fill();
  // Book stack, top-right
  const bookColors = ['#6B241F', '#244761', '#4D5729'];
  for (let i = 0; i < 3; i += 1) {
    c.fillStyle = bookColors[i];
    c.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    c.lineWidth = 1;
    const bw = 86 - i * 8;
    c.beginPath();
    c.roundRect(w * 0.72 - bw / 2 + (i % 2) * 5, h * 0.18 - i * 17 - 8, bw, 16, 3);
    c.fill();
    c.stroke();
  }
  // Inkwell
  c.fillStyle = '#140F1A';
  c.strokeStyle = 'rgba(179, 140, 64, 0.8)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(w * 0.52, h * 0.13, 9, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // Pen + spectacles near the bottom
  c.strokeStyle = '#1A140F';
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(w * 0.20, h * 0.90);
  c.lineTo(w * 0.42, h * 0.86);
  c.stroke();
  c.fillStyle = '#D9B34D';
  c.beginPath();
  c.arc(w * 0.42, h * 0.86, 2.5, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = 'rgba(179, 140, 64, 0.9)';
  c.lineWidth = 2;
  for (const dx of [-14, 14]) {
    c.fillStyle = 'rgba(255, 255, 255, 0.06)';
    c.beginPath();
    c.arc(w * 0.68 + dx, h * 0.88, 12, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }
  c.beginPath();
  c.moveTo(w * 0.68 - 2, h * 0.88);
  c.lineTo(w * 0.68 + 2, h * 0.88);
  c.stroke();
}

function paintPark(c, w, h, m) {
  const rand = mulberry32(163);
  // Picnic table in the park: grass, tree canopy, daisies, fallen leaves
  c.fillStyle = '#52753D';
  c.fillRect(0, 0, w, h);
  // Tree canopy hanging into the top
  c.fillStyle = '#335729';
  for (const [xf, yf, r] of [[0.10, -0.02, 0.30], [0.38, -0.08, 0.34], [0.70, -0.04, 0.30], [0.95, -0.10, 0.28]]) {
    c.beginPath();
    c.arc(w * xf, h * yf, w * r, 0, Math.PI * 2);
    c.fill();
  }
  // Sun dapple on the grass
  for (let i = 0; i < 6; i += 1) {
    c.fillStyle = 'rgba(242, 242, 166, 0.10)';
    c.beginPath();
    c.ellipse(w * rand(), h * (0.3 + rand() * 0.6), 20 + rand() * 25, 8 + rand() * 7, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Daisies in the upper grass
  for (const [xf, yf] of [[0.20, 0.28], [0.55, 0.31], [0.82, 0.27]]) {
    const dx0 = w * xf;
    const dy0 = h * yf;
    c.fillStyle = 'rgba(242, 242, 242, 0.9)';
    for (let i = 0; i < 5; i += 1) {
      const a = (i * Math.PI * 2) / 5;
      c.save();
      c.translate(dx0 + Math.cos(a) * 5, dy0 + Math.sin(a) * 5);
      c.rotate(a);
      c.beginPath();
      c.ellipse(0, 0, 3.5, 1.75, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
    c.fillStyle = '#F2C740';
    c.beginPath();
    c.arc(dx0, dy0, 3, 0, Math.PI * 2);
    c.fill();
  }
  // Fallen autumn leaves near the bottom
  const leaves = ['rgba(204, 128, 46, 0.9)', 'rgba(217, 166, 51, 0.9)', 'rgba(153, 77, 36, 0.9)'];
  for (let i = 0; i < 9; i += 1) {
    c.fillStyle = leaves[i % 3];
    c.save();
    c.translate(12 + rand() * (w - 24), h * (0.84 + rand() * 0.13));
    c.rotate(rand() * Math.PI);
    c.beginPath();
    c.ellipse(0, 0, 6.5, 3.5, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

export const CLASSIC_SCENES = [
  { key: 'wood', name: 'Wood', paint: paintWood },
  { key: 'bamboo', name: 'Bamboo', paint: paintBamboo, light: true },
  { key: 'classicSlate', name: 'Slate', paint: paintClassicSlate },
  { key: 'marble', name: 'Marble', paint: paintMarble, light: true },
  { key: 'felt', name: 'Green Felt', paint: paintFelt },
  { key: 'library', name: 'Library', paint: paintLibrary },
  { key: 'gameNight', name: 'Game Night', paint: paintGameNight },
  { key: 'vintageMap', name: 'Vintage Map', paint: paintVintageMap, light: true },
  { key: 'checkmate', name: 'Checkmate', paint: paintCheckmate },
  { key: 'fireside', name: 'Fireside', paint: paintFireside },
  { key: 'studyDesk', name: 'Study Desk', paint: paintStudyDesk },
  { key: 'park', name: 'Park', paint: paintPark },
];
