/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { sound } from '../../game/audio.ts';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onRestart, onTitle }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        dir="auto"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col text-center"
      >
        <h2 className="text-2xl font-extrabold text-white mb-2">Laboratory Paused</h2>
        <p className="text-base text-slate-300 leading-relaxed mb-6">
          Take a short break or resume your science investigation right where you left off.
        </p>

        <div className="flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full min-h-[52px] px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-2xl text-base flex items-center justify-center gap-2.5 shadow-lg transition-colors cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume Experiment</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full min-h-[50px] px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 font-bold rounded-2xl text-base flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart Chapter</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onTitle();
            }}
            className="w-full min-h-[50px] px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 font-bold rounded-2xl text-base flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>Title Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
