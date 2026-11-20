/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GLOSSARY_TERMS,
  QUARTER2_GLOSSARY_TERMS,
  filterGlossary,
  getGlossaryTermsForQuarter,
} from './glossary.ts';

test('filterGlossary finds exact matches for requested key terms', () => {
  // 'density'
  const densityResults = filterGlossary(GLOSSARY_TERMS, 'density');
  assert.ok(densityResults.some((t) => t.term === 'Density'));

  // 'allotrope'
  const allotropeResults = filterGlossary(GLOSSARY_TERMS, 'allotrope');
  assert.ok(allotropeResults.some((t) => t.term === 'Allotrope'));

  // 'intermolecular force'
  const forceResults = filterGlossary(GLOSSARY_TERMS, 'intermolecular force');
  assert.ok(forceResults.some((t) => t.term === 'Intermolecular Force'));
});

test('filterGlossary is case-insensitive and trims whitespace', () => {
  const resultUpper = filterGlossary(GLOSSARY_TERMS, '  ALLOTROPE  ');
  assert.ok(resultUpper.some((t) => t.term === 'Allotrope'));
});

test('filterGlossary filters correctly by chapter', () => {
  const ch4Results = filterGlossary(GLOSSARY_TERMS, '', 4);
  assert.ok(ch4Results.every((t) => t.chapterId === 4));
  assert.ok(ch4Results.some((t) => t.term === 'Allotrope'));
  assert.ok(ch4Results.some((t) => t.term === 'Law of Definite Proportions'));
});

test('filterGlossary filters correctly by category', () => {
  const structureResults = filterGlossary(GLOSSARY_TERMS, '', 'all', 'structure');
  assert.ok(structureResults.every((t) => t.category === 'structure'));
  assert.ok(structureResults.some((t) => t.term === 'Crystal Lattice'));
});

test('Quarter 2 glossary includes all 17 study guide terms across Lessons 1-3', () => {
  const q2Terms = getGlossaryTermsForQuarter(2);
  assert.equal(q2Terms.length, 17);
  assert.equal(q2Terms, QUARTER2_GLOSSARY_TERMS);

  const l1 = filterGlossary(q2Terms, '', 1);
  const l2 = filterGlossary(q2Terms, '', 2);
  const l3 = filterGlossary(q2Terms, '', 3);
  const l4 = filterGlossary(q2Terms, '', 4);

  assert.ok(l1.some((t) => t.term === 'Physical Property'));
  assert.ok(l1.some((t) => t.term === 'Precipitate'));
  assert.ok(l2.some((t) => t.term === 'Reactants'));
  assert.ok(l2.some((t) => t.term === 'Law of Conservation of Matter'));
  assert.ok(l3.some((t) => t.term === 'Exothermic Process'));
  assert.ok(l3.some((t) => t.term === 'Reaction Rate Variables'));
  assert.equal(l4.length, 0);
  assert.equal(getGlossaryTermsForQuarter(3).length, 0);
});
