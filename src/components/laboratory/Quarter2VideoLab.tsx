/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ChapterId } from '../../game/types.ts';
import {
  UNIT4_LESSONS,
  UNIT4_VIDEO_SRC,
  Unit4LessonId,
  getUnit4Lesson,
  getUnit4StartSeconds,
} from '../../game/unit4.ts';
import { sound } from '../../game/audio.ts';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Film,
  Flame,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface Quarter2VideoLabProps {
  lessonId: Unit4LessonId;
  onSelectLesson: (id: ChapterId) => void;
  onBackToQuarter: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const Quarter2VideoLab: React.FC<Quarter2VideoLabProps> = ({
  lessonId,
  onSelectLesson,
  onBackToQuarter,
  isMuted = false,
  onToggleMute,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pendingSeekRef = useRef<number | null>(getUnit4StartSeconds(lessonId));
  const pendingAutoPlayRef = useRef<boolean>(true);
  const lastHandledLessonIdRef = useRef<Unit4LessonId | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(getUnit4StartSeconds(lessonId));
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState<number>(0);
  const [videoMuted, setVideoMuted] = useState<boolean>(isMuted);
  const [videoVolume, setVideoVolume] = useState<number>(1);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);

  const activeLesson = getUnit4Lesson(lessonId);

  const attemptPlay = (forceUnmute: boolean = false) => {
    const video = videoRef.current;
    if (!video) return;

    if (forceUnmute) {
      video.muted = false;
      if (video.volume === 0) {
        video.volume = 1;
      }
      setVideoMuted(false);
      setVideoVolume(video.volume);
      if (isMuted && onToggleMute) {
        onToggleMute();
      }
    } else {
      video.muted = isMuted;
      if (video.volume === 0 && !isMuted) {
        video.volume = 1;
      }
      setVideoMuted(video.muted);
      setVideoVolume(video.volume);
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          setAutoplayBlocked(false);
          setVideoError(null);
          setIsPlaying(true);
        })
        .catch((err: unknown) => {
          const name = err instanceof DOMException ? err.name : '';
          if (name === 'AbortError') {
            return;
          }
          setAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }
  };

  const seekToTime = (seconds: number, autoPlay: boolean, forceUnmute: boolean = false) => {
    const video = videoRef.current;
    setCurrentTime(seconds);
    pendingAutoPlayRef.current = autoPlay;

    if (!video) {
      pendingSeekRef.current = seconds;
      return;
    }

    if (video.readyState >= 1) {
      video.currentTime = seconds;
      pendingSeekRef.current = null;
      if (autoPlay) {
        attemptPlay(forceUnmute);
      }
    } else {
      pendingSeekRef.current = seconds;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (!isMuted && video.volume === 0) {
      video.volume = 1;
    }
    setVideoMuted(video.muted);
    setVideoVolume(video.volume);
  }, [isMuted]);

  useEffect(() => {
    if (lastHandledLessonIdRef.current === lessonId) {
      lastHandledLessonIdRef.current = null;
      return;
    }
    seekToTime(getUnit4StartSeconds(lessonId), true, false);
  }, [lessonId]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    setVideoError(null);
    video.muted = isMuted;
    if (video.volume === 0 && !isMuted) {
      video.volume = 1;
    }
    setVideoMuted(video.muted);
    setVideoVolume(video.volume);

    if (Number.isFinite(video.duration)) {
      setDuration(video.duration);
    }
    if (pendingSeekRef.current !== null) {
      video.currentTime = pendingSeekRef.current;
      setCurrentTime(pendingSeekRef.current);
      pendingSeekRef.current = null;
    }
    if (pendingAutoPlayRef.current) {
      pendingAutoPlayRef.current = false;
      attemptPlay(false);
    }
  };

  const handleRetryVideo = () => {
    sound.playClick();
    setVideoError(null);
    setIsBuffering(true);
    pendingSeekRef.current = getUnit4StartSeconds(lessonId);
    pendingAutoPlayRef.current = true;
    setReloadNonce((n) => n + 1);
  };

  const handleJumpToLesson = (targetId: Unit4LessonId) => {
    sound.playClick();
    if (targetId === lessonId) {
      seekToTime(getUnit4StartSeconds(targetId), true, true);
    } else {
      lastHandledLessonIdRef.current = targetId;
      seekToTime(getUnit4StartSeconds(targetId), true, true);
      onSelectLesson(targetId);
    }
  };

  const handleToggleVideoSound = () => {
    const video = videoRef.current;
    const nextMuted = !(video ? video.muted : videoMuted);
    if (video) {
      video.muted = nextMuted;
      if (!nextMuted && video.volume === 0) {
        video.volume = 1;
      }
      setVideoMuted(video.muted);
      setVideoVolume(video.volume);
    } else {
      setVideoMuted(nextMuted);
    }
    if (onToggleMute && nextMuted !== isMuted) {
      onToggleMute();
    }
  };

  const isSoundSilenced = videoMuted || videoVolume === 0;

  return (
    <div
      dir="auto"
      className="flex-1 min-h-0 flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-y-auto lg:overflow-hidden overflow-x-hidden"
      data-testid="quarter2-video-lab"
    >
      {/* Main Video Workspace */}
      <div className="flex-1 min-w-0 lg:min-h-0 flex flex-col p-4 sm:p-5 gap-4 lg:overflow-hidden">
        {/* Top Lesson Title & Controls Card */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5 min-w-0 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onBackToQuarter();
              }}
              className="self-start sm:self-auto min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm font-bold text-slate-100 flex items-center gap-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Quarter 2 Hub</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-sm font-bold">
                <span className="text-cyan-300">Quarter 2 · Unit 4</span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-emerald-300">
                  Lesson {activeLesson.id} ({activeLesson.durationRange})
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug mt-0.5">
                {activeLesson.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 text-sm font-mono font-bold tabular-nums text-slate-200 bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {formatTime(currentTime)}
                {duration > 0 ? ` / ${formatTime(duration)}` : ''}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleVideoSound}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                isSoundSilenced
                  ? 'bg-rose-950/85 hover:bg-rose-900 border-rose-400/60 text-rose-100'
                  : 'bg-emerald-950/75 hover:bg-emerald-900/80 border-emerald-400/50 text-emerald-100'
              }`}
              title={isSoundSilenced ? 'Unmute video sound' : 'Mute video sound'}
              aria-label={isSoundSilenced ? 'Unmute video sound' : 'Mute video sound'}
            >
              {isSoundSilenced ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Unmute Sound</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sound ON</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                seekToTime(activeLesson.startSeconds, true, true);
              }}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold flex items-center gap-2 shadow cursor-pointer whitespace-nowrap transition-colors"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Start at {activeLesson.timestampLabel}</span>
            </button>
          </div>
        </div>

        {/* Centered Video Stage */}
        <div className="flex-1 min-h-[240px] lg:min-h-0 flex items-center justify-center bg-slate-900/75 border border-slate-700/80 rounded-2xl p-2.5 sm:p-4 overflow-hidden shadow-inner">
          <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
            <video
              key={reloadNonce}
              ref={videoRef}
              src={reloadNonce > 0 ? `${UNIT4_VIDEO_SRC}?v=${reloadNonce}` : UNIT4_VIDEO_SRC}
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={() => {
                setIsBuffering(false);
                setVideoError(null);
              }}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setIsPlaying(true);
                setAutoplayBlocked(false);
                setVideoError(null);
              }}
              onPlay={() => {
                setIsPlaying(true);
                setAutoplayBlocked(false);
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                setIsBuffering(false);
                setIsPlaying(false);
                setVideoError('Could not load the lesson video. Tap Retry to reload it.');
              }}
              onVolumeChange={() => {
                if (!videoRef.current) return;
                setVideoMuted(videoRef.current.muted);
                setVideoVolume(videoRef.current.volume);
              }}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              aria-label={`Quarter 2 Unit 4 ${activeLesson.title} Video Lab`}
              data-active-lesson={activeLesson.id}
              data-start-seconds={activeLesson.startSeconds}
              className="w-full h-full max-h-full aspect-video rounded-xl bg-black border border-slate-700 shadow-2xl object-contain"
            />

            {videoError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/90 rounded-xl p-6 text-center">
                <p className="text-base sm:text-lg font-bold text-rose-200 max-w-md">{videoError}</p>
                <button
                  type="button"
                  onClick={handleRetryVideo}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-base flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Retry Video</span>
                </button>
              </div>
            ) : !isPlaying && autoplayBlocked ? (
              <button
                type="button"
                onClick={() => attemptPlay(true)}
                data-testid="play-with-sound-btn"
                className="absolute inset-0 m-auto w-fit h-fit min-h-[54px] px-6 py-3.5 rounded-2xl bg-slate-950/95 hover:bg-cyan-600 text-white border-2 border-cyan-400 shadow-2xl flex items-center gap-3 text-base font-extrabold transition-colors cursor-pointer"
              >
                <Volume2 className="w-6 h-6 text-cyan-300 shrink-0" />
                <span>Click to Play Lesson {activeLesson.id} with Sound</span>
              </button>
            ) : isBuffering && !isPlaying ? (
              <div className="pointer-events-none absolute top-4 left-4 px-3.5 py-2 rounded-xl bg-slate-950/85 border border-slate-700 text-sm font-bold text-cyan-200">
                Loading lesson video…
              </div>
            ) : null}
          </div>
        </div>

        {/* Lesson Chapter Switcher Bar beneath Video */}
        <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {UNIT4_LESSONS.map((lesson) => {
            const isSelected = lesson.id === activeLesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => handleJumpToLesson(lesson.id)}
                className={`min-h-[64px] px-4 py-3 rounded-2xl border-2 text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className={isSelected ? 'text-cyan-200' : 'text-cyan-400'}>
                      Lesson {lesson.id}
                    </span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="font-mono text-emerald-300 tabular-nums">
                      {lesson.timestampLabel}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-white truncate mt-0.5">
                    {lesson.shortLabel}
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-cyan-300'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Curriculum Notes Sidebar */}
      <aside className="w-full lg:w-96 xl:w-[420px] shrink-0 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-700/80 p-5 flex flex-col gap-4 lg:overflow-y-auto">
        <div className="flex items-center gap-2.5 text-base font-extrabold text-cyan-300">
          <Film className="w-5 h-5 shrink-0" />
          <span>Unit 4 · Chemical Processes &amp; Equations</span>
        </div>

        {/* Lesson Explanation Card */}
        <section className="p-5 rounded-2xl bg-slate-950/90 border border-slate-700/80 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-extrabold text-emerald-300">
              Active Segment: {activeLesson.durationRange}
            </span>
            <Flame className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
          <h3 className="text-lg font-extrabold text-white leading-snug">{activeLesson.title}</h3>
          <p className="text-base text-slate-200 leading-relaxed">{activeLesson.summary}</p>
        </section>

        {/* Key Takeaways Card */}
        <section className="p-5 rounded-2xl bg-slate-950/75 border border-slate-700/80 flex flex-col gap-3.5">
          <div className="flex items-center gap-2 text-base font-extrabold text-white">
            <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Key Takeaways in This Lesson</span>
          </div>
          <ul className="flex flex-col gap-3.5">
            {activeLesson.keyTakeaways.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-[15px] sm:text-base text-slate-100 leading-relaxed bg-slate-900/80 border border-slate-800 rounded-xl p-3.5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
};
