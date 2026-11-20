/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChapterId, QuarterId } from '../../game/types.ts';
import { CHAPTERS_META, QUARTERS_META } from '../../game/questions.ts';
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
  Menu,
  Sparkles,
  Lock,
  Layers,
  Home,
} from 'lucide-react';

interface TopChapterBarProps {
  activeQuarter: QuarterId;
  onSelectQuarter: (q: QuarterId) => void;
  chapterId: ChapterId;
  onSelectChapter: (id: ChapterId) => void;
  score: number;
  streak: number;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBadges: () => void;
  onOpenLeaderboard: () => void;
  onOpenGlossary: () => void;
  onOpenNowTest: () => void;
  onPause: () => void;
  onHome?: () => void;
  onToggleSidebar?: () => void;
  levelProgress: Record<string, { stars: number }>;
}

export const TopChapterBar: React.FC<TopChapterBarProps> = ({
  activeQuarter,
  onSelectQuarter,
  chapterId,
  onSelectChapter,
  score,
  streak,
  stars,
  isMuted,
  onToggleMute,
  onOpenBadges,
  onOpenLeaderboard,
  onOpenGlossary,
  onOpenNowTest,
  onPause,
  onHome,
  onToggleSidebar,
  levelProgress,
}) => {
  const multiplier = getStreakMultiplier(streak);

  const appStars = levelProgress[`${chapterId}_apprentice`]?.stars ?? 0;
  const resStars = levelProgress[`${chapterId}_researcher`]?.stars ?? 0;
  const masStars = levelProgress[`${chapterId}_master`]?.stars ?? 0;
  const chapterStars = appStars + resStars + masStars;

  return (
    <header className="w-full bg-slate-900 border-b border-slate-700/80 shrink-0 z-30 select-none shadow-md flex flex-col overflow-hidden">
      {/* Row 1: Quarter Navigation Tabs */}
      <div
        className="w-full bg-slate-950/95 border-b border-slate-800 px-3 sm:px-5 py-1.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none"
        role="tablist"
        aria-label="Academic Quarters"
      >
        <div className="flex items-center gap-2 shrink-0">
          {onHome && (
            <button
              onClick={() => {
                sound.playClick();
                onHome();
              }}
              className="min-h-[38px] px-3 py-1.5 rounded-xl text-sm font-bold text-slate-100 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              title="Back to Quarters Main Screen"
              aria-label="Back to Quarters Main Screen"
            >
              <Home className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Quarters</span>
            </button>
          )}
          <span className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-slate-300 mr-1 whitespace-nowrap">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Quarter:</span>
          </span>
          {QUARTERS_META.map((q) => {
            const isSelected = activeQuarter === q.id;
            const hasContent = q.available || q.labAvailable;
            return (
              <button
                key={q.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  sound.playClick();
                  onSelectQuarter(q.id);
                }}
                className={`min-h-[38px] px-2.5 sm:px-3.5 py-1.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? hasContent
                      ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow'
                      : 'bg-amber-600 text-white shadow'
                    : hasContent
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800'
                    : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/80'
                }`}
              >
                <span className="sm:hidden">Q{q.id}</span>
                <span className="hidden sm:inline">{q.label}</span>
                {!hasContent && <Lock className="w-3.5 h-3.5 opacity-80 shrink-0" />}
              </button>
            );
          })}
        </div>

        <span className="hidden xl:inline text-sm font-bold text-cyan-200 whitespace-nowrap shrink-0">
          Into Science Grade 6
        </span>
      </div>

      {/* Row 2: Brand, Active Quarter Lessons (Lesson 1-4) & Primary Actions */}
      <div className="w-full px-3 sm:px-5 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand / Sidebar toggle + Lesson selector tabs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleSidebar && activeQuarter === 1 && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleSidebar();
              }}
              className="md:hidden min-h-[40px] min-w-[40px] p-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl border border-slate-700 flex items-center justify-center shrink-0"
              title="Toggle Lab Menu"
              aria-label="Toggle Lab Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-cyan-400/60 shrink-0 bg-slate-950">
              <img
                src="/assets/aistudio/3b0bae58-c82a-45b7-ac9b-530c0eb6e994_6307d513.jpeg"
                alt="International Education Egypt Logo"
                className="w-full h-full object-cover scale-[1.06]"
              />
            </div>
            <span className="hidden xl:inline text-sm font-extrabold text-white whitespace-nowrap">
              Into Science
            </span>
          </div>

          {/* Lesson Selection Bar (Quarter 1 / Quarter 2) */}
          {activeQuarter === 1 ? (
            <>
              <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl p-1 gap-1 shrink-0">
                {CHAPTERS_META.map((ch) => {
                  const isSelected = chapterId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        sound.playClick();
                        onSelectChapter(ch.id);
                      }}
                      className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title={ch.title}
                    >
                      <span className="sm:hidden">L{ch.id}</span>
                      <span className="hidden sm:inline">Lesson {ch.id}</span>
                      <span className="hidden 2xl:inline text-xs font-medium opacity-90">
                        {ch.id === 1 ? 'Properties' : ch.id === 2 ? 'States' : ch.id === 3 ? 'Atoms' : 'Molecules'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-1.5 text-amber-300 text-sm font-bold font-mono tabular-nums px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span>{chapterStars}/9</span>
              </div>
            </>
          ) : activeQuarter === 2 ? (
            <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl p-1 gap-1 shrink-0">
              {(QUARTERS_META.find((q) => q.id === 2)?.lessons ?? []).map((lesson) => {
                const isSelected = chapterId === lesson.id;
                const shortLabel =
                  lesson.id === 1
                    ? 'Reactions'
                    : lesson.id === 2
                    ? 'Equations'
                    : lesson.id === 3
                    ? 'Energy'
                    : 'Soon';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectChapter(lesson.id);
                    }}
                    className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? lesson.available
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                          : 'bg-amber-600 text-white shadow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title={lesson.title}
                  >
                    <span className="sm:hidden">L{lesson.id}</span>
                    <span className="hidden sm:inline">Lesson {lesson.id}</span>
                    <span className="hidden 2xl:inline text-xs font-medium opacity-90">{shortLabel}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-200 text-sm font-bold whitespace-nowrap">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Quarter {activeQuarter} · Coming Soon</span>
            </div>
          )}
        </div>

        {/* Right: Stats + Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Streak Combo */}
          <div
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold font-mono tabular-nums ${
              streak >= 2
                ? 'bg-amber-950/80 border-amber-500/70 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}
            title="Correct streak quiz multiplier"
          >
            <Flame className={`w-4 h-4 shrink-0 ${streak >= 2 ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{multiplier.toFixed(1)}x</span>
          </div>

          {/* Score & Total Stars */}
          <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm">
            <span className="text-slate-300 font-semibold hidden lg:inline">Score:</span>
            <span className="font-extrabold font-mono text-cyan-300 tabular-nums">
              {score.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-bold ml-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-mono tabular-nums">{stars}</span>
            </div>
          </div>

          {/* Now Test Yourself Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNowTest();
            }}
            className="min-h-[40px] px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 rounded-xl text-white flex items-center gap-1.5 text-sm font-extrabold shadow transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            title={
              activeQuarter === 2
                ? 'Now Test Yourself: Grade 6 Unit 4 Question Bank'
                : 'Now Test Yourself: Grade 6 Unit 3 Question Bank'
            }
            aria-label="Now Test Yourself"
          >
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            <span className="hidden sm:inline">Now Test Yourself</span>
            <span className="sm:hidden">Test</span>
          </button>

          {/* Science Glossary Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenGlossary();
            }}
            className="min-h-[40px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 text-sm font-bold cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            title="Science Glossary [G]"
            aria-label="View Science Glossary"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Glossary</span>
          </button>

          {/* Badges Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBadges();
            }}
            className="min-h-[40px] min-w-[40px] p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-amber-300 hover:text-amber-200 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            title="Science Badges"
            aria-label="View Science Badges"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="min-h-[40px] min-w-[40px] p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-cyan-300 hover:text-cyan-200 flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            title="Class Leaderboard"
            aria-label="View Class Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Mute Button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="min-h-[40px] min-w-[40px] p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-200 hover:text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            title={isMuted ? 'Unmute Audio [M]' : 'Mute Audio [M]'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            )}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              sound.playClick();
              onPause();
            }}
            className="min-h-[40px] min-w-[40px] p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-200 hover:text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            title="Pause Game [Esc / P]"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
