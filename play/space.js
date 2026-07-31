// Space scene backgrounds, echoing the iOS catalog (BackgroundRenderer.swift
// space scenes). Painted scenes follow the iOS glow rule: layered soft radial
// glows, never hard-edged discs. Seeded so each scene is stable between
// visits. Shared painting helpers are exported for the other theme files.

export function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function glow(c, x, y, r, rgb, alpha, layers = 3) {
  for (let i = layers; i >= 1; i -= 1) {
    const rr = (r * i) / layers;
    const g = c.createRadialGradient(x, y, 0, x, y, rr);
    g.addColorStop(0, `rgba(${rgb}, ${alpha / layers})`);
    g.addColorStop(0.6, `rgba(${rgb}, ${alpha / (layers * 2)})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, rr, 0, Math.PI * 2);
    c.fill();
  }
}

export function sky(c, w, h, top, mid, bottom) {
  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(0.45, mid);
  g.addColorStop(1, bottom);
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
}

export function starfield(c, w, h, rand, { density = 6500, aMin = 0.3, aMax = 1.0, glint = 0.06 } = {}) {
  const count = Math.round((w * h) / density);
  for (let i = 0; i < count; i += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.4 + rand() * 1.4;
    const a = aMin + rand() * (aMax - aMin);
    c.fillStyle = `rgba(255, 255, 255, ${a})`;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    if (rand() < glint) glow(c, x, y, r * 7, '200, 220, 255', 0.8, 2);
  }
}

function ringedPlanet(c, x, y, r) {
  glow(c, x, y, r * 3.2, '90, 160, 255', 0.5, 3);
  // Far side of the ring passes BEHIND the planet, so it is drawn first
  // and the body occludes it (planets are not made of gas... usually).
  c.save();
  c.translate(x, y);
  c.rotate(-0.35);
  c.strokeStyle = 'rgba(180, 210, 255, 0.25)';
  c.lineWidth = r * 0.16;
  c.beginPath();
  c.ellipse(0, 0, r * 1.75, r * 0.5, 0, Math.PI + 0.15, Math.PI * 2 - 0.15);
  c.stroke();
  c.restore();
  const body = c.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
  body.addColorStop(0, '#9fd4ff');
  body.addColorStop(0.5, '#3f7fd4');
  body.addColorStop(1, '#122a52');
  c.fillStyle = body;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.save();
  c.translate(x, y);
  c.rotate(-0.35);
  c.strokeStyle = 'rgba(180, 210, 255, 0.55)';
  c.lineWidth = r * 0.16;
  c.beginPath();
  c.ellipse(0, 0, r * 1.75, r * 0.5, 0, 0.15, Math.PI - 0.15);
  c.stroke();
  c.restore();
}

function moon(c, x, y, r) {
  glow(c, x, y, r * 3, '220, 230, 255', 0.4, 2);
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, '#f0f4ff');
  g.addColorStop(1, '#5a6a8a');
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
}

// ----- Painted scenes -----

function paintNebula(c, w, h, m) {
  sky(c, w, h, '#0b0b2a', '#0a0a1e', '#060614');
  glow(c, w * 0.80, h * 0.16, m * 0.55, '124, 77, 255', 0.55, 4);
  glow(c, w * 0.70, h * 0.28, m * 0.35, '64, 156, 255', 0.40, 3);
  glow(c, w * 0.12, h * 0.78, m * 0.50, '30, 110, 220', 0.45, 4);
  glow(c, w * 0.22, h * 0.62, m * 0.30, '124, 77, 255', 0.30, 3);
  glow(c, w * 0.55, h * 0.95, m * 0.40, '255, 110, 199', 0.22, 3);
  glow(c, w * 0.05, h * 0.10, m * 0.35, '80, 200, 255', 0.25, 3);
  starfield(c, w, h, mulberry32(20260731));
  ringedPlanet(c, w * 0.86, h * 0.13, m * 0.075);
  moon(c, w * 0.07, h * 0.30, m * 0.022);
}

function paintVoid(c, w, h, m) {
  sky(c, w, h, '#05050f', '#030309', '#020205');
  glow(c, w * 0.75, h * 0.85, m * 0.45, '60, 80, 160', 0.14, 3);
  starfield(c, w, h, mulberry32(11), { density: 11000, aMin: 0.15, aMax: 0.6, glint: 0.02 });
}

function paintAurora(c, w, h, m) {
  sky(c, w, h, '#04121c', '#051020', '#030812');
  // Curtain: overlapping green/teal glows sweeping across the upper sky
  const rand = mulberry32(22);
  for (let i = 0; i < 7; i += 1) {
    const x = w * (0.08 + 0.14 * i);
    const y = h * (0.16 + 0.10 * Math.sin(i * 1.3));
    const rgb = i % 2 === 0 ? '61, 255, 160' : '80, 220, 255';
    glow(c, x, y, m * (0.22 + rand() * 0.12), rgb, 0.4, 3);
  }
  glow(c, w * 0.5, h * 0.08, m * 0.6, '61, 255, 160', 0.22, 3);
  glow(c, w * 0.2, h * 0.9, m * 0.35, '30, 110, 220', 0.18, 3);
  starfield(c, w, h, mulberry32(23), { density: 8000, aMax: 0.8 });
}

function paintCrimson(c, w, h, m) {
  sky(c, w, h, '#1c060a', '#120408', '#080204');
  glow(c, w * 0.78, h * 0.20, m * 0.5, '255, 70, 60', 0.5, 4);
  glow(c, w * 0.60, h * 0.35, m * 0.32, '255, 140, 60', 0.35, 3);
  glow(c, w * 0.15, h * 0.75, m * 0.45, '200, 40, 80', 0.4, 4);
  glow(c, w * 0.35, h * 0.92, m * 0.35, '255, 90, 40', 0.25, 3);
  glow(c, w * 0.05, h * 0.12, m * 0.3, '255, 60, 120', 0.25, 3);
  starfield(c, w, h, mulberry32(33), { density: 8500, aMax: 0.85 });
}

function paintGalaxy(c, w, h, m) {
  sky(c, w, h, '#070718', '#050512', '#03030a');
  const cx = w * 0.68;
  const cy = h * 0.30;
  // Spiral arms: glows placed along a logarithmic spiral around the core
  const rand = mulberry32(44);
  for (let t = 0; t < 26; t += 1) {
    const angle = t * 0.42;
    const dist = m * 0.028 * Math.exp(0.115 * t);
    if (dist > m * 0.5) break;
    const x = cx + Math.cos(angle) * dist * 1.25;
    const y = cy + Math.sin(angle) * dist * 0.6;
    const rgb = t % 3 === 0 ? '190, 170, 255' : t % 3 === 1 ? '120, 160, 255' : '230, 235, 255';
    glow(c, x, y, m * (0.05 + rand() * 0.05), rgb, 0.35, 2);
  }
  glow(c, cx, cy, m * 0.16, '255, 240, 210', 0.9, 4); // core
  glow(c, cx, cy, m * 0.05, '255, 255, 240', 0.9, 2);
  glow(c, w * 0.12, h * 0.80, m * 0.4, '90, 70, 180', 0.25, 3);
  starfield(c, w, h, mulberry32(45), { density: 7000 });
}

function paintAsteroids(c, w, h, m) {
  sky(c, w, h, '#0a0d16', '#080a12', '#04050a');
  glow(c, w * 0.75, h * 0.75, m * 0.5, '80, 200, 255', 0.16, 3); // ion haze
  glow(c, w * 0.2, h * 0.2, m * 0.4, '120, 140, 200', 0.18, 3);
  starfield(c, w, h, mulberry32(55), { density: 9000, aMax: 0.85 });
  // Comet: bright head with a tapered tail
  const hx = w * 0.30;
  const hy = h * 0.18;
  const tail = c.createLinearGradient(hx, hy, hx + m * 0.30, hy - m * 0.12);
  tail.addColorStop(0, 'rgba(200, 230, 255, 0.7)');
  tail.addColorStop(1, 'rgba(200, 230, 255, 0)');
  c.strokeStyle = tail;
  c.lineWidth = 2.5;
  c.beginPath();
  c.moveTo(hx, hy);
  c.lineTo(hx + m * 0.30, hy - m * 0.12);
  c.stroke();
  glow(c, hx, hy, m * 0.02, '220, 240, 255', 1.0, 2);
  // Drifting rocks: shaded ellipses with a crater or two
  const rand = mulberry32(56);
  for (let i = 0; i < 13; i += 1) {
    const x = rand() * w;
    const y = h * (0.25 + rand() * 0.7);
    const r = m * (0.012 + rand() * 0.035);
    const rot = rand() * Math.PI;
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    const g = c.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, '#9aa3b2');
    g.addColorStop(0.7, '#565e6c');
    g.addColorStop(1, '#2c313c');
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(0, 0, r, r * (0.65 + rand() * 0.3), 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(20, 24, 32, 0.5)';
    c.beginPath();
    c.arc(r * 0.25, r * 0.1, r * 0.2, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

function paintRingedPlanet(c, w, h, m) {
  sky(c, w, h, '#08081e', '#060616', '#03030c');
  starfield(c, w, h, mulberry32(61), { density: 7500 });
  const px = w * 0.62;
  const py = h * 0.38;
  const pr = m * 0.24;
  glow(c, px, py, pr * 2.2, '90, 160, 255', 0.45, 3);
  // Far side of the rings first, so the planet body occludes it
  c.save();
  c.translate(px, py);
  c.rotate(-0.3);
  for (const [rr, a] of [[1.5, 0.5], [1.75, 0.35], [1.95, 0.2]]) {
    c.strokeStyle = `rgba(190, 215, 255, ${a * 0.45})`;
    c.lineWidth = pr * 0.1;
    c.beginPath();
    c.ellipse(0, 0, pr * rr, pr * rr * 0.28, 0, Math.PI + 0.1, Math.PI * 2 - 0.1);
    c.stroke();
  }
  c.restore();
  const body = c.createRadialGradient(px - pr * 0.4, py - pr * 0.4, pr * 0.1, px, py, pr);
  body.addColorStop(0, '#a8d8ff');
  body.addColorStop(0.55, '#3f7fd4');
  body.addColorStop(1, '#0e2246');
  c.fillStyle = body;
  c.beginPath();
  c.arc(px, py, pr, 0, Math.PI * 2);
  c.fill();
  // Cloud bands clipped to the sphere
  c.save();
  c.beginPath();
  c.arc(px, py, pr, 0, Math.PI * 2);
  c.clip();
  for (const [dy, alpha] of [[-0.55, 0.18], [-0.25, 0.12], [0.1, 0.16], [0.45, 0.12], [0.7, 0.18]]) {
    c.fillStyle = `rgba(220, 240, 255, ${alpha})`;
    c.beginPath();
    c.ellipse(px, py + pr * dy, pr * 1.05, pr * 0.09, -0.08, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  // Rings: near side only - the far side is hidden behind the planet
  c.save();
  c.translate(px, py);
  c.rotate(-0.3);
  for (const [rr, a] of [[1.5, 0.5], [1.75, 0.35], [1.95, 0.2]]) {
    c.strokeStyle = `rgba(190, 215, 255, ${a})`;
    c.lineWidth = pr * 0.1;
    c.beginPath();
    c.ellipse(0, 0, pr * rr, pr * rr * 0.28, 0, 0.1, Math.PI - 0.1);
    c.stroke();
  }
  c.restore();
  moon(c, w * 0.16, h * 0.16, m * 0.03);
}

function paintHoloTable(c, w, h, m) {
  sky(c, w, h, '#05070d', '#04060b', '#020307');
  const cx = w * 0.5;
  const cy = h * 0.5;
  glow(c, cx, cy, m * 0.55, '60, 200, 240', 0.35, 4);
  c.strokeStyle = 'rgba(80, 220, 255, 0.22)';
  c.lineWidth = 1;
  for (const rr of [0.18, 0.30, 0.42, 0.54]) {
    c.beginPath();
    c.arc(cx, cy, m * rr, 0, Math.PI * 2);
    c.stroke();
  }
  // Radial ticks + drifting data points
  const rand = mulberry32(62);
  c.strokeStyle = 'rgba(80, 220, 255, 0.14)';
  for (let i = 0; i < 24; i += 1) {
    const a = (i / 24) * Math.PI * 2;
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * m * 0.18, cy + Math.sin(a) * m * 0.18);
    c.lineTo(cx + Math.cos(a) * m * 0.54, cy + Math.sin(a) * m * 0.54);
    c.stroke();
  }
  c.fillStyle = 'rgba(140, 235, 255, 0.7)';
  for (let i = 0; i < 26; i += 1) {
    const a = rand() * Math.PI * 2;
    const d = m * (0.1 + rand() * 0.45);
    c.beginPath();
    c.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 1 + rand() * 1.6, 0, Math.PI * 2);
    c.fill();
  }
  glow(c, w * 0.12, h * 0.1, m * 0.25, '30, 60, 110', 0.3, 3);
  glow(c, w * 0.9, h * 0.9, m * 0.25, '30, 60, 110', 0.3, 3);
}

function paintStation(c, w, h, m) {
  sky(c, w, h, '#171c26', '#10141d', '#090b11');
  // Viewport window with stars and a planet sliver
  const vx = w * 0.5;
  const vy = h * 0.20;
  const vw = w * 0.66;
  const vh = h * 0.22;
  c.save();
  c.beginPath();
  c.roundRect(vx - vw / 2, vy - vh / 2, vw, vh, 18);
  c.clip();
  sky(c, w, h * 0.5, '#04041a', '#03030f', '#020208');
  starfield(c, w, h * 0.45, mulberry32(63), { density: 3800, aMax: 0.9 });
  glow(c, vx + vw * 0.3, vy + vh * 0.65, m * 0.12, '90, 160, 255', 0.8, 3);
  c.restore();
  c.strokeStyle = 'rgba(160, 190, 230, 0.45)';
  c.lineWidth = 4;
  c.beginPath();
  c.roundRect(vx - vw / 2, vy - vh / 2, vw, vh, 18);
  c.stroke();
  // Light strips along the deck
  for (const y of [h * 0.52, h * 0.78]) {
    glow(c, w * 0.5, y, m * 0.3, '120, 200, 255', 0.12, 2);
    c.fillStyle = 'rgba(150, 215, 255, 0.35)';
    c.fillRect(w * 0.08, y, w * 0.84, 2);
  }
  glow(c, w * 0.1, h * 0.95, m * 0.3, '40, 60, 100', 0.35, 3);
  glow(c, w * 0.9, h * 0.95, m * 0.3, '40, 60, 100', 0.35, 3);
}

function paintStarChart(c, w, h, m) {
  sky(c, w, h, '#0a1128', '#081022', '#050a18');
  // Graticule
  c.strokeStyle = 'rgba(90, 130, 200, 0.16)';
  c.lineWidth = 1;
  for (let i = 1; i < 6; i += 1) {
    c.beginPath();
    c.moveTo((w / 6) * i, 0);
    c.lineTo((w / 6) * i, h);
    c.stroke();
    c.beginPath();
    c.moveTo(0, (h / 6) * i);
    c.lineTo(w, (h / 6) * i);
    c.stroke();
  }
  // Constellations: seeded star clusters joined by thin lines
  const rand = mulberry32(64);
  for (let k = 0; k < 5; k += 1) {
    const pts = [];
    let x = w * (0.1 + rand() * 0.8);
    let y = h * (0.1 + rand() * 0.8);
    for (let i = 0; i < 4 + Math.floor(rand() * 3); i += 1) {
      pts.push([x, y]);
      x += (rand() - 0.5) * w * 0.16;
      y += (rand() - 0.5) * h * 0.16;
    }
    c.strokeStyle = 'rgba(150, 190, 255, 0.30)';
    c.beginPath();
    pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py)));
    c.stroke();
    for (const [px, py] of pts) {
      glow(c, px, py, 6, '190, 220, 255', 0.8, 2);
      c.fillStyle = '#dce8ff';
      c.beginPath();
      c.arc(px, py, 1.6, 0, Math.PI * 2);
      c.fill();
    }
  }
  // Dashed route
  c.strokeStyle = 'rgba(255, 214, 10, 0.5)';
  c.setLineDash([7, 7]);
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(w * 0.08, h * 0.85);
  c.quadraticCurveTo(w * 0.4, h * 0.45, w * 0.9, h * 0.18);
  c.stroke();
  c.setLineDash([]);
}

function paintFleet(c, w, h, m) {
  sky(c, w, h, '#090a20', '#060716', '#03030c');
  starfield(c, w, h, mulberry32(65), { density: 8000 });
  // Planet limb bottom-right
  glow(c, w * 1.05, h * 1.1, m * 0.7, '90, 140, 255', 0.5, 4);
  const limb = c.createRadialGradient(w * 1.05, h * 1.15, m * 0.2, w * 1.05, h * 1.15, m * 0.62);
  limb.addColorStop(0, '#3f6fc4');
  limb.addColorStop(1, 'rgba(20, 40, 90, 0)');
  c.fillStyle = limb;
  c.beginPath();
  c.arc(w * 1.05, h * 1.15, m * 0.62, 0, Math.PI * 2);
  c.fill();
  // Ships banking across with engine trails
  const ships = [[0.28, 0.30, 1.0], [0.48, 0.42, 0.8], [0.38, 0.56, 0.65], [0.62, 0.24, 0.55]];
  for (const [sx, sy, s] of ships) {
    const x = w * sx;
    const y = h * sy;
    const len = m * 0.045 * s;
    const trail = c.createLinearGradient(x - len * 6, y + len * 2.4, x, y);
    trail.addColorStop(0, 'rgba(80, 200, 255, 0)');
    trail.addColorStop(1, 'rgba(140, 230, 255, 0.65)');
    c.strokeStyle = trail;
    c.lineWidth = 2.2 * s;
    c.beginPath();
    c.moveTo(x - len * 6, y + len * 2.4);
    c.lineTo(x, y);
    c.stroke();
    c.fillStyle = '#c8d8ee';
    c.save();
    c.translate(x, y);
    c.rotate(-0.38);
    c.beginPath();
    c.moveTo(len, 0);
    c.lineTo(-len * 0.8, len * 0.5);
    c.lineTo(-len * 0.5, 0);
    c.lineTo(-len * 0.8, -len * 0.5);
    c.closePath();
    c.fill();
    c.restore();
  }
}

function paintBridge(c, w, h, m) {
  sky(c, w, h, '#12161f', '#0d1017', '#07080c');
  // Viewport band across the top with stars
  c.save();
  c.beginPath();
  c.roundRect(w * 0.06, h * 0.05, w * 0.88, h * 0.2, 14);
  c.clip();
  sky(c, w, h * 0.3, '#03031a', '#02020f', '#020208');
  starfield(c, w, h * 0.28, mulberry32(66), { density: 4200 });
  glow(c, w * 0.75, h * 0.16, m * 0.08, '120, 180, 255', 0.9, 2);
  c.restore();
  c.strokeStyle = 'rgba(150, 180, 220, 0.4)';
  c.lineWidth = 3;
  c.beginPath();
  c.roundRect(w * 0.06, h * 0.05, w * 0.88, h * 0.2, 14);
  c.stroke();
  // Metal deck tones
  glow(c, w * 0.5, h * 0.65, m * 0.5, '70, 90, 120', 0.2, 3);
  // Console glow along the bottom
  glow(c, w * 0.5, h * 0.97, m * 0.45, '80, 220, 255', 0.3, 3);
  const rand = mulberry32(67);
  for (let i = 0; i < 14; i += 1) {
    c.fillStyle = `rgba(${rand() < 0.7 ? '90, 220, 255' : '255, 190, 80'}, ${0.5 + rand() * 0.4})`;
    c.fillRect(w * (0.1 + rand() * 0.8), h * (0.9 + rand() * 0.07), 4 + rand() * 8, 2.5);
  }
}

function paintPlanetSurface(c, w, h, m) {
  // Alien sky with two moons over a rust plateau
  sky(c, w, h * 0.55, '#2a1c3e', '#1c1430', '#140f24');
  starfield(c, w, h * 0.4, mulberry32(68), { density: 9000, aMax: 0.7 });
  moon(c, w * 0.7, h * 0.12, m * 0.035);
  moon(c, w * 0.82, h * 0.2, m * 0.018);
  glow(c, w * 0.2, h * 0.3, m * 0.4, '120, 80, 200', 0.25, 3);
  // Distant ridge
  c.fillStyle = '#241626';
  c.beginPath();
  c.moveTo(0, h * 0.52);
  for (let i = 0; i <= 8; i += 1) {
    c.lineTo((w / 8) * i, h * (0.52 - (i % 2 === 0 ? 0.02 : 0.05) * (1 + (i % 3))));
  }
  c.lineTo(w, h * 0.55);
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();
  c.fill();
  // Rust ground
  const ground = c.createLinearGradient(0, h * 0.55, 0, h);
  ground.addColorStop(0, '#5c3a2c');
  ground.addColorStop(1, '#2e1c14');
  c.fillStyle = ground;
  c.fillRect(0, h * 0.55, w, h * 0.45);
  const rand = mulberry32(69);
  for (let i = 0; i < 12; i += 1) {
    glow(c, w * rand(), h * (0.6 + rand() * 0.38), m * (0.03 + rand() * 0.06), '20, 10, 8', 0.5, 2);
  }
}

export const SPACE_SCENES = [
  { key: 'nebula', name: 'Nebula', paint: paintNebula },
  { key: 'void', name: 'Void', paint: paintVoid },
  { key: 'aurora', name: 'Aurora', paint: paintAurora },
  { key: 'crimson', name: 'Crimson', paint: paintCrimson },
  { key: 'ringedPlanet', name: 'Ringed Planet', paint: paintRingedPlanet },
  { key: 'galaxy', name: 'Galaxy', paint: paintGalaxy },
  { key: 'holoTable', name: 'Holo Table', paint: paintHoloTable },
  { key: 'station', name: 'Station', paint: paintStation },
  { key: 'asteroids', name: 'Asteroid Field', paint: paintAsteroids },
  { key: 'starChart', name: 'Star Chart', paint: paintStarChart },
  { key: 'fleet', name: 'Fleet Flyby', paint: paintFleet },
  { key: 'bridge', name: 'Bridge', paint: paintBridge },
  { key: 'planetSurface', name: 'Planet Surface', paint: paintPlanetSurface },
];
