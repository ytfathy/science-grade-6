/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  UNIT4_VIDEO_SRC,
  UNIT4_LESSONS,
  getUnit4Lesson,
  getUnit4StartSeconds,
} from './unit4.ts';

test('Unit 4 video source points to local public asset', () => {
  assert.equal(
    UNIT4_VIDEO_SRC,
    '/assets/aistudio/Chemical_Processes_and_Equations__Tracing_Matter_and_Energy_8d18b79b.mp4'
  );
});

test('Unit 4 defines Lessons 1, 2, and 3 with ordered timestamps', () => {
  assert.equal(UNIT4_LESSONS.length, 3);
  assert.deepEqual(
    UNIT4_LESSONS.map((l) => l.id),
    [1, 2, 3]
  );
  assert.equal(getUnit4StartSeconds(1), 0);
  assert.equal(getUnit4StartSeconds(2), 128);
  assert.equal(getUnit4StartSeconds(3), 278);
});

test('getUnit4Lesson falls back safely to Lesson 1 for out-of-range ids', () => {
  const fallback = getUnit4Lesson(4);
  assert.equal(fallback.id, 1);
  assert.equal(fallback.startSeconds, 0);
});
