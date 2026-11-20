/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Badge } from '../../game/types.ts';
import { sound } from '../../game/audio.ts';
import {
  Award,
  Lock,
  CheckCircle2,
  X,
  Flame,
  Atom,
  FlaskConical,
  Sparkles,
  Mountain,
  Layers,
  Zap,
  Hammer,
  Binary,
  Gem,
  Trophy,
  ThermometerSnowflake,
} from 'lucide-react';

interface BadgesModalProps {
  badges: Badge[];
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Atom,
  FlaskConical,
  Flame,
  ThermometerSnowflake,
  Sparkles,
  Mountain,
  Layers,
  Zap,
  Hammer,
  Binary,
  Gem,
  Trophy,
};

export const BadgesModal: React.FC<BadgesModalProps> = ({ badges, onClose }) => {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div
        dir="auto"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl p-5 sm:p-7 text-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 shrink-0 bg-amber-950/70 border border-amber-500/50 rounded-2xl text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                MatterQuest Honors &amp; Badges
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-0.5">
                Unlocked <strong className="text-amber-300 tabular-nums">{unlockedCount}</strong> of{' '}
                <span className="tabular-nums">{badges.length}</span> Science Badges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close Badges"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1">
          {badges.map((badge) => {
            const IconComponent = ICON_MAP[badge.icon] || Award;
            return (
              <div
                key={badge.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-colors flex flex-col justify-between gap-3 ${
                  badge.unlocked
                    ? 'bg-slate-800/90 border-amber-400/60 shadow-lg'
                    : 'bg-slate-800/45 border-slate-700/80 opacity-85'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        badge.unlocked
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md'
                          : 'bg-slate-700/90 text-slate-300'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {badge.unlocked ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Earned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                        <Lock className="w-4 h-4 text-slate-400" />
                        Locked
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-extrabold mb-1.5 ${badge.unlocked ? 'text-white' : 'text-slate-200'}`}>
                    {badge.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{badge.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-700/80 text-xs sm:text-sm text-slate-300 font-medium">
                  <span className="text-amber-300 font-bold">Goal:</span> {badge.req}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
