// Western scene backgrounds, echoing the iOS Western intensities (Sunset,
// Canyon, Town, Night Camp, Gold Mine, Poker Table, Thunderstorm, Saloon,
// Revolver, Iron Horse, Barn, Trail Camp). Same rules as the other
// painters: layered soft glows, seeded, stable between visits. Colors
// follow BackgroundRenderer.swift; iOS y grows up, flipped here.

import { mulberry32, glow } from './space.js';

// Saguaro cactus silhouette: trunk + two upturned arms (addSaguaro)
function saguaro(c, x, baseY, s, color) {
  c.strokeStyle = color;
  c.lineCap = 'round';
  c.lineWidth = 12 * s;
  c.beginPath();
  c.moveTo(x, baseY);
  c.lineTo(x, baseY - 58 * s);
  c.stroke();
  c.lineWidth = 8 * s;
  c.beginPath();
  c.moveTo(x - 2 * s, baseY - 34 * s);
  c.lineTo(x - 16 * s, baseY - 36 * s);
  c.lineTo(x - 16 * s, baseY - 52 * s);
  c.stroke();
  c.beginPath();
  c.moveTo(x + 2 * s, baseY - 26 * s);
  c.lineTo(x + 15 * s, baseY - 28 * s);
  c.lineTo(x + 15 * s, baseY - 42 * s);
  c.stroke();
}

// Flat-topped mesa silhouette (addButte)
function butte(c, cx, baseY, w, h, color) {
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(cx - w * 0.5, baseY);
  c.lineTo(cx - w * 0.4, baseY - h);
  c.lineTo(cx + w * 0.4, baseY - h);
  c.lineTo(cx + w * 0.5, baseY);
  c.closePath();
  c.fill();
}

// Campfire: crossed logs, flame with bright core, glow, sparks
function campfire(c, x, y, s, rand) {
  glow(c, x, y - 12 * s, 60 * s, '255, 140, 31', 0.13, 3);
  c.fillStyle = '#291710';
  for (const rot of [-0.55, 0.55]) {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.beginPath();
    c.roundRect(-18 * s, -2.5 * s, 36 * s, 5 * s, 2.5 * s);
    c.fill();
    c.restore();
  }
  c.fillStyle = 'rgba(255, 148, 15, 0.92)';
  c.beginPath();
  c.moveTo(x, y - 2);
  c.bezierCurveTo(x + 13 * s, y - 11 * s, x + 12 * s, y - 24 * s, x, y - 32 * s);
  c.bezierCurveTo(x - 12 * s, y - 24 * s, x - 13 * s, y - 11 * s, x, y - 2);
  c.fill();
  c.fillStyle = 'rgba(255, 230, 115, 0.90)';
  c.beginPath();
  c.moveTo(x, y - 5 * s);
  c.bezierCurveTo(x + 7 * s, y - 11 * s, x + 6 * s, y - 19 * s, x, y - 23 * s);
  c.bezierCurveTo(x - 6 * s, y - 19 * s, x - 7 * s, y - 11 * s, x, y - 5 * s);
  c.fill();
  if (rand) {
    for (let i = 0; i < 8; i += 1) {
      c.fillStyle = `rgba(255, 179, 64, ${0.3 + rand() * 0.45})`;
      c.beginPath();
      c.arc(x + (rand() - 0.5) * 28 * s, y - (28 + rand() * 42) * s, 0.8 + rand(), 0, Math.PI * 2);
      c.fill();
    }
  }
}

function paintSunset(c, w, h, m) {
  const rand = mulberry32(130);
  // Hot sunset bands: red down to yellow at the horizon
  c.fillStyle = '#2E1A1A';
  c.fillRect(0, 0, w, h);
  for (const [yf, hf, color] of [
    [0.85, 0.15, '#521433'], [0.68, 0.20, '#8C2633'], [0.52, 0.18, '#D14D2E'],
    [0.40, 0.14, '#F28033'], [0.32, 0.10, '#FFB84D'],
  ]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  // Big low sun
  const sunY = h * 0.66;
  glow(c, w * 0.5, sunY, w * 0.16, '255, 166, 38', 0.12, 3);
  c.fillStyle = '#FFD973';
  c.strokeStyle = 'rgba(255, 242, 179, 0.4)';
  c.lineWidth = 3;
  c.beginPath();
  c.arc(w * 0.5, sunY, w * 0.11, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // Mesa silhouettes on the horizon
  butte(c, w * 0.15, h * 0.70, w * 0.16, h * 0.08, 'rgba(51, 26, 26, 0.90)');
  butte(c, w * 0.78, h * 0.70, w * 0.22, h * 0.10, 'rgba(46, 20, 26, 0.95)');
  butte(c, w * 0.40, h * 0.70, w * 0.30, h * 0.05, 'rgba(26, 13, 15, 0.85)');
  // Desert ground with a foreground hill
  const groundY = h * 0.70;
  c.fillStyle = '#522E1F';
  c.fillRect(0, groundY, w, h - groundY);
  c.fillStyle = '#2E1A14';
  c.beginPath();
  c.moveTo(0, groundY);
  c.quadraticCurveTo(w * 0.25, groundY - h * 0.08, w * 0.5, groundY - h * 0.04);
  c.quadraticCurveTo(w * 0.75, groundY - h * 0.02, w, groundY);
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();
  c.fill();
  // Cacti + tumbleweed silhouettes
  saguaro(c, w * 0.18, groundY + (h - groundY) * 0.30, 1.0, '#0D050A');
  saguaro(c, w * 0.84, groundY + (h - groundY) * 0.45, 0.78, '#0D050A');
  c.fillStyle = '#261408';
  c.strokeStyle = 'rgba(77, 51, 26, 0.6)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(w * 0.62, groundY + (h - groundY) * 0.75, 10, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // Thin distant cloud streaks
  for (let i = 0; i < 3; i += 1) {
    c.fillStyle = 'rgba(217, 128, 89, 0.40)';
    c.beginPath();
    c.ellipse(w * (0.05 + rand() * 0.9), h * (0.10 + rand() * 0.18), 20 + rand() * 30, 3, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintCanyon(c, w, h, m) {
  const rand = mulberry32(131);
  // Bright daytime sky: pale blue down to yellow haze
  c.fillStyle = '#A6C7E0';
  c.fillRect(0, 0, w, h);
  for (const [yf, hf, color] of [[0.70, 0.30, '#94C7EB'], [0.50, 0.20, '#C7D9D9'], [0.36, 0.16, '#EBD19E']]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  // Small high sun
  c.fillStyle = 'rgba(255, 242, 191, 0.90)';
  c.beginPath();
  c.arc(w * 0.82, h * 0.14, w * 0.05, 0, Math.PI * 2);
  c.fill();
  // Far red-rock buttes
  const horizon = h * 0.64;
  butte(c, w * 0.20, horizon, w * 0.30, h * 0.16, 'rgba(140, 77, 64, 0.85)');
  butte(c, w * 0.62, horizon, w * 0.36, h * 0.18, 'rgba(133, 71, 56, 0.85)');
  butte(c, w * 0.92, horizon, w * 0.22, h * 0.14, 'rgba(128, 66, 51, 0.80)');
  // Mid buttes, closer and warmer
  const midY = h * 0.70;
  butte(c, w * 0.08, midY, w * 0.28, h * 0.20, 'rgba(184, 97, 56, 0.95)');
  butte(c, w * 0.78, midY, w * 0.34, h * 0.22, 'rgba(199, 107, 56, 0.95)');
  // Canyon floor
  const floorY = h * 0.70;
  c.fillStyle = '#C77338';
  c.fillRect(0, floorY, w, h - floorY);
  // Scrub brush + rocks
  for (let i = 0; i < 7; i += 1) {
    c.fillStyle = 'rgba(82, 77, 26, 0.95)';
    c.beginPath();
    c.arc(w * (0.04 + i * 0.14), floorY + (h - floorY) * (0.45 + rand() * 0.3), 4 + rand() * 4, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#733823';
  for (let i = 0; i < 5; i += 1) {
    c.beginPath();
    c.ellipse(w * rand(), floorY + (h - floorY) * 0.75, 9 + rand() * 9, 4 + rand() * 4, 0, 0, Math.PI * 2);
    c.fill();
  }
  saguaro(c, w * 0.36, floorY + (h - floorY) * 0.45, 0.55, '#33522E');
}

function paintTown(c, w, h, m) {
  const rand = mulberry32(132);
  // Dusty tan sky
  c.fillStyle = '#C79E61';
  c.fillRect(0, 0, w, h);
  for (const [yf, hf, color] of [[0.70, 0.30, '#B88C4D'], [0.50, 0.20, '#D9AD66'], [0.38, 0.14, '#EBBF7A']]) {
    c.fillStyle = color;
    c.fillRect(0, h * (1 - yf - hf), w, h * hf + 1);
  }
  // Hazy sun
  c.fillStyle = 'rgba(255, 217, 128, 0.80)';
  c.beginPath();
  c.arc(w * 0.78, h * 0.22, w * 0.07, 0, Math.PI * 2);
  c.fill();
  // Distant town buildings along the horizon
  const farY = h * 0.66;
  for (let i = 0; i < 7; i += 1) {
    const bx = w * (0.04 + i * 0.14);
    const bw = 26 + rand() * 24;
    const bh = 30 + rand() * 25;
    c.fillStyle = 'rgba(82, 56, 41, 0.92)';
    c.fillRect(bx - bw / 2, farY - bh, bw, bh);
    if (i % 2 === 0) {
      c.fillStyle = 'rgba(71, 46, 36, 0.92)';
      c.beginPath();
      c.moveTo(bx - bw * 0.55, farY - bh);
      c.lineTo(bx, farY - bh - 14);
      c.lineTo(bx + bw * 0.55, farY - bh);
      c.closePath();
      c.fill();
    }
  }
  // Water tower silhouette
  const wtX = w * 0.20;
  const wtBase = farY - 6;
  c.fillStyle = 'rgba(66, 43, 31, 0.95)';
  c.fillRect(wtX - w * 0.045, wtBase - h * 0.16, w * 0.09, h * 0.07);
  c.beginPath();
  c.moveTo(wtX - w * 0.05, wtBase - h * 0.16);
  c.lineTo(wtX, wtBase - h * 0.195);
  c.lineTo(wtX + w * 0.05, wtBase - h * 0.16);
  c.closePath();
  c.fill();
  c.strokeStyle = 'rgba(66, 43, 31, 0.95)';
  c.lineWidth = 3;
  for (const dx of [-0.035, 0.035]) {
    c.beginPath();
    c.moveTo(wtX + w * dx, wtBase - h * 0.09);
    c.lineTo(wtX + w * dx * 1.6, wtBase);
    c.stroke();
  }
  // Street
  c.fillStyle = '#8C5C33';
  c.fillRect(0, h * 0.80, w, h * 0.20);
  // Saloon facade, centerpiece
  const saloonW = w * 0.34;
  const saloonX = w * 0.5 - saloonW / 2;
  const saloonTop = h * 0.50;
  const saloonBase = h * 0.80;
  c.fillStyle = '#6B4229';
  c.strokeStyle = '#331A0F';
  c.lineWidth = 2;
  c.fillRect(saloonX, saloonTop, saloonW, saloonBase - saloonTop);
  c.strokeRect(saloonX, saloonTop, saloonW, saloonBase - saloonTop);
  // False-front sign
  c.fillStyle = '#522E1F';
  c.strokeStyle = '#26140D';
  c.lineWidth = 1.5;
  c.fillRect(saloonX - 4, saloonTop - 22, saloonW + 8, 22);
  c.strokeRect(saloonX - 4, saloonTop - 22, saloonW + 8, 22);
  // Lit windows
  for (const xf of [0.30, 0.70]) {
    c.fillStyle = 'rgba(242, 204, 102, 0.90)';
    c.strokeStyle = '#331A0F';
    c.fillRect(saloonX + saloonW * xf - 14, saloonTop + (saloonBase - saloonTop) * 0.25, 28, 22);
    c.strokeRect(saloonX + saloonW * xf - 14, saloonTop + (saloonBase - saloonTop) * 0.25, 28, 22);
  }
  // Swinging doors
  c.fillStyle = '#8C522E';
  c.strokeStyle = '#331A0F';
  for (const side of [-1, 1]) {
    const doorX = saloonX + saloonW / 2 + side * 9 - 7;
    c.fillRect(doorX, saloonBase - 42, 14, 32);
    c.strokeRect(doorX, saloonBase - 42, 14, 32);
  }
}

function paintNightCamp(c, w, h, m) {
  const rand = mulberry32(133);
  c.fillStyle = '#0A0D21';
  c.fillRect(0, 0, w, h);
  // Big desert starscape
  for (let i = 0; i < 130; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.2 + rand() * 0.75})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.78, 0.4 + rand() * 1.5, 0, Math.PI * 2);
    c.fill();
  }
  // Crescent moon
  const mx = w * 0.20;
  const my = h * 0.17;
  const mr = w * 0.052;
  c.fillStyle = '#F0EDD9';
  c.beginPath();
  c.arc(mx, my, mr, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#0A0D21';
  c.beginPath();
  c.arc(mx + mr * 0.42, my - mr * 0.18, mr * 0.92, 0, Math.PI * 2);
  c.fill();
  // Mesas on the horizon + desert floor
  const groundY = h * 0.83;
  butte(c, w * 0.85, groundY, w * 0.45, h * 0.15, '#120B1C');
  butte(c, w * 0.12, groundY, w * 0.30, h * 0.09, '#0D0817');
  c.fillStyle = '#170F1A';
  c.fillRect(0, groundY, w, h - groundY);
  saguaro(c, w * 0.10, groundY, 0.9, '#0A0812');
  saguaro(c, w * 0.92, groundY, 0.65, '#0A0812');
  // Campfire with smoke
  campfire(c, w * 0.52, groundY + (h - groundY) * 0.45, 1.0, rand);
  c.fillStyle = 'rgba(179, 179, 179, 0.05)';
  for (let i = 0; i < 2; i += 1) {
    c.beginPath();
    c.ellipse(w * 0.52 + 10 + i * 14, groundY - 55 - i * 26, 15 + i * 9, 5, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintGoldMine(c, w, h, m) {
  const rand = mulberry32(134);
  c.fillStyle = '#1C120D';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 12; i += 1) {
    c.fillStyle = `rgba(18, 11, 8, ${0.25 + rand() * 0.25})`;
    c.beginPath();
    c.ellipse(w * rand(), h * rand(), 20 + rand() * 35, 12 + rand() * 18, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Dirt floor
  const floorY = h * 0.85;
  c.fillStyle = '#261A0F';
  c.fillRect(0, floorY, w, h - floorY);
  // Tunnel mouth arching into darkness
  const tw2 = w * 0.38;
  const tcx = w * 0.5;
  c.fillStyle = '#090504';
  c.beginPath();
  c.moveTo(tcx - tw2 / 2, floorY);
  c.lineTo(tcx - tw2 / 2, floorY - h * 0.21);
  c.quadraticCurveTo(tcx, floorY - h * 0.39, tcx + tw2 / 2, floorY - h * 0.21);
  c.lineTo(tcx + tw2 / 2, floorY);
  c.closePath();
  c.fill();
  // Timber frames
  const timber = '#523017';
  const timberDark = '#2E1A0A';
  const frame = (x1, x2, pw, topY, beamH) => {
    c.fillStyle = timber;
    c.strokeStyle = timberDark;
    c.lineWidth = 1.5;
    for (const px of [x1, x2]) {
      c.fillRect(px - pw / 2, topY, pw, floorY - topY);
      c.strokeRect(px - pw / 2, topY, pw, floorY - topY);
    }
    c.fillRect(x1 - pw, topY - beamH, x2 - x1 + pw * 2, beamH);
    c.strokeRect(x1 - pw, topY - beamH, x2 - x1 + pw * 2, beamH);
  };
  frame(tcx - tw2 * 0.56, tcx + tw2 * 0.56, 10, floorY - h * 0.265, 9);
  frame(w * 0.075, w * 0.925, 15, h * 0.34, 13);
  // Rails converging into the tunnel
  c.strokeStyle = '#6B615C';
  c.lineWidth = 3;
  for (const startXF of [0.28, 0.72]) {
    c.beginPath();
    c.moveTo(w * startXF, h);
    c.lineTo(tcx + (w * startXF - tcx) * 0.30, floorY);
    c.stroke();
  }
  c.fillStyle = timberDark;
  for (let i = 0; i < 5; i += 1) {
    const t = i / 5;
    const sleeperW = w * (0.50 - 0.32 * t);
    c.fillRect(w * 0.5 - sleeperW / 2, h - (h - floorY) * t * 0.92 - 6, sleeperW, 5 - t * 2);
  }
  // Ore cart loaded with glinting gold
  const cartX = w * 0.72;
  const cartW = w * 0.17;
  const cartH = h * 0.065;
  c.fillStyle = '#F2C733';
  for (let i = 0; i < 8; i += 1) {
    c.beginPath();
    c.arc(cartX + (rand() - 0.5) * cartW * 0.6, floorY - cartH + (rand() - 0.5) * 6, 3.5, 0, Math.PI * 2);
    c.fill();
  }
  glow(c, cartX, floorY - cartH, cartW * 0.4, '242, 199, 51', 0.15, 2);
  c.fillStyle = '#2B1C14';
  c.strokeStyle = timberDark;
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(cartX - cartW * 0.5, floorY - cartH);
  c.lineTo(cartX - cartW * 0.36, floorY - cartH * 0.20);
  c.lineTo(cartX + cartW * 0.36, floorY - cartH * 0.20);
  c.lineTo(cartX + cartW * 0.5, floorY - cartH);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = '#140D0A';
  for (const wheelDX of [-cartW * 0.26, cartW * 0.26]) {
    c.beginPath();
    c.arc(cartX + wheelDX, floorY - cartH * 0.1, cartH * 0.22, 0, Math.PI * 2);
    c.fill();
  }
  // Lantern glow by the near frame
  glow(c, w * 0.12, h * 0.5, w * 0.07, '255, 179, 64', 0.12, 3);
}

function paintPokerTable(c, w, h, m) {
  const rand = mulberry32(135);
  // Green felt with a soft sheen
  c.fillStyle = '#0D3D1F';
  c.fillRect(0, 0, w, h);
  glow(c, w * 0.5, h * 0.5, m * 0.55, '23, 84, 43', 0.20, 3);
  for (let i = 0; i < 50; i += 1) {
    c.fillStyle = `rgba(0, 31, 15, ${0.08 + rand() * 0.08})`;
    c.beginPath();
    c.arc(w * rand(), h * rand(), 0.5 + rand() * 0.6, 0, Math.PI * 2);
    c.fill();
  }
  // Wooden rails along the top and bottom edges only
  c.fillStyle = '#472914';
  c.fillRect(0, 0, w, 28);
  c.fillRect(0, h - 28, w, 28);
  c.fillStyle = '#24140A';
  c.fillRect(0, 28, w, 2);
  c.fillRect(0, h - 30, w, 2);
  // Two cards near the bottom left
  for (const [i, rot] of [[0, 0.12], [1, -0.14]]) {
    c.save();
    c.translate(w * 0.24 + i * 20, h * 0.90);
    c.rotate(rot);
    c.fillStyle = '#F5F2EB';
    c.strokeStyle = '#8C857A';
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(-13, -18, 26, 36, 3);
    c.fill();
    c.stroke();
    if (i === 0) {
      c.fillStyle = '#C71F1F';
      c.rotate(Math.PI / 4);
      c.fillRect(-4.5, -4.5, 9, 9);
    } else {
      c.fillStyle = '#1A1A1A';
      c.beginPath();
      c.arc(0, 0, 5, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  }
  // Poker chips near the top right
  for (const [dx, color] of [[0, '#B32424'], [22, '#2456B3'], [44, '#EBEBEB']]) {
    c.fillStyle = color;
    c.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(w * 0.68 + dx, h * 0.095, 11, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    c.beginPath();
    c.arc(w * 0.68 + dx, h * 0.095, 6.5, 0, Math.PI * 2);
    c.stroke();
  }
}

function paintThunderstorm(c, w, h, m) {
  const rand = mulberry32(136);
  c.fillStyle = '#12121C';
  c.fillRect(0, 0, w, h);
  // Boiling storm clouds across the upper half
  for (let i = 0; i < 8; i += 1) {
    c.fillStyle = `rgba(31, 31, 43, ${0.5 + rand() * 0.3})`;
    c.beginPath();
    c.ellipse(w * rand(), h * (0.04 + rand() * 0.34), w * (0.17 + rand() * 0.2), h * (0.03 + rand() * 0.025), 0, 0, Math.PI * 2);
    c.fill();
  }
  // Main lightning bolt with glow sheath + fork
  let bx = w * 0.66;
  let by = h * 0.16;
  const boltPts = [[bx, by]];
  for (let i = 0; i < 6; i += 1) {
    bx += (rand() - 0.6) * 34;
    by += h * 0.095;
    boltPts.push([bx, by]);
  }
  glow(c, w * 0.66, h * 0.16, w * 0.15, '217, 224, 255', 0.10, 2);
  for (const [lw, style] of [[8, 'rgba(204, 217, 255, 0.18)'], [2.5, 'rgba(255, 250, 217, 0.95)']]) {
    c.strokeStyle = style;
    c.lineWidth = lw;
    c.lineCap = 'round';
    c.beginPath();
    boltPts.forEach(([px, py], i) => (i === 0 ? c.moveTo(px, py) : c.lineTo(px, py)));
    c.stroke();
  }
  c.strokeStyle = 'rgba(255, 250, 204, 0.55)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(boltPts[4][0], boltPts[4][1]);
  c.lineTo(boltPts[4][0] - 30, boltPts[4][1] + 38);
  c.stroke();
  // Distant fainter bolt on the left
  let fx = w * 0.20;
  let fy = h * 0.34;
  c.strokeStyle = 'rgba(217, 224, 255, 0.40)';
  c.beginPath();
  c.moveTo(fx, fy);
  for (let i = 0; i < 5; i += 1) {
    fx += (rand() - 0.55) * 18;
    fy += h * 0.085;
    c.lineTo(fx, fy);
  }
  c.stroke();
  // Pale storm light at the horizon, mesas as silhouettes
  const groundY = h * 0.83;
  glow(c, w * 0.5, groundY - h * 0.06, w * 0.4, '115, 128, 179', 0.10, 2);
  butte(c, w * 0.14, groundY, w * 0.36, h * 0.13, '#261F30');
  butte(c, w * 0.88, groundY, w * 0.30, h * 0.11, '#211A2B');
  c.fillStyle = '#17121F';
  c.fillRect(0, groundY, w, h - groundY);
  // Rain streaks
  c.strokeStyle = 'rgba(150, 160, 190, 0.20)';
  c.lineWidth = 1;
  for (let i = 0; i < 60; i += 1) {
    const rx = w * rand();
    const ry = h * rand() * 0.8;
    c.beginPath();
    c.moveTo(rx, ry);
    c.lineTo(rx - 4, ry + 13);
    c.stroke();
  }
}

function paintSaloon(c, w, h, m) {
  const rand = mulberry32(137);
  // Plank wall with warm lamp glow
  c.fillStyle = '#54331A';
  c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(51, 28, 13, 0.8)';
  for (let py = h * 0.0; py < h * 0.70; py += h * 0.105) c.fillRect(0, py, w, 2);
  for (let i = 0; i < 6; i += 1) {
    c.fillStyle = `rgba(38, 20, 10, ${0.10 + rand() * 0.08})`;
    c.beginPath();
    c.ellipse(w * rand(), h * rand(), w * 0.12, h * 0.08, 0, 0, Math.PI * 2);
    c.fill();
  }
  glow(c, w * 0.5, h * 0.28, w * 0.35, '255, 191, 89', 0.10, 3);
  // Wanted poster, slightly tilted
  c.save();
  c.translate(w * 0.26, h * 0.34);
  c.rotate(0.05);
  const posterW = w * 0.24;
  const posterH = posterW * 1.35;
  c.fillStyle = '#D6BD85';
  c.strokeStyle = '#66421F';
  c.lineWidth = 2;
  c.fillRect(-posterW / 2, -posterH / 2, posterW, posterH);
  c.strokeRect(-posterW / 2, -posterH / 2, posterW, posterH);
  c.fillStyle = '#4D2E14';
  c.fillRect(-posterW * 0.39, -posterH * 0.42, posterW * 0.78, posterH * 0.12);
  c.beginPath();
  c.ellipse(0, -posterH * 0.05, posterW * 0.21, posterH * 0.15, 0, 0, Math.PI * 2);
  c.fillStyle = '#6B4724';
  c.fill();
  c.fillStyle = '#38210F';
  c.beginPath();
  c.roundRect(-posterW * 0.25, -posterH * 0.175, posterW * 0.50, posterH * 0.035, 2);
  c.fill();
  c.fillStyle = 'rgba(77, 46, 20, 0.8)';
  for (let i = 0; i < 2; i += 1) {
    c.fillRect(-posterW * 0.33, posterH * (0.20 + i * 0.09), posterW * 0.66, posterH * 0.045);
  }
  c.restore();
  // Horseshoe on the wall, open end up
  c.strokeStyle = '#8C8073';
  c.lineWidth = 7;
  c.lineCap = 'round';
  c.beginPath();
  c.arc(w * 0.76, h * 0.28, w * 0.055, Math.PI - 0.5, Math.PI * 2 + 0.5);
  c.stroke();
  // Bar counter across the bottom
  c.fillStyle = '#3D2110';
  c.fillRect(0, h * 0.70, w, h * 0.30);
  c.fillStyle = '#805226';
  c.fillRect(0, h * 0.70 - 6, w, 6);
  // Whiskey bottle + glass on the counter
  const bx2 = w * 0.82;
  c.fillStyle = '#6B330D';
  c.strokeStyle = 'rgba(179, 107, 38, 0.8)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(bx2 - w * 0.0425, h * 0.70 - h * 0.15, w * 0.085, h * 0.15, 6);
  c.fill();
  c.stroke();
  c.fillStyle = '#6B330D';
  c.fillRect(bx2 - w * 0.012, h * 0.70 - h * 0.195, w * 0.024, h * 0.05);
  c.fillStyle = 'rgba(230, 172, 77, 0.85)';
  c.beginPath();
  c.roundRect(w * 0.68 - 11, h * 0.70 - 24, 22, 24, 3);
  c.fill();
}

function paintRevolver(c, w, h, m) {
  const rand = mulberry32(138);
  // Dusky leather backdrop
  c.fillStyle = '#38211A';
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i += 1) {
    c.fillStyle = `rgba(26, 13, 8, ${0.10 + rand() * 0.10})`;
    c.beginPath();
    c.ellipse(w * rand(), h * rand(), w * 0.14, h * 0.09, 0, 0, Math.PI * 2);
    c.fill();
  }
  glow(c, w * 0.5, h * 0.45, m * 0.5, '242, 166, 77', 0.07, 3);
  // Ace of spades tucked behind the gun
  c.save();
  c.translate(w * 0.74, h * 0.40);
  c.rotate(-0.18);
  c.fillStyle = '#EDEBDB';
  c.strokeStyle = '#59381A';
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(-w * 0.10, -w * 0.14, w * 0.20, w * 0.28, 8);
  c.fill();
  c.stroke();
  const ss = w * 0.040;
  c.fillStyle = '#0F0F0F';
  c.beginPath();
  c.moveTo(0, -ss);
  c.quadraticCurveTo(-ss * 1.1, -ss * 0.55, -ss, ss * 0.3);
  c.quadraticCurveTo(-ss * 0.35, ss * 0.75, 0, ss * 0.15);
  c.quadraticCurveTo(ss * 0.35, ss * 0.75, ss, ss * 0.3);
  c.quadraticCurveTo(ss * 1.1, -ss * 0.55, 0, -ss);
  c.fill();
  c.fillRect(-ss * 0.15, ss * 0.4, ss * 0.25, ss * 0.6);
  c.restore();
  // The revolver, big across the center, barrel pointing left
  c.save();
  c.translate(w * 0.56, h * 0.58);
  c.rotate(0.06);
  const u = w / 390;
  const steel = '#61636E';
  const steelDark = '#383A45';
  const steelHi = 'rgba(158, 166, 184, 0.9)';
  // Barrel + top rib + front sight + ejector rod
  c.fillStyle = steel;
  c.strokeStyle = steelHi;
  c.lineWidth = 1.5;
  c.beginPath();
  c.roundRect(-185 * u, -28 * u, 150 * u, 24 * u, 6 * u);
  c.fill();
  c.stroke();
  c.fillStyle = steelHi;
  c.beginPath();
  c.roundRect(-185 * u, -29.5 * u, 150 * u, 5 * u, 2 * u);
  c.fill();
  c.fillStyle = steel;
  c.fillRect(-183 * u, -37 * u, 6 * u, 8 * u);
  c.fillStyle = steelDark;
  c.beginPath();
  c.roundRect(-175 * u, -5 * u, 90 * u, 10 * u, 5 * u);
  c.fill();
  // Cylinder with chambers
  c.fillStyle = steel;
  c.strokeStyle = steelHi;
  c.beginPath();
  c.roundRect(-35 * u, -34 * u, 58 * u, 44 * u, 10 * u);
  c.fill();
  c.stroke();
  c.fillStyle = steelDark;
  for (let i = 0; i < 3; i += 1) {
    c.beginPath();
    c.arc(-20 * u + i * 15 * u, -12 * u, 6 * u, 0, Math.PI * 2);
    c.fill();
  }
  // Frame, hammer, grip, trigger guard
  c.fillStyle = steel;
  c.beginPath();
  c.roundRect(23 * u, -30 * u, 30 * u, 34 * u, 6 * u);
  c.fill();
  c.fillStyle = steelDark;
  c.fillRect(38 * u, -40 * u, 10 * u, 14 * u);
  c.fillStyle = '#4D3018';
  c.strokeStyle = '#33200F';
  c.beginPath();
  c.roundRect(38 * u, -6 * u, 26 * u, 52 * u, 10 * u);
  c.fill();
  c.stroke();
  c.strokeStyle = steelDark;
  c.lineWidth = 5 * u;
  c.beginPath();
  c.arc(14 * u, 14 * u, 14 * u, 0, Math.PI);
  c.stroke();
  c.restore();
  // Scattered bullets, lower left
  c.fillStyle = '#A6801F';
  for (const [xf, yf, rot] of [[0.16, 0.80, 0.4], [0.24, 0.85, -0.3], [0.20, 0.90, 0.9]]) {
    c.save();
    c.translate(w * xf, h * yf);
    c.rotate(rot);
    c.beginPath();
    c.roundRect(-9, -3.5, 18, 7, 3.5);
    c.fill();
    c.restore();
  }
}

function paintIronHorse(c, w, h, m) {
  const rand = mulberry32(139);
  // Dusk sky bands
  c.fillStyle = '#1F142E';
  c.fillRect(0, 0, w, h * 0.45);
  c.fillStyle = '#73292E';
  c.fillRect(0, h * 0.45, w, h * 0.17);
  c.fillStyle = '#CC6B29';
  c.fillRect(0, h * 0.62, w, h * 0.08);
  for (let i = 0; i < 30; i += 1) {
    c.fillStyle = `rgba(230, 230, 230, ${0.2 + rand() * 0.4})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.4, 0.4 + rand() * 0.8, 0, Math.PI * 2);
    c.fill();
  }
  // Mesas on the horizon
  butte(c, w * 0.12, h * 0.70, w * 0.30, h * 0.07, '#291419');
  butte(c, w * 0.78, h * 0.70, w * 0.34, h * 0.09, '#291419');
  // Prairie ground
  c.fillStyle = '#3D241A';
  c.fillRect(0, h * 0.70, w, h * 0.30);
  // Track
  const railY = h * 0.84;
  c.fillStyle = '#6B5C52';
  c.fillRect(0, railY - 1, w, 3);
  c.fillStyle = '#38261A';
  for (let tx = 4; tx < w; tx += 26) c.fillRect(tx, railY + 5, 9, 4);
  // Locomotive silhouette heading right
  const loco = '#0F0D0F';
  const noseX = w * 0.72;
  const rearX = w * 0.20;
  const bodyY = railY - 2;
  c.fillStyle = loco;
  c.fillRect(rearX + w * 0.16, bodyY - h * 0.045, noseX - rearX - w * 0.16, h * 0.045);
  c.fillRect(rearX, bodyY - h * 0.085, w * 0.16, h * 0.085);
  c.fillStyle = 'rgba(255, 179, 77, 0.9)';
  c.fillRect(rearX + w * 0.025, bodyY - h * 0.068, w * 0.05, h * 0.030);
  // Smokestack
  const stackX = noseX - w * 0.060;
  c.fillStyle = loco;
  c.beginPath();
  c.moveTo(stackX - 7, bodyY - h * 0.045);
  c.lineTo(stackX - 13, bodyY - h * 0.10);
  c.lineTo(stackX + 13, bodyY - h * 0.10);
  c.lineTo(stackX + 7, bodyY - h * 0.045);
  c.closePath();
  c.fill();
  // Cowcatcher + headlamp
  c.beginPath();
  c.moveTo(noseX, bodyY - h * 0.03);
  c.lineTo(noseX + w * 0.05, railY + 1);
  c.lineTo(noseX, railY + 1);
  c.closePath();
  c.fill();
  glow(c, noseX - 4, bodyY - h * 0.032, 8, '255, 217, 115', 0.20, 4);
  c.fillStyle = '#FFE699';
  c.beginPath();
  c.arc(noseX - 4, bodyY - h * 0.032, 5, 0, Math.PI * 2);
  c.fill();
  // Wheels
  c.fillStyle = loco;
  for (const wxF of [0.28, 0.40, 0.52, 0.63]) {
    c.beginPath();
    c.arc(w * wxF, railY - 2, h * 0.020, 0, Math.PI * 2);
    c.fill();
  }
  // Smoke puffs trailing back-left
  c.fillStyle = 'rgba(179, 179, 179, 0.14)';
  for (let i = 0; i < 4; i += 1) {
    c.beginPath();
    c.ellipse(stackX - 20 - i * 34, bodyY - h * 0.13 - i * h * 0.028, 12 + i * 6, 7 + i * 3, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function paintBarn(c, w, h, m) {
  const rand = mulberry32(140);
  // Barn wall of vertical boards, lantern-lit
  c.fillStyle = '#5C3D26';
  c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(0, 0, 0, 0.16)';
  for (let bx = 0; bx < w; bx += 44) c.fillRect(bx, 0, 2, h);
  // Hay bales near the top
  const hay = '#CCA852';
  for (const [xf, yf, s] of [[0.22, 0.12, 1.0], [0.36, 0.13, 0.85], [0.28, 0.05, 0.9]]) {
    c.fillStyle = hay;
    c.strokeStyle = '#94732E';
    c.lineWidth = 2;
    c.beginPath();
    c.roundRect(w * xf - 37 * s, h * yf - 21 * s, 74 * s, 42 * s, 6);
    c.fill();
    c.stroke();
    c.strokeStyle = 'rgba(148, 115, 46, 0.7)';
    c.lineWidth = 1.5;
    for (const dy of [-8, 6]) {
      c.beginPath();
      c.moveTo(w * xf - 33 * s, h * yf + dy * s);
      c.lineTo(w * xf + 33 * s, h * yf + dy * s);
      c.stroke();
    }
  }
  // Hanging lantern
  const lx = w * 0.72;
  const ly = h * 0.11;
  c.strokeStyle = '#262626';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(lx, 0);
  c.lineTo(lx, ly - 16);
  c.stroke();
  glow(c, lx, ly, 34, '255, 179, 64', 0.16, 2);
  c.fillStyle = 'rgba(255, 199, 89, 0.95)';
  c.strokeStyle = '#262626';
  c.beginPath();
  c.roundRect(lx - 8, ly - 12, 16, 24, 5);
  c.fill();
  c.stroke();
  // Horseshoe on the wall
  c.strokeStyle = '#737373';
  c.lineWidth = 4;
  c.lineCap = 'round';
  c.beginPath();
  c.arc(w * 0.88, h * 0.09, 12, Math.PI * 1.25, Math.PI * 2.75);
  c.stroke();
  // Straw scattered near the bottom + wagon wheel
  c.strokeStyle = 'rgba(204, 168, 82, 0.6)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 14; i += 1) {
    const sx = 10 + rand() * (w - 20);
    const sy = h * (0.86 + rand() * 0.11);
    const angle = (rand() - 0.5);
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(sx + Math.cos(angle) * 14, sy + Math.sin(angle) * 14);
    c.stroke();
  }
  const wcx = w * 0.82;
  const wcy = h * 0.92;
  c.strokeStyle = '#40291A';
  c.lineWidth = 5;
  c.beginPath();
  c.arc(wcx, wcy, 24, 0, Math.PI * 2);
  c.stroke();
  c.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    const a = (i * Math.PI) / 4;
    c.beginPath();
    c.moveTo(wcx - Math.cos(a) * 22, wcy - Math.sin(a) * 22);
    c.lineTo(wcx + Math.cos(a) * 22, wcy + Math.sin(a) * 22);
    c.stroke();
  }
}

function paintTrailCamp(c, w, h, m) {
  const rand = mulberry32(141);
  // Dusk sky over desert hardpan
  const horizonY = h * 0.24;
  c.fillStyle = '#401A47';
  c.fillRect(0, 0, w, horizonY);
  c.fillStyle = '#8C3840';
  c.fillRect(0, horizonY - h * 0.11, w, h * 0.055);
  c.fillStyle = '#BF5933';
  c.fillRect(0, horizonY - h * 0.055, w, h * 0.055);
  for (let i = 0; i < 12; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.3 + rand() * 0.4})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.12, 0.5 + rand() * 0.7, 0, Math.PI * 2);
    c.fill();
  }
  butte(c, w * 0.30, horizonY, w * 0.34, h * 0.075, '#29121F');
  // Campfire on the ground line
  campfire(c, w * 0.74, horizonY - 6, 0.9, rand);
  // Hardpan ground
  c.fillStyle = '#613D29';
  c.fillRect(0, horizonY, w, h - horizonY);
  // Bedroll + lasso + cactus near the bottom
  c.fillStyle = '#734D38';
  c.strokeStyle = 'rgba(153, 107, 77, 0.9)';
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(w * 0.28 - 43, h * 0.90 - 13, 86, 26, 13);
  c.fill();
  c.stroke();
  c.strokeStyle = 'rgba(153, 107, 77, 0.6)';
  c.lineWidth = 1.5;
  for (const dx of [-22, 0, 22]) {
    c.beginPath();
    c.moveTo(w * 0.28 + dx, h * 0.90 - 13);
    c.lineTo(w * 0.28 + dx, h * 0.90 + 13);
    c.stroke();
  }
  c.strokeStyle = '#B8945C';
  c.lineWidth = 3.5;
  c.beginPath();
  c.arc(w * 0.72, h * 0.90, 18, 0, Math.PI * 2);
  c.stroke();
  saguaro(c, w * 0.92, h * 0.99, 0.55, '#33291A');
}

export const WESTERN_SCENES = [
  { key: 'sunset', name: 'Sunset', paint: paintSunset },
  { key: 'canyon', name: 'Canyon', paint: paintCanyon, light: true },
  { key: 'town', name: 'Town', paint: paintTown },
  { key: 'nightCamp', name: 'Night Camp', paint: paintNightCamp },
  { key: 'goldMine', name: 'Gold Mine', paint: paintGoldMine },
  { key: 'pokerTable', name: 'Poker Table', paint: paintPokerTable },
  { key: 'thunderstorm', name: 'Thunderstorm', paint: paintThunderstorm },
  { key: 'saloon', name: 'Saloon', paint: paintSaloon },
  { key: 'revolver', name: 'Revolver', paint: paintRevolver },
  { key: 'ironHorse', name: 'Iron Horse', paint: paintIronHorse },
  { key: 'barn', name: 'Barn', paint: paintBarn },
  { key: 'trailCamp', name: 'Trail Camp', paint: paintTrailCamp },
];
