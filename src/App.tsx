/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ChapterId,
  QuarterId,
  SimMode,
  TierLevel,
  GameState,
  Badge,
} from './game/types.ts';
import { INITIAL_BADGES, evaluateBadges } from './game/rules.ts';
import { sound } from './game/audio.ts';
import { LabCanvas } from './components/laboratory/LabCanvas.tsx';
import { Quarter2VideoLab } from './components/laboratory/Quarter2VideoLab.tsx';
import { Unit4LessonId } from './game/unit4.ts';
import { TopChapterBar } from './components/hud/TopChapterBar.tsx';
import { LabSidebar } from './components/hud/LabSidebar.tsx';
import { BottomControlDock } from './components/hud/BottomControlDock.tsx';
import { QuarterComingSoon } from './components/hud/QuarterComingSoon.tsx';
import { TitleScreen } from './components/modals/TitleScreen.tsx';
import { QuizModal } from './components/modals/QuizModal.tsx';
import { BadgesModal } from './components/modals/BadgesModal.tsx';
import { LeaderboardModal } from './components/modals/LeaderboardModal.tsx';
import { PauseModal } from './components/modals/PauseModal.tsx';
import { GlossarySidebar } from './components/hud/GlossarySidebar.tsx';
import { AudioNarrationBanner } from './components/laboratory/AudioNarrationBanner.tsx';
import { NowTestYourselfModal } from './components/modals/NowTestYourselfModal.tsx';
import { ToastContainer } from './components/hud/ToastContainer.tsx';
import {
  AppToast,
  createBadgeToast,
  createMilestoneToast,
  enqueueToast,
  getHighestCrossedMilestone,
} from './game/toasts.ts';

export default function App() {
  // 1. Core Game State & autostart query param check
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'playing';
      }
    }
    return 'title';
  });

  // Sync to document.body.dataset.state for game shell architecture and headless testing
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // 2. Active Quarter, Quarter Hub, Chapter & Simulation Mode
  const [selectedQuarterHub, setSelectedQuarterHub] = useState<QuarterId | null>(null);
  const [activeQuarter, setActiveQuarter] = useState<QuarterId>(1);
  const [comingSoonLesson, setComingSoonLesson] = useState<ChapterId | null>(null);
  const [chapterId, setChapterId] = useState<ChapterId>(1);
  const [quarter2LessonId, setQuarter2LessonId] = useState<ChapterId>(1);
  const [simMode, setSimMode] = useState<SimMode>('chamber');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Chapter 1 simulation states
  const [chamberState, setChamberState] = useState<'solid' | 'liquid' | 'gas'>('solid');
  const [displacementSubmerged, setDisplacementSubmerged] = useState(false);
  const [diffusionKey, setDiffusionKey] = useState(0);

  // Chapter 2 simulation states
  const [thermalTemp, setThermalTemp] = useState(25);
  const [galliumTemp, setGalliumTemp] = useState(20);
  const [elevationIdx, setElevationIdx] = useState(0);

  // Chapter 3 simulation states
  const [bohrElementIdx, setBohrElementIdx] = useState(1); // Carbon
  const [moseleyTargetIdx, setMoseleyTargetIdx] = useState(1); // Cobalt
  const [metalsType, setMetalsType] = useState<'copper' | 'silver'>('copper');
  const [metalHammerTrigger, setMetalHammerTrigger] = useState<number | undefined>(undefined);
  const [metalCircuitTrigger, setMetalCircuitTrigger] = useState<number | undefined>(undefined);

  // Chapter 4 simulation states
  const [moleculeType, setMoleculeType] = useState<'h2o' | 'co2' | 'ch4' | 'o3'>('h2o');
  const [allotropesMode, setAllotropesMode] = useState<'diamond' | 'graphite' | 'both'>('both');
  const [allotropesSlideTrigger, setAllotropesSlideTrigger] = useState<number | undefined>(undefined);
  const [saltCoordTrigger, setSaltCoordTrigger] = useState<number | undefined>(undefined);

  // Track interacted simulations for badge unlocking
  const interactedSimsRef = useRef<Set<string>>(new Set());

  // 3. Score, Streak, Stars, & Progress Storage
  const [score, setScore] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('matterquest_score');
    return saved ? parseInt(saved) : 0;
  });

  const [streak, setStreak] = useState<number>(0);

  const [levelProgress, setLevelProgress] = useState<Record<string, { stars: number }>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('matterquest_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    if (typeof window === 'undefined') return INITIAL_BADGES;
    const saved = localStorage.getItem('matterquest_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Alex Vance';
    return localStorage.getItem('matterquest_player_name') || 'Alex Vance';
  });

  const [isMuted, setIsMuted] = useState(false);

  // Modals state
  const [activeQuizTier, setActiveQuizTier] = useState<TierLevel | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryQuarter, setGlossaryQuarter] = useState<QuarterId>(1);
  const [glossaryInitialChapter, setGlossaryInitialChapter] = useState<ChapterId | 'all'>('all');
  const [showNowTestYourself, setShowNowTestYourself] = useState(false);
  const [nowTestQuarter, setNowTestQuarter] = useState<QuarterId>(1);
  const [nowTestInitialFilter, setNowTestInitialFilter] = useState<string>('all');

  const [toasts, setToasts] = useState<AppToast[]>([]);
  const prevScoreRef = useRef<number>(score);
  const shownBadgeIdsRef = useRef<Set<string>>(
    new Set(badges.filter((b) => b.unlocked).map((b) => b.id))
  );
  const toastTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismissToast = (id: string) => {
    const timer = toastTimersRef.current[id];
    if (timer) {
      clearTimeout(timer);
      delete toastTimersRef.current[id];
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const pushToast = (toast: AppToast) => {
    const existingTimer = toastTimersRef.current[toast.id];
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    setToasts((prev) => enqueueToast(prev, toast, 3));
    toastTimersRef.current[toast.id] = setTimeout(() => {
      delete toastTimersRef.current[toast.id];
      setToasts((prev) => prev.filter((item) => item.id !== toast.id));
    }, 4500);
  };

  const notifyUnlockedBadges = (newlyUnlocked: Badge[]) => {
    for (const badge of newlyUnlocked) {
      if (!shownBadgeIdsRef.current.has(badge.id)) {
        shownBadgeIdsRef.current.add(badge.id);
        pushToast(createBadgeToast(badge));
      }
    }
  };

  // Cleanup any active toast timers on unmount
  useEffect(() => {
    const timers = toastTimersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // Watch score increments and show a subtle milestone toast when crossing thresholds
  useEffect(() => {
    const crossed = getHighestCrossedMilestone(prevScoreRef.current, score);
    prevScoreRef.current = score;
    if (crossed !== null) {
      pushToast(createMilestoneToast(crossed));
    }
  }, [score]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('matterquest_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('matterquest_progress', JSON.stringify(levelProgress));
  }, [levelProgress]);

  useEffect(() => {
    localStorage.setItem('matterquest_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('matterquest_player_name', playerName);
  }, [playerName]);

  // Calculate total stars
  const totalStars = Object.values(levelProgress).reduce((acc, curr) => acc + curr.stars, 0);

  // Update interacted simulations & evaluate badges
  const recordSimInteraction = (sim: string) => {
    interactedSimsRef.current.add(sim);
    const { updatedBadges, newlyUnlocked } = evaluateBadges(badges, {
      streak,
      completedLevels: levelProgress,
      interactedSims: Array.from(interactedSimsRef.current),
    });
    if (newlyUnlocked.length > 0) {
      setBadges(updatedBadges);
      sound.playBadgeUnlock();
      notifyUnlockedBadges(newlyUnlocked);
    }
  };

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger game shortcuts if typing inside an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => {
          const next = !prev;
          sound.setMuted(next);
          return next;
        });
      } else if (e.key === 'g' || e.key === 'G') {
        sound.playClick();
        setGlossaryQuarter(selectedQuarterHub ?? activeQuarter);
        setGlossaryInitialChapter('all');
        setShowGlossary((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        sound.playClick();
        setNowTestQuarter(selectedQuarterHub ?? activeQuarter);
        setNowTestInitialFilter('all');
        setShowNowTestYourself((prev) => !prev);
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (activeQuizTier || showBadges || showLeaderboard || showGlossary || showNowTestYourself) {
          setActiveQuizTier(null);
          setShowBadges(false);
          setShowLeaderboard(false);
          setShowGlossary(false);
          setShowNowTestYourself(false);
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, activeQuizTier, showBadges, showLeaderboard, showGlossary, showNowTestYourself]);

  // Chapter selection helper
  const handleSelectChapter = (chId: ChapterId) => {
    setChapterId(chId);
    if (chId === 1) setSimMode('chamber');
    else if (chId === 2) setSimMode('thermal');
    else if (chId === 3) setSimMode('bohr');
    else if (chId === 4) setSimMode('molecules');
    recordSimInteraction(`ch_${chId}`);
  };

  const handleSelectSimMode = (mode: SimMode) => {
    setSimMode(mode);
    recordSimInteraction(mode);
  };

  const handleLaunchLab = (quarterId: QuarterId, startLessonId?: ChapterId) => {
    setActiveQuarter(quarterId);
    if (quarterId === 1) {
      setComingSoonLesson(null);
      if (startLessonId) {
        handleSelectChapter(startLessonId);
      }
    } else if (quarterId === 2) {
      const targetLesson = startLessonId ?? 1;
      setQuarter2LessonId(targetLesson);
      setComingSoonLesson(targetLesson === 4 ? 4 : null);
    } else {
      setComingSoonLesson(startLessonId ?? null);
    }
    setGameState('playing');
  };

  const handleOpenGlossaryScoped = (quarterId: QuarterId, lessonId: ChapterId | 'all' = 'all') => {
    setGlossaryQuarter(quarterId);
    setGlossaryInitialChapter(lessonId);
    setShowGlossary(true);
  };

  const handleOpenNowTestScoped = (quarterId: QuarterId, lessonFilter: string = 'all') => {
    setNowTestQuarter(quarterId);
    setNowTestInitialFilter(lessonFilter);
    setShowNowTestYourself(true);
  };

  // Level Quiz completion handler
  const handleQuizLevelComplete = (starsEarned: number, pointsEarned: number) => {
    if (!activeQuizTier) return;
    const levelKey = `${chapterId}_${activeQuizTier}`;
    const previousStars = levelProgress[levelKey]?.stars ?? 0;

    setLevelProgress((prev) => ({
      ...prev,
      [levelKey]: {
        stars: Math.max(previousStars, starsEarned),
      },
    }));

    setScore((prev) => prev + pointsEarned);

    // Evaluate badges after level completion
    const { updatedBadges, newlyUnlocked } = evaluateBadges(badges, {
      streak,
      completedLevels: {
        ...levelProgress,
        [levelKey]: { stars: Math.max(previousStars, starsEarned) },
      },
      interactedSims: Array.from(interactedSimsRef.current),
    });

    if (newlyUnlocked.length > 0) {
      setBadges(updatedBadges);
      sound.playBadgeUnlock();
      notifyUnlockedBadges(newlyUnlocked);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1. Top Quarter & Lesson Navigation & Game Stats Bar (hidden on Title Screen to avoid HUD bleed-through) */}
      {gameState !== 'title' && (
        <TopChapterBar
          activeQuarter={activeQuarter}
          onSelectQuarter={(q) => {
            setActiveQuarter(q);
            if (q === 2) {
              setComingSoonLesson(quarter2LessonId === 4 ? 4 : null);
            } else {
              setComingSoonLesson(null);
            }
          }}
          chapterId={activeQuarter === 2 ? quarter2LessonId : chapterId}
          onSelectChapter={(id) => {
            if (activeQuarter === 2) {
              setQuarter2LessonId(id);
              setComingSoonLesson(id === 4 ? 4 : null);
            } else {
              handleSelectChapter(id);
            }
          }}
          score={score}
          streak={streak}
          stars={totalStars}
          isMuted={isMuted}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            sound.setMuted(next);
          }}
          onOpenBadges={() => setShowBadges(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenGlossary={() => handleOpenGlossaryScoped(activeQuarter, 'all')}
          onOpenNowTest={() => handleOpenNowTestScoped(activeQuarter, 'all')}
          onPause={() => setGameState('paused')}
          onHome={() => {
            setSelectedQuarterHub(null);
            setGameState('title');
          }}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          levelProgress={levelProgress}
        />
      )}

      {gameState === 'title' ? (
        <div className="flex-1 relative min-h-0 overflow-hidden bg-slate-950">
          <LabCanvas
            mode={simMode}
            chamberState={chamberState}
            displacementSubmerged={displacementSubmerged}
            thermalTemp={thermalTemp}
            galliumTemp={galliumTemp}
            elevationIdx={elevationIdx}
            bohrElementIdx={bohrElementIdx}
            moseleyTargetIdx={moseleyTargetIdx}
            metalsType={metalsType}
            metalHammerTrigger={metalHammerTrigger}
            metalCircuitTrigger={metalCircuitTrigger}
            moleculeType={moleculeType}
            allotropesMode={allotropesMode}
            allotropesSlideTrigger={allotropesSlideTrigger}
            saltCoordTrigger={saltCoordTrigger}
          />
        </div>
      ) : activeQuarter === 1 ? (
        <>
          {/* 2. English Audio Narration Bar (Directly beneath Chapters Bar) */}
          <AudioNarrationBanner mode={simMode} />

          {/* 3. Main Workspace: Docked Left Sidebar + Center 3D Model Viewport + Bottom Controls */}
          <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden relative">
            {/* Left Sidebar for Lab Selection, Quizzes & Science Insights */}
            <LabSidebar
              chapterId={chapterId}
              simMode={simMode}
              onSelectSimMode={handleSelectSimMode}
              onStartQuiz={(tier) => setActiveQuizTier(tier)}
              levelProgress={levelProgress}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onOpenNowTest={() => handleOpenNowTestScoped(1, 'all')}
            />

            {/* Center Stage: 3D Model in dead center + Controls docked underneath */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full relative bg-slate-950">
              {/* Dedicated 3D Canvas Viewport: Completely clean, centered, zero overlapping text */}
              <main
                className="flex-1 min-h-0 w-full h-full relative overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing"
                aria-label="3D Science Simulation Viewport"
              >
                <LabCanvas
                  mode={simMode}
                  chamberState={chamberState}
                  displacementSubmerged={displacementSubmerged}
                  thermalTemp={thermalTemp}
                  galliumTemp={galliumTemp}
                  elevationIdx={elevationIdx}
                  bohrElementIdx={bohrElementIdx}
                  moseleyTargetIdx={moseleyTargetIdx}
                  metalsType={metalsType}
                  metalHammerTrigger={metalHammerTrigger}
                  metalCircuitTrigger={metalCircuitTrigger}
                  moleculeType={moleculeType}
                  allotropesMode={allotropesMode}
                  allotropesSlideTrigger={allotropesSlideTrigger}
                  saltCoordTrigger={saltCoordTrigger}
                />
              </main>

              {/* Interactive Simulation Parameters - Docked neatly below the 3D model */}
              <BottomControlDock
                chapterId={chapterId}
                mode={simMode}
                onSelectMode={handleSelectSimMode}
                chamberState={chamberState}
                setChamberState={(s) => {
                  setChamberState(s);
                  recordSimInteraction('chamber');
                }}
                displacementSubmerged={displacementSubmerged}
                setDisplacementSubmerged={(b) => {
                  setDisplacementSubmerged(b);
                  recordSimInteraction('displacement');
                }}
                onResetDiffusion={() => {
                  setDiffusionKey((prev) => prev + 1);
                  recordSimInteraction('diffusion');
                }}
                thermalTemp={thermalTemp}
                setThermalTemp={(t) => {
                  setThermalTemp(t);
                  recordSimInteraction('thermal');
                }}
                galliumTemp={galliumTemp}
                setGalliumTemp={(t) => {
                  setGalliumTemp(t);
                  recordSimInteraction('gallium');
                }}
                elevationIdx={elevationIdx}
                setElevationIdx={(idx) => {
                  setElevationIdx(idx);
                  recordSimInteraction('elevation');
                }}
                bohrElementIdx={bohrElementIdx}
                setBohrElementIdx={(idx) => {
                  setBohrElementIdx(idx);
                  recordSimInteraction('bohr');
                }}
                moseleyTargetIdx={moseleyTargetIdx}
                setMoseleyTargetIdx={(idx) => {
                  setMoseleyTargetIdx(idx);
                  recordSimInteraction('moseley');
                }}
                metalsType={metalsType}
                setMetalsType={(t) => {
                  setMetalsType(t);
                  recordSimInteraction('metals');
                }}
                onStrikeHammer={() => {
                  setMetalHammerTrigger(Date.now());
                  recordSimInteraction('metals');
                }}
                onToggleCircuit={() => {
                  setMetalCircuitTrigger(Date.now());
                  recordSimInteraction('metals');
                }}
                moleculeType={moleculeType}
                setMoleculeType={(m) => {
                  setMoleculeType(m);
                  recordSimInteraction('molecules');
                }}
                allotropesMode={allotropesMode}
                setAllotropesMode={(m) => {
                  setAllotropesMode(m);
                  recordSimInteraction('allotropes');
                }}
                onSlideGraphite={() => {
                  setAllotropesSlideTrigger(Date.now());
                  recordSimInteraction('allotropes');
                }}
                onToggleSaltCoord={() => {
                  setSaltCoordTrigger(Date.now());
                  recordSimInteraction('salt');
                }}
              />
            </div>
          </div>
        </>
      ) : activeQuarter === 2 && quarter2LessonId <= 3 ? (
        <Quarter2VideoLab
          lessonId={quarter2LessonId as Unit4LessonId}
          onSelectLesson={(id) => {
            setQuarter2LessonId(id);
            setComingSoonLesson(id === 4 ? 4 : null);
          }}
          onBackToQuarter={() => {
            setSelectedQuarterHub(2);
            setGameState('title');
          }}
          isMuted={isMuted}
          onToggleMute={() => {
            setIsMuted((prev) => {
              const next = !prev;
              sound.setMuted(next);
              return next;
            });
          }}
        />
      ) : (
        <QuarterComingSoon
          quarterId={activeQuarter}
          lessonId={comingSoonLesson}
          onReturnToQuarter1={() => {
            setComingSoonLesson(null);
            setActiveQuarter(1);
          }}
          onBackToQuarter={() => {
            setSelectedQuarterHub(activeQuarter);
            setGameState('title');
          }}
        />
      )}

      {/* Title Screen / Main Quarters & Quarter Hub (when gameState === 'title') */}
      {gameState === 'title' && (
        <TitleScreen
          selectedQuarterHub={selectedQuarterHub}
          onSelectQuarterHub={setSelectedQuarterHub}
          onLaunchLab={handleLaunchLab}
          onOpenGlossary={handleOpenGlossaryScoped}
          onOpenNowTest={handleOpenNowTestScoped}
          onOpenBadges={() => setShowBadges(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {/* Interactive Quiz Modal */}
      {activeQuizTier && (
        <QuizModal
          chapterId={chapterId}
          tier={activeQuizTier}
          onClose={() => setActiveQuizTier(null)}
          onLevelComplete={handleQuizLevelComplete}
          currentStreak={streak}
          onStreakUpdate={(newStreak) => {
            setStreak(newStreak);
            const { updatedBadges, newlyUnlocked } = evaluateBadges(badges, {
              streak: newStreak,
              completedLevels: levelProgress,
              interactedSims: Array.from(interactedSimsRef.current),
            });
            if (newlyUnlocked.length > 0) {
              setBadges(updatedBadges);
              sound.playBadgeUnlock();
              notifyUnlockedBadges(newlyUnlocked);
            }
          }}
        />
      )}

      {/* Badges Modal */}
      {showBadges && <BadgesModal badges={badges} onClose={() => setShowBadges(false)} />}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          playerScore={score}
          playerStars={totalStars}
          playerStreak={streak}
          playerName={playerName}
          onUpdatePlayerName={setPlayerName}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={() => setGameState('playing')}
          onRestart={() => {
            handleSelectChapter(chapterId);
            setGameState('playing');
          }}
          onTitle={() => setGameState('title')}
        />
      )}

      {/* Science Glossary Sidebar */}
      <GlossarySidebar
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
        activeChapterId={chapterId}
        quarterId={glossaryQuarter}
        initialChapterFilter={glossaryInitialChapter}
      />

      {/* Now Test Yourself Modal (All 67 Questions, Gated Progression, No Timer, Lesson Badges) */}
      <NowTestYourselfModal
        isOpen={showNowTestYourself}
        onClose={() => setShowNowTestYourself(false)}
        onAddScore={(pts) => setScore((s) => s + pts)}
        quarterId={nowTestQuarter}
        initialLessonFilter={nowTestInitialFilter}
      />

      {/* Subtle Achievement & Milestone Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        onBadgeClick={() => setShowBadges(true)}
        topOffsetClass={
          gameState === 'title'
            ? 'top-16'
            : activeQuarter === 1
              ? 'top-36'
              : 'top-24'
        }
      />
    </div>
  );
}
