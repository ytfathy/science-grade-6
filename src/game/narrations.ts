/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimMode, ChapterId } from './types.ts';

export interface NarrationScript {
  mode: SimMode;
  chapterId: ChapterId;
  title: string;
  subtitle: string;
  durationSec: number;
  script: string;
  keyPoints: string[];
  textbookRef: string;
}

export const LAB_NARRATIONS: Record<SimMode, NarrationScript> = {
  // Chapter 1: The Properties of Matter
  chamber: {
    mode: 'chamber',
    chapterId: 1,
    title: '3D Microscopic State Chamber',
    subtitle: 'Particle Spacing, Kinetic Energy & States of Matter',
    durationSec: 18,
    script:
      'Welcome to the Microscopic State Chamber. In solids, particles vibrate in place within a rigid lattice held by strong attractive forces. In liquids, particles have more kinetic energy and slide past one another. In gases, high kinetic energy overcomes attractions completely, causing particles to bounce freely throughout the entire volume.',
    keyPoints: [
      'Solid: Vibrating locked crystal lattice',
      'Liquid: Sliding particles with medium kinetic energy',
      'Gas: High-speed collisions filling all 3D space',
    ],
    textbookRef: 'HMH Into Science p. 12, 16–17',
  },
  displacement: {
    mode: 'displacement',
    chapterId: 1,
    title: 'Displacement & Density Laboratory',
    subtitle: 'Water Displacement & Calculating D = m / V',
    durationSec: 20,
    script:
      'In this experiment, we measure the volume of irregular solid objects using water displacement. When an irregular 20-gram rock is submerged, it pushes the water upward from 50 milliliters to 75 milliliters. The displaced volume is exactly 25 milliliters. Dividing mass by volume gives a density of 0.80 grams per cubic centimeter.',
    keyPoints: [
      'Initial volume: 50 mL → Final volume: 75 mL',
      'Displaced volume: 25 mL (25 cm³)',
      'Density formula: D = m / V = 20g / 25cm³ = 0.80 g/cm³',
    ],
    textbookRef: 'HMH Into Science p. 7–9, 22',
  },
  diffusion: {
    mode: 'diffusion',
    chapterId: 1,
    title: 'Food Coloring Diffusion Laboratory',
    subtitle: 'Particle Motion in Liquid Water vs. Solid Ice',
    durationSec: 19,
    script:
      'Observe the difference between liquid water and solid ice. When food coloring drops into liquid water, fluid molecules constantly collide with the dye, dispersing it evenly. But when a droplet lands on frozen ice, the locked crystal lattice prevents penetration, keeping the dye localized on the surface.',
    keyPoints: [
      'Liquid water: Moving particles collide and diffuse the dye',
      'Solid ice: Locked hexagonal lattice halts dye dispersal',
      'Shows how states of matter govern molecular transport',
    ],
    textbookRef: 'HMH Into Science p. 4, 16, 21',
  },

  // Chapter 2: Changes of State & Energy
  thermal: {
    mode: 'thermal',
    chapterId: 2,
    title: 'Thermal Energy Chamber & Bunsen Burner',
    subtitle: 'Kinetic Energy, Heat Transfer & Phase Shift Plateaus',
    durationSec: 22,
    script:
      'Thermal energy is the total kinetic energy of all particles in a substance. As you turn up the Bunsen burner flame, temperature rises until it hits the melting point at 0 degrees Celsius and boiling point at 100 degrees Celsius. Notice that temperature pauses at these plateaus while added thermal energy breaks intermolecular bonds.',
    keyPoints: [
      'Temperature measures average kinetic energy',
      'Melting plateau at 0°C and boiling plateau at 100°C',
      'Latent heat breaks intermolecular attractions without raising temperature',
    ],
    textbookRef: 'HMH Into Science p. 29–31',
  },
  gallium: {
    mode: 'gallium',
    chapterId: 2,
    title: 'Gallium Metal Melting Phenomenon',
    subtitle: 'Low Melting Point Metal at 29.8°C',
    durationSec: 20,
    script:
      'Gallium is a soft silvery metal commonly used in semiconductor computer chips. It has an unusually low melting point of 29.8 degrees Celsius, which is below normal human body temperature of 37 degrees Celsius. When held in your palm, thermal energy conducts from your hand into the metal, causing the solid ingot to soften and melt into a liquid pool.',
    keyPoints: [
      'Melting point of Gallium: 29.8°C (85.6°F)',
      'Normal human body temperature: ~37°C (98.6°F)',
      'Heat transfers from warm hand to metal, causing phase transition',
    ],
    textbookRef: 'HMH Into Science p. 24–25, 41',
  },
  elevation: {
    mode: 'elevation',
    chapterId: 2,
    title: 'Mountain Elevation & Air Pressure Laboratory',
    subtitle: 'Atmospheric Pressure & Reduced Boiling Points',
    durationSec: 22,
    script:
      'Gas molecules in the atmosphere exert downward pressure through collisions. At high altitudes like Mount Everest, there are far fewer air particles overhead, dropping atmospheric pressure from 1.0 atmosphere down to 0.31 atmospheres. With less force pushing down on the liquid surface, water boils at only 76.5 degrees Celsius instead of 100 degrees.',
    keyPoints: [
      'Sea level: 1.0 atm → Boiling point 100°C',
      'Denver (1,609m): 0.82 atm → Boiling point 95°C',
      'Mt. Everest (8,848m): 0.31 atm → Boiling point 76.5°C',
    ],
    textbookRef: 'HMH Into Science p. 37–38',
  },

  // Chapter 3: Atoms, Elements & The Periodic Table
  bohr: {
    mode: 'bohr',
    chapterId: 3,
    title: '3D Bohr Atom Model',
    subtitle: 'Nucleus Composition & Quantum Electron Shells',
    durationSec: 21,
    script:
      'Atoms are the fundamental building blocks of all elements. In the Bohr model, positively charged protons and neutral neutrons form a dense central nucleus. Negatively charged electrons orbit in concentric energy shells. The number of protons defines the atomic number and chemical identity of each element.',
    keyPoints: [
      'Protons (red) and Neutrons (gray) in central nucleus',
      'Electrons (cyan) orbit in calibrated concentric shells',
      'Atomic number equals the exact count of nuclear protons',
    ],
    textbookRef: 'HMH Into Science p. 49–53',
  },
  moseley: {
    mode: 'moseley',
    chapterId: 3,
    title: 'Henry Moseley X-Ray Frequency Scanner',
    subtitle: 'High-Energy Cathode Rays & Atomic Number Discovery',
    durationSec: 21,
    script:
      'British physicist Henry Moseley fired high-energy cathode beams at metal targets and discovered that each element emits characteristic X-rays with whole-number frequencies. This proved that elements should be organized by atomic number rather than atomic mass, resolving historical ordering anomalies like Cobalt and Nickel.',
    keyPoints: [
      'Cathode beam bombards metal anode target',
      'Emitted X-ray frequency corresponds to whole numbers (Z)',
      'Proved atomic number is the true organizational basis of elements',
    ],
    textbookRef: 'HMH Into Science p. 57–58',
  },
  metals: {
    mode: 'metals',
    chapterId: 3,
    title: 'Malleable Metals Showcase',
    subtitle: 'Metallic Bonding, Malleability & Conduction',
    durationSec: 19,
    script:
      'Copper and silver are widely prized for jewelry and cookware because of malleability. Metallic atoms share a sea of delocalized valence electrons, allowing layers of atoms to slide smoothly past each other when struck by a hammer without shattering. These free electrons also conduct electricity throughout the metal.',
    keyPoints: [
      'Malleability: Metal sheets bend and flatten without fracturing',
      'Delocalized electron sea enables atomic planes to slide',
      'High thermal and electrical conductivity',
    ],
    textbookRef: 'HMH Into Science p. 44–45',
  },

  // Chapter 4: Molecules, Compounds & Extended Structures
  molecules: {
    mode: 'molecules',
    chapterId: 4,
    title: 'Ball-and-Stick Molecular Models',
    subtitle: 'Chemical Bonds & Fixed Atomic Ratios',
    durationSec: 20,
    script:
      'A molecule consists of two or more atoms held together by chemical bonds. A compound contains two or more different elements in a fixed ratio. For example, water, H2O, has a bent geometry with a 2 to 1 hydrogen-to-oxygen ratio, while carbon dioxide, CO2, is linear with double bonds in a 1 to 2 ratio.',
    keyPoints: [
      'H2O: Bent 104.5° angle with 2:1 ratio',
      'CO2: Linear 180° with double covalent bonds and 1:2 ratio',
      'CH4: Tetrahedral geometry with 1:4 ratio',
    ],
    textbookRef: 'HMH Into Science p. 65–67',
  },
  allotropes: {
    mode: 'allotropes',
    chapterId: 4,
    title: 'Diamond vs. Graphite Carbon Allotropes',
    subtitle: 'Identical Atoms with Radically Different Structures',
    durationSec: 22,
    script:
      'Both diamond and graphite are composed purely of carbon atoms, yet their physical properties are opposites. In diamond, carbon forms a rigid three-dimensional tetrahedral cage, making it one of the hardest known substances. In graphite, carbon forms flat hexagonal sheets that easily slide off onto paper when writing.',
    keyPoints: [
      'Diamond: Rigid 3D interlocking tetrahedral cage (extreme hardness)',
      'Graphite: Stacked 2D hexagonal sheets with weak interlayer forces',
      'Proves atomic arrangement directly determines physical properties',
    ],
    textbookRef: 'HMH Into Science p. 62–63, 75',
  },
  salt: {
    mode: 'salt',
    chapterId: 4,
    title: 'NaCl Rock Salt Crystal Lattice',
    subtitle: 'Extended Structures & 6-Fold Coordination',
    durationSec: 19,
    script:
      'Table salt is an extended crystalline structure rather than isolated molecules. Sodium and chloride ions alternate in a continuous cubic lattice where each sodium ion is coordinated to six neighboring chlorine ions. This repeating three-dimensional architecture gives salt crystals their natural cubic shapes.',
    keyPoints: [
      'Extended structure: Infinite repeating ionic network',
      '6-fold coordination: Each ion surrounded by 6 opposite neighbors',
      'Definite mass proportion: 39% Sodium to 61% Chlorine (Proust’s Law)',
    ],
    textbookRef: 'HMH Into Science p. 70–72, 77',
  },
};

/**
 * Returns narration details for any simulation mode
 */
export function getNarrationForMode(mode: SimMode): NarrationScript {
  return LAB_NARRATIONS[mode] || LAB_NARRATIONS.chamber;
}
