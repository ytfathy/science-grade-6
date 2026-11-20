/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChapterId, QuarterId } from './types.ts';

export type GlossaryCategory =
  | 'property'
  | 'state'
  | 'atom'
  | 'structure'
  | 'reaction'
  | 'equation'
  | 'energy';

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  chapterId: ChapterId;
  category: GlossaryCategory;
  textbookRef: string;
  example: string;
  relatedTerms?: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Chapter 1
  {
    id: 'matter',
    term: 'Matter',
    definition: 'Anything that has mass and takes up space. All physical living and nonliving things are composed of matter.',
    chapterId: 1,
    category: 'property',
    textbookRef: 'HMH p. 6',
    example: 'Basketballs, water, rocks, and the air around you are matter. Sunlight, heat, and sound are energy, not matter.',
    relatedTerms: ['mass', 'volume', 'density'],
  },
  {
    id: 'mass',
    term: 'Mass',
    definition: 'A measure of the amount of matter in an object. Objects made of more matter have a greater mass.',
    chapterId: 1,
    category: 'property',
    textbookRef: 'HMH p. 7',
    example: 'Measured on a balance in grams (g) or kilograms (kg). A bowling ball has greater mass than a beach ball even if the beach ball is larger.',
    relatedTerms: ['matter', 'volume', 'density'],
  },
  {
    id: 'volume',
    term: 'Volume',
    definition: 'A measure of the amount of space that an object occupies (its three-dimensional size).',
    chapterId: 1,
    category: 'property',
    textbookRef: 'HMH p. 8',
    example: 'Units include cubic centimeters (cm³) and milliliters (mL). Calculated for rectangular prisms using V = length × width × height.',
    relatedTerms: ['mass', 'density', 'displacement'],
  },
  {
    id: 'displacement',
    term: 'Displacement',
    definition: 'A method used to measure the volume of irregular objects by recording the volume of liquid moved out of the way when the object is submerged.',
    chapterId: 1,
    category: 'property',
    textbookRef: 'HMH p. 9',
    example: 'Submerging a 20g rock into 50 mL of water raises the meniscus to 75 mL, showing the rock has a displaced volume of 25 mL.',
    relatedTerms: ['volume', 'density'],
  },
  {
    id: 'density',
    term: 'Density',
    definition: 'A characteristic property defined as the ratio of the mass of a substance to its volume: D = m / V.',
    chapterId: 1,
    category: 'property',
    textbookRef: 'HMH p. 9',
    example: 'Pure copper always has a density of 8.93 g/cm³. Pouring out half a glass of water decreases mass and volume, but the density remains 1.0 g/mL.',
    relatedTerms: ['mass', 'volume', 'displacement'],
  },
  {
    id: 'physical_property',
    term: 'Physical Property',
    definition: 'A characteristic of a substance that can be observed or measured without changing the chemical identity of the substance.',
    chapterId: 1,
    category: 'property',
    textbookRef: 'HMH p. 10',
    example: 'Color, luster, texture, state of matter, melting point, volume, mass, and density.',
    relatedTerms: ['chemical_property', 'density'],
  },
  {
    id: 'chemical_property',
    term: 'Chemical Property',
    definition: 'A characteristic describing a substance’s ability to participate in chemical reactions and transform into new substances with different properties.',
    chapterId: 1,
    category: 'property',
    textbookRef: 'HMH p. 11',
    example: 'Flammability (ability of wood to burn in oxygen) and reactivity with acids or oxygen.',
    relatedTerms: ['physical_property'],
  },
  {
    id: 'intermolecular_force',
    term: 'Intermolecular Force',
    definition: 'The attractive forces that exist between neighboring particles (atoms or molecules), pulling them close together.',
    chapterId: 1,
    category: 'state',
    textbookRef: 'HMH p. 15, 17',
    example: 'Strong attractive forces hold solid particles locked in regular crystal lattices, while gas particles have enough kinetic energy to completely overcome these forces.',
    relatedTerms: ['kinetic_energy', 'states_of_matter'],
  },
  {
    id: 'kinetic_energy',
    term: 'Kinetic Energy',
    definition: 'The energy an object or particle possesses due to its motion. Faster moving particles have greater kinetic energy.',
    chapterId: 1,
    category: 'state',
    textbookRef: 'HMH p. 16',
    example: 'Particles in a gas move rapidly and have the highest kinetic energy, while particles in a solid only vibrate in place and have the lowest kinetic energy.',
    relatedTerms: ['thermal_energy', 'temperature', 'intermolecular_force'],
  },
  {
    id: 'states_of_matter',
    term: 'States of Matter',
    definition: 'The distinct physical forms that matter can take: solid (fixed shape and volume), liquid (fixed volume, variable shape), and gas (variable shape and volume).',
    chapterId: 1,
    category: 'state',
    textbookRef: 'HMH p. 12, 14',
    example: 'Water can exist as solid ice, liquid water, or water vapor gas, all made of identical H2O molecules.',
    relatedTerms: ['solid', 'liquid', 'gas', 'intermolecular_force'],
  },

  // Chapter 2
  {
    id: 'thermal_energy',
    term: 'Thermal Energy',
    definition: 'The total kinetic energy of all the moving particles within a given sample of matter.',
    chapterId: 2,
    category: 'state',
    textbookRef: 'HMH p. 29',
    example: 'Adding thermal energy from a Bunsen burner speeds up water particles, eventually driving phase transitions from solid to liquid and gas.',
    relatedTerms: ['temperature', 'kinetic_energy'],
  },
  {
    id: 'temperature',
    term: 'Temperature',
    definition: 'A direct measure of the average kinetic energy of the individual particles in a substance.',
    chapterId: 2,
    category: 'state',
    textbookRef: 'HMH p. 29',
    example: 'When ice warms from -10°C to 0°C, the average speed and vibration of the water molecules increases.',
    relatedTerms: ['thermal_energy', 'melting_point', 'boiling_point'],
  },
  {
    id: 'melting_point',
    term: 'Melting Point',
    definition: 'The specific temperature at which a pure solid absorbs sufficient thermal energy to change into a liquid.',
    chapterId: 2,
    category: 'state',
    textbookRef: 'HMH p. 29',
    example: 'Water melts at 0°C at sea level. Gallium metal has an unusually low melting point of 29.8°C, liquefying in a warm hand.',
    relatedTerms: ['freezing_point', 'boiling_point'],
  },
  {
    id: 'boiling_point',
    term: 'Boiling Point',
    definition: 'The temperature at which vapor bubbles rapidly form throughout a liquid as it transforms into a gas.',
    chapterId: 2,
    category: 'state',
    textbookRef: 'HMH p. 29, 38',
    example: 'Pure water boils at 100°C at sea level (1.0 atm), but drops to 76.5°C on the summit of Mount Everest (0.31 atm).',
    relatedTerms: ['melting_point', 'pressure', 'evaporation'],
  },
  {
    id: 'sublimation',
    term: 'Sublimation',
    definition: 'The phase change in which a solid transforms directly into a gas without passing through the liquid phase.',
    chapterId: 2,
    category: 'state',
    textbookRef: 'HMH p. 86',
    example: 'Dry ice (solid carbon dioxide, CO2) sublimates directly into gas at room temperature, causing a sealed balloon to inflate.',
    relatedTerms: ['condensation', 'evaporation'],
  },
  {
    id: 'condensation',
    term: 'Condensation',
    definition: 'The phase change in which gas particles lose thermal energy and transition into a liquid.',
    chapterId: 2,
    category: 'state',
    textbookRef: 'HMH p. 34',
    example: 'Water droplets forming on the cold exterior of an iced glass as warm water vapor from the air cools upon contact.',
    relatedTerms: ['evaporation', 'sublimation'],
  },
  {
    id: 'pressure',
    term: 'Pressure',
    definition: 'The force exerted per unit area by gas particles continuously colliding against surfaces.',
    chapterId: 2,
    category: 'state',
    textbookRef: 'HMH p. 37, 38',
    example: 'Atmospheric pressure decreases with altitude because fewer air particles exist above in the column, reducing boiling points.',
    relatedTerms: ['boiling_point'],
  },

  // Chapter 3
  {
    id: 'element',
    term: 'Element',
    definition: 'A fundamental pure substance that cannot be broken down or separated into simpler substances by chemical or physical means.',
    chapterId: 3,
    category: 'atom',
    textbookRef: 'HMH p. 48',
    example: 'Oxygen, carbon, copper, gold, and iron are elements. 118 elements are organized on the periodic table.',
    relatedTerms: ['atom', 'compound', 'periodic_table'],
  },
  {
    id: 'atom',
    term: 'Atom',
    definition: 'The smallest individual unit of a chemical element that preserves the unique chemical identity and properties of that element.',
    chapterId: 3,
    category: 'atom',
    textbookRef: 'HMH p. 49',
    example: 'An atom measures less than 1 nanometer (10⁻¹⁰ m) in diameter. A tiny 0.9 mg grain of iron contains ~1 × 10¹⁸ atoms.',
    relatedTerms: ['element', 'atomic_number', 'nucleus'],
  },
  {
    id: 'atomic_number',
    term: 'Atomic Number',
    definition: 'The unique whole number of protons in an atom’s nucleus, defining which chemical element it is.',
    chapterId: 3,
    category: 'atom',
    textbookRef: 'HMH p. 52, 57',
    example: 'Hydrogen has atomic number 1, Carbon has 6, Cobalt has 27, and Nickel has 28.',
    relatedTerms: ['atom', 'periodic_table', 'moseley_law'],
  },
  {
    id: 'periodic_table',
    term: 'Periodic Table',
    definition: 'The systematic tabular arrangement of all 118 chemical elements ordered by increasing atomic number and grouped by recurring properties.',
    chapterId: 3,
    category: 'atom',
    textbookRef: 'HMH p. 52-55',
    example: 'Vertical columns are called groups (similar properties); horizontal rows are called periods.',
    relatedTerms: ['atomic_number', 'element', 'group'],
  },
  {
    id: 'malleability',
    term: 'Malleability',
    definition: 'A physical property of metals allowing them to be hammered, rolled, or pressed into thin sheets and bowls without cracking.',
    chapterId: 3,
    category: 'property',
    textbookRef: 'HMH p. 44, 45',
    example: 'Copper and silver are highly malleable because their metallic crystal atoms slide past one another in sheets under impact.',
    relatedTerms: ['physical_property', 'element'],
  },

  // Chapter 4
  {
    id: 'molecule',
    term: 'Molecule',
    definition: 'A group of two or more atoms held tightly together in a specific geometric arrangement by attractive chemical bonds.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 65',
    example: 'Oxygen gas (O2) is a diatomic molecule; water (H2O) is a bent triatomic molecule.',
    relatedTerms: ['compound', 'chemical_bond', 'atom'],
  },
  {
    id: 'compound',
    term: 'Compound',
    definition: 'A pure chemical substance composed of two or more different elements chemically bonded in a fixed, definite ratio.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 66',
    example: 'Water (H2O, 2:1 hydrogen-to-oxygen ratio) and carbon dioxide (CO2, 1:2 carbon-to-oxygen ratio).',
    relatedTerms: ['molecule', 'pure_substance', 'definite_proportions'],
  },
  {
    id: 'chemical_bond',
    term: 'Chemical Bond',
    definition: 'The attractive electrical force that holds atoms together to form molecules or extended crystalline structures.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 65',
    example: 'Represented as sticks in ball-and-stick models connecting atom spheres.',
    relatedTerms: ['molecule', 'compound'],
  },
  {
    id: 'allotrope',
    term: 'Allotrope',
    definition: 'Different structural forms of the exact same chemical element in the same physical state, resulting in vastly different physical properties.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 62, 75',
    example: 'Diamond and graphite are allotropes of pure carbon. Diamond is an interlocking 3D tetrahedral cage (extreme hardness); graphite is stacked 2D hexagonal sheets that slide off onto paper.',
    relatedTerms: ['extended_structure', 'crystal_lattice'],
  },
  {
    id: 'extended_structure',
    term: 'Extended Structure',
    definition: 'A continuous, repeating 3D network of atoms or ions that forms a solid crystal rather than isolated individual small molecules.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 65, 71',
    example: 'Table salt (NaCl) and quartz (SiO2) form extended lattices where millions of atoms repeat in an orderly cubic framework.',
    relatedTerms: ['crystal_lattice', 'allotrope'],
  },
  {
    id: 'crystal_lattice',
    term: 'Crystal Lattice',
    definition: 'The regular, repeating 3-dimensional geometric pattern in which atoms or ions are arranged throughout an extended solid crystal.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 70-72',
    example: 'Table salt forms a face-centered cubic lattice where each Na⁺ ion is surrounded octahedrally by 6 Cl⁻ ions (6-fold coordination).',
    relatedTerms: ['extended_structure', 'allotrope'],
  },
  {
    id: 'definite_proportions',
    term: 'Law of Definite Proportions',
    definition: 'A fundamental chemical law formulated by Joseph Proust stating that any given pure compound always contains exactly the same elements in fixed proportions by mass.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 77',
    example: 'Sodium chloride (NaCl) is always composed of 39% sodium and 61% chlorine by mass regardless of source or sample size.',
    relatedTerms: ['compound', 'pure_substance'],
  },
  {
    id: 'macromolecule',
    term: 'Macromolecule',
    definition: 'A very large complex molecule made of thousands of atoms, often composed of repeating chemical subunits called monomers.',
    chapterId: 4,
    category: 'structure',
    textbookRef: 'HMH p. 73',
    example: 'Polyvinyl chloride (PVC plastic chains) and Deoxyribonucleic acid (DNA).',
    relatedTerms: ['molecule', 'compound'],
  },
];

export const QUARTER2_GLOSSARY_TERMS: GlossaryTerm[] = [
  // Quarter 2 · Unit 4 · Lesson 1: Chemical Reactions (HMH pp. 4–19)
  {
    id: 'q2_physical_property',
    term: 'Physical Property',
    definition: 'Characteristic observable or measurable without altering the chemical identity of the substance.',
    chapterId: 1,
    category: 'property',
    textbookRef: 'Unit 4 · Lesson 1 (HMH pp. 4–19)',
    example: 'Density, melting point, boiling point, color, texture, solubility, odor.',
    relatedTerms: ['q2_chemical_property', 'q2_physical_change'],
  },
  {
    id: 'q2_chemical_property',
    term: 'Chemical Property',
    definition: "Describes a substance's ability or inability to undergo a change that alters its chemical composition.",
    chapterId: 1,
    category: 'property',
    textbookRef: 'Unit 4 · Lesson 1 (HMH pp. 4–19)',
    example: 'Flammability, reactivity with oxygen/water (e.g., rusting vs. non-rusting nails).',
    relatedTerms: ['q2_physical_property', 'q2_chemical_reaction'],
  },
  {
    id: 'q2_physical_change',
    term: 'Physical Change',
    definition: 'A change in appearance, size, shape, or state of matter without changing substance identity.',
    chapterId: 1,
    category: 'reaction',
    textbookRef: 'Unit 4 · Lesson 1 (HMH pp. 4–19)',
    example: 'Ice melting into liquid water, sawing wood, boiling water, dissolving salt.',
    relatedTerms: ['q2_chemical_reaction', 'q2_physical_property'],
  },
  {
    id: 'q2_chemical_reaction',
    term: 'Chemical Reaction',
    definition: 'Process in which atoms are rearranged through bond breaking and forming to yield new substances.',
    chapterId: 1,
    category: 'reaction',
    textbookRef: 'Unit 4 · Lesson 1 (HMH pp. 4–19)',
    example: 'Baking soda + vinegar producing CO₂; thermite reaction; cellular respiration.',
    relatedTerms: ['q2_reactants', 'q2_products', 'q2_precipitate'],
  },
  {
    id: 'q2_precipitate',
    term: 'Precipitate',
    definition: 'A solid insoluble substance that forms and separates from a liquid solution during a reaction.',
    chapterId: 1,
    category: 'reaction',
    textbookRef: 'Unit 4 · Lesson 1 (HMH pp. 4–19)',
    example: 'Yellow lead iodide (PbI₂) forming from mixing clear Pb(NO₃)₂ and NaI.',
    relatedTerms: ['q2_chemical_reaction', 'q2_products'],
  },

  // Quarter 2 · Unit 4 · Lesson 2: Chemical Equations (HMH pp. 20–39)
  {
    id: 'q2_reactants',
    term: 'Reactants',
    definition: 'The starting original substance(s) entering into a chemical reaction (written left of the arrow).',
    chapterId: 2,
    category: 'equation',
    textbookRef: 'Unit 4 · Lesson 2 (HMH pp. 20–39)',
    example: 'CH₄ and O₂ in methane combustion; Fe₂O₃ and Al in thermite.',
    relatedTerms: ['q2_products', 'q2_chemical_reaction', 'q2_conservation_of_matter'],
  },
  {
    id: 'q2_products',
    term: 'Products',
    definition: 'The resulting new substance(s) formed during a chemical reaction (written right of the arrow).',
    chapterId: 2,
    category: 'equation',
    textbookRef: 'Unit 4 · Lesson 2 (HMH pp. 20–39)',
    example: 'CO₂ and H₂O in combustion; Fe and Al₂O₃ in thermite.',
    relatedTerms: ['q2_reactants', 'q2_chemical_reaction', 'q2_conservation_of_matter'],
  },
  {
    id: 'q2_chemical_formula',
    term: 'Chemical Formula',
    definition: 'Shorthand representation of a substance showing element symbols and atom ratios.',
    chapterId: 2,
    category: 'equation',
    textbookRef: 'Unit 4 · Lesson 2 (HMH pp. 20–39)',
    example: 'H₂O (2 hydrogen, 1 oxygen); H₂SO₄; Al₂(SO₄)₃.',
    relatedTerms: ['q2_subscript', 'q2_coefficient'],
  },
  {
    id: 'q2_subscript',
    term: 'Subscript',
    definition: 'Small number written below and to the right of an element symbol indicating atom count.',
    chapterId: 2,
    category: 'equation',
    textbookRef: 'Unit 4 · Lesson 2 (HMH pp. 20–39)',
    example: "The '2' in H₂O. Subscripts are fixed and cannot be changed when balancing.",
    relatedTerms: ['q2_chemical_formula', 'q2_coefficient'],
  },
  {
    id: 'q2_coefficient',
    term: 'Coefficient',
    definition: 'Number placed in front of a formula indicating how many molecules/units participate.',
    chapterId: 2,
    category: 'equation',
    textbookRef: 'Unit 4 · Lesson 2 (HMH pp. 20–39)',
    example: "The '2' in 2HCl or 2H₂O. Multiplies all atoms in that compound.",
    relatedTerms: ['q2_subscript', 'q2_chemical_formula', 'q2_conservation_of_matter'],
  },
  {
    id: 'q2_conservation_of_matter',
    term: 'Law of Conservation of Matter',
    definition: 'Matter is neither created nor destroyed in ordinary chemical or physical changes.',
    chapterId: 2,
    category: 'equation',
    textbookRef: 'Unit 4 · Lesson 2 (HMH pp. 20–39)',
    example: 'Total mass of reactants = total mass of products; atom counts must balance.',
    relatedTerms: ['q2_reactants', 'q2_products', 'q2_coefficient'],
  },

  // Quarter 2 · Unit 4 · Lesson 3: Thermal Energy and Chemical Processes (HMH pp. 40–59)
  {
    id: 'q2_system',
    term: 'System',
    definition: 'A defined set of interacting parts, matter, energy, and information studied together.',
    chapterId: 3,
    category: 'energy',
    textbookRef: 'Unit 4 · Lesson 3 (HMH pp. 40–59)',
    example: 'Chemical reaction inside an insulated flask or a cold pack against an injured leg.',
    relatedTerms: ['q2_thermal_energy_heat', 'q2_exothermic_process', 'q2_endothermic_process'],
  },
  {
    id: 'q2_thermal_energy_heat',
    term: 'Thermal Energy & Heat',
    definition: 'Total kinetic energy of moving particles in a substance. Heat is energy transferred between objects.',
    chapterId: 3,
    category: 'energy',
    textbookRef: 'Unit 4 · Lesson 3 (HMH pp. 40–59)',
    example: 'Heat transfers spontaneously strictly from warmer objects to cooler objects.',
    relatedTerms: ['q2_conduction_convection_radiation', 'q2_system'],
  },
  {
    id: 'q2_conduction_convection_radiation',
    term: 'Conduction, Convection, Radiation',
    definition: 'Three mechanisms of heat transfer: direct particle collisions, fluid density currents, electromagnetic waves.',
    chapterId: 3,
    category: 'energy',
    textbookRef: 'Unit 4 · Lesson 3 (HMH pp. 40–59)',
    example: 'Metal rod in flame (conduction); circulating air (convection); infrared rays (radiation).',
    relatedTerms: ['q2_thermal_energy_heat', 'q2_system'],
  },
  {
    id: 'q2_exothermic_process',
    term: 'Exothermic Process',
    definition: 'A process that releases thermal energy to its surroundings, raising system temperature.',
    chapterId: 3,
    category: 'energy',
    textbookRef: 'Unit 4 · Lesson 3 (HMH pp. 40–59)',
    example: 'Hand warmers (sodium acetate crystallization), burning propane, rusting iron.',
    relatedTerms: ['q2_endothermic_process', 'q2_thermal_energy_heat'],
  },
  {
    id: 'q2_endothermic_process',
    term: 'Endothermic Process',
    definition: 'A process that absorbs thermal energy from its surroundings, lowering system temperature.',
    chapterId: 3,
    category: 'energy',
    textbookRef: 'Unit 4 · Lesson 3 (HMH pp. 40–59)',
    example: 'Chemical cold packs (ammonium chloride dissolving in water), photosynthesis.',
    relatedTerms: ['q2_exothermic_process', 'q2_thermal_energy_heat'],
  },
  {
    id: 'q2_reaction_rate_variables',
    term: 'Reaction Rate Variables',
    definition: 'Factors altering the speed of chemical reactions: Concentration, Temperature, Surface Area, Catalysts.',
    chapterId: 3,
    category: 'energy',
    textbookRef: 'Unit 4 · Lesson 3 (HMH pp. 40–59)',
    example: 'Higher temp makes particles move faster and collide more frequently.',
    relatedTerms: ['q2_chemical_reaction', 'q2_thermal_energy_heat'],
  },
];

export function getGlossaryTermsForQuarter(quarterId: QuarterId): GlossaryTerm[] {
  if (quarterId === 1) return GLOSSARY_TERMS;
  if (quarterId === 2) return QUARTER2_GLOSSARY_TERMS;
  return [];
}

/**
 * Pure search and filter helper for the glossary
 */
export function filterGlossary(
  terms: GlossaryTerm[],
  query: string,
  chapterFilter: ChapterId | 'all' = 'all',
  categoryFilter: GlossaryCategory | 'all' = 'all'
): GlossaryTerm[] {
  const cleanQuery = query.trim().toLowerCase();

  return terms.filter((item) => {
    // Chapter filter
    if (chapterFilter !== 'all' && item.chapterId !== chapterFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    // Query match on term name, definition, or example
    if (!cleanQuery) return true;

    return (
      item.term.toLowerCase().includes(cleanQuery) ||
      item.definition.toLowerCase().includes(cleanQuery) ||
      item.example.toLowerCase().includes(cleanQuery) ||
      (item.relatedTerms && item.relatedTerms.some((t) => t.toLowerCase().includes(cleanQuery)))
    );
  });
}
