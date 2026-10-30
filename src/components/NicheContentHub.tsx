'use client';

import React, { useState } from 'react';
import { NicheArticle } from '@/types/football';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Share2,
  Sparkles,
} from 'lucide-react';

export function NicheContentHub() {
  const [selectedPillar, setSelectedPillar] = useState<'ALL' | 'timely' | 'evergreen'>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<NicheArticle>(NICHE_ARTICLES[0]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredArticles = NICHE_ARTICLES.filter((art) => {
    if (selectedPillar === 'ALL') return true;
    return art.pillar === selectedPillar;
  });

  function copyShareArticle(art: NicheArticle) {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/#${art.slug}` : '';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${art.title} — ${url}`);
    }
    setCopiedSlug(art.slug);
    setTimeout(() => setCopiedSlug(null), 2200);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: ARTICLE LIST & PILLAR FILTERS (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                Tactical Library
              </span>
              <h2 className="text-base font-black text-white mt-0.5">
                Match Previews &amp; Tactical Analysis
              </h2>
            </div>
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>

          {/* Pillar Filter Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10 text-xs">
            {[
              { id: 'ALL', label: 'All Articles' },
              { id: 'timely', label: 'Match Previews' },
              { id: 'evergreen', label: 'Tactical Guides' },
            ].map((tab) => {
              const active = selectedPillar === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPillar(tab.id as any)}
                  className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Article Cards */}
          <div className="space-y-3">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticle.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-extrabold uppercase ${
                        art.pillar === 'timely'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {art.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.readTime} • {art.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{art.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {art.tacticalBoard.formation}
                    </span>
                    <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                      Read Analysis <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: FULL TACTICAL ARTICLE READER (7 cols) */}
      <div className="lg:col-span-7">
        <article className="rounded-3xl border border-white/10 bg-[#0d1526]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase">
                {selectedArticle.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                {selectedArticle.readTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      selectedArticle.title
                    )}`,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
              >
                Share on X
              </button>
              <button
                type="button"
                onClick={() => copyShareArticle(selectedArticle)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSlug === selectedArticle.slug ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {selectedArticle.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Published {selectedArticle.publishedAt}</span>
              <span>•</span>
              <span>PitchPulse Tactical Analysis Desk</span>
            </div>
          </div>

          {/* Tactical Board Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/25">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Tactical Structure
              </div>
              <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                {selectedArticle.tacticalBoard.formation}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Out-of-Possession Press
              </div>
              <div className="text-xs font-extrabold text-sky-400 mt-0.5">
                {selectedArticle.tacticalBoard.pressingStyle}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Primary Pitch Zone
              </div>
              <div className="text-xs font-extrabold text-amber-300 mt-0.5">
                {selectedArticle.tacticalBoard.keyZone}
              </div>
            </div>
          </div>

          {/* Executive Takeaways */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Key Tactical Takeaways
            </div>
            <ul className="space-y-2">
              {selectedArticle.keyTakeaways.map((tk, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deep-Dive Content Sections */}
          <div className="space-y-5">
            {selectedArticle.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-base font-extrabold text-white">{sec.heading}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{sec.body}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
