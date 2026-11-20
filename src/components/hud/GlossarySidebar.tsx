/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  filterGlossary,
  getGlossaryTermsForQuarter,
  GlossaryCategory,
} from '../../game/glossary.ts';
import { ChapterId, QuarterId } from '../../game/types.ts';
import { sound } from '../../game/audio.ts';
import {
  BookOpen,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Lock,
} from 'lucide-react';

interface GlossarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapterId?: ChapterId;
  quarterId?: QuarterId;
  initialChapterFilter?: ChapterId | 'all';
}

export const GlossarySidebar: React.FC<GlossarySidebarProps> = ({
  isOpen,
  onClose,
  quarterId = 1,
  initialChapterFilter = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState<ChapterId | 'all'>(initialChapterFilter);
  const [categoryFilter] = useState<GlossaryCategory | 'all'>('all');
  const [selectedTermId, setSelectedTermId] = useState<string>('density');

  const quarterTerms = useMemo(() => getGlossaryTermsForQuarter(quarterId), [quarterId]);

  useEffect(() => {
    if (isOpen) {
      setChapterFilter(initialChapterFilter);
      setSearchQuery('');
    }
  }, [isOpen, initialChapterFilter, quarterId]);

  const filteredTerms = useMemo(() => {
    return filterGlossary(quarterTerms, searchQuery, chapterFilter, categoryFilter);
  }, [quarterTerms, searchQuery, chapterFilter, categoryFilter]);

  const selectedTerm = useMemo(() => {
    if (quarterTerms.length === 0) return null;
    return (
      filteredTerms.find((t) => t.id === selectedTermId) ||
      filteredTerms[0] ||
      quarterTerms[0]
    );
  }, [quarterTerms, selectedTermId, filteredTerms]);

  const isComingSoon =
    quarterTerms.length === 0 || (quarterId === 2 && chapterFilter === 4);

  if (!isOpen) return null;

  return (
    <div
      dir="auto"
      className="fixed inset-0 z-50 pointer-events-auto bg-slate-950/95 backdrop-blur-md flex flex-col text-slate-100 select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Science Glossary Full Screen"
      data-testid="glossary-fullscreen"
    >
      {/* Top Full-Screen Header */}
      <div className="w-full border-b border-slate-700/80 bg-slate-900 px-4 sm:px-8 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 bg-cyan-950 border border-cyan-500/50 rounded-xl text-cyan-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">Science Glossary</h2>
                <span className="text-sm font-bold text-cyan-300">· Quarter {quarterId}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 mt-0.5 truncate">
                {quarterId === 2
                  ? 'Unit 4: Chemical Processes & Equations · Lessons 1–3'
                  : 'Into Science Grade 6 · Organized by Lessons'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="min-h-[44px] px-4 py-2 text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors flex items-center gap-2 text-base font-bold cursor-pointer shrink-0"
            aria-label="Close Glossary"
          >
            <X className="w-5 h-5" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Search & Lesson Filter Bar */}
      <div className="w-full border-b border-slate-800 bg-slate-900/70 px-4 sm:px-8 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-3.5">
          {quarterTerms.length > 0 && (
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={
                  quarterId === 2
                    ? 'Search Unit 4 terms (e.g. reactants, exothermic, subscript)...'
                    : 'Search terms (e.g. density, allotrope)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[46px] bg-slate-950 border border-slate-600 rounded-xl pl-12 pr-10 py-2.5 text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Lesson Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setChapterFilter('all');
              }}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
                chapterFilter === 'all'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              All Lessons
            </button>
            {([1, 2, 3, 4] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  sound.playClick();
                  setChapterFilter(ch);
                }}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  chapterFilter === ch
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Lesson {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isComingSoon ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-5">
            <Clock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-2 text-amber-300 text-sm font-bold mb-2">
            <Lock className="w-4 h-4" />
            <span>
              Quarter {quarterId}
              {chapterFilter !== 'all' ? ` · Lesson ${chapterFilter}` : ''} · Coming Soon
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Quarter {quarterId}
            {chapterFilter !== 'all' ? ` Lesson ${chapterFilter}` : ''} Glossary Is Coming Soon
          </h3>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Vocabulary terms and real-world lab examples for Quarter {quarterId}
            {chapterFilter !== 'all' ? ` (Lesson ${chapterFilter})` : ' (Lessons 1–4)'} are currently being prepared.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex flex-col lg:flex-row gap-5 overflow-hidden">
          {/* Left Column: Vocabulary Directory */}
          <div className="w-full lg:w-[410px] xl:w-[440px] shrink-0 flex flex-col min-h-0 max-h-60 lg:max-h-none bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 text-sm sm:text-base font-extrabold text-white flex items-center justify-between gap-2">
              <span>Vocabulary Directory ({filteredTerms.length})</span>
              {searchQuery && (
                <span className="text-cyan-300 font-mono text-xs truncate">
                  &quot;{searchQuery}&quot;
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
              {filteredTerms.length === 0 ? (
                <div className="text-center py-10 px-4 text-slate-300 text-base leading-relaxed">
                  {quarterId === 2
                    ? "No matching Unit 4 terms found. Try 'reactants', 'exothermic', or 'subscript'."
                    : "No matching scientific terms found. Try 'density', 'allotrope', or 'force'."}
                </div>
              ) : (
                filteredTerms.map((item) => {
                  const isSelected = selectedTerm?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedTermId(item.id);
                      }}
                      className={`w-full min-h-[64px] text-left p-4 rounded-xl border-2 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow'
                          : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-100 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-base font-extrabold leading-snug">{item.term}</span>
                        <span className="text-sm text-slate-200 truncate mt-1">{item.definition}</span>
                      </div>
                      <span className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-600 text-cyan-300 font-bold">
                        L{item.chapterId}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Large Selected Term Reading Panel */}
          {selectedTerm && (
            <div className="flex-1 min-w-0 min-h-0 overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold mb-2">
                    <span className="text-cyan-300">Lesson {selectedTerm.chapterId}</span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="font-mono text-amber-300">{selectedTerm.textbookRef}</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {selectedTerm.term}
                  </h3>
                </div>

                {/* Scientific Definition Card */}
                <section className="bg-slate-950/85 border border-cyan-500/35 rounded-2xl p-5 sm:p-6">
                  <span className="text-sm font-extrabold text-cyan-300 block mb-2">
                    Scientific Definition
                  </span>
                  <p className="text-lg sm:text-xl leading-relaxed text-white font-medium">
                    {selectedTerm.definition}
                  </p>
                </section>

                {/* Real-World Lab Example Card */}
                <section className="bg-slate-950/75 border border-amber-500/35 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-amber-300 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Lab Connection &amp; Real-World Example</span>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-100">
                    {selectedTerm.example}
                  </p>
                </section>
              </div>

              {/* Related Terms Cross-Links */}
              {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                <div className="flex items-center gap-2.5 flex-wrap pt-5 border-t border-slate-800">
                  <span className="text-sm text-slate-300 font-extrabold mr-1">
                    Related Terms:
                  </span>
                  {selectedTerm.relatedTerms.map((rtId) => {
                    const target = quarterTerms.find((t) => t.id === rtId);
                    const label = target ? target.term : rtId.replace(/^q2_/, '').replace(/_/g, ' ');
                    return (
                      <button
                        key={rtId}
                        onClick={() => {
                          sound.playClick();
                          setSelectedTermId(rtId);
                          if (target && chapterFilter !== 'all' && target.chapterId !== chapterFilter) {
                            setChapterFilter('all');
                          }
                        }}
                        className="min-h-[42px] text-sm sm:text-base font-bold bg-slate-800 hover:bg-slate-700 text-cyan-200 hover:text-white border border-slate-600 px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>{label}</span>
                        <ArrowRight className="w-4 h-4 opacity-80" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
