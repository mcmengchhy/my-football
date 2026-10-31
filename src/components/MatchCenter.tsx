'use client';

import React, { useState } from 'react';
import { LineupPlayer, Match } from '@/types/football';
import { TeamCrest } from './TeamCrest';
import { Pitch2DVisualizer } from './Pitch2DVisualizer';
import {
  AlertCircle,
  ArrowLeftRight,
  Award,
  BarChart3,
  BookOpen,
  Check,
  Clock,
  Crosshair,
  MapPin,
  Radio,
  Share2,
  Shield,
  Sparkles,
  Swords,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

interface MatchCenterProps {
  match: Match;
  onCloseMobile?: () => void;
}

type TabKey = 'preview' | 'pitch' | 'timeline' | 'lineups' | 'stats';

export function MatchCenter({ match, onCloseMobile }: MatchCenterProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('preview');
  const [copiedShare, setCopiedShare] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    player: LineupPlayer;
    teamName: string;
    color: string;
  } | null>(null);

  const tabs: { id: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'preview', label: 'Preview & Tactics', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'pitch', label: '2D Pitch', icon: <Radio className="w-3.5 h-3.5" /> },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <Clock className="w-3.5 h-3.5" />,
      badge: match.events.length || undefined,
    },
    { id: 'lineups', label: 'Lineups', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'stats', label: 'Stats & xG', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  const ratingColor = (rating: number) => {
    if (rating >= 8.0) return 'bg-emerald-500 text-slate-950 font-extrabold';
    if (rating >= 7.2) return 'bg-sky-500 text-slate-950 font-bold';
    return 'bg-amber-500/90 text-slate-950 font-bold';
  };

  const shareText = `${match.homeTeam.name} vs ${match.awayTeam.name} (${match.league.name}) — Tactical Preview, xG Insights & Key Battles on PitchPulse`;

  function handleShare(platform: 'x' | 'reddit' | 'copy') {
    const url =
      typeof window !== 'undefined'
        ? window.location.href
        : 'https://my-football-yusto.vercel.app';
    if (platform === 'x') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else if (platform === 'reddit') {
      window.open(
        `https://www.reddit.com/submit?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(`${shareText} - ${url}`);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  }

  const preview = match.tacticalPreview;

  return (
    <div className="flex flex-col h-full rounded-3xl border border-white/10 bg-[#0d1526]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* HERO SCOREBOARD HEADER */}
      <div className="relative overflow-hidden border-b border-white/10 p-5 bg-gradient-to-br from-slate-900/95 via-[#0f1a2e] to-slate-950">
        {/* Ambient team color glows */}
        <div
          className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: match.homeTeam.primaryColor }}
        />
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: match.awayTeam.primaryColor }}
        />

        {/* League, Social Share & Close Row */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white shrink-0"
              style={{ backgroundColor: match.league.primaryColor }}
            >
              {match.league.badgeText}
            </span>
            <span className="text-xs font-semibold text-slate-300 truncate">
              {match.league.name}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">• {match.league.round}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleShare('x')}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Share Tactical Thread on X (Twitter)"
            >
              Post on X
            </button>
            <button
              type="button"
              onClick={() => handleShare('reddit')}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer transition-colors hidden sm:inline-flex"
              title="Share to r/soccer"
            >
              r/soccer
            </button>
            <button
              type="button"
              onClick={() => handleShare('copy')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-emerald-400 cursor-pointer transition-colors"
              title="Copy Match Analysis Link"
            >
              {copiedShare ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>

            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                aria-label="Close Match Center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Main Teams & Score Row */}
        <div className="relative z-10 grid grid-cols-3 items-center gap-2 my-2">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center">
            <TeamCrest team={match.homeTeam} size="xl" className="mb-2" />
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {match.homeTeam.name}
            </h3>
            {match.homeTeam.form && (
              <div className="flex items-center gap-1 mt-1.5">
                {match.homeTeam.form.map((f, i) => (
                  <span
                    key={i}
                    className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                      f === 'W'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : f === 'D'
                        ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Center Score & Status */}
          <div className="flex flex-col items-center justify-center">
            {match.status === 'LIVE' ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE • {match.minute}&apos;</span>
              </div>
            ) : match.status === 'HT' ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold mb-2">
                <span>HALF TIME</span>
              </div>
            ) : match.status === 'FT' ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs font-bold mb-2">
                <span>FULL TIME</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold mb-2">
                <span>
                  {match.matchDateLabel ? `${match.matchDateLabel} • ` : ''}
                  {match.kickoffTime}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-3xl sm:text-4xl font-black tracking-tight text-white tabular-nums">
              <span>{match.status === 'UPCOMING' ? '-' : match.homeScore}</span>
              <span className="text-slate-600 text-2xl">:</span>
              <span>{match.status === 'UPCOMING' ? '-' : match.awayScore}</span>
            </div>

            {match.htHomeScore !== undefined && match.htAwayScore !== undefined && (
              <span className="text-[11px] text-slate-400 mt-1">
                HT {match.htHomeScore} - {match.htAwayScore}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center">
            <TeamCrest team={match.awayTeam} size="xl" className="mb-2" />
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {match.awayTeam.name}
            </h3>
            {match.awayTeam.form && (
              <div className="flex items-center gap-1 mt-1.5">
                {match.awayTeam.form.map((f, i) => (
                  <span
                    key={i}
                    className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                      f === 'W'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : f === 'D'
                        ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Venue & Referee */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {match.venue}
            </span>
            {match.referee && (
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                Ref: {match.referee}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="grid grid-cols-5 gap-1 p-1.5 bg-slate-950/80 border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">
        {/* TAB 0: MATCH PREVIEW, TACTICAL ANALYSIS & POST-MATCH REVIEW */}
        {activeTab === 'preview' && preview && (
          <div className="space-y-4">
            {/* Editorial Headline & Tactical Summary */}
            <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-[#0b1220] to-[#0b1220] p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                  {match.status === 'FT'
                    ? 'Post-Match Tactical Review'
                    : match.status === 'LIVE' || match.status === 'HT'
                    ? 'Live Tactical Analysis'
                    : 'Match Preview & Tactical Guide'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {preview.verdict.confidence}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {preview.headline}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{preview.summary}</p>

              {/* Tactical Systems Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10">
                  <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">
                    {match.homeTeam.shortName} System
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {preview.homeTacticalStyle}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10">
                  <div className="text-[10px] font-bold uppercase text-sky-400 mb-1">
                    {match.awayTeam.shortName} System
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {preview.awayTacticalStyle}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Tactical Battles */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4 space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-amber-400" />
                Key Pitch Battles &amp; Matchups
              </h5>
              <div className="space-y-2.5">
                {preview.keyBattles.map((b, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{b.title}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold">
                        {b.zone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="text-emerald-300">{b.homePlayer}</span>
                      <span className="text-slate-500">vs</span>
                      <span className="text-sky-300">{b.awayPlayer}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{b.analysis}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Injury & Team News Summary */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4 space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Injury &amp; Team News Summary
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TeamCrest team={match.homeTeam} size="sm" />
                    <span>{match.homeTeam.shortName} News</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {preview.teamNews.home.map((item, idx) => (
                      <li key={idx} className="leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TeamCrest team={match.awayTeam} size="sm" />
                    <span>{match.awayTeam.shortName} News</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {preview.teamNews.away.map((item, idx) => (
                      <li key={idx} className="leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* H2H & xG Verdict */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-emerald-400" />
                  Head-to-Head &amp; Expected Goals (xG) Verdict
                </h5>
                <span className="text-[11px] text-slate-400">
                  Last {preview.h2h.played} Meetings
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-base font-black text-emerald-400">
                    {preview.h2h.homeWins}
                  </div>
                  <div className="text-[10px] text-slate-400">{match.homeTeam.code} Wins</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-base font-black text-slate-200">{preview.h2h.draws}</div>
                  <div className="text-[10px] text-slate-400">Draws</div>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <div className="text-base font-black text-sky-400">{preview.h2h.awayWins}</div>
                  <div className="text-[10px] text-slate-400">{match.awayTeam.code} Wins</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-base font-black text-amber-300">
                    {preview.h2h.avgGoals}
                  </div>
                  <div className="text-[10px] text-slate-400">Avg Goals</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-bold uppercase text-emerald-400">
                    Analyst Tactical Verdict • H2H Avg xG: {preview.h2h.avgXg}
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {preview.verdict.prediction}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Key Factor: {preview.verdict.tacticalKey}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('pitch')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold shrink-0 cursor-pointer"
                >
                  Open 2D Radar →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: 2D PITCH & MOMENTUM */}
        {activeTab === 'pitch' && (
          <>
            <Pitch2DVisualizer match={match} />

            {/* Latest Key Events Mini Strip */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Key Match Moments
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs text-emerald-400 hover:underline font-medium cursor-pointer"
                >
                  Full Timeline →
                </button>
              </div>
              {match.events.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No match events recorded yet. Check the Preview &amp; Tactics tab for key battles.
                </p>
              ) : (
                <div className="space-y-2">
                  {[...match.events]
                    .reverse()
                    .slice(0, 4)
                    .map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-emerald-400 w-7">
                            {ev.minute}&apos;
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase text-white">
                            {ev.type === 'goal' || ev.type === 'penalty'
                              ? '⚽ GOAL'
                              : ev.type === 'yellow-card'
                              ? '🟨 CARD'
                              : ev.type === 'red-card'
                              ? '🟥 RED'
                              : '🔄 SUB'}
                          </span>
                          <div>
                            <span className="font-semibold text-white">{ev.player}</span>
                            {ev.secondaryPlayer && (
                              <span className="text-slate-400 ml-1.5">
                                ({ev.type === 'sub' ? `Out: ${ev.secondaryPlayer}` : `Ast: ${ev.secondaryPlayer}`})
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {ev.scoreSnapshot ||
                            (ev.team === 'home' ? match.homeTeam.code : match.awayTeam.code)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: FULL CHRONOLOGICAL TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Chronological Match Commentary &amp; Events
            </h4>

            {match.events.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Match events will appear here in real time after kick-off.
              </div>
            ) : (
              <div className="relative before:absolute before:top-2 before:bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-white/10 space-y-4">
                {[...match.events].reverse().map((ev) => {
                  const isHome = ev.team === 'home';
                  const isGoal =
                    ev.type === 'goal' || ev.type === 'penalty' || ev.type === 'own-goal';
                  return (
                    <div
                      key={ev.id}
                      className={`relative flex items-center gap-3 ${
                        isHome ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      {/* Event Card */}
                      <div
                        className={`w-[calc(50%-22px)] p-3 rounded-xl border transition-all ${
                          isGoal
                            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                            : 'bg-white/[0.03] border-white/10'
                        } ${isHome ? 'text-right' : 'text-left'}`}
                      >
                        <div
                          className={`flex items-center gap-1.5 text-xs font-bold text-white ${
                            isHome ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span>{ev.player}</span>
                          {ev.scoreSnapshot && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                              {ev.scoreSnapshot}
                            </span>
                          )}
                        </div>
                        {ev.secondaryPlayer && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {ev.type === 'sub' ? (
                              <span className="inline-flex items-center gap-1">
                                <ArrowLeftRight className="w-3 h-3 text-sky-400" /> Replaced{' '}
                                {ev.secondaryPlayer}
                              </span>
                            ) : (
                              <span>Assist: {ev.secondaryPlayer}</span>
                            )}
                          </div>
                        )}
                        {ev.detail && (
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {ev.detail}
                          </p>
                        )}
                      </div>

                      {/* Center Minute Bubble */}
                      <div
                        className={`z-10 w-10 h-10 rounded-full flex flex-col items-center justify-center text-[11px] font-extrabold border shrink-0 ${
                          isGoal
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/30'
                            : ev.type === 'yellow-card'
                            ? 'bg-amber-400 text-slate-950 border-amber-200'
                            : ev.type === 'red-card'
                            ? 'bg-rose-500 text-white border-rose-300'
                            : 'bg-slate-900 text-slate-200 border-white/20'
                        }`}
                      >
                        <span>{ev.minute}&apos;</span>
                      </div>

                      <div className="w-[calc(50%-22px)]" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INTERACTIVE TACTICAL LINEUPS */}
        {activeTab === 'lineups' && (
          <div className="space-y-4">
            {!match.lineups ? (
              <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-8 text-center text-slate-400 text-sm">
                Confirmed tactical lineups will be published 60 minutes prior to kick-off.
              </div>
            ) : (
              <>
                {/* Formations Header */}
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#0b1220]/90 border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <TeamCrest team={match.homeTeam} size="sm" />
                    <div>
                      <span className="font-bold text-white">{match.homeTeam.shortName}</span>
                      <span className="ml-2 px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-mono font-bold">
                        {match.lineups.home.formation}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Click any player for rating &amp; telemetry
                  </span>
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="mr-2 px-2 py-0.5 rounded bg-white/10 text-sky-300 font-mono font-bold">
                        {match.lineups.away.formation}
                      </span>
                      <span className="font-bold text-white">{match.awayTeam.shortName}</span>
                    </div>
                    <TeamCrest team={match.awayTeam} size="sm" />
                  </div>
                </div>

                {/* Selected Player Inspector Banner */}
                {selectedPlayer && (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900 border border-emerald-500/30">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white border-2 border-white/40"
                        style={{ backgroundColor: selectedPlayer.color }}
                      >
                        #{selectedPlayer.player.number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {selectedPlayer.player.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-semibold">
                            {selectedPlayer.player.position} • {selectedPlayer.teamName}
                          </span>
                          {selectedPlayer.player.isCaptain && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                              Captain
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-300">
                          <span>
                            Match Rating:{' '}
                            <strong className="text-emerald-400">
                              {selectedPlayer.player.rating.toFixed(1)}
                            </strong>
                          </span>
                          {selectedPlayer.player.goals && (
                            <span>⚽ Goals: {selectedPlayer.player.goals}</span>
                          )}
                          {selectedPlayer.player.assists && (
                            <span>🎯 Assists: {selectedPlayer.player.assists}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlayer(null)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                )}

                {/* 2D Formation Pitch */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#0d281d] shadow-xl">
                  <svg viewBox="0 0 1000 625" className="w-full h-full">
                    <rect x="0" y="0" width="1000" height="625" fill="#0d291e" />
                    <g stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" fill="none">
                      <rect x="30" y="25" width="940" height="575" rx="4" />
                      <line x1="500" y1="25" x2="500" y2="600" />
                      <circle cx="500" cy="312.5" r="78" />
                      <rect x="30" y="135" width="150" height="355" />
                      <rect x="820" y="135" width="150" height="355" />
                    </g>
                  </svg>

                  {/* Render Home XI HTML Nodes */}
                  {match.lineups.home.startingXI.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setSelectedPlayer({
                          player: p,
                          teamName: match.homeTeam.name,
                          color: match.homeTeam.primaryColor,
                        })
                      }
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div className="relative">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: match.homeTeam.primaryColor }}
                        >
                          {p.number}
                        </div>
                        <span
                          className={`absolute -top-1.5 -right-2.5 px-1 rounded text-[9px] leading-tight shadow ${ratingColor(
                            p.rating
                          )}`}
                        >
                          {p.rating.toFixed(1)}
                        </span>
                        {p.goals && (
                          <span className="absolute -bottom-1 -left-1.5 text-[10px]">⚽</span>
                        )}
                        {p.yellowCard && (
                          <span className="absolute -top-1 -left-1.5 w-2 h-3 bg-amber-400 rounded-[1px] border border-slate-900" />
                        )}
                      </div>
                      <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/85 text-[9px] sm:text-[10px] font-semibold text-white whitespace-nowrap border border-white/10">
                        {p.name}
                      </span>
                    </button>
                  ))}

                  {/* Render Away XI HTML Nodes */}
                  {match.lineups.away.startingXI.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setSelectedPlayer({
                          player: p,
                          teamName: match.awayTeam.name,
                          color: match.awayTeam.primaryColor,
                        })
                      }
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div className="relative">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white border-2 border-slate-200 shadow-md group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: match.awayTeam.primaryColor }}
                        >
                          {p.number}
                        </div>
                        <span
                          className={`absolute -top-1.5 -right-2.5 px-1 rounded text-[9px] leading-tight shadow ${ratingColor(
                            p.rating
                          )}`}
                        >
                          {p.rating.toFixed(1)}
                        </span>
                        {p.goals && (
                          <span className="absolute -bottom-1 -left-1.5 text-[10px]">⚽</span>
                        )}
                        {p.yellowCard && (
                          <span className="absolute -top-1 -left-1.5 w-2 h-3 bg-amber-400 rounded-[1px] border border-slate-900" />
                        )}
                      </div>
                      <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/85 text-[9px] sm:text-[10px] font-semibold text-white whitespace-nowrap border border-white/10">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Coaches & Substitutes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Home Bench */}
                  <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-3.5">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Coach: {match.lineups.home.coach}
                      </span>
                      <span className="text-slate-400">{match.homeTeam.code}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Substitutes Bench
                    </p>
                    <div className="space-y-1.5">
                      {match.lineups.home.substitutes.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/[0.02]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono w-5">#{s.number}</span>
                            <span className="text-slate-200 font-medium">{s.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{s.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Away Bench */}
                  <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-3.5">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                        Coach: {match.lineups.away.coach}
                      </span>
                      <span className="text-slate-400">{match.awayTeam.code}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Substitutes Bench
                    </p>
                    <div className="space-y-1.5">
                      {match.lineups.away.substitutes.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/[0.02]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono w-5">#{s.number}</span>
                            <span className="text-slate-200 font-medium">{s.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{s.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: DETAILED HEAD-TO-HEAD STATS */}
        {activeTab === 'stats' && (
          <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TeamCrest team={match.homeTeam} size="sm" />
                <span className="text-xs font-bold text-white">{match.homeTeam.shortName}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Team Telemetry &amp; xG
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{match.awayTeam.shortName}</span>
                <TeamCrest team={match.awayTeam} size="sm" />
              </div>
            </div>

            <div className="space-y-4">
              {match.stats.map((st) => {
                const total = st.home + st.away || 1;
                const homePct = Math.round((st.home / total) * 100);
                const awayPct = 100 - homePct;
                const homeLeads = st.home > st.away;
                const awayLeads = st.away > st.home;

                return (
                  <div key={st.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-mono tabular-nums ${
                          homeLeads
                            ? 'font-extrabold text-emerald-400'
                            : 'font-semibold text-slate-300'
                        }`}
                      >
                        {st.isDecimal ? st.home.toFixed(2) : st.home}
                        {st.unit || ''}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px]">{st.label}</span>
                      <span
                        className={`font-mono tabular-nums ${
                          awayLeads ? 'font-extrabold text-sky-400' : 'font-semibold text-slate-300'
                        }`}
                      >
                        {st.isDecimal ? st.away.toFixed(2) : st.away}
                        {st.unit || ''}
                      </span>
                    </div>

                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-800/80 gap-1">
                      <div
                        style={{
                          width: `${homePct}%`,
                          backgroundColor: homeLeads ? '#10b981' : '#475569',
                        }}
                        className="h-full rounded-l-full transition-all duration-500"
                      />
                      <div
                        style={{
                          width: `${awayPct}%`,
                          backgroundColor: awayLeads ? '#38bdf8' : '#475569',
                        }}
                        className="h-full rounded-r-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
