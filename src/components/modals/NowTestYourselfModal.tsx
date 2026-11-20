/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  getNowTestQuestions,
  getNowTestLessonFilters,
  NowTestQuestion,
} from '../../data/nowTestYourselfData.ts';
import { sound } from '../../game/audio.ts';
import {
  X,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle,
  Check,
  ChevronRight,
  ListFilter,
  Clock,
  Lock,
} from 'lucide-react';
import { QuarterId } from '../../game/types.ts';

interface NowTestYourselfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScore?: (points: number) => void;
  quarterId?: QuarterId;
  initialLessonFilter?: string;
}

export const NowTestYourselfModal: React.FC<NowTestYourselfModalProps> = ({
  isOpen,
  onClose,
  onAddScore,
  quarterId = 1,
  initialLessonFilter = 'all',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialLessonFilter);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedFilter(initialLessonFilter);
      setCurrentIndex(0);
      setIsCompleted(false);
    }
  }, [isOpen, initialLessonFilter, quarterId]);

  const quarterQuestions = useMemo(() => getNowTestQuestions(quarterId), [quarterId]);
  const lessonFilters = useMemo(() => getNowTestLessonFilters(quarterId), [quarterId]);

  const filteredQuestions = useMemo(() => {
    if (selectedFilter === 'all') return quarterQuestions;
    return quarterQuestions.filter((q) => q.lessonKey === selectedFilter);
  }, [quarterQuestions, selectedFilter]);

  const currentQuestion: NowTestQuestion | undefined = filteredQuestions[currentIndex];

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const [answeredMap, setAnsweredMap] = useState<
    Record<string, { selectedIndices: number[]; isCorrect: boolean }>
  >({});

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleFilterChange = (filterKey: string) => {
    sound.playClick();
    setSelectedFilter(filterKey);
    setCurrentIndex(0);
    setSelectedOptions([]);
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsCompleted(false);
  };

  useEffect(() => {
    if (!currentQuestion) return;
    const past = answeredMap[currentQuestion.id];
    if (past) {
      setSelectedOptions(past.selectedIndices);
      setIsSubmitted(true);
      setIsCorrect(past.isCorrect);
    } else {
      setSelectedOptions([]);
      setIsSubmitted(false);
      setIsCorrect(false);
    }
  }, [currentIndex, currentQuestion, answeredMap]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleOption = (idx: number) => {
    if (isSubmitted) return;
    sound.playClick();

    if (!currentQuestion) return;

    if (currentQuestion.isMultiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx].sort((a, b) => a - b)
      );
    } else {
      setSelectedOptions([idx]);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion || selectedOptions.length === 0 || isSubmitted) return;

    const correctSet = new Set(currentQuestion.correctIndices);
    const userSet = new Set(selectedOptions);

    const correct =
      correctSet.size === userSet.size &&
      [...correctSet].every((val) => userSet.has(val));

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      sound.playCorrect(1);
      if (onAddScore) onAddScore(25);
    } else {
      sound.playWrong();
    }

    setAnsweredMap((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedIndices: selectedOptions,
        isCorrect: correct,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (!isSubmitted) return;
    sound.playClick();

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      sound.playStreakFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOptions([]);
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsCompleted(false);
    setAnsweredMap((prev) => {
      const updated = { ...prev };
      filteredQuestions.forEach((q) => {
        delete updated[q.id];
      });
      return updated;
    });
  };

  const totalInFilter = filteredQuestions.length;
  const answeredCount = Object.keys(answeredMap).filter((id) =>
    filteredQuestions.some((q) => q.id === id)
  ).length;
  const correctCount = Object.entries(answeredMap).filter(
    ([id, ans]) => ans.isCorrect && filteredQuestions.some((q) => q.id === id)
  ).length;
  const accuracyPercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div
      dir="auto"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Now Test Yourself Question Bank"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Now Test Yourself · Quarter {quarterId}
                </h2>
                <span className="hidden sm:inline text-sm font-bold text-emerald-300">
                  · Self-Paced · No Timer
                </span>
              </div>
              <p className="text-sm text-slate-300 hidden sm:block mt-0.5">
                Into Science Grade 6 — Quarter {quarterId} Question &amp; Answer Bank Divided by Lessons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {totalInFilter > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold">
                <span className="text-slate-300">Score:</span>
                <span className="text-emerald-300 font-mono tabular-nums">
                  {correctCount} / {totalInFilter}
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-cyan-300 font-mono tabular-nums">{accuracyPercent}%</span>
              </div>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="min-h-[44px] min-w-[44px] px-3 py-2 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-sm font-bold cursor-pointer"
              title="Close [Esc]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
              <span className="hidden md:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Lesson Filter Navigation Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap sm:flex-nowrap sm:overflow-x-auto items-center gap-2 shrink-0 scrollbar-none">
          <div className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-slate-300 mr-1 shrink-0">
            <ListFilter className="w-4 h-4 text-cyan-400" />
            <span>Lessons:</span>
          </div>
          {lessonFilters.map((f) => {
            const isSelected = selectedFilter === f.key;
            const mobileShortLabel =
              f.key === 'all'
                ? 'All'
                : f.key.replace('lesson', 'Lesson ');
            return (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`min-h-[38px] sm:min-h-[40px] px-3 sm:px-3.5 py-1.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <span className="sm:hidden">{mobileShortLabel}</span>
                <span className="hidden sm:inline">{f.title}</span>
                {quarterQuestions.length > 0 && (
                  <span
                    className={`text-xs font-mono tabular-nums px-1.5 sm:px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-black/25 text-white'
                        : f.count > 0
                        ? 'bg-slate-900 text-cyan-300'
                        : 'bg-slate-900 text-amber-300'
                    }`}
                  >
                    {f.count > 0 ? f.count : 'Soon'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
          {totalInFilter === 0 ? (
            <div className="max-w-xl mx-auto py-8 sm:py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-5">
                <Clock className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-2 text-amber-300 text-sm font-bold mb-2">
                <Lock className="w-4 h-4" />
                <span>
                  Quarter {quarterId}
                  {selectedFilter !== 'all' ? ` · ${selectedFilter.replace('lesson', 'Lesson ')}` : ''} · Coming Soon
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {quarterQuestions.length > 0
                  ? `${selectedFilter.replace('lesson', 'Lesson ')} Questions Coming Soon!`
                  : `Quarter ${quarterId} Self-Assessment Is Coming Soon!`}
              </h3>
              <p className="text-base text-slate-200 leading-relaxed mb-7">
                {quarterQuestions.length > 0
                  ? `Practice questions for Quarter ${quarterId} ${selectedFilter.replace('lesson', 'Lesson ')} have not been added yet. You can practice all ${quarterQuestions.length} Quarter ${quarterId} Lesson 1 questions right now!`
                  : `Practice questions divided by Lesson 1–4 for Quarter ${quarterId} are currently being prepared. You can practice Unit 3 (Quarter 1) and Unit 4 Lesson 1 (Quarter 2) questions right now.`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {quarterQuestions.length > 0 && (
                  <button
                    onClick={() => handleFilterChange('lesson1')}
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base cursor-pointer shadow-lg transition-colors"
                  >
                    Practice Lesson 1 ({quarterQuestions.length} Questions)
                  </button>
                )}
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-base cursor-pointer transition-colors"
                >
                  Back to Quarter {quarterId}
                </button>
              </div>
            </div>
          ) : !isCompleted && currentQuestion ? (
            <div className="max-w-3xl mx-auto flex flex-col gap-5 sm:gap-6">
              {/* Section 1: Lesson Title & Progress Card */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/75 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-cyan-500/15 border border-cyan-500/40 rounded-xl text-cyan-300 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-cyan-300 block">Target Lesson</span>
                    <span className="text-base sm:text-lg font-extrabold text-white block leading-snug">
                      {currentQuestion.lessonTitle}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-sm sm:text-base font-mono font-bold text-white tabular-nums">
                    Question {currentIndex + 1}{' '}
                    <span className="text-slate-400 font-normal">of {totalInFilter}</span>
                  </span>
                  <div className="w-36 sm:w-44 h-2.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 rounded-full"
                      style={{
                        width: `${((currentIndex + 1) / totalInFilter) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Question Prompt & Visual Diagram Card */}
              <div className="bg-slate-800/55 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-lg flex flex-col gap-5">
                <div className="flex items-start gap-3.5">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 font-mono text-sm font-extrabold shrink-0">
                    Q{currentQuestion.qNum}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed whitespace-pre-line">
                    {currentQuestion.questionText}
                  </h3>
                </div>

                {currentQuestion.imageSrc && (
                  <div className="flex justify-center sm:justify-start">
                    <div className="rounded-2xl overflow-hidden border border-slate-600 bg-white/95 p-2.5 shadow-lg max-w-md">
                      <img
                        src={currentQuestion.imageSrc}
                        alt={currentQuestion.imageAlt ?? 'Question visual reference'}
                        className="w-full h-auto max-h-64 object-contain rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {currentQuestion.isMultiSelect && (
                  <div className="text-sm sm:text-base font-bold text-amber-200 bg-amber-950/60 border border-amber-500/50 rounded-xl px-4 py-3 inline-flex items-center gap-2.5 self-start">
                    <HelpCircle className="w-5 h-5 text-amber-300 shrink-0" />
                    <span>Select all options that apply before checking</span>
                  </div>
                )}

                {/* Section 3: Spacious Answer Options */}
                <div className="space-y-3.5 pt-1">
                  {currentQuestion.options.map((optText, idx) => {
                    const letter =
                      currentQuestion.optionLetters[idx] || ['A', 'B', 'C', 'D', 'E', 'F'][idx];
                    const isSelected = selectedOptions.includes(idx);
                    const isCorrectOption = currentQuestion.correctIndices.includes(idx);

                    let optionStyle =
                      'bg-slate-900 hover:bg-slate-800 border-slate-600/90 text-slate-100';
                    let letterBadgeStyle =
                      'bg-slate-800 border-slate-600 text-cyan-200';

                    if (isSubmitted) {
                      if (isCorrectOption) {
                        optionStyle =
                          'bg-emerald-950/80 border-emerald-400 text-white shadow-md';
                        letterBadgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-300';
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle =
                          'bg-rose-950/80 border-rose-400 text-white shadow-md';
                        letterBadgeStyle = 'bg-rose-500 text-white border-rose-300';
                      } else {
                        optionStyle = 'bg-slate-900/50 border-slate-800 text-slate-400 opacity-75';
                        letterBadgeStyle = 'bg-slate-900 border-slate-700 text-slate-500';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'bg-cyan-950/85 border-cyan-400 text-white ring-2 ring-cyan-400/50 shadow-md';
                      letterBadgeStyle = 'bg-cyan-500 text-slate-950 border-cyan-300';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => handleToggleOption(idx)}
                        className={`w-full min-h-[58px] text-left p-4 sm:p-5 rounded-2xl border-2 transition-colors flex items-center gap-4 ${optionStyle} ${
                          isSubmitted ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl border font-mono font-extrabold text-sm flex items-center justify-center shrink-0 transition-colors ${letterBadgeStyle}`}
                        >
                          {letter}
                        </div>

                        <div className="flex-1 text-base sm:text-lg font-semibold leading-snug">
                          {optText}
                        </div>

                        {isSubmitted && (
                          <div className="shrink-0">
                            {isCorrectOption ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            ) : isSelected ? (
                              <XCircle className="w-6 h-6 text-rose-400" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Section 4: Feedback, Official Answer & Scientific Explanation */}
                {isSubmitted && (
                  <div
                    className={`mt-2 p-5 sm:p-6 rounded-2xl border-2 flex flex-col gap-3.5 ${
                      isCorrect
                        ? 'bg-emerald-950/55 border-emerald-500/70 text-emerald-100'
                        : 'bg-rose-950/55 border-rose-500/70 text-rose-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                          <span className="text-emerald-200 font-extrabold text-lg">
                            Correct! Great science reasoning.
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                          <span className="text-rose-200 font-extrabold text-lg">
                            Incorrect. Review the answer below:
                          </span>
                        </>
                      )}
                    </div>

                    <div className="text-base font-bold text-white bg-slate-950/75 border border-slate-700 rounded-xl px-4 py-3">
                      <span className="text-cyan-300 font-extrabold">Official Answer: </span>
                      <span>{currentQuestion.answerRaw}</span>
                    </div>

                    {currentQuestion.explanation && (
                      <div className="text-base text-slate-100 leading-relaxed bg-slate-950/75 p-4 rounded-xl border border-slate-700">
                        <span className="text-amber-300 font-extrabold block mb-1">
                          Scientific Explanation
                        </span>
                        <p>{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Quiz Completion / Results View */
            <div className="max-w-2xl mx-auto py-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-5 shadow-lg">
                <Award className="w-10 h-10" />
              </div>

              <h3 className="text-3xl font-extrabold text-white mb-2">
                Assessment Completed!
              </h3>
              <p className="text-slate-200 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
                {quarterId === 2
                  ? 'You tested your knowledge across Grade 6 Unit 4: Chemical Processes & Equations!'
                  : 'You tested your knowledge across Grade 6 Unit 3: The Structure of Matter!'}
              </p>

              {/* Score summary cards */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-lg mb-8">
                <div className="bg-slate-800/85 border border-slate-700 p-5 rounded-2xl">
                  <span className="text-sm font-bold text-slate-300 block mb-1">Correct</span>
                  <span className="text-3xl font-extrabold text-emerald-300 font-mono tabular-nums">
                    {correctCount}
                  </span>
                </div>
                <div className="bg-slate-800/85 border border-slate-700 p-5 rounded-2xl">
                  <span className="text-sm font-bold text-slate-300 block mb-1">Total</span>
                  <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                    {totalInFilter}
                  </span>
                </div>
                <div className="bg-slate-800/85 border border-slate-700 p-5 rounded-2xl">
                  <span className="text-sm font-bold text-slate-300 block mb-1">Accuracy</span>
                  <span className="text-3xl font-extrabold text-cyan-300 font-mono tabular-nums">
                    {accuracyPercent}%
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
                <button
                  onClick={handleRestart}
                  className="w-full sm:flex-1 min-h-[52px] py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Restart Test</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="w-full sm:flex-1 min-h-[52px] py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Return to Lab</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer for Active Question */}
        {totalInFilter > 0 && !isCompleted && currentQuestion && (
          <div className="shrink-0 border-t border-slate-800 bg-slate-950/95 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm sm:text-base font-medium text-center sm:text-left">
              {!isSubmitted ? (
                <span className="text-slate-200">
                  Select your answer above, then click <strong className="text-emerald-300">Check Answer</strong> to continue.
                </span>
              ) : (
                <span className="text-emerald-300 font-bold">
                  ✓ Answer verified. Ready for the next step!
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              {!isSubmitted ? (
                <button
                  disabled={selectedOptions.length === 0}
                  onClick={handleCheckAnswer}
                  className={`w-full sm:w-auto min-h-[50px] px-7 py-3 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 transition-colors ${
                    selectedOptions.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg cursor-pointer active:scale-95'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  <span>Check Answer</span>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto min-h-[50px] px-7 py-3 rounded-xl font-extrabold text-base bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <span>
                    {currentIndex < filteredQuestions.length - 1
                      ? 'Next Question'
                      : 'View Final Results'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
