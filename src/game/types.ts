/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuarterId = 1 | 2 | 3 | 4;

export interface QuarterLessonMeta {
  id: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  available?: boolean;
  badgeLabel?: string;
}

export interface QuarterMeta {
  id: QuarterId;
  label: string;
  subtitle: string;
  available: boolean;
  labAvailable?: boolean;
  glossaryAvailable?: boolean;
  testAvailable?: boolean;
  badgeLabel?: string;
  lessons: QuarterLessonMeta[];
}

export type ChapterId = 1 | 2 | 3 | 4;

export type TierLevel = 'apprentice' | 'researcher' | 'master';

export type SimMode =
  // Chapter 1
  | 'chamber'
  | 'displacement'
  | 'diffusion'
  // Chapter 2
  | 'thermal'
  | 'gallium'
  | 'elevation'
  // Chapter 3
  | 'bohr'
  | 'moseley'
  | 'metals'
  // Chapter 4
  | 'molecules'
  | 'allotropes'
  | 'salt';

export interface Question {
  id: string;
  chapterId: ChapterId;
  tier: TierLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceRef: string; // e.g. "HMH Student Book p. 9"
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  req: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  title: string;
  score: number;
  stars: number;
  streak: number;
  isPlayer?: boolean;
}

export interface LevelProgress {
  stars: number; // 0-3
  highScore: number;
  completed: boolean;
}

export type GameState = 'title' | 'playing' | 'quiz' | 'paused' | 'victory' | 'gameover';

export interface ChapterMeta {
  id: ChapterId;
  title: string;
  subtitle: string;
  description: string;
  simModes: {
    id: SimMode;
    label: string;
    description: string;
    icon: string;
  }[];
}
