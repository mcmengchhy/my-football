export type MatchStatus = 'LIVE' | 'HT' | 'FT' | 'UPCOMING';

export type ApiProvider = 'demo' | 'api-football' | 'football-data';

export interface ApiConfig {
  provider: ApiProvider;
  apiFootballKey: string;
  footballDataKey: string;
  autoRefreshSeconds: number;
}

export interface ApiCacheMeta {
  cached: boolean;
  cachedAt: string;
  ttlSeconds: number;
  provider: ApiProvider;
  rateLimitNote: string;
}

export interface LeagueInfo {
  id: string;
  apiFootballId?: number;
  footballDataCode?: string;
  name: string;
  country: string;
  countryCode: string;
  round: string;
  primaryColor: string;
  badgeText: string;
}

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  code: string;
  primaryColor: string;
  secondaryColor: string;
  textColor?: string;
  crestUrl?: string;
  form?: ('W' | 'D' | 'L')[];
}

export type EventType =
  | 'goal'
  | 'penalty'
  | 'own-goal'
  | 'yellow-card'
  | 'red-card'
  | 'sub'
  | 'var';

export interface MatchEvent {
  id: string;
  minute: number;
  addedTime?: number;
  team: 'home' | 'away';
  type: EventType;
  player: string;
  secondaryPlayer?: string; // Assist for goal, or Player Out for substitution
  detail?: string;
  scoreSnapshot?: string;
}

export interface StatPair {
  label: string;
  home: number;
  away: number;
  unit?: string;
  isDecimal?: boolean;
}

export interface MomentumPoint {
  minute: number;
  /** Positive (0 to 100) = Home dominance, Negative (-100 to 0) = Away dominance */
  value: number;
  event?: 'goal-home' | 'goal-away' | 'card-home' | 'card-away';
}

export interface LineupPlayer {
  id: string;
  number: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  /** X coordinate (0-100) across half-pitch width or full pitch */
  x: number;
  /** Y coordinate (0-100) across pitch height */
  y: number;
  rating: number;
  goals?: number;
  assists?: number;
  yellowCard?: boolean;
  redCard?: boolean;
  subbedOut?: number;
  subbedIn?: number;
  isCaptain?: boolean;
}

export interface TeamLineup {
  formation: string;
  coach: string;
  startingXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface LivePitchState {
  possession: 'home' | 'away';
  statusText: string; // e.g., "Dangerous Attack", "Midfield Possession", "Corner Kick", "Shot on Target"
  ballX: number; // 5 to 95 (left = home goal, right = away goal)
  ballY: number; // 10 to 90
  trail?: { x: number; y: number }[];
}

export interface TacticalBattle {
  title: string;
  homePlayer: string;
  awayPlayer: string;
  zone: string;
  analysis: string;
}

export interface TacticalPreview {
  headline: string;
  summary: string;
  homeTacticalStyle: string;
  awayTacticalStyle: string;
  keyBattles: TacticalBattle[];
  teamNews: {
    home: string[];
    away: string[];
  };
  h2h: {
    played: number;
    homeWins: number;
    draws: number;
    awayWins: number;
    avgGoals: number;
    avgXg: string;
  };
  verdict: {
    prediction: string;
    confidence: string;
    tacticalKey: string;
  };
}

export interface Match {
  id: string;
  league: LeagueInfo;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeScore: number;
  awayScore: number;
  htHomeScore?: number;
  htAwayScore?: number;
  status: MatchStatus;
  minute?: number;
  addedTime?: number;
  kickoffTime: string; // ISO string or HH:mm
  matchDateLabel?: string; // e.g. "Oct 30"
  dateOffset: number; // -1 = Yesterday, 0 = Today, 1 = Tomorrow
  venue: string;
  referee?: string;
  attendance?: string;
  events: MatchEvent[];
  stats: StatPair[];
  momentum: MomentumPoint[];
  lineups?: {
    home: TeamLineup;
    away: TeamLineup;
  };
  livePitch?: LivePitchState;
  tacticalPreview?: TacticalPreview;
}

export interface StandingRow {
  rank: number;
  team: TeamInfo;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  xgDiff?: string;
}

export type ContentPillar = 'timely' | 'evergreen' | 'data';

export type ArticleCategory =
  | 'Match Preview'
  | 'Post-Match Analysis'
  | 'Tactical Guide'
  | 'Player Profile'
  | 'Weekly Roundup'
  | 'Training & Coaching'
  | 'Best Of List';

export interface NicheArticle {
  id: string;
  slug: string;
  title: string;
  pillar: ContentPillar;
  category: ArticleCategory;
  leagueCode: string;
  readTime: string;
  publishedAt: string;
  seoKeyword: string;
  excerpt: string;
  keyTakeaways: string[];
  tacticalBoard: {
    formation: string;
    pressingStyle: string;
    keyZone: string;
  };
  contentSections: {
    heading: string;
    body: string;
  }[];
}

export interface GearReviewItem {
  id: string;
  name: string;
  category: 'Football Boots' | 'Club Kits' | 'Training Equipment' | 'Digital Guide';
  price: string;
  under150: boolean;
  rating: number;
  bestFor: string;
  seoKeyword: string;
  pros: string[];
  cons: string[];
  verdict: string;
  affiliateBadge: string;
  accentColor: string;
}
