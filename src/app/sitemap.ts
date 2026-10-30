import type { MetadataRoute } from 'next';
import { NICHE_ARTICLES } from '@/lib/niche-content';

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://my-football.vercel.app';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = NICHE_ARTICLES.map((article) => ({
    url: `${baseUrl}/guides/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: article.pillar === 'timely' ? 'daily' : 'weekly',
    priority: article.pillar === 'timely' ? 0.9 : 0.85,
  }));

  return [...staticRoutes, ...guideRoutes];
}

