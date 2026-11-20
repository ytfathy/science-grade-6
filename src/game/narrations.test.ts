/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { LAB_NARRATIONS, getNarrationForMode } from './narrations.ts';
import { SimMode } from './types.ts';

const ALL_SIM_MODES: SimMode[] = [
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

test('every simulation mode has a valid English narration script', () => {
  ALL_SIM_MODES.forEach((mode) => {
    const narration = getNarrationForMode(mode);
    assert.ok(narration, `Missing narration for mode ${mode}`);
    assert.equal(narration.mode, mode);
    assert.ok(narration.title.length > 5, `Title too short for ${mode}`);
    assert.ok(narration.script.length > 50, `Script too short for ${mode}`);
    assert.ok(narration.keyPoints.length >= 3, `Key points must be at least 3 for ${mode}`);
    assert.ok(narration.textbookRef.includes('HMH'), `Must cite HMH textbook for ${mode}`);
  });
});

test('getNarrationForMode returns chamber as safe fallback for unknown mode', () => {
  const fallback = getNarrationForMode('unknown' as unknown as SimMode);
  assert.equal(fallback.mode, 'chamber');
  assert.ok(fallback.script.includes('Microscopic State Chamber'));
});
