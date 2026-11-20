/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimMode, ChapterId } from '../../game/types.ts';
import { sound } from '../../game/audio.ts';
import {
  ChevronDown,
  ChevronUp,
  Flame,
  Droplet,
  Thermometer,
  Zap,
  Hammer,
} from 'lucide-react';

interface BottomControlDockProps {
  chapterId: ChapterId;
  mode: SimMode;
  onSelectMode: (mode: SimMode) => void;
  chamberState: 'solid' | 'liquid' | 'gas';
  setChamberState: (s: 'solid' | 'liquid' | 'gas') => void;
  displacementSubmerged: boolean;
  setDisplacementSubmerged: (b: boolean) => void;
  onResetDiffusion: () => void;
  thermalTemp: number;
  setThermalTemp: (t: number) => void;
  galliumTemp: number;
  setGalliumTemp: (t: number) => void;
  elevationIdx: number;
  setElevationIdx: (idx: number) => void;
  bohrElementIdx: number;
  setBohrElementIdx: (idx: number) => void;
  moseleyTargetIdx: number;
  setMoseleyTargetIdx: (idx: number) => void;
  metalsType: 'copper' | 'silver';
  setMetalsType: (t: 'copper' | 'silver') => void;
  onStrikeHammer: () => void;
  onToggleCircuit: () => void;
  moleculeType: 'h2o' | 'co2' | 'ch4' | 'o3';
  setMoleculeType: (m: 'h2o' | 'co2' | 'ch4' | 'o3') => void;
  allotropesMode: 'diamond' | 'graphite' | 'both';
  setAllotropesMode: (m: 'diamond' | 'graphite' | 'both') => void;
  onSlideGraphite: () => void;
  onToggleSaltCoord: () => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  mode,
  chamberState,
  setChamberState,
  displacementSubmerged,
  setDisplacementSubmerged,
  onResetDiffusion,
  thermalTemp,
  setThermalTemp,
  galliumTemp,
  setGalliumTemp,
  elevationIdx,
  setElevationIdx,
  bohrElementIdx,
  setBohrElementIdx,
  moseleyTargetIdx,
  setMoseleyTargetIdx,
  metalsType,
  setMetalsType,
  onStrikeHammer,
  onToggleCircuit,
  moleculeType,
  setMoleculeType,
  allotropesMode,
  setAllotropesMode,
  onSlideGraphite,
  onToggleSaltCoord,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div dir="auto" className="w-full bg-slate-900 border-t border-slate-700/80 shrink-0 z-20 select-none">
      {/* Collapse / Expand Toggle Bar */}
      <div className="flex justify-center border-b border-slate-800 bg-slate-950/70 py-1">
        <button
          onClick={() => {
            sound.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="text-slate-200 hover:text-white px-4 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Show Controls Dock' : 'Hide Controls Dock'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-4 h-4 text-cyan-400" />
              <span>Show Lab Controls [H]</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
              <span>Minimize Controls</span>
            </>
          )}
        </button>
      </div>

      {/* Dock Content Surface */}
      {!isCollapsed && (
        <div className="p-3 sm:p-4 text-slate-100 max-w-5xl mx-auto">
          {mode === 'chamber' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-extrabold text-cyan-300">Microscopic State:</span>
                <div className="flex rounded-xl overflow-hidden border border-slate-600 bg-slate-800">
                  {(['solid', 'liquid', 'gas'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        sound.playClick();
                        setChamberState(s);
                      }}
                      className={`min-h-[40px] px-4 py-1.5 text-sm font-bold capitalize transition-colors cursor-pointer ${
                        chamberState === s
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-200 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-100 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700 leading-snug">
                {chamberState === 'solid' && 'Solid: Tightly packed vibrating cubic lattice with strong attractive forces.'}
                {chamberState === 'liquid' && 'Liquid: Fluid particles sliding past each other with medium kinetic energy.'}
                {chamberState === 'gas' && 'Gas: Rapidly bouncing particles filling 3D space with high kinetic energy.'}
              </div>
            </div>
          )}

          {mode === 'displacement' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    setDisplacementSubmerged(!displacementSubmerged);
                  }}
                  className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-extrabold transition-colors cursor-pointer ${
                    displacementSubmerged
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {displacementSubmerged ? 'Retrieve 20g Rock' : 'Submerge 20g Rock'}
                </button>
                <div className="text-sm text-slate-100 font-medium">
                  Initial: <span className="text-cyan-300 font-bold">50 mL</span> → Current:{' '}
                  <span className="text-cyan-300 font-bold">{displacementSubmerged ? '75 mL' : '50 mL'}</span>
                </div>
              </div>
              <div className="text-sm bg-slate-950/80 border border-slate-700 px-4 py-2 rounded-xl text-emerald-300 font-mono tabular-nums">
                Volume Displaced: {displacementSubmerged ? '25 mL' : '0 mL'} · Density D = 20g / 25mL ={' '}
                {displacementSubmerged ? '0.80 g/cm³' : '---'}
              </div>
            </div>
          )}

          {mode === 'diffusion' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onResetDiffusion();
                }}
                className="min-h-[42px] bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Droplet className="w-4 h-4" />
                <span>Add Food Coloring Drop</span>
              </button>
              <div className="text-sm text-slate-100 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700 leading-snug">
                Left Beaker (Liquid Water): Dye molecules diffuse freely. Right Plate (Solid Ice): Dye remains on top!
              </div>
            </div>
          )}

          {mode === 'thermal' && (
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold">
                  <Thermometer className="w-5 h-5 text-orange-400" />
                  <span>Burner Temperature:</span>
                  <span className="text-amber-300 font-mono tabular-nums">{thermalTemp} °C</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {thermalTemp < 0 && 'Solid Ice (-20°C to 0°C)'}
                  {thermalTemp === 0 && 'Melting Plateau (Latent Heat)'}
                  {thermalTemp > 0 && thermalTemp < 100 && 'Liquid Water (0°C to 100°C)'}
                  {thermalTemp === 100 && 'Boiling Plateau (Latent Heat)'}
                  {thermalTemp > 100 && 'Superheated Steam Gas (100°C+)'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-sky-300 font-bold shrink-0">-20°C</span>
                <input
                  type="range"
                  min="-20"
                  max="150"
                  value={thermalTemp}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setThermalTemp(val);
                    sound.playThermalPulse();
                  }}
                  aria-label="Burner Temperature"
                  className="w-full accent-amber-500 cursor-pointer h-3 bg-slate-700 rounded-lg"
                />
                <span className="text-sm text-rose-300 font-bold shrink-0">150°C</span>
              </div>
            </div>
          )}

          {mode === 'gallium' && (
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold">
                  <Flame className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Hand Temp:</span>
                  <span className="text-cyan-300 font-mono tabular-nums">{galliumTemp} °C</span>
                  <span className="text-slate-300 text-sm font-medium">(Melt Pt: 29.8 °C)</span>
                </div>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-lg ${
                    galliumTemp >= 29.8 ? 'bg-amber-900/70 text-amber-200' : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {galliumTemp >= 29.8 ? 'Molten Liquid Pool in Palm!' : 'Solid Metallic Ingot'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300 font-semibold shrink-0">15°C (Cool)</span>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={galliumTemp}
                  onChange={(e) => {
                    setGalliumTemp(parseInt(e.target.value));
                    sound.playClick();
                  }}
                  aria-label="Hand Temperature"
                  className="w-full accent-cyan-500 cursor-pointer h-3 bg-slate-700 rounded-lg"
                />
                <span className="text-sm text-slate-300 font-semibold shrink-0">45°C (Warm)</span>
              </div>
            </div>
          )}

          {mode === 'elevation' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-extrabold text-cyan-300">Location:</span>
                <div className="flex flex-wrap rounded-xl overflow-hidden border border-slate-600 bg-slate-800">
                  {['Sea Level (0m)', 'Denver (1,609m)', 'Quito (2,850m)', 'Mt. Everest (8,848m)'].map((loc, idx) => (
                    <button
                      key={loc}
                      onClick={() => {
                        sound.playClick();
                        setElevationIdx(idx);
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 text-sm font-bold transition-colors cursor-pointer ${
                        elevationIdx === idx ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {loc.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm bg-slate-950/80 border border-slate-700 px-4 py-2 rounded-xl text-amber-200 font-mono tabular-nums">
                {elevationIdx === 0 && 'Pressure: 1.0 atm · Boiling Point: 100.0 °C · Egg Cook: 3m 11s'}
                {elevationIdx === 1 && 'Pressure: 0.82 atm · Boiling Point: 95.0 °C · Egg Cook: 4m 00s'}
                {elevationIdx === 2 && 'Pressure: 0.71 atm · Boiling Point: 90.0 °C · Egg Cook: 4m 35s'}
                {elevationIdx === 3 && 'Pressure: 0.31 atm · Boiling Point: 76.5 °C · Egg Cook: 7m 15s'}
              </div>
            </div>
          )}

          {mode === 'bohr' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-extrabold text-cyan-300">Element:</span>
                <div className="flex flex-wrap rounded-xl overflow-hidden border border-slate-600 bg-slate-800">
                  {['Hydrogen (1)', 'Carbon (6)', 'Oxygen (8)', 'Copper (29)'].map((el, idx) => (
                    <button
                      key={el}
                      onClick={() => {
                        sound.playClick();
                        setBohrElementIdx(idx);
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 text-sm font-bold transition-colors cursor-pointer ${
                        bohrElementIdx === idx ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {el}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-100 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700">
                Red Spheres = Protons · Gray Spheres = Neutrons · Cyan Rings = Electron Orbitals
              </div>
            </div>
          )}

          {mode === 'moseley' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-extrabold text-purple-300">Anode Target:</span>
                <div className="flex flex-wrap rounded-xl overflow-hidden border border-slate-600 bg-slate-800">
                  {['Iron (Fe-26)', 'Cobalt (Co-27)', 'Nickel (Ni-28)', 'Copper (Cu-29)'].map((t, idx) => (
                    <button
                      key={t}
                      onClick={() => {
                        sound.playCathodeZap();
                        setMoseleyTargetIdx(idx);
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 text-sm font-bold transition-colors cursor-pointer ${
                        moseleyTargetIdx === idx ? 'bg-purple-600 text-white' : 'text-slate-200 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm bg-slate-950/80 border border-slate-700 px-4 py-2 rounded-xl text-purple-200 font-mono">
                Cathode Beam Energy → Emitted X-Ray Frequency Reveals Exact Whole Number (Z)
              </div>
            </div>
          )}

          {mode === 'metals' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex rounded-xl overflow-hidden border border-slate-600 bg-slate-800">
                  {(['copper', 'silver'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        sound.playClick();
                        setMetalsType(m);
                      }}
                      className={`min-h-[40px] px-4 py-1.5 text-sm font-bold capitalize transition-colors cursor-pointer ${
                        metalsType === m ? 'bg-amber-600 text-white' : 'text-slate-200 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {m} Vessel
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onStrikeHammer();
                  }}
                  className="min-h-[40px] bg-slate-700 hover:bg-slate-600 text-amber-200 px-4 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Hammer className="w-4 h-4" />
                  <span>Strike with Hammer</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onToggleCircuit();
                  }}
                  className="min-h-[40px] bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Test Conduction</span>
                </button>
              </div>
              <div className="text-sm text-slate-100 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700">
                Metallic atoms slide past each other without cracking (malleability)!
              </div>
            </div>
          )}

          {mode === 'molecules' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-extrabold text-cyan-300">Molecule:</span>
                <div className="flex flex-wrap rounded-xl overflow-hidden border border-slate-600 bg-slate-800">
                  {[
                    { id: 'h2o', label: 'H2O (Water 2:1)' },
                    { id: 'co2', label: 'CO2 (Carbon Dioxide 1:2)' },
                    { id: 'ch4', label: 'CH4 (Methane 1:4)' },
                    { id: 'o3', label: 'O3 (Ozone)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        sound.playClick();
                        setMoleculeType(m.id as 'h2o' | 'co2' | 'ch4' | 'o3');
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 text-sm font-bold transition-colors cursor-pointer ${
                        moleculeType === m.id ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-100 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700 font-mono">
                Red: Oxygen · White: Hydrogen · Dark: Carbon · Silver Cylinders: Covalent Bonds
              </div>
            </div>
          )}

          {mode === 'allotropes' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex rounded-xl overflow-hidden border border-slate-600 bg-slate-800">
                  {(['both', 'diamond', 'graphite'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        sound.playClick();
                        setAllotropesMode(m);
                      }}
                      className={`min-h-[40px] px-4 py-1.5 text-sm font-bold capitalize transition-colors cursor-pointer ${
                        allotropesMode === m ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSlideGraphite();
                  }}
                  className="min-h-[40px] bg-slate-700 hover:bg-slate-600 text-cyan-200 px-4 py-1.5 rounded-xl text-sm font-bold cursor-pointer transition-colors"
                >
                  Slide Graphite Sheet (Pencil Action)
                </button>
              </div>
              <div className="text-sm text-slate-100 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700">
                Diamond: 3D interlocking tetrahedral cage (hardest) · Graphite: 2D stacked hexagonal sheets (soft)
              </div>
            </div>
          )}

          {mode === 'salt' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleSaltCoord();
                }}
                className="min-h-[42px] bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-extrabold cursor-pointer transition-colors"
              >
                Highlight 6-Fold Coordination
              </button>
              <div className="text-sm text-slate-100 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700">
                Purple: Na+ Sodium Ions · Green: Cl- Chlorine Ions. Each ion is surrounded by 6 opposite neighbors!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
