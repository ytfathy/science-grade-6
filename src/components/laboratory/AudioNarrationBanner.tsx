/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SimMode } from '../../game/types.ts';
import { getNarrationForMode } from '../../game/narrations.ts';
import { speech } from '../../game/speech.ts';
import { sound } from '../../game/audio.ts';
import {
  Play,
  Pause,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Sparkles,
  FileText,
  X,
} from 'lucide-react';

interface AudioNarrationBannerProps {
  mode: SimMode;
  onOpenTranscriptModal?: () => void;
}

export const AudioNarrationBanner: React.FC<AudioNarrationBannerProps> = ({ mode }) => {
  const narration = getNarrationForMode(mode);

  const [speechState, setSpeechState] = useState({
    isSpeaking: false,
    isPaused: false,
    progressPercent: 0,
    currentWord: '',
  });

  const [rate, setRate] = useState<number>(1.0);
  const [autoNarrate, setAutoNarrate] = useState<boolean>(true);
  const [showFullTranscript, setShowFullTranscript] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = speech.subscribe((state) => {
      setSpeechState(state);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (autoNarrate) {
      const timer = setTimeout(() => {
        speech.speak(narration.script, rate);
      }, 350);
      return () => {
        clearTimeout(timer);
        speech.stop();
      };
    } else {
      speech.stop();
    }
  }, [mode, autoNarrate]);

  const handlePlayPause = () => {
    sound.playClick();
    if (speechState.isSpeaking) {
      if (speechState.isPaused) {
        speech.resume();
      } else {
        speech.pause();
      }
    } else {
      speech.speak(narration.script, rate);
    }
  };

  const handleReplay = () => {
    sound.playClick();
    speech.speak(narration.script, rate);
  };

  const handleToggleRate = () => {
    sound.playClick();
    const nextRate = rate === 1.0 ? 1.25 : rate === 1.25 ? 0.9 : 1.0;
    setRate(nextRate);
    if (speechState.isSpeaking && !speechState.isPaused) {
      speech.speak(narration.script, nextRate);
    }
  };

  const isSpeakingNow = speechState.isSpeaking && !speechState.isPaused;

  return (
    <>
      <div
        dir="auto"
        className="w-full bg-slate-900 border-b border-cyan-500/25 px-3 sm:px-5 py-2 flex flex-col gap-1.5 z-20 shrink-0 select-none shadow-md"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Audio guide label & title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${
                isSpeakingNow
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Headphones className="w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-extrabold text-cyan-300">Audio Guide (English)</span>
              <span className="text-sm font-bold text-white truncate max-w-[220px] sm:max-w-sm md:max-w-md">
                {narration.title}
              </span>
            </div>
          </div>

          {/* Center: Live Subtitle line */}
          <div className="hidden xl:flex flex-1 items-center justify-center px-4 min-w-0">
            <div className="w-full max-w-xl bg-slate-950/85 border border-slate-700 rounded-xl px-4 py-1.5 text-sm text-slate-200 truncate">
              {isSpeakingNow ? (
                <span className="text-cyan-200 font-semibold">{narration.script}</span>
              ) : speechState.isPaused ? (
                <span className="text-amber-300 font-medium">Paused · Click Listen to continue</span>
              ) : (
                <span className="text-slate-300">
                  Press Listen for the scientific walkthrough ({narration.durationSec}s)
                </span>
              )}
            </div>
          </div>

          {/* Right: Audio playback controls */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handlePlayPause}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSpeakingNow
                  ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white'
              }`}
              title={isSpeakingNow ? 'Pause Narration' : 'Play Narration'}
              aria-label={isSpeakingNow ? 'Pause Audio' : 'Play Audio'}
            >
              {isSpeakingNow ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Listen</span>
                </>
              )}
            </button>

            <button
              onClick={handleReplay}
              className="min-h-[38px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Replay from start"
              aria-label="Replay Audio"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Replay</span>
            </button>

            <button
              onClick={handleToggleRate}
              className="min-h-[38px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm font-mono font-bold text-cyan-300 cursor-pointer transition-colors"
              title="Voice Speed (0.9x, 1x, 1.25x)"
            >
              {rate}x
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setAutoNarrate(!autoNarrate);
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors hidden sm:block cursor-pointer ${
                autoNarrate
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
              title="Automatically narrate when switching simulations"
            >
              Auto: {autoNarrate ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowFullTranscript(true);
              }}
              className="min-h-[38px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="View Complete Text Transcript"
              aria-label="View Transcript"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span className="hidden sm:inline">Script</span>
            </button>
          </div>
        </div>

        {/* Narration Progress bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-cyan-400 h-full transition-all duration-300"
            style={{ width: `${speechState.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Transcript Modal */}
      {showFullTranscript && (
        <div
          dir="auto"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Audio Narration Transcript"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 bg-cyan-950 border border-cyan-500/60 text-cyan-300 rounded-xl flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    {narration.title}
                  </h3>
                  <p className="text-sm text-cyan-300 font-mono">{narration.textbookRef}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullTranscript(false)}
                className="min-h-[42px] min-w-[42px] p-2 text-slate-200 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                aria-label="Close Transcript"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Script Text */}
            <section className="bg-slate-950/85 border border-slate-700 rounded-2xl p-5 text-base sm:text-lg leading-relaxed text-slate-100">
              <p>{narration.script}</p>
            </section>

            {/* Core Takeaways */}
            <section className="flex flex-col gap-2.5">
              <span className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Curriculum Takeaways</span>
              </span>
              {narration.keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-base text-slate-100 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </section>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handlePlayPause}
                className="min-h-[46px] px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-base flex items-center gap-2 cursor-pointer transition-colors"
              >
                {isSpeakingNow ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{isSpeakingNow ? 'Pause Audio' : 'Play Audio'}</span>
              </button>
              <button
                onClick={() => setShowFullTranscript(false)}
                className="min-h-[46px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-base cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
