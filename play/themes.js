// Theme registry: a theme is a visual world (scenes + figure roster +
// audio folder), matching the iOS no-faction model. Neutral backgrounds
// are shared by every theme (NeutralBackground in BackgroundStyle.swift).

import { SPACE_SCENES } from './space.js';
import { OCEAN_SCENES } from './ocean.js';

export const NEUTRALS = [
  { key: 'sepia', name: 'Sepia', neutral: true, light: true, color: '#F2E0BD' },
  { key: 'cleanLight', name: 'Clean Light', neutral: true, light: true, color: '#F5F5F5' },
  { key: 'cleanDark', name: 'Clean Dark', neutral: true, color: '#141419' },
  { key: 'slate', name: 'Slate', neutral: true, color: '#3D4250' },
];

export const THEMES = {
  space: {
    name: 'Space',
    scenes: SPACE_SCENES,
    figures: ['robot', 'astronaut', 'alien', 'ufo'],
    defaults: ['robot', 'alien'],
    defaultScene: 'nebula',
  },
  ocean: {
    name: 'Ocean',
    scenes: OCEAN_SCENES,
    figures: ['pirate', 'mermaid', 'fish', 'kraken', 'shark', 'frog'],
    defaults: ['pirate', 'kraken'],
    defaultScene: 'deep',
  },
};

const ALL_SCENES = [...SPACE_SCENES, ...OCEAN_SCENES, ...NEUTRALS];

/** Returns undefined for unknown keys; callers fall back to the theme default. */
export function sceneByKey(key) {
  return ALL_SCENES.find((s) => s.key === key);
}

/**
 * Paints a scene onto a canvas. With no explicit size the canvas's CSS size
 * and devicePixelRatio are used (the full-page backdrop); pass w/h to render
 * a fixed-size thumbnail.
 */
export function paintScene(canvas, key, w, h) {
  const scene = sceneByKey(key) ?? SPACE_SCENES[0];
  const cssW = w ?? canvas.clientWidth;
  const cssH = h ?? canvas.clientHeight;
  if (cssW === 0 || cssH === 0) return;
  const dpr = w ? 1 : Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const c = canvas.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (scene.neutral) {
    c.fillStyle = scene.color;
    c.fillRect(0, 0, cssW, cssH);
    return;
  }
  scene.paint(c, cssW, cssH, Math.min(cssW, cssH));
}
