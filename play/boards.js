// Board surface materials, echoing BoardPanelStyle on iOS: 7 universal
// materials plus per-theme boards. Slab interiors stay CLEAN (soft tone
// patches only, nothing that fights the grid).

import { mulberry32 } from './space.js';

export const UNIVERSAL_BOARDS = [
  { key: 'none', name: 'None' },
  { key: 'stone', name: 'Stone' },
  { key: 'wood', name: 'Wood' },
  { key: 'glass', name: 'Glass' },
  { key: 'marble', name: 'Marble', light: true },
  { key: 'greenFelt', name: 'Green Felt' },
  { key: 'parchment', name: 'Parchment', light: true },
];

export const THEME_BOARDS = {
  space: [
    { key: 'deckPlate', name: 'Deck Plate' },
    { key: 'planetRock', name: 'Planet Rock' },
    { key: 'holoPanel', name: 'Holo Panel' },
    { key: 'starMap', name: 'Star Map' },
  ],
  ocean: [
    { key: 'deckHatch', name: 'Deck Hatch' },
    { key: 'seabedSand', name: 'Seabed Sand', light: true },
    { key: 'seaChart', name: 'Sea Chart', light: true },
    { key: 'driftwood', name: 'Driftwood' },
  ],
};

export function boardsForTheme(theme) {
  return [...UNIVERSAL_BOARDS, ...(THEME_BOARDS[theme] ?? [])];
}

export function boardByKey(key) {
  const all = [...UNIVERSAL_BOARDS, ...Object.values(THEME_BOARDS).flat()];
  return all.find((b) => b.key === key);
}

function tonePatches(c, x, y, w, h, rand, rgb, count = 5, alpha = 0.08) {
  for (let i = 0; i < count; i += 1) {
    const px = x + rand() * w;
    const py = y + rand() * h;
    const r = Math.min(w, h) * (0.15 + rand() * 0.25);
    const g = c.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    c.fillStyle = g;
    c.fillRect(x, y, w, h);
  }
}

// Corner hardware (deck brackets, chart clips, nails) - corners only,
// interiors stay clean
function cornerDots(c, x, y, w, h, inset, radius, fill, stroke) {
  for (const [px, py] of [[x + inset, y + inset], [x + w - inset, y + inset],
    [x + inset, y + h - inset], [x + w - inset, y + h - inset]]) {
    c.fillStyle = fill;
    c.beginPath();
    c.arc(px, py, radius, 0, Math.PI * 2);
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = 1;
      c.stroke();
    }
  }
}

function slab(c, x, y, w, h, fill, stroke) {
  c.fillStyle = fill;
  c.beginPath();
  c.roundRect(x, y, w, h, 10);
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1.5;
    c.stroke();
  }
}

/** Paints a board material into the given rect. 'none' paints nothing. */
export function paintBoardRect(c, key, x, y, w, h) {
  if (!key || key === 'none') return;
  const rand = mulberry32(9000 + key.length * 7 + key.charCodeAt(0));
  c.save();
  c.beginPath();
  c.roundRect(x, y, w, h, 10);
  c.clip();

  switch (key) {
    case 'stone':
      slab(c, x, y, w, h, '#697077', '#4a5058');
      tonePatches(c, x, y, w, h, rand, '255, 255, 255', 4, 0.06);
      tonePatches(c, x, y, w, h, rand, '20, 24, 30', 4, 0.10);
      break;
    case 'wood':
      slab(c, x, y, w, h, '#7a5230', '#5a3a20');
      tonePatches(c, x, y, w, h, rand, '255, 200, 120', 4, 0.08);
      tonePatches(c, x, y, w, h, rand, '40, 20, 8', 5, 0.10);
      break;
    case 'glass':
      slab(c, x, y, w, h, 'rgba(170, 205, 255, 0.16)', 'rgba(205, 230, 255, 0.45)');
      tonePatches(c, x, y, w, h, rand, '255, 255, 255', 3, 0.10);
      break;
    case 'marble':
      slab(c, x, y, w, h, '#e9e7e1', '#c9c5bc');
      tonePatches(c, x, y, w, h, rand, '150, 150, 160', 5, 0.08);
      tonePatches(c, x, y, w, h, rand, '255, 255, 255', 3, 0.15);
      break;
    case 'greenFelt':
      slab(c, x, y, w, h, '#1d5a37', '#123c24');
      tonePatches(c, x, y, w, h, rand, '0, 20, 8', 5, 0.12);
      break;
    case 'parchment':
      slab(c, x, y, w, h, '#e7d6b0', '#c4b088');
      tonePatches(c, x, y, w, h, rand, '160, 120, 60', 5, 0.08);
      break;
    case 'deckPlate':
      slab(c, x, y, w, h, '#3a4048', '#20242a');
      tonePatches(c, x, y, w, h, rand, '140, 170, 210', 4, 0.07);
      tonePatches(c, x, y, w, h, rand, '10, 12, 16', 4, 0.12);
      break;
    case 'planetRock':
      slab(c, x, y, w, h, '#6b4a3a', '#4a3226');
      tonePatches(c, x, y, w, h, rand, '230, 140, 90', 4, 0.09);
      tonePatches(c, x, y, w, h, rand, '30, 16, 10', 5, 0.12);
      break;
    case 'holoPanel': {
      slab(c, x, y, w, h, 'rgba(60, 190, 230, 0.13)', 'rgba(90, 220, 255, 0.55)');
      tonePatches(c, x, y, w, h, rand, '120, 230, 255', 3, 0.08);
      const sheen = c.createLinearGradient(x, y, x + w, y + h);
      sheen.addColorStop(0, 'rgba(180, 240, 255, 0.10)');
      sheen.addColorStop(0.5, 'rgba(180, 240, 255, 0)');
      sheen.addColorStop(1, 'rgba(180, 240, 255, 0.06)');
      c.fillStyle = sheen;
      c.fillRect(x, y, w, h);
      break;
    }
    case 'deckHatch':
      slab(c, x, y, w, h, '#856645', '#C7A86B');
      tonePatches(c, x, y, w, h, rand, '0, 0, 0', 5, 0.12);
      cornerDots(c, x, y, w, h, Math.min(12, w * 0.08), Math.min(4, w * 0.03), '#4D525C');
      break;
    case 'seabedSand':
      slab(c, x, y, w, h, '#BDAD80', '#7A7052');
      tonePatches(c, x, y, w, h, rand, '158, 143, 97', 5, 0.25);
      break;
    case 'seaChart':
      slab(c, x, y, w, h, '#E0D9B8', '#736647');
      tonePatches(c, x, y, w, h, rand, '179, 158, 107', 4, 0.12);
      tonePatches(c, x, y, w, h, rand, '64, 102, 140', 4, 0.08);
      cornerDots(c, x, y, w, h, Math.min(9, w * 0.07), Math.min(4.5, w * 0.035), '#BF9E4D', '#73591F');
      break;
    case 'driftwood':
      slab(c, x, y, w, h, '#8C8273', '#4D473D');
      tonePatches(c, x, y, w, h, rand, '107, 99, 87', 5, 0.22);
      cornerDots(c, x, y, w, h, Math.min(10, w * 0.07), Math.min(3, w * 0.025), '#664D38', '#38291A');
      break;
    case 'starMap': {
      slab(c, x, y, w, h, '#0f1730', '#2a3a66');
      tonePatches(c, x, y, w, h, rand, '60, 90, 180', 4, 0.10);
      c.fillStyle = 'rgba(200, 220, 255, 0.18)';
      for (let i = 0; i < 24; i += 1) {
        c.beginPath();
        c.arc(x + rand() * w, y + rand() * h, 0.8 + rand(), 0, Math.PI * 2);
        c.fill();
      }
      break;
    }
    default:
      break;
  }
  c.restore();
}
