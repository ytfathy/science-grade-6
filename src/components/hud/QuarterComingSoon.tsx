/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChapterId, QuarterId } from '../../game/types.ts';
import { sound } from '../../game/audio.ts';
import { Clock, Lock, Sparkles, ArrowLeft } from 'lucide-react';

interface QuarterComingSoonProps {
  quarterId: QuarterId;
  lessonId?: ChapterId | null;
  onReturnToQuarter1: () => void;
  onBackToQuarter?: () => void;
  compact?: boolean;
}

export const QuarterComingSoon: React.FC<QuarterComingSoonProps> = ({
  quarterId,
  lessonId,
  onReturnToQuarter1,
  onBackToQuarter,
  compact = false,
}) => {
  return (
    <div
      dir="auto"
      className={`w-full flex flex-col items-center justify-center text-center select-none overflow-y-auto ${
        compact
          ? 'bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl'
          : 'flex-1 bg-slate-950 p-6 sm:p-10'
      }`}
    >
      <div className="max-w-xl w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-xl">
        <div
          className={`rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 ${
            compact ? 'w-14 h-14 mb-4' : 'w-16 h-16 mb-5'
          }`}
        >
          <Clock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 text-amber-300 text-sm font-bold mb-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            Quarter {quarterId}
            {lessonId ? ` · Lesson ${lessonId}` : ''} · Coming Soon
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Quarter {quarterId} {lessonId ? `Lesson ${lessonId} Lab` : '3D Lab'} Is Coming Soon!
        </h2>

        <p className="text-base text-slate-200 leading-relaxed mb-7">
          New interactive 3D science simulations and audio walkthroughs for{' '}
          <span className="text-cyan-300 font-bold">
            Quarter {quarterId}
            {lessonId ? ` · Lesson ${lessonId}` : ''}
          </span>{' '}
          are currently being prepared. All current Unit 3 3D simulations are ready to explore in{' '}
          <span className="text-emerald-300 font-bold">Quarter 1</span>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {onBackToQuarter && (
            <button
              onClick={() => {
                sound.playClick();
                onBackToQuarter();
              }}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-base shadow flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Quarter {quarterId}</span>
            </button>
          )}
          <button
            onClick={() => {
              sound.playClick();
              onReturnToQuarter1();
            }}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-base shadow flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            <span>Open Quarter 1 Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
};
