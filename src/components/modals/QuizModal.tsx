/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ChapterId, TierLevel } from '../../game/types.ts';
import { QUESTIONS, CHAPTERS_META } from '../../game/questions.ts';
import { calculateQuestionScore, calculateStars, QUESTION_TIME_LIMIT_SEC } from '../../game/rules.ts';
import { sound } from '../../game/audio.ts';
import {
  CheckCircle2,
  XCircle,
  Timer,
  Star,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface QuizModalProps {
  chapterId: ChapterId;
  tier: TierLevel;
  onClose: () => void;
  onLevelComplete: (stars: number, pointsEarned: number) => void;
  currentStreak: number;
  onStreakUpdate: (newStreak: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  chapterId,
  tier,
  onClose,
  onLevelComplete,
  currentStreak,
  onStreakUpdate,
}) => {
  const questions = QUESTIONS.filter((q) => q.chapterId === chapterId && q.tier === tier);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT_SEC);
  const [levelScore, setLevelScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [localStreak, setLocalStreak] = useState(currentStreak);

  const currentQ = questions[currentIdx] || questions[0];
  const chapter = CHAPTERS_META.find((c) => c.id === chapterId);

  useEffect(() => {
    if (isAnswered || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnswered, isFinished, currentIdx]);

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOpt(optionIdx);

    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      const newStreak = localStreak + 1;
      setLocalStreak(newStreak);
      onStreakUpdate(newStreak);

      const timeElapsed = QUESTION_TIME_LIMIT_SEC - timeLeft;
      const scoreResult = calculateQuestionScore(timeElapsed, localStreak);
      setLevelScore((prev) => prev + scoreResult.total);
      setCorrectCount((prev) => prev + 1);

      sound.playCorrect(newStreak);
      if (newStreak >= 5) {
        sound.playStreakFanfare();
      }
    } else {
      setLocalStreak(0);
      onStreakUpdate(0);
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimeLeft(QUESTION_TIME_LIMIT_SEC);
    } else {
      setIsFinished(true);
      const starsEarned = calculateStars(correctCount, questions.length);
      onLevelComplete(starsEarned, levelScore);

      if (starsEarned >= 2) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (_) {}
      }
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setTimeLeft(QUESTION_TIME_LIMIT_SEC);
    setLevelScore(0);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <div
      dir="auto"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Laboratory Knowledge Check"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl p-5 sm:p-7 text-slate-100 flex flex-col max-h-[94vh] overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
          <div>
            <span className="text-sm font-bold text-cyan-300 block">
              {chapter?.title} · <span className="capitalize text-amber-300">{tier} Level</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              Laboratory Knowledge Check
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="min-h-[42px] text-slate-100 hover:text-white text-sm font-bold px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 border border-slate-600 cursor-pointer transition-colors"
          >
            Exit Quiz
          </button>
        </div>

        {!isFinished ? (
          <div className="flex flex-col gap-5">
            {/* Progress & Speed Timer Bar */}
            <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base text-slate-200 mb-2.5">
                <span>
                  Question <strong className="text-white">{currentIdx + 1}</strong> of {questions.length}
                </span>
                <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold tabular-nums">
                  <Timer className="w-5 h-5" />
                  <span>{timeLeft}s Speed Bonus</span>
                </div>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT_SEC) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Prompt Card */}
            <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-5 sm:p-6">
              <p className="text-lg sm:text-xl font-bold leading-relaxed text-white">
                {currentQ.prompt}
              </p>
            </div>

            {/* Answer Options */}
            <div className="flex flex-col gap-3.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle =
                  'bg-slate-900 hover:bg-slate-800 border-slate-600 text-slate-100';
                let badgeStyle = 'bg-slate-800 border-slate-600 text-cyan-200';
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-400 text-white shadow-md';
                    badgeStyle = 'bg-emerald-500 border-emerald-300 text-slate-950';
                  } else if (idx === selectedOpt) {
                    btnStyle = 'bg-rose-950/80 border-rose-400 text-white shadow-md';
                    badgeStyle = 'bg-rose-500 border-rose-300 text-white';
                  } else {
                    btnStyle = 'opacity-65 border-slate-800 bg-slate-900/50 text-slate-400';
                    badgeStyle = 'bg-slate-900 border-slate-700 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full min-h-[56px] text-left p-4 sm:p-5 rounded-2xl border-2 text-base sm:text-lg font-semibold transition-colors flex items-center gap-4 ${btnStyle} ${
                      isAnswered ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 text-sm font-mono font-extrabold ${badgeStyle}`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Textbook Rationale Banner */}
            {isAnswered && (
              <div
                className={`p-5 rounded-2xl border-2 flex flex-col gap-2.5 ${
                  selectedOpt === currentQ.correctIndex
                    ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-100'
                    : 'bg-rose-950/60 border-rose-500/70 text-rose-100'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-extrabold text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    {selectedOpt === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-200">Correct Analysis!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span className="text-rose-200">Needs Review</span>
                      </>
                    )}
                  </div>
                  <span className="text-sm text-slate-200 font-mono flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-300" />
                    {currentQ.sourceRef}
                  </span>
                </div>
                <p className="text-slate-100 leading-relaxed text-base">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full min-h-[52px] py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold rounded-xl text-base flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-colors"
              >
                <span>{currentIdx + 1 === questions.length ? 'View Level Results' : 'Next Question'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          /* Level Results Screen */
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-20 h-20 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center mb-5">
              <Award className="w-10 h-10 text-cyan-300" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Level Complete!</h3>
            <p className="text-base sm:text-lg text-slate-200 mb-6">
              You scored <strong className="text-cyan-300">{correctCount}</strong> out of{' '}
              <strong className="text-white">{questions.length}</strong> correct on{' '}
              <span className="capitalize text-amber-300 font-bold">{tier}</span>.
            </p>

            {/* Stars Awarded */}
            <div className="flex items-center gap-3 mb-7">
              {[1, 2, 3].map((starIdx) => {
                const earned = calculateStars(correctCount, questions.length) >= starIdx;
                return (
                  <Star
                    key={starIdx}
                    className={`w-12 h-12 ${
                      earned ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Score & Streak Stats */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-7">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                <span className="text-sm font-bold text-slate-300 block mb-1">Total Score</span>
                <div className="text-2xl font-extrabold font-mono text-cyan-300 tabular-nums">
                  +{levelScore}
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                <span className="text-sm font-bold text-slate-300 block mb-1">Active Streak</span>
                <div className="text-2xl font-extrabold font-mono text-amber-300 tabular-nums">
                  {localStreak}x
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={handleRestart}
                className="flex-1 min-h-[50px] py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 min-h-[50px] py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-base cursor-pointer transition-colors"
              >
                Back to Lab
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
