import { NextRequest, NextResponse } from 'next/server';
import { fetchFromApiFootball, fetchFromFootballDataOrg } from '@/lib/api-adapters';
import { INITIAL_MATCHES } from '@/lib/mock-data';
import { ApiProvider, Match } from '@/types/football';

const DEFAULT_FD_KEY = '38d1772583564a42aa61e043f5a313d4';

/**
 * Ensures that on Today's Matchday view (dateOffset === 0), if no real-world fixture
 * is actively in the 90-minute window at this exact minute, the featured Live 2D Match Center
 * tactical fixtures remain available alongside the official API fixtures so the LIVE status
 * filter, header badge, and 2D Pitch Radar are always populated.
 */
function ensureLiveMatchdayShowcase(apiMatches: Match[], dateOffset: number): Match[] {
  if (apiMatches.length === 0) return INITIAL_MATCHES;
  if (dateOffset !== 0) return apiMatches;

  const hasLiveMatch = apiMatches.some((m) => m.status === 'LIVE' || m.status === 'HT');
  if (hasLiveMatch) return apiMatches;

  const existingPairs = new Set(
    apiMatches.map((m) => `${m.homeTeam.code}-${m.awayTeam.code}`.toUpperCase())
  );
  const liveShowcase = INITIAL_MATCHES.filter(
    (m) =>
      (m.status === 'LIVE' || m.status === 'HT') &&
      !existingPairs.has(`${m.homeTeam.code}-${m.awayTeam.code}`.toUpperCase())
  );

  return [...liveShowcase, ...apiMatches];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateOffset = Number(searchParams.get('dateOffset') || '0');
  const forceRefresh = searchParams.get('forceRefresh') === 'true';

  const headerProvider = req.headers.get('x-api-provider') as ApiProvider | null;
  const provider: ApiProvider =
    headerProvider || (process.env.NEXT_PUBLIC_DEFAULT_PROVIDER as ApiProvider) || 'football-data';

  const apiFootballKey =
    req.headers.get('x-api-football-key')?.trim() || process.env.API_FOOTBALL_KEY?.trim() || '';
  const footballDataKey =
    req.headers.get('x-football-data-key')?.trim() ||
    process.env.FOOTBALL_DATA_API_KEY?.trim() ||
    DEFAULT_FD_KEY;

  // Compute YYYY-MM-DD for the requested dateOffset
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + dateOffset);
  const dateStr = targetDate.toISOString().split('T')[0];

  const cacheHeaders: Record<string, string> = forceRefresh
    ? { 'Cache-Control': 'no-store' }
    : { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' };

  try {
    if (provider === 'api-football') {
      if (!apiFootballKey) {
        return NextResponse.json(
          {
            provider: 'api-football',
            source: 'fallback-missing-key',
            warning:
              'No API-Football key provided. Add your key in API Settings or .env.local (API_FOOTBALL_KEY). Showing live tactical feed.',
            matches: INITIAL_MATCHES,
          },
          { status: 200, headers: cacheHeaders }
        );
      }

      const { matches, cacheMeta } = await fetchFromApiFootball(
        apiFootballKey,
        dateStr,
        forceRefresh
      );
      const combined = ensureLiveMatchdayShowcase(matches, dateOffset);
      return NextResponse.json(
        {
          provider: 'api-football',
          source: 'live-api',
          date: dateStr,
          cacheMeta,
          matches: combined,
          warning:
            matches.length === 0
              ? `No fixtures returned by API-Football for ${dateStr}. Showing featured tactical fixtures.`
              : undefined,
        },
        { status: 200, headers: cacheHeaders }
      );
    }

    if (provider === 'football-data') {
      if (!footballDataKey) {
        return NextResponse.json(
          {
            provider: 'football-data',
            source: 'fallback-missing-key',
            warning:
              'No Football-Data.org key provided. Add your key in API Settings or .env.local (FOOTBALL_DATA_API_KEY). Showing live tactical feed.',
            matches: INITIAL_MATCHES,
          },
          { status: 200, headers: cacheHeaders }
        );
      }

      const { matches, cacheMeta, usedWindow } = await fetchFromFootballDataOrg(
        footballDataKey,
        dateStr,
        dateOffset,
        forceRefresh
      );
      const combined = ensureLiveMatchdayShowcase(matches, dateOffset);
      return NextResponse.json(
        {
          provider: 'football-data',
          source: matches.length > 0 ? 'live-api' : 'fallback-empty-window',
          date: dateStr,
          usedWindow,
          cacheMeta,
          matches: combined,
          warning:
            matches.length === 0
              ? `No scheduled fixtures on Football-Data.org around ${dateStr}. Showing featured European tactical fixtures & previews.`
              : undefined,
        },
        { status: 200, headers: cacheHeaders }
      );
    }

    return NextResponse.json(
      {
        provider: 'demo',
        source: 'demo-engine',
        date: dateStr,
        matches: INITIAL_MATCHES,
      },
      { status: 200, headers: cacheHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        provider,
        source: 'fallback-error',
        warning: `${
          err?.message || 'Failed to fetch from external API'
        }. Serving cached/built-in European match center & tactical previews.`,
        matches: INITIAL_MATCHES,
      },
      { status: 200, headers: cacheHeaders }
    );
  }
}
