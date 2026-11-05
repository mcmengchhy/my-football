import type { MetadataRoute } from 'next';
import { TARGET_KEYWORDS } from '@/lib/keywords';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import { SITE_URL } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/keywords`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ];

  // Dedicated Tactical Keyword Landing Pages
  const keywordRoutes: MetadataRoute.Sitemap = TARGET_KEYWORDS.map((entry) => ({
    url: `${SITE_URL}/keywords/${entry.slug}`,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  // Match & Tactical Guide Articles
  const guideRoutes: MetadataRoute.Sitemap = NICHE_ARTICLES.map((article) => ({
    url: `${SITE_URL}/guides/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: article.pillar === 'timely' ? 'daily' : 'weekly',
    priority: article.pillar === 'timely' ? 0.9 : 0.85,
  }));

  return [...staticRoutes, ...keywordRoutes, ...guideRoutes];
}
