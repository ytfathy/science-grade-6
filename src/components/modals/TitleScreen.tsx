/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Unit4LessonId } from '../../game/unit4.ts';
import { LessonSummaryModal } from './LessonSummaryModal.tsx';
import { ModelVideoModal } from './ModelVideoModal.tsx';
import { ChapterId, QuarterId } from '../../game/types.ts';
import { QUARTERS_META } from '../../game/questions.ts';
import { sound } from '../../game/audio.ts';
import {
  Sparkles,
  Play,
  Award,
  LogOut,
  NotebookPen,
  Box,
  BookOpen,
  Lock,
  ArrowLeft,
  FlaskConical,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface TitleScreenProps {
  selectedQuarterHub: QuarterId | null;
  onSelectQuarterHub: (q: QuarterId | null) => void;
  onLaunchLab: (quarterId: QuarterId, lessonId?: ChapterId) => void;
  onOpenGlossary: (quarterId: QuarterId, lessonId?: ChapterId | 'all') => void;
  onOpenNowTest: (quarterId: QuarterId, lessonFilter?: string) => void;
  onOpenBadges: () => void;
  onOpenLeaderboard: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedQuarterHub,
  onSelectQuarterHub,
  onLaunchLab,
  onOpenGlossary,
  onOpenNowTest,
  onOpenBadges,
  onOpenLeaderboard,
}) => {
  const [summaryLessonId, setSummaryLessonId] = useState<Unit4LessonId | null>(null);
  const [modelLessonId, setModelLessonId] = useState<Unit4LessonId | null>(null);
  const currentQuarterMeta = selectedQuarterHub
    ? QUARTERS_META.find((q) => q.id === selectedQuarterHub) ?? QUARTERS_META[0]
    : null;

  return (
    <div
      dir="auto"
      className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-y-auto overflow-x-hidden"
    >
      {/* Top Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-5xl mx-auto shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {selectedQuarterHub !== null ? (
            <button
              onClick={() => {
                sound.playClick();
                onSelectQuarterHub(null);
              }}
              className="min-h-[44px] text-sm font-bold text-cyan-100 hover:text-white bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 px-4 py-2 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>All Quarters</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 text-slate-100 font-bold text-sm bg-slate-900/95 border border-slate-700/80 pl-2 pr-4 py-1.5 rounded-xl shadow-md max-w-full">
              <img
                src="/assets/aistudio/3b0bae58-c82a-45b7-ac9b-530c0eb6e994_6307d513.jpeg"
                alt="International Education Egypt Logo"
                className="w-7 h-7 rounded-full object-cover scale-105 shrink-0"
              />
              <span className="truncate">International Education Egypt · Grade 6</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onOpenBadges();
            }}
            className="min-h-[44px] text-sm font-bold text-amber-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
          >
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Badges</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="min-h-[44px] text-sm font-bold text-cyan-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Leaderboard</span>
          </button>
          <a
            href="/auth/logout"
            style={{ textDecoration: 'none' }}
            className="min-h-[44px] text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      {selectedQuarterHub === null ? (
        /* LEVEL 1: MAIN SCREEN WITH 4 QUARTER BUTTONS */
        <div className="flex flex-col items-center justify-center my-auto text-center max-w-4xl mx-auto py-6 sm:py-8 w-full">
          {/* Official Organization Logo */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full overflow-hidden ring-2 ring-amber-400/70 shadow-xl bg-slate-950 shrink-0">
            <img
              src="/assets/aistudio/3b0bae58-c82a-45b7-ac9b-530c0eb6e994_6307d513.jpeg"
              alt="International Education Egypt Logo"
              className="w-full h-full object-cover scale-[1.06]"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-indigo-200 tracking-tight mb-3">
            Into Science Grade 6
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mb-8 leading-relaxed">
            Choose a Quarter to explore interactive 3D science simulations, lesson-organized vocabulary in the Glossary, and self-paced practice questions.
          </p>

          {/* 4 Main Quarter Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full max-w-4xl">
            {QUARTERS_META.map((q) => {
              const isActive = q.available || q.labAvailable;
              return (
                <button
                  key={q.id}
                  data-quarter-btn={q.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectQuarterHub(q.id);
                  }}
                  className={`group p-5 sm:p-6 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer active:scale-[0.99] shadow-lg min-h-[124px] ${
                    isActive
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/70 border-cyan-500/60 hover:border-cyan-400'
                      : 'bg-slate-900/95 border-slate-700/80 hover:border-amber-500/60 hover:bg-slate-800/90'
                  }`}
                >
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                        {q.label}
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      {q.available ? (
                        <span className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Active</span>
                        </span>
                      ) : q.labAvailable ? (
                        <span className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{q.badgeLabel ?? 'Video Lab'}</span>
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <span>Coming Soon</span>
                        </span>
                      )}
                    </div>

                    <span className="text-base font-semibold text-slate-100 leading-snug">
                      {q.subtitle}
                    </span>

                    <span className="text-sm text-slate-300 font-medium mt-0.5">
                      4 Lessons · Lab · Glossary · Now Test Yourself
                    </span>
                  </div>

                  <div
                    className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* LEVEL 2: QUARTER HUB (IDENTICAL STRUCTURE FOR QUARTER 1, 2, 3, 4) */
        currentQuarterMeta && (
          <div className="flex flex-col items-center justify-center my-auto max-w-5xl mx-auto py-5 w-full gap-6">
            {/* Section 1: Quarter Header + Quick Quarter Switcher */}
            <section className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-cyan-500/50 shrink-0 bg-slate-950 shadow-md">
                  <img
                    src="/assets/aistudio/3b0bae58-c82a-45b7-ac9b-530c0eb6e994_6307d513.jpeg"
                    alt="International Education Egypt Logo"
                    className="w-full h-full object-cover scale-[1.06]"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-sm font-bold">
                    <span className="text-cyan-300">Into Science Grade 6</span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    {currentQuarterMeta.available ? (
                      <span className="text-emerald-300">Active Curriculum</span>
                    ) : currentQuarterMeta.labAvailable ? (
                      <span className="text-cyan-200">
                        Unit 4 Video Lab, Glossary &amp; Lesson 1 Test Active
                      </span>
                    ) : (
                      <span className="text-amber-300 inline-flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Coming Soon</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                    {currentQuarterMeta.label}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-200 mt-0.5">
                    {currentQuarterMeta.subtitle}
                  </p>
                </div>
              </div>

              {/* Quick Switcher between Quarters */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-700 self-start md:self-center shrink-0">
                {QUARTERS_META.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectQuarterHub(q.id);
                    }}
                    className={`min-h-[40px] min-w-[46px] px-3.5 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      q.id === currentQuarterMeta.id
                        ? q.available || q.labAvailable
                          ? 'bg-cyan-600 text-white shadow'
                          : 'bg-amber-600 text-white shadow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Q{q.id}
                  </button>
                ))}
              </div>
            </section>

            {/* Section 2: 3 Primary Quarter Feature Buttons */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full" aria-label="Quarter Primary Tools">
              <button
                data-start={currentQuarterMeta.available ? 'true' : undefined}
                onClick={() => {
                  sound.playClick();
                  onLaunchLab(currentQuarterMeta.id, 1);
                }}
                className="p-5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg flex items-center gap-4 transition-transform active:scale-[0.99] cursor-pointer text-left min-h-[88px]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-extrabold leading-tight">Launch Lab</div>
                  <div className="text-sm text-cyan-50/95 mt-1 leading-snug">
                    {currentQuarterMeta.available
                      ? 'Interactive 3D Simulations'
                      : currentQuarterMeta.labAvailable
                      ? 'Unit 4 Video Lab · Lessons 1–3'
                      : '3D Simulations · Coming Soon'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenGlossary(currentQuarterMeta.id, 'all');
                }}
                className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-white shadow-lg flex items-center gap-4 transition-transform active:scale-[0.99] cursor-pointer text-left min-h-[88px]"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-extrabold leading-tight">Glossary</div>
                  <div className="text-sm text-slate-200 mt-1 leading-snug">
                    {currentQuarterMeta.available
                      ? 'Scientific Terms by Lesson'
                      : currentQuarterMeta.glossaryAvailable
                      ? '17 Unit 4 Terms · Lessons 1–3'
                      : 'Vocabulary · Coming Soon'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenNowTest(currentQuarterMeta.id, 'all');
                }}
                className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-cyan-600 border border-emerald-400/50 text-white shadow-lg flex items-center gap-4 transition-transform active:scale-[0.99] cursor-pointer text-left min-h-[88px]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-extrabold leading-tight">Now Test Yourself</div>
                  <div className="text-sm text-emerald-50/95 mt-1 leading-snug">
                    {currentQuarterMeta.available
                      ? '67 Questions · No Timer'
                      : currentQuarterMeta.testAvailable
                      ? '13 Lesson 1 Questions · No Timer'
                      : 'Lesson Quiz · Coming Soon'}
                  </div>
                </div>
              </button>
            </section>

            {/* Section 3: Divided Inside by Lessons */}
            <section className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5 text-base font-extrabold text-white">
                  <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>{currentQuarterMeta.label} · Divided by Lessons</span>
                </div>
                <span className="text-sm font-mono font-semibold text-slate-300">
                  {currentQuarterMeta.lessons.length} Lessons
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuarterMeta.lessons.map((lesson) => {
                  const lessonKey = `lesson${lesson.id}`;
                  const isLessonLabActive = currentQuarterMeta.available || lesson.available;
                  return (
                    <div
                      key={lesson.id}
                      data-quarter-lesson={`${currentQuarterMeta.id}-${lesson.id}`}
                      className="p-5 rounded-2xl bg-slate-950/90 border border-slate-700/80 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap text-sm font-bold">
                          <span className="text-cyan-300">Lesson {lesson.id}</span>
                          {!isLessonLabActive ? (
                            <span className="text-amber-300 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Coming Soon</span>
                            </span>
                          ) : !currentQuarterMeta.available && lesson.badgeLabel ? (
                            <span className="text-emerald-300">{lesson.badgeLabel}</span>
                          ) : null}
                        </div>
                        <h3 className="text-lg font-extrabold text-white leading-snug">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{lesson.subtitle}</p>
                      </div>

                      {/* Lesson-specific Launch Lab | Glossary | Test */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                        <button
                          onClick={() => {
                            sound.playClick();
                            onLaunchLab(currentQuarterMeta.id, lesson.id);
                          }}
                          className="min-h-[44px] px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-100 hover:text-white border border-cyan-500/40 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <FlaskConical className="w-4 h-4 shrink-0" />
                          <span>Launch Lab</span>
                        </button>

                        <button
                          onClick={() => {
                            sound.playClick();
                            onOpenGlossary(currentQuarterMeta.id, lesson.id);
                          }}
                          className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>Glossary</span>
                        </button>

                        <button
                          onClick={() => {
                            sound.playClick();
                            onOpenNowTest(currentQuarterMeta.id, lessonKey);
                          }}
                          className="min-h-[44px] px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-100 hover:text-white border border-emerald-500/40 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="w-4 h-4 shrink-0" />
                          <span>Test</span>
                        </button>
                      </div>

                      {currentQuarterMeta.id === 2 && lesson.available && lesson.id <= 3 && (
                        <div className="grid grid-cols-2 gap-2 -mt-2">
                          <button
                            onClick={() => {
                              sound.playClick();
                              setSummaryLessonId(lesson.id as Unit4LessonId);
                            }}
                            className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-100 hover:text-slate-950 border border-amber-400/50 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <NotebookPen className="w-4 h-4 shrink-0" />
                            <span>Summary</span>
                          </button>
                          <button
                            onClick={() => {
                              sound.playClick();
                              setModelLessonId(lesson.id as Unit4LessonId);
                            }}
                            className="min-h-[44px] px-3 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500 text-violet-100 hover:text-white border border-violet-400/50 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Box className="w-4 h-4 shrink-0" />
                            <span>3D Model Video</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )
      )}

      {summaryLessonId && (
        <LessonSummaryModal lessonId={summaryLessonId} onClose={() => setSummaryLessonId(null)} />
      )}
      {modelLessonId && <ModelVideoModal lessonId={modelLessonId} onClose={() => setModelLessonId(null)} />}

      {/* Quiet Footer */}
      <footer className="text-center text-sm text-slate-300 font-medium pt-4 shrink-0">
        Into Science Grade 6 · Interactive 3D Science Curriculum
      </footer>
    </div>
  );
};
