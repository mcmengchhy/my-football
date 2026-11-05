import { NextResponse } from 'next/server';
import { TARGET_KEYWORDS } from '@/lib/keywords';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import { SITE_URL } from '@/lib/site-config';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour revalidation

export async function GET() {
  const nowIso = new Date().toISOString();

  // Root Keywords Directory Hub
  const hubItem = `  <url>
    <loc>${SITE_URL}/keywords</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`;

  // Dedicated Keyword Target Pages
  const keywordItems = TARGET_KEYWORDS.map((entry) => {
    return `  <url>
    <loc>${SITE_URL}/keywords/${entry.slug}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`;
  }).join('\n');

  // Deep-dive Tactical & Match Guides (high-intent keyword content)
  const guideItems = NICHE_ARTICLES.map((art) => {
    const publishedIso = new Date(art.publishedAt).toISOString();
    return `  <url>
    <loc>${SITE_URL}/guides/${art.slug}</loc>
    <lastmod>${publishedIso}</lastmod>
    <changefreq>${art.pillar === 'timely' ? 'daily' : 'weekly'}</changefreq>
    <priority>${art.pillar === 'timely' ? '0.90' : '0.85'}</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubItem}
${keywordItems}
${guideItems}
</urlset>`.trim();

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all',
    },
  });
}

