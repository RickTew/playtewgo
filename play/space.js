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
  c.strokeStyle = 'rgba(180, 210, 255, 0.25)';
  c.beginPath();
  c.ellipse(0, 0, r * 1.75, r * 0.5, 0, Math.PI + 0.15, Math.PI * 2 - 0.15);
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

export const SPACE_SCENES = [
  { key: 'nebula', name: 'Nebula', paint: paintNebula },
  { key: 'void', name: 'Void', paint: paintVoid },
  { key: 'aurora', name: 'Aurora', paint: paintAurora },
  { key: 'crimson', name: 'Crimson', paint: paintCrimson },
  { key: 'galaxy', name: 'Galaxy', paint: paintGalaxy },
  { key: 'asteroids', name: 'Asteroid Field', paint: paintAsteroids },
];
