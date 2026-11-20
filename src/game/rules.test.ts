/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStreakMultiplier,
  calculateQuestionScore,
  calculateStars,
  calculateDensity,
  evaluateBadges,
  INITIAL_BADGES,
} from './rules.ts';

test('streak multiplier scales properly', () => {
  assert.equal(getStreakMultiplier(0), 1.0);
  assert.equal(getStreakMultiplier(1), 1.0);
  assert.equal(getStreakMultiplier(2), 1.2);
  assert.equal(getStreakMultiplier(3), 1.2);
  assert.equal(getStreakMultiplier(4), 1.5);
  assert.equal(getStreakMultiplier(5), 1.5);
  assert.equal(getStreakMultiplier(6), 2.0);
  assert.equal(getStreakMultiplier(8), 2.5);
  assert.equal(getStreakMultiplier(10), 3.0);
  assert.equal(getStreakMultiplier(15), 3.0);
});

test('calculateQuestionScore includes base and speed bonus with multiplier', () => {
  // Fast answer (0 seconds elapsed), streak 0 -> base 100 + bonus 50 = 150 * 1.0 = 150
  const fastScore = calculateQuestionScore(0, 0);
  assert.equal(fastScore.base, 100);
  assert.equal(fastScore.speedBonus, 50);
  assert.equal(fastScore.multiplier, 1.0);
  assert.equal(fastScore.total, 150);

  // Half time elapsed (10s), streak 5 (1.5x) -> base 100 + bonus 25 = 125 * 1.5 = 188
  const midScore = calculateQuestionScore(10, 5);
  assert.equal(midScore.speedBonus, 25);
  assert.equal(midScore.multiplier, 1.5);
  assert.equal(midScore.total, 188);

  // Time expired (20s) -> speedBonus 0
  const slowScore = calculateQuestionScore(20, 0);
  assert.equal(slowScore.speedBonus, 0);
  assert.equal(slowScore.total, 100);
});

test('calculateStars awards correct stars for performance', () => {
  assert.equal(calculateStars(5, 5), 3); // 100%
  assert.equal(calculateStars(4, 5), 2); // 80%
  assert.equal(calculateStars(3, 5), 1); // 60%
  assert.equal(calculateStars(2, 5), 1); // 40%
  assert.equal(calculateStars(1, 5), 0); // 20%
  assert.equal(calculateStars(0, 5), 0); // 0%
});

test('calculateDensity accurately computes mass over volume', () => {
  // 45g metal displaces 5 mL (from HMH p. 22 checkpoint question 4)
  assert.equal(calculateDensity(45, 5), 9.0);
  // 20g rock displaces 25 mL -> 0.8 g/cm³
  assert.equal(calculateDensity(20, 25), 0.8);
  // Zero volume edge case
  assert.equal(calculateDensity(10, 0), 0);
});

test('evaluateBadges unlocks streak flame on streak >= 5', () => {
  const result = evaluateBadges(INITIAL_BADGES, {
    streak: 5,
    completedLevels: {},
    interactedSims: [],
  });
  const flameBadge = result.updatedBadges.find((b) => b.id === 'streak_flame');
  assert.equal(flameBadge?.unlocked, true);
  assert.equal(result.newlyUnlocked.some((b) => b.id === 'streak_flame'), true);
});

test('evaluateBadges unlocks gallium melter on simulation interaction', () => {
  const result = evaluateBadges(INITIAL_BADGES, {
    streak: 0,
    completedLevels: {},
    interactedSims: ['gallium'],
  });
  const galliumBadge = result.updatedBadges.find((b) => b.id === 'gallium_melter');
  assert.equal(galliumBadge?.unlocked, true);
});
