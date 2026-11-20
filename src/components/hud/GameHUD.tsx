/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChapterId, SimMode, TierLevel } from '../../game/types.ts';
import { CHAPTERS_META } from '../../game/questions.ts';
import { getStreakMultiplier } from '../../game/rules.ts';
import { sound } from '../../game/audio.ts';
import {
  Flame,
  Star,
  Trophy,
  Award,
  Volume2,
  VolumeX,
  Pause,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface GameHUDProps {
  chapterId: ChapterId;
  simMode: SimMode;
  onSelectChapter: (id: ChapterId) => void;
  onSelectSimMode: (mode: SimMode) => void;
  onStartQuiz: (tier: TierLevel) => void;
  score: number;
  streak: number;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBadges: () => void;
  onOpenLeaderboard: () => void;
  onOpenGlossary: () => void;
  onPause: () => void;
  levelProgress: Record<string, { stars: number }>;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  chapterId,
  simMode,
  onSelectChapter,
  onSelectSimMode,
  onStartQuiz,
  score,
  streak,
  stars,
  isMuted,
  onToggleMute,
  onOpenBadges,
  onOpenLeaderboard,
  onOpenGlossary,
  onPause,
  levelProgress,
}) => {
  const currentChapter = CHAPTERS_META.find((c) => c.id === chapterId) || CHAPTERS_META[0];
  const multiplier = getStreakMultiplier(streak);

  // Compute total stars for this chapter (out of 9: 3 tiers x 3 stars)
  const appStars = levelProgress[`${chapterId}_apprentice`]?.stars ?? 0;
  const resStars = levelProgress[`${chapterId}_researcher`]?.stars ?? 0;
  const masStars = levelProgress[`${chapterId}_master`]?.stars ?? 0;
  const chapterStars = appStars + resStars + masStars;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-2 sm:p-4 select-none">
      {/* Top Perimeter HUD Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2 sm:gap-4 w-full">
        {/* Top Left: Chapter Selector & Scene Pills */}
        <div className="pointer-events-auto flex flex-col gap-1.5 w-full sm:max-w-md">
          {/* Top Mobile Utility Header Bar */}
          <div className="flex sm:hidden items-center justify-between bg-slate-900/95 border border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-xl text-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">SCORE:</span>
              <span className="text-xs font-black font-mono text-cyan-400 tabular-nums">{score.toLocaleString()}</span>
              <div className="flex items-center gap-0.5 text-amber-400 font-bold text-xs ml-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{stars}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-300 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{multiplier.toFixed(1)}x</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenGlossary();
                }}
                className="p-1 bg-slate-800 rounded-lg text-emerald-400"
                aria-label="View Science Glossary"
                title="Science Glossary [G]"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenBadges();
                }}
                className="p-1 bg-slate-800 rounded-lg text-amber-400"
                aria-label="View Science Badges"
              >
                <Award className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenLeaderboard();
                }}
                className="p-1 bg-slate-800 rounded-lg text-cyan-400"
                aria-label="View Class Leaderboard"
              >
                <Trophy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleMute();
                }}
                className="p-1 bg-slate-800 rounded-lg text-slate-300"
                aria-label="Toggle Mute"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onPause();
                }}
                className="p-1 bg-slate-800 rounded-lg text-slate-300"
                aria-label="Pause Game"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chapter Selector Dropdown / Pills */}
          <div className="flex items-center justify-between sm:justify-start gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-xl">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((ch) => (
                <button
                  key={ch}
                  onClick={() => {
                    sound.playClick();
                    onSelectChapter(ch as ChapterId);
                  }}
                  className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chapterId === ch
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Ch {ch}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold px-2">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{chapterStars}/9</span>
            </div>
          </div>

          {/* Chapter Title Badge & Simulation Pills */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2 sm:p-2.5 shadow-xl">
            <div className="text-xs font-bold text-cyan-400 truncate">{currentChapter.title}</div>
            <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mb-1.5 truncate">{currentChapter.subtitle}</div>

            {/* Sim Switcher Tabs */}
            <div className="flex flex-wrap gap-1 mb-2">
              {currentChapter.simModes.map((sm) => (
                <button
                  key={sm.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectSimMode(sm.id);
                  }}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold rounded-md transition-all ${
                    simMode === sm.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sm.label}
                </button>
              ))}
            </div>

            {/* Quiz Launch Tiers */}
            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-1">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold">Quiz:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    sound.playClick();
                    onStartQuiz('apprentice');
                  }}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold flex items-center gap-0.5"
                >
                  <span>Apprentice</span>
                  <span className="text-amber-300">{'★'.repeat(appStars)}</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onStartQuiz('researcher');
                  }}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold flex items-center gap-0.5"
                >
                  <span>Researcher</span>
                  <span className="text-amber-300">{'★'.repeat(resStars)}</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onStartQuiz('master');
                  }}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold flex items-center gap-0.5"
                >
                  <span>Master</span>
                  <span className="text-amber-300">{'★'.repeat(masStars)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Center: Streak Combo Flame Meter (Desktop) */}
        <div className="pointer-events-auto hidden sm:flex items-center">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
              streak >= 2
                ? 'bg-amber-950/80 border-amber-500/70 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/80 border-slate-700/70 text-slate-400'
            }`}
          >
            <Flame
              className={`w-5 h-5 transition-transform ${
                streak >= 2 ? 'text-amber-400 animate-bounce' : 'text-slate-500'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                {streak >= 2 ? `STREAK COMBO ${streak}x` : 'STREAK COMBO'}
              </span>
              <span className="text-sm font-black font-mono leading-tight tabular-nums text-amber-300">
                {multiplier.toFixed(1)}x MULTIPLIER
              </span>
            </div>
          </div>
        </div>

        {/* Top Right: Desktop Score, Badges, Leaderboard, Audio & Pause Controls */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2">
          {/* Score & Stars Cluster */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-xl text-slate-100">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ACADEMY SCORE</span>
              <span className="text-base font-black font-mono tabular-nums text-cyan-400">
                {score.toLocaleString()}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums">{stars}</span>
            </div>
          </div>

          {/* Science Glossary Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenGlossary();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-emerald-400 hover:text-emerald-300 shadow-xl flex items-center gap-1.5"
            title="Science Glossary [G]"
            aria-label="View Science Glossary"
          >
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold hidden md:inline">Glossary</span>
          </button>

          {/* Badges Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBadges();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 hover:text-white shadow-xl"
            title="Science Badges"
            aria-label="View Science Badges"
          >
            <Award className="w-5 h-5 text-amber-400" />
          </button>

          {/* Academy Leaderboard Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 hover:text-white shadow-xl"
            title="Class Leaderboard"
            aria-label="View Class Leaderboard"
          >
            <Trophy className="w-5 h-5 text-cyan-400" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white shadow-xl"
            title={isMuted ? 'Unmute Audio [M]' : 'Mute Audio [M]'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              sound.playClick();
              onPause();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white shadow-xl"
            title="Pause Game [Esc / P]"
            aria-label="Pause Game"
          >
            <Pause className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
