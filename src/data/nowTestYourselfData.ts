/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuarterId } from '../game/types.ts';

export interface NowTestQuestion {
  id: string;
  lessonKey: 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4' | 'quiz1';
  lessonTitle: string;
  lessonBadge: string;
  qNum: number;
  questionText: string;
  imageSrc?: string;
  imageAlt?: string;
  options: string[];
  optionLetters: string[];
  correctIndices: number[];
  answerRaw: string;
  explanation: string;
  isMultiSelect: boolean;
}

export const NOW_TEST_QUESTIONS: NowTestQuestion[] = [
  {
    "id": "lesson1_q1",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 1,
    "questionText": "Matter is anything that has _______ and takes up _______.",
    "options": [
      "Matter -- Space",
      "Mass -- Space",
      "Mass -- temperature",
      "Volume -- odor"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. Mass -- Space",
    "explanation": "Matter is defined as anything that possesses mass and occupies physical volume (space).",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q2",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 2,
    "questionText": "Which of the following is NOT a state of matter?",
    "options": [
      "gas",
      "liquid",
      "solid",
      "temperature"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      3
    ],
    "answerRaw": "D. temperature",
    "explanation": "Gas, liquid, and solid are fundamental states of matter. Temperature is a physical measurement of thermal energy, not a state.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q3",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 3,
    "questionText": "Ice is the _______ form of water.",
    "options": [
      "liquid",
      "solid",
      "gas",
      "volume"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. solid",
    "explanation": "Water freezes into ice, which represents its solid state. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 2",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q4",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 4,
    "questionText": "Volume is an example of a _______ property.",
    "options": [
      "physical",
      "chemical"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. physical",
    "explanation": "Physical properties can be observed or measured without altering the chemical identity of the substance.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q5",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 5,
    "questionText": "Which of the following is considered matter? (Select all that apply)",
    "options": [
      "milk in a bottle",
      "sound of booming thunder",
      "heat from a candle",
      "stone on the street"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0,
      3
    ],
    "answerRaw": "A. milk in a bottle, D. stone on the street",
    "explanation": "Milk and stone have mass and occupy volume. Sound and heat are forms of energy, not matter.",
    "isMultiSelect": true
  },
  {
    "id": "lesson1_q6",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 6,
    "questionText": "Light is an example of matter.",
    "options": [
      "True",
      "False"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. False",
    "explanation": "Light is radiant energy (electromagnetic radiation) and does not have mass or volume.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q7",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 7,
    "questionText": "Type of property that changes the identity of matter when observed or tested:",
    "options": [
      "physical",
      "chemical"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. chemical",
    "explanation": "Chemical properties describe a substance's ability to undergo chemical reactions and change into new substances.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q8",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 8,
    "questionText": "_______ particles don't have space to let the food coloring particles spread between them easily.",
    "options": [
      "liquid",
      "solid",
      "gas",
      "matter"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. solid",
    "explanation": "Particles in a solid are tightly packed in fixed positions, preventing food coloring from diffusing through. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 3",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q9",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 9,
    "questionText": "Which of the following has particles that can flow past each other?",
    "options": [
      "orange pie",
      "Orange juice",
      "basketball",
      "pen"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. Orange juice",
    "explanation": "Liquids like orange juice contain particles that can slide/flow past one another while maintaining definite volume.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q10",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 10,
    "questionText": "Adam drew a model showing particles of matter that are close together in an organized, repeating pattern. Which object was drawn?",
    "options": [
      "metal bar",
      "air",
      "molten chocolate",
      "water vapor"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. metal bar",
    "explanation": "A metal bar is a solid, where particles are arranged in a tight, orderly, locked pattern.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q11",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 11,
    "questionText": "The mass of a metal key is 20 g. When placed in a graduated cylinder with water, its volume is 5 cm3. What is the density of the metal key?",
    "options": [
      "4 g/cm3",
      "5 g/cm3",
      "10 g/cm3",
      "25 g/cm3"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. 4 g/cm3",
    "explanation": "Density = Mass / Volume = 20 g / 5 cm3 = 4 g/cm3.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q12",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 12,
    "questionText": "In a liquid displacement experiment, the water level rises from 50 mL to 75 mL when an irregular rock is submerged. What is the volume of the rock?",
    "options": [
      "25 mL",
      "15 mL",
      "75 mL",
      "50 mL"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. 25 mL",
    "explanation": "Volume of object = Final Volume - Initial Volume = 75 mL - 50 mL = 25 mL. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 4",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q13",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 13,
    "questionText": "How do you calculate the density of a rock?",
    "options": [
      "Multiply mass and volume of the rock",
      "Mass divided by the volume of the rock",
      "Subtract mass and volume of the rock",
      "None of the above"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. Mass divided by the volume of the rock",
    "explanation": "Density is the ratio of mass to volume (Density = Mass / Volume).",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q14",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 14,
    "questionText": "Select all the examples of matter from the following list:",
    "options": [
      "wooden log",
      "sunlight",
      "metal bar",
      "the bell sound"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0,
      2
    ],
    "answerRaw": "A. wooden log, C. metal bar",
    "explanation": "Wooden logs and metal bars are matter. Sunlight and sound are forms of energy.",
    "isMultiSelect": true
  },
  {
    "id": "lesson1_q15",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 15,
    "questionText": "Matter is anything that does NOT have mass.",
    "options": [
      "True",
      "False"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. False",
    "explanation": "By definition, all matter MUST have mass and occupy volume.",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q16",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 16,
    "questionText": "Which of the following is a chemical property?",
    "options": [
      "flammability",
      "melting",
      "freezing",
      "condensation"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. flammability",
    "explanation": "Flammability measures a substance's ability to burn and transform into new substances (chemical change). Melting, freezing, and condensation are physical state changes. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 5",
    "isMultiSelect": false
  },
  {
    "id": "lesson1_q17",
    "lessonKey": "lesson1",
    "lessonTitle": "Lesson 1: Properties of Matter",
    "lessonBadge": "Lesson 1 · Properties of Matter",
    "qNum": 17,
    "questionText": "Flammability is the ability of a substance to burn. Wood _______ this property, while a metal pot _______ this property. This is a chemical property because the identity of the substance _______.",
    "options": [
      "has / does not have / changes",
      "does not have / has / stays the same",
      "has / has / stays the same"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. Wood HAS flammability; metal pot DOES NOT HAVE flammability; identity CHANGES upon\nburning.",
    "explanation": "Burning wood changes its chemical identity into ash, smoke, and gases.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q1",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 1,
    "questionText": "The change in particle motion from liquid to gas happens because of a(n) _______ in the particles' kinetic energy.",
    "options": [
      "increase",
      "decrease",
      "stay the same",
      "attraction"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. increase",
    "explanation": "Adding thermal energy increases particle kinetic energy, allowing liquid particles to overcome attraction and vaporize into gas.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q2",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 2,
    "questionText": "When particles start to slow down their movement and organize themselves in a regular pattern, which process is taking place?",
    "options": [
      "condensation",
      "freezing",
      "melting",
      "evaporation"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. freezing",
    "explanation": "Freezing occurs as particles lose kinetic energy, slow down, and lock into a solid structured pattern. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 6",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q3",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 3,
    "questionText": "Why does holding solid gallium in your hand cause it to melt?",
    "options": [
      "Your hand temperature is less than the gallium melting point",
      "None of them is right",
      "It is already liquid",
      "Your hand temperature is more than the gallium melting point"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      3
    ],
    "answerRaw": "D. Your hand temperature is more than the gallium melting point",
    "explanation": "Gallium has a low melting point (~29.8 °C). Human hand temperature (~37 °C) transfers heat to gallium, causing it to melt.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q4",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 4,
    "questionText": "When particles' thermal energy is lost, this allows the particles' attraction force to _______ as they hold together.",
    "options": [
      "increase",
      "decrease"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. increase (pull particles closer together)",
    "explanation": "Lower kinetic energy allows inter-particle attractive forces to dominate and bind particles tighter.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q5",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 5,
    "questionText": "When you put a bottle of liquid water into a freezer, energy from the water is _______ inside the freezer.",
    "options": [
      "lost",
      "gained"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. lost",
    "explanation": "Heat flows from the warmer water into the colder freezer air, causing the water to lose energy and freeze.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q6",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 6,
    "questionText": "A change in the state of matter (e.g., liquid to solid or gas) is considered a _______ change.",
    "options": [
      "physical",
      "chemical"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. physical",
    "explanation": "Changes of state affect physical form without changing the molecular composition or chemical identity.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q7",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 7,
    "questionText": "When water changes from liquid to solid (ice), its chemical identity changes.",
    "options": [
      "True",
      "False"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. False",
    "explanation": "Both liquid water and ice consist of H2O molecules; changing state is a purely physical process. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 7",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q8",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 8,
    "questionText": "The total kinetic energy of all the particles in a substance is called:",
    "options": [
      "thermal energy",
      "light energy",
      "sound energy"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. thermal energy",
    "explanation": "Thermal energy is the total internal kinetic energy of all constituent particles in a sample.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q9",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 9,
    "questionText": "Air pressure at higher elevations (top of a mountain) is _______ than at sea level.",
    "options": [
      "lower",
      "higher"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. lower",
    "explanation": "Fewer air molecules exist at higher altitudes, resulting in lower atmospheric pressure.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q10",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 10,
    "questionText": "If you increase the pressure exerted on a substance, its particles are brought _______ to each other.",
    "options": [
      "closer",
      "farther"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. closer",
    "explanation": "Higher pressure compresses particles together, increasing density.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q11",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 11,
    "questionText": "Identify what happens to particle energy when water returns from liquid to a gas state (evaporates/boils):",
    "options": [
      "No change in energy",
      "Energy is lost",
      "Energy is gained"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      2
    ],
    "answerRaw": "C. Energy is gained",
    "explanation": "Particles must absorb thermal energy to transition from liquid to gas.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q12",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 12,
    "questionText": "Identify what happens to particle energy when water returns from liquid to a solid state (freezes):",
    "options": [
      "Energy is lost",
      "Energy is gained",
      "No change in energy"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. Energy is lost",
    "explanation": "Thermal energy is released/removed when liquid freezes into solid. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 8",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q13",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 13,
    "questionText": "Which phrase describes the changes that take place in a gas when it condenses into a liquid?",
    "options": [
      "Loss of energy and decreased freedom of particle motion",
      "Loss of energy and increased freedom of particle motion",
      "Gain of energy and decreased freedom of particle motion",
      "Gain of energy and increased freedom of particle motion"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. Loss of energy and decreased freedom of particle motion",
    "explanation": "Condensation releases thermal energy, causing gas particles to move slower and lose their freedom of independent motion.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q14",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 14,
    "questionText": "The atmospheric pressure at the bottom of a mountain is higher than the pressure at its top.",
    "options": [
      "True",
      "False"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. True",
    "explanation": "Greater mass of air above sea level creates higher atmospheric pressure at the bottom.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q15",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 15,
    "questionText": "In a solid substance, particles are completely motionless and do not move at all.",
    "options": [
      "True",
      "False"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. False",
    "explanation": "Particles in solids are never completely motionless; they continuously vibrate in fixed positions.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q16",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 16,
    "questionText": "If you decrease the pressure on a gas, its particles get _______ each other.",
    "options": [
      "closer to",
      "farther from"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. farther from",
    "explanation": "Reducing pressure allows gas particles to expand and spread farther apart.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q17",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 17,
    "questionText": "As thermal energy is added to a solid, the kinetic energy of its particles _______.",
    "options": [
      "increases",
      "decreases",
      "does not change",
      "is minimized"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. increases",
    "explanation": "Added thermal energy increases particle speed and kinetic motion. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 9",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q18",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 18,
    "questionText": "Which of the following describe changes as thermal energy is added to a liquid? (Select all 3 that apply)",
    "options": [
      "As thermal energy is added, kinetic energy of particles increases",
      "Particles gain enough energy to overcome attractive forces, break free, and change to gas",
      "Particles move faster and faster",
      "Attractive forces pull particles tighter together"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0,
      1,
      2
    ],
    "answerRaw": "A, B, and C",
    "explanation": "Adding thermal energy accelerates particle speed, increases kinetic energy, and enables vaporization.",
    "isMultiSelect": true
  },
  {
    "id": "lesson2_q19",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 19,
    "questionText": "Sara places a beaker of ice and water on a hot plate. What type of change will the ice undergo?",
    "options": [
      "A purely physical change because it will change state without changing identity",
      "A physical and chemical change",
      "A chemical change only"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. A purely physical change because it will change state without changing identity",
    "explanation": "Melting ice to liquid water alters state, not chemical structure.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q20",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 20,
    "questionText": "When water loses thermal energy, the movement of its particles _______.",
    "options": [
      "increases",
      "decreases",
      "stays the same"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. decreases",
    "explanation": "Removing thermal energy reduces kinetic energy and slows particle movement.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q21",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 21,
    "questionText": "Which energy transfer takes place when water freezes to form ice crystals in cold air?",
    "options": [
      "Energy is transferred from the warm water into the colder air",
      "Energy is transferred from the water into the ground",
      "Energy is transferred from the air into the water"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. Energy is transferred from the warm water into the colder air",
    "explanation": "Heat spontaneously transfers from warmer objects (water) to colder surroundings (air). SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 10",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q22",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 22,
    "questionText": "Which describes particle behavior as thermal energy is REMOVED from a liquid? (Select all 2 that apply)",
    "options": [
      "Particles slow down until they lock into place in a solid and stop moving completely",
      "Particles slow down until they lock into place as a solid and only vibrate in place",
      "Kinetic energy of particles increases",
      "Kinetic energy of particles decreases"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1,
      3
    ],
    "answerRaw": "B and D",
    "explanation": "Removing energy lowers kinetic energy, causing particles to lock into a solid structure where they vibrate in place.",
    "isMultiSelect": true
  },
  {
    "id": "lesson2_q23",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 23,
    "questionText": "In which state of matter are particles tightly packed and vibrating at fixed positions?",
    "options": [
      "liquid",
      "solid",
      "gas",
      "plasma"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. solid",
    "explanation": "Fixed volume, fixed shape, and vibrating in fixed positions are defining traits of solids.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q24",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 24,
    "questionText": "Boiling changes the state of matter from _______ to _______.",
    "options": [
      "solid to liquid",
      "liquid to solid",
      "liquid to gas",
      "gas to liquid"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      2
    ],
    "answerRaw": "C. liquid to gas",
    "explanation": "Boiling is rapid vaporization converting liquid throughout into gas.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q25",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 25,
    "questionText": "How does thermal energy play a role in particle motion and changes of state?",
    "options": [
      "Increasing matter's thermal energy increases particle kinetic energy and causes a change of state",
      "Thermal energy is only energy added from a heat source",
      "Decreasing thermal energy increases particle motion"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. Increasing matter's thermal energy increases particle kinetic energy and causes a change of\nstate",
    "explanation": "Thermal energy directly dictates particle kinetic energy and state changes. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 11",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q26",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 26,
    "questionText": "If a gas in a bicycle tire cools down, the tire pressure drops because the gas particles move _______ and collide _______ with tire walls.",
    "options": [
      "faster / more frequently",
      "slower / less frequently",
      "at constant speed / with higher force"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. slower / less frequently",
    "explanation": "Lower temperature reduces kinetic energy, causing fewer/weaker collisions against container walls, dropping pressure.",
    "isMultiSelect": false
  },
  {
    "id": "lesson2_q27",
    "lessonKey": "lesson2",
    "lessonTitle": "Lesson 2: Changes of State",
    "lessonBadge": "Lesson 2 · Changes of State",
    "qNum": 27,
    "questionText": "Sweating cools the human body because water on the skin _______, which _______ thermal energy from the body.",
    "options": [
      "condenses / adds",
      "evaporates / removes",
      "freezes / absorbs"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. evaporates / removes",
    "explanation": "Evaporative cooling occurs as high-energy water particles vaporize, leaving behind cooler skin.",
    "isMultiSelect": false
  },
  {
    "id": "lesson3_q1",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 1,
    "questionText": "Select all of the pure ELEMENTS from the following list:",
    "options": [
      "Copper (Cu)",
      "Aluminum (Al)",
      "Silver (Ag)",
      "Carbon dioxide (CO2) E. Water (H2O) F. Air"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0,
      1,
      2
    ],
    "answerRaw": "A. Copper, B. Aluminum, C. Silver",
    "explanation": "Copper, aluminum, and silver consist of a single type of atom. CO2 and H2O are compounds; Air is a mixture. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 12",
    "isMultiSelect": true
  },
  {
    "id": "lesson3_q2",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 2,
    "questionText": "How do the physical properties of silver and copper affect how they are used in crafts and manufacturing?",
    "options": [
      "They can be shaped and hammered (malleable)",
      "They have the same color",
      "They have the same density",
      "They have identical chemical properties"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. They can be shaped and hammered (malleable)",
    "explanation": "Malleability allows copper and silver to be hammered into sheets, wire, bowls, and jewelry.",
    "isMultiSelect": false
  },
  {
    "id": "lesson3_q3",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 3,
    "questionText": "Suppose you have a sample of matter. You CANNOT physically separate it, nor can you chemically separate it into simpler components. Which statement is TRUE?",
    "options": [
      "The sample does not exist",
      "The sample is made up of multiple elements",
      "The sample is made up of a single element",
      "The sample is a heterogeneous mixture"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      2
    ],
    "answerRaw": "C. The sample is made up of a single element",
    "explanation": "Elements are pure substances composed of only one type of atom that cannot be broken down by physical or chemical means.",
    "isMultiSelect": false
  },
  {
    "id": "lesson3_q4",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 4,
    "questionText": "A pure substance CANNOT be separated into other substances by physical means (e.g., filtering, boiling).",
    "options": [
      "True",
      "False"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. True",
    "explanation": "Pure substances (elements and compounds) require chemical methods (if compound) or cannot be separated at all (if element).",
    "isMultiSelect": false
  },
  {
    "id": "lesson3_q5",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 5,
    "questionText": "A substance that is composed of only ONE type of atom is called a(n):",
    "options": [
      "element",
      "compound",
      "mixture",
      "solution"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. element",
    "explanation": "By definition, an element consists entirely of identical atoms with the same atomic number. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 13",
    "isMultiSelect": false
  },
  {
    "id": "lesson3_q6",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 6,
    "questionText": "What is the primary difference between a pure substance and a mixture?",
    "options": [
      "A mixture can be separated physically, whereas a pure substance cannot",
      "A pure substance can be separated physically",
      "A mixture cannot be separated"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. A mixture can be separated physically, whereas a pure substance cannot",
    "explanation": "Mixtures consist of physically combined substances that retain individual identities and can be physically separated.",
    "isMultiSelect": false
  },
  {
    "id": "lesson3_q7",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 7,
    "questionText": "Which pair of elements is most likely to share similar chemical and physical properties?",
    "options": [
      "Tungsten (W) and Osmium (Os)",
      "Osmium (Os) and Hassium (Hs)",
      "Seaborgium (Sg) and Rhenium (Re)"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. Osmium (Os) and Hassium (Hs)",
    "explanation": "Elements located in the same vertical Group/column of the periodic table exhibit similar chemical properties.",
    "isMultiSelect": false
  },
  {
    "id": "lesson3_q8",
    "lessonKey": "lesson3",
    "lessonTitle": "Lesson 3: Atoms and Elements",
    "lessonBadge": "Lesson 3 · Atoms & Elements",
    "qNum": 8,
    "questionText": "Which properties do all atoms of the same element share? (Select all that apply)",
    "options": [
      "Atomic number (number of protons)",
      "Chemical reactivity",
      "Melting point",
      "Total number of atoms in a sample"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0,
      1,
      2
    ],
    "answerRaw": "A. Atomic number, B. Chemical reactivity, C. Melting point",
    "explanation": "All atoms of an element have identical atomic numbers and characteristic chemical and physical properties.",
    "isMultiSelect": true
  },
  {
    "id": "lesson4_q1",
    "lessonKey": "lesson4",
    "lessonTitle": "Lesson 4: Molecules and Extended Structures",
    "lessonBadge": "Lesson 4 · Molecules & Extended Structures",
    "qNum": 1,
    "questionText": "Diamond and graphite are both composed entirely of pure carbon atoms. How can they have completely different properties (diamond is extremely hard, graphite is soft and flaky)?",
    "options": [
      "They have different atomic masses",
      "They have different arrangements/crystal structures of carbon atoms",
      "Diamond contains oxygen impurities"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. They have different arrangements/crystal structures of carbon atoms",
    "explanation": "In diamond, carbon atoms form a rigid 3D tetrahedral network. In graphite, carbon atoms form flat 2D hexagonal sheets that slide past each other. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 14",
    "isMultiSelect": false
  },
  {
    "id": "lesson4_q2",
    "lessonKey": "lesson4",
    "lessonTitle": "Lesson 4: Molecules and Extended Structures",
    "lessonBadge": "Lesson 4 · Molecules & Extended Structures",
    "qNum": 2,
    "questionText": "Which of the following can be directly observed or inferred from a 3D ball-and-stick model of water (H2O)? (Select all that apply)",
    "options": [
      "Water is a molecule",
      "Water is a compound",
      "Water is made up of 3 different types of atoms",
      "The 3D spatial arrangement of water's atoms"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0,
      1,
      3
    ],
    "answerRaw": "A, B, and D",
    "explanation": "Water is a molecule and compound with 2 hydrogen atoms and 1 oxygen atom (2 types of atoms, 3 total atoms).",
    "isMultiSelect": true
  },
  {
    "id": "lesson4_q3",
    "lessonKey": "lesson4",
    "lessonTitle": "Lesson 4: Molecules and Extended Structures",
    "lessonBadge": "Lesson 4 · Molecules & Extended Structures",
    "qNum": 3,
    "questionText": "White phosphorus consists of sets of 4 phosphorus atoms (P4). Red phosphorus consists of long repeating chains of phosphorus atoms. Complete the statements: • White phosphorus is a [simple molecule / extended structure]. • Red phosphorus is a [simple molecule / extended structure]. • Both are examples of a(n) [element / compound].",
    "options": [
      "White P = simple molecule; Red P = extended structure; Both = element",
      "White P = extended structure; Red P = simple molecule; Both = compound"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. White phosphorus is a simple molecule; Red phosphorus is an extended structure; Both are\nexamples of an element.",
    "explanation": "P4 is a discrete molecule. Red P forms a continuous polymer lattice. Because both contain only phosphorus atoms, both are elements.",
    "isMultiSelect": false
  },
  {
    "id": "lesson4_q4",
    "lessonKey": "lesson4",
    "lessonTitle": "Lesson 4: Molecules and Extended Structures",
    "lessonBadge": "Lesson 4 · Molecules & Extended Structures",
    "qNum": 4,
    "questionText": "Carbon tetrachloride (CCl4) and carbon tetrabromide (CBr4) have similar chemical structures with 4 halogen atoms around a central carbon atom. Does this mean they have identical properties?",
    "options": [
      "Yes, because similar structures always result in identical properties",
      "No, because the specific types of atoms in a molecule as well as its structure dictate properties"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. No, because the specific types of atoms in a molecule as well as its structure dictate\nproperties",
    "explanation": "Both the constituent atomic species (chlorine vs. bromine) and geometric structure determine physical/chemical properties. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 15",
    "isMultiSelect": false
  },
  {
    "id": "lesson4_q5",
    "lessonKey": "lesson4",
    "lessonTitle": "Lesson 4: Molecules and Extended Structures",
    "lessonBadge": "Lesson 4 · Molecules & Extended Structures",
    "qNum": 5,
    "questionText": "In copper carbonate (CuCO3), the mass ratio of copper to oxygen to carbon is 5.3 : 4 : 1. In a 103 g sample of copper carbonate, how many grams of copper, oxygen, and carbon are present?",
    "options": [
      "53 g copper, 40 g oxygen, 10 g carbon",
      "33 g copper, 33 g oxygen, 33 g carbon",
      "5.3 g copper, 4 g oxygen, 1 g carbon"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. 53 g copper, 40 g oxygen, 10 g carbon",
    "explanation": "Ratio 5.3 : 4 : 1 sums to 10.3 parts. For a 103 g sample (10x scaling): 53 g Cu, 40 g O, 10 g C (Proust's Law of Definite Proportions).",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q1",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 1,
    "questionText": "Which of the following would be considered matter? (Select all that apply)",
    "options": [
      "light from a light bulb",
      "Water bottle",
      "kitten's sound",
      "Oxygen gas"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1,
      3
    ],
    "answerRaw": "B. Water bottle, D. Oxygen gas",
    "explanation": "Water bottles and oxygen gas have mass and occupy volume. Light and sound are forms of energy.",
    "isMultiSelect": true
  },
  {
    "id": "quiz1_q2",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 2,
    "questionText": "Match each state of matter to its relative level of kinetic energy:\n• Solid particles have: _______\n• Liquid particles have: _______\n• Gas particles have: _______",
    "options": [
      "Solid = low kinetic energy; Liquid = medium kinetic energy; Gas = high kinetic energy",
      "Solid = high kinetic energy; Liquid = medium kinetic energy; Gas = low kinetic energy",
      "Solid = medium kinetic energy; Liquid = low kinetic energy; Gas = high kinetic energy",
      "Solid = high kinetic energy; Liquid = low kinetic energy; Gas = medium kinetic energy"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "Solid = low kinetic energy; Liquid = medium kinetic energy; Gas = high kinetic energy",
    "explanation": "Solid particles vibrate in place (low KE), liquid particles slide past (medium KE), gas particles move rapidly and freely (high KE).",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q3",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 3,
    "questionText": "Match each state of matter to its relative level of inter-particle attraction force:\n• Solid particles have: _______\n• Liquid particles have: _______\n• Gas particles have: _______",
    "options": [
      "Solid = high attraction force; Liquid = medium attraction force; Gas = low attraction force",
      "Solid = low attraction force; Liquid = medium attraction force; Gas = high attraction force",
      "Solid = medium attraction force; Liquid = high attraction force; Gas = low attraction force",
      "Solid = low attraction force; Liquid = high attraction force; Gas = medium attraction force"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "Solid = high attraction force; Liquid = medium attraction force; Gas = low attraction force",
    "explanation": "Strong attraction forces lock solid particles together. Weak attraction forces in gas allow free movement. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 16",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q4",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 4,
    "questionText": "When matter is heated, its constituent particles move _______.",
    "options": [
      "faster",
      "slower",
      "don't move",
      "only vibrate"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. faster",
    "explanation": "Thermal energy increases particle kinetic energy, making particles move faster.",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q5",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 5,
    "questionText": "Which state of matter maintains a fixed shape and a fixed volume?",
    "options": [
      "gas",
      "solid",
      "liquid"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. solid",
    "explanation": "Solids have definite shape and definite volume due to tightly locked particles.",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q6",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 6,
    "questionText": "Why can food coloring particles spread rapidly through liquid water, but remain stuck in one spot on an ice cube?",
    "options": [
      "Because liquid particles are highly attached together",
      "Because solid particles have high kinetic energy",
      "Because ice particles are tightly bound in fixed positions with high attraction forces"
    ],
    "optionLetters": [
      "A",
      "B",
      "C"
    ],
    "correctIndices": [
      2
    ],
    "answerRaw": "C. Because ice particles are tightly bound in fixed positions with high attraction forces",
    "explanation": "Ice is a solid where rigid particle arrangement prevents food coloring from penetrating, while liquid water allows diffusion.",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q7",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 7,
    "questionText": "Sunlight is NOT considered matter because it lacks _______.",
    "options": [
      "temperature",
      "mass and volume",
      "heat",
      "color"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. mass and volume",
    "explanation": "All matter must possess mass and occupy space (volume). Sunlight is electromagnetic energy. SCIENCE GRADE 6 - UNIT 3: THE STRUCTURE OF MATTER QUESTION & ANSWER BANK Page 17",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q8",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 8,
    "questionText": "When matter is cooled down, particles move slower and start to organize themselves as their attraction force _______.",
    "options": [
      "increases",
      "decreases"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      0
    ],
    "answerRaw": "A. increases",
    "explanation": "Lower kinetic energy allows attractive forces between particles to pull them closer together.",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q9",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 9,
    "questionText": "The energy associated with the motion of matter particles is called potential energy.",
    "options": [
      "True",
      "False"
    ],
    "optionLetters": [
      "A",
      "B"
    ],
    "correctIndices": [
      1
    ],
    "answerRaw": "B. False",
    "explanation": "Energy of motion is called KINETIC energy. Potential energy is stored energy.",
    "isMultiSelect": false
  },
  {
    "id": "quiz1_q10",
    "lessonKey": "quiz1",
    "lessonTitle": "Unit 3 Comprehensive Assessment Review (Quiz 1)",
    "lessonBadge": "Unit 3 Comprehensive Assessment (Quiz 1)",
    "qNum": 10,
    "questionText": "What is the density of a rock sample that has a mass of 20 g and a volume of 5 cm3?",
    "options": [
      "6 g/cm3",
      "5 g/cm3",
      "4 g/cm3",
      "2 g/cm3"
    ],
    "optionLetters": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctIndices": [
      2
    ],
    "answerRaw": "C. 4 g/cm3",
    "explanation": "Density = Mass / Volume = 20 g / 5 cm3 = 4 g/cm3.",
    "isMultiSelect": false
  }
];

export interface LessonFilterOption {
  key: string;
  title: string;
  count: number;
}

export const LESSON_FILTERS: readonly LessonFilterOption[] = [
  { key: 'all', title: 'All Questions', count: 67 },
  { key: 'lesson1', title: 'Lesson 1: Properties of Matter', count: 17 },
  { key: 'lesson2', title: 'Lesson 2: Changes of State', count: 27 },
  { key: 'lesson3', title: 'Lesson 3: Atoms & Elements', count: 8 },
  { key: 'lesson4', title: 'Lesson 4: Molecules & Structures', count: 5 },
  { key: 'quiz1', title: 'Unit 3 Comprehensive Review', count: 10 },
] as const;

export const QUARTER2_NOW_TEST_QUESTIONS: NowTestQuestion[] = [
  {
    id: 'q2_lesson1_q1',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 1,
    questionText: 'What type of change that happened to the match?',
    imageSrc: '/assets/aistudio/q2_l1_match_burning.jpg',
    imageAlt: 'Unlit match, burning match with flame, and charred matchstick',
    options: [
      'Physical, because no change in the identity',
      'Chemical, because the identity changed',
      'Physical, because the color changed.',
    ],
    optionLetters: ['A', 'B', 'C'],
    correctIndices: [1],
    answerRaw: 'B. Chemical, because the identity changed',
    explanation:
      'Burning a match is a chemical reaction (combustion). Heat, light, smoke, and charred ash are produced, forming new substances with a different chemical identity.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q2',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 2,
    questionText:
      'If you added 2 substances together then you noticed a new odour, What does this likely indicate?',
    options: [
      'chemical reaction occurred.',
      'physical change occurred',
      'liquid was formed',
    ],
    optionLetters: ['A', 'B', 'C'],
    correctIndices: [0],
    answerRaw: 'A. chemical reaction occurred.',
    explanation:
      'A new odor after mixing two substances is strong evidence that a new substance formed during a chemical reaction.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q3',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 3,
    questionText: 'Solubility is a chemical property of matter.',
    options: ['True', 'False'],
    optionLetters: ['A', 'B'],
    correctIndices: [1],
    answerRaw: 'B. False',
    explanation:
      'Solubility is a physical property. When a substance dissolves in water, its particles mix with water without changing its chemical identity.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q4',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 4,
    questionText:
      'What is/are the evidence for a chemical reaction? Select all the possible answers.',
    options: [
      'odour Change',
      'colour Change',
      'size Change',
      'Formation of bubbles',
      'Melting',
    ],
    optionLetters: ['A', 'B', 'C', 'D', 'E'],
    correctIndices: [0, 1, 3],
    answerRaw: 'A. odour Change, B. colour Change, D. Formation of bubbles',
    explanation:
      'Odor change, unexpected color change, and formation of gas bubbles are signs of a chemical reaction. Size change and melting are physical changes.',
    isMultiSelect: true,
  },
  {
    id: 'q2_lesson1_q5',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 5,
    questionText: 'All substances can dissolve in water.',
    options: ['True', 'False'],
    optionLetters: ['A', 'B'],
    correctIndices: [1],
    answerRaw: 'B. False',
    explanation:
      'Not all substances are soluble in water. Substances like sand, oil, and iron do not dissolve in water because solubility differs by substance.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q6',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 6,
    questionText: 'Choose all the physical properties of matter.',
    options: ['flammability', 'density', 'ability to rust', 'color', 'solubility'],
    optionLetters: ['A', 'B', 'C', 'D', 'E'],
    correctIndices: [1, 3, 4],
    answerRaw: 'B. density, D. color, E. solubility',
    explanation:
      'Density, color, and solubility can be observed or measured without changing a substance’s identity, making them physical properties. Flammability and ability to rust are chemical properties.',
    isMultiSelect: true,
  },
  {
    id: 'q2_lesson1_q7',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 7,
    questionText: 'Cutting or chopping wood will result in ............. of the matter.',
    options: ['Changing the identity', 'Unchanging the identity'],
    optionLetters: ['A', 'B'],
    correctIndices: [1],
    answerRaw: 'B. Unchanging the identity',
    explanation:
      'Cutting or chopping wood is a physical change: only the size and shape change, while the substance remains wood (identity is unchanged).',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q8',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 8,
    questionText:
      'The two nails in the photos are shown before and after being left outside in the rain.\n\nAre the two nails made of the same substance?',
    imageSrc: '/assets/aistudio/q2_l1_nails_rain.jpg',
    imageAlt:
      'Comparison photos of Nail 1 before and after rusting in rain versus Nail 2 before and after remaining unrusted',
    options: [
      "No, because nail 1 rusted while nail 2 didn't rust",
      'Yes, because they behaved the same after being exposed to water',
      "No, because they didn't dissolve in water",
    ],
    optionLetters: ['A', 'B', 'C'],
    correctIndices: [0],
    answerRaw: "A. No, because nail 1 rusted while nail 2 didn't rust",
    explanation:
      'The ability to rust is a characteristic chemical property. Because Nail 1 rusted in the rain while Nail 2 did not, the two nails have different chemical properties and are made of different substances.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q9',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 9,
    questionText: 'When you bend a paper clip, this change is ...........',
    options: ['physical change', 'chemical change'],
    optionLetters: ['A', 'B'],
    correctIndices: [0],
    answerRaw: 'A. physical change',
    explanation:
      'Bending a paper clip alters only its shape without producing a new substance, so it is a physical change.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q10',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 10,
    questionText:
      "..............properties of a substance are those that can be observed or measured without changing the substance's identity.",
    options: ['chemical', 'physical', 'color', 'odor'],
    optionLetters: ['A', 'B', 'C', 'D'],
    correctIndices: [1],
    answerRaw: 'B. physical',
    explanation:
      'Physical properties (such as density, color, melting point, and solubility) can be observed or measured without altering the chemical identity of the substance.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q11',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 11,
    questionText: 'The color of the iron nail changed because of',
    options: ['physical change', 'chemical change', "it didn't change"],
    optionLetters: ['A', 'B', 'C'],
    correctIndices: [1],
    answerRaw: 'B. chemical change',
    explanation:
      'When an iron nail rusts, iron reacts chemically with oxygen and moisture to form iron oxide (rust), causing a permanent color change due to a chemical change.',
    isMultiSelect: false,
  },
  {
    id: 'q2_lesson1_q12',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 12,
    questionText: 'Select all the chemical properties of matter.',
    options: [
      'mass',
      'volume',
      'boiling point',
      'reactivity',
      'flammability',
      'conductivity',
    ],
    optionLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    correctIndices: [3, 4],
    answerRaw: 'D. reactivity, E. flammability',
    explanation:
      'Reactivity and flammability describe how a substance interacts to form new substances, so they are chemical properties. Mass, volume, boiling point, and conductivity are physical properties.',
    isMultiSelect: true,
  },
  {
    id: 'q2_lesson1_q13',
    lessonKey: 'lesson1',
    lessonTitle: 'Unit 4 · Lesson 1: Chemical Reactions',
    lessonBadge: 'Quarter 2 · Lesson 1 · Chemical Reactions',
    qNum: 13,
    questionText: 'All substances are soluble in water.',
    options: ['yes', 'no', 'maybe'],
    optionLetters: ['A', 'B', 'C'],
    correctIndices: [1],
    answerRaw: 'B. no',
    explanation:
      'Solubility varies from substance to substance; while salt and sugar dissolve in water, substances such as sand, oil, and plastic do not.',
    isMultiSelect: false,
  },
];

export const QUARTER2_LESSON_FILTERS: readonly LessonFilterOption[] = [
  { key: 'all', title: 'All Questions', count: QUARTER2_NOW_TEST_QUESTIONS.length },
  {
    key: 'lesson1',
    title: 'Lesson 1: Chemical Reactions',
    count: QUARTER2_NOW_TEST_QUESTIONS.filter((q) => q.lessonKey === 'lesson1').length,
  },
  {
    key: 'lesson2',
    title: 'Lesson 2: Chemical Equations & Mass',
    count: QUARTER2_NOW_TEST_QUESTIONS.filter((q) => q.lessonKey === 'lesson2').length,
  },
  {
    key: 'lesson3',
    title: 'Lesson 3: Energy in Chemical Processes',
    count: QUARTER2_NOW_TEST_QUESTIONS.filter((q) => q.lessonKey === 'lesson3').length,
  },
  {
    key: 'lesson4',
    title: 'Lesson 4: Coming Soon',
    count: QUARTER2_NOW_TEST_QUESTIONS.filter((q) => q.lessonKey === 'lesson4').length,
  },
];

export function getNowTestQuestions(quarterId: QuarterId): NowTestQuestion[] {
  if (quarterId === 1) return NOW_TEST_QUESTIONS;
  if (quarterId === 2) return QUARTER2_NOW_TEST_QUESTIONS;
  return [];
}

export function getNowTestLessonFilters(quarterId: QuarterId): readonly LessonFilterOption[] {
  if (quarterId === 1) return LESSON_FILTERS;
  if (quarterId === 2) return QUARTER2_LESSON_FILTERS;
  return [
    { key: 'all', title: 'All Lessons', count: 0 },
    { key: 'lesson1', title: 'Lesson 1', count: 0 },
    { key: 'lesson2', title: 'Lesson 2', count: 0 },
    { key: 'lesson3', title: 'Lesson 3', count: 0 },
    { key: 'lesson4', title: 'Lesson 4', count: 0 },
  ];
}
