/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { SimMode } from '../../game/types.ts';
import {
  getSceneBounds,
  computeFramedCamera,
  projectPointNDC,
  FramingOptions,
} from './cameraFraming.ts';

const ALL_MODES: SimMode[] = [
  'chamber',
  'displacement',
  'diffusion',
  'thermal',
  'gallium',
  'elevation',
  'bohr',
  'moseley',
  'metals',
  'molecules',
  'allotropes',
  'salt',
];

const VIEWPORT_ASPECTS = [
  { name: 'desktop-1440x900', aspect: 1120 / 737 },
  { name: 'laptop-1024x768', aspect: 704 / 551 },
  { name: 'wide-short-1280x500', aspect: 960 / 380 },
  { name: 'mobile-390x844', aspect: 390 / 600 },
];

const ORBIT_ANGLES = [
  { rotX: 0, rotY: 0 },
  { rotX: 0.45, rotY: Math.PI / 4 },
  { rotX: -0.45, rotY: Math.PI / 2 },
  { rotX: 0.2, rotY: Math.PI },
];

function verifyBoundsFit(mode: SimMode, options: FramingOptions = {}) {
  const bounds = getSceneBounds(mode, options);
  const xs = [bounds.minX, bounds.maxX];
  const ys = [bounds.minY, bounds.maxY];
  const zs = [bounds.minZ, bounds.maxZ];

  for (const vp of VIEWPORT_ASPECTS) {
    for (const orbit of ORBIT_ANGLES) {
      const frame = computeFramedCamera({
        bounds,
        fovDeg: 45,
        aspect: vp.aspect,
        rotX: orbit.rotX,
        rotY: orbit.rotY,
      });

      for (const x of xs) {
        for (const y of ys) {
          for (const z of zs) {
            const { ndcX, ndcY, depth } = projectPointNDC(
              { x, y, z },
              frame,
              45,
              vp.aspect
            );
            assert.ok(
              depth > 0.5,
              `${mode} (${vp.name}, rot=${orbit.rotX},${orbit.rotY}) depth ${depth} <= 0.5`
            );
            assert.ok(
              ndcY > -0.86,
              `${mode} (${vp.name}) bottom ndcY=${ndcY.toFixed(3)} exceeds safe clearance above experiment bar`
            );
            assert.ok(
              ndcY < 0.86,
              `${mode} (${vp.name}) top ndcY=${ndcY.toFixed(3)} exceeds top clearance`
            );
            assert.ok(
              Math.abs(ndcX) < 0.86,
              `${mode} (${vp.name}) horiz ndcX=${ndcX.toFixed(3)} clips horizontally`
            );
          }
        }
      }
    }
  }
}

test('all 12 3D scenes stay strictly above bottom experiment bar across viewports and orbit angles', () => {
  for (const mode of ALL_MODES) {
    verifyBoundsFit(mode);
  }
});

test('bohr Copper (4 shells) and Hydrogen (1 shell) frame cleanly without clipping', () => {
  verifyBoundsFit('bohr', { bohrElementIdx: 0 });
  verifyBoundsFit('bohr', { bohrElementIdx: 3 });
});

test('allotropes modes (both, diamond, graphite) frame cleanly without clipping', () => {
  verifyBoundsFit('allotropes', { allotropesMode: 'both' });
  verifyBoundsFit('allotropes', { allotropesMode: 'diamond' });
  verifyBoundsFit('allotropes', { allotropesMode: 'graphite' });
});
