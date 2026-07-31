// Feudal Japan scene backgrounds, echoing the iOS FeudalJapan intensities
// (Sakura Dawn, Sakura Night, Misty Hills, Blossom Storm, Snowfall,
// Lanterns, Tatami, Dojo, Katana, The Duel, Tea Room, Veranda). Same rules
// as the Space/Ocean painters: layered soft glows, seeded, stable between
// visits. Colors and geometry follow BackgroundRenderer.swift; iOS y grows
// up, so positions are flipped (canvas y = h - iOS y).

import { mulberry32, glow, sky } from './space.js';

// Two rolling hill silhouettes along the bottom (makeFeudalHill1/2)
function hills(c, w, h, color1, color2) {
  const hY1 = h * 0.16;
  c.fillStyle = color1;
  c.beginPath();
  c.moveTo(-20, h);
  c.bezierCurveTo(w * 0.05, h - hY1 * 0.5, w * 0.15, h - hY1, w * 0.30, h - hY1);
  c.bezierCurveTo(w * 0.45, h - hY1 * 1.08, w * 0.55, h - hY1 * 0.78, w * 0.65, h - hY1 * 0.72);
  c.bezierCurveTo(w * 0.80, h - hY1 * 0.62, w * 0.94, h - hY1 * 0.28, w + 20, h);
  c.closePath();
  c.fill();
  const hY2 = h * 0.11;
  c.fillStyle = color2;
  c.beginPath();
  c.moveTo(-20, h);
  c.bezierCurveTo(w * 0.08, h - hY2 * 0.4, w * 0.15, h - hY2, w * 0.25, h - hY2);
  c.bezierCurveTo(w * 0.38, h - hY2 * 1.05, w * 0.48, h - hY2 * 0.60, w * 0.55, h - hY2 * 0.55);
  c.bezierCurveTo(w * 0.72, h - hY2 * 0.40, w * 0.90, h - hY2 * 0.18, w + 20, h);
  c.closePath();
  c.fill();
}

// Torii gate silhouette (addToriiGate): pillars, nuki, wide kasagi beam
function torii(c, cx, baseY, w, h, color) {
  const gw = w * 0.22;
  const gh = h * 0.13;
  const pillarW = w * 0.022;
  const beamH = h * 0.016;
  c.fillStyle = color;
  for (const xOff of [-gw * 0.5 + pillarW * 0.5, gw * 0.5 - pillarW * 0.5]) {
    c.fillRect(cx + xOff - pillarW / 2, baseY - gh, pillarW, gh);
  }
  c.fillRect(cx - gw * 0.425, baseY - gh * 0.72 - beamH / 2, gw * 0.85, beamH);
  c.fillRect(cx - gw * 0.57, baseY - gh * 0.91 - beamH * 0.7, gw * 1.14, beamH * 1.4);
}

// Drifting cherry petals (addCherryPetals): tinted ellipses, random spin
function petals(c, w, h, rand, count) {
  for (let i = 0; i < count; i += 1) {
    const r = 1.5 + rand() * 1.7;
    const red = Math.round(235 + rand() * 20);
    const grn = Math.round(140 + rand() * 59);
    const blu = Math.round(166 + rand() * 43);
    c.fillStyle = `rgba(${red}, ${grn}, ${blu}, ${0.55 + rand() * 0.4})`;
    c.beginPath();
    c.ellipse(w * rand(), h * (0.15 + rand() * 0.65), r * 1.7, r, rand() * Math.PI * 2, 0, Math.PI * 2);
    c.fill();
  }
}

function paintSakuraDawn(c, w, h, m) {
  // Soft dawn sky, warm horizon, Mt. Fuji with snow cap, hinomaru sun
  sky(c, w, h, '#F0C9BF', '#EBBDB3', '#E3AA9C');
  const rand = mulberry32(90);
  glow(c, w * 0.5, h * 1.02, m * 0.75, '255, 199, 140', 0.40, 3);
  // Distant haze hill behind Fuji
  c.fillStyle = 'rgba(115, 77, 102, 0.55)';
  c.fillRect(-w * 0.1, h * 0.90, w * 1.2, h * 0.10);
  // Fuji body: concave slopes to the peak
  const fx = w * 0.45;
  const peakY = h * 0.70;
  const halfBase = w * 0.46;
  c.fillStyle = '#52476B';
  c.beginPath();
  c.moveTo(fx - halfBase, h);
  c.quadraticCurveTo(fx - halfBase * 0.55, h - (h - peakY) * 0.55, fx, peakY);
  c.quadraticCurveTo(fx + halfBase * 0.55, h - (h - peakY) * 0.55, fx + halfBase, h);
  c.closePath();
  c.fill();
  // Snow cap with a scalloped snow line
  const snowBaseY = peakY + (h - peakY) * 0.30;
  const snowHalfW = halfBase * 0.32;
  c.fillStyle = '#F7F7FC';
  c.beginPath();
  c.moveTo(fx - snowHalfW, snowBaseY);
  c.lineTo(fx, peakY);
  c.lineTo(fx + snowHalfW, snowBaseY);
  c.quadraticCurveTo(fx, snowBaseY + 12, fx - snowHalfW, snowBaseY);
  c.closePath();
  c.fill();
  // Hinomaru: clean red disc, no halo
  c.fillStyle = '#E02E2E';
  c.beginPath();
  c.arc(w * 0.78, h * 0.38, w * 0.060, 0, Math.PI * 2);
  c.fill();
  torii(c, w * 0.42, h * 0.96, w, h, '#8C1A1A');
  petals(c, w, h, rand, 28);
}

function paintSakuraNight(c, w, h, m) {
  sky(c, w, h, '#050A1A', '#040814', '#02050D');
  const rand = mulberry32(91);
  // Star field in the upper sky
  for (let i = 0; i < 140; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.3 + rand() * 0.7})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.58, 0.4 + rand() * 1.4, 0, Math.PI * 2);
    c.fill();
  }
  // White moon with halo
  glow(c, w * 0.78, h * 0.20, m * 0.14, '242, 242, 242', 0.18, 3);
  c.fillStyle = '#F2F2F2';
  c.beginPath();
  c.arc(w * 0.78, h * 0.20, w * 0.075, 0, Math.PI * 2);
  c.fill();
  hills(c, w, h, '#0A0F1A', '#050A12');
  // Cherry tree, foreground left: trunk, three branches, blossom clusters
  const tx = w * 0.16;
  const treeH = h * 0.14;
  const baseY = h * 0.95;
  c.fillStyle = '#1F1412';
  c.fillRect(tx - 2, baseY - treeH, 4, treeH);
  c.strokeStyle = '#1F1412';
  c.lineWidth = 2;
  for (const [angle, len] of [[0.55, treeH * 0.55], [-0.45, treeH * 0.50], [0.20, treeH * 0.30]]) {
    const oy = baseY - treeH * 0.55;
    const tipX = tx + Math.sin(angle) * len;
    const tipY = oy - Math.cos(angle) * len;
    c.beginPath();
    c.moveTo(tx, oy);
    c.lineTo(tipX, tipY);
    c.stroke();
    c.fillStyle = 'rgba(255, 166, 199, 0.95)';
    for (let i = 0; i < 10; i += 1) {
      c.beginPath();
      c.arc(tipX + (rand() - 0.5) * 20, tipY + (rand() - 0.5) * 20, 2.5 + rand() * 2, 0, Math.PI * 2);
      c.fill();
    }
  }
  petals(c, w, h, rand, 18);
  torii(c, w * 0.42, h * 0.96, w, h, '#05080F');
}

function paintMistyHills(c, w, h, m) {
  sky(c, w, h, '#1A1A21', '#16161C', '#101015');
  const rand = mulberry32(92);
  for (let i = 0; i < 35; i += 1) {
    c.fillStyle = `rgba(217, 217, 217, ${0.2 + rand() * 0.35})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.58, 0.4 + rand() * 1.4, 0, Math.PI * 2);
    c.fill();
  }
  // Pale moon, no halo
  c.fillStyle = 'rgba(199, 199, 199, 0.7)';
  c.beginPath();
  c.arc(w * 0.78, h * 0.20, w * 0.045, 0, Math.PI * 2);
  c.fill();
  // Mist bands drifting across the mid-ground
  for (let i = 0; i < 5; i += 1) {
    glow(c, w * rand(), h * (0.55 + rand() * 0.25), m * (0.18 + rand() * 0.15), '200, 205, 215', 0.05, 2);
  }
  hills(c, w, h, '#12141A', '#0A0D12');
  torii(c, w * 0.42, h * 0.96, w, h, '#0F0F14');
}

function paintBlossomStorm(c, w, h, m) {
  // The war sky: embers, battle smoke, clan banners under an orange moon
  sky(c, w, h, '#0F0505', '#0C0404', '#080202');
  const rand = mulberry32(93);
  glow(c, w * 0.5, h * 1.05, m * 0.8, '128, 20, 5', 0.45, 3);
  glow(c, w * 0.5, h * 1.0, m * 0.5, '179, 38, 5', 0.25, 3);
  // Ember stars
  for (let i = 0; i < 40; i += 1) {
    const g = Math.round(128 + rand() * 76);
    const b = Math.round(77 + rand() * 51);
    c.fillStyle = `rgba(255, ${g}, ${b}, ${0.2 + rand() * 0.45})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.58, 0.4 + rand() * 1.4, 0, Math.PI * 2);
    c.fill();
  }
  // War moon
  glow(c, w * 0.78, h * 0.20, m * 0.14, '204, 64, 13', 0.12, 3);
  c.fillStyle = '#F2AD47';
  c.beginPath();
  c.arc(w * 0.78, h * 0.20, w * 0.065, 0, Math.PI * 2);
  c.fill();
  hills(c, w, h, '#140A08', '#0D0805');
  // Battle smoke drifting low
  for (let i = 0; i < 5; i += 1) {
    const smokeW = w * (0.15 + rand() * 0.15);
    const r = Math.round(77 + rand() * 51);
    c.fillStyle = `rgba(${r}, 13, 3, ${0.08 + rand() * 0.10})`;
    c.beginPath();
    c.ellipse(w * (0.1 + rand() * 0.8), h * (0.72 + rand() * 0.16), smokeW / 2, h * 0.05, 0, 0, Math.PI * 2);
    c.fill();
  }
  torii(c, w * 0.42, h * 0.96, w, h, '#1A0805');
  // Clan banners: red left, blue right (addBattleBanner)
  const banner = (x, tallFrac, color) => {
    const poleH = h * tallFrac;
    const baseY = h * 0.94;
    const bannerW = w * 0.05;
    const bannerH = h * 0.11;
    c.fillStyle = '#1F1410';
    c.fillRect(x - 2.5, baseY - poleH, 5, poleH);
    c.fillRect(x - bannerW / 2 - 5, baseY - poleH + 1.5, bannerW + 10, 3.5);
    c.fillStyle = color;
    c.fillRect(x - bannerW / 2, baseY - poleH + 5, bannerW, bannerH);
    c.fillStyle = 'rgba(255, 255, 255, 0.18)';
    c.fillRect(x - 1, baseY - poleH + 5 + bannerH * 0.32, 2, bannerH * 0.35);
  };
  banner(w * 0.10, 0.24, 'rgba(122, 13, 13, 0.92)');
  banner(w * 0.18, 0.20, 'rgba(122, 13, 13, 0.92)');
  banner(w * 0.80, 0.22, 'rgba(20, 20, 97, 0.92)');
  banner(w * 0.88, 0.18, 'rgba(20, 20, 97, 0.92)');
}

function paintSnowfall(c, w, h, m) {
  sky(c, w, h, '#141A2B', '#121726', '#0D111C');
  const rand = mulberry32(94);
  // Cold moon with halo
  glow(c, w * 0.76, h * 0.20, m * 0.13, '204, 217, 255', 0.10, 3);
  c.fillStyle = 'rgba(230, 237, 255, 0.95)';
  c.beginPath();
  c.arc(w * 0.76, h * 0.20, w * 0.060, 0, Math.PI * 2);
  c.fill();
  hills(c, w, h, '#1C2133', '#141A29');
  // Snow ground with drifts
  const snowH = h * 0.09;
  c.fillStyle = '#B8C2D6';
  c.fillRect(0, h - snowH, w, snowH);
  c.fillStyle = '#CCD6EB';
  for (const [xf, wf] of [[0.15, 0.45], [0.60, 0.55], [0.92, 0.35]]) {
    c.beginPath();
    c.ellipse(w * xf, h - snowH, (w * wf) / 2, snowH * 0.28, 0, 0, Math.PI * 2);
    c.fill();
  }
  // Three-tier pagoda silhouette with snow-capped roofs
  const px = w * 0.22;
  let tierY = h - snowH * 0.9;
  for (const twf of [0.30, 0.24, 0.18]) {
    const tw = w * twf;
    const bodyH = h * 0.034;
    c.fillStyle = '#0A0D1A';
    c.fillRect(px - tw * 0.275, tierY - bodyH, tw * 0.55, bodyH);
    tierY -= bodyH;
    const roofH = h * 0.024;
    c.beginPath();
    c.moveTo(px - tw * 0.5, tierY);
    c.quadraticCurveTo(px - tw * 0.15, tierY - roofH, px, tierY - roofH);
    c.quadraticCurveTo(px + tw * 0.15, tierY - roofH, px + tw * 0.5, tierY);
    c.closePath();
    c.fill();
    c.fillStyle = 'rgba(217, 224, 242, 0.95)';
    c.beginPath();
    c.ellipse(px, tierY - roofH * 0.78, tw * 0.31, 2, 0, 0, Math.PI * 2);
    c.fill();
    tierY -= roofH * 0.72;
  }
  c.fillStyle = '#0A0D1A';
  c.fillRect(px - 1.25, tierY - h * 0.022, 2.5, h * 0.022);
  torii(c, w * 0.74, h - snowH * 0.9, w, h, '#0A0D1A');
  // Falling snow
  for (let i = 0; i < 70; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.25 + rand() * 0.6})`;
    c.beginPath();
    c.arc(w * rand(), h * rand(), 0.8 + rand() * 1.6, 0, Math.PI * 2);
    c.fill();
  }
}

function paintLanterns(c, w, h, m) {
  sky(c, w, h, '#120C24', '#0F0A1F', '#0A0614');
  const rand = mulberry32(95);
  glow(c, w * 0.5, h * 1.02, m * 0.7, '217, 102, 38', 0.12, 3);
  for (let i = 0; i < 40; i += 1) {
    c.fillStyle = `rgba(255, 255, 255, ${0.15 + rand() * 0.35})`;
    c.beginPath();
    c.arc(w * rand(), h * rand() * 0.45, 0.4 + rand() * 1, 0, Math.PI * 2);
    c.fill();
  }
  hills(c, w, h, '#120D1C', '#0D0814');
  torii(c, w * 0.42, h * 0.96, w, h, '#080510');
  // Floating lanterns: smaller and dimmer higher up for depth
  for (let i = 0; i < 14; i += 1) {
    const yf = 0.30 + rand() * 0.66;
    const s = 1.35 - yf;
    const x = w * (0.04 + rand() * 0.92);
    const y = h * (1 - yf);
    glow(c, x, y, 30 * s, '255, 166, 64', 0.10, 2);
    const bodyW = 17 * s;
    const bodyH = 24 * s;
    c.fillStyle = `rgba(255, 179, 71, ${0.75 + rand() * 0.2})`;
    c.strokeStyle = 'rgba(140, 64, 20, 0.8)';
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x - bodyW / 2, y - bodyH / 2, bodyW, bodyH, bodyW * 0.35);
    c.fill();
    c.stroke();
    c.fillStyle = 'rgba(255, 235, 153, 0.9)';
    c.beginPath();
    c.arc(x, y + bodyH * 0.12, bodyW * 0.28, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(77, 31, 10, 0.9)';
    for (const capDY of [-bodyH / 2, bodyH / 2]) {
      c.fillRect(x - bodyW * 0.275, y + capDY - 1.25 * s, bodyW * 0.55, 2.5 * s);
    }
  }
}

function paintTatami(c, w, h, m) {
  // Straw mat page with cloth heri borders. Light page tone like iOS.
  c.fillStyle = '#C7B073';
  c.fillRect(0, 0, w, h);
  // Fine straw weave
  c.fillStyle = 'rgba(140, 120, 66, 0.18)';
  for (let y = 0; y < h; y += 9) c.fillRect(0, y, w, 1);
  // Cloth borders top and bottom with a gold stitch line
  c.fillStyle = '#243D29';
  c.fillRect(0, 0, w, 28);
  c.fillRect(0, h - 28, w, 28);
  c.fillStyle = 'rgba(217, 179, 77, 0.6)';
  c.fillRect(0, 27, w, 1.5);
  c.fillRect(0, h - 28.5, w, 1.5);
  // A couple of stray cherry petals near the top band
  c.fillStyle = 'rgba(250, 173, 191, 0.9)';
  for (const [xf, rot] of [[0.30, 0.6], [0.68, 2.4]]) {
    c.beginPath();
    c.ellipse(w * xf, 44, 3.5, 2, rot, 0, Math.PI * 2);
    c.fill();
  }
}

function paintDojo(c, w, h, m) {
  // Training hall wall: glowing shoji screens, enso scroll, wood floor
  c.fillStyle = '#664826';
  c.fillRect(0, 0, w, h);
  const lattice = '#422B17';
  for (const cxf of [0.21, 0.79]) {
    const panelW = w * 0.30;
    const panelH = h * 0.32;
    const x0 = w * cxf - panelW / 2;
    const y0 = h * 0.18;
    c.fillStyle = 'rgba(255, 242, 204, 0.10)';
    c.fillRect(x0 - 8, y0 - 8, panelW + 16, panelH + 16);
    c.fillStyle = '#EDE3C7';
    c.fillRect(x0, y0, panelW, panelH);
    c.strokeStyle = lattice;
    c.lineWidth = 3;
    c.strokeRect(x0, y0, panelW, panelH);
    c.fillStyle = lattice;
    for (let i = 1; i < 3; i += 1) c.fillRect(x0 + (panelW * i) / 3 - 1, y0, 2, panelH);
    for (let i = 1; i < 4; i += 1) c.fillRect(x0, y0 + (panelH * i) / 4 - 1, panelW, 2);
  }
  // Hanging scroll: enso circle and red seal
  const scrollW = w * 0.15;
  const scrollH = h * 0.28;
  const sx0 = w * 0.5 - scrollW / 2;
  const sy0 = h * 0.18;
  c.fillStyle = '#F0E8D1';
  c.fillRect(sx0, sy0, scrollW, scrollH);
  c.strokeStyle = '#331F0F';
  c.lineWidth = 2;
  c.strokeRect(sx0, sy0, scrollW, scrollH);
  c.fillStyle = '#26170A';
  for (const rodY of [sy0 - 5.5, sy0 + scrollH + 0.5]) {
    c.beginPath();
    c.roundRect(w * 0.5 - scrollW * 0.575, rodY, scrollW * 1.15, 5, 2.5);
    c.fill();
  }
  c.strokeStyle = 'rgba(36, 28, 26, 0.85)';
  c.lineWidth = 4;
  c.beginPath();
  c.arc(w * 0.5, sy0 + scrollH * 0.40, scrollW * 0.28, 0.3, Math.PI * 2 - 0.15);
  c.stroke();
  c.fillStyle = 'rgba(199, 38, 31, 0.9)';
  c.fillRect(sx0 + scrollW - 16, sy0 + scrollH - 24, 8, 8);
  // Structural posts and wall beam
  c.fillStyle = '#38210F';
  for (const xf of [0.045, 0.955]) c.fillRect(w * xf - w * 0.022, 0, w * 0.044, h);
  c.fillStyle = '#3D2412';
  c.fillRect(0, h * 0.755 - h * 0.011, w, h * 0.022);
  // Polished wood floor
  const floorH = h * 0.235;
  c.fillStyle = '#855C2E';
  c.fillRect(0, h - floorH, w, floorH);
  c.fillStyle = '#5C3D1C';
  for (let i = 1; i < 4; i += 1) c.fillRect(0, h - (floorH * i) / 4, w, 1.5);
}

function paintKatana(c, w, h, m) {
  sky(c, w, h, '#171029', '#140F1F', '#0D0A14');
  // Rising sun disc, low-right, with soft crimson glow
  const sunX = w * 0.72;
  const sunY = h * 0.70;
  const sunR = w * 0.17;
  c.fillStyle = 'rgba(217, 38, 38, 0.05)';
  for (const [rf, a] of [[2.2, 0.05], [1.7, 0.06], [1.3, 0.08]]) {
    c.fillStyle = `rgba(217, 38, 38, ${a})`;
    c.beginPath();
    c.arc(sunX, sunY, sunR * rf, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#C71F24';
  c.beginPath();
  c.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  c.fill();
  // The katana, diagonal (handle low-left, tip high-right)
  c.save();
  c.translate(w * 0.5, h * 0.48);
  c.rotate(-0.55);
  const bladeLen = w * 1.05;
  const bladeW = w * 0.034;
  c.fillStyle = '#C2CCDB';
  c.strokeStyle = 'rgba(235, 242, 255, 0.9)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(-bladeLen * 0.18, -bladeW * 0.5);
  c.lineTo(bladeLen * 0.46, -bladeW * 0.30);
  c.quadraticCurveTo(bladeLen * 0.54, -bladeW * 0.18, bladeLen * 0.52, bladeW * 0.18);
  c.lineTo(-bladeLen * 0.18, bladeW * 0.5);
  c.closePath();
  c.fill();
  c.stroke();
  // Edge highlight along the cutting side
  c.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(-bladeLen * 0.18, bladeW * 0.46);
  c.lineTo(bladeLen * 0.50, bladeW * 0.16);
  c.stroke();
  // Hamon: soft wavy temper line
  c.strokeStyle = 'rgba(140, 158, 184, 0.6)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(-bladeLen * 0.18, bladeW * 0.10);
  let hx = -bladeLen * 0.18;
  let up = true;
  while (hx < bladeLen * 0.44) {
    const nx = hx + bladeLen * 0.07;
    c.quadraticCurveTo((hx + nx) / 2, bladeW * (up ? -0.06 : 0.26), nx, bladeW * 0.10);
    hx = nx;
    up = !up;
  }
  c.stroke();
  // Tsuba (guard): dark bronze disc
  c.fillStyle = '#47381A';
  c.strokeStyle = 'rgba(140, 115, 51, 0.9)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.ellipse(-bladeLen * 0.19, 0, bladeW * 0.55, bladeW * 1.3, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // Tsuka (handle): dark lacquer with gold diamond wrap
  const handleLen = bladeLen * 0.20;
  const handleX = -bladeLen * 0.19 - handleLen * 0.55;
  c.fillStyle = '#1A141A';
  c.strokeStyle = '#4D404D';
  c.beginPath();
  c.roundRect(handleX - handleLen / 2, -bladeW * 0.525, handleLen, bladeW * 1.05, bladeW * 0.4);
  c.fill();
  c.stroke();
  c.fillStyle = '#D1A840';
  for (let i = 0; i < 5; i += 1) {
    const dx = handleX - handleLen * 0.38 + i * handleLen * 0.19;
    const d = bladeW * 0.30;
    c.beginPath();
    c.moveTo(dx, -d);
    c.lineTo(dx + d, 0);
    c.lineTo(dx, d);
    c.lineTo(dx - d, 0);
    c.closePath();
    c.fill();
  }
  c.restore();
}

function paintDuel(c, w, h, m) {
  // Sunset bands over a dark field, two silhouettes facing off
  c.fillStyle = '#471721';
  c.fillRect(0, 0, w, h * 0.38);
  c.fillStyle = '#9E331F';
  c.fillRect(0, h * 0.38, w, h * 0.22);
  c.fillStyle = '#D96B29';
  c.fillRect(0, h * 0.60, w, h * 0.14);
  // Low sun with layered glow
  glow(c, w * 0.5, h * 0.67, w * 0.16, '255, 191, 102', 0.20, 4);
  c.fillStyle = '#FCD180';
  c.beginPath();
  c.arc(w * 0.5, h * 0.67, w * 0.12, 0, Math.PI * 2);
  c.fill();
  // Ground and grass blades
  c.fillStyle = '#211412';
  c.fillRect(0, h * 0.74, w, h * 0.26);
  c.strokeStyle = '#0F0A0A';
  c.lineWidth = 1.2;
  for (let gx = 6; gx < w; gx += 13) {
    const lean = ((Math.floor(gx) % 5) - 2) * 1.4;
    c.beginPath();
    c.moveTo(gx, h * 0.745);
    c.lineTo(gx + lean, h * 0.745 - 9 - (Math.floor(gx) % 7));
    c.stroke();
  }
  // Two ink samurai silhouettes
  const ink = '#0D0A0D';
  const samurai = (x, facing, bladeRaised) => {
    const baseY = h * 0.765;
    const s = w * 0.060;
    c.strokeStyle = ink;
    c.lineWidth = 6;
    c.lineCap = 'round';
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(x, baseY - s * 1.6);
      c.lineTo(x + side * s * 0.9, baseY);
      c.stroke();
    }
    c.fillStyle = ink;
    c.beginPath();
    c.roundRect(x - s * 0.75, baseY - s * 3.6, s * 1.5, s * 2.2, s * 0.6);
    c.fill();
    c.beginPath();
    c.arc(x + facing * s * 0.15, baseY - s * 4.0, s * 0.55, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(x - facing * s * 0.25, baseY - s * 4.55, s * 0.18, 0, Math.PI * 2);
    c.fill();
    const grip = bladeRaised
      ? [x + facing * s * 1.5, baseY - s * 3.5]
      : [x + facing * s * 1.4, baseY - s * 2.2];
    const tip = bladeRaised
      ? [x + facing * s * 3.2, baseY - s * 5.4]
      : [x + facing * s * 3.6, baseY - s * 1.4];
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(x + facing * s * 0.5, baseY - s * 3.1);
    c.lineTo(grip[0], grip[1]);
    c.stroke();
    c.strokeStyle = '#4D4752';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(grip[0], grip[1]);
    c.lineTo(tip[0], tip[1]);
    c.stroke();
  };
  samurai(w * 0.20, 1, true);
  samurai(w * 0.80, -1, false);
  // Drifting petals
  c.fillStyle = 'rgba(250, 168, 184, 0.9)';
  for (const [xf, yf, rot] of [[0.30, 0.45], [0.62, 0.52, 2.1], [0.45, 0.30, 1.2], [0.75, 0.40, 0.2], [0.15, 0.58, 2.8]]) {
    c.beginPath();
    c.ellipse(w * xf, h * yf, 4, 2.25, rot ?? 0.5, 0, Math.PI * 2);
    c.fill();
  }
}

function paintTeaRoom(c, w, h, m) {
  // Goban room floor: dark planks, shoji band, zabuton cushions
  c.fillStyle = '#614229';
  c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(0, 0, 0, 0.18)';
  for (let y = 0; y < h; y += 46) c.fillRect(0, y, w, 1.5);
  // Shoji screens across the top
  const shojiH = h * 0.24;
  c.fillStyle = '#EDE6D1';
  c.fillRect(0, 0, w, shojiH);
  const lattice = '#4D331F';
  c.fillStyle = lattice;
  for (let i = 0; i <= 8; i += 1) {
    const x = (w * i) / 8;
    c.fillRect(x - (i % 2 === 0 ? 2.5 : 1), 0, i % 2 === 0 ? 5 : 2, shojiH);
  }
  for (let i = 0; i <= 2; i += 1) {
    const thick = i === 0 || i === 2;
    c.fillRect(0, (shojiH * i) / 2 - (thick ? 2.5 : 1), w, thick ? 5 : 2);
  }
  // Zabuton cushions + tea cup near the bottom
  for (const xf of [0.26, 0.74]) {
    c.fillStyle = '#732E29';
    c.strokeStyle = 'rgba(153, 77, 64, 0.8)';
    c.lineWidth = 2;
    c.beginPath();
    c.ellipse(w * xf, h * 0.90, w * 0.15, h * 0.045, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }
  c.fillStyle = '#406659';
  c.strokeStyle = 'rgba(230, 230, 230, 0.5)';
  c.lineWidth = 1.5;
  c.beginPath();
  c.arc(w * 0.5, h * 0.82, 7, 0, Math.PI * 2);
  c.fill();
  c.stroke();
}

function paintVeranda(c, w, h, m) {
  // Goban on a veranda: warm planks, daytime garden across the top
  const rand = mulberry32(96);
  c.fillStyle = '#85613D';
  c.fillRect(0, 0, w, h);
  c.fillStyle = 'rgba(0, 0, 0, 0.16)';
  for (let y = 0; y < h; y += 40) c.fillRect(0, y, w, 1.5);
  // Garden view: sky, pond, moss bank
  const gardenH = h * 0.28;
  c.fillStyle = '#B8D6E0';
  c.fillRect(0, 0, w, gardenH);
  c.fillStyle = '#599E99';
  c.fillRect(0, gardenH * 0.70, w, gardenH * 0.30);
  c.fillStyle = '#73944D';
  c.fillRect(0, gardenH * 0.58, w, gardenH * 0.12);
  // Cherry tree, left
  const trunkX = w * 0.26;
  c.strokeStyle = '#4D3326';
  c.lineWidth = 7;
  c.beginPath();
  c.moveTo(trunkX, gardenH * 0.70);
  c.lineTo(trunkX - 8, gardenH * 0.44);
  c.stroke();
  c.fillStyle = '#F2B8C7';
  for (const [dx, dy, r] of [[-0.04, 0.34, 0.15], [0.06, 0.42, 0.12], [-0.14, 0.42, 0.12]]) {
    c.beginPath();
    c.arc(trunkX + w * dx, gardenH * dy, gardenH * r, 0, Math.PI * 2);
    c.fill();
  }
  // Stone lantern, right
  const lanternX = w * 0.78;
  const lanternBase = gardenH * 0.68;
  c.fillStyle = '#8C8C85';
  for (const [pw, ph, dy] of [[10, 16, 8], [22, 8, 20], [16, 12, 30], [26, 6, 39]]) {
    c.beginPath();
    c.roundRect(lanternX - pw / 2, lanternBase - dy - ph / 2, pw, ph, 2);
    c.fill();
  }
  c.fillStyle = 'rgba(255, 217, 128, 0.9)';
  c.beginPath();
  c.arc(lanternX, lanternBase - 30, 5, 0, Math.PI * 2);
  c.fill();
  // Fallen petals near the bottom edge
  c.fillStyle = 'rgba(242, 184, 199, 0.8)';
  for (let i = 0; i < 10; i += 1) {
    c.beginPath();
    c.ellipse(10 + rand() * (w - 20), h * (0.86 + rand() * 0.11), 3.5, 2, rand() * Math.PI, 0, Math.PI * 2);
    c.fill();
  }
}

export const FEUDALJAPAN_SCENES = [
  { key: 'sakuraDawn', name: 'Sakura Dawn', paint: paintSakuraDawn, light: true },
  { key: 'sakuraNight', name: 'Sakura Night', paint: paintSakuraNight },
  { key: 'mistyHills', name: 'Misty Hills', paint: paintMistyHills },
  { key: 'blossomStorm', name: 'Blossom Storm', paint: paintBlossomStorm },
  { key: 'snowfall', name: 'Snowfall', paint: paintSnowfall },
  { key: 'lanterns', name: 'Lanterns', paint: paintLanterns },
  { key: 'tatami', name: 'Tatami', paint: paintTatami, light: true },
  { key: 'dojo', name: 'Dojo', paint: paintDojo, light: true },
  { key: 'katana', name: 'Katana', paint: paintKatana },
  { key: 'duel', name: 'The Duel', paint: paintDuel },
  { key: 'teaRoom', name: 'Tea Room', paint: paintTeaRoom, light: true },
  { key: 'veranda', name: 'Veranda', paint: paintVeranda, light: true },
];
