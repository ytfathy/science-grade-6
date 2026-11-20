/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Unit4LessonId = 1 | 2 | 3;

export interface Unit4LessonMeta {
  id: Unit4LessonId;
  title: string;
  shortLabel: string;
  startSeconds: number;
  timestampLabel: string;
  durationRange: string;
  summary: string;
  keyTakeaways: string[];
}

export const UNIT4_VIDEO_SRC =
  '/assets/aistudio/Chemical_Processes_and_Equations__Tracing_Matter_and_Energy_8d18b79b.mp4';

export const UNIT4_LESSONS: Unit4LessonMeta[] = [
  {
    id: 1,
    title: 'Lesson 1: Chemical Reactions',
    shortLabel: 'Reactions',
    startSeconds: 0,
    timestampLabel: '0:00',
    durationRange: '0:00 – 2:08',
    summary:
      'Distinguish physical changes from chemical reactions and recognize observable signs of a chemical change.',
    keyTakeaways: [
      'Physical changes (melting, tearing, mixing) alter form without creating a new substance.',
      'Chemical reactions break and rearrange atomic bonds to form brand-new substances with new properties.',
      'Watch for four signs: gas bubbles, heat/light release, unexpected color changes, and precipitate solids.',
    ],
  },
  {
    id: 2,
    title: 'Lesson 2: Chemical Equations & Conservation of Mass',
    shortLabel: 'Equations',
    startSeconds: 128,
    timestampLabel: '2:08',
    durationRange: '2:08 – 4:38',
    summary:
      'Decode reactants, products, subscripts, and coefficients to balance equations and verify mass conservation.',
    keyTakeaways: [
      'Reactants appear on the left side of the arrow (→) and transform into products on the right.',
      'Subscripts belong to a chemical formula and never change; coefficients scale whole molecules to balance atoms.',
      'Law of Conservation of Mass: every atom on the reactant side (e.g., CH₄ + 2O₂ → CO₂ + 2H₂O) appears on the product side.',
    ],
  },
  {
    id: 3,
    title: 'Lesson 3: Energy in Chemical Processes',
    shortLabel: 'Energy',
    startSeconds: 278,
    timestampLabel: '4:38',
    durationRange: '4:38 – 6:23',
    summary:
      'Explore exothermic and endothermic reactions, bond energy transfers, and closed-system mass conservation.',
    keyTakeaways: [
      'Breaking existing bonds absorbs energy from the surroundings; forming new bonds releases energy.',
      'Exothermic processes (like thermite) release net thermal energy; endothermic processes absorb thermal energy.',
      'Even during dramatic energy changes, a sealed closed system keeps total mass constant before and after.',
    ],
  },
];

export function getUnit4Lesson(lessonId: number): Unit4LessonMeta {
  return UNIT4_LESSONS.find((lesson) => lesson.id === lessonId) ?? UNIT4_LESSONS[0];
}

export function getUnit4StartSeconds(lessonId: number): number {
  return getUnit4Lesson(lessonId).startSeconds;
}
