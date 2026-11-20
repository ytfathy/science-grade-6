/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Badge } from './types.ts';

export const SCORE_MILESTONES: readonly number[] = [
  50,
  100,
  250,
  500,
  1000,
  1500,
  2500,
  5000,
  10000,
];

export type ToastKind = 'badge' | 'milestone';

export interface AppToast {
  id: string;
  kind: ToastKind;
  eyebrow: string;
  title: string;
  subtitle: string;
  createdAt: number;
}

/**
 * Returns the highest score milestone newly crossed between previousScore and nextScore,
 * or null if no milestone threshold was crossed.
 */
export function getHighestCrossedMilestone(
  previousScore: number,
  nextScore: number
): number | null {
  if (nextScore <= previousScore) return null;

  let highest: number | null = null;
  for (const milestone of SCORE_MILESTONES) {
    if (previousScore < milestone && nextScore >= milestone) {
      highest = milestone;
    }
  }
  return highest;
}

export function getMilestoneSubtitle(milestone: number): string {
  if (milestone >= 5000) return 'Master scientist momentum—phenomenal mastery!';
  if (milestone >= 1000) return 'Outstanding progress across labs and challenges!';
  if (milestone >= 250) return 'Great momentum—keep exploring and testing yourself!';
  return 'Awesome start—keep earning points in labs and quizzes!';
}

export function createBadgeToast(badge: Badge, now: number = Date.now()): AppToast {
  return {
    id: `badge_${badge.id}`,
    kind: 'badge',
    eyebrow: 'Badge Unlocked',
    title: badge.title,
    subtitle: badge.description,
    createdAt: now,
  };
}

export function createMilestoneToast(milestone: number, now: number = Date.now()): AppToast {
  return {
    id: `milestone_${milestone}`,
    kind: 'milestone',
    eyebrow: 'Score Milestone',
    title: `${milestone.toLocaleString()} Points Reached!`,
    subtitle: getMilestoneSubtitle(milestone),
    createdAt: now,
  };
}

export function enqueueToast(
  current: AppToast[],
  incoming: AppToast,
  maxItems: number = 3
): AppToast[] {
  const deduped = current.filter((item) => item.id !== incoming.id);
  const next = [...deduped, incoming];
  if (next.length <= maxItems) return next;
  return next.slice(next.length - maxItems);
}
