// Desert scene backgrounds, echoing the iOS Desert intensities (Pyramids,
// Sphinx, Sandstorm, Nile, Tomb, Tomb Floor, Starry Dunes, Pharaoh's
// Relics, Anubis, Caravan, Temple Hall, Oasis). Same rules as the other
// painters: layered soft glows, seeded, stable between visits. Colors
// follow BackgroundRenderer.swift; iOS y grows up, flipped here.

import { mulberry32, glow } from './space.js';

// Pyramid silhouette with a lit edge (addPyramid)
function pyramid(c, cx, baseY, w, h) {
  c.fillStyle = '#593B1A';
  c.strokeStyle = 'rgba(128, 89, 41, 0.6)';
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(cx - w / 2, baseY);
  c.lineTo(cx, baseY - h);
  c.lineTo(cx + w / 2, baseY);
  c.closePath();
  c.fill();
  c.stroke();
  c.strokeStyle = 'rgba(179, 133, 64, 0.35)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(cx - w / 2, baseY);
  c.lineTo(cx, baseY - h);
  c.stroke();
}

// Palm silhouette: leaning trunk + frond fan (addPalmSilhouette)
function palm(c, x, baseY, height, lean, color) {
  const topX = x + lean * height;
  const topY = baseY - height;
  c.strokeStyle = color;
  c.lineCap = 'round';
  c.lineWidth = Math.max(3, height * 0.07);
  c.beginPath();
  c.moveTo(x, baseY);
  c.quadraticCurveTo(x + lean * height * 0.3, baseY - height * 0.6, topX, topY);
  c.stroke();
  c.lineWidth = Math.max(2, height * 0.045);
  for (const a of [-2.6, -2.0, -1.4, -0.6, 0.1, 0.7]) {
    c.beginPath();
    c.moveTo(topX, topY);
    c.quadraticCurveTo(
      topX + Math.cos(a) * height * 0.22, topY + Math.sin(a) * height * 0.22 - height * 0.10,
      topX + Math.cos(a) * height * 0.4, topY + Math.sin(a) * height * 0.4,
    );
    c.stroke();
  }
}

function paintPyramids(c, w, h, m) {
  // Warm sunset over the Giza plain
  c.fillStyle = '#291409';
  c.fillRect(0, 0, w, h);
  for (const [yf, hf, color] of [
    [0.30, 0.70, '#381F0F'], [0.50, 0.50, '#733810'], [0.68, 0.35, '#AD611A'], [0.80, 0.25, '#D18C2E'],
  ]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  // Large sun near the horizon
  const sunY = h * 0.62;
  glow(c, w * 0.72, sunY, w * 0.15, '255, 191, 51', 0.10, 3);
  c.fillStyle = '#FFD159';
  c.strokeStyle = 'rgba(255, 235, 153, 0.4)';
  c.lineWidth = 3;
  c.beginPath();
  c.arc(w * 0.72, sunY, w * 0.10, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // Sand with cresting dunes
  const sandY = h * 0.70;
  c.fillStyle = '#AD7A38';
  c.fillRect(0, sandY, w, h - sandY);
  c.fillStyle = '#B8853D';
  for (const [xf, py, dw] of [[0.20, 0.04, 0.55], [0.62, 0.06, 0.65], [0.90, 0.03, 0.45]]) {
    c.beginPath();
    c.ellipse(w * xf, sandY - h * py + h * 0.07, (w * dw) / 2, h * 0.07, 0, 0, Math.PI * 2);
    c.fill();
  }
  // The pyramids
  pyramid(c, w * 0.22, sandY - h * 0.04, w * 0.28, h * 0.24);
  pyramid(c, w * 0.48, sandY - h * 0.01, w * 0.18, h * 0.16);
  // Heat haze bands
  c.fillStyle = 'rgba(255, 217, 128, 0.04)';
  for (let i = 0; i < 4; i += 1) c.fillRect(0, sandY - i * h * 0.025, w, 2);
}

function paintSphinx(c, w, h, m) {
  // Bright daytime plain with the great sphinx in profile
  c.fillStyle = '#C7D9EB';
  c.fillRect(0, 0, w, h);
  for (const [yf, hf, color] of [
    [0.72, 0.28, '#7AB3E0'], [0.55, 0.20, '#B8D1E6'], [0.40, 0.18, '#EBD99E'], [0.30, 0.12, '#F2CC80'],
  ]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  c.fillStyle = 'rgba(255, 242, 191, 0.95)';
  c.beginPath();
  c.arc(w * 0.78, h * 0.16, w * 0.06, 0, Math.PI * 2);
  c.fill();
  // Tall sand plain
  const sandY = h * 0.58;
  c.fillStyle = '#E0AD61';
  c.fillRect(0, sandY, w, h - sandY);
  c.fillStyle = 'rgba(199, 148, 77, 0.85)';
  for (const [xf, dw] of [[0.25, 0.55], [0.78, 0.50]]) {
    c.beginPath();
    c.ellipse(w * xf, sandY, (w * dw) / 2, h * 0.05, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Distant pyramids
  pyramid(c, w * 0.18, sandY + h * 0.02, w * 0.22, h * 0.14);
  pyramid(c, w * 0.82, sandY + h * 0.02, w * 0.20, h * 0.12);
  // The sphinx, center, facing left: body plinth, haunches, head with nemes
  const sx = w * 0.52;
  const baseY = h * 0.78;
  const su = w * 0.09;
  c.fillStyle = '#B3814D';
  c.strokeStyle = '#8A5F30';
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(sx - su * 2.4, baseY - su * 0.95, su * 4.8, su * 0.95, su * 0.12);
  c.fill();
  c.stroke();
  // Haunch rise at the back
  c.beginPath();
  c.moveTo(sx + su * 1.2, baseY - su * 0.95);
  c.quadraticCurveTo(sx + su * 2.1, baseY - su * 1.8, sx + su * 2.4, baseY - su * 0.9);
  c.closePath();
  c.fill();
  // Forelegs stretching left
  c.fillRect(sx - su * 3.3, baseY - su * 0.38, su * 1.6, su * 0.38);
  // Head with nemes flare
  const hx = sx - su * 1.9;
  const hy = baseY - su * 1.9;
  c.beginPath();
  c.moveTo(hx - su * 0.42, hy + su * 0.95);
  c.lineTo(hx - su * 0.62, hy + su * 0.10);
  c.lineTo(hx - su * 0.30, hy - su * 0.35);
  c.lineTo(hx + su * 0.30, hy - su * 0.35);
  c.lineTo(hx + su * 0.62, hy + su * 0.10);
  c.lineTo(hx + su * 0.42, hy + su * 0.95);
  c.closePath();
  c.fill();
  c.stroke();
  // Face shadow line
  c.strokeStyle = 'rgba(102, 66, 31, 0.6)';
  c.beginPath();
  c.moveTo(hx - su * 0.30, hy - su * 0.05);
  c.lineTo(hx + su * 0.05, hy - su * 0.05);
  c.stroke();
  // Sand ridge waves
  c.strokeStyle = 'rgba(179, 128, 61, 0.5)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 4; i += 1) {
    const ry = h - (h - sandY) * (0.20 + i * 0.14);
    c.beginPath();
    for (let x = 0; x < w; x += 36) {
      c.moveTo(x, ry);
      c.quadraticCurveTo(x + 18, ry + 4, x + 36, ry);
    }
    c.stroke();
  }
}

function paintSandstorm(c, w, h, m) {
  // Orange-brown wall of dust with ghost pyramids
  c.fillStyle = '#8C521A';
  c.fillRect(0, 0, w, h);
  for (const [yf, hf, color] of [
    [0.75, 0.25, '#6B330D'], [0.55, 0.20, '#9E591A'], [0.40, 0.16, '#C77A2E'], [0.28, 0.12, '#E09E47'],
  ]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  // Ghost pyramids through the dust
  const pyBase = h * 0.70;
  c.fillStyle = 'rgba(77, 46, 13, 0.45)';
  c.beginPath();
  c.moveTo(w * 0.36, pyBase);
  c.lineTo(w * 0.50, pyBase - h * 0.20);
  c.lineTo(w * 0.64, pyBase);
  c.closePath();
  c.fill();
  c.fillStyle = 'rgba(82, 51, 15, 0.32)';
  c.beginPath();
  c.moveTo(w * 0.08, pyBase);
  c.lineTo(w * 0.20, pyBase - h * 0.14);
  c.lineTo(w * 0.32, pyBase);
  c.closePath();
  c.fill();
  // Sand ground + harsh dunes
  const sandY = h * 0.70;
  c.fillStyle = '#804719';
  c.fillRect(0, sandY, w, h - sandY);
  c.fillStyle = '#8C521F';
  for (const [xf, py, dw] of [[0.20, 0.03, 0.50], [0.66, 0.05, 0.60], [0.92, 0.02, 0.40]]) {
    c.beginPath();
    c.ellipse(w * xf, sandY - h * py + h * 0.06, (w * dw) / 2, h * 0.06, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Streaking dust
  const rand = mulberry32(147);
  c.strokeStyle = 'rgba(230, 179, 102, 0.25)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 40; i += 1) {
    const dx = w * rand();
    const dy = h * rand();
    c.beginPath();
    c.moveTo(dx, dy);
    c.lineTo(dx + 22 + rand() * 26, dy + 2);
    c.stroke();
  }
}

function paintNile(c, w, h, m) {
  const rand = mulberry32(148);
  const riverY = h * 0.66;
  // Dusk sky bands
  c.fillStyle = '#211229';
  c.fillRect(0, 0, w, h);
  for (const [yf, hf, color] of [
    [0.62, 0.24, '#421C38'], [0.50, 0.14, '#7A2E33'], [0.42, 0.10, '#C75C2E'], [0.34, 0.09, '#F59442'],
  ]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  for (let i = 0; i < 25; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.15 + rand() * 0.4})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.28, 0.4 + rand() * 0.9, 0, Math.PI * 2);
    c.fill();
  }
  // Setting sun + far-bank pyramids
  const sunX = w * 0.64;
  glow(c, sunX, riverY - h * 0.045, w * 0.10, '255, 179, 64', 0.15, 3);
  c.fillStyle = '#FFCC61';
  c.beginPath();
  c.arc(sunX, riverY - h * 0.045, w * 0.055, 0, Math.PI * 2);
  c.fill();
  pyramid(c, w * 0.16, riverY, w * 0.20, h * 0.11);
  pyramid(c, w * 0.33, riverY, w * 0.13, h * 0.075);
  // The river with layered depth
  c.fillStyle = '#122442';
  c.fillRect(0, riverY, w, h - riverY);
  for (const [yf, hf, color] of [[0.22, 0.12, '#0F1F3D'], [0.10, 0.12, '#0A1730'], [0.00, 0.10, '#050F24']]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  // Sun glint path + ripples
  let glintY = riverY + 8;
  let glintW = w * 0.09;
  while (glintY < h * 0.95) {
    c.fillStyle = 'rgba(255, 191, 89, 0.20)';
    c.beginPath();
    c.ellipse(sunX + (rand() - 0.5) * 14, glintY, glintW / 2, 1.75, 0, 0, Math.PI * 2);
    c.fill();
    glintY += 16 + rand() * 10;
    glintW *= 0.90;
  }
  c.fillStyle = 'rgba(140, 179, 242, 0.08)';
  for (let i = 0; i < 10; i += 1) {
    c.fillRect(w * rand(), riverY + 12 + rand() * (h - riverY - 24), 25 + rand() * 50, 1.5);
  }
  // Felucca sailing home
  const bx = w * 0.46;
  const by = h * 0.82;
  c.fillStyle = '#0D080F';
  c.beginPath();
  c.moveTo(bx - w * 0.085, by - 10);
  c.quadraticCurveTo(bx, by + 8, bx + w * 0.085, by - 10);
  c.closePath();
  c.fill();
  c.fillRect(bx - 1, by - 10 - h * 0.085, 2, h * 0.085);
  c.fillStyle = 'rgba(235, 219, 189, 0.92)';
  c.beginPath();
  c.moveTo(bx + 2, by - 12);
  c.lineTo(bx + 2, by - 12 - h * 0.080);
  c.quadraticCurveTo(bx + w * 0.068, by - 8 - h * 0.062, bx + w * 0.075, by - 14);
  c.closePath();
  c.fill();
  c.fillStyle = 'rgba(13, 8, 15, 0.4)';
  c.beginPath();
  c.ellipse(bx, by + 2, w * 0.06, 2, 0, 0, Math.PI * 2);
  c.fill();
  // Palms on the near banks
  palm(c, w * 0.07, riverY + 4, h * 0.12, 0.22, '#0F0A0D');
  palm(c, w * 0.93, riverY + 4, h * 0.10, -0.28, '#0F0A0D');
}

function paintTomb(c, w, h, m) {
  // Torch-lit tomb hall with hieroglyph columns
  c.fillStyle = '#21160B';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.60, m * 0.55, '255, 153, 51', 0.06, 3);
  // Stone floor with joints
  const floorH = h * 0.15;
  c.fillStyle = '#33210F';
  c.fillRect(0, h - floorH, w, floorH);
  c.fillStyle = '#170F08';
  for (const xf of [0.25, 0.5, 0.75]) c.fillRect(w * xf - 0.75, h - floorH, 1.5, floorH);
  // Sandstone columns at the walls
  for (const cxf of [0.085, 0.915]) {
    const cx = w * cxf;
    const shaftW = w * 0.10;
    const shaftH = h * 0.62;
    c.fillStyle = '#3D2913';
    c.strokeStyle = '#1A1208';
    c.lineWidth = 1.5;
    c.fillRect(cx - shaftW / 2, h - floorH - shaftH, shaftW, shaftH);
    c.strokeRect(cx - shaftW / 2, h - floorH - shaftH, shaftW, shaftH);
    c.fillRect(cx - shaftW * 0.70, h - floorH - shaftH - h * 0.030, shaftW * 1.4, h * 0.030);
    c.fillStyle = 'rgba(26, 18, 8, 0.7)';
    for (let band = 1; band < 4; band += 1) {
      c.fillRect(cx - shaftW / 2, h - floorH - (shaftH * band) / 4, shaftW, 1.5);
    }
  }
  // Hieroglyph panels
  for (const pxf of [0.30, 0.70]) {
    const px = w * pxf;
    const panelW = w * 0.085;
    const panelH = h * 0.42;
    const panelTop = h - floorH - h * 0.10 - panelH;
    c.strokeStyle = 'rgba(82, 54, 26, 0.7)';
    c.lineWidth = 1.5;
    c.strokeRect(px - panelW / 2, panelTop, panelW, panelH);
    const glyph = 'rgba(20, 13, 5, 0.85)';
    let gy = panelTop + h * 0.035;
    let gi = 0;
    while (gy < panelTop + panelH - h * 0.015) {
      c.fillStyle = glyph;
      c.strokeStyle = glyph;
      c.lineWidth = 2;
      if (gi % 4 === 0) {
        c.beginPath();
        c.ellipse(px, gy, panelW * 0.275, panelW * 0.11, 0, 0, Math.PI * 2);
        c.fill();
      } else if (gi % 4 === 1) {
        c.beginPath();
        c.arc(px, gy - panelW * 0.10, panelW * 0.13, 0, Math.PI * 2);
        c.stroke();
        c.fillRect(px - 1, gy - panelW * 0.02, 2, panelW * 0.30);
        c.fillRect(px - panelW * 0.21, gy + panelW * 0.02 - 1, panelW * 0.42, 2);
      } else if (gi % 4 === 2) {
        c.beginPath();
        c.moveTo(px - panelW * 0.3, gy);
        for (let step = 1; step <= 4; step += 1) {
          c.lineTo(px - panelW * 0.3 + panelW * 0.15 * step, gy - (step % 2 === 0 ? 0 : panelW * 0.10));
        }
        c.stroke();
      } else {
        c.beginPath();
        c.arc(px, gy, panelW * 0.15, 0, Math.PI * 2);
        c.fill();
      }
      gy += h * 0.055;
      gi += 1;
    }
  }
  // Torch flames between the panels
  for (const txf of [0.175, 0.825]) {
    glow(c, w * txf, h * 0.42, w * 0.06, '255, 153, 38', 0.12, 3);
    c.fillStyle = 'rgba(255, 153, 13, 0.9)';
    c.beginPath();
    c.ellipse(w * txf, h * 0.42, 5, 10, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintTombFloor(c, w, h, m) {
  const rand = mulberry32(149);
  // Top-down sandstone tiles. Light page tone like iOS.
  c.fillStyle = '#8F703D';
  c.fillRect(0, 0, w, h);
  const tile = w / 5;
  c.fillStyle = 'rgba(82, 61, 28, 0.35)';
  for (let gx = 0; gx <= w; gx += tile) c.fillRect(gx - 0.75, 0, 1.5, h);
  for (let gy = 0; gy <= h; gy += tile) c.fillRect(0, gy - 0.75, w, 1.5);
  // A few weathered tiles
  for (let i = 0; i < 6; i += 1) {
    c.fillStyle = `rgba(102, 77, 36, ${0.06 + rand() * 0.08})`;
    c.fillRect(Math.floor(rand() * 5) * tile + 1.5, Math.floor(rand() * Math.ceil(h / tile)) * tile + 1.5, tile - 3, tile - 3);
  }
  // Glyph row near the top
  const glyphY = h * 0.06;
  const glyph = 'rgba(71, 51, 20, 0.85)';
  c.strokeStyle = glyph;
  c.fillStyle = glyph;
  c.lineWidth = 2;
  c.beginPath();
  c.arc(w * 0.26, glyphY, 7, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.ellipse(w * 0.44, glyphY, 11, 5, 0, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.arc(w * 0.44, glyphY, 3, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.moveTo(w * 0.56, glyphY + 3);
  for (let step = 1; step <= 4; step += 1) {
    c.lineTo(w * 0.56 + step * 7, glyphY + (step % 2 === 0 ? 3 : -4));
  }
  c.stroke();
  c.beginPath();
  c.arc(w * 0.76, glyphY - 4, 4.5, 0, Math.PI * 2);
  c.stroke();
  c.fillRect(w * 0.76 - 1, glyphY, 2, 10);
  c.fillRect(w * 0.76 - 6, glyphY - 1, 12, 2);
  // Scarab in the bottom margin
  c.fillStyle = '#26595C';
  c.strokeStyle = 'rgba(115, 82, 31, 0.8)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.ellipse(w * 0.68, h * 0.945, 10, 7, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
}

function paintStarryDunes(c, w, h, m) {
  const rand = mulberry32(150);
  c.fillStyle = '#080A1A';
  c.fillRect(0, 0, w, h);
  // Milky way band tilted across the sky
  c.save();
  c.translate(w * 0.5, h * 0.32);
  c.rotate(0.5);
  for (const [wf, hf, a] of [[1.6, 0.16, 0.05], [1.3, 0.08, 0.07]]) {
    c.fillStyle = `rgba(191, 199, 242, ${a})`;
    c.beginPath();
    c.ellipse(0, 0, (w * wf) / 2, (h * hf) / 2, 0, 0, Math.PI * 2);
    c.fill();
  }
  for (let i = 0; i < 60; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.2 + rand() * 0.5})`;
    c.beginPath();
    c.arc((rand() - 0.5) * w * 1.4, (rand() - 0.5) * h * 0.1, 0.4 + rand() * 0.8, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  // Dense starfield
  for (let i = 0; i < 150; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.2 + rand() * 0.75})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.72, 0.4 + rand() * 1.4, 0, Math.PI * 2);
    c.fill();
  }
  // Crescent moon, top right
  const mx = w * 0.80;
  const my = h * 0.14;
  const mr = w * 0.048;
  c.fillStyle = '#F2EDD6';
  c.beginPath();
  c.arc(mx, my, mr, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#080A1A';
  c.beginPath();
  c.arc(mx - mr * 0.45, my - mr * 0.15, mr * 0.9, 0, Math.PI * 2);
  c.fill();
  // Pyramids on the dune horizon
  pyramid(c, w * 0.74, h * 0.74, w * 0.17, h * 0.09);
  pyramid(c, w * 0.88, h * 0.74, w * 0.11, h * 0.06);
  // Moonlit dunes with crest lines
  c.fillStyle = '#1A1724';
  c.fillRect(0, h * 0.80, w, h * 0.20);
  for (const [xf, hf, color] of [[0.20, 0.26, '#262130'], [0.55, 0.18, '#1F1A29'], [0.85, 0.22, '#171421']]) {
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(w * xf, h * 0.82, w * 0.45, (h * hf) / 2, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(140, 140, 179, 0.18)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(w * xf, h * 0.82, w * 0.42, Math.PI * 1.35, Math.PI * 1.65);
    c.stroke();
  }
}

function paintRelics(c, w, h, m) {
  // Torch-lit treasury: grand ankh, winged scarab, glyph band
  c.fillStyle = '#170F0A';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.55, m * 0.55, '242, 153, 51', 0.09, 3);
  const gold = '#EBB840';
  const goldDeep = '#9E731F';
  // Etched hieroglyph band across the bottom
  const bandY = h * 0.915;
  c.fillStyle = 'rgba(235, 184, 64, 0.25)';
  c.fillRect(0, bandY + h * 0.06 - 2, w, 2);
  c.fillRect(0, bandY - h * 0.06, w, 2);
  c.strokeStyle = 'rgba(235, 184, 64, 0.30)';
  c.fillStyle = 'rgba(235, 184, 64, 0.30)';
  c.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    const gx = w * (0.06 + i * 0.11);
    if (i % 3 === 0) {
      c.beginPath();
      c.moveTo(gx - 10, bandY - h * 0.02);
      for (let s = 0; s < 4; s += 1) {
        c.lineTo(gx - 10 + (s + 1) * 5, bandY - h * 0.02 - (s % 2 === 0 ? 6 : 0));
      }
      c.stroke();
    } else if (i % 3 === 1) {
      c.beginPath();
      c.arc(gx, bandY - h * 0.040, 4, 0, Math.PI * 2);
      c.stroke();
      c.fillRect(gx - 1, bandY - h * 0.034, 2, h * 0.026);
    } else {
      c.beginPath();
      c.moveTo(gx - 6, bandY - h * 0.012);
      c.lineTo(gx + 6, bandY - h * 0.012);
      c.lineTo(gx, bandY - h * 0.050);
      c.closePath();
      c.stroke();
    }
  }
  // Grand glowing ankh, center-left
  const ax = w * 0.32;
  const ay = h * 0.48;
  glow(c, ax, ay, w * 0.22, '235, 184, 64', 0.05, 3);
  c.strokeStyle = gold;
  c.lineWidth = w * 0.026;
  c.beginPath();
  c.ellipse(ax, ay - w * 0.10, w * 0.055, w * 0.075, 0, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = gold;
  c.strokeStyle = goldDeep;
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(ax - w * 0.10, ay - w * 0.012 - w * 0.013, w * 0.20, w * 0.026, w * 0.013);
  c.fill();
  c.stroke();
  c.beginPath();
  c.roundRect(ax - w * 0.015, ay - w * 0.015, w * 0.030, w * 0.20, w * 0.015);
  c.fill();
  c.stroke();
  // Winged scarab, lower right
  const scx = w * 0.70;
  const scy = h * 0.70;
  const teal = '#268C80';
  for (const side of [-1, 1]) {
    [0.16, 0.13, 0.10].forEach((span, i) => {
      c.fillStyle = i % 2 === 0 ? 'rgba(235, 184, 64, 0.9)' : 'rgba(38, 140, 128, 0.9)';
      c.beginPath();
      c.ellipse(scx + side * w * (0.085 + i * 0.012), scy - i * h * 0.012, (w * span) / 2, w * 0.015, side * (0.35 + i * 0.10), 0, Math.PI * 2);
      c.fill();
    });
  }
  glow(c, scx, scy, w * 0.06, '102, 242, 217', 0.10, 2);
  c.fillStyle = teal;
  c.strokeStyle = gold;
  c.lineWidth = 2;
  c.beginPath();
  c.ellipse(scx, scy, w * 0.045, w * 0.055, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // Eye of Horus, upper right
  const ex = w * 0.72;
  const ey = h * 0.22;
  c.strokeStyle = gold;
  c.lineWidth = 4;
  c.beginPath();
  c.ellipse(ex, ey, w * 0.075, w * 0.032, 0, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = gold;
  c.beginPath();
  c.arc(ex, ey, w * 0.02, 0, Math.PI * 2);
  c.fill();
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(ex - w * 0.02, ey + w * 0.032);
  c.lineTo(ex - w * 0.035, ey + w * 0.085);
  c.moveTo(ex + w * 0.03, ey + w * 0.032);
  c.quadraticCurveTo(ex + w * 0.07, ey + w * 0.07, ex + w * 0.085, ey + w * 0.045);
  c.stroke();
}

function paintAnubis(c, w, h, m) {
  const rand = mulberry32(151);
  // Dusk gradient
  c.fillStyle = '#1C1438';
  c.fillRect(0, 0, w, h * 0.5);
  c.fillStyle = '#61293D';
  c.fillRect(0, h * 0.5, w, h * 0.2);
  c.fillStyle = '#CC6B2E';
  c.fillRect(0, h * 0.70, w, h * 0.08);
  for (let i = 0; i < 30; i += 1) {
    c.fillStyle = `rgba(230, 230, 230, ${0.2 + rand() * 0.35})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.45, 0.4 + rand() * 0.8, 0, Math.PI * 2);
    c.fill();
  }
  // Distant pyramids
  c.fillStyle = '#381C1F';
  for (const [xf, pw, ph] of [[0.18, 0.16, 0.05], [0.34, 0.10, 0.035]]) {
    c.beginPath();
    c.moveTo(w * (xf - pw / 2), h * 0.78);
    c.lineTo(w * xf, h * (0.78 - ph));
    c.lineTo(w * (xf + pw / 2), h * 0.78);
    c.closePath();
    c.fill();
  }
  // Dunes + foreground
  c.fillStyle = '#2E1A14';
  c.fillRect(0, h * 0.70, w, h * 0.30);
  c.fillStyle = '#42241A';
  c.beginPath();
  c.ellipse(w * 0.4, h * 0.84, w * 0.75, h * 0.08, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#2E1A14';
  c.fillRect(0, h * 0.88, w, h * 0.12);
  // Anubis head profile, upper right, facing left
  const ink = '#0D0A12';
  const gold = '#E0AD38';
  const cx = w * 0.66;
  const cy = h * 0.34;
  const u = w * 0.135;
  c.fillStyle = ink;
  c.strokeStyle = 'rgba(77, 56, 26, 0.8)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(cx - u * 0.1, cy + u * 1.6);
  c.lineTo(cx - u * 0.05, cy + u * 0.2);
  c.lineTo(cx - u * 1.55, cy - u * 0.18);
  c.lineTo(cx - u * 1.5, cy - u * 0.42);
  c.lineTo(cx - u * 0.25, cy - u * 0.66);
  c.lineTo(cx - u * 0.18, cy - u * 1.75);
  c.lineTo(cx + u * 0.12, cy - u * 0.78);
  c.lineTo(cx + u * 0.42, cy - u * 1.62);
  c.lineTo(cx + u * 0.62, cy - u * 0.55);
  c.lineTo(cx + u * 0.78, cy + u * 1.6);
  c.closePath();
  c.fill();
  c.stroke();
  // Gold eye line
  c.strokeStyle = gold;
  c.lineWidth = 3;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(cx - u * 0.55, cy - u * 0.34);
  c.lineTo(cx - u * 0.10, cy - u * 0.42);
  c.stroke();
  // Gold collar bands
  c.lineWidth = 5;
  for (const [yOff, bw] of [[1.18, 0.82], [1.38, 0.92]]) {
    c.beginPath();
    c.moveTo(cx - u * bw * 0.45, cy + u * yOff + u * 0.10);
    c.quadraticCurveTo(cx + u * 0.1, cy + u * yOff + u * 0.32, cx + u * bw * 0.85, cy + u * yOff + u * 0.10);
    c.stroke();
  }
}

function paintCaravan(c, w, h, m) {
  // Camel train on a dune ridge at sunset
  c.fillStyle = '#4D1A42';
  c.fillRect(0, 0, w, h * 0.38);
  c.fillStyle = '#B84D2E';
  c.fillRect(0, h * 0.38, w, h * 0.18);
  c.fillStyle = '#EB9438';
  c.fillRect(0, h * 0.56, w, h * 0.17);
  // Sun
  const sunP = [w * 0.34, h * 0.60];
  glow(c, sunP[0], sunP[1], w * 0.14, '255, 204, 102', 0.05, 4);
  c.fillStyle = '#FFD985';
  c.beginPath();
  c.arc(sunP[0], sunP[1], w * 0.10, 0, Math.PI * 2);
  c.fill();
  // Dune ridge
  c.fillStyle = '#4D261A';
  c.beginPath();
  c.moveTo(0, h * 0.70);
  c.quadraticCurveTo(w * 0.5, h * 0.615, w, h * 0.655);
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();
  c.fill();
  c.fillStyle = '#331A14';
  c.fillRect(0, h * 0.86, w, h * 0.14);
  // Camel train silhouettes along the crest
  const ink = '#120A0A';
  const crestAt = (xf) => h * (0.70 - 0.085 * Math.sin(Math.PI * xf * 0.9));
  const camel = (xf, rider) => {
    const u = w * 0.040;
    const x = w * xf;
    const crestY = crestAt(xf) + 2;
    const beltY = crestY - u * 1.5;
    c.fillStyle = ink;
    c.beginPath();
    c.ellipse(x, beltY, u * 1.3, u * 0.65, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(x - u * 0.2, beltY - u * 0.62, u * 0.62, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = ink;
    c.lineCap = 'round';
    c.lineWidth = u * 0.55;
    c.beginPath();
    c.moveTo(x + u * 1.0, beltY - u * 0.3);
    c.lineTo(x + u * 1.75, beltY - u * 1.5);
    c.stroke();
    c.beginPath();
    c.ellipse(x + u * 2.05, beltY - u * 1.6, u * 0.45, u * 0.25, 0, 0, Math.PI * 2);
    c.fill();
    c.lineWidth = u * 0.22;
    for (const [dxf, stride] of [[-0.9, -0.25], [-0.45, 0.2], [0.5, -0.2], [0.95, 0.3]]) {
      c.beginPath();
      c.moveTo(x + u * dxf, beltY + u * 0.3);
      c.lineTo(x + u * (dxf + stride), crestY);
      c.stroke();
    }
    if (rider) {
      c.beginPath();
      c.ellipse(x - u * 0.2, beltY - u * 1.5, u * 0.28, u * 0.5, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(x - u * 0.2, beltY - u * 2.1, u * 0.22, 0, Math.PI * 2);
      c.fill();
    }
  };
  camel(0.18, true);
  camel(0.42, false);
  camel(0.66, true);
  camel(0.88, false);
}

function paintTempleHall(c, w, h, m) {
  // Sandstone temple hall: columns, torches, glyphs, offering bowl
  c.fillStyle = '#614726';
  c.fillRect(0, 0, w, h);
  // Columns rising through the top
  for (const xf of [0.12, 0.88]) {
    const colX = w * xf;
    c.fillStyle = '#8C6B38';
    c.strokeStyle = '#59401F';
    c.lineWidth = 2;
    c.fillRect(colX - 20, 0, 40, h * 0.30);
    c.strokeRect(colX - 20, 0, 40, h * 0.30);
    c.fillStyle = '#9E8047';
    c.fillRect(colX - 28, 0, 56, 18);
    c.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let dy = 24; dy < h * 0.28; dy += 30) c.fillRect(colX - 20, dy, 40, 1.5);
  }
  // Torches between the columns
  for (const txf of [0.32, 0.68]) {
    glow(c, w * txf, h * 0.13, w * 0.07, '255, 140, 26', 0.12, 3);
    c.fillStyle = '#402E1F';
    c.fillRect(w * txf - 4, h * 0.13 - 4, 8, 22);
    c.fillStyle = 'rgba(255, 153, 13, 0.9)';
    c.beginPath();
    c.ellipse(w * txf, h * 0.115 - 8, 6, 12, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Faint wall glyphs
  const glyphColor = 'rgba(179, 148, 77, 0.45)';
  c.strokeStyle = glyphColor;
  c.lineWidth = 1.5;
  c.beginPath();
  c.ellipse(w * 0.42, h * 0.10, 8, 4, 0, 0, Math.PI * 2);
  c.stroke();
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(w * 0.50 - 6, h * 0.10 + 8);
  c.lineTo(w * 0.50 + 6, h * 0.10 - 8);
  c.moveTo(w * 0.50 + 6, h * 0.10 + 8);
  c.lineTo(w * 0.50 - 6, h * 0.10 - 8);
  c.stroke();
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(w * 0.58, h * 0.095, 5, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = glyphColor;
  c.fillRect(w * 0.58 - 0.75, h * 0.10, 1.5, 10);
  // Offering bowl + scarab near the bottom
  glow(c, w * 0.30, h * 0.925, 20, '255, 179, 64', 0.20, 2);
  c.fillStyle = '#B88C33';
  c.strokeStyle = '#73521A';
  c.lineWidth = 2;
  c.beginPath();
  c.ellipse(w * 0.30, h * 0.94, 26, 7, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = 'rgba(255, 179, 64, 0.8)';
  c.beginPath();
  c.ellipse(w * 0.30, h * 0.932, 13, 5, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#265966';
  c.strokeStyle = 'rgba(184, 148, 64, 0.9)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.ellipse(w * 0.70, h * 0.94, 10, 7, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
}

function paintOasis(c, w, h, m) {
  const rand = mulberry32(152);
  // Daytime oasis: sky, pool, palms, sand below
  const waterY = h * 0.20;
  c.fillStyle = '#8CBFD9';
  c.fillRect(0, 0, w, waterY);
  c.fillStyle = '#FFEB99';
  c.beginPath();
  c.arc(w * 0.80, h * 0.05, h * 0.028, 0, Math.PI * 2);
  c.fill();
  pyramid(c, w * 0.18, waterY - h * 0.045, w * 0.26, h * 0.068);
  // Oasis pool band with shimmer
  c.fillStyle = '#298C8C';
  c.fillRect(0, waterY - h * 0.05, w, h * 0.05);
  c.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 5; i += 1) {
    c.fillRect(20 + rand() * (w - 40), waterY - h * 0.045 + rand() * h * 0.04, 24 + rand() * 36, 1.5);
  }
  // Palms leaning over the pool
  palm(c, w * 0.40, waterY - h * 0.04, h * 0.12, 0.25, '#1F4D29');
  palm(c, w * 0.62, waterY - h * 0.04, h * 0.095, -0.2, '#1F4D29');
  // Sand below
  c.fillStyle = '#D4B375';
  c.fillRect(0, waterY, w, h - waterY);
  // Sand ripples + scarab near the bottom
  c.strokeStyle = 'rgba(173, 140, 82, 0.55)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 4; i += 1) {
    const ry = h * (0.80 + i * 0.045);
    c.beginPath();
    c.moveTo(w * 0.08, ry);
    c.quadraticCurveTo(w * 0.5, ry + 10, w * 0.92, ry);
    c.stroke();
  }
  c.fillStyle = '#26595C';
  c.strokeStyle = 'rgba(115, 82, 31, 0.8)';
  c.beginPath();
  c.ellipse(w * 0.62, h * 0.89, 9, 6, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
}

export const DESERT_SCENES = [
  { key: 'pyramids', name: 'Pyramids', paint: paintPyramids },
  { key: 'sphinx', name: 'Sphinx', paint: paintSphinx, light: true },
  { key: 'sandstorm', name: 'Sandstorm', paint: paintSandstorm },
  { key: 'nile', name: 'Nile', paint: paintNile },
  { key: 'tomb', name: 'Tomb', paint: paintTomb },
  { key: 'tombFloor', name: 'Tomb Floor', paint: paintTombFloor, light: true },
  { key: 'starryDunes', name: 'Starry Dunes', paint: paintStarryDunes },
  { key: 'relics', name: "Pharaoh's Relics", paint: paintRelics },
  { key: 'anubis', name: 'Anubis', paint: paintAnubis },
  { key: 'caravan', name: 'Caravan', paint: paintCaravan },
  { key: 'templeHall', name: 'Temple Hall', paint: paintTempleHall },
  { key: 'oasis', name: 'Oasis', paint: paintOasis, light: true },
];
