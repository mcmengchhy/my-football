'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Match, StandingRow } from '@/types/football';
import { LEAGUES, STANDINGS_BY_LEAGUE } from '@/lib/mock-data';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import { TeamCrest } from '@/components/TeamCrest';
import { BrandLogo } from '@/components/BrandLogo';
import { MatchCenter } from '@/components/MatchCenter';
import { NicheContentHub } from '@/components/NicheContentHub';
import {
  Activity,
  BookOpen,
  Calendar,
  ChevronRight,
  Flame,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';

type StatusFilter = 'ALL' | 'LIVE' | 'FT' | 'UPCOMING' | 'PINNED';
type MainNavSection = 'matches' | 'tactics';

export default function FootballLiveScorePage() {
  const [activeNav, setActiveNav] = useState<MainNavSection>('matches');
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Filters
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [dateOffset, setDateOffset] = useState<number>(0); // -1 Yesterday, 0 Today, 1 Tomorrow
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Standings state (Top 5 European Leagues + UCL)
  const [standingsLeague, setStandingsLeague] = useState<string>('epl');
  const [liveStandings, setLiveStandings] = useState<Record<string, StandingRow[]>>({});
  const [isFetchingStandings, setIsFetchingStandings] = useState<boolean>(true);

  // Loading state
  const [isFetchingMatches, setIsFetchingMatches] = useState<boolean>(true);

  // Load saved pins from localStorage on mount
  useEffect(() => {
    try {
      const savedPins = localStorage.getItem('pitchpulse_pinned_matches');
      if (savedPins) {
        setPinnedIds(JSON.parse(savedPins));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Fetch matches from Next.js server route (powered by football-data.org & server cache)
  const fetchMatchesFromServer = useCallback(async (offset: number, forceRefresh = false) => {
    setIsFetchingMatches(true);
    try {
      const res = await fetch(
        `/api/matches?dateOffset=${offset}${forceRefresh ? '&forceRefresh=true' : ''}`
      );
      const data = await res.json();
      if (Array.isArray(data.matches) && data.matches.length > 0) {
        setMatches(data.matches);
        setSelectedMatchId((prev) =>
          data.matches.some((m: Match) => m.id === prev) ? prev : data.matches[0].id
        );
      }
    } catch {
      // Keep existing matches on network error
    } finally {
      setIsFetchingMatches(false);
    }
  }, []);

  // Fetch League Standings from /api/standings (cached 6h server-side)
  const fetchStandingsFromServer = useCallback(async (leagueKey: string) => {
    setIsFetchingStandings(true);
    try {
      const res = await fetch(`/api/standings?league=${encodeURIComponent(leagueKey)}`);
      const data = await res.json();
      if (Array.isArray(data.standings) && data.standings.length > 0) {
        setLiveStandings((prev) => ({
          ...prev,
          [leagueKey]: data.standings,
        }));
      }
    } catch {
      // Keep fallback standings
    } finally {
      setIsFetchingStandings(false);
    }
  }, []);

  useEffect(() => {
    fetchMatchesFromServer(dateOffset);
  }, [dateOffset, fetchMatchesFromServer]);

  useEffect(() => {
    fetchStandingsFromServer(standingsLeague);
  }, [standingsLeague, fetchStandingsFromServer]);

  function togglePin(matchId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setPinnedIds((prev) => {
      const next = prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId];
      try {
        localStorage.setItem('pitchpulse_pinned_matches', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (selectedLeagueId !== 'ALL') {
        const selectedLgObj = LEAGUES.find((l) => l.id === selectedLeagueId);
        const matchesId = m.league.id === selectedLeagueId;
        const matchesCode =
          selectedLgObj?.footballDataCode &&
          m.league.footballDataCode === selectedLgObj.footballDataCode;
        if (!matchesId && !matchesCode) {
          return false;
        }
      }
      if (statusFilter === 'LIVE' && m.status !== 'LIVE' && m.status !== 'HT') {
        return false;
      }
      if (statusFilter === 'FT' && m.status !== 'FT') {
        return false;
      }
      if (statusFilter === 'UPCOMING' && m.status !== 'UPCOMING') {
        return false;
      }
      if (statusFilter === 'PINNED' && !pinnedIds.includes(m.id)) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inTeams =
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q) ||
          m.league.name.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q);
        if (!inTeams) return false;
      }
      return true;
    });
  }, [matches, selectedLeagueId, statusFilter, pinnedIds, searchQuery]);

  // Group filtered matches by league
  const groupedByLeague = useMemo(() => {
    const map = new Map<string, { league: Match['league']; items: Match[] }>();
    for (const m of filteredMatches) {
      const existing = map.get(m.league.id);
      if (existing) {
        existing.items.push(m);
      } else {
        map.set(m.league.id, { league: m.league, items: [m] });
      }
    }
    return Array.from(map.values());
  }, [filteredMatches]);

  const liveCount = useMemo(
    () => matches.filter((m) => m.status === 'LIVE' || m.status === 'HT').length,
    [matches]
  );

  const selectedMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId) || matches[0],
    [matches, selectedMatchId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#060b14] text-slate-100 relative">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[130px]" />
      </div>

      {/* TOP BROADCAST NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070d19]/90 backdrop-blur-xl">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <BrandLogo
            liveCount={liveCount}
            onClick={() => setActiveNav('matches')}
          />

          {/* Primary Public Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-white/10">
            {[
              {
                id: 'matches',
                label: 'Matches & Previews',
                icon: <Radio className="w-3.5 h-3.5" />,
              },
              {
                id: 'tactics',
                label: 'Tactical Hub & Guides',
                icon: <BookOpen className="w-3.5 h-3.5" />,
              },
            ].map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id as MainNavSection)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Bar & Refresh */}
          <div className="flex items-center gap-2.5 flex-1 max-w-md justify-end">
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeNav !== 'matches') setActiveNav('matches');
                }}
                placeholder="Search club, competition, or stadium..."
                className="w-full pl-10 pr-12 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] focus:bg-slate-900 border border-white/10 focus:border-emerald-500/50 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => fetchMatchesFromServer(dateOffset)}
              disabled={isFetchingMatches}
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              title="Refresh scores"
              aria-label="Refresh scores"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetchingMatches ? 'animate-spin text-emerald-400' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Section Switcher Bar */}
        <div className="lg:hidden border-t border-white/5 bg-slate-950/90 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'matches', label: 'Matches & Previews' },
            { id: 'tactics', label: 'Tactical Hub & Guides' },
          ].map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id as MainNavSection)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-all ${
                  active
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="relative z-10 flex-1 max-w-[1480px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeNav !== 'matches' ? (
          <NicheContentHub />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT SIDEBAR: LEAGUES, LIVE STANDINGS & NEWSLETTER (3 cols on lg) */}
            <aside className="lg:col-span-3 space-y-5">
              {/* Competitions Navigation (Top 5 European Leagues + UCL) */}
              <div className="rounded-3xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-4 shadow-xl">
                <div className="flex items-center justify-between px-2 mb-3">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    Top 5 Leagues + UCL
                  </h2>
                  <span className="text-[11px] text-slate-500">{matches.length} fixtures</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedLeagueId('ALL')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      selectedLeagueId === 'ALL'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-950/20 flex items-center justify-center text-[11px] font-black">
                        🌍
                      </span>
                      <span>All Competitions</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        selectedLeagueId === 'ALL'
                          ? 'bg-slate-950/20 text-slate-950 font-extrabold'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {matches.length}
                    </span>
                  </button>

                  {LEAGUES.map((lg) => {
                    const count = matches.filter(
                      (m) =>
                        m.league.id === lg.id ||
                        (lg.footballDataCode && m.league.footballDataCode === lg.footballDataCode)
                    ).length;
                    const liveInLeague = matches.filter(
                      (m) =>
                        (m.league.id === lg.id ||
                          (lg.footballDataCode &&
                            m.league.footballDataCode === lg.footballDataCode)) &&
                        (m.status === 'LIVE' || m.status === 'HT')
                    ).length;
                    const active = selectedLeagueId === lg.id;

                    return (
                      <button
                        key={lg.id}
                        type="button"
                        onClick={() => setSelectedLeagueId(lg.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0"
                            style={{ backgroundColor: active ? '#0f172a' : lg.primaryColor }}
                          >
                            {lg.badgeText}
                          </span>
                          <div className="truncate text-left">
                            <div className="truncate">{lg.name}</div>
                            <div
                              className={`text-[10px] ${
                                active ? 'text-slate-900/80' : 'text-slate-500'
                              }`}
                            >
                              {lg.country}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {liveInLeague > 0 && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                                active
                                  ? 'bg-slate-950 text-emerald-400'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {liveInLeague} LIVE
                            </span>
                          )}
                          <span
                            className={`text-[11px] ${
                              active ? 'text-slate-950 font-extrabold' : 'text-slate-500'
                            }`}
                          >
                            {count}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Live Standings & Form Guide Widget */}
              <div className="rounded-3xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    League Tables &amp; Form
                  </h3>
                  {isFetchingStandings && (
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                  )}
                </div>

                {/* All 6 Competition Tabs */}
                <div className="grid grid-cols-6 gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 mb-3">
                  {(
                    [
                      { id: 'epl', label: 'EPL' },
                      { id: 'laliga', label: 'LAL' },
                      { id: 'seriea', label: 'SER' },
                      { id: 'bundesliga', label: 'BUN' },
                      { id: 'ligue1', label: 'L1' },
                      { id: 'ucl', label: 'UCL' },
                    ] as const
                  ).map((lg) => (
                    <button
                      key={lg.id}
                      type="button"
                      onClick={() => setStandingsLeague(lg.id)}
                      className={`py-1 rounded-lg text-[10px] font-extrabold uppercase cursor-pointer transition-all ${
                        standingsLeague === lg.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lg.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase text-slate-500 border-b border-white/10">
                        <th className="py-2 pl-1">#</th>
                        <th className="py-2">Club</th>
                        <th className="py-2 text-center">PL</th>
                        <th className="py-2 text-center">GD</th>
                        <th className="py-2 pr-1 text-right">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {isFetchingStandings && !liveStandings[standingsLeague]
                        ? Array.from({ length: 8 }).map((_, idx) => (
                            <tr key={idx} className="animate-pulse">
                              <td className="py-2.5 pl-1">
                                <div className="h-3 w-3 rounded bg-white/10" />
                              </td>
                              <td className="py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
                                  <div className="space-y-1.5">
                                    <div className="h-3 w-20 rounded bg-white/10" />
                                    <div className="h-1.5 w-12 rounded bg-white/5" />
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 text-center">
                                <div className="h-3 w-4 mx-auto rounded bg-white/10" />
                              </td>
                              <td className="py-2.5 text-center">
                                <div className="h-3 w-5 mx-auto rounded bg-white/10" />
                              </td>
                              <td className="py-2.5 pr-1 text-right">
                                <div className="h-3 w-5 ml-auto rounded bg-white/15" />
                              </td>
                            </tr>
                          ))
                        : (liveStandings[standingsLeague] || STANDINGS_BY_LEAGUE[standingsLeague] || STANDINGS_BY_LEAGUE.epl)
                            .slice(0, 8)
                            .map((row) => {
                              const gd = row.goalsFor - row.goalsAgainst;
                              return (
                                <tr
                                  key={row.team.id}
                                  className="hover:bg-white/[0.03] transition-colors"
                                >
                                  <td className="py-2 pl-1 font-mono text-[11px] text-emerald-400 font-bold">
                                    {row.rank}
                                  </td>
                                  <td className="py-2">
                                    <div className="flex items-center gap-2">
                                      <TeamCrest team={row.team} size="sm" />
                                      <div className="min-w-0">
                                        <div className="font-semibold text-slate-200 truncate max-w-[100px]">
                                          {row.team.shortName}
                                        </div>
                                        <div className="flex items-center gap-0.5 mt-0.5">
                                          {row.form.slice(-5).map((f, idx) => (
                                            <span
                                              key={idx}
                                              className={`w-1.5 h-1.5 rounded-full ${
                                                f === 'W'
                                                  ? 'bg-emerald-400'
                                                  : f === 'D'
                                                  ? 'bg-slate-400'
                                                  : 'bg-rose-400'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 text-center text-slate-400 font-mono text-[11px]">
                                    {row.played}
                                  </td>
                                  <td className="py-2 text-center text-slate-300 font-mono text-[11px]">
                                    {gd >= 0 ? `+${gd}` : gd}
                                  </td>
                                  <td className="py-2 pr-1 text-right font-mono font-extrabold text-white">
                                    {row.points}
                                  </td>
                                </tr>
                              );
                            })}
                    </tbody>
                  </table>
                </div>
              </div>
            </aside>

            {/* CENTER COLUMN: LIVE SCOREBOARD FEED (4 cols on lg) */}
            <section className="lg:col-span-4 space-y-4">
              {/* Date Selector & Status Tabs Card */}
              <div className="rounded-3xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-3.5 shadow-xl space-y-3">
                {/* Date Strip */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/5">
                  {[
                    { offset: -1, label: 'Yesterday' },
                    { offset: 0, label: 'Today • Matchday' },
                    { offset: 1, label: 'Tomorrow' },
                  ].map((d) => {
                    const active = dateOffset === d.offset;
                    return (
                      <button
                        key={d.offset}
                        type="button"
                        onClick={() => setDateOffset(d.offset)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          active
                            ? 'bg-white/10 text-white border border-white/15 shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {d.offset === 0 && <Calendar className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{d.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                  {(
                    [
                      { id: 'ALL', label: 'All' },
                      { id: 'LIVE', label: 'Live', count: liveCount },
                      { id: 'FT', label: 'Finished' },
                      { id: 'UPCOMING', label: 'Upcoming' },
                      { id: 'PINNED', label: 'Pinned', count: pinnedIds.length },
                    ] as { id: StatusFilter; label: string; count?: number }[]
                  ).map((tab) => {
                    const active = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          active
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/5'
                        }`}
                      >
                        {tab.id === 'LIVE' && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              active ? 'bg-slate-950 animate-ping' : 'bg-emerald-400 animate-pulse'
                            }`}
                          />
                        )}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              active
                                ? 'bg-slate-950/20 text-slate-950'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grouped League Match Cards or Skeleton */}
              {isFetchingMatches && matches.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2].map((groupIdx) => (
                    <div
                      key={groupIdx}
                      className="rounded-3xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl overflow-hidden shadow-xl animate-pulse"
                    >
                      {/* League Header Skeleton */}
                      <div className="flex items-center justify-between px-4 py-3.5 bg-white/[0.02] border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-5 rounded-md bg-white/10" />
                          <div className="space-y-1.5">
                            <div className="h-3 w-32 rounded bg-white/10" />
                            <div className="h-2 w-24 rounded bg-white/5" />
                          </div>
                        </div>
                        <div className="w-4 h-4 rounded bg-white/5" />
                      </div>

                      {/* Match Rows Skeleton */}
                      <div className="divide-y divide-white/5">
                        {[1, 2, 3].map((rowIdx) => (
                          <div key={rowIdx} className="px-3.5 py-4 flex items-center gap-3">
                            <div className="w-12 flex flex-col items-center gap-2 shrink-0">
                              <div className="h-4 w-10 rounded-full bg-white/10" />
                              <div className="h-3.5 w-3.5 rounded bg-white/5" />
                            </div>
                            <div className="flex-1 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-white/10" />
                                  <div className="h-3.5 w-28 rounded bg-white/10" />
                                </div>
                                <div className="h-5 w-6 rounded bg-white/10" />
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-white/10" />
                                  <div className="h-3.5 w-24 rounded bg-white/10" />
                                </div>
                                <div className="h-5 w-6 rounded bg-white/10" />
                              </div>
                              <div className="pt-1 flex items-center justify-between">
                                <div className="h-2.5 w-36 rounded bg-white/5" />
                                <div className="h-2.5 w-16 rounded bg-emerald-500/20" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : groupedByLeague.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#0d1526]/90 p-10 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-sm font-bold text-slate-200">
                    No matches match your filter
                  </div>
                  <p className="text-xs text-slate-400">
                    Try switching back to Today or clearing the status filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDateOffset(0);
                      setStatusFilter('ALL');
                      setSelectedLeagueId('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedByLeague.map(({ league, items }) => (
                    <div
                      key={league.id}
                      className="rounded-3xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl overflow-hidden shadow-xl"
                    >
                      {/* League Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-black text-white"
                            style={{ backgroundColor: league.primaryColor }}
                          >
                            {league.badgeText}
                          </span>
                          <div>
                            <h3 className="text-xs font-bold text-white leading-tight">
                              {league.name}
                            </h3>
                            <p className="text-[10px] text-slate-400">
                              {league.country} • {league.round}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>

                      {/* Matches List */}
                      <div className="divide-y divide-white/5">
                        {items.map((match) => {
                          const isSelected = match.id === selectedMatch?.id;
                          const isPinned = pinnedIds.includes(match.id);
                          const latestGoal = [...match.events]
                            .reverse()
                            .find((e) => e.type === 'goal' || e.type === 'penalty');

                          return (
                            <div
                              key={match.id}
                              onClick={() => {
                                setSelectedMatchId(match.id);
                                setMobileDrawerOpen(true);
                              }}
                              className={`group relative px-3.5 py-3.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-500/[0.09] border-l-4 border-l-emerald-400'
                                  : 'hover:bg-white/[0.04]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Pin & Status Column */}
                                <div className="flex flex-col items-center justify-center w-12 shrink-0 gap-1">
                                  {match.status === 'LIVE' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-extrabold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                      {match.minute}&apos;
                                    </span>
                                  ) : match.status === 'HT' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold">
                                      HT
                                    </span>
                                  ) : match.status === 'FT' ? (
                                    <span className="text-[11px] font-bold text-slate-400">FT</span>
                                  ) : (
                                    <span className="text-[11px] font-mono font-semibold text-sky-300">
                                      {match.kickoffTime}
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => togglePin(match.id, e)}
                                    className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                                    aria-label="Pin match"
                                  >
                                    <Star
                                      className={`w-3.5 h-3.5 ${
                                        isPinned ? 'fill-amber-400 text-amber-400' : ''
                                      }`}
                                    />
                                  </button>
                                </div>

                                {/* Teams & Scores Stack */}
                                <div className="flex-1 min-w-0 space-y-2">
                                  {/* Home Row */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <TeamCrest team={match.homeTeam} size="sm" />
                                      <span
                                        className={`text-sm truncate ${
                                          match.homeScore > match.awayScore
                                            ? 'font-extrabold text-white'
                                            : 'font-semibold text-slate-200'
                                        }`}
                                      >
                                        {match.homeTeam.name}
                                      </span>
                                    </div>
                                    <span
                                      className={`font-mono text-base tabular-nums px-2 py-0.5 rounded-lg ${
                                        match.status === 'UPCOMING'
                                          ? 'text-slate-500'
                                          : match.status === 'LIVE'
                                          ? 'bg-white/10 text-white font-black'
                                          : 'text-slate-200 font-bold'
                                      }`}
                                    >
                                      {match.status === 'UPCOMING' ? '-' : match.homeScore}
                                    </span>
                                  </div>

                                  {/* Away Row */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <TeamCrest team={match.awayTeam} size="sm" />
                                      <span
                                        className={`text-sm truncate ${
                                          match.awayScore > match.homeScore
                                            ? 'font-extrabold text-white'
                                            : 'font-semibold text-slate-200'
                                        }`}
                                      >
                                        {match.awayTeam.name}
                                      </span>
                                    </div>
                                    <span
                                      className={`font-mono text-base tabular-nums px-2 py-0.5 rounded-lg ${
                                        match.status === 'UPCOMING'
                                          ? 'text-slate-500'
                                          : match.status === 'LIVE'
                                          ? 'bg-white/10 text-white font-black'
                                          : 'text-slate-200 font-bold'
                                      }`}
                                    >
                                      {match.status === 'UPCOMING' ? '-' : match.awayScore}
                                    </span>
                                  </div>

                                  {/* Match Row Footer */}
                                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                                    {latestGoal ? (
                                      <span className="truncate">
                                        ⚽ Latest:{' '}
                                        <strong className="text-slate-300">
                                          {latestGoal.player}
                                        </strong>{' '}
                                        ({latestGoal.minute}&apos;)
                                      </span>
                                    ) : (
                                      <span className="truncate">
                                        {match.matchDateLabel
                                          ? `${match.matchDateLabel} • `
                                          : ''}
                                        {match.venue}
                                      </span>
                                    )}
                                    <span className="text-emerald-400 font-semibold shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                                      Preview &amp; 2D →
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN: INTERACTIVE LIVE MATCH CENTER (5 cols on lg) */}
            <section className="hidden lg:block lg:col-span-5">
              <div className="sticky top-22 h-[calc(100vh-6.5rem)]">
                {selectedMatch ? (
                  <MatchCenter match={selectedMatch} />
                ) : (
                  <div className="flex flex-col h-full rounded-3xl border border-white/10 bg-[#0d1526]/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-pulse">
                    {/* Hero Scoreboard Skeleton */}
                    <div className="border-b border-white/10 p-5 bg-slate-900/60 space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-10 rounded bg-white/10" />
                          <div className="h-3.5 w-32 rounded bg-white/10" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-6 w-14 rounded-lg bg-white/5" />
                          <div className="h-6 w-14 rounded-lg bg-white/5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2 py-2">
                        <div className="flex flex-col items-center gap-2.5">
                          <div className="w-14 h-14 rounded-full bg-white/10" />
                          <div className="h-4 w-24 rounded bg-white/10" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-5 w-20 rounded-full bg-white/10" />
                          <div className="h-9 w-24 rounded-xl bg-white/15" />
                        </div>
                        <div className="flex flex-col items-center gap-2.5">
                          <div className="w-14 h-14 rounded-full bg-white/10" />
                          <div className="h-4 w-24 rounded bg-white/10" />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex justify-between">
                        <div className="h-3 w-36 rounded bg-white/5" />
                        <div className="h-3 w-24 rounded bg-white/5" />
                      </div>
                    </div>

                    {/* Tabs Bar Skeleton */}
                    <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-950/80 border-b border-white/10">
                      {[1, 2, 3, 4, 5].map((t) => (
                        <div key={t} className="h-8 rounded-xl bg-white/5" />
                      ))}
                    </div>

                    {/* Content Body Skeleton */}
                    <div className="p-5 space-y-4 flex-1">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                        <div className="h-4 w-40 rounded bg-emerald-500/20" />
                        <div className="h-5 w-3/4 rounded bg-white/10" />
                        <div className="h-3 w-full rounded bg-white/5" />
                        <div className="h-3 w-5/6 rounded bg-white/5" />
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="h-14 rounded-xl bg-white/5" />
                          <div className="h-14 rounded-xl bg-white/5" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                        <div className="h-4 w-44 rounded bg-white/10" />
                        <div className="h-20 rounded-xl bg-white/5" />
                        <div className="h-20 rounded-xl bg-white/5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#050911] py-8 px-4 sm:px-6 mt-10">
        <div className="max-w-[1480px] mx-auto space-y-6 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" onClick={() => setActiveNav('matches')} />
              <span>•</span>
              <span>Football Match Previews, Tactical Analysis &amp; 2D Match Center</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveNav('matches')}
                className="hover:text-emerald-400 cursor-pointer"
              >
                Matches &amp; Previews
              </button>
              <button
                type="button"
                onClick={() => setActiveNav('tactics')}
                className="hover:text-emerald-400 cursor-pointer"
              >
                Tactical Guides
              </button>
              <a
                href="/sitemap.xml"
                className="hover:text-emerald-400"
              >
                Sitemap
              </a>
              <a
                href="https://www.reddit.com/r/soccer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                r/soccer
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                X (Twitter)
              </a>
            </div>
          </div>

          {/* Direct Crawlable SEO Links for Search Engines */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Featured Guides:
            </span>
            {NICHE_ARTICLES.map((art) => (
              <Link
                key={art.id}
                href={`/guides/${art.slug}`}
                className="hover:text-emerald-400 transition-colors"
              >
                {art.seoKeyword}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* MOBILE / TABLET SLIDE-OVER DRAWER FOR MATCH CENTER */}
      {mobileDrawerOpen && selectedMatch && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-md flex flex-col justify-end">
          <div className="h-[90vh] w-full">
            <MatchCenter
              match={selectedMatch}
              onCloseMobile={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
