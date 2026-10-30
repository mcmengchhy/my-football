import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NICHE_ARTICLES } from '@/lib/niche-content';
import { BrandLogo } from '@/components/BrandLogo';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NICHE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = NICHE_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Tactical Guide Not Found • PitchPulse',
    };
  }

  return {
    title: `${article.title} | PitchPulse Tactical Hub`,
    description: article.excerpt,
    keywords: [
      article.seoKeyword,
      article.category,
      article.tacticalBoard.formation,
      'football tactical analysis',
      'expected goals xG',
    ],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: new Date(article.publishedAt).toISOString(),
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = NICHE_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = NICHE_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: new Date(article.publishedAt).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'PitchPulse Tactical Analysis Desk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PitchPulse',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060b14] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070d19]/85 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo subtitle="Match Previews, 2D Pitch Radar, Tactical Breakdowns & xG Analytics" />
          </Link>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            Live Match Center
          </Link>
        </div>
      </header>

      {/* Main Article Content */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <article className="rounded-3xl border border-white/10 bg-[#0d1526]/95 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase">
                {article.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>
            <span className="text-xs text-slate-400">Published {article.publishedAt}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{article.excerpt}</p>
          </div>

          {/* Tactical Board Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/25">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Tactical Structure
              </div>
              <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                {article.tacticalBoard.formation}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Out-of-Possession Press
              </div>
              <div className="text-xs font-extrabold text-sky-400 mt-0.5">
                {article.tacticalBoard.pressingStyle}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Primary Pitch Zone
              </div>
              <div className="text-xs font-extrabold text-amber-300 mt-0.5">
                {article.tacticalBoard.keyZone}
              </div>
            </div>
          </div>

          {/* Executive Takeaways */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Key Tactical Takeaways
            </div>
            <ul className="space-y-2.5">
              {article.keyTakeaways.map((tk, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deep-Dive Content Sections */}
          <div className="space-y-6 pt-2">
            {article.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h2 className="text-lg font-extrabold text-white">{sec.heading}</h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{sec.body}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Related Tactical Guides */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              More Tactical Analysis &amp; Guides
            </h2>
            <Link href="/" className="text-xs font-bold text-emerald-400 hover:underline">
              Back to Live Match Center →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/guides/${rel.slug}`}
                className="p-4 rounded-2xl border border-white/10 bg-[#0d1526]/80 hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all space-y-2"
              >
                <span className="text-[10px] font-extrabold uppercase text-emerald-400">
                  {rel.category}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">{rel.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{rel.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

