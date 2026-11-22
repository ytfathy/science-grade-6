/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Unit4LessonId, getUnit4Lesson } from '../../game/unit4.ts';

/* Handwritten "notebook page" summary infographic for each Quarter 2 (Unit 4) lesson. */

const INK = '#1e3a8a';
const RED = '#c0392b';
const GREEN = '#1f7a4d';
const ORANGE = '#c2410c';
const PURPLE = '#6d28d9';

// Uneven radii make plain CSS boxes look hand-drawn.
const sketchy: React.CSSProperties = { borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' };

const Hl: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#fde68a' }) => (
  <span style={{ background: `linear-gradient(transparent 55%, ${color} 55%)`, padding: '0 2px' }}>{children}</span>
);

const Box: React.FC<{ children: React.ReactNode; color?: string; tilt?: number; className?: string }> = ({
  children,
  color = INK,
  tilt = 0,
  className = '',
}) => (
  <div
    className={`border-[2.5px] p-3 sm:p-4 ${className}`}
    style={{ ...sketchy, borderColor: color, transform: `rotate(${tilt}deg)` }}
  >
    {children}
  </div>
);

const Heading: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = INK }) => (
  <h3 className="lesson-hand-title text-2xl sm:text-[28px] leading-tight mb-1.5" style={{ color }}>
    {children}
  </h3>
);

const Sticky: React.FC<{ children: React.ReactNode; tilt?: number; bg?: string }> = ({ children, tilt = -2, bg = '#fef08a' }) => (
  <div className="p-3 sm:p-4 shadow-md" style={{ background: bg, transform: `rotate(${tilt}deg)` }}>
    {children}
  </div>
);

/* ---------- Simple stroke doodles ---------- */
const svgProps = { width: 44, height: 44, viewBox: '0 0 48 48', fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const Bubbles = () => (
  <svg {...svgProps} stroke={INK} aria-hidden="true">
    <path d="M14 44h20M12 20h24v18a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z" />
    <circle cx="20" cy="32" r="2.5" /><circle cx="27" cy="27" r="2" /><circle cx="24" cy="13" r="3" /><circle cx="30" cy="6" r="2.5" /><circle cx="18" cy="7" r="2" />
  </svg>
);
const Flame = () => (
  <svg {...svgProps} stroke={ORANGE} aria-hidden="true">
    <path d="M24 44c-8 0-13-5-13-12 0-8 7-11 7-19 4 3 6 6 6 10 2-2 3-5 3-8 6 5 10 11 10 17 0 7-5 12-13 12z" />
    <path d="M24 44c-3 0-5-2-5-5 0-4 5-6 5-10 3 3 5 6 5 10 0 3-2 5-5 5z" />
  </svg>
);
const ColorDrop = () => (
  <svg {...svgProps} stroke={PURPLE} aria-hidden="true">
    <path d="M24 5c6 9 13 17 13 25a13 13 0 0 1-26 0c0-8 7-16 13-25z" />
    <path d="M18 31a6 6 0 0 0 6 6" />
  </svg>
);
const Precipitate = () => (
  <svg {...svgProps} stroke={GREEN} aria-hidden="true">
    <path d="M16 4v14L7 40a3 3 0 0 0 3 4h28a3 3 0 0 0 3-4l-9-22V4M13 4h22" />
    <path d="M11 37h26" /><circle cx="18" cy="40.5" r="1" /><circle cx="24" cy="40.5" r="1" /><circle cx="30" cy="40.5" r="1" />
  </svg>
);
const Snowflake = () => (
  <svg {...svgProps} stroke="#0369a1" aria-hidden="true">
    <path d="M24 4v40M6.7 14l34.6 20M6.7 34l34.6-20M20 8l4 4 4-4M20 40l4-4 4 4" />
  </svg>
);
const Scale = () => (
  <svg {...svgProps} stroke={INK} aria-hidden="true">
    <path d="M24 6v34M14 44h20M8 14h32M8 14l-5 12h10zM40 14l-5 12h10z" />
    <path d="M3 26a5 3 0 0 0 10 0M35 26a5 3 0 0 0 10 0" />
  </svg>
);

const Arrow: React.FC<{ color?: string; label?: string }> = ({ color = INK, label }) => (
  <span className="inline-flex flex-col items-center mx-1 align-middle" style={{ color }}>
    {label && <span className="text-base leading-none">{label}</span>}
    <svg width="54" height="18" viewBox="0 0 54 18" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M2 10c12-3 26 2 46-1M40 3l9 6-9 6" />
    </svg>
  </span>
);

/* ---------- Lesson pages ---------- */

const Lesson1 = () => (
  <div className="grid gap-6">
    <p className="text-xl sm:text-2xl text-center" style={{ color: RED }}>
      Big question: <Hl>Is there a NEW substance?</Hl>
    </p>

    <div className="grid sm:grid-cols-2 gap-5">
      <Box color="#0369a1" tilt={-0.6}>
        <Heading color="#0369a1">Physical Change</Heading>
        <p>Changes <Hl color="#bae6fd">form or shape</Hl> only.</p>
        <p>Same substance before &amp; after!</p>
        <ul className="list-['✎_'] pl-5 mt-1.5">
          <li>ice melting → water</li>
          <li>tearing paper</li>
          <li>mixing sugar in water</li>
        </ul>
      </Box>
      <Box color={RED} tilt={0.6}>
        <Heading color={RED}>Chemical Reaction</Heading>
        <p>Bonds <b>break</b> &amp; atoms <b>rearrange</b> →</p>
        <p><Hl color="#fecaca">brand-new substance</Hl> with new properties.</p>
        <ul className="list-['✎_'] pl-5 mt-1.5">
          <li>burning a match</li>
          <li>nails rusting in rain</li>
          <li>baking a cake</li>
        </ul>
      </Box>
    </div>

    <div>
      <Heading>4 signs of a chemical change 👀</Heading>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {[
          { icon: <Bubbles />, t: 'Gas bubbles', d: 'fizzing without boiling' },
          { icon: <Flame />, t: 'Heat / light', d: 'gets hot, glows or burns' },
          { icon: <ColorDrop />, t: 'Color change', d: 'an unexpected new color' },
          { icon: <Precipitate />, t: 'Precipitate', d: 'a solid forms in a liquid' },
        ].map((s, i) => (
          <Box key={s.t} tilt={i % 2 ? 1 : -1} className="flex flex-col items-center text-center gap-1">
            {s.icon}
            <span className="lesson-hand-title text-xl" style={{ color: INK }}>{i + 1}. {s.t}</span>
            <span className="text-base leading-snug">{s.d}</span>
          </Box>
        ))}
      </div>
    </div>

    <Sticky tilt={-1.5}>
      <b>Remember!</b> One sign alone is a clue, not proof. Boiling water bubbles too, but it is still H₂O → physical.
    </Sticky>
  </div>
);

const Lesson2 = () => (
  <div className="grid gap-6">
    <div>
      <Heading>Reading a chemical equation</Heading>
      <div className="text-center text-3xl sm:text-4xl py-4 font-sans font-bold tracking-wide" style={{ color: INK }}>
        <span style={{ color: GREEN }}>CH<sub>4</sub> + <span style={{ color: RED }}>2</span>O<sub>2</sub></span>
        <Arrow label="yields" />
        <span style={{ color: PURPLE }}>CO<sub>2</sub> + <span style={{ color: RED }}>2</span>H<sub>2</sub>O</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <p className="text-center"><Hl color="#bbf7d0">Reactants</Hl> = what you start with (left)</p>
        <p className="text-center"><Hl color="#ddd6fe">Products</Hl> = what you end with (right)</p>
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-5">
      <Box color={RED} tilt={-0.7}>
        <Heading color={RED}>Coefficient</Heading>
        <p>The <b>big number in front</b> (the <span style={{ color: RED }}>2</span> in 2O₂).</p>
        <p>Counts whole molecules. <Hl>Change it to balance ✓</Hl></p>
      </Box>
      <Box color={INK} tilt={0.7}>
        <Heading>Subscript</Heading>
        <p>The <b>small number below</b> (the ₂ in O₂).</p>
        <p>Part of the formula. <Hl color="#fecaca">NEVER change it ✗</Hl></p>
      </Box>
    </div>

    <div>
      <Heading>Count the atoms</Heading>
      <table className="w-full max-w-md mx-auto text-center text-xl border-collapse">
        <thead>
          <tr style={{ color: INK }}>
            <th className="border-b-2 border-dashed border-slate-500 py-1">Atom</th>
            <th className="border-b-2 border-dashed border-slate-500 py-1">Left</th>
            <th className="border-b-2 border-dashed border-slate-500 py-1">Right</th>
            <th className="border-b-2 border-dashed border-slate-500 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {[['C', 1, 1], ['H', 4, 4], ['O', 4, 4]].map(([a, l, r]) => (
            <tr key={a as string}>
              <td className="py-1 font-bold">{a}</td><td>{l}</td><td>{r}</td>
              <td style={{ color: GREEN }}>✓ balanced</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="grid sm:grid-cols-[auto_1fr] items-center gap-4">
      <div className="mx-auto"><Scale /></div>
      <Sticky tilt={1}>
        <b>Law of Conservation of Mass:</b> atoms are only <Hl color="#fff">rearranged</Hl>, never created or destroyed.
        <br />So <b>mass of reactants = mass of products</b>.
      </Sticky>
    </div>
  </div>
);

const Lesson3 = () => (
  <div className="grid gap-6">
    <div className="grid sm:grid-cols-2 gap-5">
      <Box tilt={-0.6}>
        <Heading>Breaking bonds</Heading>
        <p><Hl color="#bae6fd">absorbs</Hl> energy from the surroundings ⬆</p>
      </Box>
      <Box tilt={0.6}>
        <Heading>Forming bonds</Heading>
        <p><Hl color="#fed7aa">releases</Hl> energy to the surroundings ⬇</p>
      </Box>
    </div>
    <p className="text-center text-xl" style={{ color: RED }}>
      Which is bigger decides the type of reaction!
    </p>

    <div className="grid sm:grid-cols-2 gap-5">
      <Box color={ORANGE} tilt={-0.8}>
        <div className="flex items-center justify-between gap-2">
          <Heading color={ORANGE}>Exothermic</Heading>
          <Flame />
        </div>
        <p><b>EXits</b> → <Hl color="#fed7aa">releases</Hl> thermal energy</p>
        <p>Surroundings feel <b>hotter</b> 🔥</p>
        <ul className="list-['✎_'] pl-5 mt-1.5">
          <li>thermite reaction</li>
          <li>burning wood / fuel</li>
          <li>hand warmers</li>
        </ul>
      </Box>
      <Box color="#0369a1" tilt={0.8}>
        <div className="flex items-center justify-between gap-2">
          <Heading color="#0369a1">Endothermic</Heading>
          <Snowflake />
        </div>
        <p><b>ENters</b> → <Hl color="#bae6fd">absorbs</Hl> thermal energy</p>
        <p>Surroundings feel <b>colder</b> ❄</p>
        <ul className="list-['✎_'] pl-5 mt-1.5">
          <li>instant cold packs</li>
          <li>baking soda + vinegar</li>
          <li>photosynthesis</li>
        </ul>
      </Box>
    </div>

    <div className="grid sm:grid-cols-[auto_1fr] items-center gap-4">
      <div className="mx-auto"><Scale /></div>
      <Sticky tilt={-1}>
        <b>Closed system</b> (sealed, nothing gets in or out): even with big energy changes, the
        <Hl color="#fff"> total mass stays the same</Hl> before and after.
      </Sticky>
    </div>
  </div>
);

const PAGES: Record<Unit4LessonId, React.FC> = { 1: Lesson1, 2: Lesson2, 3: Lesson3 };

interface LessonSummaryModalProps {
  lessonId: Unit4LessonId;
  onClose: () => void;
}

export const LessonSummaryModal: React.FC<LessonSummaryModalProps> = ({ lessonId, onClose }) => {
  const lesson = getUnit4Lesson(lessonId);
  const Page = PAGES[lesson.id];
  const closeRef = useRef<HTMLButtonElement>(null);
  // Parent re-renders on every video time update; keep the latest onClose without re-running the effect.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    closeRef.current?.focus();
    // Capture phase so Escape closes only this modal, not the app's pause menu.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 select-text"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${lesson.title} summary infographic`}
    >
      <article
        onClick={(e) => e.stopPropagation()}
        className="lesson-hand relative mx-auto max-w-4xl text-slate-800 text-lg sm:text-xl leading-relaxed shadow-2xl pl-10 sm:pl-16 pr-4 sm:pr-8 pt-10 pb-8"
        style={{
          backgroundColor: '#fdf8ec',
          backgroundImage:
            'linear-gradient(90deg, transparent 31px, #f2a5a5 31px, #f2a5a5 33px, transparent 33px), repeating-linear-gradient(#fdf8ec 0 31px, #d6e2f0 31px 32px)',
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 cursor-pointer font-sans"
          aria-label="Close summary"
        >
          <X className="w-5 h-5" />
        </button>

        <header className="mb-6 text-center pr-10">
          <p className="text-lg" style={{ color: GREEN }}>Quarter 2 · Unit 4 · Lesson {lesson.id}</p>
          <h2 className="lesson-hand-title text-4xl sm:text-5xl leading-tight" style={{ color: INK }}>
            <Hl>{lesson.title.replace(/^Lesson \d+:\s*/, '')}</Hl>
          </h2>
          <p className="mt-2 text-slate-600">{lesson.summary}</p>
        </header>

        <Page />

        <footer className="mt-8 text-right text-lg" style={{ color: GREEN }}>
          ✎ My summary notes · Into Science Grade 6
        </footer>
      </article>
    </div>
  );
};
