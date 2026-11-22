/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { Q2_MODEL_VIDEOS, countAtoms, positionAt, captionAt, soundCues, speakable } from './q2Models.ts';

test('each Quarter 2 lesson 1–3 has a model video', () => {
  for (const id of [1, 2, 3] as const) {
    const spec = Q2_MODEL_VIDEOS[id];
    assert.equal(spec.lessonId, id);
    assert.ok(spec.duration > 20);
    assert.equal(captionAt(spec, 0), spec.captions[0]);
  }
});

test('bonds only reference atoms that exist', () => {
  for (const spec of Object.values(Q2_MODEL_VIDEOS)) {
    const ids = new Set(spec.atoms.map((a) => a.id));
    for (const b of spec.bonds) assert.ok(ids.has(b.a) && ids.has(b.b), `${spec.lessonId}: ${b.a}-${b.b}`);
  }
});

test('lesson 2 conserves atoms: 1 C, 4 H, 4 O from start to end', () => {
  const spec = Q2_MODEL_VIDEOS[2];
  for (let t = 0; t <= spec.duration; t += 0.5) assert.deepEqual(countAtoms(spec, t), { H: 4, C: 1, O: 4 }, `t=${t}`);
});

test('lesson 3 keeps the closed system at 4 H + 2 O throughout', () => {
  const spec = Q2_MODEL_VIDEOS[3];
  for (let t = 0; t <= spec.duration; t += 0.5) assert.deepEqual(countAtoms(spec, t), { H: 4, C: 0, O: 2 }, `t=${t}`);
});

test('sound cues are sorted, deduplicated and inside the video', () => {
  for (const spec of Object.values(Q2_MODEL_VIDEOS)) {
    const cues = soundCues(spec);
    assert.ok(cues.length > 0);
    cues.forEach((c, i) => {
      assert.ok(c.t >= 0 && c.t <= spec.duration);
      if (i) assert.ok(c.t >= cues[i - 1].t);
    });
    assert.equal(new Set(cues.map((c) => `${c.kind}@${c.t}`)).size, cues.length);
  }
});

test('speakable rewrites formulas for speech', () => {
  assert.equal(speakable('Products: CO₂ + 2H₂O ✓'), 'Products: CO2 plus 2H2O');
  assert.equal(speakable('2H₂O → 2H₂ + O₂'), '2H2O makes 2H2 plus O2');
});

test('positionAt holds the ends and eases between keys', () => {
  const keys: [number, [number, number, number]][] = [[1, [0, 0, 0]], [3, [2, 0, 0]]];
  assert.deepEqual(positionAt(keys, 0), [0, 0, 0]);
  assert.deepEqual(positionAt(keys, 2), [1, 0, 0]);
  assert.deepEqual(positionAt(keys, 9), [2, 0, 0]);
});
