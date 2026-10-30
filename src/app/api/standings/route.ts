import { NextRequest, NextResponse } from 'next/server';
import { fetchStandingsFromFootballDataOrg } from '@/lib/api-adapters';
import { STANDINGS_BY_LEAGUE } from '@/lib/mock-data';

const DEFAULT_FD_KEY = '38d1772583564a42aa61e043f5a313d4';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get('league') || 'epl';
  const forceRefresh = searchParams.get('forceRefresh') === 'true';

  const footballDataKey =
    req.headers.get('x-football-data-key')?.trim() ||
    process.env.FOOTBALL_DATA_API_KEY?.trim() ||
    DEFAULT_FD_KEY;

  try {
    const result = await fetchStandingsFromFootballDataOrg(
      footballDataKey,
      league,
      forceRefresh
    );
    return NextResponse.json({
      league,
      standings: result.standings,
      cached: result.cached,
      cachedAt: result.cachedAt,
      source: result.source,
    });
  } catch (err: any) {
    return NextResponse.json({
      league,
      standings: STANDINGS_BY_LEAGUE[league] || STANDINGS_BY_LEAGUE.epl,
      cached: true,
      cachedAt: new Date().toISOString(),
      source: 'fallback-cache',
      warning: err?.message,
    });
  }
}

