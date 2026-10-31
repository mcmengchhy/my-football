import {
  ApiCacheMeta,
  LeagueInfo,
  LineupPlayer,
  Match,
  MatchEvent,
  MatchStatus,
  MomentumPoint,
  StandingRow,
  StatPair,
} from '@/types/football';
import { LEAGUES, STANDINGS_BY_LEAGUE } from './mock-data';
import { buildTacticalPreviewForMatch } from './niche-content';

const MATCHES_CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours heavy cache (per football_niche_site_plan.txt)
const STANDINGS_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours heavy cache for league tables

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  cachedAtIso: string;
}

const globalForCache = globalThis as unknown as {
  __pitchPulseMatchesCache?: Map<string, CacheEntry<Match[]>>;
  __pitchPulseStandingsCache?: Map<string, CacheEntry<StandingRow[]>>;
};

const matchesCache =
  globalForCache.__pitchPulseMatchesCache ||
  (globalForCache.__pitchPulseMatchesCache = new Map<string, CacheEntry<Match[]>>());

const standingsCache =
  globalForCache.__pitchPulseStandingsCache ||
  (globalForCache.__pitchPulseStandingsCache = new Map<string, CacheEntry<StandingRow[]>>());

const TEAM_COLORS = [
  ['#ef4444', '#ffffff'],
  ['#3b82f6', '#ffffff'],
  ['#10b981', '#0f172a'],
  ['#f59e0b', '#0f172a'],
  ['#8b5cf6', '#ffffff'],
  ['#06b6d4', '#0f172a'],
  ['#ec4899', '#ffffff'],
];

function hashColor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % TEAM_COLORS.length;
  }
  return TEAM_COLORS[Math.abs(h)] as [string, string];
}

function makeCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z ]/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1].slice(0, 2)).toUpperCase();
  }
  return clean.slice(0, 3).toUpperCase() || 'FC';
}

function parseFormString(rawForm?: string | null): ('W' | 'D' | 'L')[] {
  if (!rawForm) return ['W', 'D', 'W', 'W', 'L'];
  const tokens = rawForm
    .replace(/,/g, '')
    .trim()
    .split('')
    .filter((c): c is 'W' | 'D' | 'L' => c === 'W' || c === 'D' || c === 'L');
  return tokens.length > 0 ? tokens.slice(-5) : ['W', 'D', 'W', 'W', 'L'];
}

function buildSyntheticEvents(
  matchId: string,
  homeShort: string,
  awayShort: string,
  homeScore: number,
  awayScore: number,
  maxMinute = 90
): MatchEvent[] {
  const events: MatchEvent[] = [];
  const totalGoals = Math.min(homeScore + awayScore, 10);
  if (totalGoals <= 0) return events;

  let h = 0;
  let a = 0;
  for (let i = 0; i < totalGoals; i++) {
    const isHomeGoal = h < homeScore && (a >= awayScore || i % 2 === 0);
    if (isHomeGoal) h++;
    else a++;
    const minute = Math.max(
      4,
      Math.min(maxMinute, Math.round(((i + 1) / (totalGoals + 1)) * maxMinute))
    );
    events.push({
      id: `${matchId}-ev-${i}`,
      minute,
      team: isHomeGoal ? 'home' : 'away',
      type: 'goal',
      player: `${isHomeGoal ? homeShort : awayShort} Scorer`,
      detail: 'Open-play clinical finish inside the penalty area',
      scoreSnapshot: `${h} - ${a}`,
    });
  }
  return events;
}

function buildSyntheticMomentum(seed: number, minute: number, events: MatchEvent[]): MomentumPoint[] {
  const maxMin = Math.max(1, Math.min(90, minute || 45));
  const points: MomentumPoint[] = [];
  let prev = 0;
  for (let m = 1; m <= maxMin; m++) {
    const wave = Math.sin((m + seed) * 0.31) * 50 + Math.cos((m * 1.4 + seed) * 0.21) * 35;
    const val = Math.max(-92, Math.min(92, Math.round(prev * 0.4 + wave * 0.6)));
    prev = val;
    const ev = events.find((e) => e.minute === m);
    let evTag: MomentumPoint['event'] = undefined;
    if (ev) {
      if (ev.type === 'goal' || ev.type === 'penalty' || ev.type === 'own-goal') {
        evTag = ev.team === 'home' ? 'goal-home' : 'goal-away';
      } else if (ev.type === 'yellow-card' || ev.type === 'red-card') {
        evTag = ev.team === 'home' ? 'card-home' : 'card-away';
      }
    }
    points.push({
      minute: m,
      value: evTag === 'goal-home' ? 88 : evTag === 'goal-away' ? -88 : val,
      event: evTag,
    });
  }
  return points;
}

function buildDefaultLineup(teamName: string, side: 'home' | 'away'): LineupPlayer[] {
  const isHome = side === 'home';
  const coords: { pos: LineupPlayer['position']; x: number; y: number; num: number }[] = [
    { pos: 'GK', x: isHome ? 7 : 93, y: 50, num: 1 },
    { pos: 'DEF', x: isHome ? 21 : 79, y: 16, num: 2 },
    { pos: 'DEF', x: isHome ? 19 : 81, y: 38, num: 4 },
    { pos: 'DEF', x: isHome ? 19 : 81, y: 62, num: 5 },
    { pos: 'DEF', x: isHome ? 21 : 79, y: 84, num: 3 },
    { pos: 'MID', x: isHome ? 33 : 67, y: 30, num: 8 },
    { pos: 'MID', x: isHome ? 31 : 69, y: 50, num: 6 },
    { pos: 'MID', x: isHome ? 33 : 67, y: 70, num: 10 },
    { pos: 'FWD', x: isHome ? 45 : 55, y: 20, num: 7 },
    { pos: 'FWD', x: isHome ? 47 : 53, y: 50, num: 9 },
    { pos: 'FWD', x: isHome ? 45 : 55, y: 80, num: 11 },
  ];
  const prefix = makeCode(teamName);
  return coords.map((c, idx) => ({
    id: `${side}-${idx}`,
    number: c.num,
    name: `${prefix} #${c.num}`,
    position: c.pos,
    x: c.x,
    y: c.y,
    rating: Number((6.8 + ((idx * 3) % 15) * 0.1).toFixed(1)),
    isCaptain: idx === 2,
  }));
}

/**
 * Fetch and normalize fixtures from API-Football v3 (https://v3.football.api-sports.io)
 * Includes multi-hour server-side caching.
 */
export async function fetchFromApiFootball(
  apiKey: string,
  dateStr: string,
  forceRefresh = false
): Promise<{ matches: Match[]; cacheMeta: ApiCacheMeta }> {
  const cacheKey = `af:${dateStr}`;
  const now = Date.now();
  const existing = matchesCache.get(cacheKey);

  if (!forceRefresh && existing && now - existing.timestamp < MATCHES_CACHE_TTL_MS) {
    return {
      matches: existing.data,
      cacheMeta: {
        cached: true,
        cachedAt: existing.cachedAtIso,
        ttlSeconds: Math.round((MATCHES_CACHE_TTL_MS - (now - existing.timestamp)) / 1000),
        provider: 'api-football',
        rateLimitNote: 'Served from server cache (protects 100 req/day quota)',
      },
    };
  }

  const url = `https://v3.football.api-sports.io/fixtures?date=${encodeURIComponent(dateStr)}`;
  const res = await fetch(url, {
    headers: {
      'x-apisports-key': apiKey,
    },
    next: { revalidate: 10800 },
  });

  if (!res.ok) {
    throw new Error(`API-Football HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    const errMsg = Object.values(data.errors).join(', ');
    throw new Error(`API-Football Error: ${errMsg}`);
  }

  const rawList: any[] = Array.isArray(data.response) ? data.response : [];
  const knownLeagueIds = new Set(LEAGUES.map((l) => l.apiFootballId).filter(Boolean));
  const prioritized = rawList.filter((item) => knownLeagueIds.has(item.league?.id));
  const selected = (prioritized.length > 0 ? prioritized : rawList).slice(0, 24);

  const normalized = selected.map((item, idx): Match => {
    const shortStatus: string = item.fixture?.status?.short || 'NS';
    let status: MatchStatus = 'UPCOMING';
    if (['1H', '2H', 'ET', 'P', 'LIVE'].includes(shortStatus)) status = 'LIVE';
    else if (shortStatus === 'HT') status = 'HT';
    else if (['FT', 'AET', 'PEN'].includes(shortStatus)) status = 'FT';

    const matchedLeague = LEAGUES.find((l) => l.apiFootballId === item.league?.id);
    const league: LeagueInfo = matchedLeague || {
      id: `league-${item.league?.id || idx}`,
      apiFootballId: item.league?.id,
      name: item.league?.name || 'International League',
      country: item.league?.country || 'World',
      countryCode: (item.league?.country || 'WL').slice(0, 3).toUpperCase(),
      round: item.league?.round || 'Regular Season',
      primaryColor: '#10b981',
      badgeText: makeCode(item.league?.name || 'LGE'),
    };

    const homeName = item.teams?.home?.name || 'Home FC';
    const awayName = item.teams?.away?.name || 'Away FC';
    const homeCode = makeCode(homeName);
    const awayCode = makeCode(awayName);
    const [hPri, hSec] = hashColor(homeName);
    const [aPri, aSec] = hashColor(awayName);

    const homeScore = item.goals?.home ?? 0;
    const awayScore = item.goals?.away ?? 0;
    const minute = item.fixture?.status?.elapsed || (status === 'FT' ? 90 : 0);

    const events: MatchEvent[] = Array.isArray(item.events)
      ? item.events.map((ev: any, eIdx: number): MatchEvent => {
          const isHome = ev.team?.id === item.teams?.home?.id;
          let type: MatchEvent['type'] = 'goal';
          if (ev.type === 'Card') {
            type = ev.detail?.includes('Red') ? 'red-card' : 'yellow-card';
          } else if (ev.type === 'subst') {
            type = 'sub';
          } else if (ev.type === 'Var') {
            type = 'var';
          } else if (ev.detail?.includes('Penalty')) {
            type = 'penalty';
          }
          return {
            id: `af-ev-${item.fixture?.id}-${eIdx}`,
            minute: ev.time?.elapsed || 1,
            addedTime: ev.time?.extra || undefined,
            team: isHome ? 'home' : 'away',
            type,
            player: ev.player?.name || 'Player',
            secondaryPlayer: ev.assist?.name || undefined,
            detail: ev.detail || ev.type,
          };
        })
      : [];

    const kickoffDate = item.fixture?.date ? new Date(item.fixture.date) : new Date();
    const kickoffTime = kickoffDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const stats: StatPair[] = [
      { label: 'Ball Possession', home: 52, away: 48, unit: '%' },
      {
        label: 'Expected Goals (xG)',
        home: Number((homeScore * 0.85 + 0.4).toFixed(2)),
        away: Number((awayScore * 0.85 + 0.35).toFixed(2)),
        isDecimal: true,
      },
      { label: 'Total Shots', home: homeScore * 4 + 5, away: awayScore * 4 + 4 },
      { label: 'Shots on Target', home: homeScore + 2, away: awayScore + 2 },
      { label: 'Corner Kicks', home: 5, away: 4 },
    ];

    return {
      id: `af-${item.fixture?.id || idx}`,
      league,
      homeTeam: {
        id: `af-h-${item.teams?.home?.id || idx}`,
        name: homeName,
        shortName: homeName,
        code: homeCode,
        primaryColor: hPri,
        secondaryColor: hSec,
        crestUrl: item.teams?.home?.logo || undefined,
        form: ['W', 'D', 'W', 'W', 'L'],
      },
      awayTeam: {
        id: `af-a-${item.teams?.away?.id || idx}`,
        name: awayName,
        shortName: awayName,
        code: awayCode,
        primaryColor: aPri,
        secondaryColor: aSec,
        crestUrl: item.teams?.away?.logo || undefined,
        form: ['D', 'W', 'L', 'W', 'W'],
      },
      homeScore,
      awayScore,
      htHomeScore: item.score?.halftime?.home ?? undefined,
      htAwayScore: item.score?.halftime?.away ?? undefined,
      status,
      minute: minute || undefined,
      kickoffTime,
      dateOffset: 0,
      venue: item.fixture?.venue?.name
        ? `${item.fixture.venue.name}${item.fixture.venue.city ? `, ${item.fixture.venue.city}` : ''}`
        : 'Stadium',
      referee: item.fixture?.referee || undefined,
      events,
      stats,
      momentum: status === 'UPCOMING' ? [] : buildSyntheticMomentum(idx + 7, minute || 45, events),
      lineups: {
        home: {
          formation: '4-3-3',
          coach: 'Head Coach',
          startingXI: buildDefaultLineup(homeName, 'home'),
          substitutes: [],
        },
        away: {
          formation: '4-2-3-1',
          coach: 'Head Coach',
          startingXI: buildDefaultLineup(awayName, 'away'),
          substitutes: [],
        },
      },
      livePitch:
        status === 'LIVE'
          ? {
              possession: idx % 2 === 0 ? 'home' : 'away',
              statusText: 'Live API Match Feed • Active Play',
              ballX: 35 + ((idx * 17) % 40),
              ballY: 25 + ((idx * 23) % 50),
              trail: [
                { x: 50, y: 50 },
                { x: 35 + ((idx * 17) % 40), y: 25 + ((idx * 23) % 50) },
              ],
            }
          : undefined,
      tacticalPreview: buildTacticalPreviewForMatch({
        homeName,
        awayName,
        homeCode,
        awayCode,
        leagueName: league.name,
        status,
        homeScore,
        awayScore,
      }),
    };
  });

  const cachedAtIso = new Date().toISOString();
  matchesCache.set(cacheKey, {
    data: normalized,
    timestamp: now,
    cachedAtIso,
  });

  return {
    matches: normalized,
    cacheMeta: {
      cached: false,
      cachedAt: cachedAtIso,
      ttlSeconds: MATCHES_CACHE_TTL_MS / 1000,
      provider: 'api-football',
      rateLimitNote: 'Fresh fetch • Cached for 3 hours',
    },
  };
}

/**
 * Helper to shift a YYYY-MM-DD date string by N days
 */
function shiftDateStr(dateStr: string, deltaDays: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().split('T')[0];
}

/**
 * Fetch and normalize matches from Football-Data.org v4 (https://api.football-data.org/v4/matches)
 * Implements heavy multi-hour caching (per football_niche_site_plan.txt Section 5 & 10)
 * and fetches the 3-day Matchday window when Today has few fixtures so all European leagues are populated.
 */
export async function fetchFromFootballDataOrg(
  apiKey: string,
  dateStr: string,
  dateOffset = 0,
  forceRefresh = false
): Promise<{ matches: Match[]; cacheMeta: ApiCacheMeta; usedWindow?: string }> {
  const cacheKey = `fd:${dateStr}:${dateOffset}`;
  const now = Date.now();
  const existing = matchesCache.get(cacheKey);

  if (!forceRefresh && existing && now - existing.timestamp < MATCHES_CACHE_TTL_MS) {
    return {
      matches: existing.data,
      cacheMeta: {
        cached: true,
        cachedAt: existing.cachedAtIso,
        ttlSeconds: Math.round((MATCHES_CACHE_TTL_MS - (now - existing.timestamp)) / 1000),
        provider: 'football-data',
        rateLimitNote: 'Served from 3-hour server cache (10 req/min safe)',
      },
    };
  }

  const headers = {
    'X-Auth-Token': apiKey,
  };

  // For dateOffset === 0 (Today • Matchday), fetch a 2-day window (Today + Tomorrow) so Friday/Saturday or Saturday/Sunday matchweek fixtures across PL, PD, SA, BL1, FL1 appear together
  const dateFrom = dateStr;
  const dateTo = dateOffset === 0 ? shiftDateStr(dateStr, 1) : dateStr;

  const primaryUrl = `https://api.football-data.org/v4/matches?dateFrom=${encodeURIComponent(
    dateFrom
  )}&dateTo=${encodeURIComponent(dateTo)}`;
  const res = await fetch(primaryUrl, {
    headers,
    next: { revalidate: 10800 },
  });

  if (!res.ok) {
    throw new Error(`Football-Data.org HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  let rawMatches: any[] = Array.isArray(data.matches) ? data.matches : [];
  let usedWindow: string | undefined =
    dateFrom !== dateTo ? `${dateFrom} to ${dateTo}` : undefined;

  // If the requested window has 0 fixtures, expand to a 7-day window around dateStr
  if (rawMatches.length === 0) {
    const fromWindow = shiftDateStr(dateStr, -3);
    const toWindow = shiftDateStr(dateStr, 4);
    const windowUrl = `https://api.football-data.org/v4/matches?dateFrom=${encodeURIComponent(
      fromWindow
    )}&dateTo=${encodeURIComponent(toWindow)}`;
    const winRes = await fetch(windowUrl, {
      headers,
      next: { revalidate: 10800 },
    });
    if (winRes.ok) {
      const winData = await winRes.json();
      if (Array.isArray(winData.matches) && winData.matches.length > 0) {
        rawMatches = winData.matches;
        usedWindow = `${fromWindow} to ${toWindow}`;
      }
    }
  }

  // Sort Top 5 European Leagues + UCL first, then keep all other official Football-Data.org competitions
  const priorityOrder: Record<string, number> = {
    CL: 1,
    PL: 2,
    PD: 3,
    SA: 4,
    BL1: 5,
    FL1: 6,
    ELC: 7,
    PPL: 8,
    DED: 9,
    BSA: 10,
  };

  const sortedMatches = [...rawMatches].sort((a, b) => {
    const pA = priorityOrder[a.competition?.code] || 99;
    const pB = priorityOrder[b.competition?.code] || 99;
    return pA - pB;
  });

  const selected = sortedMatches.slice(0, 40);

  const normalized = selected.map((m, idx): Match => {
    const rawStatus: string = m.status || 'SCHEDULED';
    let status: MatchStatus = 'UPCOMING';
    if (rawStatus === 'IN_PLAY') status = 'LIVE';
    else if (rawStatus === 'PAUSED') status = 'HT';
    else if (rawStatus === 'FINISHED') status = 'FT';

    const compCode = m.competition?.code;
    const matchedLeague = LEAGUES.find((l) => l.footballDataCode === compCode);
    const league: LeagueInfo = matchedLeague
      ? {
          ...matchedLeague,
          round: m.matchday ? `Matchday ${m.matchday}` : matchedLeague.round,
        }
      : {
          id: `fd-lg-${compCode || m.competition?.id || idx}`,
          footballDataCode: compCode,
          name: m.competition?.name || 'Competition',
          country: m.area?.name || 'International',
          countryCode: m.area?.code || 'INT',
          round: m.matchday ? `Matchday ${m.matchday}` : 'Regular Season',
          primaryColor: '#0ea5e9',
          badgeText: compCode || 'FD',
        };

    const homeName = m.homeTeam?.shortName || m.homeTeam?.name || 'Home';
    const awayName = m.awayTeam?.shortName || m.awayTeam?.name || 'Away';
    const homeFullName = m.homeTeam?.name || homeName;
    const awayFullName = m.awayTeam?.name || awayName;
    const homeCode = m.homeTeam?.tla || makeCode(homeName);
    const awayCode = m.awayTeam?.tla || makeCode(awayName);
    const [hPri, hSec] = hashColor(homeFullName);
    const [aPri, aSec] = hashColor(awayFullName);

    const homeScore = m.score?.fullTime?.home ?? 0;
    const awayScore = m.score?.fullTime?.away ?? 0;
    const minute =
      status === 'LIVE' ? 64 : status === 'HT' ? 45 : status === 'FT' ? 90 : undefined;
    const kickoffDate = m.utcDate ? new Date(m.utcDate) : new Date();
    const kickoffTime = kickoffDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const matchDateLabel = kickoffDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const homeXg =
      status === 'UPCOMING'
        ? 1.68
        : Number((homeScore * 0.78 + 0.48 + ((idx % 3) * 0.14)).toFixed(2));
    const awayXg =
      status === 'UPCOMING'
        ? 1.42
        : Number((awayScore * 0.78 + 0.38 + (((idx + 1) % 3) * 0.12)).toFixed(2));

    return {
      id: `fd-${m.id || idx}`,
      league,
      homeTeam: {
        id: `fd-h-${m.homeTeam?.id || idx}`,
        name: homeFullName,
        shortName: homeName,
        code: homeCode,
        primaryColor: hPri,
        secondaryColor: hSec,
        crestUrl: m.homeTeam?.crest || undefined,
        form: ['W', 'W', 'D', 'L', 'W'],
      },
      awayTeam: {
        id: `fd-a-${m.awayTeam?.id || idx}`,
        name: awayFullName,
        shortName: awayName,
        code: awayCode,
        primaryColor: aPri,
        secondaryColor: aSec,
        crestUrl: m.awayTeam?.crest || undefined,
        form: ['W', 'D', 'W', 'W', 'L'],
      },
      homeScore,
      awayScore,
      htHomeScore: m.score?.halfTime?.home ?? undefined,
      htAwayScore: m.score?.halfTime?.away ?? undefined,
      status,
      minute,
      kickoffTime,
      matchDateLabel,
      dateOffset,
      venue: m.venue || `${homeName} Stadium`,
      referee: m.referees?.[0]?.name || undefined,
      events:
        status === 'UPCOMING'
          ? []
          : buildSyntheticEvents(
              `fd-${m.id || idx}`,
              homeName,
              awayName,
              homeScore,
              awayScore,
              minute || 90
            ),
      stats: [
        { label: 'Ball Possession', home: 54, away: 46, unit: '%' },
        { label: 'Expected Goals (xG)', home: homeXg, away: awayXg, isDecimal: true },
        { label: 'Total Shots', home: homeScore * 3 + 7, away: awayScore * 3 + 5 },
        { label: 'Shots on Target', home: homeScore + 3, away: awayScore + 2 },
        { label: 'Corner Kicks', home: 6, away: 4 },
      ],
      momentum:
        status === 'UPCOMING'
          ? []
          : buildSyntheticMomentum(
              idx + 19,
              minute || 45,
              buildSyntheticEvents(
                `fd-${m.id || idx}`,
                homeName,
                awayName,
                homeScore,
                awayScore,
                minute || 90
              )
            ),
      lineups: {
        home: {
          formation: '4-3-3',
          coach: m.homeTeam?.coach?.name || 'Head Coach',
          startingXI: buildDefaultLineup(homeName, 'home'),
          substitutes: [],
        },
        away: {
          formation: '4-2-3-1',
          coach: m.awayTeam?.coach?.name || 'Head Coach',
          startingXI: buildDefaultLineup(awayName, 'away'),
          substitutes: [],
        },
      },
      livePitch:
        status === 'LIVE'
          ? {
              possession: 'home',
              statusText: 'Live Feed • Midfield Progression',
              ballX: 54,
              ballY: 42,
              trail: [
                { x: 42, y: 48 },
                { x: 54, y: 42 },
              ],
            }
          : undefined,
      tacticalPreview: buildTacticalPreviewForMatch({
        homeName: homeFullName,
        awayName: awayFullName,
        homeCode,
        awayCode,
        leagueName: league.name,
        status,
        homeScore,
        awayScore,
      }),
    };
  });

  const cachedAtIso = new Date().toISOString();
  if (normalized.length > 0) {
    matchesCache.set(cacheKey, {
      data: normalized,
      timestamp: now,
      cachedAtIso,
    });
  }

  return {
    matches: normalized,
    usedWindow,
    cacheMeta: {
      cached: false,
      cachedAt: cachedAtIso,
      ttlSeconds: MATCHES_CACHE_TTL_MS / 1000,
      provider: 'football-data',
      rateLimitNote: 'Fresh Football-Data.org v4 fetch • Cached for 3 hours (10 req/min safe)',
    },
  };
}

const LEAGUE_TO_FD_CODE: Record<string, string> = {
  epl: 'PL',
  laliga: 'PD',
  seriea: 'SA',
  bundesliga: 'BL1',
  ligue1: 'FL1',
  ucl: 'CL',
};

/**
 * Fetch League Standings from Football-Data.org v4 (/v4/competitions/{code}/standings)
 * Cached for 6 hours as recommended in football_niche_site_plan.txt.
 */
export async function fetchStandingsFromFootballDataOrg(
  apiKey: string,
  leagueKey: string,
  forceRefresh = false
): Promise<{ standings: StandingRow[]; cached: boolean; cachedAt: string; source: string }> {
  const compCode = LEAGUE_TO_FD_CODE[leagueKey] || 'PL';
  const cacheKey = `fd-standings:${compCode}`;
  const now = Date.now();
  const existing = standingsCache.get(cacheKey);

  if (!forceRefresh && existing && now - existing.timestamp < STANDINGS_CACHE_TTL_MS) {
    return {
      standings: existing.data,
      cached: true,
      cachedAt: existing.cachedAtIso,
      source: 'football-data-cache',
    };
  }

  if (!apiKey) {
    return {
      standings: STANDINGS_BY_LEAGUE[leagueKey] || STANDINGS_BY_LEAGUE.epl,
      cached: true,
      cachedAt: new Date().toISOString(),
      source: 'fallback-mock',
    };
  }

  const url = `https://api.football-data.org/v4/competitions/${compCode}/standings`;
  const res = await fetch(url, {
    headers: {
      'X-Auth-Token': apiKey,
    },
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    throw new Error(`Football-Data.org Standings HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const tableRaw: any[] =
    data.standings?.find((s: any) => s.type === 'TOTAL')?.table ||
    data.standings?.[0]?.table ||
    [];

  if (!Array.isArray(tableRaw) || tableRaw.length === 0) {
    return {
      standings: STANDINGS_BY_LEAGUE[leagueKey] || STANDINGS_BY_LEAGUE.epl,
      cached: false,
      cachedAt: new Date().toISOString(),
      source: 'fallback-empty',
    };
  }

  const rows: StandingRow[] = tableRaw.slice(0, 12).map((row: any, idx: number) => {
    const tName = row.team?.name || 'Club';
    const tShort = row.team?.shortName || tName;
    const tCode = row.team?.tla || makeCode(tShort);
    const [pri, sec] = hashColor(tName);
    const gf = row.goalsFor ?? 0;
    const ga = row.goalsAgainst ?? 0;
    const gd = gf - ga;
    const syntheticXgDiff = (gd * 0.85).toFixed(1);

    return {
      rank: row.position || idx + 1,
      team: {
        id: `fd-st-${row.team?.id || idx}`,
        name: tName,
        shortName: tShort,
        code: tCode,
        primaryColor: pri,
        secondaryColor: sec,
        crestUrl: row.team?.crest || undefined,
      },
      played: row.playedGames ?? 0,
      won: row.won ?? 0,
      drawn: row.draw ?? 0,
      lost: row.lost ?? 0,
      goalsFor: gf,
      goalsAgainst: ga,
      points: row.points ?? 0,
      form: parseFormString(row.form),
      xgDiff: `${Number(syntheticXgDiff) >= 0 ? '+' : ''}${syntheticXgDiff}`,
    };
  });

  const cachedAtIso = new Date().toISOString();
  standingsCache.set(cacheKey, {
    data: rows,
    timestamp: now,
    cachedAtIso,
  });

  return {
    standings: rows,
    cached: false,
    cachedAt: cachedAtIso,
    source: 'football-data-live',
  };
}
