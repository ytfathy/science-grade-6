/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  QUARTER2_NOW_TEST_QUESTIONS,
  QUARTER2_LESSON_FILTERS,
  getNowTestQuestions,
  getNowTestLessonFilters,
} from '../data/nowTestYourselfData.ts';

test('Quarter 2 Now Test Yourself includes all 13 Lesson 1 Chemical Reactions questions', () => {
  const q2Questions = getNowTestQuestions(2);
  assert.equal(q2Questions.length, 13);
  assert.ok(q2Questions.every((q) => q.lessonKey === 'lesson1'));

  const filters = getNowTestLessonFilters(2);
  assert.equal(filters, QUARTER2_LESSON_FILTERS);
  assert.equal(filters.find((f) => f.key === 'all')?.count, 13);
  assert.equal(filters.find((f) => f.key === 'lesson1')?.count, 13);
  assert.equal(filters.find((f) => f.key === 'lesson2')?.count, 0);
});

test('Every Quarter 2 question has valid option letters, indices, and existing image assets', () => {
  for (const q of QUARTER2_NOW_TEST_QUESTIONS) {
    assert.equal(q.options.length, q.optionLetters.length, `Option letter mismatch on ${q.id}`);
    assert.ok(q.correctIndices.length >= 1, `Missing correct answer on ${q.id}`);
    assert.equal(
      q.isMultiSelect,
      q.correctIndices.length > 1,
      `Multi-select flag mismatch on ${q.id}`
    );
    for (const idx of q.correctIndices) {
      assert.ok(idx >= 0 && idx < q.options.length, `Out-of-bounds answer index on ${q.id}`);
    }
    if (q.imageSrc) {
      const filePath = path.join(process.cwd(), 'public', q.imageSrc.replace(/^\//, ''));
      assert.ok(fs.existsSync(filePath), `Missing image asset for ${q.id}: ${filePath}`);
    }
  }
});

test('Quarter 1 keeps all 67 Unit 3 questions and Quarters 3-4 remain empty', () => {
  assert.equal(getNowTestQuestions(1).length, 67);
  assert.equal(getNowTestQuestions(3).length, 0);
  assert.equal(getNowTestQuestions(4).length, 0);
});
