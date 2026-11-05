import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TARGET_KEYWORDS } from '@/lib/keywords';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';
import { BrandLogo } from '@/components/BrandLogo';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Flame,
  HelpCircle,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Football Tactical & Keyword Search Index | PitchPulse Topics Hub',
  description:
    'Browse PitchPulse high-intent football topics, formations, tactical breakdowns, gear buying guides, and European scouting keywords.',
  alternates: {
    canonical: '/keywords',
  },
  openGraph: {
    title: 'Football Tactical & Keyword Search Index | PitchPulse Topics Hub',
    description:
      'Search index for football tactics, 3-2-5 formations, low blocks, xG analysis, and gear reviews.',
    url: `${SITE_URL}/keywords`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

export default function KeywordsIndexPage() {
  const categories = Array.from(
    new Set(TARGET_KEYWORDS.map((k) => k.category))
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'PitchPulse Football Topics & Keyword Directory',
    description: 'High-intent tactical football guides, match analyses, and gear guides.',
    url: `${SITE_URL}/keywords`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: TARGET_KEYWORDS.map((k, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: k.keyword,
        url: `${SITE_URL}/keywords/${k.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060b14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              Live Scores
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Tactical &amp; Search Index
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Football Keywords, Formations &amp; Tactical Blueprints
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Direct crawl index of modern positional concepts, expected goals breakdowns, set-piece mechanics, and football gear reviews. Designed for coaches, analysts, and passionate supporters.
          </p>
        </div>

        {/* CATEGORY MATRICES */}
        <div className="space-y-8">
          {categories.map((category) => {
            const items = TARGET_KEYWORDS.filter((k) => k.category === category);
            return (
              <section
                key={category}
                className="rounded-3xl border border-white/10 bg-[#0d1526]/80 backdrop-blur-xl p-6 sm:p-8 space-y-5 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    {category} Topics &amp; Keywords
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {items.length} indexed topics
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/keywords/${item.slug}`}
                      className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            {item.searchIntent} Intent
                          </span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3 text-sky-400" />
                            {item.faqs.length} FAQ Rich Snippet
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-400 border-t border-white/5">
                        <span className="text-slate-500 text-[11px] font-normal truncate max-w-[200px]">
                          Target: &quot;{item.keyword}&quot;
                        </span>
                        <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Explore Topic <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* FEATURED GUIDES CRAWLABLE STRIP */}
        <section className="rounded-3xl border border-white/10 bg-[#0d1526]/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Tactical Analysis &amp; Match Previews Library
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {NICHE_ARTICLES.map((art) => (
              <Link
                key={art.id}
                href={`/guides/${art.slug}`}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-xs text-slate-300 hover:text-white transition-all flex flex-col justify-between"
              >
                <span className="font-semibold text-emerald-400 text-[10px] uppercase mb-1">
                  {art.category}
                </span>
                <span className="font-bold line-clamp-2 leading-snug">{art.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

