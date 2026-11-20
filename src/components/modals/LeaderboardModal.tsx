/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LeaderboardEntry } from '../../game/types.ts';
import { sound } from '../../game/audio.ts';
import { Trophy, Medal, Star, Flame, X, Edit2, Check } from 'lucide-react';

interface LeaderboardModalProps {
  playerScore: number;
  playerStars: number;
  playerStreak: number;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  playerScore,
  playerStars,
  playerStreak,
  playerName,
  onUpdatePlayerName,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

  const classmates: LeaderboardEntry[] = [
    {
      id: 'kenda',
      name: 'Kenda Omar',
      avatar: '🔬',
      title: 'Diamond Synthesizer',
      score: 1850,
      stars: 11,
      streak: 7,
    },
    {
      id: 'sara',
      name: 'Sara K.',
      avatar: '⚗️',
      title: 'Density Master',
      score: 1620,
      stars: 9,
      streak: 6,
    },
    {
      id: 'adam',
      name: 'Adam T.',
      avatar: '⚛️',
      title: 'Thermal Explorer',
      score: 1340,
      stars: 7,
      streak: 4,
    },
    {
      id: 'leo',
      name: 'Leo Nova',
      avatar: '🚀',
      title: 'Everest Physicist',
      score: 1120,
      stars: 6,
      streak: 3,
    },
  ];

  const playerEntry: LeaderboardEntry = {
    id: 'player',
    name: playerName,
    avatar: '👨‍🔬',
    title: 'Laboratory Fellow',
    score: playerScore,
    stars: playerStars,
    streak: playerStreak,
    isPlayer: true,
  };

  // Combine and sort descending by score
  const allEntries = [...classmates, playerEntry].sort((a, b) => b.score - a.score);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdatePlayerName(nameInput.trim());
      setIsEditing(false);
      sound.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div
        dir="auto"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl p-5 sm:p-7 text-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 shrink-0 bg-cyan-950/70 border border-cyan-500/50 rounded-2xl text-cyan-300 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Grade 6 Science Academy
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-0.5">
                Unit 3: The Structure of Matter Leaderboard
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
            aria-label="Close Leaderboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Name Tag Bar */}
        <div className="bg-slate-800/85 border border-slate-700 rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-2xl shrink-0" aria-hidden="true">👨‍🔬</span>
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                  }}
                  aria-label="Student callsign"
                  className="w-full min-h-[42px] bg-slate-900 border border-cyan-500/70 rounded-xl px-3 py-1.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  maxLength={18}
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  aria-label="Save Callsign"
                  className="min-h-[42px] min-w-[42px] flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white transition-colors cursor-pointer shrink-0"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="min-w-0">
                <span className="text-base font-extrabold text-white block truncate">{playerName} (You)</span>
                <span className="text-xs sm:text-sm font-semibold text-cyan-300 block">Class Scientist</span>
              </div>
            )}
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-600 text-sm font-bold text-slate-100 flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <Edit2 className="w-4 h-4 text-cyan-300" />
              <span>Edit Callsign</span>
            </button>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {allEntries.map((entry, rank) => (
            <div
              key={entry.id}
              className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${
                entry.isPlayer
                  ? 'bg-cyan-950/45 border-cyan-400/80 shadow-md'
                  : 'bg-slate-800/60 border-slate-700/80'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-extrabold text-sm font-mono ${
                    rank === 0
                      ? 'bg-amber-400 text-slate-950'
                      : rank === 1
                      ? 'bg-slate-200 text-slate-950'
                      : rank === 2
                      ? 'bg-amber-700 text-amber-50'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  #{rank + 1}
                </div>
                <span className="text-2xl shrink-0" aria-hidden="true">{entry.avatar}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-base font-extrabold ${entry.isPlayer ? 'text-cyan-200' : 'text-white'}`}>
                      {entry.name}
                    </span>
                    {entry.isPlayer && (
                      <span className="text-xs bg-cyan-600 text-white font-extrabold px-2 py-0.5 rounded-md">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-slate-300 block">{entry.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm font-mono ml-auto shrink-0">
                <div className="flex items-center gap-1.5 text-amber-300" title="Stars earned">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold tabular-nums">{entry.stars}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-300" title="Best streak">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold tabular-nums">{entry.streak}x</span>
                </div>
                <div className="text-right min-w-[78px]">
                  <span className="text-base font-black text-white tabular-nums">{entry.score}</span>
                  <span className="text-xs text-slate-400 block font-sans font-bold">PTS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
