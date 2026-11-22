/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Quarter 2 (Unit 4) "3D model videos": time-driven molecule animations.
 * Everything is a pure function of time t (seconds), so the player can play, pause and scrub.
 */

import type { Unit4LessonId } from './unit4.ts';

export type Element = 'H' | 'C' | 'O';
export type Vec3 = [number, number, number];
type Key = [t: number, pos: Vec3];

export interface AtomSpec { id: string; el: Element; keys: Key[]; show: [number, number]; jiggle?: number }
export interface BondSpec { a: string; b: string; show: [number, number] }
export interface FlashSpec { t0: number; t1: number; color: number; at: Vec3; size: number }
export interface StreamSpec { t0: number; t1: number; dir: 'in' | 'out'; color: number; at: Vec3; count: number }
export interface BoxSpec { t0: number; t1: number; size: Vec3; at: Vec3; color: number }
export interface CaptionSpec { t: number; title: string; text: string }

export interface ModelVideoSpec {
  lessonId: Unit4LessonId;
  title: string;
  duration: number;
  atoms: AtomSpec[];
  bonds: BondSpec[];
  flashes: FlashSpec[];
  streams: StreamSpec[];
  boxes: BoxSpec[];
  captions: CaptionSpec[];
  /** Thermometer reading keys (0 = cold, 1 = hot); omit to hide the thermometer. */
  temperature?: [number, number][];
  showCounts?: boolean;
}

export const ATOM_STYLE: Record<Element, { color: number; radius: number }> = {
  H: { color: 0xf1f5f9, radius: 0.28 },
  C: { color: 0x3f3f46, radius: 0.42 },
  O: { color: 0xef4444, radius: 0.42 },
};

/* ---------- math ---------- */
export const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export function positionAt(keys: Key[], t: number): Vec3 {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, p1] = keys[i];
    if (t <= t1) {
      const [t0, p0] = keys[i - 1];
      const k = smooth((t - t0) / (t1 - t0 || 1));
      return [p0[0] + (p1[0] - p0[0]) * k, p0[1] + (p1[1] - p0[1]) * k, p0[2] + (p1[2] - p0[2]) * k];
    }
  }
  return keys[keys.length - 1][1];
}

/** 0..1 visibility with a short fade at both ends of the window. */
export function visibility([from, to]: [number, number], t: number, fade = 0.5): number {
  if (t < from || t > to) return 0;
  const fadeIn = from <= 0 ? 1 : (t - from) / fade;
  const fadeOut = to >= FOREVER ? 1 : (to - t) / fade;
  return Math.min(1, fadeIn, fadeOut);
}

export function valueAt(keys: [number, number][], t: number): number {
  return positionAt(keys.map(([kt, v]) => [kt, [v, 0, 0]] as Key), t)[0];
}

/** Atoms present (fully faded in) at time t, counted by element. */
export function countAtoms(spec: ModelVideoSpec, t: number): Record<Element, number> {
  const out: Record<Element, number> = { H: 0, C: 0, O: 0 };
  spec.atoms.forEach((a) => { if (visibility(a.show, t) > 0.5) out[a.el]++; });
  return out;
}

export function captionAt(spec: ModelVideoSpec, t: number): CaptionSpec {
  let c = spec.captions[0];
  for (const cap of spec.captions) if (t >= cap.t) c = cap;
  return c;
}

export type SoundCue = { t: number; kind: 'break' | 'form' | 'flash' | 'energyIn' | 'energyOut' };

/** Sound effect moments derived from the animation: bonds breaking/forming, flashes, energy flowing in/out. */
export function soundCues(spec: ModelVideoSpec): SoundCue[] {
  const cues = new Map<string, SoundCue>();
  const add = (t: number, kind: SoundCue['kind']) => cues.set(`${kind}@${t.toFixed(1)}`, { t, kind });
  for (const b of spec.bonds) {
    if (b.show[0] > 0) add(b.show[0], 'form');
    if (b.show[1] < FOREVER) add(b.show[1], 'break');
  }
  for (const f of spec.flashes) add(f.t0, 'flash');
  for (const s of spec.streams) add(s.t0, s.dir === 'in' ? 'energyIn' : 'energyOut');
  return [...cues.values()].sort((a, b) => a.t - b.t);
}

/** Caption text rewritten so speech synthesis reads formulas and symbols sensibly. */
export function speakable(text: string): string {
  return text
    .replace(/₂/g, '2').replace(/₄/g, '4')
    .replace(/→/g, ' makes ')
    .replace(/\s\+\s/g, ' plus ')
    .replace(/[🔥❄✓]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ---------- molecule shapes (local offsets) ---------- */
const WATER: Record<'O' | 'H1' | 'H2', Vec3> = { O: [0, 0.15, 0], H1: [-0.62, -0.38, 0], H2: [0.62, -0.38, 0] };
const H2: Vec3[] = [[-0.37, 0, 0], [0.37, 0, 0]];
const O2: Vec3[] = [[-0.6, 0, 0], [0.6, 0, 0]];
const CH4: Vec3[] = [[0.6, 0.6, 0.6], [-0.6, -0.6, 0.6], [-0.6, 0.6, -0.6], [0.6, -0.6, -0.6]];
const CO2: Vec3[] = [[-1.15, 0, 0], [1.15, 0, 0]];
const FOREVER = 1e6;

/* Builder: atoms are placed per "pose" (time + world position) so molecules can move and rearrange. */
class Scene {
  atoms: AtomSpec[] = [];
  bonds: BondSpec[] = [];
  atom(id: string, el: Element, show: [number, number], keys: Key[], jiggle = 0) {
    this.atoms.push({ id, el, keys, show, jiggle });
  }
  bond(a: string, b: string, show: [number, number]) {
    this.bonds.push({ a, b, show });
  }
}

/* ---------- Lesson 1: physical change vs chemical reaction ---------- */
function lesson1(): ModelVideoSpec {
  const s = new Scene();
  // Part A (0–11 s): ice melts. Water molecules stay whole → physical change.
  const ice: Vec3[] = [];
  for (let x = 0; x < 3; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) ice.push([(x - 1) * 1.7, (y - 0.5) * 1.6, (z - 0.5) * 1.7]);
  const liquid: Vec3[] = [[-2.6, -1.2, 0.6], [-1.2, -1.5, -1], [0.2, -1.1, 0.9], [1.6, -1.4, -0.4], [2.7, -1.0, 0.8], [-2.0, -0.2, -0.9],
    [-0.6, -0.3, 0.3], [0.9, -0.2, -1.2], [2.3, 0.0, 0.1], [-1.5, 0.6, 0.7], [0.3, 0.7, -0.5], [1.8, 0.9, 1.0]];
  ice.forEach((p, i) => {
    const keys = (off: Vec3): Key[] => [[0, add(p, off)], [3, add(p, off)], [8, add(liquid[i], off)]];
    const show: [number, number] = [0, 11];
    s.atom(`w${i}O`, 'O', show, keys(WATER.O), 0.06);
    s.atom(`w${i}H1`, 'H', show, keys(WATER.H1), 0.06);
    s.atom(`w${i}H2`, 'H', show, keys(WATER.H2), 0.06);
    s.bond(`w${i}O`, `w${i}H1`, show);
    s.bond(`w${i}O`, `w${i}H2`, show);
  });

  // Part B (11–32 s): 2H₂ + O₂ → 2H₂O. Bonds break, atoms rearrange, new substance forms.
  const show: [number, number] = [11, FOREVER];
  const hA: Vec3 = [-3, 0.9, 0], hB: Vec3 = [-3, -0.9, 0], o: Vec3 = [2.6, 0, 0];
  const mid: Record<string, Vec3> = { h1: [-1.6, 1.5, 0.6], h2: [-1.2, 0.4, -0.8], h3: [-1.5, -0.7, 0.7], h4: [-1.1, -1.6, -0.5], o1: [1.0, 0.9, 0.3], o2: [1.2, -0.9, -0.3] };
  const w1: Vec3 = [-1.6, 0, 0], w2: Vec3 = [1.6, 0, 0];
  const atom = (id: string, el: Element, start: Vec3, end: Vec3) =>
    s.atom(id, el, show, [[11, start], [16, start], [19.5, mid[id]], [24, end]], 0.05);
  atom('h1', 'H', add(hA, H2[0]), add(w1, WATER.H1));
  atom('h2', 'H', add(hA, H2[1]), add(w1, WATER.H2));
  atom('h3', 'H', add(hB, H2[0]), add(w2, WATER.H1));
  atom('h4', 'H', add(hB, H2[1]), add(w2, WATER.H2));
  atom('o1', 'O', add(o, O2[0]), add(w1, WATER.O));
  atom('o2', 'O', add(o, O2[1]), add(w2, WATER.O));
  s.bond('h1', 'h2', [11, 17]);
  s.bond('h3', 'h4', [11, 17]);
  s.bond('o1', 'o2', [11, 17]);
  for (const [a, b] of [['o1', 'h1'], ['o1', 'h2'], ['o2', 'h3'], ['o2', 'h4']]) s.bond(a, b, [23.5, FOREVER]);

  return {
    lessonId: 1,
    title: 'Physical Change vs Chemical Reaction',
    duration: 32,
    atoms: s.atoms,
    bonds: s.bonds,
    boxes: [{ t0: 0, t1: 4, size: [6.2, 4, 4.2], at: [0, 0, 0], color: 0x7dd3fc }],
    flashes: [{ t0: 23.5, t1: 27.5, color: 0xfbbf24, at: [0, 0, 0], size: 2.6 }],
    streams: [{ t0: 23.5, t1: 29, dir: 'out', color: 0xf97316, at: [0, 0, 0], count: 40 }],
    temperature: [[0, 0.15], [8, 0.4], [11, 0.4], [23, 0.4], [26, 0.95], [32, 0.8]],
    captions: [
      { t: 0, title: 'Ice: a solid', text: 'Water molecules (H₂O) are locked in a frozen pattern.' },
      { t: 3, title: 'Physical change: melting', text: 'Heat makes the molecules move apart and flow…' },
      { t: 8, title: 'Still H₂O!', text: 'Every molecule is still H₂O. No new substance, so this is only a PHYSICAL change.' },
      { t: 11, title: 'Reactants: 2H₂ + O₂', text: 'Now two hydrogen molecules (white) meet one oxygen molecule (red).' },
      { t: 16, title: 'Bonds break', text: 'The bonds holding H₂ and O₂ together break apart.' },
      { t: 19.5, title: 'Atoms rearrange', text: 'The same atoms move into new partners…' },
      { t: 23.5, title: 'New substance: 2H₂O', text: 'New bonds form water, with heat & light given off. That is a CHEMICAL reaction!' },
    ],
  };
}

/* ---------- Lesson 2: CH₄ + 2O₂ → CO₂ + 2H₂O, conservation of mass ---------- */
function lesson2(): ModelVideoSpec {
  const s = new Scene();
  const show: [number, number] = [0, FOREVER];
  const ch4: Vec3 = [-3.2, 0, 0], o2a: Vec3 = [1.6, 1.1, 0], o2b: Vec3 = [1.6, -1.1, 0];
  const co2: Vec3 = [-2.4, 0, 0], wa: Vec3 = [1.8, 1.0, 0], wb: Vec3 = [1.8, -1.2, 0];
  const cloud = (i: number): Vec3 => [Math.cos(i * 2.1) * 1.6, Math.sin(i * 1.7) * 1.4, Math.sin(i * 2.9) * 1.2];
  const atom = (id: string, el: Element, start: Vec3, end: Vec3, i: number) =>
    s.atom(id, el, show, [[0, start], [9, start], [13, cloud(i)], [18, cloud(i)], [22, end]], 0.05);
  atom('c', 'C', ch4, add(co2, [0, 0, 0]), 0);
  CH4.forEach((h, i) => atom(`h${i}`, 'H', add(ch4, h), add(i < 2 ? wa : wb, i % 2 ? WATER.H2 : WATER.H1), i + 1));
  atom('o0', 'O', add(o2a, O2[0]), add(co2, CO2[0]), 5);
  atom('o1', 'O', add(o2a, O2[1]), add(co2, CO2[1]), 6);
  atom('o2', 'O', add(o2b, O2[0]), add(wa, WATER.O), 7);
  atom('o3', 'O', add(o2b, O2[1]), add(wb, WATER.O), 8);
  for (let i = 0; i < 4; i++) s.bond('c', `h${i}`, [0, 10]);
  s.bond('o0', 'o1', [0, 10]);
  s.bond('o2', 'o3', [0, 10]);
  for (const [a, b] of [['c', 'o0'], ['c', 'o1'], ['o2', 'h0'], ['o2', 'h1'], ['o3', 'h2'], ['o3', 'h3']]) s.bond(a, b, [21.5, FOREVER]);

  return {
    lessonId: 2,
    title: 'Balancing CH₄ + 2O₂ → CO₂ + 2H₂O',
    duration: 34,
    atoms: s.atoms,
    bonds: s.bonds,
    boxes: [],
    flashes: [{ t0: 21.5, t1: 24.5, color: 0x38bdf8, at: [0, 0, 0], size: 2.2 }],
    streams: [],
    showCounts: true,
    captions: [
      { t: 0, title: 'Reactants: CH₄ + 2O₂', text: 'One methane molecule (black carbon, white hydrogens) and TWO oxygen molecules.' },
      { t: 4, title: 'Coefficient vs subscript', text: 'The 2 in front of O₂ is a coefficient: two whole molecules. The small ₂ is a subscript: two O atoms in each.' },
      { t: 9, title: 'Bonds break', text: 'All the bonds break. Watch the atom counter: nothing disappears.' },
      { t: 15, title: 'Same atoms, new partners', text: 'Atoms are only rearranged, never created or destroyed.' },
      { t: 21.5, title: 'Products: CO₂ + 2H₂O', text: 'One carbon dioxide and TWO water molecules form.' },
      { t: 26, title: 'Conservation of mass ✓', text: 'Left: 1 C, 4 H, 4 O. Right: 1 C, 4 H, 4 O. Balanced, so mass of reactants = mass of products.' },
    ],
  };
}

/* ---------- Lesson 3: energy in reactions (exothermic then endothermic) ---------- */
function lesson3(): ModelVideoSpec {
  const s = new Scene();
  const show: [number, number] = [0, FOREVER];
  const hA: Vec3 = [-2.4, 0.9, 0], hB: Vec3 = [-2.4, -0.9, 0], o: Vec3 = [2.2, 0, 0];
  const w1: Vec3 = [-1.3, 0, 0], w2: Vec3 = [1.3, 0, 0];
  const apart: Record<string, Vec3> = { h1: [-2.2, 1.6, 0.8], h2: [-1.0, 1.4, -0.9], h3: [-2.0, -1.5, -0.7], h4: [-0.8, -1.6, 0.9], o1: [1.4, 1.0, 0.4], o2: [1.6, -1.0, -0.4] };
  // Forward (exothermic) 0–19 s, then reverse (endothermic) 19–38 s back to H₂ + O₂.
  const atom = (id: string, el: Element, start: Vec3, end: Vec3) =>
    s.atom(id, el, show, [[0, start], [4, start], [8, apart[id]], [12, end], [21, end], [26, apart[id]], [31, start]], 0.05);
  atom('h1', 'H', add(hA, H2[0]), add(w1, WATER.H1));
  atom('h2', 'H', add(hA, H2[1]), add(w1, WATER.H2));
  atom('h3', 'H', add(hB, H2[0]), add(w2, WATER.H1));
  atom('h4', 'H', add(hB, H2[1]), add(w2, WATER.H2));
  atom('o1', 'O', add(o, O2[0]), add(w1, WATER.O));
  atom('o2', 'O', add(o, O2[1]), add(w2, WATER.O));
  for (const [a, b] of [['h1', 'h2'], ['h3', 'h4'], ['o1', 'o2']]) { s.bond(a, b, [0, 6]); s.bond(a, b, [30.5, FOREVER]); }
  for (const [a, b] of [['o1', 'h1'], ['o1', 'h2'], ['o2', 'h3'], ['o2', 'h4']]) s.bond(a, b, [11.5, 23]);

  return {
    lessonId: 3,
    title: 'Exothermic vs Endothermic',
    duration: 38,
    atoms: s.atoms,
    bonds: s.bonds,
    boxes: [{ t0: 0, t1: FOREVER, size: [7.4, 5, 4.6], at: [0, 0, 0], color: 0xa5b4fc }],
    flashes: [{ t0: 11.5, t1: 15, color: 0xf97316, at: [0, 0, 0], size: 2.4 }],
    streams: [
      { t0: 4, t1: 8, dir: 'in', color: 0x38bdf8, at: [0, 0, 0], count: 18 },
      { t0: 11.5, t1: 17, dir: 'out', color: 0xf97316, at: [0, 0, 0], count: 48 },
      { t0: 21, t1: 28, dir: 'in', color: 0x38bdf8, at: [0, 0, 0], count: 48 },
      { t0: 30.5, t1: 33, dir: 'out', color: 0xf97316, at: [0, 0, 0], count: 14 },
    ],
    temperature: [[0, 0.5], [4, 0.5], [8, 0.45], [12, 0.5], [16, 0.9], [21, 0.85], [28, 0.2], [33, 0.22], [38, 0.22]],
    showCounts: true,
    captions: [
      { t: 0, title: 'A closed system', text: 'H₂ and O₂ inside a sealed box: nothing gets in or out.' },
      { t: 4, title: 'Breaking bonds ABSORBS energy', text: 'A little energy (blue) flows in to break the old bonds.' },
      { t: 11.5, title: 'Forming bonds RELEASES energy', text: 'Making water bonds gives out MORE energy (orange) than was taken in.' },
      { t: 15, title: 'Exothermic 🔥', text: 'Net energy is released, so the surroundings get hotter (watch the thermometer).' },
      { t: 21, title: 'Now the reverse: 2H₂O → 2H₂ + O₂', text: 'Lots of energy (blue) must flow IN to break the strong water bonds.' },
      { t: 28, title: 'Endothermic ❄', text: 'Net energy is absorbed, so the surroundings get colder.' },
      { t: 33, title: 'Mass stays the same', text: 'Hot or cold, the atom count never changed: total mass in a closed system is constant.' },
    ],
  };
}

export const Q2_MODEL_VIDEOS: Record<Unit4LessonId, ModelVideoSpec> = { 1: lesson1(), 2: lesson2(), 3: lesson3() };
