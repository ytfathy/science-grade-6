/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChapterId, SimMode, TierLevel } from '../../game/types.ts';
import { CHAPTERS_META } from '../../game/questions.ts';
import { getNarrationForMode } from '../../game/narrations.ts';
import { sound } from '../../game/audio.ts';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  X,
  ChevronRight,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';

interface LabSidebarProps {
  chapterId: ChapterId;
  simMode: SimMode;
  onSelectSimMode: (mode: SimMode) => void;
  onStartQuiz: (tier: TierLevel) => void;
  levelProgress: Record<string, { stars: number }>;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenNowTest?: () => void;
}

export const LabSidebar: React.FC<LabSidebarProps> = ({
  chapterId,
  simMode,
  onSelectSimMode,
  onStartQuiz,
  levelProgress,
  isOpen = true,
  onClose,
  onOpenNowTest,
}) => {
  const currentChapter = CHAPTERS_META.find((c) => c.id === chapterId) || CHAPTERS_META[0];
  const narration = getNarrationForMode(simMode);

  const appStars = levelProgress[`${chapterId}_apprentice`]?.stars ?? 0;
  const resStars = levelProgress[`${chapterId}_researcher`]?.stars ?? 0;
  const masStars = levelProgress[`${chapterId}_master`]?.stars ?? 0;

  return (
    <aside
      dir="auto"
      className={`bg-slate-900 border-r border-slate-700/80 flex-col w-80 sm:w-[340px] shrink-0 select-none overflow-y-auto transition-all ${
        isOpen
          ? 'fixed md:relative inset-y-0 left-0 z-40 md:z-20 flex shadow-2xl md:shadow-none max-w-[90vw]'
          : 'hidden md:flex'
      }`}
    >
      {/* Chapter Overview Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/75 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs font-extrabold text-cyan-300 mb-0.5">
            Lesson {currentChapter.id}
          </div>
          <h2 className="text-base font-extrabold text-white leading-snug">
            {currentChapter.title}
          </h2>
          <p className="text-sm text-slate-300 mt-1 leading-snug">{currentChapter.subtitle}</p>
        </div>

        {onClose && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="md:hidden min-h-[40px] min-w-[40px] p-2 text-slate-200 hover:text-white rounded-xl hover:bg-slate-800 flex items-center justify-center shrink-0"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Lab Mode Selector */}
      <section className="p-4 flex flex-col gap-2.5 border-b border-slate-800">
        <div className="flex items-center justify-between text-sm font-extrabold text-slate-200">
          <span className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Curriculum Labs</span>
          </span>
          <span className="text-xs text-cyan-300 font-mono">3 Labs</span>
        </div>

        <div className="flex flex-col gap-2">
          {currentChapter.simModes.map((sm, idx) => {
            const isCurrent = simMode === sm.id;
            return (
              <button
                key={sm.id}
                onClick={() => {
                  sound.playClick();
                  onSelectSimMode(sm.id);
                }}
                className={`w-full min-h-[46px] text-left px-3.5 py-2.5 rounded-xl border text-sm font-bold transition-colors flex items-center justify-between gap-2.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-950/90 border-cyan-400 text-white shadow'
                    : 'bg-slate-950/70 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      isCurrent ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{sm.label}</span>
                </div>
                {isCurrent && <ChevronRight className="w-4 h-4 text-cyan-300 shrink-0" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Level Quizzes Card */}
      <section className="p-4 border-b border-slate-800 bg-slate-950/35 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200">
          <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Lesson Mastery Quizzes</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onStartQuiz('apprentice');
            }}
            className="min-h-[60px] flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-emerald-500/50 hover:border-emerald-400 text-white transition-colors cursor-pointer"
          >
            <span className="text-xs font-extrabold text-emerald-300">Apprentice</span>
            <span className="text-amber-400 text-sm font-mono mt-1">
              {'★'.repeat(appStars)}
              {'☆'.repeat(3 - appStars)}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onStartQuiz('researcher');
            }}
            className="min-h-[60px] flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-blue-500/50 hover:border-blue-400 text-white transition-colors cursor-pointer"
          >
            <span className="text-xs font-extrabold text-sky-300">Researcher</span>
            <span className="text-amber-400 text-sm font-mono mt-1">
              {'★'.repeat(resStars)}
              {'☆'.repeat(3 - resStars)}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onStartQuiz('master');
            }}
            className="min-h-[60px] flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-purple-500/50 hover:border-purple-400 text-white transition-colors cursor-pointer"
          >
            <span className="text-xs font-extrabold text-purple-300">Master</span>
            <span className="text-amber-400 text-sm font-mono mt-1">
              {'★'.repeat(masStars)}
              {'☆'.repeat(3 - masStars)}
            </span>
          </button>
        </div>

        {onOpenNowTest && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenNowTest();
            }}
            className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-cyan-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 border border-emerald-400/40 shadow transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            <span>Now Test Yourself (67 Questions)</span>
          </button>
        )}
      </section>

      {/* Curriculum Core Concept Notes */}
      <section className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 text-sm font-extrabold text-slate-200">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Key Scientific Insights</span>
          </span>
          <span className="text-xs text-slate-300 font-mono">{narration.textbookRef}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {narration.keyPoints.map((point, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-slate-100 flex items-start gap-2.5 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};
