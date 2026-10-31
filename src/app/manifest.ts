import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} • Live Football Scores, Match Previews & 2D Tactical Hub`,
    short_name: SITE_NAME,
    description:
      'Live European football scores, match previews, 3-2-5 tactical analysis, post-match reviews, interactive 2D pitch momentum radar, and official standings across the Top 5 European Leagues & Champions League.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060b14',
    theme_color: '#060b14',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

