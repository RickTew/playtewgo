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
    // Three pips running diagonally across the die face
    ctx.fillStyle = '#0d0d0d';
    for (const [dx, dy] of [[-0.42, 1.22], [0, 0.85], [0.42, 0.48]]) {
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
  astronaut: [[0.45,0.32],[0.5,-0.1],[0.38,-0.38],[0.1,-0.46],[0.1,-0.55],[-0.1,-0.55],[-0.1,-0.46],[-0.38,-0.38],[-0.5,-0.1],[-0.45,0.32]],
  bandit: [[0.32,0.32],[0.46,0.05],[0.78,-0.08],[0.55,-0.32],[0.2,-0.42],[0,-0.4],[-0.2,-0.42],[-0.55,-0.32],[-0.78,-0.08],[-0.46,0.05],[-0.32,0.32]],
  cowboy: [[0.3,0.32],[0.42,0.05],[0.85,-0.1],[0.55,-0.2],[0.45,-0.42],[0.2,-0.5],[0,-0.48],[-0.2,-0.5],[-0.45,-0.42],[-0.55,-0.2],[-0.85,-0.1],[-0.42,0.05],[-0.3,0.32]],
  daimyo: [[0.42,0.32],[0.5,-0.05],[0.85,-0.2],[0.5,-0.36],[0.18,-0.32],[0,-0.55],[-0.18,-0.32],[-0.5,-0.36],[-0.85,-0.2],[-0.5,-0.05],[-0.42,0.32]],
  dice: [[0.4,0.3],[0.4,-0.3],[0.28,-0.42],[-0.28,-0.42],[-0.4,-0.3],[-0.4,0.3]],
  dragon: [[0.45,0.32],[0.5,-0.1],[0.65,-0.22],[0.78,-0.48],[0.42,-0.34],[0.18,-0.42],[0,-0.36],[-0.18,-0.42],[-0.42,-0.34],[-0.78,-0.48],[-0.65,-0.22],[-0.5,-0.1],[-0.45,0.32]],
  fish: [[0.45,0.32],[0.42,-0.2],[0.2,-0.42],[0,-0.5],[-0.2,-0.42],[-0.42,-0.2],[-0.45,0.32]],
  frog: [[0.45,0.32],[0.55,-0.05],[0.45,-0.3],[0.55,-0.48],[0.2,-0.4],[0,-0.32],[-0.2,-0.4],[-0.55,-0.48],[-0.45,-0.3],[-0.55,-0.05],[-0.45,0.32]],
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
  ufo: [[0.85,0.32],[0.95,0.1],[0.65,-0.18],[0.3,-0.32],[0,-0.36],[-0.3,-0.32],[-0.65,-0.18],[-0.95,0.1],[-0.85,0.32]],
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
  alien: [[0,-0.1,["e",0.55,0.22],["w",1]],[0,-0.1,["c",0.06],["a",1]]],
  anubis: [[-0.14,0.05,["c",0.04],["a",1]],[0.14,0.05,["c",0.04],["a",1]],[0,-0.3,["c",0.04],["g",0.05,1.0]]],
  astronaut: [[0,-0.05,["r",0.55,0.2,0.06],["g",0.1,1.0]],[0.1,-0.1,["r",0.16,0.05,0.02],["a",1]]],
  bandit: [[0,0.12,["r",0.55,0.15,0.04],["a",1]],[-0.13,-0.05,["c",0.04],["g",0.05,1.0]],[0.13,-0.05,["c",0.04],["g",0.05,1.0]]],
  cowboy: [[-0.13,0.05,["c",0.05],["a",1]],[0.13,0.05,["c",0.05],["a",1]]],
  daimyo: [[-0.14,-0,["r",0.13,0.05,0.02],["a",1]],[0.14,-0,["r",0.13,0.05,0.02],["a",1]]],
  dice: [[-0.18,-0.22,["c",0.06],["a",1]],[0,-0.05,["c",0.06],["a",1]],[0.18,0.12,["c",0.06],["a",1]]],
  dragon: [[-0.13,-0.08,["c",0.1],["a",0.35]],[0.13,-0.08,["c",0.1],["a",0.35]],[-0.13,-0.08,["c",0.05],["a",1]],[0.13,-0.08,["c",0.05],["a",1]]],
  fish: [[0.2,-0.18,["c",0.07],["a",1]]],
  frog: [[-0.3,-0.4,["c",0.08],["a",1]],[0.3,-0.4,["c",0.08],["a",1]]],
  geisha: [[-0.12,-0.02,["c",0.04],["g",0.05,1.0]],[0.12,-0.02,["c",0.04],["g",0.05,1.0]],[0,0.1,["c",0.03],["a",1]]],
  ghost: [[-0.13,-0.1,["c",0.06],["a",1]],[0.13,-0.1,["c",0.06],["a",1]]],
  goblin: [[-0.16,-0.05,["c",0.06],["a",1]],[0.16,-0.05,["c",0.06],["a",1]]],
  knight: [[0,-0.1,["r",0.42,0.07,0.02],["a",1]]],
  kraken: [[-0.18,0.2,["c",0.1],["w",1]],[0.18,0.2,["c",0.1],["w",1]],[-0.18,0.2,["c",0.05],["a",1]],[0.18,0.2,["c",0.05],["a",1]]],
  mermaid: [[-0.12,-0.02,["c",0.05],["a",1]],[0.12,-0.02,["c",0.05],["a",1]]],
  mummy: [[0,-0.02,["r",0.5,0.13,0.03],["g",0.1,0.85]],[-0.13,-0.02,["c",0.04],["a",1]],[0.13,-0.02,["c",0.04],["a",1]]],
  ninja: [[0,-0.07,["r",0.4,0.08,0.04],["a",1]]],
  outlaw: [[0,0.14,["r",0.55,0.18,0.04],["a",1]],[-0.13,-0.05,["c",0.04],["g",0.05,1.0]],[0.13,-0.05,["c",0.04],["g",0.05,1.0]]],
  pharaoh: [[-0.13,0.05,["c",0.05],["a",1]],[0.13,0.05,["c",0.05],["a",1]]],
  pirate: [[0.13,0.05,["c",0.05],["a",1]],[-0.13,0.05,["r",0.18,0.13,0.03],["g",0.05,1.0]]],
  robot: [[0,-0.05,["r",0.42,0.07,0.02],["a",1]]],
  samurai: [[-0.13,0.02,["c",0.06],["a",1]],[0.13,0.02,["c",0.06],["a",1]]],
  scarab: [[0,-0.05,["r",0.04,0.65,0],["g",0.05,0.85]],[-0.3,-0.2,["c",0.05],["g",0.05,1.0]],[0.3,-0.2,["c",0.05],["g",0.05,1.0]]],
  shark: [[-0.18,-0.1,["c",0.05],["g",0.05,1.0]]],
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
  for (const [x, y, shape, col] of list) {
    const px = cx + x * r;
    const py = cy + y * r;
    ctx.fillStyle = chipEyeColour(col, accent);
    ctx.beginPath();
    if (shape[0] === 'c') {
      ctx.arc(px, py, shape[1] * r, 0, Math.PI * 2);
    } else if (shape[0] === 'e') {
      ctx.ellipse(px, py, (shape[1] * r) / 2, (shape[2] * r) / 2, 0, 0, Math.PI * 2);
    } else {
      const w = shape[1] * r;
      const h = shape[2] * r;
      ctx.roundRect(px - w / 2, py - h / 2, w, h, Math.max(0, shape[3] * r));
    }
    ctx.fill();
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
export function drawChipDisc(c, kind, x, y, radius, f, alpha = 1) {
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
  const lw = Math.max(1, radius * 0.06);

  c.fillStyle = 'rgba(0, 0, 0, 0.45)';
  c.beginPath();
  c.ellipse(x, y + cr * 0.32, cr * 0.775, cr * 0.225, 0, 0, Math.PI * 2);
  c.fill();

  // Side band: the rim, darker and offset DOWN, which is the whole trick.
  c.fillStyle = shadeHex(f.primary, -0.40);
  c.strokeStyle = shadeHex(f.stroke, -0.40);
  c.lineWidth = lw;
  c.beginPath();
  c.ellipse(x, y + cr * 0.10, cr * 0.825, cr * 0.775, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();

  // Top face: main colour, narrower, offset UP off the band.
  c.fillStyle = f.primary;
  c.strokeStyle = f.stroke;
  c.lineWidth = lw;
  c.beginPath();
  c.ellipse(x, y - cr * 0.10, cr * 0.775, cr * 0.675, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();

  // Curved highlight along the top edge.
  c.save();
  c.globalAlpha = 0.55 * alpha;
  c.fillStyle = shadeHex(f.primary, 0.40);
  c.beginPath();
  c.ellipse(x, y - cr * 0.50, cr * 0.475, cr * 0.15, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();

  // The logo is the HEAD, not the whole figure. A body shrunk onto a disc
  // reads as a keyhole at board scale; a head reads as a face, which is why
  // iOS paints chipHeadPath here and never the figure (Rick, 2026-08-21).
  // Same 1.30 scale and same y offset as the iOS logo node.
  c.fillStyle = shadeHex(f.primary, -0.55);
  c.strokeStyle = shadeHex(f.stroke, 0.10);
  c.lineWidth = Math.max(0.6, radius * 0.05);
  c.lineJoin = 'round';
  if (traceChipHead(c, kind, x, y - cr * 0.10, cr * 1.30)) {
    c.fill();
    c.stroke();
    // The eyes are what turn the silhouette into a face. Without them the
    // head is just a dark hole punched in the chip.
    drawChipEyes(c, kind, x, y - cr * 0.10, cr * 1.30, f.accent);
  } else {
    // No head for this kind: an accent dot, exactly as iOS falls back.
    c.fillStyle = f.accent;
    c.beginPath();
    c.arc(x, y - cr * 0.10, cr * 0.20, 0, Math.PI * 2);
    c.fill();
  }
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
    // Classic: glow silhouette behind a solid body
    ctx.fillStyle = `rgba(${pal.glowRgb}, 0.25)`;
    tracePath(ctx, f.points, cx, feetY, r * 1.1);
    ctx.fill();

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
