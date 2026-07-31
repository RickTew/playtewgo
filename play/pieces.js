// Space figure pieces. Direct port of the four Space FigureKinds from
// PieceRenderer.swift (iOS repo): silhouette points, eye bands, and the
// exact PieceStyle palettes from ThemeRegistry.swift. Coordinates are in
// units of the figure radius r, y growing UP from the feet (flipped to
// canvas coordinates at draw time).

export const FIGURES = {
  robot: {
    name: 'Robot',
    primary: '#8594A9',
    stroke: '#C7E0FF',
    glowRgb: '51, 153, 255',
    accent: '#FF3830',
    points: [
      [0.55, 0.00], [0.55, 0.30], [0.42, 0.40], [0.42, 1.00], [0.50, 1.10],
      [0.50, 1.30], [0.85, 1.45], [0.85, 1.95], [0.55, 2.05], [0.55, 2.20],
      [0.65, 2.30], [0.65, 2.95], [0.10, 2.95], [0.10, 3.18], [-0.10, 3.18],
      [-0.10, 2.95], [-0.65, 2.95], [-0.65, 2.30], [-0.55, 2.20], [-0.55, 2.05],
      [-0.85, 1.95], [-0.85, 1.45], [-0.50, 1.30], [-0.50, 1.10], [-0.42, 1.00],
      [-0.42, 0.40], [-0.55, 0.30], [-0.55, 0.00],
    ],
  },
  astronaut: {
    name: 'Astronaut',
    primary: '#EBF0FA',
    stroke: '#668CD9',
    glowRgb: '140, 199, 255',
    accent: '#99D9FF',
    points: [
      [0.65, 0.00], [0.65, 0.55], [0.55, 1.15], [0.95, 1.40], [0.85, 1.85],
      [0.55, 2.05], [0.40, 2.20], [0.65, 2.40], [0.85, 2.75], [0.55, 3.05],
      [0.00, 3.18], [-0.55, 3.05], [-0.85, 2.75], [-0.65, 2.40], [-0.40, 2.20],
      [-0.55, 2.05], [-0.85, 1.85], [-0.95, 1.40], [-0.55, 1.15], [-0.65, 0.55],
      [-0.65, 0.00],
    ],
  },
  alien: {
    name: 'Alien',
    primary: '#1FB338',
    stroke: '#73FF80',
    glowRgb: '51, 255, 77',
    accent: '#8000D9',
    points: [
      [0.40, 0.00], [0.38, 0.50], [0.30, 1.05], [0.50, 1.30], [0.40, 1.65],
      [0.22, 1.85], [0.32, 2.10], [0.65, 2.35], [0.85, 2.65], [0.65, 3.00],
      [0.30, 3.18], [0.00, 3.22], [-0.30, 3.18], [-0.65, 3.00], [-0.85, 2.65],
      [-0.65, 2.35], [-0.32, 2.10], [-0.22, 1.85], [-0.40, 1.65], [-0.50, 1.30],
      [-0.30, 1.05], [-0.38, 0.50], [-0.40, 0.00],
    ],
  },
  ufo: {
    name: 'UFO',
    primary: '#8C99AD',
    stroke: '#D9EBFF',
    glowRgb: '77, 255, 140',
    accent: '#4DFF8C',
    points: [
      [0.96, 0.48], [1.04, 0.73], [0.91, 0.96], [0.57, 1.13], [0.48, 1.38],
      [0.26, 1.58], [0.00, 1.68], [-0.26, 1.58], [-0.48, 1.38], [-0.57, 1.13],
      [-0.91, 0.96], [-1.04, 0.73], [-0.96, 0.48], [-0.48, 0.36], [0.00, 0.30],
      [0.48, 0.36],
    ],
  },
  // ----- Ocean roster (ThemeRegistry.ocean palettes) -----
  pirate: {
    name: 'Pirate',
    primary: '#4D332E',
    stroke: '#D93333',
    glowRgb: '242, 102, 77',
    accent: '#FFF2D9',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [0.85, 1.30], [0.55, 1.75],
      [0.45, 2.00], [0.55, 2.20], [0.55, 2.55], [1.00, 2.78], [0.65, 2.95],
      [0.45, 3.18], [0.20, 3.05], [0.00, 3.22], [-0.20, 3.05], [-0.45, 3.18],
      [-0.65, 2.95], [-1.00, 2.78], [-0.55, 2.55], [-0.55, 2.20], [-0.45, 2.00],
      [-0.55, 1.75], [-0.85, 1.30], [-0.50, 1.10], [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  mermaid: {
    name: 'Mermaid',
    primary: '#33A6B3',
    stroke: '#FF8C8C',
    glowRgb: '140, 242, 255',
    accent: '#FFF2D9',
    points: [
      [0.95, 0.00], [0.45, 0.30], [0.60, 0.65], [0.40, 1.10], [0.55, 1.50],
      [0.40, 1.85], [0.85, 2.10], [0.50, 2.35], [0.40, 2.55], [0.55, 2.75],
      [0.85, 2.95], [0.50, 3.05], [0.00, 3.18], [-0.50, 3.05], [-0.85, 2.95],
      [-0.55, 2.75], [-0.40, 2.55], [-0.50, 2.35], [-0.85, 2.10], [-0.40, 1.85],
      [-0.55, 1.50], [-0.40, 1.10], [-0.60, 0.65], [-0.45, 0.30], [-0.95, 0.00],
    ],
  },
  fish: {
    name: 'Fish',
    primary: '#F28C33',
    stroke: '#A64D14',
    glowRgb: '255, 191, 89',
    accent: '#1A1A1F',
    points: [
      [0.85, 0.00], [0.30, 0.40], [0.45, 0.90], [0.65, 1.50], [0.55, 2.10],
      [0.70, 2.45], [0.55, 2.85], [0.30, 3.10], [0.00, 3.18], [-0.30, 3.10],
      [-0.55, 2.85], [-0.70, 2.45], [-0.55, 2.10], [-0.65, 1.50], [-0.45, 0.90],
      [-0.30, 0.40], [-0.85, 0.00],
    ],
  },
  kraken: {
    name: 'Kraken',
    primary: '#521A66',
    stroke: '#BF4D8C',
    glowRgb: '217, 51, 166',
    accent: '#FFD933',
    points: [
      [0.55, 0.00], [0.85, 0.18], [0.78, 0.45], [0.55, 0.65], [0.95, 3.00],
      [0.55, 1.80], [0.30, 3.20], [0.00, 2.00], [-0.30, 3.20], [-0.55, 1.80],
      [-0.95, 3.00], [-0.55, 0.65], [-0.78, 0.45], [-0.85, 0.18], [-0.55, 0.00],
    ],
  },
  shark: {
    name: 'Shark',
    primary: '#667A8C',
    stroke: '#33404D',
    glowRgb: '166, 199, 235',
    accent: '#F2F2F2',
    points: [
      [0.85, 0.00], [0.30, 0.40], [0.40, 0.85], [0.60, 1.40], [0.95, 1.85],
      [0.55, 2.05], [0.55, 2.45], [0.65, 2.75], [0.40, 3.00], [0.10, 2.85],
      [0.05, 3.20], [-0.05, 3.20], [-0.10, 2.85], [-0.40, 3.00], [-0.65, 2.75],
      [-0.55, 2.45], [-0.55, 2.05], [-0.95, 1.85], [-0.60, 1.40], [-0.40, 0.85],
      [-0.30, 0.40], [-0.85, 0.00],
    ],
  },
  frog: {
    name: 'Frog',
    primary: '#4DB34D',
    stroke: '#1F6626',
    glowRgb: '140, 242, 115',
    accent: '#FFE64D',
    points: [
      [0.85, 0.00], [0.60, 0.40], [0.50, 0.85], [0.75, 1.35], [0.95, 1.85],
      [0.85, 2.30], [0.75, 2.65], [0.85, 3.00], [0.30, 2.85], [0.00, 2.78],
      [-0.30, 2.85], [-0.85, 3.00], [-0.75, 2.65], [-0.85, 2.30], [-0.95, 1.85],
      [-0.75, 1.35], [-0.50, 0.85], [-0.60, 0.40], [-0.85, 0.00],
    ],
  },
};

export const FIGURE_KINDS = Object.keys(FIGURES);

/** Height of a figure in r units (feet at 0). */
export function figureHeight(kind) {
  return Math.max(...FIGURES[kind].points.map((p) => p[1]));
}

function tracePath(ctx, points, cx, feetY, r) {
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    const px = cx + x * r;
    const py = feetY - y * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
}

function roundedRect(ctx, cx, cy, w, h, radius) {
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, radius);
}

// Eye bands from PieceRenderer.makeEyeBand, same geometry per kind.
function drawEyeBand(ctx, kind, cx, feetY, r, accent) {
  const at = (y) => feetY - y * r;
  if (kind === 'robot') {
    ctx.fillStyle = 'rgba(255, 56, 48, 0.30)';
    roundedRect(ctx, cx, at(2.45), r * 0.85, r * 0.25, r * 0.08);
    ctx.fill();
    ctx.fillStyle = accent;
    roundedRect(ctx, cx, at(2.45), r * 0.65, r * 0.10, r * 0.03);
    ctx.fill();
  } else if (kind === 'alien') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx, at(2.45), r * 0.425, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx, at(2.45), r * 0.08, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'astronaut') {
    ctx.fillStyle = 'rgba(26, 26, 26, 1)';
    roundedRect(ctx, cx, at(2.65), r * 0.85, r * 0.42, r * 0.18);
    ctx.fill();
    ctx.fillStyle = accent;
    roundedRect(ctx, cx + r * 0.18, at(2.78), r * 0.20, r * 0.08, r * 0.03);
    ctx.fill();
  } else if (kind === 'ufo') {
    ctx.fillStyle = accent;
    for (const dx of [-0.48, -0.17, 0.17, 0.48]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(0.73), r * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(77, 255, 140, 0.30)';
    ctx.beginPath();
    ctx.ellipse(cx, at(1.53), r * 0.29, r * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'pirate') {
    // One eye, dark patch over the other, strap across the face
    ctx.fillStyle = '#0d0d0d';
    roundedRect(ctx, cx, at(2.40), r * 0.55, r * 0.04, r * 0.01);
    ctx.fill();
    roundedRect(ctx, cx - r * 0.14, at(2.40), r * 0.22, r * 0.16, r * 0.04);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx + r * 0.14, at(2.40), r * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'kraken') {
    // Eyes peek out of the head bulb at the BOTTOM, looking up
    for (const dx of [-0.22, 0.22]) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(0.30), r * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(0.30), r * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'mermaid') {
    ctx.fillStyle = accent;
    for (const dx of [-0.13, 0.13]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.45), r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'shark') {
    // Single side eye + tooth row
    ctx.fillStyle = '#0d0d0d';
    ctx.beginPath();
    ctx.arc(cx - r * 0.30, at(2.65), r * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    roundedRect(ctx, cx, at(2.20), r * 0.55, r * 0.08, r * 0.02);
    ctx.fill();
  } else if (kind === 'fish') {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx + r * 0.18, at(2.65), r * 0.10, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'frog') {
    // Two large bulging eyes, wide-set on the dome top
    for (const dx of [-0.45, 0.45]) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Builds the silhouette path only (for the Chip variant's logo). */
export function traceFigure(ctx, kind, cx, feetY, r) {
  const f = FIGURES[kind];
  if (f) tracePath(ctx, f.points, cx, feetY, r);
}

/**
 * Draws a figure standing with its feet at (cx, feetY), scaled by figure
 * radius r (a figure is ~3.2r tall). Mirrors the iOS classic finish:
 * soft glow silhouette behind, solid body with stroke, then the eye band.
 */
export function drawFigure(ctx, kind, cx, feetY, r, alpha = 1) {
  const f = FIGURES[kind];
  if (!f) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Glow silhouette (iOS: glowColor at 20%, scaled 1.10 from the feet)
  ctx.fillStyle = `rgba(${f.glowRgb}, 0.25)`;
  tracePath(ctx, f.points, cx, feetY, r * 1.1);
  ctx.fill();

  // Body
  ctx.fillStyle = f.primary;
  ctx.strokeStyle = f.stroke;
  ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.lineJoin = 'round';
  tracePath(ctx, f.points, cx, feetY, r);
  ctx.fill();
  ctx.stroke();

  drawEyeBand(ctx, kind, cx, feetY, r, f.accent);
  ctx.restore();
}
