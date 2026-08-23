// The GLOW option, ported from iOS PieceGlowTests.
//
// Both engines shipped a glow that did nothing anyone could see. The halo was
// a SCALED COPY of the silhouette, and scaling grows a shape by a fraction of
// its own size: at Bright the robot's widest point gained 0.85r x 0.20 =
// 0.17r, and the separation contour drawn straight over it is r*0.22 wide, so
// half of it - 0.11r on iOS, the same shape of number here - ate most of that.
// Rick, on the iOS build, 2026-08-24: "it still doesn't work". Measured
// there: None and Soft differed by nine pixels on a whole board.
//
// So the invariant is not "a halo is drawn". It is "the halo reaches PAST the
// hard edge drawn on top of it". These tests read the widths the halo
// actually strokes, through a recording context, and check exactly that.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FIGURES, GLOWS, glowAlpha, glowReach, drawFigureGlow, drawHeadGlow, headPieceScale, HEAD_STYLE } from '../play/pieces.js';

/** Records every stroke width; ignores the path calls. */
function recordingCtx() {
  const widths = [];
  const alphas = [];
  return {
    widths,
    alphas,
    lineWidth: 0,
    lineJoin: '',
    lineCap: '',
    strokeStyle: '',
    save() {},
    restore() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    ellipse() {},
    arc() {},
    roundRect() {},
    stroke() {
      widths.push(this.lineWidth);
      const m = /rgba\(([^)]*),\s*([0-9.]+)\)$/.exec(this.strokeStyle);
      if (m) alphas.push(Number(m[2]));
    },
    fill() {},
  };
}

const R = 40;

test('the option table matches iOS PieceGlow', () => {
  assert.deepEqual(GLOWS.map((g) => g.key), ['none', 'soft', 'bright']);
  assert.equal(glowAlpha('soft'), 0.34);
  assert.equal(glowAlpha('bright'), 0.70);
  assert.equal(glowReach('soft'), 0.14);
  assert.equal(glowReach('bright'), 0.30);
});

test('None strokes nothing at all', () => {
  const c = recordingCtx();
  drawFigureGlow(c, 'robot', 0, 0, R, FIGURES.robot.glowRgb, 'none');
  assert.equal(c.widths.length, 0);
});

test('every figure halo clears the separation contour', () => {
  const contourHalf = Math.max(1.5, R * 0.22) / 2;
  for (const kind of Object.keys(FIGURES)) {
    for (const key of ['soft', 'bright']) {
      const c = recordingCtx();
      drawFigureGlow(c, kind, 0, 0, R, FIGURES[kind].glowRgb, key);
      assert.ok(c.widths.length > 1, `${kind}/${key}: halo is not layered`);
      const outermost = Math.max(...c.widths) / 2;
      const clearance = outermost - contourHalf;
      // The whole reach, not a fraction of it: the outermost band is placed
      // at exactly contour + reach.
      assert.ok(clearance >= glowReach(key) * R - 0.01,
        `${kind}/${key}: halo clears the contour by ${clearance.toFixed(2)}pt, `
        + `needs ${(glowReach(key) * R).toFixed(2)}pt`);
    }
  }
});

test('every head halo clears the face outline and scales with the head', () => {
  for (const kind of Object.keys(FIGURES)) {
    const hs = headPieceScale(kind, R, null);
    if (hs <= 0) continue;
    const outlineHalf = Math.max(0.6, R * HEAD_STYLE.outlineWidth) / 2;
    for (const key of ['soft', 'bright']) {
      const c = recordingCtx();
      drawHeadGlow(c, kind, 0, 0, R, FIGURES[kind].glowRgb, key);
      const clearance = Math.max(...c.widths) / 2 - outlineHalf;
      assert.ok(clearance >= glowReach(key) * hs - 0.01,
        `${kind}/${key}: head halo clears the outline by ${clearance.toFixed(2)}pt, `
        + `needs ${(glowReach(key) * hs).toFixed(2)}pt`);
    }
  }
});

test('Bright is visibly more than Soft on both pieces', () => {
  for (const draw of [
    (c, key) => drawFigureGlow(c, 'robot', 0, 0, R, FIGURES.robot.glowRgb, key),
    (c, key) => drawHeadGlow(c, 'robot', 0, 0, R, FIGURES.robot.glowRgb, key),
  ]) {
    const widest = (key) => {
      const c = recordingCtx();
      draw(c, key);
      return Math.max(...c.widths);
    };
    assert.ok(widest('bright') > widest('soft') * 1.2,
      'Bright must read as more than Soft, not as a nudge');
  }
});

test('the layers accumulate to the level\'s stated alpha', () => {
  for (const key of ['soft', 'bright']) {
    const c = recordingCtx();
    drawFigureGlow(c, 'robot', 0, 0, R, FIGURES.robot.glowRgb, key);
    // n bands of alpha p accumulate to 1 - (1-p)^n where they overlap, which
    // is the band just outside the contour.
    const per = c.alphas[0];
    const total = 1 - (1 - per) ** c.alphas.length;
    assert.ok(Math.abs(total - glowAlpha(key)) < 0.01,
      `${key}: bands accumulate to ${total.toFixed(3)}, want ${glowAlpha(key)}`);
  }
});
