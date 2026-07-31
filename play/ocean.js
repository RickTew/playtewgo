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

function paintAbyss(c, w, h, m) {
  sky(c, w, h, '#04101c', '#020a14', '#01040a');
  const rand = mulberry32(82);
  glow(c, w * 0.5, -h * 0.2, m * 0.5, '20, 60, 90', 0.3, 3);
  // Bioluminescent drift
  for (let i = 0; i < 40; i += 1) {
    const x = w * rand();
    const y = h * (0.2 + rand() * 0.78);
    const rgb = rand() < 0.5 ? '80, 240, 220' : '90, 160, 255';
    glow(c, x, y, 3 + rand() * 7, rgb, 0.5 + rand() * 0.4, 2);
  }
  // One anglerfish lure
  glow(c, w * 0.72, h * 0.62, m * 0.03, '180, 255, 240', 0.9, 3);
  bubbles(c, w, h, rand, 10, '90, 140, 170');
}

function paintChartTable(c, w, h, m) {
  // The captain's chart room in daylight: warm paper tones, ink coasts,
  // a compass rose. Light page tone like iOS.
  sky(c, w, h, '#D9C79C', '#CCB88C', '#B89F70');
  const rand = mulberry32(83);
  glow(c, w * 0.3, h * 0.25, m * 0.5, '255, 245, 220', 0.5, 3);
  // Ink coastlines
  c.strokeStyle = 'rgba(70, 90, 110, 0.5)';
  c.lineWidth = 2;
  for (let k = 0; k < 3; k += 1) {
    c.beginPath();
    let x = -10;
    let y = h * (0.2 + k * 0.3);
    c.moveTo(x, y);
    while (x < w + 10) {
      x += 20 + rand() * 40;
      y += (rand() - 0.5) * h * 0.1;
      c.lineTo(x, y);
    }
    c.stroke();
  }
  // Compass rose
  const cx = w * 0.82;
  const cy = h * 0.76;
  const cr = m * 0.09;
  c.strokeStyle = 'rgba(90, 70, 40, 0.55)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(cx, cy, cr, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.arc(cx, cy, cr * 0.55, 0, Math.PI * 2);
  c.stroke();
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    const len = i % 2 === 0 ? cr : cr * 0.6;
    c.beginPath();
    c.moveTo(cx, cy);
    c.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    c.stroke();
  }
}

function paintCabin(c, w, h, m) {
  sky(c, w, h, '#3a2718', '#2c1d10', '#1a100a');
  // Lantern glow pools
  glow(c, w * 0.25, h * 0.35, m * 0.35, '255, 180, 90', 0.5, 4);
  glow(c, w * 0.78, h * 0.6, m * 0.28, '255, 160, 70', 0.4, 3);
  // Porthole with sea outside
  const px = w * 0.72;
  const py = h * 0.22;
  const pr = m * 0.08;
  c.save();
  c.beginPath();
  c.arc(px, py, pr, 0, Math.PI * 2);
  c.clip();
  sky(c, w, h * 0.5, '#0a3f63', '#083048', '#052238');
  glow(c, px, py - pr * 0.5, pr, '140, 220, 255', 0.5, 2);
  c.restore();
  c.strokeStyle = '#8a6a3a';
  c.lineWidth = pr * 0.22;
  c.beginPath();
  c.arc(px, py, pr, 0, Math.PI * 2);
  c.stroke();
  // Warm plank tones
  const rand = mulberry32(84);
  for (let i = 0; i < 8; i += 1) {
    glow(c, w * rand(), h * (0.7 + rand() * 0.28), m * (0.05 + rand() * 0.1), '10, 5, 2', 0.5, 2);
  }
}

function paintTreasureMap(c, w, h, m) {
  // Full-bleed parchment map. Light page tone like iOS.
  sky(c, w, h, '#E3D2A8', '#D8C494', '#C4AC78');
  const rand = mulberry32(85);
  glow(c, w * 0.5, h * 0.4, m * 0.6, '255, 248, 230', 0.4, 3);
  // Island coast
  c.strokeStyle = 'rgba(100, 80, 50, 0.6)';
  c.lineWidth = 2.5;
  c.beginPath();
  const icx = w * 0.55;
  const icy = h * 0.5;
  for (let i = 0; i <= 20; i += 1) {
    const a = (i / 20) * Math.PI * 2;
    const rr = m * (0.16 + rand() * 0.05);
    const x = icx + Math.cos(a) * rr * 1.3;
    const y = icy + Math.sin(a) * rr;
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.closePath();
  c.stroke();
  // Dashed route to the X
  c.strokeStyle = 'rgba(140, 40, 30, 0.7)';
  c.setLineDash([8, 7]);
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(w * 0.06, h * 0.9);
  c.quadraticCurveTo(w * 0.3, h * 0.55, icx - m * 0.03, icy + m * 0.02);
  c.stroke();
  c.setLineDash([]);
  // X marks the spot
  c.strokeStyle = 'rgba(150, 30, 20, 0.85)';
  c.lineWidth = 4;
  const xs = m * 0.022;
  c.beginPath();
  c.moveTo(icx - xs, icy - xs);
  c.lineTo(icx + xs, icy + xs);
  c.moveTo(icx + xs, icy - xs);
  c.lineTo(icx - xs, icy + xs);
  c.stroke();
  // Waves in the sea margins
  c.strokeStyle = 'rgba(90, 110, 130, 0.35)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 10; i += 1) {
    const x = w * rand();
    const y = h * rand();
    const d = Math.hypot(x - icx, (y - icy) * 1.3);
    if (d < m * 0.26) continue;
    c.beginPath();
    c.arc(x, y, 8, Math.PI * 1.15, Math.PI * 1.85);
    c.stroke();
  }
}

function paintKraken(c, w, h, m) {
  sky(c, w, h, '#122030', '#0a141f', '#050a10');
  glow(c, w * 0.5, h * 0.1, m * 0.5, '150, 190, 220', 0.3, 3);
  const rand = mulberry32(86);
  // Rain-flecked storm light
  glow(c, w * 0.2, h * 0.3, m * 0.4, '60, 90, 120', 0.3, 3);
  // Tentacles rising from the bottom
  c.strokeStyle = 'rgba(25, 12, 35, 0.9)';
  c.lineCap = 'round';
  const bases = [0.12, 0.32, 0.55, 0.75, 0.92];
  for (let i = 0; i < bases.length; i += 1) {
    const bx = w * bases[i];
    const tall = h * (0.35 + rand() * 0.35);
    const sway = (rand() - 0.5) * w * 0.2;
    c.lineWidth = 14 + rand() * 14;
    c.beginPath();
    c.moveTo(bx, h + 20);
    c.bezierCurveTo(bx - sway, h - tall * 0.4, bx + sway, h - tall * 0.75, bx + sway * 0.4, h - tall);
    c.stroke();
    // Tapered tip
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(bx + sway * 0.4, h - tall);
    c.quadraticCurveTo(bx + sway * 0.6, h - tall - 30, bx + sway * 0.2, h - tall - 46);
    c.stroke();
  }
  bubbles(c, w, h, rand, 14, '120, 160, 190');
}

function paintShipDeck(c, w, h, m) {
  // On deck: sky and sea above the rail, warm planks below
  sky(c, w, h * 0.45, '#7fb3d4', '#5a92b8', '#3d6f94');
  glow(c, w * 0.78, h * 0.1, m * 0.2, '255, 245, 210', 0.7, 3);
  // Horizon and rail
  c.fillStyle = '#2c4a63';
  c.fillRect(0, h * 0.38, w, h * 0.05);
  c.fillStyle = '#5a3d22';
  c.fillRect(0, h * 0.43, w, h * 0.03);
  // Deck planks
  const deck = c.createLinearGradient(0, h * 0.46, 0, h);
  deck.addColorStop(0, '#8a6238');
  deck.addColorStop(1, '#5a3c20');
  c.fillStyle = deck;
  c.fillRect(0, h * 0.46, w, h * 0.54);
  c.strokeStyle = 'rgba(40, 24, 10, 0.4)';
  c.lineWidth = 1.5;
  for (let i = 1; i < 7; i += 1) {
    const y = h * (0.46 + 0.54 * (i / 7));
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(w, y);
    c.stroke();
  }
  // Rigging ropes
  c.strokeStyle = 'rgba(30, 20, 10, 0.5)';
  c.lineWidth = 2.5;
  for (const [x0, x1] of [[0.06, 0.22], [0.94, 0.78]]) {
    c.beginPath();
    c.moveTo(w * x0, 0);
    c.lineTo(w * x1, h * 0.43);
    c.stroke();
  }
  const rand = mulberry32(87);
  for (let i = 0; i < 6; i += 1) {
    glow(c, w * rand(), h * (0.5 + rand() * 0.45), m * (0.04 + rand() * 0.08), '20, 10, 5', 0.35, 2);
  }
}

function paintSeabed(c, w, h, m) {
  sky(c, w, h * 0.7, '#0a3f5c', '#083048', '#06263a');
  const rand = mulberry32(88);
  lightRays(c, w, h * 0.75, rand, '140, 220, 255', 0.10, 5);
  // Sand floor
  const sand = c.createLinearGradient(0, h * 0.68, 0, h);
  sand.addColorStop(0, '#8a7a52');
  sand.addColorStop(1, '#5c5136');
  c.fillStyle = sand;
  c.beginPath();
  c.moveTo(0, h * 0.72);
  for (let i = 0; i <= 6; i += 1) {
    c.quadraticCurveTo(w * ((i + 0.5) / 6), h * (0.68 + (i % 2) * 0.04), w * ((i + 1) / 6), h * 0.72);
  }
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();
  c.fill();
  // Rocks and a starfish
  for (let i = 0; i < 7; i += 1) {
    const x = w * rand();
    const y = h * (0.78 + rand() * 0.18);
    const r = m * (0.015 + rand() * 0.03);
    const g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, '#7a8a92');
    g.addColorStop(1, '#3a4448');
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(x, y, r, r * 0.7, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = 'rgba(230, 130, 90, 0.8)';
  const sx = w * 0.3;
  const sy = h * 0.88;
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    c.beginPath();
    c.ellipse(sx + Math.cos(a) * m * 0.012, sy + Math.sin(a) * m * 0.012, m * 0.012, m * 0.005, a, 0, Math.PI * 2);
    c.fill();
  }
  bubbles(c, w, h, rand, 16);
  for (let i = 0; i < 4; i += 1) {
    fishDash(c, w * rand(), h * (0.25 + rand() * 0.35), 5 + rand() * 3, '170, 215, 235', 0.3);
  }
}

export const OCEAN_SCENES = [
  { key: 'deep', name: 'Deep', paint: paintDeep },
  { key: 'reef', name: 'Coral Reef', paint: paintReef },
  { key: 'oceanStorm', name: 'Storm', paint: paintStorm },
  { key: 'lagoon', name: 'Lagoon', paint: paintLagoon },
  { key: 'abyss', name: 'Abyss', paint: paintAbyss },
  { key: 'chartTable', name: 'Chart Table', paint: paintChartTable, light: true },
  { key: 'cabin', name: 'Cabin', paint: paintCabin },
  { key: 'moonlit', name: 'Moonlit Sea', paint: paintMoonlit },
  { key: 'treasureMap', name: 'Treasure Map', paint: paintTreasureMap, light: true },
  { key: 'kraken', name: 'Kraken', paint: paintKraken },
  { key: 'shipDeck', name: 'Ship Deck', paint: paintShipDeck },
  { key: 'seabed', name: 'Seabed', paint: paintSeabed },
];
