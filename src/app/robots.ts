import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  let hostname = 'my-football-yusto.vercel.app';
  try {
    hostname = new URL(SITE_URL).host;
  } catch {
    // fallback
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    host: hostname,
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/key_sitemap.xml`,
    ],
  };
}
