// Undead scene backgrounds, echoing the iOS Undead intensities (Graveyard,
// Mausoleum, Swamp, Blood Moon, Haunted Manor, Ritual Table, Parlor, Bone
// Colossus, Raven Moon, Grimoire, Crypt, Grave Plot). Same rules as the
// other painters: layered soft glows, seeded, stable between visits.
// Colors follow BackgroundRenderer.swift; iOS y grows up, flipped here.

import { mulberry32, glow } from './space.js';

// Arch-top tombstone with carved inscription lines (addGravestone)
function gravestone(c, x, groundY, w, h, hf, tilt, fill, stroke) {
  const sw = w * 0.11;
  const sh = h * hf;
  const bodyH = sh * 0.65;
  c.save();
  c.translate(x, groundY);
  c.rotate(-tilt);
  c.fillStyle = fill;
  c.strokeStyle = stroke;
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(-sw * 0.5, 0);
  c.lineTo(-sw * 0.5, -bodyH);
  c.arc(0, -bodyH, sw * 0.5, Math.PI, 0);
  c.lineTo(sw * 0.5, 0);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = stroke;
  for (let i = 0; i < 2; i += 1) {
    c.fillRect(-sw * 0.225, -sh * (0.18 + i * 0.15), sw * 0.45, 1.5);
  }
  c.restore();
}

// Bare dead tree: trunk + forking branches (addDeadTree, simplified)
function deadTree(c, x, groundY, h) {
  c.strokeStyle = '#1F1721';
  c.lineCap = 'round';
  const top = groundY - h * 0.17;
  c.lineWidth = 7;
  c.beginPath();
  c.moveTo(x, groundY);
  c.lineTo(x + h * 0.008, top);
  c.stroke();
  c.lineWidth = 4;
  for (const [dx0, dy0, dx1, dy1] of [
    [0, 0.06, -0.045, 0.115], [0.004, 0.09, 0.04, 0.145],
    [-0.045, 0.115, -0.07, 0.125], [0.04, 0.145, 0.055, 0.17],
  ]) {
    c.beginPath();
    c.moveTo(x + dx0 * h, groundY - dy0 * h);
    c.lineTo(x + dx1 * h, groundY - dy1 * h);
    c.stroke();
  }
}

// Small bat silhouette: two scalloped wings around a stubby body (addBat)
function bat(c, x, y, s, rot) {
  const w = 11 * s;
  c.save();
  c.translate(x, y);
  c.rotate(-rot);
  c.fillStyle = 'rgba(10, 3, 5, 0.95)';
  c.beginPath();
  c.moveTo(-w, -2 * s);
  c.quadraticCurveTo(-w * 0.65, 3 * s, -w * 0.35, 0);
  c.quadraticCurveTo(-w * 0.18, 2 * s, 0, 0);
  c.quadraticCurveTo(w * 0.18, 2 * s, w * 0.35, 0);
  c.quadraticCurveTo(w * 0.65, 3 * s, w, -2 * s);
  c.quadraticCurveTo(0, -4 * s, 0, -1.5 * s);
  c.closePath();
  c.fill();
  c.restore();
}

// The stormy graveyard shared by Graveyard / Mausoleum / Swamp (makeUndead)
function undeadNight(c, w, h, m, seed, pal) {
  const rand = mulberry32(seed);
  c.fillStyle = pal.sky;
  c.fillRect(0, 0, w, h);
  // Storm cloud bands
  for (let i = 0; i < 5; i += 1) {
    const cloudW = w * (0.5 + rand() * 0.5);
    const cloudH = h * (0.06 + rand() * 0.06);
    c.fillStyle = `rgba(${pal.cloudRgb}, ${0.35 + rand() * 0.25})`;
    c.beginPath();
    c.roundRect(w * (0.3 + rand() * 0.4) - cloudW / 2, h * (0.08 + rand() * 0.37) - cloudH / 2, cloudW, cloudH, cloudH / 2);
    c.fill();
  }
  // Eerie stars, few and dim
  for (let i = 0; i < 25; i += 1) {
    c.fillStyle = `rgba(${pal.starRgb}, ${0.15 + rand() * 0.3})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.5, 0.5 + rand(), 0, Math.PI * 2);
    c.fill();
  }
  // Moon, mid-left, with drifting wisps
  const mx = w * 0.22;
  const my = h * 0.35;
  glow(c, mx, my, w * 0.10, pal.moonGlowRgb, 0.10, 3);
  c.fillStyle = pal.moon;
  c.beginPath();
  c.arc(mx, my, w * 0.072, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = `rgba(${pal.cloudRgb}, 0.30)`;
  for (const [wx, wy, ww] of [[mx, my - w * 0.095, w * 0.32], [mx - w * 0.04, my + w * 0.090, w * 0.24]]) {
    c.beginPath();
    c.roundRect(wx - ww / 2, wy - h * 0.009, ww, h * 0.018, h * 0.009);
    c.fill();
  }
  // Ground with edge line
  const groundY = h * 0.76;
  c.fillStyle = pal.ground;
  c.fillRect(0, groundY, w, h - groundY);
  c.fillStyle = pal.groundEdge;
  c.fillRect(0, groundY - 1.5, w, 3);
  // Gravestones
  const xs = [0.10, 0.25, 0.42, 0.58, 0.72, 0.88];
  const hs = [0.09, 0.07, 0.11, 0.06, 0.10, 0.08];
  const tilts = [-0.07, 0.04, -0.02, 0.09, -0.05, 0.03];
  for (let i = 0; i < xs.length; i += 1) {
    gravestone(c, w * xs[i], groundY, w, h, hs[i], tilts[i], pal.stone, pal.stoneStroke);
  }
  deadTree(c, w * 0.80, groundY, h);
  // Ground fog
  for (let i = 0; i < 8; i += 1) {
    c.fillStyle = `rgba(${pal.fogRgb}, ${0.04 + rand() * 0.05})`;
    c.beginPath();
    c.ellipse(w * rand(), groundY - (i % 3) * 8, w * (0.125 + rand() * 0.15), h * 0.02, 0, 0, Math.PI * 2);
    c.fill();
  }
  if (pal.tint) {
    c.fillStyle = pal.tint;
    c.fillRect(0, 0, w, h);
  }
}

function paintGraveyard(c, w, h, m) {
  undeadNight(c, w, h, m, 115, {
    sky: '#0D0814', cloudRgb: '26, 18, 36', starRgb: '179, 153, 230',
    moon: '#D1E0A6', moonGlowRgb: '179, 204, 128',
    ground: '#291C30', groundEdge: '#422E4D',
    stone: '#382E40', stoneStroke: '#241C29',
    fogRgb: '179, 191, 153', tint: null,
  });
}

function paintMausoleum(c, w, h, m) {
  undeadNight(c, w, h, m, 116, {
    sky: '#0A0F1A', cloudRgb: '20, 26, 41', starRgb: '166, 191, 242',
    moon: '#D9EBFF', moonGlowRgb: '140, 179, 255',
    ground: '#242933', groundEdge: '#384252',
    stone: '#4D5766', stoneStroke: '#2E333D',
    fogRgb: '191, 217, 242', tint: 'rgba(77, 128, 217, 0.10)',
  });
}

function paintSwamp(c, w, h, m) {
  undeadNight(c, w, h, m, 117, {
    sky: '#0A120D', cloudRgb: '20, 36, 26', starRgb: '140, 217, 140',
    moon: '#BFF28C', moonGlowRgb: '102, 242, 102',
    ground: '#1A2414', groundEdge: '#334D29',
    stone: '#2E3829', stoneStroke: '#1A241A',
    fogRgb: '102, 217, 115', tint: 'rgba(64, 217, 77, 0.14)',
  });
}

function paintBloodMoon(c, w, h, m) {
  const rand = mulberry32(118);
  c.fillStyle = '#120308';
  c.fillRect(0, 0, w, h);
  c.fillStyle = '#1F050A';
  c.fillRect(0, 0, w, h * 0.30);
  // Dim red-tinted stars
  for (let i = 0; i < 22; i += 1) {
    c.fillStyle = `rgba(255, 140, 115, ${0.12 + rand() * 0.28})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.55, 0.5 + rand() * 0.9, 0, Math.PI * 2);
    c.fill();
  }
  // Enormous blood moon with lunar maria
  const mx = w * 0.34;
  const my = h * 0.30;
  const mr = w * 0.165;
  glow(c, mx, my, mr * 1.5, '242, 38, 20', 0.13, 3);
  c.fillStyle = '#CC2E1F';
  c.strokeStyle = 'rgba(255, 115, 77, 0.5)';
  c.lineWidth = 2;
  c.beginPath();
  c.arc(mx, my, mr, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.save();
  c.beginPath();
  c.arc(mx, my, mr, 0, Math.PI * 2);
  c.clip();
  c.fillStyle = 'rgba(148, 26, 20, 0.75)';
  for (const [dx, dy, rf] of [[-0.30, -0.22, 0.26], [0.25, -0.32, 0.18], [0.10, 0.28, 0.22], [-0.35, 0.25, 0.14]]) {
    c.beginPath();
    c.arc(mx + mr * dx, my + mr * dy, mr * rf, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  // Bats crossing the sky
  for (const [xf, yf, s, rot] of [[0.58, 0.18, 1.1, 0.15], [0.68, 0.26, 0.8, -0.2], [0.50, 0.40, 0.6, 0.1], [0.80, 0.14, 0.9, 0.25], [0.18, 0.48, 0.7, -0.1]]) {
    bat(c, w * xf, h * yf, s, rot);
  }
  // Black ridge with dead trees + leaning stones
  const groundY = h * 0.80;
  c.fillStyle = '#0F050A';
  c.fillRect(0, groundY, w, h - groundY);
  c.beginPath();
  c.ellipse(w * 0.5, groundY, w * 0.7, h * 0.05, 0, 0, Math.PI * 2);
  c.fill();
  deadTree(c, w * 0.16, groundY, h);
  deadTree(c, w * 0.86, groundY, h);
  for (const [xf, hf, tilt] of [[0.38, 0.075, -0.06], [0.55, 0.060, 0.08], [0.68, 0.085, -0.03]]) {
    gravestone(c, w * xf, groundY, w, h, hf, tilt, '#210D12', '#38141A');
  }
  // Low crimson mist
  for (let i = 0; i < 6; i += 1) {
    c.fillStyle = `rgba(217, 51, 38, ${0.04 + rand() * 0.04})`;
    c.beginPath();
    c.ellipse(w * rand(), groundY - (i % 3) * 9, w * (0.15 + rand() * 0.15), h * 0.018, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintManor(c, w, h, m) {
  const rand = mulberry32(119);
  c.fillStyle = '#0D0F12';
  c.fillRect(0, 0, w, h);
  // Sickly cloud bands
  for (let i = 0; i < 4; i += 1) {
    const cloudW = w * (0.5 + rand() * 0.45);
    c.fillStyle = `rgba(23, 31, 26, ${0.4 + rand() * 0.3})`;
    c.beginPath();
    c.roundRect(w * (0.3 + rand() * 0.4) - cloudW / 2, h * (0.08 + rand() * 0.32), cloudW, h * 0.07, h * 0.035);
    c.fill();
  }
  // Pale moon glimpsed through cloud
  const mx = w * 0.79;
  const my = h * 0.20;
  c.fillStyle = 'rgba(204, 219, 199, 0.85)';
  c.beginPath();
  c.arc(mx, my, w * 0.055, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(23, 31, 26, 0.75)';
  c.beginPath();
  c.roundRect(mx - w * 0.18, my - w * 0.01 - h * 0.011, w * 0.30, h * 0.022, h * 0.011);
  c.fill();
  // Ground
  const groundY = h * 0.80;
  c.fillStyle = '#0F120F';
  c.fillRect(0, groundY, w, h - groundY);
  // The manor: main block, gable, tower with conical roof, chimney
  const manor = '#090914';
  const mcx = w * 0.40;
  const blockW = w * 0.36;
  const blockH = h * 0.17;
  c.fillStyle = manor;
  c.fillRect(mcx - blockW * 0.5, groundY - blockH, blockW, blockH);
  c.beginPath();
  c.moveTo(mcx - blockW * 0.5, groundY - blockH);
  c.lineTo(mcx - blockW * 0.10, groundY - blockH - h * 0.075);
  c.lineTo(mcx + blockW * 0.30, groundY - blockH);
  c.closePath();
  c.fill();
  const towerX = mcx + blockW * 0.42;
  const towerW = w * 0.085;
  const towerH = h * 0.24;
  c.fillRect(towerX - towerW * 0.5, groundY - towerH, towerW, towerH);
  c.beginPath();
  c.moveTo(towerX - towerW * 0.72, groundY - towerH);
  c.lineTo(towerX, groundY - towerH - h * 0.07);
  c.lineTo(towerX + towerW * 0.72, groundY - towerH);
  c.closePath();
  c.fill();
  c.fillRect(mcx - blockW * 0.38, groundY - blockH - h * 0.065, w * 0.030, h * 0.045);
  // Lit amber windows
  c.fillStyle = 'rgba(255, 189, 71, 0.95)';
  const winW = w * 0.022;
  const winH = w * 0.032;
  for (const [wx, wyf] of [[mcx - blockW * 0.30, 0.62], [mcx - blockW * 0.05, 0.62], [mcx + blockW * 0.22, 0.62], [mcx - blockW * 0.18, 0.25], [mcx + blockW * 0.10, 0.25]]) {
    c.fillRect(wx - winW / 2, groundY - blockH * wyf - winH / 2, winW, winH);
  }
  c.fillRect(towerX - w * 0.010, groundY - towerH * 0.75 - w * 0.015, w * 0.020, w * 0.030);
  glow(c, towerX, groundY - towerH * 0.75, w * 0.05, '255, 189, 71', 0.12, 2);
  // Iron fence along the foreground
  c.fillStyle = '#08080A';
  const fenceTop = groundY + (h - groundY) * 0.38;
  c.fillRect(0, fenceTop, w, 2.5);
  c.fillRect(0, fenceTop + (h - fenceTop) * 0.35, w, 2.5);
  for (let px = w * 0.04; px < w; px += w * 0.06) {
    c.fillRect(px - 1.25, fenceTop - 6, 2.5, (h - fenceTop) * 0.6 + 6);
    c.beginPath();
    c.moveTo(px - 3, fenceTop - 5);
    c.lineTo(px, fenceTop - 12);
    c.lineTo(px + 3, fenceTop - 5);
    c.closePath();
    c.fill();
  }
}

function paintRitualTable(c, w, h, m) {
  const rand = mulberry32(120);
  c.fillStyle = '#17121C';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i += 1) {
    c.fillStyle = `rgba(13, 10, 18, ${0.3 + rand() * 0.3})`;
    c.beginPath();
    c.ellipse(w * rand(), h * rand(), 30 + rand() * 40, 15 + rand() * 20, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Chalk summoning circle around the center
  const ccx = w * 0.5;
  const ccy = h * 0.5;
  const radius = Math.min(w, h) * 0.42;
  c.strokeStyle = 'rgba(224, 219, 235, 0.6)';
  c.lineWidth = 3;
  c.beginPath();
  c.arc(ccx, ccy, radius, 0, Math.PI * 2);
  c.stroke();
  c.strokeStyle = 'rgba(224, 219, 235, 0.25)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(ccx, ccy, radius + 4, 0, Math.PI * 2);
  c.stroke();
  // Chalk rune ticks where the circle crosses top/bottom
  c.fillStyle = 'rgba(224, 219, 235, 0.6)';
  for (const angleDeg of [62, 90, 118, 242, 270, 298]) {
    const a = (angleDeg * Math.PI) / 180;
    const px = ccx + Math.cos(a) * (radius + 14);
    const py = ccy - Math.sin(a) * (radius + 14);
    for (const runeRot of [0.5, -0.6]) {
      c.save();
      c.translate(px, py);
      c.rotate(-(a + runeRot));
      c.fillRect(-5, -0.9, 10, 1.8);
      c.restore();
    }
  }
  // Candles at the circle's diagonals
  for (const [dx, dy] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) {
    const cx = ccx + radius * dx;
    const cy = ccy + radius * dy;
    glow(c, cx, cy - 10, 26, '255, 158, 46', 0.13, 2);
    c.fillStyle = '#E6DBC2';
    c.beginPath();
    c.roundRect(cx - 3.5, cy - 8, 7, 16, 2);
    c.fill();
    c.fillStyle = 'rgba(255, 191, 64, 0.95)';
    c.beginPath();
    c.ellipse(cx, cy - 12, 2.5, 4.5, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Scattered bones near the bottom
  c.fillStyle = 'rgba(194, 189, 168, 0.55)';
  for (const [xf, rot] of [[0.24, 0.5], [0.70, -0.9]]) {
    c.save();
    c.translate(w * xf, h * 0.93);
    c.rotate(rot);
    c.beginPath();
    c.roundRect(-11, -2.25, 22, 4.5, 2.2);
    c.fill();
    c.restore();
  }
}

function paintParlor(c, w, h, m) {
  const rand = mulberry32(121);
  c.fillStyle = '#0E0E12';
  c.fillRect(0, 0, w, h);
  // Faded wallpaper stripes
  c.fillStyle = 'rgba(115, 115, 140, 0.045)';
  for (let sx = w * 0.05; sx < w; sx += 38) c.fillRect(sx - 6.5, 0, 13, h);
  // Ancestor portraits with glowing eyes
  for (const cxf of [0.20, 0.80]) {
    const pw = w * 0.19;
    const ph = h * 0.20;
    const x0 = w * cxf - pw / 2;
    const y0 = h * 0.16;
    c.fillStyle = '#0A0A0D';
    c.strokeStyle = '#6B5729';
    c.lineWidth = 5;
    c.fillRect(x0, y0, pw, ph);
    c.strokeRect(x0, y0, pw, ph);
    c.fillStyle = 'rgba(158, 153, 133, 0.22)';
    c.beginPath();
    c.ellipse(x0 + pw / 2, y0 + ph * 0.40, pw * 0.21, ph * 0.225, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255, 64, 38, 0.9)';
    for (const eyeDX of [-pw * 0.07, pw * 0.07]) {
      c.beginPath();
      c.arc(x0 + pw / 2 + eyeDX, y0 + ph * 0.34, 2, 0, Math.PI * 2);
      c.fill();
    }
  }
  // Cobwebs in the upper corners
  c.strokeStyle = 'rgba(200, 200, 210, 0.20)';
  c.lineWidth = 1;
  for (const [cwx, cwy, r] of [[0.03, 0.03, 0.10], [0.97, 0.06, 0.08]]) {
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
  // Floorboards
  const floorH = h * 0.15;
  c.fillStyle = '#0D0B0D';
  c.fillRect(0, h - floorH, w, floorH);
  c.fillStyle = '#050508';
  for (let i = 1; i < 3; i += 1) c.fillRect(0, h - (floorH * i) / 3, w, 1.5);
  // Candelabra, center floor
  const candX = w * 0.5;
  const candBaseY = h - floorH * 0.35;
  glow(c, candX, candBaseY - 40, w * 0.11, '255, 158, 51', 0.10, 3);
  c.fillStyle = '#212129';
  c.fillRect(candX - 2, candBaseY - 38, 4, 38);
  c.beginPath();
  c.ellipse(candX, candBaseY, 13, 3, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = '#212129';
  c.lineWidth = 3;
  for (const armDX of [-16, 0, 16]) {
    if (armDX !== 0) {
      c.beginPath();
      c.moveTo(candX, candBaseY - 26);
      c.quadraticCurveTo(candX + armDX, candBaseY - 26, candX + armDX, candBaseY - 36);
      c.stroke();
    }
    const candleY = candBaseY - (armDX === 0 ? 42 : 38);
    c.fillStyle = '#D9D1B8';
    c.fillRect(candX + armDX - 2.25, candleY - 10, 4.5, 10);
    c.fillStyle = 'rgba(255, 191, 71, 0.95)';
    c.beginPath();
    c.ellipse(candX + armDX, candleY - 13, 2, 3.5, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Creeping floor fog
  for (let i = 0; i < 5; i += 1) {
    c.fillStyle = `rgba(140, 179, 140, ${0.04 + rand() * 0.03})`;
    c.beginPath();
    c.ellipse(w * rand(), h - floorH * 0.5 - (i % 2) * 12, w * (0.125 + rand() * 0.1), h * 0.015, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintColossus(c, w, h, m) {
  const rand = mulberry32(122);
  c.fillStyle = '#080A0D';
  c.fillRect(0, 0, w, h);
  // Sickly green sky glow, layered
  glow(c, w * 0.60, h * 0.45, m * 0.55, '51, 115, 64', 0.05, 3);
  for (let i = 0; i < 18; i += 1) {
    c.fillStyle = `rgba(179, 230, 179, ${0.1 + rand() * 0.2})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.5, 0.5 + rand() * 0.7, 0, Math.PI * 2);
    c.fill();
  }
  // The colossus rising behind the ridge
  const bone = 'rgba(199, 204, 184, 0.85)';
  const boneShade = '#8C917F';
  const sx = w * 0.60;
  const sy = h * 0.42;
  const skullR = w * 0.13;
  // Spine dropping from the jaw
  c.strokeStyle = bone;
  c.lineCap = 'round';
  c.lineWidth = skullR * 0.22;
  c.beginPath();
  c.moveTo(sx, sy + skullR * 1.25);
  c.lineTo(sx, sy + skullR * 4.0);
  c.stroke();
  c.fillStyle = boneShade;
  for (let i = 1; i <= 4; i += 1) {
    c.beginPath();
    c.arc(sx, sy + skullR * (1.25 + (2.75 * i) / 5), skullR * 0.14, 0, Math.PI * 2);
    c.fill();
  }
  // Three rib pairs curving out and down
  c.lineWidth = skullR * 0.15;
  for (let i = 0; i < 3; i += 1) {
    const levelY = sy + skullR * (1.8 + i * 0.75);
    const reach = skullR * (1.7 - i * 0.25);
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(sx + side * skullR * 0.10, levelY);
      c.quadraticCurveTo(sx + side * reach * 0.95, levelY - skullR * 0.15, sx + side * reach, levelY + skullR * 0.85);
      c.stroke();
    }
  }
  // Skull: cranium + jaw
  c.fillStyle = '#C7CCB8';
  c.strokeStyle = boneShade;
  c.lineWidth = 2;
  c.beginPath();
  c.arc(sx, sy, skullR, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.beginPath();
  c.roundRect(sx - skullR * 0.55, sy + skullR * 0.55, skullR * 1.1, skullR * 0.6, skullR * 0.12);
  c.fill();
  c.stroke();
  // Eye sockets with glowing green pinpoints
  for (const dx of [-0.40, 0.40]) {
    c.fillStyle = '#050805';
    c.beginPath();
    c.ellipse(sx + skullR * dx, sy - skullR * 0.05, skullR * 0.25, skullR * 0.21, 0, 0, Math.PI * 2);
    c.fill();
    glow(c, sx + skullR * dx, sy - skullR * 0.05, skullR * 0.18, '102, 255, 115', 0.25, 2);
    c.fillStyle = 'rgba(102, 255, 115, 0.9)';
    c.beginPath();
    c.arc(sx + skullR * dx, sy - skullR * 0.05, skullR * 0.10, 0, Math.PI * 2);
    c.fill();
  }
  // Nasal cavity + teeth
  c.fillStyle = '#050805';
  c.beginPath();
  c.moveTo(sx, sy + skullR * 0.15);
  c.lineTo(sx - skullR * 0.12, sy + skullR * 0.45);
  c.lineTo(sx + skullR * 0.12, sy + skullR * 0.45);
  c.closePath();
  c.fill();
  for (let i = 0; i < 5; i += 1) {
    c.fillRect(sx - skullR * 0.42 + i * skullR * 0.20, sy + skullR * 0.60, skullR * 0.10, skullR * 0.22);
  }
  // Dark ridge silhouette in front + fog
  c.fillStyle = '#0A0D0A';
  c.beginPath();
  c.moveTo(0, h);
  c.lineTo(0, h * 0.86);
  c.quadraticCurveTo(w * 0.3, h * 0.80, w * 0.55, h * 0.86);
  c.quadraticCurveTo(w * 0.8, h * 0.91, w, h * 0.84);
  c.lineTo(w, h);
  c.closePath();
  c.fill();
  for (let i = 0; i < 5; i += 1) {
    c.fillStyle = `rgba(140, 191, 140, ${0.04 + rand() * 0.03})`;
    c.beginPath();
    c.ellipse(w * rand(), h * (0.84 + rand() * 0.08), w * 0.2, h * 0.02, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintRavenMoon(c, w, h, m) {
  const rand = mulberry32(123);
  c.fillStyle = '#0F0A1A';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 35; i += 1) {
    c.fillStyle = `rgba(217, 217, 217, ${0.15 + rand() * 0.35})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.7, 0.4 + rand() * 0.8, 0, Math.PI * 2);
    c.fill();
  }
  // Full moon with craters
  const mx = w * 0.34;
  const my = h * 0.24;
  const mr = w * 0.17;
  glow(c, mx, my, mr, '217, 214, 191', 0.11, 4);
  c.fillStyle = '#E0DBC7';
  c.beginPath();
  c.arc(mx, my, mr, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(191, 186, 163, 0.9)';
  for (const [dx, dy, rf] of [[-0.3, -0.3, 0.16], [0.3, 0.15, 0.11], [0.05, 0.45, 0.09]]) {
    c.beginPath();
    c.arc(mx + mr * dx, my + mr * dy, mr * rf, 0, Math.PI * 2);
    c.fill();
  }
  // Gnarled branch entering from the right
  c.strokeStyle = '#211712';
  c.lineWidth = 7;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(w * 1.02, h * 0.34);
  c.quadraticCurveTo(w * 0.72, h * 0.355, w * 0.40, h * 0.285);
  c.stroke();
  // The raven, perched against the moon
  const feather = '#0D0A14';
  const rx = w * 0.56;
  const ry = h * 0.245;
  const bodyR = w * 0.058;
  c.save();
  c.translate(rx, ry);
  c.rotate(-0.18);
  c.fillStyle = feather;
  c.strokeStyle = 'rgba(64, 56, 89, 0.7)';
  c.lineWidth = 1;
  c.beginPath();
  c.ellipse(0, 0, bodyR, bodyR * 1.45, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.restore();
  // Tail down-right toward the branch
  c.fillStyle = feather;
  c.beginPath();
  c.moveTo(rx + bodyR * 0.4, ry + bodyR * 1.0);
  c.lineTo(rx + bodyR * 2.4, ry + bodyR * 2.6);
  c.lineTo(rx + bodyR * 1.2, ry + bodyR * 2.7);
  c.closePath();
  c.fill();
  // Head + beak facing the moon
  const hx = rx - bodyR * 0.7;
  const hy = ry - bodyR * 1.9;
  c.beginPath();
  c.arc(hx, hy, bodyR * 0.78, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.moveTo(hx - bodyR * 0.5, hy - bodyR * 0.25);
  c.lineTo(hx - bodyR * 1.7, hy + bodyR * 0.05);
  c.lineTo(hx - bodyR * 0.45, hy + bodyR * 0.32);
  c.closePath();
  c.fill();
  c.fillStyle = 'rgba(230, 217, 153, 0.95)';
  c.beginPath();
  c.arc(hx - bodyR * 0.25, hy - bodyR * 0.12, bodyR * 0.12, 0, Math.PI * 2);
  c.fill();
  // Ground fog + tombstone tips near the bottom
  for (let i = 0; i < 3; i += 1) {
    c.fillStyle = 'rgba(115, 107, 140, 0.06)';
    c.beginPath();
    c.ellipse(w * 0.5, h * (0.94 - 0.02 * i), w * (0.25 + 0.125 * i), h * 0.025, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#241F2E';
  for (const [xf, th] of [[0.22, 0.05], [0.74, 0.065]]) {
    c.beginPath();
    c.roundRect(w * xf - w * 0.0425, h * 0.945 - (h * th) / 2, w * 0.085, h * th, 6);
    c.fill();
  }
}

function paintGrimoire(c, w, h, m) {
  const rand = mulberry32(124);
  c.fillStyle = '#140F1A';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i += 1) {
    c.fillStyle = `rgba(13, 10, 18, ${0.3 + rand() * 0.25})`;
    c.beginPath();
    c.ellipse(w * rand(), h * rand(), 35 + rand() * 40, 17 + rand() * 20, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Open grimoire near the top, glowing green
  const bx = w * 0.5;
  const by = h * 0.17;
  const pageW = w * 0.21;
  const pageH = h * 0.085;
  const rune = '89, 242, 140';
  glow(c, bx, by - pageH * 0.3, pageW * 0.9, rune, 0.06, 4);
  c.fillStyle = '#331A29';
  c.strokeStyle = '#734D66';
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(bx - pageW * 1.075, by - pageH * 0.625, pageW * 2.15, pageH * 1.25, 4);
  c.fill();
  c.stroke();
  for (const side of [-1, 1]) {
    c.fillStyle = '#CCC2A8';
    c.strokeStyle = '#80735C';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(bx, by + pageH * 0.45);
    c.lineTo(bx + side * pageW, by + pageH * 0.30);
    c.lineTo(bx + side * pageW, by - pageH * 0.55);
    c.quadraticCurveTo(bx + side * pageW * 0.45, by - pageH * 0.72, bx, by - pageH * 0.42);
    c.closePath();
    c.fill();
    c.stroke();
    c.strokeStyle = `rgba(${rune}, 0.75)`;
    c.lineWidth = 1.5;
    for (let row = 0; row < 3; row += 1) {
      const y = by - pageH * (0.28 - row * 0.22);
      c.beginPath();
      c.moveTo(bx + side * pageW * 0.18, y);
      c.lineTo(bx + side * pageW * 0.82, y - side * 2);
      c.stroke();
    }
  }
  // Floating motes above the book
  c.fillStyle = `rgba(${rune}, 0.8)`;
  for (const [dxf, dyf, r] of [[-0.10, 0.16, 2.2], [0.06, 0.20, 1.6], [0.16, 0.13, 2.0], [-0.20, 0.11, 1.4]]) {
    c.beginPath();
    c.arc(bx + w * dxf, by - h * dyf, r, 0, Math.PI * 2);
    c.fill();
  }
  // Candle + skull near the bottom
  const cpx = w * 0.30;
  const cpy = h * 0.935;
  c.fillStyle = '#D1C7A8';
  c.fillRect(cpx - 6, cpy - 30, 12, 30);
  glow(c, cpx, cpy - 38, 7, '255, 166, 51', 0.07, 4);
  c.fillStyle = 'rgba(255, 189, 71, 0.95)';
  c.beginPath();
  c.ellipse(cpx, cpy - 36, 3.5, 6, 0, 0, Math.PI * 2);
  c.fill();
  const skx = w * 0.70;
  const sky2 = h * 0.915;
  c.fillStyle = '#C2BAA8';
  c.beginPath();
  c.arc(skx, sky2 - 5, 15, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#ADA694';
  c.fillRect(skx - 9, sky2 + 1, 18, 9);
  c.fillStyle = '#0F0D14';
  for (const ex of [skx - 6, skx + 6]) {
    c.beginPath();
    c.arc(ex, sky2 - 6, 4, 0, Math.PI * 2);
    c.fill();
  }
}

function paintCryptBoard(c, w, h, m) {
  // Candlelit crypt: arched coffin alcoves above, bones below
  c.fillStyle = '#17171F';
  c.fillRect(0, 0, w, h);
  for (const xf of [0.25, 0.75]) {
    const ax = w * xf;
    const alcoveW = w * 0.24;
    const alcoveH = h * 0.24;
    const y0 = h * 0.03;
    c.fillStyle = '#0D0D14';
    c.strokeStyle = '#40404D';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(ax - alcoveW / 2, y0 + alcoveH);
    c.lineTo(ax - alcoveW / 2, y0 + alcoveH * 0.4);
    c.quadraticCurveTo(ax, y0 - alcoveH * 0.15, ax + alcoveW / 2, y0 + alcoveH * 0.4);
    c.lineTo(ax + alcoveW / 2, y0 + alcoveH);
    c.closePath();
    c.fill();
    c.stroke();
    // Upright coffin
    const cw = alcoveW * 0.42;
    const ch = alcoveH * 0.62;
    const baseY = y0 + alcoveH * 0.94;
    c.fillStyle = '#38291F';
    c.strokeStyle = 'rgba(102, 77, 51, 0.8)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(ax, baseY);
    c.lineTo(ax + cw * 0.5, baseY - ch * 0.3);
    c.lineTo(ax + cw * 0.3, baseY - ch);
    c.lineTo(ax - cw * 0.3, baseY - ch);
    c.lineTo(ax - cw * 0.5, baseY - ch * 0.3);
    c.closePath();
    c.fill();
    c.stroke();
  }
  // Candle cluster between the alcoves
  glow(c, w * 0.5, h * 0.12, 36, '255, 158, 46', 0.12, 2);
  for (const [dx, ch] of [[-14, 14], [0, 22], [14, 10]]) {
    const cx = w * 0.5 + dx;
    c.fillStyle = '#E0D6B8';
    c.beginPath();
    c.roundRect(cx - 3, h * 0.14 - ch, 6, ch, 2);
    c.fill();
    c.fillStyle = 'rgba(255, 191, 64, 0.95)';
    c.beginPath();
    c.ellipse(cx, h * 0.14 - ch - 4, 2, 3.5, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Bones + skull near the bottom
  c.fillStyle = 'rgba(194, 189, 168, 0.8)';
  for (const [xf, rot] of [[0.30, 0.6], [0.36, -0.7]]) {
    c.save();
    c.translate(w * xf, h * 0.93);
    c.rotate(rot);
    c.beginPath();
    c.roundRect(-15, -2.5, 30, 5, 2.5);
    c.fill();
    c.restore();
  }
  c.beginPath();
  c.arc(w * 0.70, h * 0.93, 9, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#0D0D14';
  for (const dx of [-3.5, 3.5]) {
    c.beginPath();
    c.arc(w * 0.70 + dx, h * 0.93 - 1, 2.2, 0, Math.PI * 2);
    c.fill();
  }
}

function paintGravePlot(c, w, h, m) {
  const rand = mulberry32(125);
  // Moonlit graveyard: tombstone row above, grass and mushrooms below
  c.fillStyle = '#1A1226';
  c.fillRect(0, 0, w, h);
  c.fillStyle = '#141A14';
  c.fillRect(0, h * 0.24, w, h * 0.76);
  glow(c, w * 0.22, h * 0.09, h * 0.06, '217, 224, 191', 0.10, 2);
  c.fillStyle = '#D9E0BF';
  c.beginPath();
  c.arc(w * 0.22, h * 0.09, h * 0.033, 0, Math.PI * 2);
  c.fill();
  bat(c, w * 0.55, h * 0.07, 1.0, 0);
  bat(c, w * 0.66, h * 0.11, 0.7, 0);
  // Tombstone row along the ground line
  const groundLine = h * 0.24;
  c.fillStyle = '#47474D';
  for (const [xf, sw, sh, rounded] of [[0.14, 30, 38, true], [0.38, 26, 30, false], [0.62, 32, 42, true], [0.86, 24, 28, false]]) {
    const sx = w * xf;
    if (rounded) {
      c.beginPath();
      c.roundRect(sx - sw / 2, groundLine - sh, sw, sh + 6, [sw * 0.45, sw * 0.45, 0, 0]);
      c.fill();
    } else {
      c.fillRect(sx - sw / 2, groundLine - sh, sw, sh);
      c.fillRect(sx - 2.5, groundLine - sh - 16, 5, 16);
      c.fillRect(sx - 6.5, groundLine - sh - 12, 13, 4);
    }
  }
  c.fillStyle = '#242E21';
  c.fillRect(0, groundLine - 1.5, w, 3);
  // Grass tufts + mushrooms lower down
  c.strokeStyle = '#293D24';
  c.lineWidth = 1.5;
  for (let i = 0; i < 9; i += 1) {
    const tx = 12 + rand() * (w - 24);
    const ty = h * (0.82 + rand() * 0.12);
    for (const blade of [-1, 0, 1]) {
      c.beginPath();
      c.moveTo(tx, ty);
      c.lineTo(tx + blade * 4, ty - 9);
      c.stroke();
    }
  }
  for (const xf of [0.18, 0.80]) {
    const sx = w * xf;
    c.fillStyle = '#B3A894';
    c.fillRect(sx - 2, h * 0.90, 4, 9);
    c.fillStyle = '#8C4D66';
    c.beginPath();
    c.ellipse(sx, h * 0.895, 8, 4.5, 0, 0, Math.PI * 2);
    c.fill();
  }
}

export const UNDEAD_SCENES = [
  { key: 'graveyard', name: 'Graveyard', paint: paintGraveyard },
  { key: 'mausoleum', name: 'Mausoleum', paint: paintMausoleum },
  { key: 'swamp', name: 'Swamp', paint: paintSwamp },
  { key: 'bloodMoon', name: 'Blood Moon', paint: paintBloodMoon },
  { key: 'hauntedManor', name: 'Haunted Manor', paint: paintManor },
  { key: 'ritualTable', name: 'Ritual Table', paint: paintRitualTable },
  { key: 'parlor', name: 'Parlor', paint: paintParlor },
  { key: 'boneColossus', name: 'Bone Colossus', paint: paintColossus },
  { key: 'ravenMoon', name: 'Raven Moon', paint: paintRavenMoon },
  { key: 'grimoire', name: 'Grimoire', paint: paintGrimoire },
  { key: 'cryptBoard', name: 'Crypt', paint: paintCryptBoard },
  { key: 'gravePlot', name: 'Grave Plot', paint: paintGravePlot },
];
