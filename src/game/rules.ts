/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChapterId, TierLevel, Badge } from './types.ts';

export const BASE_QUESTION_SCORE = 100;
export const MAX_SPEED_BONUS = 50;
export const QUESTION_TIME_LIMIT_SEC = 20;

/**
 * Calculates multiplier based on current streak count:
 * 0-1: 1.0x
 * 2-3: 1.2x
 * 4-5: 1.5x
 * 6-7: 2.0x
 * 8-9: 2.5x
 * 10+: 3.0x
 */
export function getStreakMultiplier(streak: number): number {
  if (streak < 2) return 1.0;
  if (streak < 4) return 1.2;
  if (streak < 6) return 1.5;
  if (streak < 8) return 2.0;
  if (streak < 10) return 2.5;
  return 3.0;
}

/**
 * Calculates score for answering a question correctly.
 * @param timeElapsedSec Time taken to answer in seconds
 * @param streak Current consecutive streak before answering
 */
export function calculateQuestionScore(timeElapsedSec: number, streak: number): {
  base: number;
  speedBonus: number;
  multiplier: number;
  total: number;
} {
  const base = BASE_QUESTION_SCORE;
  const clampedTime = Math.max(0, Math.min(timeElapsedSec, QUESTION_TIME_LIMIT_SEC));
  const timeFactor = 1 - clampedTime / QUESTION_TIME_LIMIT_SEC;
  const speedBonus = Math.round(timeFactor * MAX_SPEED_BONUS);
  const multiplier = getStreakMultiplier(streak);
  const total = Math.round((base + speedBonus) * multiplier);

  return {
    base,
    speedBonus,
    multiplier,
    total,
  };
}

/**
 * Calculates star rating (1 to 3 stars) based on percentage of correct questions in a level
 */
export function calculateStars(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  const ratio = correctCount / totalQuestions;
  if (ratio >= 0.99) return 3;
  if (ratio >= 0.70) return 2;
  if (ratio >= 0.40) return 1;
  return 0;
}

/**
 * Density formula calculation D = m / V
 */
export function calculateDensity(massG: number, volumeCm3: number): number {
  if (volumeCm3 <= 0) return 0;
  return Math.round((massG / volumeCm3) * 100) / 100;
}

/**
 * Initial badge definitions
 */
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'matter_pioneer',
    title: 'Matter Pioneer',
    description: 'Began the scientific journey in the 3D Matter Laboratory.',
    icon: 'Atom',
    unlocked: true,
    req: 'Explore any 3D simulation',
  },
  {
    id: 'density_detective',
    title: 'Density Detective',
    description: 'Calculated density via water displacement in Chapter 1.',
    icon: 'FlaskConical',
    unlocked: false,
    req: 'Complete Chapter 1 Level 2 (Researcher)',
  },
  {
    id: 'streak_flame',
    title: 'Streak Flame',
    description: 'Ignited a 5-in-a-row correct streak combo.',
    icon: 'Flame',
    unlocked: false,
    req: 'Reach a streak of 5',
  },
  {
    id: 'thermal_master',
    title: 'Thermal Master',
    description: 'Mastered phase shifts and kinetic temperature curves.',
    icon: 'ThermometerSnowflake',
    unlocked: false,
    req: 'Complete Chapter 2 Level 1 (Apprentice)',
  },
  {
    id: 'gallium_melter',
    title: 'Gallium Melter',
    description: 'Triggered the low-melting metallic phenomenon (29.8°C).',
    icon: 'Sparkles',
    unlocked: false,
    req: 'Operate the Gallium Ingot Melting Sim',
  },
  {
    id: 'everest_physicist',
    title: 'Everest Physicist',
    description: 'Analyzed atmospheric pressure and boiling points at 8,848m.',
    icon: 'Mountain',
    unlocked: false,
    req: 'Complete Chapter 2 Level 3 (Master Chemist)',
  },
  {
    id: 'bohr_explorer',
    title: 'Bohr Explorer',
    description: 'Configured atomic electron shells and nucleus particles.',
    icon: 'Layers',
    unlocked: false,
    req: 'Operate the 3D Bohr Atom Model',
  },
  {
    id: 'moseley_heir',
    title: "Moseley's Heir",
    description: 'Scanned atomic x-ray frequencies to reveal atomic numbers.',
    icon: 'Zap',
    unlocked: false,
    req: 'Complete Chapter 3 Level 2 (Researcher)',
  },
  {
    id: 'malleable_artisan',
    title: 'Malleable Artisan',
    description: 'Hammered copper and silver metals into sheets and bowls.',
    icon: 'Hammer',
    unlocked: false,
    req: 'Operate the Malleable Metals Showcase',
  },
  {
    id: 'molecule_architect',
    title: 'Molecule Architect',
    description: 'Constructed H2O, CO2, and methane ball-and-stick models.',
    icon: 'Binary',
    unlocked: false,
    req: 'Complete Chapter 4 Level 1 (Apprentice)',
  },
  {
    id: 'diamond_crafter',
    title: 'Diamond Crafter',
    description: 'Compared 3D tetrahedral diamond cages with flaky graphite sheets.',
    icon: 'Gem',
    unlocked: false,
    req: 'Complete Chapter 4 Level 2 (Researcher)',
  },
  {
    id: 'matter_conqueror',
    title: 'Matter Conqueror',
    description: 'Mastered all 4 Chapters with 3 stars across all tiers.',
    icon: 'Trophy',
    unlocked: false,
    req: 'Earn 3 stars in all 12 Levels',
  },
];

/**
 * Check and unlock any badges based on current progress
 */
export function evaluateBadges(
  badges: Badge[],
  context: {
    streak: number;
    completedLevels: Record<string, { stars: number }>;
    interactedSims: string[];
  }
): { updatedBadges: Badge[]; newlyUnlocked: Badge[] } {
  const newlyUnlocked: Badge[] = [];
  const updatedBadges = badges.map((badge) => {
    if (badge.unlocked) return badge;

    let shouldUnlock = false;
    switch (badge.id) {
      case 'matter_pioneer':
        shouldUnlock = true;
        break;
      case 'density_detective':
        shouldUnlock = (context.completedLevels['1_researcher']?.stars ?? 0) >= 1;
        break;
      case 'streak_flame':
        shouldUnlock = context.streak >= 5;
        break;
      case 'thermal_master':
        shouldUnlock = (context.completedLevels['2_apprentice']?.stars ?? 0) >= 1;
        break;
      case 'gallium_melter':
        shouldUnlock = context.interactedSims.includes('gallium');
        break;
      case 'everest_physicist':
        shouldUnlock = (context.completedLevels['2_master']?.stars ?? 0) >= 1;
        break;
      case 'bohr_explorer':
        shouldUnlock = context.interactedSims.includes('bohr');
        break;
      case 'moseley_heir':
        shouldUnlock = (context.completedLevels['3_researcher']?.stars ?? 0) >= 1;
        break;
      case 'malleable_artisan':
        shouldUnlock = context.interactedSims.includes('metals');
        break;
      case 'molecule_architect':
        shouldUnlock = (context.completedLevels['4_apprentice']?.stars ?? 0) >= 1;
        break;
      case 'diamond_crafter':
        shouldUnlock = (context.completedLevels['4_researcher']?.stars ?? 0) >= 1;
        break;
      case 'matter_conqueror': {
        const keys = [
          '1_apprentice', '1_researcher', '1_master',
          '2_apprentice', '2_researcher', '2_master',
          '3_apprentice', '3_researcher', '3_master',
          '4_apprentice', '4_researcher', '4_master',
        ];
        shouldUnlock = keys.every((k) => (context.completedLevels[k]?.stars ?? 0) === 3);
        break;
      }
    }

    if (shouldUnlock) {
      const unlockedBadge = {
        ...badge,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedBadge);
      return unlockedBadge;
    }
    return badge;
  });

  return { updatedBadges, newlyUnlocked };
}
