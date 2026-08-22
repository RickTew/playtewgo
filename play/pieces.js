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
      [0.55, 2.05],
      // A ROUND helmet, the same dome his chip wears. The old one flared to
      // 0.85 with hard shoulders and read as a hood, which is why his tall
      // and his chip looked like two different characters.
      [0.34, 2.20], [0.62, 2.38], [0.76, 2.64], [0.72, 2.92], [0.50, 3.12],
      [0.22, 3.22], [0.00, 3.24], [-0.22, 3.22], [-0.50, 3.12], [-0.72, 2.92],
      [-0.76, 2.64], [-0.62, 2.38], [-0.34, 2.20],
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
      // The SAME saucer the chip wears, at figure proportions: blunt rims
      // and a domed cockpit. The tall craft used to be a different shape
      // entirely, so the two variants read as two different vehicles.
      [1.02, 0.62], [0.96, 0.80], [0.60, 0.94], [0.46, 1.22], [0.22, 1.52],
      [0.00, 1.60], [-0.22, 1.52], [-0.46, 1.22], [-0.60, 0.94], [-0.96, 0.80],
      [-1.02, 0.62], [-0.90, 0.46], [-0.50, 0.36], [0.00, 0.32], [0.50, 0.36],
      [0.90, 0.46],
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
  // ----- Feudal Japan roster (ThemeRegistry.feudalJapan palettes) -----
  ninja: {
    name: 'Ninja',
    primary: '#0D0D14',
    stroke: '#4D4D61',
    glowRgb: '51, 102, 179',
    accent: '#F23333',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.20], [0.85, 1.45], [0.55, 1.75],
      [0.50, 2.40], [0.25, 2.95], [0.00, 3.20], [-0.25, 2.95], [-0.50, 2.40],
      [-0.55, 1.75], [-0.85, 1.45], [-0.50, 1.20], [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  geisha: {
    name: 'Geisha',
    primary: '#F2EBE0',
    stroke: '#C72E4D',
    glowRgb: '255, 140, 166',
    accent: '#C72E4D',
    points: [
      [0.85, 0.00], [0.65, 0.55], [0.50, 1.05], [0.65, 1.40], [0.45, 1.70],
      [0.40, 2.00], [0.30, 2.18], [0.45, 2.35], [0.45, 2.65], [0.30, 2.78],
      [0.18, 2.92], [0.00, 2.82], [-0.18, 2.92], [-0.30, 2.78], [-0.45, 2.65],
      [-0.45, 2.35], [-0.30, 2.18], [-0.40, 2.00], [-0.45, 1.70], [-0.65, 1.40],
      [-0.50, 1.05], [-0.65, 0.55], [-0.85, 0.00],
    ],
  },
  samurai: {
    name: 'Samurai',
    primary: '#9E1A1A',
    stroke: '#FFC74D',
    glowRgb: '255, 166, 38',
    accent: '#FFEB80',
    points: [
      [0.65, 0.00], [0.65, 0.55], [0.55, 1.05], [1.00, 1.30], [0.95, 1.65],
      [0.55, 1.85], [0.50, 2.40], [0.95, 2.55], [1.20, 3.00], [0.70, 2.85],
      [0.35, 2.95], [0.00, 3.05], [-0.35, 2.95], [-0.70, 2.85], [-1.20, 3.00],
      [-0.95, 2.55], [-0.50, 2.40], [-0.55, 1.85], [-0.95, 1.65], [-1.00, 1.30],
      [-0.55, 1.05], [-0.65, 0.55], [-0.65, 0.00],
    ],
  },
  daimyo: {
    name: 'Daimyo',
    primary: '#2E1A33',
    stroke: '#FFCC4D',
    glowRgb: '255, 199, 77',
    accent: '#FFD966',
    points: [
      [0.75, 0.00], [0.85, 0.50], [0.70, 1.05], [1.10, 1.30], [1.00, 1.65],
      [0.55, 1.85], [0.50, 2.30], [0.95, 2.55], [1.20, 2.85], [0.55, 2.85],
      [0.20, 3.20], [0.00, 3.05], [-0.20, 3.20], [-0.55, 2.85], [-1.20, 2.85],
      [-0.95, 2.55], [-0.50, 2.30], [-0.55, 1.85], [-1.00, 1.65], [-1.10, 1.30],
      [-0.70, 1.05], [-0.85, 0.50], [-0.75, 0.00],
    ],
  },
  // ----- Dungeon roster (ThemeRegistry.dungeon palettes) -----
  dragon: {
    name: 'Dragon',
    primary: '#9E140F',
    stroke: '#FF6114',
    glowRgb: '255, 56, 0',
    accent: '#FFD933',
    points: [
      [0.55, 0.00], [0.60, 0.50], [0.65, 1.10], [1.00, 1.35], [0.95, 1.70],
      [0.55, 1.90], [0.60, 2.30], [0.85, 2.55], [1.10, 2.95], [0.55, 2.80],
      [0.30, 2.95], [0.00, 3.05], [-0.30, 2.95], [-0.55, 2.80], [-1.10, 2.95],
      [-0.85, 2.55], [-0.60, 2.30], [-0.55, 1.90], [-0.95, 1.70], [-1.00, 1.35],
      [-0.65, 1.10], [-0.60, 0.50], [-0.55, 0.00],
    ],
  },
  wizard: {
    name: 'Wizard',
    primary: '#33268C',
    stroke: '#FFD133',
    glowRgb: '166, 115, 255',
    accent: '#FFD94D',
    points: [
      [0.85, 0.00], [0.55, 0.55], [0.50, 1.10], [0.75, 1.40], [0.55, 1.75],
      [0.50, 2.10], [0.45, 2.40], [0.40, 2.55], [0.55, 2.65], [0.30, 2.85],
      [0.00, 3.20], [-0.30, 2.85], [-0.55, 2.65], [-0.40, 2.55], [-0.45, 2.40],
      [-0.50, 2.10], [-0.55, 1.75], [-0.75, 1.40], [-0.50, 1.10], [-0.55, 0.55],
      [-0.85, 0.00],
    ],
  },
  knight: {
    name: 'Knight',
    primary: '#8599AD',
    stroke: '#D9EBFF',
    glowRgb: '140, 184, 255',
    accent: '#E6F5FF',
    points: [
      [0.65, 0.00], [0.70, 0.55], [0.55, 1.05], [1.00, 1.30], [0.85, 1.65],
      [0.55, 1.90], [0.55, 2.25], [0.65, 2.65], [0.50, 3.00], [0.00, 3.18],
      [-0.50, 3.00], [-0.65, 2.65], [-0.55, 2.25], [-0.55, 1.90], [-0.85, 1.65],
      [-1.00, 1.30], [-0.55, 1.05], [-0.70, 0.55], [-0.65, 0.00],
    ],
  },
  goblin: {
    name: 'Goblin',
    primary: '#4D8C33',
    stroke: '#8C4D1A',
    glowRgb: '140, 217, 77',
    accent: '#FFD933',
    points: [
      [0.55, 0.00], [0.55, 0.40], [0.60, 0.90], [0.95, 1.10], [0.70, 1.45],
      [0.45, 1.65], [0.55, 1.85], [0.55, 2.20], [0.95, 2.55], [0.40, 2.45],
      [0.00, 2.55], [-0.40, 2.45], [-0.95, 2.55], [-0.55, 2.20], [-0.55, 1.85],
      [-0.45, 1.65], [-0.70, 1.45], [-0.95, 1.10], [-0.60, 0.90], [-0.55, 0.40],
      [-0.55, 0.00],
    ],
  },
  // ----- Undead roster (ThemeRegistry.undead palettes) -----
  zombie: {
    name: 'Zombie',
    primary: '#738C6B',
    stroke: '#B3C7A6',
    glowRgb: '140, 179, 128',
    accent: '#D93333',
    points: [
      [0.55, 0.00], [0.50, 0.50], [0.55, 1.15], [0.85, 1.40], [0.65, 1.75],
      [0.85, 1.95], [0.55, 2.10], [0.55, 2.55], [0.45, 2.85], [0.35, 3.10],
      [0.10, 2.95], [-0.05, 3.05], [-0.20, 2.95], [-0.35, 3.10], [-0.45, 2.85],
      [-0.55, 2.55], [-0.55, 2.10], [-0.85, 1.95], [-0.65, 1.75], [-0.85, 1.40],
      [-0.55, 1.15], [-0.50, 0.50], [-0.55, 0.00],
    ],
  },
  skeleton: {
    name: 'Skeleton',
    primary: '#EBE6D1',
    stroke: '#66594D',
    glowRgb: '191, 217, 166',
    accent: '#66FF80',
    points: [
      [0.45, 0.00], [0.42, 0.50], [0.40, 1.05], [0.65, 1.30], [0.70, 1.65],
      [0.45, 1.95], [0.30, 2.20], [0.42, 2.45], [0.55, 2.75], [0.45, 3.10],
      [0.00, 3.20], [-0.45, 3.10], [-0.55, 2.75], [-0.42, 2.45], [-0.30, 2.20],
      [-0.45, 1.95], [-0.70, 1.65], [-0.65, 1.30], [-0.40, 1.05], [-0.42, 0.50],
      [-0.45, 0.00],
    ],
  },
  ghost: {
    name: 'Ghost',
    primary: '#EBEBF5',
    stroke: '#FFFFFF',
    glowRgb: '217, 230, 255',
    accent: '#8C33D9',
    points: [
      [0.85, 0.00], [0.55, 0.10], [0.85, 0.20], [0.85, 1.80], [0.75, 2.40],
      [0.55, 2.95], [0.30, 3.15], [0.00, 3.20], [-0.30, 3.15], [-0.55, 2.95],
      [-0.75, 2.40], [-0.85, 1.80], [-0.85, 0.20], [-0.55, 0.10], [-0.85, 0.00],
    ],
  },
  vampire: {
    name: 'Vampire',
    primary: '#1A0F1F',
    stroke: '#C71A2E',
    glowRgb: '217, 51, 77',
    accent: '#FF3333',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [1.05, 1.40], [0.85, 1.85],
      [1.10, 2.20], [0.55, 2.30], [0.50, 2.55], [0.45, 2.85], [0.10, 3.05],
      [0.00, 3.20], [-0.10, 3.05], [-0.45, 2.85], [-0.50, 2.55], [-0.55, 2.30],
      [-1.10, 2.20], [-0.85, 1.85], [-1.05, 1.40], [-0.50, 1.10], [-0.55, 0.50],
      [-0.55, 0.00],
    ],
  },
  // ----- Western roster (ThemeRegistry.western palettes) -----
  cowboy: {
    name: 'Cowboy',
    primary: '#D9B373',
    stroke: '#8C6633',
    glowRgb: '242, 204, 102',
    accent: '#331A0D',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [0.85, 1.30], [0.55, 1.75],
      [0.50, 2.05], [0.55, 2.20], [0.55, 2.55], [1.05, 2.78], [0.55, 2.85],
      [0.45, 3.10], [0.00, 3.15], [-0.45, 3.10], [-0.55, 2.85], [-1.05, 2.78],
      [-0.55, 2.55], [-0.55, 2.20], [-0.50, 2.05], [-0.55, 1.75], [-0.85, 1.30],
      [-0.50, 1.10], [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  sheriff: {
    name: 'Sheriff',
    primary: '#4D668C',
    stroke: '#F2D14D',
    glowRgb: '217, 235, 255',
    accent: '#FFD94D',
    points: [
      [0.65, 0.00], [0.65, 0.50], [0.55, 1.15], [0.85, 1.35], [0.55, 1.75],
      [0.50, 2.05], [0.55, 2.20], [0.55, 2.55], [1.10, 2.78], [0.55, 2.85],
      [0.40, 3.05], [0.15, 3.05], [0.00, 3.20], [-0.15, 3.05], [-0.40, 3.05],
      [-0.55, 2.85], [-1.10, 2.78], [-0.55, 2.55], [-0.55, 2.20], [-0.50, 2.05],
      [-0.55, 1.75], [-0.85, 1.35], [-0.55, 1.15], [-0.65, 0.50], [-0.65, 0.00],
    ],
  },
  outlaw: {
    name: 'Outlaw',
    primary: '#4D2E26',
    stroke: '#A63333',
    glowRgb: '217, 77, 51',
    accent: '#D93333',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [0.85, 1.30], [0.55, 1.75],
      [0.50, 2.05], [0.55, 2.20], [0.55, 2.55], [0.95, 2.65], [0.55, 2.95],
      [0.30, 3.18], [0.00, 3.10], [-0.30, 3.18], [-0.55, 2.95], [-0.95, 2.65],
      [-0.55, 2.55], [-0.55, 2.20], [-0.50, 2.05], [-0.55, 1.75], [-0.85, 1.30],
      [-0.50, 1.10], [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  bandit: {
    name: 'Bandit',
    primary: '#734D33',
    stroke: '#D94D33',
    glowRgb: '242, 140, 51',
    accent: '#D94D33',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [0.80, 1.30], [0.55, 1.75],
      [0.50, 2.05], [0.55, 2.20], [0.55, 2.55], [1.00, 2.65], [0.55, 2.85],
      [0.30, 3.05], [0.00, 3.10], [-0.30, 3.05], [-0.55, 2.85], [-1.00, 2.65],
      [-0.55, 2.55], [-0.55, 2.20], [-0.50, 2.05], [-0.55, 1.75], [-0.80, 1.30],
      [-0.50, 1.10], [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  // ----- Desert roster (ThemeRegistry.desert palettes) -----
  pharaoh: {
    name: 'Pharaoh',
    primary: '#F2C733',
    stroke: '#332666',
    glowRgb: '255, 217, 77',
    accent: '#1A1A66',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [0.95, 1.30], [0.85, 1.65],
      [0.55, 1.90], [0.55, 2.20], [0.85, 2.40], [1.05, 2.65], [0.90, 2.95],
      [0.55, 3.10], [0.20, 3.18], [0.00, 3.20], [-0.20, 3.18], [-0.55, 3.10],
      [-0.90, 2.95], [-1.05, 2.65], [-0.85, 2.40], [-0.55, 2.20], [-0.55, 1.90],
      [-0.85, 1.65], [-0.95, 1.30], [-0.50, 1.10], [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  anubis: {
    name: 'Anubis',
    primary: '#1A141F',
    stroke: '#F2C733',
    glowRgb: '255, 217, 77',
    accent: '#FFD94D',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [0.95, 1.30], [0.85, 1.65],
      [0.55, 1.85], [0.45, 2.10], [0.55, 2.30], [0.65, 2.55], [0.45, 2.75],
      [0.55, 2.95], [0.40, 3.20], [0.10, 2.95], [0.00, 3.10], [-0.10, 2.95],
      [-0.40, 3.20], [-0.55, 2.95], [-0.45, 2.75], [-0.65, 2.55], [-0.55, 2.30],
      [-0.45, 2.10], [-0.55, 1.85], [-0.85, 1.65], [-0.95, 1.30], [-0.50, 1.10],
      [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  snake: {
    name: 'Snake',
    primary: '#8CA640',
    stroke: '#4D611A',
    glowRgb: '204, 230, 102',
    accent: '#F24D33',
    points: [
      [0.50, 0.00], [0.85, 0.30], [0.55, 0.60], [0.70, 0.95], [0.40, 1.25],
      [0.55, 1.60], [0.35, 1.95], [0.40, 2.20], [0.95, 2.55], [0.65, 2.95],
      [0.30, 3.10], [0.00, 3.20], [-0.30, 3.10], [-0.65, 2.95], [-0.95, 2.55],
      [-0.40, 2.20], [-0.35, 1.95], [-0.55, 1.60], [-0.40, 1.25], [-0.70, 0.95],
      [-0.55, 0.60], [-0.85, 0.30], [-0.50, 0.00],
    ],
  },
  mummy: {
    name: 'Mummy',
    primary: '#D9C7A6',
    stroke: '#735933',
    glowRgb: '217, 166, 115',
    accent: '#D93333',
    points: [
      [0.55, 0.00], [0.55, 0.50], [0.50, 1.10], [0.75, 1.30], [0.55, 1.75],
      [0.50, 2.05], [0.55, 2.25], [0.55, 2.85], [0.40, 3.10], [0.00, 3.18],
      [-0.40, 3.10], [-0.55, 2.85], [-0.55, 2.25], [-0.50, 2.05], [-0.55, 1.75],
      [-0.75, 1.30], [-0.50, 1.10], [-0.55, 0.50], [-0.55, 0.00],
    ],
  },
  scarab: {
    name: 'Scarab',
    primary: '#33668C',
    stroke: '#4DA673',
    glowRgb: '102, 242, 217',
    accent: '#F2C733',
    points: [
      [0.95, 0.10], [0.65, 0.30], [1.10, 0.55], [0.95, 0.85], [1.20, 1.20],
      [1.10, 1.65], [1.20, 1.95], [0.85, 2.15], [0.65, 2.40], [0.45, 2.70],
      [0.20, 2.95], [0.10, 3.10], [0.00, 3.00], [-0.10, 3.10], [-0.20, 2.95],
      [-0.45, 2.70], [-0.65, 2.40], [-0.85, 2.15], [-1.20, 1.95], [-1.10, 1.65],
      [-1.20, 1.20], [-0.95, 0.85], [-1.10, 0.55], [-0.65, 0.30], [-0.95, 0.10],
    ],
  },
  turtle: {
    name: 'Turtle',
    primary: '#739966',
    stroke: '#8C6638',
    glowRgb: '179, 230, 140',
    accent: '#1A1F1A',
    points: [
      [0.95, 0.00], [0.95, 0.40], [0.85, 1.10], [0.65, 1.80], [0.40, 2.20],
      [0.35, 2.40], [0.45, 2.65], [0.30, 2.95], [0.00, 3.05], [-0.30, 2.95],
      [-0.45, 2.65], [-0.35, 2.40], [-0.40, 2.20], [-0.65, 1.80], [-0.85, 1.10],
      [-0.95, 0.40], [-0.95, 0.00],
    ],
  },
};

// Classic roster: eight material variants sharing five shapes (pawn, stone,
// rook, meeple, die, hourglass). `band` names the eye-band/detail shape when
// it differs from the entry key.
const PAWN_POINTS = [
  [0.85, 0.00], [0.85, 0.25], [0.55, 0.45], [0.45, 0.80], [0.35, 1.40],
  [0.30, 1.95], [0.50, 2.10], [0.30, 2.30], [0.50, 2.55], [0.55, 2.85],
  [0.40, 3.10], [0.00, 3.18], [-0.40, 3.10], [-0.55, 2.85], [-0.50, 2.55],
  [-0.30, 2.30], [-0.50, 2.10], [-0.30, 1.95], [-0.35, 1.40], [-0.45, 0.80],
  [-0.55, 0.45], [-0.85, 0.25], [-0.85, 0.00],
];
const STONE_POINTS = [
  [0.95, 0.00], [0.95, 0.20], [0.85, 0.45], [0.60, 0.70], [0.30, 0.85],
  [0.00, 0.90], [-0.30, 0.85], [-0.60, 0.70], [-0.85, 0.45], [-0.95, 0.20],
  [-0.95, 0.00],
];
const ROOK_POINTS = [
  [0.85, 0.00], [0.85, 0.25], [0.55, 0.45], [0.48, 1.00], [0.45, 2.10],
  [0.62, 2.30], [0.62, 3.05], [0.36, 3.05], [0.36, 2.72], [0.13, 2.72],
  [0.13, 3.05], [-0.13, 3.05], [-0.13, 2.72], [-0.36, 2.72], [-0.36, 3.05],
  [-0.62, 3.05], [-0.62, 2.30], [-0.45, 2.10], [-0.48, 1.00], [-0.55, 0.45],
  [-0.85, 0.25], [-0.85, 0.00],
];
const MEEPLE_POINTS = [
  [0.80, 0.00], [0.80, 0.40], [0.52, 0.85], [0.95, 1.30], [0.88, 1.72],
  [0.42, 1.80], [0.50, 2.10], [0.42, 2.55], [0.00, 2.75], [-0.42, 2.55],
  [-0.50, 2.10], [-0.42, 1.80], [-0.88, 1.72], [-0.95, 1.30], [-0.52, 0.85],
  [-0.80, 0.40], [-0.80, 0.00], [-0.30, 0.00], [0.00, 0.45], [0.30, 0.00],
];
const DICE_POINTS = [
  [0.62, 0.00], [0.80, 0.18], [0.85, 0.50], [0.85, 1.20], [0.80, 1.52],
  [0.62, 1.70], [-0.62, 1.70], [-0.80, 1.52], [-0.85, 1.20], [-0.85, 0.50],
  [-0.80, 0.18], [-0.62, 0.00],
];
const HOURGLASS_POINTS = [
  [0.80, 0.00], [0.80, 0.20], [0.62, 0.32], [0.16, 1.22], [0.16, 1.42],
  [0.62, 2.32], [0.80, 2.44], [0.80, 2.64], [-0.80, 2.64], [-0.80, 2.44],
  [-0.62, 2.32], [-0.16, 1.42], [-0.16, 1.22], [-0.62, 0.32], [-0.80, 0.20],
  [-0.80, 0.00],
];

Object.assign(FIGURES, {
  onyxPawn: {
    name: 'Onyx Pawn', primary: '#1A1A1A', stroke: '#737373',
    glowRgb: '64, 64, 64', accent: '#737373', points: PAWN_POINTS,
  },
  onyxStone: {
    name: 'Onyx Stone', primary: '#14141A', stroke: '#4D4D52',
    glowRgb: '51, 51, 56', accent: '#4D4D52', points: STONE_POINTS,
  },
  onyxRook: {
    name: 'Onyx Rook', primary: '#1F1F24', stroke: '#7A7A80',
    glowRgb: '71, 71, 77', accent: '#7A7A80', points: ROOK_POINTS,
  },
  walnutMeeple: {
    name: 'Walnut Meeple', primary: '#6B401F', stroke: '#AD7A47',
    glowRgb: '140, 89, 46', accent: '#AD7A47', points: MEEPLE_POINTS,
  },
  ivoryPawn: {
    name: 'Ivory Pawn', primary: '#F2F2EB', stroke: '#8C8C85',
    glowRgb: '217, 217, 209', accent: '#8C8C85', points: PAWN_POINTS,
  },
  ivoryStone: {
    name: 'Ivory Stone', primary: '#F7F5EB', stroke: '#9E998C',
    glowRgb: '235, 235, 224', accent: '#9E998C', points: STONE_POINTS,
  },
  ivoryDie: {
    name: 'Ivory Die', primary: '#F5F2E6', stroke: '#8C8A80',
    glowRgb: '230, 230, 219', accent: '#8C8A80', band: 'dice', points: DICE_POINTS,
  },
  brassHourglass: {
    name: 'Brass Hourglass', primary: '#B88C40', stroke: '#EBC773',
    glowRgb: '217, 173, 82', accent: '#EBC773', band: 'hourglass', points: HOURGLASS_POINTS,
  },
});

export const FIGURE_KINDS = Object.keys(FIGURES);

/** Height of a figure in r units (feet at 0). */
export function figureHeight(kind) {
  return Math.max(...FIGURES[kind].points.map((p) => p[1]));
}

// ----- Color schemes (PieceColorScheme.swift) -----
// Recolor whichever piece a side plays: primary per side, stroke lightened
// 45%, glow = primary, themed accent preserved. Gold is rare: earned at
// 10 wins per theme (engine/progression.js), locked in the picker until then.

export const COLOR_SCHEMES = [
  { key: 'original', name: 'Original' },
  { key: 'emerald', name: 'Emerald', one: '#2EB866', two: '#387AF5' },
  { key: 'crimson', name: 'Crimson', one: '#DB3838', two: '#F2BD33' },
  { key: 'violet', name: 'Violet', one: '#9452DB', two: '#1FB8B3' },
  { key: 'magma', name: 'Magma', one: '#F27529', two: '#4DCCF2' },
  { key: 'rose', name: 'Rose', one: '#F575A8', two: '#75DBA8' },
  { key: 'onyx', name: 'Onyx', one: '#383D4D', two: '#EBE6D6' },
  { key: 'ivory', name: 'Ivory', one: '#EBE6D6', two: '#383D4D' },
  { key: 'slate', name: 'Slate', one: '#6B7585', two: '#CCCFD6' },
  { key: 'noir', name: 'Noir', one: '#0F0F12', two: '#FAFAF7' },
  { key: 'midnight', name: 'Midnight', one: '#212B61', two: '#7A1F29' },
  { key: 'forest', name: 'Forest', one: '#1A5733', two: '#734D21' },
  { key: 'gold', name: 'Gold', one: '#FCC224', two: '#DBE3ED', rare: true },
];

function hexChannels(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 0xff, n & 0xff];
}

/** Lighten (f > 0, toward white) or darken (f < 0, toward black) a hex color. */
export function shadeHex(hex, f) {
  const ch = hexChannels(hex).map((v) => {
    const nv = f >= 0 ? v + (255 - v) * f : v * (1 + f);
    return Math.round(Math.min(255, Math.max(0, nv)));
  });
  return `#${ch.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export function hexToRgbStr(hex) {
  return hexChannels(hex).join(', ');
}

/**
 * Effective palette for a side: the figure's roster colors under 'original',
 * otherwise the scheme pair color per side with derived stroke/glow.
 */
export function paletteFor(kind, sideIndex, schemeKey) {
  const f = FIGURES[kind];
  const scheme = COLOR_SCHEMES.find((s) => s.key === schemeKey);
  if (!scheme || !scheme.one) return f;
  const primary = sideIndex === 0 ? scheme.one : scheme.two;
  return {
    primary,
    stroke: shadeHex(primary, 0.45),
    glowRgb: hexToRgbStr(primary),
    accent: f.accent,
  };
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
    // The same big round WINDOW his chip wears, sized to the helmet dome,
    // so the tall figure and the chip are one character rather than two.
    ctx.fillStyle = 'rgba(26, 26, 26, 1)';
    ctx.beginPath();
    ctx.ellipse(cx, at(2.68), r * 0.51, r * 0.40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.20, at(2.86), r * 0.15, r * 0.10, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'ufo') {
    ctx.fillStyle = accent;
    for (const dx of [-0.48, -0.17, 0.17, 0.48]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(0.80), r * 0.07, 0, Math.PI * 2);
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
  } else if (kind === 'ninja') {
    // Glowing eye slit through the hood wrap
    ctx.fillStyle = 'rgba(242, 51, 51, 0.30)';
    roundedRect(ctx, cx, at(2.30), r * 0.70, r * 0.22, r * 0.08);
    ctx.fill();
    ctx.fillStyle = accent;
    roundedRect(ctx, cx, at(2.30), r * 0.55, r * 0.10, r * 0.04);
    ctx.fill();
  } else if (kind === 'samurai') {
    // Dark menpo face guard with two bright eyes
    ctx.fillStyle = '#1a1a1a';
    roundedRect(ctx, cx, at(2.10), r * 0.55, r * 0.45, r * 0.10);
    ctx.fill();
    ctx.fillStyle = accent;
    for (const dx of [-0.13, 0.13]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.15), r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'geisha') {
    // Delicate eyes + small red lip
    ctx.fillStyle = '#0d0d0d';
    for (const dx of [-0.13, 0.13]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx, at(2.35), r * 0.05, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'daimyo') {
    // Dark face with stern slits
    ctx.fillStyle = '#1a1a1a';
    roundedRect(ctx, cx, at(2.10), r * 0.55, r * 0.45, r * 0.10);
    ctx.fill();
    ctx.fillStyle = accent;
    for (const dx of [-0.14, 0.14]) {
      roundedRect(ctx, cx + dx * r, at(2.15), r * 0.13, r * 0.05, r * 0.02);
      ctx.fill();
    }
  } else if (kind === 'dragon') {
    // Twin glowing eyes under the brow ridge
    for (const dx of [-0.22, 0.22]) {
      ctx.fillStyle = 'rgba(255, 217, 51, 0.30)';
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'knight') {
    // Horizontal helmet visor slit
    ctx.fillStyle = '#0d0d0d';
    roundedRect(ctx, cx, at(2.55), r * 0.55, r * 0.10, r * 0.04);
    ctx.fill();
  } else if (kind === 'wizard') {
    // Eyes peeking under hat brim + long beard tuft
    ctx.fillStyle = accent;
    for (const dx of [-0.12, 0.12]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.45), r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(240, 240, 240, 0.95)';
    ctx.beginPath();
    ctx.ellipse(cx, at(2.05), r * 0.30, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'goblin') {
    // Wide staring eyes with bright pupils + thin grin
    for (const dx of [-0.18, 0.18]) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.50), r * 0.10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.50), r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#0d0d0d';
    roundedRect(ctx, cx, at(2.20), r * 0.30, r * 0.05, r * 0.01);
    ctx.fill();
  } else if (kind === 'zombie') {
    // Two hollow dark eye sockets
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    for (const dx of [-0.15, 0.15]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.40), r * 0.10, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'skeleton') {
    // Hollow eye sockets + nasal hole + grin
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    for (const dx of [-0.18, 0.18]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, at(2.30), r * 0.05, 0, Math.PI * 2);
    ctx.fill();
    roundedRect(ctx, cx, at(2.05), r * 0.40, r * 0.05, r * 0.01);
    ctx.fill();
  } else if (kind === 'ghost') {
    // Two glowing dot eyes
    for (const dx of [-0.18, 0.18]) {
      ctx.fillStyle = 'rgba(140, 51, 217, 0.35)';
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'vampire') {
    // Sharp red eyes + tiny fang glint
    ctx.fillStyle = accent;
    for (const dx of [-0.14, 0.14]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - r * 0.03, at(2.25), r * 0.06, r * 0.10);
  } else if (kind === 'cowboy') {
    // Two visible eyes under the hat brim
    ctx.fillStyle = accent;
    for (const dx of [-0.13, 0.13]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.45), r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'sheriff') {
    // Squinted eyes + gold star badge on the duster
    ctx.fillStyle = accent;
    for (const dx of [-0.13, 0.13]) {
      roundedRect(ctx, cx + dx * r, at(2.45), r * 0.12, r * 0.04, r * 0.01);
      ctx.fill();
    }
    ctx.strokeStyle = '#0d0d0d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, at(1.55), r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (kind === 'outlaw' || kind === 'bandit') {
    // Bandana over the lower face + dark eyes above it
    ctx.fillStyle = accent;
    roundedRect(ctx, cx, at(2.20), r * 0.85, r * (kind === 'bandit' ? 0.32 : 0.30), r * 0.06);
    ctx.fill();
    ctx.fillStyle = '#0d0d0d';
    for (const dx of [-0.13, 0.13]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(kind === 'bandit' ? 2.60 : 2.55), r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'pharaoh') {
    // Two eye dots beneath the nemes
    ctx.fillStyle = accent;
    for (const dx of [-0.14, 0.14]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.45), r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'anubis') {
    // Glowing eyes + black nose at muzzle tip
    ctx.fillStyle = accent;
    for (const dx of [-0.15, 0.15]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.50), r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#0d0d0d';
    ctx.beginPath();
    ctx.arc(cx, at(2.05), r * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'snake') {
    // Vertical slit pupils
    ctx.fillStyle = accent;
    for (const dx of [-0.18, 0.18]) {
      roundedRect(ctx, cx + dx * r, at(2.55), r * 0.05, r * 0.18, r * 0.02);
      ctx.fill();
    }
  } else if (kind === 'mummy') {
    // Bandage gap revealing glowing eyes
    ctx.fillStyle = 'rgba(13, 13, 13, 0.85)';
    roundedRect(ctx, cx, at(2.55), r * 0.65, r * 0.16, r * 0.05);
    ctx.fill();
    ctx.fillStyle = accent;
    for (const dx of [-0.14, 0.14]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'scarab') {
    // Center carapace seam + two black dot eyes near the top
    ctx.fillStyle = 'rgba(13, 13, 13, 0.85)';
    ctx.fillRect(cx - r * 0.03, at(2.50), r * 0.06, r * 2.0);
    for (const dx of [-0.45, 0.45]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'turtle') {
    // Small dot eyes high on the small head
    ctx.fillStyle = accent;
    for (const dx of [-0.10, 0.10]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(2.55), r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'dice') {
    // FIVE, in the quincunx. Rick, 2026-08-22: "maybe the numbers should be 2
    // or 5 ;) considering..." - TEW is 2 and GO is 5, so the die is not a
    // neutral prop, it can say the name. Five over two because the quincunx
    // is the face people picture when they picture a die, and it stays
    // symmetric at 14px where a diagonal three read as a smear.
    // If the tall ever becomes two dice stacked, that pair is 2 and 5.
    ctx.fillStyle = '#0d0d0d';
    for (const [dx, dy] of [[-0.42, 1.22], [0.42, 1.22], [0, 0.85], [-0.42, 0.48], [0.42, 0.48]]) {
      ctx.beginPath();
      ctx.arc(cx + dx * r, at(dy), r * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'hourglass') {
    // Sand: small pile in the lower bulb + falling trickle
    ctx.fillStyle = '#EDD48C';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.45, at(0.30));
    ctx.lineTo(cx + r * 0.45, at(0.30));
    ctx.lineTo(cx, at(0.75));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(237, 212, 140, 0.9)';
    ctx.fillRect(cx - r * 0.03, at(1.62), r * 0.06, r * 0.85);
  }
}

/** Builds the silhouette path only (for the Chip variant's logo). */
/**
 * Compact HEAD silhouettes for the chip and flat discs, a direct data port of
 * PieceRenderer.chipHeadPath. Rick, 2026-08-21: "You are trying to put the
 * whole body of the character on a small disc. We do not do it like that for
 * the chips and discs." He is right: at board scale a whole figure reads as a
 * keyhole, while a head reads as a face.
 *
 * Coordinates are in units of the chip radius and Y IS ALREADY FLIPPED for
 * canvas (SpriteKit points up, canvas points down), so nothing downstream has
 * to remember which way is up. Generated from the Swift, not redrawn, so the
 * two platforms cannot drift by eye.
 */
export const CHIP_HEADS = {
  alien: [[0.3,0.32],[0.5,0.1],[0.55,-0.18],[0.4,-0.4],[0,-0.5],[-0.4,-0.4],[-0.55,-0.18],[-0.5,0.1],[-0.3,0.32]],
  anubis: [[0.36,0.32],[0.5,-0.05],[0.55,-0.3],[0.42,-0.55],[0.2,-0.32],[0,-0.4],[-0.2,-0.32],[-0.42,-0.55],[-0.55,-0.3],[-0.5,-0.05],[-0.36,0.32]],
  astronaut: [[0.45,0.32],[0.5,-0.1],[0.38,-0.38],[0.2,-0.5],[0,-0.54],[-0.2,-0.5],[-0.38,-0.38],[-0.5,-0.1],[-0.45,0.32]],
  bandit: [[0.32,0.32],[0.46,0.05],[0.78,-0.08],[0.55,-0.32],[0.2,-0.42],[0,-0.4],[-0.2,-0.42],[-0.55,-0.32],[-0.78,-0.08],[-0.46,0.05],[-0.32,0.32]],
  cowboy: [[0.3,0.32],[0.42,0.05],[0.85,-0.1],[0.55,-0.2],[0.45,-0.42],[0.2,-0.5],[0,-0.48],[-0.2,-0.5],[-0.45,-0.42],[-0.55,-0.2],[-0.85,-0.1],[-0.42,0.05],[-0.3,0.32]],
  daimyo: [[0.42,0.32],[0.5,-0.05],[0.85,-0.2],[0.5,-0.36],[0.18,-0.32],[0,-0.55],[-0.18,-0.32],[-0.5,-0.36],[-0.85,-0.2],[-0.5,-0.05],[-0.42,0.32]],
  // A die is square. The ported path bevelled only the TOP two corners and
  // left the bottom two sharp, and that asymmetry is what read as a cut
  // corner rather than as a bevel (Rick, 2026-08-22: "the dice top on the
  // right do not need to be cut"). Same bevel on all four now.
  dice: [[0.4,0.28],[0.4,-0.28],[0.28,-0.4],[-0.28,-0.4],[-0.4,-0.28],[-0.4,0.28],[-0.28,0.4],[0.28,0.4]],
  dragon: [[0.45,0.32],[0.5,-0.1],[0.65,-0.22],[0.78,-0.48],[0.42,-0.34],[0.18,-0.42],[0,-0.36],[-0.18,-0.42],[-0.42,-0.34],[-0.78,-0.48],[-0.65,-0.22],[-0.5,-0.1],[-0.45,0.32]],
  fish: [[0.45,0.32],[0.42,-0.2],[0.2,-0.42],[0,-0.5],[-0.2,-0.42],[-0.42,-0.2],[-0.45,0.32]],
  frog: [[0.45,0.32],[0.58,-0.02],[0.56,-0.26],[0.46,-0.44],[0.3,-0.52],[0.16,-0.44],[0.1,-0.28],[0,-0.24],[-0.1,-0.28],[-0.16,-0.44],[-0.3,-0.52],[-0.46,-0.44],[-0.56,-0.26],[-0.58,-0.02],[-0.45,0.32]],
  geisha: [[0.38,0.32],[0.42,-0.05],[0.3,-0.2],[0.2,-0.5],[0,-0.55],[-0.2,-0.5],[-0.3,-0.2],[-0.42,-0.05],[-0.38,0.32]],
  ghost: [[0.45,0.32],[0.48,-0.1],[0.36,-0.36],[0,-0.5],[-0.36,-0.36],[-0.48,-0.1],[-0.45,0.32]],
  goblin: [[0.36,0.32],[0.4,-0.1],[0.65,-0.45],[0.3,-0.32],[0,-0.42],[-0.3,-0.32],[-0.65,-0.45],[-0.4,-0.1],[-0.36,0.32]],
  hourglass: [[0.4,0.32],[0.4,0.2],[0.08,-0.06],[0.08,-0.14],[0.4,-0.4],[0.4,-0.5],[-0.4,-0.5],[-0.4,-0.4],[-0.08,-0.14],[-0.08,-0.06],[-0.4,0.2],[-0.4,0.32]],
  knight: [[0.38,0.32],[0.5,0.1],[0.5,-0.2],[0.38,-0.42],[0,-0.5],[-0.38,-0.42],[-0.5,-0.2],[-0.5,0.1],[-0.38,0.32]],
  kraken: [[0.4,0.32],[0.62,0.18],[0.5,0.02],[0.6,-0.5],[0.32,-0.2],[0.2,-0.55],[0,-0.25],[-0.2,-0.55],[-0.32,-0.2],[-0.6,-0.5],[-0.5,0.02],[-0.62,0.18],[-0.4,0.32]],
  meeple: [[0.45,0.32],[0.5,0.05],[0.28,-0.1],[0.3,-0.28],[0.16,-0.45],[0,-0.5],[-0.16,-0.45],[-0.3,-0.28],[-0.28,-0.1],[-0.5,0.05],[-0.45,0.32]],
  mermaid: [[0.36,0.32],[0.55,-0],[0.7,-0.3],[0.4,-0.42],[0,-0.5],[-0.4,-0.42],[-0.7,-0.3],[-0.55,-0],[-0.36,0.32]],
  mummy: [[0.42,0.32],[0.46,-0.05],[0.32,-0.32],[0,-0.45],[-0.32,-0.32],[-0.46,-0.05],[-0.42,0.32]],
  ninja: [[0.42,0.32],[0.44,-0.07],[0.26,-0.33],[0,-0.5],[-0.26,-0.33],[-0.44,-0.07],[-0.42,0.32]],
  outlaw: [[0.32,0.32],[0.46,0.05],[0.75,-0.05],[0.55,-0.3],[0.3,-0.45],[0,-0.42],[-0.3,-0.45],[-0.55,-0.3],[-0.75,-0.05],[-0.46,0.05],[-0.32,0.32]],
  pawn: [[0.3,0.32],[0.42,0.1],[0.2,-0.05],[0.42,-0.2],[0.3,-0.42],[0,-0.5],[-0.3,-0.42],[-0.42,-0.2],[-0.2,-0.05],[-0.42,0.1],[-0.3,0.32]],
  pharaoh: [[0.3,0.32],[0.42,0.05],[0.8,-0.18],[0.55,-0.42],[0.2,-0.5],[0,-0.5],[-0.2,-0.5],[-0.55,-0.42],[-0.8,-0.18],[-0.42,0.05],[-0.3,0.32]],
  pirate: [[0.32,0.32],[0.42,0.05],[0.85,-0.1],[0.55,-0.28],[0.4,-0.5],[0.2,-0.42],[0,-0.52],[-0.2,-0.42],[-0.4,-0.5],[-0.55,-0.28],[-0.85,-0.1],[-0.42,0.05],[-0.32,0.32]],
  robot: [[0.42,0.32],[0.42,-0.3],[0.1,-0.3],[0.1,-0.48],[-0.1,-0.48],[-0.1,-0.3],[-0.42,-0.3],[-0.42,0.32]],
  rook: [[0.4,0.32],[0.4,-0.18],[0.42,-0.5],[0.24,-0.5],[0.24,-0.3],[0.08,-0.3],[0.08,-0.5],[-0.08,-0.5],[-0.08,-0.3],[-0.24,-0.3],[-0.24,-0.5],[-0.42,-0.5],[-0.4,-0.18],[-0.4,0.32]],
  samurai: [[0.39,0.32],[0.44,-0.07],[0.71,-0.23],[0.8,-0.5],[0.39,-0.4],[0,-0.45],[-0.39,-0.4],[-0.8,-0.5],[-0.71,-0.23],[-0.44,-0.07],[-0.39,0.32]],
  scarab: [[0.85,0.32],[0.9,-0],[0.7,-0.32],[0.3,-0.45],[0,-0.48],[-0.3,-0.45],[-0.7,-0.32],[-0.9,-0],[-0.85,0.32]],
  shark: [[0.5,0.32],[0.45,-0.18],[0.2,-0.42],[0.1,-0.55],[-0.1,-0.55],[-0.2,-0.42],[-0.45,-0.18],[-0.5,0.32]],
  sheriff: [[0.32,0.32],[0.42,0.05],[0.85,-0.1],[0.55,-0.22],[0.42,-0.42],[0.1,-0.42],[0,-0.55],[-0.1,-0.42],[-0.42,-0.42],[-0.55,-0.22],[-0.85,-0.1],[-0.42,0.05],[-0.32,0.32]],
  skeleton: [[0.3,0.32],[0.42,0.05],[0.5,-0.2],[0.36,-0.42],[0,-0.5],[-0.36,-0.42],[-0.5,-0.2],[-0.42,0.05],[-0.3,0.32]],
  snake: [[0.2,0.32],[0.32,-0],[0.62,-0.2],[0.45,-0.42],[0.18,-0.5],[0,-0.42],[-0.18,-0.5],[-0.45,-0.42],[-0.62,-0.2],[-0.32,-0],[-0.2,0.32]],
  stone: [[0.55,0.32],[0.55,-0],[0.42,-0.3],[0,-0.45],[-0.42,-0.3],[-0.55,-0],[-0.55,0.32]],
  turtle: [[0.5,0.32],[0.44,-0.05],[0.32,-0.2],[0.18,-0.4],[0,-0.46],[-0.18,-0.4],[-0.32,-0.2],[-0.44,-0.05],[-0.5,0.32]],
  ufo: [[0.74,0.08],[0.7,-0.02],[0.44,-0.1],[0.34,-0.28],[0.16,-0.44],[0,-0.48],[-0.16,-0.44],[-0.34,-0.28],[-0.44,-0.1],[-0.7,-0.02],[-0.74,0.08],[-0.66,0.18],[-0.4,0.26],[0,0.32],[0.4,0.26],[0.66,0.18]],
  vampire: [[0.42,0.32],[0.46,-0.1],[0.3,-0.32],[0.1,-0.3],[0,-0.5],[-0.1,-0.3],[-0.3,-0.32],[-0.46,-0.1],[-0.42,0.32]],
  wizard: [[0.45,0.32],[0.5,-0],[0.3,-0.2],[0,-0.58],[-0.3,-0.2],[-0.5,-0],[-0.45,0.32]],
  zombie: [[0.42,0.32],[0.46,-0.12],[0.3,-0.4],[0.42,-0.45],[0.1,-0.5],[-0.05,-0.42],[-0.2,-0.5],[-0.42,-0.45],[-0.3,-0.4],[-0.46,-0.12],[-0.42,0.32]],
};

/** Classic names its figures by material; iOS names the SHAPE they share. */
const CHIP_HEAD_ALIAS = {
  onyxPawn: 'pawn', ivoryPawn: 'pawn',
  onyxStone: 'stone', ivoryStone: 'stone',
  onyxRook: 'rook', walnutMeeple: 'meeple',
  ivoryDie: 'dice', brassHourglass: 'hourglass',
};

/** Traces the head for `kind` centred on (cx, cy), scaled by r. Returns false
 *  when there is no head for that kind so callers can fall back rather than
 *  draw nothing. */
export function traceChipHead(ctx, kind, cx, cy, r) {
  const pts = CHIP_HEADS[CHIP_HEAD_ALIAS[kind] ?? kind];
  if (!pts || pts.length < 3) return false;
  ctx.beginPath();
  ctx.moveTo(cx + pts[0][0] * r, cy + pts[0][1] * r);
  for (let i = 1; i < pts.length; i += 1) {
    ctx.lineTo(cx + pts[i][0] * r, cy + pts[i][1] * r);
  }
  ctx.closePath();
  return true;
}

/**
 * The eye overlay that sits on top of the chip head, ported from
 * PieceRenderer.makeChipEyeOverlay. Without it a head is a dark blob: the
 * eyes are the whole reason a silhouette reads as a face at board size.
 *
 * Each entry is [x, y, shape, colour] in chip-radius units with Y ALREADY
 * FLIPPED for canvas. shape is ["c", r] | ["r", w, h, cornerRadius] |
 * ["e", w, h], all centred on their own x/y the way SpriteKit measures them.
 * colour is ["a", alpha] accent, ["w", alpha] white, or ["g", white, alpha].
 * Generated from the Swift rather than redrawn.
 */
export const CHIP_EYES = {
  alien: [[0,-0.22,['e',0.55,0.22],['w',1]],[0,-0.22,['c',0.06],['a',1]]],
  anubis: [[-0.14,0.05,["c",0.04],["a",1]],[0.14,0.05,["c",0.04],["a",1]],[0,-0.3,["c",0.04],["g",0.05,1.0]]],
  astronaut: [[0,-0.1,['e',0.72,0.56],['g',0.1,1]],[-0.14,-0.22,['e',0.22,0.14],['a',0.9]]],
  bandit: [[0,0.12,["r",0.55,0.15,0.04],["a",1]],[-0.13,-0.05,["c",0.04],["g",0.05,1.0]],[0.13,-0.05,["c",0.04],["g",0.05,1.0]]],
  cowboy: [[-0.13,0.05,["c",0.05],["a",1]],[0.13,0.05,["c",0.05],["a",1]]],
  daimyo: [[-0.14,-0,["r",0.13,0.05,0.02],["a",1]],[0.14,-0,["r",0.13,0.05,0.02],["a",1]]],
  dice: [[-0.2,-0.2,["c",0.065],["a",1]],[0.2,-0.2,["c",0.065],["a",1]],[0,0,["c",0.065],["a",1]],[-0.2,0.2,["c",0.065],["a",1]],[0.2,0.2,["c",0.065],["a",1]]],
  dragon: [[-0.13,-0.08,["c",0.1],["a",0.35]],[0.13,-0.08,["c",0.1],["a",0.35]],[-0.13,-0.08,["c",0.05],["a",1]],[0.13,-0.08,["c",0.05],["a",1]]],
  fish: [[0.2,-0.18,['c',0.07],['a',1]],[-0.22,0.08,['u',0.1892],['w',0.4]],[0.0,0.08,['u',0.1892],['w',0.4]],[0.22,0.08,['u',0.1892],['w',0.4]],[-0.33,0.22,['u',0.1892],['w',0.4]],[-0.11,0.22,['u',0.1892],['w',0.4]],[0.11,0.22,['u',0.1892],['w',0.4]],[0.33,0.22,['u',0.1892],['w',0.4]]],
  frog: [[-0.3,-0.38,['c',0.1],['a',1]],[-0.3,-0.38,['c',0.045],['g',0.05,1]],[0.3,-0.38,['c',0.1],['a',1]],[0.3,-0.38,['c',0.045],['g',0.05,1]]],
  geisha: [[-0.12,-0.02,["c",0.04],["g",0.05,1.0]],[0.12,-0.02,["c",0.04],["g",0.05,1.0]],[0,0.1,["c",0.03],["a",1]]],
  ghost: [[-0.13,-0.1,["c",0.06],["a",1]],[0.13,-0.1,["c",0.06],["a",1]]],
  goblin: [[-0.16,-0.05,["c",0.06],["a",1]],[0.16,-0.05,["c",0.06],["a",1]]],
  knight: [[0,-0.1,["r",0.42,0.07,0.02],["a",1]]],
  kraken: [[-0.18,0.2,["c",0.1],["w",1]],[0.18,0.2,["c",0.1],["w",1]],[-0.18,0.2,["c",0.05],["a",1]],[0.18,0.2,["c",0.05],["a",1]]],
  mermaid: [[-0.12,-0.02,['c',0.05],['a',1]],[0.12,-0.02,['c',0.05],['a',1]]],
  mummy: [[0,-0.02,["r",0.5,0.13,0.03],["g",0.1,0.85]],[-0.13,-0.02,["c",0.04],["a",1]],[0.13,-0.02,["c",0.04],["a",1]]],
  ninja: [[0,-0.07,["r",0.4,0.08,0.04],["a",1]]],
  outlaw: [[0,0.14,["r",0.55,0.18,0.04],["a",1]],[-0.13,-0.05,["c",0.04],["g",0.05,1.0]],[0.13,-0.05,["c",0.04],["g",0.05,1.0]]],
  pharaoh: [[-0.13,0.05,["c",0.05],["a",1]],[0.13,0.05,["c",0.05],["a",1]]],
  pirate: [[0.13,0.05,['c',0.05],['a',1]],[-0.16,0.04,['r',0.3,0.24,0.05],['g',0.04,1]]],
  robot: [[0,-0.05,["r",0.42,0.07,0.02],["a",1]]],
  samurai: [[-0.13,0.02,["c",0.06],["a",1]],[0.13,0.02,["c",0.06],["a",1]]],
  scarab: [[0,-0.05,["r",0.04,0.65,0],["g",0.05,0.85]],[-0.3,-0.2,["c",0.05],["g",0.05,1.0]],[0.3,-0.2,["c",0.05],["g",0.05,1.0]]],
  shark: [[-0.19,-0.14,['c',0.065],['g',0.04,1]],[0.19,-0.14,['c',0.065],['g',0.04,1]],[-0.19,0.1,['t',0.16,0.2],['g',0.97,0.95]],[0,0.1,['t',0.16,0.2],['g',0.97,0.95]],[0.19,0.1,['t',0.16,0.2],['g',0.97,0.95]]],
  sheriff: [[-0.13,0.05,["r",0.12,0.04,0.01],["a",1]],[0.13,0.05,["r",0.12,0.04,0.01],["a",1]]],
  skeleton: [[-0.16,-0.05,["c",0.07],["g",0.0,0.85]],[0.16,-0.05,["c",0.07],["g",0.0,0.85]],[0,0.05,["c",0.03],["g",0.0,0.85]]],
  snake: [[-0.16,-0.1,["r",0.04,0.13,0.01],["a",1]],[0.16,-0.1,["r",0.04,0.13,0.01],["a",1]]],
  turtle: [[-0.1,-0.2,["c",0.05],["a",1]],[0.1,-0.2,["c",0.05],["a",1]]],
  ufo: [[-0.3,-0,["c",0.045],["a",1]],[-0.1,-0,["c",0.045],["a",1]],[0.1,-0,["c",0.045],["a",1]],[0.3,-0,["c",0.045],["a",1]]],
  vampire: [[-0.13,-0.02,["c",0.05],["a",1]],[0.13,-0.02,["c",0.05],["a",1]]],
  wizard: [[-0.11,0.05,["c",0.04],["a",1]],[0.11,0.05,["c",0.04],["a",1]],[0,0.2,["c",0.1],["g",0.92,0.9]]],
  zombie: [[-0.16,-0.05,["c",0.07],["g",0.0,0.7]],[0.16,-0.05,["c",0.07],["g",0.0,0.7]]],
};

function chipEyeColour(c, accent) {
  if (c[0] === 'a') return c[1] >= 1 ? accent : `rgba(${hexToRgbStr(accent)}, ${c[1]})`;
  if (c[0] === 'w') return `rgba(255, 255, 255, ${c[1]})`;
  const v = Math.round(c[1] * 255);
  return `rgba(${v}, ${v}, ${v}, ${c[2]})`;
}

/** Paints the eyes for `kind` over a head centred on (cx, cy) at scale r. */
export function drawChipEyes(ctx, kind, cx, cy, r, accent) {
  const list = CHIP_EYES[CHIP_HEAD_ALIAS[kind] ?? kind];
  if (!list) return;
  for (const [x, y, shape, col, stroke] of list) {
    const px = cx + x * r;
    const py = cy + y * r;
    ctx.fillStyle = chipEyeColour(col, accent);
    if (shape[0] === 'u') {
      // Scale: a shallow arc opening upward, STROKED not filled. Rows of
      // these read as scales at board size where individual plates mush.
      const half = (shape[1] * r) / 2;
      ctx.save();
      ctx.strokeStyle = chipEyeColour(col, accent);
      ctx.lineWidth = Math.max(0.5, r * 0.018);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px - half, py);
      ctx.quadraticCurveTo(px, py + half * 1.6, px + half, py);
      ctx.stroke();
      ctx.restore();
      continue;
    }
    ctx.beginPath();
    if (shape[0] === 'c') {
      ctx.arc(px, py, shape[1] * r, 0, Math.PI * 2);
    } else if (shape[0] === 'e') {
      ctx.ellipse(px, py, (shape[1] * r) / 2, (shape[2] * r) / 2, 0, 0, Math.PI * 2);
    } else if (shape[0] === 't') {
      // Tooth: a triangle pointing down from the jaw line.
      const hw = (shape[1] * r) / 2;
      ctx.moveTo(px - hw, py);
      ctx.lineTo(px + hw, py);
      ctx.lineTo(px, py + shape[2] * r);
      ctx.closePath();
    } else {
      const w = shape[1] * r;
      const h = shape[2] * r;
      // shape[4] is an optional rotation in radians, for the pirate's strap.
      if (shape[4]) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(shape[4]);
        ctx.roundRect(-w / 2, -h / 2, w, h, Math.max(0, shape[3] * r));
        ctx.fill();
        if (stroke) {
          ctx.strokeStyle = chipEyeColour(stroke, accent);
          ctx.lineWidth = Math.max(0.8, r * 0.055);
          ctx.stroke();
        }
        ctx.restore();
        continue;
      }
      ctx.roundRect(px - w / 2, py - h / 2, w, h, Math.max(0, shape[3] * r));
    }
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = chipEyeColour(stroke, accent);
      ctx.lineWidth = Math.max(0.8, r * 0.055);
      ctx.stroke();
    }
  }
}

/**
 * One chip, drawn exactly as the board draws it. Lives here rather than in
 * game.js so the piece lab page and the game cannot drift: there is one
 * implementation and both call it.
 *
 * f is a palette ({primary, stroke, accent}); radius is the BOARD radius,
 * and the chip sizes itself from that the way iOS does.
 */
/**
 * How big the head sits on its chip.
 *
 * NOT a cap, and NOT a per-kind fit. Every head is scaled so its OUTERMOST
 * POINT lands on ONE target for the variant: 0.98 for Flat (just inside the
 * rim) and 1.15 for Chip (deliberately breaching it). Small heads are scaled
 * UP to the target as much as big heads are scaled down, because the look has
 * to be CONSISTENT - Rick, 2026-08-21: "the face can go off of the chip or
 * not but not some off the chip and some inside." A cap only moves the heads
 * that breach it and leaves the rest wherever they fell, which is the exact
 * mix he rejected.
 *
 * CHIP_LOGO_MAX survives only as the fallback for a kind with NO head path,
 * where reach is 0 and there is nothing to measure.
 *
 * iOS does the same thing with the same numbers (PieceRenderer.swift,
 * chipLogoScale(for:mode:)). This comment used to claim iOS applied a flat
 * 1.30 and overflowed 13 of 38 heads on purpose; that was stale, and on
 * 2026-08-22 it cost the web and iOS sessions a full round trip each hunting
 * an overflow bug that does not exist. Both engines were read line by line
 * that day and agree. The scale is computed from the path data, so it cannot
 * drift when a path is edited.
 */
const CHIP_FACE_RX = 0.775;
const CHIP_FACE_RY = 0.675;
const CHIP_LOGO_MAX = 1.30;
const chipFitCache = new Map();

/**
 * Where each mode puts the head's outermost point, in units of the face
 * ELLIPSE. One target per mode rather than a per-kind clamp, because the look
 * has to be CONSISTENT - Rick, 2026-08-21: "the face can go off of the chip
 * or not but not some off the chip and some inside". A clamp only moves the
 * heads that breach it and leaves the rest wherever they fell, which is the
 * mix he was looking at.
 */
const CHIP_TARGET = { fit: 0.98, breakout: 1.15 };

/**
 * Every number that decides how a chip LOOKS, in one place, so the chip can
 * be judged as a set of candidates instead of being re-tuned in isolation.
 * Three attempts were made that way and Rick caught all three.
 *
 * The board calls drawChipDisc with no style and gets exactly these, so the
 * defaults ARE the shipping chip; /play/chiptest.html passes overrides. One
 * code path, so the test page can never show something the game does not
 * draw. When Rick picks a candidate, his numbers land here and every one of
 * the 38 pieces moves at once, in both engines - that is the whole point of
 * deciding it once.
 *
 * All lengths are in units of cr (the chip radius, itself radius * 1.25).
 * Shades are shadeHex amounts against the piece's primary colour.
 */
export const CHIP_STYLE = {
  // Ground shadow. The chip lies ON something.
  shadowAlpha: 0.45,
  shadowDrop: 0.32,
  shadowRX: 0.775,
  shadowRY: 0.225,

  // Side band: the disc's SIDE, seen from slightly above. Offset DOWN from
  // the face, and the sliver of it left showing is the crescent. It has to
  // stay visible against the background: at -0.80 on an almost-black page it
  // vanished and the chip read flat ("chips lost their 3d look entirely").
  rimShade: -0.58,
  rimDrop: 0.16,
  rimRX: 0.825,
  rimRY: 0.775,

  // THE OUTER BOTTOM ARC: the lower half of the rim, which is the silhouette
  // of a disc with a side. Rick, 2026-08-21: "the chip lost 3D likely because
  // of the bottom edge lost its line." Killing the double circle removed the
  // rim's stroke entirely, and this outer arc went with it. Default OFF only
  // because that is what ships today; it is the leading candidate to turn on.
  outerEdge: false,
  outerEdgeShade: -0.82,
  outerEdgeWidth: 0.045,

  // Top face: the ground the head sits on, graded so the disc has a shape.
  // The gradient ends are held as their own numbers rather than derived from
  // the face ellipse, because these are the shipping values to the digit.
  faceRise: 0.10,
  faceRX: CHIP_FACE_RX,
  faceRY: CHIP_FACE_RY,
  faceGradTop: 0.785,
  faceGradBottom: 0.575,
  faceTopShade: -0.24,
  faceBottomShade: -0.46,

  // THE INNER EDGE: face against rim. By Rick's reading this is the one that
  // was doubling up, and it is the one still switched ON today, which makes
  // the shipping chip the wrong way round from his diagnosis.
  faceStroke: true,
  faceStrokeShade: 0.10,
  faceStrokeWidth: 0.03,

  // Curved highlight along the top edge.
  highlightAlpha: 0.16,
  highlightRise: 0.50,
  highlightRX: 0.475,
  highlightRY: 0.15,
};

/**
 * The same for Flat. `depth` is the one candidate knob: option (c) from the
 * chip brief is to stop fighting for depth on the Chip, let it be a head on a
 * token, and put the real 3D here instead. 0 is the shipping flat disc.
 */
export const FLAT_STYLE = {
  depth: 0,
  faceShade: -0.52,
  rimShade: -0.72,
};

/** The scale that puts a head's outermost point on an arbitrary target. */
export function chipHeadScaleTo(kind, target) {
  const key = CHIP_HEAD_ALIAS[kind] ?? kind;
  const pts = CHIP_HEADS[key];
  const reach = pts && pts.length ? chipHeadReach(pts) : 0;
  return reach > 0 ? target / reach : CHIP_LOGO_MAX;
}

/**
 * The head's outermost point in units of the face ellipse: 1.0 touches the
 * rim, above 1.0 breaches it. Every POINT is measured, not the bounding box,
 * because a box's corners lie outside the ellipse it encloses - which is how
 * 19 of 38 heads passed the old "fitted" test and hung over the rim anyway.
 */
function chipHeadReach(pts) {
  return Math.max(...pts.map(([x, y]) => Math.hypot(x / CHIP_FACE_RX, y / CHIP_FACE_RY)));
}

const FLAT_FACE_R = 0.92;
const flatFitCache = new Map();

/** The head's outermost point in units of the flat disc's radius. */
function flatHeadReach(pts) {
  return Math.max(...pts.map(([x, y]) => Math.hypot(x, y) / FLAT_FACE_R));
}

export function flatLogoScale(kind) {
  const key = CHIP_HEAD_ALIAS[kind] ?? kind;
  if (flatFitCache.has(key)) return flatFitCache.get(key);
  const pts = CHIP_HEADS[key];
  const reach = pts && pts.length ? flatHeadReach(pts) : 0;
  const scale = reach > 0 ? CHIP_TARGET.fit / reach : 1;
  flatFitCache.set(key, scale);
  return scale;
}

/**
 * Flat is the CONTAINED look and Chip is the BREAK-OUT look, so the two
 * variants are the two options and the old Fit/Break Out setting is gone
 * (Rick, 2026-08-21: "should we make fit to disc just the flat? Option").
 * Same head, same face marks; only the disc differs.
 *
 * Lives here rather than inline in game.js so the lab and the board cannot
 * drift - they did, and the lab kept its own copy for a while.
 */
export function drawFlatDisc(c, kind, x, y, radius, f, alpha = 1, style = null) {
  const s = style ? { ...FLAT_STYLE, ...style } : FLAT_STYLE;
  c.save();
  c.globalAlpha = alpha;
  const fr = radius * FLAT_FACE_R;
  if (s.depth > 0) {
    // Option (c) from the chip brief: stop fighting for depth on the Chip,
    // let it be a head on a token, and put the real 3D HERE. Built on
    // CIRCLES rather than the chip's ellipses, so Flat reads as a disc seen
    // face on while Chip reads as one lying away from you. The two have to
    // stay visibly different or there is no reason to offer both.
    c.fillStyle = shadeHex(f.primary, s.rimShade);
    c.beginPath();
    c.arc(x, y + fr * s.depth, fr, 0, Math.PI * 2);
    c.fill();
    const g = c.createLinearGradient(0, y - fr, 0, y + fr);
    g.addColorStop(0, shadeHex(f.primary, s.faceShade + 0.18));
    g.addColorStop(1, shadeHex(f.primary, s.faceShade - 0.10));
    c.fillStyle = g;
  } else {
    c.fillStyle = shadeHex(f.primary, s.faceShade);
  }
  c.strokeStyle = f.stroke;
  c.lineWidth = Math.max(1, radius * 0.09);
  c.beginPath();
  c.arc(x, y, fr, 0, Math.PI * 2);
  c.fill();
  c.stroke();

  const hs = radius * flatLogoScale(kind);
  if (traceChipHead(c, kind, x, y, hs)) {
    c.fillStyle = f.primary;
    c.strokeStyle = shadeHex(f.stroke, 0.25);
    c.lineWidth = Math.max(0.6, radius * 0.05);
    c.lineJoin = 'round';
    c.fill();
    c.stroke();
    drawChipEyes(c, kind, x, y, hs, f.accent);
  } else {
    c.fillStyle = f.accent;
    c.beginPath();
    c.arc(x, y, radius * 0.22, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

export function chipHeadScale(kind, mode = 'breakout') {
  const key = CHIP_HEAD_ALIAS[kind] ?? kind;
  const target = CHIP_TARGET[mode] ?? CHIP_TARGET.fit;
  const cacheKey = `${mode}|${key}`;
  if (chipFitCache.has(cacheKey)) return chipFitCache.get(cacheKey);
  const pts = CHIP_HEADS[key];
  // A kind with no head falls back to the accent dot and has nothing to
  // measure, so it keeps the historical scale.
  const reach = pts && pts.length ? chipHeadReach(pts) : 0;
  const scale = reach > 0 ? target / reach : CHIP_LOGO_MAX;
  chipFitCache.set(cacheKey, scale);
  return scale;
}

export function drawChipDisc(c, kind, x, y, radius, f, alpha = 1, logoScale = null, style = null) {
  // Chip: a direct port of PieceRenderer.makeChipDisc. The web had this as
  // a single flat circle with a white silhouette on it, so picking Chip on
  // iOS and Chip on the web gave two different-looking pieces (Rick,
  // 2026-08-21). iOS builds it from five stacked parts and the depth comes
  // from the pair of ELLIPSES, not from the shadow: a wide dark band and a
  // narrower lighter face offset up from it. A circle cannot read as a disc
  // lying on a board no matter how it is shaded.
  // iOS calls this with radius * 1.25 and all the ratios below are relative
  // to that, which is why the face still lands near the old 1.02 width.
  // SpriteKit's y points up and canvas y points down, so every iOS offset
  // is negated here.
  const cr = radius * 1.25;
  const s = style ? { ...CHIP_STYLE, ...style } : CHIP_STYLE;

  if (s.shadowAlpha > 0) {
    c.fillStyle = `rgba(0, 0, 0, ${s.shadowAlpha})`;
    c.beginPath();
    c.ellipse(x, y + cr * s.shadowDrop, cr * s.shadowRX, cr * s.shadowRY, 0, 0, Math.PI * 2);
    c.fill();
  }

  // Side band: the rim, darker and offset DOWN, which is the whole trick.
  // NO stroke on the rim. Two stroked ellipses stacked under one head is
  // two circles, which is exactly what Rick kept seeing ("the chips all look
  // like they have two circles so they lost the 3D look"). Depth comes from
  // SHADING - a graded face over a darker rim - not from drawing more edges.
  //
  // The rim also has to stay VISIBLE. At -0.80 on an almost-black page it
  // disappeared into the background and the chip went flat instead ("chips
  // lost their 3d look entirely now"). It sits BETWEEN the face and the
  // background in tone, and shows a real crescent under the face.
  const rimY = y + cr * s.rimDrop;
  c.fillStyle = shadeHex(f.primary, s.rimShade);
  c.beginPath();
  c.ellipse(x, rimY, cr * s.rimRX, cr * s.rimRY, 0, 0, Math.PI * 2);
  c.fill();

  // The outer bottom arc, when it is switched on: the LOWER HALF of the rim
  // only. A full ellipse here is the double circle that got pulled; half of
  // one is the silhouette of a disc with a side, which is the line Rick says
  // went missing.
  if (s.outerEdge) {
    c.strokeStyle = shadeHex(f.primary, s.outerEdgeShade);
    c.lineWidth = Math.max(0.7, cr * s.outerEdgeWidth);
    c.beginPath();
    c.ellipse(x, rimY, cr * s.rimRX, cr * s.rimRY, 0, 0, Math.PI);
    c.stroke();
  }

  // Top face: the GROUND the head sits on, graded top to bottom so the disc
  // has a shape rather than being a flat ring.
  const faceY = y - cr * s.faceRise;
  const faceGrad = c.createLinearGradient(0, y - cr * s.faceGradTop, 0, y + cr * s.faceGradBottom);
  faceGrad.addColorStop(0, shadeHex(f.primary, s.faceTopShade));
  faceGrad.addColorStop(1, shadeHex(f.primary, s.faceBottomShade));
  c.fillStyle = faceGrad;
  c.beginPath();
  c.ellipse(x, faceY, cr * s.faceRX, cr * s.faceRY, 0, 0, Math.PI * 2);
  c.fill();
  if (s.faceStroke) {
    c.strokeStyle = shadeHex(f.primary, s.faceStrokeShade);
    c.lineWidth = Math.max(0.6, cr * s.faceStrokeWidth);
    c.stroke();
  }

  // Curved highlight along the top edge.
  if (s.highlightAlpha > 0) {
    c.save();
    c.globalAlpha = s.highlightAlpha * alpha;
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.ellipse(x, y - cr * s.highlightRise, cr * s.highlightRX, cr * s.highlightRY, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  // The logo is the HEAD, not the whole figure. A body shrunk onto a disc
  // reads as a keyhole at board scale; a head reads as a face, which is why
  // iOS paints chipHeadPath here and never the figure (Rick, 2026-08-21).
  // Same 1.30 scale and same y offset as the iOS logo node.
  // The head carries the COLOUR now; the disc behind it is a dark ground.
  // It used to be the other way round - a bright disc with a head darkened
  // 55% - which is why a green alien vanished into its own green disc, a
  // white astronaut came out grey, and the UFO read as a grey lump rather
  // than something metal against space. Side identity survives the swap and
  // is stronger for it: the head is the BIGGER element once it breaks out.
  c.fillStyle = f.primary;
  c.strokeStyle = shadeHex(f.stroke, 0.25);
  c.lineWidth = Math.max(0.6, radius * 0.05);
  c.lineJoin = 'round';
  const hs = cr * (logoScale ?? chipHeadScale(kind));
  if (traceChipHead(c, kind, x, faceY, hs)) {
    c.fill();
    c.stroke();
    // The eyes are what turn the silhouette into a face. Without them the
    // head is just a dark hole punched in the chip.
    drawChipEyes(c, kind, x, faceY, hs, f.accent);
  } else {
    // No head for this kind: an accent dot, exactly as iOS falls back.
    c.fillStyle = f.accent;
    c.beginPath();
    c.arc(x, faceY, cr * 0.20, 0, Math.PI * 2);
    c.fill();
  }
}

/**
 * NO DISC AT ALL: the head IS the piece, and it carries its own depth.
 *
 * Rick, 2026-08-22: "we have NO chip at all but the HEAD becomes the CHIP
 * itself. Most of the pieces already are close enough to be like a chip piece
 * and it will be fun for them to have their own depth."
 *
 * This dissolves the conflict the chip could not be tuned out of rather than
 * balancing it. Break-out fought chip depth because the head covered the face,
 * so there was no disc left to shade; with no disc there is nothing left to
 * cover. The depth moves onto the shape a player is actually looking at.
 *
 * The side is the SAME path swept downward, not a drawn edge. That is the one
 * lesson that survived the three failed chip attempts: depth comes from a
 * solid side and a graded face, never from adding another outline.
 *
 * Sized to the chip's own footprint (HEAD_PIECE_FOOTPRINT is the shipping
 * chip's visible half width) so a board full of these occupies exactly the
 * space a board full of chips did, and nothing about the grid has to move.
 */
export const HEAD_PIECE_FOOTPRINT = 1.25 * 0.825;

export const HEAD_STYLE = {
  fill: 1.0,
  // Matched on WIDTH, not on the outermost point. Scaling a roughly square
  // head by its longest radius scales it by its CORNER, which lands it
  // visibly smaller than the disc it replaces - the robot showed this
  // immediately. Width-matching puts the piece in the same footprint the chip
  // had. maxTall then stops a tall head becoming a tower on the grid.
  maxTall: 1.15,
  depth: 0.16,
  // 1 slice is a single hard offset copy, which reads as a sticker lifted off
  // the board. More slices sweep the path into a solid side.
  slices: 6,
  sideShade: -0.55,
  faceTopShade: 0.08,
  faceBottomShade: -0.22,
  outline: true,
  outlineShade: 0.25,
  outlineWidth: 0.05,
  shadowAlpha: 0.40,
  shadowDrop: 0.34,
  shadowRX: 0.66,
  shadowRY: 0.17,
  highlightAlpha: 0.18,
};

const headExtentCache = new Map();
/** Half-width and half-height of the head path, in raw path units. */
function headPieceExtent(kind) {
  const key = CHIP_HEAD_ALIAS[kind] ?? kind;
  if (headExtentCache.has(key)) return headExtentCache.get(key);
  const pts = CHIP_HEADS[key];
  const ext = pts && pts.length
    ? { hw: Math.max(...pts.map((p) => Math.abs(p[0]))), hh: Math.max(...pts.map((p) => Math.abs(p[1]))) }
    : { hw: 0, hh: 0 };
  headExtentCache.set(key, ext);
  return ext;
}

export function drawHeadPiece(c, kind, x, y, radius, f, alpha = 1, style = null) {
  const s = style ? { ...HEAD_STYLE, ...style } : HEAD_STYLE;
  const { hw, hh } = headPieceExtent(kind);
  if (hw <= 0 || hh <= 0) return false;
  const half = radius * HEAD_PIECE_FOOTPRINT * s.fill;
  let hs = half / hw;
  if (hh * hs > half * s.maxTall) hs = (half * s.maxTall) / hh;
  // The drawn half-height, which is what the shading and the shadow have to
  // be measured against: a saucer and a tall helmet cannot share one number.
  const halfH = hh * hs;
  const drop = half * s.depth;

  c.save();
  c.globalAlpha = alpha;

  if (s.shadowAlpha > 0) {
    c.fillStyle = `rgba(0, 0, 0, ${s.shadowAlpha})`;
    c.beginPath();
    c.ellipse(x, y + halfH * s.shadowDrop + drop, half * s.shadowRX, half * s.shadowRY, 0, 0, Math.PI * 2);
    c.fill();
  }

  // The side: the same silhouette swept down. Drawn deepest first so the
  // stack unions into one solid body instead of reading as layers.
  if (drop > 0 && s.slices > 0) {
    c.fillStyle = shadeHex(f.primary, s.sideShade);
    for (let i = s.slices; i >= 1; i -= 1) {
      traceChipHead(c, kind, x, y + drop * (i / s.slices), hs);
      c.fill();
    }
  }

  // The face, graded so the head has a form rather than being a cut-out.
  const g = c.createLinearGradient(0, y - halfH, 0, y + halfH);
  g.addColorStop(0, shadeHex(f.primary, s.faceTopShade));
  g.addColorStop(1, shadeHex(f.primary, s.faceBottomShade));
  c.fillStyle = g;
  c.lineJoin = 'round';
  traceChipHead(c, kind, x, y, hs);
  c.fill();
  if (s.outline) {
    c.strokeStyle = shadeHex(f.stroke, s.outlineShade);
    c.lineWidth = Math.max(0.6, radius * s.outlineWidth);
    c.stroke();
  }

  // The sheen FADES OUT. A flat-alpha ellipse has a hard edge, and on a
  // near-black piece that edge reads as a grey oval painted on the face
  // rather than as light on it - the onyx stone showed it as an obvious
  // smudge. A radial falloff is what a real specular does and it behaves on
  // every colour in every scheme, dark ones included.
  if (s.highlightAlpha > 0) {
    c.save();
    traceChipHead(c, kind, x, y, hs);
    c.clip();
    const hx = x;
    const hy = y - halfH * 0.52;
    const hr = Math.max(half * 0.58, 0.01);
    const sheen = c.createRadialGradient(hx, hy, 0, hx, hy, hr);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sheen.addColorStop(0.55, 'rgba(255, 255, 255, 0.45)');
    sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    c.globalAlpha = s.highlightAlpha * alpha;
    c.fillStyle = sheen;
    c.save();
    // Squashed into the head's own proportions so a saucer gets a wide, low
    // sheen and a tall helmet gets a rounder one.
    c.translate(hx, hy);
    c.scale(1, Math.max(0.25, halfH / half) * 0.85);
    c.translate(-hx, -hy);
    c.beginPath();
    c.arc(hx, hy, hr, 0, Math.PI * 2);
    c.fill();
    c.restore();
    c.restore();
  }

  // The eyes are still what turn a silhouette into a face, and they matter
  // MORE here: there is no disc left to say "this is a piece", so the face
  // is carrying the whole read.
  drawChipEyes(c, kind, x, y, hs, f.accent);
  c.restore();
  return true;
}

/**
 * Glow, one of Rick's five option axes (2026-08-22). One scale for BOTH
 * pieces, because it is a property of the piece and not of the variant: it
 * used to be hard-coded per variant (0.18 behind a figure, 0.06 behind a
 * chip, 0.25 inside drawFigure) which meant three different things wore the
 * same name and none of them could be turned off.
 *
 * Soft is the default and reproduces roughly what a figure used to carry, so
 * nobody's board changes character unless they ask it to.
 */
export const GLOWS = [
  { key: 'none', name: 'None', alpha: 0 },
  { key: 'soft', name: 'Soft', alpha: 0.20 },
  { key: 'bright', name: 'Bright', alpha: 0.45 },
];

export function glowAlpha(key) {
  return (GLOWS.find((g) => g.key === key) ?? GLOWS[1]).alpha;
}

/**
 * A figure's glow FOLLOWS ITS SILHOUETTE; a chip's is a circle. Same option,
 * same alphas, two shapes, because a figure is about three cells tall and a
 * circular halo centred on its intersection lights only the feet - it reads
 * as a puddle the piece is standing in rather than as a glow.
 */
export function drawFigureGlow(ctx, kind, cx, feetY, r, glowRgb, key, alpha = 1) {
  const a = glowAlpha(key) * alpha;
  const f = FIGURES[kind];
  if (a <= 0 || !f) return;
  ctx.save();
  ctx.fillStyle = `rgba(${glowRgb}, ${a})`;
  tracePath(ctx, f.points, cx, feetY, r * 1.12);
  ctx.fill();
  ctx.restore();
}

/** The halo behind a piece. Drawn by the board so both variants share it. */
export function drawGlow(ctx, x, y, radius, glowRgb, key, alpha = 1) {
  const a = glowAlpha(key) * alpha;
  if (a <= 0) return;
  const g = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 1.6);
  g.addColorStop(0, `rgba(${glowRgb}, ${a})`);
  g.addColorStop(1, `rgba(${glowRgb}, 0)`);
  ctx.save();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function traceFigure(ctx, kind, cx, feetY, r) {
  const f = FIGURES[kind];
  if (f) tracePath(ctx, f.points, cx, feetY, r);
}

/**
 * Draws a figure standing with its feet at (cx, feetY), scaled by figure
 * radius r (a figure is ~3.2r tall). opts.palette overrides the roster
 * colors (color schemes); opts.finish = 'dimensional' renders the faux-3D
 * extrusion + gloss from the iOS 3D Lab winner instead of the classic
 * glow-silhouette finish.
 */
export function drawFigure(ctx, kind, cx, feetY, r, alpha = 1, opts = {}) {
  const f = FIGURES[kind];
  if (!f) return;
  const pal = opts.palette ?? f;
  ctx.save();
  ctx.globalAlpha = alpha;

  // SEPARATION CONTOUR. A standing figure deliberately overhangs the cell
  // above it, so figures overlap their neighbours by design, and without a
  // hard edge they merge into each other. Leo said it twice in persona round
  // 2 and it is the one change he asked for: "tall pieces visually overlap
  // the piece on the dot above them (my robots looked stacked on each
  // other's heads)" and "make my robot readable on the board ... tiny
  // overlapping specks". Logged as round-2 finding 5 and routed to web on
  // 2026-08-10.
  //
  // A stroke, not a glow. This is the whole point: a soft halo blurs INTO
  // the neighbour it is supposed to separate from, which is why a glow was
  // never going to fix this and why the chip won - a disc has a hard edge by
  // construction and a glowing figure does not. Pieces are drawn top row
  // first, so the nearer figure strokes over the one behind and cuts a clean
  // line out of it.
  if (opts.contour !== false) {
    ctx.strokeStyle = 'rgba(8, 8, 14, 0.88)';
    ctx.lineWidth = Math.max(1.5, r * 0.22);
    ctx.lineJoin = 'round';
    tracePath(ctx, f.points, cx, feetY, r);
    ctx.stroke();
  }

  if (opts.finish === 'dimensional') {
    // Stacked side-wall slices behind a gradient-shaded body with a
    // specular streak (PieceRenderer dimensional finish).
    for (let i = 5; i >= 1; i -= 1) {
      const t = i / 5;
      ctx.fillStyle = shadeHex(pal.primary, -0.55);
      ctx.strokeStyle = shadeHex(pal.stroke, -0.50);
      ctx.lineWidth = 0.8;
      ctx.lineJoin = 'round';
      tracePath(ctx, f.points, cx + r * 0.14 * t, feetY + r * 0.10 * t, r);
      ctx.fill();
      ctx.stroke();
    }
    const hU = figureHeight(kind);
    const grad = ctx.createLinearGradient(0, feetY - hU * r, 0, feetY);
    grad.addColorStop(0, shadeHex(pal.primary, 0.45));
    grad.addColorStop(1, shadeHex(pal.primary, -0.35));
    ctx.fillStyle = grad;
    ctx.strokeStyle = pal.stroke;
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.lineJoin = 'round';
    tracePath(ctx, f.points, cx, feetY, r);
    ctx.fill();
    ctx.stroke();
    // Specular streak clipped to the silhouette
    ctx.save();
    tracePath(ctx, f.points, cx, feetY, r);
    ctx.clip();
    ctx.translate(cx - r * 0.45, feetY - r * 1.3);
    ctx.rotate(-0.18);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.30)';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.25, r * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    // Standard: a solid body. The scaled-up glow silhouette that used to sit
    // behind it is GONE. It was doing the separation job badly, and while it
    // was doing it badly glow could not be anything else - it was a permanent
    // fixture rather than a thing a player picks. The contour above separates
    // properly, which is what frees glow to become one of the five options
    // (Rick, 2026-08-22: "2 pieces and 5 options for each piece (color,
    // depth, glow, sounds (later), effect (later))"). The caller draws it now.
    ctx.fillStyle = pal.primary;
    ctx.strokeStyle = pal.stroke;
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.lineJoin = 'round';
    tracePath(ctx, f.points, cx, feetY, r);
    ctx.fill();
    ctx.stroke();
  }

  drawEyeBand(ctx, f.band ?? kind, cx, feetY, r, f.accent);
  ctx.restore();
}
