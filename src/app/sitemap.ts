import type { MetadataRoute } from 'next';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import { SITE_URL } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = NICHE_ARTICLES.map((article) => ({
    url: `${SITE_URL}/guides/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: article.pillar === 'timely' ? 'daily' : 'weekly',
    priority: article.pillar === 'timely' ? 0.9 : 0.85,
  }));

  return [...staticRoutes, ...guideRoutes];
}
