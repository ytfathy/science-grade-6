/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getHighestCrossedMilestone,
  createBadgeToast,
  createMilestoneToast,
  enqueueToast,
} from './toasts.ts';
import { INITIAL_BADGES } from './rules.ts';

test('getHighestCrossedMilestone detects crossed score thresholds accurately', () => {
  assert.equal(getHighestCrossedMilestone(0, 25), null);
  assert.equal(getHighestCrossedMilestone(25, 50), 50);
  assert.equal(getHighestCrossedMilestone(50, 75), null);
  assert.equal(getHighestCrossedMilestone(75, 100), 100);
  // Jumping across multiple milestones picks the highest one to prevent toast spam
  assert.equal(getHighestCrossedMilestone(0, 550), 500);
  // Decreasing or unchanged scores never fire milestones
  assert.equal(getHighestCrossedMilestone(250, 250), null);
  assert.equal(getHighestCrossedMilestone(300, 100), null);
});

test('createBadgeToast and createMilestoneToast produce expected fields', () => {
  const sampleBadge = INITIAL_BADGES[1];
  const badgeToast = createBadgeToast(sampleBadge, 1000);
  assert.equal(badgeToast.kind, 'badge');
  assert.equal(badgeToast.eyebrow, 'Badge Unlocked');
  assert.equal(badgeToast.title, sampleBadge.title);
  assert.equal(badgeToast.subtitle, sampleBadge.description);

  const milestoneToast = createMilestoneToast(1000, 2000);
  assert.equal(milestoneToast.kind, 'milestone');
  assert.equal(milestoneToast.eyebrow, 'Score Milestone');
  assert.equal(milestoneToast.title, '1,000 Points Reached!');
});

test('enqueueToast deduplicates by id and caps stack size', () => {
  const t1 = createMilestoneToast(50, 1);
  const t2 = createMilestoneToast(100, 2);
  const t3 = createMilestoneToast(250, 3);
  const t4 = createMilestoneToast(500, 4);

  let queue = enqueueToast([], t1, 3);
  queue = enqueueToast(queue, t1, 3);
  assert.equal(queue.length, 1);

  queue = enqueueToast(queue, t2, 3);
  queue = enqueueToast(queue, t3, 3);
  queue = enqueueToast(queue, t4, 3);
  assert.equal(queue.length, 3);
  assert.deepEqual(
    queue.map((t) => t.id),
    ['milestone_100', 'milestone_250', 'milestone_500']
  );
});
