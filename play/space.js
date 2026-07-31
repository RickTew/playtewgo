// Space scene background, echoing the iOS Nebula look from
// BackgroundRenderer.swift: layered soft glows (never hard-edged discs),
// a starfield with varied sizes, and a ringed planet. Drawn once per
// resize on a full-viewport canvas. Seeded so the sky is stable between
// visits instead of re-rolling every load.

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function glow(c, x, y, r, rgb, alpha, layers = 3) {
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

export function paintSpaceScene(canvas) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w === 0 || h === 0) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const c = canvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Deep-space vertical gradient
  const sky = c.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#0b0b2a');
  sky.addColorStop(0.45, '#0a0a1e');
  sky.addColorStop(1, '#060614');
  c.fillStyle = sky;
  c.fillRect(0, 0, w, h);

  const m = Math.min(w, h);

  // Nebula clouds: layered purple, blue and magenta glows
  glow(c, w * 0.80, h * 0.16, m * 0.55, '124, 77, 255', 0.55, 4);
  glow(c, w * 0.70, h * 0.28, m * 0.35, '64, 156, 255', 0.40, 3);
  glow(c, w * 0.12, h * 0.78, m * 0.50, '30, 110, 220', 0.45, 4);
  glow(c, w * 0.22, h * 0.62, m * 0.30, '124, 77, 255', 0.30, 3);
  glow(c, w * 0.55, h * 0.95, m * 0.40, '255, 110, 199', 0.22, 3);
  glow(c, w * 0.05, h * 0.10, m * 0.35, '80, 200, 255', 0.25, 3);

  // Starfield
  const rand = mulberry32(20260731);
  const starCount = Math.round((w * h) / 6500);
  for (let i = 0; i < starCount; i += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.4 + rand() * 1.4;
    const a = 0.3 + rand() * 0.7;
    c.fillStyle = `rgba(255, 255, 255, ${a})`;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    if (rand() < 0.06) {
      // Occasional bright star with a soft glint
      glow(c, x, y, r * 7, '200, 220, 255', 0.8, 2);
    }
  }

  // Ringed planet, upper right
  const px = w * 0.86;
  const py = h * 0.13;
  const pr = m * 0.075;
  glow(c, px, py, pr * 3.2, '90, 160, 255', 0.5, 3);

  const body = c.createRadialGradient(px - pr * 0.4, py - pr * 0.4, pr * 0.1, px, py, pr);
  body.addColorStop(0, '#9fd4ff');
  body.addColorStop(0.5, '#3f7fd4');
  body.addColorStop(1, '#122a52');
  c.fillStyle = body;
  c.beginPath();
  c.arc(px, py, pr, 0, Math.PI * 2);
  c.fill();

  // Ring: ellipse tilted around the planet, split so the far side sits
  // behind the sphere
  c.save();
  c.translate(px, py);
  c.rotate(-0.35);
  c.strokeStyle = 'rgba(180, 210, 255, 0.55)';
  c.lineWidth = pr * 0.16;
  c.beginPath();
  c.ellipse(0, 0, pr * 1.75, pr * 0.5, 0, 0.15, Math.PI - 0.15);
  c.stroke();
  c.strokeStyle = 'rgba(180, 210, 255, 0.25)';
  c.beginPath();
  c.ellipse(0, 0, pr * 1.75, pr * 0.5, 0, Math.PI + 0.15, Math.PI * 2 - 0.15);
  c.stroke();
  c.restore();

  // Distant moon, lower left
  const mx = w * 0.07;
  const my = h * 0.30;
  const mr = m * 0.022;
  glow(c, mx, my, mr * 3, '220, 230, 255', 0.4, 2);
  const moon = c.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
  moon.addColorStop(0, '#f0f4ff');
  moon.addColorStop(1, '#5a6a8a');
  c.fillStyle = moon;
  c.beginPath();
  c.arc(mx, my, mr, 0, Math.PI * 2);
  c.fill();
}
